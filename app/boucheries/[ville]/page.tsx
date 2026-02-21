import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCommercesByCitySlug } from "@/lib/data/commerces";
import { buildMetadata } from "@/lib/seo";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  serializeJsonLd
} from "@/lib/seo-schema";

interface VillePageProps {
  params: Promise<{
    ville: string;
  }>;
}

export async function generateMetadata({
  params,
}: VillePageProps): Promise<Metadata> {
  const { ville: villeParam } = await params;
  const result = await getCommercesByCitySlug(villeParam);

  if (!result.ok) {
    return buildMetadata({
      title: "Base indisponible - cotalos.be",
      description: result.error,
      path: `/boucheries/${villeParam}`,
    });
  }

  if (!result.data) {
    return buildMetadata({
      title: "Ville introuvable - cotalos.be",
      description: "La ville demandee n est pas disponible.",
      path: `/boucheries/${villeParam}`,
    });
  }

  return buildMetadata({
    title: `Boucheries à ${result.data.city} - adresses et infos locales | cotalos.be`,
    description: `Annuaire des boucheries à ${result.data.city} : adresses, codes postaux et acces aux fiches commerces locales.`,
    path: `/boucheries/${villeParam}`,
  });
}

export default async function VillePage({ params }: VillePageProps) {
  const { ville: villeParam } = await params;
  const result = await getCommercesByCitySlug(villeParam);

  if (!result.ok) {
    throw new Error(
      `DB unavailable on /boucheries/${villeParam}: ${result.error}`,
    );
  }

  if (!result.data) {
    notFound();
  }

  const { city, commerces } = result.data;
  const cityPath = `/boucheries/${villeParam}`;
  const postalCodes = Array.from(
    new Set(commerces.map((commerce) => commerce.codePostal)),
  ).sort((a, b) => a.localeCompare(b, "fr"));
  const breadcrumbJsonLd = serializeJsonLd(
    buildBreadcrumbJsonLd([
      { name: "Accueil", path: "/" },
      { name: `Boucheries a ${city}`, path: cityPath },
    ]),
  );
  const cityCollectionJsonLd = serializeJsonLd(
    buildCollectionPageJsonLd({
      name: `Boucheries a ${city}`,
      description: `Annuaire local des boucheries a ${city}.`,
      path: cityPath,
      items: commerces.map((commerce) => ({
        name: commerce.nom,
        path: `/boucherie/${commerce.slug}`
      }))
    })
  );

  return (
    <div className="relative isolate overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: cityCollectionJsonLd }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-[color:var(--color-accent)]/24 blur-3xl" />
        <div className="absolute -right-20 top-56 h-96 w-96 rounded-full bg-[color:var(--color-primary)]/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
      </div>

      <section className="mx-auto w-full max-w-6xl space-y-8 px-6 pb-10 pt-10 md:space-y-10 md:px-8 md:pb-16 md:pt-14">
        <header className="reveal relative overflow-hidden rounded-[28px] border border-black/10 bg-white/80 px-6 py-8 backdrop-blur-sm md:px-10 md:py-10">
          <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,rgba(107,27,40,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(107,27,40,0.07)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="relative space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-primary)]/80 hover:text-[color:var(--color-primary)]"
            >
              <span aria-hidden="true">←</span>
              {"Retour à l'annuaire"}
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {postalCodes.map((codePostal) => (
                <span
                  key={codePostal}
                  className="inline-flex rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/65"
                >
                  {codePostal}
                </span>
              ))}
            </div>

            <div className="md:flex gap-4">
              <div className="flex flex-col justify-center gap-8">
                <h1 className="max-w-4xl font-hero text-4xl leading-tight text-[color:var(--color-primary)] md:text-6xl md:leading-[1.06]">
                  Boucheries à {city}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-black/75 md:text-base">
                  Trouvez une boucherie à {city} via notre annuaire local avec
                  adresses, codes postaux et acces direct a chaque fiche
                  commerce.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-primary)]/18 bg-[color:var(--color-primary)] px-4 py-4 text-[color:var(--color-bg)] shadow-[0_14px_28px_rgba(107,27,40,0.18)] md:px-5 md:py-5">
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[color:var(--color-accent)]/32 blur-2xl" />
                <p className="relative text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]/95">
                  Annuaire local
                </p>
                <p className="relative mt-2 font-display text-5xl leading-none">
                  {commerces.length}
                </p>
                <p className="relative mt-2 text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-bg)]/88">
                  boucheries referencees
                </p>
              </div>
            </div>
          </div>
        </header>

        <section
          className="reveal grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
          style={{ animationDelay: "100ms" }}
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-3xl text-[color:var(--color-primary)] md:text-4xl">
                Boucheries à {city}
              </h2>
              <p className="text-xs uppercase tracking-[0.16em] text-black/70">
                {commerces.length} resultats
              </p>
            </div>

            <ul className="grid gap-4 md:grid-cols-2">
              {commerces.map((commerce) => (
                <li key={commerce.id}>
                  <Link
                    href={`/boucherie/${commerce.slug}`}
                    className="group relative block h-full overflow-hidden rounded-2xl border border-[color:var(--color-primary)]/16 bg-[color:var(--color-surface)] p-5 shadow-[0_12px_28px_rgba(42,28,23,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-primary)]/30 hover:shadow-[0_18px_36px_rgba(42,28,23,0.08)]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(194,168,120,0.12),transparent_46%)]" />

                    <div className="relative flex items-start gap-3">
                      <h3 className="font-display text-2xl leading-tight text-[color:var(--color-primary)]/95">
                        {commerce.nom}
                      </h3>
                    </div>

                    <p className="relative mt-4 text-base leading-7 text-black/82">
                      {commerce.adresse}
                    </p>
                    <p className="relative text-base leading-7 text-black/82">
                      {commerce.codePostal} {commerce.ville}
                    </p>

                    <div className="relative mt-5 flex items-center justify-between border-t border-[color:var(--color-primary)]/14 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/80">
                      <span className="text-[color:var(--color-primary)]/90">
                        Voir la fiche
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-[color:var(--color-primary)]/90 transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <article className="rounded-2xl bg-[color:var(--color-primary)] p-6 text-[color:var(--color-bg)] shadow-premium">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
                Pour les commercants
              </p>
              <h3 className="mt-3 font-display text-3xl">
                Passez à la commande en ligne
              </h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-bg)]/85">
                Vous tenez un commerce a {city} ? Gagnez du temps sur les appels
                et structurez vos commandes avec la precommande en ligne.
              </p>
              <Link
                href="/gerer-ou-supprimer-cette-fiche"
                className="mt-5 inline-flex w-full justify-center h-11 items-center rounded-xl bg-[color:var(--color-bg)] px-5 text-sm font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-bg)]/92"
                style={{ color: "var(--color-primary)" }}
              >
                Contacter cotalos
              </Link>
            </article>

            <article className="rounded-2xl border border-black/10 bg-[color:var(--color-surface)] p-6">
              <h3 className="font-display text-2xl text-[color:var(--color-primary)]">
                Explorer d autres villes
              </h3>
              <p className="mt-3 text-sm leading-6 text-black/75">
                Revenez a la recherche globale pour trouver un commerce par nom,
                ville ou code postal.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex h-11 items-center rounded-xl border border-black/20 bg-white px-5 text-sm font-semibold text-black/80 hover:border-[color:var(--color-primary)]/35"
              >
                Nouvelle recherche
              </Link>
            </article>
          </aside>
        </section>
      </section>
    </div>
  );
}
