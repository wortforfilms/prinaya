export type CapabilityStatus = "READY" | "PARTIAL" | "BLOCKED";

export type ReleaseVerdict = "CONTROLLED_PREVIEW_READY" | "PRODUCTION_READY" | "BLOCKED";

export const releaseStatus = {
  verdict: "CONTROLLED_PREVIEW_READY" as ReleaseVerdict,
  productionReady: false,
  reason:
    "Preview routes, unified premium layout/theme, UI frames, typed demo data, local runtime coverage, schema, seed data, verifier scripts, CAD runtime, local GLB meshes, PDF board package, board composer, template runtime, production planning frames, local compliance validators, and preview export artifacts are present. Production claims remain blocked without live vendor, payment, certified engineering compliance, certified structural/electrical/fire validation, and native DWG/production DXF evidence."
};

export const statusCopy: Record<CapabilityStatus, string> = {
  READY: "Preview-ready frame with demo data and local runtime coverage.",
  PARTIAL: "Usable scaffold exists, but production integrations or deeper workflow logic are pending.",
  BLOCKED: "Clearly unavailable until real implementation and evidence are added."
};

export const blockedCapabilities = [
  {
    id: "native-dwg-export",
    label: "Native DWG export",
    status: "BLOCKED" as CapabilityStatus,
    reason: "No native DWG writer, round-trip compatibility, AutoCAD validation, or DWG fixture evidence exists."
  },
  {
    id: "production-dxf-export",
    label: "Production DXF export",
    status: "BLOCKED" as CapabilityStatus,
    reason: "Preview ASCII DXF footprint export exists. Production DXF with layers, dimensions, units, blocks, title sheets, and CAD QA evidence is not implemented."
  },
  {
    id: "payments",
    label: "Payments",
    status: "BLOCKED" as CapabilityStatus,
    reason: "No payment processor credentials, checkout runtime, or transaction evidence exists."
  },
  {
    id: "live-vendors",
    label: "Live vendor network",
    status: "BLOCKED" as CapabilityStatus,
    reason: "Vendor records are seeded demo data; no live marketplace or vendor API is connected."
  },
  {
    id: "marketplace-commerce",
    label: "Marketplace commerce",
    status: "BLOCKED" as CapabilityStatus,
    reason: "Marketplace pages are preview shells without live listing, order, fulfillment, or seller flows."
  },
  {
    id: "structural-validation",
    label: "Structural validation",
    status: "BLOCKED" as CapabilityStatus,
    reason: "Local preview checks exist, but no stamped load, wind, truss, rigging, anchoring, or temporary-structure safety certification exists."
  },
  {
    id: "electrical-validation",
    label: "Electrical validation",
    status: "BLOCKED" as CapabilityStatus,
    reason: "Local preview checks exist, but no licensed load schedule, phase balancing, cabling, earthing, generator sizing, or certified electrical safety evidence exists."
  },
  {
    id: "fire-safety-validation",
    label: "Fire safety validation",
    status: "BLOCKED" as CapabilityStatus,
    reason: "Local preview checks exist, but no certified fire exit, extinguisher, flame-retardant material, evacuation-width, or authority approval evidence exists."
  },
  {
    id: "engineering-compliance",
    label: "Engineering compliance",
    status: "BLOCKED" as CapabilityStatus,
    reason: "Local validators are not a municipal, engineering, accessibility, fire, electrical, or venue-authority compliance signoff."
  }
];
