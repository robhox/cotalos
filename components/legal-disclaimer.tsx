import clsx from "clsx";

interface LegalDisclaimerProps {
  compact?: boolean;
}

export function LegalDisclaimer({ compact = false }: LegalDisclaimerProps) {
  return (
    <aside
      className={clsx(
        "rounded-xl border border-[color:var(--color-accent)]/55 bg-[color:var(--color-accent)]/20 p-4 text-sm leading-6 text-black/85",
        compact ? "" : "md:p-5"
      )}
      aria-label="Avertissement legal"
    >
      <p>
        Les informations affichees proviennent de donnees publiques. Cette fiche ne signifie pas une affiliation commerciale avec le commerce mentionne.
      </p>
    </aside>
  );
}
