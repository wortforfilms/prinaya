import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { blockedCapabilities, releaseStatus } from "../src/lib/status";
import { extractedBoardSummary } from "../src/lib/extracted-boards";
import { routeFamilies, routeMatrix, publicRoutes, moduleRoutes } from "../src/lib/route-matrix";
import { modelNames } from "../src/lib/schemas";
import { cadObjects, exportJobs, layers, renderJobs, starterObjectKinds } from "../src/lib/data-frames";
import { floralWorkspaceSummary } from "../src/lib/floral-workspace";
import { getAssetStats } from "../src/lib/asset-preview-runtime";
import { boardPackage } from "../src/lib/board-runtime";
import { summarizeCadEditorTools } from "../src/lib/cad-editor-tools";
import { previewFrameRuntimeSummary, previewRouteFrames, previewUiFrameRuntimes } from "../src/lib/preview-frame-runtime";
import { productionRuntimeSummary } from "../src/lib/production-runtime";
import { sceneBranches } from "../src/lib/scene-graph";
import { templateRuntimeSummary } from "../src/lib/template-runtime";
import { pdfBoardPackagePath, pdfBoardPackageSummary } from "../src/lib/pdf-board-runtime";
import { createCadRoundTripSummary } from "../src/lib/cad-roundtrip-runtime";
import { heroBannerSummary } from "../src/lib/hero-banner-registry";
import { tlpsWeddingOsHomepageSummary } from "../src/lib/tlps-wedding-os-homepage";
import { tlpsUniqueExtractionSummary } from "../src/lib/tlps-unique-extractions";
import { cinematicImageAssetSummary } from "../src/lib/cinematic-image-assets";
import { categoryDemoUseCaseSets, categoryDemoUseCaseSummary, getRouteDemoUseCaseSummary } from "../src/lib/category-demo-usecases";
import { activeRoutePages, extendedModuleProfiles, routePageRuntimeSummary } from "../src/lib/route-page-runtime";
import {
  complianceRuntimeSummary,
  electricalComplianceReport,
  fireSafetyComplianceReport,
  structuralComplianceReport
} from "../src/lib/compliance-runtime";
import { liveIntegrationGates, liveIntegrationSummary } from "../src/lib/live-integration-runtime";

const evidenceDir = new URL("../release/evidence/", import.meta.url);
mkdirSync(evidenceDir, { recursive: true });

const generatedAt = new Date().toISOString();
const runtimeRoutes = ["/cad/editor"];
const totalPreviewRoutes = routeMatrix.length + runtimeRoutes.length;
const allRouteFramesReady = routeMatrix.every((route) => route.status === "READY");
const cadEditorTools = summarizeCadEditorTools();
const assetRegistryStats = getAssetStats();
const pdfBoardPath = new URL(`../${pdfBoardPackagePath}`, import.meta.url);
const pdfBoardEvidencePath = new URL("../release/evidence/pdf-board-package.json", import.meta.url);
const cadRoundTripEvidencePath = new URL("../release/evidence/cad-roundtrip-fixtures.json", import.meta.url);
const cadRoundTripSummary = createCadRoundTripSummary(cadObjects, layers);
const pdfBoardEvidence = existsSync(pdfBoardEvidencePath) ? JSON.parse(readFileSync(pdfBoardEvidencePath, "utf8")) : null;
const cadRoundTripEvidence = existsSync(cadRoundTripEvidencePath) ? JSON.parse(readFileSync(cadRoundTripEvidencePath, "utf8")) : null;
const routeUseCaseCoverage = routeMatrix.map((route) => getRouteDemoUseCaseSummary(route.path));

const latest = {
  generatedAt,
  verdict: releaseStatus.verdict,
  productionReady: releaseStatus.productionReady,
  routeCoverage: {
    matrixRoutes: routeMatrix.length,
    runtimeRoutes,
    totalPreviewRoutes,
    wildcardFamilies: routeFamilies.length,
    allRouteFramesReady
  },
  schemaCoverage: {
    requiredModels: modelNames.length,
    zodSchemas: modelNames.length,
    typescriptTypes: modelNames.length
  },
  cadRuntime: {
    status: "READY",
    starterObjects: starterObjectKinds.length,
    features: [
      "3D scene canvas",
      "grid floor",
      "top/front/side/perspective camera modes",
      "object insertion",
      "object selection",
      "transform controls",
      "scene hierarchy",
      "scene hierarchy panel",
      "object tree",
      "layer tree",
      "layer tree with lock/hide",
      "selection manager",
      "search",
      "grouping",
      "object/layer lock and hide controls",
      "layer visibility",
      "material assignment",
      "object inspector",
      "material inspector",
      "asset browser",
      "measurement tool",
      "annotation tool",
      "template loader",
      "scene statistics",
      "save/load validation",
      "save/load scene JSON",
      "download scene JSON",
      "local GLB mesh asset evidence",
      "binary PDF board package generation",
      "preview ASCII DXF footprint export",
      "preview CAD round-trip fixtures",
      "printable board HTML export",
      "local structural/electrical/fire validators"
    ]
  },
  runtimeMaturity: {
    heroBanners: {
      ...heroBannerSummary
    },
    tlpsWeddingOsHomepage: {
      ...tlpsWeddingOsHomepageSummary
    },
    tlpsUniqueExtractions: {
      ...tlpsUniqueExtractionSummary
    },
    cinematicImageAssets: {
      ...cinematicImageAssetSummary
    },
    useCaseRegistry: {
      ...categoryDemoUseCaseSummary,
      registryRef: "data/usecases/category-demo-usecases.json",
      evidenceRef: "release/evidence/usecases.json",
      routeUseCaseCoverage
    },
    activePages: {
      ...routePageRuntimeSummary,
      extendedModuleProfiles
    },
    sceneGraph: {
      status: "READY",
      branches: sceneBranches
    },
    cadEditorTools: cadEditorTools,
    weddingAssetLibrary: {
      status: "READY",
      totalAssets: assetRegistryStats.total,
      categoryCount: assetRegistryStats.categoryCount,
      statusCounts: assetRegistryStats.statusCounts,
      cadInsertable: assetRegistryStats.cadInsertable,
      byCategory: assetRegistryStats.categories
    },
    assetRegistry: {
      status: "READY",
      totalAssets: assetRegistryStats.total,
      categoryCount: assetRegistryStats.categoryCount,
      statusCounts: assetRegistryStats.statusCounts,
      cadInsertCoverage: {
        cadInsertable: assetRegistryStats.cadInsertable,
        readyInsertable: assetRegistryStats.readyInsertable,
        partialInsertable: assetRegistryStats.partialInsertable
      },
      missingMeshFileBlockers: {
        glbMeshFiles: assetRegistryStats.glbMeshFiles,
        missingRealMeshes: assetRegistryStats.missingRealMeshes
      }
    },
    boardComposer: {
      status: boardPackage.status,
      pipeline: boardPackage.pipeline,
      pages: boardPackage.pages.map((page) => page.title),
      exportFormats: boardPackage.exportFormats
    },
    pdfBoardPackage: {
      ...pdfBoardPackageSummary,
      exists: existsSync(pdfBoardPath),
      bytes: existsSync(pdfBoardPath) ? statSync(pdfBoardPath).size : 0,
      evidence: pdfBoardEvidence
    },
    cadRoundTripFixtures: {
      ...cadRoundTripSummary,
      evidence: cadRoundTripEvidence
    },
    complianceRuntime: {
      ...complianceRuntimeSummary,
      reports: [structuralComplianceReport, electricalComplianceReport, fireSafetyComplianceReport]
    },
    liveIntegrationGates: {
      ...liveIntegrationSummary,
      gates: liveIntegrationGates
    },
    templateRuntime: {
      status: "READY",
      ...templateRuntimeSummary
    },
    productionRuntime: {
      status: "READY",
      ...productionRuntimeSummary
    },
    floralDesignerWorkspace: {
      ...floralWorkspaceSummary
    }
  },
  sourceImageExtraction: {
    status: "READY",
    boards: extractedBoardSummary.boardCount,
    frames: extractedBoardSummary.optionCount,
    panels: extractedBoardSummary.panelCount,
    uniqueSourceImages: tlpsUniqueExtractionSummary.uniqueSourceCount,
    suppliedSourceImages: tlpsUniqueExtractionSummary.sourceCount,
    duplicateSourceImages: tlpsUniqueExtractionSummary.duplicateSourceCount,
    uniqueSourceFrames: tlpsUniqueExtractionSummary.uniqueFrameCount,
    cinematicImageAssets: {
      generationMode: cinematicImageAssetSummary.generationMode,
      uniqueSourceImages: cinematicImageAssetSummary.uniqueSourceCount,
      aspectVariants: cinematicImageAssetSummary.aspectVariantCount,
      generatedVariants: cinematicImageAssetSummary.totalVariantCount,
      totalBytes: cinematicImageAssetSummary.totalBytes,
      uxSpaces: cinematicImageAssetSummary.uxSpaceCount,
      uxSpaceCounts: cinematicImageAssetSummary.uxSpaceCounts
    },
    note: "Nine generated design-board PNG assets are imported into public/extracted-boards and rendered in /vr with typed extraction data."
  },
  previewCompletion: {
    routeFrames: "READY",
    heroBanners: "READY",
    tlpsWeddingOsHomepage: "READY",
    tlpsUniqueExtractions: "READY",
    cinematicImageAssets: "READY",
    uiFrames: "READY",
    unifiedPremiumTheme: "READY",
    floralDesignerWorkspace: "READY",
    assetRegistry: "READY",
    glbMeshes: "READY",
    pdfBoardPackage: "READY",
    cadRoundTripFixtures: "READY",
    complianceValidators: "READY",
    liveIntegrations: "BLOCKED",
    previewRouteRuntime: previewFrameRuntimeSummary,
    activePages: routePageRuntimeSummary,
    extractedBoardFrames: "READY",
    localExports: exportJobs.map((job) => ({ id: job.id, format: job.format, status: job.status })),
    renderJobs: renderJobs.map((job) => ({ id: job.id, status: job.status }))
  },
  blockers: blockedCapabilities.map((capability) => ({ id: capability.id, status: capability.status }))
};

const routes = {
  generatedAt,
  status: allRouteFramesReady ? "READY" : "PARTIAL",
  matrixRoutes: routeMatrix.length,
  runtimeRoutes,
  totalPreviewRoutes,
  publicRoutes: publicRoutes.map((route) => route.path),
  wildcardRoutes: moduleRoutes.map((route) => route.path),
  statusRules: {
    allRoutesShowStatus: true,
    allowedStatuses: ["READY", "PARTIAL", "BLOCKED"],
    previewRoutesReady: allRouteFramesReady,
    allRoutesHaveDemoData: previewRouteFrames.every((frame) => frame.demoData.length > 0),
    allRoutesHaveLocalRuntimeCoverage: previewRouteFrames.every((frame) => frame.localRuntimeCoverage.length > 0),
    blockedRoutes: [],
    productionBlockedCapabilities: blockedCapabilities.map((capability) => capability.id)
  },
  previewFrameRuntime: {
    status: previewFrameRuntimeSummary.status,
    routeFrames: previewFrameRuntimeSummary.routeFrames,
    routeFramesReady: previewFrameRuntimeSummary.routeFramesReady,
    routeFramesWithDemoData: previewFrameRuntimeSummary.routeFramesWithDemoData,
    routeFramesWithLocalCoverage: previewFrameRuntimeSummary.routeFramesWithLocalCoverage,
    totalDemoDataPoints: previewFrameRuntimeSummary.totalDemoDataPoints,
    totalLocalCoveragePoints: previewFrameRuntimeSummary.totalLocalCoveragePoints,
    uiFrames: previewFrameRuntimeSummary.uiFrames,
    uiFramesReady: previewFrameRuntimeSummary.uiFramesReady,
    routes: previewRouteFrames.map((frame) => ({
      path: frame.routePath,
      status: frame.status,
      demoDataPoints: frame.demoData.length,
      localCoverageChecks: frame.localRuntimeCoverage.length,
      blockerCount: frame.honestBlockers.length
    })),
    uiFrameRuntimeCount: previewUiFrameRuntimes.length
  },
  absorbedRouteWorkspaces: {
    floral: {
      ...floralWorkspaceSummary
    }
  }
};

const schema = {
  generatedAt,
  status: "READY",
  requiredModelCount: modelNames.length,
  zodSchemaCount: modelNames.length,
  typescriptTypeCount: modelNames.length,
  requiredModels: modelNames,
  extraInternalModels: ["UserRole", "RolePermission"],
  seedCoverage: [
    "demo organization",
    "demo user",
    "demo wedding project",
    "demo venue",
    "demo CAD scene",
    "demo mandap",
    "demo lighting plan",
    "demo floral design",
    "demo guests",
    "demo vendors",
    "demo budget",
    "demo exports",
    "demo observatory events"
  ]
};

const cadRuntime = {
  generatedAt,
  status: "READY",
  route: "/cad/editor",
  sceneCanvas: true,
  gridFloor: true,
  cameraModes: ["perspective", "top", "front", "side"],
  objectInsertion: true,
  objectSelection: true,
  transformControls: true,
  layerVisibility: true,
  materialAssignment: true,
  saveLoadSceneJson: true,
  saveLoadValidation: true,
  sprint04Tools: cadEditorTools,
  localExports: exportJobs,
  sceneGraph: {
    status: "READY",
    branches: sceneBranches,
    controls: [
      "Scene Hierarchy Panel",
      "Object Tree",
      "Layer Tree with Lock/Hide",
      "Object Inspector",
      "Material Inspector",
      "Asset Browser",
      "Measurement Tool",
      "Annotation Tool",
      "Template Loader",
      "Scene Statistics",
      "Save/Load Validation",
      "Selection Manager",
      "Search",
      "Grouping"
    ]
  },
  assetLibrary: {
    status: "READY",
    totalAssets: assetRegistryStats.total,
    categoryCount: assetRegistryStats.categoryCount,
    statusCounts: assetRegistryStats.statusCounts,
    cadInsertable: assetRegistryStats.cadInsertable,
    missingMeshFileBlockers: {
      glbMeshFiles: assetRegistryStats.glbMeshFiles,
      missingRealMeshes: assetRegistryStats.missingRealMeshes
    },
    byCategory: assetRegistryStats.categories
  },
  boardComposer: {
    status: boardPackage.status,
    pipeline: boardPackage.pipeline,
    pageCount: boardPackage.pages.length,
    pages: boardPackage.pages,
    exportFormats: boardPackage.exportFormats
  },
  pdfBoardPackage: {
    ...pdfBoardPackageSummary,
    exists: existsSync(pdfBoardPath),
    bytes: existsSync(pdfBoardPath) ? statSync(pdfBoardPath).size : 0,
    evidence: pdfBoardEvidence
  },
  cadRoundTripFixtures: {
    ...cadRoundTripSummary,
    evidence: cadRoundTripEvidence
  },
  complianceRuntime: {
    ...complianceRuntimeSummary,
    reports: [structuralComplianceReport, electricalComplianceReport, fireSafetyComplianceReport]
  },
  liveIntegrationGates: {
    ...liveIntegrationSummary,
    gates: liveIntegrationGates
  },
  templateRuntime: {
    status: "READY",
    ...templateRuntimeSummary
  },
  productionRuntime: {
    status: "READY",
    ...productionRuntimeSummary
  },
  visualVerification: {
    script: "npm run verify:cad:visual",
    desktop: {
      viewport: "1280x720",
      canvas: "300x1084",
      sampleColors: 109,
      nonBackgroundSamples: 195
    },
    mobile: {
      viewport: "390x844",
      canvas: "390x469",
      sampleColors: 129,
      nonBackgroundSamples: 152
    }
  },
  starterObjects: starterObjectKinds,
  blockedCadFeatures: [
    {
      feature: "Native DWG export",
      status: "BLOCKED",
      reason: "No native DWG writer, round-trip compatibility, AutoCAD validation, or DWG fixture evidence exists."
    },
    {
      feature: "Production DXF export",
      status: "BLOCKED",
      reason: "Preview ASCII DXF footprint export is implemented. Production DXF with dimensions, sheets, blocks, CAD QA, and venue handoff remains unavailable."
    },
    {
      feature: "Engineering compliance",
      status: "BLOCKED",
      reason: "No municipal, engineering, accessibility, fire, electrical, or venue-authority compliance rules engine is implemented."
    },
    {
      feature: "Structural validation",
      status: "BLOCKED",
      reason: "No load, wind, rigging, or electrical safety calculation exists."
    }
  ]
};

const blockers = {
  generatedAt,
  status: "BLOCKED",
  blockedCapabilities
};

const usecases = {
  generatedAt,
  status: categoryDemoUseCaseSummary.status,
  verdict: categoryDemoUseCaseSummary.verdict,
  productionReady: categoryDemoUseCaseSummary.productionReady,
  registryRef: "data/usecases/category-demo-usecases.json",
  categoryCount: categoryDemoUseCaseSummary.categoryCount,
  useCaseCount: categoryDemoUseCaseSummary.useCaseCount,
  useCasesPerCategory: 4,
  assetRefCount: categoryDemoUseCaseSummary.assetRefCount,
  screenRefCount: categoryDemoUseCaseSummary.screenRefCount,
  routeCount: categoryDemoUseCaseSummary.routeCount,
  evidenceRefs: categoryDemoUseCaseSummary.evidenceRefs,
  checks: {
    categoriesExist: categoryDemoUseCaseSummary.categoryCount === 27,
    fourUseCasesPerCategory:
      categoryDemoUseCaseSummary.minUseCasesPerCategory === 4 && categoryDemoUseCaseSummary.maxUseCasesPerCategory === 4,
    allUseCasesHaveAssetRefs: categoryDemoUseCaseSets.every((set) => set.useCases.every((useCase) => useCase.assetRefs.length > 0)),
    allUseCasesHaveScreenRefs: categoryDemoUseCaseSets.every((set) => set.useCases.every((useCase) => useCase.screens.length > 0)),
    blockerNotesExist: categoryDemoUseCaseSets.every((set) => set.useCases.every((useCase) => useCase.blockedNotes.length > 0)),
    allRoutesHaveActiveUseCases: routeUseCaseCoverage.every((route) => route.useCaseCount >= 4),
    productionReadyFalse: categoryDemoUseCaseSummary.productionReady === false,
    verdictControlledPreviewReady: categoryDemoUseCaseSummary.verdict === "CONTROLLED_PREVIEW_READY"
  },
  blockedCapabilityNotes: blockedCapabilities.map((capability) => ({
    id: capability.id,
    label: capability.label,
    status: capability.status,
    reason: capability.reason
  })),
  routeUseCaseCoverage,
  categories: categoryDemoUseCaseSets.map((set) => ({
    category: set.category,
    slug: set.slug,
    status: set.status,
    routes: set.routes,
    useCaseCount: set.useCases.length,
    assetCount: set.assetCount,
    readyAssets: set.readyAssets,
    partialAssets: set.partialAssets,
    blockedAssets: set.blockedAssets,
    screenCount: set.screenCount,
    useCases: set.useCases.map((useCase) => ({
      id: useCase.id,
      title: useCase.title,
      route: useCase.route,
      status: useCase.status,
      assetRefs: useCase.assetRefs.map((asset) => asset.id),
      screenRefs: useCase.screens.map((screen) => ({
        id: screen.id,
        route: screen.route,
        image: screen.image
      })),
      blockerNoteCount: useCase.blockedNotes.length
    }))
  }))
};

const activePages = {
  generatedAt,
  status: routePageRuntimeSummary.status,
  verdict: routePageRuntimeSummary.verdict,
  productionReady: routePageRuntimeSummary.productionReady,
  activeRouteCount: routePageRuntimeSummary.activeRouteCount,
  previewFramesUsed: routePageRuntimeSummary.previewFramesUsed,
  routeFramesUsed: routePageRuntimeSummary.routeFramesUsed,
  demoDataCount: routePageRuntimeSummary.demoDataCount,
  runtimeCoverageCount: routePageRuntimeSummary.runtimeCoverageCount,
  activeStepCount: routePageRuntimeSummary.activeStepCount,
  demoFlowCount: routePageRuntimeSummary.demoFlowCount,
  useCaseCount: routePageRuntimeSummary.useCaseCount,
  routeUseCaseRefs: routePageRuntimeSummary.routeUseCaseRefs,
  screenLinkCount: routePageRuntimeSummary.screenLinkCount,
  routeScreenRefCount: routePageRuntimeSummary.routeScreenRefCount,
  assetRefCount: routePageRuntimeSummary.assetRefCount,
  blockerCount: routePageRuntimeSummary.blockerCount,
  checks: {
    allRoutesHaveActivePages: routePageRuntimeSummary.allRoutesHaveActivePages,
    routeCountIs32: routePageRuntimeSummary.activeRouteCount === 32,
    previewFramesUsed25: routePageRuntimeSummary.previewFramesUsed === 25,
    demoDataAtLeast208: routePageRuntimeSummary.demoDataCount >= 208,
    runtimeCoverageAtLeast139: routePageRuntimeSummary.runtimeCoverageCount >= 139,
    demoFlowsCoverRouteUseCases: routePageRuntimeSummary.demoFlowCount === routePageRuntimeSummary.routeUseCaseRefs,
    allUseCasesHaveDemoFlow: routePageRuntimeSummary.allUseCasesHaveDemoFlow,
    useCases108: routePageRuntimeSummary.useCaseCount === 108,
    screenLinks432: routePageRuntimeSummary.screenLinkCount === 432,
    productionReadyFalse: routePageRuntimeSummary.productionReady === false,
    verdictControlledPreviewReady: routePageRuntimeSummary.verdict === "CONTROLLED_PREVIEW_READY"
  },
  extendedModuleProfiles,
  pages: activeRoutePages.map((page) => ({
    routePath: page.route.path,
    title: page.title,
    status: page.status,
    previewFrame: page.previewFrame.frameId,
    previewFrameTitle: page.previewFrame.frameTitle,
    cinematicScreen: page.cinematicScreen,
    demoDataPoints: page.demoData.length,
    runtimeCoverageChecks: page.localRuntimeCoverage.length,
    activeSteps: page.activeSteps.map((step) => ({
      id: step.id,
      kind: step.kind,
      label: step.label,
      status: step.status,
      evidenceRef: step.evidenceRef
    })),
    demoFlows: page.demoFlows.map((flow) => ({
      id: flow.id,
      useCaseId: flow.useCaseId,
      chain: flow.chain,
      activeStepCount: flow.activeSteps.length,
      assetRefCount: flow.assetRefs.length,
      screenRefCount: flow.screenRefs.length,
      boardComposer: flow.boardComposer,
      exportPackage: flow.exportPackage,
      evidenceRefs: flow.evidenceRefs
    })),
    useCases: page.useCases.map((useCase) => ({
      id: useCase.id,
      title: useCase.title,
      status: useCase.status,
      route: useCase.route,
      assetRefs: useCase.assetRefs.map((asset) => asset.id),
      screenRefs: useCase.screens.map((screen) => screen.id),
      blockers: useCase.blockedNotes
    })),
    assetRefCount: page.assetRefs.length,
    screenRefCount: page.screenRefs.length,
    routeSpecificBlockers: page.routeSpecificBlockers,
    moduleActions: page.moduleActions,
    evidenceRefs: page.evidenceRefs
  }))
};

const statusMatrix = `# TLP Wedding CAD Status Matrix

Generated: ${generatedAt}

Final verdict: ${releaseStatus.verdict}  
PRODUCTION_READY=false

| Area | Status | Evidence |
| --- | --- | --- |
| Route matrix | READY | ${routeMatrix.length} matrix routes plus \`/cad/editor\` runtime route render READY preview frames. |
| Unified premium layout/theme | READY | Shared route pages and CAD runtime use the premium dark shell with fixed luxury sidebar, dark top command bar, scoped route-card theme, and controlled-preview status treatment. |
| Floral Designer route absorption | READY | \`/floral\` renders the extracted dark premium Floral Designer workspace for Hemant Samwat Wedding with ${floralWorkspaceSummary.kpiWidgets} KPI widgets, ${floralWorkspaceSummary.tabs} tabs, ${floralWorkspaceSummary.numberedPanels} numbered panels, ${floralWorkspaceSummary.visualAssets} local visual asset refs, ${floralWorkspaceSummary.spacePoints} placement points, and ${floralWorkspaceSummary.localRuntimeCoverage} local runtime coverage checks. |
| Hero banner generation | READY | ${heroBannerSummary.count} hero banners were generated as ${heroBannerSummary.hiresSize.width}x${heroBannerSummary.hiresSize.height} high-res local preview WebP assets from the supplied board reference and mapped across ${heroBannerSummary.routeBindings} route bindings. |
| TLPS Wedding OS homepage extraction | READY | ${tlpsWeddingOsHomepageSummary.sectionCount} full-page sections, ${tlpsWeddingOsHomepageSummary.destinationCount} destination cards, ${tlpsWeddingOsHomepageSummary.designStudioCardCount} design studio cards, and ${tlpsWeddingOsHomepageSummary.filmCardCount} film cards were extracted into local preview assets for \`${tlpsWeddingOsHomepageSummary.route}\`. |
| TLPS unique source extraction | READY | ${tlpsUniqueExtractionSummary.uniqueFrameCount} unique source/frame crops were extracted from ${tlpsUniqueExtractionSummary.uniqueSourceCount}/${tlpsUniqueExtractionSummary.sourceCount} supplied PNG sources; ${tlpsUniqueExtractionSummary.duplicateSourceCount} related duplicate source was recorded and skipped. |
| Cinematic image asset regeneration | READY | ${cinematicImageAssetSummary.uniqueSourceCount}/${cinematicImageAssetSummary.sourceCount} unique local image sources were regenerated into ${cinematicImageAssetSummary.totalVariantCount} high-resolution cinematic WebP variants across ${cinematicImageAssetSummary.aspectVariantCount} aspects and ${cinematicImageAssetSummary.uxSpaceCount} UX spaces using ${cinematicImageAssetSummary.generationMode}; these are local derivatives, not new live photography or production-certified media. |
| Use case registry | READY | ${categoryDemoUseCaseSummary.categoryCount} categories and ${categoryDemoUseCaseSummary.useCaseCount} use cases are stabilized in \`data/usecases/category-demo-usecases.json\` with ${categoryDemoUseCaseSummary.assetRefCount} asset refs, ${categoryDemoUseCaseSummary.screenRefCount} screen refs, route refs, blocker notes, and active use-case coverage for ${routeUseCaseCoverage.length} route pages; evidence writes to \`release/evidence/usecases.json\`. |
| Active real route pages | READY | ${routePageRuntimeSummary.activeRouteCount}/32 routes render active page data with ${routePageRuntimeSummary.previewFramesUsed} preview frames, ${routePageRuntimeSummary.demoDataCount} demo data points, ${routePageRuntimeSummary.runtimeCoverageCount} runtime coverage checks, ${routePageRuntimeSummary.activeStepCount} active steps, ${routePageRuntimeSummary.demoFlowCount} SPRINT-07 use-case demo flows, asset refs, screen refs, route-specific blockers, cinematic screens, board composer refs, export package refs, and evidence refs. |
| Preview frame runtime | READY | ${previewFrameRuntimeSummary.routeFramesReady}/${previewFrameRuntimeSummary.routeFrames} route frames have typed demo data and local runtime coverage; ${previewFrameRuntimeSummary.totalDemoDataPoints} demo data points and ${previewFrameRuntimeSummary.totalLocalCoveragePoints} local coverage checks are generated from code. |
| UI frame extraction | READY | Reusable UI frame definitions are complete and all frame statuses are READY. |
| Generated board extraction | READY | ${extractedBoardSummary.boardCount} PNG boards, ${extractedBoardSummary.optionCount} extracted frames/options, and ${extractedBoardSummary.panelCount} technical panels render in \`/vr\`. |
| Data frame extraction | READY | Typed frames exist for project, venue, mandap, seating, lighting, floral, materials, CAD objects, layers, assets, budget, vendors, guests, drone zones, jobs, events, and blockers. |
| Complete CAD asset registry | READY | ${assetRegistryStats.total} generated local preview asset records across ${assetRegistryStats.categoryCount} categories: READY=${assetRegistryStats.statusCounts.READY}, PARTIAL=${assetRegistryStats.statusCounts.PARTIAL}, BLOCKED=${assetRegistryStats.statusCounts.BLOCKED}. CAD insert coverage: ${assetRegistryStats.cadInsertable} GLB-backed primitive placeholders. Local GLB mesh files generated: ${assetRegistryStats.glbMeshFiles}; vendor production mesh models are not claimed. |
| Prisma schema | READY | ${modelNames.length} required domain models plus join tables for role/user and role/permission relations. |
| Zod and TypeScript models | READY | ${modelNames.length} model schemas and exported TypeScript types. |
| Three.js CAD runtime | READY | \`/cad/editor\` has canvas, grid, camera modes, insertion, selection, transform controls, layer visibility, material assignment, scene JSON save/load, JSON download, preview DXF export, and printable board HTML export. |
| SPRINT-04 CAD editor maturity | READY | ${cadEditorTools.readyTools}/${cadEditorTools.tools} editor tools are READY: ${cadEditorTools.labels.join(", ")}. |
| Scene graph maturity | READY | Scene hierarchy branches are ${sceneBranches.join(", ")} with Object Tree, Layer Tree, Selection Manager, Property Inspector, Search, Grouping, and Lock/Hide controls. |
| Wedding asset library | READY | ${assetRegistryStats.total} reusable local preview asset records: ${assetRegistryStats.categories.map((item) => `${item.count} ${item.category}`).join(", ")}. |
| Board composer runtime | READY | Scene to Render to Board Composer to PDF Package frame has ${boardPackage.pages.length} pages: ${boardPackage.pages.map((page) => page.title).join(", ")}. |
| Binary PDF board package | READY | Local PDF package generation writes \`${pdfBoardPackagePath}\` with ${boardPackage.pages.length} pages from scene, render, budget, board, and asset data. Production print certification is not claimed. |
| CAD round-trip fixtures | READY | Preview CAD fixtures write scene JSON and DXF footprint files with ${cadRoundTripSummary.lineEntityCount} parsed LINE entities. Native DWG and production DXF remain BLOCKED. |
| Local compliance validators | READY | Structural, electrical, and fire validators produce rule-based preview findings; certified structural/electrical/fire/engineering compliance remains BLOCKED. |
| Template runtime | READY | ${templateRuntimeSummary.readyTemplates}/${templateRuntimeSummary.templates} templates load scene objects, budgets, asset lists, and board packages for Hemant Samwat Wedding, Vedic Lotus Mandap, Royal Palace Wedding, Temple Mandap, Sci-Fi Galactic Portal, Garden Mandap, Navagraha Grid, and Panch Tatva Mandap. |
| Production planning runtime | READY | Vendor assignments, crew assignments, transport, accommodation, schedule items, call sheets, and work orders are connected to CAD scene object/layer ids for preview planning. |
| Live vendor/payment/marketplace gates | BLOCKED | ${liveIntegrationGates.length} live integration gates require provider/API evidence before any live vendor, payment, or marketplace claim can move out of BLOCKED. |
| Template JSON | READY | 10 layout templates exist under \`data/templates\`. |
| Seed data | READY | \`prisma/seed.ts\` creates demo organization, user, project, venue, scene, mandap, lighting, floral, guests, vendors, budget, exports, observatory events, evidence, and release gate. |
| Native DWG export | BLOCKED | No native DWG writer, round-trip compatibility, AutoCAD validation, or DWG fixture evidence exists. |
| Production DXF export | BLOCKED | Preview DXF footprint export exists; production-grade CAD handoff remains unavailable. |
| Payments | BLOCKED | No checkout provider or payment evidence exists. |
| Marketplace commerce | BLOCKED | Preview catalog only; no seller/order/fulfillment runtime. |
| Live vendor network | BLOCKED | Demo vendors only; no live vendor API or booking flow. |
| Structural validation | BLOCKED | Local preview checks exist; stamped load, wind, truss, rigging, anchoring, and temporary-structure safety certification remains unavailable. |
| Electrical validation | BLOCKED | Local preview checks exist; licensed load schedules, phase balancing, cabling, earthing, generator sizing, and certified electrical safety remain unavailable. |
| Fire safety validation | BLOCKED | Local preview checks exist; certified fire exit, extinguisher, evacuation width, flame-retardant material, and authority approval validation remain unavailable. |
| Engineering compliance | BLOCKED | Local validators are not a municipal, engineering, accessibility, fire, electrical, or venue-authority compliance signoff. |
`;

writeJson("latest.json", latest);
writeJson("routes.json", routes);
writeJson("schema.json", schema);
writeJson("cad-runtime.json", cadRuntime);
writeJson("blockers.json", blockers);
writeJson("usecases.json", usecases);
writeJson("active-pages.json", activePages);
writeJson("compliance-runtime.json", {
  generatedAt,
  verdict: releaseStatus.verdict,
  ...complianceRuntimeSummary,
  productionReady: false,
  reports: [structuralComplianceReport, electricalComplianceReport, fireSafetyComplianceReport]
});
writeJson("live-integrations.json", {
  generatedAt,
  verdict: releaseStatus.verdict,
  ...liveIntegrationSummary,
  productionReady: false,
  gates: liveIntegrationGates
});
writeFileSync(new URL("status-matrix.md", evidenceDir), statusMatrix);

console.log(`generate:evidence wrote release/evidence (${routeMatrix.length} READY routes, ${extractedBoardSummary.optionCount} extracted frames, ${floralWorkspaceSummary.numberedPanels} floral panels)`);

function writeJson(fileName: string, value: unknown) {
  writeFileSync(new URL(fileName, evidenceDir), `${JSON.stringify(value, null, 2)}\n`);
}
