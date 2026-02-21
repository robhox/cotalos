import type { MetadataRoute } from "next";

import { listCitySlugs, listCommerceSlugs } from "@/lib/data/commerces";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "/",
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
    listCitySlugs(),
    listCommerceSlugs()
  ]);

  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: toAbsoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.5
  }));

  if (citiesResult.ok) {
    entries.push(
      ...citiesResult.data.map((city) => ({
        url: toAbsoluteUrl(`/boucheries/${city.slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8
      }))
    );
  }

  if (commercesResult.ok) {
    entries.push(
      ...commercesResult.data.map((commerce) => ({
        url: toAbsoluteUrl(`/boucherie/${commerce.slug}`),
        lastModified: commerce.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7
      }))
    );
  }

  return entries;
}
