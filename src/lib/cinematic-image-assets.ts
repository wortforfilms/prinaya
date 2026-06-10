import cinematicImageAssetJson from "../../data/cinematic-image-assets.json";

export type CinematicAspectId = "cinematic-21x9" | "desktop-16x9" | "board-4x3" | "portrait-4x5" | "square-1x1";

export type CinematicImageStatus = "READY";
export type CinematicGenerationMode = "CINEMATIC_LOCAL_DERIVATIVE";

export type CinematicAspectVariant = {
  id: CinematicAspectId;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
};

export type CinematicImageVariant = {
  aspectId: CinematicAspectId;
  label: string;
  image: string;
  width: number;
  height: number;
  aspectRatio: string;
  bytes: number;
  sha256: string;
};

export type CinematicImageAsset = {
  id: string;
  slug: string;
  status: CinematicImageStatus;
  productionReady: false;
  generationMode: CinematicGenerationMode;
  sourceImage: string;
  sourceClass: string;
  sourceSha256: string;
  originalWidth: number;
  originalHeight: number;
  variants: CinematicImageVariant[];
  evidenceRef: string;
};

export type CinematicDuplicateGroup = {
  canonical: string;
  duplicates: string[];
  reason: string;
};

export type CinematicImageRegistry = {
  generatedAt: string;
  status: CinematicImageStatus;
  verdict: "CONTROLLED_PREVIEW_READY";
  productionReady: false;
  generationMode: CinematicGenerationMode;
  assetTruth: string;
  sourceRoot: string;
  outputRoot: string;
  sourceCount: number;
  uniqueSourceCount: number;
  duplicateSourceCount: number;
  duplicateGroups: CinematicDuplicateGroup[];
  aspectVariantCount: number;
  totalVariantCount: number;
  totalBytes: number;
  aspectVariants: CinematicAspectVariant[];
  sourceClassCounts: Record<string, number>;
  records: CinematicImageAsset[];
};

export const cinematicImageRegistry = cinematicImageAssetJson as CinematicImageRegistry;
export const cinematicImageAssets = cinematicImageRegistry.records;

const assetsBySource = new Map(cinematicImageAssets.map((asset) => [normalizePath(asset.sourceImage), asset]));
const duplicateSourceAliases = new Map(
  cinematicImageRegistry.duplicateGroups.flatMap((group) =>
    group.duplicates.map((duplicate) => [normalizePath(duplicate), normalizePath(group.canonical)] as const)
  )
);

export const cinematicImageAssetSummary = {
  status: cinematicImageRegistry.status,
  verdict: cinematicImageRegistry.verdict,
  productionReady: cinematicImageRegistry.productionReady,
  generationMode: cinematicImageRegistry.generationMode,
  sourceCount: cinematicImageRegistry.sourceCount,
  uniqueSourceCount: cinematicImageRegistry.uniqueSourceCount,
  duplicateSourceCount: cinematicImageRegistry.duplicateSourceCount,
  aspectVariantCount: cinematicImageRegistry.aspectVariantCount,
  totalVariantCount: cinematicImageRegistry.totalVariantCount,
  totalBytes: cinematicImageRegistry.totalBytes,
  sourceClassCounts: cinematicImageRegistry.sourceClassCounts,
  evidenceRef: "release/evidence/cinematic-image-assets.json"
};

export function getCinematicAssets() {
  return cinematicImageAssets;
}

export function getCinematicAssetsByClass(sourceClass: string) {
  return cinematicImageAssets.filter((asset) => asset.sourceClass === sourceClass);
}

export function getCinematicAssetForSource(sourceImage: string | undefined | null) {
  if (!sourceImage) return undefined;
  const normalized = normalizePath(sourceImage);
  const canonical = duplicateSourceAliases.get(normalized) ?? normalized;
  return assetsBySource.get(canonical);
}

export function getCinematicVariantForSource(sourceImage: string | undefined | null, aspectId: CinematicAspectId = "desktop-16x9") {
  const asset = getCinematicAssetForSource(sourceImage);
  return asset?.variants.find((variant) => variant.aspectId === aspectId) ?? asset?.variants[0];
}

export function getCinematicImageForSource(sourceImage: string | undefined | null, aspectId: CinematicAspectId = "desktop-16x9") {
  return getCinematicVariantForSource(sourceImage, aspectId)?.image ?? sourceImage ?? "";
}

export function searchCinematicAssets(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return cinematicImageAssets;
  return cinematicImageAssets.filter((asset) =>
    [asset.id, asset.slug, asset.sourceImage, asset.sourceClass].some((value) => value.toLowerCase().includes(normalized))
  );
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}
