import {
  allCategoryDemoUseCases,
  categoryDemoUseCaseRegistry,
  categoryDemoUseCaseSets,
  categoryDemoUseCaseSummary,
  getCategoryDemoUseCases,
  getRouteDemoUseCases,
  getRouteDemoUseCaseSummary,
  type CategoryDemoUseCase,
  type CategoryDemoUseCaseSet,
  type DemoAssetRef,
  type DemoScreenRef
} from "./category-demo-usecases";

export type {
  CategoryDemoUseCase,
  CategoryDemoUseCaseSet,
  DemoAssetRef,
  DemoScreenRef
};

export const useCaseRuntime = {
  status: categoryDemoUseCaseSummary.status,
  verdict: categoryDemoUseCaseSummary.verdict,
  productionReady: categoryDemoUseCaseSummary.productionReady,
  categoryCount: categoryDemoUseCaseSummary.categoryCount,
  useCaseCount: categoryDemoUseCaseSummary.useCaseCount,
  assetRefCount: categoryDemoUseCaseSummary.assetRefCount,
  screenRefCount: categoryDemoUseCaseSummary.screenRefCount,
  registryRef: "data/usecases/category-demo-usecases.json",
  evidenceRef: "release/evidence/usecases.json"
};

export {
  allCategoryDemoUseCases,
  categoryDemoUseCaseRegistry,
  categoryDemoUseCaseSets,
  categoryDemoUseCaseSummary,
  getCategoryDemoUseCases,
  getRouteDemoUseCases,
  getRouteDemoUseCaseSummary
};

export function getUseCasesForRoute(routePath: string, limit = 4) {
  return getRouteDemoUseCases(routePath, limit);
}

export function flattenUseCaseAssets(useCases: CategoryDemoUseCase[]): DemoAssetRef[] {
  return dedupeById(useCases.flatMap((useCase) => useCase.assetRefs));
}

export function flattenUseCaseScreens(useCases: CategoryDemoUseCase[]): DemoScreenRef[] {
  return dedupeById(useCases.flatMap((useCase) => useCase.screens));
}

export function getUseCaseRuntimeSummary(routePath?: string) {
  if (!routePath) return useCaseRuntime;
  return {
    ...useCaseRuntime,
    route: getRouteDemoUseCaseSummary(routePath)
  };
}

function dedupeById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
