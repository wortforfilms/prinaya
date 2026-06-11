/**
 * KBS recommendations — heuristic AIRecommendation generation over the graph.
 *
 * Strategy: nodes that co-occur in the same use cases / templates as the source
 * node are candidate recommendations, scored by co-occurrence frequency and
 * boosted when they belong to a complementary category (e.g. a Mandap pairs
 * with Floral and Lighting). Confidence is normalised to [0.5, 1].
 *
 * This is a rule-based preview engine, not a trained model — it stays inside the
 * CONTROLLED_PREVIEW gate.
 */
import type { KbsEntityType, KbsNode, KnowledgeGraph } from "./graph";

export type KbsRecommendation = {
  sourceNode: string;
  recommendation: string;
  recommendationName: string;
  confidence: number;
  reason: string;
};

const COMPLEMENTARY: Partial<Record<KbsEntityType, KbsEntityType[]>> = {
  Mandap: ["Floral", "Lighting"],
  Stage: ["Lighting", "Floral"],
  Floral: ["Mandap", "Lighting"],
  Lighting: ["Mandap", "Stage"],
  Vedi: ["Ritual"],
  Ritual: ["Vedi"]
};

const IGNORED: ReadonlySet<KbsEntityType> = new Set<KbsEntityType>(["Material", "Route", "Screen", "Board"]);

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function recommendForNode(graph: KnowledgeGraph, nodeId: string, limit = 5): KbsRecommendation[] {
  const source = graph.getNode(nodeId);
  if (!source) return [];

  // Contexts that reference/use the source (use cases, templates, vedis…).
  const contexts = [
    ...graph.inboundNodes(nodeId, "references"),
    ...graph.inboundNodes(nodeId, "uses"),
    ...graph.neighbors(nodeId, "requires")
  ];

  const counts = new Map<string, number>();
  for (const context of contexts) {
    for (const sibling of graph.neighbors(context.id)) {
      if (sibling.id === nodeId || IGNORED.has(sibling.type)) continue;
      counts.set(sibling.id, (counts.get(sibling.id) ?? 0) + 1);
    }
  }

  if (counts.size === 0) return [];
  const maxCount = Math.max(...counts.values());
  const complementaryTypes = new Set(COMPLEMENTARY[source.type] ?? []);

  const scored: KbsRecommendation[] = [];
  for (const [candidateId, count] of counts) {
    const candidate = graph.getNode(candidateId) as KbsNode;
    const base = 0.5 + 0.4 * (count / maxCount);
    const boost = complementaryTypes.has(candidate.type) ? 0.1 : 0;
    scored.push({
      sourceNode: nodeId,
      recommendation: candidateId,
      recommendationName: candidate.name,
      confidence: round2(Math.min(1, base + boost)),
      reason: complementaryTypes.has(candidate.type)
        ? `complementary ${candidate.type}; co-occurs in ${count} shared context(s)`
        : `co-occurs in ${count} shared context(s)`
    });
  }

  return scored
    .sort((a, b) => b.confidence - a.confidence || a.recommendationName.localeCompare(b.recommendationName))
    .slice(0, limit);
}
