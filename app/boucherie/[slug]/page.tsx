import Link from "next/link";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { LegalDisclaimer } from "@/components/legal-disclaimer";
import {
  countCommerceInterests,
  createCommerceInterest,
  getCommerceBySlug
} from "@/lib/data/commerces";
import { buildMetadata } from "@/lib/seo";
import { getPostHogClient } from "@/lib/posthog-server";

interface CommercePageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    interest?: string | string[];
  }>;
}

const categoryLabel: Record<string, string> = {
  boucherie: "Boucherie",
  charcuterie: "Charcuterie",
  traiteur: "Traiteur"
};

type InterestStatus = "success" | "duplicate" | "invalid" | "error";

const parseInterestStatus = (value: string | undefined): InterestStatus | null => {
  if (
    value === "success" ||
    value === "duplicate" ||
    value === "invalid" ||
    value === "error"
  ) {
    return value;
  }
  return null;
};

const pickSingleSearchParam = (
  value: string | string[] | undefined
): string | undefined => (Array.isArray(value) ? value[0] : value);

const getInterestFeedback = (
  status: InterestStatus | null
): { message: string; className: string } | null => {
  if (!status) {
    return null;
  }

  if (status === "success") {
    return {
      message:
        "Merci, votre intérêt a bien été enregistré pour cette boucherie.",
      className:
        "border-emerald-300/70 bg-emerald-50 text-emerald-900"
    };
  }

  if (status === "duplicate") {
    return {
      message: "Cet intérêt est déjà enregistré pour ce nom dans cette boucherie.",
      className:
        "border-amber-300/70 bg-amber-50 text-amber-900"
    };
  }

  if (status === "invalid") {
    return {
      message: "Entrez un nom et prénom valides (au moins 2 mots).",
      className:
        "border-amber-300/70 bg-amber-50 text-amber-900"
    };
  }

  return {
    message: "Impossible d'enregistrer votre intérêt pour le moment.",
    className:
      "border-rose-300/70 bg-rose-50 text-rose-900"
  };
};

export async function generateMetadata({ params }: CommercePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCommerceBySlug(slug);

  if (!result.ok) {
    return buildMetadata({
      title: "Base indisponible - cotalos.be",
      description: result.error,
      path: `/boucherie/${slug}`
    });
  }

  if (!result.data) {
    return buildMetadata({
      title: "Commerce introuvable - cotalos.be",
      description: "La fiche commerce recherchee est introuvable.",
      path: `/boucherie/${slug}`
    });
  }

  const commerce = result.data;

  return buildMetadata({
    title: `${commerce.nom} - ${commerce.ville} | cotalos.be`,
    description: `Informations publiques de ${commerce.nom} a ${commerce.ville}. Service de precommande non encore actif.`,
    path: `/boucherie/${slug}`
  });
}

export default async function CommercePage({
  params,
  searchParams
}: CommercePageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams ?? Promise.resolve<{ interest?: string | string[] }>({})
  ]);
  const result = await getCommerceBySlug(slug);

  if (!result.ok) {
    return (
      <section className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-20">
        <header className="mb-8 space-y-3">
          <h1 className="font-display text-4xl text-[color:var(--color-primary)] md:text-5xl">
            Base locale indisponible
          </h1>
          <p className="max-w-3xl text-black/70">{result.error}</p>
        </header>
      </section>
    );
  }

  const commerce = result.data;
  if (!commerce) {
    notFound();
  }

  const path = `/boucherie/${slug}`;
  const interestCountResult = await countCommerceInterests(commerce.id);
  const interestCount = interestCountResult.ok ? interestCountResult.data : 0;
  const interestLabel =
    interestCount === 1
      ? "1 personne a marqué son intérêt pour la commande en ligne dans cette boucherie."
      : `${interestCount} personnes ont marqué leur intérêt pour la commande en ligne dans cette boucherie.`;
  const interestStatus = parseInterestStatus(
    pickSingleSearchParam(resolvedSearchParams.interest)
  );
  const interestFeedback = getInterestFeedback(interestStatus);

  const submitInterest = async (formData: FormData) => {
    "use server";

    const redirectToStatus = (status: InterestStatus): never => {
      const params = new URLSearchParams();
      params.set("interest", status);
      redirect(`${path}?${params.toString()}`);
    };

    const rawFullName = formData.get("fullName");
    const fullName =
      typeof rawFullName === "string"
        ? rawFullName.replace(/\s+/g, " ").trim()
        : "";

    if (
      fullName.length < 3 ||
      fullName.length > 120 ||
      fullName.split(" ").filter(Boolean).length < 2
    ) {
      redirectToStatus("invalid");
    }

    const createResult = await createCommerceInterest({
      commerceId: commerce.id,
      fullName
    });

    if (!createResult.ok) {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: `server-${commerce.id}`,
        event: "interest_submission_failed",
        properties: {
          commerce_id: commerce.id,
          commerce_nom: commerce.nom,
          commerce_ville: commerce.ville,
          commerce_categorie: commerce.categorie,
          error: createResult.error,
        },
      });
      redirectToStatus("error");
      return;
    }

    const nextStatus: InterestStatus =
      createResult.data.status === "created" ? "success" : "duplicate";

    if (nextStatus === "success") {
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: `server-${commerce.id}`,
        event: "interest_submitted",
        properties: {
          commerce_id: commerce.id,
          commerce_nom: commerce.nom,
          commerce_ville: commerce.ville,
          commerce_categorie: commerce.categorie,
        },
      });
    }

    revalidatePath(path);
    redirectToStatus(nextStatus);
  };

  const readableCategory = categoryLabel[commerce.categorie] ?? commerce.categorie;

  // Track commerce page view server-side (top of interest conversion funnel)
  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: `server-pageview-${commerce.id}`,
    event: "commerce_page_viewed",
    properties: {
      commerce_id: commerce.id,
      commerce_nom: commerce.nom,
      commerce_ville: commerce.ville,
      commerce_categorie: commerce.categorie,
      interest_count: interestCount,
      $current_url: `https://cotalos.be${path}`,
    },
  });

  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[color:var(--color-accent)]/24 blur-3xl" />
        <div className="absolute -right-20 top-56 h-96 w-96 rounded-full bg-[color:var(--color-primary)]/12 blur-3xl" />
        <div className="absolute bottom-8 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
      </div>

      <section className="mx-auto w-full max-w-6xl space-y-10 px-6 pb-10 pt-10 md:px-8 md:pb-16 md:pt-14">
        <header className="reveal relative overflow-hidden rounded-2xl border border-black/10 bg-white/80 px-6 py-8 backdrop-blur-sm md:px-10 md:py-10">
          <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,rgba(107,27,40,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(107,27,40,0.07)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="relative space-y-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-primary)]/80 hover:text-[color:var(--color-primary)]"
            >
              <span aria-hidden="true">←</span>
              Retour a l annuaire
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-[color:var(--color-primary)]/25 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                Fiche commerce
              </span>
              <span className="inline-flex rounded-full border border-black/10 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/65">
                {readableCategory}
              </span>
            </div>

            <h1 className="max-w-4xl font-hero text-4xl leading-tight text-[color:var(--color-primary)] md:text-6xl md:leading-[1.06]">
              {commerce.nom}
            </h1>

            <p className="max-w-3xl text-base leading-7 text-black/80 md:text-lg">
              {commerce.adresse}, {commerce.codePostal} {commerce.ville}
            </p>
          </div>
        </header>

        <section
          className="reveal grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]"
          style={{ animationDelay: "90ms" }}
        >
          <div className="space-y-6">
            <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-premium md:p-8">
              <h2 className="font-display text-3xl text-[color:var(--color-primary)]">
                État du service
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-black/75 md:text-base">
                {
                  "La commande n'est pas encore active pour ce commerce sur cotalos.be 🥩 Nous mesurons l'interêt des clients pour prioriser l'activation de la commande en ligne."
                }
              </p>
              <div className="mt-6 overflow-hidden rounded-xl border border-[color:var(--color-primary)]/15 bg-[linear-gradient(140deg,rgba(255,255,255,0.96),rgba(255,252,249,0.84))] p-4 shadow-[0_14px_32px_rgba(107,27,40,0.08)] md:p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-primary)]/75">
                    Priorite d activation
                  </p>
                  <span className="inline-flex rounded-full border border-[color:var(--color-primary)]/20 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[color:var(--color-primary)]/85">
                    {interestCount}
                  </span>
                </div>

                <form
                  action={submitInterest}
                  className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-end"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="interest-full-name"
                      className="text-xs font-semibold uppercase tracking-[0.13em] text-[color:var(--color-primary)]/75"
                    >
                      Nom Prénom
                    </label>
                    <input
                      id="interest-full-name"
                      name="fullName"
                      type="text"
                      required
                      minLength={3}
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Ex. Camille Martin"
                      className="h-11 w-full rounded-xl border border-black/15 bg-white/92 px-4 text-sm text-black/85 outline-none transition-all placeholder:text-black/45 focus:border-[color:var(--color-primary)]/65 focus:bg-white focus:ring-2 focus:ring-[color:var(--color-primary)]/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--color-primary)] px-5 text-sm font-semibold text-[color:var(--color-bg)] shadow-[0_10px_24px_rgba(107,27,40,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--color-primary)]/92"
                  >
                    Marquer mon intérêt
                  </button>
                </form>

                <p className="mt-4 text-sm leading-6 text-black/75">
                  {interestLabel}
                </p>

                {interestFeedback ? (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`mt-3 rounded-xl border px-4 py-3 text-sm ${interestFeedback.className}`}
                  >
                    {interestFeedback.message}
                  </p>
                ) : null}

                {!interestCountResult.ok ? (
                  <p className="mt-3 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Compteur temporairement indisponible.
                  </p>
                ) : null}
              </div>
            </article>

            <article className="rounded-2xl border border-black/10 bg-[color:var(--color-surface)] p-6 md:p-8">
              <h2 className="font-display text-3xl text-[color:var(--color-primary)]">
                Informations publiques
              </h2>
              <dl className="mt-5 grid gap-4 text-sm text-black/75 sm:grid-cols-2 md:text-base">
                <div className="rounded-xl border border-black/8 bg-white/85 p-4">
                  <dt className="text-xs uppercase tracking-[0.14em] text-black/55">
                    Categorie
                  </dt>
                  <dd className="mt-1 font-semibold text-[color:var(--color-primary)]">
                    {readableCategory}
                  </dd>
                </div>
                <div className="rounded-xl border border-black/8 bg-white/85 p-4">
                  <dt className="text-xs uppercase tracking-[0.14em] text-black/55">
                    Ville
                  </dt>
                  <dd className="mt-1 font-semibold text-[color:var(--color-primary)]">
                    {commerce.ville}
                  </dd>
                </div>
                <div className="rounded-xl border border-black/8 bg-white/85 p-4">
                  <dt className="text-xs uppercase tracking-[0.14em] text-black/55">
                    Adresse
                  </dt>
                  <dd className="mt-1">{commerce.adresse}</dd>
                </div>
                <div className="rounded-xl border border-black/8 bg-white/85 p-4">
                  <dt className="text-xs uppercase tracking-[0.14em] text-black/55">
                    Code postal
                  </dt>
                  <dd className="mt-1">{commerce.codePostal}</dd>
                </div>
                <div className="rounded-xl border border-black/8 bg-white/85 p-4 sm:col-span-2">
                  <dt className="text-xs uppercase tracking-[0.14em] text-black/55">
                    Telephone
                  </dt>
                  <dd className="mt-1 font-medium">
                    {commerce.telephone ??
                      "Non communique dans les donnees publiques"}
                  </dd>
                </div>
              </dl>
            </article>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-[color:var(--color-primary)] p-6 text-[color:var(--color-bg)] shadow-premium">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
                Pour le commerce
              </p>
              <h3 className="mt-3 font-display text-3xl">
                Passez à la commande en ligne
              </h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-bg)]/85">
                Activez votre fiche, simplifiez les prises de commandes et
                préparez les retraits en boutique.
              </p>
              <Link
                href="/gerer-ou-supprimer-cette-fiche"
                className="mt-5 inline-flex h-11 w-full text-center justify-center items-center rounded-xl bg-[color:var(--color-bg)] px-5 text-sm font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-bg)]/92"
              >
                Contacter cotalos
              </Link>
            </div>

            <LegalDisclaimer />
          </aside>
        </section>
      </section>
    </div>
  );
}
