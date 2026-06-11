# Production Roadmap — TLP Wedding CAD Studio

Current state (per `release/evidence/`): **CONTROLLED_PREVIEW_READY**, `PRODUCTION_READY=false`.
The application code is clean and type-safe; what stands between it and production is
(1) infrastructure to run it for real users and (2) a set of capabilities that are
currently preview shells — some of which need partners, licenses, or certification,
not just engineering.

The honest framing: **"production" means two different things here.** Shipping the
preview as a real, hosted product is achievable in roughly 1–3 weeks. Making the
BLOCKED capabilities genuinely real (payments, live vendors, native CAD export,
certified safety validation) is a multi-month effort gated by business and legal
work, not code. This roadmap covers both, in phases.

---

## Phase 0 — Ship the preview as a real product (≈1 week)

Independent of every BLOCKED feature. Gets a labelled, controlled preview live.

1. **Version control hygiene** *(mostly done)*
   - Run `bash scripts/migrate-to-lfs.sh` before the first push to keep history lean.
   - Push to the remote.
2. **CI pipeline** — GitHub Actions on Linux running `typecheck`, `lint`, `test`,
   `build` on every PR. This also permanently fixes the "native binaries are
   macOS-only" problem we hit locally, since CI installs platform-correct deps.
3. **Database migration: SQLite → hosted Postgres.** SQLite (`prisma/dev.db`) will
   not work on serverless hosting. Switch the Prisma datasource to `postgresql`,
   provision Neon / Supabase / Vercel Postgres, and re-run migrations. *(Required
   before any real deploy.)*
4. **Deploy** — Vercel is the native fit for Next 15. Wire env vars/secrets, point
   the app at the hosted DB, and configure asset delivery (LFS + CDN, or move
   `public/` binaries to object storage).
5. **Observability + safety labelling** — add error monitoring (e.g. Sentry) and
   keep the existing READY/PARTIAL/BLOCKED status badges visible so preview-only
   features are never mistaken for certified ones.

**Exit criteria:** the app is live, CI-gated, on a production-grade DB, with
preview features clearly labelled.

---

## Phase 1 — Foundations for real users (≈2–4 weeks)

Turns a demo into a multi-user application. All code; the schema already has the
models (org / user / role / permission, project, scene, etc.).

1. **Authentication** — `/auth/*` is currently a preview shell. Add real auth
   (Auth.js/NextAuth or Clerk): accounts, sessions, and the multi-tenant
   org model the schema already anticipates.
2. **Authorization** — enforce the role/permission models on API routes and pages.
3. **Real persistence for scenes** — the CAD editor currently saves scenes to
   `localStorage` and in-memory JSON. Move save/load to API routes backed by
   Prisma so projects persist per user across devices. *(The store's `saveScene`/
   `loadScene` are the integration points; validation already exists.)*
4. **File storage** — user uploads, generated boards, and exports should go to
   object storage (S3 / Cloudflare R2), not the repo's `public/` directory.

**Exit criteria:** users can sign in, create projects, and have their scenes and
exports persist securely.

---

## Phase 2 — Make the BLOCKED capabilities real (months; mostly NOT code)

Each of these is flagged BLOCKED in the evidence for a reason. Effort and the
*type* of work differ sharply.

| Capability | What it really needs | Gate type |
| --- | --- | --- |
| **Payments** | Stripe integration (checkout, subscriptions), business entity + Stripe account, order model, webhooks. PCI is handled by Stripe. | Engineering + business |
| **Marketplace commerce** | Seller onboarding, listings, orders, fulfilment, payouts via **Stripe Connect**. | Engineering + business + ops |
| **Live vendor network** | Real vendor onboarding, data/API, booking and contract flows, account management. | Partnership + ops, then code |
| **Native DWG export** | DWG is a proprietary Autodesk format — needs a licensed library (Open Design Alliance / ODA SDK, commercial) or a conversion service, plus round-trip QA against AutoCAD. | Licensing + significant engineering |
| **Production DXF export** | A real DXF writer with layers, units, blocks, dimensions, title sheets, and CAD-handoff QA (the current export is a preview footprint only). | Engineering |
| **Structural / electrical / fire validation** | Cannot be closed by code. Requires licensed-engineer (PE) signoff, integration with real codes/standards, and a legal liability framework. Realistic path: partner with engineering firms and build a **human-in-the-loop certification workflow** on top of the existing preview checks. | Legal + partnership + engineering |
| **Engineering / authority compliance** | Jurisdiction-specific approvals. Realistic path: generate submission-ready documents for human review, don't claim automated signoff. | Legal + partnership |

**Sequencing suggestion:** Payments → Marketplace are the most self-contained and
revenue-relevant. CAD export (DWG/DXF) is a deep engineering+licensing track that
can run in parallel. The safety/compliance validators are the **highest-liability**
items and should stay explicitly non-certified until the legal framework exists.

---

## Phase 3 — Production hardening (ongoing, alongside Phases 1–2)

1. **Testing** — raise coverage beyond the current unit tests; add Playwright E2E
   (config already present), visual-regression for the 3D/CAD canvas, and load tests.
2. **Performance** — optimize 3D/GLB assets, serve images via `next/image` + CDN,
   and code-split the large components (`PremiumDashboard` ~985 LOC, `CadEditor`
   ~784 LOC, `TlpsWeddingOsHomepage` ~1014 LOC).
3. **Security** — dependency scanning, rate limiting, input validation (Zod already
   in use), secrets management, and a security review before launch.
4. **Legal & data protection** — Terms of Service, privacy policy, and data handling
   for personal/wedding data (GDPR / India DPDP). **Explicit liability disclaimers
   on the safety-validation features** are non-negotiable.
5. **Accessibility & SEO** — audit and address before public launch.

---

## The single biggest gate

The structural / electrical / fire / engineering features touch **real-world
physical safety and legal liability**. They must remain clearly labelled as
preliminary and non-certified until there is a proper engineering + legal framework
behind them. Everything else is a normal (if substantial) build-out; this one is a
genuine go/no-go on claims you can make to customers.

---

### Fastest credible path to a launchable product

Phase 0 + Phase 1 + Stripe payments (from Phase 2), with every BLOCKED safety/CAD
feature kept visibly in preview. That yields a real, monetizable design tool in
roughly 4–6 weeks, while the heavyweight CAD-export and certification tracks proceed
on their own timelines.
