/**
 * Verify the SPA surface registry.
 *
 *   npm run verify:spas
 *
 * Asserts: unique ids, every href resolves to a real Next page on disk (static
 * page.tsx or a catch-all [...slug] ancestor), BLOCKED surfaces carry a reason,
 * status counts sum to total, and the 150+ surface target is met.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spaSurfaces, spaRegistrySummary } from "../src/lib/spa-registry";

const APP = join(process.cwd(), "src", "app");

function hasCatchAll(dir: string): boolean {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
  return readdirSync(dir).some((d) => d.startsWith("[") && d.includes("...") && existsSync(join(dir, d, "page.tsx")));
}

/** Does an href resolve to a served Next page? */
function routeHasPage(href: string): boolean {
  if (href === "/") return existsSync(join(APP, "page.tsx"));
  const segs = href.replace(/^\//, "").split("/");
  if (existsSync(join(APP, ...segs, "page.tsx"))) return true;
  // a catch-all at any ancestor serves nested paths
  for (let i = segs.length; i >= 1; i -= 1) {
    if (hasCatchAll(join(APP, ...segs.slice(0, i)))) return true;
  }
  return hasCatchAll(join(APP, segs[0]));
}

const failures: string[] = [];
const assert = (cond: boolean, msg: string) => {
  if (!cond) failures.push(msg);
};

const ids = new Set<string>();
for (const s of spaSurfaces) {
  assert(!ids.has(s.id), `duplicate surface id ${s.id}`);
  ids.add(s.id);
  assert(routeHasPage(s.href), `${s.id} -> no served page for ${s.href}`);
  if (s.status === "BLOCKED") assert(Boolean(s.reason), `${s.id} BLOCKED without a reason`);
}

const statusSum = Object.values(spaRegistrySummary.byStatus).reduce((a, b) => a + b, 0);
assert(statusSum === spaRegistrySummary.total, "status counts do not sum to total");
assert(spaSurfaces.length === spaRegistrySummary.total, "surface count mismatch");
assert(spaRegistrySummary.total >= 150, `expected 150+ surfaces, got ${spaRegistrySummary.total}`);

console.log("SPA registry verification");
console.log(`  surfaces: ${spaRegistrySummary.total} across ${spaRegistrySummary.groupCount} groups`);
console.log(`  byStatus:`, spaRegistrySummary.byStatus);

if (failures.length > 0) {
  console.error("FAILED:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("npm run verify:spas passed");
