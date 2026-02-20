import { describe, expect, it } from "vitest";

import { absoluteUrl, buildMetadata } from "@/lib/seo";

describe("seo helpers", () => {
  it("builds canonical absolute urls", () => {
    expect(absoluteUrl("/mentions-legales")).toBe("https://cotalos.be/mentions-legales");
    expect(absoluteUrl("mentions-legales")).toBe("https://cotalos.be/mentions-legales");
  });

  it("returns metadata with canonical", () => {
    const metadata = buildMetadata({
      title: "T",
      description: "D",
      path: "/politique-confidentialite"
    });

    expect(metadata.title).toBe("T");
    expect(metadata.description).toBe("D");
    expect(metadata.alternates?.canonical).toBe("https://cotalos.be/politique-confidentialite");
  });
});
