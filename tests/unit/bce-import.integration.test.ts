import path from "node:path";
import { buildBceCommerceDataset } from "@/lib/import/bce-import";
import { describe, expect, it } from "vitest";

describe("buildBceCommerceDataset", () => {
  it("imports only exact boucherie NACE codes and excludes subcodes", async () => {
    const fixtureDir = path.resolve(process.cwd(), "tests/fixtures/bce");
    const result = await buildBceCommerceDataset({
      dataDir: fixtureDir,
      naceVersion: "2025",
      naceCodes: ["47.22", "47.221", "47.222"]
    });

    expect(result.rowsSelected).toBe(1);
    expect(result.rowsSkipped).toBe(0);
    expect(result.records).toHaveLength(1);

    const boucherie = result.records.find(
      (record) => record.establishmentNumber === "2.000.000.111"
    );
    expect(boucherie).toBeDefined();
    expect(boucherie?.enterpriseNumber).toBe("0123.456.789");
    expect(boucherie?.name).toBe("Boucherie Centrale Sprl");
    expect(boucherie?.category).toBe("boucherie");
    expect(boucherie?.naceCode).toBe("47221");
    expect(boucherie?.matchedNaceCodes).toEqual(["47221"]);
    expect(boucherie?.addressLine).toBe("Rue de Test 12");
    expect(boucherie?.city).toBe("Bruxelles");
    expect(boucherie?.postalCode).toBe("1000");
    expect(boucherie?.phone).toBe("02 000 00 00");
    expect(boucherie?.email).toBe("contact@boucherie.test");
    expect(boucherie?.website).toBe("https://boucherie.test");
  });
});
