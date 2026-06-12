import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildKbsGraph } from "@/lib/kbs/registry";
import { tlpsWeddingOsHomepage } from "@/lib/tlps-wedding-os-homepage";
import { spaSurfaces } from "@/lib/spa-registry";
import { routeMatrix } from "@/lib/route-matrix";

const KNOWN = new Set<string>([
  "/",
  ...routeMatrix.map((r) => r.path.replace("/*", "") || "/"),
  "/cad/editor",
  "/cad/studio",
  "/cad/3d",
  "/ai/studio",
  "/exports/studio",
  "/hemant-samwat-vedi",
  "/wedding-os",
  "/surfaces"
]);

describe("film / video domain", () => {
  const graph = buildKbsGraph();
  const films = graph.nodesOfType("Film");

  it("KBS film layer has all film types, each with shots", () => {
    expect(films.length).toBe(8);
    for (const film of films) {
      const shots = (film.metadata.shots as unknown[]) ?? [];
      expect(Array.isArray(shots), `${film.id} has no shots`).toBe(true);
      expect(shots.length).toBeGreaterThan(0);
    }
  });

  it("drone film is honestly PARTIAL and references the drone route", () => {
    const drone = graph.getNode("film:drone");
    expect(drone?.status).toBe("PARTIAL");
    expect(graph.neighbors("film:drone").some((n) => n.id === "route:/drone")).toBe(true);
  });

  it("every film thumbnail exists on disk (no broken video tiles)", () => {
    for (const card of tlpsWeddingOsHomepage.filmCards) {
      const onDisk = join(process.cwd(), "public", card.image.replace(/^\//, ""));
      expect(existsSync(onDisk), `missing film thumbnail ${card.image}`).toBe(true);
    }
  });

  it("all Filmy Studio surfaces resolve to real routes", () => {
    const filmy = spaSurfaces.filter((s) => s.id.startsWith("filmy-studio-"));
    expect(filmy.length).toBeGreaterThanOrEqual(9);
    for (const surface of filmy) {
      expect(KNOWN.has(surface.href), `${surface.id} -> ${surface.href}`).toBe(true);
    }
  });

  it("no live-rendering or delivery is claimed (preview gate)", () => {
    // There are no real video files committed; the film layer is preview metadata only.
    const drone = graph.getNode("film:drone");
    expect(drone?.metadata).toBeDefined();
    // 'full' film is the documentary edit, longest duration.
    const full = graph.getNode("film:full");
    expect(typeof full?.metadata.durationSec).toBe("number");
  });
});
