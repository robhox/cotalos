import { describe, expect, it } from "vitest";

import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

describe("seo helpers", () => {
  it("builds canonical absolute urls", () => {
    expect(absoluteUrl("/mentions-legales")).toBe("https://cotalos.be/mentions-legales");
    expect(absoluteUrl("mentions-legales")).toBe("https://cotalos.be/mentions-legales");
  });

  it("returns metadata with canonical, open graph and twitter defaults", () => {
    const metadata = buildMetadata({
      title: "T",
      description: "D",
      path: "/politique-confidentialite"
    });

    expect(metadata.title).toBe("T");
    expect(metadata.description).toBe("D");
    expect(metadata.alternates?.canonical).toBe("https://cotalos.be/politique-confidentialite");
    expect(metadata.openGraph?.images).toEqual([absoluteUrl(siteConfig.defaultSocialImagePath)]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(metadata.twitter?.images).toEqual([absoluteUrl(siteConfig.defaultSocialImagePath)]);
  });

  it("supports custom open graph and twitter images", () => {
    const metadata = buildMetadata({
      title: "T",
      description: "D",
      path: "/",
      openGraphImages: ["/custom-og.png"],
      twitterImages: ["https://cdn.example.com/custom-twitter.png"]
    });

    expect(metadata.openGraph?.images).toEqual(["https://cotalos.be/custom-og.png"]);
    expect(metadata.twitter?.images).toEqual(["https://cdn.example.com/custom-twitter.png"]);
  });
});
