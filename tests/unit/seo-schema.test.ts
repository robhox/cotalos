import { describe, expect, it } from "vitest";

import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildLocalBusinessJsonLd,
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

  it("builds collection page schema with bounded item list", () => {
    const collection = buildCollectionPageJsonLd({
      name: "Boucheries a Namur",
      description: "Annuaire local des boucheries a Namur.",
      path: "/boucheries/namur",
      items: [
        { name: "Boucherie A", path: "/boucherie/a" },
        { name: "Boucherie B", path: "/boucherie/b" }
      ],
      maxItems: 1
    });

    expect(collection["@type"]).toBe("CollectionPage");
    expect(collection.url).toBe("https://cotalos.be/boucheries/namur");
    expect(collection.mainEntity).toEqual({
      "@type": "ItemList",
      numberOfItems: 2,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Boucherie A",
          item: "https://cotalos.be/boucherie/a"
        }
      ]
    });
  });

  it("builds local business schema with postal address", () => {
    const localBusiness = buildLocalBusinessJsonLd({
      name: "Boucherie de Namur",
      path: "/boucherie/boucherie-de-namur",
      streetAddress: "Rue de Test 1",
      postalCode: "5000",
      city: "Namur",
      phone: "+32 81 12 34 56"
    });

    expect(localBusiness["@type"]).toBe("LocalBusiness");
    expect(localBusiness.url).toBe("https://cotalos.be/boucherie/boucherie-de-namur");
    expect(localBusiness.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "Rue de Test 1",
      addressLocality: "Namur",
      postalCode: "5000",
      addressCountry: "BE"
    });
    expect(localBusiness.telephone).toBe("+32 81 12 34 56");
  });

  it("serializes JSON-LD safely", () => {
    const json = serializeJsonLd({ content: "<script>" });
    expect(json).toContain("\\u003cscript>");
  });
});
