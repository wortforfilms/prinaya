import { boardPages } from "./board-runtime";
import {
  budgetItems,
  cadObjects,
  lightingFixtures,
  projectSummary,
  renderJobs,
  venueDimensions
} from "./data-frames";
import { getAssetStats } from "./asset-preview-runtime";

export type PdfBoardPageRuntime = {
  pageNumber: number;
  title: string;
  source: string;
  lines: string[];
};

export const pdfBoardPackagePath = "release/board-packages/hemant-samwat-board-package.pdf";

export function getPdfBoardPages(): PdfBoardPageRuntime[] {
  const assetStats = getAssetStats();
  const totals = {
    budgetInr: budgetItems.reduce((sum, item) => sum + item.estimatedInr, 0),
    fixtures: lightingFixtures.reduce((sum, item) => sum + item.count, 0)
  };

  return boardPages.map((page, index) => ({
    pageNumber: index + 1,
    title: page.title,
    source: page.source,
    lines: [
      `Project: ${projectSummary.name}`,
      `Venue: ${projectSummary.venueName} (${venueDimensions.lengthM}m x ${venueDimensions.widthM}m, clear height ${venueDimensions.clearHeightM}m)`,
      `Scene objects: ${cadObjects.length}`,
      `Render jobs: ${renderJobs.map((job) => `${job.label} ${job.status}`).join(", ")}`,
      `Assets: ${assetStats.total} records, ${assetStats.glbMeshFiles} local GLB preview meshes`,
      `Budget estimate: INR ${totals.budgetInr.toLocaleString("en-IN")}`,
      `Lighting fixtures: ${totals.fixtures}`,
      `Bindings: ${page.bindings.join(", ")}`,
      "Production note: PDF package is local preview evidence; print/vendor/compliance certification is not claimed."
    ]
  }));
}

export const pdfBoardPackageSummary = {
  status: "READY" as const,
  productionReady: false,
  file: pdfBoardPackagePath,
  pageCount: boardPages.length,
  sourceData: ["scene objects", "render jobs", "budget items", "asset registry", "board page bindings"],
  note: "A local binary PDF package is generated from scene/render data. Production print QA remains unclaimed."
};
