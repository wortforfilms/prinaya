import { existsSync, readFileSync } from "node:fs";
import { routeMatrix } from "../src/lib/route-matrix";
import { heroBanners, heroBannerSummary } from "../src/lib/hero-banner-registry";

const evidencePath = new URL("../release/evidence/hero-banners.json", import.meta.url);
const registryPath = new URL("../data/hero-banners.json", import.meta.url);

if (!existsSync(evidencePath) || !existsSync(registryPath)) {
  throw new Error("Hero banner registry or evidence is missing");
}

if (heroBannerSummary.count !== 21 || heroBanners.length !== 21) {
  throw new Error(`Expected 21 generated hero banners, found ${heroBanners.length}`);
}

if (heroBannerSummary.generationMode !== "GENERATED_HIRES_FROM_REFERENCE") {
  throw new Error(`Hero banners must be generated high-res assets, found ${heroBannerSummary.generationMode}`);
}

const validRoutes = new Set([
  ...routeMatrix.map((route) => route.path),
  ...routeMatrix.map((route) => route.path.replace("/*", "")),
  "/cad/editor",
  "/dashboard/settings",
  "/admin/settings",
  "/exports/boards"
]);

const invalidRoutes = heroBanners.flatMap((banner) => banner.routes.filter((route) => !validRoutes.has(route)).map((route) => `${banner.id}:${route}`));
if (invalidRoutes.length > 0) {
  throw new Error(`Hero banners contain invalid route bindings: ${invalidRoutes.join(", ")}`);
}

const missingFiles = heroBanners.flatMap((banner) => {
  const missing: string[] = [];
  if (!existsSync(new URL(`../public${banner.rawImage}`, import.meta.url))) missing.push(banner.rawImage);
  if (!existsSync(new URL(`../public${banner.hiresImage}`, import.meta.url))) missing.push(banner.hiresImage);
  return missing;
});
if (missingFiles.length > 0) {
  throw new Error(`Hero banner files are missing: ${missingFiles.join(", ")}`);
}

const evidence = JSON.parse(readFileSync(evidencePath, "utf8")) as { heroBannerCount?: number; productionReady?: boolean; generationMode?: string };
if (evidence.heroBannerCount !== heroBanners.length || evidence.productionReady !== false || evidence.generationMode !== "GENERATED_HIRES_FROM_REFERENCE") {
  throw new Error("Hero banner evidence must match generated banner count, generation mode, and keep PRODUCTION_READY=false");
}

console.log(`verify:hero-banners passed (${heroBanners.length} generated high-res banners, ${heroBannerSummary.routeBindings} route bindings)`);
