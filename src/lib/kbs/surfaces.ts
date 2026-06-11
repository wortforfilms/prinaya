/**
 * KBS surface builders — adapt the runtime knowledge graph into the shapes the
 * AI Co-Pilot and Board Composer surfaces render. Pure, server-safe, cached
 * graph; preview heuristics only (release gate preserved).
 */
import { kbs } from "./registry";
import { recommendForNode, type KbsRecommendation } from "./recommendations";
import type { KbsEntityType, KbsNode, KnowledgeGraph } from "./graph";

function routeNodeId(routePath: string): string {
  return `route:${routePath.replace("/*", "") || "/"}`;
}

const SEED_TYPES: ReadonlySet<KbsEntityType> = new Set<KbsEntityType>([
  "UseCase",
  "Mandap",
  "Floral",
  "Lighting",
  "Asset",
  "Venue",
  "Film",
  "Vendor"
]);

const KNOWLEDGE_TYPES: ReadonlySet<KbsEntityType> = new Set<KbsEntityType>(["Ritual", "Vedi", "Film", "Material"]);

export type KbsSurfaceNodeRef = { id: string; name: string; type: KbsEntityType; status: KbsNode["status"] };

export type CopilotPanel = {
  routePath: string;
  status: "READY";
  seeds: KbsSurfaceNodeRef[];
  recommendations: KbsRecommendation[];
  relatedKnowledge: KbsSurfaceNodeRef[];
  summary: string;
  evidenceRef: string;
};

function toRef(node: KbsNode): KbsSurfaceNodeRef {
  return { id: node.id, name: node.name, type: node.type, status: node.status };
}

/** AI Co-Pilot: knowledge-graph-seeded recommendations + related ritual/film/material knowledge. */
export function buildCopilotPanel(routePath: string, graph: KnowledgeGraph = kbs()): CopilotPanel {
  const routeId = routeNodeId(routePath);

  // Nodes that link to this route (use cases, screens, vendors, films...).
  const linked = graph.has(routeId) ? graph.inboundNodes(routeId) : [];
  let seeds = linked.filter((node) => SEED_TYPES.has(node.type));

  // Fallback: seed from the project's mandaps so /ai always has signal.
  if (seeds.length === 0) {
    seeds = graph.nodesOfType("Mandap").slice(0, 4);
  }

  // Aggregate recommendations across seeds, keeping the strongest confidence per target.
  const best = new Map<string, KbsRecommendation>();
  for (const seed of seeds) {
    for (const rec of recommendForNode(graph, seed.id, 6)) {
      const existing = best.get(rec.recommendation);
      if (!existing || rec.confidence > existing.confidence) best.set(rec.recommendation, rec);
    }
  }
  const recommendations = Array.from(best.values())
    .sort((a, b) => b.confidence - a.confidence || a.recommendationName.localeCompare(b.recommendationName))
    .slice(0, 8);

  // Related knowledge within 2 hops of the seeds.
  const relatedKnowledge: KbsSurfaceNodeRef[] = [];
  const seen = new Set<string>();
  for (const seed of seeds) {
    for (const near of graph.traverse(seed.id, 2)) {
      if (KNOWLEDGE_TYPES.has(near.type) && !seen.has(near.id)) {
        seen.add(near.id);
        relatedKnowledge.push(toRef(near));
      }
    }
  }

  return {
    routePath: routePath.replace("/*", "") || "/",
    status: "READY",
    seeds: seeds.slice(0, 8).map(toRef),
    recommendations,
    relatedKnowledge: relatedKnowledge.slice(0, 8),
    summary: `${recommendations.length} graph-derived recommendations from ${seeds.length} seed node(s). Rule-based preview heuristics — no live AI model.`,
    evidenceRef: "release/evidence/kbs.json"
  };
}

export type BoardComposerEntry = {
  boardId: string;
  title: string;
  status: KbsNode["status"];
  source: string;
  bindings: string[];
  linkedTemplates: KbsSurfaceNodeRef[];
  linkedAssetCount: number;
};

export type BoardComposerPanel = {
  status: "READY";
  pipeline: ["Scene", "Render", "Board Composer", "PDF Package"];
  boards: BoardComposerEntry[];
  templateCount: number;
  assetCount: number;
  useCaseCount: number;
  evidenceRef: string;
};

/** Board Composer: each board page with its KBS-linked templates and asset reach. */
export function buildBoardComposerPanel(graph: KnowledgeGraph = kbs()): BoardComposerPanel {
  const boards: BoardComposerEntry[] = graph.nodesOfType("Board").map((board) => {
    const linkedTemplates = graph.inboundNodes(board.id, "references").filter((node) => node.type === "Template");
    const assetIds = new Set<string>();
    for (const template of linkedTemplates) {
      for (const asset of graph.neighbors(template.id, "uses")) assetIds.add(asset.id);
    }
    return {
      boardId: board.id,
      title: board.name,
      status: board.status,
      source: String(board.metadata.source ?? ""),
      bindings: Array.isArray(board.metadata.bindings) ? (board.metadata.bindings as string[]) : [],
      linkedTemplates: linkedTemplates.map(toRef),
      linkedAssetCount: assetIds.size
    };
  });

  const stats = graph.stats();
  const assetCount = ["Asset", "Mandap", "Floral", "Lighting", "Venue", "Stage"].reduce(
    (sum, type) => sum + (stats.byType[type] ?? 0),
    0
  );

  return {
    status: "READY",
    pipeline: ["Scene", "Render", "Board Composer", "PDF Package"],
    boards,
    templateCount: stats.byType.Template ?? 0,
    assetCount,
    useCaseCount: stats.byType.UseCase ?? 0,
    evidenceRef: "release/evidence/kbs.json"
  };
}
