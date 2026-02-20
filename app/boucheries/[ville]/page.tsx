import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCommercesByVille, getUniqueVilles, slugifyVille } from "@/lib/mock-data";
import { buildMetadata } from "@/lib/seo";

interface VillePageProps {
  params: Promise<{
    ville: string;
  }>;
}

export function generateStaticParams(): Array<{ ville: string }> {
  return getUniqueVilles().map((ville) => ({ ville: slugifyVille(ville) }));
}

export async function generateMetadata({ params }: VillePageProps): Promise<Metadata> {
  const { ville: villeParam } = await params;
  const ville = getUniqueVilles().find((entry) => slugifyVille(entry) === villeParam);

  if (!ville) {
    return buildMetadata({
      title: "Ville introuvable - cotalos.be",
      description: "La ville demandee n est pas disponible.",
      path: `/boucheries/${villeParam}`
    });
  }

  return buildMetadata({
    title: `Boucheries et traiteurs a ${ville} - cotalos.be`,
    description: `Decouvrez les commerces de bouche references a ${ville}. Service de precommande non actif pour le moment.`,
    path: `/boucheries/${villeParam}`
  });
}

export default async function VillePage({ params }: VillePageProps) {
  const { ville: villeParam } = await params;
  const ville = getUniqueVilles().find((entry) => slugifyVille(entry) === villeParam);

  if (!ville) {
    notFound();
  }

  const commerces = getCommercesByVille(villeParam);

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-20">
      <header className="reveal mb-8 space-y-3">
        <p className="text-sm uppercase tracking-wide text-black/60">Page ville</p>
        <h1 className="font-display text-4xl text-[color:var(--color-primary)] md:text-5xl">{ville}</h1>
        <p className="max-w-3xl text-black/70">
          Liste locale de boucheries, charcuteries et traiteurs. La commande en ligne n est pas encore disponible.
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
              <span className="text-sm uppercase tracking-wide text-black/55">{commerce.categorie}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
