import { boardPackage } from "./board-runtime";
import {
  budgetItems,
  cadObjects,
  droneZones,
  exportJobs,
  guestSections,
  layers,
  lightingFixtures,
  observatoryEvents,
  projectSummary,
  renderJobs,
  seatingCapacity,
  vendors,
  venueDimensions
} from "./data-frames";
import { uiFrames } from "./design-frames";
import { extractedBoardSummary } from "./extracted-boards";
import { productionRuntimeSummary } from "./production-runtime";
import { routeMatrix, type RouteDefinition } from "./route-matrix";
import { sceneBranches } from "./scene-graph";
import { blockedCapabilities, releaseStatus, type CapabilityStatus } from "./status";
import { templateRuntimeSummary } from "./template-runtime";
import { weddingAssetSummary } from "./wedding-asset-library";

export type PreviewDemoDatum = {
  label: string;
  value: string | number;
  source: string;
  status: "READY";
};

export type LocalRuntimeCoverage = {
  label: string;
  status: "READY";
  evidence: string;
};

export type PreviewRouteFrameRuntime = {
  routePath: string;
  title: string;
  frameId: string;
  frameTitle: string;
  status: "READY";
  demoData: PreviewDemoDatum[];
  localRuntimeCoverage: LocalRuntimeCoverage[];
  evidenceRefs: string[];
  honestBlockers: Array<{
    id: string;
    label: string;
    status: "BLOCKED";
  }>;
};

export type PreviewUiFrameRuntime = {
  frameId: string;
  title: string;
  status: CapabilityStatus;
  demoBindings: string[];
  localRuntimeCoverage: LocalRuntimeCoverage[];
};

const totalBudget = budgetItems.reduce((sum, item) => sum + item.estimatedInr, 0);
const readyExports = exportJobs.filter((job) => job.status === "READY").length;
const blockedExportJobs = exportJobs.filter((job) => job.status === "BLOCKED").length;
const routeFileBase = "src/app";

export const previewRouteFrames: PreviewRouteFrameRuntime[] = routeMatrix.map((route) => buildPreviewRouteFrame(route));

export const previewUiFrameRuntimes: PreviewUiFrameRuntime[] = uiFrames.map((frame) => ({
  frameId: frame.id,
  title: frame.title,
  status: frame.status,
  demoBindings: frame.dataBindings,
  localRuntimeCoverage: [
    coverage("Frame definition", "src/lib/design-frames.ts"),
    coverage("Demo data binding", "src/lib/data-frames.ts"),
    coverage("Board renderer", "src/components/frames/BoardFrames.tsx")
  ]
}));

export const previewFrameRuntimeSummary = {
  status: "READY" as const,
  routeFrames: previewRouteFrames.length,
  routeFramesReady: previewRouteFrames.filter((frame) => frame.status === "READY").length,
  routeFramesWithDemoData: previewRouteFrames.filter((frame) => frame.demoData.length > 0).length,
  routeFramesWithLocalCoverage: previewRouteFrames.filter((frame) => frame.localRuntimeCoverage.length > 0).length,
  uiFrames: previewUiFrameRuntimes.length,
  uiFramesReady: previewUiFrameRuntimes.filter((frame) => frame.status === "READY").length,
  totalDemoDataPoints: previewRouteFrames.reduce((sum, frame) => sum + frame.demoData.length, 0),
  totalLocalCoveragePoints: previewRouteFrames.reduce((sum, frame) => sum + frame.localRuntimeCoverage.length, 0)
};

export function getPreviewRouteFrame(routePath: string): PreviewRouteFrameRuntime {
  const normalized = routePath.includes("/*") ? routePath : routePath.replace(/\/$/, "") || "/";
  const frame = previewRouteFrames.find((item) => item.routePath === normalized);
  if (!frame) {
    throw new Error(`Missing preview frame runtime for ${routePath}`);
  }
  return frame;
}

function buildPreviewRouteFrame(route: RouteDefinition): PreviewRouteFrameRuntime {
  const frameTitle = route.primaryFrame;
  return {
    routePath: route.path,
    title: route.title,
    frameId: frameTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    frameTitle,
    status: "READY",
    demoData: demoDataForRoute(route),
    localRuntimeCoverage: runtimeCoverageForRoute(route),
    evidenceRefs: evidenceRefsForRoute(route),
    honestBlockers: blockersForRoute(route)
  };
}

function demoDataForRoute(route: RouteDefinition): PreviewDemoDatum[] {
  const path = route.path;
  const base = [
    demo("Project", projectSummary.name, "projectSummary.name"),
    demo("Primary frame", route.primaryFrame, "routeMatrix.primaryFrame"),
    demo("Release verdict", releaseStatus.verdict, "releaseStatus.verdict")
  ];

  if (path === "/" || path.includes("dashboard") || path.includes("projects")) {
    return [
      ...base,
      demo("Route frames", projectSummary.routeCoverage, "projectSummary.routeCoverage"),
      demo("CAD objects", cadObjects.length, "cadObjects"),
      demo("Recent events", observatoryEvents.length, "observatoryEvents"),
      demo("Board pages", boardPackage.pages.length, "boardPackage.pages")
    ];
  }

  if (path.includes("venue") || path.includes("layouts") || path.includes("guests") || path.includes("drone")) {
    return [
      ...base,
      demo("Venue footprint", `${venueDimensions.lengthM}m x ${venueDimensions.widthM}m`, "venueDimensions"),
      demo("Guest capacity", seatingCapacity.totalGuests, "seatingCapacity.totalGuests"),
      demo("Guest sections", guestSections.length, "guestSections"),
      demo("Drone zones", droneZones.length, "droneZones")
    ];
  }

  if (path.includes("mandap") || path.includes("floral") || path.includes("lighting")) {
    return [
      ...base,
      demo("Lighting fixtures", lightingFixtures.length, "lightingFixtures"),
      demo("Scene branches", sceneBranches.length, "sceneBranches"),
      demo("Reusable assets", weddingAssetSummary.total, "weddingAssetSummary.total"),
      demo("Render jobs", renderJobs.length, "renderJobs")
    ];
  }

  if (path.includes("assets") || path.includes("templates") || path.includes("marketplace")) {
    return [
      ...base,
      demo("Reusable assets", weddingAssetSummary.total, "weddingAssetSummary.total"),
      demo("Template runtimes", templateRuntimeSummary.templates, "templateRuntimeSummary.templates"),
      demo("Template asset links", templateRuntimeSummary.totalAssetLinks, "templateRuntimeSummary.totalAssetLinks"),
      demo("Board package pages", boardPackage.pages.length, "boardPackage.pages")
    ];
  }

  if (path.includes("vendors") || path.includes("production")) {
    return [
      ...base,
      demo("Demo vendors", vendors.length, "vendors"),
      demo("Vendor assignments", productionRuntimeSummary.vendorAssignments, "productionRuntime.vendorAssignments"),
      demo("Work orders", productionRuntimeSummary.workOrders, "productionRuntime.workOrders"),
      demo("Call sheets", productionRuntimeSummary.callSheets, "productionRuntime.callSheets")
    ];
  }

  if (path.includes("budget") || path.includes("pricing")) {
    return [
      ...base,
      demo("Estimated budget INR", totalBudget.toLocaleString("en-IN"), "budgetItems"),
      demo("Budget lines", budgetItems.length, "budgetItems"),
      demo("Blocked payment capability", "payments", "blockedCapabilities")
    ];
  }

  if (path.includes("cad") || path.includes("exports")) {
    return [
      ...base,
      demo("CAD objects", cadObjects.length, "cadObjects"),
      demo("Layers", layers.length, "layers"),
      demo("Ready local exports", readyExports, "exportJobs"),
      demo("Blocked export jobs", blockedExportJobs, "exportJobs")
    ];
  }

  if (path.includes("gallery") || path.includes("vr")) {
    return [
      ...base,
      demo("Extracted boards", extractedBoardSummary.boardCount, "extractedBoardSummary.boardCount"),
      demo("Extracted frames", extractedBoardSummary.optionCount, "extractedBoardSummary.optionCount"),
      demo("Technical panels", extractedBoardSummary.panelCount, "extractedBoardSummary.panelCount"),
      demo("Render jobs", renderJobs.length, "renderJobs")
    ];
  }

  if (path.includes("support") || path.includes("admin") || path.includes("observatory") || path.includes("about")) {
    return [
      ...base,
      demo("Evidence events", observatoryEvents.length, "observatoryEvents"),
      demo("Blocked capabilities", blockedCapabilities.length, "blockedCapabilities"),
      demo("Production ready", String(releaseStatus.productionReady), "releaseStatus.productionReady")
    ];
  }

  return [
    ...base,
    demo("UI frames", uiFrames.length, "uiFrames"),
    demo("Blocked capabilities", blockedCapabilities.length, "blockedCapabilities"),
    demo("Active page mode", "route use cases", "routePageRuntime"),
    demo("Production ready", String(releaseStatus.productionReady), "releaseStatus.productionReady")
  ];
}

function runtimeCoverageForRoute(route: RouteDefinition): LocalRuntimeCoverage[] {
  const fileEvidence = routeFilesForRoute(route).join(" + ");
  const base = [
    coverage("Route component renders", fileEvidence),
    coverage("Status badge and honest copy", "src/components/routes/RoutePage.tsx"),
    coverage("Demo data bindings", "src/lib/data-frames.ts"),
    coverage("Release evidence participation", "release/evidence/routes.json")
  ];

  if (route.path.includes("cad")) {
    return [
      ...base,
      coverage("Three.js editor route", "src/app/cad/editor/page.tsx"),
      coverage("Scene graph and selection runtime", "src/lib/scene-graph.ts"),
      coverage("Local JSON and preview DXF exports", "src/lib/export-runtime.ts")
    ];
  }

  if (route.path.includes("templates")) {
    return [
      ...base,
      coverage("Template to scene runtime", "src/lib/template-runtime.ts"),
      coverage("Board package composer", "src/lib/board-runtime.ts")
    ];
  }

  if (route.path.includes("production")) {
    return [
      ...base,
      coverage("Production planning records", "src/lib/production-runtime.ts"),
      coverage("Scene-linked work orders", "scripts/verify-cad.ts")
    ];
  }

  if (route.path.includes("vr") || route.path.includes("gallery")) {
    return [
      ...base,
      coverage("Extracted board gallery", "src/components/boards/ExtractedBoardsGallery.tsx"),
      coverage("Generated PNG extraction data", "src/lib/extracted-boards.ts")
    ];
  }

  return base;
}

function evidenceRefsForRoute(route: RouteDefinition): string[] {
  const refs = ["release/evidence/routes.json", "release/evidence/latest.json"];
  if (route.path.includes("cad") || route.path.includes("exports")) refs.push("release/evidence/cad-runtime.json");
  if (route.path.includes("admin") || route.path.includes("observatory") || route.path.includes("support")) refs.push("release/evidence/status-matrix.md");
  if (route.path.includes("pricing") || route.path.includes("vendors") || route.path.includes("marketplace")) refs.push("release/evidence/blockers.json");
  return refs;
}

function blockersForRoute(route: RouteDefinition) {
  const path = route.path;
  const ids = new Set<string>();
  if (path.includes("cad") || path.includes("exports")) {
    ids.add("native-dwg-export");
    ids.add("production-dxf-export");
    ids.add("engineering-compliance");
  }
  if (path.includes("pricing") || path.includes("budget") || path.includes("vendors") || path.includes("marketplace")) {
    ids.add("payments");
  }
  if (path.includes("vendors") || path.includes("marketplace") || path.includes("production")) {
    ids.add("live-vendors");
    ids.add("marketplace-commerce");
  }
  if (path.includes("venue") || path.includes("mandap") || path.includes("layouts") || path.includes("lighting") || path.includes("drone") || path.includes("production")) {
    ids.add("structural-validation");
    ids.add("electrical-validation");
    ids.add("fire-safety-validation");
    ids.add("engineering-compliance");
  }
  return blockedCapabilities
    .filter((capability) => ids.has(capability.id))
    .map((capability) => ({
      id: capability.id,
      label: capability.label,
      status: "BLOCKED" as const
    }));
}

function routeFilesForRoute(route: RouteDefinition): string[] {
  if (route.path === "/") return [`${routeFileBase}/page.tsx`];
  if (!route.path.includes("*")) return [`${routeFileBase}${route.path}/page.tsx`];
  const segment = route.path.replace("/*", "");
  const nested = segment === "/cad" ? [`${routeFileBase}/cad/editor/page.tsx`] : [`${routeFileBase}${segment}/[...slug]/page.tsx`];
  return [`${routeFileBase}${segment}/page.tsx`, ...nested];
}

function demo(label: string, value: string | number, source: string): PreviewDemoDatum {
  return { label, value, source, status: "READY" };
}

function coverage(label: string, evidence: string): LocalRuntimeCoverage {
  return { label, evidence, status: "READY" };
}
