import categoryDemoUseCaseRegistryJson from "../../data/usecases/category-demo-usecases.json";
import type { AssetCategory, AssetStatus } from "./schemas";
import type { CapabilityStatus } from "./status";

export type DemoAssetRef = {
  id: string;
  name: string;
  category: AssetCategory;
  status: AssetStatus;
  previewType: string;
  previewImage: string | null;
};

export type DemoScreenRef = {
  id: string;
  title: string;
  route: string;
  image: string;
  source: string;
  status: "READY";
};

export type CategoryDemoUseCase = {
  id: string;
  category: AssetCategory;
  title: string;
  summary: string;
  route: string;
  routeTitle: string;
  owner: string;
  stage: string;
  status: CapabilityStatus;
  assetRefs: DemoAssetRef[];
  screens: DemoScreenRef[];
  steps: string[];
  blockedNotes: string[];
};

export type CategoryDemoUseCaseSet = {
  category: AssetCategory;
  slug: string;
  status: CapabilityStatus;
  routes: string[];
  useCases: CategoryDemoUseCase[];
  assetCount: number;
  readyAssets: number;
  partialAssets: number;
  blockedAssets: number;
  screenCount: number;
};

export type CategoryDemoUseCaseSummary = {
  status: "READY";
  verdict: "CONTROLLED_PREVIEW_READY";
  productionReady: false;
  categoryCount: number;
  useCaseCount: number;
  minUseCasesPerCategory: number;
  maxUseCasesPerCategory: number;
  assetRefCount: number;
  screenRefCount: number;
  routeCount: number;
  evidenceRefs: string[];
};

export type CategoryDemoUseCaseRegistry = {
  generatedAt: string;
  status: "READY";
  verdict: "CONTROLLED_PREVIEW_READY";
  productionReady: false;
  summary: CategoryDemoUseCaseSummary;
  categories: CategoryDemoUseCaseSet[];
};

export const categoryDemoUseCaseRegistry = categoryDemoUseCaseRegistryJson as CategoryDemoUseCaseRegistry;
export const categoryDemoUseCaseSets = categoryDemoUseCaseRegistry.categories;
export const categoryDemoUseCaseSummary = categoryDemoUseCaseRegistry.summary;
export const allCategoryDemoUseCases = categoryDemoUseCaseSets.flatMap((set) => set.useCases);

export function getCategoryDemoUseCases(category: AssetCategory) {
  return categoryDemoUseCaseSets.find((set) => set.category === category);
}

export function getRouteDemoUseCases(routePath: string, limit = 4) {
  const normalizedRoute = normalizeRoute(routePath);
  const ranked = allCategoryDemoUseCases
    .map((useCase, index) => ({
      useCase,
      index,
      score: routeUseCaseScore(useCase, normalizedRoute)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || statusRank(a.useCase.status) - statusRank(b.useCase.status) || a.index - b.index)
    .map((item) => item.useCase);

  const direct = dedupeUseCases(ranked);
  if (direct.length >= limit) return direct.slice(0, limit);

  const fallback = fallbackUseCasesForRoute(normalizedRoute);
  return dedupeUseCases([...direct, ...fallback, ...allCategoryDemoUseCases]).slice(0, limit);
}

export function getRouteDemoUseCaseSummary(routePath: string) {
  const useCases = getRouteDemoUseCases(routePath);
  return {
    routePath: normalizeRoute(routePath),
    useCaseCount: useCases.length,
    assetRefCount: useCases.reduce((sum, useCase) => sum + useCase.assetRefs.length, 0),
    screenRefCount: useCases.reduce((sum, useCase) => sum + useCase.screens.length, 0),
    activeStepCount: useCases.reduce((sum, useCase) => sum + useCase.steps.length, 0),
    blockerNoteCount: useCases.reduce((sum, useCase) => sum + useCase.blockedNotes.length, 0)
  };
}

function routeUseCaseScore(useCase: CategoryDemoUseCase, routePath: string) {
  const useCaseRoute = normalizeRoute(useCase.route);
  const categorySet = getCategoryDemoUseCases(useCase.category);
  if (routesMatch(routePath, useCaseRoute)) return 100;
  if (categorySet?.routes.some((route) => routesMatch(routePath, normalizeRoute(route)))) return 80;
  if (useCase.screens.some((screen) => routesMatch(routePath, normalizeRoute(screen.route)))) return 60;
  if (fallbackCategoriesForRoute(routePath).includes(useCase.category)) return 40;
  return 0;
}

function fallbackUseCasesForRoute(routePath: string) {
  return fallbackCategoriesForRoute(routePath).flatMap((category) => getCategoryDemoUseCases(category)?.useCases ?? []);
}

function fallbackCategoriesForRoute(routePath: string): AssetCategory[] {
  const route = normalizeRoute(routePath);
  if (route === "/") return ["Production Planning", "Boards", "Templates", "AI Outputs"];
  if (route.includes("about")) return ["Boards", "Templates", "Production Planning", "AI Outputs"];
  if (route.includes("pricing") || route.includes("budget")) return ["Boards", "Tables", "Vendor Documents", "Production Planning"];
  if (route.includes("features")) return ["Mandaps", "Venue Zones", "Lighting Fixtures", "Boards"];
  if (route.includes("gallery") || route.includes("vr")) return ["Boards", "Templates", "Mandaps", "Lighting Fixtures"];
  if (route.includes("templates")) return ["Templates", "Mandaps", "Venue Zones", "Boards"];
  if (route.includes("venues") || route.includes("venue")) return ["Venue Zones", "Utilities", "Guest Planning", "Drone Planning"];
  if (route.includes("vendors") || route.includes("contact")) return ["Vendor Documents", "Production Planning", "Guest Planning", "Boards"];
  if (route.includes("support") || route.includes("admin") || route.includes("observatory")) return ["Production Planning", "Vendor Documents", "Boards", "AI Outputs"];
  if (route.includes("settings")) return ["Templates", "Production Planning", "Vendor Documents", "AI Outputs"];
  if (route.includes("blog")) return ["Templates", "Boards", "AI Outputs", "Production Planning"];
  if (route.includes("dashboard") || route.includes("projects")) return ["Production Planning", "Boards", "Venue Zones", "Mandaps"];
  if (route.includes("auth")) return ["Vendor Documents", "Production Planning", "Boards", "AI Outputs"];
  if (route.includes("layouts") || route.includes("guests")) return ["Guest Planning", "Seating", "Furniture", "Tables"];
  if (route.includes("mandap")) return ["Mandaps", "Pillars", "Gates & Arches", "Decor Props"];
  if (route.includes("floral")) return ["Floral Installations", "Flower Types", "Backdrops", "Decorative Lighting"];
  if (route.includes("lighting")) return ["Lighting Fixtures", "Decorative Lighting", "Truss & Rigging", "LED & Screens"];
  if (route.includes("cad")) return ["Structural Elements", "Mandaps", "Venue Zones", "Lighting Fixtures"];
  if (route.includes("assets") || route.includes("marketplace")) return ["Mandaps", "Floral Installations", "Lighting Fixtures", "Boards"];
  if (route.includes("production")) return ["Production Planning", "Vendor Documents", "Utilities", "Audio"];
  if (route.includes("drone")) return ["Drone Planning", "Venue Zones", "Effects", "Production Planning"];
  if (route.includes("exports")) return ["Boards", "Templates", "Production Planning", "Vendor Documents"];
  if (route.includes("ai")) return ["AI Outputs", "Templates", "Boards", "Floral Installations"];
  return ["Production Planning", "Boards", "Templates", "Vendor Documents"];
}

function dedupeUseCases(useCases: CategoryDemoUseCase[]) {
  const seen = new Set<string>();
  return useCases.filter((useCase) => {
    if (seen.has(useCase.id)) return false;
    seen.add(useCase.id);
    return true;
  });
}

function routesMatch(routePath: string, candidatePath: string) {
  const route = aliasRoute(routePath);
  const candidate = aliasRoute(candidatePath);
  return route === candidate || route.startsWith(`${candidate}/`) || candidate.startsWith(`${route}/`);
}

function aliasRoute(routePath: string) {
  const route = normalizeRoute(routePath);
  if (route === "/venues") return "/venue-designer";
  if (route === "/gallery") return "/vr";
  return route;
}

function normalizeRoute(routePath: string) {
  const trimmed = routePath.replace("/*", "").replace(/\/+$/, "");
  return trimmed || "/";
}

function statusRank(status: CapabilityStatus) {
  if (status === "READY") return 0;
  if (status === "PARTIAL") return 1;
  return 2;
}
