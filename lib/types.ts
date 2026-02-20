export type CommerceCategory = "boucherie" | "traiteur" | "charcuterie";

export interface LegalIdentity {
  editorName: string;
  legalForm: string;
  registrationNumber: string;
  vatNumber: string;
  address: string;
  contactEmail: string;
  hostName: string;
  hostAddress: string;
  hostPhone: string;
  deletionRequestEmail: string;
  deletionSlaBusinessDays: number;
}

export interface SiteConfig {
  name: string;
  siteUrl: string;
  language: "fr-BE";
  defaultTitle: string;
  defaultDescription: string;
  legalIdentity: LegalIdentity;
}

export interface CommerceRecord {
  id: string;
  nom: string;
  slug: string;
  categorie: CommerceCategory;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone?: string;
}

export interface SearchIndexEntry {
  type: "ville" | "commerce";
  label: string;
  targetPath: string;
}
