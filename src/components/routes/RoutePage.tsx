import { ArrowRight, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/layout/StatusBadge";
import {
  ActivityAndExports,
  AssetAndLayerPanels,
  BoardFrameGrid,
  MandapAndStagePreview,
  ObservatoryMatrix,
  PlanningPanels,
  ProjectStats,
  SiteLayoutPreview
} from "@/components/frames/BoardFrames";
import { StudioShell } from "@/components/layout/StudioShell";
import { cadObjects, projectSummary } from "@/lib/data-frames";
import { getPreviewRouteFrame, type PreviewRouteFrameRuntime } from "@/lib/preview-frame-runtime";
import { routeMatrix, type RouteDefinition } from "@/lib/route-matrix";
import { blockedCapabilities, statusCopy } from "@/lib/status";
import { getHeroBannerForRoute } from "@/lib/hero-banner-registry";
import { getCinematicImageForSource } from "@/lib/cinematic-image-assets";

export function RoutePage({ route, slug = [] }: { route: RouteDefinition; slug?: string[] }) {
  const nestedPath = slug.length ? `/${slug.join("/")}` : "";
  const previewFrame = getPreviewRouteFrame(route.path);
  const hero = getHeroBannerForRoute(route.path.replace("*", slug.length ? slug.join("/") : ""));
  return (
    <StudioShell>
      <div className="px-4 py-6 lg:px-8">
        <section className="relative overflow-hidden rounded-md border border-[#d9aa46]/22 bg-[#04110f] p-5 shadow-studio">
          <img src={getCinematicImageForSource(hero.hiresImage, "cinematic-21x9")} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,8,0.92),rgba(2,9,8,0.66)_48%,rgba(2,9,8,0.25))]" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#03110f] to-transparent" />
          <div className="relative flex min-h-[250px] flex-wrap items-start justify-between gap-4">
            <div className="max-w-4xl self-end">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={route.status} />
                <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-basalt/65">
                  {route.kind}
                </span>
                <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-basalt/65">
                  {route.primaryFrame}
                </span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f8d78b]">{hero.title}</p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-5xl">{route.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/76">{route.description}</p>
              <p className="mt-3 text-sm font-medium text-white/64">{statusCopy[route.status]}</p>
            </div>
            <div className="rounded-md border border-white/12 bg-black/38 p-4 text-sm text-white/74 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Current route</p>
              <p className="mt-2 font-semibold text-white">{route.path.replace("*", slug.length ? slug.join("/") : "index")}</p>
              <p className="mt-1 text-xs text-white/50">Hero: {hero.slug}</p>
              {nestedPath && <p className="mt-1 text-xs text-white/50">Nested frame: {nestedPath}</p>}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6">
          <ProjectStats />
          <PrimaryFrame route={route} />
          <PreviewRuntimeSection frame={previewFrame} />
          <RouteCapabilitySection route={route} frame={previewFrame} />
          <ObservatoryMatrix />
        </div>
      </div>
    </StudioShell>
  );
}

function PrimaryFrame({ route }: { route: RouteDefinition }) {
  const frame = route.primaryFrame;
  if (frame.includes("site layout") || route.path.includes("venue") || route.path.includes("drone")) {
    return <SiteLayoutPreview />;
  }
  if (frame.includes("mandap") || frame.includes("stage") || route.path.includes("mandap")) {
    return <MandapAndStagePreview />;
  }
  if (frame.includes("asset") || route.path.includes("assets") || route.path.includes("marketplace") || route.path.includes("templates")) {
    return <AssetAndLayerPanels />;
  }
  if (frame.includes("lighting") || frame.includes("floral") || frame.includes("material")) {
    return <PlanningPanels />;
  }
  if (frame.includes("export") || route.path.includes("exports") || route.path.includes("production")) {
    return <ActivityAndExports />;
  }
  if (frame.includes("observatory") || route.path.includes("admin") || route.path.includes("support") || route.path.includes("observatory")) {
    return <ObservatoryMatrix />;
  }
  return <BoardFrameGrid />;
}

function PreviewRuntimeSection({ frame }: { frame: PreviewRouteFrameRuntime }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-basalt/55">Preview-ready frame</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">Demo Data</h2>
            <p className="mt-1 text-sm leading-6 text-basalt/70">
              This frame is backed by typed demo records and local runtime coverage.
            </p>
          </div>
          <StatusBadge status={frame.status} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {frame.demoData.map((item) => (
            <div key={`${frame.routePath}-${item.label}`} className="rounded-md border border-ink/10 bg-ivory p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-basalt/55">{item.label}</p>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-2 text-base font-semibold text-ink">{item.value}</p>
              <p className="mt-1 text-xs text-basalt/55">{item.source}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-basalt/55">Local runtime coverage</p>
            <h2 className="mt-1 text-lg font-semibold text-ink">{frame.frameTitle}</h2>
          </div>
          <StatusBadge status="READY" />
        </div>
        <div className="mt-4 space-y-3">
          {frame.localRuntimeCoverage.map((coverage) => (
            <div key={`${frame.routePath}-${coverage.label}`} className="rounded-md border border-ink/10 bg-ivory p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink">{coverage.label}</p>
                <StatusBadge status={coverage.status} />
              </div>
              <p className="mt-1 text-xs text-basalt/60">{coverage.evidence}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-md border border-lotus/20 bg-lotus/10 p-3">
          <p className="text-sm font-semibold text-lotus">Honest Blockers</p>
          {frame.honestBlockers.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {frame.honestBlockers.map((blocker) => (
                <span key={`${frame.routePath}-${blocker.id}`} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-basalt">
                  {blocker.label}: {blocker.status}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-basalt/70">No route-specific production blocker beyond the global release gate.</p>
          )}
        </div>
      </article>
    </section>
  );
}

function RouteCapabilitySection({ route, frame }: { route: RouteDefinition; frame: PreviewRouteFrameRuntime }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Module Capabilities</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {route.capabilities.map((capability) => (
            <div key={capability} className="flex items-center gap-3 rounded-md border border-ink/10 bg-ivory p-3">
              <ArrowRight aria-hidden className="h-4 w-4 text-neem" />
              <span className="text-sm font-medium text-basalt">{capability}</span>
            </div>
          ))}
        </div>
        {route.path.includes("/cad") && (
          <a
            href="/cad/editor"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white"
          >
            Open CAD editor
            <ExternalLink aria-hidden className="h-4 w-4" />
          </a>
        )}
      </article>
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Preview Data</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <DataPoint label="Project" value={projectSummary.name} />
          <DataPoint label="Objects" value={cadObjects.length} />
          <DataPoint label="Route frames" value={routeMatrix.length} />
          <DataPoint label="Blocked" value={blockedCapabilities.length} />
          <DataPoint label="Demo points" value={frame.demoData.length} />
          <DataPoint label="Coverage checks" value={frame.localRuntimeCoverage.length} />
        </dl>
        <div className="mt-4 rounded-md border border-ink/10 bg-ivory p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-basalt/55">Evidence refs</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {frame.evidenceRefs.map((ref) => (
              <span key={`${frame.routePath}-${ref}`} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-basalt">
                {ref}
              </span>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}

function DataPoint({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-mist p-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-basalt/55">{label}</dt>
      <dd className="mt-1 font-semibold text-ink">{value}</dd>
    </div>
  );
}
