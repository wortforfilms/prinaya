import { expect, test } from "@playwright/test";
import { spaSurfaces } from "../src/lib/spa-registry";

/**
 * Lightweight, dependency-free accessibility checks across a sample of
 * READY surfaces. Requires the server running: npm run test:e2e
 */
const sample = [...new Set(spaSurfaces.filter((s) => s.status === "READY").map((s) => s.href))].slice(0, 40);

test("document declares a language", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("html").getAttribute("lang")).toBeTruthy();
});

test.describe("accessibility basics", () => {
  for (const href of sample) {
    test(`a11y basics on ${href}`, async ({ page }) => {
      await page.goto(href, { waitUntil: "networkidle" });

      expect(await page.locator("h1").count(), `h1 count on ${href}`).toBeGreaterThanOrEqual(1);

      const imagesMissingAlt = await page.locator("img:not([alt])").count();
      expect(imagesMissingAlt, `images missing alt on ${href}`).toBe(0);

      const namelessControls = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll("button, a"));
        return els.filter((el) => {
          const text = (el.textContent || "").trim();
          const aria = el.getAttribute("aria-label") || el.getAttribute("title") || "";
          const labelled = el.getAttribute("aria-labelledby");
          const hasImg = el.querySelector("img[alt]");
          return !text && !aria && !labelled && !hasImg;
        }).length;
      });
      expect(namelessControls, `unnamed interactive controls on ${href}`).toBe(0);
    });
  }
});
