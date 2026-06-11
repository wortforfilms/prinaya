import type { CapabilityStatus } from "./status";

export type RouteKind = "public" | "module" | "secure" | "runtime" | "blocked";

export type RouteDefinition = {
  path: string;
  title: string;
  kind: RouteKind;
  status: CapabilityStatus;
  description: string;
  primaryFrame: string;
  capabilities: string[];
};

export const publicRoutes: RouteDefinition[] = [
  {
    path: "/",
    title: "TLP Wedding CAD Homepage",
    kind: "public",
    status: "READY",
    description: "Homepage dashboard for wedding CAD project previews, boards, modules, and gates.",
    primaryFrame: "homepage dashboard",
    capabilities: ["project overview", "route matrix", "recent projects", "observatory status"]
  },
  {
    path: "/about",
    title: "About",
    kind: "public",
    status: "READY",
    description: "Studio positioning, controlled-preview limitations, and delivery model.",
    primaryFrame: "design concept page",
    capabilities: ["preview scope", "honesty rules", "studio principles"]
  },
  {
    path: "/pricing",
    title: "Pricing",
    kind: "public",
    status: "READY",
    description: "Preview pricing bands without live checkout or payment claims.",
    primaryFrame: "material board page",
    capabilities: ["package comparison", "blocked payment notice", "scope tiers"]
  },
  {
    path: "/features",
    title: "Features",
    kind: "public",
    status: "READY",
    description: "Feature map across design boards, CAD modules, data frames, and evidence.",
    primaryFrame: "route module cards",
    capabilities: ["module inventory", "status labeling", "capability blockers"]
  },
  {
    path: "/gallery",
    title: "Gallery",
    kind: "public",
    status: "READY",
    description: "Board-style gallery reconstructed from the supplied reference board list.",
    primaryFrame: "3D render/night view page",
    capabilities: ["reference boards", "visual frames", "demo render states"]
  },
  {
    path: "/templates",
    title: "Templates",
    kind: "public",
    status: "READY",
    description: "Wedding layout template catalog seeded from JSON presets.",
    primaryFrame: "asset library grid",
    capabilities: ["template browsing", "mandap presets", "layout presets"]
  },
  {
    path: "/venues",
    title: "Venues",
    kind: "public",
    status: "READY",
    description: "Demo venue previews and planning dimensions without live venue inventory.",
    primaryFrame: "site layout plan",
    capabilities: ["venue dimensions", "parking blocks", "capacity notes"]
  },
  {
    path: "/vendors",
    title: "Vendors",
    kind: "public",
    status: "READY",
    description: "Demo vendor cards only. Live vendor booking and marketplace flows are blocked.",
    primaryFrame: "activity feed",
    capabilities: ["demo vendors", "blocked live booking", "blocked payments"]
  },
  {
    path: "/contact",
    title: "Contact",
    kind: "public",
    status: "READY",
    description: "Contact frame with preview intake structure and no live CRM connection.",
    primaryFrame: "top command bar",
    capabilities: ["intake fields", "support routing", "blocked CRM sync"]
  },
  {
    path: "/support",
    title: "Support",
    kind: "public",
    status: "READY",
    description: "Support shell for docs, known blockers, and release gates.",
    primaryFrame: "observatory status matrix",
    capabilities: ["known blockers", "release evidence", "support categories"]
  },
  {
    path: "/blog",
    title: "Blog",
    kind: "public",
    status: "READY",
    description: "Editorial frame with sample planning articles and no CMS backend.",
    primaryFrame: "design concept page",
    capabilities: ["demo articles", "planning notes", "blocked CMS publishing"]
  }
];

export const moduleRoutes: RouteDefinition[] = [
  {
    path: "/auth/*",
    title: "Auth",
    kind: "secure",
    status: "READY",
    description: "Authentication page frames exist; real auth provider is not connected.",
    primaryFrame: "top command bar",
    capabilities: ["login shell", "role-aware copy", "blocked provider integration"]
  },
  {
    path: "/dashboard/*",
    title: "Dashboard",
    kind: "module",
    status: "READY",
    description: "Studio dashboard for project stats, recents, tasks, and route health.",
    primaryFrame: "homepage dashboard",
    capabilities: ["project stats", "recent projects", "activity feed"]
  },
  {
    path: "/projects/*",
    title: "Projects",
    kind: "module",
    status: "READY",
    description: "Project browser and summary frames for wedding CAD workspaces.",
    primaryFrame: "project stats",
    capabilities: ["project summary", "scene list", "release gate link"]
  },
  {
    path: "/venue-designer/*",
    title: "Venue Designer",
    kind: "module",
    status: "READY",
    description: "Venue dimension, zoning, ingress, parking, and safety planning shell.",
    primaryFrame: "site layout plan",
    capabilities: ["venue dimensions", "parking planner", "zone overlays"]
  },
  {
    path: "/mandap/*",
    title: "Mandap Designer",
    kind: "module",
    status: "READY",
    description: "Mandap plan, elevation, material, and ritual geometry module.",
    primaryFrame: "mandap plan/elevation page",
    capabilities: ["mandap dimensions", "pillars", "saptapadi area"]
  },
  {
    path: "/layouts/*",
    title: "Layout Generator",
    kind: "module",
    status: "READY",
    description: "Seating, stage, entry, food court, and guest movement layout shell.",
    primaryFrame: "seating layout page",
    capabilities: ["seating capacity", "guest sections", "stage placement"]
  },
  {
    path: "/cad/*",
    title: "CAD Studio",
    kind: "runtime",
    status: "READY",
    description: "CAD route shell plus /cad/editor Three.js runtime for primitive wedding assets.",
    primaryFrame: "CAD editor shell",
    capabilities: ["3D scene", "layers", "object insertion", "scene JSON"]
  },
  {
    path: "/assets/*",
    title: "Asset Library",
    kind: "module",
    status: "READY",
    description: "Asset categories for mandap, lighting, floral, furniture, props, and site objects.",
    primaryFrame: "asset library grid",
    capabilities: ["asset categories", "starter primitives", "material tags"]
  },
  {
    path: "/floral/*",
    title: "Floral Designer",
    kind: "module",
    status: "READY",
    description: "Floral palette, garland, canopy, and decor package planning shell.",
    primaryFrame: "decor/floral page",
    capabilities: ["floral palette", "decor items", "canopy notes"]
  },
  {
    path: "/lighting/*",
    title: "Lighting Designer",
    kind: "module",
    status: "READY",
    description: "Lighting fixtures, trusses, color temperature, and night-view planning shell.",
    primaryFrame: "lighting plan page",
    capabilities: ["fixtures", "chandeliers", "night view"]
  },
  {
    path: "/guests/*",
    title: "Guest Planner",
    kind: "module",
    status: "READY",
    description: "Guest sections, seating allocation, VIP zones, and access notes.",
    primaryFrame: "seating layout page",
    capabilities: ["guest sections", "capacity", "access notes"]
  },
  {
    path: "/budget/*",
    title: "Budget Calculator",
    kind: "module",
    status: "READY",
    description: "Budget line items, estimates, variance, and blocked payment markers.",
    primaryFrame: "project stats",
    capabilities: ["budget items", "cost bands", "blocked checkout"]
  },
  {
    path: "/production/*",
    title: "Production Planner",
    kind: "module",
    status: "READY",
    description: "Task, crew, install timeline, and evidence shell without live operations sync.",
    primaryFrame: "activity feed",
    capabilities: ["tasks", "install windows", "evidence links"]
  },
  {
    path: "/drone/*",
    title: "Drone Planner",
    kind: "module",
    status: "READY",
    description: "Drone zones and camera path frame. Flight approval and safety validation are blocked.",
    primaryFrame: "site layout plan",
    capabilities: ["drone zones", "path markers", "blocked flight compliance"]
  },
  {
    path: "/vr/*",
    title: "VR Walkthrough",
    kind: "runtime",
    status: "READY",
    description: "Walkthrough frame and cameras exist; real headset build pipeline is not included.",
    primaryFrame: "3D render/night view page",
    capabilities: ["camera path", "walkthrough shell", "blocked device export"]
  },
  {
    path: "/ai/*",
    title: "AI Generator",
    kind: "module",
    status: "READY",
    description: "Prompt and generation history frame without a live model integration.",
    primaryFrame: "design concept page",
    capabilities: ["prompt history", "generation audit", "blocked live model"]
  },
  {
    path: "/exports/*",
    title: "Export Center",
    kind: "module",
    status: "READY",
    description: "JSON and PDF-board preview export frames exist. DWG/DXF export is blocked.",
    primaryFrame: "export panel",
    capabilities: ["export jobs", "PDF board generator shell", "blocked DWG/DXF"]
  },
  {
    path: "/marketplace/*",
    title: "Marketplace",
    kind: "module",
    status: "READY",
    description: "Marketplace catalog frame with seeded items only; live commerce is blocked.",
    primaryFrame: "asset library grid",
    capabilities: ["demo listings", "blocked sellers", "blocked payments"]
  },
  {
    path: "/admin/*",
    title: "Admin",
    kind: "secure",
    status: "READY",
    description: "Admin shell for roles, permissions, evidence, and release gates.",
    primaryFrame: "observatory status matrix",
    capabilities: ["roles", "permissions", "release gates"]
  },
  {
    path: "/observatory/*",
    title: "Observatory",
    kind: "module",
    status: "READY",
    description: "Status matrix and evidence dashboard for preview readiness and blockers.",
    primaryFrame: "observatory status matrix",
    capabilities: ["release status", "evidence files", "blocker list"]
  },
  {
    path: "/settings/*",
    title: "Settings",
    kind: "module",
    status: "READY",
    description: "Project defaults, theme preferences, evidence settings, and blocked integration controls.",
    primaryFrame: "top command bar",
    capabilities: ["project defaults", "evidence settings", "blocked integrations"]
  }
];

export const routeMatrix = [...publicRoutes, ...moduleRoutes];

export function findRouteBySegment(segment: string): RouteDefinition {
  const prefix = `/${segment}/*`;
  const route = moduleRoutes.find((item) => item.path === prefix);
  if (!route) {
    throw new Error(`Unknown route segment: ${segment}`);
  }
  return route;
}

export const routeFamilies = moduleRoutes.map((route) => route.path.replace("/*", "").slice(1));

export const publicRouteSlugs = publicRoutes
  .filter((route) => route.path !== "/")
  .map((route) => route.path.slice(1));
