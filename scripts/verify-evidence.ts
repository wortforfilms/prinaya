import { existsSync, readFileSync } from "node:fs";

const required = [
  "latest.json",
  "routes.json",
  "schema.json",
  "cad-runtime.json",
  "blockers.json",
  "assets-library.json",
  "hero-banners.json",
  "tlps-wedding-os-homepage.json",
  "tlps-unique-extractions.json",
  "cinematic-image-assets.json",
  "glb-assets.json",
  "pdf-board-package.json",
  "cad-roundtrip-fixtures.json",
  "compliance-runtime.json",
  "live-integrations.json",
  "status-matrix.md"
];

const missing = required.filter((file) => !existsSync(new URL(`../release/evidence/${file}`, import.meta.url)));
if (missing.length > 0) {
  throw new Error(`Missing evidence files: ${missing.join(", ")}`);
}

for (const file of required.filter((name) => name.endsWith(".json"))) {
  JSON.parse(readFileSync(new URL(`../release/evidence/${file}`, import.meta.url), "utf8"));
}

const matrix = readFileSync(new URL("../release/evidence/status-matrix.md", import.meta.url), "utf8");
for (const token of [
  "CONTROLLED_PREVIEW_READY",
  "PRODUCTION_READY=false",
  "Unified premium layout/theme",
  "Floral Designer route absorption",
  "Hero banner generation",
  "high-res local preview WebP assets",
  "TLPS Wedding OS homepage extraction",
  "TLPS unique source extraction",
  "Cinematic image asset regeneration",
  "CINEMATIC_LOCAL_DERIVATIVE",
  "related duplicate source",
  "Hemant Samwat Wedding",
  "Complete CAD asset registry",
  "Local GLB mesh files generated",
  "Binary PDF board package",
  "CAD round-trip fixtures",
  "Local compliance validators",
  "Live vendor/payment/marketplace gates",
  "Preview frame runtime",
  "typed demo data and local runtime coverage",
  "Scene graph maturity",
  "Wedding asset library",
  "Board composer runtime",
  "Template runtime",
  "Production planning runtime",
  "SPRINT-04 CAD editor maturity",
  "Save/load validation",
  "Native DWG export",
  "Production DXF export",
  "BLOCKED"
]) {
  if (!matrix.includes(token)) {
    throw new Error(`status-matrix.md missing ${token}`);
  }
}

console.log(`verify:evidence passed (${required.length} release evidence artifacts)`);
