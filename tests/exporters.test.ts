import { describe, expect, it } from "vitest";
import { cadObjects, layers } from "@/lib/data-frames";
import {
  createBoqCsvExport,
  createHkdExport,
  createPlanSvgExport,
  createPreviewDxfExport,
  createPrintableBoardHtmlExport,
  createSceneJsonExport,
  parseHkd
} from "@/lib/export-runtime";
import { exportJobs } from "@/lib/data-frames";

describe("real exporters", () => {
  it("scene JSON export parses and contains objects", () => {
    const a = createSceneJsonExport(cadObjects);
    expect(a.mimeType).toBe("application/json");
    const parsed = JSON.parse(a.content) as { objects: unknown[] };
    expect(Array.isArray(parsed.objects)).toBe(true);
    expect(parsed.objects.length).toBe(cadObjects.length);
  });

  it("DXF export is a valid R12 structure with LINE entities and layers", () => {
    const dxf = createPreviewDxfExport(cadObjects, layers).content;
    expect(dxf).toContain("SECTION");
    expect(dxf).toContain("ENTITIES");
    expect(dxf).toContain("\nLINE\n");
    expect(dxf).toContain("AC1009"); // R12 version
    expect(dxf.trimEnd().endsWith("EOF")).toBe(true);
    // one footprint box = 12 LINE entities; 18 objects -> plenty
    const lineCount = (dxf.match(/\nLINE\n/g) ?? []).length;
    expect(lineCount).toBeGreaterThanOrEqual(cadObjects.length * 4);
  });

  it("BOQ CSV export has a header and grouped rows", () => {
    const a = createBoqCsvExport(cadObjects);
    expect(a.mimeType).toBe("text/csv");
    const rows = a.content.trim().split("\n");
    expect(rows[0]).toBe("Item,Layer,Material,Quantity,Unit");
    expect(rows.length).toBeGreaterThan(1);
    // quantities sum back to the placed object count
    const total = rows.slice(1).reduce((sum, line) => sum + Number(line.split(",")[3]), 0);
    expect(total).toBe(cadObjects.length);
  });

  it("2D plan SVG export is well-formed with footprint rects", () => {
    const a = createPlanSvgExport(cadObjects, layers);
    expect(a.mimeType).toBe("image/svg+xml");
    expect(a.content.trimStart().startsWith("<svg")).toBe(true);
    expect(a.content.trimEnd().endsWith("</svg>")).toBe(true);
    expect((a.content.match(/<rect/g) ?? []).length).toBeGreaterThan(cadObjects.length);
  });

  it("printable board HTML export is a full document", () => {
    const a = createPrintableBoardHtmlExport();
    expect(a.mimeType).toBe("text/html");
    expect(a.content).toContain("<!doctype html>");
  });

  it("HKD native export round-trips with an integrity checksum", () => {
    const a = createHkdExport(cadObjects, layers);
    expect(a.fileName.endsWith(".hkd")).toBe(true);
    const doc = parseHkd(a.content);
    expect(doc.magic).toBe("HKD");
    expect(doc.version).toBe(1);
    expect(doc.productionReady).toBe(false);
    expect(doc.objects.length).toBe(cadObjects.length);
    expect(doc.layers.length).toBe(layers.length);
  });

  it("HKD rejects a tampered file via checksum", () => {
    const a = createHkdExport(cadObjects, layers);
    const tampered = a.content.replace(/"units": "ft"/, '"units": "m"');
    expect(() => parseHkd(tampered)).toThrow(/checksum/i);
  });

  it("HKD rejects non-HKD input", () => {
    expect(() => parseHkd('{"hello":"world"}')).toThrow(/magic/i);
  });

  it("native DWG export stays BLOCKED; .hkd is the READY native format", () => {
    expect(exportJobs.find((j) => j.format === "dwg")?.status).toBe("BLOCKED");
    expect(exportJobs.find((j) => j.format === "hkd")?.status).toBe("READY");
  });
});
