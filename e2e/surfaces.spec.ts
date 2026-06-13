import { expect, test } from "@playwright/test";
import { spaSurfaces } from "../src/lib/spa-registry";

/**
 * Data-driven smoke test over every READY surface in the registry.
 * Requires the dev/preview server running (playwright.config starts it):
 *   npm run test:e2e
 */
const readyHrefs = [...new Set(spaSurfaces.filter((s) => s.status === "READY").map((s) => s.href))];

test.describe("READY surfaces render cleanly", () => {
  for (const href of readyHrefs) {
    test(`renders ${href}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => consoleErrors.push(err.message));

      const res = await page.goto(href, { waitUntil: "networkidle" });
      expect(res?.status(), `HTTP status for ${href}`).toBeLessThan(400);

      await expect(page.locator("h1").first()).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `horizontal overflow on ${href}`).toBeLessThanOrEqual(1);

      const broken = await page.evaluate(() =>
        Array.from(document.images)
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.currentSrc || img.src)
      );
      expect(broken, `broken images on ${href}`).toEqual([]);

      expect(consoleErrors, `console errors on ${href}`).toEqual([]);
    });
  }
});

test.describe("preserved blockers stay visible", () => {
  const blocked = spaSurfaces.filter((s) => s.status === "BLOCKED");

  test("the registry still carries the 7 preserved blockers", () => {
    expect(blocked.length).toBe(7);
  });

  test("homepage keeps the production-not-ready messaging", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("PRODUCTION_READY=false").first()).toBeVisible();
  });
});
