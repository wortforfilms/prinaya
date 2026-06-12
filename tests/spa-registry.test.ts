import { describe, expect, it } from "vitest";
import { spaSurfaces, spaGroups, spaRegistrySummary } from "@/lib/spa-registry";
import { routeMatrix } from "@/lib/route-matrix";

const KNOWN = new Set<string>([
  "/",
  ...routeMatrix.map((route) => route.path.replace("/*", "") || "/"),
  "/cad/editor",
  "/cad/studio",
  "/cad/3d",
  "/ai/studio",
  "/exports/studio",
  "/hemant-samwat-vedi",
  "/wedding-os",
  "/surfaces"
]);

describe("SPA surface registry", () => {
  it("declares 150+ surfaces across multiple groups", () => {
    expect(spaSurfaces.length).toBeGreaterThanOrEqual(150);
    expect(spaRegistrySummary.total).toBe(spaSurfaces.length);
    expect(spaRegistrySummary.groupCount).toBe(spaGroups.length);
  });

  it("has unique ids", () => {
    const ids = new Set(spaSurfaces.map((s) => s.id));
    expect(ids.size).toBe(spaSurfaces.length);
  });

  it("every surface href resolves to a real route (no dangling)", () => {
    const dangling = spaSurfaces.filter((s) => !KNOWN.has(s.href)).map((s) => `${s.id} -> ${s.href}`);
    expect(dangling).toEqual([]);
  });

  it("BLOCKED surfaces carry a reason", () => {
    for (const s of spaSurfaces.filter((x) => x.status === "BLOCKED")) {
      expect(s.reason, `${s.id} BLOCKED without reason`).toBeTruthy();
    }
  });

  it("status counts sum to the total", () => {
    const sum = Object.values(spaRegistrySummary.byStatus).reduce((a, b) => a + b, 0);
    expect(sum).toBe(spaRegistrySummary.total);
  });

  it("group counts match their surfaces", () => {
    for (const group of spaGroups) {
      expect(group.count).toBe(group.surfaces.length);
    }
  });
});
