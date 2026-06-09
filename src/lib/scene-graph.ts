import type { CadObjectFrame, LayerFrame } from "./data-frames";

export type SceneBranchId = "venue" | "mandap" | "stage" | "seating" | "lighting" | "decor";

export type ObjectGroupFrame = {
  id: string;
  label: string;
  objectIds: string[];
  hidden: boolean;
  locked: boolean;
};

export type SceneGraphNode = {
  id: string;
  label: string;
  type: "root" | "branch" | "layer" | "group" | "object";
  status: "READY" | "HIDDEN" | "LOCKED";
  objectIds: string[];
  children: SceneGraphNode[];
};

const branchLabels: Record<SceneBranchId, string> = {
  venue: "Venue",
  mandap: "Mandap",
  stage: "Stage",
  seating: "Seating",
  lighting: "Lighting",
  decor: "Decor"
};

export const sceneBranches: SceneBranchId[] = ["venue", "mandap", "stage", "seating", "lighting", "decor"];

export function getSceneBranch(object: CadObjectFrame): SceneBranchId {
  if (object.layerId === "mandap" || object.kind === "mandap" || object.kind === "pillar") return "mandap";
  if (object.kind === "stage" || object.kind === "led-wall") return "stage";
  if (object.layerId === "seating" || ["chair", "sofa", "table"].includes(object.kind)) return "seating";
  if (object.layerId === "lighting" || ["chandelier", "truss"].includes(object.kind)) return "lighting";
  if (object.layerId === "decor" || ["arch", "floral-garland", "kalash", "diya"].includes(object.kind)) return "decor";
  return "venue";
}

export function buildSceneHierarchy({
  objects,
  layers,
  groups,
  hiddenObjectIds,
  lockedObjectIds
}: {
  objects: CadObjectFrame[];
  layers: LayerFrame[];
  groups: ObjectGroupFrame[];
  hiddenObjectIds: string[];
  lockedObjectIds: string[];
}): SceneGraphNode {
  const hiddenSet = new Set(hiddenObjectIds);
  const lockedSet = new Set(lockedObjectIds);
  const groupedIds = new Set(groups.flatMap((group) => group.objectIds));

  return {
    id: "scene",
    label: "Scene Hierarchy",
    type: "root",
    status: "READY",
    objectIds: objects.map((object) => object.id),
    children: sceneBranches.map((branch) => {
      const branchObjects = objects.filter((object) => getSceneBranch(object) === branch);
      const branchLayerIds = new Set(branchObjects.map((object) => object.layerId));
      const layerNodes = layers
        .filter((layer) => branchLayerIds.has(layer.id))
        .map((layer) => {
          const layerObjects = branchObjects.filter((object) => object.layerId === layer.id && !groupedIds.has(object.id));
          return {
            id: `layer-${branch}-${layer.id}`,
            label: layer.label,
            type: "layer" as const,
            status: layer.visible ? layer.locked ? "LOCKED" as const : "READY" as const : "HIDDEN" as const,
            objectIds: layerObjects.map((object) => object.id),
            children: layerObjects.map((object) => objectNode(object, hiddenSet, lockedSet))
          };
        });
      const groupNodes = groups
        .filter((group) => group.objectIds.some((id) => branchObjects.some((object) => object.id === id)))
        .map((group) => ({
          id: group.id,
          label: group.label,
          type: "group" as const,
          status: group.hidden ? "HIDDEN" as const : group.locked ? "LOCKED" as const : "READY" as const,
          objectIds: group.objectIds,
          children: branchObjects
            .filter((object) => group.objectIds.includes(object.id))
            .map((object) => objectNode(object, hiddenSet, lockedSet))
        }));

      return {
        id: branch,
        label: branchLabels[branch],
        type: "branch" as const,
        status: "READY" as const,
        objectIds: branchObjects.map((object) => object.id),
        children: [...groupNodes, ...layerNodes]
      };
    })
  };
}

export function flattenSceneGraph(node: SceneGraphNode): SceneGraphNode[] {
  return [node, ...node.children.flatMap((child) => flattenSceneGraph(child))];
}

export function searchSceneGraph(root: SceneGraphNode, query: string): SceneGraphNode[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return flattenSceneGraph(root).filter((node) => node.label.toLowerCase().includes(normalized) || node.id.toLowerCase().includes(normalized));
}

export function sceneGraphSummary(root: SceneGraphNode) {
  const nodes = flattenSceneGraph(root);
  return {
    nodeCount: nodes.length,
    objectCount: root.objectIds.length,
    hiddenCount: nodes.filter((node) => node.status === "HIDDEN").length,
    lockedCount: nodes.filter((node) => node.status === "LOCKED").length,
    branchCount: sceneBranches.length
  };
}

function objectNode(object: CadObjectFrame, hiddenSet: Set<string>, lockedSet: Set<string>): SceneGraphNode {
  return {
    id: object.id,
    label: object.label,
    type: "object",
    status: hiddenSet.has(object.id) ? "HIDDEN" : lockedSet.has(object.id) ? "LOCKED" : "READY",
    objectIds: [object.id],
    children: []
  };
}
