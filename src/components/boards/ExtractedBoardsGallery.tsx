import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  FileText,
  GalleryHorizontalEnd,
  Image,
  Layers3,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { projectSummary } from "@/lib/data-frames";
import { extractedBoards, extractedBoardSummary, type ExtractedBoard } from "@/lib/extracted-boards";
import { blockedCapabilities, releaseStatus, type CapabilityStatus, type ReleaseVerdict } from "@/lib/status";

const statusStyle: Record<CapabilityStatus, string> = {
  READY: "border-emerald-300/35 bg-emerald-300/10 text-emerald-100",
  PARTIAL: "border-amber-300/40 bg-amber-300/10 text-amber-100",
  BLOCKED: "border-rose-300/40 bg-rose-300/10 text-rose-100"
};

const sourceAccent: Record<ExtractedBoard["sourceTheme"], string> = {
  "all-pages": "#f4bf62",
  dashboard: "#58e6ff",
  "sci-fi": "#9c7bff",
  traditional: "#f38c63",
  unique: "#ff7ab8",
  vedic: "#b8ed72"
};

export function ExtractedBoardsGallery() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020908] text-[#f8f0df]">
      <section className="relative border-b border-[#d9aa46]/15 px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(217,170,70,0.18),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(84,229,237,0.14),transparent_28%)]" />
        <div className="relative mx-auto max-w-[1600px]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#f6d78b]">
                <span>Observed Board Extraction</span>
                <StatusPill status={releaseStatus.verdict} />
                <StatusPill status={releaseStatus.productionReady ? "READY" : "BLOCKED"} label="PRODUCTION_READY=false" />
              </div>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
                {projectSummary.name}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[#d8ccb6]">
                All generated visual boards have been reverse-structured into preview UI frames, data frames,
                technical panels, material palettes, route links, and honest readiness states.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[560px]">
              <SummaryTile icon={GalleryHorizontalEnd} label="Boards" value={String(extractedBoardSummary.boardCount)} />
              <SummaryTile icon={Sparkles} label="Frames" value={String(extractedBoardSummary.optionCount)} />
              <SummaryTile icon={Layers3} label="Panels" value={String(extractedBoardSummary.panelCount)} />
              <SummaryTile icon={ShieldCheck} label="Blocked" value={String(blockedCapabilities.length)} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="min-w-0 space-y-5">
          <ExtractionRibbon />
          <div className="grid min-w-0 gap-5 xl:grid-cols-2">
            {extractedBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        </div>
        <aside className="space-y-5">
          <StatusMatrix />
          <BlockedList />
        </aside>
      </section>
    </main>
  );
}

function ExtractionRibbon() {
  const stats = [
    { label: "READY options", value: extractedBoardSummary.readyOptions, status: "READY" as CapabilityStatus },
    { label: "PARTIAL options", value: extractedBoardSummary.partialOptions, status: "PARTIAL" as CapabilityStatus },
    { label: "BLOCKED options", value: extractedBoardSummary.blockedOptions, status: "BLOCKED" as CapabilityStatus }
  ];

  return (
    <div className="grid gap-3 rounded-md border border-white/10 bg-white/[0.045] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.22)] md:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center justify-between rounded-md border border-white/10 bg-[#071d1a] px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#a6b6ac]">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
          </div>
          <StatusPill status={stat.status} />
        </div>
      ))}
    </div>
  );
}

function BoardCard({ board }: { board: ExtractedBoard }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-md border border-white/10 bg-[#061411] shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
      <div className="relative aspect-[3/2] bg-black">
        <img src={board.image} alt={board.title} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={board.status} />
            <span className="rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              {board.dimensions}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: sourceAccent[board.sourceTheme] }}>
            <Image aria-hidden className="h-3.5 w-3.5" />
            <span>{board.sourceTheme.replace("-", " ")}</span>
          </div>
          <h2 className="mt-2 text-xl font-semibold leading-snug text-white">{board.title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#cfc5b3]">{board.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {board.options.slice(0, 8).map((option) => (
            <a
              key={option.id}
              href={option.route}
              className="group inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-xs text-[#ece2cf] hover:border-[#d9aa46]/40 hover:bg-[#d9aa46]/10"
            >
              <span className="truncate">{option.label}</span>
              <StatusDot status={option.status} />
            </a>
          ))}
          {board.options.length > 8 ? (
            <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-2 text-xs text-[#aebcb2]">
              +{board.options.length - 8} more
            </span>
          ) : null}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <MiniPanel title="Technical Panels" icon={FileText} items={board.panels.map((panel) => panel.label)} />
          <MiniPanel title="Materials" icon={Layers3} items={board.materials.slice(0, 8)} />
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs leading-5 text-[#aebcb2]">
            <span className="font-semibold text-[#f6d78b]">{board.options.length}</span> extracted frames,{" "}
            <span className="font-semibold text-[#f6d78b]">{board.panels.length}</span> reusable panels
          </div>
          <a href={board.route} className="inline-flex items-center gap-2 text-sm font-semibold text-[#f6d78b]">
            Open mapped route
            <ArrowRight aria-hidden className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

function MiniPanel({
  title,
  icon: Icon,
  items
}: {
  title: string;
  icon: typeof FileText;
  items: string[];
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f6d78b]">
        <Icon aria-hidden className="h-3.5 w-3.5" />
        <span>{title}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-[#d8ccb6]">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatusMatrix() {
  const boardStatuses = extractedBoards.reduce<Record<CapabilityStatus, number>>(
    (acc, board) => {
      acc[board.status] += 1;
      return acc;
    },
    { READY: 0, PARTIAL: 0, BLOCKED: 0 }
  );

  return (
    <section className="rounded-md border border-white/10 bg-[#061411] p-4">
      <div className="flex items-center gap-2">
        <Eye aria-hidden className="h-5 w-5 text-[#58e6ff]" />
        <h2 className="font-semibold text-white">Observatory Matrix</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-[#cfc5b3]">
        Extracted visual frames are preview assets. Production-only capabilities stay blocked until real evidence exists.
      </p>
      <div className="mt-4 space-y-2">
        {(Object.keys(boardStatuses) as CapabilityStatus[]).map((status) => (
          <div key={status} className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
            <StatusPill status={status} />
            <span className="text-lg font-semibold text-white">{boardStatuses[status]}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-[#d9aa46]/20 bg-[#d9aa46]/10 p-3 text-sm leading-6 text-[#f5ddb0]">
        Final verdict: {releaseStatus.verdict}. Production ready: {String(releaseStatus.productionReady)}.
      </div>
    </section>
  );
}

function BlockedList() {
  return (
    <section className="rounded-md border border-rose-300/20 bg-rose-950/20 p-4">
      <div className="flex items-center gap-2">
        <AlertTriangle aria-hidden className="h-5 w-5 text-rose-200" />
        <h2 className="font-semibold text-white">Blocked Capabilities</h2>
      </div>
      <div className="mt-4 space-y-3">
        {blockedCapabilities.map((capability) => (
          <div key={capability.id} className="rounded-md border border-rose-200/15 bg-black/20 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-white">{capability.label}</p>
              <StatusPill status={capability.status} />
            </div>
            <p className="mt-2 text-xs leading-5 text-rose-100/80">{capability.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SummaryTile({
  icon: Icon,
  label,
  value
}: {
  icon: typeof GalleryHorizontalEnd;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <Icon aria-hidden className="h-4 w-4 text-[#f6d78b]" />
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs uppercase tracking-[0.16em] text-[#aebcb2]">{label}</p>
    </div>
  );
}

function StatusPill({ status, label }: { status: CapabilityStatus | ReleaseVerdict; label?: string }) {
  const normalized: CapabilityStatus =
    status === "CONTROLLED_PREVIEW_READY" ? "PARTIAL" : status === "PRODUCTION_READY" ? "READY" : status;
  const icon =
    normalized === "READY" ? CheckCircle2 : normalized === "PARTIAL" ? Sparkles : AlertTriangle;
  const Icon = icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${statusStyle[normalized]}`}>
      <Icon aria-hidden className="h-3 w-3" />
      {label ?? status}
    </span>
  );
}

function StatusDot({ status }: { status: CapabilityStatus }) {
  const color = status === "READY" ? "bg-emerald-300" : status === "PARTIAL" ? "bg-amber-300" : "bg-rose-300";
  return <span aria-label={status} className={`h-2 w-2 shrink-0 rounded-full ${color}`} />;
}
