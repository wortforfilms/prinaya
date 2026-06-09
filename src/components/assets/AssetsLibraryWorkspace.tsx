"use client";

import { Box, Database, Filter, Search, ShieldAlert, Tags } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/layout/StatusBadge";
import { StudioShell } from "@/components/layout/StudioShell";
import {
  getAllAssets,
  getAssetCategoryOptions,
  getAssetRouteTags,
  getAssetStats
} from "@/lib/asset-preview-runtime";
import { getHeroBannerBySlug } from "@/lib/hero-banner-registry";
import type { AssetCategory, AssetStatus, WeddingCADAsset } from "@/lib/schemas";

const assets = getAllAssets();
const stats = getAssetStats();
const categories = getAssetCategoryOptions();
const assetsHero = getHeroBannerBySlug("assets-library");

export function AssetsLibraryWorkspace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AssetCategory | "All">("All");
  const [status, setStatus] = useState<AssetStatus | "All">("All");
  const [selectedId, setSelectedId] = useState(assets[0]?.id ?? "");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesCategory = category === "All" || asset.category === category;
      const matchesStatus = status === "All" || asset.status === status;
      const matchesQuery = normalized
        ? [
            asset.name,
            asset.category,
            asset.subcategory,
            asset.description,
            asset.status,
            asset.source,
            asset.previewType,
            ...asset.tags,
            ...asset.materials,
            ...asset.usableInRoutes
          ].some((value) => value.toLowerCase().includes(normalized))
        : true;
      return matchesCategory && matchesStatus && matchesQuery;
    });
  }, [category, query, status]);

  const selected = filtered.find((asset) => asset.id === selectedId) ?? filtered[0] ?? assets[0];

  return (
    <StudioShell>
      <div className="min-h-screen px-4 py-5 text-[#f8f0df] lg:px-6">
        <section className="relative overflow-hidden rounded-md border border-[#d9aa46]/18 bg-[#041614]/90 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_64px_rgba(0,0,0,0.28)]">
          {assetsHero ? <img src={assetsHero.hiresImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" /> : null}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,8,0.94),rgba(2,9,8,0.76)_48%,rgba(2,9,8,0.38))]" />
          <div className="relative flex min-h-[230px] flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d9aa46]">Local Preview Registry</p>
              <h1 className="mt-2 font-serif text-4xl font-semibold tracking-normal text-white">Wedding CAD Asset Library</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#d8c9a6]">
                Generated metadata, local preview images, and primitive GLB assets for TLP / Hemant Samwat Wedding CAD Studio. No paid marketplace, live vendor, commercial inventory, or vendor production mesh claim is made here.
              </p>
            </div>
            <div className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100">
              CONTROLLED_PREVIEW_READY
              <span className="block text-xs font-medium text-emerald-200/80">PRODUCTION_READY=false</span>
            </div>
          </div>

          <div className="relative mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <Metric label="Total Assets" value={stats.total} icon={<Database aria-hidden className="h-5 w-5" />} />
            <Metric label="Categories" value={stats.categoryCount} icon={<Tags aria-hidden className="h-5 w-5" />} />
            <Metric label="READY" value={stats.statusCounts.READY} status="READY" />
            <Metric label="PARTIAL" value={stats.statusCounts.PARTIAL} status="PARTIAL" />
            <Metric label="BLOCKED" value={stats.statusCounts.BLOCKED} status="BLOCKED" />
          </div>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            <div className="rounded-md border border-[#d9aa46]/16 bg-[#061b18]/82 p-3">
              <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_220px_180px]">
                <label className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-[#d8c9a6]">
                  <Search aria-hidden className="h-4 w-4 text-[#c8b98e]" />
                  <span className="sr-only">Search assets</span>
                  <input
                    className="w-full border-0 bg-transparent p-0 outline-none placeholder:text-[#a99b82]"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search assets, routes, tags, materials..."
                  />
                </label>
                <label className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-[#d8c9a6]">
                  <Filter aria-hidden className="h-4 w-4 text-[#c8b98e]" />
                  <span className="sr-only">Filter category</span>
                  <select className="w-full border-0 bg-transparent p-0 outline-none" value={category} onChange={(event) => setCategory(event.target.value as AssetCategory | "All")}>
                    <option value="All">All categories</option>
                    {categories.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-[#d8c9a6]">
                  <span className="sr-only">Filter status</span>
                  <select className="w-full border-0 bg-transparent p-0 outline-none" value={status} onChange={(event) => setStatus(event.target.value as AssetStatus | "All")}>
                    <option value="All">All statuses</option>
                    <option value="READY">READY</option>
                    <option value="PARTIAL">PARTIAL</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {filtered.slice(0, 72).map((asset) => (
                <button
                  key={asset.id}
                  className={`rounded-md border p-3 text-left transition ${selected?.id === asset.id ? "border-[#d9aa46]/50 bg-[#d9aa46]/10" : "border-[#d9aa46]/16 bg-[#061b18]/78 hover:border-[#d9aa46]/34"}`}
                  onClick={() => setSelectedId(asset.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{asset.name}</p>
                      <p className="mt-1 text-xs text-[#a99b82]">{asset.category} / {asset.subcategory}</p>
                    </div>
                    <StatusBadge status={asset.status} />
                  </div>
                  <div className="mt-3 h-24 overflow-hidden rounded-md border border-white/10 bg-black/30">
                    {asset.fileRefs.previewImage ? <img src={asset.fileRefs.previewImage} alt={asset.name} className="h-full w-full object-cover opacity-80" /> : <BlockedPreview />}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {getAssetRouteTags(asset).slice(0, 3).map((route) => (
                      <span key={`${asset.id}-${route}`} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-[#d8c9a6]">{route}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-20">
            {selected ? <AssetDetails asset={selected} /> : null}
            <div className="rounded-md border border-[#d9aa46]/16 bg-[#061b18]/82 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d9aa46]">Category Counts</p>
              <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1 studio-scrollbar">
                {stats.categories.map((item) => (
                  <div key={item.category} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs">
                    <span className="truncate text-[#d8c9a6]">{item.category}</span>
                    <span className="font-semibold text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </StudioShell>
  );
}

function AssetDetails({ asset }: { asset: WeddingCADAsset }) {
  return (
    <div className="rounded-md border border-[#d9aa46]/20 bg-[#061b18]/86 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d9aa46]">Selected Asset</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{asset.name}</h2>
        </div>
        <StatusBadge status={asset.status} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[#d8c9a6]">{asset.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <Detail label="Source" value={asset.source} />
        <Detail label="Preview" value={asset.previewType} />
        <Detail label="Dimensions" value={`${asset.dimensions.widthM} x ${asset.dimensions.depthM} x ${asset.dimensions.heightM}m`} />
        <Detail label="Cost" value={`${asset.costRange.currency} ${asset.costRange.min.toLocaleString("en-IN")} - ${asset.costRange.max.toLocaleString("en-IN")}`} />
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#a99b82]">Materials</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {asset.materials.map((material) => (
            <span key={material} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-[#d8c9a6]">{material}</span>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#a99b82]">Evidence</p>
        <p className="mt-1 break-all text-xs text-[#f6d78b]">{asset.evidenceRef}</p>
      </div>
      <div className="mt-4 rounded-md border border-pink-300/20 bg-pink-400/10 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-pink-100">
          <ShieldAlert aria-hidden className="h-4 w-4" />
          Honest Blockers
        </div>
        <ul className="mt-2 space-y-1 text-xs leading-5 text-[#d8c9a6]">
          {asset.safetyNotes.slice(0, 3).map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Metric({ label, value, icon, status }: { label: string; value: number; icon?: ReactNode; status?: AssetStatus }) {
  return (
    <div className="rounded-md border border-[#d9aa46]/16 bg-white/[0.045] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#a99b82]">{label}</span>
        {status ? <StatusBadge status={status} /> : <span className="text-[#f6d78b]">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-semibold text-white">{value.toLocaleString("en-IN")}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-2">
      <p className="text-[10px] uppercase tracking-[0.12em] text-[#a99b82]">{label}</p>
      <p className="mt-1 break-words text-xs font-semibold text-white">{value}</p>
    </div>
  );
}

function BlockedPreview() {
  return (
    <div className="grid h-full place-items-center text-center text-xs font-semibold uppercase tracking-[0.12em] text-pink-100">
      <Box aria-hidden className="mb-1 h-5 w-5" />
      BLOCKED EXTERNAL
    </div>
  );
}
