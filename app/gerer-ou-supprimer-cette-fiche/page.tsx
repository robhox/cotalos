import { LegalPageLayout } from "@/components/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Gerer ou supprimer cette fiche - cotalos.be",
  description: "Procedure officielle de correction ou suppression d une fiche commerce sur cotalos.be.",
  path: "/gerer-ou-supprimer-cette-fiche"
});

export default function GererOuSupprimerPage() {
  const legal = siteConfig.legalIdentity;

  return (
    <LegalPageLayout
      title="Gérer ou supprimer une fiche"
      lead="Vous représentez un commerce référencé ? Cette procédure vous permet de corriger ou retirer une fiche rapidement."
    >
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Canal de demande</h2>
        <p>Envoyez votre demande a l'adresse: {legal.deletionRequestEmail}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Informations à fournir</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Nom du commerce et ville.</li>
          <li>URL de la fiche concernée.</li>
          <li>Motif de la demande: correction ou suppression.</li>
          <li>
            Coordonnées professionnelles permettant de vérifier la légitimité.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Délai de traitement</h2>
        <p>
          Dossier traité sous {legal.deletionSlaBusinessDays} jours ouvrés
          maximum après vérification de la demande.
        </p>
      </section>
    </LegalPageLayout>
  );
}
