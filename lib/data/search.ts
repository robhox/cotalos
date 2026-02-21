import type { SearchIndexEntry } from "@/lib/types";

export const normalizeSearchValue = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const slugifyVille = (ville: string): string =>
  normalizeSearchValue(ville).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const QUICK_CITY_CANDIDATES = [
  "Bruxelles",
  "Liège",
  "Namur",
  "Charleroi",
  "Mons",
  "La Louvière"
] as const;

export const buildDefaultQuickCityEntries = (
  cities: Array<{ city: string; slug: string }>,
  limit = 6,
): SearchIndexEntry[] => {
  const safeLimit = Number.isFinite(limit)
    ? Math.min(Math.max(Math.floor(limit), 1), 20)
    : 6;
  const index = new Map<string, { city: string; slug: string }>();

  for (const city of cities) {
    const normalizedCity = normalizeSearchValue(city.city);
    if (!index.has(normalizedCity)) {
      index.set(normalizedCity, city);
    }
  }

  const selected: Array<{ city: string; slug: string }> = [];
  const seen = new Set<string>();

  for (const candidate of QUICK_CITY_CANDIDATES) {
    const city = index.get(normalizeSearchValue(candidate));
    if (!city) {
      continue;
    }
    const key = normalizeSearchValue(city.city);
    if (seen.has(key)) {
      continue;
    }
    selected.push(city);
    seen.add(key);
    if (selected.length >= safeLimit) {
      break;
    }
  }

  if (selected.length < safeLimit) {
    const alphabeticRemainder = [...cities].sort((a, b) =>
      a.city.localeCompare(b.city, "fr"),
    );
    for (const city of alphabeticRemainder) {
      const key = normalizeSearchValue(city.city);
      if (seen.has(key)) {
        continue;
      }
      selected.push(city);
      seen.add(key);
      if (selected.length >= safeLimit) {
        break;
      }
    }
  }

  return selected.slice(0, safeLimit).map((city) => ({
    type: "ville",
    label: city.city,
    targetPath: `/boucheries/${city.slug}`,
  }));
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

  if (startsWith) {
    return startsWith;
  }

  return (
    index.find((entry) => normalizeSearchValue(entry.label).includes(normalizedQuery)) ??
    null
  );
};
