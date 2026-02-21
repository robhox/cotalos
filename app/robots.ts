import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production";

  if (!isProduction) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/"
        }
      ]
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/"
      }
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`
  };
}
