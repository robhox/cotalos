import { beforeEach, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/lib/site-config";

vi.mock("@/lib/data/commerces", () => ({
  listCitySitemapEntries: vi.fn(),
  listCommerceSlugs: vi.fn()
}));

import sitemap, { revalidate } from "@/app/sitemap";
import { listCitySitemapEntries, listCommerceSlugs } from "@/lib/data/commerces";

const mockedListCitySitemapEntries = vi.mocked(listCitySitemapEntries);
const mockedListCommerceSlugs = vi.mocked(listCommerceSlugs);
const toIsoString = (value: string | Date | undefined): string | undefined =>
  value instanceof Date ? value.toISOString() : value;

describe("sitemap route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports six-hour revalidation", () => {
    expect(revalidate).toBe(21600);
  });

  it("builds sitemap with stable and dynamic lastModified values", async () => {
    const cityUpdatedAt = new Date("2026-02-20T12:00:00.000Z");
    const commerceUpdatedAt = new Date("2026-02-18T09:00:00.000Z");

    mockedListCitySitemapEntries.mockResolvedValue({
      ok: true,
      data: [{ city: "Namur", slug: "namur", updatedAt: cityUpdatedAt }]
    });
    mockedListCommerceSlugs.mockResolvedValue({
      ok: true,
      data: [{ slug: "boucherie-namur-5000-123", updatedAt: commerceUpdatedAt }]
    });

    const entries = await sitemap();

    const homepage = entries.find((entry) => entry.url === "https://cotalos.be");
    const cookiesPage = entries.find((entry) => entry.url === "https://cotalos.be/cookies");
    const city = entries.find((entry) => entry.url === "https://cotalos.be/boucheries/namur");
    const commerce = entries.find(
      (entry) => entry.url === "https://cotalos.be/boucherie/boucherie-namur-5000-123"
    );

    expect(toIsoString(homepage?.lastModified)).toBe(siteConfig.staticPagesLastModified);
    expect(toIsoString(cookiesPage?.lastModified)).toBe(siteConfig.staticPagesLastModified);
    expect(toIsoString(city?.lastModified)).toBe(cityUpdatedAt.toISOString());
    expect(toIsoString(commerce?.lastModified)).toBe(commerceUpdatedAt.toISOString());
  });

  it("throws when cities cannot be loaded", async () => {
    mockedListCitySitemapEntries.mockResolvedValue({
      ok: false,
      error: "db down"
    });
    mockedListCommerceSlugs.mockResolvedValue({
      ok: true,
      data: []
    });

    await expect(sitemap()).rejects.toThrow("Unable to generate sitemap city entries");
  });

  it("throws when commerces cannot be loaded", async () => {
    mockedListCitySitemapEntries.mockResolvedValue({
      ok: true,
      data: []
    });
    mockedListCommerceSlugs.mockResolvedValue({
      ok: false,
      error: "db down"
    });

    await expect(sitemap()).rejects.toThrow("Unable to generate sitemap commerce entries");
  });
});
