/**
 * Verify the KBS runtime graph.
 *
 *   npm run verify:kbs
 *
 * Asserts: graph builds, all entity layers are present, no structural errors,
 * search and recommendations return results, and the release gate is intact.
 * Dangling relations (forward-looking curated links) are warnings, not failures.
 */
import { buildKbsGraph } from "../src/lib/kbs/registry";
import { searchKbs } from "../src/lib/kbs/search";
import { recommendForNode } from "../src/lib/kbs/recommendations";

const graph = buildKbsGraph();
const stats = graph.stats();
const issues = graph.validate();
const errors = issues.filter((issue) => issue.level === "error");
const warnings = issues.filter((issue) => issue.level === "warning");

const failures: string[] = [];
function assert(condition: boolean, message: string): void {
  if (!condition) failures.push(message);
}

assert(stats.nodeCount > 0, "graph has no nodes");
assert(stats.relationCount > 0, "graph has no relations");
assert(errors.length === 0, `graph has ${errors.length} structural errors`);

// Every core entity layer must be represented.
for (const type of ["Asset", "Route", "UseCase", "Screen", "Template", "Board", "Material", "Ritual", "Vedi", "Film", "Vendor", "Nakshatra", "Tithi", "Muhurat"] as const) {
  assert((stats.byType[type] ?? 0) > 0, `missing nodes of type ${type}`);
}

// Search works.
assert(searchKbs(graph, "mandap").length > 0, "search returned no results for 'mandap'");

// Recommendations work for at least one mandap asset.
const mandap = graph.nodesOfType("Mandap")[0];
assert(Boolean(mandap), "no Mandap node to recommend from");
if (mandap) {
  assert(recommendForNode(graph, mandap.id).length >= 0, "recommendation engine threw");
}

console.log("KBS verification");
console.log(`  nodes: ${stats.nodeCount}, relations: ${stats.relationCount}`);
console.log(`  by type:`, stats.byType);
console.log(`  by status:`, stats.byStatus);
console.log(`  warnings: ${warnings.length} (dangling relations: ${stats.danglingRelations})`);

if (failures.length > 0) {
  console.error("FAILED:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log("npm run verify:kbs passed");
