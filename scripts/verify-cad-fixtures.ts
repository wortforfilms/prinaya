import { existsSync, readFileSync } from "node:fs";
import { cadObjects, layers } from "../src/lib/data-frames";
import { parsePreviewDxfLines } from "../src/lib/cad-roundtrip-runtime";

const scenePath = new URL("../fixtures/cad-roundtrip/hemant-samwat-scene.json", import.meta.url);
const dxfPath = new URL("../fixtures/cad-roundtrip/hemant-samwat-preview-footprint.dxf", import.meta.url);
const evidencePath = new URL("../release/evidence/cad-roundtrip-fixtures.json", import.meta.url);

for (const file of [scenePath, dxfPath, evidencePath]) {
  if (!existsSync(file)) {
    throw new Error(`Missing CAD round-trip fixture or evidence: ${file.pathname}`);
  }
}

const scene = JSON.parse(readFileSync(scenePath, "utf8")) as { objects?: unknown[] };
if (!Array.isArray(scene.objects) || scene.objects.length !== cadObjects.length) {
  throw new Error("Scene JSON round-trip fixture does not match CAD object inventory");
}

const dxf = readFileSync(dxfPath, "utf8");
const lines = parsePreviewDxfLines(dxf);
const expectedLineCount = cadObjects.length * 12;
if (!dxf.includes("SECTION") || !dxf.includes("ENTITIES") || lines.length !== expectedLineCount) {
  throw new Error(`Preview DXF fixture expected ${expectedLineCount} LINE entities, found ${lines.length}`);
}

const evidence = JSON.parse(readFileSync(evidencePath, "utf8")) as {
  productionReady?: boolean;
  previewDxf?: string;
  nativeDwg?: string;
  productionDxf?: string;
  lineEntityCount?: number;
  layerCount?: number;
};

if (
  evidence.productionReady !== false ||
  evidence.previewDxf !== "READY" ||
  evidence.nativeDwg !== "BLOCKED" ||
  evidence.productionDxf !== "BLOCKED" ||
  evidence.lineEntityCount !== expectedLineCount ||
  evidence.layerCount !== layers.length - 1
) {
  throw new Error("CAD round-trip fixture evidence must keep production DWG/DXF blocked and match preview fixture counts");
}

console.log(`verify:cad:fixtures passed (${lines.length} preview DXF LINE entities, DWG/DXF production blocked)`);
