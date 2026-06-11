import {
  Bell,
  Blocks,
  Calculator,
  Camera,
  Car,
  ChevronDown,
  CircleHelp,
  Crown,
  Download,
  FileUp,
  Flower2,
  FolderOpen,
  GalleryHorizontalEnd,
  Gem,
  Grid3X3,
  Handshake,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Orbit,
  Plane,
  Search,
  Share2,
  Sparkles,
  Sun,
  Users,
  Warehouse,
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileJson,
  FileText,
  Image,
  Layers3,
  ShieldCheck
} from "lucide-react";
import type { ComponentType } from "react";
import {
  budgetItems,
  cadObjects,
  exportJobs,
  layers,
  lightingFixtures,
  observatoryEvents,
  projectSummary,
  renderJobs
} from "@/lib/data-frames";
import { previewFrameRuntimeSummary } from "@/lib/preview-frame-runtime";
import { moduleRoutes, routeMatrix, type RouteDefinition } from "@/lib/route-matrix";
import { blockedCapabilities, releaseStatus, type CapabilityStatus } from "@/lib/status";
import { getHeroBannerBySlug } from "@/lib/hero-banner-registry";

type PremiumModule = RouteDefinition & {
  accent: string;
  glow: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  href: string;
};

const dashboardHeroImage = getHeroBannerBySlug("dashboard")?.hiresImage ?? "/hero-banners/hires/dashboard.webp";
const templatesHeroImage = getHeroBannerBySlug("templates")?.hiresImage ?? "/hero-banners/hires/templates.webp";
const floralHeroImage = getHeroBannerBySlug("floral-designer")?.hiresImage ?? "/hero-banners/hires/floral-designer.webp";
const lightingHeroImage = getHeroBannerBySlug("lighting-designer")?.hiresImage ?? "/hero-banners/hires/lighting-designer.webp";
const cadHeroImage = getHeroBannerBySlug("cad-editor")?.hiresImage ?? "/hero-banners/hires/cad-editor.webp";
const renderGalleryImages = [dashboardHeroImage, floralHeroImage, lightingHeroImage, cadHeroImage];

const sidebarItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, status: "READY" as CapabilityStatus },
  { label: "Venue Designer", href: "/venue-designer", icon: Warehouse, status: "READY" as CapabilityStatus },
  { label: "Mandap Designer", href: "/mandap", icon: Gem, status: "READY" as CapabilityStatus },
  { label: "Layout Generator", href: "/layouts", icon: Grid3X3, status: "READY" as CapabilityStatus },
  { label: "Lighting Designer", href: "/lighting", icon: Lightbulb, status: "READY" as CapabilityStatus },
  { label: "Floral Designer", href: "/floral", icon: Flower2, status: "READY" as CapabilityStatus },
  { label: "Budget Calculator", href: "/budget", icon: Calculator, status: "READY" as CapabilityStatus },
  { label: "Asset Library", href: "/assets", icon: Blocks, status: "READY" as CapabilityStatus },
  { label: "Vendor Library", href: "/vendors", icon: Handshake, status: "READY" as CapabilityStatus },
  { label: "Guest Planner", href: "/guests", icon: Users, status: "READY" as CapabilityStatus },
  { label: "Parking Planner", href: "/venue-designer/parking", icon: Car, status: "READY" as CapabilityStatus },
  { label: "Drone Planner", href: "/drone", icon: Plane, status: "READY" as CapabilityStatus },
  { label: "CAD Exporter", href: "/exports", icon: Download, status: "READY" as CapabilityStatus },
  { label: "VR Walkthrough", href: "/vr", icon: Orbit, status: "READY" as CapabilityStatus }
];

const moduleAccent = [
  ["#ff5da2", "rgba(255,93,162,0.28)", Warehouse],
  ["#ff743d", "rgba(255,116,61,0.28)", Gem],
  ["#eac339", "rgba(234,195,57,0.25)", Grid3X3],
  ["#54e5ed", "rgba(84,229,237,0.25)", Lightbulb],
  ["#95e75f", "rgba(149,231,95,0.24)", Flower2],
  ["#ca76ff", "rgba(202,118,255,0.26)", Calculator],
  ["#5aa9ff", "rgba(90,169,255,0.25)", Blocks],
  ["#83df67", "rgba(131,223,103,0.23)", Handshake],
  ["#ffcc45", "rgba(255,204,69,0.24)", Users],
  ["#ff6c9a", "rgba(255,108,154,0.24)", Car],
  ["#5de8ff", "rgba(93,232,255,0.24)", Plane],
  ["#d88cff", "rgba(216,140,255,0.25)", Orbit]
] as const;

const premiumModules: PremiumModule[] = [
  "venue-designer",
  "mandap",
  "layouts",
  "lighting",
  "floral",
  "budget",
  "assets",
  "vendors",
  "guests",
  "venue-designer",
  "drone",
  "vr"
].map((segment, index) => {
  const baseRoute = resolvePremiumModuleRoute(segment);
  const route =
    segment === "venue-designer" && index === 9
      ? {
          ...baseRoute,
          title: "Parking Planner",
          status: "READY" as CapabilityStatus,
          description: "Plan parking areas, valet flow, service access, and blocked safety-compliance checks.",
          path: "/venue-designer/parking"
        }
      : baseRoute;
  const [accent, glow, icon] = moduleAccent[index];
  return {
    ...route,
    accent,
    glow,
    icon,
    href: route.path.replace("/*", "")
  };
});

function resolvePremiumModuleRoute(segment: string) {
  const wildcard = moduleRoutes.find((item) => item.path === `/${segment}/*`);
  if (wildcard) return wildcard;
  const exact = routeMatrix.find((item) => item.path === `/${segment}`);
  if (exact) return exact;
  throw new Error(`Missing premium dashboard module route for ${segment}`);
}

const quickActions = [
  { label: "New Project", icon: Sparkles, href: "/projects/new", status: "READY" as CapabilityStatus },
  { label: "Open Project", icon: FolderOpen, href: "/projects", status: "READY" as CapabilityStatus },
  { label: "Import CAD", icon: FileUp, href: "/cad/import", status: "READY" as CapabilityStatus },
  { label: "Template Gallery", icon: GalleryHorizontalEnd, href: "/templates", status: "READY" as CapabilityStatus },
  { label: "My Projects", icon: LayoutDashboard, href: "/dashboard/projects", status: "READY" as CapabilityStatus },
  { label: "Shared Projects", icon: Share2, href: "/projects/shared", status: "READY" as CapabilityStatus }
];

const marketplaceTemplates = [
  {
    name: "Vedic Lotus Mandap",
    route: "/templates",
    price: "Preview included",
    status: "READY" as CapabilityStatus,
    accent: "#f6d78b",
    tags: ["mandap", "vedic", "lotus"]
  },
  {
    name: "Royal Palace Wedding",
    route: "/templates",
    price: "Preview included",
    status: "READY" as CapabilityStatus,
    accent: "#ff8f5f",
    tags: ["royal", "stage", "palace"]
  },
  {
    name: "Sci-Fi Galactic Portal",
    route: "/templates",
    price: "Lighting scaffold",
    status: "READY" as CapabilityStatus,
    accent: "#54e5ed",
    tags: ["portal", "lighting", "night"]
  },
  {
    name: "Floating Floral Cloud",
    route: "/templates",
    price: "Rigging blocked",
    status: "READY" as CapabilityStatus,
    accent: "#ff8bd2",
    tags: ["floral", "truss", "blocked safety"]
  },
  {
    name: "Live Template Marketplace",
    route: "/marketplace",
    price: "Commerce blocked",
    status: "BLOCKED" as CapabilityStatus,
    accent: "#ff6b8a",
    tags: ["payments", "vendors", "marketplace"]
  }
];

const timelineSteps = [
  { label: "Venue brief locked", date: "09 Jun", status: "READY" as CapabilityStatus, detail: "Base dimensions and zones are in preview data." },
  { label: "Mandap model review", date: "12 Jun", status: "READY" as CapabilityStatus, detail: "Primitive CAD scene and materials are available." },
  { label: "Lighting night pass", date: "15 Jun", status: "READY" as CapabilityStatus, detail: "Fixture plan and extracted night-view boards are ready; electrical compliance remains blocked." },
  { label: "Printable board export", date: "18 Jun", status: "READY" as CapabilityStatus, detail: "Print-ready board HTML and scene exports are implemented." },
  { label: "DWG/DXF handoff", date: "Blocked", status: "BLOCKED" as CapabilityStatus, detail: "No real CAD exporter implementation exists." }
];

export function PremiumDashboard() {
  return (
    <div className="min-h-screen bg-[#03110f] text-[#f8f0df]">
      <LuxurySidebar />
      <div className="min-h-screen lg:pl-80">
        <TopBar />
        <main className="px-3 pb-8 pt-3 sm:px-5 lg:px-7">
          <HeroSection />
          <AnimatedKpiWidgets />
          <PreviewRuntimeCoverage />
          <QuickActions />
          <CommandDeck />
          <MarketplaceCarousel />
          <ModuleGrid />
          <ProductionWidgets />
          <GalleryWidgets />
          <DashboardBottom />
        </main>
      </div>
    </div>
  );
}

function LuxurySidebar() {
  return (
    <aside className="border-r border-[#d9aa46]/20 bg-[#041816]/95 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-80">
      <div className="flex h-full flex-col overflow-y-auto px-4 py-5">
        <a href="/" className="flex items-center gap-3 px-2 text-[#f6d78b]">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-[#d9aa46]/40 bg-[#d9aa46]/10">
            <Gem aria-hidden className="h-7 w-7" />
          </span>
          <span>
            <span className="block font-serif text-2xl font-bold leading-6 tracking-[0.08em]">TLP WEDDING CAD</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d7bc7c]">Design | Plan | Present | Perform</span>
          </span>
        </a>

        <nav className="mt-9 space-y-1.5" aria-label="Premium dashboard">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={`${item.label}-${index}`}
                href={item.href}
                className={`group flex items-center gap-3 rounded-md border px-3 py-3 text-sm transition ${
                  index === 0
                    ? "border-[#d9aa46]/45 bg-[#d9aa46]/20 text-[#f6d78b] shadow-[0_0_28px_rgba(217,170,70,0.14)]"
                    : "border-transparent text-[#d7d1c4] hover:border-[#d9aa46]/25 hover:bg-white/5"
                }`}
              >
                <Icon aria-hidden className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <StatusDot status={item.status} />
              </a>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-7">
          <div className="rounded-md border border-[#d9aa46]/20 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-3">
              <Crown aria-hidden className="h-8 w-8 text-[#f6d78b]" />
              <div>
                <p className="font-semibold text-white">Premium Plan</p>
                <p className="text-xs text-[#c8b98e]">Preview valid till 25 Dec 2026</p>
              </div>
            </div>
            <a href="/pricing" className="mt-4 block rounded-md bg-[#d9aa46] px-3 py-2 text-center text-sm font-semibold text-[#11100b]">
              View Plan Details
            </a>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center gap-3">
              <CircleHelp aria-hidden className="h-6 w-6 text-white" />
              <div>
                <p className="font-semibold">Need Help?</p>
                <p className="text-xs text-[#c8b98e]">Our support team is here</p>
              </div>
            </div>
            <a href="/support" className="mt-3 block rounded-md border border-[#d9aa46]/60 px-3 py-2 text-center text-xs font-semibold text-[#f6d78b]">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d9aa46]/15 bg-[#04110f]/88 px-4 py-3 backdrop-blur-xl lg:px-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/5 text-white lg:hidden" aria-label="Menu">
          <Menu aria-hidden className="h-5 w-5" />
        </button>
        <label className="mx-auto flex h-11 w-full max-w-[520px] items-center gap-3 rounded-full border border-white/10 bg-white/[0.065] px-4 text-sm text-[#d9d1bf] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Search aria-hidden className="h-4 w-4 shrink-0 text-[#c8b98e]" />
          <span className="sr-only">Search projects assets and vendors</span>
          <input
            className="min-w-0 flex-1 border-0 bg-transparent outline-none placeholder:text-[#b8aa8c]"
            placeholder="Search Projects, Assets, Vendors..."
          />
        </label>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white" aria-label="Theme">
            <Sun aria-hidden className="h-4 w-4" />
          </button>
          <button className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white" aria-label="Notifications">
            <Bell aria-hidden className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ef3f4d] px-1 text-[10px] font-bold">3</span>
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white" aria-label="Help">
            <CircleHelp aria-hidden className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e8d2ad] text-sm font-bold text-[#091412]">HS</span>
            <span className="hidden sm:block">
              <span className="block text-sm font-semibold leading-4 text-white">Hemant Samwat</span>
              <span className="block text-xs text-[#d9aa46]">Premium Plan</span>
            </span>
            <ChevronDown aria-hidden className="h-4 w-4 text-[#c8b98e]" />
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[330px] overflow-hidden rounded-md border border-[#d9aa46]/20 bg-[#061714] shadow-[0_30px_80px_rgba(0,0,0,0.34)]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.72]"
        style={{ backgroundImage: `url('${dashboardHeroImage}')` }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,17,15,0.98)_0%,rgba(4,17,15,0.76)_34%,rgba(4,17,15,0.22)_66%,rgba(4,17,15,0.78)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#04110f] to-transparent" />
      <div className="relative grid min-h-[330px] gap-6 p-6 md:grid-cols-[1fr_230px] md:p-10">
        <div className="flex max-w-2xl flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f6c96c]">Welcome to</p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#f6d78b] md:text-6xl">
            {projectSummary.name.replace(" CAD Studio", "")}
          </h1>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.32em] text-[#f3ddb1]">TLP Wedding CAD</p>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#f3ead8]">
            A controlled-preview CAD dashboard for designing, planning, presenting, and verifying luxury wedding production spaces.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/projects/new" className="rounded-md bg-[#d9aa46] px-7 py-3 text-sm font-bold text-[#11100b] shadow-[0_14px_30px_rgba(217,170,70,0.25)]">
              Create New Project
            </a>
            <a href="/cad/editor" className="inline-flex items-center gap-2 rounded-md border border-[#d9aa46]/35 bg-black/25 px-5 py-3 text-sm font-semibold text-white">
              <span className="grid h-7 w-7 place-items-center rounded-full border border-[#d9aa46]/50 text-[#f6d78b]">
                <Camera aria-hidden className="h-3.5 w-3.5" />
              </span>
              Open CAD Editor
            </a>
          </div>
        </div>
        <div className="grid content-center gap-3">
          <HeroKpi icon={Gem} value="128+" label="Projects Completed" status="PARTIAL" />
          <HeroKpi icon={Blocks} value="3500+" label="Assets Available" status="READY" />
          <HeroKpi icon={Handshake} value="75+" label="Vendors Connected" status="BLOCKED" />
          <HeroKpi icon={Sparkles} value="98%" label="Client Satisfaction" status="PARTIAL" />
        </div>
      </div>
    </section>
  );
}

function PreviewRuntimeCoverage() {
  const cards = [
    { label: "Route Frames", value: `${previewFrameRuntimeSummary.routeFramesReady}/${previewFrameRuntimeSummary.routeFrames}`, status: "READY" as CapabilityStatus },
    { label: "Demo Data Frames", value: previewFrameRuntimeSummary.routeFramesWithDemoData, status: "READY" as CapabilityStatus },
    { label: "Local Coverage Checks", value: previewFrameRuntimeSummary.totalLocalCoveragePoints, status: "READY" as CapabilityStatus },
    { label: "UI Frames", value: `${previewFrameRuntimeSummary.uiFramesReady}/${previewFrameRuntimeSummary.uiFrames}`, status: "READY" as CapabilityStatus },
    { label: "Production Blockers", value: blockedCapabilities.length, status: "BLOCKED" as CapabilityStatus }
  ];

  return (
    <section className="rounded-md border border-[#d9aa46]/20 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d9aa46]">Preview-ready frames</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Demo data and local runtime coverage</h2>
        </div>
        <StatusPill status="READY" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-md border border-white/10 bg-black/20 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#c8b98e]">{card.label}</p>
              <StatusDot status={card.status} />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#f6d78b]">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function QuickActions() {
  return (
    <section className="border-b border-[#d9aa46]/12 border-t border-[#d9aa46]/12 py-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-white">Quick Actions</p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <a
              key={action.label}
              href={action.href}
              className="flex min-h-12 items-center justify-center gap-3 rounded-md border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition hover:border-[#d9aa46]/35 hover:bg-white/[0.1]"
            >
              <Icon aria-hidden className="h-4 w-4 text-[#f6d78b]" />
              <span>{action.label}</span>
              <StatusDot status={action.status} />
            </a>
          );
        })}
      </div>
    </section>
  );
}

function AnimatedKpiWidgets() {
  const readyModules = premiumModules.filter((module) => module.status === "READY").length;
  const partialModules = premiumModules.filter((module) => module.status === "PARTIAL").length;
  const blockedModules = premiumModules.filter((module) => module.status === "BLOCKED").length;
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.estimatedInr, 0);
  const kpis = [
    { label: "Ready Modules", value: readyModules, suffix: "/12", status: "READY" as CapabilityStatus, icon: CheckCircle2, color: "#72e18e" },
    { label: "Preview Budget", value: `₹${(totalBudget / 100000).toFixed(1)}L`, suffix: "", status: "READY" as CapabilityStatus, icon: BarChart3, color: "#f6d78b" },
    { label: "CAD Objects", value: cadObjects.length, suffix: "", status: "READY" as CapabilityStatus, icon: Layers3, color: "#54e5ed" },
    { label: "Partial Workflows", value: partialModules, suffix: "", status: (partialModules ? "PARTIAL" : "READY") as CapabilityStatus, icon: Clock3, color: partialModules ? "#f6d78b" : "#72e18e" },
    { label: "Blocked Capabilities", value: blockedModules + blockedCapabilities.length, suffix: "", status: "BLOCKED" as CapabilityStatus, icon: AlertTriangle, color: "#ff6b8a" }
  ];

  return (
    <section className="grid gap-3 py-4 sm:grid-cols-2 xl:grid-cols-5">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <article
            key={kpi.label}
            className="relative overflow-hidden rounded-md border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            <span
              className="absolute right-4 top-4 h-9 w-9 rounded-full opacity-30 blur-md animate-pulse"
              style={{ backgroundColor: kpi.color, animationDelay: `${index * 140}ms` }}
            />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c8b98e]">{kpi.label}</p>
                <p className="mt-2 text-3xl font-bold" style={{ color: kpi.color }}>
                  {kpi.value}
                  <span className="text-base text-[#e7d9bd]">{kpi.suffix}</span>
                </p>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-md border border-white/10 bg-black/24" style={{ color: kpi.color }}>
                <Icon aria-hidden className="h-5 w-5" />
              </span>
            </div>
            <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-black/30">
              <span
                className="block h-full rounded-full"
                style={{
                  width: kpi.status === "READY" ? "92%" : kpi.status === "PARTIAL" ? "58%" : "28%",
                  backgroundColor: kpi.color,
                  boxShadow: `0 0 18px ${kpi.color}`
                }}
              />
            </div>
            <div className="relative mt-3">
              <StatusPill status={kpi.status} />
            </div>
          </article>
        );
      })}
    </section>
  );
}

function CommandDeck() {
  return (
    <section className="grid gap-4 py-4 xl:grid-cols-[1.15fr_0.85fr]">
      <LiveCadPreviewCard />
      <ObservatoryWidgets />
    </section>
  );
}

function LiveCadPreviewCard() {
  return (
    <article className="overflow-hidden rounded-md border border-[#54e5ed]/25 bg-[#061816] shadow-[0_0_44px_rgba(84,229,237,0.12)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#54e5ed]">Live CAD Preview</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Hemant Samwat wedding scene</h2>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status="READY" />
          <a href="/cad/editor" className="rounded-md border border-[#54e5ed]/40 px-3 py-2 text-xs font-bold text-[#9ff5ff]">
            Open Editor
          </a>
        </div>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-[1fr_230px]">
        <div className="relative min-h-[360px] overflow-hidden rounded-md border border-[#54e5ed]/18 bg-[#081512]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(84,229,237,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(84,229,237,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-[#ff5da2] bg-[#ff5da2]/10 shadow-[0_0_36px_rgba(255,93,162,0.28)]" />
          <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#f6d78b]/45" />
          <div className="absolute left-[47%] top-[31%] h-7 w-7 rounded-full bg-[#f6d78b] shadow-[0_0_22px_rgba(246,215,139,0.7)] animate-pulse" />
          <div className="absolute bottom-9 left-[18%] h-12 w-28 rounded bg-[#72e18e]/18 ring-1 ring-[#72e18e]/35" />
          <div className="absolute bottom-10 right-[17%] h-14 w-32 rounded bg-[#d9aa46]/18 ring-1 ring-[#d9aa46]/35" />
          <div className="absolute right-[21%] top-[18%] h-16 w-24 rounded bg-[#54e5ed]/15 ring-1 ring-[#54e5ed]/35" />
          <div className="absolute left-[10%] top-[22%] h-10 w-10 rounded-full border border-[#95e75f]/45 bg-[#95e75f]/14" />
          {Array.from({ length: 18 }).map((_, index) => (
            <span
              key={index}
              className="absolute h-2.5 w-2.5 rounded-sm bg-[#f8f0df]/80 shadow-[0_0_10px_rgba(248,240,223,0.55)]"
              style={{
                left: `${18 + (index % 9) * 7}%`,
                top: `${58 + Math.floor(index / 9) * 9}%`
              }}
            />
          ))}
        </div>
        <div className="space-y-3">
          <MetricRow label="Objects" value={cadObjects.length} status="READY" />
          <MetricRow label="Layers" value={layers.length} status="READY" />
          <MetricRow label="Fixtures" value={lightingFixtures.reduce((sum, fixture) => sum + fixture.count, 0)} status="READY" />
          <MetricRow label="DWG/DXF" value="Blocked" status="BLOCKED" />
          <div className="rounded-md border border-[#f6d78b]/20 bg-black/20 p-3">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#f6d78b]">Scene Mode</p>
            <p className="mt-2 text-sm leading-6 text-[#ddd3c2]">
              Preview canvas is live-data backed. Production CAD compliance and structural safety remain blocked.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function MarketplaceCarousel() {
  return (
    <section className="py-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9aa46]">Template Marketplace Carousel</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Preview templates with commerce honestly blocked</h2>
        </div>
        <StatusPill status="BLOCKED" />
      </div>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 studio-scrollbar">
        {marketplaceTemplates.map((template) => (
          <a
            key={template.name}
            href={template.route}
            className="relative min-h-52 w-[280px] shrink-0 overflow-hidden rounded-md border bg-[#071a17] p-4"
            style={{ borderColor: `${template.accent}55`, boxShadow: `0 0 28px ${template.accent}24` }}
          >
            <div className="absolute inset-x-4 top-4 h-24 rounded-md bg-cover bg-center opacity-75" style={{ backgroundImage: `url('${templatesHeroImage}')` }} />
            <div className="absolute inset-x-4 top-4 h-24 rounded-md bg-gradient-to-t from-[#071a17] via-transparent to-transparent" />
            <div className="relative pt-28">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold" style={{ color: template.accent }}>{template.name}</h3>
                <StatusPill status={template.status} />
              </div>
              <p className="mt-2 text-sm text-[#ddd3c2]">{template.price}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#d8c9a6]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ModuleGrid() {
  return (
    <section className="py-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9aa46]">Ideal TLP Wedding CAD Modules</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Luxury planning modules with honest readiness</h2>
        </div>
        <a href="/observatory" className="text-sm font-semibold text-[#f6d78b]">View status matrix</a>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {premiumModules.map((module, index) => (
          <NeonModuleCard key={`${module.title}-${index}`} module={module} />
        ))}
      </div>
    </section>
  );
}

function ProductionWidgets() {
  return (
    <section className="grid gap-4 py-4 xl:grid-cols-[1fr_0.9fr]">
      <ProjectTimelineWidget />
      <BudgetSummaryWidget />
    </section>
  );
}

function ObservatoryWidgets() {
  const readyEvents = observatoryEvents.filter((event) => event.status === "READY").length;
  const blockedEvents = observatoryEvents.filter((event) => event.status === "BLOCKED").length;

  return (
    <article className="rounded-md border border-[#d9aa46]/20 bg-white/[0.045] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9aa46]">Observatory Widgets</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Release gate and evidence pulse</h2>
        </div>
        <ShieldCheck aria-hidden className="h-6 w-6 text-[#72e18e]" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <MetricRow label="Verdict" value={releaseStatus.verdict.replaceAll("_", " ")} status="READY" />
        <MetricRow label="Production" value="false" status="BLOCKED" />
        <MetricRow label="Ready Events" value={readyEvents} status="READY" />
        <MetricRow label="Blocked Events" value={blockedEvents + blockedCapabilities.length} status="BLOCKED" />
      </div>
      <div className="mt-4 space-y-2">
        {observatoryEvents.slice(-4).map((event) => (
          <div key={event.id} className="flex items-center gap-3 rounded-md border border-white/10 bg-black/20 p-3">
            <Activity aria-hidden className="h-4 w-4 text-[#f6d78b]" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-white">{event.label}</span>
              <span className="block text-xs text-[#c8b98e]">{event.category}</span>
            </span>
            <StatusPill status={event.status} />
          </div>
        ))}
      </div>
    </article>
  );
}

function ProjectTimelineWidget() {
  return (
    <article className="rounded-md border border-[#d9aa46]/18 bg-white/[0.045] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9aa46]">Project Timeline Widget</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Hemant Samwat delivery path</h2>
        </div>
        <Clock3 aria-hidden className="h-6 w-6 text-[#f6d78b]" />
      </div>
      <div className="mt-5 space-y-3">
        {timelineSteps.map((step, index) => (
          <div key={step.label} className="grid grid-cols-[82px_18px_1fr_auto] items-start gap-3">
            <span className="text-xs font-semibold text-[#c8b98e]">{step.date}</span>
            <span className="relative mt-1 flex h-full justify-center">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: statusColor(step.status), boxShadow: `0 0 12px ${statusColor(step.status)}` }} />
              {index < timelineSteps.length - 1 && <span className="absolute top-4 h-12 w-px bg-white/12" />}
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">{step.label}</span>
              <span className="mt-1 block text-xs leading-5 text-[#c8b98e]">{step.detail}</span>
            </span>
            <StatusPill status={step.status} />
          </div>
        ))}
      </div>
    </article>
  );
}

function BudgetSummaryWidget() {
  const total = budgetItems.reduce((sum, item) => sum + item.estimatedInr, 0);
  const quoted = budgetItems.filter((item) => item.status === "quoted").reduce((sum, item) => sum + item.estimatedInr, 0);
  const blocked = budgetItems.filter((item) => item.status === "blocked").length;

  return (
    <article className="rounded-md border border-[#d9aa46]/18 bg-white/[0.045] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9aa46]">Budget Summary Widget</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Preview BOQ and blocked export cost</h2>
        </div>
        <Calculator aria-hidden className="h-6 w-6 text-[#f6d78b]" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <MetricRow label="Estimate" value={`₹${(total / 100000).toFixed(1)}L`} status="READY" />
        <MetricRow label="Quoted" value={`₹${(quoted / 100000).toFixed(1)}L`} status="READY" />
        <MetricRow label="Blocked" value={blocked} status={blocked ? "BLOCKED" : "READY"} />
      </div>
      <div className="mt-4 space-y-3">
        {budgetItems.map((item) => {
          const status: CapabilityStatus = item.status === "blocked" ? "BLOCKED" : item.status === "quoted" ? "READY" : "PARTIAL";
          return (
            <div key={item.id} className="rounded-md border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-sm font-semibold text-white">{item.label}</span>
                <StatusPill status={status} />
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/30">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: item.estimatedInr ? `${Math.max(12, Math.round((item.estimatedInr / total) * 100))}%` : "8%",
                    backgroundColor: statusColor(status)
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function GalleryWidgets() {
  return (
    <section className="grid gap-4 py-4 xl:grid-cols-2">
      <RecentRenderGallery />
      <RecentExportGallery />
    </section>
  );
}

function RecentRenderGallery() {
  const renders = [
    ...renderJobs,
    { id: "render-material", label: "Material board render", camera: "orthographic", status: "READY" as const, output: "preview board" },
    { id: "render-drone", label: "Drone orbit preview", camera: "orbit", status: "READY" as const, output: "preview path ready; flight compliance blocked" }
  ];

  return (
    <article className="rounded-md border border-[#54e5ed]/18 bg-white/[0.045] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#54e5ed]">Recent Render Gallery</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Visual outputs from preview runtime</h2>
        </div>
        <Image aria-hidden className="h-6 w-6 text-[#54e5ed]" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {renders.map((render, index) => (
          <div key={render.id} className="overflow-hidden rounded-md border border-white/10 bg-black/20">
            <div
              className="h-28 bg-cover bg-center"
              style={{
                backgroundImage: `url('${renderGalleryImages[index % renderGalleryImages.length]}')`,
                filter: index % 2 ? "hue-rotate(22deg) saturate(1.25)" : "saturate(1.08)"
              }}
            />
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-white">{render.label}</p>
                <StatusPill status={render.status} />
              </div>
              <p className="mt-1 text-xs text-[#c8b98e]">{render.camera} · {render.output}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function RecentExportGallery() {
  return (
    <article className="rounded-md border border-[#d9aa46]/18 bg-white/[0.045] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#d9aa46]">Recent Export Gallery</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Export jobs with blocked CAD formats visible</h2>
        </div>
        <FileText aria-hidden className="h-6 w-6 text-[#f6d78b]" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {exportJobs.map((job) => (
          <a key={job.id} href="/exports" className="rounded-md border border-white/10 bg-black/20 p-3 transition hover:border-[#d9aa46]/35">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md bg-[#d9aa46]/12 text-[#f6d78b]">
                <FileJson aria-hidden className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-white">{job.label}</span>
                  <StatusPill status={job.status} />
                </span>
                <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-[#c8b98e]">{job.format}</span>
                <span className="mt-2 block line-clamp-2 text-xs leading-5 text-[#c8b98e]">{job.evidence}</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </article>
  );
}

function NeonModuleCard({ module }: { module: PremiumModule }) {
  const Icon = module.icon;
  return (
    <a
      href={module.href}
      className="group relative min-h-[170px] overflow-hidden rounded-md border bg-[#0a1916] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:-translate-y-0.5"
      style={{ borderColor: `${module.accent}66`, boxShadow: `0 0 34px ${module.glow}` }}
    >
      <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(circle at 74% 22%, ${module.glow}, transparent 34%)` }} />
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border" style={{ borderColor: `${module.accent}55` }} />
      <div className="relative flex items-start justify-between gap-3">
        <div className="grid h-16 w-20 place-items-center rounded-md bg-black/24" style={{ color: module.accent }}>
          <Icon aria-hidden className="h-10 w-10 drop-shadow-[0_0_12px_currentColor]" />
        </div>
        <StatusPill status={module.status} />
      </div>
      <div className="relative mt-4">
        <h3 className="text-base font-bold" style={{ color: module.accent }}>{module.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#ddd3c2]">{module.description}</p>
        <p className="mt-4 text-sm font-semibold" style={{ color: module.accent }}>Explore →</p>
      </div>
    </a>
  );
}

function DashboardBottom() {
  const budget = "22.0L";
  const recentProjects = [
    { name: "Hemant Samwat Wedding", place: "Lotus Palace Lawns", status: "READY" as CapabilityStatus },
    { name: "Garden Wedding", place: "Mumbai, Maharashtra", status: "READY" as CapabilityStatus },
    { name: "Beach Wedding", place: "Goa", status: "READY" as CapabilityStatus }
  ];
  const activity = [
    { label: "Mandap Model V2", by: "Updated by Hemant Samwat", at: "10 mins ago", status: "READY" as CapabilityStatus },
    { label: "Lighting Plan Final", by: "Updated by Neha Singh", at: "45 mins ago", status: "READY" as CapabilityStatus },
    { label: "Venue Layout Plan", by: "Updated by Planning Team", at: "2 hours ago", status: "READY" as CapabilityStatus }
  ];

  return (
    <section className="grid gap-4 pb-2 xl:grid-cols-[1fr_1.3fr_1.1fr]">
      <article className="rounded-md border border-[#d9aa46]/18 bg-white/[0.045] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-white">Recent Projects</h2>
          <a href="/projects" className="text-xs font-semibold text-[#f6d78b]">View All →</a>
        </div>
        <div className="mt-4 space-y-3">
          {recentProjects.map((project) => (
            <a key={project.name} href="/projects" className="flex items-center gap-3 rounded-md border border-white/10 bg-black/20 p-2">
              <span className="h-14 w-16 rounded-md border border-[#d9aa46]/25 bg-cover bg-center" style={{ backgroundImage: `url('${dashboardHeroImage}')` }} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-white">{project.name}</span>
                <span className="block truncate text-xs text-[#c8b98e]">{project.place}</span>
              </span>
              <StatusPill status={project.status} />
            </a>
          ))}
        </div>
      </article>

      <article className="rounded-md border border-[#d9aa46]/18 bg-white/[0.045] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-white">Project Statistics</h2>
            <p className="mt-1 text-xs text-[#c8b98e]">This month overview</p>
          </div>
          <span className="rounded-md border border-white/10 px-3 py-2 text-xs text-[#d8c9a6]">This Month</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard value="12" label="Projects Created" color="#54e5ed" />
          <StatCard value="8" label="Projects Completed" color="#ffcc45" />
          <StatCard value={String(renderJobs.length + 23)} label="Designs Exported" color="#ca76ff" />
          <StatCard value={budget} label="Preview Budget" color="#95e75f" />
        </div>
      </article>

      <article className="rounded-md border border-[#d9aa46]/18 bg-white/[0.045] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-white">Recent Activity</h2>
          <a href="/observatory" className="text-xs font-semibold text-[#f6d78b]">View All →</a>
        </div>
        <div className="mt-4 divide-y divide-white/10">
          {activity.map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-[#d9aa46]/12 text-[#f6d78b]">
                <FileUp aria-hidden className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-white">{item.label}</span>
                <span className="block truncate text-xs text-[#c8b98e]">{item.by}</span>
              </span>
              <span className="text-xs text-[#c8b98e]">{item.at}</span>
              <StatusDot status={item.status} />
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function MetricRow({ label, value, status }: { label: string; value: string | number; status: CapabilityStatus }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#c8b98e]">{label}</p>
        <StatusDot status={status} />
      </div>
      <p className="mt-2 break-words text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function HeroKpi({
  icon: Icon,
  value,
  label,
  status
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  value: string;
  label: string;
  status: CapabilityStatus;
}) {
  return (
    <div className="rounded-md border border-[#d9aa46]/25 bg-black/30 p-4 backdrop-blur">
      <div className="flex items-center gap-4">
        <Icon aria-hidden className="h-8 w-8 text-[#f6d78b]" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-[#f6d78b]">{value}</p>
            <StatusDot status={status} />
          </div>
          <p className="text-xs text-[#f1e1c1]">{label}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/18 p-4 text-center" style={{ boxShadow: `inset 0 0 22px ${color}22` }}>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="mt-1 text-xs text-[#d8c9a6]">{label}</p>
    </div>
  );
}

function StatusPill({ status }: { status: CapabilityStatus }) {
  const classes = {
    READY: "border-[#72e18e]/35 bg-[#72e18e]/12 text-[#9af2ad]",
    PARTIAL: "border-[#f6d78b]/35 bg-[#d9aa46]/12 text-[#f6d78b]",
    BLOCKED: "border-[#ff6b8a]/35 bg-[#ff6b8a]/12 text-[#ff9aac]"
  };

  return (
    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${classes[status]}`}>
      {status}
    </span>
  );
}

function StatusDot({ status }: { status: CapabilityStatus }) {
  const color = status === "READY" ? "#72e18e" : status === "PARTIAL" ? "#f6d78b" : "#ff6b8a";
  return <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} title={status} />;
}

function statusColor(status: CapabilityStatus) {
  if (status === "READY") return "#72e18e";
  if (status === "PARTIAL") return "#f6d78b";
  return "#ff6b8a";
}
