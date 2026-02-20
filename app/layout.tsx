import type { Metadata } from "next";
import { DM_Serif_Display, Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";

import "../styles/globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.defaultTitle,
  description: siteConfig.defaultDescription,
  alternates: {
    canonical: siteConfig.siteUrl
  }
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr-BE" className={`${uiFont.variable} ${displayFont.variable} ${heroFont.variable}`}>
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
