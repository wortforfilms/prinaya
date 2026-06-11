import { existsSync, readFileSync } from "node:fs";
import { getRegisteredAssets } from "../src/lib/asset-registry";
import { assetCategoryValues } from "../src/lib/schemas";
import { routeMatrix } from "../src/lib/route-matrix";
import { blockedCapabilities } from "../src/lib/status";
import { getRouteDemoUseCases, type CategoryDemoUseCaseRegistry } from "../src/lib/category-demo-usecases";

type UseCaseEvidence = {
  status: string;
  verdict: string;
  productionReady: boolean;
  registryRef: string;
  categoryCount: number;
  useCaseCount: number;
  assetRefCount: number;
  screenRefCount: number;
  checks: Record<string, boolean>;
  blockedCapabilityNotes: Array<{ id: string; status: string; reason: string }>;
  routeUseCaseCoverage: Array<{ routePath: string; useCaseCount: number; activeStepCount: number }>;
};

type ScreenRegistry = {
  status: string;
  verdict: string;
  productionReady: boolean;
  screenLinkCount: number;
  links: Array<{ id: string; route: string; image: string; source: string; status: string }>;
};

const registryPath = new URL("../data/usecases/category-demo-usecases.json", import.meta.url);
const evidencePath = new URL("../release/evidence/usecases.json", import.meta.url);
const screenRegistryPath = new URL("../data/screens/preview-ready-screens.json", import.meta.url);

const registry = readJson<CategoryDemoUseCaseRegistry>(registryPath);
const evidence = readJson<UseCaseEvidence>(evidencePath);
const screenRegistry = readJson<ScreenRegistry>(screenRegistryPath);
const assetsById = new Map(getRegisteredAssets().map((asset) => [asset.id, asset]));
const validRoutes = routeMatrix.map((route) => normalizeRoute(route.path));
const failures: string[] = [];

expect(registry.status === "READY", "Use case registry status must be READY");
expect(registry.verdict === "CONTROLLED_PREVIEW_READY", "Use case registry verdict must remain CONTROLLED_PREVIEW_READY");
expect(registry.productionReady === false, "Use case registry productionReady must remain false");
expect(registry.summary.verdict === "CONTROLLED_PREVIEW_READY", "Use case summary verdict must remain CONTROLLED_PREVIEW_READY");
expect(registry.summary.productionReady === false, "Use case summary productionReady must remain false");
expect(registry.categories.length === 27, `Expected 27 categories, found ${registry.categories.length}`);
expect(registry.categories.length === assetCategoryValues.length, `Expected ${assetCategoryValues.length} schema categories, found ${registry.categories.length}`);

const seenCategories = new Set<string>();
let useCaseCount = 0;
let assetRefCount = 0;
let screenRefCount = 0;

for (const category of registry.categories) {
  seenCategories.add(category.category);
  expect(assetCategoryValues.includes(category.category), `Unknown use case category ${category.category}`);
  expect(category.useCases.length === 4, `${category.category} must have exactly 4 use cases, found ${category.useCases.length}`);
  expect(category.routes.length > 0 && category.routes.every(isValidRouteRef), `${category.category} has invalid category route refs`);
  expect(category.blockedAssets === 0 || category.useCases.every((useCase) => useCase.blockedNotes.length > 0), `${category.category} has blocked assets without use case blocker notes`);

  for (const useCase of category.useCases) {
    useCaseCount += 1;
    assetRefCount += useCase.assetRefs.length;
    screenRefCount += useCase.screens.length;

    expect(useCase.category === category.category, `${useCase.id} category does not match parent category`);
    expect(isValidRouteRef(useCase.route), `${useCase.id} has invalid route ref ${useCase.route}`);
    expect(useCase.assetRefs.length > 0, `${useCase.id} must include asset refs`);
    expect(useCase.assetRefs.length === 4, `${useCase.id} must include exactly 4 asset refs`);
    expect(useCase.screens.length > 0, `${useCase.id} must include screen refs`);
    expect(useCase.screens.length === 4, `${useCase.id} must include exactly 4 screen refs`);
    expect(useCase.blockedNotes.length > 0, `${useCase.id} must include blocker notes`);

    const hasBlockedAsset = useCase.assetRefs.some((assetRef) => assetRef.status === "BLOCKED");
    if (useCase.status === "PARTIAL" || useCase.status === "BLOCKED" || hasBlockedAsset) {
      expect(
        useCase.blockedNotes.some((note) => /blocked|external|not available|no live/i.test(note)),
        `${useCase.id} must explain blocked or external capability limits`
      );
    }

    for (const assetRef of useCase.assetRefs) {
      const asset = assetsById.get(assetRef.id);
      expect(Boolean(asset), `${useCase.id} references missing asset ${assetRef.id}`);
      expect(asset?.category === category.category, `${useCase.id} asset ${assetRef.id} is not in ${category.category}`);
      expect(assetRef.previewImage === null || resolvesPublicFile(assetRef.previewImage), `${useCase.id} asset ${assetRef.id} preview image does not resolve`);
    }

    for (const screen of useCase.screens) {
      expect(isValidRouteRef(screen.route), `${useCase.id} screen ${screen.id} has invalid route ${screen.route}`);
      expect(screen.status === "READY", `${useCase.id} screen ${screen.id} must be READY`);
      expect(resolvesPublicFile(screen.image), `${useCase.id} screen ${screen.id} image does not resolve: ${screen.image}`);
      expect(!screen.source.startsWith("/") || resolvesPublicFile(screen.source), `${useCase.id} screen ${screen.id} source does not resolve: ${screen.source}`);
    }
  }
}

for (const expectedCategory of assetCategoryValues) {
  expect(seenCategories.has(expectedCategory), `Missing category ${expectedCategory}`);
}

expect(registry.summary.categoryCount === registry.categories.length, "Summary categoryCount must match registry categories");
expect(registry.summary.useCaseCount === useCaseCount, "Summary useCaseCount must match registry use cases");
expect(registry.summary.assetRefCount === assetRefCount, "Summary assetRefCount must match registry asset refs");
expect(registry.summary.screenRefCount === screenRefCount, "Summary screenRefCount must match registry screen refs");
expect(registry.summary.minUseCasesPerCategory === 4, "Summary minUseCasesPerCategory must be 4");
expect(registry.summary.maxUseCasesPerCategory === 4, "Summary maxUseCasesPerCategory must be 4");
expect(registry.summary.evidenceRefs.includes("data/usecases/category-demo-usecases.json"), "Summary must cite the data registry");
expect(registry.summary.evidenceRefs.includes("release/evidence/usecases.json"), "Summary must cite release use case evidence");

expect(evidence.status === "READY", "Use case evidence status must be READY");
expect(evidence.verdict === "CONTROLLED_PREVIEW_READY", "Use case evidence verdict must remain CONTROLLED_PREVIEW_READY");
expect(evidence.productionReady === false, "Use case evidence productionReady must remain false");
expect(evidence.registryRef === "data/usecases/category-demo-usecases.json", "Use case evidence must point at the data registry");
expect(evidence.categoryCount === registry.summary.categoryCount, "Use case evidence categoryCount must match registry summary");
expect(evidence.useCaseCount === registry.summary.useCaseCount, "Use case evidence useCaseCount must match registry summary");
expect(evidence.assetRefCount === registry.summary.assetRefCount, "Use case evidence assetRefCount must match registry summary");
expect(evidence.screenRefCount === registry.summary.screenRefCount, "Use case evidence screenRefCount must match registry summary");
expect(Object.values(evidence.checks).every(Boolean), "All use case evidence checks must be true");
expect(screenRegistry.status === "READY", "Screen registry status must be READY");
expect(screenRegistry.verdict === "CONTROLLED_PREVIEW_READY", "Screen registry verdict must remain CONTROLLED_PREVIEW_READY");
expect(screenRegistry.productionReady === false, "Screen registry productionReady must remain false");
expect(screenRegistry.screenLinkCount === screenRefCount, "Screen registry link count must match use case screen refs");
expect(screenRegistry.links.length === screenRefCount, "Screen registry must preserve every screen link");
for (const link of screenRegistry.links) {
  expect(link.status === "READY", `Screen link ${link.id} must be READY`);
  expect(isValidRouteRef(link.route), `Screen link ${link.id} has invalid route ${link.route}`);
  expect(resolvesPublicFile(link.image), `Screen link ${link.id} image does not resolve: ${link.image}`);
  expect(!link.source.startsWith("/") || resolvesPublicFile(link.source), `Screen link ${link.id} source does not resolve: ${link.source}`);
}

const blockedNotesById = new Map(evidence.blockedCapabilityNotes.map((note) => [note.id, note]));
for (const capability of blockedCapabilities) {
  const note = blockedNotesById.get(capability.id);
  expect(Boolean(note), `Missing blocker note for ${capability.id}`);
  expect(note?.status === "BLOCKED", `Blocker note ${capability.id} must remain BLOCKED`);
  expect(Boolean(note?.reason), `Blocker note ${capability.id} must include a reason`);
}

expect(evidence.routeUseCaseCoverage.length === routeMatrix.length, "Use case evidence must include every matrix route");
for (const route of routeMatrix) {
  const routeUseCases = getRouteDemoUseCases(route.path);
  expect(routeUseCases.length >= 4, `${route.path} must expose at least 4 active use cases`);
  expect(routeUseCases.every((useCase) => useCase.steps.length > 0), `${route.path} active use cases must include steps`);
  expect(routeUseCases.every((useCase) => useCase.assetRefs.length > 0), `${route.path} active use cases must include assets`);
  expect(routeUseCases.every((useCase) => useCase.screens.length > 0), `${route.path} active use cases must include screens`);
  expect(routeUseCases.every((useCase) => useCase.blockedNotes.length > 0), `${route.path} active use cases must include blocker notes`);
}

if (failures.length > 0) {
  throw new Error(`verify:usecases failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
}

console.log(`verify:usecases passed (${registry.categories.length} categories, ${useCaseCount} use cases, ${assetRefCount} asset refs, ${screenRefCount} screen refs)`);

function readJson<T>(path: URL): T {
  if (!existsSync(path)) {
    throw new Error(`Missing JSON file: ${path.pathname}`);
  }
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

function normalizeRoute(route: string) {
  const trimmed = route.replace("/*", "").replace(/\/+$/, "");
  return trimmed || "/";
}
