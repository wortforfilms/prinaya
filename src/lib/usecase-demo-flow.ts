import type { ActiveWorkflowStep } from "./active-step-runtime";
import { boardPackage } from "./board-runtime";
import { pdfBoardPackageSummary } from "./pdf-board-runtime";
import type { CategoryDemoUseCase } from "./usecase-runtime";

export type UseCaseDemoFlowStage =
  | "Use Case"
  | "Active Steps"
  | "Assets"
  | "Screens"
  | "Board Composer"
  | "Export Package"
  | "Evidence Ref";

export type UseCaseDemoFlow = {
  id: string;
  useCaseId: string;
  title: string;
  route: string;
  status: "READY" | "PARTIAL" | "BLOCKED";
  productionReady: false;
  chain: UseCaseDemoFlowStage[];
  activeSteps: Array<{
    label: string;
    summary: string;
    evidenceRef: string;
  }>;
  assetRefs: string[];
  screenRefs: Array<{
    id: string;
    route: string;
    image: string;
  }>;
  boardComposer: {
    id: string;
    route: string;
    status: "READY";
    pipeline: string[];
    pageCount: number;
  };
  exportPackage: {
    id: string;
    route: string;
    status: "READY";
    productionReady: false;
    file: string;
    formats: string[];
    note: string;
  };
  evidenceRefs: string[];
  blockerNotes: string[];
};

const demoFlowChain: UseCaseDemoFlowStage[] = [
  "Use Case",
  "Active Steps",
  "Assets",
  "Screens",
  "Board Composer",
  "Export Package",
  "Evidence Ref"
];

export function buildUseCaseDemoFlows(useCases: CategoryDemoUseCase[], activeSteps: ActiveWorkflowStep[]): UseCaseDemoFlow[] {
  return useCases.map((useCase, index) => {
    const linkedSteps = activeSteps.filter((step) => step.sourceUseCaseId === useCase.id);
    const fallbackSteps = activeSteps.slice(index, index + 2);
    const stepRefs = (linkedSteps.length ? linkedSteps : fallbackSteps).slice(0, 3);
    return {
      id: `${useCase.id}-demo-flow`,
      useCaseId: useCase.id,
      title: useCase.title,
      route: useCase.route,
      status: useCase.status,
      productionReady: false,
      chain: demoFlowChain,
      activeSteps: stepRefs.map((step) => ({
        label: step.label,
        summary: step.summary,
        evidenceRef: step.evidenceRef
      })),
      assetRefs: useCase.assetRefs.map((asset) => asset.id),
      screenRefs: useCase.screens.map((screen) => ({
        id: screen.id,
        route: screen.route,
        image: screen.image
      })),
      boardComposer: {
        id: boardPackage.id,
        route: "/exports/boards",
        status: boardPackage.status,
        pipeline: boardPackage.pipeline,
        pageCount: boardPackage.pages.length
      },
      exportPackage: {
        id: pdfBoardPackageSummary.file.replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, ""),
        route: "/exports/package",
        status: pdfBoardPackageSummary.status,
        productionReady: false,
        file: pdfBoardPackageSummary.file,
        formats: boardPackage.exportFormats,
        note: pdfBoardPackageSummary.note
      },
      evidenceRefs: dedupeStrings([
        "data/usecases/category-demo-usecases.json",
        "release/evidence/usecases.json",
        "release/evidence/active-pages.json",
        "release/evidence/cad-runtime.json",
        "release/evidence/pdf-board-package.json",
        ...stepRefs.map((step) => step.evidenceRef)
      ]),
      blockerNotes: useCase.blockedNotes
    };
  });
}

function dedupeStrings(values: string[]) {
  return [...new Set(values)];
}
