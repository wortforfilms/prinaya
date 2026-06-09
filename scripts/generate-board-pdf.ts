import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getPdfBoardPages, pdfBoardPackagePath, pdfBoardPackageSummary } from "../src/lib/pdf-board-runtime";

const outputPath = fileURLToPath(new URL(`../${pdfBoardPackagePath}`, import.meta.url));
const evidencePath = fileURLToPath(new URL("../release/evidence/pdf-board-package.json", import.meta.url));
const pages = getPdfBoardPages();
const pdf = createPdf(pages.map((page) => ({ title: `${page.pageNumber}. ${page.title}`, lines: page.lines })));

mkdirSync(dirname(outputPath), { recursive: true });
mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(outputPath, pdf);

const evidence = {
  generatedAt: new Date().toISOString(),
  verdict: "CONTROLLED_PREVIEW_READY",
  productionReady: false,
  status: "READY",
  output: pdfBoardPackagePath,
  bytes: pdf.byteLength,
  sha256: createHash("sha256").update(pdf).digest("hex"),
  pageCount: pages.length,
  runtime: pdfBoardPackageSummary,
  pages: pages.map((page) => ({
    pageNumber: page.pageNumber,
    title: page.title,
    source: page.source,
    lineCount: page.lines.length
  })),
  note: "Generated binary PDF package from local scene, render, budget, board, and asset registry data. Production print certification is not claimed."
};
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);

console.log(`generate:board-pdf wrote ${pdfBoardPackagePath} (${pages.length} pages, ${pdf.byteLength} bytes)`);

function createPdf(inputPages: Array<{ title: string; lines: string[] }>) {
  const objects: string[] = [];
  const pageObjectIds: number[] = [];
  const fontObjectId = 3 + inputPages.length * 2;

  objects[0] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[1] = "";

  inputPages.forEach((page, index) => {
    const pageObjectId = 3 + index * 2;
    const contentObjectId = pageObjectId + 1;
    pageObjectIds.push(pageObjectId);
    objects[pageObjectId - 1] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
    const stream = createPageStream(page.title, page.lines);
    objects[contentObjectId - 1] = `<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`;
  });

  objects[1] = `<< /Type /Pages /Count ${pageObjectIds.length} /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] >>`;
  objects[fontObjectId - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  const parts: Buffer[] = [Buffer.from("%PDF-1.4\n% TLP Wedding CAD local preview PDF\n", "utf8")];
  const offsets: number[] = [0];

  objects.forEach((objectBody, index) => {
    offsets[index + 1] = Buffer.concat(parts).byteLength;
    parts.push(Buffer.from(`${index + 1} 0 obj\n${objectBody}\nendobj\n`, "utf8"));
  });

  const xrefOffset = Buffer.concat(parts).byteLength;
  const xrefRows = ["0000000000 65535 f "].concat(offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `));
  parts.push(
    Buffer.from(
      `xref\n0 ${objects.length + 1}\n${xrefRows.join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
      "utf8"
    )
  );

  return Buffer.concat(parts);
}

function createPageStream(title: string, lines: string[]) {
  const commands = ["BT", "/F1 20 Tf", "72 540 Td", `(${escapePdf(title)}) Tj`, "/F1 10 Tf"];
  lines.slice(0, 18).forEach((line) => {
    commands.push("0 -24 Td", `(${escapePdf(line.slice(0, 126))}) Tj`);
  });
  commands.push("ET");
  return commands.join("\n");
}

function escapePdf(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)").replace(/[^\x20-\x7E]/g, "?");
}
