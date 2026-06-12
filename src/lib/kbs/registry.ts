/**
 * KBS v1.0 registry — assembles the runtime knowledge graph.
 *
 * Derives typed nodes from the existing first-class registries (assets, routes,
 * use cases, screens, templates, boards, materials) and merges the curated
 * knowledge layers (rituals, vedis, films, vendors) from `data/kbs/*.json`,
 * wiring typed relations between them.
 */
import { weddingAssets } from "../wedding-asset-library";
import { routeMatrix } from "../route-matrix";
import { allCategoryDemoUseCases } from "../category-demo-usecases";
import { templateRuntimeCatalog } from "../template-runtime";
import { boardPages } from "../board-runtime";
import { materialPalette } from "../data-frames";

import screensJson from "../../../data/screens/preview-ready-screens.json";
import ritualsJson from "../../../data/kbs/rituals.json";
import vediJson from "../../../data/kbs/vedi.json";
import filmsJson from "../../../data/kbs/films.json";
import vendorsJson from "../../../data/kbs/vendors.json";
import muhuratJson from "../../../data/kbs/muhurat.json";
import nakshatraJson from "../../../data/kbs/nakshatra.json";
import tithiJson from "../../../data/kbs/tithi.json";
import pakshaJson from "../../../data/kbs/paksha.json";
import yogaJson from "../../../data/kbs/yoga.json";
import karanaJson from "../../../data/kbs/karana.json";
import rashiJson from "../../../data/kbs/rashi.json";
import grahaJson from "../../../data/kbs/graha.json";
import boardsJson from "../../../data/kbs/boards.json";

import {
  KnowledgeGraph,
  normalizeNode,
  type KbsEntityType,
  type KbsNode,
  type KbsRelationKind,
  type KbsStatus
} from "./graph";
import { id, linkedTo, partOf, references, rel, uses } from "./relations";

type ScreenLink = {
  id: string;
  category: string;
  useCaseId: string;
  title: string;
  route: string;
  image: string;
  source: string;
  status: string;
};

type RawRelation = { kind: string; to: string; weight?: number };
type RawNode = {
  id: string;
  type: string;
  category?: string;
  name: string;
  description?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  relations?: RawRelation[];
  evidence?: string[];
};
type CuratedFile = { evidence?: string; nodes: RawNode[] };

const ASSET_EVIDENCE = "data/assets/wedding-cad-assets.json";

/** Normalise a module route path ("/mandap/*" -> "/mandap") for stable ids. */
function routePath(path: string): string {
  return path.replace("/*", "") || "/";
}

function assetEntityType(category: string): KbsEntityType {
  switch (category) {
    case "Mandaps":
      return "Mandap";
    case "Floral Installations":
    case "Flower Types":
      return "Floral";
    case "Lighting Fixtures":
    case "Decorative Lighting":
      return "Lighting";
    case "Venue Zones":
      return "Venue";
    default:
      return "Asset";
  }
}

function curatedNodes(file: CuratedFile): KbsNode[] {
  return file.nodes.map((node) =>
    normalizeNode(
      {
        id: node.id,
        type: node.type as KbsEntityType,
        category: node.category,
        name: node.name,
        description: node.description,
        status: node.status as KbsStatus | undefined,
        metadata: node.metadata,
        relations: (node.relations ?? []).map((r) => rel(r.kind as KbsRelationKind, r.to, r.weight)),
        evidence: node.evidence
      },
      file.evidence
    )
  );
}

/** Build the full KBS graph from all sources. Deduplicates by id (first wins). */
export function buildKbsGraph(): KnowledgeGraph {
  const collected = new Map<string, KbsNode>();
  const add = (node: KbsNode) => {
    if (!collected.has(node.id)) collected.set(node.id, node);
  };

  // --- Materials -----------------------------------------------------------
  for (const material of materialPalette) {
    add(
      normalizeNode({
        id: id.material(material.id),
        type: "Material",
        category: "Material",
        name: material.label,
        description: `${material.finish} finish — ${material.usage}`,
        metadata: { color: material.color, finish: material.finish, usage: material.usage }
      }, "src/lib/data-frames.ts")
    );
  }

  // --- Assets --------------------------------------------------------------
  const validRouteIds = new Set(routeMatrix.map((route) => id.route(routePath(route.path))));
  for (const asset of weddingAssets) {
    const routeLinks = asset.usableInRoutes
      .map((path) => id.route(routePath(path)))
      .filter((routeId) => validRouteIds.has(routeId))
      .map((routeId) => linkedTo(routeId));
    add(
      normalizeNode({
        id: id.asset(asset.id),
        type: assetEntityType(asset.category),
        category: asset.category,
        name: asset.name,
        description: asset.description,
        status: asset.status,
        metadata: {
          subcategory: asset.subcategory,
          style: asset.style,
          starterKind: asset.starterKind,
          estimatedInr: asset.estimatedInr,
          previewType: asset.previewType,
          dimensions: asset.dimensions
        },
        relations: [uses(id.material(asset.materialId)), ...routeLinks],
        evidence: [asset.evidenceRef, ASSET_EVIDENCE]
      })
    );
  }

  // --- Routes --------------------------------------------------------------
  for (const route of routeMatrix) {
    add(
      normalizeNode({
        id: id.route(routePath(route.path)),
        type: "Route",
        category: route.kind,
        name: route.title,
        description: route.description,
        status: route.status,
        metadata: { path: routePath(route.path), primaryFrame: route.primaryFrame, capabilities: route.capabilities }
      }, "src/lib/route-matrix.ts")
    );
  }

  // Standalone runtime routes (not in the matrix, but real pages referenced by screens/use cases).
  for (const runtime of [
    { path: "/cad/editor", title: "CAD Editor", caps: ["scene canvas", "layers", "insertion", "preview DXF"] },
    { path: "/cad/studio", title: "CAD Studio", caps: ["2D plan", "3D view", "elevation", "layers", "preview JSON export"] },
    { path: "/cad/3d", title: "3D Designer Studio", caps: ["3D scene", "asset library", "materials", "presets", "preview render"] },
    { path: "/ai/studio", title: "AI Generator Studio", caps: ["text-to-image preview", "moodboard", "variations", "preview only"] },
    { path: "/exports/studio", title: "Board Composer Studio", caps: ["board pages", "KBS connections", "preview export"] },
    { path: "/surfaces", title: "Surface Registry", caps: ["SPA surface index", "status registry", "route map"] },
    { path: "/hemant-samwat-vedi", title: "Vedi Intelligence", caps: ["orientation", "vastu grid", "vedi", "muhurat lookup"] },
    { path: "/kbs/graph", title: "KBS Graph Explorer", caps: ["graph", "entity types"] },
    { path: "/kbs/rituals", title: "Ritual Explorer", caps: ["rituals", "vedi links"] },
    { path: "/kbs/muhurat", title: "Muhurat Explorer", caps: ["muhurat", "nakshatra", "tithi"] },
    { path: "/kbs/nakshatra", title: "Nakshatra Explorer", caps: ["nakshatra", "graha", "rashi"] },
    { path: "/guests/rsvp", title: "RSVP", caps: ["guest response", "sections"] },
    { path: "/guests/seating", title: "Seating Planner", caps: ["seat zones", "capacity"] },
    { path: "/guests/hospitality", title: "Hospitality Planner", caps: ["accommodation", "transport"] },
    { path: "/vendors/manager", title: "Vendor Manager", caps: ["vendor directory", "demo"] },
    { path: "/vendors/procurement", title: "Procurement", caps: ["budget lines", "preview"] },
    { path: "/vendors/contracts", title: "Contract Manager", caps: ["contracts blocked"] },
    { path: "/filmy/storyboard", title: "Storyboard", caps: ["shots", "film"] },
    { path: "/filmy/shots", title: "Shot Planner", caps: ["shots", "film"] },
    { path: "/filmy/delivery", title: "Delivery Manager", caps: ["deliverables", "preview"] },
    { path: "/twin/venue", title: "Venue Twin", caps: ["venue model", "preview"] },
    { path: "/twin/guest", title: "Guest Twin", caps: ["guest model", "preview"] },
    { path: "/twin/vendor", title: "Vendor Twin", caps: ["vendor model", "preview"] },
    { path: "/twin/production", title: "Production Twin", caps: ["production model", "preview"] }
  ]) {
    add(
      normalizeNode({
        id: id.route(runtime.path),
        type: "Route",
        category: "runtime",
        name: runtime.title,
        description: `${runtime.title} runtime route.`,
        status: "READY",
        metadata: { path: runtime.path, capabilities: runtime.caps }
      }, "src/app")
    );
  }

  // --- Screens -------------------------------------------------------------
  const screenLinks = (screensJson as { links: ScreenLink[] }).links;
  for (const link of screenLinks) {
    add(
      normalizeNode({
        id: id.screen(link.id),
        type: "Screen",
        category: link.category,
        name: link.title,
        description: `Preview frame on ${link.route}`,
        status: (link.status as KbsStatus) ?? "READY",
        metadata: { route: link.route, image: link.image, source: link.source },
        relations: [linkedTo(id.route(routePath(link.route))), partOf(id.useCase(link.useCaseId))]
      }, "data/screens/preview-ready-screens.json")
    );
  }

  // --- Use cases -----------------------------------------------------------
  for (const useCase of allCategoryDemoUseCases) {
    const relations = [
      linkedTo(id.route(routePath(useCase.route))),
      ...useCase.assetRefs.map((ref) => references(id.asset(ref.id))),
      ...screenLinks
        .filter((link) => link.useCaseId === useCase.id)
        .map((link) => references(id.screen(link.id)))
    ];
    add(
      normalizeNode({
        id: id.useCase(useCase.id),
        type: "UseCase",
        category: useCase.category,
        name: useCase.title,
        description: useCase.summary,
        status: useCase.status,
        metadata: {
          route: useCase.route,
          routeTitle: useCase.routeTitle,
          owner: useCase.owner,
          stage: useCase.stage,
          steps: useCase.steps,
          blockedNotes: useCase.blockedNotes
        },
        relations
      }, "data/usecases/category-demo-usecases.json")
    );
  }

  // --- Templates -----------------------------------------------------------
  for (const template of templateRuntimeCatalog) {
    add(
      normalizeNode({
        id: id.template(template.id),
        type: "Template",
        category: "Template",
        name: template.label,
        description: `Runtime template with ${template.assetIds.length} bound assets and a ${template.board.pages.length}-page board.`,
        status: "READY",
        metadata: { assetCount: template.assetIds.length, boardId: template.board.id },
        relations: [
          ...template.assetIds.map((assetId) => uses(id.asset(assetId))),
          ...template.board.pages.map((page) => references(id.board(page.id)))
        ]
      }, "src/lib/template-runtime.ts")
    );
  }

  // --- Boards --------------------------------------------------------------
  for (const page of boardPages) {
    add(
      normalizeNode({
        id: id.board(page.id),
        type: "Board",
        category: "Board",
        name: `${page.title} Board`,
        description: `Board page sourced from ${page.source}.`,
        status: page.status,
        metadata: { source: page.source, bindings: page.bindings }
      }, "src/lib/board-runtime.ts")
    );
  }

  // --- Curated knowledge layers -------------------------------------------
  const curatedFiles = [
    grahaJson,
    rashiJson,
    pakshaJson,
    nakshatraJson,
    tithiJson,
    yogaJson,
    karanaJson,
    vediJson,
    muhuratJson,
    ritualsJson,
    filmsJson,
    vendorsJson,
    boardsJson
  ] as CuratedFile[];
  for (const file of curatedFiles) {
    for (const node of curatedNodes(file)) add(node);
  }

  const graph = new KnowledgeGraph(Array.from(collected.values()));
  linkCrossDomain(graph);
  return graph;
}

/**
 * Phase-3 cross-domain links that span derived + curated layers:
 * Mandap ↔ Vedi, and Ritual ↔ Muhurat (bridged by their shared vedi).
 */
function linkCrossDomain(graph: KnowledgeGraph): void {
  const vedis = graph.nodesOfType("Vedi");
  const mandaps = graph.nodesOfType("Mandap").slice(0, 3);

  for (const vedi of vedis) {
    for (const mandap of mandaps) {
      graph.addRelation(vedi.id, linkedTo(mandap.id));
      graph.addRelation(mandap.id, linkedTo(vedi.id));
    }
  }

  for (const ritual of graph.nodesOfType("Ritual")) {
    const vedi = graph.neighbors(ritual.id, "requires").find((node) => node.type === "Vedi");
    if (!vedi) continue;
    for (const muhurat of graph.inboundNodes(vedi.id, "linkedTo")) {
      if (muhurat.type === "Muhurat") graph.addRelation(ritual.id, references(muhurat.id));
    }
  }
}

/** Singleton runtime graph for the app. */
let cached: KnowledgeGraph | null = null;
export function kbs(): KnowledgeGraph {
  if (!cached) cached = buildKbsGraph();
  return cached;
}
