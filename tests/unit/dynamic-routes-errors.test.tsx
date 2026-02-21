import { describe, expect, it, vi } from "vitest";

const getCommercesByCitySlugMock = vi.fn();
const getCommerceBySlugMock = vi.fn();
const countCommerceInterestsMock = vi.fn();
const createCommerceInterestMock = vi.fn();

vi.mock("@/lib/data/commerces", () => ({
  getCommercesByCitySlug: getCommercesByCitySlugMock,
  getCommerceBySlug: getCommerceBySlugMock,
  countCommerceInterests: countCommerceInterestsMock,
  createCommerceInterest: createCommerceInterestMock
}));

vi.mock("@/lib/posthog-server", () => ({
  getPostHogClient: () => ({ capture: vi.fn() })
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: () => {
    throw new Error("NEXT_REDIRECT");
  }
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn()
}));

describe("dynamic routes db unavailability handling", () => {
  it("throws on city route when db is unavailable", async () => {
    getCommercesByCitySlugMock.mockResolvedValueOnce({
      ok: false,
      error: "db down"
    });

    const { default: CityPage } = await import("@/app/boucheries/[ville]/page");

    await expect(CityPage({ params: Promise.resolve({ ville: "namur" }) })).rejects.toThrow(
      "DB unavailable on /boucheries/namur: db down"
    );
  });

  it("throws on commerce route when db is unavailable", async () => {
    getCommerceBySlugMock.mockResolvedValueOnce({
      ok: false,
      error: "db down"
    });

    const { default: CommercePage } = await import("@/app/boucherie/[slug]/page");

    await expect(
      CommercePage({
        params: Promise.resolve({ slug: "boucherie-test-5000-1" }),
        searchParams: Promise.resolve({})
      })
    ).rejects.toThrow("DB unavailable on /boucherie/boucherie-test-5000-1: db down");
  });
});
