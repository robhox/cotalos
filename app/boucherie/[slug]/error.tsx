"use client";

import Link from "next/link";

interface CommercePageErrorProps {
  reset: () => void;
}

export default function CommercePageError({ reset }: CommercePageErrorProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-14 md:px-8 md:py-20">
      <article className="rounded-2xl border border-amber-300/60 bg-amber-50/70 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-900">
          Service temporairement indisponible
        </p>
        <h1 className="mt-3 font-display text-4xl text-[color:var(--color-primary)] md:text-5xl">
          Fiche commerce indisponible
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-black/75 md:text-base">
          Nous ne pouvons pas charger cette fiche pour le moment. Reessayez dans quelques instants.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center rounded-xl bg-[color:var(--color-primary)] px-5 text-sm font-semibold text-[color:var(--color-bg)] hover:bg-[color:var(--color-primary)]/92"
          >
            Reessayer
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-xl border border-black/20 bg-white px-5 text-sm font-semibold text-black/80 hover:border-[color:var(--color-primary)]/35"
          >
            Retour a l annuaire
          </Link>
        </div>
      </article>
    </section>
  );
}
