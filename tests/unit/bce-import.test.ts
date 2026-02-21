import {
  buildAddressLine,
  buildCommerceSlug,
  getEnterpriseDenominationPriority,
  getEstablishmentDenominationPriority,
  isMissingCommerceName,
  normalizeCityName,
  normalizeCommerceName,
  parseBelgianDate,
  shouldExcludeCommerceName
} from "@/lib/import/bce-import";
import { describe, expect, it } from "vitest";

describe("bce import helpers", () => {
  it("parses Belgian date formats", () => {
    const dateOnly = parseBelgianDate("18-01-2026");
    const withTime = parseBelgianDate("19-01-2026 07:09:14");

    expect(dateOnly?.toISOString()).toBe("2026-01-18T00:00:00.000Z");
    expect(withTime?.toISOString()).toBe("2026-01-19T07:09:14.000Z");
    expect(parseBelgianDate("2026-01-18")).toBeUndefined();
  });

  it("builds a deterministic slug with postal code and establishment suffix", () => {
    expect(buildCommerceSlug("Boucherie de l'Étoile", "1000", "2.000.000.111")).toBe(
      "boucherie-de-l-etoile-1000-2000000111"
    );
  });

  it("builds address lines", () => {
    expect(buildAddressLine("Rue de Test", "12", "")).toBe("Rue de Test 12");
    expect(buildAddressLine("Rue de Test", "12", "BTE 4")).toBe("Rue de Test 12 BTE 4");
    expect(buildAddressLine("", "", "")).toBe("");
  });

  it("normalizes imported city names", () => {
    expect(normalizeCityName("LIEGE")).toBe("Liege");
    expect(normalizeCityName(" LA LOUVIERE ")).toBe("La Louviere");
    expect(normalizeCityName("MONT-SUR-MARCHIENNE")).toBe("Mont-sur-Marchienne");
    expect(normalizeCityName("SINT-JOOST-TEN-NOODE")).toBe("Sint-Joost-ten-Noode");
  });

  it("normalizes imported commerce names", () => {
    expect(normalizeCommerceName("  BOUCHERIE   DE L'ETOILE  SPRL ")).toBe(
      "Boucherie De L'Etoile Sprl"
    );
    expect(normalizeCommerceName("LA-MAISON DU BOEUF")).toBe("La-Maison Du Boeuf");
  });

  it("excludes disallowed chain names", () => {
    expect(shouldExcludeCommerceName("Boucherie Renmans Namur")).toBe(true);
    expect(shouldExcludeCommerceName("COLRUYT Boucherie")).toBe(true);
    expect(shouldExcludeCommerceName("Le Comptoir Dufrais")).toBe(true);
    expect(shouldExcludeCommerceName("Boucherie Centrale")).toBe(false);
  });

  it("treats dash-only names as missing", () => {
    expect(isMissingCommerceName("-")).toBe(true);
    expect(isMissingCommerceName(" - ")).toBe(true);
    expect(isMissingCommerceName("Boucherie Centrale")).toBe(false);
  });

  it("ranks denomination priorities for establishment and enterprise", () => {
    expect(getEstablishmentDenominationPriority("003", "1")).toBe(1);
    expect(getEstablishmentDenominationPriority("003", "2")).toBe(2);
    expect(getEstablishmentDenominationPriority("003", "0")).toBe(3);
    expect(getEstablishmentDenominationPriority("001", "1")).toBeNull();

    expect(getEnterpriseDenominationPriority("001", "1")).toBe(4);
    expect(getEnterpriseDenominationPriority("001", "2")).toBe(5);
    expect(getEnterpriseDenominationPriority("001", "0")).toBe(6);
    expect(getEnterpriseDenominationPriority("002", "2")).toBe(7);
    expect(getEnterpriseDenominationPriority("003", "1")).toBeNull();
  });
});
