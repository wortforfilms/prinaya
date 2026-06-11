import { describe, expect, it } from "vitest";
import { KnowledgeGraph, normalizeNode, type KbsNode } from "@/lib/kbs/graph";
import { buildKbsGraph } from "@/lib/kbs/registry";
import { searchKbs } from "@/lib/kbs/search";
import { recommendForNode } from "@/lib/kbs/recommendations";
import { buildBoardComposerPanel, buildCopilotPanel, buildVediFinderPanel, buildVediIntelligence } from "@/lib/kbs/surfaces";

function node(id: string, partial: Partial<KbsNode> = {}): KbsNode {
  return normalizeNode({ id, type: partial.type ?? "Asset", name: partial.name ?? id, ...partial });
}

describe("KnowledgeGraph engine", () => {
  it("adds and retrieves nodes", () => {
    const g = new KnowledgeGraph([node("a"), node("b")]);
    expect(g.has("a")).toBe(true);
    expect(g.getNode("b")?.name).toBe("b");
    expect(g.nodes).toHaveLength(2);
  });

  it("throws on duplicate ids", () => {
    expect(() => new KnowledgeGraph([node("a"), node("a")])).toThrow(/duplicate/);
  });

  it("resolves outbound neighbours filtered by relation kind", () => {
    const g = new KnowledgeGraph([
      node("t", { type: "Template", relations: [{ kind: "uses", to: "a" }, { kind: "references", to: "b" }] }),
      node("a"),
      node("b")
    ]);
    expect(g.neighbors("t").map((n) => n.id).sort()).toEqual(["a", "b"]);
    expect(g.neighbors("t", "uses").map((n) => n.id)).toEqual(["a"]);
  });

  it("resolves inbound edges", () => {
    const g = new KnowledgeGraph([
      node("t", { relations: [{ kind: "uses", to: "a" }] }),
      node("a")
    ]);
    expect(g.inboundNodes("a").map((n) => n.id)).toEqual(["t"]);
    expect(g.inboundNodes("a", "references")).toHaveLength(0);
  });

  it("traverses to a given depth", () => {
    const g = new KnowledgeGraph([
      node("a", { relations: [{ kind: "uses", to: "b" }] }),
      node("b", { relations: [{ kind: "uses", to: "c" }] }),
      node("c")
    ]);
    expect(g.traverse("a", 1).map((n) => n.id)).toEqual(["b"]);
    expect(g.traverse("a", 2).map((n) => n.id).sort()).toEqual(["b", "c"]);
  });

  it("reports stats and flags dangling relations", () => {
    const g = new KnowledgeGraph([node("a", { relations: [{ kind: "uses", to: "missing" }] })]);
    const stats = g.stats();
    expect(stats.nodeCount).toBe(1);
    expect(stats.relationCount).toBe(1);
    expect(stats.danglingRelations).toBe(1);
    const issues = g.validate();
    expect(issues.some((i) => i.level === "warning" && /dangling/.test(i.message))).toBe(true);
  });
});

describe("KBS runtime graph (built from registries + curated layers)", () => {
  const graph = buildKbsGraph();
  const stats = graph.stats();

  it("assembles a non-trivial graph", () => {
    expect(stats.nodeCount).toBeGreaterThan(100);
    expect(stats.relationCount).toBeGreaterThan(100);
  });

  it("has no structural errors", () => {
    const errors = graph.validate().filter((i) => i.level === "error");
    expect(errors).toEqual([]);
  });

  it("represents every core entity layer", () => {
    for (const type of ["Asset", "Route", "UseCase", "Screen", "Template", "Board", "Material", "Ritual", "Vedi", "Film", "Vendor", "Nakshatra", "Tithi", "Muhurat", "Yoga", "Karana", "Paksha", "Rashi", "Graha"] as const) {
      expect(stats.byType[type] ?? 0, `expected ${type} nodes`).toBeGreaterThan(0);
    }
  });

  it("has the full panchanga knowledge (v2 targets)", () => {
    expect(stats.byType.Nakshatra).toBe(27);
    expect(stats.byType.Tithi).toBe(30);
    expect(stats.byType.Yoga).toBe(27);
    expect(stats.byType.Karana).toBe(11);
    expect(stats.byType.Paksha).toBe(2);
    expect(stats.byType.Rashi).toBe(12);
    expect(stats.byType.Graha).toBe(9);
  });

  it("meets the v2 scale targets (500+ nodes, 3000+ relations)", () => {
    expect(stats.nodeCount).toBeGreaterThanOrEqual(500);
    expect(stats.relationCount).toBeGreaterThanOrEqual(3000);
  });

  it("wires curated ritual -> vedi requirements", () => {
    const saptapadi = graph.getNode("ritual:saptapadi");
    expect(saptapadi).toBeDefined();
    expect(graph.neighbors("ritual:saptapadi", "requires").some((n) => n.type === "Vedi")).toBe(true);
  });

  it("searches by name", () => {
    const hits = searchKbs(graph, "mandap", { limit: 5 });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].score).toBeGreaterThan(0);
  });

  it("recommends complementary nodes for a mandap", () => {
    const mandap = graph.nodesOfType("Mandap")[0];
    expect(mandap).toBeDefined();
    const recs = recommendForNode(graph, mandap.id, 5);
    recs.forEach((rec) => {
      expect(rec.confidence).toBeGreaterThanOrEqual(0.5);
      expect(rec.confidence).toBeLessThanOrEqual(1);
      expect(rec.recommendation).not.toBe(mandap.id);
    });
  });
});

describe("KBS surfaces (AI Co-Pilot + Board Composer)", () => {
  it("builds an AI Co-Pilot panel with seeds and recommendations", () => {
    const panel = buildCopilotPanel("/ai");
    expect(panel.status).toBe("READY");
    expect(panel.seeds.length).toBeGreaterThan(0);
    panel.recommendations.forEach((rec) => {
      expect(rec.recommendation).toBeTruthy();
      expect(rec.confidence).toBeGreaterThanOrEqual(0.5);
    });
  });

  it("builds a Board Composer panel with board->template->asset reach", () => {
    const panel = buildBoardComposerPanel();
    expect(panel.boards.length).toBeGreaterThan(0);
    expect(panel.pipeline).toEqual(["Scene", "Render", "Board Composer", "PDF Package"]);
    expect(panel.assetCount).toBeGreaterThan(0);
    const totalLinkedTemplates = panel.boards.reduce((sum, board) => sum + board.linkedTemplates.length, 0);
    expect(totalLinkedTemplates).toBeGreaterThan(0);
  });

  it("builds a Vedi Finder panel with muhurat windows resolving nakshatra + tithi", () => {
    const panel = buildVediFinderPanel();
    expect(panel.vedis.length).toBeGreaterThan(0);
    expect(panel.auspiciousNakshatras.length).toBeGreaterThan(0);
    expect(panel.auspiciousTithis.length).toBeGreaterThan(0);
    expect(panel.topMuhurat).not.toBeNull();
    // At least one vedi has a muhurat window that resolved both a nakshatra and a tithi.
    const resolved = panel.vedis.flatMap((v) => v.muhurats).filter((m) => m.nakshatra && m.tithi);
    expect(resolved.length).toBeGreaterThan(0);
  });

  it("Board Composer exposes the canonical 17 pages", () => {
    const panel = buildBoardComposerPanel();
    expect(panel.boards).toHaveLength(17);
    expect(panel.boards.map((b) => b.title)).toEqual([
      "Cover", "Concept", "Venue", "Layout", "Mandap", "Vedi", "Ritual Flow", "Floral",
      "Lighting", "Budget", "Guest", "Vendor", "Production", "Drone", "VR", "Render Gallery", "Evidence"
    ]);
  });

  it("Co-Pilot produces categorized suggestion groups including Risk (blockers)", () => {
    const panel = buildCopilotPanel("/ai");
    const categories = panel.suggestions.map((g) => g.category);
    expect(categories).toContain("Mandap");
    expect(categories).toContain("Muhurat");
    expect(categories).toContain("Risk");
    const risk = panel.suggestions.find((g) => g.category === "Risk");
    expect(risk?.items.every((i) => i.status === "BLOCKED")).toBe(true);
  });

  it("Vedi Intelligence surface exposes full panchanga lookups + vastu grid", () => {
    const intel = buildVediIntelligence();
    expect(intel.nakshatras).toHaveLength(27);
    expect(intel.tithis).toHaveLength(30);
    expect(intel.vastuGrid).toHaveLength(9);
    expect(intel.muhurats.length).toBeGreaterThan(0);
  });
});
