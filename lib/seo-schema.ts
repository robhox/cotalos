import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface JsonLdListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export const serializeJsonLd = (value: object): string =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export const buildOrganizationJsonLd = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.siteUrl
});

export const buildWebsiteJsonLd = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.siteUrl,
  inLanguage: siteConfig.language
});

export const buildBreadcrumbJsonLd = (items: BreadcrumbItem[]): Record<string, unknown> => {
  const itemListElement: JsonLdListItem[] = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path)
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement
  };
};
