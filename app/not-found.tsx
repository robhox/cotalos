import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm uppercase tracking-wide text-black/60">404</p>
      <h1 className="font-display text-4xl text-[color:var(--color-primary)]">Page introuvable</h1>
      <p className="max-w-xl text-black/70">La page demandee n existe pas ou a ete deplacee.</p>
      <Link
        href="/"
        className="rounded-lg bg-[color:var(--color-primary)] px-5 py-3 text-sm font-medium text-[#F7F3F1] hover:bg-[color:var(--color-primary)]/92"
      >
        Retour a l accueil
      </Link>
    </section>
  );
}
