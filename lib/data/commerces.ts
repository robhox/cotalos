import { Prisma, type Commerce } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { buildDefaultQuickCityEntries, normalizeSearchValue, slugifyVille } from "@/lib/data/search";
import type { CommerceCategory, CommerceRecord, SearchIndexEntry } from "@/lib/types";

type QueryResult<T> = { ok: true; data: T } | { ok: false; error: string };
type CreateCommerceInterestStatus = "created" | "duplicate";

type CreateCommerceInterestInput = {
  commerceId: string;
  fullName: string;
};

type CreateCommerceInterestResult = {
  status: CreateCommerceInterestStatus;
  count: number;
};

type CityResult = {
  city: string;
  commerces: CommerceRecord[];
};

type DbSearchRow = Prisma.CommerceGetPayload<{
  select: { slug: true; name: true; city: true; postalCode: true };
}>;

const COMMERCE_SELECT = {
  id: true,
  name: true,
  slug: true,
  category: true,
  addressLine: true,
  city: true,
  postalCode: true,
  phone: true
} as const;

const DB_UNAVAILABLE_ERROR = "Base locale indisponible. Lancez PostgreSQL et relancez l import.";

const logDbError = (context: string, error: unknown): void => {
  const message = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(`[db:${context}] ${message}`);
};

const toCategory = (value: string): CommerceCategory => {
  if (value === "boucherie") {
    return value;
  }
  return "boucherie";
};

const toCommerceRecord = (
  row: Pick<Commerce, "id" | "name" | "slug" | "category" | "addressLine" | "city" | "postalCode" | "phone">
): CommerceRecord => ({
  id: row.id,
  nom: row.name,
  slug: row.slug,
  categorie: toCategory(row.category),
  adresse: row.addressLine,
  ville: row.city,
  codePostal: row.postalCode,
  telephone: row.phone ?? undefined
});

const rankByQuery = (label: string, normalizedQuery: string): number => {
  const normalizedLabel = normalizeSearchValue(label);
  if (!normalizedQuery) {
    return 0;
  }
  if (normalizedLabel.startsWith(normalizedQuery)) {
    return 0;
  }
  if (normalizedLabel.includes(normalizedQuery)) {
    return 1;
  }
  return 2;
};

const normalizeDisplayName = (input: string): string => input.replace(/\s+/g, " ").trim();

export const normalizeFullName = (input: string): string =>
  input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’`´]/g, "'")
    .replace(/[^a-z0-9'\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const getDatabaseStatus = async (): Promise<QueryResult<{ hasData: boolean }>> => {
  try {
    const first = await prisma.commerce.findFirst({
      select: { id: true }
    });

    return {
      ok: true,
      data: { hasData: Boolean(first) }
    };
  } catch (error) {
    logDbError("getDatabaseStatus", error);
    return {
      ok: false,
      error: DB_UNAVAILABLE_ERROR
    };
  }
};

export const getCommerceBySlug = async (
  slug: string
): Promise<QueryResult<CommerceRecord | null>> => {
  try {
    const row = await prisma.commerce.findUnique({
      where: { slug },
      select: COMMERCE_SELECT
    });

    return {
      ok: true,
      data: row ? toCommerceRecord(row) : null
    };
  } catch (error) {
    logDbError("getCommerceBySlug", error);
    return {
      ok: false,
      error: DB_UNAVAILABLE_ERROR
    };
  }
};

export const getCommercesByCitySlug = async (
  citySlug: string
): Promise<QueryResult<CityResult | null>> => {
  try {
    const rows = await prisma.commerce.findMany({
      select: COMMERCE_SELECT,
      orderBy: [{ city: "asc" }, { name: "asc" }]
    });

    const filtered = rows
      .filter((row) => slugifyVille(row.city) === citySlug)
      .map(toCommerceRecord);

    if (filtered.length === 0) {
      return { ok: true, data: null };
    }

    return {
      ok: true,
      data: {
        city: filtered[0].ville,
        commerces: filtered
      }
    };
  } catch (error) {
    logDbError("getCommercesByCitySlug", error);
    return {
      ok: false,
      error: DB_UNAVAILABLE_ERROR
    };
  }
};

export const listCitySlugs = async (): Promise<QueryResult<Array<{ city: string; slug: string }>>> => {
  try {
    const rows = await prisma.commerce.findMany({
      select: { city: true },
      distinct: ["city"]
    });

    const entries = rows
      .map((row) => ({ city: row.city, slug: slugifyVille(row.city) }))
      .sort((a, b) => a.city.localeCompare(b.city, "fr"));

    return { ok: true, data: entries };
  } catch (error) {
    logDbError("listCitySlugs", error);
    return {
      ok: false,
      error: DB_UNAVAILABLE_ERROR
    };
  }
};

export const listCitySitemapEntries = async (): Promise<
  QueryResult<Array<{ city: string; slug: string; updatedAt: Date }>>
> => {
  try {
    const rows = await prisma.commerce.findMany({
      select: {
        city: true,
        updatedAt: true,
      },
      orderBy: [{ city: "asc" }],
    });

    const latestByCity = new Map<
      string,
      { city: string; slug: string; updatedAt: Date }
    >();
    for (const row of rows) {
      const slug = slugifyVille(row.city);
      const existing = latestByCity.get(slug);
      if (!existing || row.updatedAt > existing.updatedAt) {
        latestByCity.set(slug, {
          city: row.city,
          slug,
          updatedAt: row.updatedAt,
        });
      }
    }

    const entries = Array.from(latestByCity.values()).sort((a, b) =>
      a.city.localeCompare(b.city, "fr"),
    );

    return { ok: true, data: entries };
  } catch (error) {
    logDbError("listCitySitemapEntries", error);
    return {
      ok: false,
      error: DB_UNAVAILABLE_ERROR,
    };
  }
};

export const listCommerceSlugs = async (): Promise<
  QueryResult<Array<{ slug: string; updatedAt: Date }>>
> => {
  try {
    const rows = await prisma.commerce.findMany({
      select: {
        slug: true,
        updatedAt: true
      },
      orderBy: [{ city: "asc" }, { name: "asc" }]
    });

    return { ok: true, data: rows };
  } catch (error) {
    logDbError("listCommerceSlugs", error);
    return {
      ok: false,
      error: DB_UNAVAILABLE_ERROR
    };
  }
};

const buildCitySearchEntries = (
  cities: Array<{ city: string; slug: string }>,
  normalizedQuery: string
): SearchIndexEntry[] => {
  const matches = cities
    .filter((entry) => {
      if (!normalizedQuery) {
        return true;
      }
      return normalizeSearchValue(entry.city).includes(normalizedQuery);
    })
    .sort((a, b) => {
      const rankDiff = rankByQuery(a.city, normalizedQuery) - rankByQuery(b.city, normalizedQuery);
      if (rankDiff !== 0) {
        return rankDiff;
      }
      return a.city.localeCompare(b.city, "fr");
    });

  return matches.map((entry) => ({
    type: "ville",
    label: entry.city,
    targetPath: `/boucheries/${entry.slug}`
  }));
};

const buildCommerceSearchEntries = (
  commerces: DbSearchRow[],
  normalizedQuery: string
): SearchIndexEntry[] => {
  const matches = commerces
    .filter((entry) => {
      if (!normalizedQuery) {
        return true;
      }
      const label = `${entry.name} ${entry.city} ${entry.postalCode}`;
      return (
        normalizeSearchValue(label).includes(normalizedQuery) ||
        normalizeSearchValue(entry.slug).includes(normalizedQuery)
      );
    })
    .sort((a, b) => {
      const rankDiff = rankByQuery(`${a.name} ${a.city}`, normalizedQuery) - rankByQuery(`${b.name} ${b.city}`, normalizedQuery);
      if (rankDiff !== 0) {
        return rankDiff;
      }
      return a.name.localeCompare(b.name, "fr");
    });

  return matches.map((entry) => ({
    type: "commerce",
    label: `${entry.name} (${entry.city})`,
    targetPath: `/boucherie/${entry.slug}`
  }));
};

export const searchCommercesAndCities = async (
  query: string,
  limit = 6
): Promise<QueryResult<SearchIndexEntry[]>> => {
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 20) : 6;
  const normalizedQuery = normalizeSearchValue(query);

  try {
    const citiesResult = await listCitySlugs();

    if (!citiesResult.ok) {
      return citiesResult;
    }

    if (!normalizedQuery) {
      return {
        ok: true,
        data: buildDefaultQuickCityEntries(citiesResult.data, safeLimit)
      };
    }

    const commerceRows = await prisma.commerce.findMany({
      select: {
        slug: true,
        name: true,
        city: true,
        postalCode: true
      }
    });

    const cityEntries = buildCitySearchEntries(citiesResult.data, normalizedQuery);
    const commerceEntries = buildCommerceSearchEntries(commerceRows, normalizedQuery);

    const entries: SearchIndexEntry[] = [];
    const cityTargetCount = Math.ceil(safeLimit / 2);
    const commerceTargetCount = safeLimit - cityTargetCount;

    entries.push(...cityEntries.slice(0, cityTargetCount));
    entries.push(...commerceEntries.slice(0, commerceTargetCount));

    if (entries.length < safeLimit) {
      const seen = new Set(entries.map((entry) => `${entry.type}:${entry.targetPath}`));
      for (const entry of [...cityEntries, ...commerceEntries]) {
        const key = `${entry.type}:${entry.targetPath}`;
        if (seen.has(key)) {
          continue;
        }
        entries.push(entry);
        seen.add(key);
        if (entries.length >= safeLimit) {
          break;
        }
      }
    }

    return {
      ok: true,
      data: entries
    };
  } catch (error) {
    logDbError("searchCommercesAndCities", error);
    return {
      ok: false,
      error: DB_UNAVAILABLE_ERROR
    };
  }
};

export const countCommerceInterests = async (
  commerceId: string
): Promise<QueryResult<number>> => {
  try {
    const count = await prisma.commerceInterest.count({
      where: { commerceId }
    });

    return { ok: true, data: count };
  } catch (error) {
    logDbError("countCommerceInterests", error);
    return {
      ok: false,
      error: DB_UNAVAILABLE_ERROR
    };
  }
};

export const createCommerceInterest = async (
  input: CreateCommerceInterestInput
): Promise<QueryResult<CreateCommerceInterestResult>> => {
  const fullName = normalizeDisplayName(input.fullName);
  const fullNameNormalized = normalizeFullName(fullName);

  if (!fullName || !fullNameNormalized) {
    return {
      ok: false,
      error: "Nom invalide."
    };
  }

  try {
    await prisma.commerceInterest.create({
      data: {
        fullName,
        fullNameNormalized,
        commerceId: input.commerceId
      }
    });

    const countResult = await countCommerceInterests(input.commerceId);
    if (!countResult.ok) {
      return countResult;
    }

    return {
      ok: true,
      data: {
        status: "created",
        count: countResult.data
      }
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const countResult = await countCommerceInterests(input.commerceId);
      if (!countResult.ok) {
        return countResult;
      }

      return {
        ok: true,
        data: {
          status: "duplicate",
          count: countResult.data
        }
      };
    }

    logDbError("createCommerceInterest", error);
    return {
      ok: false,
      error: DB_UNAVAILABLE_ERROR
    };
  }
};
