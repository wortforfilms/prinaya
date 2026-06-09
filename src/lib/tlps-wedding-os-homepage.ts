import tlpsHomepageJson from "../../data/tlps-wedding-os-homepage.json";
import type { CapabilityStatus } from "./status";

export type TlpsHomepageAsset = {
  id: string;
  label: string;
  image: string;
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  status: CapabilityStatus;
};

export type TlpsDestination = {
  label: string;
  subtitle: string;
  assetId: string;
};

export type TlpsStudioCard = {
  label: string;
  assetId: string;
};

export type TlpsStat = {
  value: string;
  label: string;
};

export type TlpsWeddingOsHomepage = {
  generatedAt: string;
  status: CapabilityStatus;
  verdict: "CONTROLLED_PREVIEW_READY";
  productionReady: false;
  source: string;
  sourceSize: { width: number; height: number };
  route: "/wedding-os";
  fullPageImage: string;
  sections: TlpsHomepageAsset[];
  destinationCards: TlpsHomepageAsset[];
  designStudioCards: TlpsHomepageAsset[];
  filmCards: TlpsHomepageAsset[];
  navigation: string[];
  hero: {
    brand: string;
    headline: string;
    subcopy: string;
    tagline: string;
    actions: string[];
  };
  floatingActions: string[];
  ecosystemModules: string[];
  destinations: TlpsDestination[];
  designStudio: {
    tools: string[];
    cards: TlpsStudioCard[];
  };
  filmStudio: TlpsStudioCard[];
  signatureExperiences: string[];
  stats: TlpsStat[];
  whyChoose: string[];
  aiCoPilot: string[];
  cta: {
    headline: string;
    subcopy: string;
    tags: string[];
    actions: string[];
  };
  footer: {
    brand: string;
    contact: string[];
    links: string[];
    services: string[];
    resources: string[];
  };
};

export const tlpsWeddingOsHomepage = tlpsHomepageJson as TlpsWeddingOsHomepage;

export const tlpsWeddingOsHomepageSummary = {
  status: tlpsWeddingOsHomepage.status,
  route: tlpsWeddingOsHomepage.route,
  sourceSize: tlpsWeddingOsHomepage.sourceSize,
  sectionCount: tlpsWeddingOsHomepage.sections.length,
  destinationCount: tlpsWeddingOsHomepage.destinationCards.length,
  designStudioCardCount: tlpsWeddingOsHomepage.designStudioCards.length,
  filmCardCount: tlpsWeddingOsHomepage.filmCards.length,
  ecosystemModuleCount: tlpsWeddingOsHomepage.ecosystemModules.length,
  statCount: tlpsWeddingOsHomepage.stats.length,
  productionReady: tlpsWeddingOsHomepage.productionReady,
  evidenceRef: "release/evidence/tlps-wedding-os-homepage.json"
};

export function getTlpsHomepageAsset(id: string) {
  return [
    ...tlpsWeddingOsHomepage.sections,
    ...tlpsWeddingOsHomepage.destinationCards,
    ...tlpsWeddingOsHomepage.designStudioCards,
    ...tlpsWeddingOsHomepage.filmCards
  ].find((asset) => asset.id === id);
}
