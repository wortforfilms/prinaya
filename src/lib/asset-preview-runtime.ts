import {
  assetCategoryDefinitions,
  getAssetById,
  getRegisteredAssets,
  isCadInsertableAsset,
  summarizeAssetRegistry
} from "./asset-registry";
import type { AssetCategory, AssetStatus, WeddingCADAsset } from "./schemas";

export function getAllAssets() {
  return getRegisteredAssets();
}

export function getAssetsByCategory(category?: AssetCategory | string) {
  const assets = getAllAssets();
  if (!category || category === "All") return assets;
  return assets.filter((asset) => asset.category === category);
}

export function getAssetsForRoute(route: string) {
  return getAllAssets().filter((asset) => asset.usableInRoutes.includes(route));
}

export function getAssetStats() {
  return summarizeAssetRegistry(getAllAssets());
}

export function getBlockedAssets() {
  return getAssetsByStatus("BLOCKED");
}

export function getReadyAssets() {
  return getAssetsByStatus("READY");
}

export function getPartialAssets() {
  return getAssetsByStatus("PARTIAL");
}

export function searchAssets(query: string, limit = 48) {
  const normalized = query.trim().toLowerCase();
  const assets = getAllAssets();
  const matches = normalized
    ? assets.filter((asset) =>
        [
          asset.id,
          asset.slug,
          asset.name,
          asset.category,
          asset.subcategory,
          asset.description,
          asset.status,
          asset.source,
          asset.previewType,
          ...asset.tags,
          ...asset.materials,
          ...asset.usableInRoutes
        ].some((value) => value.toLowerCase().includes(normalized))
      )
    : assets;
  return matches.slice(0, limit);
}

export function getCadInsertableAssets() {
  return getAllAssets().filter(isCadInsertableAsset);
}

export function getNonBlockedAssets() {
  return getAllAssets().filter((asset) => asset.status !== "BLOCKED");
}

export function getAssetRouteTags(asset: WeddingCADAsset) {
  return asset.usableInRoutes.map((route) => route.replace("/*", ""));
}

export function getAssetCategoryOptions() {
  return assetCategoryDefinitions.map((definition) => definition.category);
}

export function getAssetBySlugOrId(idOrSlug: string) {
  return getAssetById(idOrSlug) ?? getAllAssets().find((asset) => asset.slug === idOrSlug);
}

function getAssetsByStatus(status: AssetStatus) {
  return getAllAssets().filter((asset) => asset.status === status);
}
