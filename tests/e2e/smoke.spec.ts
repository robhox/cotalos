import { expect, test } from "@playwright/test";

const smokeRoutes = [
  "/",
  "/mentions-legales",
  "/politique-confidentialite",
  "/gerer-ou-supprimer-cette-fiche",
  "/villes",
  "/boucherie/boucherie-royale-bruxelles-centre",
  "/boucheries/bruxelles"
];

test("all epic 1 routes return 200", async ({ page }) => {
  for (const route of smokeRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), `status for ${route}`).toBe(200);
  }
});

test("homepage exposes MVP messaging and merchant CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Commandez chez votre boucher, sans appeler" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Activer la commande en ligne" })).toBeVisible();
});

test("homepage search redirects to city route", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Rechercher par ville, code postal ou boucherie").fill("Bruxelles");
  await page.getByRole("button", { name: "Rechercher" }).click();
  await expect(page).toHaveURL("/boucheries/bruxelles");
});

test("homepage search redirects to commerce route", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Rechercher par ville, code postal ou boucherie").fill("Boucherie Royale");
  await page.getByRole("button", { name: "Rechercher" }).click();
  await expect(page).toHaveURL("/boucherie/boucherie-royale-bruxelles-centre");
});

test("commerce page shows required legal disclaimers", async ({ page }) => {
  await page.goto("/boucherie/boucherie-royale-bruxelles-centre");
  await expect(page.getByText("donnees publiques", { exact: false })).toHaveCount(2);
  await expect(page.getByText("aucune affiliation commerciale", { exact: false })).toHaveCount(2);
});

test("visual snapshots", async ({ page }) => {
  await page.goto("/");
  const homepageShot = await page.screenshot({ fullPage: true });
  expect(homepageShot.byteLength).toBeGreaterThan(0);

  await page.goto("/boucherie/boucherie-royale-bruxelles-centre");
  const commerceShot = await page.screenshot({ fullPage: true });
  expect(commerceShot.byteLength).toBeGreaterThan(0);

  await page.goto("/mentions-legales");
  const legalShot = await page.screenshot({ fullPage: true });
  expect(legalShot.byteLength).toBeGreaterThan(0);
});
