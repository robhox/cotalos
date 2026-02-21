import { expect, test } from "@playwright/test";
import type { APIRequestContext } from "@playwright/test";

type SearchEntry = {
  type: "ville" | "commerce";
  label: string;
  targetPath: string;
};

async function getDynamicEntries(baseURL: string, request: APIRequestContext): Promise<{
  city: SearchEntry;
  commerce: SearchEntry;
}> {
  const response = await request.get(`${baseURL}/api/search?q=&limit=20`);
  expect(response.status()).toBe(200);

  const payload = (await response.json()) as { entries?: SearchEntry[] };
  const entries = payload.entries ?? [];

  const city = entries.find((entry) => entry.type === "ville");
  const commerce = entries.find((entry) => entry.type === "commerce");

  if (!city || !commerce) {
    throw new Error("Expected /api/search to return at least one city and one commerce entry.");
  }

  return { city, commerce };
}

test("all core routes return 200", async ({ page }) => {
  const baseURL = "http://127.0.0.1:3000";
  const { city, commerce } = await getDynamicEntries(baseURL, page.request);

  const smokeRoutes = [
    "/",
    "/mentions-legales",
    "/politique-confidentialite",
    "/gerer-ou-supprimer-cette-fiche",
    city.targetPath,
    commerce.targetPath
  ];

  for (const route of smokeRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), `status for ${route}`).toBe(200);
  }
});

test("homepage exposes MVP messaging and merchant CTA", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Commandez en ligne chez votre boucher ou traiteur" })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Prenez contact avec nous" })).toBeVisible();
});

test("homepage search redirects to city route", async ({ page }) => {
  const baseURL = "http://127.0.0.1:3000";
  const { city } = await getDynamicEntries(baseURL, page.request);

  await page.goto("/");
  await page.getByLabel("Rechercher par ville, code postal ou boucherie").fill(city.label);
  await page.getByRole("button", { name: "Rechercher" }).click();
  await expect(page).toHaveURL(city.targetPath);
});

test("homepage search redirects to commerce route", async ({ page }) => {
  const baseURL = "http://127.0.0.1:3000";
  const { commerce } = await getDynamicEntries(baseURL, page.request);
  const query = commerce.label.split(" (")[0] ?? commerce.label;

  await page.goto("/");
  await page.getByLabel("Rechercher par ville, code postal ou boucherie").fill(query);
  await page.getByRole("button", { name: "Rechercher" }).click();
  await expect(page).toHaveURL(commerce.targetPath);
});

test("commerce page shows required legal disclaimers", async ({ page }) => {
  const baseURL = "http://127.0.0.1:3000";
  const { commerce } = await getDynamicEntries(baseURL, page.request);

  await page.goto(commerce.targetPath);
  await expect(page.getByText("donnees publiques", { exact: false })).toHaveCount(2);
  await expect(page.getByText("aucune affiliation commerciale", { exact: false })).toHaveCount(2);
});

test("visual snapshots", async ({ page }) => {
  const baseURL = "http://127.0.0.1:3000";
  const { commerce } = await getDynamicEntries(baseURL, page.request);

  await page.goto("/");
  const homepageShot = await page.screenshot({ fullPage: true });
  expect(homepageShot.byteLength).toBeGreaterThan(0);

  await page.goto(commerce.targetPath);
  const commerceShot = await page.screenshot({ fullPage: true });
  expect(commerceShot.byteLength).toBeGreaterThan(0);

  await page.goto("/mentions-legales");
  const legalShot = await page.screenshot({ fullPage: true });
  expect(legalShot.byteLength).toBeGreaterThan(0);
});
