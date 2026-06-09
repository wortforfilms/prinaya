import { existsSync, readFileSync } from "node:fs";
import { floralWorkspaceSummary } from "../src/lib/floral-workspace";
import { heroBannerSummary } from "../src/lib/hero-banner-registry";
import { previewFrameRuntimeSummary, previewRouteFrames, previewUiFrameRuntimes } from "../src/lib/preview-frame-runtime";
import { routeFamilies, routeMatrix, publicRouteSlugs } from "../src/lib/route-matrix";

const missing: string[] = [];

for (const slug of publicRouteSlugs) {
  const path = new URL(`../src/app/${slug}/page.tsx`, import.meta.url);
  if (!existsSync(path)) missing.push(`/${slug}`);
}

for (const family of routeFamilies) {
  const base = new URL(`../src/app/${family}/page.tsx`, import.meta.url);
  const nested = new URL(`../src/app/${family}/[...slug]/page.tsx`, import.meta.url);
  if (!existsSync(base)) missing.push(`/${family}`);
  if (!existsSync(nested) && family !== "cad") missing.push(`/${family}/*`);
}

const cadEditor = new URL("../src/app/cad/editor/page.tsx", import.meta.url);
if (!existsSync(cadEditor)) missing.push("/cad/editor");

const missingStatus = routeMatrix.filter((route) => !route.status || !route.primaryFrame);
const incompleteRouteFrames = routeMatrix.filter((route) => route.status !== "READY");
const missingPreviewRuntime = routeMatrix.filter((route) => !previewRouteFrames.some((frame) => frame.routePath === route.path));
const previewFramesWithoutDemoData = previewRouteFrames.filter((frame) => frame.demoData.length === 0);
const previewFramesWithoutCoverage = previewRouteFrames.filter((frame) => frame.localRuntimeCoverage.length === 0);
const previewFramesWithoutEvidence = previewRouteFrames.filter((frame) => frame.evidenceRefs.length === 0);

if (routeMatrix.length !== 32) {
  throw new Error(`Expected 32 matrix route definitions, found ${routeMatrix.length}`);
}

if (missing.length > 0) {
  throw new Error(`Missing route files: ${missing.join(", ")}`);
}

if (missingStatus.length > 0) {
  throw new Error(`Routes missing status/frame: ${missingStatus.map((route) => route.path).join(", ")}`);
}

if (incompleteRouteFrames.length > 0) {
  throw new Error(`Route frames not READY: ${incompleteRouteFrames.map((route) => route.path).join(", ")}`);
}

if (missingPreviewRuntime.length > 0) {
  throw new Error(`Routes missing preview runtime frames: ${missingPreviewRuntime.map((route) => route.path).join(", ")}`);
}

if (previewRouteFrames.length !== routeMatrix.length) {
  throw new Error(`Expected ${routeMatrix.length} preview route runtime frames, found ${previewRouteFrames.length}`);
}

if (previewFrameRuntimeSummary.routeFramesReady !== routeMatrix.length) {
  throw new Error("All preview route runtime frames must be READY");
}

if (previewFramesWithoutDemoData.length > 0) {
  throw new Error(`Preview route frames missing demo data: ${previewFramesWithoutDemoData.map((frame) => frame.routePath).join(", ")}`);
}

if (previewFramesWithoutCoverage.length > 0) {
  throw new Error(`Preview route frames missing local runtime coverage: ${previewFramesWithoutCoverage.map((frame) => frame.routePath).join(", ")}`);
}

if (previewFramesWithoutEvidence.length > 0) {
  throw new Error(`Preview route frames missing evidence refs: ${previewFramesWithoutEvidence.map((frame) => frame.routePath).join(", ")}`);
}

if (previewUiFrameRuntimes.some((frame) => frame.status !== "READY" || frame.demoBindings.length === 0 || frame.localRuntimeCoverage.length === 0)) {
  throw new Error("All UI frame runtimes must be READY with demo bindings and local runtime coverage");
}

const floralRoutePage = readFileSync(new URL("../src/app/floral/page.tsx", import.meta.url), "utf8");
if (!floralRoutePage.includes("FloralDesignerWorkspace")) {
  throw new Error("/floral must render the extracted FloralDesignerWorkspace");
}

const homeRoutePage = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
const landingComponent = readFileSync(new URL("../src/components/landing/StudioLandingExperience.tsx", import.meta.url), "utf8");
if (!homeRoutePage.includes("StudioLandingExperience") || !landingComponent.includes("SplashOverlay") || !landingComponent.includes("TransitionOverlay")) {
  throw new Error("/ must render the splash, transition, and landing experience");
}

if (heroBannerSummary.count !== 21 || heroBannerSummary.routeBindings < routeMatrix.length) {
  throw new Error("Hero banner generation must expose 21 banners and enough route bindings for the preview app");
}

const assetsRoutePage = readFileSync(new URL("../src/app/assets/page.tsx", import.meta.url), "utf8");
if (!assetsRoutePage.includes("AssetsLibraryWorkspace")) {
  throw new Error("/assets must render the generated asset registry workspace");
}

if (floralWorkspaceSummary.status !== "READY" || floralWorkspaceSummary.numberedPanels !== 14 || floralWorkspaceSummary.kpiWidgets !== 6) {
  throw new Error("/floral extracted workspace must stay READY with 14 panels and 6 KPI widgets");
}

console.log(`verify:routes passed (${routeMatrix.length} READY route frames, ${previewRouteFrames.length} preview runtimes, ${previewFrameRuntimeSummary.totalDemoDataPoints} demo points, ${previewFrameRuntimeSummary.totalLocalCoveragePoints} local coverage checks, ${floralWorkspaceSummary.numberedPanels} floral panels)`);
