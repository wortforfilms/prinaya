import Link from "next/link";
import { StudioShell } from "@/components/layout/StudioShell";
import { spaGroups, spaRegistrySummary, type SpaStatus } from "@/lib/spa-registry";
import { releaseStatus } from "@/lib/status";

const STATUS_STYLE: Record<SpaStatus, string> = {
  READY: "border-neem/30 bg-neem/10 text-neem",
  PARTIAL: "border-marigold/40 bg-marigold/10 text-copper",
  PLANNED: "border-white/15 bg-white/5 text-basalt/60",
  BLOCKED: "border-lotus/35 bg-lotus/10 text-lotus"
};

export default function SurfacesPage() {
  const { total, byStatus, groupCount } = spaRegistrySummary;

  return (
    <StudioShell>
      <div className="px-4 py-6 lg:px-8">
        <header>
          <h1 className="font-serif text-3xl font-semibold text-white">Wedding OS — Surface Registry</h1>
          <p className="mt-1 text-sm text-[#c8b98e]">
            {total} declared SPA surfaces across {groupCount} domains. {releaseStatus.verdict} · PRODUCTION_READY=false.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Legend label={`READY ${byStatus.READY ?? 0}`} cls={STATUS_STYLE.READY} />
            <Legend label={`PARTIAL ${byStatus.PARTIAL ?? 0}`} cls={STATUS_STYLE.PARTIAL} />
            <Legend label={`PLANNED ${byStatus.PLANNED ?? 0}`} cls={STATUS_STYLE.PLANNED} />
            <Legend label={`BLOCKED ${byStatus.BLOCKED ?? 0}`} cls={STATUS_STYLE.BLOCKED} />
          </div>
          <p className="mt-3 max-w-3xl text-xs text-basalt/50">
            READY = dedicated build · PARTIAL = preview frame · PLANNED = named surface routing to the nearest existing
            route (not yet a dedicated build) · BLOCKED = requires provider/payment/compliance evidence. Nothing is
            presented as production-ready.
          </p>
        </header>

        <div className="mt-6 grid gap-6">
          {spaGroups.map((group) => (
            <section key={group.group}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#d9aa46]">
                {group.group} <span className="text-basalt/45">· {group.count}</span>
              </h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.surfaces.map((surface) => (
                  <Link
                    key={surface.id}
                    href={surface.href}
                    className="flex items-center justify-between gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2.5 transition hover:border-[#d9aa46]/40"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#f8f0df]">{surface.name}</span>
                      {surface.reason && <span className="block truncate text-[10px] text-basalt/50">{surface.reason}</span>}
                    </span>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${STATUS_STYLE[surface.status]}`}>
                      {surface.status}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </StudioShell>
  );
}

function Legend({ label, cls }: { label: string; cls: string }) {
  return <span className={`rounded-full border px-2.5 py-1 font-semibold uppercase tracking-[0.08em] ${cls}`}>{label}</span>;
}
