import { LegalPageLayout } from "@/components/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Politique de confidentialite - cotalos.be",
  description: "Politique RGPD du MVP cotalos.be: finalites, base legale, duree de conservation et droits des personnes.",
  path: "/politique-confidentialite"
});

export default function PolitiqueConfidentialitePage() {
  const legal = siteConfig.legalIdentity;

  return (
    <LegalPageLayout
      title="Politique de confidentialite"
      lead="Cette politique explique comment les donnees personnelles sont traitees dans le cadre du MVP cotalos.be."
    >
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Responsable du traitement</h2>
        <p>{legal.editorName}</p>
        <p>Contact: {legal.contactEmail}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Finalites de traitement</h2>
        <p>Collecter des demandes d information sur la precommande en ligne a venir.</p>
        <p>Mesurer la demande locale par ville et par commerce.</p>
        <p>Permettre les demandes de correction ou suppression de fiche.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Base legale</h2>
        <p>Consentement explicite pour les leads clients.</p>
        <p>Interet legitime pour la publication d informations de contact professionnelles issues de donnees publiques.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Duree de conservation</h2>
        <p>Les leads sont conserves pour une duree proportionnee a la validation MVP, puis anonymises ou supprimes.</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Vos droits</h2>
        <p>Vous pouvez demander l acces, la rectification, la suppression ou la limitation du traitement.</p>
        <p>Adresse de contact: {legal.contactEmail}</p>
      </section>
    </LegalPageLayout>
  );
}
