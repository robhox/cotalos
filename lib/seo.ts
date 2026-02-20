import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
}

export const absoluteUrl = (path: string): string => {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${withLeadingSlash}`;
};

export const buildMetadata = ({ title, description, path }: BuildMetadataInput): Metadata => {
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path)
    },
    openGraph: {
      type: "website",
      locale: siteConfig.language,
      siteName: siteConfig.name,
      title,
      description,
      url: absoluteUrl(path)
    }
  };
};
