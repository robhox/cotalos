import { afterEach, describe, expect, it, vi } from "vitest";

import robots from "@/app/robots";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots route", () => {
  it("allows crawling in production", () => {
    vi.stubEnv("VERCEL_ENV", "production");

    const result = robots();

    expect(result.rules).toEqual([
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/"
      }
    ]);
    expect(result.sitemap).toBe("https://cotalos.be/sitemap.xml");
  });

  it("disallows crawling outside production", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("NODE_ENV", "production");

    const result = robots();

    expect(result.rules).toEqual([
      {
        userAgent: "*",
        disallow: "/"
      }
    ]);
    expect(result.sitemap).toBeUndefined();
  });
});
