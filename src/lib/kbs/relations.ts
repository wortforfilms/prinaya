/**
 * KBS relation helpers — small typed constructors so adapters in registry.ts
 * stay readable.
 */
import type { KbsRelation, KbsRelationKind } from "./graph";

export function rel(kind: KbsRelationKind, to: string, weight?: number): KbsRelation {
  return weight === undefined ? { kind, to } : { kind, to, weight };
}

export const uses = (to: string, weight?: number) => rel("uses", to, weight);
export const references = (to: string, weight?: number) => rel("references", to, weight);
export const partOf = (to: string) => rel("partOf", to);
export const rendersTo = (to: string) => rel("rendersTo", to);
export const recommends = (to: string, weight?: number) => rel("recommends", to, weight);
export const requires = (to: string) => rel("requires", to);
export const documents = (to: string) => rel("documents", to);
export const derivedFrom = (to: string) => rel("derivedFrom", to);
export const linkedTo = (to: string) => rel("linkedTo", to);

/** Canonical node-id builders keep the `<type>:<slug>` scheme consistent. */
export const id = {
  asset: (slug: string) => `asset:${slug}`,
  route: (path: string) => `route:${path}`,
  useCase: (slug: string) => `usecase:${slug}`,
  screen: (slug: string) => `screen:${slug}`,
  template: (slug: string) => `template:${slug}`,
  board: (slug: string) => `board:${slug}`,
  material: (slug: string) => `material:${slug}`,
  ritual: (slug: string) => `ritual:${slug}`,
  film: (slug: string) => `film:${slug}`,
  shot: (slug: string) => `shot:${slug}`,
  vedi: (slug: string) => `vedi:${slug}`,
  vendor: (slug: string) => `vendor:${slug}`
};
