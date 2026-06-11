import { beforeEach, describe, expect, it } from "vitest";
import { useCadStore } from "@/components/cad/cad-store";
import { initialCadScene } from "@/lib/cad-runtime";
import { weddingAssets } from "@/lib/wedding-asset-library";
import type { Vec3 } from "@/lib/data-frames";

const store = () => useCadStore.getState();
const parseScene = () => JSON.parse(store().sceneJson) as { objects: unknown[]; layers: unknown[] };

// The store is a module-level singleton; reset to a known baseline before each test.
beforeEach(() => {
  store().resetScene();
});

describe("cad-store: initial state", () => {
  it("seeds objects, layers and selection from the initial scene", () => {
    const s = store();
    expect(s.objects).toHaveLength(initialCadScene.objects.length);
    expect(s.layers).toHaveLength(initialCadScene.layers.length);
    expect(s.selectedId).toBe(initialCadScene.objects[0]?.id ?? null);
  });

  it("keeps sceneJson in sync with state", () => {
    const scene = parseScene();
    expect(Array.isArray(scene.objects)).toBe(true);
    expect(scene.objects).toHaveLength(store().objects.length);
    expect(scene.layers).toHaveLength(store().layers.length);
  });
});

describe("cad-store: selection history", () => {
  it("records the most recent selection first and de-duplicates", () => {
    const [a, b] = store().objects;
    store().selectObject(a.id);
    store().selectObject(b.id);
    store().selectObject(a.id);
    const history = store().selectionHistory;
    expect(history[0]).toBe(a.id);
    expect(history.filter((id) => id === a.id)).toHaveLength(1);
  });

  it("caps selection history at 8 entries", () => {
    // Add plenty of objects so we have >8 distinct ids to select.
    for (let i = 0; i < 12; i += 1) store().addObject("chair");
    store().objects.forEach((object) => store().selectObject(object.id));
    expect(store().selectionHistory.length).toBeLessThanOrEqual(8);
  });

  it("clears selection state when null is passed", () => {
    store().selectObject(null);
    expect(store().selectedId).toBeNull();
  });
});

describe("cad-store: object creation", () => {
  it("addObject appends, selects the new object, and updates sceneJson", () => {
    const before = store().objects.length;
    store().addObject("pillar", "Test Pillar");
    const after = store().objects;
    expect(after).toHaveLength(before + 1);
    expect(after[after.length - 1].label).toBe("Test Pillar");
    expect(store().selectedId).toBe(after[after.length - 1].id);
    expect(parseScene().objects).toHaveLength(before + 1);
  });
});

describe("cad-store: wedding asset insertion", () => {
  it("ignores BLOCKED assets", () => {
    const blocked = weddingAssets.find((asset) => asset.status === "BLOCKED");
    expect(blocked, "expected at least one BLOCKED asset fixture").toBeDefined();
    const before = store().objects.length;
    store().insertWeddingAsset(blocked!.id);
    expect(store().objects).toHaveLength(before);
  });

  it("inserts PARTIAL assets and flags scene validation as PARTIAL", () => {
    const partial = weddingAssets.find((asset) => asset.status === "PARTIAL");
    expect(partial, "expected at least one PARTIAL asset fixture").toBeDefined();
    const before = store().objects.length;
    store().insertWeddingAsset(partial!.id);
    expect(store().objects).toHaveLength(before + 1);
    expect(store().sceneValidation.status).toBe("PARTIAL");
    expect(store().sceneValidation.warnings.length).toBeGreaterThan(0);
  });

  it("inserts READY assets as new objects", () => {
    const ready = weddingAssets.find((asset) => asset.status === "READY");
    expect(ready, "expected at least one READY asset fixture").toBeDefined();
    const before = store().objects.length;
    store().insertWeddingAsset(ready!.id);
    expect(store().objects).toHaveLength(before + 1);
  });

  it("does nothing for an unknown asset id", () => {
    const before = store().objects.length;
    store().insertWeddingAsset("does-not-exist");
    expect(store().objects).toHaveLength(before);
  });
});

describe("cad-store: visibility and locking", () => {
  it("toggleObjectHidden deselects the object when it was selected", () => {
    const target = store().objects[0];
    store().selectObject(target.id);
    store().toggleObjectHidden(target.id);
    expect(store().hiddenObjectIds).toContain(target.id);
    expect(store().selectedId).toBeNull();
  });

  it("blocks material changes on a locked object", () => {
    const target = store().objects.find((o) => o.materialId !== "brass") ?? store().objects[0];
    const original = target.materialId;
    store().selectObject(target.id);
    store().toggleObjectLocked(target.id);
    store().setMaterial("brass");
    const after = store().objects.find((o) => o.id === target.id)!;
    expect(after.materialId).toBe(original);
  });

  it("blocks nudging a locked object but moves an unlocked one", () => {
    const target = store().objects[0];
    const delta: Vec3 = [1, 0, 2];
    const start = [...target.position] as Vec3;

    store().selectObject(target.id);
    store().toggleObjectLocked(target.id);
    store().nudgeSelected(delta);
    expect(store().objects.find((o) => o.id === target.id)!.position).toEqual(start);

    // Unlock and nudge again.
    store().toggleObjectLocked(target.id);
    store().nudgeSelected(delta);
    expect(store().objects.find((o) => o.id === target.id)!.position).toEqual([
      start[0] + delta[0],
      start[1] + delta[1],
      start[2] + delta[2]
    ]);
  });
});

describe("cad-store: grouping", () => {
  it("createLayerGroup groups every object on that layer", () => {
    const layerId = store().objects[0].layerId;
    const expected = store().objects.filter((o) => o.layerId === layerId).map((o) => o.id);
    store().createLayerGroup(layerId);
    const group = store().groups.at(-1)!;
    expect(group.objectIds).toEqual(expected);
    expect(group.objectIds.length).toBeGreaterThan(0);
  });

  it("createSelectionGroup groups same-layer objects of the selection", () => {
    const target = store().objects[0];
    store().selectObject(target.id);
    store().createSelectionGroup();
    const group = store().groups.at(-1)!;
    expect(group.objectIds).toContain(target.id);
    group.objectIds.forEach((id) => {
      const obj = store().objects.find((o) => o.id === id)!;
      expect(obj.layerId).toBe(target.layerId);
    });
  });

  it("a locked group blocks edits on its members", () => {
    const layerId = store().objects[0].layerId;
    store().createLayerGroup(layerId);
    const group = store().groups.at(-1)!;
    store().toggleGroupLocked(group.id);

    const member = store().objects.find((o) => group.objectIds.includes(o.id))!;
    const original = [...member.position] as Vec3;
    store().selectObject(member.id);
    store().nudgeSelected([5, 5, 5]);
    expect(store().objects.find((o) => o.id === member.id)!.position).toEqual(original);
  });
});

describe("cad-store: templates", () => {
  it("loadTemplate replaces the scene and marks validation READY", () => {
    store().loadTemplate("royal-palace-wedding");
    const s = store();
    expect(s.objects.length).toBeGreaterThan(0);
    expect(s.selectedId).toBe(s.objects[0].id);
    expect(s.sceneValidation.status).toBe("READY");
    expect(s.groups).toHaveLength(0);
    expect(s.layers.every((layer) => layer.visible && !layer.locked)).toBe(true);
  });
});

describe("cad-store: save / load round-trip", () => {
  it("loadScene restores the exact scene produced by saveScene", () => {
    store().addObject("table", "Roundtrip Table");
    store().saveScene();
    const saved = store().sceneJson;
    const savedCount = store().objects.length;

    // Mutate after saving.
    store().addObject("chair");
    expect(store().objects.length).toBe(savedCount + 1);

    store().loadScene(saved);
    expect(store().objects).toHaveLength(savedCount);
    expect(store().objects.some((o) => o.label === "Roundtrip Table")).toBe(true);
  });

  it("rejects invalid JSON without mutating the scene", () => {
    const before = store().objects.length;
    store().loadScene("{ not valid json ]");
    expect(store().sceneValidation.status).toBe("BLOCKED");
    expect(store().objects).toHaveLength(before);
  });

  it("rejects structurally invalid scenes (missing arrays)", () => {
    const before = store().objects.length;
    store().loadScene(JSON.stringify({ foo: "bar" }));
    expect(store().sceneValidation.status).toBe("BLOCKED");
    expect(store().objects).toHaveLength(before);
  });
});

describe("cad-store: reset", () => {
  it("resetScene restores the initial object count and selection", () => {
    store().addObject("gate");
    store().addObject("tree");
    store().resetScene();
    expect(store().objects).toHaveLength(initialCadScene.objects.length);
    expect(store().selectedId).toBe(initialCadScene.objects[0]?.id ?? null);
    expect(store().groups).toHaveLength(0);
    expect(store().measurements).toHaveLength(0);
  });
});
