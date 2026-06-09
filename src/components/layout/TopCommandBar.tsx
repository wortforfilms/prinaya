import { Download, FileJson, Search, ShieldCheck } from "lucide-react";
import { projectSummary } from "@/lib/data-frames";
import { releaseStatus } from "@/lib/status";
import { StatusBadge } from "./StatusBadge";

export function TopCommandBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d9aa46]/15 bg-[#04110f]/88 backdrop-blur-xl">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d9aa46]">TLP Wedding CAD</p>
          <h1 className="text-lg font-semibold text-white">{projectSummary.name}</h1>
        </div>
        <label className="flex min-w-64 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.065] px-4 py-2 text-sm text-[#d9d1bf] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:max-w-xl">
          <Search aria-hidden className="h-4 w-4 text-[#c8b98e]" />
          <span className="sr-only">Command search</span>
          <input
            className="w-full border-0 bg-transparent p-0 text-[#f8f0df] outline-none placeholder:text-[#b8aa8c]"
            placeholder="Search routes, layers, assets, blockers..."
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.065] px-3 py-2 text-sm font-semibold text-[#f8f0df] shadow-sm">
            <FileJson aria-hidden className="h-4 w-4" />
            Save JSON
          </button>
          <button className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.065] px-3 py-2 text-sm font-semibold text-[#f8f0df] shadow-sm">
            <Download aria-hidden className="h-4 w-4" />
            Export
          </button>
          <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.065] px-3 py-2 shadow-sm">
            <ShieldCheck aria-hidden className="h-4 w-4 text-neem" />
            <StatusBadge status={releaseStatus.verdict === "CONTROLLED_PREVIEW_READY" ? "READY" : "BLOCKED"} />
          </div>
        </div>
      </div>
    </header>
  );
}
