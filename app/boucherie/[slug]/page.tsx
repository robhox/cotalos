import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalDisclaimer } from "@/components/legal-disclaimer";
import { commerces, getCommerceBySlug } from "@/lib/mock-data";
import { buildMetadata } from "@/lib/seo";

interface CommercePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const categoryLabel: Record<string, string> = {
  boucherie: "Boucherie",
  charcuterie: "Charcuterie",
  traiteur: "Traiteur"
};

export function generateStaticParams(): Array<{ slug: string }> {
  return commerces.map((commerce) => ({ slug: commerce.slug }));
}

export async function generateMetadata({ params }: CommercePageProps): Promise<Metadata> {
  const { slug } = await params;
  const commerce = getCommerceBySlug(slug);

  if (!commerce) {
    return buildMetadata({
      title: "Commerce introuvable - cotalos.be",
      description: "La fiche commerce recherchee est introuvable.",
      path: `/boucherie/${slug}`
    });
  }

  return buildMetadata({
    title: `${commerce.nom} - ${commerce.ville} | cotalos.be`,
    description: `Informations publiques de ${commerce.nom} a ${commerce.ville}. Service de precommande non encore actif.`,
    path: `/boucherie/${slug}`
  });
}

export default async function CommercePage({ params }: CommercePageProps) {
  const { slug } = await params;
  const commerce = getCommerceBySlug(slug);

  if (!commerce) {
    notFound();
  }

  const readableCategory = categoryLabel[commerce.categorie] ?? commerce.categorie;
  const sanitizedPhone = commerce.telephone?.replace(/\s+/g, "");

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

            <div className="flex flex-wrap gap-3 pt-1">
              {commerce.telephone ? (
                <a
                  href={`tel:${sanitizedPhone}`}
                  className="inline-flex h-11 items-center rounded-xl bg-[color:var(--color-primary)] px-5 text-sm font-semibold text-[color:var(--color-bg)] hover:bg-[color:var(--color-primary)]/92"
                >
                  Appeler le commerce
                </a>
              ) : null}
              <Link
                href="/gerer-ou-supprimer-cette-fiche"
                className="inline-flex h-11 items-center rounded-xl border border-black/15 bg-white px-5 text-sm font-semibold text-black/80 hover:border-[color:var(--color-primary)]/35 hover:text-[color:var(--color-primary)]"
              >
                Mettre a jour cette fiche
              </Link>
            </div>
          </div>
        </header>

        <section
          className="reveal grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]"
          style={{ animationDelay: "90ms" }}
        >
          <div className="space-y-6">
            <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-premium md:p-8">
              <h2 className="font-display text-3xl text-[color:var(--color-primary)]">Etat du service</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-black/75 md:text-base">
                La precommande n est pas encore active pour ce commerce sur cotalos.be. Nous mesurons l interet des clients pour prioriser l activation de la commande en ligne.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[color:var(--color-primary)] px-5 text-sm font-semibold text-[color:var(--color-bg)] hover:bg-[color:var(--color-primary)]/92"
                >
                  Etre prevenu de l ouverture
                </button>
                <Link
                  href="/gerer-ou-supprimer-cette-fiche"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-black/20 bg-[color:var(--color-surface)] px-5 text-sm font-semibold text-black/80 hover:border-[color:var(--color-primary)]/35"
                >
                  Je suis le commercant
                </Link>
              </div>
            </article>

            <article className="rounded-2xl border border-black/10 bg-[color:var(--color-surface)] p-6 md:p-8">
              <h2 className="font-display text-3xl text-[color:var(--color-primary)]">Informations publiques</h2>
              <dl className="mt-5 grid gap-4 text-sm text-black/75 sm:grid-cols-2 md:text-base">
                <div className="rounded-xl border border-black/8 bg-white/85 p-4">
                  <dt className="text-xs uppercase tracking-[0.14em] text-black/55">Categorie</dt>
                  <dd className="mt-1 font-semibold text-[color:var(--color-primary)]">{readableCategory}</dd>
                </div>
                <div className="rounded-xl border border-black/8 bg-white/85 p-4">
                  <dt className="text-xs uppercase tracking-[0.14em] text-black/55">Ville</dt>
                  <dd className="mt-1 font-semibold text-[color:var(--color-primary)]">{commerce.ville}</dd>
                </div>
                <div className="rounded-xl border border-black/8 bg-white/85 p-4">
                  <dt className="text-xs uppercase tracking-[0.14em] text-black/55">Adresse</dt>
                  <dd className="mt-1">{commerce.adresse}</dd>
                </div>
                <div className="rounded-xl border border-black/8 bg-white/85 p-4">
                  <dt className="text-xs uppercase tracking-[0.14em] text-black/55">Code postal</dt>
                  <dd className="mt-1">{commerce.codePostal}</dd>
                </div>
                <div className="rounded-xl border border-black/8 bg-white/85 p-4 sm:col-span-2">
                  <dt className="text-xs uppercase tracking-[0.14em] text-black/55">Telephone</dt>
                  <dd className="mt-1 font-medium">
                    {commerce.telephone ?? "Non communique dans les donnees publiques"}
                  </dd>
                </div>
              </dl>
            </article>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl bg-[color:var(--color-primary)] p-6 text-[color:var(--color-bg)] shadow-premium">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-accent)]">Pour le commerce</p>
              <h3 className="mt-3 font-display text-3xl">Passez a la precommande</h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-bg)]/85">
                Activez votre fiche, simplifiez les prises de commandes et preparez les retraits en boutique.
              </p>
              <Link
                href="/gerer-ou-supprimer-cette-fiche"
                className="mt-5 inline-flex h-11 items-center rounded-xl bg-[color:var(--color-bg)] px-5 text-sm font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-bg)]/92"
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
