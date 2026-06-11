import { existsSync, readFileSync } from "node:fs";
import {
  activeRoutePages,
  extendedModuleProfiles,
  routePageRuntimeSummary
} from "../src/lib/route-page-runtime";
import { previewUiFrameRuntimes } from "../src/lib/preview-frame-runtime";
import { routeMatrix } from "../src/lib/route-matrix";
import { blockedCapabilities } from "../src/lib/status";

type ScreenRegistry = {
  status: string;
  verdict: string;
  productionReady: boolean;
  screenLinkCount: number;
  links: Array<{ id: string; route: string; image: string; source: string; status: string }>;
};

type ActivePagesEvidence = {
  status: string;
  verdict: string;
  productionReady: boolean;
  activeRouteCount: number;
  previewFramesUsed: number;
  routeFramesUsed: number;
  demoDataCount: number;
  runtimeCoverageCount: number;
  activeStepCount: number;
  demoFlowCount: number;
  useCaseCount: number;
  screenLinkCount: number;
  blockerCount: number;
  checks: Record<string, boolean>;
  pages: Array<{
    routePath: string;
    demoDataPoints: number;
    runtimeCoverageChecks: number;
    activeSteps: unknown[];
    demoFlows: Array<{
      chain: string[];
      activeStepCount: number;
      assetRefCount: number;
      screenRefCount: number;
      boardComposer: { route: string; status: string; pageCount: number };
      exportPackage: { route: string; status: string; productionReady: boolean; file: string; formats: string[] };
      evidenceRefs: string[];
    }>;
    useCases: unknown[];
    screenRefCount: number;
    moduleActions: unknown[];
    evidenceRefs: string[];
  }>;
};

const failures: string[] = [];
const screenRegistry = readJson<ScreenRegistry>("../data/screens/preview-ready-screens.json");
const evidence = readJson<ActivePagesEvidence>("../release/evidence/active-pages.json");
const validRoutes = routeMatrix.map((route) => normalizeRoute(route.path));

expect(routePageRuntimeSummary.status === "READY", "Active page runtime must be READY");
expect(routePageRuntimeSummary.verdict === "CONTROLLED_PREVIEW_READY", "Active page runtime verdict must be CONTROLLED_PREVIEW_READY");
expect(routePageRuntimeSummary.productionReady === false, "Active page runtime productionReady must remain false");
expect(activeRoutePages.length === 32, `Expected 32 active route pages, found ${activeRoutePages.length}`);
expect(routePageRuntimeSummary.activeRouteCount === 32, "Active page summary must report 32 active routes");
expect(routePageRuntimeSummary.previewFramesUsed === 25, `Expected 25 preview frames, found ${routePageRuntimeSummary.previewFramesUsed}`);
expect(previewUiFrameRuntimes.length === 25, `Preview frame runtime must expose 25 UI frames, found ${previewUiFrameRuntimes.length}`);
expect(routePageRuntimeSummary.demoDataCount >= 208, `Expected 208+ demo data points, found ${routePageRuntimeSummary.demoDataCount}`);
expect(routePageRuntimeSummary.runtimeCoverageCount >= 139, `Expected 139+ runtime checks, found ${routePageRuntimeSummary.runtimeCoverageCount}`);
expect(routePageRuntimeSummary.useCaseCount === 108, `Expected 108 use cases, found ${routePageRuntimeSummary.useCaseCount}`);
expect(routePageRuntimeSummary.demoFlowCount === routePageRuntimeSummary.routeUseCaseRefs, "Each route use case must have a SPRINT-07 demo flow");
expect(routePageRuntimeSummary.allUseCasesHaveDemoFlow, "All active page use cases must expose demo flows");
expect(routePageRuntimeSummary.screenLinkCount === 432, `Expected 432 screen links, found ${routePageRuntimeSummary.screenLinkCount}`);
expect(routePageRuntimeSummary.blockerCount === blockedCapabilities.length, "Active page blocker count must match blocked capability registry");
expect(extendedModuleProfiles.length >= 2, "Filmy Studio and Hemant Samwat Vedi Finder profiles must be present");

for (const page of activeRoutePages) {
  expect(validRoutes.includes(normalizeRoute(page.route.path)), `${page.route.path} is not in route matrix`);
  expect(page.title.length > 0, `${page.route.path} missing route title`);
  expect(page.status === "READY", `${page.route.path} status must be READY`);
  expect(page.verdict === "CONTROLLED_PREVIEW_READY", `${page.route.path} verdict must be CONTROLLED_PREVIEW_READY`);
  expect(page.productionReady === false, `${page.route.path} productionReady must remain false`);
  expect(page.previewFrame.status === "READY", `${page.route.path} preview frame must be READY`);
  expect(page.demoData.length > 0, `${page.route.path} missing demo data cards`);
  expect(page.localRuntimeCoverage.length > 0, `${page.route.path} missing runtime coverage cards`);
  expect(resolvesPublicFile(page.cinematicScreen.image), `${page.route.path} cinematic screen does not resolve`);
  expect(page.activeSteps.length >= 5 && page.activeSteps.length <= 8, `${page.route.path} must have 5-8 active steps`);
  expect(page.useCases.length >= 3 && page.useCases.length <= 4, `${page.route.path} must have 3-4 use cases`);
  expect(page.demoFlows.length === page.useCases.length, `${page.route.path} must have one SPRINT-07 demo flow per use case`);
  expect(page.demoFlows.every((flow) => flow.chain.join(" > ") === "Use Case > Active Steps > Assets > Screens > Board Composer > Export Package > Evidence Ref"), `${page.route.path} demo flow chain is incomplete`);
  expect(page.demoFlows.every((flow) => flow.activeSteps.length > 0), `${page.route.path} demo flows must include active steps`);
  expect(page.demoFlows.every((flow) => flow.assetRefs.length > 0), `${page.route.path} demo flows must include asset refs`);
  expect(page.demoFlows.every((flow) => flow.screenRefs.length > 0), `${page.route.path} demo flows must include screen refs`);
  expect(page.demoFlows.every((flow) => flow.boardComposer.route === "/exports/boards" && flow.boardComposer.status === "READY"), `${page.route.path} demo flows must include the board composer route`);
  expect(page.demoFlows.every((flow) => flow.exportPackage.route === "/exports/package" && flow.exportPackage.status === "READY" && flow.exportPackage.productionReady === false), `${page.route.path} demo flows must include the local preview export package`);
  expect(page.demoFlows.every((flow) => flow.evidenceRefs.includes("release/evidence/usecases.json") && flow.evidenceRefs.includes("release/evidence/active-pages.json")), `${page.route.path} demo flows must include evidence refs`);
  expect(page.assetRefs.length > 0, `${page.route.path} missing asset refs`);
  expect(page.screenRefs.length > 0, `${page.route.path} missing screen refs`);
  expect(page.screenRefs.every((screen) => isValidRouteRef(screen.route)), `${page.route.path} has invalid screen route refs`);
  expect(page.screenRefs.every((screen) => resolvesPublicFile(screen.image)), `${page.route.path} has unresolved screen images`);
  expect(page.useCases.every((useCase) => useCase.blockedNotes.length > 0), `${page.route.path} has use cases without blocker notes`);
  expect(page.evidenceRefs.includes("release/evidence/active-pages.json"), `${page.route.path} missing active page evidence ref`);
  expect(page.moduleActions.length >= 5, `${page.route.path} must have module-specific actions`);
}

expect(screenRegistry.status === "READY", "Screen registry must be READY");
expect(screenRegistry.verdict === "CONTROLLED_PREVIEW_READY", "Screen registry verdict must be CONTROLLED_PREVIEW_READY");
expect(screenRegistry.productionReady === false, "Screen registry productionReady must remain false");
expect(screenRegistry.screenLinkCount === 432, `Expected 432 screen registry links, found ${screenRegistry.screenLinkCount}`);
for (const link of screenRegistry.links) {
  expect(link.status === "READY", `${link.id} screen link must be READY`);
  expect(isValidRouteRef(link.route), `${link.id} route does not resolve: ${link.route}`);
  expect(resolvesPublicFile(link.image), `${link.id} image does not resolve: ${link.image}`);
  expect(!link.source.startsWith("/") || resolvesPublicFile(link.source), `${link.id} source does not resolve: ${link.source}`);
}

expect(evidence.status === "READY", "Active pages evidence must be READY");
expect(evidence.verdict === "CONTROLLED_PREVIEW_READY", "Active pages evidence verdict must be CONTROLLED_PREVIEW_READY");
expect(evidence.productionReady === false, "Active pages evidence productionReady must remain false");
expect(evidence.activeRouteCount === routePageRuntimeSummary.activeRouteCount, "Active pages evidence route count mismatch");
expect(evidence.previewFramesUsed === routePageRuntimeSummary.previewFramesUsed, "Active pages evidence preview frame count mismatch");
expect(evidence.routeFramesUsed === routeMatrix.length, "Active pages evidence route frame count mismatch");
expect(evidence.demoDataCount === routePageRuntimeSummary.demoDataCount, "Active pages evidence demo data mismatch");
expect(evidence.runtimeCoverageCount === routePageRuntimeSummary.runtimeCoverageCount, "Active pages evidence runtime coverage mismatch");
expect(evidence.activeStepCount === routePageRuntimeSummary.activeStepCount, "Active pages evidence active step mismatch");
expect(evidence.demoFlowCount === routePageRuntimeSummary.demoFlowCount, "Active pages evidence demo flow mismatch");
expect(evidence.useCaseCount === routePageRuntimeSummary.useCaseCount, "Active pages evidence use case mismatch");
expect(evidence.screenLinkCount === routePageRuntimeSummary.screenLinkCount, "Active pages evidence screen link mismatch");
expect(evidence.blockerCount === blockedCapabilities.length, "Active pages evidence blocker count mismatch");
expect(evidence.pages.length === activeRoutePages.length, "Active pages evidence must include each route page");
expect(Object.values(evidence.checks).every(Boolean), "Active pages evidence checks must all be true");
for (const page of evidence.pages) {
  expect(page.demoFlows.length === page.useCases.length, `${page.routePath} evidence must include one demo flow per use case`);
  expect(page.demoFlows.every((flow) => flow.chain.length === 7), `${page.routePath} evidence demo flows must include seven stages`);
  expect(page.demoFlows.every((flow) => flow.boardComposer.route === "/exports/boards" && flow.exportPackage.file.length > 0), `${page.routePath} evidence demo flows must include board/export refs`);
}

if (failures.length > 0) {
  throw new Error(`verify:active-pages failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

console.log(
  `verify:active-pages passed (${activeRoutePages.length} active routes, ${routePageRuntimeSummary.previewFramesUsed} preview frames, ${routePageRuntimeSummary.demoDataCount} demo points, ${routePageRuntimeSummary.runtimeCoverageCount} runtime checks, ${routePageRuntimeSummary.screenLinkCount} screen links)`
);

function readJson<T>(relativePath: string): T {
  const path = new URL(relativePath, import.meta.url);
  if (!existsSync(path)) throw new Error(`Missing JSON file: ${path.pathname}`);
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function expect(condition: boolean, message: string) {
  if (!condition) failures.push(message);
}

function resolvesPublicFile(path: string) {
  return path.startsWith("/") && existsSync(new URL(`../public${path}`, import.meta.url));
}

function isValidRouteRef(route: string) {
  const normalized = normalizeRoute(route);
  return validRoutes.some((candidate) => normalized === candidate || (candidate !== "/" && normalized.startsWith(`${candidate}/`)));
}

function normalizeRoute(routePath: string) {
  const trimmed = routePath.replace("/*", "").replace(/\/+$/, "");
  if (trimmed === "/venues") return "/venue-designer";
  if (trimmed === "/gallery") return "/vr";
  return trimmed || "/";
}
