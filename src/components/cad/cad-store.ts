"use client";

import { create } from "zustand";
import { createCadObject, initialCadScene, type CameraMode } from "@/lib/cad-runtime";
import {
  createAnnotationForSelection,
  createMeasurementForSelection,
  defaultSceneValidation,
  validateSceneJson,
  type AnnotationFrame,
  type CadToolMode,
  type MeasurementFrame,
  type SceneValidationFrame
} from "@/lib/cad-editor-tools";
import { findWeddingAsset } from "@/lib/wedding-asset-library";
import { buildTemplateRuntime, type TemplateRuntimeId } from "@/lib/template-runtime";
import type { ObjectGroupFrame } from "@/lib/scene-graph";
import type { CadObjectFrame, LayerFrame, StarterObjectKind, Vec3 } from "@/lib/data-frames";

type CadState = {
  objects: CadObjectFrame[];
  layers: LayerFrame[];
  selectedId: string | null;
  selectionHistory: string[];
  hiddenObjectIds: string[];
  lockedObjectIds: string[];
  groups: ObjectGroupFrame[];
  activeTool: CadToolMode;
  measurements: MeasurementFrame[];
  annotations: AnnotationFrame[];
  annotationDraft: string;
  sceneValidation: SceneValidationFrame;
  searchQuery: string;
  cameraMode: CameraMode;
  sceneJson: string;
  selectObject: (id: string | null) => void;
  addObject: (kind: StarterObjectKind, label?: string) => void;
  insertWeddingAsset: (assetId: string) => void;
  toggleLayer: (id: string) => void;
  toggleLayerLocked: (id: string) => void;
  toggleObjectHidden: (id: string) => void;
  toggleObjectLocked: (id: string) => void;
  createSelectionGroup: () => void;
  createLayerGroup: (layerId: string) => void;
  toggleGroupHidden: (id: string) => void;
  toggleGroupLocked: (id: string) => void;
  setActiveTool: (tool: CadToolMode) => void;
  createMeasurement: () => void;
  setAnnotationDraft: (note: string) => void;
  createAnnotation: () => void;
  setMaterial: (id: string) => void;
  nudgeSelected: (delta: Vec3) => void;
  setSearchQuery: (query: string) => void;
  setCameraMode: (mode: CameraMode) => void;
  loadTemplate: (id: TemplateRuntimeId) => void;
  saveScene: () => void;
  loadScene: (json: string) => void;
  setSceneJson: (json: string) => void;
  validateSceneJsonDraft: () => void;
  resetScene: () => void;
};

export const useCadStore = create<CadState>((set, get) => ({
  objects: initialCadScene.objects,
  layers: initialCadScene.layers,
  selectedId: initialCadScene.objects[0]?.id ?? null,
  selectionHistory: initialCadScene.objects[0]?.id ? [initialCadScene.objects[0].id] : [],
  hiddenObjectIds: [],
  lockedObjectIds: [],
  groups: [],
  activeTool: "select",
  measurements: [],
  annotations: [],
  annotationDraft: "Review placement and clearance before final board export.",
  sceneValidation: {
    ...defaultSceneValidation,
    objectCount: initialCadScene.objects.length,
    layerCount: initialCadScene.layers.length
  },
  searchQuery: "",
  cameraMode: "perspective",
  sceneJson: serializeScene({
    objects: initialCadScene.objects,
    layers: initialCadScene.layers,
    groups: [],
    hiddenObjectIds: [],
    lockedObjectIds: [],
    measurements: [],
    annotations: []
  }),
  selectObject: (id) =>
    set((state) => ({
      selectedId: id,
      selectionHistory: id ? [id, ...state.selectionHistory.filter((item) => item !== id)].slice(0, 8) : state.selectionHistory
    })),
  addObject: (kind, label) =>
    set((state) => {
      const next = [...state.objects, createCadObject(kind, state.objects.length, label ? { label } : {})];
      return serializeStateUpdate(state, {
        objects: next,
        selectedId: next[next.length - 1].id,
        selectionHistory: [next[next.length - 1].id, ...state.selectionHistory].slice(0, 8)
      });
    }),
  insertWeddingAsset: (assetId) =>
    set((state) => {
      const asset = findWeddingAsset(assetId);
      if (!asset || asset.status === "BLOCKED") return state;
      const next = [
        ...state.objects,
        createCadObject(asset.starterKind, state.objects.length, {
          label: asset.status === "PARTIAL" ? `${asset.name} (PARTIAL preview)` : asset.name,
          layerId: asset.layerId,
          materialId: asset.materialId
        })
      ];
      return serializeStateUpdate(state, {
        objects: next,
        selectedId: next[next.length - 1].id,
        selectionHistory: [next[next.length - 1].id, ...state.selectionHistory].slice(0, 8),
        sceneValidation: asset.status === "PARTIAL"
          ? {
              ...state.sceneValidation,
              status: "PARTIAL",
              message: `${asset.name} inserted as a generated GLB-backed primitive placeholder. Vendor production mesh remains unavailable.`,
              warnings: [`${asset.id} is PARTIAL preview metadata with a local primitive GLB, not a certified vendor model.`]
            }
          : state.sceneValidation
      });
    }),
  toggleLayer: (id) =>
    set((state) =>
      serializeStateUpdate(state, {
        layers: state.layers.map((layer) => (layer.id === id ? { ...layer, visible: !layer.visible } : layer))
      })
    ),
  toggleLayerLocked: (id) =>
    set((state) =>
      serializeStateUpdate(state, {
        layers: state.layers.map((layer) => (layer.id === id ? { ...layer, locked: !layer.locked } : layer))
      })
    ),
  toggleObjectHidden: (id) =>
    set((state) =>
      serializeStateUpdate(state, {
        hiddenObjectIds: toggleId(state.hiddenObjectIds, id),
        selectedId: state.selectedId === id ? null : state.selectedId
      })
    ),
  toggleObjectLocked: (id) =>
    set((state) =>
      serializeStateUpdate(state, {
        lockedObjectIds: toggleId(state.lockedObjectIds, id)
      })
    ),
  createSelectionGroup: () =>
    set((state) => {
      if (!state.selectedId) return state;
      const selected = state.objects.find((object) => object.id === state.selectedId);
      if (!selected) return state;
      const sameLayerIds = state.objects.filter((object) => object.layerId === selected.layerId).map((object) => object.id);
      return serializeStateUpdate(state, {
        groups: [
          ...state.groups,
          {
            id: `group-${selected.layerId}-${Date.now()}`,
            label: `${selected.label} Group`,
            objectIds: sameLayerIds,
            hidden: false,
            locked: false
          }
        ]
      });
    }),
  createLayerGroup: (layerId) =>
    set((state) => {
      const objectIds = state.objects.filter((object) => object.layerId === layerId).map((object) => object.id);
      const layer = state.layers.find((item) => item.id === layerId);
      if (objectIds.length === 0 || !layer) return state;
      return serializeStateUpdate(state, {
        groups: [
          ...state.groups,
          {
            id: `group-${layerId}-${Date.now()}`,
            label: `${layer.label} Group`,
            objectIds,
            hidden: false,
            locked: false
          }
        ]
      });
    }),
  toggleGroupHidden: (id) =>
    set((state) =>
      serializeStateUpdate(state, {
        groups: state.groups.map((group) => (group.id === id ? { ...group, hidden: !group.hidden } : group))
      })
    ),
  toggleGroupLocked: (id) =>
    set((state) =>
      serializeStateUpdate(state, {
        groups: state.groups.map((group) => (group.id === id ? { ...group, locked: !group.locked } : group))
      })
    ),
  setActiveTool: (activeTool) => set({ activeTool }),
  createMeasurement: () =>
    set((state) => {
      const previousId = state.selectionHistory.find((id) => id !== state.selectedId) ?? null;
      const measurement = createMeasurementForSelection(state.objects, state.selectedId, previousId, state.measurements.length);
      if (!measurement) return state;
      return serializeStateUpdate(state, {
        activeTool: "measure",
        measurements: [measurement, ...state.measurements].slice(0, 12)
      });
    }),
  setAnnotationDraft: (annotationDraft) => set({ annotationDraft }),
  createAnnotation: () =>
    set((state) => {
      const annotation = createAnnotationForSelection(state.objects, state.selectedId, state.annotationDraft, state.annotations.length);
      if (!annotation) return state;
      return serializeStateUpdate(state, {
        activeTool: "annotate",
        annotations: [annotation, ...state.annotations].slice(0, 12),
        annotationDraft: ""
      });
    }),
  setMaterial: (id) =>
    set((state) => {
      if (!state.selectedId || isLocked(state, state.selectedId)) return state;
      return serializeStateUpdate(state, {
        objects: state.objects.map((object) => (object.id === state.selectedId ? { ...object, materialId: id } : object))
      });
    }),
  nudgeSelected: (delta) =>
    set((state) => {
      if (!state.selectedId || isLocked(state, state.selectedId)) return state;
      const objects = state.objects.map((object) =>
        object.id === state.selectedId
          ? {
              ...object,
              position: [
                object.position[0] + delta[0],
                object.position[1] + delta[1],
                object.position[2] + delta[2]
              ] as Vec3
            }
          : object
      );
      return serializeStateUpdate(state, { objects });
    }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  loadTemplate: (id) =>
    set((state) => {
      const template = buildTemplateRuntime(id);
      const nextLayers = state.layers.map((layer) => ({ ...layer, visible: true, locked: false }));
      return serializeStateUpdate(state, {
        objects: template.sceneObjects,
        layers: nextLayers,
        selectedId: template.sceneObjects[0]?.id ?? null,
        selectionHistory: template.sceneObjects[0]?.id ? [template.sceneObjects[0].id] : [],
        hiddenObjectIds: [],
        lockedObjectIds: [],
        groups: [],
        measurements: [],
        annotations: [],
        sceneValidation: {
          status: "READY",
          message: `${template.label} template loaded with validated scene objects.`,
          errors: [],
          warnings: [],
          objectCount: template.sceneObjects.length,
          layerCount: nextLayers.length
        }
      });
    }),
  saveScene: () => {
    const json = serializeScene(get());
    const validation = validateSceneJson(json);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("tlp-wedding-cad-scene", json);
    }
    set({ sceneJson: json, sceneValidation: validation });
  },
  loadScene: (json) => {
    const validation = validateSceneJson(json);
    if (validation.status === "BLOCKED") {
      set({ sceneValidation: validation });
      return;
    }
    const parsed = JSON.parse(json) as Partial<CadState> & { objects?: CadObjectFrame[]; layers?: LayerFrame[] };
    const objects = parsed.objects ?? get().objects;
    set((state) => serializeStateUpdate(state, {
      objects,
      layers: parsed.layers ?? get().layers,
      selectedId: objects[0]?.id ?? null,
      selectionHistory: objects[0]?.id ? [objects[0].id] : [],
      hiddenObjectIds: parsed.hiddenObjectIds ?? [],
      lockedObjectIds: parsed.lockedObjectIds ?? [],
      groups: parsed.groups ?? [],
      sceneValidation: validation
    }));
  },
  setSceneJson: (sceneJson) => set({ sceneJson }),
  validateSceneJsonDraft: () => set((state) => ({ sceneValidation: validateSceneJson(state.sceneJson) })),
  resetScene: () =>
    set((state) => serializeStateUpdate(state, {
      objects: initialCadScene.objects,
      layers: initialCadScene.layers,
      selectedId: initialCadScene.objects[0]?.id ?? null,
      selectionHistory: initialCadScene.objects[0]?.id ? [initialCadScene.objects[0].id] : [],
      hiddenObjectIds: [],
      lockedObjectIds: [],
      groups: [],
      activeTool: "select",
      measurements: [],
      annotations: [],
      annotationDraft: "Review placement and clearance before final board export.",
      sceneValidation: {
        ...defaultSceneValidation,
        objectCount: initialCadScene.objects.length,
        layerCount: initialCadScene.layers.length
      },
      cameraMode: "perspective",
      searchQuery: ""
    }))
}));

function toggleId(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

function isLocked(state: CadState, objectId: string) {
  const object = state.objects.find((item) => item.id === objectId);
  const layerLocked = object ? state.layers.find((layer) => layer.id === object.layerId)?.locked : false;
  const groupLocked = state.groups.some((group) => group.locked && group.objectIds.includes(objectId));
  return state.lockedObjectIds.includes(objectId) || Boolean(layerLocked) || groupLocked;
}

function serializeStateUpdate(state: CadState, patch: Partial<CadState>) {
  const next = { ...state, ...patch };
  return {
    ...patch,
    sceneJson: serializeScene(next)
  };
}

function serializeScene(state: Pick<CadState, "objects" | "layers" | "groups" | "hiddenObjectIds" | "lockedObjectIds" | "measurements" | "annotations">) {
  return JSON.stringify(
    {
      ...initialCadScene,
      objects: state.objects,
      layers: state.layers,
      groups: state.groups,
      hiddenObjectIds: state.hiddenObjectIds,
      lockedObjectIds: state.lockedObjectIds,
      measurements: state.measurements,
      annotations: state.annotations
    },
    null,
    2
  );
}
