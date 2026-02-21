import type { Metadata } from "next";
import { DM_Serif_Display, Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildMetadata } from "@/lib/seo";
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  serializeJsonLd
} from "@/lib/seo-schema";
import { siteConfig } from "@/lib/site-config";

import "../styles/globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";

const uiFont = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap"
});

const displayFont = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
  display: "swap"
});

const heroFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-hero",
  display: "swap"
});

export const metadata: Metadata = buildMetadata({
  title: siteConfig.defaultTitle,
  description: siteConfig.defaultDescription,
  path: "/"
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const organizationJsonLd = serializeJsonLd(buildOrganizationJsonLd());
  const webSiteJsonLd = serializeJsonLd(buildWebsiteJsonLd());

  return (
    <html
      lang="fr-BE"
      className={`${uiFont.variable} ${displayFont.variable} ${heroFont.variable}`}
    >
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: webSiteJsonLd }}
        />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
