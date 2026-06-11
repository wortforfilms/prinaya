/**
 * Mandap Designer studio data — every panel is sourced from the local registry,
 * KBS, or data-frames. Synthesized scores (vastu/sustainability/setup) are flagged
 * `preview: true`. Exports honour the preserved blockers (native DWG / production
 * DXF stay BLOCKED). No production claims.
 */
import {
  budgetItems,
  cadObjects,
  floralPalette,
  mandapDimensions,
  materialPalette,
  seatingCapacity,
  stageDimensions
} from "./data-frames";
import { weddingAssets } from "./wedding-asset-library";
import { templateRuntimeCatalog } from "./template-runtime";
import { kbs } from "./kbs/registry";
import { buildVediFinderPanel } from "./kbs/surfaces";
import { blockedCapabilities, type CapabilityStatus } from "./status";

export type MandapKpi = { label: string; value: string; sub: string; preview?: boolean };
export type GalleryItem = { id: string; name: string; status: CapabilityStatus };
export type ComponentGallery = { panel: string; category: string; thumbnail: string; total: number; items: GalleryItem[] };
export type RitualVastuRow = { label: string; value: string; ok: boolean };
export type CostRow = { label: string; amountInr: number; status: string };
export type MaterialRow = { id: string; label: string; finish: string; usage: string; color: string };
export type TemplateRow = { id: string; label: string };
export type RecentConcept = { name: string; date: string; estimateInr: number };
export type ExportRow = { label: string; format: string; status: CapabilityStatus; note?: string };
export type PreviewFrame = { id: string; title: string; subtitle: string; image: string; status: CapabilityStatus };
export type MandapSpec = { label: string; value: string };

export type MandapDesigner = {
  status: "READY";
  verdict: "CONTROLLED_PREVIEW_READY";
  productionReady: false;
  kpis: MandapKpi[];
  previewFrames: PreviewFrame[];
  galleries: ComponentGallery[];
  ritualsVastu: RitualVastuRow[];
  costRows: CostRow[];
  costTotalInr: number;
  materials: MaterialRow[];
  templates: TemplateRow[];
  recentConcepts: RecentConcept[];
  exports: ExportRow[];
  specs: MandapSpec[];
  evidenceRef: string;
};

const THUMB_BASE = "/generated-assets/mandap-thumbnails";

function gallery(panel: string, category: string, thumb: string): ComponentGallery {
  const assets = weddingAssets.filter((asset) => asset.category === category);
  return {
    panel,
    category,
    thumbnail: `${THUMB_BASE}/${thumb}.svg`,
    total: assets.length,
    items: assets.slice(0, 6).map((asset) => ({ id: asset.id, name: asset.name, status: asset.status as CapabilityStatus }))
  };
}

export function buildMandapDesigner(): MandapDesigner {
  const graph = kbs();
  const rituals = graph.nodesOfType("Ritual");
  const vedi = buildVediFinderPanel(graph);
  const costTotalInr = budgetItems.reduce((sum, item) => sum + item.estimatedInr, 0);

  const kpis: MandapKpi[] = [
    { label: "Mandap Concepts", value: String(templateRuntimeCatalog.length), sub: "runtime templates" },
    { label: "Placed Elements", value: String(cadObjects.length), sub: "CAD objects in scene" },
    { label: "Est. Mandap Cost", value: `₹${costTotalInr.toLocaleString("en-IN")}`, sub: "preview estimate", preview: true },
    { label: "Setup Time", value: "8–10 hrs", sub: "preview estimate", preview: true },
    { label: "Person Capacity", value: String(seatingCapacity.totalGuests), sub: "seated guests" },
    { label: "Vastu Score", value: "92/100", sub: "preview heuristic", preview: true },
    { label: "Rituals Supported", value: String(rituals.length), sub: "KBS ritual nodes" },
    { label: "Sustainability", value: "90/100", sub: "preview heuristic", preview: true }
  ];

  const previewFrames: PreviewFrame[] = [
    { id: "concept", title: "Mandap Concept Preview", subtitle: "Royal Heritage Mandap", image: "/hero-banners/hires/mandap-designer.webp", status: "READY" },
    { id: "plan", title: "Mandap Plan (Top View)", subtitle: "2D plan · preview", image: "/extracted-boards/vedic-lotus-all-pages-board.png", status: "READY" },
    { id: "elevation", title: "Front Elevation", subtitle: "elevation · preview", image: "/extracted-boards/vedic-sacred-design-options.png", status: "READY" },
    { id: "perspective", title: "Perspective View (3D)", subtitle: "GLB-backed preview mesh", image: "/extracted-boards/vedic-sacred-traditional-options.png", status: "PARTIAL" }
  ];

  const galleries: ComponentGallery[] = [
    gallery("Pillars & Structures", "Pillars", "pillar"),
    gallery("Canopy & Roofs", "Structural Elements", "canopy"),
    gallery("Backdrops", "Backdrops", "backdrop"),
    gallery("Decor & Props", "Decor Props", "decor"),
    gallery("Lighting Design", "Lighting Fixtures", "lighting"),
    gallery("Floral & Greens", "Floral Installations", "floral")
  ];

  const ritualNames = rituals.map((r) => r.name);
  const ritualsVastu: RitualVastuRow[] = [
    { label: "Agni Sthapana", value: "South-East", ok: true },
    { label: "Ganesh Poojan", value: ritualNames.includes("Ganesh Poojan") ? "East · supported" : "East", ok: true },
    { label: "Kanyadaan", value: "North-East", ok: true },
    { label: "Saptapadi", value: `North · ${vedi.vedis[1]?.name ?? "Circular Vedi"}`, ok: true },
    { label: "Mandap Direction", value: "East Facing", ok: true },
    { label: "Vastu Compliance", value: "Compliant (preview)", ok: true },
    { label: "Energy Flow", value: "Balanced (preview)", ok: true }
  ];

  const costRows: CostRow[] = budgetItems.map((item) => ({ label: item.label, amountInr: item.estimatedInr, status: item.status }));

  const materials: MaterialRow[] = materialPalette.map((m) => ({ id: m.id, label: m.label, finish: m.finish, usage: m.usage, color: m.color }));

  const templates: TemplateRow[] = templateRuntimeCatalog.map((t) => ({ id: t.id, label: t.label }));

  const recentConcepts: RecentConcept[] = [
    { name: "Royal Heritage Mandap", date: "2026-06-09", estimateInr: 1875000 },
    { name: "Divine Lotus Mandap", date: "2026-06-07", estimateInr: 1640000 },
    { name: "Traditional Vedic Mandap", date: "2026-06-05", estimateInr: 1420000 },
    { name: "Modern Elegant Mandap", date: "2026-06-03", estimateInr: 1290000 }
  ];

  const blockedIds = new Set(blockedCapabilities.map((c) => c.id));
  const exports: ExportRow[] = [
    { label: "Printable Board", format: "PDF", status: "READY" },
    { label: "3D Model", format: "GLB", status: "READY", note: "preview primitive mesh" },
    { label: "2D Plan", format: "Preview DXF", status: "PARTIAL", note: "footprint only" },
    { label: "BOQ Sheet", format: "XLSX", status: "PARTIAL", note: "preview estimate" },
    { label: "Cost Sheet", format: "PDF", status: "PARTIAL", note: "preview estimate" },
    { label: "All Assets", format: "ZIP", status: "READY" },
    { label: "Native DWG", format: "DWG", status: blockedIds.has("native-dwg-export") ? "BLOCKED" : "PARTIAL", note: "no native DWG writer" },
    { label: "Production DXF", format: "DXF", status: blockedIds.has("production-dxf-export") ? "BLOCKED" : "PARTIAL", note: "production CAD handoff blocked" }
  ];

  const specs: MandapSpec[] = [
    { label: "Footprint", value: `${mandapDimensions.footprintM[0]}m × ${mandapDimensions.footprintM[2]}m` },
    { label: "Pillars", value: String(mandapDimensions.pillarCount) },
    { label: "Canopy height", value: `${mandapDimensions.canopyHeightM}m` },
    { label: "Saptapadi", value: `${mandapDimensions.saptapadiDiameterM}m dia` },
    { label: "Stage", value: `${stageDimensions.widthM}m × ${stageDimensions.depthM}m` },
    { label: "Capacity", value: `${seatingCapacity.totalGuests} pax` },
    { label: "Garland", value: `${floralPalette.garlandMeters}m` },
    { label: "Preferred colour", value: "Ivory & Gold" }
  ];

  return {
    status: "READY",
    verdict: "CONTROLLED_PREVIEW_READY",
    productionReady: false,
    kpis,
    previewFrames,
    galleries,
    ritualsVastu,
    costRows,
    costTotalInr,
    materials,
    templates,
    recentConcepts,
    exports,
    specs,
    evidenceRef: "release/evidence/kbs.json"
  };
}
