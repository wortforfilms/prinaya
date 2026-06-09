import {
  ArrowRight,
  Box,
  CalendarClock,
  CircleDollarSign,
  Download,
  Eye,
  Flower2,
  Grid3X3,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/layout/StatusBadge";
import { StudioShell } from "@/components/layout/StudioShell";
import { floralWorkspace } from "@/lib/floral-workspace";
import type { CapabilityStatus } from "@/lib/status";

const toneStyles = {
  green: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  pink: "border-fuchsia-300/25 bg-fuchsia-400/10 text-fuchsia-200",
  gold: "border-[#d9aa46]/28 bg-[#d9aa46]/10 text-[#f6d78b]",
  amber: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  teal: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100"
};

const zoneStyles: Record<(typeof floralWorkspace.spacePoints)[number]["zone"], string> = {
  Mandap: "#ff4f9a",
  Stage: "#bb6cff",
  Entry: "#ff943d",
  Walkway: "#5ce7b8",
  Centerpieces: "#f4c64e",
  "Photo Area": "#55d8ff",
  Other: "#d6d0c1"
};

const kpiIcons = {
  concepts: Flower2,
  installations: Layers3,
  "flower-types": Sparkles,
  cost: CircleDollarSign,
  hours: CalendarClock,
  sustainability: ShieldCheck
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export function FloralDesignerWorkspace() {
  const conceptAsset = floralWorkspace.visualAssets.find((asset) => asset.id === "concept-board") ?? floralWorkspace.visualAssets[0];
  const installationAsset = floralWorkspace.visualAssets.find((asset) => asset.id === "installation-render") ?? conceptAsset;
  const boardAsset = floralWorkspace.visualAssets.find((asset) => asset.id === "floral-board-preview") ?? conceptAsset;
  const spaceAsset = floralWorkspace.visualAssets.find((asset) => asset.id === "space-map-board") ?? conceptAsset;
  const supportAssets = floralWorkspace.visualAssets.filter((asset) => asset.id !== conceptAsset.id && asset.id !== installationAsset.id);
  const primaryPalette = floralWorkspace.palettes[0];

  return (
    <StudioShell>
      <div className="min-h-screen px-4 py-4 text-[#f8f0df] lg:px-6">
        <section className="overflow-hidden rounded-md border border-[#d9aa46]/18 bg-[#041614]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_64px_rgba(0,0,0,0.28)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d9aa46]/14 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-[#d8c9a6]">
              <a href="/" className="text-[#f6d78b]">Dashboard</a>
              <ArrowRight aria-hidden className="h-4 w-4 text-[#8d826c]" />
              <span>Floral Designer</span>
              <ArrowRight aria-hidden className="h-4 w-4 text-[#8d826c]" />
              <span className="truncate text-white">{floralWorkspace.projectName}</span>
            </div>
            <label className="flex min-w-64 items-center gap-2 rounded-md border border-white/10 bg-white/[0.055] px-3 py-2 text-sm text-[#d8c9a6] lg:w-96">
              <Search aria-hidden className="h-4 w-4 text-[#c8b98e]" />
              <span className="sr-only">Search floral workspace</span>
              <input className="w-full border-0 bg-transparent p-0 outline-none placeholder:text-[#a99b82]" placeholder="Search floral assets, palettes, notes..." />
            </label>
          </div>

          <div className="grid gap-4 p-4 xl:grid-cols-[minmax(280px,0.82fr)_minmax(420px,1.28fr)_minmax(260px,0.72fr)]">
            <div className="flex min-h-80 flex-col justify-between gap-5">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-md border border-pink-300/20 bg-pink-400/10 text-pink-100">
                    <Flower2 aria-hidden className="h-7 w-7" />
                  </span>
                  <StatusBadge status={floralWorkspace.status} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d9aa46]">Hemant Samwat Wedding</p>
                <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight tracking-normal text-white lg:text-5xl">
                  Floral Designer
                </h1>
                <p className="mt-3 max-w-md text-sm leading-6 text-[#d8c9a6]">
                  Concept, installation, palette, budget, sourcing, and board output in one controlled preview workspace.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {floralWorkspace.kpis.slice(0, 4).map((kpi) => (
                  <KpiTile key={kpi.id} label={kpi.label} value={kpi.value} detail={kpi.detail} tone={kpi.tone} iconId={kpi.id} compact />
                ))}
              </div>
            </div>

            <div className="relative min-h-80 overflow-hidden rounded-md border border-[#d9aa46]/20 bg-black/30">
              <img src={installationAsset.source} alt={installationAsset.label} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,12,11,0.08),rgba(2,12,11,0.76))]" />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {["3D Render", "Night View", "AR Preview"].map((mode, index) => (
                  <span
                    key={mode}
                    className={
                      index === 0
                        ? "rounded-md border border-cyan-300/30 bg-cyan-300/20 px-3 py-1.5 text-xs font-semibold text-cyan-100"
                        : "rounded-md border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-semibold text-[#d8c9a6]"
                    }
                  >
                    {mode}
                  </span>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d9aa46]">Installation Preview</p>
                    <p className="mt-1 text-2xl font-semibold text-white">{installationAsset.label}</p>
                  </div>
                  <PaletteDots colors={primaryPalette.colors.slice(0, 6)} />
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-md border border-[#d9aa46]/18 bg-white/[0.045] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d9aa46]">Workspace Health</p>
                  <ShieldCheck aria-hidden className="h-4 w-4 text-emerald-200" />
                </div>
                <div className="space-y-2">
                  {floralWorkspace.statusRows.slice(0, 4).map((row) => (
                    <StatusLine key={row.label} label={row.label} value={row.value} status={row.status} />
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-[#d9aa46]/18 bg-white/[0.045] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d9aa46]">Output Stack</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <MetricPill label="Panels" value={String(floralWorkspace.panels.length)} />
                  <MetricPill label="Assets" value={String(floralWorkspace.visualAssets.length + floralWorkspace.arrangements.length)} />
                  <MetricPill label="Points" value={String(floralWorkspace.spacePoints.length)} />
                </div>
              </div>

              <div className="grid gap-2">
                <LuxuryButton label="Import Concept" icon={<Download aria-hidden className="h-4 w-4" />} />
                <LuxuryButton label="AI Suggest" icon={<Sparkles aria-hidden className="h-4 w-4" />} />
                <LuxuryButton label="New Floral Concept" icon={<span aria-hidden className="text-base leading-none">+</span>} strong />
              </div>
            </div>
          </div>
        </section>

        <div className="sticky top-16 z-20 mt-4 overflow-x-auto rounded-md border border-[#d9aa46]/16 bg-[#04110f]/90 px-2 backdrop-blur-xl studio-scrollbar">
          <nav className="flex min-w-max gap-1" aria-label="Floral workspace sections">
            {floralWorkspace.tabs.map((tab, index) => (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                className={
                  index === 0
                    ? "rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100"
                    : "rounded-md border border-transparent px-3 py-2 text-xs font-semibold text-[#d8c9a6] hover:border-[#d9aa46]/28 hover:bg-white/[0.04]"
                }
              >
                {tab.label}
              </a>
            ))}
          </nav>
        </div>

        <section className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Floral KPI widgets">
          {floralWorkspace.kpis.map((kpi) => (
            <KpiTile key={kpi.id} label={kpi.label} value={kpi.value} detail={kpi.detail} tone={kpi.tone} iconId={kpi.id} />
          ))}
        </section>

        <div className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-4">
            <section id="concepts" className="grid scroll-mt-32 gap-4 xl:grid-cols-12">
              <Panel number={1} title="Floral Concept Board" status="READY" className="xl:col-span-7">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_132px]">
                  <ImageTile src={conceptAsset.source} alt={conceptAsset.label} className="h-72" />
                  <div className="grid grid-rows-3 gap-2">
                    {supportAssets.slice(0, 3).map((asset) => (
                      <ImageTile key={asset.id} src={asset.source} alt={asset.label} className="h-full min-h-16" />
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{conceptAsset.label}</p>
                    <p className="text-xs text-[#a99b82]">{conceptAsset.usage}</p>
                  </div>
                  <PaletteDots colors={primaryPalette.colors.slice(0, 6)} />
                </div>
              </Panel>

              <Panel number={2} title="Space Mapping" status="READY" className="xl:col-span-5">
                <SpaceMap src={spaceAsset.source} alt={spaceAsset.label} />
                <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                  {Object.entries(zoneStyles).map(([zone, color]) => (
                    <div key={zone} className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-2 py-1.5 text-xs text-[#d8c9a6]">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="truncate">{zone}</span>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel number={3} title="Installation Preview (3D)" status="READY" className="xl:col-span-12">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <ImageTile src={installationAsset.source} alt={installationAsset.label} className="h-72" />
                  <div className="grid gap-2 content-start">
                    {floralWorkspace.kpis.slice(4).map((kpi) => (
                      <KpiTile key={kpi.id} label={kpi.label} value={kpi.value} detail={kpi.detail} tone={kpi.tone} iconId={kpi.id} compact />
                    ))}
                    <div className="rounded-md border border-cyan-300/20 bg-cyan-300/10 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">View Modes</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["3D Render", "Night View", "AR Preview"].map((mode, index) => (
                          <span key={mode} className={index === 0 ? "rounded-md bg-cyan-300/16 px-3 py-1.5 text-xs font-semibold text-cyan-100" : "rounded-md bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-[#d8c9a6]"}>
                            {mode}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            </section>

            <section id="installations" className="grid scroll-mt-32 gap-4 xl:grid-cols-12">
              <Panel number={4} title="Arrangement Library" status="READY" className="xl:col-span-7">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {floralWorkspace.arrangements.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-md border border-[#d9aa46]/16 bg-white/[0.04]">
                      <ImageTile src={item.source} alt={item.label} className="h-24 rounded-none border-0" />
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-white">{item.label}</p>
                          <StatusBadge status={item.status} />
                        </div>
                        <p className="mt-1 text-xs text-[#a99b82]">{item.placement}</p>
                        <p className="mt-2 text-xs font-semibold text-[#f6d78b]">{item.quantity} units</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel number={6} title="Flower & Foliage Library" status="READY" className="xl:col-span-5">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {floralWorkspace.flowers.map((flower) => (
                    <FlowerToken key={flower.id} label={flower.label} color={flower.color} season={flower.season} availability={flower.availability} />
                  ))}
                </div>
              </Panel>
            </section>

            <section id="palettes" className="grid scroll-mt-32 gap-4 xl:grid-cols-12">
              <Panel number={7} title="Color Palettes" status="READY" className="xl:col-span-7">
                <div className="grid gap-3 lg:grid-cols-5">
                  {floralWorkspace.palettes.map((palette) => (
                    <div key={palette.id} className="rounded-md border border-white/10 bg-white/[0.04] p-3">
                      <p className="truncate text-xs font-semibold text-white">{palette.label}</p>
                      <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-md border border-white/10">
                        {palette.colors.map((color) => (
                          <span key={`${palette.id}-${color}`} className="aspect-square" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] leading-4 text-[#a99b82]">{palette.usage}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel number={8} title="Seasonal Availability" status="READY" className="xl:col-span-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  {["All Year", "Winter", "Summer", "Monsoon"].map((season) => (
                    <span key={season} className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold text-[#d8c9a6]">{season}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {floralWorkspace.flowers.slice(0, 6).map((flower) => (
                    <div key={flower.id} className="flex items-center gap-2 rounded-md border border-white/10 bg-black/20 p-2">
                      <span className="h-8 w-8 rounded-full border border-white/15" style={{ backgroundColor: flower.color }} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-white">{flower.label}</p>
                        <p className="text-[10px] text-[#a99b82]">{flower.season}</p>
                      </div>
                      <span className={`h-2 w-2 rounded-full ${flower.availability === "High" ? "bg-emerald-400" : flower.availability === "Medium" ? "bg-[#d9aa46]" : "bg-pink-400"}`} />
                    </div>
                  ))}
                </div>
              </Panel>
            </section>

            <section id="board-preview" className="grid scroll-mt-32 gap-4 xl:grid-cols-12">
              <Panel number={9} title="Floral Board Preview" status="READY" className="xl:col-span-7">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <ImageTile src={boardAsset.source} alt={boardAsset.label} className="h-60" />
                  <div className="space-y-2">
                    <FieldPill label="Board Type" value="Floral Concept Board" />
                    <FieldPill label="Size" value="A1 Landscape" />
                    <SwitchRow label="Show labels" active />
                    <SwitchRow label="Show prices" active />
                    <button className="w-full rounded-md border border-[#d9aa46]/35 bg-[#d9aa46]/20 px-3 py-2 text-xs font-semibold text-[#f6d78b]">Generate Board</button>
                  </div>
                </div>
              </Panel>

              <Panel number={10} title="Floral Timeline" status="READY" className="xl:col-span-5">
                <div className="relative mt-2 grid grid-cols-5 gap-2">
                  <span className="absolute left-8 right-8 top-3 h-px bg-[#d9aa46]/28" />
                  {floralWorkspace.timeline.map((item) => (
                    <div key={item.id} className="relative z-10 text-center">
                      <span className="mx-auto grid h-7 w-7 place-items-center rounded-full border border-[#d9aa46]/35 bg-[#08201d] text-[10px] font-semibold text-[#f6d78b]">{item.label.slice(0, 1)}</span>
                      <p className="mt-2 text-[10px] font-semibold text-white">{item.label}</p>
                      <p className="text-[10px] text-[#a99b82]">{item.date}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel number={11} title="Notes & Specifications" status="READY" className="xl:col-span-12">
                <div className="grid gap-2 md:grid-cols-5">
                  {floralWorkspace.notes.map((note) => (
                    <p key={note} className="rounded-md border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-[#d8c9a6]">{note}</p>
                  ))}
                </div>
              </Panel>
            </section>
          </main>

          <aside className="space-y-4 xl:sticky xl:top-32">
            <Panel number={5} title="Floral Calculator" status="READY">
              <div className="space-y-2">
                <FieldPill label="Area" value={floralWorkspace.calculator.area} />
                <FieldPill label="Dimensions" value={floralWorkspace.calculator.dimensions} />
                <FieldPill label="Density" value={floralWorkspace.calculator.floralDensity} />
              </div>
              <div className="mt-3 rounded-md border border-white/10 bg-black/20 p-3">
                {floralWorkspace.calculator.lines.map((line) => (
                  <div key={line.id} className="flex items-center justify-between border-b border-white/10 py-2 text-xs last:border-b-0">
                    <span className="text-[#d8c9a6]">{line.label}</span>
                    <span className="font-semibold text-white">{currency.format(line.estimatedInr)}</span>
                  </div>
                ))}
                <div className="mt-3 flex items-center justify-between text-sm font-semibold text-[#f6d78b]">
                  <span>Total Estimate</span>
                  <span>{currency.format(floralWorkspace.calculator.totalEstimatedInr)}</span>
                </div>
              </div>
            </Panel>

            <Panel number={12} title="Attachments" status="READY">
              <div className="space-y-2">
                {floralWorkspace.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] p-2">
                    <Box aria-hidden className="h-4 w-4 text-[#f6d78b]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white">{attachment.label}</p>
                      <p className="text-[10px] text-[#a99b82]">{attachment.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel number={13} title="Status & Blockers" status="READY">
              <div className="space-y-2">
                {floralWorkspace.statusRows.map((row) => (
                  <StatusLine key={row.label} label={row.label} value={row.value} status={row.status} />
                ))}
              </div>
            </Panel>

            <Panel number={14} title="Quick Actions" status="READY">
              <div className="space-y-2">
                {floralWorkspace.quickActions.map((action) => (
                  <button key={action} className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-semibold text-[#f8f0df]">
                    <span>{action}</span>
                    <ArrowRight aria-hidden className="h-3.5 w-3.5 text-[#f6d78b]" />
                  </button>
                ))}
              </div>
            </Panel>
          </aside>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { label: "Extracted UI Frames", value: `${floralWorkspace.panels.length} panels`, icon: Grid3X3 },
            { label: "Local Assets", value: `${floralWorkspace.visualAssets.length + floralWorkspace.arrangements.length} refs`, icon: Eye },
            { label: "Runtime Coverage", value: `${floralWorkspace.localRuntimeCoverage.length} checks`, icon: ShieldCheck }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-md border border-[#d9aa46]/16 bg-[#061d1a]/70 p-3">
                <span className="grid h-9 w-9 place-items-center rounded-md border border-[#d9aa46]/20 bg-[#d9aa46]/10 text-[#f6d78b]">
                  <Icon aria-hidden className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-[#d8c9a6]">{item.label}</p>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </StudioShell>
  );
}

function KpiTile({
  label,
  value,
  detail,
  tone,
  iconId,
  compact = false
}: {
  label: string;
  value: string;
  detail: string;
  tone: keyof typeof toneStyles;
  iconId: string;
  compact?: boolean;
}) {
  const Icon = kpiIcons[iconId as keyof typeof kpiIcons] ?? Sparkles;

  return (
    <div className={compact ? "rounded-md border border-[#d9aa46]/16 bg-white/[0.04] p-3" : "rounded-md border border-[#d9aa46]/16 bg-[#061d1a]/76 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_44px_rgba(0,0,0,0.18)]"}>
      <div className="flex items-start gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md border ${toneStyles[tone]}`}>
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-[#d8c9a6]">{label}</p>
          <p className={compact ? "mt-1 text-xl font-semibold leading-6 text-white" : "mt-1 text-2xl font-semibold leading-7 text-white"}>{value}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a99b82]">{detail}</p>
        </div>
      </div>
    </div>
  );
}

function LuxuryButton({ label, icon, strong = false }: { label: string; icon: ReactNode; strong?: boolean }) {
  return (
    <button
      className={
        strong
          ? "inline-flex w-full items-center justify-between gap-2 rounded-md border border-[#d9aa46]/45 bg-[#d9aa46]/22 px-4 py-2 text-sm font-semibold text-[#f6d78b] shadow-[0_0_24px_rgba(217,170,70,0.22)]"
          : "inline-flex w-full items-center justify-between gap-2 rounded-md border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-semibold text-[#f8f0df]"
      }
    >
      <span>{label}</span>
      {icon}
    </button>
  );
}

function Panel({
  number,
  title,
  status,
  className,
  children
}: {
  number: number;
  title: string;
  status: CapabilityStatus;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`rounded-md border border-[#d9aa46]/22 bg-[#061b18]/82 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_44px_rgba(0,0,0,0.18)] ${className ?? ""}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.04em] text-white">
          <span className="text-[#f6d78b]">{number}. </span>
          {title}
        </h2>
        <StatusBadge status={status} />
      </div>
      {children}
    </section>
  );
}

function ImageTile({ src, alt, className }: { src: string; alt: string; className: string }) {
  return (
    <div className={`overflow-hidden rounded-md border border-[#d9aa46]/18 bg-black/30 ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

function SpaceMap({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-72 overflow-hidden rounded-md border border-white/10 bg-[#020c0b]">
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-4 border border-[#d9aa46]/25" />
      <div className="absolute inset-5 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px] opacity-60" />
      <div className="absolute left-5 top-5 rounded-md border border-[#d9aa46]/20 bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f6d78b]">
        {floralWorkspace.spacePoints.length} points
      </div>
      {floralWorkspace.spacePoints.map((point) => (
        <span
          key={point.id}
          className="absolute h-1.5 w-1.5 rounded-full shadow-[0_0_12px_currentColor]"
          style={{ left: `${point.x}%`, top: `${point.y}%`, backgroundColor: zoneStyles[point.zone], color: zoneStyles[point.zone] }}
        />
      ))}
    </div>
  );
}

function FlowerToken({
  label,
  color,
  season,
  availability
}: {
  label: string;
  color: string;
  season: string;
  availability: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] p-2">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 text-sm font-bold text-white" style={{ backgroundColor: color, boxShadow: `0 0 18px ${color}55` }}>
        {label.slice(0, 1)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-white">{label}</p>
        <p className="text-[10px] text-[#a99b82]">{season} / {availability}</p>
      </div>
    </div>
  );
}

function PaletteDots({ colors }: { colors: string[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {colors.map((color) => (
        <span key={color} className="h-5 w-5 rounded-full border border-white/20" style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 px-2 py-2">
      <p className="text-lg font-semibold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.12em] text-[#a99b82]">{label}</p>
    </div>
  );
}

function FieldPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.12em] text-[#a99b82]">{label}</p>
      <p className="mt-1 text-xs font-semibold text-white">{value}</p>
    </div>
  );
}

function SwitchRow({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2 text-xs text-[#d8c9a6]">
      <span>{label}</span>
      <span className={active ? "h-2.5 w-2.5 rounded-full bg-emerald-300" : "h-2.5 w-2.5 rounded-full bg-white/25"} />
    </div>
  );
}

function StatusLine({ label, value, status }: { label: string; value: string; status: CapabilityStatus }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-[#d8c9a6]">{label}</span>
      <span className={status === "BLOCKED" ? "text-right font-semibold text-pink-200" : "text-right font-semibold text-emerald-200"}>{value}</span>
    </div>
  );
}
