import { StudioShell } from "@/components/layout/StudioShell";
import { ModuleLinkButton } from "@/components/routes/active-page-components";
import { VediFinderKnowledgePanel } from "@/components/routes/KbsPanels";
import { VediCompass } from "@/components/vedi/VediCompass";
import { StatusBadge } from "@/components/layout/StatusBadge";
import { buildVediIntelligence } from "@/lib/kbs/surfaces";

export default function HemantSamwatVediPage() {
  const intel = buildVediIntelligence();
  const compassVedis = intel.finder.vedis.map((vedi) => ({
    id: vedi.id,
    name: vedi.name,
    vastuDirection: vedi.vastuDirection,
    agniZone: vedi.agniZone,
    pheraDirection: vedi.pheraDirection,
    topMuhurat: vedi.muhurats[0]?.name ?? null
  }));

  return (
    <StudioShell>
      <div className="px-4 py-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-basalt/55">Hemant Samwat</p>
            <h1 className="text-2xl font-semibold text-ink">Vedi Finder &amp; Muhurat Intelligence</h1>
            <p className="mt-1 text-sm text-basalt/65">
              Venue orientation, vastu grid, vedi/agni/phera recommendation, and panchang lookups — powered by the KBS.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="READY" />
            <ModuleLinkButton href="/exports" label="Export to board" />
          </div>
        </header>

        <div className="mt-6 grid gap-6">
          <VediCompass vedis={compassVedis} />

          <VastuGrid grid={intel.vastuGrid} />

          <VediFinderKnowledgePanel panel={intel.finder} />

          <section className="grid gap-4 xl:grid-cols-3">
            <LookupTable title="Nakshatras (27)" rows={intel.nakshatras} />
            <LookupTable title="Tithis (30)" rows={intel.tithis} />
            <MuhuratTable title="Muhurat registry" rows={intel.muhurats} />
          </section>

          <p className="text-xs text-basalt/45">
            Preview reference data. Not a certified vastu, astrological, or panchang service. Engineering, structural,
            and compliance claims remain blocked.
          </p>
        </div>
      </div>
    </StudioShell>
  );
}

function VastuGrid({ grid }: { grid: { direction: string; lord: string; use: string; favored: boolean }[] }) {
  return (
    <section className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">Vastu grid (Ashtadik)</h2>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {grid.map((cell) => (
          <div
            key={cell.direction}
            className={`rounded-md border p-3 ${cell.favored ? "border-neem/30 bg-neem/10" : "border-ink/10 bg-mist"}`}
          >
            <p className="text-sm font-semibold text-ink">{cell.direction}</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-basalt/55">{cell.lord}</p>
            <p className="mt-1 text-xs text-basalt/70">{cell.use}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LookupTable({ title, rows }: { title: string; rows: { id: string; name: string; detail: string; auspicious: boolean }[] }) {
  return (
    <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-ink">{title}</h3>
      <ul className="mt-3 grid max-h-80 gap-1 overflow-auto pr-1">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-2 rounded bg-mist px-2.5 py-1.5 text-xs">
            <span className="font-semibold text-ink">{row.name}</span>
            <span className="text-basalt/60">{row.detail}</span>
            {row.auspicious && <span className="rounded-full bg-neem/15 px-1.5 py-0.5 text-[10px] font-semibold text-neem">vivah</span>}
          </li>
        ))}
      </ul>
    </article>
  );
}

function MuhuratTable({ title, rows }: { title: string; rows: { id: string; name: string; window: string; score: number; nakshatra: string | null; tithi: string | null }[] }) {
  return (
    <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-ink">{title}</h3>
      <ul className="mt-3 grid max-h-80 gap-1 overflow-auto pr-1">
        {rows.map((row) => (
          <li key={row.id} className="rounded bg-mist px-2.5 py-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-ink">{row.name}</span>
              <span className="font-semibold text-basalt/70">{Math.round(row.score * 100)}%</span>
            </div>
            <p className="mt-0.5 text-basalt/60">
              {row.window}
              {row.nakshatra ? ` · ${row.nakshatra}` : ""}
              {row.tithi ? ` · ${row.tithi}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
