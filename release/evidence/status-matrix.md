# TLP Wedding CAD Status Matrix

Generated: 2026-06-09T18:24:30.565Z

Final verdict: CONTROLLED_PREVIEW_READY  
PRODUCTION_READY=false

| Area | Status | Evidence |
| --- | --- | --- |
| Route matrix | READY | 32 matrix routes plus `/cad/editor` runtime route render READY preview frames. |
| Unified premium layout/theme | READY | Shared route pages and CAD runtime use the premium dark shell with fixed luxury sidebar, dark top command bar, scoped route-card theme, and controlled-preview status treatment. |
| Floral Designer route absorption | READY | `/floral` renders the extracted dark premium Floral Designer workspace for Hemant Samwat Wedding with 6 KPI widgets, 9 tabs, 14 numbered panels, 12 local visual asset refs, 91 placement points, and 6 local runtime coverage checks. |
| Hero banner generation | READY | 21 hero banners were generated as 1920x580 high-res local preview WebP assets from the supplied board reference and mapped across 34 route bindings. |
| TLPS Wedding OS homepage extraction | READY | 10 full-page sections, 7 destination cards, 4 design studio cards, and 8 film cards were extracted into local preview assets for `/wedding-os`. |
| TLPS unique source extraction | READY | 591 unique source/frame crops were extracted from 30/31 supplied PNG sources; 1 related duplicate source was recorded and skipped. |
| Preview frame runtime | READY | 32/32 route frames have typed demo data and local runtime coverage; 208 demo data points and 139 local coverage checks are generated from code. |
| UI frame extraction | READY | Reusable UI frame definitions are complete and all frame statuses are READY. |
| Generated board extraction | READY | 9 PNG boards, 63 extracted frames/options, and 38 technical panels render in `/vr`. |
| Data frame extraction | READY | Typed frames exist for project, venue, mandap, seating, lighting, floral, materials, CAD objects, layers, assets, budget, vendors, guests, drone zones, jobs, events, and blockers. |
| Complete CAD asset registry | READY | 648 generated local preview asset records across 27 categories: READY=432, PARTIAL=160, BLOCKED=56. CAD insert coverage: 592 GLB-backed primitive placeholders. Local GLB mesh files generated: 592; vendor production mesh models are not claimed. |
| Prisma schema | READY | 31 required domain models plus join tables for role/user and role/permission relations. |
| Zod and TypeScript models | READY | 31 model schemas and exported TypeScript types. |
| Three.js CAD runtime | READY | `/cad/editor` has canvas, grid, camera modes, insertion, selection, transform controls, layer visibility, material assignment, scene JSON save/load, JSON download, preview DXF export, and printable board HTML export. |
| SPRINT-04 CAD editor maturity | READY | 10/10 editor tools are READY: Scene hierarchy panel, Layer tree with lock/hide, Object inspector, Material inspector, Asset browser, Measurement tool, Annotation tool, Template loader, Scene statistics, Save/load validation. |
| Scene graph maturity | READY | Scene hierarchy branches are venue, mandap, stage, seating, lighting, decor with Object Tree, Layer Tree, Selection Manager, Property Inspector, Search, Grouping, and Lock/Hide controls. |
| Wedding asset library | READY | 648 reusable local preview asset records: 24 Mandaps, 24 Structural Elements, 24 Pillars, 24 Gates & Arches, 24 Backdrops, 24 Decor Props, 24 Floral Installations, 24 Flower Types, 24 Furniture, 24 Seating, 24 Tables, 24 Lighting Fixtures, 24 Decorative Lighting, 24 Effects, 24 Truss & Rigging, 24 LED & Screens, 24 Audio, 24 Venue Zones, 24 Utilities, 24 Guest Planning, 24 Vendor Documents, 24 Production Planning, 24 Drone Planning, 24 VR Walkthrough, 24 Boards, 24 Templates, 24 AI Outputs. |
| Board composer runtime | READY | Scene to Render to Board Composer to PDF Package frame has 9 pages: Cover, Concept, Site Plan, Mandap Plan, Lighting Plan, Floral Plan, Budget, BOM, Render Gallery. |
| Binary PDF board package | READY | Local PDF package generation writes `release/board-packages/hemant-samwat-board-package.pdf` with 9 pages from scene, render, budget, board, and asset data. Production print certification is not claimed. |
| CAD round-trip fixtures | READY | Preview CAD fixtures write scene JSON and DXF footprint files with 216 parsed LINE entities. Native DWG and production DXF remain BLOCKED. |
| Local compliance validators | READY | Structural, electrical, and fire validators produce rule-based preview findings; certified structural/electrical/fire/engineering compliance remains BLOCKED. |
| Template runtime | READY | 8/8 templates load scene objects, budgets, asset lists, and board packages for Hemant Samwat Wedding, Vedic Lotus Mandap, Royal Palace Wedding, Temple Mandap, Sci-Fi Galactic Portal, Garden Mandap, Navagraha Grid, and Panch Tatva Mandap. |
| Production planning runtime | READY | Vendor assignments, crew assignments, transport, accommodation, schedule items, call sheets, and work orders are connected to CAD scene object/layer ids for preview planning. |
| Live vendor/payment/marketplace gates | BLOCKED | 3 live integration gates require provider/API evidence before any live vendor, payment, or marketplace claim can move out of BLOCKED. |
| Template JSON | READY | 10 layout templates exist under `data/templates`. |
| Seed data | READY | `prisma/seed.ts` creates demo organization, user, project, venue, scene, mandap, lighting, floral, guests, vendors, budget, exports, observatory events, evidence, and release gate. |
| Native DWG export | BLOCKED | No native DWG writer, round-trip compatibility, AutoCAD validation, or DWG fixture evidence exists. |
| Production DXF export | BLOCKED | Preview DXF footprint export exists; production-grade CAD handoff remains unavailable. |
| Payments | BLOCKED | No checkout provider or payment evidence exists. |
| Marketplace commerce | BLOCKED | Preview catalog only; no seller/order/fulfillment runtime. |
| Live vendor network | BLOCKED | Demo vendors only; no live vendor API or booking flow. |
| Structural validation | BLOCKED | Local preview checks exist; stamped load, wind, truss, rigging, anchoring, and temporary-structure safety certification remains unavailable. |
| Electrical validation | BLOCKED | Local preview checks exist; licensed load schedules, phase balancing, cabling, earthing, generator sizing, and certified electrical safety remain unavailable. |
| Fire safety validation | BLOCKED | Local preview checks exist; certified fire exit, extinguisher, evacuation width, flame-retardant material, and authority approval validation remain unavailable. |
| Engineering compliance | BLOCKED | Local validators are not a municipal, engineering, accessibility, fire, electrical, or venue-authority compliance signoff. |
