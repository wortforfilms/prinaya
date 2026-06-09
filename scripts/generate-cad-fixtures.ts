import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { cadObjects, layers, projectSummary } from "../src/lib/data-frames";
import { createCadRoundTripSummary } from "../src/lib/cad-roundtrip-runtime";
import { createPreviewDxfExport, createSceneJsonExport } from "../src/lib/export-runtime";

const fixturesDir = fileURLToPath(new URL("../fixtures/cad-roundtrip/", import.meta.url));
const dxfFixturePath = fileURLToPath(new URL("../fixtures/cad-roundtrip/hemant-samwat-preview-footprint.dxf", import.meta.url));
const sceneFixturePath = fileURLToPath(new URL("../fixtures/cad-roundtrip/hemant-samwat-scene.json", import.meta.url));
const evidencePath = fileURLToPath(new URL("../release/evidence/cad-roundtrip-fixtures.json", import.meta.url));

mkdirSync(fixturesDir, { recursive: true });
mkdirSync(dirname(evidencePath), { recursive: true });

const sceneExport = createSceneJsonExport(cadObjects);
const dxfExport = createPreviewDxfExport(cadObjects, layers);
const summary = createCadRoundTripSummary(cadObjects, layers);

writeFileSync(sceneFixturePath, sceneExport.content);
writeFileSync(dxfFixturePath, dxfExport.content);

const evidence = {
  generatedAt: new Date().toISOString(),
  verdict: "CONTROLLED_PREVIEW_READY",
  productionReady: false,
  projectId: projectSummary.id,
  status: summary.status,
  previewDxf: summary.previewDxf,
  nativeDwg: summary.nativeDwg,
  productionDxf: summary.productionDxf,
  files: [
    "fixtures/cad-roundtrip/hemant-samwat-scene.json",
    "fixtures/cad-roundtrip/hemant-samwat-preview-footprint.dxf"
  ],
  objectCount: summary.objectCount,
  lineEntityCount: summary.lineEntityCount,
  layerCount: summary.layerCount,
  note: "Round-trip fixtures cover local preview DXF parsing. Native DWG export and production DXF remain BLOCKED."
};
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);

console.log(`cad:fixtures wrote ${evidence.files.join(", ")} (${summary.lineEntityCount} LINE entities)`);
