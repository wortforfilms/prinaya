import tlpsUniqueExtractionJson from "../../data/tlps-unique-extractions.json";

export type TlpsUniqueSourceStatus = "READY" | "DUPLICATE_RELATED";
export type TlpsUniqueFrameStatus = "READY";

export type TlpsUniqueFrameKind =
  | "source"
  | "homepage-section"
  | "homepage-card"
  | "hero-banner"
  | "filmy-hero-banner"
  | "dashboard-shell"
  | "dashboard-hero"
  | "dashboard-actions"
  | "dashboard-modules"
  | "dashboard-widgets"
  | "ui-shell"
  | "ui-kpi"
  | "ui-workspace"
  | "ui-panel"
  | "vedi-workflow"
  | "vedi-panel"
  | "vedi-map"
  | "board-panel"
  | "board-page"
  | "design-option"
  | "technical-panel"
  | "material-strip"
  | "cad-elevation"
  | "cad-plan"
  | "cad-detail"
  | "cad-section"
  | "lighting-plan"
  | "render-frame"
  | "brand-footer";

export type TlpsCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TlpsUniqueSource = {
  id: string;
  slug: string;
  fileName: string;
  sourcePath: string;
  sha256: string;
  averageHash: string;
  differenceHash: string;
  width: number;
  height: number;
  status: TlpsUniqueSourceStatus;
  sourceImage: string | null;
  extractedFrameCount: number;
  uniqueFrameCount: number;
};

export type TlpsUniqueFrame = {
  id: string;
  sourceId: string;
  slug: string;
  label: string;
  kind: TlpsUniqueFrameKind;
  status: TlpsUniqueFrameStatus;
  image: string;
  crop: TlpsCrop;
  width: number;
  height: number;
  sha256: string;
  averageHash: string;
  differenceHash: string;
  evidenceRef: string;
};

export type TlpsDuplicateSourceGroup = {
  canonical: string;
  duplicates: string[];
  reason: string;
  distances: Array<{
    file: string;
    averageHashDistance: number;
    differenceHashDistance: number;
  }>;
};

export type TlpsDuplicateFrame = {
  id: string;
  sourceId: string;
  duplicateOf: string;
  label: string;
  kind: TlpsUniqueFrameKind;
  sha256: string;
  crop: TlpsCrop;
};

export type TlpsUniqueExtractionRegistry = {
  generatedAt: string;
  status: "READY";
  verdict: "CONTROLLED_PREVIEW_READY";
  productionReady: false;
  sourceDirectory: string;
  sourceCount: number;
  uniqueSourceCount: number;
  duplicateSourceCount: number;
  duplicateSourceGroups: TlpsDuplicateSourceGroup[];
  uniqueFrameCount: number;
  duplicateFrameCount: number;
  sources: TlpsUniqueSource[];
  frames: TlpsUniqueFrame[];
  duplicateFrames: TlpsDuplicateFrame[];
  assetTruth: string;
};

export const tlpsUniqueExtractions = tlpsUniqueExtractionJson as TlpsUniqueExtractionRegistry;
export const tlpsUniqueExtractionFrames = tlpsUniqueExtractions.frames;
export const tlpsUniqueExtractionSources = tlpsUniqueExtractions.sources;

export const tlpsUniqueExtractionSummary = {
  status: tlpsUniqueExtractions.status,
  verdict: tlpsUniqueExtractions.verdict,
  productionReady: tlpsUniqueExtractions.productionReady,
  sourceCount: tlpsUniqueExtractions.sourceCount,
  uniqueSourceCount: tlpsUniqueExtractions.uniqueSourceCount,
  duplicateSourceCount: tlpsUniqueExtractions.duplicateSourceCount,
  duplicateSourceGroups: tlpsUniqueExtractions.duplicateSourceGroups.length,
  uniqueFrameCount: tlpsUniqueExtractions.uniqueFrameCount,
  duplicateFrameCount: tlpsUniqueExtractions.duplicateFrameCount,
  frameKinds: countFramesByKind(tlpsUniqueExtractions.frames),
  evidenceRef: "release/evidence/tlps-unique-extractions.json"
};

export function getTlpsUniqueFrames() {
  return tlpsUniqueExtractionFrames;
}

export function getTlpsUniqueFramesByKind(kind: TlpsUniqueFrameKind) {
  return tlpsUniqueExtractionFrames.filter((frame) => frame.kind === kind);
}

export function getTlpsUniqueSource(slugOrId: string) {
  return tlpsUniqueExtractionSources.find((source) => source.slug === slugOrId || source.id === slugOrId);
}

export function searchTlpsUniqueFrames(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return tlpsUniqueExtractionFrames;
  return tlpsUniqueExtractionFrames.filter((frame) =>
    [frame.id, frame.slug, frame.label, frame.kind, frame.sourceId].some((value) => value.toLowerCase().includes(normalized))
  );
}

function countFramesByKind(frames: TlpsUniqueFrame[]) {
  return frames.reduce<Record<string, number>>((counts, frame) => {
    counts[frame.kind] = (counts[frame.kind] ?? 0) + 1;
    return counts;
  }, {});
}
