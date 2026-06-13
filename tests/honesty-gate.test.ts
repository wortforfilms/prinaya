import { describe, expect, it } from "vitest";
import { releaseStatus, blockedCapabilities } from "@/lib/status";
import { budgetItems, vendors, droneZones, exportJobs } from "@/lib/data-frames";
import * as RS from "@/lib/surfaces/runtime-surfaces";
import type { SurfacePanel } from "@/lib/surfaces/runtime-surfaces";

const builders = Object.entries(RS).filter(
  ([k, v]) => k.startsWith("build") && typeof v === "function"
) as [string, () => SurfacePanel][];

describe("honesty / controlled-preview gate", () => {
  it("declares a controlled preview, never production", () => {
    expect(releaseStatus.verdict).toBe("CONTROLLED_PREVIEW_READY");
    expect(releaseStatus.productionReady).toBe(false);
  });

  it("preserves the hard blockers as BLOCKED", () => {
    const ids = new Set(blockedCapabilities.map((c) => c.id));
    const required = [
      "native-dwg-export", "production-dxf-export", "payments", "live-vendors",
      "marketplace-commerce", "structural-validation", "electrical-validation"
    ];
    for (const id of required) expect(ids.has(id), id).toBe(true);
    for (const c of blockedCapabilities) expect(c.status, c.id).toBe("BLOCKED");
  });

  it("keeps blocked data blocked in the data frames", () => {
    expect(budgetItems.find((b) => b.id === "budget-export-dwg")?.status).toBe("blocked");
    expect(vendors.find((v) => v.id === "vendor-marketplace")?.status).toBe("blocked-live");
    expect(droneZones[0].status).toBe("blocked-compliance");
    expect(exportJobs.find((e) => e.format === "dwg")?.status).toBe("BLOCKED");
  });

  it("never claims production readiness in any panel copy", () => {
    for (const [name, build] of builders) {
      const text = JSON.stringify(build()).toLowerCase();
      expect(text, name).not.toContain("production_ready=true");
      expect(text, name).not.toContain("production-ready");
    }
  });

  it("discloses the gap on surfaces that reference live-only capabilities", () => {
    const live =
      /payment|marketplace|live vendor|live booking|live drone|live flight|messaging gateway|live messaging|weather feed|weather api|live analytics|vr analytics|authentication|auth provider|purchase order/i;
    const disclosed = /not connected|blocked|preview|demo|no live|no external|no real|compliance/i;
    for (const [name, build] of builders) {
      const panel = build();
      const json = JSON.stringify(panel);
      if (live.test(json)) {
        const honest = disclosed.test(json) || Boolean(panel.blockers && panel.blockers.length);
        expect(honest, `${name} references a live capability without disclosure`).toBe(true);
      }
    }
  });
});
