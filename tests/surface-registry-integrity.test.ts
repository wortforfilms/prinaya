import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { spaRegistry, spaSurfaces, spaGroups, spaRegistrySummary } from "@/lib/spa-registry";

const APP = join(process.cwd(), "src", "app");
const STATUSES = new Set(["READY", "PARTIAL", "PLANNED", "BLOCKED"]);

function hasCatchAll(dir: string): boolean {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
  return readdirSync(dir).some((d) => d.startsWith("[") && d.includes("...") && existsSync(join(dir, d, "page.tsx")));
}
function routeHasPage(href: string): boolean {
  if (href === "/") return existsSync(join(APP, "page.tsx"));
  const segs = href.replace(/^\//, "").split("/");
  if (existsSync(join(APP, ...segs, "page.tsx"))) return true;
  for (let i = segs.length; i >= 1; i -= 1) if (hasCatchAll(join(APP, ...segs.slice(0, i)))) return true;
  return hasCatchAll(join(APP, segs[0]));
}

describe("SPA registry integrity", () => {
  it("is a controlled preview, not production", () => {
    expect(spaRegistry.verdict).toBe("CONTROLLED_PREVIEW_READY");
    expect(spaRegistry.productionReady).toBe(false);
  });

  it("has 156 surfaces across 20 groups", () => {
    expect(spaSurfaces.length).toBe(156);
    expect(spaGroups.length).toBe(20);
    expect(spaRegistrySummary.total).toBe(156);
    expect(spaRegistrySummary.groupCount).toBe(20);
  });

  it("has unique surface ids", () => {
    expect(new Set(spaSurfaces.map((s) => s.id)).size).toBe(spaSurfaces.length);
  });

  it("uses only valid statuses and the summary matches the actual counts", () => {
    const counts: Record<string, number> = {};
    for (const s of spaSurfaces) {
      expect(STATUSES.has(s.status), s.id).toBe(true);
      counts[s.status] = (counts[s.status] ?? 0) + 1;
    }
    expect(counts).toEqual(spaRegistrySummary.byStatus);
    expect(Object.values(spaRegistrySummary.byStatus).reduce((a, b) => a + b, 0)).toBe(156);
  });

  it("has completed every PARTIAL and PLANNED surface", () => {
    expect(spaSurfaces.filter((s) => s.status === "PARTIAL")).toEqual([]);
    expect(spaSurfaces.filter((s) => s.status === "PLANNED")).toEqual([]);
    expect(spaRegistrySummary.byStatus.READY).toBeGreaterThanOrEqual(140);
  });

  it("keeps every group count in sync with its surfaces", () => {
    for (const g of spaGroups) expect(g.count, g.group).toBe(g.surfaces.length);
  });

  it("resolves every surface href to a real Next page", () => {
    const unresolved = spaSurfaces.filter((s) => !routeHasPage(s.href)).map((s) => `${s.id} -> ${s.href}`);
    expect(unresolved).toEqual([]);
  });

  it("keeps exactly the 7 preserved blockers, each with a reason", () => {
    const blocked = spaSurfaces.filter((s) => s.status === "BLOCKED");
    expect(blocked.length).toBe(7);
    for (const s of blocked) expect(Boolean(s.reason && s.reason.trim()), `${s.id} needs reason`).toBe(true);
  });
});
