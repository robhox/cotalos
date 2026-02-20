import { describe, expect, it } from "vitest";

import { buildSearchIndex, resolveSearchTarget } from "@/lib/mock-data";

describe("resolveSearchTarget", () => {
  const index = buildSearchIndex();

  it("returns city route for exact city query", () => {
    const result = resolveSearchTarget("Bruxelles", index);
    expect(result?.type).toBe("ville");
    expect(result?.targetPath).toBe("/boucheries/bruxelles");
  });

  it("returns commerce route for exact commerce query", () => {
    const result = resolveSearchTarget("Boucherie Royale (Bruxelles)", index);
    expect(result?.type).toBe("commerce");
    expect(result?.targetPath).toContain("/boucherie/");
  });

  it("returns null for unknown query", () => {
    const result = resolveSearchTarget("zzzzzz", index);
    expect(result).toBeNull();
  });
});
