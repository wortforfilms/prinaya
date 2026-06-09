"use client";

import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, OrthographicCamera, PerspectiveCamera, TransformControls } from "@react-three/drei";
import {
  Boxes,
  Camera,
  ClipboardCheck,
  Download,
  Eye,
  EyeOff,
  FileText,
  Layers3,
  Lock,
  MessageSquareText,
  Move3D,
  Ruler,
  RotateCcw,
  Save,
  Search,
  Unlock,
  Upload,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import { Color } from "three";
import { starterAssetDefinitions, type CameraMode } from "@/lib/cad-runtime";
import { cadEditorToolChecklist, type CadToolMode } from "@/lib/cad-editor-tools";
import { materialPalette, type CadObjectFrame, type LayerFrame } from "@/lib/data-frames";
import { createPreviewDxfExport, createPrintableBoardHtmlExport, createSceneJsonExport, type ExportArtifact } from "@/lib/export-runtime";
import { buildSceneHierarchy, sceneGraphSummary, searchSceneGraph, type ObjectGroupFrame } from "@/lib/scene-graph";
import { templateRuntimeCatalog, type TemplateRuntimeId } from "@/lib/template-runtime";
import { blockedCapabilities } from "@/lib/status";
import { StatusBadge } from "@/components/layout/StatusBadge";
import { getAssetCategoryOptions } from "@/lib/asset-preview-runtime";
import { getHeroBannerBySlug } from "@/lib/hero-banner-registry";
import { searchWeddingAssets, weddingAssetSummary } from "@/lib/wedding-asset-library";
import { useCadStore } from "./cad-store";

const cameraPositions: Record<CameraMode, [number, number, number]> = {
  perspective: [28, 22, 28],
  top: [0, 60, 0],
  front: [0, 14, 48],
  side: [48, 14, 0]
};
const cadHero = getHeroBannerBySlug("cad-editor");

export function CadEditor() {
  const [assetCategoryFilter, setAssetCategoryFilter] = useState("All");
  const {
    objects,
    layers,
    selectedId,
    selectionHistory,
    hiddenObjectIds,
    lockedObjectIds,
    groups,
    activeTool,
    measurements,
    annotations,
    annotationDraft,
    sceneValidation,
    searchQuery,
    cameraMode,
    sceneJson,
    addObject,
    insertWeddingAsset,
    toggleLayer,
    toggleLayerLocked,
    toggleObjectHidden,
    toggleObjectLocked,
    createSelectionGroup,
    createLayerGroup,
    toggleGroupHidden,
    toggleGroupLocked,
    setActiveTool,
    createMeasurement,
    setAnnotationDraft,
    createAnnotation,
    selectObject,
    setSearchQuery,
    setCameraMode,
    loadTemplate,
    saveScene,
    loadScene,
    setSceneJson,
    validateSceneJsonDraft,
    resetScene,
    setMaterial,
    nudgeSelected
  } = useCadStore();
  const selected = objects.find((object) => object.id === selectedId) ?? null;
  const sceneGraph = useMemo(
    () => buildSceneHierarchy({ objects, layers, groups, hiddenObjectIds, lockedObjectIds }),
    [objects, layers, groups, hiddenObjectIds, lockedObjectIds]
  );
  const graphStats = useMemo(() => sceneGraphSummary(sceneGraph), [sceneGraph]);
  const searchMatches = useMemo(() => searchSceneGraph(sceneGraph, searchQuery), [sceneGraph, searchQuery]);
  const filteredObjects = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return objects;
    return objects.filter((object) =>
      [object.label, object.kind, object.layerId, object.materialId].some((value) => value.toLowerCase().includes(normalized))
    );
  }, [objects, searchQuery]);
  const assetMatches = useMemo(
    () =>
      searchWeddingAssets(searchQuery, 80)
        .filter((asset) => assetCategoryFilter === "All" || asset.category === assetCategoryFilter)
        .slice(0, 18),
    [assetCategoryFilter, searchQuery]
  );
  const assetCategoryOptions = useMemo(() => getAssetCategoryOptions(), []);
  const selectedLocked = selected ? isObjectLocked(selected.id, lockedObjectIds, groups, layers, objects) : false;
  const selectedHidden = selected ? isObjectHidden(selected.id, hiddenObjectIds, groups) : false;
  const selectedMaterial = selected ? materialPalette.find((material) => material.id === selected.materialId) : null;
  const visibleObjectCount = objects.filter((object) => {
    const layer = layers.find((item) => item.id === object.layerId);
    return Boolean(layer?.visible) && !isObjectHidden(object.id, hiddenObjectIds, groups);
  }).length;
  const previousSelection = selectionHistory.find((id) => id !== selectedId);
  const previousSelectionObject = objects.find((object) => object.id === previousSelection) ?? null;
  const toolModes: Array<{ id: CadToolMode; label: string; icon: typeof Move3D }> = [
    { id: "select", label: "Select", icon: Move3D },
    { id: "measure", label: "Measure", icon: Ruler },
    { id: "annotate", label: "Annotate", icon: MessageSquareText }
  ];

  return (
    <div className="bg-ivory">
      {cadHero ? (
        <section className="relative overflow-hidden border-b border-[#d9aa46]/20 bg-[#03110f] px-4 py-5 lg:px-6">
          <img src={cadHero.hiresImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-72" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,8,0.94),rgba(2,9,8,0.72)_46%,rgba(2,9,8,0.24))]" />
          <div className="relative flex min-h-[150px] flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f8d78b]">Generated Hero Banner</p>
              <h1 className="mt-2 font-serif text-3xl font-semibold text-white">CAD Editor</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/68">
                Scene hierarchy, GLB-backed preview assets, layers, tools, and export fixtures for Hemant Samwat Wedding.
              </p>
            </div>
            <div className="rounded-md border border-white/12 bg-black/36 px-4 py-3 text-xs font-semibold text-white/72 backdrop-blur">
              {weddingAssetSummary.total} registry assets
              <span className="block text-[#f8d78b]">{weddingAssetSummary.byCategory.length} categories</span>
            </div>
          </div>
        </section>
      ) : null}
      <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 bg-ivory lg:grid-cols-[380px_1fr_360px]">
      <aside className="max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-ink/10 bg-white p-4 lg:border-b-0 lg:border-r">
        <div className="rounded-md border border-ink/10 bg-ivory p-3">
          <div className="flex items-center gap-2">
            <Search aria-hidden className="h-4 w-4 text-basalt/60" />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-basalt/45"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search scene, layers, assets..."
            />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <MiniStat label="Nodes" value={graphStats.nodeCount} />
            <MiniStat label="Hidden" value={graphStats.hiddenCount} />
            <MiniStat label="Locked" value={graphStats.lockedCount} />
          </div>
        </div>

        <div className="mt-4 rounded-md border border-ink/10 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers3 aria-hidden className="h-4 w-4 text-basalt/60" />
              <h3 className="text-sm font-semibold text-ink">Scene Hierarchy</h3>
            </div>
            <StatusBadge status="READY" />
          </div>
          <div className="mt-3 space-y-2">
            {sceneGraph.children.map((branch) => (
              <div key={branch.id} className="rounded-md border border-ink/10 bg-ivory p-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink">{branch.label}</p>
                  <span className="text-xs text-basalt/60">{branch.objectIds.length}</span>
                </div>
                <div className="mt-2 space-y-1">
                  {branch.children.slice(0, 4).map((node) => (
                    <div key={node.id} className="flex items-center justify-between gap-2 rounded bg-white px-2 py-1 text-xs text-basalt">
                      <span className="truncate">{node.label}</span>
                      <span>{node.objectIds.length}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-basalt/55">Starter assets</p>
            <h2 className="text-lg font-semibold text-ink">Insert Objects</h2>
          </div>
          <StatusBadge status="READY" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {starterAssetDefinitions.map((asset) => (
            <button
              key={asset.kind}
              className="rounded-md border border-ink/10 bg-ivory px-3 py-2 text-left text-xs font-semibold text-basalt hover:bg-mist"
              onClick={() => addObject(asset.kind)}
              title={`Insert ${asset.label}`}
            >
              {asset.label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-md border border-ink/10 bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Boxes aria-hidden className="h-4 w-4 text-basalt/60" />
              <h3 className="text-sm font-semibold text-ink">Wedding Asset Library</h3>
            </div>
            <span className="text-xs font-semibold text-basalt/60">{weddingAssetSummary.total} assets</span>
          </div>
          <label className="mt-3 block">
            <span className="sr-only">CAD asset category filter</span>
            <select
              className="w-full rounded-md border border-ink/10 bg-ivory px-3 py-2 text-xs font-semibold text-ink"
              value={assetCategoryFilter}
              onChange={(event) => setAssetCategoryFilter(event.target.value)}
            >
              <option value="All">All registry categories</option>
              {assetCategoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {assetMatches.map((asset) => (
              <button
                key={asset.id}
                className="rounded-md border border-ink/10 bg-ivory px-3 py-2 text-left text-xs text-basalt hover:bg-mist disabled:cursor-not-allowed disabled:opacity-55"
                onClick={() => insertWeddingAsset(asset.id)}
                disabled={asset.status === "BLOCKED"}
                title={asset.status === "BLOCKED" ? `${asset.name} is BLOCKED and cannot be inserted` : `Insert ${asset.name} as local GLB-backed primitive placeholder`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink">{asset.name}</span>
                    <span className="mt-1 block truncate text-basalt/60">{asset.category} | {asset.subcategory}</span>
                  </span>
                  <StatusBadge status={asset.status} />
                </span>
                <span className="mt-2 block text-basalt/65">
                  {asset.dimensions.widthM} x {asset.dimensions.depthM} x {asset.dimensions.heightM}m
                </span>
                <span className="mt-1 flex flex-wrap gap-1">
                  {asset.materials.slice(0, 3).map((material) => (
                    <span key={`${asset.id}-${material}`} className="rounded-full bg-white px-2 py-0.5 text-[10px] text-basalt/70">{material}</span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ink">Layer Tree</h3>
            <span className="text-xs text-basalt/60">{layers.length} layers</span>
          </div>
          <div className="mt-3 space-y-2">
            {layers.map((layer) => (
              <div key={layer.id} className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm text-basalt">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: layer.color }} />
                  <span className="min-w-0 flex-1 truncate">{layer.label}</span>
                  <button onClick={() => createLayerGroup(layer.id)} title={`Group ${layer.label}`}>
                    <Users aria-hidden className="h-4 w-4" />
                  </button>
                  <button onClick={() => toggleLayerLocked(layer.id)} title={`${layer.locked ? "Unlock" : "Lock"} ${layer.label}`}>
                    {layer.locked ? <Lock aria-hidden className="h-4 w-4" /> : <Unlock aria-hidden className="h-4 w-4" />}
                  </button>
                  <button onClick={() => toggleLayer(layer.id)} title={`${layer.visible ? "Hide" : "Show"} ${layer.label}`}>
                    {layer.visible ? <Eye aria-hidden className="h-4 w-4" /> : <EyeOff aria-hidden className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ink">Object Tree</h3>
            <button className="text-xs font-semibold text-signal" onClick={createSelectionGroup}>Group selected</button>
          </div>
          <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1 studio-scrollbar">
            {filteredObjects.map((object) => {
              const hidden = isObjectHidden(object.id, hiddenObjectIds, groups);
              const locked = isObjectLocked(object.id, lockedObjectIds, groups, layers, objects);
              return (
                <div key={object.id} className={`rounded-md border px-3 py-2 text-sm ${selectedId === object.id ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-basalt"}`}>
                  <div className="flex items-center gap-2">
                    <button className="min-w-0 flex-1 truncate text-left font-medium" onClick={() => selectObject(object.id)}>
                      {object.label}
                    </button>
                    <button onClick={() => toggleObjectLocked(object.id)} title={`${locked ? "Unlock" : "Lock"} ${object.label}`}>
                      {locked ? <Lock aria-hidden className="h-4 w-4" /> : <Unlock aria-hidden className="h-4 w-4" />}
                    </button>
                    <button onClick={() => toggleObjectHidden(object.id)} title={`${hidden ? "Show" : "Hide"} ${object.label}`}>
                      {hidden ? <EyeOff aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs opacity-70">{object.kind} | {object.layerId}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-md border border-ink/10 bg-white p-3">
          <h3 className="text-sm font-semibold text-ink">Groups</h3>
          <div className="mt-3 space-y-2">
            {groups.length === 0 ? <p className="text-xs text-basalt/60">No groups yet.</p> : null}
            {groups.map((group) => (
              <div key={group.id} className="flex items-center gap-2 rounded-md border border-ink/10 bg-ivory px-3 py-2 text-sm">
                <span className="min-w-0 flex-1 truncate font-medium text-ink">{group.label}</span>
                <span className="text-xs text-basalt/60">{group.objectIds.length}</span>
                <button onClick={() => toggleGroupLocked(group.id)}>{group.locked ? <Lock aria-hidden className="h-4 w-4" /> : <Unlock aria-hidden className="h-4 w-4" />}</button>
                <button onClick={() => toggleGroupHidden(group.id)}>{group.hidden ? <EyeOff aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-md border border-ink/10 bg-white p-3">
          <h3 className="text-sm font-semibold text-ink">Template Runtime</h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {templateRuntimeCatalog.map((template) => (
              <button
                key={template.id}
                className="rounded-md border border-ink/10 bg-ivory px-3 py-2 text-left text-xs font-semibold text-basalt hover:bg-mist"
                onClick={() => loadTemplate(template.id as TemplateRuntimeId)}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        {searchQuery.trim() ? (
          <div className="mt-6 rounded-md border border-signal/50 bg-signal/20 p-3">
            <h3 className="text-sm font-semibold text-ink">Selection Search</h3>
            <p className="mt-1 text-xs text-basalt">{searchMatches.length} graph matches for "{searchQuery}"</p>
          </div>
        ) : null}
      </aside>

      <section className="flex min-h-[720px] flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-white px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {(["perspective", "top", "front", "side"] as CameraMode[]).map((mode) => (
              <button
                key={mode}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
                  cameraMode === mode ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-ink"
                }`}
                onClick={() => setCameraMode(mode)}
              >
                <Camera aria-hidden className="h-4 w-4" />
                {mode}
              </button>
            ))}
            <span className="mx-1 hidden h-8 w-px bg-ink/10 sm:block" />
            {toolModes.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${
                    activeTool === tool.id ? "border-neem bg-neem text-white" : "border-ink/10 bg-white text-ink"
                  }`}
                  onClick={() => setActiveTool(tool.id)}
                >
                  <Icon aria-hidden className="h-4 w-4" />
                  {tool.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink" onClick={saveScene}>
              <Save aria-hidden className="h-4 w-4" />
              Save scene JSON
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink"
              onClick={() => downloadArtifact(createSceneJsonExport(objects))}
            >
              <Download aria-hidden className="h-4 w-4" />
              Download JSON
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink"
              onClick={() => downloadArtifact(createPreviewDxfExport(objects, layers))}
            >
              <Download aria-hidden className="h-4 w-4" />
              Preview DXF
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink"
              onClick={() => downloadArtifact(createPrintableBoardHtmlExport())}
            >
              <FileText aria-hidden className="h-4 w-4" />
              Printable board
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink" onClick={resetScene}>
              <RotateCcw aria-hidden className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="relative flex-1 bg-[#dfe7e3]">
          <Canvas shadows dpr={[1, 1.75]}>
            <color attach="background" args={["#dfe7e3"]} />
            <ambientLight intensity={0.55} />
            <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
            {cameraMode === "perspective" ? (
              <PerspectiveCamera makeDefault position={cameraPositions.perspective} fov={45} />
            ) : (
              <OrthographicCamera makeDefault position={cameraPositions[cameraMode]} zoom={18} />
            )}
            <Grid args={[80, 80]} cellSize={2} cellThickness={0.7} cellColor="#9aa9a2" sectionSize={8} sectionThickness={1.2} sectionColor="#62736b" fadeDistance={90} fadeStrength={1} />
            {objects.map((object) => {
              const layer = layers.find((item) => item.id === object.layerId);
              const hidden = isObjectHidden(object.id, hiddenObjectIds, groups);
              const locked = isObjectLocked(object.id, lockedObjectIds, groups, layers, objects);
              if (!layer?.visible || hidden) return null;
              const mesh = <PrimitiveObject key={object.id} object={object} selected={object.id === selectedId} onSelect={() => selectObject(object.id)} />;
              if (object.id === selectedId && !locked) {
                return (
                  <TransformControls key={object.id} mode="translate" size={0.75}>
                    {mesh}
                  </TransformControls>
                );
              }
              return mesh;
            })}
            <OrbitControls makeDefault enabled={cameraMode === "perspective"} />
          </Canvas>
          <div className="absolute bottom-4 left-4 rounded-md border border-ink/10 bg-white/90 p-3 text-sm text-basalt shadow-sm backdrop-blur">
            <p className="font-semibold text-ink">CAD runtime status</p>
            <p>Scene hierarchy, layer tree, object inspector, material inspector, assets, measurement, annotation, templates, stats, and validation.</p>
          </div>
        </div>
      </section>

      <aside className="border-t border-ink/10 bg-white p-4 lg:border-l lg:border-t-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-basalt/55">Object Inspector</p>
            <h2 className="text-lg font-semibold text-ink">{selected?.label ?? "No selection"}</h2>
          </div>
          <Move3D aria-hidden className="h-5 w-5 text-basalt/60" />
        </div>

        {selected ? (
          <div className="mt-4 space-y-4">
            <InspectorField label="Kind" value={selected.kind} />
            <InspectorField label="Layer" value={selected.layerId} />
            <InspectorField label="Position" value={selected.position.map((value) => value.toFixed(1)).join(", ")} />
            <InspectorField label="Scale" value={selected.scale.join(", ")} />
            <InspectorField label="Visibility" value={selectedHidden ? "Hidden" : "Visible"} />
            <InspectorField label="Lock" value={selectedLocked ? "Locked" : "Editable"} />
            <label className="block rounded-md border border-ink/10 bg-ivory p-3">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-basalt/55">Material Inspector</span>
              <select
                className="mt-2 w-full rounded-md border border-ink/10 bg-white px-3 py-2 text-sm text-ink"
                value={selected.materialId}
                onChange={(event) => setMaterial(event.target.value)}
              >
                {materialPalette.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.label}
                  </option>
                ))}
              </select>
              {selectedMaterial ? (
                <div className="mt-3 flex items-center gap-3 rounded-md bg-white p-2">
                  <span className="h-8 w-8 rounded border border-ink/10" style={{ backgroundColor: selectedMaterial.color }} />
                  <div>
                    <p className="text-sm font-semibold text-ink">{selectedMaterial.label}</p>
                    <p className="text-xs text-basalt/60">{selectedMaterial.finish} | {selectedMaterial.usage}</p>
                  </div>
                </div>
              ) : null}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button className="rounded-md border border-ink/10 px-2 py-2 text-xs font-semibold" onClick={() => nudgeSelected([-0.5, 0, 0])}>X-</button>
              <button className="rounded-md border border-ink/10 px-2 py-2 text-xs font-semibold" onClick={() => nudgeSelected([0, 0, -0.5])}>Z-</button>
              <button className="rounded-md border border-ink/10 px-2 py-2 text-xs font-semibold" onClick={() => nudgeSelected([0, 0.5, 0])}>Y+</button>
              <button className="rounded-md border border-ink/10 px-2 py-2 text-xs font-semibold" onClick={() => nudgeSelected([0.5, 0, 0])}>X+</button>
              <button className="rounded-md border border-ink/10 px-2 py-2 text-xs font-semibold" onClick={() => nudgeSelected([0, 0, 0.5])}>Z+</button>
              <button className="rounded-md border border-ink/10 px-2 py-2 text-xs font-semibold" onClick={() => nudgeSelected([0, -0.5, 0])}>Y-</button>
            </div>
            {selectedLocked ? <p className="rounded-md border border-marigold/40 bg-marigold/10 p-3 text-xs leading-5 text-copper">Locked objects can be selected but not transformed or rematerialized.</p> : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-basalt/70">Select an object in the scene to inspect it.</p>
        )}

        <div className="mt-6 rounded-md border border-ink/10 bg-ivory p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Ruler aria-hidden className="h-4 w-4 text-basalt/60" />
              <h3 className="text-sm font-semibold text-ink">Measurement Tool</h3>
            </div>
            <StatusBadge status="READY" />
          </div>
          <p className="mt-2 text-xs leading-5 text-basalt/70">
            Select two objects in sequence, then measure the current selection against the previous selection.
          </p>
          <button
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-basalt/40"
            onClick={createMeasurement}
            disabled={!selected || !previousSelectionObject}
          >
            <Ruler aria-hidden className="h-4 w-4" />
            Measure selected pair
          </button>
          <div className="mt-3 space-y-2">
            {measurements.length === 0 ? (
              <p className="text-xs text-basalt/60">No measurements yet.</p>
            ) : measurements.map((measurement) => (
              <div key={measurement.id} className="rounded-md bg-white px-3 py-2 text-xs text-basalt">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-ink">{measurement.label}</span>
                  <span>{measurement.distanceM}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-md border border-ink/10 bg-ivory p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageSquareText aria-hidden className="h-4 w-4 text-basalt/60" />
              <h3 className="text-sm font-semibold text-ink">Annotation Tool</h3>
            </div>
            <StatusBadge status="READY" />
          </div>
          <textarea
            className="mt-3 h-20 w-full rounded-md border border-ink/10 bg-white p-2 text-xs text-basalt"
            value={annotationDraft}
            onChange={(event) => setAnnotationDraft(event.target.value)}
            placeholder="Add note for selected object..."
          />
          <button
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-basalt/40"
            onClick={createAnnotation}
            disabled={!selected || !annotationDraft.trim()}
          >
            <MessageSquareText aria-hidden className="h-4 w-4" />
            Add annotation
          </button>
          <div className="mt-3 space-y-2">
            {annotations.length === 0 ? (
              <p className="text-xs text-basalt/60">No annotations yet.</p>
            ) : annotations.map((annotation) => (
              <div key={annotation.id} className="rounded-md bg-white px-3 py-2 text-xs text-basalt">
                <p className="font-semibold text-ink">{annotation.label}</p>
                <p className="mt-1 leading-5">{annotation.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-md border border-ink/10 bg-ivory p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck aria-hidden className="h-4 w-4 text-basalt/60" />
              <h3 className="text-sm font-semibold text-ink">Scene Statistics</h3>
            </div>
            <StatusBadge status="READY" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <MiniStat label="Objects" value={objects.length} />
            <MiniStat label="Visible" value={visibleObjectCount} />
            <MiniStat label="Layers" value={layers.length} />
            <MiniStat label="Tools" value={cadEditorToolChecklist.length} />
          </div>
        </div>

        <div className="mt-6 rounded-md border border-ink/10 bg-ivory p-3">
          <h3 className="text-sm font-semibold text-ink">Selection Manager</h3>
          <div className="mt-3 space-y-2">
            {selectionHistory.length === 0 ? <p className="text-xs text-basalt/60">No selection history yet.</p> : null}
            {selectionHistory.map((id) => {
              const object = objects.find((item) => item.id === id);
              if (!object) return null;
              return (
                <button
                  key={id}
                  className="block w-full truncate rounded-md bg-white px-3 py-2 text-left text-xs font-medium text-basalt"
                  onClick={() => selectObject(id)}
                >
                  {object.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ink">Save/load validation</h3>
            <StatusBadge status={sceneValidation.status} />
          </div>
          <p className="mt-1 text-xs leading-5 text-basalt/70">{sceneValidation.message}</p>
          {sceneValidation.errors.length || sceneValidation.warnings.length ? (
            <div className="mt-2 rounded-md border border-ink/10 bg-ivory p-2 text-xs leading-5 text-basalt">
              {sceneValidation.errors.map((error) => <p key={error}>Error: {error}</p>)}
              {sceneValidation.warnings.map((warning) => <p key={warning}>Warning: {warning}</p>)}
            </div>
          ) : null}
          <textarea
            className="mt-2 h-56 w-full rounded-md border border-ink/10 bg-ivory p-3 font-mono text-xs text-basalt"
            value={sceneJson}
            onChange={(event) => setSceneJson(event.target.value)}
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink"
              onClick={validateSceneJsonDraft}
            >
              <ClipboardCheck aria-hidden className="h-4 w-4" />
              Validate JSON
            </button>
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white"
              onClick={() => loadScene(sceneJson)}
            >
              <Upload aria-hidden className="h-4 w-4" />
              Load JSON
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-md border border-lotus/20 bg-lotus/10 p-3">
          <p className="text-sm font-semibold text-lotus">Blocked production capabilities</p>
          <ul className="mt-2 space-y-1 text-xs leading-5 text-basalt">
            {blockedCapabilities.slice(0, 4).map((capability) => (
              <li key={capability.id}>{capability.label}: {capability.status}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
    </div>
  );
}

function PrimitiveObject({ object, selected, onSelect }: { object: CadObjectFrame; selected: boolean; onSelect: () => void }) {
  const material = materialPalette.find((item) => item.id === object.materialId);
  const color = useMemo(() => new Color(material?.color ?? "#b88945"), [material?.color]);
  const emissive = object.kind === "led-wall" || object.kind === "drone-path-marker" ? "#176f8f" : "#000000";
  const common = {
    position: object.position,
    rotation: object.rotation,
    scale: object.scale,
    onPointerDown: (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      onSelect();
    }
  };
  const mat = <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissive === "#000000" ? 0 : 0.35} metalness={object.materialId === "brass" ? 0.6 : 0.1} roughness={0.45} />;

  if (object.kind === "pillar" || object.kind === "kalash" || object.kind === "diya" || object.kind === "chandelier" || object.kind === "tree" || object.kind === "drone-path-marker") {
    return (
      <mesh {...common} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, object.kind === "kalash" ? 0.35 : 0.5, 1, 32]} />
        {mat}
        {selected && <SelectionHalo />}
      </mesh>
    );
  }

  if (object.kind === "floral-garland" || object.kind === "water-pool") {
    return (
      <mesh {...common} castShadow receiveShadow>
        <torusGeometry args={[1, 0.12, 16, 64]} />
        {mat}
        {selected && <SelectionHalo />}
      </mesh>
    );
  }

  if (object.kind === "arch" || object.kind === "gate") {
    return (
      <group {...common}>
        <mesh position={[-0.45, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.18, 1, 0.18]} />
          {mat}
        </mesh>
        <mesh position={[0.45, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.18, 1, 0.18]} />
          {mat}
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.18, 0.18]} />
          {mat}
        </mesh>
        {selected && <SelectionHalo />}
      </group>
    );
  }

  return (
    <mesh {...common} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      {mat}
      {selected && <SelectionHalo />}
    </mesh>
  );
}

function SelectionHalo() {
  return (
    <mesh>
      <boxGeometry args={[1.08, 1.08, 1.08]} />
      <meshBasicMaterial color="#172126" wireframe transparent opacity={0.7} />
    </mesh>
  );
}

function InspectorField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink/10 bg-ivory p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-basalt/55">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-ink/10 bg-white px-2 py-2">
      <p className="text-sm font-bold text-ink">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase text-basalt/55">{label}</p>
    </div>
  );
}

function isObjectHidden(objectId: string, hiddenObjectIds: string[], groups: ObjectGroupFrame[]) {
  return hiddenObjectIds.includes(objectId) || groups.some((group) => group.hidden && group.objectIds.includes(objectId));
}

function isObjectLocked(
  objectId: string,
  lockedObjectIds: string[],
  groups: ObjectGroupFrame[],
  layers: LayerFrame[],
  objects: CadObjectFrame[]
) {
  const object = objects.find((item) => item.id === objectId);
  const layerLocked = object ? Boolean(layers.find((layer) => layer.id === object.layerId)?.locked) : false;
  const groupLocked = groups.some((group) => group.locked && group.objectIds.includes(objectId));
  return lockedObjectIds.includes(objectId) || layerLocked || groupLocked;
}

function downloadArtifact(artifact: ExportArtifact) {
  const blob = new Blob([artifact.content], { type: artifact.mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = artifact.fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
