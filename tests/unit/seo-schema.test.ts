import { describe, expect, it } from "vitest";

import {
  buildBreadcrumbJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  serializeJsonLd
} from "@/lib/seo-schema";

describe("seo schema helpers", () => {
  it("builds organization and website schemas", () => {
    const organization = buildOrganizationJsonLd();
    const website = buildWebsiteJsonLd();

    expect(organization["@type"]).toBe("Organization");
    expect(organization.url).toBe("https://cotalos.be");
    expect(website["@type"]).toBe("WebSite");
    expect(website.inLanguage).toBe("fr-BE");
  });

  it("builds breadcrumb schema with absolute urls", () => {
    const breadcrumb = buildBreadcrumbJsonLd([
      { name: "Accueil", path: "/" },
      { name: "Boucheries a Namur", path: "/boucheries/namur" }
    ]);

    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://cotalos.be/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Boucheries a Namur",
        item: "https://cotalos.be/boucheries/namur"
      }
    ]);
  });

  it("serializes JSON-LD safely", () => {
    const json = serializeJsonLd({ content: "<script>" });
    expect(json).toContain("\\u003cscript>");
  });
});
