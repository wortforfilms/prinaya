import { describe, expect, it } from "vitest";
import * as RS from "@/lib/surfaces/runtime-surfaces";
import type { SurfacePanel } from "@/lib/surfaces/runtime-surfaces";

const STATUSES = new Set(["READY", "PARTIAL", "BLOCKED"]);
const JUNK = /undefined|NaN|\[object|null/;

const builders = Object.entries(RS).filter(
  ([k, v]) => k.startsWith("build") && typeof v === "function"
) as [string, () => SurfacePanel][];

describe("all runtime surface builders", () => {
  it("exports the full set of builders", () => {
    expect(builders.length).toBeGreaterThanOrEqual(80);
  });

  it.each(builders)("%s returns a well-formed panel", (_name, build) => {
    const p = build();
    expect(p.title.trim().length).toBeGreaterThan(0);
    expect(p.subtitle.trim().length).toBeGreaterThan(0);
    expect(STATUSES.has(p.status)).toBe(true);
    expect(p.metrics.length).toBeGreaterThan(0);
    expect(p.sections.length).toBeGreaterThan(0);
    expect(p.kbsRefs.length).toBeGreaterThan(0);
    expect(p.links.length).toBeGreaterThan(0);
    expect(p.evidenceRef).toBeTruthy();

    for (const m of p.metrics) {
      expect(m.label.trim().length).toBeGreaterThan(0);
      expect(typeof m.value).toBe("string");
      expect(m.value.trim().length).toBeGreaterThan(0);
      expect(m.value).not.toMatch(JUNK);
    }

    for (const s of p.sections) {
      expect(s.title.trim().length).toBeGreaterThan(0);
      expect(s.rows.length).toBeGreaterThan(0);
      for (const r of s.rows) {
        expect(r.label.trim().length).toBeGreaterThan(0);
        if (r.status) expect(STATUSES.has(r.status)).toBe(true);
        if (r.value !== undefined) expect(r.value).not.toMatch(JUNK);
      }
    }

    for (const l of p.links) {
      expect(l.label.trim().length).toBeGreaterThan(0);
      expect(l.href.startsWith("/")).toBe(true);
    }
  });

  it("blocked panels carry explained blocker reasons", () => {
    for (const [name, build] of builders) {
      const p = build();
      if (p.status === "BLOCKED") {
        expect(p.blockers && p.blockers.length, `${name} BLOCKED needs blockers`).toBeTruthy();
      }
      for (const b of p.blockers ?? []) {
        expect(b.label.trim().length, name).toBeGreaterThan(0);
        expect(b.reason.trim().length, name).toBeGreaterThan(0);
      }
    }
  });

  it("are deterministic across calls", () => {
    for (const [name, build] of builders) {
      expect(JSON.stringify(build()), name).toBe(JSON.stringify(build()));
    }
  });

  it("are overwhelmingly READY with at least one preserved BLOCKED", () => {
    const ready = builders.filter(([, b]) => b().status === "READY").length;
    const blocked = builders.filter(([, b]) => b().status === "BLOCKED").length;
    expect(ready).toBeGreaterThanOrEqual(80);
    expect(blocked).toBeGreaterThanOrEqual(1);
    expect(builders.some(([, b]) => b().status === "PARTIAL")).toBe(false);
  });
});
