import { ArrowRight, CheckCircle2, ExternalLink, Monitor, PackageCheck, ShieldAlert } from "lucide-react";
import { StatusBadge } from "@/components/layout/StatusBadge";
import type { ActiveWorkflowStep } from "@/lib/active-step-runtime";
import type { ActiveRoutePage, ModuleAction } from "@/lib/route-page-runtime";
import type { LocalRuntimeCoverage, PreviewDemoDatum } from "@/lib/preview-frame-runtime";
import type { CategoryDemoUseCase, DemoAssetRef, DemoScreenRef } from "@/lib/usecase-runtime";
import { statusCopy } from "@/lib/status";

export function PageStatusHeader({
  page,
  resolvedRoutePath,
  nestedPath
}: {
  page: ActiveRoutePage;
  resolvedRoutePath: string;
  nestedPath?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-md border border-[#d9aa46]/22 bg-[#04110f] p-5 shadow-studio">
      <img src={page.cinematicScreen.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,8,0.92),rgba(2,9,8,0.66)_48%,rgba(2,9,8,0.25))]" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#03110f] to-transparent" />
      <div className="relative flex min-h-[250px] flex-wrap items-start justify-between gap-4">
        <div className="max-w-4xl self-end">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={page.status} />
            <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-basalt/65">
              {page.route.kind}
            </span>
            <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-basalt/65">
              Preview-ready frame: {page.previewFrame.frameTitle}
            </span>
            <span className="rounded-full border border-rose-300/20 bg-rose-300/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-rose-100">
              PRODUCTION_READY=false
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f8d78b]">CONTROLLED_PREVIEW_READY</p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-5xl">{page.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/76">{page.route.description}</p>
          <p className="mt-3 text-sm font-medium text-white/64">{statusCopy[page.status]}</p>
        </div>
        <div className="rounded-md border border-white/12 bg-black/38 p-4 text-sm text-white/74 backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Current route</p>
          <p className="mt-2 font-semibold text-white">{resolvedRoutePath || "/"}</p>
          <p className="mt-1 text-xs text-white/50">Active steps: {page.activeSteps.length}</p>
          <p className="mt-1 text-xs text-white/50">Use cases: {page.useCases.length}</p>
          <p className="mt-1 text-xs text-white/50">Screen refs: {page.screenRefs.length}</p>
          {nestedPath && <p className="mt-1 text-xs text-white/50">Nested frame: {nestedPath}</p>}
        </div>
      </div>
    </section>
  );
}

export function ModuleActionBar({ actions }: { actions: ModuleAction[] }) {
  return (
    <section className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-basalt/55">Module actions</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Active Page Tools</h2>
        </div>
        <StatusBadge status="READY" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <div key={action.id} className="rounded-md border border-ink/10 bg-ivory p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink">{action.label}</p>
              <StatusBadge status={action.status} />
            </div>
            <p className="mt-2 text-xs leading-5 text-basalt/65">{action.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ActiveStepsPanel({ steps }: { steps: ActiveWorkflowStep[] }) {
  return (
    <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-basalt/55">Active steps</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Page Action Plan</h2>
        </div>
        <StatusBadge status="READY" />
      </div>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={step.id} className="rounded-md border border-ink/10 bg-ivory p-3">
            <div className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#d9aa46]/18 text-xs font-semibold text-ink">
                {index + 1}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-basalt/55">{step.label}</p>
                  <StatusBadge status={step.status} />
                </div>
                <p className="mt-1 text-sm leading-6 text-basalt/78">{step.summary}</p>
                <p className="mt-1 text-[11px] text-basalt/50">{step.evidenceRef}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

export function UsecaseGrid({ useCases }: { useCases: CategoryDemoUseCase[] }) {
  return (
    <section className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-basalt/55">Active route use cases</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">3-4 Registry Workflows</h2>
        </div>
        <StatusBadge status="READY" />
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-4">
        {useCases.map((useCase) => (
          <article key={useCase.id} data-route-usecase={useCase.id} className="rounded-md border border-ink/10 bg-ivory p-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={useCase.status} />
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-basalt/60">
                {useCase.stage}
              </span>
            </div>
            <h3 className="mt-3 min-h-12 text-sm font-semibold leading-5 text-ink">{useCase.title}</h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-basalt/50">Problem solved</p>
            <p className="mt-1 min-h-20 text-xs leading-5 text-basalt/70">{useCase.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {uniqueUseCaseRoutes(useCase).slice(0, 4).map((route) => (
                <a key={`${useCase.id}-${route}`} href={route} className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-basalt/70">
                  {route}
                </a>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {useCase.assetRefs.slice(0, 2).map((asset) => (
                <AssetRefCard key={`${useCase.id}-${asset.id}`} asset={asset} />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {useCase.screens.map((screen) => (
                <ScreenPreviewCard key={screen.id} screen={screen} compact />
              ))}
            </div>
            <ol className="mt-3 space-y-2">
              {useCase.steps.slice(0, 3).map((step) => (
                <li key={`${useCase.id}-${step}`} className="flex gap-2 text-xs leading-5 text-basalt/72">
                  <CheckCircle2 aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neem" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 rounded-md border border-lotus/20 bg-white p-2 text-[11px] leading-5 text-basalt/70">
              {useCase.blockedNotes[0]}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function UseCaseDemoFlowPanel({ flows }: { flows: ActiveRoutePage["demoFlows"] }) {
  const chainLabels = flows[0]?.chain ?? ["Use Case", "Active Steps", "Assets", "Screens", "Board Composer", "Export Package", "Evidence Ref"];
  return (
    <section className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-basalt/55">SPRINT-07 demo flow</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Use Case Demo Flow</h2>
        </div>
        <StatusBadge status="READY" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {chainLabels.map((label) => (
          <span key={label} className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ivory px-2.5 py-1 text-[11px] font-semibold text-basalt/75">
            {label}
            {label !== "Evidence Ref" && <ArrowRight aria-hidden className="h-3 w-3 text-[#d9aa46]" />}
          </span>
        ))}
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {flows.map((flow) => (
          <article key={flow.id} data-usecase-demo-flow={flow.id} className="rounded-md border border-ink/10 bg-ivory p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-basalt/55">Use Case</p>
                <h3 className="mt-1 text-sm font-semibold text-ink">{flow.title}</h3>
              </div>
              <StatusBadge status={flow.status} />
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <FlowMetric label="Active Steps" value={flow.activeSteps.length} />
              <FlowMetric label="Assets" value={flow.assetRefs.length} />
              <FlowMetric label="Screens" value={flow.screenRefs.length} />
            </div>

            <ol className="mt-3 space-y-2">
              {flow.activeSteps.map((step, index) => (
                <li key={`${flow.id}-${step.label}-${index}`} className="rounded-md border border-ink/10 bg-white p-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">{step.label}</p>
                  <p className="mt-1 text-xs leading-5 text-basalt/70">{step.summary}</p>
                </li>
              ))}
            </ol>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-md border border-ink/10 bg-white p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">Board Composer</p>
                <a href={flow.boardComposer.route} className="mt-1 block text-sm font-semibold text-ink">
                  {flow.boardComposer.pipeline.join(" > ")}
                </a>
                <p className="mt-1 text-xs text-basalt/60">{flow.boardComposer.pageCount} local board pages</p>
              </div>
              <div className="rounded-md border border-ink/10 bg-white p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">Export Package</p>
                <a href={flow.exportPackage.route} className="mt-1 block text-sm font-semibold text-ink">
                  {flow.exportPackage.file}
                </a>
                <p className="mt-1 text-xs text-basalt/60">PRODUCTION_READY=false</p>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-md border border-ink/10 bg-white p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">Assets</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {flow.assetRefs.slice(0, 4).map((assetId) => (
                    <span key={`${flow.id}-${assetId}`} className="rounded-full bg-mist px-2 py-1 text-[10px] font-medium text-basalt/70">
                      {assetId}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-md border border-ink/10 bg-white p-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">Screens</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {uniqueFlowRoutes(flow).map((route) => (
                    <a key={`${flow.id}-${route}`} href={route} className="rounded-full bg-mist px-2 py-1 text-[10px] font-medium text-basalt/70">
                      {route}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-md border border-lotus/20 bg-white p-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">Evidence Ref</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {flow.evidenceRefs.slice(0, 5).map((ref) => (
                  <span key={`${flow.id}-${ref}`} className="rounded-full bg-ivory px-2 py-1 text-[10px] font-medium text-basalt/70">
                    {ref}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-5 text-basalt/62">{flow.exportPackage.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DemoDataCards({ demoData }: { demoData: PreviewDemoDatum[] }) {
  return (
    <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-basalt/55">Demo data cards</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Typed Route Records</h2>
        </div>
        <StatusBadge status="READY" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {demoData.map((item) => (
          <div key={`${item.label}-${item.source}`} className="rounded-md border border-ink/10 bg-ivory p-3">
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
  );
}

export function RuntimeCoveragePanel({ coverage }: { coverage: LocalRuntimeCoverage[] }) {
  return (
    <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-basalt/55">Local runtime coverage</p>
          <h2 className="mt-1 text-lg font-semibold text-ink">Verification Surface</h2>
        </div>
        <StatusBadge status="READY" />
      </div>
      <div className="mt-4 space-y-3">
        {coverage.map((item) => (
          <div key={`${item.label}-${item.evidence}`} className="rounded-md border border-ink/10 bg-ivory p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink">{item.label}</p>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-1 text-xs text-basalt/60">{item.evidence}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export function EvidenceRefPanel({ evidenceRefs }: { evidenceRefs: string[] }) {
  return (
    <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">Evidence References</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {evidenceRefs.map((ref) => (
          <span key={ref} className="rounded-full bg-ivory px-2.5 py-1 text-xs font-medium text-basalt">
            {ref}
          </span>
        ))}
      </div>
    </article>
  );
}

export function BlockerPanel({ blockers }: { blockers: ActiveRoutePage["routeSpecificBlockers"] }) {
  return (
    <article className="rounded-md border border-lotus/20 bg-lotus/10 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <ShieldAlert aria-hidden className="mt-1 h-5 w-5 shrink-0 text-lotus" />
        <div>
          <h2 className="text-lg font-semibold text-ink">Route-Specific Blockers</h2>
          {blockers.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {blockers.map((blocker) => (
                <span key={blocker.id} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-basalt">
                  {blocker.label}: {blocker.status}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-basalt/70">No route-specific production blocker beyond the global release gate.</p>
          )}
          <p className="mt-3 text-xs leading-5 text-basalt/70">
            Native DWG, production DXF, payments, live vendors, marketplace commerce, certified validation, and engineering compliance remain blocked without evidence.
          </p>
        </div>
      </div>
    </article>
  );
}

export function ScreenPreviewCard({ screen, compact = false }: { screen: DemoScreenRef | ActiveRoutePage["cinematicScreen"]; compact?: boolean }) {
  return (
    <a href={screen.route} title={screen.title} className="block overflow-hidden rounded-md border border-ink/10 bg-[#03110f]">
      <img src={screen.image} alt={screen.title} loading="lazy" decoding="async" className={`${compact ? "aspect-square" : "aspect-video"} w-full object-cover`} />
      {!compact && (
        <div className="bg-white p-3">
          <p className="text-sm font-semibold text-ink">{screen.title}</p>
          <p className="mt-1 text-xs text-basalt/55">{screen.route}</p>
        </div>
      )}
    </a>
  );
}

export function AssetRefCard({ asset }: { asset: DemoAssetRef }) {
  return (
    <div className="rounded-md border border-ink/10 bg-white p-2">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[11px] font-semibold text-ink">{asset.name}</p>
        <StatusBadge status={asset.status} />
      </div>
      <p className="mt-1 truncate text-[10px] text-basalt/55">{asset.previewType}</p>
    </div>
  );
}

function uniqueUseCaseRoutes(useCase: CategoryDemoUseCase) {
  return [...new Set([useCase.route, ...useCase.screens.map((screen) => screen.route)])];
}

function uniqueFlowRoutes(flow: ActiveRoutePage["demoFlows"][number]) {
  return [...new Set([flow.route, flow.boardComposer.route, flow.exportPackage.route, ...flow.screenRefs.map((screen) => screen.route)])].slice(0, 6);
}

function FlowMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-ink/10 bg-white p-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-basalt/55">{label}</p>
      <p className="mt-1 text-base font-semibold text-ink">{value}</p>
    </div>
  );
}

export function ModuleLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
      {label}
      <ExternalLink aria-hidden className="h-4 w-4" />
    </a>
  );
}

export function RouteMetric({
  icon: Icon,
  label,
  value
}: {
  icon: typeof PackageCheck | typeof Monitor | typeof ShieldAlert;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md border border-ink/10 bg-ivory p-3">
      <Icon aria-hidden className="h-4 w-4 text-[#d9aa46]" />
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-basalt/55">{label}</p>
    </div>
  );
}

export function CapabilityCard({ capability }: { capability: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-ink/10 bg-ivory p-3">
      <ArrowRight aria-hidden className="h-4 w-4 text-neem" />
      <span className="text-sm font-medium text-basalt">{capability}</span>
    </div>
  );
}
