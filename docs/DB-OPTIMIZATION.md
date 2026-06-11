# Database optimization — CAD asset configurations

Status of this pass: **indexes added** to the CAD/asset hot path. Deeper
production changes (Postgres, enums, pooling) are recommended below and not yet
applied, since they depend on the SQLite→Postgres move.

## What changed (applied)

The schema previously had **no indexes**, so every foreign-key join and every
`status` / `category` / `kind` filter was a full table scan. Added covering
indexes on the tables that drive CAD asset configuration reads:

- **`CADObject`** (the hot table — one row per object per scene):
  `sceneId`, `layerId`, `materialId`, plus composites `(sceneId, layerId)` and
  `(sceneId, kind)` for "load a scene", "load a layer", "objects of a kind".
- **`Asset`** (the configuration library, 648 rows × 27 categories):
  `(organizationId, category)`, `(organizationId, status)`,
  `(organizationId, category, status)`, `(category, kind)`, `materialId`.
- **`Material`**: `@@unique([organizationId, name])` — also serves org lookups
  and prevents duplicate palette entries.
- **`Scene`** `projectId`; **`Layer`** `sceneId`, `(sceneId, sortOrder)`.
- **`Project`** `ownerId`, `(organizationId, status)`.
- **`MarketplaceItem`** `(organizationId, status)`, `(organizationId, category)`,
  `assetId`.

Redundant standalone `organizationId` indexes were intentionally omitted —
composite indexes serve org-only scans via their leftmost prefix, and extra
indexes only slow writes.

### Apply the migration (on your Mac — Prisma's engine can't run in the sandbox)

```bash
npx prisma migrate dev --name add_cad_asset_indexes
```

Note: the new `@@unique([organizationId, name])` on `Material` will fail if the
data already has duplicate material names within an org. The seed data is
unique, so a fresh DB is fine; for existing data, dedupe first.

## Enums + PostgreSQL (applied)

The datasource provider is now **`postgresql`**, and free-text status/verdict
fields are real DB enums. The split is deliberate:

**DB enums** (values are valid identifiers the app already uses verbatim, so no
translation layer is needed):

- `enum CapabilityStatus { READY PARTIAL BLOCKED }` → `Asset.status`,
  `Scene.status`, `Layout.status`, `FloralDesign.status`, `LightingPlan.status`,
  `SeatingPlan.status`, `MarketplaceItem.status`, `RenderJob.status`,
  `Evidence.status`.
- `enum ReleaseVerdict { CONTROLLED_PREVIEW_READY PRODUCTION_READY BLOCKED }` →
  `Project.status`, `ReleaseGate.verdict`.

**App-layer (Zod) enums, NOT DB enums** — added in `src/lib/schemas.ts`
(`CadObjectKindSchema`, `CapabilityStatusSchema`, `ReleaseVerdictSchema`):

- **`kind`** (`CADObject.kind`, `Asset.kind`) stays `String`. Its canonical
  values are kebab-case (`floral-garland`), which are illegal Prisma enum
  identifiers. A DB enum would force `FLORAL_GARLAND`-style names and a
  translation layer at every read/write, breaking the kebab-case the scene
  graph and serialization already rely on. Enforced via `CadObjectKindSchema`.
- **`category`** stays `String`. The columns hold *different* vocabularies per
  model — `Asset.category` is seeded with **layer IDs** (`site`, `mandap`, …),
  `MarketplaceItem.category` is `"commerce"`, vendor/event categories differ.
  No single enum fits; the 27-value `AssetCategorySchema` already validates the
  JSON asset library, which is where those values actually live.

**Intentionally left as `String`** (heterogeneous / unverified domains): the
status fields on `BudgetItem` (`estimated`/`quoted`/`blocked`), `Vendor`
(`demo`/`blocked-live`), `Guest` (`invited`), `Task`, `Export`, `Walkthrough`,
`AIGeneration`, `ObservatoryEvent`, and `Budget`. Promote these to enums once
their full value sets are confirmed.

### Migrating (on your Mac — Prisma's engine can't run in the sandbox)

The old SQLite migration was removed (it can't apply to Postgres). With a
Postgres instance reachable via `DATABASE_URL`:

```bash
# .env -> DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/parinaya?schema=public"
createdb parinaya                       # or use Neon/Supabase/Vercel Postgres
npx prisma migrate dev --name init      # fresh initial migration incl. enums + indexes
npm run db:seed                         # seed values already match the enums
```

`npm run db:migrate` now runs `prisma migrate deploy` (for CI/prod);
`db:migrate:dev` runs `prisma migrate dev`. The legacy
`scripts/apply-sqlite-migration.mjs` is obsolete.

## Recommended next (production-bound)

~~SQLite → PostgreSQL~~ and ~~String → native enums~~ are **done** (see sections
above). Remaining:

1. **`Json` → `jsonb` (now active on Postgres).** Prisma maps `Json` to `jsonb`
   automatically, so `position`/`rotation`/`scale`/`geometry`/`metadata` are
   binary JSON. If you ever filter *inside* `geometry` or `metadata` (e.g.
   configurations with a given parameter), add a **GIN index** on that column
   via a raw migration.
2. **Serverless connection pooling.** On Vercel, a new Prisma connection per
   invocation will exhaust Postgres. Use Prisma Accelerate or a pooled
   connection string (PgBouncer / Neon pooler), and instantiate a single
   `PrismaClient` singleton.
3. **Cursor pagination for the asset library.** 648+ configurations should page
   with `cursor` + `take` on the indexed `(organizationId, category, status)`
   ordering rather than `skip`/`offset`, which degrades on large offsets.
4. **Optional — a dedicated `AssetConfiguration` model.** Today an `Asset` row
   flattens (category × template/style × material) into one record. If you need
   to manage *variants* of a base asset (same geometry, different material/
   params/status per project), normalize into `Asset` (base) +
   `AssetConfiguration` (assetId, templateId, params `Json`, status) with
   `@@index([assetId, status])`. Only worth it if you actually query variants.

## Query-side guidance

- Load a scene in one round trip: `scene.findUnique({ include: { layers: …,
  cadObjects: { include: { material: true } } } })` — the new indexes make the
  nested fetches index-seeks instead of scans.
- Always scope asset queries by `organizationId` first (multi-tenant) so the
  composite indexes apply.
- Prefer `select` over `include` when you don't need full rows, to cut payload
  and I/O.
