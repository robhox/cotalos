import type { ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  lead: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, lead, children }: LegalPageLayoutProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-14 md:px-8 md:py-20">
      <header className="reveal mb-10 space-y-3">
        <h1 className="font-display text-4xl text-[color:var(--color-primary)] md:text-5xl">{title}</h1>
        <p className="max-w-3xl text-base text-black/75 md:text-lg">{lead}</p>
      </header>
      <div className="reveal space-y-8 rounded-2xl border border-black/10 bg-[color:var(--color-surface)] p-6 shadow-premium md:p-8">
        {children}
      </div>
    </section>
  );
}
