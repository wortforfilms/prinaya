import { existsSync, readFileSync } from "node:fs";
import {
  tlpsUniqueExtractionFrames,
  tlpsUniqueExtractionSources,
  tlpsUniqueExtractionSummary,
  tlpsUniqueExtractions
} from "../src/lib/tlps-unique-extractions";

const dataPath = new URL("../data/tlps-unique-extractions.json", import.meta.url);
const evidencePath = new URL("../release/evidence/tlps-unique-extractions.json", import.meta.url);

if (!existsSync(dataPath)) {
  throw new Error("Missing data/tlps-unique-extractions.json");
}

if (!existsSync(evidencePath)) {
  throw new Error("Missing release/evidence/tlps-unique-extractions.json");
}

const evidence = JSON.parse(readFileSync(evidencePath, "utf8")) as {
  verdict: string;
  productionReady: boolean;
  sourceCount: number;
  uniqueSourceCount: number;
  duplicateSourceCount: number;
  uniqueFrameCount: number;
  duplicateFrameCount: number;
};

if (tlpsUniqueExtractions.verdict !== "CONTROLLED_PREVIEW_READY" || evidence.verdict !== "CONTROLLED_PREVIEW_READY") {
  throw new Error("TLPS unique extraction verdict must remain CONTROLLED_PREVIEW_READY");
}

if (tlpsUniqueExtractions.productionReady !== false || evidence.productionReady !== false) {
  throw new Error("TLPS unique extraction must keep PRODUCTION_READY=false");
}

if (tlpsUniqueExtractionSummary.sourceCount !== 31) {
  throw new Error(`Expected 31 supplied source PNGs, found ${tlpsUniqueExtractionSummary.sourceCount}`);
}

if (tlpsUniqueExtractionSummary.uniqueSourceCount !== 30) {
  throw new Error(`Expected 30 unique source PNGs, found ${tlpsUniqueExtractionSummary.uniqueSourceCount}`);
}

if (tlpsUniqueExtractionSummary.duplicateSourceCount !== 1) {
  throw new Error(`Expected 1 related duplicate source, found ${tlpsUniqueExtractionSummary.duplicateSourceCount}`);
}

if (tlpsUniqueExtractionSummary.uniqueFrameCount < 590) {
  throw new Error(`Expected at least 590 unique extracted frames, found ${tlpsUniqueExtractionSummary.uniqueFrameCount}`);
}

if (tlpsUniqueExtractionSummary.duplicateFrameCount !== 0) {
  throw new Error(`Expected 0 duplicate extracted frames after dedupe, found ${tlpsUniqueExtractionSummary.duplicateFrameCount}`);
}

if (
  evidence.sourceCount !== tlpsUniqueExtractionSummary.sourceCount ||
  evidence.uniqueSourceCount !== tlpsUniqueExtractionSummary.uniqueSourceCount ||
  evidence.duplicateSourceCount !== tlpsUniqueExtractionSummary.duplicateSourceCount ||
  evidence.uniqueFrameCount !== tlpsUniqueExtractionSummary.uniqueFrameCount ||
  evidence.duplicateFrameCount !== tlpsUniqueExtractionSummary.duplicateFrameCount
) {
  throw new Error("TLPS unique extraction evidence counts do not match data registry");
}

const sourceIds = new Set(tlpsUniqueExtractionSources.map((source) => source.id));
const sourceSlugs = new Set(tlpsUniqueExtractionSources.map((source) => source.slug));
const frameIds = new Set(tlpsUniqueExtractionFrames.map((frame) => frame.id));
const frameSlugs = new Set(tlpsUniqueExtractionFrames.map((frame) => frame.slug));
const frameHashes = new Set(tlpsUniqueExtractionFrames.map((frame) => frame.sha256));

if (sourceIds.size !== tlpsUniqueExtractionSources.length || sourceSlugs.size !== tlpsUniqueExtractionSources.length) {
  throw new Error("Source IDs and slugs must be unique");
}

if (frameIds.size !== tlpsUniqueExtractionFrames.length || frameSlugs.size !== tlpsUniqueExtractionFrames.length) {
  throw new Error("Frame IDs and slugs must be unique");
}

if (frameHashes.size !== tlpsUniqueExtractionFrames.length) {
  throw new Error("Frame SHA hashes must be unique after dedupe");
}

const duplicateGroup = tlpsUniqueExtractions.duplicateSourceGroups.find(
  (group) => group.canonical === "TLP_Wedding_CAD_All_Hero_Banners.png"
);

if (!duplicateGroup?.duplicates.includes("TLP_Wedding_CAD_All_Hero_Banners_With_Cutting_Guides.png")) {
  throw new Error("Expected the CAD hero cutting-guide sheet to be recorded as duplicate evidence");
}

for (const source of tlpsUniqueExtractionSources.filter((record) => record.status === "READY")) {
  if (!source.sourceImage) {
    throw new Error(`READY source ${source.id} is missing a local source image`);
  }
  if (!existsSync(new URL(`../public${source.sourceImage}`, import.meta.url))) {
    throw new Error(`READY source ${source.id} points to a missing source image: ${source.sourceImage}`);
  }
}

for (const frame of tlpsUniqueExtractionFrames) {
  if (!sourceIds.has(frame.sourceId)) {
    throw new Error(`Frame ${frame.id} references unknown source ${frame.sourceId}`);
  }
  if (frame.status !== "READY") {
    throw new Error(`Frame ${frame.id} is not READY`);
  }
  if (!existsSync(new URL(`../public${frame.image}`, import.meta.url))) {
    throw new Error(`Frame ${frame.id} points to a missing image: ${frame.image}`);
  }
}

for (const kind of ["hero-banner", "filmy-hero-banner", "homepage-section", "vedi-map", "design-option", "ui-panel"]) {
  if ((tlpsUniqueExtractionSummary.frameKinds[kind] ?? 0) === 0) {
    throw new Error(`Missing required unique frame kind: ${kind}`);
  }
}

console.log(
  `verify:tlps:unique passed (${tlpsUniqueExtractionSummary.uniqueFrameCount} unique frames, ${tlpsUniqueExtractionSummary.uniqueSourceCount}/${tlpsUniqueExtractionSummary.sourceCount} unique sources, ${tlpsUniqueExtractionSummary.duplicateSourceCount} duplicate source skipped)`
);
