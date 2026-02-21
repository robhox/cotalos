import type { SearchIndexEntry } from "@/lib/types";

export const normalizeSearchValue = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const slugifyVille = (ville: string): string =>
  normalizeSearchValue(ville).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

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

  if (startsWith) {
    return startsWith;
  }

  return (
    index.find((entry) => normalizeSearchValue(entry.label).includes(normalizedQuery)) ??
    null
  );
};
