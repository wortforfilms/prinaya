# KBS v1.0 — Knowledge Base System

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

Growth path: expand the curated JSON layers (rituals, films, vedis, vendors),
add `Nakshatra`/`Tithi`/`Muhurat` muhurat-engine nodes for the Vedi Finder, and
generate `Shot`/`Drone` nodes from the film layer. The engine, schema, and
verifier already scale to these without code changes.
