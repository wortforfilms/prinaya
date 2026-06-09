import { createCadObject } from "./cad-runtime";
import { budgetItems, type BudgetItemFrame, type CadObjectFrame, type StarterObjectKind } from "./data-frames";
import { composeBoardPackage, type BoardPackageFrame } from "./board-runtime";
import { getAssetById, templateAssetReferences } from "./asset-registry";
import type { WeddingCADAsset } from "./schemas";

export type TemplateRuntimeId = keyof typeof templateAssetReferences;

export type TemplateRuntimeFrame = {
  id: TemplateRuntimeId;
  label: string;
  status: "READY";
  sceneObjects: CadObjectFrame[];
  budget: BudgetItemFrame[];
  assetList: WeddingCADAsset[];
  assetIds: string[];
  board: BoardPackageFrame;
};

const templateSeeds: Array<{
  id: TemplateRuntimeId;
  label: string;
  objectKinds: StarterObjectKind[];
  budgetMultiplier: number;
}> = [
  {
    id: "hemant-samwat-wedding",
    label: "Hemant Samwat Wedding",
    objectKinds: ["mandap", "stage", "gate", "floral-garland", "chandelier", "chair", "sofa", "table"],
    budgetMultiplier: 1.12
  },
  {
    id: "vedic-lotus-mandap",
    label: "Vedic Lotus",
    objectKinds: ["mandap", "pillar", "floral-garland", "kalash", "diya", "chair"],
    budgetMultiplier: 1.04
  },
  {
    id: "royal-palace-wedding",
    label: "Royal Palace",
    objectKinds: ["mandap", "stage", "gate", "pillar", "chandelier", "sofa"],
    budgetMultiplier: 1.24
  },
  {
    id: "temple-mandap",
    label: "Temple Mandap",
    objectKinds: ["mandap", "pillar", "diya", "kalash", "floral-garland"],
    budgetMultiplier: 1.07
  },
  {
    id: "sci-fi-galactic-portal",
    label: "Sci-Fi Galactic Portal",
    objectKinds: ["arch", "led-wall", "truss", "stage", "chandelier", "drone-path-marker"],
    budgetMultiplier: 1.18
  },
  {
    id: "garden-mandap",
    label: "Garden Mandap",
    objectKinds: ["tree", "mandap", "chair", "floral-garland", "water-pool"],
    budgetMultiplier: 1.06
  },
  {
    id: "navagraha-grid",
    label: "Navagraha",
    objectKinds: ["mandap", "diya", "chandelier", "floral-garland", "water-pool", "chair"],
    budgetMultiplier: 1.08
  },
  {
    id: "panch-tatva-mandap",
    label: "Panch Tatva",
    objectKinds: ["mandap", "tree", "water-pool", "diya", "floral-garland", "gate"],
    budgetMultiplier: 1.1
  }
];

export const templateRuntimeCatalog: TemplateRuntimeFrame[] = templateSeeds.map((seed) => buildTemplateRuntime(seed.id));

export const templateRuntimeSummary = {
  templates: templateRuntimeCatalog.length,
  readyTemplates: templateRuntimeCatalog.filter((template) => template.status === "READY").length,
  totalGeneratedObjects: templateRuntimeCatalog.reduce((sum, template) => sum + template.sceneObjects.length, 0),
  totalAssetLinks: templateRuntimeCatalog.reduce((sum, template) => sum + template.assetList.length, 0)
};

export function buildTemplateRuntime(id: TemplateRuntimeId): TemplateRuntimeFrame {
  const seed = templateSeeds.find((template) => template.id === id);
  if (!seed) {
    throw new Error(`Unknown template runtime: ${id}`);
  }
  const sceneObjects = seed.objectKinds.flatMap((kind, index) => {
    const base = createCadObject(kind, index);
    return [
      {
        ...base,
        id: `${id}-${base.id}`,
        label: `${seed.label} ${base.label}`,
        position: [base.position[0], base.position[1], base.position[2] + index * 0.8] as CadObjectFrame["position"]
      }
    ];
  });
  const assetIds = [...templateAssetReferences[id]];
  const assetList = assetIds.map((assetId) => getAssetById(assetId)).filter((asset): asset is WeddingCADAsset => Boolean(asset));
  const budget = budgetItems.map((item) => ({
    ...item,
    id: `${id}-${item.id}`,
    estimatedInr: Math.round(item.estimatedInr * seed.budgetMultiplier)
  }));

  return {
    id,
    label: seed.label,
    status: "READY",
    sceneObjects,
    budget,
    assetList,
    assetIds,
    board: composeBoardPackage(id)
  };
}
