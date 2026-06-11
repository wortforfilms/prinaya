import { existsSync, statSync } from "node:fs";
import {
  cinematicImageAssets,
  cinematicImageAssetSummary,
  cinematicImageRegistry,
  getCinematicVariantForRoute,
  getCinematicVariantForSource
} from "../src/lib/cinematic-image-assets";

const dataPath = new URL("../data/cinematic-image-assets.json", import.meta.url);
const evidencePath = new URL("../release/evidence/cinematic-image-assets.json", import.meta.url);

if (!existsSync(dataPath)) {
  throw new Error("Missing data/cinematic-image-assets.json");
}

if (!existsSync(evidencePath)) {
  throw new Error("Missing release/evidence/cinematic-image-assets.json");
}

if (cinematicImageRegistry.status !== "READY") {
  throw new Error(`Cinematic image registry status must be READY, received ${cinematicImageRegistry.status}`);
}

if (cinematicImageRegistry.verdict !== "CONTROLLED_PREVIEW_READY" || cinematicImageRegistry.productionReady !== false) {
  throw new Error("Cinematic image registry must preserve CONTROLLED_PREVIEW_READY and PRODUCTION_READY=false");
}

if (cinematicImageRegistry.generationMode !== "CINEMATIC_LOCAL_DERIVATIVE") {
  throw new Error("Cinematic image registry must use CINEMATIC_LOCAL_DERIVATIVE generation mode");
}

if (cinematicImageAssets.length < 650) {
  throw new Error(`Expected at least 650 unique cinematic image assets, received ${cinematicImageAssets.length}`);
}

if (cinematicImageRegistry.aspectVariantCount !== 5) {
  throw new Error(`Expected 5 aspect variants, received ${cinematicImageRegistry.aspectVariantCount}`);
}

if (cinematicImageRegistry.totalVariantCount !== cinematicImageAssets.length * cinematicImageRegistry.aspectVariantCount) {
  throw new Error("Cinematic image totalVariantCount does not match uniqueSourceCount * aspectVariantCount");
}

if (cinematicImageRegistry.totalBytes <= 0 || cinematicImageRegistry.totalBytes > 220 * 1024 * 1024) {
  throw new Error(`Unexpected cinematic image total bytes: ${cinematicImageRegistry.totalBytes}`);
}

if ((cinematicImageRegistry.uxSpaces?.length ?? 0) < 20) {
  throw new Error(`Expected at least 20 UX spaces, received ${cinematicImageRegistry.uxSpaces?.length ?? 0}`);
}

for (const requiredUxSpace of ["landing", "venue-designer", "mandap-designer", "floral-designer", "lighting-designer", "cad-editor"]) {
  if (!cinematicImageRegistry.uxSpaceCounts[requiredUxSpace]) {
    throw new Error(`Missing cinematic UX space coverage for ${requiredUxSpace}`);
  }
}

const slugs = new Set<string>();
const sourceImages = new Set<string>();
for (const asset of cinematicImageAssets) {
  if (slugs.has(asset.slug)) {
    throw new Error(`Duplicate cinematic asset slug: ${asset.slug}`);
  }
  slugs.add(asset.slug);

  if (sourceImages.has(asset.sourceImage)) {
    throw new Error(`Duplicate cinematic source image: ${asset.sourceImage}`);
  }
  sourceImages.add(asset.sourceImage);

  const sourcePath = new URL(`../public${asset.sourceImage}`, import.meta.url);
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing cinematic source image: ${asset.sourceImage}`);
  }

  if (asset.status !== "READY" || asset.productionReady !== false) {
    throw new Error(`Cinematic asset ${asset.id} has invalid status/production flags`);
  }

  if (!asset.uxSpace || !asset.uxSpaceLabel || !asset.uxRole) {
    throw new Error(`Cinematic asset ${asset.id} is missing UX-space metadata`);
  }

  if (!asset.routeBindings.length) {
    throw new Error(`Cinematic asset ${asset.id} has no route bindings`);
  }

  if (!asset.recommendedAspects.length) {
    throw new Error(`Cinematic asset ${asset.id} has no recommended aspects`);
  }

  if (asset.variants.length !== cinematicImageRegistry.aspectVariantCount) {
    throw new Error(`Cinematic asset ${asset.id} has ${asset.variants.length} variants`);
  }

  for (const variant of asset.variants) {
    const aspect = cinematicImageRegistry.aspectVariants.find((item) => item.id === variant.aspectId);
    if (!aspect) {
      throw new Error(`Unknown cinematic aspect id ${variant.aspectId}`);
    }
    if (variant.width !== aspect.width || variant.height !== aspect.height) {
      throw new Error(`Cinematic variant ${variant.image} has mismatched dimensions`);
    }
    if (!variant.image.startsWith(`/cinematic-assets/${asset.uxSpace}/`)) {
      throw new Error(`Cinematic variant ${variant.image} is not stored in its UX-space folder`);
    }
    const variantPath = new URL(`../public${variant.image}`, import.meta.url);
    if (!existsSync(variantPath)) {
      throw new Error(`Missing cinematic variant file: ${variant.image}`);
    }
    const bytes = statSync(variantPath).size;
    if (bytes <= 0 || bytes !== variant.bytes) {
      throw new Error(`Cinematic variant ${variant.image} byte count mismatch`);
    }
  }
}

const duplicateAlias = cinematicImageRegistry.duplicateGroups.find((group) => group.duplicates.length > 0)?.duplicates[0];
if (duplicateAlias && !getCinematicVariantForSource(duplicateAlias, "cinematic-21x9")) {
  throw new Error(`Duplicate alias ${duplicateAlias} did not resolve to a cinematic variant`);
}

const routeMandap = getCinematicVariantForRoute("/mandap", "cinematic-21x9");
if (!routeMandap?.image.includes("/cinematic-assets/mandap-designer/")) {
  throw new Error("/mandap did not resolve to a mandap-designer cinematic UX-space variant");
}

const routeHome = getCinematicVariantForRoute("/", "cinematic-21x9");
if (!routeHome?.image.includes("/cinematic-assets/landing/")) {
  throw new Error("/ did not resolve to a landing cinematic UX-space variant");
}

if (cinematicImageAssetSummary.uniqueSourceCount !== cinematicImageAssets.length) {
  throw new Error("Cinematic image summary uniqueSourceCount mismatch");
}

console.log(
  `verify:cinematic passed (${cinematicImageAssets.length} unique sources, ${cinematicImageRegistry.totalVariantCount} WebP variants)`
);
