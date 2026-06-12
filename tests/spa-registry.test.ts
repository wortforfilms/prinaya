import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { spaSurfaces, spaGroups, spaRegistrySummary } from "@/lib/spa-registry";

const APP = join(process.cwd(), "src", "app");

function hasCatchAll(dir: string): boolean {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
  return readdirSync(dir).some((d) => d.startsWith("[") && d.includes("...") && existsSync(join(dir, d, "page.tsx")));
}

function routeHasPage(href: string): boolean {
  if (href === "/") return existsSync(join(APP, "page.tsx"));
  const segs = href.replace(/^\//, "").split("/");
  if (existsSync(join(APP, ...segs, "page.tsx"))) return true;
  for (let i = segs.length; i >= 1; i -= 1) {
    if (hasCatchAll(join(APP, ...segs.slice(0, i)))) return true;
  }
  return hasCatchAll(join(APP, segs[0]));
}

describe("SPA surface registry", () => {
  it("declares 150+ surfaces across multiple groups", () => {
    expect(spaSurfaces.length).toBeGreaterThanOrEqual(150);
    expect(spaRegistrySummary.total).toBe(spaSurfaces.length);
    expect(spaRegistrySummary.groupCount).toBe(spaGroups.length);
  });

  it("has unique ids", () => {
    expect(new Set(spaSurfaces.map((s) => s.id)).size).toBe(spaSurfaces.length);
  });

  it("every surface href resolves to a real Next page (no 404s)", () => {
    const unresolved = spaSurfaces.filter((s) => !routeHasPage(s.href)).map((s) => `${s.id} -> ${s.href}`);
    expect(unresolved).toEqual([]);
  });

  it("BLOCKED surfaces carry a reason", () => {
    for (const s of spaSurfaces.filter((x) => x.status === "BLOCKED")) {
      expect(s.reason, `${s.id} BLOCKED without reason`).toBeTruthy();
    }
  });

  it("status counts sum to the total and group counts match", () => {
    const sum = Object.values(spaRegistrySummary.byStatus).reduce((a, b) => a + b, 0);
    expect(sum).toBe(spaRegistrySummary.total);
    for (const g of spaGroups) expect(g.count).toBe(g.surfaces.length);
  });
});
