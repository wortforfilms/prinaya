import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { homepageImagePaths, homepageInternalHrefs } from "@/lib/homepage-content";
import { buildHomepageSurface } from "@/lib/kbs/surfaces";
import { routeMatrix } from "@/lib/route-matrix";
import { tlpsWeddingOsHomepage } from "@/lib/tlps-wedding-os-homepage";
import { recordPreviewEvent } from "@/lib/telemetry";

// Routes the homepage is allowed to link to: matrix roots + standalone runtime pages.
const validRoutes = new Set<string>([
  "/",
  ...routeMatrix.map((route) => route.path.replace("/*", "") || "/"),
  "/cad/editor",
  "/hemant-samwat-vedi"
]);

describe("homepage smoke", () => {
  it("builds a complete command surface", () => {
    const surface = buildHomepageSurface();
    expect(surface.status).toBe("READY");
    expect(surface.verdict).toBe("CONTROLLED_PREVIEW_READY");
    expect(surface.productionReady).toBe(false);
    expect(surface.kbs.nodes).toBeGreaterThanOrEqual(500);
    expect(surface.kbs.useCases).toBe(108);
    expect(surface.useCaseGroups.length).toBeGreaterThanOrEqual(5);
    expect(surface.vedi.nakshatras).toBe(27);
  });
});

describe("no broken images", () => {
  const imagePaths = [
    ...homepageImagePaths(),
    ...tlpsWeddingOsHomepage.filmCards.map((card) => card.image)
  ];

  it.each(imagePaths)("public asset exists: %s", (image) => {
    const onDisk = join(process.cwd(), "public", image.replace(/^\//, ""));
    expect(existsSync(onDisk), `missing public asset ${image}`).toBe(true);
  });
});

describe("all CTAs point to real routes", () => {
  it.each(homepageInternalHrefs())("href resolves to a route: %s", (href) => {
    expect(validRoutes.has(href), `unknown route ${href}`).toBe(true);
  });
});

describe("telemetry is local-only and SSR-safe", () => {
  it("does not throw when window is undefined (server)", () => {
    expect(() => recordPreviewEvent("test_event", { ok: true })).not.toThrow();
  });
});
