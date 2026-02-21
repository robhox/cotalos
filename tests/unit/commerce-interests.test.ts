import { describe, expect, it } from "vitest";

import { normalizeFullName } from "@/lib/data/commerces";

describe("normalizeFullName", () => {
  it("normalizes accents, spaces and case", () => {
    expect(normalizeFullName("  Élodie   D'Hôte ")).toBe("elodie d'hote");
  });

  it("keeps hyphenated names while normalizing", () => {
    expect(normalizeFullName("Jean-Luc   Martin")).toBe("jean-luc martin");
  });

  it("drops unsupported symbols", () => {
    expect(normalizeFullName("###")).toBe("");
  });
});
