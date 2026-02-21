import { describe, expect, it } from "vitest";

import { buildDefaultQuickCityEntries } from "@/lib/data/search";

describe("buildDefaultQuickCityEntries", () => {
  it("returns the fixed homepage city shortlist when available", () => {
    const cities = [
      { city: "Aarschot", slug: "aarschot" },
      { city: "Bruxelles", slug: "bruxelles" },
      { city: "Namur", slug: "namur" },
      { city: "Mons", slug: "mons" },
      { city: "Charleroi", slug: "charleroi" },
      { city: "Liège", slug: "liege" },
      { city: "La Louvière", slug: "la-louviere" }
    ];

    const result = buildDefaultQuickCityEntries(cities, 6);

    expect(result.map((entry) => entry.label)).toEqual([
      "Bruxelles",
      "Liège",
      "Namur",
      "Charleroi",
      "Mons",
      "La Louvière"
    ]);
    expect(result.every((entry) => entry.type === "ville")).toBe(true);
  });

  it("fills missing defaults with other cities to keep six entries", () => {
    const cities = [
      { city: "Bruxelles", slug: "bruxelles" },
      { city: "Namur", slug: "namur" },
      { city: "Mons", slug: "mons" },
      { city: "Charleroi", slug: "charleroi" },
      { city: "Arlon", slug: "arlon" },
      { city: "Ottignies", slug: "ottignies" },
      { city: "Wavre", slug: "wavre" }
    ];

    const result = buildDefaultQuickCityEntries(cities, 6);

    expect(result).toHaveLength(6);
    expect(result.map((entry) => entry.label).slice(0, 4)).toEqual([
      "Bruxelles",
      "Namur",
      "Charleroi",
      "Mons"
    ]);
    expect(result.every((entry) => entry.type === "ville")).toBe(true);
  });
});
