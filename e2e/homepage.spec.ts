import { expect, test } from "@playwright/test";

/**
 * Homepage runtime checks. Requires the dev/preview server running:
 *   npm run dev      (or: npm run build && npm run start)
 *   npx playwright test
 */

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 }
];

for (const viewport of VIEWPORTS) {
  test(`no horizontal overflow @ ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "page should not scroll horizontally").toBeLessThanOrEqual(1);
  });
}

test("no broken images", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const broken = await page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src)
  );
  expect(broken, `broken images: ${broken.join(", ")}`).toEqual([]);
});

test("blocked capability messaging is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("PRODUCTION_READY=false").first()).toBeVisible();
  await expect(page.getByText(/live vendors, payments, marketplace/i).first()).toBeVisible();
});

test("primary CTAs resolve to real in-app routes", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator("a[data-cta]").evaluateAll((els) => els.map((el) => el.getAttribute("href")));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) {
    expect(href, "CTA must be an internal route").toMatch(/^\//);
  }
});

test("mobile nav opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const navMandap = page.locator("header").getByRole("link", { name: "Mandap Designer" });
  await expect(navMandap).toBeHidden();
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(navMandap).toBeVisible();
  await page.getByRole("button", { name: "Close menu" }).click();
  await expect(navMandap).toBeHidden();
});
