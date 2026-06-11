/**
 * KBS surface builders — adapt the runtime knowledge graph into the shapes the
 * AI Co-Pilot and Board Composer surfaces render. Pure, server-safe, cached
 * graph; preview heuristics only (release gate preserved).
 */
import { kbs } from "./registry";
import { recommendForNode, type KbsRecommendation } from "./recommendations";
import type { KbsEntityType, KbsNode, KnowledgeGraph } from "./graph";
import { blockedCapabilities } from "../status";

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

export type CopilotSuggestionItem = { label: string; detail: string; status: KbsNode["status"] };
export type CopilotSuggestionGroup = { category: string; items: CopilotSuggestionItem[] };

export type CopilotPanel = {
  routePath: string;
  status: "READY";
  seeds: KbsSurfaceNodeRef[];
  recommendations: KbsRecommendation[];
  relatedKnowledge: KbsSurfaceNodeRef[];
  suggestions: CopilotSuggestionGroup[];
  summary: string;
  evidenceRef: string;
};

function buildCopilotSuggestions(graph: KnowledgeGraph, recommendations: KbsRecommendation[]): CopilotSuggestionGroup[] {
  const take = <T,>(arr: T[], n: number) => arr.slice(0, n);

  const mandaps = take(graph.nodesOfType("Mandap"), 3).map<CopilotSuggestionItem>((n) => ({
    label: n.name,
    detail: String(n.metadata.style ?? "mandap design"),
    status: n.status
  }));

  const vedis = graph.nodesOfType("Vedi").map<CopilotSuggestionItem>((n) => ({
    label: n.name,
    detail: `vastu ${metaString(n, ["vastu", "direction"], "East")} · agni ${metaString(n, ["agni", "zone"], "SE")}`,
    status: n.status
  }));

  const muhurats = take(
    graph.nodesOfType("Muhurat").map((n) => muhuratEntry(graph, n)).sort((a, b) => b.score - a.score),
    3
  ).map<CopilotSuggestionItem>((m) => ({ label: m.name, detail: `${m.window} · ${Math.round(m.score * 100)}%`, status: "READY" }));

  // Budget: estimated cost of the recommended asset set.
  let budgetTotal = 0;
  let budgetCount = 0;
  for (const rec of recommendations) {
    const node = graph.getNode(rec.recommendation);
    const inr = node && typeof node.metadata.estimatedInr === "number" ? node.metadata.estimatedInr : 0;
    if (inr > 0) {
      budgetTotal += inr;
      budgetCount += 1;
    }
  }
  const budget: CopilotSuggestionItem[] = [
    {
      label: budgetCount > 0 ? `≈ ₹${budgetTotal.toLocaleString("en-IN")}` : "Awaiting recommendations",
      detail: budgetCount > 0 ? `estimated across ${budgetCount} recommended asset(s)` : "no priced assets in current recommendations",
      status: "PARTIAL"
    }
  ];

  const vendors = take(graph.nodesOfType("Vendor"), 4).map<CopilotSuggestionItem>((n) => ({
    label: n.name,
    detail: `${String(n.metadata.city ?? "")} · live booking blocked`,
    status: n.status
  }));

  const layouts = take(graph.nodesOfType("Template"), 4).map<CopilotSuggestionItem>((n) => ({
    label: n.name,
    detail: `${String(n.metadata.assetCount ?? 0)} bound assets`,
    status: n.status
  }));

  const risk = blockedCapabilities.map<CopilotSuggestionItem>((cap) => ({
    label: cap.label,
    detail: cap.reason,
    status: "BLOCKED"
  }));

  return [
    { category: "Mandap", items: mandaps },
    { category: "Vedi", items: vedis },
    { category: "Muhurat", items: muhurats },
    { category: "Budget", items: budget },
    { category: "Vendor", items: vendors },
    { category: "Layout", items: layouts },
    { category: "Risk", items: risk }
  ].filter((group) => group.items.length > 0);
}

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
    suggestions: buildCopilotSuggestions(graph, recommendations),
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

// Canonical Board Composer page order (17 pages). Each maps to a Board node id.
const BOARD_PAGE_ORDER: { slug: string; title: string }[] = [
  { slug: "cover", title: "Cover" },
  { slug: "concept", title: "Concept" },
  { slug: "venue", title: "Venue" },
  { slug: "layout", title: "Layout" },
  { slug: "mandap", title: "Mandap" },
  { slug: "vedi", title: "Vedi" },
  { slug: "ritual-flow", title: "Ritual Flow" },
  { slug: "floral", title: "Floral" },
  { slug: "lighting", title: "Lighting" },
  { slug: "budget", title: "Budget" },
  { slug: "guest", title: "Guest" },
  { slug: "vendor", title: "Vendor" },
  { slug: "production", title: "Production" },
  { slug: "drone", title: "Drone" },
  { slug: "vr", title: "VR" },
  { slug: "render-gallery", title: "Render Gallery" },
  { slug: "evidence", title: "Evidence" }
];

const BOARD_ASSET_TYPES: ReadonlySet<KbsEntityType> = new Set<KbsEntityType>([
  "Asset",
  "Mandap",
  "Floral",
  "Lighting",
  "Venue"
]);

/** Board Composer: the canonical 17 pages, each with KBS-linked templates and asset reach. */
export function buildBoardComposerPanel(graph: KnowledgeGraph = kbs()): BoardComposerPanel {
  const boards: BoardComposerEntry[] = [];
  for (const page of BOARD_PAGE_ORDER) {
    const board = graph.getNode(`board:${page.slug}`);
    if (!board) continue;

    // Templates linked either direction (board -> template references, or template -> board references).
    const templateMap = new Map<string, KbsNode>();
    for (const node of [...graph.neighbors(board.id, "references"), ...graph.inboundNodes(board.id, "references")]) {
      if (node.type === "Template") templateMap.set(node.id, node);
    }
    const linkedTemplates = Array.from(templateMap.values());

    const assetIds = new Set<string>();
    for (const node of graph.neighbors(board.id, "references")) {
      if (BOARD_ASSET_TYPES.has(node.type)) assetIds.add(node.id);
    }
    for (const template of linkedTemplates) {
      for (const asset of graph.neighbors(template.id, "uses")) assetIds.add(asset.id);
    }

    boards.push({
      boardId: board.id,
      title: page.title,
      status: board.status,
      source: String(board.metadata.source ?? ""),
      bindings: Array.isArray(board.metadata.bindings) ? (board.metadata.bindings as string[]) : [],
      linkedTemplates: linkedTemplates.map(toRef),
      linkedAssetCount: assetIds.size
    });
  }

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

export type VediEntry = {
  id: string;
  name: string;
  vastuDirection: string;
  agniZone: string;
  pheraDirection: string;
  rituals: KbsSurfaceNodeRef[];
  muhurats: MuhuratEntry[];
};

export type MuhuratEntry = {
  id: string;
  name: string;
  window: string;
  direction: string;
  score: number;
  nakshatra: string | null;
  tithi: string | null;
};

export type VediFinderPanel = {
  status: "READY";
  vedis: VediEntry[];
  auspiciousNakshatras: KbsSurfaceNodeRef[];
  auspiciousTithis: KbsSurfaceNodeRef[];
  topMuhurat: MuhuratEntry | null;
  summary: string;
  evidenceRef: string;
};

function metaString(node: KbsNode, path: string[], fallback = ""): string {
  let value: unknown = node.metadata;
  for (const key of path) {
    value = value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined;
  }
  return typeof value === "string" ? value : fallback;
}

function muhuratEntry(graph: KnowledgeGraph, node: KbsNode): MuhuratEntry {
  const requirements = graph.neighbors(node.id, "requires");
  const nakshatra = requirements.find((n) => n.type === "Nakshatra") ?? null;
  const tithi = requirements.find((n) => n.type === "Tithi") ?? null;
  const score = typeof node.metadata.score === "number" ? node.metadata.score : 0;
  return {
    id: node.id,
    name: node.name,
    window: metaString(node, ["window"]),
    direction: metaString(node, ["direction"], "East"),
    score,
    nakshatra: nakshatra?.name ?? null,
    tithi: tithi?.name ?? null
  };
}

/** Vedi Finder: vedis with vastu/agni/phera, their rituals, and auspicious muhurat windows. */
export function buildVediFinderPanel(graph: KnowledgeGraph = kbs()): VediFinderPanel {
  const vedis: VediEntry[] = graph.nodesOfType("Vedi").map((vedi) => {
    const rituals = graph.neighbors(vedi.id, "linkedTo").filter((n) => n.type === "Ritual");
    const muhurats = graph
      .inboundNodes(vedi.id, "linkedTo")
      .filter((n) => n.type === "Muhurat")
      .map((node) => muhuratEntry(graph, node))
      .sort((a, b) => b.score - a.score);
    return {
      id: vedi.id,
      name: vedi.name,
      vastuDirection: metaString(vedi, ["vastu", "direction"], "East"),
      agniZone: metaString(vedi, ["agni", "zone"]),
      pheraDirection: metaString(vedi, ["phera", "direction"]),
      rituals: rituals.map(toRef),
      muhurats
    };
  });

  const allMuhurats = graph.nodesOfType("Muhurat").map((node) => muhuratEntry(graph, node));
  const topMuhurat = allMuhurats.sort((a, b) => b.score - a.score)[0] ?? null;

  return {
    status: "READY",
    vedis,
    auspiciousNakshatras: graph.nodesOfType("Nakshatra").filter((n) => n.metadata.auspiciousForMarriage).map(toRef),
    auspiciousTithis: graph.nodesOfType("Tithi").filter((t) => t.metadata.auspiciousForMarriage).map(toRef),
    topMuhurat,
    summary: `${vedis.length} vedi configurations, ${allMuhurats.length} muhurat windows, ${graph.nodesOfType("Nakshatra").length} auspicious nakshatras. Preview reference — not a certified panchang.`,
    evidenceRef: "release/evidence/kbs.json"
  };
}

export type HomepageUseCaseGroup = { group: string; count: number; examples: string[] };

export type HomepageSurface = {
  status: "READY";
  verdict: "CONTROLLED_PREVIEW_READY";
  productionReady: false;
  kbs: { nodes: number; relations: number; useCases: number; assets: number; entityTypes: number };
  useCaseGroups: HomepageUseCaseGroup[];
  vedi: { vedis: number; nakshatras: number; tithis: number; muhurats: number; topMuhurat: string | null };
  evidenceRef: string;
};

function groupForUseCaseCategory(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("guest")) return "Guest Management";
  if (c.includes("vendor")) return "Vendor Management";
  if (c.includes("production") || c.includes("venue zones") || c.includes("utilities")) return "Production";
  if (c.includes("drone") || c.includes("vr") || c.includes("ai outputs")) return "Filmy Studio";
  if (c.includes("board") || c.includes("template")) return "Board Generation";
  return "Design";
}

/** Homepage command-surface data: live KBS evidence + grouped use cases + vedi summary. */
export function buildHomepageSurface(graph: KnowledgeGraph = kbs()): HomepageSurface {
  const stats = graph.stats();
  const assets = ["Asset", "Mandap", "Floral", "Lighting", "Venue", "Stage"].reduce(
    (sum, type) => sum + (stats.byType[type] ?? 0),
    0
  );

  // Group the use cases into the seven command buckets.
  const groups = new Map<string, { count: number; examples: string[] }>();
  const ensure = (g: string) => {
    if (!groups.has(g)) groups.set(g, { count: 0, examples: [] });
    return groups.get(g)!;
  };
  for (const useCase of graph.nodesOfType("UseCase")) {
    const bucket = ensure(groupForUseCaseCategory(useCase.category));
    bucket.count += 1;
    if (bucket.examples.length < 3) bucket.examples.push(useCase.name);
  }
  // Vedi Planning is sourced from the panchanga/ritual layers, not the asset use cases.
  const vediCount = graph.nodesOfType("Vedi").length + graph.nodesOfType("Ritual").length + graph.nodesOfType("Muhurat").length;
  const vediBucket = ensure("Vedi Planning");
  vediBucket.count = vediCount;
  vediBucket.examples = graph.nodesOfType("Ritual").slice(0, 3).map((n) => n.name);

  const useCaseGroups: HomepageUseCaseGroup[] = Array.from(groups.entries())
    .map(([group, value]) => ({ group, count: value.count, examples: value.examples }))
    .sort((a, b) => b.count - a.count);

  const topMuhurat = graph
    .nodesOfType("Muhurat")
    .map((node) => muhuratEntry(graph, node))
    .sort((a, b) => b.score - a.score)[0];

  return {
    status: "READY",
    verdict: "CONTROLLED_PREVIEW_READY",
    productionReady: false,
    kbs: {
      nodes: stats.nodeCount,
      relations: stats.relationCount,
      useCases: stats.byType.UseCase ?? 0,
      assets,
      entityTypes: Object.keys(stats.byType).length
    },
    useCaseGroups,
    vedi: {
      vedis: graph.nodesOfType("Vedi").length,
      nakshatras: graph.nodesOfType("Nakshatra").length,
      tithis: graph.nodesOfType("Tithi").length,
      muhurats: graph.nodesOfType("Muhurat").length,
      topMuhurat: topMuhurat?.name ?? null
    },
    evidenceRef: "release/evidence/kbs.json"
  };
}

export type VastuCell = { direction: string; lord: string; use: string; favored: boolean };

export type LookupRow = { id: string; name: string; detail: string; auspicious: boolean };

export type VediIntelligence = {
  status: "READY";
  finder: VediFinderPanel;
  vastuGrid: VastuCell[];
  nakshatras: LookupRow[];
  tithis: LookupRow[];
  muhurats: MuhuratEntry[];
  evidenceRef: string;
};

// Ashtadik vastu zones (3x3 grid, Brahmasthan at centre).
const VASTU_GRID: VastuCell[] = [
  { direction: "NW", lord: "Vayu", use: "Storage / guest staging", favored: false },
  { direction: "N", lord: "Kubera", use: "Treasury / gifts table", favored: true },
  { direction: "NE", lord: "Ishanya", use: "Kalash, prayer, water", favored: true },
  { direction: "W", lord: "Varuna", use: "Dining / catering", favored: false },
  { direction: "Center", lord: "Brahma", use: "Open Brahmasthan — keep clear", favored: true },
  { direction: "E", lord: "Indra", use: "Vedi facing, entry axis", favored: true },
  { direction: "SW", lord: "Nairutya", use: "Heavy structure / stage anchor", favored: false },
  { direction: "S", lord: "Yama", use: "Service / back-of-house", favored: false },
  { direction: "SE", lord: "Agni", use: "Sacred fire (agni kund)", favored: true }
];

function metaBool(node: KbsNode, key: string): boolean {
  return node.metadata[key] === true;
}

function metaNumberOrString(node: KbsNode, key: string): string {
  const value = node.metadata[key];
  return value === undefined || value === null ? "" : String(value);
}

/** Full Vedi Intelligence surface for /hemant-samwat-vedi. */
export function buildVediIntelligence(graph: KnowledgeGraph = kbs()): VediIntelligence {
  const nakshatras: LookupRow[] = graph
    .nodesOfType("Nakshatra")
    .map((node) => ({
      id: node.id,
      name: node.name,
      detail: `Lord ${metaNumberOrString(node, "lord")} · ${metaNumberOrString(node, "primaryRashi")}`,
      auspicious: metaBool(node, "auspiciousForMarriage")
    }));

  const tithis: LookupRow[] = graph.nodesOfType("Tithi").map((node) => ({
    id: node.id,
    name: node.name,
    detail: `${metaNumberOrString(node, "paksha")} Paksha · day ${metaNumberOrString(node, "number")}`,
    auspicious: metaBool(node, "auspiciousForMarriage")
  }));

  const muhurats = graph
    .nodesOfType("Muhurat")
    .map((node) => muhuratEntry(graph, node))
    .sort((a, b) => b.score - a.score);

  return {
    status: "READY",
    finder: buildVediFinderPanel(graph),
    vastuGrid: VASTU_GRID,
    nakshatras,
    tithis,
    muhurats,
    evidenceRef: "release/evidence/kbs.json"
  };
}
