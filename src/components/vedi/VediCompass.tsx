"use client";

import { useMemo, useState } from "react";
import { Compass } from "lucide-react";

type VediOption = {
  id: string;
  name: string;
  vastuDirection: string;
  agniZone: string;
  pheraDirection: string;
  topMuhurat: string | null;
};

const DIRECTIONS = [
  { label: "N", min: 337.5, max: 360 },
  { label: "N", min: 0, max: 22.5 },
  { label: "NE", min: 22.5, max: 67.5 },
  { label: "E", min: 67.5, max: 112.5 },
  { label: "SE", min: 112.5, max: 157.5 },
  { label: "S", min: 157.5, max: 202.5 },
  { label: "SW", min: 202.5, max: 247.5 },
  { label: "W", min: 247.5, max: 292.5 },
  { label: "NW", min: 292.5, max: 337.5 }
];

function directionFor(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  return DIRECTIONS.find((d) => normalized >= d.min && normalized < d.max)?.label ?? "N";
}

/**
 * Compass / orientation input: enter the venue's entry bearing and the finder
 * recommends the vedi whose vastu facing best matches an east-aligned axis.
 */
export function VediCompass({ vedis }: { vedis: VediOption[] }) {
  const [bearing, setBearing] = useState(90); // default due East
  const facing = directionFor(bearing);

  const recommendation = useMemo(() => {
    // Prefer a vedi whose vastu direction matches the entry facing; else east-facing.
    return (
      vedis.find((v) => v.vastuDirection.toUpperCase() === facing) ??
      vedis.find((v) => v.vastuDirection.toUpperCase() === "EAST" || v.vastuDirection.toUpperCase() === "E") ??
      vedis[0] ??
      null
    );
  }, [vedis, facing]);

  return (
    <section className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <header className="flex items-center gap-2">
        <Compass aria-hidden className="h-5 w-5 text-[#d9aa46]" />
        <h2 className="text-lg font-semibold text-ink">Venue orientation</h2>
      </header>

      <div className="mt-4 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
        <div>
          <label htmlFor="bearing" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">
            Entry bearing: {bearing}° ({facing})
          </label>
          <input
            id="bearing"
            type="range"
            min={0}
            max={359}
            value={bearing}
            onChange={(event) => setBearing(Number(event.target.value))}
            className="mt-2 w-full accent-[#d9aa46]"
          />
          <div className="mt-2 flex justify-between text-[10px] text-basalt/50">
            <span>N 0°</span>
            <span>E 90°</span>
            <span>S 180°</span>
            <span>W 270°</span>
          </div>
        </div>

        <div className="rounded-md border border-neem/30 bg-neem/10 p-3">
          {recommendation ? (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">Recommended vedi</p>
              <p className="mt-1 font-semibold text-ink">{recommendation.name}</p>
              <dl className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <Cell label="Vastu" value={recommendation.vastuDirection} />
                <Cell label="Agni" value={recommendation.agniZone} />
                <Cell label="Phera" value={recommendation.pheraDirection} />
              </dl>
              {recommendation.topMuhurat && (
                <p className="mt-2 text-xs text-basalt/70">Suggested muhurat: {recommendation.topMuhurat}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-basalt/60">No vedi configurations available.</p>
          )}
          <p className="mt-2 text-[10px] text-basalt/45">
            Preview guidance from the KBS vastu model — not a certified vastu or panchang consultation.
          </p>
        </div>
      </div>
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-white/70 p-2">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-basalt/55">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink">{value || "—"}</dd>
    </div>
  );
}
