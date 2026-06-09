import { extractedBoards } from "./extracted-boards";
import { initialCadScene, sceneToJson } from "./cad-runtime";
import { projectSummary, type CadObjectFrame, type LayerFrame } from "./data-frames";

export type ExportArtifact = {
  fileName: string;
  mimeType: string;
  content: string;
};

export function createSceneJsonExport(objects: CadObjectFrame[]): ExportArtifact {
  return {
    fileName: `${projectSummary.id}-scene.json`,
    mimeType: "application/json",
    content: sceneToJson(objects)
  };
}

export function createPreviewDxfExport(objects: CadObjectFrame[], layers: LayerFrame[]): ExportArtifact {
  return {
    fileName: `${projectSummary.id}-preview-footprint.dxf`,
    mimeType: "application/dxf",
    content: sceneToPreviewDxf(objects, layers)
  };
}

export function createPrintableBoardHtmlExport(): ExportArtifact {
  const cards = extractedBoards
    .map(
      (board) => `
        <article>
          <h2>${escapeHtml(board.title)}</h2>
          <p>${escapeHtml(board.summary)}</p>
          <p><strong>Status:</strong> ${board.status}</p>
          <p><strong>Frames:</strong> ${board.options.length}; <strong>Panels:</strong> ${board.panels.length}</p>
          <ul>${board.options.map((option) => `<li>${escapeHtml(option.label)} - ${option.status}</li>`).join("")}</ul>
        </article>`
    )
    .join("");

  return {
    fileName: `${projectSummary.id}-printable-board.html`,
    mimeType: "text/html",
    content: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(projectSummary.name)} Printable Board</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; margin: 32px; color: #172126; }
    header { border-bottom: 2px solid #d08b1f; margin-bottom: 24px; padding-bottom: 16px; }
    h1 { margin: 0; font-size: 30px; }
    article { break-inside: avoid; border: 1px solid #d8d1c3; border-radius: 6px; margin: 0 0 16px; padding: 16px; }
    h2 { margin: 0 0 8px; font-size: 18px; }
    p, li { font-size: 12px; line-height: 1.5; }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(projectSummary.name)}</h1>
    <p>Print-ready preview board companion. Binary PDF package generation is available through the local evidence script.</p>
  </header>
  ${cards}
</body>
</html>`
  };
}

export function sceneToPreviewDxf(objects: CadObjectFrame[], layers: LayerFrame[] = initialCadScene.layers): string {
  const layerNames = new Set(layers.map((layer) => normalizeDxfName(layer.id)));
  const entityRows = objects.flatMap((object) => objectToFootprintLines(object));
  const layerRows = [...layerNames]
    .map(
      (layer) => `0
LAYER
2
${layer}
70
0
62
7
6
CONTINUOUS`
    )
    .join("\n");

  return `0
SECTION
2
HEADER
9
$ACADVER
1
AC1009
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
70
${layerNames.size}
${layerRows}
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
${entityRows.join("\n")}
0
ENDSEC
0
EOF
`;
}

function objectToFootprintLines(object: CadObjectFrame): string[] {
  const [x, y, z] = object.position;
  const [width, height, depth] = object.scale;
  const layer = normalizeDxfName(object.layerId);
  const halfWidth = Math.max(width / 2, 0.05);
  const halfDepth = Math.max(depth / 2, 0.05);
  const baseY = y - height / 2;
  const topY = y + height / 2;
  const corners: Array<[number, number, number]> = [
    [x - halfWidth, z - halfDepth, baseY],
    [x + halfWidth, z - halfDepth, baseY],
    [x + halfWidth, z + halfDepth, baseY],
    [x - halfWidth, z + halfDepth, baseY]
  ];
  const topCorners = corners.map(([cx, cz]) => [cx, cz, topY] as [number, number, number]);
  const bottomEdges = corners.map((start, index) => lineEntity(layer, start, corners[(index + 1) % corners.length]));
  const topEdges = topCorners.map((start, index) => lineEntity(layer, start, topCorners[(index + 1) % topCorners.length]));
  const risers = corners.map((start, index) => lineEntity(layer, start, topCorners[index]));
  return [`999\n${sanitizeDxfText(object.label)} (${object.kind})`, ...bottomEdges, ...topEdges, ...risers];
}

function lineEntity(layer: string, start: [number, number, number], end: [number, number, number]): string {
  return `0
LINE
8
${layer}
10
${fmt(start[0])}
20
${fmt(start[1])}
30
${fmt(start[2])}
11
${fmt(end[0])}
21
${fmt(end[1])}
31
${fmt(end[2])}`;
}

function normalizeDxfName(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 31) || "default";
}

function sanitizeDxfText(value: string): string {
  return value.replace(/[\r\n]/g, " ").slice(0, 120);
}

function fmt(value: number): string {
  return Number.isFinite(value) ? value.toFixed(3) : "0.000";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
