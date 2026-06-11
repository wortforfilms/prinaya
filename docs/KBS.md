# KBS v2 — Knowledge Base System

**v2 scale (verified):** 1,406 nodes · 4,539 relations · 23 entity types · 0 dangling
relations. Full Vedic panchanga (27 nakshatras, 30 tithis, 27 yogas, 11 karanas,
2 paksha, 12 rashis, 9 grahas), a 12-window wedding muhurat registry, a 17-page
Board Composer, categorized AI Co-Pilot suggestions, and the
`/hemant-samwat-vedi` Vedi Intelligence route. Release gate preserved:
CONTROLLED_PREVIEW_READY, PRODUCTION_READY=false; all blockers intact.



The KBS is a **first-class runtime knowledge graph**, not a flat asset catalog.
Every domain entity is a typed node; typed edges connect them; and the graph is
assembled in memory from the existing first-class registries plus curated
knowledge layers. It is the intelligence backbone shared by TLPS Wedding OS,
Wedding CAD Studio, Filmy Studio, the Vedi Finder, AI Co-Pilot, Board Composer,
and Observatory.

Release gate is preserved: **CONTROLLED_PREVIEW_READY**, `PRODUCTION_READY=false`.
Recommendations are rule-based preview heuristics — no live AI/vendor/payment
runtime is claimed.

## Node schema

```ts
KbsNode {
  id          // "<type>:<slug>"  e.g. asset:mandaps-vedic-lotus-001
  type        // KbsEntityType
  category
  name
  description
  status      // READY | PARTIAL | BLOCKED
  metadata    // free-form per type
  relations   // KbsRelation[]  { kind, to, weight? }
  evidence    // source paths
  createdAt
  updatedAt
}
```

Entity types: `Asset, Template, Board, UseCase, Workflow, Screen, Route, Vendor,
Guest, Film, Shot, Drone, Venue, Mandap, Vedi, Stage, Floral, Lighting, Ritual,
Nakshatra, Tithi, Muhurat, Cost, Material, Evidence`.

Relation kinds: `uses, references, partOf, rendersTo, recommends, requires,
documents, derivedFrom, linkedTo`.

## Where nodes come from

| Layer | Source | Derived at runtime |
| --- | --- | --- |
| Assets (Mandap/Floral/Lighting/Venue/Asset) | `wedding-asset-library` | yes |
| Routes | `route-matrix` | yes |
| Use cases | `category-demo-usecases` | yes |
| Screens | `data/screens/preview-ready-screens.json` | yes |
| Templates | `template-runtime` | yes |
| Boards | `board-runtime` | yes |
| Materials | `data-frames` | yes |
| **Rituals** | `data/kbs/rituals.json` | curated |
| **Vedis** | `data/kbs/vedi.json` | curated |
| **Films** | `data/kbs/films.json` | curated |
| **Vendors** | `data/kbs/vendors.json` | curated (BLOCKED) |
| **Muhurat** (Nakshatra/Tithi/Muhurat) | `data/kbs/muhurat.json` | curated |

Derived nodes are computed live, so the runtime works without a build step.
`kbs:generate` emits portable snapshots + evidence for inspection/CI.

## Runtime API (`src/lib/kbs/`)

```ts
import { kbs, buildKbsGraph } from "@/lib/kbs/registry";
import { searchKbs } from "@/lib/kbs/search";
import { recommendForNode } from "@/lib/kbs/recommendations";

const graph = kbs();                              // cached singleton
graph.getNode("asset:mandaps-royal-palace-002");
graph.neighbors(id, "uses");                      // outbound, filterable
graph.inboundNodes(id, "references");             // reverse edges
graph.traverse(id, 2);                            // BFS to depth
graph.stats();                                    // counts + dangling
graph.validate();                                 // integrity issues

searchKbs(graph, "royal mandap", { type: "Mandap", limit: 10 });
recommendForNode(graph, "mandap-node-id");        // [{ recommendation, confidence, reason }]
```

- `graph.ts` — `KbsNode` types + `KnowledgeGraph` engine (indexes, traversal, stats, validation).
- `relations.ts` — relation constructors + canonical id builders.
- `registry.ts` — `buildKbsGraph()` / `kbs()` singleton.
- `search.ts` — ranked text search with type/status/category filters.
- `recommendations.ts` — co-occurrence + complementary-category heuristic, confidence ∈ [0.5, 1].

## Wired surfaces

`src/lib/kbs/surfaces.ts` adapts the graph into render-ready panels, shown by
`RoutePage` (`src/components/routes/KbsPanels.tsx`):

- **AI Co-Pilot** (`/ai`) — `buildCopilotPanel(routePath)` seeds from nodes linked
  to the route (falling back to the project mandaps), aggregates
  `recommendForNode` across seeds (strongest confidence per target), and surfaces
  related ritual/vedi/film/material knowledge within two hops.
- **Board Composer** (`/exports`, `/gallery`) — `buildBoardComposerPanel()` walks
  each `Board` node to its inbound `Template` references and the assets those
  templates use, rendering the `Scene → Render → Board Composer → PDF Package`
  pipeline with live template/asset/use-case counts.

- **Vedi Finder** (`/mandap`) — `buildVediFinderPanel()` lists each `Vedi` with
  its vastu direction, agni zone, and phera direction, the rituals it supports,
  and the auspicious `Muhurat` windows linked to it (each resolving its required
  `Nakshatra` + `Tithi`), plus the top-scoring muhurat overall. Preview reference
  data — not a certified panchang service.

- **Vedi Intelligence** (`/hemant-samwat-vedi`) — `buildVediIntelligence()` powers a
  standalone route (outside the matrix, like `/cad/editor`) with a client
  `VediCompass` orientation input, the Ashtadik vastu grid, the full 27-nakshatra
  / 30-tithi / muhurat lookups, and a board-export link.

The Board Composer now renders the canonical **17 pages** (Cover, Concept, Venue,
Layout, Mandap, Vedi, Ritual Flow, Floral, Lighting, Budget, Guest, Vendor,
Production, Drone, VR, Render Gallery, Evidence). The Co-Pilot emits **7 suggestion
groups** (Mandap, Vedi, Muhurat, Budget, Vendor, Layout, Risk — Risk surfaces the
preserved blockers).

All are server-safe (cached singleton graph) and stay within the preview gate.

## Scripts & evidence

```bash
npm run kbs:generate   # writes data/kbs/{assets,screens,usecases,templates,boards,graph}.json
                       # + release/evidence/kbs.json (stats, validation, gate)
npm run verify:kbs     # asserts graph builds, all layers present, no errors, search/recs work
npm test               # tests/kbs.test.ts (engine unit tests + runtime integration)
```

Curated source files (`rituals/vedi/films/vendors.json`) are hand-authored and
are **not** overwritten by `kbs:generate`.

## Integrity model

Structural problems (missing id/name) are **errors** and fail verification.
Dangling relations — edges pointing at nodes that don't exist yet — are
**warnings**, so forward-looking curated links are tolerated and surfaced rather
than blocking. The current curated layer has zero dangling references.

## Phase-1 roadmap (aspirational targets)

v1.0 wires the runtime and derives everything that exists today, with seed
curated layers. The Phase-1 growth targets are:

```
Assets 2,000+ · Screens 432 · Use Cases 108 · Templates 200 · Boards 100
Ritual 50 · Film 300 · Vendor 500   →  ~5,000+ nodes, ~25,000+ relations
```

Growth path: expand the curated JSON layers (rituals, films, vedis, vendors,
muhurat) and generate `Shot`/`Drone` nodes from the film layer. The
`Nakshatra`/`Tithi`/`Muhurat` muhurat layer powering the Vedi Finder is in place
(`data/kbs/muhurat.json`); growing it to the full 27 nakshatras / panchang tithis
is pure data. The engine, schema, and verifier scale to these without code
changes.
