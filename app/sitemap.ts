import type { MetadataRoute } from "next";

import { listCitySitemapEntries, listCommerceSlugs } from "@/lib/data/commerces";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 21600;

const STATIC_PATHS = [
  "/",
  "/recherche",
  "/cookies",
  "/mentions-legales",
  "/politique-confidentialite",
  "/gerer-ou-supprimer-cette-fiche"
] as const;

const toAbsoluteUrl = (path: string): string => {
  if (path === "/") {
    return siteConfig.siteUrl;
  }
  return `${siteConfig.siteUrl}${path}`;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [citiesResult, commercesResult] = await Promise.all([
    listCitySitemapEntries(),
    listCommerceSlugs()
  ]);

  if (!citiesResult.ok) {
    throw new Error(`Unable to generate sitemap city entries: ${citiesResult.error}`);
  }

  if (!commercesResult.ok) {
    throw new Error(`Unable to generate sitemap commerce entries: ${commercesResult.error}`);
  }

  const staticLastModified = new Date(siteConfig.staticPagesLastModified);
  if (Number.isNaN(staticLastModified.getTime())) {
    throw new Error("siteConfig.staticPagesLastModified must be a valid ISO date.");
  }

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: toAbsoluteUrl(path),
    lastModified: staticLastModified,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.5
  }));

  entries.push(
    ...citiesResult.data.map((city) => ({
      url: toAbsoluteUrl(`/boucheries/${city.slug}`),
      lastModified: city.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }))
  );

  entries.push(
    ...commercesResult.data.map((commerce) => ({
      url: toAbsoluteUrl(`/boucherie/${commerce.slug}`),
      lastModified: commerce.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  );

  return entries;
}
