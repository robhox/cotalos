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
        userAgent: [
          "Googlebot",
          "AdsBot-Google",
          "Googlebot-Image",
          "Googlebot-News",
          "Googlebot-Video",
          "Mediapartners-Google",
          "Google-InspectionTool",
          "Storebot-Google"
        ],
        allow: "/",
        disallow: "/api/"
      },
      {
        userAgent: "*",
        disallow: "/"
      }
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`
  };
}
