/**
 * Runtime surface builders — real, data-backed panels for the KBS explorers,
 * Guest/Vendor runtimes, Filmy Studio, and Wedding Digital Twin. Every panel is
 * sourced from the KBS graph or data-frames. Honest statuses: genuinely blocked
 * capabilities (live vendor booking, contracts/payments) stay BLOCKED.
 */
import { kbs } from "../kbs/registry";
import {
  budgetItems,
  cadObjects,
  guestSections,
  lightingFixtures,
  mandapDimensions,
  seatingCapacity,
  stageDimensions,
  vendors,
  venueDimensions
} from "../data-frames";

export type SurfaceStatus = "READY" | "PARTIAL" | "BLOCKED";
export type SurfaceRow = { label: string; value?: string; sub?: string; status?: SurfaceStatus };
export type SurfaceSection = { title: string; rows: SurfaceRow[] };
export type SurfaceMetric = { label: string; value: string };
export type SurfaceLink = { label: string; href: string };
export type SurfacePanel = {
  title: string;
  subtitle: string;
  status: SurfaceStatus;
  metrics: SurfaceMetric[];
  sections: SurfaceSection[];
  kbsRefs: string[];
  links: SurfaceLink[];
  blockers?: { label: string; reason: string }[];
  note?: string;
  evidenceRef: string;
};

const EV = "release/evidence/kbs.json";
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ---------------------------------------------------------------- KBS explorers
export function buildGraphExplorer(): SurfacePanel {
  const g = kbs();
  const stats = g.stats();
  const types = Object.entries(stats.byType).sort((a, b) => b[1] - a[1]);
  return {
    title: "KBS Graph Explorer",
    subtitle: "Live knowledge graph — nodes, relations, and entity types.",
    status: "READY",
    metrics: [
      { label: "Nodes", value: stats.nodeCount.toLocaleString("en-IN") },
      { label: "Relations", value: stats.relationCount.toLocaleString("en-IN") },
      { label: "Entity types", value: String(types.length) },
      { label: "Dangling", value: String(stats.danglingRelations) }
    ],
    sections: [
      { title: "Nodes by entity type", rows: types.map(([type, count]) => ({ label: type, value: String(count) })) }
    ],
    kbsRefs: ["graph", "all entity types"],
    links: [
      { label: "Observatory", href: "/observatory" },
      { label: "Board Composer", href: "/exports" }
    ],
    evidenceRef: EV
  };
}

function explorerFromType(
  type: Parameters<ReturnType<typeof kbs>["nodesOfType"]>[0],
  title: string,
  subtitle: string,
  toRow: (node: ReturnType<ReturnType<typeof kbs>["nodesOfType"]>[number]) => SurfaceRow
): SurfacePanel {
  const g = kbs();
  const nodes = g.nodesOfType(type);
  return {
    title,
    subtitle,
    status: "READY",
    metrics: [{ label: title.split(" ")[0], value: String(nodes.length) }],
    sections: [{ title: `${nodes.length} ${type} nodes`, rows: nodes.map(toRow) }],
    kbsRefs: [type],
    links: [{ label: "Vedi Finder", href: "/hemant-samwat-vedi" }, { label: "Graph Explorer", href: "/kbs/graph" }],
    evidenceRef: EV
  };
}

export function buildRitualExplorer(): SurfacePanel {
  const g = kbs();
  return explorerFromType("Ritual", "Ritual Explorer", "Wedding ritual graph with vedi and muhurat links.", (n) => {
    const vedi = g.neighbors(n.id, "requires").find((x) => x.type === "Vedi");
    return { label: n.name, value: vedi ? vedi.name : "—", sub: n.description, status: n.status };
  });
}

export function buildMuhuratExplorer(): SurfacePanel {
  const g = kbs();
  const nodes = [...g.nodesOfType("Muhurat")].sort(
    (a, b) => (Number(b.metadata.score) || 0) - (Number(a.metadata.score) || 0)
  );
  return {
    title: "Muhurat Explorer",
    subtitle: "Wedding muhurat registry — windows scored by auspiciousness.",
    status: "READY",
    metrics: [{ label: "Muhurats", value: String(nodes.length) }],
    sections: [
      {
        title: `${nodes.length} muhurat windows`,
        rows: nodes.map((n) => {
          const nak = g.neighbors(n.id, "requires").find((x) => x.type === "Nakshatra");
          const tit = g.neighbors(n.id, "requires").find((x) => x.type === "Tithi");
          const score = Number(n.metadata.score) || 0;
          return {
            label: n.name,
            value: `${String(n.metadata.window ?? "")} · ${Math.round(score * 100)}%`,
            sub: [nak?.name, tit?.name].filter(Boolean).join(" · ")
          };
        })
      }
    ],
    kbsRefs: ["Muhurat", "Nakshatra", "Tithi", "Vedi"],
    links: [{ label: "Vedi Finder", href: "/hemant-samwat-vedi" }, { label: "Nakshatra Explorer", href: "/kbs/nakshatra" }],
    note: "Preview reference — not a certified panchang service.",
    evidenceRef: EV
  };
}

export function buildNakshatraExplorer(): SurfacePanel {
  return explorerFromType("Nakshatra", "Nakshatra Explorer", "27 nakshatras with graha lords and rashi spans.", (n) => ({
    label: n.name,
    value: `lord ${String(n.metadata.lord ?? "")}`,
    sub: `${String(n.metadata.primaryRashi ?? "")}${n.metadata.auspiciousForMarriage ? " · vivah" : ""}`
  }));
}

// ---------------------------------------------------------------- Guest runtime
export function buildRsvp(): SurfacePanel {
  const totalAssigned = guestSections.reduce((s, g) => s + g.assigned, 0);
  const totalCapacity = guestSections.reduce((s, g) => s + g.capacity, 0);
  return {
    title: "RSVP",
    subtitle: "Guest response tracking across seating sections.",
    status: "READY",
    metrics: [
      { label: "Confirmed", value: String(totalAssigned) },
      { label: "Capacity", value: String(totalCapacity) },
      { label: "Sections", value: String(guestSections.length) }
    ],
    sections: [
      {
        title: "By section",
        rows: guestSections.map((g) => ({ label: g.label, value: `${g.assigned}/${g.capacity} confirmed`, sub: g.notes }))
      }
    ],
    kbsRefs: ["Guest Planning"],
    links: [{ label: "Seating Planner", href: "/guests/seating" }, { label: "Guests", href: "/guests" }],
    evidenceRef: EV
  };
}

export function buildSeatingPlanner(): SurfacePanel {
  return {
    title: "Seating Planner",
    subtitle: "Seat allocation across VIP, family, general, and dining zones.",
    status: "READY",
    metrics: [
      { label: "Total seats", value: String(seatingCapacity.totalGuests) },
      { label: "VIP", value: String(seatingCapacity.vipSeats) },
      { label: "Dining", value: String(seatingCapacity.diningSeats) },
      { label: "Accessible", value: String(seatingCapacity.accessibleSeats) }
    ],
    sections: [
      {
        title: "Zones",
        rows: guestSections.map((g) => ({ label: g.label, value: `${g.capacity} seats`, sub: g.notes }))
      }
    ],
    kbsRefs: ["Guest Planning", "Seating"],
    links: [{ label: "RSVP", href: "/guests/rsvp" }, { label: "Layout", href: "/layouts" }],
    evidenceRef: EV
  };
}

export function buildHospitalityPlanner(): SurfacePanel {
  return {
    title: "Hospitality Planner",
    subtitle: "Accommodation, transport, and welcome logistics (preview).",
    status: "PARTIAL",
    metrics: [
      { label: "Guests", value: String(seatingCapacity.totalGuests) },
      { label: "VIP", value: String(seatingCapacity.vipSeats) }
    ],
    sections: [
      {
        title: "Hospitality desks",
        rows: [
          { label: "Accommodation", value: "room blocks", sub: "preview planning", status: "PARTIAL" },
          { label: "Transport", value: "airport + venue shuttles", sub: "preview planning", status: "PARTIAL" },
          { label: "Welcome desk", value: "check-in + kits", sub: "preview planning", status: "PARTIAL" },
          { label: "Concierge", value: "VIP support", sub: "preview planning", status: "PARTIAL" }
        ]
      }
    ],
    kbsRefs: ["Guest Planning"],
    links: [{ label: "Guests", href: "/guests" }],
    note: "Hospitality logistics are preview planning only; live bookings are not connected.",
    evidenceRef: EV
  };
}

// ---------------------------------------------------------------- Vendor runtime
export function buildVendorManager(): SurfacePanel {
  const g = kbs();
  const kbsVendors = g.nodesOfType("Vendor");
  return {
    title: "Vendor Manager",
    subtitle: "Demo vendor directory. Live booking and marketplace remain blocked.",
    status: "READY",
    metrics: [
      { label: "Vendors", value: String(vendors.length) },
      { label: "KBS vendor nodes", value: String(kbsVendors.length) }
    ],
    sections: [
      {
        title: "Directory (demo)",
        rows: vendors.map((v) => ({
          label: v.label,
          value: `${v.category} · ${v.city}`,
          status: v.status === "blocked-live" ? "BLOCKED" : "READY",
          sub: v.status === "blocked-live" ? "live marketplace blocked" : "demo vendor"
        }))
      }
    ],
    kbsRefs: ["Vendor"],
    links: [{ label: "Procurement", href: "/vendors/procurement" }, { label: "Contracts", href: "/vendors/contracts" }],
    note: "Vendor records are demo data; no live vendor API or booking flow exists.",
    evidenceRef: EV
  };
}

export function buildProcurement(): SurfacePanel {
  const total = budgetItems.reduce((s, b) => s + b.estimatedInr, 0);
  return {
    title: "Procurement",
    subtitle: "Budget-driven procurement preview. Purchase orders/payments blocked.",
    status: "PARTIAL",
    metrics: [
      { label: "Budget", value: inr(total) },
      { label: "Lines", value: String(budgetItems.length) }
    ],
    sections: [
      {
        title: "Procurement lines",
        rows: budgetItems.map((b) => ({
          label: b.label,
          value: b.status === "blocked" ? "BLOCKED" : inr(b.estimatedInr),
          sub: b.category,
          status: b.status === "blocked" ? "BLOCKED" : "PARTIAL"
        }))
      }
    ],
    kbsRefs: ["Vendor", "Production Planning"],
    links: [{ label: "Vendor Manager", href: "/vendors" }, { label: "Budget", href: "/budget" }],
    blockers: [{ label: "Purchase orders / payments", reason: "no payment processor or order runtime" }],
    note: "Estimates only; raising purchase orders and payments are blocked.",
    evidenceRef: EV
  };
}

export function buildContractManager(): SurfacePanel {
  return {
    title: "Contract Manager",
    subtitle: "Vendor contracts — blocked pending payments/legal evidence.",
    status: "BLOCKED",
    metrics: [{ label: "Vendors", value: String(vendors.length) }],
    sections: [
      {
        title: "Contract status",
        rows: vendors.map((v) => ({ label: v.label, value: "contract blocked", status: "BLOCKED", sub: v.category }))
      }
    ],
    kbsRefs: ["Vendor"],
    links: [{ label: "Vendor Manager", href: "/vendors" }],
    blockers: [
      { label: "Contract execution", reason: "no e-sign/legal runtime" },
      { label: "Payments", reason: "no payment processor" }
    ],
    note: "Contract creation, e-signing, and payments are blocked in this controlled preview.",
    evidenceRef: EV
  };
}

// ---------------------------------------------------------------- Filmy Studio
function filmShots() {
  const g = kbs();
  return g.nodesOfType("Film").map((f) => ({ name: f.name, status: f.status, shots: (f.metadata.shots as string[]) ?? [] }));
}

export function buildStoryboard(): SurfacePanel {
  const films = filmShots();
  const totalShots = films.reduce((s, f) => s + f.shots.length, 0);
  return {
    title: "Storyboard",
    subtitle: "Shot-by-shot storyboard derived from the film knowledge layer.",
    status: "READY",
    metrics: [
      { label: "Films", value: String(films.length) },
      { label: "Shots", value: String(totalShots) }
    ],
    sections: films.map((f) => ({
      title: f.name,
      rows: f.shots.map((shot, i) => ({ label: `Shot ${i + 1}`, value: shot.replace(/_/g, " ") }))
    })),
    kbsRefs: ["Film"],
    links: [{ label: "Shot Planner", href: "/filmy/shots" }, { label: "Gallery", href: "/gallery" }],
    evidenceRef: EV
  };
}

export function buildShotPlanner(): SurfacePanel {
  const films = filmShots();
  return {
    title: "Shot Planner",
    subtitle: "Plan and sequence shots per film deliverable.",
    status: "READY",
    metrics: [{ label: "Films", value: String(films.length) }, { label: "Shots", value: String(films.reduce((s, f) => s + f.shots.length, 0)) }],
    sections: [
      {
        title: "Films",
        rows: films.map((f) => ({ label: f.name, value: `${f.shots.length} shots`, status: f.status as SurfaceStatus }))
      }
    ],
    kbsRefs: ["Film"],
    links: [{ label: "Storyboard", href: "/filmy/storyboard" }, { label: "Drone", href: "/drone" }],
    evidenceRef: EV
  };
}

export function buildDeliveryManager(): SurfacePanel {
  const films = filmShots();
  return {
    title: "Delivery Manager",
    subtitle: "Film deliverable tracking (preview — no media rendering).",
    status: "PARTIAL",
    metrics: [{ label: "Deliverables", value: String(films.length) }],
    sections: [
      {
        title: "Deliverables",
        rows: films.map((f) => ({ label: f.name, value: "preview", sub: `${f.shots.length} planned shots`, status: "PARTIAL" }))
      }
    ],
    kbsRefs: ["Film"],
    links: [{ label: "Storyboard", href: "/filmy/storyboard" }, { label: "Exports", href: "/exports" }],
    note: "No real video files or rendering pipeline; deliverable tracking is preview metadata.",
    evidenceRef: EV
  };
}

// ---------------------------------------------------------------- Digital Twin
export function buildVenueTwin(): SurfacePanel {
  return {
    title: "Venue Twin",
    subtitle: "Preview digital twin of the venue envelope and mandap footprint.",
    status: "PARTIAL",
    metrics: [
      { label: "Venue", value: `${venueDimensions.lengthM}×${venueDimensions.widthM}m` },
      { label: "Clear height", value: `${venueDimensions.clearHeightM}m` },
      { label: "Entries", value: String(venueDimensions.entries) },
      { label: "Exits", value: String(venueDimensions.emergencyExits) }
    ],
    sections: [
      {
        title: "Structures",
        rows: [
          { label: "Mandap footprint", value: `${mandapDimensions.footprintM[0]}×${mandapDimensions.footprintM[2]}m`, sub: `${mandapDimensions.pillarCount} pillars` },
          { label: "Stage", value: `${stageDimensions.widthM}×${stageDimensions.depthM}m` },
          { label: "Parking blocks", value: String(venueDimensions.parkingBlocks) }
        ]
      }
    ],
    kbsRefs: ["Venue", "Mandap", "Stage"],
    links: [{ label: "Venue Designer", href: "/venue-designer" }, { label: "3D Designer", href: "/cad/3d" }],
    note: "Preview spatial twin from local scene data; not a live sensor/IoT twin.",
    evidenceRef: EV
  };
}

export function buildGuestTwin(): SurfacePanel {
  const assigned = guestSections.reduce((s, g) => s + g.assigned, 0);
  return {
    title: "Guest Twin",
    subtitle: "Aggregated guest model across sections and capacity.",
    status: "PARTIAL",
    metrics: [
      { label: "Capacity", value: String(seatingCapacity.totalGuests) },
      { label: "Confirmed", value: String(assigned) },
      { label: "Sections", value: String(guestSections.length) }
    ],
    sections: [
      { title: "Sections", rows: guestSections.map((g) => ({ label: g.label, value: `${g.assigned}/${g.capacity}` })) }
    ],
    kbsRefs: ["Guest Planning", "Seating"],
    links: [{ label: "RSVP", href: "/guests/rsvp" }, { label: "Seating", href: "/guests/seating" }],
    evidenceRef: EV
  };
}

export function buildVendorTwin(): SurfacePanel {
  const g = kbs();
  return {
    title: "Vendor Twin",
    subtitle: "Aggregated vendor model (demo data).",
    status: "PARTIAL",
    metrics: [
      { label: "Vendors", value: String(vendors.length) },
      { label: "KBS nodes", value: String(g.nodesOfType("Vendor").length) }
    ],
    sections: [
      { title: "Vendors", rows: vendors.map((v) => ({ label: v.label, value: v.category, sub: v.city, status: v.status === "blocked-live" ? "BLOCKED" : "PARTIAL" })) }
    ],
    kbsRefs: ["Vendor"],
    links: [{ label: "Vendor Manager", href: "/vendors" }],
    note: "Demo vendors only; live vendor network blocked.",
    evidenceRef: EV
  };
}

export function buildProductionTwin(): SurfacePanel {
  const totalBudget = budgetItems.reduce((s, b) => s + b.estimatedInr, 0);
  const fixtures = lightingFixtures.reduce((s, f) => s + f.count, 0);
  return {
    title: "Production Twin",
    subtitle: "Aggregated production model — scene, lighting, budget.",
    status: "PARTIAL",
    metrics: [
      { label: "CAD objects", value: String(cadObjects.length) },
      { label: "Light fixtures", value: String(fixtures) },
      { label: "Budget", value: inr(totalBudget) }
    ],
    sections: [
      { title: "Lighting", rows: lightingFixtures.map((f) => ({ label: f.label, value: `${f.count} × ${f.colorTemperatureK}K`, sub: f.type })) }
    ],
    kbsRefs: ["Lighting", "Production Planning"],
    links: [{ label: "Production", href: "/production" }, { label: "Lighting", href: "/lighting" }],
    note: "Preview production model from local data; not a live execution twin.",
    evidenceRef: EV
  };
}
