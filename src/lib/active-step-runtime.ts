import type { PreviewRouteFrameRuntime } from "./preview-frame-runtime";
import type { RouteDefinition } from "./route-matrix";
import type { CategoryDemoUseCase } from "./usecase-runtime";

export type ActiveStepKind = "input" | "configure" | "preview" | "validate" | "export-share" | "evidence";

export type ActiveWorkflowStep = {
  id: string;
  kind: ActiveStepKind;
  label: string;
  summary: string;
  route: string;
  sourceUseCaseId: string;
  sourceUseCaseTitle: string;
  status: "READY";
  evidenceRef: string;
};

const stepKinds: ActiveStepKind[] = ["input", "configure", "preview", "validate", "export-share", "evidence"];

export function buildActiveStepsForRoute({
  route,
  frame,
  useCases,
  moduleActions
}: {
  route: RouteDefinition;
  frame: PreviewRouteFrameRuntime;
  useCases: CategoryDemoUseCase[];
  moduleActions: string[];
}): ActiveWorkflowStep[] {
  const actions = moduleActions.length >= 6 ? moduleActions : [...moduleActions, ...route.capabilities, frame.frameTitle];
  return stepKinds.map((kind, index) => {
    const useCase = useCases[index % useCases.length];
    const sourceStep = useCase?.steps[index % useCase.steps.length] ?? `${route.title} ${kind} step`;
    return {
      id: `${normalizeRoute(route.path).replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-") || "home"}-${kind}`,
      kind,
      label: labelForKind(kind),
      summary: `${actions[index % actions.length] ?? route.primaryFrame}: ${sourceStep}`,
      route: normalizeRoute(route.path),
      sourceUseCaseId: useCase?.id ?? `${normalizeRoute(route.path)}-fallback`,
      sourceUseCaseTitle: useCase?.title ?? route.title,
      status: "READY",
      evidenceRef: frame.evidenceRefs[index % frame.evidenceRefs.length] ?? "release/evidence/active-pages.json"
    };
  });
}

function labelForKind(kind: ActiveStepKind) {
  if (kind === "export-share") return "Export / Share";
  return kind
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function normalizeRoute(routePath: string) {
  const trimmed = routePath.replace("/*", "").replace(/\/+$/, "");
  return trimmed || "/";
}
