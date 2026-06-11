"use client";

import { StatusBadge } from "@/components/layout/StatusBadge";
import { cadObjects, layers } from "@/lib/data-frames";
import {
  createBoqCsvExport,
  createPlanSvgExport,
  createPreviewDxfExport,
  createPrintableBoardHtmlExport,
  createSceneJsonExport,
  type ExportArtifact
} from "@/lib/export-runtime";
import { recordPreviewEvent } from "@/lib/telemetry";

const REAL: { label: string; format: string; build: () => ExportArtifact }[] = [
  { label: "Scene", format: "JSON", build: () => createSceneJsonExport(cadObjects) },
  { label: "2D Plan", format: "SVG", build: () => createPlanSvgExport(cadObjects, layers) },
  { label: "Footprint", format: "DXF", build: () => createPreviewDxfExport(cadObjects, layers) },
  { label: "BOQ Sheet", format: "CSV", build: () => createBoqCsvExport(cadObjects) },
  { label: "Printable Board", format: "HTML", build: () => createPrintableBoardHtmlExport() }
];

const BLOCKED = [
  { label: "Native DWG", format: "DWG", note: "no native DWG writer" },
  { label: "Production DXF", format: "DXF", note: "certified CAD handoff blocked" }
];

function download(artifact: ExportArtifact): void {
  const blob = new Blob([artifact.content], { type: artifact.mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = artifact.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  recordPreviewEvent("export", { file: artifact.fileName, mime: artifact.mimeType });
}

export function MandapExportBar() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {REAL.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => download(item.build())}
            className="rounded-md border border-[#d9aa46]/40 bg-mist p-3 text-left transition hover:border-[#d9aa46] hover:bg-[#d9aa46]/10"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-basalt/55">{item.format}</span>
              <StatusBadge status="READY" />
            </div>
            <p className="mt-1 text-sm font-semibold text-ink">{item.label}</p>
            <p className="text-[10px] text-basalt/50">downloads now</p>
          </button>
        ))}
        {BLOCKED.map((item) => (
          <div key={item.label} className="cursor-not-allowed rounded-md border border-ink/10 bg-mist p-3 opacity-70" aria-disabled>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-basalt/55">{item.format}</span>
              <StatusBadge status="BLOCKED" />
            </div>
            <p className="mt-1 text-sm font-semibold text-ink">{item.label}</p>
            <p className="text-[10px] text-basalt/50">{item.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-basalt/45">
        Scene/Plan/DXF/BOQ/Board export real files from the local scene. Native DWG and production-grade DXF remain
        blocked — no native CAD writer or certified handoff exists.
      </p>
    </div>
  );
}
