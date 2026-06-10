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
MAX_OUTPUT_BYTES = 780 * 1024 * 1024

ASPECTS = [
    {
        "id": "cinematic-21x9",
        "label": "Cinematic 21:9",
        "width": 1600,
        "height": 686,
        "aspectRatio": "21:9",
        "quality": 72,
    },
    {
        "id": "desktop-16x9",
        "label": "Desktop 16:9",
        "width": 1440,
        "height": 810,
        "aspectRatio": "16:9",
        "quality": 72,
    },
    {
        "id": "board-4x3",
        "label": "Board 4:3",
        "width": 1280,
        "height": 960,
        "aspectRatio": "4:3",
        "quality": 70,
    },
    {
        "id": "portrait-4x5",
        "label": "Portrait 4:5",
        "width": 960,
        "height": 1200,
        "aspectRatio": "4:5",
        "quality": 70,
    },
    {
        "id": "square-1x1",
        "label": "Square 1:1",
        "width": 1080,
        "height": 1080,
        "aspectRatio": "1:1",
        "quality": 70,
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
        slug = f"{slugify(Path(rel_source).with_suffix('').as_posix())}-{digest[:8]}"
        image = open_rgb(source)
        original_width, original_height = image.size
        graded = cinematic_grade(image)
        variant_records = []
        variant_dir = OUTPUT_DIR / source_class / slug
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
