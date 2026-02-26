import Link from "next/link";
import type { Metadata } from "next";

import { listCitySlugs } from "@/lib/data/commerces";
import { buildMetadata } from "@/lib/seo";
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  serializeJsonLd
} from "@/lib/seo-schema";

export const metadata: Metadata = buildMetadata({
  title: "Toutes les villes - annuaire des boucheries | cotalos.be",
  description:
    "Explorez toutes les villes disponibles et accedez aux fiches des boucheries locales sur cotalos.be.",
  path: "/boucheries"
});

export default async function CitiesPage() {
  const result = await listCitySlugs();

  if (!result.ok) {
    throw new Error(`DB unavailable on /boucheries: ${result.error}`);
  }

  const cities = result.data;
  const breadcrumbJsonLd = serializeJsonLd(
    buildBreadcrumbJsonLd([
      { name: "Accueil", path: "/" },
      { name: "Toutes les villes", path: "/boucheries" }
    ])
  );
  const collectionJsonLd = serializeJsonLd(
    buildCollectionPageJsonLd({
      name: "Toutes les villes",
      description:
        "Index des villes disponibles sur cotalos.be pour trouver une boucherie locale.",
      path: "/boucheries",
      items: cities.map((city) => ({
        name: city.city,
        path: `/boucheries/${city.slug}`
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
        dangerouslySetInnerHTML={{ __html: collectionJsonLd }}
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
              Retour a l annuaire
            </Link>

            <div className="md:flex gap-4">
              <div className="flex flex-col justify-center gap-8">
                <h1 className="max-w-4xl font-hero text-4xl leading-tight text-[color:var(--color-primary)] md:text-6xl md:leading-[1.06]">
                  Toutes les villes
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-black/75 md:text-base">
                  Parcourez l index complet des villes referencees pour acceder
                  rapidement aux fiches commerces.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-primary)]/18 bg-[color:var(--color-primary)] px-4 py-4 text-[color:var(--color-bg)] shadow-[0_14px_28px_rgba(107,27,40,0.18)] md:px-5 md:py-5">
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[color:var(--color-accent)]/32 blur-2xl" />
                <p className="relative text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-accent)]/95">
                  Villes disponibles
                </p>
                <p className="relative mt-2 font-display text-5xl leading-none">
                  {cities.length}
                </p>
                <p className="relative mt-2 text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-bg)]/88">
                  pages locales
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="reveal space-y-5" style={{ animationDelay: "120ms" }}>
          {cities.length === 0 ? (
            <p className="rounded-xl border border-dashed border-black/20 bg-white/70 px-4 py-3 text-sm text-black/60">
              Aucune ville disponible pour le moment.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/boucheries/${city.slug}`}
                    className="group flex h-full items-center justify-between rounded-xl border border-black/10 bg-white/75 px-4 py-3 text-sm font-semibold text-[color:var(--color-primary)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-primary)]/35 hover:bg-white"
                  >
                    <span>{city.city}</span>
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </div>
  );
}
