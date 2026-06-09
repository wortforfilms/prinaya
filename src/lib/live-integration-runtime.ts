export type LiveIntegrationKind = "payments" | "vendors" | "marketplace";

export type LiveIntegrationGate = {
  id: LiveIntegrationKind;
  label: string;
  status: "BLOCKED";
  requiredEvidence: string[];
  reason: string;
};

export const liveIntegrationGates: LiveIntegrationGate[] = [
  {
    id: "payments",
    label: "Payments",
    status: "BLOCKED",
    requiredEvidence: ["payment provider credentials", "checkout session creation", "webhook signature verification", "test transaction receipt"],
    reason: "No payment provider credentials, checkout runtime, webhook verification, or transaction evidence exists in this repo."
  },
  {
    id: "vendors",
    label: "Live vendor network",
    status: "BLOCKED",
    requiredEvidence: ["vendor API base URL", "authenticated vendor sync", "booking/availability response", "audit log"],
    reason: "Vendor data is local demo data only; no live vendor API or booking flow is configured."
  },
  {
    id: "marketplace",
    label: "Marketplace commerce",
    status: "BLOCKED",
    requiredEvidence: ["seller account evidence", "live listing sync", "order creation", "fulfillment or payout event"],
    reason: "Marketplace route is a preview shell; no live listing, order, seller, fulfillment, or payout runtime exists."
  }
];

export const liveIntegrationSummary = {
  status: "BLOCKED" as const,
  productionReady: false,
  gates: liveIntegrationGates.length,
  blocked: liveIntegrationGates.filter((gate) => gate.status === "BLOCKED").length,
  note: "Real vendor, payment, and marketplace integrations are allowed only when provider/API evidence is present."
};
