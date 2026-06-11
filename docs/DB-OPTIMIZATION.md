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

## Recommended next (production-bound)

1. **SQLite → PostgreSQL.** SQLite single-writer locking won't survive
   concurrent users or serverless hosting. Switch the datasource `provider` to
   `postgresql` and re-run migrations. This is the prerequisite for the rest.
2. **`Json` → `jsonb` (automatic on Postgres).** Prisma already maps `Json` to
   `jsonb` on Postgres, so `position`/`rotation`/`scale`/`geometry`/`metadata`
   become binary JSON for free. If you ever filter *inside* `geometry` or
   `metadata` (e.g. configurations with a given parameter), add a **GIN index**
   on that column via a raw migration.
3. **String → native enums.** `status` (READY/PARTIAL/BLOCKED), `category`,
   `kind`, and `verdict` are free-text today. Postgres enums give integrity,
   smaller rows, and faster equality. This is a breaking change (needs a
   backfill migration), so do it with the Postgres move.
4. **Serverless connection pooling.** On Vercel, a new Prisma connection per
   invocation will exhaust Postgres. Use Prisma Accelerate or a pooled
   connection string (PgBouncer / Neon pooler), and instantiate a single
   `PrismaClient` singleton.
5. **Cursor pagination for the asset library.** 648+ configurations should page
   with `cursor` + `take` on the indexed `(organizationId, category, status)`
   ordering rather than `skip`/`offset`, which degrades on large offsets.
6. **Optional — a dedicated `AssetConfiguration` model.** Today an `Asset` row
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
