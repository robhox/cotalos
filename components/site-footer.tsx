import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-[color:var(--color-footer)] text-[color:var(--color-bg)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 md:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <p className="font-display text-2xl text-[color:var(--color-accent)]">
              {siteConfig.name}
            </p>
            <p className="max-w-sm text-sm text-[color:var(--color-bg)]/80">
              Annuaire de boucheries locales belges.
            </p>
          </div>

          <nav aria-label="Service" className="space-y-3 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
              Service
            </p>
            <Link
              href="/"
              className="block hover:text-[color:var(--color-accent)]"
            >
              Accueil
            </Link>
            <Link
              href="/#comment-ca-marche"
              className="block hover:text-[color:var(--color-accent)]"
            >
              Comment ça marche
            </Link>
          </nav>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-2 lg:col-span-1">
            <nav aria-label="Commercants" className="space-y-3 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
                Commercants
              </p>
              <Link
                href="/#commercants"
                className="block hover:text-[color:var(--color-accent)]"
              >
                Activer le service
              </Link>
              <Link
                href="/gerer-ou-supprimer-cette-fiche"
                className="block hover:text-[color:var(--color-accent)]"
              >
                Contact
              </Link>
            </nav>

            <nav aria-label="Legal" className="space-y-3 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
                Legal
              </p>
              <Link
                href="/mentions-legales"
                className="block hover:text-[color:var(--color-accent)]"
              >
                Mentions legales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="block hover:text-[color:var(--color-accent)]"
              >
                Confidentialite
              </Link>
              <Link
                href="/cookies"
                className="block hover:text-[color:var(--color-accent)]"
              >
                Cookies
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-xs leading-relaxed text-[color:var(--color-bg)]/70 flex items-center justify-center gap-4">
          <p>
            Donnees issues de sources publiques. Ce site n est pas affilie aux
            commerces listes.
          </p>
        </div>
      </div>
    </footer>
  );
}
