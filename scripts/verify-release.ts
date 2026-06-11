import { readFileSync } from "node:fs";

const latest = JSON.parse(readFileSync(new URL("../release/evidence/latest.json", import.meta.url), "utf8")) as {
  verdict: string;
  productionReady: boolean;
  routeCoverage: { matrixRoutes: number };
  blockers: { id: string; status: string }[];
};

const blockers = JSON.parse(readFileSync(new URL("../release/evidence/blockers.json", import.meta.url), "utf8")) as {
  blockedCapabilities: { id: string; label: string; status: string }[];
};

const usecases = JSON.parse(readFileSync(new URL("../release/evidence/usecases.json", import.meta.url), "utf8")) as {
  status: string;
  verdict: string;
  productionReady: boolean;
  categoryCount: number;
  useCaseCount: number;
  useCasesPerCategory: number;
  checks: Record<string, boolean>;
  routeUseCaseCoverage: Array<{ routePath: string; useCaseCount: number; activeStepCount: number }>;
};

const activePages = JSON.parse(readFileSync(new URL("../release/evidence/active-pages.json", import.meta.url), "utf8")) as {
  status: string;
  verdict: string;
  productionReady: boolean;
  activeRouteCount: number;
  previewFramesUsed: number;
  demoDataCount: number;
  runtimeCoverageCount: number;
  demoFlowCount: number;
  useCaseCount: number;
  routeUseCaseRefs: number;
  screenLinkCount: number;
  checks: Record<string, boolean>;
};

if (latest.verdict !== "CONTROLLED_PREVIEW_READY") {
  throw new Error(`Release verdict must be CONTROLLED_PREVIEW_READY, found ${latest.verdict}`);
}

if (latest.productionReady !== false) {
  throw new Error("PRODUCTION_READY must remain false without production evidence");
}

const blockedIds = new Set(blockers.blockedCapabilities.map((item) => item.id));
for (const id of [
  "native-dwg-export",
  "production-dxf-export",
  "payments",
  "marketplace-commerce",
  "live-vendors",
  "structural-validation",
  "electrical-validation",
  "fire-safety-validation",
  "engineering-compliance"
]) {
  if (!blockedIds.has(id)) {
    throw new Error(`Missing blocked capability ${id}`);
  }
}

if (blockers.blockedCapabilities.some((item) => item.status !== "BLOCKED")) {
  throw new Error("All production-only capability entries must be BLOCKED");
}

if (usecases.status !== "READY" || usecases.verdict !== "CONTROLLED_PREVIEW_READY" || usecases.productionReady !== false) {
  throw new Error("Use case evidence must remain READY, CONTROLLED_PREVIEW_READY, and PRODUCTION_READY=false");
}

if (usecases.categoryCount !== 27 || usecases.useCaseCount !== 108 || usecases.useCasesPerCategory !== 4) {
  throw new Error("Use case evidence must cover 27 categories with exactly 4 use cases each");
}

if (Object.values(usecases.checks).some((value) => value !== true)) {
  throw new Error("Use case evidence checks must all be true");
}

if (usecases.routeUseCaseCoverage.length !== latest.routeCoverage.matrixRoutes) {
  throw new Error("Use case evidence must include active use-case coverage for every matrix route");
}

if (usecases.routeUseCaseCoverage.some((route) => route.useCaseCount < 4 || route.activeStepCount < 4)) {
  throw new Error("Every route must expose active use cases and steps");
}

if (activePages.status !== "READY" || activePages.verdict !== "CONTROLLED_PREVIEW_READY" || activePages.productionReady !== false) {
  throw new Error("Active page evidence must remain READY, CONTROLLED_PREVIEW_READY, and PRODUCTION_READY=false");
}

if (
  activePages.activeRouteCount !== 32 ||
  activePages.previewFramesUsed !== 25 ||
  activePages.demoDataCount < 208 ||
  activePages.runtimeCoverageCount < 139 ||
  activePages.demoFlowCount !== activePages.routeUseCaseRefs ||
  activePages.useCaseCount !== 108 ||
  activePages.screenLinkCount !== 432
) {
  throw new Error("Active page evidence counts do not match the release contract");
}

if (Object.values(activePages.checks).some((value) => value !== true)) {
  throw new Error("Active page evidence checks must all be true");
}

console.log("verify:release passed (CONTROLLED_PREVIEW_READY, PRODUCTION_READY=false, production blockers and use cases explicit)");
