import { findRouteBySegment, publicRoutes } from "./route-matrix";

export function publicRoute(path: string) {
  const route = publicRoutes.find((item) => item.path === path);
  if (!route) {
    throw new Error(`Missing public route ${path}`);
  }
  return route;
}

export function moduleRoute(segment: string) {
  return findRouteBySegment(segment);
}
