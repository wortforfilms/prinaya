import heroBannerJson from "../../data/hero-banners.json";

export type HeroBannerStatus = "READY" | "PARTIAL" | "BLOCKED";

export type HeroBannerRecord = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: HeroBannerStatus;
  generationMode?: "GENERATED_HIRES_FROM_REFERENCE" | "EXTRACTED_CROP_UPSCALE";
  sourceBoard: string;
  sourceCrop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rawImage: string;
  hiresImage: string;
  hiresSize: {
    width: number;
    height: number;
  };
  routes: string[];
  evidenceRef: string;
};

type HeroBannerRegistry = {
  generatedAt: string;
  status: HeroBannerStatus;
  generationMode?: "GENERATED_HIRES_FROM_REFERENCE" | "EXTRACTED_CROP_UPSCALE";
  source: string;
  sourceSize: { width: number; height: number };
  count: number;
  hiresSize: { width: number; height: number };
  records: HeroBannerRecord[];
};

export const heroBannerRegistry = heroBannerJson as HeroBannerRegistry;
export const heroBanners = heroBannerRegistry.records;

export const heroBannerSummary = {
  status: heroBannerRegistry.status,
  count: heroBannerRegistry.count,
  generationMode: heroBannerRegistry.generationMode ?? "GENERATED_HIRES_FROM_REFERENCE",
  sourceSize: heroBannerRegistry.sourceSize,
  hiresSize: heroBannerRegistry.hiresSize,
  routeBindings: heroBanners.reduce((sum, banner) => sum + banner.routes.length, 0),
  evidenceRef: "release/evidence/hero-banners.json"
};

export function getAllHeroBanners() {
  return heroBanners;
}

export function getHeroBannerBySlug(slug: string) {
  return heroBanners.find((banner) => banner.slug === slug);
}

export function getHeroBannerForRoute(routePath: string) {
  const normalized = normalizeRoute(routePath);
  const direct = heroBanners.find((banner) => banner.routes.some((route) => normalizeRoute(route) === normalized));
  if (direct) return direct;

  const parent = heroBanners.find((banner) =>
    banner.routes.some((route) => {
      const candidate = normalizeRoute(route);
      return normalized.startsWith(`${candidate}/`) || candidate.startsWith(`${normalized}/`);
    })
  );
  return parent ?? getHeroBannerBySlug("dashboard") ?? heroBanners[0];
}

function normalizeRoute(routePath: string) {
  const trimmed = routePath.replace("/*", "").replace(/\/+$/, "");
  return trimmed || "/";
}
