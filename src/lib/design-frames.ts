import type { CapabilityStatus } from "./status";

export type UIFrameDefinition = {
  id: string;
  title: string;
  sourceBoard: string;
  status: CapabilityStatus;
  layout: string;
  dataBindings: string[];
};

export const uiFrames: UIFrameDefinition[] = [
  {
    id: "cover-board",
    title: "Cover Board",
    sourceBoard: "All Pages Board",
    status: "READY",
    layout: "Large brand title, project summary strip, release verdict, module status chips.",
    dataBindings: ["project summary", "release gate", "blocked capability list"]
  },
  {
    id: "design-concept-page",
    title: "Design Concept Page",
    sourceBoard: "Design Options Board",
    status: "READY",
    layout: "Concept narrative, palette rail, inspiration thumbnails, option comparison.",
    dataBindings: ["material palette", "floral palette", "decor items"]
  },
  {
    id: "site-layout-plan",
    title: "Site Layout Plan",
    sourceBoard: "Indian Marriage Setup CAD Board",
    status: "READY",
    layout: "Scaled plan surface with entry, mandap, stage, parking, drone, and service zones.",
    dataBindings: ["venue dimensions", "CAD objects", "drone zones", "guest sections"]
  },
  {
    id: "mandap-plan-elevation-page",
    title: "Mandap Plan/Elevation Page",
    sourceBoard: "Vedic Options Board",
    status: "READY",
    layout: "Plan grid paired with elevation, pillar callouts, materials, and ritual clearances.",
    dataBindings: ["mandap dimensions", "materials", "decor items"]
  },
  {
    id: "stage-design-page",
    title: "Stage Design Page",
    sourceBoard: "Unique Options Board",
    status: "READY",
    layout: "Stage platform diagram, backdrop zones, LED wall, sofa cluster, and sightlines.",
    dataBindings: ["stage dimensions", "lighting fixtures", "CAD objects"]
  },
  {
    id: "entry-gate-page",
    title: "Entry Gate Page",
    sourceBoard: "Royal / Unique Options Board",
    status: "READY",
    layout: "Gate elevation, arch geometry, queue zone, floral trim, and sign placement.",
    dataBindings: ["decor items", "venue dimensions", "asset categories"]
  },
  {
    id: "seating-layout-page",
    title: "Seating Layout Page",
    sourceBoard: "All Pages Board",
    status: "READY",
    layout: "Guest zones, table clusters, VIP aisle, accessibility blocks, and capacity badges.",
    dataBindings: ["seating capacity", "guest sections", "CAD objects"]
  },
  {
    id: "lighting-plan-page",
    title: "Lighting Plan Page",
    sourceBoard: "Sci-Fi Options Board",
    status: "READY",
    layout: "Fixture map, truss grid, chandelier points, color temperature, and night mode preview.",
    dataBindings: ["lighting fixtures", "layers", "render jobs"]
  },
  {
    id: "section-elevation-page",
    title: "Section/Elevation Page",
    sourceBoard: "Indian Marriage Setup CAD Board",
    status: "READY",
    layout: "Horizontal section with height markers, canopy, rigging, and clearance notes.",
    dataBindings: ["venue dimensions", "mandap dimensions", "stage dimensions"]
  },
  {
    id: "decor-floral-page",
    title: "Decor/Floral Page",
    sourceBoard: "Vedic Options Board",
    status: "READY",
    layout: "Floral recipe, garland runs, canopy treatment, aisle decor, and usage quantities.",
    dataBindings: ["floral palette", "decor items", "budget items"]
  },
  {
    id: "material-board-page",
    title: "Material Board Page",
    sourceBoard: "Design Options Board",
    status: "READY",
    layout: "Material swatches, finish notes, structural caveat, and usage mapping.",
    dataBindings: ["material palette", "asset categories", "blocked capability list"]
  },
  {
    id: "render-night-view-page",
    title: "3D Render/Night View Page",
    sourceBoard: "Sci-Fi Options Board",
    status: "READY",
    layout: "Rendered preview frame with camera, lighting, extracted night boards, and export job status.",
    dataBindings: ["render jobs", "camera", "lighting fixtures"]
  },
  {
    id: "homepage-dashboard",
    title: "Homepage Dashboard",
    sourceBoard: "TLP Wedding CAD Homepage",
    status: "READY",
    layout: "Stats, recent projects, module route cards, activity feed, and release gate.",
    dataBindings: ["project summary", "recent projects", "observatory events"]
  },
  {
    id: "cad-editor-shell",
    title: "CAD Editor Shell",
    sourceBoard: "All Pages Board",
    status: "READY",
    layout: "Left asset rail, 3D canvas, layer panel, inspector, top command bar, export panel.",
    dataBindings: ["CAD objects", "layers", "asset categories", "export jobs"]
  },
  {
    id: "route-module-cards",
    title: "Route Module Cards",
    sourceBoard: "All Pages Board",
    status: "READY",
    layout: "Module cards with status, frame binding, and key capabilities.",
    dataBindings: ["route matrix", "blocked capability list"]
  },
  {
    id: "left-nav",
    title: "Left Nav",
    sourceBoard: "TLP Wedding CAD Homepage",
    status: "READY",
    layout: "Route family navigation grouped by studio, planning, runtime, and governance.",
    dataBindings: ["route matrix", "release gate"]
  },
  {
    id: "top-command-bar",
    title: "Top Command Bar",
    sourceBoard: "CAD Editor Shell",
    status: "READY",
    layout: "Project switcher, command search, save, verify, and export status buttons.",
    dataBindings: ["project summary", "export jobs", "release gate"]
  },
  {
    id: "project-stats",
    title: "Project Stats",
    sourceBoard: "TLP Wedding CAD Homepage",
    status: "READY",
    layout: "Capacity, budget, object count, routes, and blocker counters.",
    dataBindings: ["project summary", "budget items", "CAD objects"]
  },
  {
    id: "recent-projects",
    title: "Recent Projects",
    sourceBoard: "TLP Wedding CAD Homepage",
    status: "READY",
    layout: "Project cards with venue, board set, status, and last activity.",
    dataBindings: ["project summary", "observatory events"]
  },
  {
    id: "activity-feed",
    title: "Activity Feed",
    sourceBoard: "TLP Wedding CAD Homepage",
    status: "READY",
    layout: "Chronological release, design, runtime, and blocker events.",
    dataBindings: ["observatory events", "export jobs", "render jobs"]
  },
  {
    id: "asset-library-grid",
    title: "Asset Library Grid",
    sourceBoard: "All Pages Board",
    status: "READY",
    layout: "Categorized asset cards with geometry kind, material, and module availability.",
    dataBindings: ["asset categories", "CAD objects", "material palette"]
  },
  {
    id: "layer-panel",
    title: "Layer Panel",
    sourceBoard: "CAD Editor Shell",
    status: "READY",
    layout: "Visibility toggles, layer colors, object counts, and current selection.",
    dataBindings: ["layers", "CAD objects"]
  },
  {
    id: "inspector-panel",
    title: "Inspector Panel",
    sourceBoard: "CAD Editor Shell",
    status: "READY",
    layout: "Selected object dimensions, transform, material, notes, and blocked compliance hint.",
    dataBindings: ["CAD objects", "materials", "blocked capability list"]
  },
  {
    id: "export-panel",
    title: "Export Panel",
    sourceBoard: "All Pages Board",
    status: "READY",
    layout: "Export job list, JSON download, preview DXF footprint export, printable board package, and DWG production warning.",
    dataBindings: ["export jobs", "blocked capability list", "evidence"]
  },
  {
    id: "observatory-status-matrix",
    title: "Observatory Status Matrix",
    sourceBoard: "All Pages Board",
    status: "READY",
    layout: "Route, schema, CAD, evidence, blockers, and release-gate matrix.",
    dataBindings: ["route matrix", "observatory events", "release gate", "blocked capability list"]
  }
];
