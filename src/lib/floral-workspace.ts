import type { CapabilityStatus } from "./status";

export type FloralKpiFrame = {
  id: string;
  label: string;
  value: string;
  detail: string;
  status: CapabilityStatus;
  tone: "green" | "pink" | "gold" | "amber" | "teal";
};

export type FloralTabFrame = {
  id: string;
  label: string;
  status: CapabilityStatus;
};

export type FloralVisualAssetFrame = {
  id: string;
  label: string;
  source: string;
  usage: string;
  status: CapabilityStatus;
};

export type FloralSpacePointFrame = {
  id: string;
  zone: "Mandap" | "Stage" | "Entry" | "Walkway" | "Centerpieces" | "Photo Area" | "Other";
  x: number;
  y: number;
  status: CapabilityStatus;
};

export type FloralArrangementFrame = {
  id: string;
  label: string;
  placement: string;
  quantity: number;
  source: string;
  status: CapabilityStatus;
};

export type FloralCalculatorLineFrame = {
  id: string;
  label: string;
  estimatedInr: number;
  status: CapabilityStatus;
};

export type FlowerLibraryFrame = {
  id: string;
  label: string;
  family: "flower" | "foliage";
  color: string;
  season: "All Year" | "Winter" | "Summer" | "Monsoon";
  availability: "High" | "Medium" | "Low";
  status: CapabilityStatus;
};

export type FloralPaletteSetFrame = {
  id: string;
  label: string;
  colors: string[];
  usage: string;
  status: CapabilityStatus;
};

export type FloralTimelineFrame = {
  id: string;
  label: string;
  date: string;
  status: CapabilityStatus;
};

export type FloralAttachmentFrame = {
  id: string;
  label: string;
  kind: "image" | "sheet" | "board";
  size: string;
  status: CapabilityStatus;
};

export type FloralPanelFrame = {
  id: string;
  number: number;
  title: string;
  status: CapabilityStatus;
  dataFrames: string[];
  assetRefs: string[];
};

export type FloralWorkspaceFrame = {
  route: "/floral";
  projectName: "Hemant Samwat Wedding";
  moduleName: "Floral Designer";
  status: CapabilityStatus;
  productionReady: false;
  tabs: FloralTabFrame[];
  kpis: FloralKpiFrame[];
  visualAssets: FloralVisualAssetFrame[];
  spacePoints: FloralSpacePointFrame[];
  arrangements: FloralArrangementFrame[];
  calculator: {
    area: string;
    dimensions: string;
    floralDensity: string;
    lines: FloralCalculatorLineFrame[];
    totalEstimatedInr: number;
    status: CapabilityStatus;
  };
  flowers: FlowerLibraryFrame[];
  palettes: FloralPaletteSetFrame[];
  timeline: FloralTimelineFrame[];
  notes: string[];
  attachments: FloralAttachmentFrame[];
  quickActions: string[];
  panels: FloralPanelFrame[];
  statusRows: Array<{ label: string; value: string; status: CapabilityStatus }>;
  localRuntimeCoverage: string[];
};

const board = (file: string) => `/extracted-boards/${file}`;

const zoneSequence: FloralSpacePointFrame["zone"][] = [
  "Mandap",
  "Stage",
  "Entry",
  "Walkway",
  "Centerpieces",
  "Photo Area",
  "Other"
];

const spacePoints: FloralSpacePointFrame[] = Array.from({ length: 91 }, (_, index) => ({
  id: `floral-map-${String(index + 1).padStart(2, "0")}`,
  zone: zoneSequence[index % zoneSequence.length],
  x: 8 + ((index * 13) % 84),
  y: 10 + ((index * 17) % 76),
  status: "READY"
}));

export const floralWorkspace: FloralWorkspaceFrame = {
  route: "/floral",
  projectName: "Hemant Samwat Wedding",
  moduleName: "Floral Designer",
  status: "READY",
  productionReady: false,
  tabs: [
    { id: "overview", label: "Overview", status: "READY" },
    { id: "concepts", label: "Floral Concepts", status: "READY" },
    { id: "installations", label: "Installations", status: "READY" },
    { id: "arrangements", label: "Arrangement Library", status: "READY" },
    { id: "palettes", label: "Color Palettes", status: "READY" },
    { id: "seasonal", label: "Seasonal Flowers", status: "READY" },
    { id: "templates", label: "Templates", status: "READY" },
    { id: "calculations", label: "Calculations", status: "READY" },
    { id: "board-preview", label: "Board Preview", status: "READY" }
  ],
  kpis: [
    { id: "concepts", label: "Floral Concepts", value: "8", detail: "Active concepts", status: "READY", tone: "green" },
    { id: "installations", label: "Floral Installations", value: "23", detail: "Total installations", status: "READY", tone: "pink" },
    { id: "flower-types", label: "Flower Types", value: "156", detail: "In library", status: "READY", tone: "gold" },
    { id: "cost", label: "Est. Floral Cost", value: "INR 18,75,000", detail: "Total estimate", status: "READY", tone: "amber" },
    { id: "hours", label: "Man Hours", value: "342", detail: "Total hours", status: "READY", tone: "gold" },
    { id: "sustainability", label: "Sustainability Score", value: "92/100", detail: "Excellent", status: "READY", tone: "green" }
  ],
  visualAssets: [
    {
      id: "concept-board",
      label: "Romantic Garden Theme",
      source: board("traditional-royal-cad-presentation.png"),
      usage: "Main floral concept board",
      status: "READY"
    },
    {
      id: "space-map-board",
      label: "Site Layout Floral Overlay",
      source: board("all-pages-black-gold-board.png"),
      usage: "Space mapping preview",
      status: "READY"
    },
    {
      id: "installation-render",
      label: "Generated Floral Canopy Hero",
      source: "/hero-banners/hires/floral-designer.webp",
      usage: "Generated high-res local preview hero",
      status: "READY"
    },
    {
      id: "floral-board-preview",
      label: "Floral Board Preview",
      source: board("vedic-lotus-all-pages-board.png"),
      usage: "Board composer preview",
      status: "READY"
    },
    {
      id: "unique-options",
      label: "Floating Floral Cloud Reference",
      source: board("unique-design-options.png"),
      usage: "Arrangement variant source",
      status: "READY"
    },
    {
      id: "vedic-options",
      label: "Vedic Floral Palette Reference",
      source: board("vedic-sacred-traditional-options.png"),
      usage: "Traditional palette source",
      status: "READY"
    }
  ],
  spacePoints,
  arrangements: [
    { id: "mandap-canopy", label: "Mandap Canopy", placement: "Mandap", quantity: 1, source: board("vedic-lotus-all-pages-board.png"), status: "READY" },
    { id: "stage-front", label: "Stage Front", placement: "Stage", quantity: 1, source: board("traditional-royal-cad-presentation.png"), status: "READY" },
    { id: "centerpiece-tall", label: "Centerpiece Tall", placement: "Dining", quantity: 48, source: board("vedic-sacred-design-options.png"), status: "READY" },
    { id: "entry-arch", label: "Entry Arch", placement: "Entry", quantity: 2, source: board("unique-design-options.png"), status: "READY" },
    { id: "table-runner", label: "Table Runner", placement: "VIP Tables", quantity: 32, source: board("general-design-options.png"), status: "READY" },
    { id: "hanging-installation", label: "Hanging Installation", placement: "Ceiling", quantity: 14, source: board("all-pages-black-gold-board.png"), status: "READY" }
  ],
  calculator: {
    area: "Mandap Canopy",
    dimensions: "20 ft x 20 ft x 12 ft",
    floralDensity: "Luxurious",
    lines: [
      { id: "flowers", label: "Flowers", estimatedInr: 875000, status: "READY" },
      { id: "greenery", label: "Greenery", estimatedInr: 125000, status: "READY" },
      { id: "accessories", label: "Accessories", estimatedInr: 75000, status: "READY" },
      { id: "labor", label: "Labor", estimatedInr: 150000, status: "READY" }
    ],
    totalEstimatedInr: 1225000,
    status: "READY"
  },
  flowers: [
    { id: "rose", label: "Rose", family: "flower", color: "#d91f3f", season: "All Year", availability: "High", status: "READY" },
    { id: "hydrangea", label: "Hydrangea", family: "flower", color: "#cad9ec", season: "Winter", availability: "Medium", status: "READY" },
    { id: "orchid", label: "Orchid", family: "flower", color: "#b068d1", season: "All Year", availability: "High", status: "READY" },
    { id: "peony", label: "Peony", family: "flower", color: "#f19bb2", season: "Winter", availability: "Low", status: "READY" },
    { id: "carnation", label: "Carnation", family: "flower", color: "#e86c8b", season: "All Year", availability: "High", status: "READY" },
    { id: "lily", label: "Lily", family: "flower", color: "#f7f0d8", season: "All Year", availability: "High", status: "READY" },
    { id: "babys-breath", label: "Baby's Breath", family: "flower", color: "#f5f4e9", season: "All Year", availability: "High", status: "READY" },
    { id: "marigold", label: "Marigold", family: "flower", color: "#f2a51d", season: "All Year", availability: "High", status: "READY" },
    { id: "rajnigandha", label: "Rajnigandha", family: "flower", color: "#eaf2d5", season: "Summer", availability: "Medium", status: "READY" },
    { id: "tulip", label: "Tulip", family: "flower", color: "#f07566", season: "Winter", availability: "Medium", status: "READY" },
    { id: "anthurium", label: "Anthurium", family: "flower", color: "#cf283f", season: "All Year", availability: "Medium", status: "READY" },
    { id: "eucalyptus", label: "Eucalyptus", family: "foliage", color: "#8aa58f", season: "All Year", availability: "High", status: "READY" }
  ],
  palettes: [
    { id: "blush-romance", label: "Blush Romance", colors: ["#f8d8ca", "#e8b7a6", "#d69a88", "#bd735f", "#8f4d43", "#f5e7de"], usage: "Mandap, aisle, bride entry", status: "READY" },
    { id: "royal-whites", label: "Royal Whites", colors: ["#fff8e8", "#eee4c9", "#d6c9a5", "#b8ae86", "#7f7c5f", "#f3ead8"], usage: "Vedic mandap and guest tables", status: "READY" },
    { id: "pastel-dream", label: "Pastel Dream", colors: ["#f8c7cf", "#e9d0cf", "#c7dedd", "#e9b6b7", "#b77d82", "#f5ece5"], usage: "Floral cloud and lounge decor", status: "READY" },
    { id: "vibrant-celebration", label: "Vibrant Celebration", colors: ["#ffb11f", "#f58a19", "#f45b47", "#e1314b", "#b7163a", "#ffd36a"], usage: "Entry, sangeet, festive toran", status: "READY" },
    { id: "traditional-reds", label: "Traditional Reds", colors: ["#ff5a32", "#d73028", "#aa211f", "#841717", "#53100d", "#f0b04f"], usage: "Sacred ceremony zones", status: "READY" }
  ],
  timeline: [
    { id: "concept-review", label: "Concept Review", date: "05 Jun 2026", status: "READY" },
    { id: "flower-sourcing", label: "Flower Sourcing", date: "10 Jun 2026", status: "READY" },
    { id: "pre-assembly", label: "Pre Assembly", date: "14 Jun 2026", status: "READY" },
    { id: "onsite-install", label: "On-Site Installation", date: "18 Jun 2026", status: "READY" },
    { id: "touch-ups", label: "Touch-ups", date: "19 Jun 2026", status: "READY" }
  ],
  notes: [
    "Fresh flowers to be used for all key installations.",
    "Premium quality blooms with uniform size.",
    "Hydration and temperature control for flower longevity.",
    "Ensure minimal floral wastage under the local preview sustainability target.",
    "Client approved color palette to be strictly followed."
  ],
  attachments: [
    { id: "floral-reference", label: "Floral_Concept_Reference.jpg", kind: "image", size: "2.1 MB", status: "READY" },
    { id: "mandap-view", label: "Mandap_Floral_3D_View.png", kind: "board", size: "4.7 MB", status: "READY" },
    { id: "sourcing-list", label: "Flower_Sourcing_List.xlsx", kind: "sheet", size: "391 KB", status: "READY" }
  ],
  quickActions: ["Add Floral Installation", "AI Floral Suggestion", "Duplicate Concept", "Export Floral Plan"],
  panels: [
    { id: "concept-board", number: 1, title: "Floral Concept Board", status: "READY", dataFrames: ["visualAssets", "palettes"], assetRefs: ["concept-board", "vedic-options"] },
    { id: "space-mapping", number: 2, title: "Space Mapping", status: "READY", dataFrames: ["spacePoints"], assetRefs: ["space-map-board"] },
    { id: "installation-preview", number: 3, title: "Installation Preview (3D)", status: "READY", dataFrames: ["visualAssets"], assetRefs: ["installation-render"] },
    { id: "arrangement-library", number: 4, title: "Arrangement Library", status: "READY", dataFrames: ["arrangements"], assetRefs: ["mandap-canopy", "stage-front", "entry-arch"] },
    { id: "floral-calculator", number: 5, title: "Floral Calculator", status: "READY", dataFrames: ["calculator"], assetRefs: [] },
    { id: "flower-library", number: 6, title: "Flower & Foliage Library", status: "READY", dataFrames: ["flowers"], assetRefs: [] },
    { id: "color-palettes", number: 7, title: "Color Palettes", status: "READY", dataFrames: ["palettes"], assetRefs: [] },
    { id: "seasonal-availability", number: 8, title: "Seasonal Availability", status: "READY", dataFrames: ["flowers"], assetRefs: [] },
    { id: "board-preview", number: 9, title: "Floral Board Preview", status: "READY", dataFrames: ["visualAssets"], assetRefs: ["floral-board-preview"] },
    { id: "timeline", number: 10, title: "Floral Timeline", status: "READY", dataFrames: ["timeline"], assetRefs: [] },
    { id: "notes", number: 11, title: "Notes & Specifications", status: "READY", dataFrames: ["notes"], assetRefs: [] },
    { id: "attachments", number: 12, title: "Attachments", status: "READY", dataFrames: ["attachments"], assetRefs: [] },
    { id: "status-blockers", number: 13, title: "Status & Blockers", status: "READY", dataFrames: ["statusRows"], assetRefs: [] },
    { id: "quick-actions", number: 14, title: "Quick Actions", status: "READY", dataFrames: ["quickActions"], assetRefs: [] }
  ],
  statusRows: [
    { label: "Overall Status", value: "READY", status: "READY" },
    { label: "Data Status", value: "Complete", status: "READY" },
    { label: "Runtime Status", value: "Operational", status: "READY" },
    { label: "Module Blockers", value: "None", status: "READY" },
    { label: "Release Verdict", value: "CONTROLLED_PREVIEW_READY", status: "READY" },
    { label: "PRODUCTION_READY", value: "false", status: "BLOCKED" }
  ],
  localRuntimeCoverage: [
    "Dedicated /floral route renders extracted Floral Designer workspace.",
    "KPI widgets bind to typed floral workspace data.",
    "Concept board, installation preview, arrangement library, and board preview use local image assets.",
    "Space mapping renders deterministic local placement points.",
    "Calculator totals are generated from typed local cost lines.",
    "Timeline, attachments, notes, quick actions, and module status rows render without live services."
  ]
};

export const floralWorkspaceSummary = {
  route: floralWorkspace.route,
  status: floralWorkspace.status,
  productionReady: floralWorkspace.productionReady,
  kpiWidgets: floralWorkspace.kpis.length,
  tabs: floralWorkspace.tabs.length,
  numberedPanels: floralWorkspace.panels.length,
  visualAssets: floralWorkspace.visualAssets.length + floralWorkspace.arrangements.length,
  spacePoints: floralWorkspace.spacePoints.length,
  flowers: floralWorkspace.flowers.length,
  palettes: floralWorkspace.palettes.length,
  attachments: floralWorkspace.attachments.length,
  localRuntimeCoverage: floralWorkspace.localRuntimeCoverage.length
};
