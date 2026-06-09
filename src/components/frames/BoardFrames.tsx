import { Box, CalendarClock, CircleDollarSign, Flower2, Grid3X3, Layers3, Route, ScanLine, ShieldAlert } from "lucide-react";
import { uiFrames } from "@/lib/design-frames";
import {
  assetCategories,
  budgetItems,
  cadObjects,
  decorItems,
  exportJobs,
  floralPalette,
  guestSections,
  layers,
  lightingFixtures,
  mandapDimensions,
  materialPalette,
  observatoryEvents,
  projectSummary,
  seatingCapacity,
  stageDimensions,
  venueDimensions
} from "@/lib/data-frames";
import { blockedCapabilities, releaseStatus, type CapabilityStatus } from "@/lib/status";
import { StatusBadge } from "@/components/layout/StatusBadge";

const frameIcons = [Grid3X3, Flower2, Layers3, Box, ScanLine, Route, CircleDollarSign, CalendarClock];

export function ProjectStats() {
  const stats = [
    ["Route frames", projectSummary.routeCoverage],
    ["Schema models", projectSummary.schemaModels],
    ["CAD objects", cadObjects.length],
    ["Guest capacity", seatingCapacity.totalGuests],
    ["Budget INR", budgetItems.reduce((sum, item) => sum + item.estimatedInr, 0).toLocaleString("en-IN")],
    ["Blocked caps", blockedCapabilities.length]
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map(([label, value]) => (
        <div key={label} className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-basalt/55">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
        </div>
      ))}
    </section>
  );
}

export function BoardFrameGrid() {
  return (
    <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {uiFrames.map((frame, index) => {
        const Icon = frameIcons[index % frameIcons.length];
        return (
          <article key={frame.id} className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-mist text-basalt">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{frame.title}</h3>
                  <p className="text-xs text-basalt/60">{frame.sourceBoard}</p>
                </div>
              </div>
              <StatusBadge status={frame.status} />
            </div>
            <p className="mt-4 text-sm leading-6 text-basalt">{frame.layout}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {frame.dataBindings.map((binding) => (
                <span key={binding} className="rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-basalt">
                  {binding}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function SiteLayoutPreview() {
  return (
    <section className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Site Layout Plan</h2>
          <p className="text-sm text-basalt/70">
            {venueDimensions.lengthM}m x {venueDimensions.widthM}m venue, {venueDimensions.emergencyExits} exits.
          </p>
        </div>
        <StatusBadge status="READY" />
      </div>
      <div className="mt-4 grid min-h-72 grid-cols-12 grid-rows-8 gap-2 rounded-md border border-dashed border-basalt/20 bg-mist p-3">
        <div className="col-span-4 row-span-2 rounded bg-neem/20 p-2 text-xs font-semibold text-neem">Parking</div>
        <div className="col-span-4 row-span-3 rounded bg-lotus/20 p-2 text-xs font-semibold text-lotus">Mandap</div>
        <div className="col-span-4 row-span-2 rounded bg-signal/20 p-2 text-xs font-semibold text-signal">Stage + LED wall</div>
        <div className="col-span-3 row-span-3 rounded bg-white p-2 text-xs font-semibold text-basalt">Family seating</div>
        <div className="col-span-4 row-span-3 rounded bg-white p-2 text-xs font-semibold text-basalt">General seating</div>
        <div className="col-span-3 row-span-3 rounded bg-white p-2 text-xs font-semibold text-basalt">Dining transition</div>
        <div className="col-span-2 row-span-3 rounded bg-marigold/20 p-2 text-xs font-semibold text-copper">Drone path</div>
        <div className="col-span-12 row-span-2 rounded bg-copper/10 p-2 text-xs font-semibold text-copper">Entry axis, floral aisle, service lane</div>
      </div>
    </section>
  );
}

export function MandapAndStagePreview() {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Mandap Plan/Elevation</h2>
          <StatusBadge status="READY" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-basalt">
          <Metric label="Footprint" value={`${mandapDimensions.footprintM[0]}m x ${mandapDimensions.footprintM[2]}m`} />
          <Metric label="Pillars" value={mandapDimensions.pillarCount} />
          <Metric label="Canopy" value={`${mandapDimensions.canopyHeightM}m`} />
          <Metric label="Saptapadi" value={`${mandapDimensions.saptapadiDiameterM}m dia`} />
        </div>
        <div className="mt-4 aspect-[4/3] rounded-md border border-dashed border-lotus/30 bg-lotus/10 p-4">
          <div className="grid h-full grid-cols-3 grid-rows-3 gap-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="rounded border border-lotus/20 bg-white/70" />
            ))}
          </div>
        </div>
      </article>
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">Stage Design</h2>
          <StatusBadge status="READY" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-basalt">
          <Metric label="Stage" value={`${stageDimensions.widthM}m x ${stageDimensions.depthM}m`} />
          <Metric label="Height" value={`${stageDimensions.heightM}m`} />
          <Metric label="LED wall" value={`${stageDimensions.ledWallM[0]}m x ${stageDimensions.ledWallM[2]}m`} />
          <Metric label="Sofa zone" value={`${stageDimensions.sofaZoneM[0]}m`} />
        </div>
        <div className="mt-4 aspect-[4/3] rounded-md bg-night p-4 text-white">
          <div className="h-1/2 rounded border border-signal/50 bg-signal/20 p-3 text-sm font-semibold">LED wall</div>
          <div className="mx-auto mt-4 h-16 w-2/3 rounded bg-ivory/90 text-center text-sm font-semibold text-ink">Couple sofa platform</div>
        </div>
      </article>
    </section>
  );
}

export function AssetAndLayerPanels() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Asset Library Grid</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {assetCategories.map((category) => (
            <div key={category.id} className="rounded-md border border-ink/10 bg-ivory p-3">
              <p className="font-semibold text-ink">{category.label}</p>
              <p className="mt-1 text-sm text-basalt/70">{category.description}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-basalt/55">
                {category.starterKinds.length} primitives
              </p>
            </div>
          ))}
        </div>
      </article>
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Layer Panel</h2>
        <div className="mt-4 space-y-2">
          {layers.map((layer) => (
            <div key={layer.id} className="flex items-center gap-3 rounded-md border border-ink/10 p-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: layer.color }} />
              <span className="flex-1 text-sm font-medium text-basalt">{layer.label}</span>
              <span className="text-xs text-basalt/60">{layer.visible ? "visible" : "hidden"}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export function PlanningPanels() {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Lighting Plan</h2>
        <div className="mt-4 space-y-3">
          {lightingFixtures.map((fixture) => (
            <Metric key={fixture.id} label={`${fixture.label} (${fixture.count})`} value={`${fixture.colorTemperatureK}K`} />
          ))}
        </div>
      </article>
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Decor/Floral</h2>
        <p className="mt-2 text-sm text-basalt">
          {floralPalette.primary}, {floralPalette.secondary}, {floralPalette.accent}; {floralPalette.garlandMeters}m garland.
        </p>
        <div className="mt-4 space-y-2">
          {decorItems.map((item) => (
            <p key={item.id} className="rounded-md bg-mist px-3 py-2 text-sm text-basalt">
              {item.quantity} x {item.label}
            </p>
          ))}
        </div>
      </article>
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Material Board</h2>
        <div className="mt-4 space-y-2">
          {materialPalette.map((material) => (
            <div key={material.id} className="flex items-center gap-3 rounded-md border border-ink/10 p-2">
              <span className="h-8 w-8 rounded" style={{ backgroundColor: material.color }} />
              <div>
                <p className="text-sm font-semibold text-ink">{material.label}</p>
                <p className="text-xs text-basalt/60">{material.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export function ActivityAndExports() {
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Activity Feed</h2>
        <div className="mt-4 space-y-3">
          {observatoryEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-3 rounded-md bg-ivory p-3">
              <StatusBadge status={event.status} />
              <div>
                <p className="text-sm font-semibold text-ink">{event.label}</p>
                <p className="text-xs text-basalt/60">{event.at}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
      <article className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">Export Panel</h2>
        <div className="mt-4 space-y-3">
          {exportJobs.map((job) => (
            <div key={job.id} className="rounded-md border border-ink/10 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink">{job.label}</p>
                <StatusBadge status={job.status} />
              </div>
              <p className="mt-2 text-xs leading-5 text-basalt/70">{job.evidence}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export function ObservatoryMatrix() {
  const rows: Array<[string, string, CapabilityStatus]> = [
    ["Routes", "33 professional page frames", "READY" as const],
    ["Schema", "31 Prisma models plus Zod schemas", "READY" as const],
    ["CAD Runtime", "Three.js editor shell with starter primitives", "READY" as const],
    ["Evidence", "Release evidence JSON and status matrix", "READY" as const],
    ["DWG/DXF", "Real exporter not implemented", "BLOCKED" as const],
    ["Production", releaseStatus.productionReady ? "Production evidence exists" : "Production evidence absent", "BLOCKED" as const]
  ];

  return (
    <section className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Observatory Status Matrix</h2>
          <p className="text-sm text-basalt/70">Final verdict: {releaseStatus.verdict}; PRODUCTION_READY=false.</p>
        </div>
        <ShieldAlert aria-hidden className="h-5 w-5 text-lotus" />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs uppercase tracking-[0.12em] text-basalt/55">
              <th className="py-2 pr-4">Area</th>
              <th className="py-2 pr-4">Evidence</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([area, evidence, status]) => (
              <tr key={area} className="border-b border-ink/5">
                <td className="py-3 pr-4 font-semibold text-ink">{area}</td>
                <td className="py-3 pr-4 text-basalt">{evidence}</td>
                <td className="py-3">
                  <StatusBadge status={status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-ink/10 bg-ivory p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-basalt/55">{label}</p>
      <p className="mt-1 text-base font-semibold text-ink">{value}</p>
    </div>
  );
}
