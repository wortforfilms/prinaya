/**
 * Verify the KBS Explorer batch.
 *
 *   npm run verify:kbs-explorers
 *
 * Checks: every explorer builder returns a populated panel (metrics, sections,
 * activeSteps, useCases, runtimeCoverage, kbsRefs, evidenceRef), every explorer
 * route resolves to a page on disk, and the live graph has no dangling relations.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  buildBoardsExplorer,
  buildFilmsExplorer,
  buildScreensExplorer,
  buildTemplatesExplorer,
  buildUseCasesExplorer,
  buildVendorsExplorer,
  type SurfacePanel
} from "../src/lib/surfaces/runtime-surfaces";
import { buildKbsGraph } from "../src/lib/kbs/registry";

const APP = join(process.cwd(), "src", "app");

const explorers: { route: string; build: () => SurfacePanel }[] = [
  { route: "/kbs/templates", build: buildTemplatesExplorer },
  { route: "/kbs/usecases", build: buildUseCasesExplorer },
  { route: "/kbs/screens", build: buildScreensExplorer },
  { route: "/kbs/boards", build: buildBoardsExplorer },
  { route: "/kbs/vendors", build: buildVendorsExplorer },
  { route: "/kbs/films", build: buildFilmsExplorer }
];

const failures: string[] = [];
const assert = (cond: boolean, msg: string) => {
  if (!cond) failures.push(msg);
};

for (const { route, build } of explorers) {
  const segs = route.replace(/^\//, "").split("/");
  assert(existsSync(join(APP, ...segs, "page.tsx")), `${route} -> no page.tsx`);
  const p = build();
  assert(Boolean(p.title && p.subtitle), `${route}: missing title/description`);
  assert(p.metrics.length > 0, `${route}: no metrics`);
  assert(p.sections.length > 0 && p.sections.every((s) => s.rows.length > 0), `${route}: empty sections`);
  assert(Array.isArray(p.activeSteps) && p.activeSteps.length > 0, `${route}: no activeSteps`);
  assert(Array.isArray(p.useCases) && p.useCases.length > 0, `${route}: no useCases`);
  assert(typeof p.runtimeCoverage === "number", `${route}: no runtimeCoverage`);
  assert(p.kbsRefs.length > 0, `${route}: no kbsRefs`);
  assert(Boolean(p.evidenceRef), `${route}: no evidenceRef`);
}

const stats = buildKbsGraph().stats();
assert(stats.danglingRelations === 0, `graph has ${stats.danglingRelations} dangling relations`);

console.log("KBS explorer verification");
console.log(`  explorers: ${explorers.length} | graph nodes: ${stats.nodeCount} | dangling: ${stats.danglingRelations}`);

if (failures.length > 0) {
  console.error("FAILED:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("npm run verify:kbs-explorers passed");
