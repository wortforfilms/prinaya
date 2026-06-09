import { readFileSync } from "node:fs";

const latest = JSON.parse(readFileSync(new URL("../release/evidence/latest.json", import.meta.url), "utf8")) as {
  verdict: string;
  productionReady: boolean;
  blockers: { id: string; status: string }[];
};

const blockers = JSON.parse(readFileSync(new URL("../release/evidence/blockers.json", import.meta.url), "utf8")) as {
  blockedCapabilities: { id: string; label: string; status: string }[];
};

if (latest.verdict !== "CONTROLLED_PREVIEW_READY") {
  throw new Error(`Release verdict must be CONTROLLED_PREVIEW_READY, found ${latest.verdict}`);
}

if (latest.productionReady !== false) {
  throw new Error("PRODUCTION_READY must remain false without production evidence");
}

const blockedIds = new Set(blockers.blockedCapabilities.map((item) => item.id));
for (const id of [
  "native-dwg-export",
  "production-dxf-export",
  "payments",
  "marketplace-commerce",
  "live-vendors",
  "structural-validation",
  "electrical-validation",
  "fire-safety-validation",
  "engineering-compliance"
]) {
  if (!blockedIds.has(id)) {
    throw new Error(`Missing blocked capability ${id}`);
  }
}

if (blockers.blockedCapabilities.some((item) => item.status !== "BLOCKED")) {
  throw new Error("All production-only capability entries must be BLOCKED");
}

console.log("verify:release passed (CONTROLLED_PREVIEW_READY, PRODUCTION_READY=false, production blockers explicit)");
