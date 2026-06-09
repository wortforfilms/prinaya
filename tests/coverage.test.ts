import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { boardPackage } from "../src/lib/board-runtime";
import { starterAssetDefinitions } from "../src/lib/cad-runtime";
import { summarizeCadEditorTools, validateSceneJson } from "../src/lib/cad-editor-tools";
import { dataFrames, starterObjectKinds } from "../src/lib/data-frames";
import { uiFrames } from "../src/lib/design-frames";
import { extractedBoards, extractedBoardSummary } from "../src/lib/extracted-boards";
import { floralWorkspace, floralWorkspaceSummary } from "../src/lib/floral-workspace";
import { sceneToPreviewDxf } from "../src/lib/export-runtime";
import { productionRuntime, productionRuntimeSummary } from "../src/lib/production-runtime";
import { previewFrameRuntimeSummary, previewRouteFrames, previewUiFrameRuntimes } from "../src/lib/preview-frame-runtime";
import { routeMatrix } from "../src/lib/route-matrix";
import { buildSceneHierarchy, sceneBranches, sceneGraphSummary } from "../src/lib/scene-graph";
import { assetCategoryValues, modelNames, WeddingCADAssetSchema, zodSchemaByModel } from "../src/lib/schemas";
import { blockedCapabilities, releaseStatus } from "../src/lib/status";
import { templateRuntimeCatalog, templateRuntimeSummary } from "../src/lib/template-runtime";
import { weddingAssetSummary } from "../src/lib/wedding-asset-library";
import { isCadInsertableAsset, templateAssetReferences } from "../src/lib/asset-registry";
import { getAllAssets, getAssetStats, getBlockedAssets, getCadInsertableAssets, searchAssets } from "../src/lib/asset-preview-runtime";
import { getPdfBoardPages, pdfBoardPackagePath, pdfBoardPackageSummary } from "../src/lib/pdf-board-runtime";
import { createCadRoundTripSummary } from "../src/lib/cad-roundtrip-runtime";
import {
  complianceRuntimeSummary,
  electricalComplianceReport,
  fireSafetyComplianceReport,
  structuralComplianceReport
} from "../src/lib/compliance-runtime";
import { liveIntegrationGates, liveIntegrationSummary } from "../src/lib/live-integration-runtime";
import { getHeroBannerForRoute, heroBanners, heroBannerSummary } from "../src/lib/hero-banner-registry";
import { tlpsWeddingOsHomepage, tlpsWeddingOsHomepageSummary } from "../src/lib/tlps-wedding-os-homepage";
import {
  getTlpsUniqueFramesByKind,
  searchTlpsUniqueFrames,
  tlpsUniqueExtractionFrames,
  tlpsUniqueExtractionSources,
  tlpsUniqueExtractionSummary,
  tlpsUniqueExtractions
} from "../src/lib/tlps-unique-extractions";

describe("TLP Wedding CAD preview coverage", () => {
  it("keeps route statuses explicit", () => {
    expect(routeMatrix).toHaveLength(32);
    expect(routeMatrix.every((route) => ["READY", "PARTIAL", "BLOCKED"].includes(route.status))).toBe(true);
    expect(routeMatrix.every((route) => route.status === "READY")).toBe(true);
  });

  it("creates preview-ready route frames with demo data and local runtime coverage", () => {
    expect(previewRouteFrames).toHaveLength(routeMatrix.length);
    expect(previewFrameRuntimeSummary.routeFramesReady).toBe(routeMatrix.length);
    expect(previewFrameRuntimeSummary.routeFramesWithDemoData).toBe(routeMatrix.length);
    expect(previewFrameRuntimeSummary.routeFramesWithLocalCoverage).toBe(routeMatrix.length);
    expect(previewFrameRuntimeSummary.totalDemoDataPoints).toBeGreaterThanOrEqual(routeMatrix.length * 5);
    expect(previewFrameRuntimeSummary.totalLocalCoveragePoints).toBeGreaterThanOrEqual(routeMatrix.length * 4);
    expect(previewRouteFrames.every((frame) => frame.status === "READY")).toBe(true);
    expect(previewRouteFrames.every((frame) => frame.demoData.length > 0)).toBe(true);
    expect(previewRouteFrames.every((frame) => frame.localRuntimeCoverage.length > 0)).toBe(true);
    expect(previewRouteFrames.every((frame) => frame.evidenceRefs.length > 0)).toBe(true);
    expect(previewUiFrameRuntimes).toHaveLength(uiFrames.length);
    expect(previewUiFrameRuntimes.every((frame) => frame.status === "READY" && frame.demoBindings.length > 0 && frame.localRuntimeCoverage.length > 0)).toBe(true);
  });

  it("applies the unified premium layout and theme across shared routes", () => {
    const homeRoute = readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8");
    const landing = readFileSync(new URL("../src/components/landing/StudioLandingExperience.tsx", import.meta.url), "utf8");
    const shell = readFileSync(new URL("../src/components/layout/StudioShell.tsx", import.meta.url), "utf8");
    const leftNav = readFileSync(new URL("../src/components/layout/LeftNav.tsx", import.meta.url), "utf8");
    const topBar = readFileSync(new URL("../src/components/layout/TopCommandBar.tsx", import.meta.url), "utf8");
    const globals = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
    expect(homeRoute).toContain("StudioLandingExperience");
    expect(landing).toContain("SplashOverlay");
    expect(landing).toContain("TransitionOverlay");
    expect(landing).toContain("LandingPage");
    expect(landing).toContain("TlpsWeddingOsHomepage");
    expect(heroBannerSummary.count).toBe(21);
    expect(heroBannerSummary.generationMode).toBe("GENERATED_HIRES_FROM_REFERENCE");
    expect(heroBannerSummary.hiresSize).toEqual({ width: 1920, height: 580 });
    expect(heroBanners.every((banner) => existsSync(new URL(`../public${banner.hiresImage}`, import.meta.url)))).toBe(true);
    expect(heroBanners.every((banner) => existsSync(new URL(`../public${banner.rawImage}`, import.meta.url)))).toBe(true);
    expect(getHeroBannerForRoute("/mandap").slug).toBe("mandap-designer");
    expect(getHeroBannerForRoute("/cad/editor").slug).toBe("cad-editor");
    expect(getHeroBannerForRoute("/exports/boards").slug).toBe("board-composer");
    expect(shell).toContain("premium-theme");
    expect(shell).toContain("lg:pl-80");
    expect(leftNav).toContain("lg:fixed");
    expect(leftNav).toContain("TLP WEDDING CAD");
    expect(topBar).toContain("bg-[#04110f]/88");
    expect(globals).toContain(".premium-theme");
    expect(globals).toContain("radial-gradient");
    expect(globals).toContain(".premium-theme .bg-white");
  });

  it("absorbs the floral reference into a dedicated preview route workspace", () => {
    const floralRoute = readFileSync(new URL("../src/app/floral/page.tsx", import.meta.url), "utf8");
    expect(floralRoute).toContain("FloralDesignerWorkspace");
    expect(floralWorkspace.route).toBe("/floral");
    expect(floralWorkspace.projectName).toBe("Hemant Samwat Wedding");
    expect(floralWorkspace.status).toBe("READY");
    expect(floralWorkspace.productionReady).toBe(false);
    expect(floralWorkspace.tabs).toHaveLength(9);
    expect(floralWorkspace.kpis).toHaveLength(6);
    expect(floralWorkspace.panels).toHaveLength(14);
    expect(floralWorkspace.spacePoints).toHaveLength(91);
    expect(floralWorkspace.arrangements).toHaveLength(6);
    expect(floralWorkspace.flowers).toHaveLength(12);
    expect(floralWorkspace.palettes).toHaveLength(5);
    expect(floralWorkspace.attachments).toHaveLength(3);
    expect(floralWorkspace.calculator.totalEstimatedInr).toBe(1225000);
    expect(floralWorkspace.panels.every((panel) => panel.status === "READY")).toBe(true);
    expect(
      floralWorkspace.visualAssets.every(
        (asset) => asset.source.startsWith("/extracted-boards/") || asset.source.startsWith("/hero-banners/hires/")
      )
    ).toBe(true);
    expect(floralWorkspaceSummary.numberedPanels).toBe(14);
    expect(floralWorkspaceSummary.localRuntimeCoverage).toBeGreaterThanOrEqual(6);
  });

  it("extracts the TLPS Wedding OS homepage into typed local preview frames", () => {
    const route = readFileSync(new URL("../src/app/wedding-os/page.tsx", import.meta.url), "utf8");
    const pageComponent = readFileSync(new URL("../src/components/tlps/TlpsWeddingOsHomepage.tsx", import.meta.url), "utf8");
    expect(route).toContain("TlpsWeddingOsHomepage");
    expect(pageComponent).toContain("Sovereign Wedding Intelligence");
    expect(pageComponent).toContain("$99,999/mo");
    expect(pageComponent).toContain("Operational intelligence for ceremony placement and timing, not astrology.");
    expect(pageComponent).toContain("Hemant Samwat Vedi Position Finder is a placement and timing intelligence feature.");
    expect(tlpsWeddingOsHomepage.productionReady).toBe(false);
    expect(tlpsWeddingOsHomepage.verdict).toBe("CONTROLLED_PREVIEW_READY");
    expect(tlpsWeddingOsHomepageSummary.sectionCount).toBe(10);
    expect(tlpsWeddingOsHomepageSummary.destinationCount).toBe(7);
    expect(tlpsWeddingOsHomepageSummary.designStudioCardCount).toBe(4);
    expect(tlpsWeddingOsHomepageSummary.filmCardCount).toBe(8);
    expect(tlpsWeddingOsHomepageSummary.ecosystemModuleCount).toBe(12);
    expect(tlpsWeddingOsHomepageSummary.statCount).toBe(6);
    const assets = [
      tlpsWeddingOsHomepage.fullPageImage,
      ...tlpsWeddingOsHomepage.sections.map((asset) => asset.image),
      ...tlpsWeddingOsHomepage.destinationCards.map((asset) => asset.image),
      ...tlpsWeddingOsHomepage.designStudioCards.map((asset) => asset.image),
      ...tlpsWeddingOsHomepage.filmCards.map((asset) => asset.image)
    ];
    expect(assets.every((asset) => existsSync(new URL(`../public${asset}`, import.meta.url)))).toBe(true);
  });

  it("dedupes supplied TLPS reference PNGs and exposes unique extracted frames", () => {
    expect(tlpsUniqueExtractions.productionReady).toBe(false);
    expect(tlpsUniqueExtractions.verdict).toBe("CONTROLLED_PREVIEW_READY");
    expect(tlpsUniqueExtractionSummary.sourceCount).toBe(31);
    expect(tlpsUniqueExtractionSummary.uniqueSourceCount).toBe(30);
    expect(tlpsUniqueExtractionSummary.duplicateSourceCount).toBe(1);
    expect(tlpsUniqueExtractionSummary.uniqueFrameCount).toBeGreaterThanOrEqual(590);
    expect(tlpsUniqueExtractionSummary.duplicateFrameCount).toBe(0);
    expect(tlpsUniqueExtractionSources).toHaveLength(31);
    expect(tlpsUniqueExtractionFrames).toHaveLength(tlpsUniqueExtractionSummary.uniqueFrameCount);
    expect(new Set(tlpsUniqueExtractionFrames.map((frame) => frame.sha256)).size).toBe(tlpsUniqueExtractionFrames.length);
    expect(tlpsUniqueExtractions.duplicateSourceGroups[0].canonical).toBe("TLP_Wedding_CAD_All_Hero_Banners.png");
    expect(tlpsUniqueExtractions.duplicateSourceGroups[0].duplicates).toContain("TLP_Wedding_CAD_All_Hero_Banners_With_Cutting_Guides.png");
    expect(getTlpsUniqueFramesByKind("hero-banner")).toHaveLength(21);
    expect(getTlpsUniqueFramesByKind("filmy-hero-banner")).toHaveLength(12);
    expect(getTlpsUniqueFramesByKind("homepage-section")).toHaveLength(10);
    expect(getTlpsUniqueFramesByKind("design-option").length).toBeGreaterThanOrEqual(39);
    expect(searchTlpsUniqueFrames("Vedi Recommendation Map").some((frame) => frame.kind === "vedi-map")).toBe(true);
    expect(tlpsUniqueExtractionFrames.every((frame) => existsSync(new URL(`../public${frame.image}`, import.meta.url)))).toBe(true);
    expect(
      tlpsUniqueExtractionSources
        .filter((source) => source.status === "READY")
        .every((source) => Boolean(source.sourceImage) && existsSync(new URL(`../public${source.sourceImage}`, import.meta.url)))
    ).toBe(true);
  });

  it("keeps extracted UI and data frames available", () => {
    expect(uiFrames.length).toBeGreaterThanOrEqual(25);
    expect(uiFrames.every((frame) => frame.status === "READY")).toBe(true);
    expect(dataFrames.cadObjects).toHaveLength(18);
    expect(dataFrames.exportJobs.some((job) => job.format === "dwg" && job.status === "BLOCKED")).toBe(true);
    expect(dataFrames.exportJobs.some((job) => job.format === "dxf" && job.status === "READY")).toBe(true);
    expect(dataFrames.renderJobs.every((job) => job.status === "READY")).toBe(true);
  });

  it("keeps generated design board extraction mapped to typed frames", () => {
    expect(extractedBoards).toHaveLength(9);
    expect(extractedBoardSummary.optionCount).toBeGreaterThanOrEqual(63);
    expect(extractedBoardSummary.panelCount).toBeGreaterThanOrEqual(30);
    expect(extractedBoards.every((board) => ["READY", "PARTIAL", "BLOCKED"].includes(board.status))).toBe(true);
    expect(extractedBoards.every((board) => board.status === "READY")).toBe(true);
    expect(extractedBoardSummary.partialOptions).toBe(0);
    expect(extractedBoardSummary.blockedOptions).toBe(0);
    expect(extractedBoards.every((board) => board.image.startsWith("/extracted-boards/"))).toBe(true);
  });

  it("generates local preview export artifacts without unblocking production DWG", () => {
    const dxf = sceneToPreviewDxf(dataFrames.cadObjects, dataFrames.layers);
    expect(dxf).toContain("SECTION");
    expect(dxf).toContain("ENTITIES");
    expect(dxf).toContain("LINE");
    expect(blockedCapabilities.some((capability) => capability.id === "native-dwg-export" && capability.status === "BLOCKED")).toBe(true);
    expect(blockedCapabilities.some((capability) => capability.id === "production-dxf-export" && capability.status === "BLOCKED")).toBe(true);
  });

  it("covers required schema models with Zod schemas", () => {
    expect(modelNames).toHaveLength(31);
    for (const model of modelNames) {
      expect(zodSchemaByModel[model]).toBeTruthy();
    }
  });

  it("covers CAD starter object primitives", () => {
    expect(starterObjectKinds).toHaveLength(18);
    expect(starterAssetDefinitions.map((asset) => asset.kind).sort()).toEqual([...starterObjectKinds].sort());
  });

  it("covers SPRINT-04 CAD editor maturity tools", () => {
    const tools = summarizeCadEditorTools();
    expect(tools.status).toBe("READY");
    expect(tools.readyTools).toBe(10);
    expect(tools.labels).toEqual([
      "Scene hierarchy panel",
      "Layer tree with lock/hide",
      "Object inspector",
      "Material inspector",
      "Asset browser",
      "Measurement tool",
      "Annotation tool",
      "Template loader",
      "Scene statistics",
      "Save/load validation"
    ]);
    const validScene = validateSceneJson(JSON.stringify({ objects: dataFrames.cadObjects, layers: dataFrames.layers }));
    expect(validScene.status).toBe("READY");
    expect(validScene.objectCount).toBe(dataFrames.cadObjects.length);
    const invalidScene = validateSceneJson("{ invalid");
    expect(invalidScene.status).toBe("BLOCKED");
    expect(invalidScene.errors.length).toBeGreaterThan(0);
  });

  it("covers mature scene graph controls and wedding asset expansion", () => {
    const graph = buildSceneHierarchy({
      objects: dataFrames.cadObjects,
      layers: dataFrames.layers,
      groups: [
        {
          id: "test-mandap-group",
          label: "Mandap Group",
          objectIds: dataFrames.cadObjects.filter((object) => object.layerId === "mandap").map((object) => object.id),
          hidden: false,
          locked: true
        }
      ],
      hiddenObjectIds: [dataFrames.cadObjects[0].id],
      lockedObjectIds: [dataFrames.cadObjects[1].id]
    });
    const summary = sceneGraphSummary(graph);
    expect(sceneBranches).toEqual(["venue", "mandap", "stage", "seating", "lighting", "decor"]);
    expect(summary.branchCount).toBe(6);
    expect(summary.objectCount).toBe(dataFrames.cadObjects.length);
    expect(summary.hiddenCount).toBeGreaterThan(0);
    expect(summary.lockedCount).toBeGreaterThan(0);
    expect(weddingAssetSummary.total).toBeGreaterThanOrEqual(600);
    expect(weddingAssetSummary.byCategory.every((item) => item.count >= weddingAssetSummary.requiredPerCategory)).toBe(true);
  });

  it("generates and validates the complete wedding CAD asset registry", () => {
    const assets = getAllAssets();
    const stats = getAssetStats();
    expect(assets.length).toBeGreaterThanOrEqual(600);
    expect(stats.total).toBe(assets.length);
    expect(stats.categoryCount).toBe(assetCategoryValues.length);
    expect(stats.categories.every((item) => item.count >= 24)).toBe(true);
    expect(stats.statusCounts).toEqual({ READY: 432, PARTIAL: 160, BLOCKED: 56 });
    expect(stats.glbMeshFiles).toBe(stats.cadInsertable);
    expect(stats.missingRealMeshes).toBe(0);
    expect(assets.every((asset) => WeddingCADAssetSchema.safeParse(asset).success)).toBe(true);
    expect(new Set(assets.map((asset) => asset.id)).size).toBe(assets.length);
    expect(new Set(assets.map((asset) => asset.slug)).size).toBe(assets.length);
  });

  it("keeps asset search, CAD insertion, blockers, and template references honest", () => {
    const assets = getAllAssets();
    const assetIds = new Set(assets.map((asset) => asset.id));
    const searchResults = searchAssets("lotus");
    const insertableAssets = getCadInsertableAssets();
    const blockedAssets = getBlockedAssets();

    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.some((asset) => asset.name.toLowerCase().includes("lotus") || asset.tags.includes("vedic-lotus"))).toBe(true);
    expect(insertableAssets.length).toBeGreaterThan(0);
    expect(insertableAssets.every((asset) => asset.status !== "BLOCKED" && isCadInsertableAsset(asset) && Boolean(asset.fileRefs.mesh))).toBe(true);
    expect(insertableAssets.slice(0, 12).every((asset) => existsSync(new URL(`../public${asset.fileRefs.mesh!}`, import.meta.url)))).toBe(true);
    expect(blockedAssets.length).toBeGreaterThan(0);
    expect(blockedAssets.every((asset) => asset.source === "BLOCKED_EXTERNAL" && !isCadInsertableAsset(asset) && !asset.fileRefs.mesh)).toBe(true);
    expect(assets.filter((asset) => asset.status === "READY").every((asset) => asset.source === "LOCAL_PREVIEW" && Boolean(asset.fileRefs.previewImage))).toBe(true);

    const registryAssetRefs = Object.values(templateAssetReferences).flat();
    expect(registryAssetRefs.every((assetId) => assetIds.has(assetId))).toBe(true);
    expect(templateRuntimeCatalog.every((template) => template.assetIds.every((assetId) => assetIds.has(assetId)))).toBe(true);
    expect(templateRuntimeCatalog.every((template) => template.assetList.length === template.assetIds.length)).toBe(true);
  });

  it("covers board, template, and production planning runtimes", () => {
    expect(boardPackage.pipeline).toEqual(["Scene", "Render", "Board Composer", "PDF Package"]);
    expect(boardPackage.exportFormats).toContain("binary-pdf");
    expect(boardPackage.pages.map((page) => page.id)).toEqual([
      "cover",
      "concept",
      "site-plan",
      "mandap-plan",
      "lighting-plan",
      "floral-plan",
      "budget",
      "bom",
      "render-gallery"
    ]);
    expect(templateRuntimeSummary.templates).toBe(8);
    expect(templateRuntimeSummary.readyTemplates).toBe(8);
    expect(templateRuntimeCatalog.map((template) => template.id)).toEqual([
      "hemant-samwat-wedding",
      "vedic-lotus-mandap",
      "royal-palace-wedding",
      "temple-mandap",
      "sci-fi-galactic-portal",
      "garden-mandap",
      "navagraha-grid",
      "panch-tatva-mandap"
    ]);
    expect(productionRuntimeSummary.vendorAssignments).toBeGreaterThan(0);
    expect(productionRuntimeSummary.crewAssignments).toBeGreaterThan(0);
    expect(productionRuntimeSummary.transportPlans).toBeGreaterThan(0);
    expect(productionRuntimeSummary.accommodationPlans).toBeGreaterThan(0);
    expect(productionRuntimeSummary.scheduleItems).toBeGreaterThan(0);
    expect(productionRuntimeSummary.workOrders).toBeGreaterThan(0);
    expect(productionRuntimeSummary.callSheets).toBeGreaterThan(0);
    const sceneObjectIds = new Set(dataFrames.cadObjects.map((object) => object.id));
    expect(productionRuntime.workOrders.every((order) => sceneObjectIds.has(order.sceneObjectId))).toBe(true);
  });

  it("covers real local PDF package, CAD fixtures, compliance validators, and live integration gates", () => {
    const pdfPages = getPdfBoardPages();
    const roundTrip = createCadRoundTripSummary(dataFrames.cadObjects, dataFrames.layers);
    expect(pdfBoardPackageSummary.status).toBe("READY");
    expect(pdfBoardPackageSummary.productionReady).toBe(false);
    expect(pdfBoardPackageSummary.file).toBe(pdfBoardPackagePath);
    expect(pdfPages).toHaveLength(boardPackage.pages.length);
    expect(existsSync(new URL(`../${pdfBoardPackagePath}`, import.meta.url))).toBe(true);
    expect(roundTrip.previewDxf).toBe("READY");
    expect(roundTrip.nativeDwg).toBe("BLOCKED");
    expect(roundTrip.productionDxf).toBe("BLOCKED");
    expect(roundTrip.lineEntityCount).toBe(dataFrames.cadObjects.length * 12);
    expect(complianceRuntimeSummary.status).toBe("READY");
    expect(complianceRuntimeSummary.certified).toBe(false);
    expect(complianceRuntimeSummary.reviewRequired).toBe(3);
    expect([structuralComplianceReport, electricalComplianceReport, fireSafetyComplianceReport].every((report) => report.verdict === "REVIEW_REQUIRED")).toBe(true);
    expect([structuralComplianceReport, electricalComplianceReport, fireSafetyComplianceReport].every((report) => report.findings.some((finding) => finding.severity === "FAIL"))).toBe(true);
    expect(liveIntegrationSummary.status).toBe("BLOCKED");
    expect(liveIntegrationGates).toHaveLength(3);
    expect(liveIntegrationGates.every((gate) => gate.status === "BLOCKED")).toBe(true);
  });

  it("keeps production-only features blocked", () => {
    expect(releaseStatus.verdict).toBe("CONTROLLED_PREVIEW_READY");
    expect(releaseStatus.productionReady).toBe(false);
    expect(blockedCapabilities.every((capability) => capability.status === "BLOCKED")).toBe(true);
    expect(blockedCapabilities.map((capability) => capability.id).sort()).toEqual([
      "electrical-validation",
      "engineering-compliance",
      "fire-safety-validation",
      "live-vendors",
      "marketplace-commerce",
      "native-dwg-export",
      "payments",
      "production-dxf-export",
      "structural-validation"
    ]);
  });
});
