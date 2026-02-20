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

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-14 md:px-10 md:py-20">
      <header className="reveal mb-7 space-y-4">
        <p className="text-xs uppercase tracking-[0.2em] text-black/55">Fiche commerce</p>
        <h1 className="font-display text-4xl text-[color:var(--color-primary)] md:text-5xl">{commerce.nom}</h1>
        <p className="text-black/75">
          {commerce.adresse}, {commerce.codePostal} {commerce.ville}
        </p>
        {commerce.telephone ? <p className="text-black/75">Telephone: {commerce.telephone}</p> : null}
      </header>

      <div className="mb-6">
        <LegalDisclaimer />
      </div>

      <section className="reveal mb-8 rounded-2xl border border-black/10 bg-[color:var(--color-surface)] p-6 shadow-premium md:p-8">
        <h2 className="mb-3 text-xl font-semibold">Commande en ligne non active</h2>
        <p className="mb-5 max-w-3xl text-black/75">
          Ce commerce n a pas encore active la precommande sur cotalos.be. Vous pourrez bientot laisser votre email pour etre prevenu.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-lg bg-[color:var(--color-primary)] px-5 py-3 text-sm font-medium text-[#F7F3F1] hover:bg-[color:var(--color-primary)]/92"
          >
            Etre prevenu de l ouverture
          </button>
          <Link
            href="/gerer-ou-supprimer-cette-fiche"
            className="rounded-lg border border-black/20 bg-white px-5 py-3 text-sm font-medium hover:border-[color:var(--color-primary)]/45"
          >
            Activer la commande en ligne
          </Link>
        </div>
      </section>

      <section className="reveal mb-8 rounded-2xl border border-black/10 bg-white p-6 md:p-8">
        <h2 className="mb-3 text-xl font-semibold">Informations publiques</h2>
        <dl className="grid gap-2 text-sm text-black/75 md:grid-cols-2">
          <div>
            <dt className="font-medium text-black">Categorie</dt>
            <dd className="uppercase tracking-wide">{commerce.categorie}</dd>
          </div>
          <div>
            <dt className="font-medium text-black">Ville</dt>
            <dd>{commerce.ville}</dd>
          </div>
          <div>
            <dt className="font-medium text-black">Adresse</dt>
            <dd>{commerce.adresse}</dd>
          </div>
          <div>
            <dt className="font-medium text-black">Code postal</dt>
            <dd>{commerce.codePostal}</dd>
          </div>
        </dl>
      </section>

      <LegalDisclaimer compact />
    </section>
  );
}
