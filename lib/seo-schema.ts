import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface CollectionPageItem {
  name: string;
  path: string;
}

interface BuildCollectionPageJsonLdInput {
  name: string;
  description: string;
  path: string;
  items: CollectionPageItem[];
  maxItems?: number;
}

interface BuildLocalBusinessJsonLdInput {
  name: string;
  path: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  phone?: string;
}

interface JsonLdListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

const DEFAULT_COLLECTION_PAGE_ITEM_LIMIT = 50;

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

export const buildCollectionPageJsonLd = ({
  name,
  description,
  path,
  items,
  maxItems = DEFAULT_COLLECTION_PAGE_ITEM_LIMIT
}: BuildCollectionPageJsonLdInput): Record<string, unknown> => {
  const visibleItems = items.slice(0, Math.max(maxItems, 0));
  const itemListElement: JsonLdListItem[] = visibleItems.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path)
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: siteConfig.language,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement
    }
  };
};

export const buildLocalBusinessJsonLd = ({
  name,
  path,
  streetAddress,
  postalCode,
  city,
  phone
}: BuildLocalBusinessJsonLdInput): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name,
  url: absoluteUrl(path),
  inLanguage: siteConfig.language,
  address: {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality: city,
    postalCode,
    addressCountry: "BE"
  },
  ...(phone ? { telephone: phone } : {})
});
