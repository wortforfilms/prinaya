import { Blocks, Boxes, Crown, Eye, Gem, Home, Landmark, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { routeMatrix } from "@/lib/route-matrix";
import { StatusBadge } from "./StatusBadge";

const iconMap = [Home, Landmark, Blocks, Lightbulb, Sparkles, Boxes, Eye, ShieldAlert];

export function LeftNav() {
  return (
    <aside className="hidden border-r border-[#d9aa46]/20 bg-[#041816]/95 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-80">
      <div className="flex h-full flex-col overflow-y-auto px-4 py-5 studio-scrollbar">
        <a href="/" className="flex items-center gap-3 px-2 text-[#f6d78b]">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-[#d9aa46]/40 bg-[#d9aa46]/10">
            <Gem aria-hidden className="h-7 w-7" />
          </span>
          <span>
            <span className="block font-serif text-2xl font-bold leading-6 tracking-[0.08em]">TLP WEDDING CAD</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d7bc7c]">Design | Plan | Present | Perform</span>
          </span>
        </a>

        <div className="mb-4 mt-7 rounded-md border border-[#d9aa46]/20 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d9aa46]">Navigation</p>
          <p className="mt-1 text-sm leading-6 text-[#d8c9a6]">All generated routes share the premium shell and explicit readiness status.</p>
        </div>
        <nav className="space-y-2" aria-label="Studio routes">
          {routeMatrix.map((route, index) => {
            const Icon = iconMap[index % iconMap.length];
            const href = route.path === "/*" ? "/" : route.path.replace("/*", "");
            return (
              <a
                key={route.path}
                href={href}
                className="flex items-center gap-3 rounded-md border border-transparent px-3 py-2 text-sm text-[#d7d1c4] transition hover:border-[#d9aa46]/25 hover:bg-white/5"
              >
                <Icon aria-hidden className="h-4 w-4 shrink-0 text-[#c8b98e]" />
                <span className="min-w-0 flex-1 truncate">{route.title}</span>
                <StatusBadge status={route.status} />
              </a>
            );
          })}
        </nav>
        <div className="mt-auto pt-7">
          <div className="rounded-md border border-[#d9aa46]/20 bg-white/[0.045] p-4">
            <div className="flex items-center gap-3">
              <Crown aria-hidden className="h-7 w-7 text-[#f6d78b]" />
              <div>
                <p className="font-semibold text-white">Controlled Preview</p>
                <p className="text-xs text-[#c8b98e]">PRODUCTION_READY=false</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
