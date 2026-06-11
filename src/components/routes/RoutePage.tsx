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
import {
  ActiveStepsPanel,
  BlockerPanel,
  CapabilityCard,
  DemoDataCards,
  EvidenceRefPanel,
  ModuleActionBar,
  ModuleLinkButton,
  PageStatusHeader,
  RouteMetric,
  RuntimeCoveragePanel,
  ScreenPreviewCard,
  UseCaseDemoFlowPanel,
  UsecaseGrid
} from "@/components/routes/active-page-components";
import { BoardComposerKnowledgePanel, CopilotKnowledgePanel } from "@/components/routes/KbsPanels";
import { buildBoardComposerPanel, buildCopilotPanel } from "@/lib/kbs/surfaces";
import { cadObjects, projectSummary } from "@/lib/data-frames";
import { getActiveRoutePage, type ActiveRoutePage } from "@/lib/route-page-runtime";
import { routeMatrix, type RouteDefinition } from "@/lib/route-matrix";
import { blockedCapabilities } from "@/lib/status";
import { Monitor, PackageCheck, ShieldAlert } from "lucide-react";

export function RoutePage({ route, slug = [] }: { route: RouteDefinition; slug?: string[] }) {
  const activePage = getActiveRoutePage(route.path);
  const nestedPath = slug.length ? `/${slug.join("/")}` : "";
  const resolvedRoutePath = nestedPath ? `${activePage.routePath}${nestedPath}` : activePage.routePath;

  return (
    <StudioShell>
      <div className="px-4 py-6 lg:px-8">
        <PageStatusHeader page={activePage} resolvedRoutePath={resolvedRoutePath} nestedPath={nestedPath} />

        <div className="mt-6 grid gap-6">
          <ProjectStats />
          <PrimaryFrame route={route} />
          <ModuleActionBar actions={activePage.moduleActions} />

          <section className="grid gap-4 xl:grid-cols-[0.72fr_1fr]">
            <ScreenPreviewCard screen={activePage.cinematicScreen} />
            <ActiveStepsPanel steps={activePage.activeSteps} />
          </section>

          {route.path.includes("/ai") && <CopilotKnowledgePanel panel={buildCopilotPanel(route.path)} />}
          {(route.path.includes("/exports") || route.path.includes("/gallery")) && (
            <BoardComposerKnowledgePanel panel={buildBoardComposerPanel()} />
          )}

          <UsecaseGrid useCases={activePage.useCases} />
          <UseCaseDemoFlowPanel flows={activePage.demoFlows} />

          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <DemoDataCards demoData={activePage.demoData} />
            <RuntimeCoveragePanel coverage={activePage.localRuntimeCoverage} />
          </section>

          <RouteCapabilitySection activePage={activePage} />

          <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <BlockerPanel blockers={activePage.routeSpecificBlockers} />
            <EvidenceRefPanel evidenceRefs={activePage.evidenceRefs} />
          </section>

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

function RouteCapabilitySection({ activePage }: { activePage: ActiveRoutePage }) {
  const route = activePage.route;
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Module Capabilities</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {route.capabilities.map((capability) => (
            <CapabilityCard key={capability} capability={capability} />
          ))}
        </div>
        {route.path.includes("/cad") && <div className="mt-4"><ModuleLinkButton href="/cad/editor" label="Open CAD editor" /></div>}
      </article>

      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Active Page Data</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <DataPoint label="Project" value={projectSummary.name} />
          <DataPoint label="Objects" value={cadObjects.length} />
          <DataPoint label="Route frames" value={routeMatrix.length} />
          <DataPoint label="Blocked" value={blockedCapabilities.length} />
          <DataPoint label="Demo points" value={activePage.demoData.length} />
          <DataPoint label="Coverage checks" value={activePage.localRuntimeCoverage.length} />
        </dl>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <RouteMetric icon={PackageCheck} label="Use cases" value={activePage.useCases.length} />
          <RouteMetric icon={Monitor} label="Screens" value={activePage.screenRefs.length} />
          <RouteMetric icon={ShieldAlert} label="Assets" value={activePage.assetRefs.length} />
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
