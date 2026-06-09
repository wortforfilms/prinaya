import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildAssetRegistryFile,
  generateWeddingCadAssets,
  isCadInsertableAsset,
  summarizeAssetRegistry,
  templateAssetReferences
} from "../src/lib/asset-registry";
import { routeMatrix } from "../src/lib/route-matrix";
import { WeddingCADAssetSchema } from "../src/lib/schemas";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const dataPath = fileURLToPath(new URL("../data/assets/wedding-cad-assets.json", import.meta.url));
const evidencePath = fileURLToPath(new URL("../release/evidence/assets-library.json", import.meta.url));
const glbEvidencePath = fileURLToPath(new URL("../release/evidence/glb-assets.json", import.meta.url));
const glbPublicDir = fileURLToPath(new URL("../public/generated-assets/glb/", import.meta.url));
const templateDir = new URL("../data/templates/", import.meta.url);

const validRoutes = new Set([
  ...routeMatrix.map((route) => route.path),
  ...routeMatrix.map((route) => route.path.replace("/*", "")),
  "/cad/editor"
]);

const assets = generateWeddingCadAssets();
const parsedAssets = assets.map((asset) => WeddingCADAssetSchema.parse(asset));
const assetIds = new Set(parsedAssets.map((asset) => asset.id));
const slugs = new Set(parsedAssets.map((asset) => asset.slug));
const stats = summarizeAssetRegistry(parsedAssets);

if (parsedAssets.length < 600) {
  throw new Error(`Expected at least 600 generated assets, found ${parsedAssets.length}`);
}

if (assetIds.size !== parsedAssets.length) {
  throw new Error("Generated asset registry contains duplicate ids");
}

if (slugs.size !== parsedAssets.length) {
  throw new Error("Generated asset registry contains duplicate slugs");
}

const invalidRoutes = parsedAssets.flatMap((asset) => asset.usableInRoutes.filter((route) => !validRoutes.has(route)).map((route) => `${asset.id}:${route}`));
if (invalidRoutes.length > 0) {
  throw new Error(`Generated asset registry contains invalid route references: ${invalidRoutes.slice(0, 20).join(", ")}`);
}

const readyWithoutLocalPreview = parsedAssets.filter(
  (asset) =>
    asset.status === "READY" &&
    (asset.source !== "LOCAL_PREVIEW" || !asset.fileRefs.previewImage || !asset.fileRefs.metadata || asset.previewType === "BLOCKED_EXTERNAL")
);
if (readyWithoutLocalPreview.length > 0) {
  throw new Error(`READY assets missing local preview data: ${readyWithoutLocalPreview.map((asset) => asset.id).join(", ")}`);
}

const insertableWithoutMesh = parsedAssets.filter((asset) => isCadInsertableAsset(asset) && !asset.fileRefs.mesh);
if (insertableWithoutMesh.length > 0) {
  throw new Error(`CAD insertable assets must reference generated GLB mesh files: ${insertableWithoutMesh.map((asset) => asset.id).join(", ")}`);
}

const blockedWithMesh = parsedAssets.filter((asset) => asset.status === "BLOCKED" && asset.fileRefs.mesh);
if (blockedWithMesh.length > 0) {
  throw new Error(`BLOCKED assets must not reference GLB mesh files: ${blockedWithMesh.map((asset) => asset.id).join(", ")}`);
}

const blockedShownReady = parsedAssets.filter((asset) => asset.source === "BLOCKED_EXTERNAL" && asset.status === "READY");
if (blockedShownReady.length > 0) {
  throw new Error(`Blocked external assets cannot be READY: ${blockedShownReady.map((asset) => asset.id).join(", ")}`);
}

const blockedInsertable = parsedAssets.filter((asset) => asset.status === "BLOCKED" && isCadInsertableAsset(asset));
if (blockedInsertable.length > 0) {
  throw new Error(`BLOCKED assets must not be CAD insertable: ${blockedInsertable.map((asset) => asset.id).join(", ")}`);
}

for (const [templateId, references] of Object.entries(templateAssetReferences)) {
  const missing = references.filter((assetId) => !assetIds.has(assetId));
  if (missing.length > 0) {
    throw new Error(`Template ${templateId} references missing assets: ${missing.join(", ")}`);
  }
}

mkdirSync(dirname(dataPath), { recursive: true });
mkdirSync(dirname(evidencePath), { recursive: true });
mkdirSync(glbPublicDir, { recursive: true });

const glbEvidence = writeGlbMeshes(parsedAssets);

const registry = buildAssetRegistryFile(parsedAssets);
writeFileSync(dataPath, `${JSON.stringify(registry, null, 2)}\n`);

const evidence = {
  generatedAt: registry.generatedAt,
  verdict: registry.verdict,
  productionReady: registry.productionReady,
  totalAssets: stats.total,
  categoryCount: stats.categoryCount,
  categoryCounts: stats.categories,
  statusCounts: stats.statusCounts,
  cadInsertCoverage: {
    cadInsertable: stats.cadInsertable,
    readyInsertable: stats.readyInsertable,
    partialInsertable: stats.partialInsertable,
    blockedInsertable: 0
  },
  missingMeshFileBlockers: {
    glbMeshFiles: stats.glbMeshFiles,
    missingRealMeshes: stats.missingRealMeshes,
    note: `${stats.glbMeshFiles} local primitive GLB files are generated and verified. These are preview meshes, not vendor production models.`
  },
  glbMeshEvidence: glbEvidence,
  templateAssetReferences,
  blockerSummary: [
    "Local primitive GLB/mesh asset production is implemented for CAD-insertable preview records.",
    "Paid, commercial, vendor, marketplace, and live-network assets remain BLOCKED or PARTIAL.",
    "Certified structural, electrical, fire, and engineering compliance remains BLOCKED."
  ]
};
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
writeFileSync(glbEvidencePath, `${JSON.stringify(glbEvidence, null, 2)}\n`);

writeTemplateAssetReferences(templateAssetReferences);

console.log(
  `assets:generate wrote ${relative(dataPath)} and ${relative(evidencePath)} (${stats.total} assets, ${stats.categoryCount} categories, READY=${stats.statusCounts.READY}, PARTIAL=${stats.statusCounts.PARTIAL}, BLOCKED=${stats.statusCounts.BLOCKED})`
);

function writeGlbMeshes(assetRecords: typeof parsedAssets) {
  const meshAssets = assetRecords.filter((asset) => isCadInsertableAsset(asset) && asset.fileRefs.mesh);
  const files = meshAssets.map((asset) => {
    const meshPath = asset.fileRefs.mesh;
    if (!meshPath?.startsWith("/generated-assets/glb/")) {
      throw new Error(`Unexpected mesh path for ${asset.id}: ${meshPath}`);
    }
    const absolutePath = fileURLToPath(new URL(`../public${meshPath}`, import.meta.url));
    const bytes = createBoxGlb(asset.name, asset.dimensions.widthM, asset.dimensions.heightM, asset.dimensions.depthM);
    writeFileSync(absolutePath, bytes);
    return {
      assetId: asset.id,
      mesh: meshPath,
      bytes: bytes.byteLength,
      primitiveKind: asset.fileRefs.primitiveKind,
      status: asset.status
    };
  });

  return {
    generatedAt: registryTimestamp(),
    verdict: "CONTROLLED_PREVIEW_READY",
    productionReady: false,
    outputDir: "public/generated-assets/glb",
    meshFileCount: files.length,
    readyMeshes: files.filter((file) => file.status === "READY").length,
    partialMeshes: files.filter((file) => file.status === "PARTIAL").length,
    blockedMeshes: files.filter((file) => file.status === "BLOCKED").length,
    note: "Generated GLB files are deterministic primitive preview meshes. They are real local GLB files, but not certified vendor production models.",
    files
  };
}

function createBoxGlb(name: string, widthM: number, heightM: number, depthM: number) {
  const halfWidth = Math.max(widthM / 2, 0.05);
  const height = Math.max(heightM, 0.05);
  const halfDepth = Math.max(depthM / 2, 0.05);
  const positions = new Float32Array([
    -halfWidth, 0, -halfDepth,
    halfWidth, 0, -halfDepth,
    halfWidth, height, -halfDepth,
    -halfWidth, height, -halfDepth,
    -halfWidth, 0, halfDepth,
    halfWidth, 0, halfDepth,
    halfWidth, height, halfDepth,
    -halfWidth, height, halfDepth
  ]);
  const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3,
    1, 5, 6, 1, 6, 2,
    5, 4, 7, 5, 7, 6,
    4, 0, 3, 4, 3, 7,
    3, 2, 6, 3, 6, 7,
    4, 5, 1, 4, 1, 0
  ]);
  const positionBuffer = Buffer.from(positions.buffer, positions.byteOffset, positions.byteLength);
  const indexBuffer = Buffer.from(indices.buffer, indices.byteOffset, indices.byteLength);
  const binaryBuffer = Buffer.concat([positionBuffer, indexBuffer]);
  const json = {
    asset: {
      version: "2.0",
      generator: "TLP Wedding CAD local primitive GLB generator"
    },
    scenes: [{ nodes: [0] }],
    scene: 0,
    nodes: [{ mesh: 0, name }],
    meshes: [
      {
        name,
        primitives: [{ attributes: { POSITION: 0 }, indices: 1, material: 0, mode: 4 }]
      }
    ],
    materials: [
      {
        name: "Preview brass-gold material",
        pbrMetallicRoughness: {
          baseColorFactor: [0.86, 0.58, 0.22, 1],
          metallicFactor: 0.35,
          roughnessFactor: 0.48
        }
      }
    ],
    buffers: [{ byteLength: binaryBuffer.byteLength }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: positionBuffer.byteLength, target: 34962 },
      { buffer: 0, byteOffset: positionBuffer.byteLength, byteLength: indexBuffer.byteLength, target: 34963 }
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: 8,
        type: "VEC3",
        min: [-halfWidth, 0, -halfDepth],
        max: [halfWidth, height, halfDepth]
      },
      {
        bufferView: 1,
        componentType: 5123,
        count: indices.length,
        type: "SCALAR"
      }
    ]
  };
  return createGlb(json, binaryBuffer);
}

function createGlb(json: unknown, binaryBuffer: Buffer) {
  const jsonBuffer = padBuffer(Buffer.from(JSON.stringify(json), "utf8"), 0x20);
  const binBuffer = padBuffer(binaryBuffer, 0x00);
  const totalLength = 12 + 8 + jsonBuffer.byteLength + 8 + binBuffer.byteLength;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(totalLength, 8);
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonBuffer.byteLength, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binBuffer.byteLength, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, jsonBuffer, binHeader, binBuffer]);
}

function padBuffer(buffer: Buffer, byte: number) {
  const remainder = buffer.byteLength % 4;
  if (remainder === 0) return buffer;
  return Buffer.concat([buffer, Buffer.alloc(4 - remainder, byte)]);
}

function writeTemplateAssetReferences(references: Record<string, readonly string[]>) {
  for (const [templateId, assetIdsForTemplate] of Object.entries(references)) {
    const path = fileURLToPath(new URL(`${templateId}.json`, templateDir));
    const existing = existsSync(path)
      ? JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>
      : {
          id: templateId,
          name: "Hemant Samwat Wedding",
          status: "READY",
          route: "/projects/hemant-samwat",
          designLanguage: "Vedic lotus, royal palace symmetry, floral canopy, warm amber lighting",
          objects: ["mandap", "stage", "gate", "floral-garland", "chandelier", "chair"],
          palette: ["lotus pink", "brushed brass", "jasmine white", "neem green"],
          notes: "Local preview template for Hemant Samwat Wedding. Production compliance remains blocked."
        };

    const next = {
      ...existing,
      assetIds: [...assetIdsForTemplate],
      assetEvidenceRef: "release/evidence/assets-library.json#template-asset-references"
    };
    writeFileSync(path, `${JSON.stringify(next, null, 2)}\n`);
  }
}

function relative(path: string) {
  return path.replace(rootDir, "");
}

function registryTimestamp() {
  return "2026-06-09T00:00:00.000Z";
}
