import { getAssetById, getAssetPrimitiveKind } from "./asset-registry";
import { getAllAssets, searchAssets } from "./asset-preview-runtime";
import type { AssetCategory, WeddingCADAsset } from "./schemas";
import type { StarterObjectKind } from "./data-frames";

export type WeddingAssetCategory = AssetCategory;

export type WeddingAssetDefinition = WeddingCADAsset & {
  starterKind: StarterObjectKind;
  layerId: string;
  materialId: string;
  style: string;
  estimatedInr: number;
};

export const weddingAssets: WeddingAssetDefinition[] = getAllAssets().map(adaptAssetForLegacyRuntime);

export const weddingAssetSummary = {
  total: weddingAssets.length,
  requiredPerCategory: 24,
  byCategory: Array.from(new Set(weddingAssets.map((asset) => asset.category))).map((category) => ({
    category,
    count: weddingAssets.filter((asset) => asset.category === category).length
  }))
};

export function findWeddingAsset(assetId: string) {
  const asset = getAssetById(assetId);
  return asset ? adaptAssetForLegacyRuntime(asset) : undefined;
}

export function searchWeddingAssets(query: string, limit = 24) {
  return searchAssets(query, limit).map(adaptAssetForLegacyRuntime);
}

function adaptAssetForLegacyRuntime(asset: WeddingCADAsset): WeddingAssetDefinition {
  return {
    ...asset,
    starterKind: getAssetPrimitiveKind(asset),
    layerId: layerForCategory(asset.category),
    materialId: materialForAsset(asset),
    style: asset.tags.find((tag) => tag !== "local-preview" && tag !== "hemant-samwat") ?? asset.subcategory,
    estimatedInr: asset.costRange.max
  };
}

function layerForCategory(category: AssetCategory) {
  if (["Mandaps", "Pillars", "Decor Props"].includes(category)) return "mandap";
  if (["Lighting Fixtures", "Decorative Lighting", "Truss & Rigging", "LED & Screens", "Effects", "Audio"].includes(category)) return "lighting";
  if (["Furniture", "Seating", "Tables", "Guest Planning"].includes(category)) return "seating";
  if (["Floral Installations", "Flower Types", "Backdrops"].includes(category)) return "decor";
  return "site";
}

function materialForAsset(asset: WeddingCADAsset) {
  const tags = asset.materials.join(" ").toLowerCase();
  if (tags.includes("brass") || tags.includes("crystal")) return "brass";
  if (tags.includes("flower") || tags.includes("foliage") || tags.includes("rose") || tags.includes("jasmine")) return "neem-greenery";
  if (tags.includes("led") || tags.includes("cable") || tags.includes("effect")) return "night-led";
  if (tags.includes("fabric") || tags.includes("linen")) return "lotus-fabric";
  return "ivory-stone";
}
