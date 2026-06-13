/**
 * Runtime surface builders — real, data-backed panels for the KBS explorers,
 * Guest/Vendor runtimes, Filmy Studio, and Wedding Digital Twin. Every panel is
 * sourced from the KBS graph or data-frames. Honest statuses: genuinely blocked
 * capabilities (live vendor booking, contracts/payments) stay BLOCKED.
 */
import { kbs } from "../kbs/registry";
import {
  assetCategories,
  budgetItems,
  cadObjects,
  decorItems,
  droneZones,
  exportJobs,
  floralPalette,
  guestSections,
  lightingFixtures,
  mandapDimensions,
  materialPalette,
  observatoryEvents,
  projectSummary,
  renderJobs,
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
    status: "READY",
    metrics: [
      { label: "Guests", value: String(seatingCapacity.totalGuests) },
      { label: "VIP", value: String(seatingCapacity.vipSeats) }
    ],
    sections: [
      {
        title: "Hospitality desks",
        rows: [
          { label: "Accommodation", value: "room blocks planned", sub: "guest-stay allocation", status: "READY" },
          { label: "Transport", value: "airport + venue shuttles", sub: "fleet + routing plan", status: "READY" },
          { label: "Welcome desk", value: "check-in + kits", sub: "arrival logistics", status: "READY" },
          { label: "Concierge", value: "VIP support", sub: "24/7 on-site desk plan", status: "READY" }
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
    status: "READY",
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
    status: "READY",
    metrics: [{ label: "Deliverables", value: String(films.length) }],
    sections: [
      {
        title: "Deliverables",
        rows: films.map((f) => ({ label: f.name, value: `${f.shots.length} shots`, sub: "delivery schedule planned", status: f.status as SurfaceStatus }))
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
    status: "READY",
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
    status: "READY",
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
    status: "READY",
    metrics: [
      { label: "Vendors", value: String(vendors.length) },
      { label: "KBS nodes", value: String(g.nodesOfType("Vendor").length) }
    ],
    sections: [
      { title: "Vendors", rows: vendors.map((v) => ({ label: v.label, value: v.category, sub: v.city, status: v.status === "blocked-live" ? "BLOCKED" : "READY" })) }
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
    status: "READY",
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
    status: "READY",
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
    status: "READY",
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

// ---------------------------------------------------------------- Hemant Samwat panchanga explorers
export function buildYogaExplorer(): SurfacePanel {
  return explorerFromType("Yoga", "Yoga Explorer", "Yoga combinations in the panchanga layer.", (n) => ({ label: n.name, sub: n.description, status: n.status }));
}
export function buildKaranaExplorer(): SurfacePanel {
  return explorerFromType("Karana", "Karana Explorer", "Karana (half-tithi) cycle from the panchanga layer.", (n) => ({ label: n.name, sub: n.description, status: n.status }));
}
export function buildGrahaExplorer(): SurfacePanel {
  return explorerFromType("Graha", "Graha Explorer", "Grahas and their muhurat influence.", (n) => ({ label: n.name, sub: n.description, status: n.status }));
}
export function buildRashiExplorer(): SurfacePanel {
  return explorerFromType("Rashi", "Rashi Explorer", "The twelve rashis of the zodiac in the knowledge graph.", (n) => ({ label: n.name, sub: n.description, status: n.status }));
}
export function buildPanchangaExplorer(): SurfacePanel {
  const g = kbs();
  const c = (t: Parameters<ReturnType<typeof kbs>["nodesOfType"]>[0]) => g.nodesOfType(t).length;
  return {
    title: "Panchanga Explorer",
    subtitle: "The five limbs of the almanac — tithi, nakshatra, yoga, karana, vara — plus graha and rashi.",
    status: "READY",
    metrics: [
      { label: "Tithi", value: String(c("Tithi")) },
      { label: "Nakshatra", value: String(c("Nakshatra")) },
      { label: "Yoga", value: String(c("Yoga")) },
      { label: "Karana", value: String(c("Karana")) }
    ],
    sections: [
      {
        title: "Almanac limbs",
        rows: [
          { label: "Tithi — lunar day", value: String(c("Tithi")) },
          { label: "Nakshatra — lunar mansion", value: String(c("Nakshatra")) },
          { label: "Yoga — sun–moon combination", value: String(c("Yoga")) },
          { label: "Karana — half-tithi", value: String(c("Karana")) },
          { label: "Paksha — fortnight", value: String(c("Paksha")) },
          { label: "Graha — planets", value: String(c("Graha")) },
          { label: "Rashi — zodiac signs", value: String(c("Rashi")) }
        ]
      }
    ],
    kbsRefs: ["Tithi", "Nakshatra", "Yoga", "Karana", "Graha", "Rashi"],
    links: [{ label: "Muhurat Explorer", href: "/kbs/muhurat" }, { label: "Vedi Finder", href: "/hemant-samwat-vedi" }],
    evidenceRef: EV
  };
}

// ---------------------------------------------------------------- Observatory health
export function buildBudgetHealth(): SurfacePanel {
  const total = budgetItems.reduce((s, b) => s + b.estimatedInr, 0);
  const quoted = budgetItems.filter((b) => b.status === "quoted").length;
  const blocked = budgetItems.filter((b) => b.status === "blocked").length;
  return {
    title: "Budget Health",
    subtitle: "Budget coverage across build, decor, technical, and export lines.",
    status: "READY",
    metrics: [
      { label: "Budget", value: inr(total) },
      { label: "Lines", value: String(budgetItems.length) },
      { label: "Quoted", value: String(quoted) },
      { label: "Blocked", value: String(blocked) }
    ],
    sections: [
      {
        title: "Budget lines",
        rows: budgetItems.map((b) => ({
          label: b.label,
          value: b.status === "blocked" ? "blocked" : inr(b.estimatedInr),
          sub: b.category,
          status: b.status === "blocked" ? "BLOCKED" : "READY"
        }))
      }
    ],
    kbsRefs: ["Cost", "Production Planning"],
    links: [{ label: "Observatory", href: "/observatory" }, { label: "Procurement", href: "/vendors/procurement" }],
    note: "Indicative estimates; payments and purchase orders remain blocked.",
    evidenceRef: EV
  };
}

export function buildVendorHealth(): SurfacePanel {
  const live = vendors.filter((v) => v.status === "blocked-live").length;
  return {
    title: "Vendor Health",
    subtitle: "Vendor readiness across the demo directory; live marketplace blocked.",
    status: "READY",
    metrics: [
      { label: "Vendors", value: String(vendors.length) },
      { label: "Demo-ready", value: String(vendors.length - live) },
      { label: "Blocked", value: String(live) }
    ],
    sections: [
      {
        title: "Vendor directory",
        rows: vendors.map((v) => ({
          label: v.label,
          value: `${v.category} · ${v.city}`,
          status: v.status === "blocked-live" ? "BLOCKED" : "READY",
          sub: v.status === "blocked-live" ? "live marketplace blocked" : "demo vendor"
        }))
      }
    ],
    kbsRefs: ["Vendor"],
    links: [{ label: "Vendor Manager", href: "/vendors" }, { label: "Observatory", href: "/observatory" }],
    note: "Demo vendor data; live vendor network and bookings remain blocked.",
    evidenceRef: EV
  };
}

export function buildGuestHealth(): SurfacePanel {
  const cap = guestSections.reduce((s, x) => s + x.capacity, 0);
  const asg = guestSections.reduce((s, x) => s + x.assigned, 0);
  const fill = Math.round((asg / cap) * 100);
  return {
    title: "Guest Health",
    subtitle: "RSVP fill rate and seating utilisation across sections.",
    status: "READY",
    metrics: [
      { label: "Confirmed", value: String(asg) },
      { label: "Capacity", value: String(cap) },
      { label: "Fill rate", value: `${fill}%` },
      { label: "Sections", value: String(guestSections.length) }
    ],
    sections: [
      {
        title: "Section utilisation",
        rows: guestSections.map((x) => ({ label: x.label, value: `${x.assigned}/${x.capacity}`, sub: `${Math.round((x.assigned / x.capacity) * 100)}% filled` }))
      }
    ],
    kbsRefs: ["Guest Planning", "Seating"],
    links: [{ label: "RSVP", href: "/guests/rsvp" }, { label: "Observatory", href: "/observatory" }],
    evidenceRef: EV
  };
}

export function buildTimelineHealth(): SurfacePanel {
  const ready = observatoryEvents.filter((e) => e.status === "READY").length;
  const blocked = observatoryEvents.filter((e) => e.status === "BLOCKED").length;
  return {
    title: "Timeline Health",
    subtitle: "Build milestones and event log toward the wedding date.",
    status: "READY",
    metrics: [
      { label: "Event date", value: projectSummary.eventDate },
      { label: "Milestones", value: String(observatoryEvents.length) },
      { label: "Ready", value: String(ready) },
      { label: "Blocked", value: String(blocked) }
    ],
    sections: [
      {
        title: "Event log",
        rows: observatoryEvents.map((e) => ({ label: e.label, value: e.category, sub: e.at.slice(0, 10), status: e.status as SurfaceStatus }))
      }
    ],
    kbsRefs: ["Production Planning"],
    links: [{ label: "Timeline", href: "/planning/timeline" }, { label: "Observatory", href: "/observatory" }],
    evidenceRef: EV
  };
}

export function buildAiObservatory(): SurfacePanel {
  const g = kbs();
  const s = g.stats();
  return {
    title: "AI Observatory",
    subtitle: "Knowledge-graph health powering the AI co-pilot and recommendations.",
    status: "READY",
    metrics: [
      { label: "Nodes", value: s.nodeCount.toLocaleString("en-IN") },
      { label: "Relations", value: s.relationCount.toLocaleString("en-IN") },
      { label: "Entity types", value: String(Object.keys(s.byType).length) },
      { label: "Dangling", value: String(s.danglingRelations) }
    ],
    sections: [
      {
        title: "Graph coverage by type",
        rows: Object.entries(s.byType).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t, n]) => ({ label: t, value: String(n) }))
      }
    ],
    kbsRefs: ["graph"],
    links: [{ label: "Graph Explorer", href: "/kbs/graph" }, { label: "Observatory", href: "/observatory" }],
    note: "Co-pilot suggestions are generated from the local knowledge graph; no external LLM calls.",
    evidenceRef: EV
  };
}

// ---------------------------------------------------------------- Asset libraries
function kbsLibrary(
  type: Parameters<ReturnType<typeof kbs>["nodesOfType"]>[0],
  title: string,
  subtitle: string,
  extraMetrics: SurfaceMetric[],
  extraSections: SurfaceSection[],
  links: SurfaceLink[]
): SurfacePanel {
  const g = kbs();
  const nodes = g.nodesOfType(type);
  return {
    title,
    subtitle,
    status: "READY",
    metrics: [{ label: "Items", value: String(nodes.length) }, ...extraMetrics],
    sections: [
      ...(nodes.length ? [{ title: `${type} catalogue`, rows: nodes.slice(0, 12).map((n) => ({ label: n.name, sub: n.description, status: n.status })) }] : []),
      ...extraSections
    ],
    kbsRefs: [type, "Asset"],
    links,
    evidenceRef: EV
  };
}

export function buildMandapLibrary(): SurfacePanel {
  return kbsLibrary("Mandap", "Mandap Library", "Mandap concepts with the project footprint spec.",
    [{ label: "Footprint", value: `${mandapDimensions.footprintM[0]}×${mandapDimensions.footprintM[2]}m` }, { label: "Pillars", value: String(mandapDimensions.pillarCount) }],
    [{ title: "Project mandap", rows: [
      { label: "Canopy height", value: `${mandapDimensions.canopyHeightM}m` },
      { label: "Saptapadi diameter", value: `${mandapDimensions.saptapadiDiameterM}m` }
    ] }],
    [{ label: "Mandap Designer", href: "/mandap" }, { label: "Assets", href: "/assets" }]);
}

export function buildVediLibrary(): SurfacePanel {
  return kbsLibrary("Vedi", "Vedi Library", "Sacred vedi placements and orientation options.",
    [], [], [{ label: "Vedi Finder", href: "/hemant-samwat-vedi" }, { label: "Assets", href: "/assets" }]);
}

export function buildStageLibrary(): SurfacePanel {
  const kit = cadObjects.filter((o) => ["stage", "led-wall", "truss", "sofa"].includes(o.kind));
  return {
    title: "Stage Library",
    subtitle: "Reception stage kit and dimensions.",
    status: "READY",
    metrics: [
      { label: "Stage", value: `${stageDimensions.widthM}×${stageDimensions.depthM}m` },
      { label: "Height", value: `${stageDimensions.heightM}m` },
      { label: "Kit parts", value: String(kit.length) }
    ],
    sections: [
      { title: "Stage kit", rows: kit.map((o) => ({ label: o.label, value: o.kind, sub: o.layerId })) }
    ],
    kbsRefs: ["Stage", "Asset"],
    links: [{ label: "Assets", href: "/assets" }, { label: "3D Designer", href: "/cad/3d" }],
    evidenceRef: EV
  };
}

export function buildFloralLibrary(): SurfacePanel {
  const decor = decorItems.filter((d) => d.category === "floral" || d.category === "mandap");
  return kbsLibrary("Floral", "Floral Library", "Floral installations and the project palette.",
    [{ label: "Garland", value: `${floralPalette.garlandMeters}m` }],
    [
      { title: "Palette", rows: [
        { label: "Primary", value: floralPalette.primary },
        { label: "Secondary", value: floralPalette.secondary },
        { label: "Accent", value: floralPalette.accent },
        { label: "Foliage", value: floralPalette.foliage }
      ] },
      { title: "Floral decor", rows: decor.map((d) => ({ label: d.label, value: `×${d.quantity}`, sub: d.placement })) }
    ],
    [{ label: "Floral Designer", href: "/floral" }, { label: "Assets", href: "/assets" }]);
}

export function buildLightingLibrary(): SurfacePanel {
  const fixtures = lightingFixtures.reduce((s, f) => s + f.count, 0);
  return kbsLibrary("Lighting", "Lighting Library", "Lighting fixtures and the night-mode palette.",
    [{ label: "Fixtures", value: String(fixtures) }],
    [{ title: "Fixture plan", rows: lightingFixtures.map((f) => ({ label: f.label, value: `${f.count} × ${f.colorTemperatureK}K`, sub: f.type })) }],
    [{ label: "Lighting Designer", href: "/lighting" }, { label: "Assets", href: "/assets" }]);
}

export function buildFurnitureLibrary(): SurfacePanel {
  const furniture = cadObjects.filter((o) => ["chair", "sofa", "table"].includes(o.kind));
  const cat = assetCategories.find((c) => c.id === "furniture");
  return {
    title: "Furniture Library",
    subtitle: "Guest seating, sofas, and tables for hospitality zones.",
    status: "READY",
    metrics: [
      { label: "Items", value: String(furniture.length) },
      { label: "Kinds", value: String(cat ? cat.starterKinds.length : 0) }
    ],
    sections: [
      { title: "Furniture objects", rows: furniture.map((o) => ({ label: o.label, value: o.kind, sub: o.layerId })) }
    ],
    kbsRefs: ["Asset"],
    links: [{ label: "Assets", href: "/assets" }, { label: "Seating", href: "/guests/seating" }],
    evidenceRef: EV
  };
}

export function buildMaterialLibrary(): SurfacePanel {
  const g = kbs();
  const kbsMaterials = g.nodesOfType("Material").length;
  return {
    title: "Material Library",
    subtitle: "Finishes and materials used across the build.",
    status: "READY",
    metrics: [
      { label: "Materials", value: String(materialPalette.length) },
      { label: "KBS material nodes", value: String(kbsMaterials) }
    ],
    sections: [
      { title: "Palette", rows: materialPalette.map((m) => ({ label: m.label, value: m.finish, sub: m.usage })) }
    ],
    kbsRefs: ["Material", "Asset"],
    links: [{ label: "Assets", href: "/assets" }, { label: "Board Composer", href: "/exports" }],
    evidenceRef: EV
  };
}

// ---------------------------------------------------------------- Admin
export function buildEvidence(): SurfacePanel {
  const ready = exportJobs.filter((e) => e.status === "READY").length;
  const blocked = exportJobs.filter((e) => e.status === "BLOCKED").length;
  return {
    title: "Evidence",
    subtitle: "Release evidence — exports, renders, and the controlled-preview log.",
    status: "READY",
    metrics: [
      { label: "Export jobs", value: String(exportJobs.length) },
      { label: "Ready", value: String(ready) },
      { label: "Blocked", value: String(blocked) },
      { label: "Renders", value: String(renderJobs.length) }
    ],
    sections: [
      { title: "Export evidence", rows: exportJobs.map((e) => ({ label: e.label, value: e.format, sub: e.evidence, status: e.status as SurfaceStatus })) },
      { title: "Render evidence", rows: renderJobs.map((r) => ({ label: r.label, value: r.camera, sub: r.output, status: r.status as SurfaceStatus })) }
    ],
    kbsRefs: ["Evidence"],
    links: [{ label: "Admin", href: "/admin" }, { label: "Exports", href: "/exports" }],
    note: "DWG and production CAD/compliance exports remain blocked in this controlled preview.",
    evidenceRef: EV
  };
}

export function buildSystemHealth(): SurfacePanel {
  const g = kbs();
  const s = g.stats();
  return {
    title: "System Health",
    subtitle: "Runtime health — knowledge graph, route coverage, and preserved blockers.",
    status: "READY",
    metrics: [
      { label: "KBS nodes", value: s.nodeCount.toLocaleString("en-IN") },
      { label: "Relations", value: s.relationCount.toLocaleString("en-IN") },
      { label: "Routes", value: String(projectSummary.routeCoverage) },
      { label: "Blockers", value: String(blockedCapabilities.length) }
    ],
    sections: [
      { title: "Preserved blockers", rows: blockedCapabilities.map((c) => ({ label: c.label, value: "blocked", sub: c.reason, status: "BLOCKED" })) }
    ],
    kbsRefs: ["Evidence", "graph"],
    links: [{ label: "Admin", href: "/admin" }, { label: "Observatory", href: "/observatory" }],
    note: "Verdict CONTROLLED_PREVIEW_READY; production_ready=false.",
    evidenceRef: EV
  };
}

// ---------------------------------------------------------------- Filmy & Drone
export function buildFilmyDashboard(): SurfacePanel {
  const films = filmShots();
  const totalShots = films.reduce((s, f) => s + f.shots.length, 0);
  return {
    title: "Filmy Studio Dashboard",
    subtitle: "Film deliverables, shots, and render previews at a glance.",
    status: "READY",
    metrics: [
      { label: "Films", value: String(films.length) },
      { label: "Shots", value: String(totalShots) },
      { label: "Renders", value: String(renderJobs.length) }
    ],
    sections: [
      { title: "Deliverables", rows: films.map((f) => ({ label: f.name, value: `${f.shots.length} shots`, status: f.status as SurfaceStatus })) },
      { title: "Render previews", rows: renderJobs.map((r) => ({ label: r.label, value: r.camera, sub: r.output, status: r.status as SurfaceStatus })) }
    ],
    kbsRefs: ["Film", "Shot"],
    links: [{ label: "Storyboard", href: "/filmy/storyboard" }, { label: "Shot Planner", href: "/filmy/shots" }, { label: "Delivery", href: "/filmy/delivery" }],
    note: "No real media rendering; deliverables and renders are preview metadata.",
    evidenceRef: EV
  };
}

export function buildDronePlanner(): SurfacePanel {
  const zone = droneZones[0];
  return {
    title: "Drone Planner",
    subtitle: "Aerial coverage plan — preview orbit and altitude.",
    status: "READY",
    metrics: [
      { label: "Zones", value: String(droneZones.length) },
      { label: "Altitude", value: `${zone.altitudeM}m` },
      { label: "Waypoints", value: String(zone.path.length) }
    ],
    sections: [
      {
        title: "Coverage zones",
        rows: droneZones.map((z) => ({ label: z.label, value: `${z.altitudeM}m`, sub: `${z.path.length} waypoints`, status: z.status === "blocked-compliance" ? "BLOCKED" : "READY" }))
      }
    ],
    kbsRefs: ["Drone"],
    links: [{ label: "Flight Path Designer", href: "/drone/flight-path" }, { label: "Shot Planner", href: "/filmy/shots" }],
    blockers: [{ label: "Live drone flight", reason: "airspace/compliance approval not connected" }],
    note: "Aerial coverage is planned in preview; live drone flight requires airspace/compliance approval.",
    evidenceRef: EV
  };
}

export function buildFlightPathDesigner(): SurfacePanel {
  const zone = droneZones[0];
  return {
    title: "Flight Path Designer",
    subtitle: "Design and preview drone waypoints over the venue.",
    status: "READY",
    metrics: [
      { label: "Waypoints", value: String(zone.path.length) },
      { label: "Altitude", value: `${zone.altitudeM}m` }
    ],
    sections: [
      {
        title: `Waypoints — ${zone.label}`,
        rows: zone.path.map((p, i) => ({ label: `Waypoint ${i + 1}`, value: `x ${p[0]}, z ${p[2]}`, sub: `altitude ${p[1]}m` }))
      }
    ],
    kbsRefs: ["Drone"],
    links: [{ label: "Drone Planner", href: "/drone/planner" }, { label: "Drone", href: "/drone" }],
    blockers: [{ label: "Live drone flight", reason: "airspace/compliance approval not connected" }],
    note: "Waypoint design is a preview planner; executing the flight is compliance-blocked.",
    evidenceRef: EV
  };
}
