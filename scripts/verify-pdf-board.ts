import { existsSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { boardPages } from "../src/lib/board-runtime";
import { pdfBoardPackagePath } from "../src/lib/pdf-board-runtime";

const pdfPath = new URL(`../${pdfBoardPackagePath}`, import.meta.url);
const evidencePath = new URL("../release/evidence/pdf-board-package.json", import.meta.url);

if (!existsSync(pdfPath)) {
  throw new Error(`${pdfBoardPackagePath} is missing`);
}

if (!existsSync(evidencePath)) {
  throw new Error("release/evidence/pdf-board-package.json is missing");
}

const pdf = readFileSync(pdfPath);
if (!pdf.subarray(0, 8).toString("utf8").startsWith("%PDF-1.")) {
  throw new Error("Generated board package is not a PDF file");
}

const evidence = JSON.parse(readFileSync(evidencePath, "utf8")) as {
  status?: string;
  output?: string;
  bytes?: number;
  sha256?: string;
  pageCount?: number;
  productionReady?: boolean;
};

if (
  evidence.status !== "READY" ||
  evidence.productionReady !== false ||
  evidence.output !== pdfBoardPackagePath ||
  evidence.pageCount !== boardPages.length ||
  evidence.bytes !== statSync(pdfPath).size ||
  evidence.sha256 !== createHash("sha256").update(pdf).digest("hex")
) {
  throw new Error("PDF board evidence does not match generated file");
}

console.log(`verify:pdf-board passed (${evidence.pageCount} pages, ${evidence.bytes} bytes, ${evidence.output})`);
