import { describe, expect, it } from "vitest";
import { kbs } from "@/lib/kbs/registry";

const g = kbs();
const stats = g.stats();
type EntityType = Parameters<typeof g.nodesOfType>[0];

describe("KBS graph integrity", () => {
  it("is a substantial, well-connected graph", () => {
    expect(stats.nodeCount).toBeGreaterThan(1000);
    expect(stats.relationCount).toBeGreaterThan(stats.nodeCount);
  });

  it("has zero dangling relations", () => {
    expect(stats.danglingRelations).toBe(0);
  });

  it("validate() reports no errors", () => {
    const errors = g.validate().filter((i) => i.level === "error");
    expect(errors).toEqual([]);
  });

  it("has unique, resolvable node ids", () => {
    const ids = g.nodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const n of g.nodes) expect(g.getNode(n.id)).toBe(n);
  });

  it("points every relation at an existing node", () => {
    for (const n of g.nodes) {
      for (const r of n.relations) {
        expect(g.has(r.to), `${n.id} -> ${r.to}`).toBe(true);
      }
    }
  });

  it("populates the panchanga and asset entity types", () => {
    const minimums: Record<string, number> = {
      Nakshatra: 27, Tithi: 30, Yoga: 27, Karana: 11, Graha: 9, Rashi: 12,
      Muhurat: 10, Ritual: 6, Vedi: 2, Mandap: 20, Asset: 100, Film: 8
    };
    for (const [type, min] of Object.entries(minimums)) {
      expect(g.nodesOfType(type as EntityType).length, type).toBeGreaterThanOrEqual(min);
    }
  });

  it("gives every node a name and a valid status", () => {
    const valid = new Set(["READY", "PARTIAL", "BLOCKED"]);
    for (const n of g.nodes) {
      expect(n.name.trim().length, n.id).toBeGreaterThan(0);
      expect(valid.has(n.status), n.id).toBe(true);
    }
  });

  it("matches the byType totals to the node count", () => {
    const sum = Object.values(stats.byType).reduce((a, b) => a + b, 0);
    expect(sum).toBe(stats.nodeCount);
  });
});
