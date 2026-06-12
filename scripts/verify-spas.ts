/**
 * Verify the SPA surface registry.
 *
 *   npm run verify:spas
 *
 * Asserts: unique surface ids, every href resolves to a real route (matrix root
 * or standalone runtime route), BLOCKED surfaces carry a reason, status counts
 * sum to the total, and the registry meets the 150+ surface target.
 */
import { spaSurfaces, spaRegistrySummary } from "../src/lib/spa-registry";
import { routeMatrix } from "../src/lib/route-matrix";

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

const failures: string[] = [];
const assert = (cond: boolean, msg: string) => {
  if (!cond) failures.push(msg);
};

const ids = new Set<string>();
for (const surface of spaSurfaces) {
  assert(!ids.has(surface.id), `duplicate surface id ${surface.id}`);
  ids.add(surface.id);
  assert(KNOWN.has(surface.href), `${surface.id} -> unresolved href ${surface.href}`);
  if (surface.status === "BLOCKED") assert(Boolean(surface.reason), `${surface.id} BLOCKED without a reason`);
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
