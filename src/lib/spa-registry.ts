import spaRegistryJson from "../../data/spas/spa-registry.json";

export type SpaStatus = "READY" | "PARTIAL" | "PLANNED" | "BLOCKED";
export type SpaSurface = { id: string; name: string; href: string; status: SpaStatus; reason?: string };
export type SpaGroup = { group: string; count: number; surfaces: SpaSurface[] };
export type SpaRegistry = {
  generatedAt: string;
  verdict: "CONTROLLED_PREVIEW_READY";
  productionReady: false;
  note: string;
  summary: { total: number; byStatus: Record<string, number>; groupCount: number };
  groups: SpaGroup[];
};

export const spaRegistry = spaRegistryJson as SpaRegistry;
export const spaGroups = spaRegistry.groups;
export const spaSurfaces = spaGroups.flatMap((group) => group.surfaces);
export const spaRegistrySummary = spaRegistry.summary;
