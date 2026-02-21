import Link from "next/link";

const headerLinks = [
  { href: "/#comment-ca-marche", label: "Comment ca marche" },
  { href: "/#faq", label: "FAQ" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[color:var(--color-bg)]/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 md:min-h-[72px] md:px-8">
        <Link
          href="/"
          className="inline-flex items-center font-display font-semibold text-2xl tracking-wide text-[color:var(--color-primary)]"
        >
          🥩 cotalos.be
        </Link>
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-6 text-sm md:flex"
        >
          {headerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[color:var(--color-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <details className="group relative">
            <summary className="inline-flex h-9 w-14 cursor-pointer list-none items-center justify-center rounded-lg border border-black/15 bg-white text-[color:var(--color-primary)]">
              <span
                aria-hidden="true"
                className="text-[10px] font-semibold uppercase tracking-wide"
              >
                Menu
              </span>
              <span className="sr-only">Ouvrir le menu</span>
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-premium">
              <nav
                aria-label="Navigation mobile"
                className="flex flex-col gap-1"
              >
                {headerLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-3 py-2 text-sm hover:bg-[color:var(--color-primary)]/8"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
