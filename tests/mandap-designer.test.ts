import { describe, expect, it } from "vitest";
import { buildMandapDesigner } from "@/lib/mandap-designer";

describe("mandap designer data", () => {
  const m = buildMandapDesigner();

  it("stays inside the preview gate", () => {
    expect(m.status).toBe("READY");
    expect(m.verdict).toBe("CONTROLLED_PREVIEW_READY");
    expect(m.productionReady).toBe(false);
  });

  it("exposes 8 KPIs with preview scores flagged", () => {
    expect(m.kpis).toHaveLength(8);
    expect(m.kpis.find((k) => k.label === "Vastu Score")?.preview).toBe(true);
    expect(m.kpis.find((k) => k.label === "Est. Mandap Cost")?.preview).toBe(true);
  });

  it("builds component galleries from the asset registry", () => {
    expect(m.galleries).toHaveLength(6);
    m.galleries.forEach((g) => {
      expect(g.total).toBeGreaterThan(0);
      expect(g.items.length).toBeGreaterThan(0);
    });
  });

  it("keeps native DWG and production DXF exports BLOCKED", () => {
    const dwg = m.exports.find((e) => e.label === "Native DWG");
    const dxf = m.exports.find((e) => e.label === "Production DXF");
    expect(dwg?.status).toBe("BLOCKED");
    expect(dxf?.status).toBe("BLOCKED");
    // at least one real preview export is available
    expect(m.exports.some((e) => e.status === "READY")).toBe(true);
  });

  it("totals the cost from budget items", () => {
    expect(m.costTotalInr).toBe(m.costRows.reduce((sum, r) => sum + r.amountInr, 0));
    expect(m.costTotalInr).toBeGreaterThan(0);
  });

  it("surfaces rituals/vastu and real specs", () => {
    expect(m.ritualsVastu.length).toBeGreaterThan(0);
    expect(m.specs.find((s) => s.label === "Footprint")?.value).toContain("m");
    expect(m.materials.length).toBeGreaterThan(0);
    expect(m.templates.length).toBeGreaterThan(0);
  });
});
