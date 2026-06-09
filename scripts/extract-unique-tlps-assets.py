from __future__ import annotations

import hashlib
import json
import os
import re
from io import BytesIO
from pathlib import Path
from typing import Any, TypedDict

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = Path(os.environ.get("TLPS_UNIQUE_SOURCE_DIR", "/Users/vesahe/Downloads/TLPS_All_Generated_Images_Descriptive"))
OUT_DIR = ROOT / "public" / "tlps-unique-extractions"
SOURCE_OUT_DIR = OUT_DIR / "sources"
FRAME_OUT_DIR = OUT_DIR / "frames"
DATA_PATH = ROOT / "data" / "tlps-unique-extractions.json"
EVIDENCE_PATH = ROOT / "release" / "evidence" / "tlps-unique-extractions.json"


class Crop(TypedDict):
    id: str
    label: str
    kind: str
    x: int
    y: int
    width: int
    height: int


def slugify(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return cleaned or "frame"


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def image_sha(image: Image.Image) -> str:
    buffer = BytesIO()
    image.save(buffer, "PNG", optimize=True)
    return hashlib.sha256(buffer.getvalue()).hexdigest()


def ahash(image: Image.Image, size: int = 16) -> str:
    gray = image.convert("L").resize((size, size))
    values = list(gray.getdata())
    average = sum(values) / len(values)
    return "".join("1" if value >= average else "0" for value in values)


def dhash(image: Image.Image, size: int = 16) -> str:
    gray = image.convert("L").resize((size + 1, size))
    values = list(gray.getdata())
    bits: list[str] = []
    for y in range(size):
        row = values[y * (size + 1) : (y + 1) * (size + 1)]
        for x in range(size):
            bits.append("1" if row[x] > row[x + 1] else "0")
    return "".join(bits)


def hamming(left: str, right: str) -> int:
    return sum(a != b for a, b in zip(left, right))


def crop(image: Image.Image, spec: Crop) -> Image.Image:
    x = max(0, spec["x"])
    y = max(0, spec["y"])
    right = min(image.width, x + max(1, spec["width"]))
    bottom = min(image.height, y + max(1, spec["height"]))
    return image.crop((x, y, right, bottom)).convert("RGB")


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", optimize=True)


def rect(id_value: str, label: str, kind: str, x: int, y: int, width: int, height: int) -> Crop:
    return {"id": id_value, "label": label, "kind": kind, "x": x, "y": y, "width": width, "height": height}


def grid(
    prefix: str,
    label_prefix: str,
    kind: str,
    x: int,
    y: int,
    width: int,
    height: int,
    columns: int,
    rows: int,
    gap_x: int = 0,
    gap_y: int = 0,
) -> list[Crop]:
    cell_width = (width - gap_x * (columns - 1)) // columns
    cell_height = (height - gap_y * (rows - 1)) // rows
    specs: list[Crop] = []
    for row in range(rows):
        for column in range(columns):
            number = row * columns + column + 1
            specs.append(
                rect(
                    f"{prefix}-{number:02d}",
                    f"{label_prefix} {number:02d}",
                    kind,
                    x + column * (cell_width + gap_x),
                    y + row * (cell_height + gap_y),
                    cell_width,
                    cell_height,
                )
            )
    return specs


def tlps_homepage_crops() -> list[Crop]:
    return [
        rect("hero", "Hero Header", "homepage-section", 0, 0, 864, 386),
        rect("ecosystem", "Complete Wedding Ecosystem", "homepage-section", 0, 386, 864, 123),
        rect("destinations", "Destination Weddings Section", "homepage-section", 0, 509, 864, 211),
        rect("design-studio", "Wedding Design Studio Section", "homepage-section", 0, 720, 864, 205),
        rect("film-studio", "Wedding Filmy Studio Section", "homepage-section", 0, 925, 864, 210),
        rect("signature-experiences", "Signature Experiences Section", "homepage-section", 0, 1135, 864, 138),
        rect("stats-band", "Stats Band", "homepage-section", 0, 1273, 864, 75),
        rect("why-ai", "Why Choose and AI Co-Pilot", "homepage-section", 0, 1348, 864, 204),
        rect("cta", "Love Story CTA", "homepage-section", 0, 1552, 864, 103),
        rect("footer", "Footer", "homepage-section", 0, 1655, 864, 166),
        *grid("destination", "Destination Card", "homepage-card", 28, 558, 812, 138, 7, 1, 7, 0),
        *grid("design-card", "Design Studio Card", "homepage-card", 151, 762, 689, 136, 4, 1, 9, 0),
        *grid("film-card", "Film Studio Card", "homepage-card", 28, 967, 804, 126, 8, 1, 7, 0),
    ]


def vedi_position_crops() -> list[Crop]:
    return [
        rect("top-flow", "Vedi Finder Step Header", "vedi-workflow", 0, 0, 1536, 124),
        rect("project-info", "Project Info Panel", "vedi-panel", 14, 128, 218, 305),
        rect("orientation", "Orientation Compass Panel", "vedi-panel", 14, 440, 218, 275),
        rect("main-map", "Vedi Recommendation Map", "vedi-map", 250, 126, 976, 674),
        rect("right-recommendation", "Vedi Recommendation Stack", "vedi-panel", 1248, 126, 271, 523),
        rect("vastu-score", "Vastu Score Panel", "vedi-panel", 1248, 654, 271, 144),
        rect("hemant-samwat-details", "Hemant Samwat Details", "vedi-panel", 14, 810, 397, 143),
        rect("energy-analysis", "Energy Analysis", "vedi-panel", 420, 810, 384, 143),
        rect("recommendations", "Recommendations", "vedi-panel", 814, 810, 325, 143),
        rect("quick-actions", "Quick Actions", "vedi-panel", 1150, 810, 370, 143),
    ]


def generic_dark_app_crops() -> list[Crop]:
    base = [
        rect("left-sidebar", "Fixed Left Sidebar", "ui-shell", 0, 0, 184, 1024),
        rect("top-command", "Top Command Bar", "ui-shell", 184, 0, 1352, 126),
        rect("kpi-strip", "KPI Widget Strip", "ui-kpi", 184, 126, 1352, 88),
        rect("workspace-main", "Main Workspace Area", "ui-workspace", 184, 214, 1352, 774),
        rect("status-footer", "Status Footer", "ui-shell", 0, 988, 1536, 36),
    ]
    return base + grid("workspace-panel", "Workspace Panel", "ui-panel", 184, 214, 1352, 774, 4, 4, 8, 8)


def dashboard_home_crops() -> list[Crop]:
    return [
        rect("left-sidebar", "Dashboard Luxury Sidebar", "dashboard-shell", 0, 0, 306, 1024),
        rect("top-search", "Top Search and Profile Bar", "dashboard-shell", 306, 0, 1230, 56),
        rect("hero", "Dashboard Hero", "dashboard-hero", 306, 56, 1230, 320),
        rect("quick-actions", "Quick Actions", "dashboard-actions", 306, 376, 1230, 90),
        rect("module-cards", "Neon Module Cards", "dashboard-modules", 306, 466, 1230, 370),
        rect("bottom-widgets", "Recent Projects Stats Activity", "dashboard-widgets", 306, 836, 1230, 188),
    ]


def board_crops(slug: str) -> list[Crop]:
    if slug == "a-detailed-architectural-design-board-cad-presen":
        return [
            rect("project-metadata", "Project Metadata", "board-panel", 8, 80, 252, 160),
            rect("materials-left-rail", "Materials Left Rail", "board-panel", 8, 240, 252, 520),
            rect("front-elevation", "Front Elevation", "cad-elevation", 260, 50, 700, 320),
            rect("perspective-view", "3D Perspective View", "render-frame", 985, 14, 535, 350),
            rect("top-plan", "Plan Top View", "cad-plan", 360, 394, 550, 310),
            rect("detail-panels", "Detail Panels", "cad-detail", 975, 414, 544, 310),
            rect("section-aa", "Section A-A", "cad-section", 0, 760, 480, 260),
            rect("section-bb", "Section B-B", "cad-section", 480, 760, 385, 260),
            rect("lighting-plan", "Lighting Plan", "lighting-plan", 865, 760, 655, 260),
        ]
    if slug == "a-large-highly-detailed-infographic-board-desig":
        return [
            *grid("sci-fi-option", "Sci-Fi Option", "design-option", 6, 74, 1524, 620, 3, 2, 10, 8),
            *grid("sci-fi-technical", "Sci-Fi Technical Panel", "technical-panel", 6, 698, 1524, 190, 6, 1, 5, 0),
            *grid("sci-fi-material", "Sci-Fi Material Strip", "material-strip", 6, 890, 1524, 130, 4, 1, 5, 0),
        ]
    if slug == "a-large-highly-detailed-infographic-moodboard-lay":
        return [
            *grid("vedic-option", "Vedic Mandap Option", "design-option", 0, 42, 1624, 560, 6, 2, 0, 0),
            *grid("vedic-detail", "Vedic Detail Panel", "technical-panel", 0, 604, 1624, 190, 7, 1, 0, 0),
            *grid("vedic-material", "Vedic Material Panel", "material-strip", 0, 795, 1624, 170, 4, 1, 0, 0),
        ]
    if slug == "a-high-detail-design-board-moodboard-image-of-we":
        return [
            *grid("unique-option", "Unique Design Option", "design-option", 8, 70, 1520, 705, 3, 3, 8, 8),
            *grid("unique-detail", "Unique Detail Panel", "technical-panel", 8, 780, 1520, 145, 7, 1, 6, 0),
            *grid("unique-material", "Unique Material Strip", "material-strip", 8, 928, 1520, 90, 5, 1, 6, 0),
        ]
    if slug == "a-large-detailed-design-board-infographic-image":
        return [
            *grid("general-option", "General Design Option", "design-option", 10, 72, 1516, 660, 3, 2, 12, 10),
            *grid("general-detail", "General Detail Panel", "technical-panel", 10, 738, 1516, 170, 7, 1, 6, 0),
            *grid("general-material", "General Material Strip", "material-strip", 10, 910, 1516, 105, 5, 1, 6, 0),
        ]
    if slug == "a-high-detail-infographic-poster-design-board-fo":
        return [
            *grid("sacred-option", "Sacred Vedic Option", "design-option", 8, 74, 1520, 704, 3, 2, 12, 12),
            *grid("sacred-detail", "Sacred Detail Panel", "technical-panel", 8, 785, 1520, 132, 7, 1, 6, 0),
            *grid("sacred-material", "Sacred Material Strip", "material-strip", 8, 920, 1520, 98, 5, 1, 6, 0),
        ]
    if slug == "a-high-resolution-architectural-presentation-board":
        return [
            *grid("lotus-page", "Vedic Lotus Page", "board-page", 0, 0, 1536, 944, 4, 2, 8, 8),
            rect("lotus-footer", "Vedic Lotus Footer Band", "brand-footer", 0, 948, 1536, 76),
        ]
    if slug == "a-high-detail-architectural-presentation-board-c":
        return grid("all-page", "All Pages Board Frame", "board-page", 0, 0, 1536, 1024, 4, 3, 8, 8)
    return []


def hero_banner_crops(slug: str) -> list[Crop]:
    if slug == "tlp-wedding-cad-all-hero-banners":
        labels = [
            "Dashboard",
            "Venue Designer",
            "Mandap Designer",
            "Layout Generator",
            "Floral Designer",
            "Lighting Designer",
            "Budget Planner",
            "Guest Seating",
            "Vendor Manager",
            "Production Planner",
            "Drone Aerial",
            "VR Walkthrough",
            "Exports Boards",
            "Observatory",
            "AI Co-Pilot",
            "Assets Library",
            "Templates",
            "Admin Panel",
            "Settings",
            "CAD Editor",
            "Board Composer",
        ]
        specs = grid("cad-hero", "CAD Hero Banner", "hero-banner", 6, 52, 1524, 966, 3, 7, 8, 6)
        for spec, label in zip(specs, labels):
            spec["label"] = f"{label} Hero Banner"
            spec["id"] = slugify(f"{label}-hero")
        return specs
    if slug == "tlps-wedding-filmy-studio-all-hero-banners-with-cutting-guides":
        labels = [
            "Wedding Films",
            "Love Story",
            "Wedding Teasers",
            "Candid Moments",
            "Wedding Highlights",
            "Full Length Films",
            "Pre Wedding Films",
            "Drone Cinematography",
            "Destination Weddings",
            "Wedding Reels",
            "Equipment and Tech",
            "Create Magic",
        ]
        specs = grid("filmy-hero", "Filmy Hero Banner", "filmy-hero-banner", 20, 92, 1495, 875, 3, 4, 18, 16)
        for spec, label in zip(specs, labels):
            spec["label"] = f"{label} Filmy Hero"
            spec["id"] = slugify(f"{label}-filmy-hero")
        return specs
    return []


def crop_specs_for(slug: str) -> list[Crop]:
    if slug == "tlps-wedding-os-homepage":
        return tlps_homepage_crops()
    if slug == "hemant-samwat-vedi-position-finder":
        return vedi_position_crops()
    if slug == "a-high-resolution-ui-website-dashboard-homepage-m":
        return dashboard_home_crops()
    hero_specs = hero_banner_crops(slug)
    if hero_specs:
        return hero_specs
    board_specs = board_crops(slug)
    if board_specs:
        return board_specs
    return generic_dark_app_crops()


def choose_canonical(files: list[Path]) -> Path:
    return sorted(files, key=lambda path: ("with-cutting-guides" in slugify(path.stem), len(path.name), path.name))[0]


def build_source_groups(files: list[Path]) -> tuple[list[dict[str, Any]], set[Path]]:
    images = {path: Image.open(path).convert("RGB") for path in files}
    exact_hashes = {path: sha256_file(path) for path in files}
    average_hashes = {path: ahash(image) for path, image in images.items()}
    difference_hashes = {path: dhash(image) for path, image in images.items()}

    parent = {path: path for path in files}

    def find(path: Path) -> Path:
        while parent[path] != path:
            parent[path] = parent[parent[path]]
            path = parent[path]
        return path

    def union(left: Path, right: Path) -> None:
        a = find(left)
        b = find(right)
        if a != b:
            parent[b] = a

    for index, left in enumerate(files):
        for right in files[index + 1 :]:
            exact_match = exact_hashes[left] == exact_hashes[right]
            visual_match = hamming(average_hashes[left], average_hashes[right]) <= 32 and hamming(difference_hashes[left], difference_hashes[right]) <= 65
            if exact_match or visual_match:
                union(left, right)

    grouped: dict[Path, list[Path]] = {}
    for path in files:
        grouped.setdefault(find(path), []).append(path)

    duplicate_groups: list[dict[str, Any]] = []
    duplicate_paths: set[Path] = set()
    for members in grouped.values():
        canonical = choose_canonical(members)
        duplicates = [path for path in members if path != canonical]
        duplicate_paths.update(duplicates)
        if duplicates:
            duplicate_groups.append(
                {
                    "canonical": canonical.name,
                    "duplicates": [path.name for path in duplicates],
                    "reason": "Exact or perceptual duplicate; cutting-guide overlays are retained as evidence but excluded from unique frame extraction.",
                    "distances": [
                        {
                            "file": path.name,
                            "averageHashDistance": hamming(average_hashes[canonical], average_hashes[path]),
                            "differenceHashDistance": hamming(difference_hashes[canonical], difference_hashes[path]),
                        }
                        for path in duplicates
                    ],
                }
            )
    return duplicate_groups, duplicate_paths


def main() -> None:
    if not SOURCE_DIR.exists():
        raise FileNotFoundError(f"Source directory not found: {SOURCE_DIR}")

    files = sorted(SOURCE_DIR.glob("*.png"))
    if not files:
        raise FileNotFoundError(f"No PNG files found in {SOURCE_DIR}")

    SOURCE_OUT_DIR.mkdir(parents=True, exist_ok=True)
    FRAME_OUT_DIR.mkdir(parents=True, exist_ok=True)
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    EVIDENCE_PATH.parent.mkdir(parents=True, exist_ok=True)

    duplicate_groups, duplicate_paths = build_source_groups(files)
    source_records: list[dict[str, Any]] = []
    frame_records: list[dict[str, Any]] = []
    duplicate_frame_records: list[dict[str, Any]] = []
    frame_by_sha: dict[str, str] = {}

    for source_path in files:
        source_slug = slugify(source_path.stem)
        source_image = Image.open(source_path).convert("RGB")
        source_hash = sha256_file(source_path)
        source_record = {
            "id": source_slug,
            "slug": source_slug,
            "fileName": source_path.name,
            "sourcePath": str(source_path),
            "sha256": source_hash,
            "averageHash": ahash(source_image),
            "differenceHash": dhash(source_image),
            "width": source_image.width,
            "height": source_image.height,
            "status": "DUPLICATE_RELATED" if source_path in duplicate_paths else "READY",
            "sourceImage": None,
            "extractedFrameCount": 0,
            "uniqueFrameCount": 0,
        }

        if source_path in duplicate_paths:
            source_records.append(source_record)
            continue

        source_output = SOURCE_OUT_DIR / f"{source_slug}.png"
        save_png(source_image, source_output)
        source_record["sourceImage"] = f"/tlps-unique-extractions/sources/{source_slug}.png"

        specs = [rect("full-source", "Full Source Board", "source", 0, 0, source_image.width, source_image.height), *crop_specs_for(source_slug)]
        source_record["extractedFrameCount"] = len(specs)
        for spec in specs:
            frame_image = crop(source_image, spec)
            frame_hash = image_sha(frame_image)
            frame_id = f"{source_slug}-{spec['id']}"
            if frame_hash in frame_by_sha:
                duplicate_frame_records.append(
                    {
                        "id": frame_id,
                        "sourceId": source_slug,
                        "duplicateOf": frame_by_sha[frame_hash],
                        "label": spec["label"],
                        "kind": spec["kind"],
                        "sha256": frame_hash,
                        "crop": {"x": spec["x"], "y": spec["y"], "width": spec["width"], "height": spec["height"]},
                    }
                )
                continue

            relative_path = Path("tlps-unique-extractions") / "frames" / source_slug / f"{spec['id']}.png"
            output_path = ROOT / "public" / relative_path
            save_png(frame_image, output_path)
            frame_by_sha[frame_hash] = frame_id
            source_record["uniqueFrameCount"] += 1
            frame_records.append(
                {
                    "id": frame_id,
                    "sourceId": source_slug,
                    "slug": slugify(frame_id),
                    "label": spec["label"],
                    "kind": spec["kind"],
                    "status": "READY",
                    "image": f"/{relative_path.as_posix()}",
                    "crop": {"x": spec["x"], "y": spec["y"], "width": spec["width"], "height": spec["height"]},
                    "width": frame_image.width,
                    "height": frame_image.height,
                    "sha256": frame_hash,
                    "averageHash": ahash(frame_image),
                    "differenceHash": dhash(frame_image),
                    "evidenceRef": "release/evidence/tlps-unique-extractions.json",
                }
            )
        source_records.append(source_record)

    unique_sources = [source for source in source_records if source["status"] == "READY"]
    registry = {
        "generatedAt": "2026-06-09T00:00:00.000Z",
        "status": "READY",
        "verdict": "CONTROLLED_PREVIEW_READY",
        "productionReady": False,
        "sourceDirectory": str(SOURCE_DIR),
        "sourceCount": len(source_records),
        "uniqueSourceCount": len(unique_sources),
        "duplicateSourceCount": len(source_records) - len(unique_sources),
        "duplicateSourceGroups": duplicate_groups,
        "uniqueFrameCount": len(frame_records),
        "duplicateFrameCount": len(duplicate_frame_records),
        "sources": source_records,
        "frames": frame_records,
        "duplicateFrames": duplicate_frame_records,
        "assetTruth": "Local preview extraction from supplied PNG references. Duplicate detection is exact plus conservative perceptual matching. No live vendor, payment, marketplace, safety compliance, or production CAD capability is implied.",
    }

    DATA_PATH.write_text(json.dumps(registry, indent=2) + "\n")
    evidence = {
        "generatedAt": registry["generatedAt"],
        "status": registry["status"],
        "verdict": registry["verdict"],
        "productionReady": registry["productionReady"],
        "sourceDirectory": registry["sourceDirectory"],
        "sourceCount": registry["sourceCount"],
        "uniqueSourceCount": registry["uniqueSourceCount"],
        "duplicateSourceCount": registry["duplicateSourceCount"],
        "duplicateSourceGroups": registry["duplicateSourceGroups"],
        "uniqueFrameCount": registry["uniqueFrameCount"],
        "duplicateFrameCount": registry["duplicateFrameCount"],
        "outputDir": "public/tlps-unique-extractions",
        "dataRef": "data/tlps-unique-extractions.json",
        "assetTruth": registry["assetTruth"],
    }
    EVIDENCE_PATH.write_text(json.dumps(evidence, indent=2) + "\n")
    print(
        "tlps:unique extracted "
        f"{registry['uniqueFrameCount']} unique frames from {registry['uniqueSourceCount']} unique sources; "
        f"{registry['duplicateSourceCount']} related source duplicates skipped"
    )


if __name__ == "__main__":
    main()
