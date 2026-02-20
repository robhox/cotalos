import type { CommerceRecord, SearchIndexEntry } from "@/lib/types";

export const commerces: CommerceRecord[] = [
  {
    id: "8cc182df-8e2a-4e24-bb59-224234f79f01",
    nom: "Boucherie Royale",
    slug: "boucherie-royale-bruxelles-centre",
    categorie: "boucherie",
    adresse: "Rue Royale 18",
    ville: "Bruxelles",
    codePostal: "1000",
    telephone: "+32 2 123 45 67"
  },
  {
    id: "13f2488b-2579-4ec4-96f5-74252cf1d8ef",
    nom: "Atelier Carnes Midi",
    slug: "atelier-carnes-midi-bruxelles",
    categorie: "charcuterie",
    adresse: "Boulevard du Midi 44",
    ville: "Bruxelles",
    codePostal: "1000"
  },
  {
    id: "556f7ee9-c0d8-4fc9-b4d9-a53bc6f5e693",
    nom: "Maison des Saveurs",
    slug: "maison-des-saveurs-ixelles",
    categorie: "traiteur",
    adresse: "Avenue Louise 141",
    ville: "Ixelles",
    codePostal: "1050",
    telephone: "+32 2 444 90 10"
  },
  {
    id: "7f7be712-a285-4dc3-be4c-d78615e56ec7",
    nom: "Boucherie du Parc",
    slug: "boucherie-du-parc-uccle",
    categorie: "boucherie",
    adresse: "Chaussee de Waterloo 812",
    ville: "Uccle",
    codePostal: "1180"
  },
  {
    id: "98ec6ca3-9ee2-4563-a8dd-0399617068ef",
    nom: "Comptoir des Halles",
    slug: "comptoir-des-halles-liege",
    categorie: "traiteur",
    adresse: "Place Saint-Lambert 6",
    ville: "Liege",
    codePostal: "4000",
    telephone: "+32 4 236 11 20"
  },
  {
    id: "f20e2afd-4280-4038-86ab-106d0f667d75",
    nom: "Boucherie Saint-Pierre",
    slug: "boucherie-saint-pierre-namur",
    categorie: "boucherie",
    adresse: "Rue de Fer 23",
    ville: "Namur",
    codePostal: "5000",
    telephone: "+32 81 21 33 55"
  },
  {
    id: "62b4a3df-b8df-4f2d-bfcc-0023f5905f51",
    nom: "Les Delices Flamands",
    slug: "les-delices-flamands-gand",
    categorie: "charcuterie",
    adresse: "Korenmarkt 17",
    ville: "Gand",
    codePostal: "9000"
  },
  {
    id: "7196615a-c180-439f-9f2b-13f2ff582c80",
    nom: "Maison du Terroir",
    slug: "maison-du-terroir-anvers",
    categorie: "traiteur",
    adresse: "Meir 88",
    ville: "Anvers",
    codePostal: "2000",
    telephone: "+32 3 777 44 21"
  },
  {
    id: "b0cbb9e8-29f1-49a9-a461-05987eb399f7",
    nom: "Boucherie des Quais",
    slug: "boucherie-des-quais-mons",
    categorie: "boucherie",
    adresse: "Rue de Nimy 54",
    ville: "Mons",
    codePostal: "7000"
  },
  {
    id: "3af3f054-7b13-4018-ab8a-2d8cf6a15033",
    nom: "Traiteur du Sablon",
    slug: "traiteur-du-sablon-bruxelles",
    categorie: "traiteur",
    adresse: "Rue du Grand Sablon 11",
    ville: "Bruxelles",
    codePostal: "1000"
  }
];

export const normalizeSearchValue = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const slugifyVille = (ville: string): string =>
  normalizeSearchValue(ville).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const getUniqueVilles = (): string[] => {
  return [...new Set(commerces.map((commerce) => commerce.ville))].sort((a, b) =>
    a.localeCompare(b, "fr")
  );
};

export const getPopularVilles = (): string[] => getUniqueVilles().slice(0, 6);

export const getCommercesByVille = (villeSlug: string): CommerceRecord[] => {
  return commerces
    .filter((commerce) => slugifyVille(commerce.ville) === villeSlug)
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
};

export const getCommerceBySlug = (slug: string): CommerceRecord | undefined => {
  return commerces.find((commerce) => commerce.slug === slug);
};

export const buildSearchIndex = (): SearchIndexEntry[] => {
  const cityEntries = getUniqueVilles().map((ville) => ({
    type: "ville" as const,
    label: ville,
    targetPath: `/boucheries/${slugifyVille(ville)}`
  }));

  const postalEntries = [
    ...new Map(commerces.map((commerce) => [commerce.codePostal, commerce.ville])).entries()
  ].map(([codePostal, ville]) => ({
    type: "ville" as const,
    label: `${codePostal} ${ville}`,
    targetPath: `/boucheries/${slugifyVille(ville)}`
  }));

  const commerceEntries = commerces.map((commerce) => ({
    type: "commerce" as const,
    label: `${commerce.nom} (${commerce.ville})`,
    targetPath: `/boucherie/${commerce.slug}`
  }));

  return [...cityEntries, ...postalEntries, ...commerceEntries];
};

export const resolveSearchTarget = (
  query: string,
  index: SearchIndexEntry[]
): SearchIndexEntry | null => {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) {
    return null;
  }

  const exact = index.find((entry) => normalizeSearchValue(entry.label) === normalizedQuery);
  if (exact) {
    return exact;
  }

  const startsWith = index.find((entry) =>
    normalizeSearchValue(entry.label).startsWith(normalizedQuery)
  );

  return startsWith ?? null;
};
