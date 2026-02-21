import Link from "next/link";
import type { Metadata } from "next";

import { searchCommercesAndCities } from "@/lib/data/commerces";
import { normalizeSearchValue } from "@/lib/data/search";
import { buildMetadata } from "@/lib/seo";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  serializeJsonLd,
} from "@/lib/seo-schema";

interface SearchPageProps {
  searchParams?: Promise<{
    q?: string | string[];
  }>;
}

const SEARCH_PAGE_LIMIT = 24;

const pickSingleSearchParam = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value);

const normalizeQueryInput = (value: string | undefined): string =>
  (value ?? "").replace(/\s+/g, " ").trim();

const buildSearchPath = (query: string): string =>
  query ? `/recherche?q=${encodeURIComponent(query)}` : "/recherche";

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const resolvedSearchParams = await (searchParams ??
    Promise.resolve<{ q?: string | string[] }>({}));
  const query = normalizeQueryInput(pickSingleSearchParam(resolvedSearchParams.q));
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return buildMetadata({
      title: "Recherche de boucheries en Belgique | cotalos.be",
      description:
        "Consultez les resultats de recherche par ville, code postal ou nom de commerce.",
      path: "/recherche",
    });
  }

  return buildMetadata({
    title: `Resultats de recherche pour "${query}" | cotalos.be`,
    description: `Decouvrez les boucheries correspondant a la recherche "${query}".`,
    path: buildSearchPath(query),
  });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await (searchParams ??
    Promise.resolve<{ q?: string | string[] }>({}));
  const query = normalizeQueryInput(pickSingleSearchParam(resolvedSearchParams.q));
  const result = await searchCommercesAndCities(query, SEARCH_PAGE_LIMIT);
  const entries = result.ok ? result.data : [];
  const cityEntries = entries.filter((entry) => entry.type === "ville");
  const commerceEntries = entries.filter((entry) => entry.type === "commerce");
  const searchPath = buildSearchPath(query);
  const breadcrumbJsonLd = serializeJsonLd(
    buildBreadcrumbJsonLd([
      { name: "Accueil", path: "/" },
      { name: "Recherche", path: searchPath },
    ]),
  );
  const searchCollectionJsonLd =
    entries.length > 0
      ? serializeJsonLd(
          buildCollectionPageJsonLd({
            name: query ? `Resultats pour ${query}` : "Resultats de recherche",
            description: query
              ? `Resultats de recherche pour ${query}.`
              : "Resultats de recherche rapides.",
            path: searchPath,
            items: entries.map((entry) => ({
              name: entry.label,
              path: entry.targetPath,
            })),
          }),
        )
      : null;

  return (
    <div className="relative isolate overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      {searchCollectionJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: searchCollectionJsonLd }}
        />
      ) : null}

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
              {"Retour a l annuaire"}
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/65">
                {query ? "Recherche active" : "Recherche rapide"}
              </span>
              {query ? (
                <span className="inline-flex rounded-full border border-[color:var(--color-primary)]/20 bg-[color:var(--color-primary)]/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-primary)]/88">
                  {query}
                </span>
              ) : null}
            </div>

            <div className="md:flex gap-4">
              <div className="flex flex-col justify-center gap-8">
                <h1 className="max-w-4xl font-hero text-4xl leading-tight text-[color:var(--color-primary)] md:text-6xl md:leading-[1.06]">
                  {query ? `Resultats pour "${query}"` : "Recherches rapides"}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-black/75 md:text-base">
                  Consultez les fiches disponibles par ville ou commerce puis
                  ouvrez directement la page qui vous interesse.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-primary)]/18 bg-[color:var(--color-primary)] px-4 py-4 text-[color:var(--color-bg)] shadow-[0_14px_28px_rgba(107,27,40,0.18)] md:px-5 md:py-5">
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[color:var(--color-accent)]/32 blur-2xl" />
                <p className="relative text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]/95">
                  Resultats
                </p>
                <p className="relative mt-2 font-display text-5xl leading-none">
                  {entries.length}
                </p>
                <p className="relative mt-2 text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-bg)]/88">
                  elements trouves
                </p>
              </div>
            </div>
          </div>
        </header>

        <section
          className="reveal grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
          style={{ animationDelay: "100ms" }}
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-3xl text-[color:var(--color-primary)] md:text-4xl">
                {query ? "Correspondances" : "Selection rapide"}
              </h2>
              <p className="text-xs uppercase tracking-[0.16em] text-black/70">
                {entries.length} resultats
              </p>
            </div>

            {!result.ok ? (
              <p className="rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {result.error}
              </p>
            ) : null}

            {result.ok && entries.length === 0 ? (
              <p className="rounded-xl border border-dashed border-black/20 bg-white/70 px-4 py-3 text-sm text-black/60">
                Aucun resultat pour cette recherche. Essayez une autre ville ou
                un autre nom de commerce.
              </p>
            ) : null}

            {cityEntries.length > 0 ? (
              <section className="space-y-4">
                <div className="flex items-end justify-between gap-3">
                  <h3 className="font-display text-2xl text-[color:var(--color-primary)] md:text-3xl">
                    Villes
                  </h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-black/65">
                    {cityEntries.length}
                  </p>
                </div>
                <ul className="grid gap-4 md:grid-cols-2">
                  {cityEntries.map((entry) => (
                    <li key={`${entry.type}-${entry.targetPath}`}>
                      <Link
                        href={entry.targetPath}
                        className="group relative block h-full overflow-hidden rounded-2xl border border-[color:var(--color-primary)]/16 bg-[color:var(--color-surface)] p-5 shadow-[0_12px_28px_rgba(42,28,23,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-primary)]/30 hover:shadow-[0_18px_36px_rgba(42,28,23,0.08)]"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(194,168,120,0.12),transparent_46%)]" />
                        <div className="relative flex items-start gap-3">
                          <h4 className="font-display text-2xl leading-tight text-[color:var(--color-primary)]/95">
                            {entry.label}
                          </h4>
                        </div>
                        <p className="relative mt-4 text-sm leading-7 text-black/82">
                          Ouvrir toutes les boucheries referencees dans cette
                          ville.
                        </p>
                        <div className="relative mt-5 flex items-center justify-between border-t border-[color:var(--color-primary)]/14 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/80">
                          <span className="text-[color:var(--color-primary)]/90">
                            Voir les boucheries
                          </span>
                          <span className="rounded-full border border-[color:var(--color-primary)]/20 px-2 py-0.5 text-[10px] text-[color:var(--color-primary)]/78">
                            Ville
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {commerceEntries.length > 0 ? (
              <section className="space-y-4">
                <div className="flex items-end justify-between gap-3">
                  <h3 className="font-display text-2xl text-[color:var(--color-primary)] md:text-3xl">
                    Commerces
                  </h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-black/65">
                    {commerceEntries.length}
                  </p>
                </div>
                <ul className="grid gap-4 md:grid-cols-2">
                  {commerceEntries.map((entry) => (
                    <li key={`${entry.type}-${entry.targetPath}`}>
                      <Link
                        href={entry.targetPath}
                        className="group relative block h-full overflow-hidden rounded-2xl border border-[color:var(--color-primary)]/16 bg-[color:var(--color-surface)] p-5 shadow-[0_12px_28px_rgba(42,28,23,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-primary)]/30 hover:shadow-[0_18px_36px_rgba(42,28,23,0.08)]"
                      >
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(194,168,120,0.12),transparent_46%)]" />
                        <div className="relative flex items-start gap-3">
                          <h4 className="font-display text-2xl leading-tight text-[color:var(--color-primary)]/95">
                            {entry.label}
                          </h4>
                        </div>
                        <p className="relative mt-4 text-sm leading-7 text-black/82">
                          Ouvrir la fiche commerce pour consulter les details et
                          signaler votre interet.
                        </p>
                        <div className="relative mt-5 flex items-center justify-between border-t border-[color:var(--color-primary)]/14 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/80">
                          <span className="text-[color:var(--color-primary)]/90">
                            Voir la fiche
                          </span>
                          <span className="rounded-full border border-[color:var(--color-primary)]/20 px-2 py-0.5 text-[10px] text-[color:var(--color-primary)]/78">
                            Commerce
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <article className="rounded-2xl bg-[color:var(--color-primary)] p-6 text-[color:var(--color-bg)] shadow-premium">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
                Affiner la recherche
              </p>
              <h3 className="mt-3 font-display text-3xl">
                Nouvelle recherche
              </h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-bg)]/85">
                Ajustez ville, code postal ou nom du commerce.
              </p>

              <form action="/recherche" className="mt-5 space-y-3">
                <label htmlFor="search-page-input" className="sr-only">
                  Recherche
                </label>
                <input
                  id="search-page-input"
                  name="q"
                  type="search"
                  defaultValue={query}
                  placeholder="Ville, code postal ou commerce"
                  className="h-11 w-full rounded-xl border border-[color:var(--color-bg)]/30 bg-[color:var(--color-bg)]/95 px-4 text-sm text-[color:var(--color-primary)] outline-none placeholder:text-[color:var(--color-primary)]/55 focus:border-[color:var(--color-accent)] focus:ring-2 focus:ring-[color:var(--color-accent)]/30"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[color:var(--color-bg)] px-5 text-sm font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-bg)]/92"
                  style={{ color: "var(--color-primary)" }}
                >
                  Rechercher
                </button>
              </form>
            </article>

            <article className="rounded-2xl border border-black/10 bg-[color:var(--color-surface)] p-6">
              <h3 className="font-display text-2xl text-[color:var(--color-primary)]">
                Retour a l accueil
              </h3>
              <p className="mt-3 text-sm leading-6 text-black/75">
                Revenez a la page principale pour retrouver la recherche rapide
                et les villes populaires.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex h-11 items-center rounded-xl border border-black/20 bg-white px-5 text-sm font-semibold text-black/80 hover:border-[color:var(--color-primary)]/35"
              >
                Retour a l annuaire
              </Link>
            </article>
          </aside>
        </section>
      </section>
    </div>
  );
}
