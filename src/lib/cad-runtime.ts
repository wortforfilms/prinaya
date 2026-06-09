import { cadObjects, layers, materialPalette, type CadObjectFrame, type StarterObjectKind, type Vec3 } from "./data-frames";

export type CameraMode = "perspective" | "top" | "front" | "side";

export type StarterAssetDefinition = {
  kind: StarterObjectKind;
  label: string;
  layerId: string;
  materialId: string;
  defaultScale: [number, number, number];
};

export const starterAssetDefinitions: StarterAssetDefinition[] = [
  { kind: "mandap", label: "Mandap", layerId: "mandap", materialId: "lotus-fabric", defaultScale: [8, 0.5, 8] },
  { kind: "stage", label: "Stage", layerId: "site", materialId: "ivory-stone", defaultScale: [10, 1, 4] },
  { kind: "pillar", label: "Pillar", layerId: "mandap", materialId: "brass", defaultScale: [0.7, 5, 0.7] },
  { kind: "arch", label: "Arch", layerId: "decor", materialId: "night-led", defaultScale: [6, 5, 1] },
  { kind: "chair", label: "Chair", layerId: "seating", materialId: "ivory-stone", defaultScale: [0.8, 1, 0.8] },
  { kind: "sofa", label: "Sofa", layerId: "seating", materialId: "lotus-fabric", defaultScale: [3, 1, 1.2] },
  { kind: "table", label: "Table", layerId: "seating", materialId: "ivory-stone", defaultScale: [2, 1, 2] },
  { kind: "gate", label: "Gate", layerId: "site", materialId: "night-led", defaultScale: [8, 5, 1] },
  { kind: "floral-garland", label: "Floral Garland", layerId: "decor", materialId: "neem-greenery", defaultScale: [4, 0.3, 4] },
  { kind: "kalash", label: "Kalash", layerId: "decor", materialId: "brass", defaultScale: [0.8, 1, 0.8] },
  { kind: "diya", label: "Diya", layerId: "decor", materialId: "brass", defaultScale: [0.5, 0.2, 0.5] },
  { kind: "chandelier", label: "Chandelier", layerId: "lighting", materialId: "brass", defaultScale: [2, 1, 2] },
  { kind: "truss", label: "Truss", layerId: "lighting", materialId: "night-led", defaultScale: [8, 0.4, 0.4] },
  { kind: "led-wall", label: "LED Wall", layerId: "lighting", materialId: "night-led", defaultScale: [8, 4, 0.3] },
  { kind: "water-pool", label: "Water Pool", layerId: "site", materialId: "night-led", defaultScale: [8, 0.15, 3] },
  { kind: "tree", label: "Tree", layerId: "site", materialId: "neem-greenery", defaultScale: [3, 7, 3] },
  { kind: "parking-block", label: "Parking Block", layerId: "site", materialId: "ivory-stone", defaultScale: [8, 0.2, 5] },
  { kind: "drone-path-marker", label: "Drone Path Marker", layerId: "site", materialId: "night-led", defaultScale: [1, 1, 1] }
];

export const initialCadScene = {
  version: 1,
  name: "TLP Wedding CAD Demo Scene",
  layers,
  materials: materialPalette,
  objects: cadObjects
};

export function createCadObject(
  kind: StarterObjectKind,
  index: number,
  overrides: Partial<Pick<CadObjectFrame, "label" | "layerId" | "materialId" | "scale">> = {}
): CadObjectFrame {
  const definition = starterAssetDefinitions.find((item) => item.kind === kind);
  if (!definition) {
    throw new Error(`Unsupported starter object kind ${kind}`);
  }
  const scale = overrides.scale ?? definition.defaultScale;
  const offset: Vec3 = [((index % 6) - 3) * 2.8, scale[1] / 2, Math.floor(index / 6) * 2.8 - 6];
  return {
    id: `obj-${kind}-${Date.now()}-${index}`,
    kind,
    label: overrides.label ?? `${definition.label} ${index + 1}`,
    layerId: overrides.layerId ?? definition.layerId,
    materialId: overrides.materialId ?? definition.materialId,
    position: offset,
    rotation: [0, 0, 0],
    scale
  };
}

export function sceneToJson(objects: CadObjectFrame[]) {
  return JSON.stringify({ ...initialCadScene, objects }, null, 2);
}
