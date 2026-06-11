import { z } from "zod";
import { starterObjectKinds, type StarterObjectKind } from "./data-frames";

const jsonValue = z.unknown();
const dateLike = z.union([z.string(), z.date()]);
const nullableString = z.string().nullable().optional();

export const modelNames = [
  "Organization",
  "User",
  "Role",
  "Permission",
  "Project",
  "Venue",
  "Scene",
  "Layer",
  "CADObject",
  "Material",
  "Asset",
  "Layout",
  "Mandap",
  "FloralDesign",
  "LightingPlan",
  "Fixture",
  "SeatingPlan",
  "Guest",
  "Vendor",
  "Task",
  "Budget",
  "BudgetItem",
  "RenderJob",
  "Camera",
  "Walkthrough",
  "Export",
  "MarketplaceItem",
  "ObservatoryEvent",
  "AIGeneration",
  "Evidence",
  "ReleaseGate"
] as const;

export type ModelName = (typeof modelNames)[number];

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: dateLike.optional(),
  updatedAt: dateLike.optional()
});
export type Organization = z.infer<typeof OrganizationSchema>;

export const UserSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: dateLike.optional(),
  updatedAt: dateLike.optional()
});
export type User = z.infer<typeof UserSchema>;

export const RoleSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  description: nullableString,
  createdAt: dateLike.optional(),
  updatedAt: dateLike.optional()
});
export type Role = z.infer<typeof RoleSchema>;

export const PermissionSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  createdAt: dateLike.optional()
});
export type Permission = z.infer<typeof PermissionSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  ownerId: nullableString,
  name: z.string(),
  clientName: z.string(),
  eventDate: dateLike,
  status: z.string(),
  productionReady: z.boolean(),
  createdAt: dateLike.optional(),
  updatedAt: dateLike.optional()
});
export type Project = z.infer<typeof ProjectSchema>;

export const VenueSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  lengthM: z.number(),
  widthM: z.number(),
  clearHeightM: z.number(),
  entries: z.number().int(),
  emergencyExits: z.number().int(),
  parkingBlocks: z.number().int(),
  metadata: jsonValue.optional()
});
export type Venue = z.infer<typeof VenueSchema>;

export const SceneSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  status: z.string(),
  worldUnits: z.string(),
  metadata: jsonValue.optional(),
  createdAt: dateLike.optional(),
  updatedAt: dateLike.optional()
});
export type Scene = z.infer<typeof SceneSchema>;

export const LayerSchema = z.object({
  id: z.string(),
  sceneId: z.string(),
  name: z.string(),
  visible: z.boolean(),
  locked: z.boolean(),
  color: z.string(),
  sortOrder: z.number().int()
});
export type Layer = z.infer<typeof LayerSchema>;

export const CADObjectSchema = z.object({
  id: z.string(),
  sceneId: z.string(),
  layerId: z.string(),
  materialId: nullableString,
  kind: z.string(),
  label: z.string(),
  position: z.tuple([z.number(), z.number(), z.number()]).or(jsonValue),
  rotation: z.tuple([z.number(), z.number(), z.number()]).or(jsonValue),
  scale: z.tuple([z.number(), z.number(), z.number()]).or(jsonValue),
  metadata: jsonValue.optional(),
  createdAt: dateLike.optional(),
  updatedAt: dateLike.optional()
});
export type CADObject = z.infer<typeof CADObjectSchema>;

export const MaterialSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  finish: z.string(),
  color: z.string(),
  usage: z.string(),
  metadata: jsonValue.optional()
});
export type Material = z.infer<typeof MaterialSchema>;

export const AssetSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  materialId: nullableString,
  category: z.string(),
  kind: z.string(),
  label: z.string(),
  geometry: jsonValue,
  status: z.string(),
  createdAt: dateLike.optional()
});
export type Asset = z.infer<typeof AssetSchema>;

export const assetStatusValues = ["READY", "PARTIAL", "BLOCKED"] as const;
export const assetSourceValues = ["LOCAL_PREVIEW", "GENERATED_METADATA", "BLOCKED_EXTERNAL"] as const;
export const assetPreviewTypeValues = [
  "PRIMITIVE_GEOMETRY",
  "BOARD_IMAGE",
  "DOCUMENT_TEMPLATE",
  "METADATA_CARD",
  "BLOCKED_EXTERNAL"
] as const;
export const assetCategoryValues = [
  "Mandaps",
  "Structural Elements",
  "Pillars",
  "Gates & Arches",
  "Backdrops",
  "Decor Props",
  "Floral Installations",
  "Flower Types",
  "Furniture",
  "Seating",
  "Tables",
  "Lighting Fixtures",
  "Decorative Lighting",
  "Effects",
  "Truss & Rigging",
  "LED & Screens",
  "Audio",
  "Venue Zones",
  "Utilities",
  "Guest Planning",
  "Vendor Documents",
  "Production Planning",
  "Drone Planning",
  "VR Walkthrough",
  "Boards",
  "Templates",
  "AI Outputs"
] as const;

export const AssetStatusSchema = z.enum(assetStatusValues);
export const AssetCategorySchema = z.enum(assetCategoryValues);

// Database enums (CapabilityStatus, ReleaseVerdict) cover status/verdict fields.
// `kind` and `category` stay String columns and are enforced here at the app layer:
// `kind` uses kebab-case values that are illegal Prisma enum identifiers, and the
// `category` columns hold heterogeneous vocabularies across models.
export const cadObjectKindValues = starterObjectKinds as [StarterObjectKind, ...StarterObjectKind[]];
export const releaseVerdictValues = ["CONTROLLED_PREVIEW_READY", "PRODUCTION_READY", "BLOCKED"] as const;
export const CapabilityStatusSchema = z.enum(assetStatusValues); // READY | PARTIAL | BLOCKED
export const ReleaseVerdictSchema = z.enum(releaseVerdictValues);
export const CadObjectKindSchema = z.enum(cadObjectKindValues);
export type CapabilityStatus = z.infer<typeof CapabilityStatusSchema>;
export type ReleaseVerdict = z.infer<typeof ReleaseVerdictSchema>;
export type CadObjectKind = z.infer<typeof CadObjectKindSchema>;
export const AssetDimensionSchema = z.object({
  widthM: z.number().nonnegative(),
  depthM: z.number().nonnegative(),
  heightM: z.number().nonnegative(),
  unit: z.literal("m")
});
export const AssetCostRangeSchema = z
  .object({
    currency: z.literal("INR"),
    min: z.number().nonnegative(),
    max: z.number().nonnegative()
  })
  .refine((value) => value.max >= value.min, "max cost must be greater than or equal to min cost");
export const WeddingCADAssetSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  category: AssetCategorySchema,
  subcategory: z.string().min(1),
  description: z.string().min(1),
  status: AssetStatusSchema,
  source: z.enum(assetSourceValues),
  usableInRoutes: z.array(z.string().min(1)).min(1),
  dimensions: AssetDimensionSchema,
  materials: z.array(z.string().min(1)),
  tags: z.array(z.string().min(1)),
  previewType: z.enum(assetPreviewTypeValues),
  fileRefs: z
    .object({
      previewImage: z.string().nullable(),
      metadata: z.string().min(1),
      primitiveKind: z.string().optional(),
      mesh: z.string().nullable().optional(),
      sourceDocument: z.string().nullable().optional()
    })
    .passthrough(),
  costRange: AssetCostRangeSchema,
  safetyNotes: z.array(z.string().min(1)),
  evidenceRef: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});
export type AssetStatus = z.infer<typeof AssetStatusSchema>;
export type AssetCategory = z.infer<typeof AssetCategorySchema>;
export type AssetDimension = z.infer<typeof AssetDimensionSchema>;
export type AssetCostRange = z.infer<typeof AssetCostRangeSchema>;
export type WeddingCADAsset = z.infer<typeof WeddingCADAssetSchema>;

export const LayoutSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  planJson: jsonValue,
  capacity: z.number().int(),
  status: z.string()
});
export type Layout = z.infer<typeof LayoutSchema>;

export const MandapSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  footprint: jsonValue,
  pillarCount: z.number().int(),
  canopyHeightM: z.number(),
  saptapadiDiameterM: z.number(),
  materials: jsonValue.optional()
});
export type Mandap = z.infer<typeof MandapSchema>;

export const FloralDesignSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  palette: jsonValue,
  garlandMeters: z.number(),
  decorItems: jsonValue,
  status: z.string()
});
export type FloralDesign = z.infer<typeof FloralDesignSchema>;

export const LightingPlanSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  status: z.string(),
  nightMode: z.boolean(),
  metadata: jsonValue.optional()
});
export type LightingPlan = z.infer<typeof LightingPlanSchema>;

export const FixtureSchema = z.object({
  id: z.string(),
  lightingPlanId: z.string(),
  label: z.string(),
  type: z.string(),
  count: z.number().int(),
  colorTemperatureK: z.number().int(),
  position: jsonValue.optional()
});
export type Fixture = z.infer<typeof FixtureSchema>;

export const SeatingPlanSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  totalSeats: z.number().int(),
  sections: jsonValue,
  status: z.string()
});
export type SeatingPlan = z.infer<typeof SeatingPlanSchema>;

export const GuestSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  seatingPlanId: nullableString,
  name: z.string(),
  groupName: z.string(),
  section: z.string(),
  status: z.string()
});
export type Guest = z.infer<typeof GuestSchema>;

export const VendorSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  projectId: nullableString,
  name: z.string(),
  category: z.string(),
  city: z.string(),
  status: z.string(),
  notes: nullableString
});
export type Vendor = z.infer<typeof VendorSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  category: z.string(),
  status: z.string(),
  dueAt: dateLike.nullable().optional()
});
export type Task = z.infer<typeof TaskSchema>;

export const BudgetSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  currency: z.string(),
  estimate: z.number(),
  status: z.string()
});
export type Budget = z.infer<typeof BudgetSchema>;

export const BudgetItemSchema = z.object({
  id: z.string(),
  budgetId: z.string(),
  label: z.string(),
  category: z.string(),
  estimated: z.number(),
  actual: z.number().nullable().optional(),
  status: z.string()
});
export type BudgetItem = z.infer<typeof BudgetItemSchema>;

export const RenderJobSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  cameraId: nullableString,
  label: z.string(),
  status: z.string(),
  outputPath: nullableString,
  createdAt: dateLike.optional()
});
export type RenderJob = z.infer<typeof RenderJobSchema>;

export const CameraSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  sceneId: nullableString,
  name: z.string(),
  mode: z.string(),
  position: jsonValue,
  target: jsonValue
});
export type Camera = z.infer<typeof CameraSchema>;

export const WalkthroughSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  status: z.string(),
  path: jsonValue
});
export type Walkthrough = z.infer<typeof WalkthroughSchema>;

export const ExportSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  label: z.string(),
  format: z.string(),
  status: z.string(),
  evidence: z.string(),
  createdAt: dateLike.optional()
});
export type Export = z.infer<typeof ExportSchema>;

export const MarketplaceItemSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  assetId: nullableString,
  title: z.string(),
  category: z.string(),
  priceEstimate: z.number().nullable().optional(),
  status: z.string()
});
export type MarketplaceItem = z.infer<typeof MarketplaceItemSchema>;

export const ObservatoryEventSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  projectId: nullableString,
  category: z.string(),
  label: z.string(),
  status: z.string(),
  metadata: jsonValue.optional(),
  createdAt: dateLike.optional()
});
export type ObservatoryEvent = z.infer<typeof ObservatoryEventSchema>;

export const AIGenerationSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  prompt: z.string(),
  model: z.string(),
  status: z.string(),
  output: jsonValue.optional(),
  createdAt: dateLike.optional()
});
export type AIGeneration = z.infer<typeof AIGenerationSchema>;

export const EvidenceSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  projectId: nullableString,
  releaseGateId: nullableString,
  kind: z.string(),
  path: z.string(),
  status: z.string(),
  summary: z.string(),
  createdAt: dateLike.optional()
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const ReleaseGateSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  projectId: nullableString,
  verdict: z.literal("CONTROLLED_PREVIEW_READY").or(z.literal("BLOCKED")).or(z.literal("PRODUCTION_READY")),
  productionReady: z.boolean(),
  blockers: jsonValue,
  evidenceSummary: jsonValue,
  createdAt: dateLike.optional()
});
export type ReleaseGate = z.infer<typeof ReleaseGateSchema>;

export const zodSchemaByModel: Record<ModelName, z.ZodTypeAny> = {
  Organization: OrganizationSchema,
  User: UserSchema,
  Role: RoleSchema,
  Permission: PermissionSchema,
  Project: ProjectSchema,
  Venue: VenueSchema,
  Scene: SceneSchema,
  Layer: LayerSchema,
  CADObject: CADObjectSchema,
  Material: MaterialSchema,
  Asset: AssetSchema,
  Layout: LayoutSchema,
  Mandap: MandapSchema,
  FloralDesign: FloralDesignSchema,
  LightingPlan: LightingPlanSchema,
  Fixture: FixtureSchema,
  SeatingPlan: SeatingPlanSchema,
  Guest: GuestSchema,
  Vendor: VendorSchema,
  Task: TaskSchema,
  Budget: BudgetSchema,
  BudgetItem: BudgetItemSchema,
  RenderJob: RenderJobSchema,
  Camera: CameraSchema,
  Walkthrough: WalkthroughSchema,
  Export: ExportSchema,
  MarketplaceItem: MarketplaceItemSchema,
  ObservatoryEvent: ObservatoryEventSchema,
  AIGeneration: AIGenerationSchema,
  Evidence: EvidenceSchema,
  ReleaseGate: ReleaseGateSchema
};
