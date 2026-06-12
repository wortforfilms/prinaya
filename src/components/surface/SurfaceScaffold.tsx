import Link from "next/link";
import { StudioShell } from "@/components/layout/StudioShell";
import { StatusBadge } from "@/components/layout/StatusBadge";
import { releaseStatus } from "@/lib/status";
import type { SurfacePanel } from "@/lib/surfaces/runtime-surfaces";

/** Generic scaffold rendering a data-backed runtime surface inside the studio shell. */
export function SurfaceScaffold({ panel }: { panel: SurfacePanel }) {
  return (
    <StudioShell>
      <div className="px-4 py-6 lg:px-8">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl font-semibold text-white">{panel.title}</h1>
              <StatusBadge status={panel.status} />
            </div>
            <p className="mt-1 text-sm text-[#c8b98e]">{panel.subtitle}</p>
          </div>
          {panel.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {panel.links.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="rounded-md border border-[#d9aa46]/40 px-3 py-2 text-sm font-semibold text-[#f8d78b] transition hover:bg-[#d9aa46]/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </header>

        {panel.metrics.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {panel.metrics.map((m) => (
              <div key={m.label} className="rounded-md border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-basalt/55">{m.label}</p>
                <p className="mt-1 text-xl font-semibold text-[#f8d78b]">{m.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {panel.sections.map((section) => (
            <section key={section.title} className="rounded-md border border-white/10 bg-white/[0.03] p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#d9aa46]">{section.title}</h2>
              <ul className="mt-3 grid gap-1.5">
                {section.rows.map((row, i) => (
                  <li key={`${section.title}-${i}`} className="flex items-center justify-between gap-3 rounded bg-white/[0.03] px-3 py-2 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-[#f8f0df]">{row.label}</span>
                      {row.sub && <span className="block truncate text-[11px] text-basalt/50">{row.sub}</span>}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {row.value && <span className="text-xs text-[#d9d1bf]">{row.value}</span>}
                      {row.status && <StatusBadge status={row.status} />}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {panel.kbsRefs.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">KBS references</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {panel.kbsRefs.map((ref) => (
                <span key={ref} className="rounded-full border border-[#d9aa46]/25 bg-[#d9aa46]/5 px-2.5 py-1 text-xs text-[#f8d78b]">{ref}</span>
              ))}
            </div>
          </div>
        )}

        {panel.blockers && panel.blockers.length > 0 && (
          <div className="mt-6 rounded-md border border-lotus/30 bg-lotus/5 p-4">
            <p className="text-sm font-semibold text-lotus">Blocked capabilities</p>
            <ul className="mt-2 grid gap-1 text-xs text-basalt/70">
              {panel.blockers.map((b) => (
                <li key={b.label}>
                  <span className="font-semibold text-[#f8f0df]">{b.label}</span> — {b.reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-xs text-basalt/45">
          {panel.note ? `${panel.note} ` : ""}
          {releaseStatus.verdict} · PRODUCTION_READY=false.
        </p>
      </div>
    </StudioShell>
  );
}
