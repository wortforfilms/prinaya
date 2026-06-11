/**
 * Generate KBS snapshots + evidence from the runtime graph.
 *
 *   npm run kbs:generate
 *
 * Writes per-domain snapshots under data/kbs/ and a release evidence record.
 * Curated source files (rituals/vedi/films/vendors.json) are NOT overwritten.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildKbsGraph } from "../src/lib/kbs/registry";
import type { KbsEntityType, KbsNode } from "../src/lib/kbs/graph";
import { releaseStatus } from "../src/lib/status";

const root = new URL("../", import.meta.url);
const kbsDir = fileURLToPath(new URL("data/kbs/", root));
const evidencePath = fileURLToPath(new URL("release/evidence/kbs.json", root));

mkdirSync(kbsDir, { recursive: true });

const graph = buildKbsGraph();
const stats = graph.stats();
const issues = graph.validate();
const errors = issues.filter((issue) => issue.level === "error");
const warnings = issues.filter((issue) => issue.level === "warning");

function writeJson(path: string, data: unknown): void {
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

function snapshot(name: string, types: KbsEntityType[]): number {
  const nodes = graph.nodes.filter((node: KbsNode) => types.includes(node.type));
  writeJson(fileURLToPath(new URL(`data/kbs/${name}.json`, root)), {
    generatedAt: new Date().toISOString(),
    count: nodes.length,
    nodes
  });
  return nodes.length;
}

const snapshots = {
  assets: snapshot("assets", ["Asset", "Mandap", "Floral", "Lighting", "Venue", "Stage"]),
  screens: snapshot("screens", ["Screen"]),
  usecases: snapshot("usecases", ["UseCase"]),
  templates: snapshot("templates", ["Template"]),
  boards: snapshot("boards", ["Board"])
};

writeJson(fileURLToPath(new URL("data/kbs/graph.json", root)), {
  generatedAt: new Date().toISOString(),
  stats,
  nodes: graph.nodes
});

writeJson(evidencePath, {
  generatedAt: new Date().toISOString(),
  verdict: releaseStatus.verdict,
  productionReady: false,
  status: errors.length > 0 ? "BLOCKED" : warnings.length > 0 ? "PARTIAL" : "READY",
  stats,
  validation: {
    errors: errors.length,
    warnings: warnings.length,
    danglingRelations: stats.danglingRelations
  },
  snapshots,
  note:
    "KBS v1.0 runtime knowledge graph derived from local registries plus curated knowledge layers. Recommendations are rule-based preview heuristics; no live AI/vendor/payment runtime is claimed."
});

console.log(`KBS generated: ${stats.nodeCount} nodes, ${stats.relationCount} relations.`);
console.log(`By type:`, stats.byType);
console.log(`Validation: ${errors.length} errors, ${warnings.length} warnings (${stats.danglingRelations} dangling relations).`);
if (errors.length > 0) process.exit(1);
