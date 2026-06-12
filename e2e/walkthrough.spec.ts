import { expect, test } from "@playwright/test";

/**
 * Guided walkthrough — tours the key Wedding OS surfaces in one run so the
 * recorded video (playwright.config.ts -> use.video) captures a full tour.
 * Each .webm lands in ./test-results.  Run: npm run test:e2e
 */
test("wedding os surface tour", async ({ page }) => {
  // Homepage
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "TLPS Wedding OS" }).first()).toBeVisible();
  await expect(page.getByText("PRODUCTION_READY=false").first()).toBeVisible();
  await page.waitForTimeout(600);

  // Surface registry
  await page.goto("/surfaces");
  await expect(page.getByText(/Surface Registry/i).first()).toBeVisible();
  await page.waitForTimeout(600);

  // Mandap Designer
  await page.goto("/mandap");
  await expect(page.getByRole("heading", { name: "Mandap Designer" }).first()).toBeVisible();
  await page.waitForTimeout(600);

  // Vedi Finder / Intelligence
  await page.goto("/hemant-samwat-vedi");
  await expect(page.getByText(/Vedi Finder|Muhurat Intelligence/i).first()).toBeVisible();
  await page.waitForTimeout(600);

  // CAD Studio (self-contained Three.js)
  await page.goto("/cad/studio");
  await page.waitForTimeout(1000);

  // 3D Designer Studio
  await page.goto("/cad/3d");
  await page.waitForTimeout(1000);
});

test("studios render without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  for (const path of ["/cad/studio", "/cad/3d", "/ai/studio", "/exports/studio"]) {
    await page.goto(path);
    await page.waitForTimeout(800);
  }
  expect(errors, `page errors: ${errors.join(" | ")}`).toEqual([]);
});
