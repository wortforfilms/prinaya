#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageEnhance, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public"
OUTPUT_DIR = PUBLIC_DIR / "cinematic-assets"
DATA_PATH = ROOT / "data" / "cinematic-image-assets.json"
EVIDENCE_PATH = ROOT / "release" / "evidence" / "cinematic-image-assets.json"

SOURCE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
MAX_OUTPUT_BYTES = 220 * 1024 * 1024

ASPECTS = [
    {
        "id": "cinematic-21x9",
        "label": "Cinematic 21:9",
        "width": 1800,
        "height": 771,
        "aspectRatio": "21:9",
        "quality": 73,
    },
    {
        "id": "desktop-16x9",
        "label": "Desktop 16:9",
        "width": 1600,
        "height": 900,
        "aspectRatio": "16:9",
        "quality": 73,
    },
    {
        "id": "board-4x3",
        "label": "Board 4:3",
        "width": 1440,
        "height": 1080,
        "aspectRatio": "4:3",
        "quality": 72,
    },
    {
        "id": "portrait-4x5",
        "label": "Portrait 4:5",
        "width": 1120,
        "height": 1400,
        "aspectRatio": "4:5",
        "quality": 72,
    },
    {
        "id": "square-1x1",
        "label": "Square 1:1",
        "width": 1280,
        "height": 1280,
        "aspectRatio": "1:1",
        "quality": 72,
    },
]

UX_SPACES: list[dict[str, Any]] = [
    {
        "id": "landing",
        "label": "TLPS Wedding OS Landing",
        "routes": ["/", "/wedding-os"],
        "keywords": ["tlps-wedding-os/homepage", "tlps-wedding-os-homepage", "wedding-palace-hero"],
        "fallbackSourceClass": "homepage",
    },
    {
        "id": "dashboard",
        "label": "Premium Dashboard",
        "routes": ["/dashboard", "/dashboard/overview"],
        "keywords": ["dashboard", "premium-dashboard"],
    },
    {
        "id": "venue-designer",
        "label": "Venue Designer",
        "routes": ["/venue-designer", "/venues"],
        "keywords": ["venue-designer", "venue-design", "venues", "site-plan", "site-layout"],
    },
    {
        "id": "mandap-designer",
        "label": "Mandap Designer",
        "routes": ["/mandap", "/mandap/designer"],
        "keywords": ["mandap-designer", "mandap", "vedic-lotus", "vedic-raj", "panch-tatva", "kalash"],
    },
    {
        "id": "layout-generator",
        "label": "Layout Generator",
        "routes": ["/layouts", "/layouts/generator"],
        "keywords": ["layout-generator", "layout-plan", "seating-layout", "guest-seating-plan"],
    },
    {
        "id": "floral-designer",
        "label": "Floral Designer",
        "routes": ["/floral", "/floral/concepts"],
        "keywords": ["floral-designer", "floral", "flower", "garland", "rose", "lotus", "jasmine"],
    },
    {
        "id": "lighting-designer",
        "label": "Lighting Designer",
        "routes": ["/lighting", "/lighting/designer"],
        "keywords": ["lighting-designer", "lighting", "chandelier", "dmx", "light"],
    },
    {
        "id": "budget-planner",
        "label": "Budget Planner",
        "routes": ["/budget", "/pricing"],
        "keywords": ["budget-planner", "budget", "cost"],
    },
    {
        "id": "guest-seating",
        "label": "Guest & Seating",
        "routes": ["/guests", "/guests/seating"],
        "keywords": ["guest-seating", "guest-sitting", "guest", "seating"],
    },
    {
        "id": "vendor-manager",
        "label": "Vendor Manager",
        "routes": ["/vendors", "/vendors/library"],
        "keywords": ["vendor-manager", "vendor"],
    },
    {
        "id": "production-planner",
        "label": "Production Planner",
        "routes": ["/production", "/production/planner"],
        "keywords": ["production-planner", "production", "timeline", "schedule"],
    },
    {
        "id": "drone-aerial",
        "label": "Drone & Aerial",
        "routes": ["/drone", "/drone/planner"],
        "keywords": ["drone-aerial", "drone"],
    },
    {
        "id": "vr-walkthrough",
        "label": "VR Walkthrough",
        "routes": ["/vr", "/vr/walkthrough"],
        "keywords": ["vr-walkthrough", "vr", "walkthrough"],
    },
    {
        "id": "exports-boards",
        "label": "Exports & Boards",
        "routes": ["/exports", "/exports/boards"],
        "keywords": ["exports-boards", "exports", "board-preview", "board-generation"],
    },
    {
        "id": "observatory",
        "label": "Observatory",
        "routes": ["/observatory", "/observatory/status"],
        "keywords": ["observatory"],
    },
    {
        "id": "ai-copilot",
        "label": "AI Co-Pilot",
        "routes": ["/ai", "/ai/copilot"],
        "keywords": ["ai-copilot", "ai-co-pilot"],
    },
    {
        "id": "assets-library",
        "label": "Assets Library",
        "routes": ["/assets", "/assets/library"],
        "keywords": ["assets-library", "asset-library", "asset"],
    },
    {
        "id": "templates",
        "label": "Templates",
        "routes": ["/templates"],
        "keywords": ["templates", "template"],
    },
    {
        "id": "admin-panel",
        "label": "Admin Panel",
        "routes": ["/admin", "/admin/panel"],
        "keywords": ["admin-panel", "admin"],
    },
    {
        "id": "settings",
        "label": "Settings",
        "routes": ["/settings"],
        "keywords": ["settings"],
    },
    {
        "id": "cad-editor",
        "label": "CAD Editor",
        "routes": ["/cad", "/cad/editor"],
        "keywords": ["cad-editor", "cad"],
    },
    {
        "id": "board-composer",
        "label": "Board Composer",
        "routes": ["/exports/boards", "/boards"],
        "keywords": ["board-composer", "board-composer", "presentation-board"],
    },
    {
        "id": "vedi-position-finder",
        "label": "Hemant Samwat Vedi Position Finder",
        "routes": ["/ai/vedi-position-finder", "/vedic"],
        "keywords": ["hemant-samwat-vedi-position-finder", "vedi-position"],
    },
    {
        "id": "filmy-studio",
        "label": "Wedding Filmy Studio",
        "routes": ["/gallery", "/wedding-films"],
        "keywords": ["filmy", "film-studio", "wedding-films", "cinematography"],
    },
    {
        "id": "design-boards",
        "label": "Design Boards",
        "routes": ["/gallery", "/exports/boards"],
        "keywords": ["extracted-boards", "design-board", "infographic", "moodboard"],
        "fallbackSourceClass": "design-board",
    },
]


def main() -> None:
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    EVIDENCE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    sources = sorted(
        path
        for path in PUBLIC_DIR.rglob("*")
        if path.is_file() and path.suffix.lower() in SOURCE_EXTENSIONS and OUTPUT_DIR not in path.parents
    )
    if not sources:
        raise RuntimeError("No public image sources found")

    canonical_by_sha: dict[str, Path] = {}
    duplicates: dict[str, list[str]] = {}
    records: list[dict[str, Any]] = []
    total_variant_bytes = 0
    total_variant_count = 0

    for source in sources:
        digest = sha256_file(source)
        rel_source = source.relative_to(PUBLIC_DIR).as_posix()
        if digest in canonical_by_sha:
            canonical = canonical_by_sha[digest].relative_to(PUBLIC_DIR).as_posix()
            duplicates.setdefault(canonical, []).append(rel_source)
            continue

        canonical_by_sha[digest] = source
        source_class = classify_source(rel_source)
        ux_space = classify_ux_space(rel_source, source_class)
        ux_role = classify_ux_role(rel_source)
        slug = f"{slugify(Path(rel_source).with_suffix('').as_posix())}-{digest[:8]}"
        image = open_rgb(source)
        original_width, original_height = image.size
        graded = cinematic_grade(image)
        variant_records = []
        variant_dir = OUTPUT_DIR / ux_space["id"] / slug
        variant_dir.mkdir(parents=True, exist_ok=True)

        for aspect in ASPECTS:
            variant = ImageOps.fit(
                graded,
                (aspect["width"], aspect["height"]),
                method=Image.Resampling.LANCZOS,
                centering=(0.5, 0.5),
            )
            variant = apply_subtle_vignette(variant)
            output = variant_dir / f"{aspect['id']}.webp"
            variant.save(output, "WEBP", quality=aspect["quality"], method=6)
            size = output.stat().st_size
            total_variant_bytes += size
            total_variant_count += 1
            variant_records.append(
                {
                    "aspectId": aspect["id"],
                    "label": aspect["label"],
                    "image": "/" + output.relative_to(PUBLIC_DIR).as_posix(),
                    "width": aspect["width"],
                    "height": aspect["height"],
                    "aspectRatio": aspect["aspectRatio"],
                    "bytes": size,
                    "sha256": sha256_file(output),
                }
            )

        records.append(
            {
                "id": f"cinematic-{len(records) + 1:04d}",
                "slug": slug,
                "status": "READY",
                "productionReady": False,
                "generationMode": "CINEMATIC_LOCAL_DERIVATIVE",
                "sourceImage": "/" + rel_source,
                "sourceClass": source_class,
                "uxSpace": ux_space["id"],
                "uxSpaceLabel": ux_space["label"],
                "uxRole": ux_role,
                "routeBindings": ux_space["routes"],
                "recommendedAspects": recommend_aspects(ux_role),
                "visualTreatment": {
                    "grade": "warm-gold-cinematic",
                    "cropStrategy": "center-weighted-lanczos-fit",
                    "vignette": "subtle",
                    "quality": "hires-preview",
                },
                "sourceSha256": digest,
                "originalWidth": original_width,
                "originalHeight": original_height,
                "variants": variant_records,
                "evidenceRef": "release/evidence/cinematic-image-assets.json",
            }
        )

        if total_variant_bytes > MAX_OUTPUT_BYTES:
            raise RuntimeError(
                f"Cinematic derivative output exceeded {MAX_OUTPUT_BYTES} bytes; "
                "reduce aspect dimensions or quality before continuing."
            )

    duplicate_groups = [
        {
            "canonical": "/" + canonical,
            "duplicates": ["/" + duplicate for duplicate in duplicate_list],
            "reason": "Exact source SHA-256 duplicate skipped before derivative generation.",
        }
        for canonical, duplicate_list in sorted(duplicates.items())
    ]
    category_counts = count_by(records, "sourceClass")
    ux_space_counts = count_by(records, "uxSpace")
    ux_role_counts = count_by(records, "uxRole")

    registry: dict[str, Any] = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "status": "READY",
        "verdict": "CONTROLLED_PREVIEW_READY",
        "productionReady": False,
        "generationMode": "CINEMATIC_LOCAL_DERIVATIVE",
        "assetTruth": (
            "These are local high-resolution cinematic WebP derivatives generated from existing supplied/extracted "
            "preview sources. They are not claimed as new photography, live vendor inventory, or production-certified media."
        ),
        "sourceRoot": "public",
        "outputRoot": "public/cinematic-assets",
        "sourceCount": len(sources),
        "uniqueSourceCount": len(records),
        "duplicateSourceCount": sum(len(group) for group in duplicates.values()),
        "duplicateGroups": duplicate_groups,
        "aspectVariantCount": len(ASPECTS),
        "totalVariantCount": total_variant_count,
        "totalBytes": total_variant_bytes,
        "aspectVariants": [{key: aspect[key] for key in ("id", "label", "width", "height", "aspectRatio")} for aspect in ASPECTS],
        "sourceClassCounts": category_counts,
        "uxSpaceCounts": ux_space_counts,
        "uxRoleCounts": ux_role_counts,
        "uxSpaces": [
            {key: space[key] for key in ("id", "label", "routes")}
            for space in UX_SPACES
            if ux_space_counts.get(space["id"], 0) > 0
        ],
        "records": records,
    }

    DATA_PATH.write_text(json.dumps(registry, indent=2) + "\n")
    EVIDENCE_PATH.write_text(
        json.dumps(
            {
                "generatedAt": registry["generatedAt"],
                "status": registry["status"],
                "verdict": registry["verdict"],
                "productionReady": registry["productionReady"],
                "generationMode": registry["generationMode"],
                "sourceCount": registry["sourceCount"],
                "uniqueSourceCount": registry["uniqueSourceCount"],
                "duplicateSourceCount": registry["duplicateSourceCount"],
                "aspectVariantCount": registry["aspectVariantCount"],
                "totalVariantCount": registry["totalVariantCount"],
                "totalBytes": registry["totalBytes"],
                "sourceClassCounts": registry["sourceClassCounts"],
                "uxSpaceCounts": registry["uxSpaceCounts"],
                "uxRoleCounts": registry["uxRoleCounts"],
                "uxSpaces": registry["uxSpaces"],
                "assetTruth": registry["assetTruth"],
                "blockers": [
                    {
                        "id": "new-ai-native-photo-generation",
                        "status": "BLOCKED",
                        "reason": "This run generated deterministic local derivatives only; it did not call an image model or create new photographic concepts.",
                    },
                    {
                        "id": "production-certified-image-pack",
                        "status": "BLOCKED",
                        "reason": "No brand/legal/print-color approval workflow is implemented for production delivery.",
                    },
                ],
            },
            indent=2,
        )
        + "\n"
    )

    print(
        f"Generated {len(records)} cinematic image records, {total_variant_count} WebP variants, "
        f"{total_variant_bytes / (1024 * 1024):.1f} MiB."
    )


def open_rgb(path: Path) -> Image.Image:
    image = Image.open(path)
    image.load()
    if image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info):
        canvas = Image.new("RGB", image.size, (5, 4, 3))
        alpha = image.convert("RGBA")
        canvas.paste(alpha, mask=alpha.getchannel("A"))
        return canvas
    return image.convert("RGB")


def cinematic_grade(image: Image.Image) -> Image.Image:
    graded = ImageOps.autocontrast(image, cutoff=1)
    graded = ImageEnhance.Color(graded).enhance(1.08)
    graded = ImageEnhance.Contrast(graded).enhance(1.08)
    graded = ImageEnhance.Brightness(graded).enhance(0.985)
    graded = ImageEnhance.Sharpness(graded).enhance(1.08)
    warm = Image.new("RGB", graded.size, (214, 156, 70))
    graded = Image.blend(graded, warm, 0.035)
    return graded


def apply_subtle_vignette(image: Image.Image) -> Image.Image:
    width, height = image.size
    mask = Image.new("L", (width, height), 0)
    center = Image.new("L", (max(1, int(width * 0.72)), max(1, int(height * 0.72))), 255)
    mask.paste(center, ((width - center.width) // 2, (height - center.height) // 2))
    mask = mask.filter(ImageFilter.GaussianBlur(radius=max(width, height) // 8))
    dark = ImageEnhance.Brightness(image).enhance(0.82)
    return Image.composite(image, dark, mask)


def classify_source(relative_path: str) -> str:
    if relative_path.startswith("tlps-unique-extractions/frames/"):
        return "extracted-frame"
    if relative_path.startswith("tlps-unique-extractions/sources/"):
        return "supplied-source"
    if relative_path.startswith("tlps-wedding-os/"):
        return "homepage"
    if relative_path.startswith("hero-banners/"):
        return "hero-banner"
    if relative_path.startswith("extracted-boards/"):
        return "design-board"
    if "glb-preview" in relative_path or "asset" in relative_path:
        return "asset-preview"
    return "public-image"


def classify_ux_space(relative_path: str, source_class: str) -> dict[str, Any]:
    lower_path = relative_path.lower()
    for space in UX_SPACES:
        if any(keyword in lower_path for keyword in space.get("keywords", [])):
            return space
    for space in UX_SPACES:
        if space.get("fallbackSourceClass") == source_class:
            return space
    return {
        "id": "shared-visuals",
        "label": "Shared Visual Assets",
        "routes": ["/gallery", "/features"],
        "keywords": [],
    }


def classify_ux_role(relative_path: str) -> str:
    lower_path = relative_path.lower()
    if "hero" in lower_path or "/raw/" in lower_path or "/hires/" in lower_path:
        return "hero"
    if "workspace-main" in lower_path:
        return "workspace-main"
    if "workspace-panel" in lower_path or "kpi-strip" in lower_path:
        return "ui-panel"
    if "top-command" in lower_path or "left-sidebar" in lower_path or "status-footer" in lower_path:
        return "shell-frame"
    if "all-page" in lower_path or "board-page" in lower_path:
        return "board-page"
    if "option" in lower_path:
        return "design-option"
    if "destination" in lower_path:
        return "destination-card"
    if "film" in lower_path or "wedding-reels" in lower_path or "highlights" in lower_path:
        return "film-card"
    if "asset" in lower_path or "library" in lower_path:
        return "asset-card"
    return "supporting-visual"


def recommend_aspects(ux_role: str) -> list[str]:
    if ux_role == "hero":
        return ["cinematic-21x9", "desktop-16x9"]
    if ux_role in {"workspace-main", "board-page"}:
        return ["desktop-16x9", "board-4x3"]
    if ux_role in {"ui-panel", "asset-card", "destination-card", "film-card"}:
        return ["square-1x1", "desktop-16x9"]
    if ux_role == "design-option":
        return ["desktop-16x9", "portrait-4x5"]
    return ["desktop-16x9", "square-1x1"]


def count_by(records: list[dict[str, Any]], key: str) -> dict[str, int]:
    counts: dict[str, int] = {}
    for record in records:
        value = str(record[key])
        counts[value] = counts.get(value, 0) + 1
    return dict(sorted(counts.items()))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return slug[:96] or "image"


if __name__ == "__main__":
    main()
