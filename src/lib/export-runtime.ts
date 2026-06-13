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

/**
 * .hkd — TLPS Heritage-CAD Data: the native wedding-CAD scene container.
 *
 * A documented, versioned, JSON-based envelope we fully own and round-trip:
 *   { magic:"HKD", version, generator, productionReady:false, project, units,
 *     layers[], objects[], checksum }
 * The checksum (FNV-1a/32 over {project,units,layers,objects}) guards integrity
 * on load. This is NOT DWG/DXF or a production CAD interchange format — native
 * DWG export remains BLOCKED; .hkd is our supported alternative.
 */
export const HKD_MAGIC = "HKD";
export const HKD_VERSION = 1;

function fnv1a(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export type HkdScene = {
  magic: string;
  version: number;
  generator: string;
  productionReady: false;
  note: string;
  project: string;
  units: string;
  layers: LayerFrame[];
  objects: CadObjectFrame[];
  checksum: string;
};

export function sceneToHkd(objects: CadObjectFrame[], layers: LayerFrame[]): string {
  const body = { project: projectSummary.id, units: "ft", layers, objects };
  const checksum = fnv1a(JSON.stringify(body));
  return JSON.stringify(
    {
      magic: HKD_MAGIC,
      version: HKD_VERSION,
      generator: "TLPS Wedding OS",
      productionReady: false,
      note: "Native TLPS heritage-CAD scene container. Round-trippable; not a DWG/DXF or production CAD format.",
      ...body,
      checksum
    },
    null,
    2
  );
}

export function parseHkd(text: string): HkdScene {
  let doc: HkdScene;
  try {
    doc = JSON.parse(text) as HkdScene;
  } catch {
    throw new Error("HKD: file is not valid JSON");
  }
  if (doc.magic !== HKD_MAGIC) throw new Error("HKD: bad magic (not an .hkd file)");
  if (doc.version !== HKD_VERSION) throw new Error(`HKD: unsupported version ${doc.version}`);
  if (!Array.isArray(doc.objects) || !Array.isArray(doc.layers)) throw new Error("HKD: missing layers/objects");
  const checksum = fnv1a(JSON.stringify({ project: doc.project, units: doc.units, layers: doc.layers, objects: doc.objects }));
  if (checksum !== doc.checksum) throw new Error("HKD: checksum mismatch (file corrupted or edited)");
  return doc;
}

export function createHkdExport(objects: CadObjectFrame[], layers: LayerFrame[]): ExportArtifact {
  return {
    fileName: `${projectSummary.id}.hkd`,
    mimeType: "application/x-hkd",
    content: sceneToHkd(objects, layers)
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

/** Bill of Quantities CSV — placed scene items grouped by kind/layer/material. */
export function createBoqCsvExport(objects: CadObjectFrame[]): ExportArtifact {
  const groups = new Map<string, { kind: string; layer: string; material: string; qty: number }>();
  for (const object of objects) {
    const key = `${object.kind}|${object.layerId}|${object.materialId ?? ""}`;
    const existing = groups.get(key);
    if (existing) existing.qty += 1;
    else groups.set(key, { kind: object.kind, layer: object.layerId, material: object.materialId ?? "", qty: 1 });
  }
  const rows = [...groups.values()].sort((a, b) => a.layer.localeCompare(b.layer) || a.kind.localeCompare(b.kind));
  const header = "Item,Layer,Material,Quantity,Unit";
  const body = rows.map((r) => [csv(r.kind), csv(r.layer), csv(r.material), String(r.qty), "ea"].join(",")).join("\n");
  return {
    fileName: `${projectSummary.id}-boq.csv`,
    mimeType: "text/csv",
    content: `${header}\n${body}\n`
  };
}

/** Top-view 2D plan as a real SVG — object footprints coloured by layer. */
export function createPlanSvgExport(objects: CadObjectFrame[], layers: LayerFrame[] = initialCadScene.layers): ExportArtifact {
  const layerColor = new Map(layers.map((layer) => [layer.id, layer.color]));
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const object of objects) {
    const [x, , z] = object.position;
    const [w, , d] = object.scale;
    minX = Math.min(minX, x - w / 2);
    maxX = Math.max(maxX, x + w / 2);
    minZ = Math.min(minZ, z - d / 2);
    maxZ = Math.max(maxZ, z + d / 2);
  }
  if (!Number.isFinite(minX)) {
    minX = 0;
    maxX = 1;
    minZ = 0;
    maxZ = 1;
  }
  const pad = 4;
  const scale = 12; // px per metre
  const width = (maxX - minX + pad * 2) * scale;
  const height = (maxZ - minZ + pad * 2) * scale;
  const shapes = objects
    .map((object) => {
      const [x, , z] = object.position;
      const [w, , d] = object.scale;
      const rx = (x - Math.max(w, 0.1) / 2 - minX + pad) * scale;
      const ry = (z - Math.max(d, 0.1) / 2 - minZ + pad) * scale;
      const rw = Math.max(w, 0.1) * scale;
      const rh = Math.max(d, 0.1) * scale;
      const color = layerColor.get(object.layerId) ?? "#9aa";
      return `<g><rect x="${fmt(rx)}" y="${fmt(ry)}" width="${fmt(rw)}" height="${fmt(rh)}" fill="${color}" fill-opacity="0.35" stroke="${color}" stroke-width="1"/><text x="${fmt(rx + rw / 2)}" y="${fmt(ry + rh / 2)}" fill="#f3ead4" font-size="9" text-anchor="middle" font-family="Arial">${escapeHtml(object.label)}</text></g>`;
    })
    .join("");
  const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(width)} ${fmt(height)}" width="${fmt(width)}" height="${fmt(height)}">
  <rect width="100%" height="100%" fill="#071010"/>
  <text x="10" y="18" fill="#d9aa46" font-size="13" font-family="Georgia, serif">${escapeHtml(projectSummary.name)} — Ground Floor Plan (preview)</text>
  ${shapes}
</svg>
`;
  return { fileName: `${projectSummary.id}-plan.svg`, mimeType: "image/svg+xml", content };
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

function csv(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
