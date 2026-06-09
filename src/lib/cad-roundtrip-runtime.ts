import { sceneToPreviewDxf } from "./export-runtime";
import type { CadObjectFrame, LayerFrame } from "./data-frames";

export type ParsedDxfLineEntity = {
  layer: string;
  start: [number, number, number];
  end: [number, number, number];
};

export type CadRoundTripSummary = {
  status: "READY";
  productionReady: false;
  previewDxf: "READY";
  nativeDwg: "BLOCKED";
  productionDxf: "BLOCKED";
  objectCount: number;
  lineEntityCount: number;
  layerCount: number;
};

export function createCadRoundTripSummary(objects: CadObjectFrame[], layers: LayerFrame[]): CadRoundTripSummary {
  const dxf = sceneToPreviewDxf(objects, layers);
  const lines = parsePreviewDxfLines(dxf);
  return {
    status: "READY",
    productionReady: false,
    previewDxf: "READY",
    nativeDwg: "BLOCKED",
    productionDxf: "BLOCKED",
    objectCount: objects.length,
    lineEntityCount: lines.length,
    layerCount: new Set(lines.map((line) => line.layer)).size
  };
}

export function parsePreviewDxfLines(dxf: string): ParsedDxfLineEntity[] {
  const rows = dxf.split(/\r?\n/);
  const entities: ParsedDxfLineEntity[] = [];
  for (let index = 0; index < rows.length; index += 1) {
    if (rows[index] !== "0" || rows[index + 1] !== "LINE") continue;
    const values = new Map<string, string>();
    for (let cursor = index + 2; cursor < rows.length; cursor += 2) {
      const code = rows[cursor];
      const value = rows[cursor + 1];
      if (code === "0") break;
      values.set(code, value);
    }
    entities.push({
      layer: values.get("8") ?? "default",
      start: [num(values.get("10")), num(values.get("20")), num(values.get("30"))],
      end: [num(values.get("11")), num(values.get("21")), num(values.get("31"))]
    });
  }
  return entities;
}

function num(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
