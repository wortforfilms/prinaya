import { StatusBadge } from "@/components/layout/StatusBadge";
import type { BoardComposerPanel, CopilotPanel } from "@/lib/kbs/surfaces";
import { Boxes, Layers, PackageCheck, Sparkles } from "lucide-react";

/** AI Co-Pilot surface backed by the KBS knowledge graph. */
export function CopilotKnowledgePanel({ panel }: { panel: CopilotPanel }) {
  return (
    <section className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden className="h-5 w-5 text-[#d9aa46]" />
          <h2 className="text-lg font-semibold text-ink">AI Co-Pilot — KBS recommendations</h2>
        </div>
        <StatusBadge status={panel.status} />
      </header>
      <p className="mt-2 text-sm text-basalt/70">{panel.summary}</p>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.7fr]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">Recommendations</p>
          {panel.recommendations.length === 0 ? (
            <p className="mt-2 text-sm text-basalt/60">No graph recommendations for this route yet.</p>
          ) : (
            <ul className="mt-2 grid gap-2">
              {panel.recommendations.map((rec) => (
                <li key={rec.recommendation} className="rounded-md border border-ink/10 bg-mist p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-ink">{rec.recommendationName}</span>
                    <ConfidenceBar value={rec.confidence} />
                  </div>
                  <p className="mt-1 text-xs text-basalt/60">{rec.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid content-start gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">Seed nodes</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {panel.seeds.map((seed) => (
                <span key={seed.id} className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-mist px-2.5 py-1 text-xs text-ink">
                  <Boxes aria-hidden className="h-3.5 w-3.5 text-basalt/50" />
                  {seed.name}
                </span>
              ))}
            </div>
          </div>
          {panel.relatedKnowledge.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-basalt/55">Related knowledge</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {panel.relatedKnowledge.map((node) => (
                  <span key={node.id} className="inline-flex items-center rounded-full border border-ink/10 px-2.5 py-1 text-xs text-basalt/70">
                    {node.type}: {node.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Board Composer surface backed by KBS board/template/asset relations. */
export function BoardComposerKnowledgePanel({ panel }: { panel: BoardComposerPanel }) {
  return (
    <section className="rounded-md border border-ink/10 bg-white p-4 shadow-sm">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers aria-hidden className="h-5 w-5 text-[#d9aa46]" />
          <h2 className="text-lg font-semibold text-ink">Board Composer — KBS-linked pages</h2>
        </div>
        <StatusBadge status={panel.status} />
      </header>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-basalt/60">
        {panel.pipeline.map((stage, index) => (
          <span key={stage} className="inline-flex items-center gap-2">
            <span className="rounded-full bg-mist px-2.5 py-1 font-semibold text-ink">{stage}</span>
            {index < panel.pipeline.length - 1 && <span aria-hidden>→</span>}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric icon={PackageCheck} label="Templates" value={panel.templateCount} />
        <Metric icon={Boxes} label="Assets" value={panel.assetCount} />
        <Metric icon={Layers} label="Use cases" value={panel.useCaseCount} />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {panel.boards.map((board) => (
          <article key={board.boardId} className="rounded-md border border-ink/10 bg-mist p-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-ink">{board.title}</h3>
              <StatusBadge status={board.status} />
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-basalt/55">source: {board.source || "scene"}</p>
            <p className="mt-2 text-xs text-basalt/70">
              {board.linkedTemplates.length} template(s) · {board.linkedAssetCount} linked asset(s)
            </p>
            {board.bindings.length > 0 && (
              <p className="mt-1 text-xs text-basalt/55">{board.bindings.join(" · ")}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-ink/10">
        <span className="block h-full rounded-full bg-neem" style={{ width: `${Math.round(value * 100)}%` }} />
      </span>
      <span className="text-xs font-semibold text-basalt/70">{Math.round(value * 100)}%</span>
    </span>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Boxes; label: string; value: number }) {
  return (
    <div className="rounded-md border border-ink/10 bg-mist p-3">
      <Icon aria-hidden className="h-4 w-4 text-[#d9aa46]" />
      <p className="mt-2 text-lg font-semibold text-ink">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-basalt/55">{label}</p>
    </div>
  );
}
