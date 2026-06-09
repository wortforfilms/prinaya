import { existsSync, readFileSync } from "node:fs";
import { tlpsWeddingOsHomepage, tlpsWeddingOsHomepageSummary } from "../src/lib/tlps-wedding-os-homepage";

const registryPath = new URL("../data/tlps-wedding-os-homepage.json", import.meta.url);
const evidencePath = new URL("../release/evidence/tlps-wedding-os-homepage.json", import.meta.url);
const routePath = new URL("../src/app/wedding-os/page.tsx", import.meta.url);

if (!existsSync(registryPath) || !existsSync(evidencePath) || !existsSync(routePath)) {
  throw new Error("TLPS Wedding OS registry, evidence, or route is missing");
}

if (tlpsWeddingOsHomepage.productionReady !== false || tlpsWeddingOsHomepage.verdict !== "CONTROLLED_PREVIEW_READY") {
  throw new Error("TLPS Wedding OS extraction must remain CONTROLLED_PREVIEW_READY with PRODUCTION_READY=false");
}

if (
  tlpsWeddingOsHomepageSummary.sectionCount !== 10 ||
  tlpsWeddingOsHomepageSummary.destinationCount !== 7 ||
  tlpsWeddingOsHomepageSummary.designStudioCardCount !== 4 ||
  tlpsWeddingOsHomepageSummary.filmCardCount !== 8 ||
  tlpsWeddingOsHomepageSummary.ecosystemModuleCount !== 12 ||
  tlpsWeddingOsHomepageSummary.statCount !== 6
) {
  throw new Error(`Unexpected TLPS extraction counts: ${JSON.stringify(tlpsWeddingOsHomepageSummary)}`);
}

const assets = [
  tlpsWeddingOsHomepage.fullPageImage,
  ...tlpsWeddingOsHomepage.sections.map((asset) => asset.image),
  ...tlpsWeddingOsHomepage.destinationCards.map((asset) => asset.image),
  ...tlpsWeddingOsHomepage.designStudioCards.map((asset) => asset.image),
  ...tlpsWeddingOsHomepage.filmCards.map((asset) => asset.image)
];

const missing = assets.filter((asset) => !existsSync(new URL(`../public${asset}`, import.meta.url)));
if (missing.length > 0) {
  throw new Error(`TLPS extracted assets missing: ${missing.join(", ")}`);
}

const evidence = JSON.parse(readFileSync(evidencePath, "utf8")) as {
  status?: string;
  productionReady?: boolean;
  counts?: {
    sections?: number;
    destinationCards?: number;
    designStudioCards?: number;
    filmCards?: number;
  };
};

if (
  evidence.status !== "READY" ||
  evidence.productionReady !== false ||
  evidence.counts?.sections !== tlpsWeddingOsHomepageSummary.sectionCount ||
  evidence.counts?.destinationCards !== tlpsWeddingOsHomepageSummary.destinationCount ||
  evidence.counts?.designStudioCards !== tlpsWeddingOsHomepageSummary.designStudioCardCount ||
  evidence.counts?.filmCards !== tlpsWeddingOsHomepageSummary.filmCardCount
) {
  throw new Error("TLPS Wedding OS evidence does not match registry counts or honest status");
}

console.log(
  `verify:tlps-homepage passed (${tlpsWeddingOsHomepageSummary.sectionCount} sections, ${tlpsWeddingOsHomepageSummary.destinationCount} destinations, ${tlpsWeddingOsHomepageSummary.filmCardCount} film cards)`
);
