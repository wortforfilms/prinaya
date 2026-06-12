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
  observatoryEvents,
  projectSummary,
  seatingCapacity,
  stageDimensions,
  vendors,
  venueDimensions
} from "../data-frames";
import { productionRuntime, productionRuntimeSummary } from "../production-runtime";
import { blockedCapabilities } from "../status";

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
  activeSteps?: string[];
  useCases?: string[];
  runtimeCoverage?: number;
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

// ---------------------------------------------------------------- KBS explorer batch
const ASSET_TYPES = new Set(["Asset", "Mandap", "Floral", "Lighting", "Venue", "Stage"]);

function ucGroup(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("guest")) return "Guest";
  if (c.includes("vendor")) return "Vendor";
  if (c.includes("production") || c.includes("venue zones") || c.includes("utilities")) return "Production";
  if (c.includes("drone") || c.includes("vr") || c.includes("ai outputs")) return "Filmy Studio";
  if (c.includes("board") || c.includes("template")) return "Board";
  return "Design";
}

export function buildTemplatesExplorer(): SurfacePanel {
  const g = kbs();
  const templates = g.nodesOfType("Template");
  const assetReach = (id: string) => g.neighbors(id, "uses").filter((n) => ASSET_TYPES.has(n.type)).length;
  const boardReach = (id: string) => g.neighbors(id, "references").filter((n) => n.type === "Board").length;
  return {
    title: "Template Explorer",
    subtitle: "Runtime templates and the assets, boards, and use cases they bind.",
    status: "READY",
    metrics: [
      { label: "Templates", value: String(templates.length) },
      { label: "Bound assets", value: String(templates.reduce((s, t) => s + assetReach(t.id), 0)) },
      { label: "Board refs", value: String(templates.reduce((s, t) => s + boardReach(t.id), 0)) }
    ],
    sections: [
      {
        title: "Templates",
        rows: templates.map((t) => ({
          label: t.name,
          value: `${assetReach(t.id)} assets · ${boardReach(t.id)} boards`,
          sub: `use cases referencing: ${g.inboundNodes(t.id, "references").filter((n) => n.type === "UseCase").length}`
        }))
      }
    ],
    activeSteps: ["Pick template", "Bind assets", "Compose boards", "Link use cases", "Preview", "Export"],
    useCases: ["Template browsing", "Asset binding", "Board composition"],
    runtimeCoverage: templates.length,
    kbsRefs: ["Template", "Asset", "Board", "UseCase"],
    links: [{ label: "Templates", href: "/templates" }, { label: "Board Explorer", href: "/kbs/boards" }, { label: "Graph", href: "/kbs/graph" }],
    evidenceRef: EV
  };
}

export function buildUseCasesExplorer(): SurfacePanel {
  const g = kbs();
  const useCases = g.nodesOfType("UseCase");
  const groups = new Map<string, number>();
  for (const uc of useCases) groups.set(ucGroup(uc.category), (groups.get(ucGroup(uc.category)) ?? 0) + 1);
  const assetRefs = useCases.reduce((s, uc) => s + g.neighbors(uc.id, "references").filter((n) => ASSET_TYPES.has(n.type)).length, 0);
  const screenRefs = useCases.reduce((s, uc) => s + g.neighbors(uc.id, "references").filter((n) => n.type === "Screen").length, 0);
  return {
    title: "Use Case Explorer",
    subtitle: "Use cases grouped by domain, with asset, screen, and step links.",
    status: "READY",
    metrics: [
      { label: "Use cases", value: String(useCases.length) },
      { label: "Asset refs", value: String(assetRefs) },
      { label: "Screen refs", value: String(screenRefs) },
      { label: "Groups", value: String(groups.size) }
    ],
    sections: [
      {
        title: "By group",
        rows: [...groups.entries()].sort((a, b) => b[1] - a[1]).map(([group, count]) => ({ label: group, value: String(count) }))
      }
    ],
    activeSteps: ["Browse group", "Open use case", "Review steps", "Inspect assets", "Inspect screens", "Compose board"],
    useCases: ["Use-case discovery", "Coverage audit"],
    runtimeCoverage: useCases.length,
    kbsRefs: ["UseCase", "Asset", "Screen", "Template", "Board"],
    links: [{ label: "Features", href: "/features" }, { label: "Screen Explorer", href: "/kbs/screens" }],
    evidenceRef: EV
  };
}

export function buildScreensExplorer(): SurfacePanel {
  const g = kbs();
  const screens = g.nodesOfType("Screen");
  const byRoute = new Map<string, number>();
  for (const s of screens) {
    const route = String(s.metadata.route ?? "—");
    byRoute.set(route, (byRoute.get(route) ?? 0) + 1);
  }
  return {
    title: "Screen Explorer",
    subtitle: "Preview screens grouped by route, linked to use cases and assets.",
    status: "READY",
    metrics: [
      { label: "Screens", value: String(screens.length) },
      { label: "Routes", value: String(byRoute.size) }
    ],
    sections: [
      {
        title: "By route",
        rows: [...byRoute.entries()].sort((a, b) => b[1] - a[1]).map(([route, count]) => ({ label: route, value: `${count} screens` }))
      }
    ],
    activeSteps: ["Pick route", "Open screen", "Trace use case", "Inspect assets", "Verify evidence"],
    useCases: ["Screen discovery", "Route coverage"],
    runtimeCoverage: screens.length,
    kbsRefs: ["Screen", "Route", "UseCase"],
    links: [{ label: "Gallery", href: "/gallery" }, { label: "Use Case Explorer", href: "/kbs/usecases" }],
    evidenceRef: EV
  };
}

export function buildBoardsExplorer(): SurfacePanel {
  const g = kbs();
  const boards = g.nodesOfType("Board");
  const templateReach = (id: string) =>
    [...g.neighbors(id, "references"), ...g.inboundNodes(id, "references")].filter((n) => n.type === "Template").length;
  return {
    title: "Board Explorer",
    subtitle: "Board pages and the templates and assets connected to each.",
    status: "READY",
    metrics: [
      { label: "Board nodes", value: String(boards.length) },
      { label: "Template links", value: String(boards.reduce((s, b) => s + templateReach(b.id), 0)) }
    ],
    sections: [
      {
        title: "Boards",
        rows: boards.map((b) => ({
          label: b.name,
          value: `${templateReach(b.id)} template(s)`,
          sub: String(b.metadata.source ?? ""),
          status: b.status
        }))
      }
    ],
    activeSteps: ["Open board", "Bind template", "Pull assets", "Arrange page", "Export package"],
    useCases: ["Board composition", "Asset binding"],
    runtimeCoverage: boards.length,
    kbsRefs: ["Board", "Template", "Asset"],
    links: [{ label: "Board Composer", href: "/exports/studio" }, { label: "Template Explorer", href: "/kbs/templates" }],
    evidenceRef: EV
  };
}

export function buildVendorsExplorer(): SurfacePanel {
  const g = kbs();
  const vendorNodes = g.nodesOfType("Vendor");
  const byCategory = new Map<string, number>();
  for (const v of [...vendorNodes.map((n) => n.category), ...vendors.map((v) => v.category)]) {
    byCategory.set(v, (byCategory.get(v) ?? 0) + 1);
  }
  return {
    title: "Vendor Explorer",
    subtitle: "Vendor knowledge by category. Payments, contracts, invoices stay blocked.",
    status: "READY",
    metrics: [
      { label: "KBS vendors", value: String(vendorNodes.length) },
      { label: "Demo vendors", value: String(vendors.length) },
      { label: "Categories", value: String(byCategory.size) }
    ],
    sections: [
      {
        title: "By category",
        rows: [...byCategory.entries()].map(([cat, count]) => ({ label: cat, value: `${count} vendor(s)` }))
      }
    ],
    activeSteps: ["Browse category", "Open vendor", "Link to assets", "Attach to use case"],
    useCases: ["Vendor discovery (preview)", "Category mapping"],
    runtimeCoverage: vendorNodes.length + vendors.length,
    kbsRefs: ["Vendor"],
    links: [{ label: "Vendor Manager", href: "/vendors/manager" }],
    blockers: [
      { label: "Payments", reason: "no payment processor" },
      { label: "Contracts / invoices", reason: "no contract/e-sign runtime" },
      { label: "Live vendor network", reason: "demo vendors only" }
    ],
    note: "Vendor knowledge is demo/preview; payments, contracts, and invoices are not exposed.",
    evidenceRef: EV
  };
}

export function buildFilmsExplorer(): SurfacePanel {
  const g = kbs();
  const films = g.nodesOfType("Film");
  const totalShots = films.reduce((s, f) => s + (((f.metadata.shots as string[]) ?? []).length), 0);
  return {
    title: "Film Explorer",
    subtitle: "Film types with shots, durations, and deliverable links.",
    status: "READY",
    metrics: [
      { label: "Films", value: String(films.length) },
      { label: "Shots", value: String(totalShots) }
    ],
    sections: [
      {
        title: "Films",
        rows: films.map((f) => ({
          label: f.name,
          value: `${((f.metadata.shots as string[]) ?? []).length} shots`,
          sub: f.metadata.durationSec ? `${Number(f.metadata.durationSec)}s` : undefined,
          status: f.status
        }))
      }
    ],
    activeSteps: ["Pick film type", "Plan shots", "Build storyboard", "Track delivery"],
    useCases: ["Film planning", "Shot discovery"],
    runtimeCoverage: films.length,
    kbsRefs: ["Film"],
    links: [{ label: "Storyboard", href: "/filmy/storyboard" }, { label: "Shot Planner", href: "/filmy/shots" }],
    note: "No real video files; film layer is preview metadata.",
    evidenceRef: EV
  };
}

// ---------------------------------------------------------------- Planning suite
const fmtDate = (iso: string) => iso.slice(0, 10);
const fmtTime = (iso: string) => (iso.includes("T") ? iso.slice(11, 16) : "");

export function buildTimeline(): SurfacePanel {
  const sched = productionRuntime.schedule;
  return {
    title: "Timeline",
    subtitle: "Production schedule with dependencies, leading to the event date.",
    status: "READY",
    metrics: [
      { label: "Schedule items", value: String(sched.length) },
      { label: "Event date", value: projectSummary.eventDate },
      { label: "Work orders", value: String(productionRuntimeSummary.workOrders) }
    ],
    sections: [
      {
        title: "Schedule",
        rows: sched.map((s) => ({
          label: s.label,
          value: `${fmtDate(s.start)} ${fmtTime(s.start)}–${fmtTime(s.end)}`,
          sub: s.dependencyIds.length ? `after ${s.dependencyIds.length} task(s)` : "no dependencies"
        }))
      }
    ],
    activeSteps: ["Set milestones", "Sequence schedule", "Resolve dependencies", "Assign crews", "Lock call sheets", "Track progress"],
    useCases: ["Build timeline", "Dependency planning", "Event countdown"],
    runtimeCoverage: sched.length,
    kbsRefs: ["Production Planning"],
    links: [{ label: "Tasks", href: "/planning/tasks" }, { label: "Milestones", href: "/planning/milestones" }, { label: "Production", href: "/production" }],
    evidenceRef: EV
  };
}

export function buildTasks(): SurfacePanel {
  const wos = productionRuntime.workOrders;
  return {
    title: "Task Manager",
    subtitle: "Work orders and checklists across the production crew.",
    status: "READY",
    metrics: [
      { label: "Work orders", value: String(wos.length) },
      { label: "Checklist items", value: String(wos.reduce((s, w) => s + w.checklist.length, 0)) }
    ],
    sections: [
      {
        title: "Work orders",
        rows: wos.map((w) => ({ label: w.title, value: `${w.checklist.length} steps`, sub: `owner: ${w.owner}`, status: "READY" }))
      }
    ],
    activeSteps: ["Create work order", "Assign owner", "Define checklist", "Schedule", "Execute", "Sign off"],
    useCases: ["Task tracking", "Crew assignment", "Checklist execution"],
    runtimeCoverage: wos.length,
    kbsRefs: ["Production Planning"],
    links: [{ label: "Timeline", href: "/planning/timeline" }, { label: "Calendar", href: "/planning/calendar" }],
    evidenceRef: EV
  };
}

export function buildMilestones(): SurfacePanel {
  const milestones = [
    ...productionRuntime.callSheets.map((c) => ({ label: c.title, date: c.date })),
    { label: "Wedding day", date: projectSummary.eventDate }
  ].sort((a, b) => a.date.localeCompare(b.date));
  return {
    title: "Milestone Tracker",
    subtitle: "Key production milestones leading to the event.",
    status: "READY",
    metrics: [
      { label: "Milestones", value: String(milestones.length) },
      { label: "Event date", value: projectSummary.eventDate }
    ],
    sections: [
      { title: "Milestones", rows: milestones.map((m) => ({ label: m.label, value: m.date })) }
    ],
    activeSteps: ["Define milestones", "Set target dates", "Track readiness", "Flag slippage", "Confirm completion"],
    useCases: ["Milestone tracking", "Readiness gates"],
    runtimeCoverage: milestones.length,
    kbsRefs: ["Production Planning"],
    links: [{ label: "Timeline", href: "/planning/timeline" }, { label: "Calendar", href: "/planning/calendar" }],
    evidenceRef: EV
  };
}

export function buildCalendar(): SurfacePanel {
  const byDate = new Map<string, string[]>();
  for (const s of productionRuntime.schedule) {
    const d = fmtDate(s.start);
    byDate.set(d, [...(byDate.get(d) ?? []), s.label]);
  }
  for (const c of productionRuntime.callSheets) byDate.set(c.date, [...(byDate.get(c.date) ?? []), c.title]);
  const days = [...byDate.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  return {
    title: "Calendar",
    subtitle: "Day-by-day production calendar of schedule items and call sheets.",
    status: "READY",
    metrics: [
      { label: "Active days", value: String(days.length) },
      { label: "Event date", value: projectSummary.eventDate }
    ],
    sections: [
      { title: "Days", rows: days.map(([date, items]) => ({ label: date, value: `${items.length} item(s)`, sub: items.join(" · ") })) }
    ],
    activeSteps: ["Aggregate schedule", "Place call sheets", "Resolve clashes", "Publish calendar"],
    useCases: ["Calendar view", "Day planning"],
    runtimeCoverage: days.length,
    kbsRefs: ["Production Planning"],
    links: [{ label: "Timeline", href: "/planning/timeline" }, { label: "Tasks", href: "/planning/tasks" }],
    evidenceRef: EV
  };
}

export function buildProjects(): SurfacePanel {
  return {
    title: "Project Manager",
    subtitle: "Project overview — scope, coverage, and production resources.",
    status: "READY",
    metrics: [
      { label: "Project", value: projectSummary.name.split(" ")[0] },
      { label: "Routes", value: String(projectSummary.routeCoverage) },
      { label: "CAD objects", value: String(projectSummary.cadObjectCount) },
      { label: "Event date", value: projectSummary.eventDate }
    ],
    sections: [
      {
        title: "Production resources",
        rows: [
          { label: "Vendor assignments", value: String(productionRuntimeSummary.vendorAssignments) },
          { label: "Crew assignments", value: String(productionRuntimeSummary.crewAssignments) },
          { label: "Schedule items", value: String(productionRuntimeSummary.scheduleItems) },
          { label: "Work orders", value: String(productionRuntimeSummary.workOrders) },
          { label: "Call sheets", value: String(productionRuntimeSummary.callSheets) }
        ]
      }
    ],
    activeSteps: ["Define scope", "Plan resources", "Schedule", "Assign crews", "Track health", "Deliver"],
    useCases: ["Project overview", "Resource planning"],
    runtimeCoverage: Object.values(productionRuntimeSummary).reduce((a, b) => a + b, 0),
    kbsRefs: ["Production Planning"],
    links: [{ label: "Timeline", href: "/planning/timeline" }, { label: "Observatory", href: "/observatory" }],
    evidenceRef: EV
  };
}

export function buildRisks(): SurfacePanel {
  return {
    title: "Risk Manager",
    subtitle: "Risk register — blocked capabilities are tracked as open risks.",
    status: "PARTIAL",
    metrics: [
      { label: "Open risks", value: String(blockedCapabilities.length) },
      { label: "Severity", value: "high" }
    ],
    sections: [
      {
        title: "Blocked-capability risks",
        rows: blockedCapabilities.map((cap) => ({ label: cap.label, value: "BLOCKED", sub: cap.reason, status: "BLOCKED" }))
      }
    ],
    activeSteps: ["Identify risk", "Assess severity", "Assign owner", "Mitigate", "Monitor", "Close"],
    useCases: ["Risk register", "Blocker tracking"],
    runtimeCoverage: blockedCapabilities.length,
    kbsRefs: ["Production Planning"],
    links: [{ label: "Observatory", href: "/observatory" }, { label: "Support", href: "/support" }],
    blockers: blockedCapabilities.slice(0, 3).map((c) => ({ label: c.label, reason: c.reason })),
    note: "Risk register surfaces the preserved blockers; mitigation requires external provider/compliance evidence.",
    evidenceRef: EV
  };
}

export function buildQuality(): SurfacePanel {
  const checks = productionRuntime.workOrders.flatMap((w) => w.checklist);
  return {
    title: "Quality Manager",
    subtitle: "Quality checklists derived from work-order steps and runtime coverage.",
    status: "PARTIAL",
    metrics: [
      { label: "Checklists", value: String(productionRuntime.workOrders.length) },
      { label: "Quality checks", value: String(checks.length) },
      { label: "Observatory events", value: String(observatoryEvents.length) }
    ],
    sections: [
      {
        title: "Work-order quality checks",
        rows: productionRuntime.workOrders.map((w) => ({ label: w.title, value: `${w.checklist.length} checks`, sub: w.checklist.join(" · ") }))
      }
    ],
    activeSteps: ["Define checks", "Inspect", "Record findings", "Re-test", "Approve"],
    useCases: ["Quality assurance", "Snag tracking"],
    runtimeCoverage: checks.length,
    kbsRefs: ["Production Planning"],
    links: [{ label: "Tasks", href: "/planning/tasks" }, { label: "Observatory", href: "/observatory" }],
    note: "Preview quality checks from local work orders; certified engineering/compliance signoff remains blocked.",
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
