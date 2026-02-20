import Link from "next/link";

import { SearchBox } from "@/components/search/search-box";
import { buildSearchIndex } from "@/lib/mock-data";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "cotalos.be - Commandez chez votre boucher local",
  description:
    "Trouvez une boucherie par ville, code postal ou nom de commerce. La commande en ligne arrive bientot.",
  path: "/"
});

const searchIndex = buildSearchIndex();

const steps = [
  {
    title: "1. Trouvez votre boucher",
    description: "Recherchez votre commerce local en quelques secondes."
  },
  {
    title: "2. Signalez votre interet",
    description: "Indiquez que vous souhaitez commander en ligne."
  },
  {
    title: "3. Soyez prevenu",
    description: "Recevez une notification des que le service est disponible."
  }
];

const faqItems = [
  {
    question: "Est-ce que la commande en ligne est deja disponible ?",
    answer:
      "Non. Nous informons les commerces de l interet des clients et les aidons a activer ce service."
  },
  {
    question: "Pourquoi mon boucher n apparait pas ?",
    answer: "Nous ajoutons progressivement tous les commerces."
  },
  {
    question: "Est-ce gratuit ?",
    answer: "Oui, c est gratuit pour les clients."
  }
];

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-28 top-20 h-72 w-72 rounded-full bg-[color:var(--color-accent)]/25 blur-3xl" />
        <div className="absolute -right-28 top-56 h-96 w-96 rounded-full bg-[color:var(--color-primary)]/12 blur-3xl" />
        <div className="absolute bottom-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/35 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl space-y-14 px-6 pb-6 pt-10 md:space-y-20 md:px-8 md:pb-12 md:pt-14">
        <section className="reveal relative overflow-hidden py-3 md:py-5">
          <div className="pointer-events-none absolute inset-0 opacity-55 [background-image:linear-gradient(to_right,rgba(107,27,40,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(107,27,40,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="relative grid gap-8 lg:items-start">
            <div className="space-y-7">
              <p className="inline-flex rounded-full border border-[color:var(--color-primary)]/25 bg-white/80 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                Annuaire des boucheries et traiteurs
              </p>

              <h1 className="max-w-3xl font-hero md:leading-tight text-4xl text-[color:var(--color-primary)] sm:text-5xl md:text-6xl">
                Commandez en ligne chez votre boucher ou traiteur
              </h1>

              <p className="max-w-2xl text-base leading-7 text-black/75 md:text-lg">
                Trouvez votre boucherie ou votre traiteur par ville, code postal
                ou son nom
              </p>

              <div className="p-2 sm:p-12">
                <SearchBox index={searchIndex} />
              </div>
            </div>
          </div>
        </section>

        <section
          id="comment-ca-marche"
          className="reveal space-y-6"
          style={{ animationDelay: "140ms" }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-[color:var(--color-primary)] md:text-4xl">
              Comment ca marche
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.title}
                className="group relative pl-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="absolute left-0 top-1 h-16 w-[3px] bg-[color:var(--color-accent)] transition-all duration-300 group-hover:h-24" />
                <h3 className="font-display text-2xl text-[color:var(--color-primary)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-black/75 md:text-base">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="commercants"
          className="reveal rounded-xl relative overflow-hidden bg-[color:var(--color-primary)] px-6 py-10 text-[color:var(--color-bg)] md:-mx-8 md:px-12 md:py-12"
          style={{ animationDelay: "220ms" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_88%_80%,rgba(194,168,120,0.35),transparent_42%)]" />
          <div className="relative grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
                Espace commercants
              </p>
              <h2 className="font-display text-3xl md:text-4xl">
                Vous etes boucher ou traiteur ?
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-bg)]/85 md:text-base">
                Activez la precommande en ligne, reduisez les appels repetitifs
                et simplifiez vos retraits en boutique.
              </p>
            </div>
            <div className="space-y-4 ml-auto">
              <Link
                href="/gerer-ou-supprimer-cette-fiche"
                className="inline-flex h-12 items-center rounded-xl bg-[color:var(--color-bg)] px-6 text-sm font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-bg)]/92"
                data-track="merchant_cta_click"
              >
                Prenez contact avec nous
              </Link>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="reveal space-y-5 pb-4"
          style={{ animationDelay: "260ms" }}
        >
          <h2 className="font-display text-3xl text-[color:var(--color-primary)] md:text-4xl">
            FAQ
          </h2>
          <div className="grid gap-1 md:grid-cols-1 md:gap-x-6">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="border-b border-black/12 py-4 md:col-span-1"
              >
                <summary className="cursor-pointer list-none pr-6 text-sm font-semibold text-[color:var(--color-primary)] md:text-base">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm leading-6 text-black/75">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
