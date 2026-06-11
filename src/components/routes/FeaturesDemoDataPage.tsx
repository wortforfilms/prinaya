import { ArrowRight, Boxes, Monitor, PackageCheck, ShieldAlert, Sparkles } from "lucide-react";
import { StatusBadge } from "@/components/layout/StatusBadge";
import { StudioShell } from "@/components/layout/StudioShell";
import {
  categoryDemoUseCaseSets,
  categoryDemoUseCaseSummary,
  type CategoryDemoUseCase,
  type CategoryDemoUseCaseSet
} from "@/lib/category-demo-usecases";
import { getCinematicImageForRoute } from "@/lib/cinematic-image-assets";
import { getHeroBannerForRoute } from "@/lib/hero-banner-registry";

export function FeaturesDemoDataPage() {
  const hero = getHeroBannerForRoute("/features");
  return (
    <StudioShell>
      <div className="px-4 py-6 lg:px-8">
        <section className="relative overflow-hidden rounded-md border border-[#d9aa46]/22 bg-[#04110f] p-5 shadow-studio">
          <img src={getCinematicImageForRoute("/features", "cinematic-21x9", hero.hiresImage)} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,8,0.95),rgba(2,9,8,0.72)_50%,rgba(2,9,8,0.28))]" />
          <div className="relative grid min-h-[290px] gap-5 xl:grid-cols-[1fr_360px]">
            <div className="max-w-4xl self-end">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={categoryDemoUseCaseSummary.status} />
                <span className="rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-rose-100">
                  PRODUCTION_READY=FALSE
                </span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f8d78b]">Full demo data surface</p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-5xl">Feature Demo Use Cases</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/76">
                Each asset category now carries four local preview use cases with asset IDs, screen references, route bindings, and explicit blocked-production notes.
              </p>
            </div>
            <div className="self-end rounded-md border border-white/12 bg-black/42 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Demo coverage</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <HeroStat label="Categories" value={categoryDemoUseCaseSummary.categoryCount} />
                <HeroStat label="Use cases" value={categoryDemoUseCaseSummary.useCaseCount} />
                <HeroStat label="Asset refs" value={categoryDemoUseCaseSummary.assetRefCount} />
                <HeroStat label="Screen refs" value={categoryDemoUseCaseSummary.screenRefCount} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.72fr]">
          <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-basalt/55">Category demo data</p>
                <h2 className="mt-1 text-lg font-semibold text-ink">4 Use Cases Per Category</h2>
              </div>
              <StatusBadge status="READY" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              <SummaryTile icon={Boxes} label="Minimum per category" value={categoryDemoUseCaseSummary.minUseCasesPerCategory} />
              <SummaryTile icon={PackageCheck} label="Maximum per category" value={categoryDemoUseCaseSummary.maxUseCasesPerCategory} />
              <SummaryTile icon={Monitor} label="Screen routes" value={categoryDemoUseCaseSummary.routeCount} />
              <SummaryTile icon={ShieldAlert} label="Verdict" value={categoryDemoUseCaseSummary.verdict} />
            </div>
          </article>

          <article className="rounded-md border border-lotus/20 bg-lotus/10 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert aria-hidden className="mt-1 h-5 w-5 shrink-0 text-lotus" />
              <div>
                <h2 className="text-lg font-semibold text-ink">Honest Demo Boundary</h2>
                <p className="mt-2 text-sm leading-6 text-basalt/70">
                  Screens and assets are local preview artifacts. Live vendors, payments, engineering validation, authority signoff, and certified production files remain blocked until real evidence is attached.
                </p>
              </div>
            </div>
          </article>
        </section>

        <div className="mt-8 space-y-10">
          {categoryDemoUseCaseSets.map((set) => (
            <CategoryUseCaseSection key={set.category} set={set} />
          ))}
        </div>
      </div>
    </StudioShell>
  );
}

function CategoryUseCaseSection({ set }: { set: CategoryDemoUseCaseSet }) {
  return (
    <section id={set.slug} data-demo-category={set.slug} className="border-t border-[#d9aa46]/22 pt-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold text-white">{set.category}</h2>
            <StatusBadge status={set.status} />
          </div>
          <p className="mt-2 text-sm leading-6 text-basalt/70">
            {set.assetCount} local registry records, {set.readyAssets} ready, {set.partialAssets} partial, {set.blockedAssets} blocked.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {set.routes.map((route) => (
            <a key={`${set.category}-${route}`} href={route} className="rounded-full border border-ink/10 bg-white px-3 py-1 text-xs font-semibold text-basalt">
              {route}
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {set.useCases.map((useCase) => (
          <UseCaseCard key={useCase.id} useCase={useCase} />
        ))}
      </div>
    </section>
  );
}

function UseCaseCard({ useCase }: { useCase: CategoryDemoUseCase }) {
  const primaryScreen = useCase.screens[0];
  return (
    <article data-demo-use-case={useCase.id} className="overflow-hidden rounded-md border border-ink/10 bg-white shadow-sm">
      <div className="relative h-40 overflow-hidden bg-[#03110f]">
        <img src={primaryScreen.image} alt={primaryScreen.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/12 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="rounded-full border border-white/16 bg-black/42 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/80">
            {useCase.stage}
          </span>
          <StatusBadge status={useCase.status} />
        </div>
      </div>

      <div className="p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-basalt/55">{useCase.owner}</p>
        <h3 className="mt-1 min-h-14 text-base font-semibold leading-6 text-ink">{useCase.title}</h3>
        <p className="mt-2 min-h-24 text-sm leading-6 text-basalt/70">{useCase.summary}</p>

        <a href={useCase.route} className="mt-3 inline-flex items-center gap-2 rounded-md border border-ink/10 bg-ivory px-3 py-2 text-xs font-semibold text-basalt">
          {useCase.routeTitle}
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </a>

        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-basalt/55">Assets</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {useCase.assetRefs.map((asset) => (
              <span key={`${useCase.id}-${asset.id}`} className="rounded-full border border-ink/10 bg-mist px-2.5 py-1 text-[11px] font-medium text-basalt">
                {asset.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-basalt/55">Screens</p>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {useCase.screens.map((screen) => (
              <a key={screen.id} data-demo-screen={screen.id} href={screen.route} title={screen.title} className="block overflow-hidden rounded-md border border-ink/10 bg-[#03110f]">
                <img src={screen.image} alt={screen.title} loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
              </a>
            ))}
          </div>
        </div>

        <ol className="mt-4 space-y-2">
          {useCase.steps.map((step, index) => (
            <li key={`${useCase.id}-step-${step}`} className="flex gap-2 text-xs leading-5 text-basalt/70">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mist text-[10px] font-semibold text-ink">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-4 rounded-md border border-lotus/20 bg-lotus/10 p-3 text-xs leading-5 text-basalt/72">
          {useCase.blockedNotes[0]}
        </div>
      </div>
    </article>
  );
}

function HeroStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.055] p-3">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">{label}</p>
    </div>
  );
}

function SummaryTile({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Sparkles;
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0 rounded-md border border-ink/10 bg-ivory p-3">
      <Icon aria-hidden className="h-5 w-5 text-[#d9aa46]" />
      <p className="mt-3 break-words text-lg font-semibold leading-tight text-ink [overflow-wrap:anywhere] sm:text-xl">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-basalt/55">{label}</p>
    </div>
  );
}
