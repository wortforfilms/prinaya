import {
  cadObjects,
  lightingFixtures,
  mandapDimensions,
  seatingCapacity,
  stageDimensions,
  venueDimensions
} from "./data-frames";

export type ComplianceDomain = "structural" | "electrical" | "fire";
export type ComplianceFindingSeverity = "PASS" | "WARNING" | "FAIL";

export type ComplianceFinding = {
  id: string;
  domain: ComplianceDomain;
  severity: ComplianceFindingSeverity;
  label: string;
  evidence: string;
};

export type ComplianceValidationReport = {
  domain: ComplianceDomain;
  status: "READY";
  certified: false;
  verdict: "PASS" | "REVIEW_REQUIRED";
  findings: ComplianceFinding[];
  blocker: string;
};

const wattsByFixtureType: Record<string, number> = {
  chandelier: 1200,
  spot: 450,
  wash: 650,
  truss: 300,
  path: 75,
  led: 220
};

export const structuralComplianceReport = validateStructuralCompliance();
export const electricalComplianceReport = validateElectricalCompliance();
export const fireSafetyComplianceReport = validateFireSafetyCompliance();

export const complianceRuntimeSummary = {
  status: "READY" as const,
  productionReady: false,
  certified: false,
  validators: 3,
  domains: ["structural", "electrical", "fire"] as ComplianceDomain[],
  reviewRequired: [structuralComplianceReport, electricalComplianceReport, fireSafetyComplianceReport].filter(
    (report) => report.verdict === "REVIEW_REQUIRED"
  ).length,
  blocker:
    "Local rule-based validators are implemented for preview review. Certified structural, electrical, fire, and engineering compliance remains BLOCKED."
};

export function validateStructuralCompliance(): ComplianceValidationReport {
  const pillarObjects = cadObjects.filter((object) => object.kind === "pillar");
  const trussObjects = cadObjects.filter((object) => object.kind === "truss");
  const findings: ComplianceFinding[] = [
    finding(
      "structural-mandap-pillars",
      "structural",
      mandapDimensions.pillarCount >= 4 ? "PASS" : "FAIL",
      "Mandap pillar count",
      `${mandapDimensions.pillarCount} mandap pillars declared; ${pillarObjects.length} pillar preview object groups in scene.`
    ),
    finding(
      "structural-stage-height",
      "structural",
      stageDimensions.heightM <= 1.5 ? "PASS" : "WARNING",
      "Stage deck height",
      `${stageDimensions.heightM}m stage height checked against local 1.5m preview threshold.`
    ),
    finding(
      "structural-truss-span",
      "structural",
      trussObjects.every((object) => object.scale[0] <= 24) ? "PASS" : "WARNING",
      "Truss span preview",
      `${trussObjects.length} truss object(s), max span ${Math.max(...trussObjects.map((object) => object.scale[0]), 0)}m.`
    ),
    finding(
      "structural-certified-calcs",
      "structural",
      "FAIL",
      "Certified structural calculations",
      "No stamped load, wind, ballast, anchoring, or temporary-structure engineering certificate exists."
    )
  ];
  return report("structural", findings, "Certified structural validation remains BLOCKED.");
}

export function validateElectricalCompliance(): ComplianceValidationReport {
  const totalWatts = lightingFixtures.reduce((sum, fixture) => sum + fixture.count * (wattsByFixtureType[fixture.type] ?? 250), 0);
  const totalAmpsAt240V = Math.ceil(totalWatts / 240);
  const findings: ComplianceFinding[] = [
    finding(
      "electrical-load-schedule",
      "electrical",
      totalWatts <= 48000 ? "PASS" : "WARNING",
      "Preview load schedule",
      `${lightingFixtures.length} fixture families, ${totalWatts}W estimated local preview load, ${totalAmpsAt240V}A at 240V.`
    ),
    finding(
      "electrical-emergency-circuits",
      "electrical",
      venueDimensions.emergencyExits >= 4 ? "PASS" : "WARNING",
      "Emergency lighting coverage",
      `${venueDimensions.emergencyExits} emergency exits available for emergency-light planning.`
    ),
    finding(
      "electrical-certified-safety",
      "electrical",
      "FAIL",
      "Certified electrical safety",
      "No licensed electrical load schedule, phase balancing, cabling, earthing, generator sizing, or inspection certificate exists."
    )
  ];
  return report("electrical", findings, "Certified electrical validation remains BLOCKED.");
}

export function validateFireSafetyCompliance(): ComplianceValidationReport {
  const exitCapacityProxy = venueDimensions.emergencyExits * 120;
  const findings: ComplianceFinding[] = [
    finding(
      "fire-exit-capacity",
      "fire",
      exitCapacityProxy >= seatingCapacity.totalGuests ? "PASS" : "WARNING",
      "Exit capacity proxy",
      `${venueDimensions.emergencyExits} exits x 120 preview capacity = ${exitCapacityProxy} for ${seatingCapacity.totalGuests} guests.`
    ),
    finding(
      "fire-accessible-seating",
      "fire",
      seatingCapacity.accessibleSeats >= 20 ? "PASS" : "WARNING",
      "Accessible and clear seating",
      `${seatingCapacity.accessibleSeats} accessible seats reserved in preview seating data.`
    ),
    finding(
      "fire-material-certificates",
      "fire",
      "FAIL",
      "Flame-retardant certificates",
      "No flame-retardant fabric, extinguisher placement, evacuation-width, or authority approval evidence exists."
    )
  ];
  return report("fire", findings, "Certified fire safety validation remains BLOCKED.");
}

function report(domain: ComplianceDomain, findings: ComplianceFinding[], blocker: string): ComplianceValidationReport {
  return {
    domain,
    status: "READY",
    certified: false,
    verdict: findings.some((item) => item.severity === "FAIL" || item.severity === "WARNING") ? "REVIEW_REQUIRED" : "PASS",
    findings,
    blocker
  };
}

function finding(
  id: string,
  domain: ComplianceDomain,
  severity: ComplianceFindingSeverity,
  label: string,
  evidence: string
): ComplianceFinding {
  return { id, domain, severity, label, evidence };
}
