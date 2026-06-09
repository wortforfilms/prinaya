import registryJson from "../../data/assets/wedding-cad-assets.json";
import {
  WeddingCADAssetSchema,
  assetCategoryValues,
  type AssetCategory,
  type AssetStatus,
  type WeddingCADAsset
} from "./schemas";
import type { StarterObjectKind } from "./data-frames";

export type AssetSource = "LOCAL_PREVIEW" | "GENERATED_METADATA" | "BLOCKED_EXTERNAL";
export type AssetPreviewType =
  | "PRIMITIVE_GEOMETRY"
  | "BOARD_IMAGE"
  | "DOCUMENT_TEMPLATE"
  | "METADATA_CARD"
  | "BLOCKED_EXTERNAL";

export type AssetCategoryDefinition = {
  category: AssetCategory;
  slug: string;
  subcategories: string[];
  routes: string[];
  primitiveKind: StarterObjectKind;
  materialTags: string[];
  baseDimensions: { widthM: number; depthM: number; heightM: number };
  baseCost: number;
  previewImage: string;
  defaultStatus: AssetStatus;
  previewType: AssetPreviewType;
  safetyNotes: string[];
};

export type AssetRegistryFile = {
  generatedAt: string;
  verdict: "CONTROLLED_PREVIEW_READY";
  productionReady: false;
  categories: Array<{ category: AssetCategory; count: number }>;
  templates: Record<string, string[]>;
  assets: WeddingCADAsset[];
};

const GENERATED_AT = "2026-06-09T00:00:00.000Z";
const METADATA_REF = "data/assets/wedding-cad-assets.json";
const EVIDENCE_REF = "release/evidence/assets-library.json";
const MESH_REF_PREFIX = "/generated-assets/glb";

export const assetStyleVariants = [
  "Vedic Lotus",
  "Royal Palace",
  "Temple Mandap",
  "Sci-Fi Galactic Portal",
  "Garden Mandap",
  "Navagraha Grid",
  "Panch Tatva",
  "Hemant Samwat",
  "Raj Darbar",
  "Circular Saptapadi",
  "Floating Floral Cloud",
  "Sacred Agni",
  "Kalash Court",
  "Nagara Temple",
  "South Indian Brass",
  "Celestial Garden",
  "Mystic Forest",
  "Moroccan Night",
  "Beach Bliss",
  "Minimal Ivory",
  "Grand Heritage",
  "Cyber Neon",
  "Quantum Garden",
  "Starship Command"
] as const;

export const assetCategoryDefinitions: AssetCategoryDefinition[] = [
  category("Mandaps", ["Lotus canopy", "Temple dome", "Agni kund", "Circular phere"], ["/mandap", "/cad/editor", "/assets"], "mandap", ["brass", "lotus fabric", "ivory stone"], [12, 12, 7.2], 220000, "/extracted-boards/vedic-lotus-all-pages-board.png", "READY", "PRIMITIVE_GEOMETRY", ["Preview geometry only; structural validation remains BLOCKED."]),
  category("Structural Elements", ["plinth", "stairs", "railing", "platform"], ["/cad/editor", "/production", "/assets"], "stage", ["plywood", "ms frame", "stone finish"], [8, 4, 1.2], 90000, "/extracted-boards/traditional-royal-cad-presentation.png", "READY", "PRIMITIVE_GEOMETRY", ["Load and venue engineering certification remain BLOCKED."]),
  category("Pillars", ["carved column", "brass column", "lotus column", "acrylic column"], ["/mandap", "/cad/editor", "/assets"], "pillar", ["brass", "wood", "stone"], [0.8, 0.8, 5.4], 45000, "/extracted-boards/vedic-sacred-design-options.png", "READY", "PRIMITIVE_GEOMETRY", ["Preview pillar geometry is not a load certificate."]),
  category("Gates & Arches", ["entry gate", "toran arch", "portal arch", "aisle arch"], ["/venue-designer", "/mandap", "/cad/editor", "/assets"], "gate", ["brass", "floral", "led"], [9, 1.2, 5.8], 120000, "/extracted-boards/unique-design-options.png", "READY", "PRIMITIVE_GEOMETRY", ["Wind load and anchoring checks remain BLOCKED."]),
  category("Backdrops", ["jaali panel", "floral wall", "led backdrop", "palace facade"], ["/mandap", "/floral", "/lighting", "/cad/editor", "/assets"], "arch", ["mdf", "acrylic", "fabric"], [10, 0.6, 4.8], 95000, "/extracted-boards/general-design-options.png", "READY", "PRIMITIVE_GEOMETRY", ["Flame-retardant certification remains BLOCKED."]),
  category("Decor Props", ["kalash", "diya cluster", "vase", "ritual prop"], ["/mandap", "/floral", "/cad/editor", "/assets"], "kalash", ["brass", "clay", "flower"], [1.2, 1.2, 1.4], 15000, "/extracted-boards/vedic-sacred-traditional-options.png", "READY", "PRIMITIVE_GEOMETRY", ["Ceremonial preview only; venue safety signoff remains external."]),
  category("Floral Installations", ["mandap canopy", "stage front", "entry arch", "hanging cloud"], ["/floral", "/mandap", "/cad/editor", "/assets"], "floral-garland", ["rose", "jasmine", "marigold", "foliage"], [5, 1.2, 1.6], 75000, "/extracted-boards/unique-design-options.png", "READY", "PRIMITIVE_GEOMETRY", ["Fresh flower sourcing is demo metadata; live vendors remain BLOCKED."]),
  category("Flower Types", ["rose", "jasmine", "marigold", "orchid"], ["/floral", "/assets"], "floral-garland", ["fresh flower", "foliage"], [0.3, 0.3, 0.4], 5000, "/extracted-boards/vedic-lotus-all-pages-board.png", "READY", "METADATA_CARD", ["Botanical availability is preview metadata, not procurement confirmation."]),
  category("Furniture", ["sofa", "lounge chair", "console", "ottoman"], ["/layouts", "/guests", "/cad/editor", "/assets"], "sofa", ["ivory fabric", "wood", "brass"], [3, 1.2, 1.1], 35000, "/extracted-boards/traditional-royal-cad-presentation.png", "READY", "PRIMITIVE_GEOMETRY", ["Furniture quantities are preview estimates only."]),
  category("Seating", ["vip seating", "family seating", "general seating", "lounge seating"], ["/layouts", "/guests", "/cad/editor", "/assets"], "chair", ["chair", "fabric", "brass"], [0.8, 0.8, 1.1], 12000, "/extracted-boards/all-pages-black-gold-board.png", "READY", "PRIMITIVE_GEOMETRY", ["Accessibility and evacuation compliance remain BLOCKED."]),
  category("Tables", ["dining table", "console table", "ritual table", "buffet counter"], ["/layouts", "/budget", "/cad/editor", "/assets"], "table", ["wood", "linen", "stone"], [2.2, 1.4, 0.9], 18000, "/extracted-boards/general-design-options.png", "READY", "PRIMITIVE_GEOMETRY", ["Food service compliance is not validated."]),
  category("Lighting Fixtures", ["chandelier", "moving head", "wash light", "focus light"], ["/lighting", "/cad/editor", "/assets"], "chandelier", ["warm led", "brass", "crystal"], [2, 2, 1.4], 45000, "/extracted-boards/sci-fi-futuristic-options.png", "READY", "PRIMITIVE_GEOMETRY", ["Electrical load validation remains BLOCKED."]),
  category("Decorative Lighting", ["fairy lights", "diya lighting", "lanterns", "ambient strips"], ["/lighting", "/floral", "/cad/editor", "/assets"], "diya", ["led", "brass", "warm amber"], [1, 1, 0.5], 18000, "/extracted-boards/vedic-sacred-traditional-options.png", "READY", "PRIMITIVE_GEOMETRY", ["Electrical safety certification remains BLOCKED."]),
  category("Effects", ["haze", "confetti", "spark cold pyro", "water shimmer"], ["/lighting", "/production", "/assets"], "drone-path-marker", ["effect cue", "timing", "safety"], [1, 1, 1], 50000, "/extracted-boards/sci-fi-futuristic-options.png", "PARTIAL", "METADATA_CARD", ["Special effects require venue and authority approval; preview only."]),
  category("Truss & Rigging", ["box truss", "goalpost truss", "hanging point", "ceiling rig"], ["/lighting", "/production", "/cad/editor", "/assets"], "truss", ["ms truss", "aluminium", "safety cable"], [8, 0.6, 0.6], 85000, "/extracted-boards/sci-fi-futuristic-options.png", "PARTIAL", "PRIMITIVE_GEOMETRY", ["Rigging load validation remains BLOCKED."]),
  category("LED & Screens", ["led wall", "floor led", "portal screen", "control monitor"], ["/lighting", "/cad/editor", "/assets"], "led-wall", ["led panel", "processor", "cabling"], [8, 0.4, 4], 160000, "/extracted-boards/sci-fi-futuristic-options.png", "READY", "PRIMITIVE_GEOMETRY", ["Electrical and content playback validation remain BLOCKED."]),
  category("Audio", ["line array", "subwoofer", "console", "monitor"], ["/production", "/assets"], "truss", ["speaker", "console", "cable"], [1.2, 1, 1.8], 60000, "/extracted-boards/all-pages-black-gold-board.png", "PARTIAL", "METADATA_CARD", ["Audio inventory is generated metadata; live vendor and SPL compliance remain BLOCKED."]),
  category("Venue Zones", ["entry zone", "dining zone", "parking zone", "photo zone"], ["/venue-designer", "/layouts", "/cad/editor", "/assets"], "parking-block", ["zone marker", "surface", "signage"], [10, 6, 0.2], 25000, "/extracted-boards/all-pages-black-gold-board.png", "READY", "PRIMITIVE_GEOMETRY", ["Venue authority approval remains external."]),
  category("Utilities", ["power zone", "water point", "service lane", "storage bay"], ["/production", "/venue-designer", "/cad/editor", "/assets"], "parking-block", ["utility", "marking", "service"], [4, 3, 0.2], 20000, "/extracted-boards/all-pages-black-gold-board.png", "PARTIAL", "PRIMITIVE_GEOMETRY", ["Utility placement requires venue and electrical validation."]),
  category("Guest Planning", ["vip block", "family block", "general block", "accessibility block"], ["/guests", "/layouts", "/cad/editor", "/assets"], "chair", ["guest flow", "seating", "access"], [6, 4, 0.2], 10000, "/extracted-boards/all-pages-black-gold-board.png", "READY", "PRIMITIVE_GEOMETRY", ["Evacuation and accessibility compliance remain BLOCKED."]),
  category("Vendor Documents", ["quote", "insurance", "contract", "license"], ["/vendors", "/production", "/assets"], "table", ["vendor", "document", "external"], [0.1, 0.1, 0.1], 0, "/extracted-boards/premium-dashboard-reference.png", "BLOCKED", "BLOCKED_EXTERNAL", ["Live vendor documents are external and not available in this preview."]),
  category("Production Planning", ["work order", "call sheet", "crew block", "install task"], ["/production", "/admin", "/assets"], "table", ["crew", "task", "schedule"], [1, 1, 0.2], 0, "/extracted-boards/premium-dashboard-reference.png", "PARTIAL", "DOCUMENT_TEMPLATE", ["Production planning is local preview metadata, not a live operations sync."]),
  category("Drone Planning", ["path marker", "launch zone", "orbit path", "restricted zone"], ["/drone", "/cad/editor", "/assets"], "drone-path-marker", ["drone", "path", "flight"], [1, 1, 1], 30000, "/extracted-boards/sci-fi-futuristic-options.png", "PARTIAL", "PRIMITIVE_GEOMETRY", ["Flight permission and safety validation remain BLOCKED."]),
  category("VR Walkthrough", ["camera path", "viewpoint", "navigation marker", "scene hotspot"], ["/vr", "/cad/editor", "/assets"], "drone-path-marker", ["camera", "walkthrough", "view"], [1, 1, 1], 15000, "/extracted-boards/all-pages-black-gold-board.png", "PARTIAL", "PRIMITIVE_GEOMETRY", ["No headset build or device export pipeline is included."]),
  category("Boards", ["cover board", "concept board", "lighting board", "budget board"], ["/exports", "/vr", "/assets"], "table", ["board", "pdf", "presentation"], [1.2, 0.8, 0.05], 0, "/extracted-boards/vedic-lotus-all-pages-board.png", "READY", "BOARD_IMAGE", ["Board output is preview HTML/PDF-package framing; production print QA is not certified."]),
  category("Templates", ["mandap template", "layout template", "lighting template", "production template"], ["/templates", "/cad/editor", "/assets"], "mandap", ["template", "scene", "budget"], [4, 4, 1], 0, "/extracted-boards/general-design-options.png", "READY", "DOCUMENT_TEMPLATE", ["Template data is local preview JSON only."]),
  category("AI Outputs", ["prompt result", "mood variation", "layout suggestion", "style generation"], ["/ai", "/assets"], "arch", ["ai", "generated metadata", "prompt"], [1, 1, 1], 0, "/extracted-boards/premium-dashboard-reference.png", "PARTIAL", "METADATA_CARD", ["No live AI model integration evidence exists in this preview."])
];

export const assetCategorySlugs = Object.fromEntries(assetCategoryDefinitions.map((definition) => [definition.category, definition.slug])) as Record<AssetCategory, string>;

export const templateAssetReferences = {
  "hemant-samwat-wedding": [
    assetIdFor("Mandaps", "Hemant Samwat"),
    assetIdFor("Floral Installations", "Vedic Lotus"),
    assetIdFor("Lighting Fixtures", "Royal Palace"),
    assetIdFor("Venue Zones", "Garden Mandap"),
    assetIdFor("Boards", "Hemant Samwat"),
    assetIdFor("Production Planning", "Hemant Samwat")
  ],
  "vedic-lotus-mandap": [
    assetIdFor("Mandaps", "Vedic Lotus"),
    assetIdFor("Pillars", "Vedic Lotus"),
    assetIdFor("Floral Installations", "Vedic Lotus"),
    assetIdFor("Decorative Lighting", "Sacred Agni"),
    assetIdFor("Boards", "Vedic Lotus")
  ],
  "royal-palace-wedding": [
    assetIdFor("Mandaps", "Royal Palace"),
    assetIdFor("Gates & Arches", "Royal Palace"),
    assetIdFor("Furniture", "Royal Palace"),
    assetIdFor("Lighting Fixtures", "Grand Heritage"),
    assetIdFor("Templates", "Royal Palace")
  ],
  "temple-mandap": [
    assetIdFor("Mandaps", "Temple Mandap"),
    assetIdFor("Pillars", "Temple Mandap"),
    assetIdFor("Decor Props", "Kalash Court"),
    assetIdFor("Decorative Lighting", "Sacred Agni"),
    assetIdFor("Templates", "Temple Mandap")
  ],
  "sci-fi-galactic-portal": [
    assetIdFor("Gates & Arches", "Sci-Fi Galactic Portal"),
    assetIdFor("LED & Screens", "Sci-Fi Galactic Portal"),
    assetIdFor("Truss & Rigging", "Sci-Fi Galactic Portal"),
    assetIdFor("Lighting Fixtures", "Cyber Neon"),
    assetIdFor("Drone Planning", "Sci-Fi Galactic Portal")
  ],
  "garden-mandap": [
    assetIdFor("Mandaps", "Garden Mandap"),
    assetIdFor("Venue Zones", "Garden Mandap"),
    assetIdFor("Floral Installations", "Garden Mandap"),
    assetIdFor("Flower Types", "Garden Mandap"),
    assetIdFor("Templates", "Garden Mandap")
  ],
  "navagraha-grid": [
    assetIdFor("Mandaps", "Navagraha Grid"),
    assetIdFor("Decor Props", "Navagraha Grid"),
    assetIdFor("Seating", "Navagraha Grid"),
    assetIdFor("Boards", "Navagraha Grid"),
    assetIdFor("Templates", "Navagraha Grid")
  ],
  "panch-tatva-mandap": [
    assetIdFor("Mandaps", "Panch Tatva"),
    assetIdFor("Venue Zones", "Panch Tatva"),
    assetIdFor("Decorative Lighting", "Panch Tatva"),
    assetIdFor("Floral Installations", "Panch Tatva"),
    assetIdFor("Templates", "Panch Tatva")
  ]
} as const;

let parsedAssets: WeddingCADAsset[] | null = null;

export function generateWeddingCadAssets(): WeddingCADAsset[] {
  return assetCategoryDefinitions.flatMap((definition) =>
    assetStyleVariants.map((style, index) => generateAssetRecord(definition, style, index))
  );
}

export function buildAssetRegistryFile(assets = generateWeddingCadAssets()): AssetRegistryFile {
  return {
    generatedAt: GENERATED_AT,
    verdict: "CONTROLLED_PREVIEW_READY",
    productionReady: false,
    categories: assetCategoryValues.map((categoryName) => ({
      category: categoryName,
      count: assets.filter((asset) => asset.category === categoryName).length
    })),
    templates: Object.fromEntries(Object.entries(templateAssetReferences).map(([id, refs]) => [id, [...refs]])),
    assets
  };
}

export function getRegisteredAssets(): WeddingCADAsset[] {
  if (!parsedAssets) {
    parsedAssets = (registryJson.assets ?? []).map((asset) => WeddingCADAssetSchema.parse(asset));
  }
  return parsedAssets;
}

export function getAssetById(assetId: string) {
  return getRegisteredAssets().find((asset) => asset.id === assetId);
}

export function getAssetPrimitiveKind(asset: WeddingCADAsset): StarterObjectKind {
  const primitiveKind = asset.fileRefs.primitiveKind;
  return isStarterObjectKind(primitiveKind) ? primitiveKind : "table";
}

export function isCadInsertableAsset(asset: WeddingCADAsset) {
  return asset.status !== "BLOCKED" && Boolean(asset.fileRefs.primitiveKind);
}

export function getRegistryTemplateAssetIds() {
  return registryJson.templates ?? {};
}

export function summarizeAssetRegistry(assets = getRegisteredAssets()) {
  const statusCounts = {
    READY: assets.filter((asset) => asset.status === "READY").length,
    PARTIAL: assets.filter((asset) => asset.status === "PARTIAL").length,
    BLOCKED: assets.filter((asset) => asset.status === "BLOCKED").length
  };
  const categoryCounts = assetCategoryValues.map((categoryName) => ({
    category: categoryName,
    count: assets.filter((asset) => asset.category === categoryName).length,
    ready: assets.filter((asset) => asset.category === categoryName && asset.status === "READY").length,
    partial: assets.filter((asset) => asset.category === categoryName && asset.status === "PARTIAL").length,
    blocked: assets.filter((asset) => asset.category === categoryName && asset.status === "BLOCKED").length
  }));
  const cadInsertable = assets.filter(isCadInsertableAsset);
  const glbMeshAssets = assets.filter((asset) => typeof asset.fileRefs.mesh === "string" && asset.fileRefs.mesh.endsWith(".glb"));
  return {
    status: "READY" as const,
    total: assets.length,
    categoryCount: categoryCounts.length,
    categories: categoryCounts,
    statusCounts,
    cadInsertable: cadInsertable.length,
    readyInsertable: cadInsertable.filter((asset) => asset.status === "READY").length,
    partialInsertable: cadInsertable.filter((asset) => asset.status === "PARTIAL").length,
    blockedExternal: assets.filter((asset) => asset.source === "BLOCKED_EXTERNAL").length,
    missingRealMeshes: cadInsertable.filter((asset) => !asset.fileRefs.mesh).length,
    glbMeshFiles: glbMeshAssets.length,
    templateReferenceCount: Object.values(templateAssetReferences).reduce((sum, refs) => sum + refs.length, 0)
  };
}

function generateAssetRecord(definition: AssetCategoryDefinition, style: string, index: number): WeddingCADAsset {
  const sequence = index + 1;
  const status = statusFor(definition, index);
  const source = sourceFor(status);
  const slug = `${definition.slug}-${slugify(style)}-${String(sequence).padStart(3, "0")}`;
  const widthM = round(definition.baseDimensions.widthM + (index % 4) * 0.35);
  const depthM = round(definition.baseDimensions.depthM + (index % 3) * 0.28);
  const heightM = round(definition.baseDimensions.heightM + (index % 5) * 0.22);
  const minCost = definition.baseCost + sequence * (definition.baseCost > 0 ? 1400 : 0);
  const maxCost = definition.baseCost > 0 ? minCost + Math.round(definition.baseCost * 0.32) + 6000 : 0;
  const localPreview = status !== "BLOCKED";
  const primitiveKind = localPreview ? definition.primitiveKind : undefined;
  const mesh = primitiveKind ? `${MESH_REF_PREFIX}/${slug}.glb` : null;

  return WeddingCADAssetSchema.parse({
    id: slug,
    slug,
    name: `${style} ${definition.category}`,
    category: definition.category,
    subcategory: definition.subcategories[index % definition.subcategories.length],
    description: `${style} ${definition.category.toLowerCase()} asset generated for local TLP Wedding CAD preview planning.`,
    status,
    source,
    usableInRoutes: definition.routes,
    dimensions: {
      widthM,
      depthM,
      heightM,
      unit: "m"
    },
    materials: [...definition.materialTags],
    tags: [
      definition.slug,
      slugify(style),
      slugify(definition.subcategories[index % definition.subcategories.length]),
      status.toLowerCase(),
      source.toLowerCase(),
      "hemant-samwat",
      "local-preview"
    ],
    previewType: localPreview ? definition.previewType : "BLOCKED_EXTERNAL",
    fileRefs: {
      previewImage: localPreview ? definition.previewImage : null,
      metadata: METADATA_REF,
      primitiveKind,
      mesh,
      sourceDocument: localPreview ? `${METADATA_REF}#${slug}` : null
    },
    costRange: {
      currency: "INR",
      min: minCost,
      max: maxCost
    },
    safetyNotes: [
      ...definition.safetyNotes,
      primitiveKind
        ? "Generated GLB mesh is a local primitive preview asset, not a certified vendor production model."
        : "No GLB mesh file is claimed for this asset; preview uses metadata only."
    ],
    evidenceRef: `${EVIDENCE_REF}#${definition.slug}`,
    createdAt: GENERATED_AT,
    updatedAt: GENERATED_AT
  });
}

function statusFor(definition: AssetCategoryDefinition, index: number): AssetStatus {
  if (definition.defaultStatus === "BLOCKED") return "BLOCKED";
  if (definition.defaultStatus === "PARTIAL") return index % 6 === 0 ? "BLOCKED" : "PARTIAL";
  return index % 12 === 0 && ["Truss & Rigging", "Effects", "Audio", "Drone Planning", "VR Walkthrough", "AI Outputs"].includes(definition.category)
    ? "PARTIAL"
    : "READY";
}

function sourceFor(status: AssetStatus): AssetSource {
  if (status === "READY") return "LOCAL_PREVIEW";
  if (status === "PARTIAL") return "GENERATED_METADATA";
  return "BLOCKED_EXTERNAL";
}

function category(
  categoryName: AssetCategory,
  subcategories: string[],
  routes: string[],
  primitiveKind: StarterObjectKind,
  materialTags: string[],
  baseDimensions: [number, number, number],
  baseCost: number,
  previewImage: string,
  defaultStatus: AssetStatus,
  previewType: AssetPreviewType,
  safetyNotes: string[]
): AssetCategoryDefinition {
  return {
    category: categoryName,
    slug: slugify(categoryName),
    subcategories,
    routes,
    primitiveKind,
    materialTags,
    baseDimensions: {
      widthM: baseDimensions[0],
      depthM: baseDimensions[1],
      heightM: baseDimensions[2]
    },
    baseCost,
    previewImage,
    defaultStatus,
    previewType,
    safetyNotes
  };
}

function assetIdFor(categoryName: AssetCategory, style: (typeof assetStyleVariants)[number]) {
  const definition = assetCategoryDefinitions.find((item) => item.category === categoryName);
  const styleIndex = assetStyleVariants.indexOf(style);
  if (!definition || styleIndex < 0) {
    throw new Error(`Unknown asset reference ${categoryName} / ${style}`);
  }
  return `${definition.slug}-${slugify(style)}-${String(styleIndex + 1).padStart(3, "0")}`;
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function isStarterObjectKind(value: unknown): value is StarterObjectKind {
  return (
    typeof value === "string" &&
    [
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
    ].includes(value)
  );
}
