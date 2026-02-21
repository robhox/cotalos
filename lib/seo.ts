import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  openGraphImages?: string[];
  twitterImages?: string[];
}

export const absoluteUrl = (path: string): string => {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${withLeadingSlash}`;
};

const resolveAbsoluteAssetUrl = (value: string): string => {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return absoluteUrl(value);
};

export const buildMetadata = ({
  title,
  description,
  path,
  openGraphImages,
  twitterImages
}: BuildMetadataInput): Metadata => {
  const defaultSocialImage = resolveAbsoluteAssetUrl(siteConfig.defaultSocialImagePath);
  const resolvedOpenGraphImages =
    openGraphImages && openGraphImages.length > 0
      ? openGraphImages.map(resolveAbsoluteAssetUrl)
      : [defaultSocialImage];
  const resolvedTwitterImages =
    twitterImages && twitterImages.length > 0
      ? twitterImages.map(resolveAbsoluteAssetUrl)
      : [defaultSocialImage];

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
      url: absoluteUrl(path),
      images: resolvedOpenGraphImages
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: resolvedTwitterImages
    }
  };
};
