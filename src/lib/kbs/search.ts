/**
 * KBS search — ranked text search across the knowledge graph with optional
 * type/status/category filters.
 */
import type { KbsEntityType, KbsNode, KbsStatus, KnowledgeGraph } from "./graph";

export type KbsSearchOptions = {
  type?: KbsEntityType;
  status?: KbsStatus;
  category?: string;
  limit?: number;
};

export type KbsSearchHit = { node: KbsNode; score: number };

function scoreNode(node: KbsNode, terms: string[]): number {
  const name = node.name.toLowerCase();
  const category = node.category.toLowerCase();
  const description = node.description.toLowerCase();
  const idText = node.id.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (name === term) score += 10;
    if (name.includes(term)) score += 5;
    if (idText.includes(term)) score += 3;
    if (category.includes(term)) score += 2;
    if (description.includes(term)) score += 1;
  }
  return score;
}

export function searchKbs(graph: KnowledgeGraph, query: string, options: KbsSearchOptions = {}): KbsSearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const limit = options.limit ?? 20;
  const hits: KbsSearchHit[] = [];

  for (const node of graph.nodes) {
    if (options.type && node.type !== options.type) continue;
    if (options.status && node.status !== options.status) continue;
    if (options.category && node.category !== options.category) continue;
    const score = terms.length === 0 ? 1 : scoreNode(node, terms);
    if (score > 0) hits.push({ node, score });
  }

  return hits.sort((a, b) => b.score - a.score || a.node.name.localeCompare(b.node.name)).slice(0, limit);
}
