import { LegalPageLayout } from "@/components/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Mentions legales - cotalos.be",
  description:
    "Informations legales de l annuaire cotalos.be, statut de donnees publiques et cadre de non-affiliation.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  const legal = siteConfig.legalIdentity;

  return (
    <LegalPageLayout
      title="Mentions legales"
      lead="Cette page presente les informations legales minimales de l editeur et les regles de publication des fiches commerces."
    >
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Editeur du site</h2>
        <p>{legal.editorName}</p>
        <p>{legal.legalForm}</p>
        <p>Numero d entreprise: {legal.registrationNumber}</p>
        <p>Email: {legal.contactEmail}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">
          Cadre annuaire et non-affiliation
        </h2>
        <p>Les fiches sont alimentees a partir de donnees publiques.</p>
        <p>
          La presence d un commerce dans l annuaire ne constitue aucune
          affiliation commerciale avec cotalos.be.
        </p>
        <p>
          cotalos.be ne propose pas encore de service de commande en ligne
          active ni de paiement.
        </p>
      </section>
    </LegalPageLayout>
  );
}
