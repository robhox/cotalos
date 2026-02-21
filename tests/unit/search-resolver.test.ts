import { describe, expect, it } from "vitest";

import { resolveSearchTarget } from "@/lib/data/search";
import type { SearchIndexEntry } from "@/lib/types";

describe("resolveSearchTarget", () => {
  const index: SearchIndexEntry[] = [
    { type: "ville", label: "Bruxelles", targetPath: "/boucheries/bruxelles" },
    { type: "ville", label: "1000 Bruxelles", targetPath: "/boucheries/bruxelles" },
    {
      type: "commerce",
      label: "Boucherie Royale (Bruxelles)",
      targetPath: "/boucherie/boucherie-royale-bruxelles-centre"
    }
  ];

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
