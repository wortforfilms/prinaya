import { existsSync, readFileSync } from "node:fs";
import { boardPackage } from "../src/lib/board-runtime";
import { starterAssetDefinitions } from "../src/lib/cad-runtime";
import { summarizeCadEditorTools, validateSceneJson } from "../src/lib/cad-editor-tools";
import { cadObjects, layers, starterObjectKinds } from "../src/lib/data-frames";
import { getAssetStats } from "../src/lib/asset-preview-runtime";
import { sceneToPreviewDxf } from "../src/lib/export-runtime";
import { pdfBoardPackageSummary } from "../src/lib/pdf-board-runtime";
import { createCadRoundTripSummary } from "../src/lib/cad-roundtrip-runtime";
import { complianceRuntimeSummary } from "../src/lib/compliance-runtime";
import { productionRuntime, productionRuntimeSummary } from "../src/lib/production-runtime";
import { buildSceneHierarchy, sceneBranches, sceneGraphSummary } from "../src/lib/scene-graph";
import { templateRuntimeSummary } from "../src/lib/template-runtime";
import { weddingAssetSummary } from "../src/lib/wedding-asset-library";

const editorPage = new URL("../src/app/cad/editor/page.tsx", import.meta.url);
const editorComponent = new URL("../src/components/cad/CadEditor.tsx", import.meta.url);
const store = new URL("../src/components/cad/cad-store.ts", import.meta.url);
const exportRuntime = new URL("../src/lib/export-runtime.ts", import.meta.url);

const missingKinds = starterObjectKinds.filter(
  (kind) => !starterAssetDefinitions.some((definition) => definition.kind === kind)
);

if (!existsSync(editorPage) || !existsSync(editorComponent) || !existsSync(store) || !existsSync(exportRuntime)) {
  throw new Error("/cad/editor runtime files are missing");
}

const editorSource = readFileSync(editorComponent, "utf8");
const storeSource = readFileSync(store, "utf8");
const assetStats = getAssetStats();
const cadRoundTripSummary = createCadRoundTripSummary(cadObjects, layers);

if (starterObjectKinds.length !== 18) {
  throw new Error(`Expected 18 starter object kinds, found ${starterObjectKinds.length}`);
}

if (missingKinds.length > 0) {
  throw new Error(`Starter objects missing asset definitions: ${missingKinds.join(", ")}`);
}

const dxf = sceneToPreviewDxf(cadObjects, layers);
for (const token of ["SECTION", "ENTITIES", "LINE", "EOF"]) {
  if (!dxf.includes(token)) {
    throw new Error(`Preview DXF export missing ${token}`);
  }
}

const sceneGraph = buildSceneHierarchy({
  objects: cadObjects,
  layers,
  groups: [
    {
      id: "verify-mandap-group",
      label: "Verify Mandap Group",
      objectIds: cadObjects.filter((object) => object.layerId === "mandap").map((object) => object.id),
      hidden: false,
      locked: true
    }
  ],
  hiddenObjectIds: [cadObjects[0].id],
  lockedObjectIds: [cadObjects[1].id]
});
const graphSummary = sceneGraphSummary(sceneGraph);
if (graphSummary.branchCount !== sceneBranches.length || graphSummary.objectCount !== cadObjects.length) {
  throw new Error("Scene graph hierarchy summary does not match CAD object inventory");
}

const cadToolSummary = summarizeCadEditorTools();
const expectedSprint04Tools = [
  "Scene hierarchy panel",
  "Layer tree with lock/hide",
  "Object inspector",
  "Material inspector",
  "Asset browser",
  "Measurement tool",
  "Annotation tool",
  "Template loader",
  "Scene statistics",
  "Save/load validation"
];
if (cadToolSummary.readyTools !== expectedSprint04Tools.length) {
  throw new Error(`Expected ${expectedSprint04Tools.length} READY CAD editor tools, found ${cadToolSummary.readyTools}`);
}
for (const label of expectedSprint04Tools) {
  if (!cadToolSummary.labels.includes(label)) {
    throw new Error(`Missing SPRINT-04 CAD editor tool: ${label}`);
  }
}
for (const sourceToken of ["Measurement Tool", "Annotation Tool", "Save/load validation", "Scene Statistics", "Material Inspector", "CAD asset category filter", "status === \"BLOCKED\""]) {
  if (!editorSource.includes(sourceToken)) {
    throw new Error(`CAD editor UI missing ${sourceToken}`);
  }
}
for (const storeToken of ["createMeasurement", "createAnnotation", "validateSceneJsonDraft", "sceneValidation", "PARTIAL preview", "asset.status === \"BLOCKED\""]) {
  if (!storeSource.includes(storeToken)) {
    throw new Error(`CAD store missing ${storeToken}`);
  }
}

const validScene = validateSceneJson(JSON.stringify({ objects: cadObjects, layers }));
if (validScene.status !== "READY" || validScene.objectCount !== cadObjects.length || validScene.layerCount !== layers.length) {
  throw new Error("Valid scene JSON did not pass save/load validation");
}
const invalidScene = validateSceneJson("{ invalid");
if (invalidScene.status !== "BLOCKED" || invalidScene.errors.length === 0) {
  throw new Error("Invalid scene JSON must be blocked by save/load validation");
}

if (assetStats.total < 600 || assetStats.categoryCount < 27 || assetStats.cadInsertable === 0) {
  throw new Error("Wedding asset registry must contain at least 600 assets, 27 categories, and CAD insertable primitive placeholders");
}

if (assetStats.glbMeshFiles !== assetStats.cadInsertable || assetStats.missingRealMeshes !== 0) {
  throw new Error("CAD asset registry must include real local GLB files for every insertable preview asset");
}

if (weddingAssetSummary.total < 600 || weddingAssetSummary.byCategory.some((item) => item.count < weddingAssetSummary.requiredPerCategory)) {
  throw new Error("Wedding asset library wrapper must reflect the generated 600+ registry");
}

if (
  boardPackage.pages.length !== 9 ||
  boardPackage.pipeline.join(" > ") !== "Scene > Render > Board Composer > PDF Package" ||
  !boardPackage.exportFormats.includes("binary-pdf") ||
  pdfBoardPackageSummary.status !== "READY"
) {
  throw new Error("Board composer package must expose the 9-page Scene to PDF Package pipeline");
}

if (cadRoundTripSummary.lineEntityCount !== cadObjects.length * 12 || cadRoundTripSummary.nativeDwg !== "BLOCKED" || cadRoundTripSummary.productionDxf !== "BLOCKED") {
  throw new Error("CAD round-trip fixtures must cover preview DXF while native DWG and production DXF remain blocked");
}

if (complianceRuntimeSummary.status !== "READY" || complianceRuntimeSummary.certified !== false || complianceRuntimeSummary.reviewRequired !== 3) {
  throw new Error("Local compliance validators must be READY while certified compliance remains blocked");
}

if (templateRuntimeSummary.templates !== 8 || templateRuntimeSummary.readyTemplates !== 8) {
  throw new Error("Template runtime must keep all eight requested asset-linked templates READY");
}

const sceneObjectIds = new Set(cadObjects.map((object) => object.id));
const productionLinks = [
  ...productionRuntime.vendorAssignments.map((item) => item.sceneObjectId),
  ...productionRuntime.crewAssignments.map((item) => item.sceneObjectId),
  ...productionRuntime.schedule.map((item) => item.sceneObjectId),
  ...productionRuntime.workOrders.map((item) => item.sceneObjectId)
];
if (productionLinks.some((id) => !sceneObjectIds.has(id))) {
  throw new Error("Production runtime assignments must connect to CAD scene object ids");
}

if (
  productionRuntimeSummary.vendorAssignments === 0 ||
  productionRuntimeSummary.crewAssignments === 0 ||
  productionRuntimeSummary.transportPlans === 0 ||
  productionRuntimeSummary.accommodationPlans === 0 ||
  productionRuntimeSummary.scheduleItems === 0 ||
  productionRuntimeSummary.workOrders === 0 ||
  productionRuntimeSummary.callSheets === 0
) {
  throw new Error("Production runtime must include vendor, crew, transport, accommodation, schedule, work order, and call sheet frames");
}

console.log(`verify:cad passed (SPRINT-04 editor tools, save/load validation, scene graph, ${assetStats.total} registry assets, ${assetStats.cadInsertable} CAD insertable, ${assetStats.glbMeshFiles} local GLB meshes, binary PDF package, CAD fixtures, compliance validators, 8 templates, production planning links, preview DXF)`);
