import { budgetItems, cadObjects, exportJobs, lightingFixtures, projectSummary, renderJobs } from "./data-frames";
import { productionRuntimeSummary } from "./production-runtime";
import { weddingAssets } from "./wedding-asset-library";

export type BoardPageId =
  | "cover"
  | "concept"
  | "site-plan"
  | "mandap-plan"
  | "lighting-plan"
  | "floral-plan"
  | "budget"
  | "bom"
  | "render-gallery";

export type BoardPageFrame = {
  id: BoardPageId;
  title: string;
  status: "READY";
  source: "scene" | "template" | "budget" | "render" | "production";
  bindings: string[];
};

export type BoardPackageFrame = {
  id: string;
  projectName: string;
  pipeline: ["Scene", "Render", "Board Composer", "PDF Package"];
  status: "READY";
  pages: BoardPageFrame[];
  exportFormats: string[];
  notes: string[];
};

export const boardPages: BoardPageFrame[] = [
  page("cover", "Cover", "scene", ["project summary", "release verdict", "hero render"]),
  page("concept", "Concept", "template", ["design language", "palette", "mood notes"]),
  page("site-plan", "Site Plan", "scene", ["venue zones", "entry axis", "parking", "service lanes"]),
  page("mandap-plan", "Mandap Plan", "scene", ["mandap geometry", "ritual zone", "pillar callouts"]),
  page("lighting-plan", "Lighting Plan", "scene", ["fixtures", "truss", "night render"]),
  page("floral-plan", "Floral Plan", "template", ["garland meters", "floral set", "decor placements"]),
  page("budget", "Budget", "budget", ["budget items", "category totals", "blocked payment note"]),
  page("bom", "BOM", "production", ["asset list", "vendor assignments", "work orders"]),
  page("render-gallery", "Render Gallery", "render", ["day preview", "night preview", "extracted board references"])
];

export const boardPackage: BoardPackageFrame = {
  id: "hemant-samwat-board-package",
  projectName: projectSummary.name,
  pipeline: ["Scene", "Render", "Board Composer", "PDF Package"],
  status: "READY",
  pages: boardPages,
  exportFormats: ["printable-html", "binary-pdf", "scene-json", "preview-dxf"],
  notes: [
    "Local binary PDF package generation writes release/board-packages/hemant-samwat-board-package.pdf from scene and render data.",
    "Preview DXF is a footprint handoff only; production DXF remains blocked.",
    `${cadObjects.length} scene objects, ${lightingFixtures.length} lighting fixture families, ${renderJobs.length} render jobs, and ${productionRuntimeSummary.workOrders} work orders are bound.`
  ]
};

export function composeBoardPackage(templateId: string): BoardPackageFrame {
  return {
    ...boardPackage,
    id: `${templateId}-board-package`,
    notes: [
      ...boardPackage.notes,
      `${weddingAssets.length} reusable wedding assets are available for BOM and board composition.`,
      `${exportJobs.filter((job) => job.status === "READY").length} local export jobs are ready.`
    ]
  };
}

function page(id: BoardPageId, title: string, source: BoardPageFrame["source"], bindings: string[]): BoardPageFrame {
  return { id, title, source, bindings, status: "READY" };
}
