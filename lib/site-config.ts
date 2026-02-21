import type { SiteConfig } from "@/lib/types";

export const siteConfig: SiteConfig = {
  name: "cotalos.be",
  siteUrl: "https://cotalos.be",
  language: "fr-BE",
  defaultTitle: "cotalos.be - Annuaire boucheries en Belgique",
  defaultDescription:
    "Trouvez un boucher proche de chez vous et passez commande en ligne.",
  defaultSocialImagePath: "/opengraph-image",
  staticPagesLastModified: "2026-02-01T00:00:00.000Z",
  legalIdentity: {
    editorName: "Société éditrice: SCEP Consulting",
    legalForm: "Forme legale: SRL",
    registrationNumber: "0782.289.360",
    contactEmail: "contact@cotalos.be",
    deletionRequestEmail: "contact@cotalos.be",
    deletionSlaBusinessDays: 30,
  },
};
