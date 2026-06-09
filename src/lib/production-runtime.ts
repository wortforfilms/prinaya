import { cadObjects, projectSummary, type CadObjectFrame } from "./data-frames";

export type ProductionAssignmentStatus = "READY" | "BLOCKED_LIVE";

export type VendorAssignmentFrame = {
  id: string;
  sceneObjectId: string;
  vendorName: string;
  trade: string;
  scope: string;
  status: ProductionAssignmentStatus;
};

export type CrewAssignmentFrame = {
  id: string;
  sceneObjectId: string;
  crew: string;
  headcount: number;
  shift: string;
  status: ProductionAssignmentStatus;
};

export type TransportFrame = {
  id: string;
  linkedLayerId: string;
  vehicle: string;
  pickup: string;
  drop: string;
  status: ProductionAssignmentStatus;
};

export type AccommodationFrame = {
  id: string;
  crew: string;
  rooms: number;
  checkIn: string;
  checkOut: string;
  status: ProductionAssignmentStatus;
};

export type ScheduleFrame = {
  id: string;
  sceneObjectId: string;
  label: string;
  start: string;
  end: string;
  dependencyIds: string[];
  status: ProductionAssignmentStatus;
};

export type WorkOrderFrame = {
  id: string;
  sceneObjectId: string;
  title: string;
  owner: string;
  checklist: string[];
  status: ProductionAssignmentStatus;
};

export type CallSheetFrame = {
  id: string;
  title: string;
  date: string;
  crewIds: string[];
  workOrderIds: string[];
  status: ProductionAssignmentStatus;
};

export type ProductionRuntime = {
  projectId: string;
  vendorAssignments: VendorAssignmentFrame[];
  crewAssignments: CrewAssignmentFrame[];
  transport: TransportFrame[];
  accommodation: AccommodationFrame[];
  schedule: ScheduleFrame[];
  workOrders: WorkOrderFrame[];
  callSheets: CallSheetFrame[];
};

const objectByKind = (kind: CadObjectFrame["kind"]) => cadObjects.find((object) => object.kind === kind) ?? cadObjects[0];

export const productionRuntime: ProductionRuntime = {
  projectId: projectSummary.id,
  vendorAssignments: [
    vendor("vendor-mandap", objectByKind("mandap").id, "Lotus Bloom Decor", "Mandap fabricator", "Mandap structure, fabric, kalash, and ritual clearances"),
    vendor("vendor-lighting", objectByKind("truss").id, "Prism Events Lighting", "Lighting", "Truss, chandelier, wash, and night mood rig"),
    vendor("vendor-floral", objectByKind("floral-garland").id, "Marigold Atelier", "Floral", "Garlands, ceiling florals, entry toran, and aisle decor"),
    vendor("vendor-stage", objectByKind("stage").id, "Raj Darbar Fabrication", "Stage", "Stage deck, LED wall mount, and sofa platform"),
    vendor("vendor-seating", objectByKind("chair").id, "Saptapadi Rentals", "Seating", "VIP, family, general, and accessible seating packs")
  ],
  crewAssignments: [
    crew("crew-mandap", objectByKind("mandap").id, "Mandap install crew", 12, "Day -2 08:00-18:00"),
    crew("crew-lighting", objectByKind("truss").id, "Lighting rig crew", 8, "Day -1 10:00-22:00"),
    crew("crew-floral", objectByKind("floral-garland").id, "Floral dressing crew", 16, "Event day 05:00-14:00"),
    crew("crew-stage", objectByKind("stage").id, "Stage build crew", 10, "Day -2 12:00-22:00"),
    crew("crew-seating", objectByKind("chair").id, "Seating and aisle crew", 14, "Event day 07:00-12:00")
  ],
  transport: [
    { id: "transport-mandap", linkedLayerId: "mandap", vehicle: "32 ft container", pickup: "Workshop A", drop: "Lotus Palace service gate", status: "READY" },
    { id: "transport-lighting", linkedLayerId: "lighting", vehicle: "Tempo truck", pickup: "Lighting warehouse", drop: "Backstage dock", status: "READY" },
    { id: "transport-floral", linkedLayerId: "decor", vehicle: "Refrigerated van", pickup: "Flower market", drop: "Decor prep tent", status: "READY" }
  ],
  accommodation: [
    { id: "stay-install", crew: "Mandap install crew", rooms: 6, checkIn: "2026-12-09", checkOut: "2026-12-13", status: "READY" },
    { id: "stay-lighting", crew: "Lighting rig crew", rooms: 4, checkIn: "2026-12-10", checkOut: "2026-12-13", status: "READY" },
    { id: "stay-floral", crew: "Floral dressing crew", rooms: 8, checkIn: "2026-12-11", checkOut: "2026-12-13", status: "READY" }
  ],
  schedule: [
    schedule("schedule-site-marking", objectByKind("parking-block").id, "Site marking and service lanes", "2026-12-09T08:00:00+05:30", "2026-12-09T14:00:00+05:30", []),
    schedule("schedule-stage", objectByKind("stage").id, "Stage deck and LED wall build", "2026-12-10T08:00:00+05:30", "2026-12-10T20:00:00+05:30", ["schedule-site-marking"]),
    schedule("schedule-mandap", objectByKind("mandap").id, "Mandap structure and canopy", "2026-12-10T12:00:00+05:30", "2026-12-11T18:00:00+05:30", ["schedule-site-marking"]),
    schedule("schedule-lighting", objectByKind("truss").id, "Lighting rig and focus", "2026-12-11T10:00:00+05:30", "2026-12-11T23:00:00+05:30", ["schedule-stage"]),
    schedule("schedule-floral", objectByKind("floral-garland").id, "Floral dressing and final touch", "2026-12-12T05:00:00+05:30", "2026-12-12T14:00:00+05:30", ["schedule-mandap", "schedule-lighting"])
  ],
  workOrders: [
    workOrder("wo-mandap", objectByKind("mandap").id, "Install mandap and ritual zone", "Mandap install crew", ["verify centerline", "fix pillars", "dress canopy", "mark priest zone"]),
    workOrder("wo-lighting", objectByKind("truss").id, "Rig lighting and focus", "Lighting rig crew", ["raise truss", "patch fixtures", "focus mandap", "record dimmer scenes"]),
    workOrder("wo-floral", objectByKind("floral-garland").id, "Dress floral package", "Floral dressing crew", ["hang toran", "dress mandap", "place aisle florals", "water fresh stems"]),
    workOrder("wo-stage", objectByKind("stage").id, "Build stage platform", "Stage build crew", ["level deck", "install fascia", "place sofa", "check edges"]),
    workOrder("wo-seating", objectByKind("chair").id, "Deploy seating packs", "Seating and aisle crew", ["set VIP rows", "set family courts", "mark aisles", "reserve accessibility seats"])
  ],
  callSheets: [
    { id: "call-day-minus-2", title: "Day -2 build call sheet", date: "2026-12-10", crewIds: ["crew-mandap", "crew-stage"], workOrderIds: ["wo-mandap", "wo-stage"], status: "READY" },
    { id: "call-day-minus-1", title: "Day -1 technical call sheet", date: "2026-12-11", crewIds: ["crew-lighting"], workOrderIds: ["wo-lighting"], status: "READY" },
    { id: "call-event-day", title: "Event day finishing call sheet", date: "2026-12-12", crewIds: ["crew-floral", "crew-seating"], workOrderIds: ["wo-floral", "wo-seating"], status: "READY" }
  ]
};

export const productionRuntimeSummary = {
  vendorAssignments: productionRuntime.vendorAssignments.length,
  crewAssignments: productionRuntime.crewAssignments.length,
  transportPlans: productionRuntime.transport.length,
  accommodationPlans: productionRuntime.accommodation.length,
  scheduleItems: productionRuntime.schedule.length,
  workOrders: productionRuntime.workOrders.length,
  callSheets: productionRuntime.callSheets.length
};

function vendor(id: string, sceneObjectId: string, vendorName: string, trade: string, scope: string): VendorAssignmentFrame {
  return { id, sceneObjectId, vendorName, trade, scope, status: "READY" };
}

function crew(id: string, sceneObjectId: string, crewName: string, headcount: number, shift: string): CrewAssignmentFrame {
  return { id, sceneObjectId, crew: crewName, headcount, shift, status: "READY" };
}

function schedule(id: string, sceneObjectId: string, label: string, start: string, end: string, dependencyIds: string[]): ScheduleFrame {
  return { id, sceneObjectId, label, start, end, dependencyIds, status: "READY" };
}

function workOrder(id: string, sceneObjectId: string, title: string, owner: string, checklist: string[]): WorkOrderFrame {
  return { id, sceneObjectId, title, owner, checklist, status: "READY" };
}
