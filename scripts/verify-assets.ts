import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { isCadInsertableAsset, summarizeAssetRegistry } from "../src/lib/asset-registry";
import { routeMatrix } from "../src/lib/route-matrix";
import { WeddingCADAssetSchema } from "../src/lib/schemas";

const registryPath = new URL("../data/assets/wedding-cad-assets.json", import.meta.url);
const evidencePath = new URL("../release/evidence/assets-library.json", import.meta.url);
const glbEvidencePath = new URL("../release/evidence/glb-assets.json", import.meta.url);
const templatesDir = new URL("../data/templates/", import.meta.url);

if (!existsSync(registryPath)) {
  throw new Error("data/assets/wedding-cad-assets.json is missing");
}

if (!existsSync(evidencePath)) {
  throw new Error("release/evidence/assets-library.json is missing");
}

if (!existsSync(glbEvidencePath)) {
  throw new Error("release/evidence/glb-assets.json is missing");
}

const registry = JSON.parse(readFileSync(registryPath, "utf8")) as { assets?: unknown[]; templates?: Record<string, string[]> };
const assets = (registry.assets ?? []).map((asset) => WeddingCADAssetSchema.parse(asset));
const stats = summarizeAssetRegistry(assets);

if (assets.length < 600) {
  throw new Error(`Expected at least 600 assets, found ${assets.length}`);
}

const ids = new Set(assets.map((asset) => asset.id));
const slugs = new Set(assets.map((asset) => asset.slug));
if (ids.size !== assets.length) {
  throw new Error("Asset ids must be unique");
}
if (slugs.size !== assets.length) {
  throw new Error("Asset slugs must be unique");
}

const validRoutes = new Set([
  ...routeMatrix.map((route) => route.path),
  ...routeMatrix.map((route) => route.path.replace("/*", "")),
  "/cad/editor"
]);
const invalidRouteRefs = assets.flatMap((asset) => asset.usableInRoutes.filter((route) => !validRoutes.has(route)).map((route) => `${asset.id}:${route}`));
if (invalidRouteRefs.length > 0) {
  throw new Error(`Invalid asset route references: ${invalidRouteRefs.slice(0, 20).join(", ")}`);
}

const templateFiles = readdirSync(templatesDir).filter((file) => file.endsWith(".json"));
const missingTemplateRefs: string[] = [];
for (const file of templateFiles) {
  const template = JSON.parse(readFileSync(new URL(file, templatesDir), "utf8")) as { id?: string; assetIds?: string[] };
  if (template.assetIds) {
    for (const assetId of template.assetIds) {
      if (!ids.has(assetId)) {
        missingTemplateRefs.push(`${template.id ?? file}:${assetId}`);
      }
    }
  }
}
if (missingTemplateRefs.length > 0) {
  throw new Error(`Template asset references missing registry assets: ${missingTemplateRefs.join(", ")}`);
}

const registryTemplateRefs = Object.entries(registry.templates ?? {}).flatMap(([templateId, assetIds]) =>
  assetIds.filter((assetId) => !ids.has(assetId)).map((assetId) => `${templateId}:${assetId}`)
);
if (registryTemplateRefs.length > 0) {
  throw new Error(`Registry template references missing assets: ${registryTemplateRefs.join(", ")}`);
}

const blockedExternalReady = assets.filter((asset) => asset.source === "BLOCKED_EXTERNAL" && asset.status === "READY");
if (blockedExternalReady.length > 0) {
  throw new Error(`Blocked external assets cannot be READY: ${blockedExternalReady.map((asset) => asset.id).join(", ")}`);
}

const blockedInsertable = assets.filter((asset) => asset.status === "BLOCKED" && isCadInsertableAsset(asset));
if (blockedInsertable.length > 0) {
  throw new Error(`BLOCKED assets cannot be CAD insertable: ${blockedInsertable.map((asset) => asset.id).join(", ")}`);
}

const blockedWithMesh = assets.filter((asset) => asset.status === "BLOCKED" && asset.fileRefs.mesh);
if (blockedWithMesh.length > 0) {
  throw new Error(`BLOCKED assets cannot reference GLB meshes: ${blockedWithMesh.map((asset) => asset.id).join(", ")}`);
}

const readyMissingPreview = assets.filter((asset) => asset.status === "READY" && (!asset.fileRefs.previewImage || asset.source !== "LOCAL_PREVIEW"));
if (readyMissingPreview.length > 0) {
  throw new Error(`READY assets missing local preview data: ${readyMissingPreview.map((asset) => asset.id).join(", ")}`);
}

const meshMissing = assets.filter((asset) => isCadInsertableAsset(asset) && !asset.fileRefs.mesh);
if (meshMissing.length > 0) {
  throw new Error(`CAD insertable assets missing GLB refs: ${meshMissing.map((asset) => asset.id).join(", ")}`);
}

const missingMeshFiles = assets
  .filter((asset) => asset.fileRefs.mesh)
  .filter((asset) => !existsSync(new URL(`../public${asset.fileRefs.mesh!}`, import.meta.url)));
if (missingMeshFiles.length > 0) {
  throw new Error(`Asset GLB files missing from public/: ${missingMeshFiles.map((asset) => asset.id).join(", ")}`);
}

const evidence = JSON.parse(readFileSync(evidencePath, "utf8")) as {
  totalAssets?: number;
  statusCounts?: Record<string, number>;
  missingMeshFileBlockers?: { glbMeshFiles?: number; missingRealMeshes?: number };
};
if (evidence.totalAssets !== assets.length) {
  throw new Error(`assets-library evidence count ${evidence.totalAssets} does not match registry count ${assets.length}`);
}

const glbEvidence = JSON.parse(readFileSync(glbEvidencePath, "utf8")) as { meshFileCount?: number; blockedMeshes?: number };
if (glbEvidence.meshFileCount !== stats.glbMeshFiles || evidence.missingMeshFileBlockers?.glbMeshFiles !== stats.glbMeshFiles) {
  throw new Error("GLB evidence counts must match the registry mesh references");
}

if (glbEvidence.blockedMeshes !== 0 || stats.missingRealMeshes !== 0) {
  throw new Error("Blocked or CAD-insertable assets have incorrect mesh evidence");
}

console.log(
  `verify:assets passed (${stats.total} assets, ${stats.categoryCount} categories, READY=${stats.statusCounts.READY}, PARTIAL=${stats.statusCounts.PARTIAL}, BLOCKED=${stats.statusCounts.BLOCKED}, ${stats.cadInsertable} CAD insertable)`
);
