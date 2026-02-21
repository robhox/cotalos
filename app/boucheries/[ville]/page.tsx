import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCommercesByCitySlug } from "@/lib/data/commerces";
import { buildMetadata } from "@/lib/seo";

interface VillePageProps {
  params: Promise<{
    ville: string;
  }>;
}

export async function generateMetadata({ params }: VillePageProps): Promise<Metadata> {
  const { ville: villeParam } = await params;
  const result = await getCommercesByCitySlug(villeParam);

  if (!result.ok) {
    return buildMetadata({
      title: "Base indisponible - cotalos.be",
      description: result.error,
      path: `/boucheries/${villeParam}`
    });
  }

  if (!result.data) {
    return buildMetadata({
      title: "Ville introuvable - cotalos.be",
      description: "La ville demandee n est pas disponible.",
      path: `/boucheries/${villeParam}`
    });
  }

  return buildMetadata({
    title: `Boucheries et traiteurs a ${result.data.city} - cotalos.be`,
    description: `Decouvrez les commerces de bouche references a ${result.data.city}. Service de precommande non actif pour le moment.`,
    path: `/boucheries/${villeParam}`
  });
}

export default async function VillePage({ params }: VillePageProps) {
  const { ville: villeParam } = await params;
  const result = await getCommercesByCitySlug(villeParam);

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

  if (!result.data) {
    notFound();
  }

  const { city, commerces } = result.data;

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-20">
      <header className="reveal mb-8 space-y-3">
        <h1 className="font-display text-4xl text-[color:var(--color-primary)] md:text-5xl">
          {city}
        </h1>
        <p className="max-w-3xl text-black/70">
          Liste locale de boucheries, charcuteries et traiteurs.
        </p>
      </header>

      <ul className="reveal grid gap-3">
        {commerces.map((commerce) => (
          <li key={commerce.id}>
            <Link
              href={`/boucherie/${commerce.slug}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-black/10 bg-[color:var(--color-surface)] px-5 py-4 hover:border-[color:var(--color-primary)]/45"
            >
              <span className="font-medium">{commerce.nom}</span>
              <span className="text-sm uppercase tracking-wide text-black/55">
                {commerce.categorie}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
