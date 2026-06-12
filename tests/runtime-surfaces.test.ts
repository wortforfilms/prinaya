import { describe, expect, it } from "vitest";
import {
  buildContractManager,
  buildDeliveryManager,
  buildGraphExplorer,
  buildGuestTwin,
  buildHospitalityPlanner,
  buildMuhuratExplorer,
  buildNakshatraExplorer,
  buildProcurement,
  buildProductionTwin,
  buildRitualExplorer,
  buildRsvp,
  buildSeatingPlanner,
  buildShotPlanner,
  buildStoryboard,
  buildVendorManager,
  buildVendorTwin,
  buildVenueTwin,
  type SurfacePanel
} from "@/lib/surfaces/runtime-surfaces";

const builders: [string, () => SurfacePanel][] = [
  ["GraphExplorer", buildGraphExplorer],
  ["RitualExplorer", buildRitualExplorer],
  ["MuhuratExplorer", buildMuhuratExplorer],
  ["NakshatraExplorer", buildNakshatraExplorer],
  ["RSVP", buildRsvp],
  ["SeatingPlanner", buildSeatingPlanner],
  ["HospitalityPlanner", buildHospitalityPlanner],
  ["VendorManager", buildVendorManager],
  ["Procurement", buildProcurement],
  ["ContractManager", buildContractManager],
  ["Storyboard", buildStoryboard],
  ["ShotPlanner", buildShotPlanner],
  ["DeliveryManager", buildDeliveryManager],
  ["VenueTwin", buildVenueTwin],
  ["GuestTwin", buildGuestTwin],
  ["VendorTwin", buildVendorTwin],
  ["ProductionTwin", buildProductionTwin]
];

describe("runtime surface builders", () => {
  it.each(builders)("%s builds a populated panel", (_name, build) => {
    const panel = build();
    expect(panel.title).toBeTruthy();
    expect(panel.metrics.length).toBeGreaterThan(0);
    expect(panel.sections.length).toBeGreaterThan(0);
    expect(panel.sections.every((s) => s.rows.length > 0)).toBe(true);
    expect(panel.kbsRefs.length).toBeGreaterThan(0);
  });

  it("Contract Manager is honestly BLOCKED with reasons", () => {
    const panel = buildContractManager();
    expect(panel.status).toBe("BLOCKED");
    expect(panel.blockers && panel.blockers.length).toBeGreaterThan(0);
  });

  it("KBS explorers reflect the live graph (muhurat/nakshatra counts)", () => {
    expect(buildNakshatraExplorer().sections[0].rows.length).toBe(27);
    expect(buildMuhuratExplorer().sections[0].rows.length).toBeGreaterThanOrEqual(10);
  });
});
