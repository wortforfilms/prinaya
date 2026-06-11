import { buildActiveStepsForRoute, type ActiveWorkflowStep } from "./active-step-runtime";
import { getCinematicImageForRoute } from "./cinematic-image-assets";
import { getHeroBannerForRoute } from "./hero-banner-registry";
import {
  getPreviewRouteFrame,
  previewFrameRuntimeSummary,
  previewRouteFrames,
  previewUiFrameRuntimes,
  type LocalRuntimeCoverage,
  type PreviewDemoDatum,
  type PreviewRouteFrameRuntime
} from "./preview-frame-runtime";
import { routeMatrix, type RouteDefinition } from "./route-matrix";
import { blockedCapabilities, releaseStatus } from "./status";
import { buildUseCaseDemoFlows, type UseCaseDemoFlow } from "./usecase-demo-flow";
import {
  flattenUseCaseAssets,
  flattenUseCaseScreens,
  getUseCasesForRoute,
  useCaseRuntime,
  type CategoryDemoUseCase,
  type DemoAssetRef,
  type DemoScreenRef
} from "./usecase-runtime";

export type ModuleAction = {
  id: string;
  label: string;
  description: string;
  status: "READY" | "BLOCKED";
  evidenceRef: string;
};

export type ActiveRoutePage = {
  route: RouteDefinition;
  routePath: string;
  title: string;
  status: "READY" | "PARTIAL" | "BLOCKED";
  productionReady: false;
  verdict: "CONTROLLED_PREVIEW_READY";
  previewFrame: PreviewRouteFrameRuntime;
  demoData: PreviewDemoDatum[];
  localRuntimeCoverage: LocalRuntimeCoverage[];
  cinematicScreen: {
    title: string;
    image: string;
    route: string;
    source: string;
  };
  activeSteps: ActiveWorkflowStep[];
  useCases: CategoryDemoUseCase[];
  demoFlows: UseCaseDemoFlow[];
  assetRefs: DemoAssetRef[];
  screenRefs: DemoScreenRef[];
  routeSpecificBlockers: PreviewRouteFrameRuntime["honestBlockers"];
  evidenceRefs: string[];
  moduleActions: ModuleAction[];
};

export const activeRoutePages: ActiveRoutePage[] = routeMatrix.map((route) => buildActiveRoutePage(route));

export const routePageRuntimeSummary = {
  status: "READY" as const,
  verdict: releaseStatus.verdict,
  productionReady: releaseStatus.productionReady,
  activeRouteCount: activeRoutePages.length,
  previewFramesUsed: previewUiFrameRuntimes.length,
  routeFramesUsed: previewRouteFrames.length,
  demoDataCount: activeRoutePages.reduce((sum, page) => sum + page.demoData.length, 0),
  runtimeCoverageCount: activeRoutePages.reduce((sum, page) => sum + page.localRuntimeCoverage.length, 0),
  activeStepCount: activeRoutePages.reduce((sum, page) => sum + page.activeSteps.length, 0),
  demoFlowCount: activeRoutePages.reduce((sum, page) => sum + page.demoFlows.length, 0),
  useCaseCount: useCaseRuntime.useCaseCount,
  routeUseCaseRefs: activeRoutePages.reduce((sum, page) => sum + page.useCases.length, 0),
  screenLinkCount: useCaseRuntime.screenRefCount,
  routeScreenRefCount: activeRoutePages.reduce((sum, page) => sum + page.screenRefs.length, 0),
  assetRefCount: useCaseRuntime.assetRefCount,
  blockerCount: blockedCapabilities.length,
  allRoutesHaveActivePages: activeRoutePages.every((page) => page.activeSteps.length >= 5 && page.useCases.length >= 3),
  allUseCasesHaveDemoFlow: activeRoutePages.every((page) => page.demoFlows.length === page.useCases.length),
  previewFrameRuntime: previewFrameRuntimeSummary,
  evidenceRef: "release/evidence/active-pages.json"
};

export function getActiveRoutePage(routePath: string) {
  const normalized = normalizeRoute(routePath);
  const page = activeRoutePages.find((item) => normalizeRoute(item.route.path) === normalized);
  if (!page) {
    throw new Error(`Missing active route page for ${routePath}`);
  }
  return page;
}

function buildActiveRoutePage(route: RouteDefinition): ActiveRoutePage {
  const routePath = normalizeRoute(route.path);
  const previewFrame = getPreviewRouteFrame(route.path);
  const useCases = getUseCasesForRoute(route.path, 4);
  const assetRefs = flattenUseCaseAssets(useCases);
  const screenRefs = flattenUseCaseScreens(useCases);
  const moduleActions = moduleActionsForRoute(route);
  const hero = getHeroBannerForRoute(route.path);
  const cinematicImage = getCinematicImageForRoute(route.path, "desktop-16x9", hero.hiresImage);
  const activeSteps = buildActiveStepsForRoute({ route, frame: previewFrame, useCases, moduleActions: moduleActions.map((action) => action.label) });
  return {
    route,
    routePath,
    title: route.title,
    status: route.status,
    productionReady: false,
    verdict: "CONTROLLED_PREVIEW_READY",
    previewFrame,
    demoData: previewFrame.demoData,
    localRuntimeCoverage: previewFrame.localRuntimeCoverage,
    cinematicScreen: {
      title: `${route.title} cinematic screen`,
      image: cinematicImage,
      route: routePath,
      source: hero.hiresImage
    },
    activeSteps,
    useCases,
    demoFlows: buildUseCaseDemoFlows(useCases, activeSteps),
    assetRefs,
    screenRefs,
    routeSpecificBlockers: previewFrame.honestBlockers,
    evidenceRefs: dedupeStrings([...previewFrame.evidenceRefs, "release/evidence/usecases.json", "release/evidence/active-pages.json"]),
    moduleActions
  };
}

function moduleActionsForRoute(route: RouteDefinition): ModuleAction[] {
  const labels = moduleLabelsForRoute(route.path);
  return labels.map((label) => ({
    id: `${normalizeRoute(route.path).replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-") || "home"}-${slugify(label)}`,
    label,
    description: actionDescription(label, route),
    status: blockedLabel(label) ? "BLOCKED" : "READY",
    evidenceRef: blockedLabel(label) ? "release/evidence/blockers.json" : "release/evidence/active-pages.json"
  }));
}

function moduleLabelsForRoute(routePath: string): string[] {
  const route = normalizeRoute(routePath);
  if (route === "/") return ["Project dashboard", "Route matrix", "Recent projects", "Evidence gate", "Use-case jump list", "Board preview"];
  if (route.includes("about")) return ["Studio positioning", "Honesty rules", "Delivery model", "Preview scope", "Evidence policy", "Blocked claims"];
  if (route.includes("pricing") || route.includes("budget")) return ["Overview", "Breakdown", "Vendors", "Schedule", "Cash flow", "Forecasting", "Blocked payments"];
  if (route.includes("features")) return ["Category registry", "Use-case explorer", "Screen links", "Asset links", "Route evidence", "Blocker audit"];
  if (route.includes("gallery")) return ["Board gallery", "Design options", "Technical panels", "Render preview", "Screen references", "Share board"];
  if (route.includes("templates")) return ["Featured templates", "Library", "Categories", "Filters", "Stats", "Tags"];
  if (route.includes("venues") || route.includes("venue-designer")) return ["Site plan", "Floor plan", "3D aerial", "Capacity", "Utilities", "Parking", "Compliance", "Board preview"];
  if (route.includes("vendors")) return ["Categories", "Approvals", "Contracts", "Deliveries", "Payments blocked", "Performance"];
  if (route.includes("contact")) return ["Inquiry input", "Scope capture", "Route recommendation", "Evidence packet", "Support handoff", "CRM sync blocked"];
  if (route.includes("support")) return ["Known blockers", "Evidence files", "Route help", "Release status", "Validation reports", "Escalation path"];
  if (route.includes("blog")) return ["Planning article", "Use-case story", "Screen reference", "Asset reference", "Evidence note", "CMS publishing blocked"];
  if (route.includes("auth")) return ["Login shell", "Role preview", "Permission copy", "Secure routing", "Provider integration blocked", "Evidence review"];
  if (route.includes("dashboard")) return ["Health overview", "Budget overview", "Timeline overview", "Vendor overview", "Guest overview", "AI insights"];
  if (route.includes("projects")) return ["Project list", "Scene summary", "Route progress", "Asset usage", "Evidence status", "Export history"];
  if (route.includes("mandap")) return ["Concept", "Top plan", "Elevation", "3D view", "Pillars", "Canopy", "Backdrops", "Rituals", "Costing"];
  if (route.includes("layouts")) return ["2D layout", "3D layout", "AI optimization", "Guest flow", "Zoning", "Space utilization"];
  if (route.includes("cad")) return ["Scene canvas", "Layer tree", "Object insertion", "Material inspector", "Measurements", "Preview DXF", "Native DWG blocked"];
  if (route.includes("assets") || route.includes("marketplace")) return ["Categories", "Folders", "Preview", "Metadata", "Usage", "Storage", "Actions"];
  if (route.includes("floral")) return ["Concept board", "Space mapping", "Installation preview", "Flower library", "Palettes", "Calculator"];
  if (route.includes("lighting")) return ["Lighting plan", "Lux map", "Fixture schedule", "DMX", "Power/load", "Scenes"];
  if (route.includes("guests")) return ["Guest distribution", "RSVP", "Seating", "VIP", "Meals", "Communication"];
  if (route.includes("production")) return ["Timeline", "WBS", "Resources", "Procurement", "Logistics", "Quality", "Risk"];
  if (route.includes("drone")) return ["Flight zones", "Shot planner", "Weather", "Battery", "Permissions", "Risk", "Live feed blocked"];
  if (route.includes("vr")) return ["Scenes", "360 gallery", "Hotspots", "Analytics", "Sharing", "Compatibility"];
  if (route.includes("ai")) return ["Chat", "Recommendations", "Design suggestions", "Budget advisor", "Risk analyzer", "Automations"];
  if (route.includes("exports")) return ["Drawing exports", "Boards", "BOQ", "Reports", "Multi-format", "History", "Production DXF blocked"];
  if (route.includes("observatory")) return ["Health", "Budget", "Timeline", "Vendor", "Guest", "Risk", "AI insights"];
  if (route.includes("admin")) return ["Roles", "Permissions", "Evidence gate", "Release controls", "Blocker registry", "Audit trail"];
  if (route.includes("settings")) return ["Profile", "Project defaults", "Theme", "Evidence settings", "Integrations blocked", "Export preferences"];
  return ["Input", "Configure", "Preview", "Validate", "Export/share", "Evidence"];
}

export const extendedModuleProfiles = [
  {
    id: "filmy-studio",
    label: "Filmy Studio",
    route: "/wedding-os",
    actions: ["Projects", "Concepts", "Shot list", "Timeline editing", "Color grading", "Audio mixing", "Deliverables", "Media library"]
  },
  {
    id: "hemant-samwat-vedi-finder",
    label: "Hemant Samwat Vedi Finder",
    route: "/wedding-os",
    actions: ["Venue input", "Orientation", "Vastu grid", "Vedi recommendation", "Agni placement", "Phera path", "Review/export"]
  }
];

function actionDescription(label: string, route: RouteDefinition) {
  if (blockedLabel(label)) return `${label} remains blocked until real provider, certified validation, or production export evidence exists.`;
  return `${label} is available as a local active preview workflow on ${route.title}.`;
}

function blockedLabel(label: string) {
  return /blocked|payment|dwg|production dxf|provider integration|crm sync|cms publishing|live feed/i.test(label);
}

function dedupeStrings(values: string[]) {
  return [...new Set(values)];
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normalizeRoute(routePath: string) {
  const trimmed = routePath.replace("/*", "").replace(/\/+$/, "");
  return trimmed || "/";
}
