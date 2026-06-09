import { materialPalette, starterObjectKinds, type CadObjectFrame, type LayerFrame } from "./data-frames";
import type { CapabilityStatus } from "./status";

export type CadToolMode = "select" | "measure" | "annotate";

export type MeasurementFrame = {
  id: string;
  label: string;
  fromObjectId: string;
  toObjectId: string;
  distanceM: number;
  status: "READY";
};

export type AnnotationFrame = {
  id: string;
  objectId: string;
  label: string;
  note: string;
  status: "READY";
};

export type SceneValidationFrame = {
  status: CapabilityStatus;
  message: string;
  errors: string[];
  warnings: string[];
  objectCount: number;
  layerCount: number;
};

export const cadEditorToolChecklist = [
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
].map((label) => ({ label, status: "READY" as const }));

export const defaultSceneValidation: SceneValidationFrame = {
  status: "READY",
  message: "Scene JSON is valid and ready to load.",
  errors: [],
  warnings: [],
  objectCount: 0,
  layerCount: 0
};

export function createMeasurementForSelection(
  objects: CadObjectFrame[],
  selectedId: string | null,
  previousSelectedId: string | null,
  index: number
): MeasurementFrame | null {
  const selected = objects.find((object) => object.id === selectedId);
  const previous = objects.find((object) => object.id === previousSelectedId && object.id !== selectedId);
  if (!selected || !previous) return null;
  const distanceM = distanceBetweenObjects(previous, selected);
  return {
    id: `measurement-${previous.id}-${selected.id}-${index + 1}`,
    label: `${previous.label} to ${selected.label}`,
    fromObjectId: previous.id,
    toObjectId: selected.id,
    distanceM,
    status: "READY"
  };
}

export function createAnnotationForSelection(
  objects: CadObjectFrame[],
  selectedId: string | null,
  note: string,
  index: number
): AnnotationFrame | null {
  const selected = objects.find((object) => object.id === selectedId);
  const trimmed = note.trim();
  if (!selected || !trimmed) return null;
  return {
    id: `annotation-${selected.id}-${index + 1}`,
    objectId: selected.id,
    label: selected.label,
    note: trimmed,
    status: "READY"
  };
}

export function distanceBetweenObjects(a: CadObjectFrame, b: CadObjectFrame) {
  const dx = a.position[0] - b.position[0];
  const dy = a.position[1] - b.position[1];
  const dz = a.position[2] - b.position[2];
  return Number(Math.sqrt(dx * dx + dy * dy + dz * dz).toFixed(2));
}

export function validateSceneJson(json: string): SceneValidationFrame {
  try {
    const parsed = JSON.parse(json) as Partial<{
      objects: unknown;
      layers: unknown;
      hiddenObjectIds: unknown;
      lockedObjectIds: unknown;
      groups: unknown;
    }>;
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!Array.isArray(parsed.objects)) errors.push("Scene JSON must include an objects array.");
    if (!Array.isArray(parsed.layers)) errors.push("Scene JSON must include a layers array.");

    const objects = Array.isArray(parsed.objects) ? parsed.objects : [];
    const layers = Array.isArray(parsed.layers) ? parsed.layers : [];
    const layerIds = new Set<string>();
    const objectIds = new Set<string>();

    layers.forEach((layer, index) => {
      if (!isRecord(layer)) {
        errors.push(`Layer ${index + 1} must be an object.`);
        return;
      }
      if (typeof layer.id !== "string" || !layer.id) errors.push(`Layer ${index + 1} is missing id.`);
      if (typeof layer.label !== "string" || !layer.label) errors.push(`Layer ${index + 1} is missing label.`);
      if (typeof layer.visible !== "boolean") errors.push(`Layer ${index + 1} must include visible boolean.`);
      if (typeof layer.locked !== "boolean") errors.push(`Layer ${index + 1} must include locked boolean.`);
      if (typeof layer.color !== "string" || !layer.color.startsWith("#")) warnings.push(`Layer ${index + 1} has no hex color.`);
      if (typeof layer.id === "string") layerIds.add(layer.id);
    });

    objects.forEach((object, index) => {
      if (!isRecord(object)) {
        errors.push(`Object ${index + 1} must be an object.`);
        return;
      }
      if (typeof object.id !== "string" || !object.id) {
        errors.push(`Object ${index + 1} is missing id.`);
      } else if (objectIds.has(object.id)) {
        errors.push(`Object id ${object.id} is duplicated.`);
      } else {
        objectIds.add(object.id);
      }
      if (typeof object.kind !== "string" || !starterObjectKinds.includes(object.kind as CadObjectFrame["kind"])) {
        errors.push(`Object ${index + 1} has an unsupported kind.`);
      }
      if (typeof object.label !== "string" || !object.label) errors.push(`Object ${index + 1} is missing label.`);
      if (typeof object.layerId !== "string" || !layerIds.has(object.layerId)) errors.push(`Object ${index + 1} references a missing layer.`);
      if (typeof object.materialId !== "string" || !materialPalette.some((material) => material.id === object.materialId)) {
        warnings.push(`Object ${index + 1} references an unknown material.`);
      }
      if (!isVec3(object.position)) errors.push(`Object ${index + 1} position must be a 3-number tuple.`);
      if (!isVec3(object.rotation)) errors.push(`Object ${index + 1} rotation must be a 3-number tuple.`);
      if (!isVec3(object.scale)) errors.push(`Object ${index + 1} scale must be a 3-number tuple.`);
    });

    if (objects.length === 0) warnings.push("Scene contains no CAD objects.");
    if (layers.length === 0) warnings.push("Scene contains no layers.");

    return {
      status: errors.length ? "BLOCKED" : "READY",
      message: errors.length ? "Scene JSON is not safe to load." : "Scene JSON is valid and ready to load.",
      errors,
      warnings,
      objectCount: objects.length,
      layerCount: layers.length
    };
  } catch (error) {
    return {
      status: "BLOCKED",
      message: "Scene JSON is invalid.",
      errors: [error instanceof Error ? error.message : "Unable to parse scene JSON."],
      warnings: [],
      objectCount: 0,
      layerCount: 0
    };
  }
}

export function summarizeCadEditorTools() {
  return {
    status: "READY" as const,
    tools: cadEditorToolChecklist.length,
    readyTools: cadEditorToolChecklist.filter((tool) => tool.status === "READY").length,
    labels: cadEditorToolChecklist.map((tool) => tool.label)
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isVec3(value: unknown): value is [number, number, number] {
  return Array.isArray(value) && value.length === 3 && value.every((item) => typeof item === "number" && Number.isFinite(item));
}
