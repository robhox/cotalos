import type { SiteConfig } from "@/lib/types";

export const siteConfig: SiteConfig = {
  name: "cotalos.be",
  siteUrl: "https://cotalos.be",
  language: "fr-BE",
  defaultTitle: "cotalos.be - Annuaire boucheries en Belgique",
  defaultDescription:
    "Trouvez un boucher proche de chez vous. La precommande en ligne n est pas encore active.",
  defaultSocialImagePath: "/opengraph-image",
  staticPagesLastModified: "2026-02-01T00:00:00.000Z",
  legalIdentity: {
    editorName: "[A REMPLACER] Societe editrice",
    legalForm: "[A REMPLACER] Forme legale",
    registrationNumber: "[A REMPLACER] BCE/KBO",
    vatNumber: "[A REMPLACER] TVA",
    address: "[A REMPLACER] Adresse siege social",
    contactEmail: "[A REMPLACER] contact@cotalos.be",
    hostName: "[A REMPLACER] Hebergeur",
    hostAddress: "[A REMPLACER] Adresse hebergeur",
    hostPhone: "[A REMPLACER] Telephone hebergeur",
    deletionRequestEmail: "[A REMPLACER] suppression@cotalos.be",
    deletionSlaBusinessDays: 10,
  },
};
