import { blockedCapabilities } from "./status";

export type Vec3 = [number, number, number];
export type Size3 = [number, number, number];

export type ProjectSummaryFrame = {
  id: string;
  name: string;
  client: string;
  eventDate: string;
  venueName: string;
  designLanguage: string;
  status: "CONTROLLED_PREVIEW_READY";
  routeCoverage: number;
  schemaModels: number;
  cadObjectCount: number;
};

export type VenueDimensionsFrame = {
  lengthM: number;
  widthM: number;
  clearHeightM: number;
  entries: number;
  parkingBlocks: number;
  emergencyExits: number;
};

export type MandapDimensionsFrame = {
  footprintM: Size3;
  pillarCount: number;
  canopyHeightM: number;
  saptapadiDiameterM: number;
  priestZoneM: Size3;
};

export type SeatingCapacityFrame = {
  totalGuests: number;
  vipSeats: number;
  familySeats: number;
  generalSeats: number;
  diningSeats: number;
  accessibleSeats: number;
};

export type StageDimensionsFrame = {
  widthM: number;
  depthM: number;
  heightM: number;
  ledWallM: Size3;
  sofaZoneM: Size3;
};

export type LightingFixtureFrame = {
  id: string;
  label: string;
  type: "chandelier" | "spot" | "wash" | "truss" | "path" | "led";
  count: number;
  colorTemperatureK: number;
  layerId: string;
};

export type FloralPaletteFrame = {
  primary: string;
  secondary: string;
  accent: string;
  foliage: string;
  garlandMeters: number;
};

export type MaterialPaletteFrame = {
  id: string;
  label: string;
  finish: string;
  color: string;
  usage: string;
};

export type DecorItemFrame = {
  id: string;
  label: string;
  category: string;
  quantity: number;
  placement: string;
};

export type CadObjectFrame = {
  id: string;
  kind: StarterObjectKind;
  label: string;
  layerId: string;
  materialId: string;
  position: Vec3;
  rotation: Vec3;
  scale: Size3;
};

export type LayerFrame = {
  id: string;
  label: string;
  visible: boolean;
  color: string;
  locked: boolean;
};

export type AssetCategoryFrame = {
  id: string;
  label: string;
  description: string;
  starterKinds: StarterObjectKind[];
};

export type BudgetItemFrame = {
  id: string;
  label: string;
  category: string;
  estimatedInr: number;
  status: "estimated" | "quoted" | "blocked";
};

export type VendorFrame = {
  id: string;
  label: string;
  category: string;
  status: "demo" | "blocked-live";
  city: string;
};

export type GuestSectionFrame = {
  id: string;
  label: string;
  capacity: number;
  assigned: number;
  notes: string;
};

export type DroneZoneFrame = {
  id: string;
  label: string;
  altitudeM: number;
  path: Vec3[];
  status: "preview" | "blocked-compliance";
};

export type ExportJobFrame = {
  id: string;
  label: string;
  format: "json" | "hkd" | "pdf-board" | "dwg" | "dxf";
  status: "READY" | "PARTIAL" | "BLOCKED";
  evidence: string;
};

export type RenderJobFrame = {
  id: string;
  label: string;
  camera: string;
  status: "READY" | "PARTIAL";
  output: string;
};

export type ObservatoryEventFrame = {
  id: string;
  at: string;
  category: "route" | "schema" | "cad" | "evidence" | "blocker";
  label: string;
  status: "READY" | "PARTIAL" | "BLOCKED";
};

export type StarterObjectKind =
  | "mandap"
  | "stage"
  | "pillar"
  | "arch"
  | "chair"
  | "sofa"
  | "table"
  | "gate"
  | "floral-garland"
  | "kalash"
  | "diya"
  | "chandelier"
  | "truss"
  | "led-wall"
  | "water-pool"
  | "tree"
  | "parking-block"
  | "drone-path-marker";

export const starterObjectKinds: StarterObjectKind[] = [
  "mandap",
  "stage",
  "pillar",
  "arch",
  "chair",
  "sofa",
  "table",
  "gate",
  "floral-garland",
  "kalash",
  "diya",
  "chandelier",
  "truss",
  "led-wall",
  "water-pool",
  "tree",
  "parking-block",
  "drone-path-marker"
];

export const projectSummary: ProjectSummaryFrame = {
  id: "demo-wedding-project",
  name: "Hemant Samwat Wedding CAD Studio",
  client: "TLP Wedding CAD Demo",
  eventDate: "2026-12-12",
  venueName: "Lotus Palace Lawns",
  designLanguage: "Vedic lotus with controlled sci-fi night lighting",
  status: "CONTROLLED_PREVIEW_READY",
  routeCoverage: 33,
  schemaModels: 31,
  cadObjectCount: 18
};

export const venueDimensions: VenueDimensionsFrame = {
  lengthM: 96,
  widthM: 64,
  clearHeightM: 12,
  entries: 3,
  parkingBlocks: 4,
  emergencyExits: 6
};

export const mandapDimensions: MandapDimensionsFrame = {
  footprintM: [12, 12, 7.5],
  pillarCount: 8,
  canopyHeightM: 6.4,
  saptapadiDiameterM: 5.2,
  priestZoneM: [4, 3, 0.3]
};

export const seatingCapacity: SeatingCapacityFrame = {
  totalGuests: 620,
  vipSeats: 48,
  familySeats: 160,
  generalSeats: 320,
  diningSeats: 240,
  accessibleSeats: 24
};

export const stageDimensions: StageDimensionsFrame = {
  widthM: 18,
  depthM: 7,
  heightM: 1.2,
  ledWallM: [14, 0.45, 5],
  sofaZoneM: [7, 2.5, 1]
};

export const layers: LayerFrame[] = [
  { id: "site", label: "Site Plan", visible: true, color: "#36715d", locked: false },
  { id: "mandap", label: "Mandap", visible: true, color: "#b7375f", locked: false },
  { id: "seating", label: "Seating", visible: true, color: "#176f8f", locked: false },
  { id: "lighting", label: "Lighting", visible: true, color: "#d08b1f", locked: false },
  { id: "decor", label: "Decor & Floral", visible: true, color: "#a85f37", locked: false },
  { id: "exports", label: "Exports", visible: true, color: "#25313a", locked: true }
];

export const materialPalette: MaterialPaletteFrame[] = [
  { id: "brass", label: "Brushed Brass", finish: "satin", color: "#b88945", usage: "pillars, kalash, diya" },
  { id: "lotus-fabric", label: "Lotus Silk", finish: "soft textile", color: "#b7375f", usage: "canopy, stage trim" },
  { id: "ivory-stone", label: "Ivory Stone", finish: "matte", color: "#f8f3e7", usage: "floor inlay, plinth" },
  { id: "neem-greenery", label: "Neem Greenery", finish: "organic", color: "#36715d", usage: "floral foliage" },
  { id: "night-led", label: "Night LED Diffuser", finish: "glow acrylic", color: "#176f8f", usage: "sci-fi portal lighting" }
];

export const floralPalette: FloralPaletteFrame = {
  primary: "lotus pink",
  secondary: "marigold saffron",
  accent: "jasmine white",
  foliage: "neem and banana leaf",
  garlandMeters: 420
};

export const decorItems: DecorItemFrame[] = [
  { id: "lotus-canopy", label: "Lotus canopy cluster", category: "mandap", quantity: 1, placement: "above saptapadi circle" },
  { id: "marigold-aisle", label: "Marigold aisle ropes", category: "floral", quantity: 18, placement: "entry to mandap" },
  { id: "brass-diyas", label: "Brass diya line", category: "ritual", quantity: 96, placement: "aisle and mandap edge" },
  { id: "galactic-portal", label: "Galactic LED portal", category: "entry", quantity: 1, placement: "north entry gate" }
];

export const cadObjects: CadObjectFrame[] = [
  { id: "obj-mandap", kind: "mandap", label: "Lotus mandap", layerId: "mandap", materialId: "lotus-fabric", position: [0, 0.25, 0], rotation: [0, 0, 0], scale: [12, 0.5, 12] },
  { id: "obj-stage", kind: "stage", label: "Reception stage", layerId: "site", materialId: "ivory-stone", position: [0, 0.6, -22], rotation: [0, 0, 0], scale: [18, 1.2, 7] },
  { id: "obj-pillar-1", kind: "pillar", label: "Mandap pillar A", layerId: "mandap", materialId: "brass", position: [-5, 3, -5], rotation: [0, 0, 0], scale: [0.7, 6, 0.7] },
  { id: "obj-arch", kind: "arch", label: "Entry arch", layerId: "decor", materialId: "night-led", position: [0, 3, 28], rotation: [0, 0, 0], scale: [9, 6, 1] },
  { id: "obj-chair", kind: "chair", label: "Guest chair row", layerId: "seating", materialId: "ivory-stone", position: [-18, 0.5, 7], rotation: [0, 0, 0], scale: [1, 1, 1] },
  { id: "obj-sofa", kind: "sofa", label: "Couple sofa", layerId: "site", materialId: "lotus-fabric", position: [0, 1.2, -24], rotation: [0, 0, 0], scale: [5, 1.4, 1.6] },
  { id: "obj-table", kind: "table", label: "Family table", layerId: "seating", materialId: "ivory-stone", position: [18, 0.6, 7], rotation: [0, 0, 0], scale: [2.8, 1.1, 2.8] },
  { id: "obj-gate", kind: "gate", label: "North gate", layerId: "site", materialId: "night-led", position: [0, 3, 33], rotation: [0, 0, 0], scale: [12, 6, 1] },
  { id: "obj-garland", kind: "floral-garland", label: "Canopy garland", layerId: "decor", materialId: "neem-greenery", position: [0, 6.6, 0], rotation: [0, 0, 0], scale: [8, 0.4, 8] },
  { id: "obj-kalash", kind: "kalash", label: "Kalash pair", layerId: "decor", materialId: "brass", position: [-2.5, 0.8, 2.5], rotation: [0, 0, 0], scale: [0.8, 1.2, 0.8] },
  { id: "obj-diya", kind: "diya", label: "Diya ring", layerId: "decor", materialId: "brass", position: [2.8, 0.2, 2.8], rotation: [0, 0, 0], scale: [0.4, 0.2, 0.4] },
  { id: "obj-chandelier", kind: "chandelier", label: "Mandap chandelier", layerId: "lighting", materialId: "brass", position: [0, 6, 0], rotation: [0, 0, 0], scale: [2.4, 1.2, 2.4] },
  { id: "obj-truss", kind: "truss", label: "Lighting truss", layerId: "lighting", materialId: "night-led", position: [0, 5, -16], rotation: [0, 0, 0], scale: [20, 0.5, 0.5] },
  { id: "obj-led-wall", kind: "led-wall", label: "LED wall", layerId: "lighting", materialId: "night-led", position: [0, 3, -26], rotation: [0, 0, 0], scale: [14, 5, 0.35] },
  { id: "obj-water", kind: "water-pool", label: "Reflecting pool", layerId: "site", materialId: "night-led", position: [0, 0.08, 14], rotation: [0, 0, 0], scale: [12, 0.12, 3] },
  { id: "obj-tree", kind: "tree", label: "Existing tree", layerId: "site", materialId: "neem-greenery", position: [-28, 4, -8], rotation: [0, 0, 0], scale: [4, 8, 4] },
  { id: "obj-parking", kind: "parking-block", label: "Parking block A", layerId: "site", materialId: "ivory-stone", position: [32, 0.1, 18], rotation: [0, 0, 0], scale: [12, 0.2, 8] },
  { id: "obj-drone", kind: "drone-path-marker", label: "Drone path marker", layerId: "site", materialId: "night-led", position: [-32, 6, 24], rotation: [0, 0, 0], scale: [1, 1, 1] }
];

export const lightingFixtures: LightingFixtureFrame[] = [
  { id: "fx-chandelier", label: "Central chandelier", type: "chandelier", count: 1, colorTemperatureK: 2700, layerId: "lighting" },
  { id: "fx-stage-wash", label: "Stage warm wash", type: "wash", count: 12, colorTemperatureK: 3200, layerId: "lighting" },
  { id: "fx-portal-led", label: "Portal LED ribs", type: "led", count: 18, colorTemperatureK: 5600, layerId: "lighting" },
  { id: "fx-path", label: "Aisle path lights", type: "path", count: 44, colorTemperatureK: 2400, layerId: "lighting" }
];

export const assetCategories: AssetCategoryFrame[] = [
  { id: "ritual", label: "Ritual Objects", description: "Kalash, diya, saptapadi markers, and sacred plan props.", starterKinds: ["kalash", "diya", "floral-garland"] },
  { id: "architecture", label: "Architecture", description: "Mandap, stage, pillars, arches, gates, and truss blocks.", starterKinds: ["mandap", "stage", "pillar", "arch", "gate", "truss"] },
  { id: "furniture", label: "Furniture", description: "Guest seating, sofas, tables, and hospitality fixtures.", starterKinds: ["chair", "sofa", "table"] },
  { id: "site", label: "Site Objects", description: "Water, trees, parking, drone path, and exterior planning primitives.", starterKinds: ["water-pool", "tree", "parking-block", "drone-path-marker"] },
  { id: "lighting", label: "Lighting", description: "Chandeliers, LED walls, path lights, and night-view assets.", starterKinds: ["chandelier", "led-wall", "truss"] }
];

export const budgetItems: BudgetItemFrame[] = [
  { id: "budget-mandap", label: "Mandap fabrication", category: "build", estimatedInr: 850000, status: "estimated" },
  { id: "budget-floral", label: "Floral and foliage", category: "decor", estimatedInr: 620000, status: "estimated" },
  { id: "budget-lighting", label: "Lighting and truss", category: "technical", estimatedInr: 730000, status: "quoted" },
  { id: "budget-export-dwg", label: "DWG/DXF export", category: "exports", estimatedInr: 0, status: "blocked" }
];

export const vendors: VendorFrame[] = [
  { id: "vendor-floral", label: "Lotus Bloom Decor", category: "floral", status: "demo", city: "Jaipur" },
  { id: "vendor-lighting", label: "Prism Events Lighting", category: "lighting", status: "demo", city: "Delhi" },
  { id: "vendor-marketplace", label: "Live vendor marketplace", category: "marketplace", status: "blocked-live", city: "blocked" }
];

export const guestSections: GuestSectionFrame[] = [
  { id: "guest-vip", label: "VIP front rows", capacity: 48, assigned: 42, notes: "Clear sightline to mandap and stage." },
  { id: "guest-family", label: "Family courts", capacity: 160, assigned: 148, notes: "Two symmetrical courts around saptapadi axis." },
  { id: "guest-general", label: "General seating", capacity: 320, assigned: 284, notes: "Flexible chair banks near dining transition." },
  { id: "guest-access", label: "Accessible seating", capacity: 24, assigned: 18, notes: "Close to north entry and service aisle." }
];

export const droneZones: DroneZoneFrame[] = [
  {
    id: "drone-orbit",
    label: "Preview orbit path",
    altitudeM: 18,
    path: [
      [-28, 18, 24],
      [0, 18, 34],
      [28, 18, 24],
      [24, 18, -22],
      [-24, 18, -22]
    ],
    status: "blocked-compliance"
  }
];

export const exportJobs: ExportJobFrame[] = [
  { id: "export-json", label: "Scene JSON", format: "json", status: "READY", evidence: "Local scene serialization is implemented in /cad/editor." },
  { id: "export-pdf", label: "Printable board package", format: "pdf-board", status: "READY", evidence: "Local binary PDF board package generation writes release/board-packages/hemant-samwat-board-package.pdf from scene/render data." },
  { id: "export-hkd", label: "HKD native scene export", format: "hkd", status: "READY", evidence: "Local .hkd (TLPS Heritage-CAD Data) container is implemented end to end — a versioned, checksum-verified, round-trippable scene format owned by the platform. Not a DWG/DXF or production CAD interchange format." },
  { id: "export-dwg", label: "DWG export", format: "dwg", status: "BLOCKED", evidence: "No native DWG writer, round-trip compatibility, or AutoCAD-validated fixtures exist. Use the .hkd native export for round-trip; DWG remains blocked." },
  { id: "export-dxf", label: "Preview DXF footprint export", format: "dxf", status: "READY", evidence: "Local ASCII DXF footprint export is implemented for preview geometry; production CAD handoff remains blocked by DWG/compliance gaps." }
];

export const renderJobs: RenderJobFrame[] = [
  { id: "render-day", label: "Day concept preview", camera: "perspective", status: "READY", output: "in-app 3D canvas" },
  { id: "render-night", label: "Night lighting preview", camera: "perspective", status: "READY", output: "lighting data, fixture palette, and extracted night-view boards" }
];

export const observatoryEvents: ObservatoryEventFrame[] = [
  { id: "event-routes", at: "2026-06-09T05:00:00+05:30", category: "route", label: "Route matrix generated", status: "READY" },
  { id: "event-schema", at: "2026-06-09T05:05:00+05:30", category: "schema", label: "Prisma and Zod model coverage scaffolded", status: "READY" },
  { id: "event-cad", at: "2026-06-09T05:10:00+05:30", category: "cad", label: "Three.js CAD editor scaffolded", status: "READY" },
  { id: "event-export", at: "2026-06-09T05:15:00+05:30", category: "blocker", label: "DXF preview ready; DWG production export remains blocked", status: "BLOCKED" },
  { id: "event-release", at: "2026-06-09T05:20:00+05:30", category: "evidence", label: "Controlled preview evidence generated", status: "READY" }
];

export const blockedCapabilityList = blockedCapabilities;

export const dataFrames = {
  projectSummary,
  venueDimensions,
  mandapDimensions,
  seatingCapacity,
  stageDimensions,
  lightingFixtures,
  floralPalette,
  materialPalette,
  decorItems,
  cadObjects,
  layers,
  assetCategories,
  budgetItems,
  vendors,
  guestSections,
  droneZones,
  exportJobs,
  renderJobs,
  observatoryEvents,
  blockedCapabilityList
};
