import Image from "next/image";
import Link from "next/link";
import { StudioShell } from "@/components/layout/StudioShell";
import { StatusBadge } from "@/components/layout/StatusBadge";
import { buildMandapDesigner } from "@/lib/mandap-designer";

export function MandapDesignerStudio() {
  const m = buildMandapDesigner();

  return (
    <StudioShell>
      <div className="px-4 py-6 lg:px-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl font-semibold text-ink">Mandap Designer</h1>
              <StatusBadge status="READY" />
            </div>
            <p className="mt-1 text-sm text-basalt/65">Design divine mandaps that capture tradition, beauty, and spiritual energy.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-md border border-ink/15 px-3 py-2 font-semibold text-basalt/70">Import Reference</span>
            <span className="rounded-md border border-ink/15 px-3 py-2 font-semibold text-basalt/70">AI Suggest</span>
            <Link href="/cad/editor" className="rounded-md bg-[#d9aa46] px-3 py-2 font-semibold text-[#02100e]">New Mandap Concept</Link>
          </div>
        </header>

        {/* KPI strip */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
          {m.kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-md border border-ink/10 bg-white p-3 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-basalt/55">{kpi.label}</p>
              <p className="mt-1 text-lg font-semibold text-ink">{kpi.value}</p>
              <p className="text-[10px] text-basalt/50">{kpi.preview ? `${kpi.sub} ·` : ""} {kpi.sub && !kpi.preview ? kpi.sub : kpi.preview ? "preview" : ""}</p>
            </div>
          ))}
        </div>

        {/* Preview frames */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {m.previewFrames.map((frame) => (
            <article key={frame.id} className="overflow-hidden rounded-md border border-ink/10 bg-white shadow-sm">
              <div className="flex items-center justify-between px-3 pt-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-basalt/55">{frame.title}</p>
                <StatusBadge status={frame.status} />
              </div>
              <div className="relative mt-2 aspect-[16/10]">
                <Image src={frame.image} alt={frame.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
              </div>
              <p className="px-3 py-2 text-xs text-basalt/60">{frame.subtitle}</p>
            </article>
          ))}
        </div>

        {/* Component galleries */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {m.galleries.map((g) => (
            <article key={g.panel} className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-ink">{g.panel}</h2>
                <span className="text-xs font-semibold text-basalt/55">{g.total} options</span>
              </div>
              <ul className="mt-3 grid gap-1.5">
                {g.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-2 rounded bg-mist px-2.5 py-1.5 text-xs">
                    <span className="text-ink">{item.name}</span>
                    <StatusBadge status={item.status} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Rituals & Vastu + Cost + Materials */}
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-ink">Rituals &amp; Vastu</h2>
            <dl className="mt-3 grid gap-1.5 text-sm">
              {m.ritualsVastu.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-2 rounded bg-mist px-2.5 py-1.5">
                  <dt className="text-basalt/70">{row.label}</dt>
                  <dd className={`font-semibold ${row.ok ? "text-neem" : "text-basalt"}`}>{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-[10px] text-basalt/45">Vastu and energy-flow scores are preview heuristics, not a certified vastu consultation.</p>
          </article>

          <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-ink">Mandap Cost Breakdown</h2>
            <ul className="mt-3 grid gap-1.5 text-sm">
              {m.costRows.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-2 rounded bg-mist px-2.5 py-1.5">
                  <span className="text-basalt/70">{row.label}</span>
                  <span className={`font-semibold ${row.status === "blocked" ? "text-lotus" : "text-ink"}`}>
                    {row.status === "blocked" ? "BLOCKED" : `₹${row.amountInr.toLocaleString("en-IN")}`}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-2 text-sm">
              <span className="font-semibold text-ink">Total (preview)</span>
              <span className="font-semibold text-ink">₹{m.costTotalInr.toLocaleString("en-IN")}</span>
            </div>
          </article>

          <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-ink">Materials &amp; Finishes</h2>
            <ul className="mt-3 grid gap-1.5 text-sm">
              {m.materials.map((mat) => (
                <li key={mat.id} className="flex items-center gap-2 rounded bg-mist px-2.5 py-1.5">
                  <span className="h-4 w-4 shrink-0 rounded-full border border-ink/10" style={{ backgroundColor: mat.color }} />
                  <span className="font-semibold text-ink">{mat.label}</span>
                  <span className="ml-auto text-xs text-basalt/55">{mat.finish}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        {/* Templates + Recent concepts + Board preview */}
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-ink">Mandap Templates</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {m.templates.map((t) => (
                <span key={t.id} className="rounded-full border border-ink/10 bg-mist px-3 py-1 text-xs text-ink">{t.label}</span>
              ))}
            </div>
          </article>

          <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-ink">Recent Mandap Concepts</h2>
            <ul className="mt-3 grid gap-1.5 text-sm">
              {m.recentConcepts.map((c) => (
                <li key={c.name} className="flex items-center justify-between gap-2 rounded bg-mist px-2.5 py-1.5">
                  <span className="text-ink">{c.name}</span>
                  <span className="text-xs text-basalt/55">{c.date} · ₹{c.estimateInr.toLocaleString("en-IN")}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-ink">Board Preview</h2>
            <p className="mt-2 text-sm text-basalt/65">Compose the mandap into the 17-page board package and export.</p>
            <Link href="/exports" className="mt-3 inline-block rounded-md bg-[#d9aa46] px-4 py-2 text-sm font-semibold text-[#02100e]">Open Board Composer</Link>
          </article>
        </div>

        {/* Exports + Specs */}
        <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-ink">Export &amp; Outputs</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {m.exports.map((ex) => (
                <div key={ex.label} className="rounded-md border border-ink/10 bg-mist p-3">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-basalt/55">{ex.format}</span>
                    <StatusBadge status={ex.status} />
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink">{ex.label}</p>
                  {ex.note && <p className="text-[10px] text-basalt/50">{ex.note}</p>}
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-basalt/45">Native DWG and production DXF remain blocked — no native CAD writer or certified handoff exists.</p>
          </article>

          <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-ink">Notes &amp; Specifications</h2>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {m.specs.map((spec) => (
                <div key={spec.label} className="rounded bg-mist px-2.5 py-1.5">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-basalt/55">{spec.label}</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>

        <p className="mt-6 text-xs text-basalt/45">
          {m.verdict} · PRODUCTION_READY=false · Controlled preview. Cost, vastu, and sustainability figures are
          preview estimates; live vendors, payments, native DWG/production DXF, and certified compliance remain blocked.
        </p>
      </div>
    </StudioShell>
  );
}
