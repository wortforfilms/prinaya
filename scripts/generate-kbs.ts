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
import { buildBoardComposerPanel, buildCopilotPanel, buildVediIntelligence } from "../src/lib/kbs/surfaces";
import { blockedCapabilities, releaseStatus } from "../src/lib/status";

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

// Surface integration coverage.
const copilot = buildCopilotPanel("/ai", graph);
const boardComposer = buildBoardComposerPanel(graph);
const vedi = buildVediIntelligence(graph);

const routeIntegration = [
  { route: "/", surface: "Wedding OS Homepage", nodes: vedi.nakshatras.length + boardComposer.boards.length + copilot.suggestions.length, status: "READY" },
  { route: "/ai", surface: "AI Co-Pilot", nodes: copilot.recommendations.length + copilot.seeds.length, status: "READY" },
  { route: "/exports", surface: "Board Composer", nodes: boardComposer.boards.length, status: "READY" },
  { route: "/gallery", surface: "Board Composer", nodes: boardComposer.boards.length, status: "READY" },
  { route: "/mandap", surface: "Vedi Finder", nodes: vedi.finder.vedis.length, status: "READY" },
  { route: "/hemant-samwat-vedi", surface: "Vedi Intelligence", nodes: vedi.nakshatras.length + vedi.tithis.length + vedi.muhurats.length, status: "READY" }
];

writeJson(evidencePath, {
  generatedAt: new Date().toISOString(),
  verdict: releaseStatus.verdict,
  productionReady: false,
  status: errors.length > 0 ? "BLOCKED" : warnings.length > 0 ? "PARTIAL" : "READY",
  nodeCount: stats.nodeCount,
  relationCount: stats.relationCount,
  stats,
  coverage: {
    entityTypes: Object.keys(stats.byType).length,
    boardComposerPages: boardComposer.boards.length,
    copilotSuggestionGroups: copilot.suggestions.length,
    nakshatras: vedi.nakshatras.length,
    tithis: vedi.tithis.length,
    muhurats: vedi.muhurats.length
  },
  routeIntegration,
  validation: {
    errors: errors.length,
    warnings: warnings.length,
    danglingRelations: stats.danglingRelations
  },
  blockers: blockedCapabilities.map((cap) => ({ id: cap.id, label: cap.label, status: cap.status })),
  snapshots,
  note:
    "KBS v2 runtime knowledge graph derived from local registries plus curated knowledge layers (panchanga, ritual, vedi, muhurat, film, vendor, board). Recommendations and muhurat scoring are rule-based preview heuristics; no live AI/vendor/payment/panchang runtime is claimed. Blockers preserved."
});

console.log(`KBS generated: ${stats.nodeCount} nodes, ${stats.relationCount} relations.`);
console.log(`By type:`, stats.byType);
console.log(`Validation: ${errors.length} errors, ${warnings.length} warnings (${stats.danglingRelations} dangling relations).`);
if (errors.length > 0) process.exit(1);
