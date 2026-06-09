from __future__ import annotations

import json
import math
import os
import random
from pathlib import Path
from typing import Callable, TypedDict

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(os.environ.get("HERO_BANNER_SOURCE", "/Users/vesahe/Downloads/ChatGPT Image Jun 9, 2026, 04_07_00 PM.png"))
RAW_DIR = ROOT / "public" / "hero-banners" / "raw"
HIRES_DIR = ROOT / "public" / "hero-banners" / "hires"
DATA_PATH = ROOT / "data" / "hero-banners.json"
EVIDENCE_PATH = ROOT / "release" / "evidence" / "hero-banners.json"

WIDTH = 1920
HEIGHT = 580
HIRES_SIZE = (WIDTH, HEIGHT)

SERIF_FONT = "/System/Library/Fonts/Supplemental/Georgia.ttf"
SANS_FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"


class Banner(TypedDict):
    slug: str
    title: str
    eyebrow: str
    body: str
    category: str
    routes: list[str]
    bullets: list[str]
    action: str
    bg: str
    mid: str
    accent: str
    accent2: str
    visual: str


BANNERS: list[Banner] = [
    {
        "slug": "dashboard",
        "title": "Dashboard",
        "eyebrow": "Complete wedding command center",
        "body": "Real-time overview for Hemant Samwat Wedding.",
        "category": "workspace",
        "routes": ["/", "/dashboard"],
        "bullets": ["Project health", "Smart insights", "All modules"],
        "action": "Open Dashboard",
        "bg": "#07110f",
        "mid": "#10231d",
        "accent": "#d9aa46",
        "accent2": "#78d19a",
        "visual": "venue",
    },
    {
        "slug": "venue-designer",
        "title": "Venue Designer",
        "eyebrow": "From vision to site plan",
        "body": "Design the perfect venue with floor plans and aerial views.",
        "category": "module",
        "routes": ["/venue-designer", "/venues"],
        "bullets": ["Site planning", "Floor plans", "3D aerial views"],
        "action": "Start Designing",
        "bg": "#07170f",
        "mid": "#173620",
        "accent": "#7dc47e",
        "accent2": "#d9aa46",
        "visual": "site",
    },
    {
        "slug": "mandap-designer",
        "title": "Mandap Designer",
        "eyebrow": "Divine mandaps with precision",
        "body": "Create ceremonial structures with elevation-ready details.",
        "category": "module",
        "routes": ["/mandap"],
        "bullets": ["Traditional to modern", "Ritual alignment", "3D visualization"],
        "action": "Design Mandap",
        "bg": "#180914",
        "mid": "#331122",
        "accent": "#ef7aa8",
        "accent2": "#d9aa46",
        "visual": "mandap",
    },
    {
        "slug": "layout-generator",
        "title": "Layout Generator",
        "eyebrow": "Intelligent guest experience",
        "body": "Generate venue layouts with spacing and flow clarity.",
        "category": "module",
        "routes": ["/layouts"],
        "bullets": ["2D and 3D layouts", "Guest flow", "Space optimization"],
        "action": "Generate Layout",
        "bg": "#071228",
        "mid": "#101d4a",
        "accent": "#4b8df7",
        "accent2": "#8c5cff",
        "visual": "blueprint",
    },
    {
        "slug": "floral-designer",
        "title": "Floral Designer",
        "eyebrow": "Floral concepts brought to life",
        "body": "Plan installations, palettes, flower sourcing, and boards.",
        "category": "module",
        "routes": ["/floral"],
        "bullets": ["Floral concepts", "Seasonal flowers", "3D installations"],
        "action": "Design Florals",
        "bg": "#160b0d",
        "mid": "#321715",
        "accent": "#f0739c",
        "accent2": "#f4bd75",
        "visual": "floral",
    },
    {
        "slug": "lighting-designer",
        "title": "Lighting Designer",
        "eyebrow": "Mood, magic, and coverage",
        "body": "Build lighting plans, stage moods, lux coverage, and effects.",
        "category": "module",
        "routes": ["/lighting"],
        "bullets": ["Lighting plans", "DMX scenes", "Lux coverage"],
        "action": "Design Lighting",
        "bg": "#10091d",
        "mid": "#241145",
        "accent": "#b36cff",
        "accent2": "#47d7ff",
        "visual": "lighting",
    },
    {
        "slug": "budget-planner",
        "title": "Budget Planner",
        "eyebrow": "Spend smarter, stay on track",
        "body": "Estimate, compare, and control every wedding production cost.",
        "category": "module",
        "routes": ["/budget", "/pricing"],
        "bullets": ["Budget overview", "Cost breakdown", "Payment schedule"],
        "action": "Plan Budget",
        "bg": "#071907",
        "mid": "#13320f",
        "accent": "#7dd36e",
        "accent2": "#d9aa46",
        "visual": "budget",
    },
    {
        "slug": "guest-seating",
        "title": "Guest & Seating",
        "eyebrow": "Perfect seating, happy guests",
        "body": "Plan sections, tables, RSVP groups, and movement buffers.",
        "category": "module",
        "routes": ["/guests"],
        "bullets": ["Guest management", "Seating arrangements", "RSVP analytics"],
        "action": "Manage Guests",
        "bg": "#0c1116",
        "mid": "#1d272c",
        "accent": "#7bb7ff",
        "accent2": "#d9aa46",
        "visual": "seating",
    },
    {
        "slug": "vendor-manager",
        "title": "Vendor Manager",
        "eyebrow": "Build stronger partnerships",
        "body": "Manage assignments, documents, crew, and local preview records.",
        "category": "module",
        "routes": ["/vendors", "/marketplace"],
        "bullets": ["Vendor directory", "Contracts and orders", "Performance tracking"],
        "action": "Manage Vendors",
        "bg": "#171007",
        "mid": "#39210b",
        "accent": "#f0a64b",
        "accent2": "#ffd488",
        "visual": "vendor",
    },
    {
        "slug": "production-planner",
        "title": "Production Planner",
        "eyebrow": "Plan, schedule, execute",
        "body": "Coordinate timelines, resources, call sheets, and work orders.",
        "category": "module",
        "routes": ["/production"],
        "bullets": ["Timeline and tasks", "Resources", "Milestones"],
        "action": "Plan Production",
        "bg": "#110c1e",
        "mid": "#24163e",
        "accent": "#a86cff",
        "accent2": "#33d7bc",
        "visual": "gantt",
    },
    {
        "slug": "drone-aerial",
        "title": "Drone & Aerial",
        "eyebrow": "Capture every angle",
        "body": "Plan aerial paths, shot zones, markers, and preview coverage.",
        "category": "module",
        "routes": ["/drone"],
        "bullets": ["Aerial planning", "Shot lists", "Live preview feed"],
        "action": "Plan Drone Shots",
        "bg": "#061c20",
        "mid": "#12343b",
        "accent": "#43d6e8",
        "accent2": "#f09c4b",
        "visual": "drone",
    },
    {
        "slug": "vr-walkthrough",
        "title": "VR Walkthrough",
        "eyebrow": "Experience before it is real",
        "body": "Preview ceremonial spaces, hotspots, and client walkthroughs.",
        "category": "module",
        "routes": ["/vr"],
        "bullets": ["Immersive tours", "Interactive hotspots", "Client preview"],
        "action": "Start VR Tour",
        "bg": "#071527",
        "mid": "#142a4e",
        "accent": "#62a7ff",
        "accent2": "#d9aa46",
        "visual": "vr",
    },
    {
        "slug": "exports-boards",
        "title": "Exports & Boards",
        "eyebrow": "Professional export packages",
        "body": "Generate local preview boards, reports, and scene packages.",
        "category": "module",
        "routes": ["/exports"],
        "bullets": ["CAD exports", "BOM reports", "Presentation boards"],
        "action": "Create Exports",
        "bg": "#161106",
        "mid": "#2f230d",
        "accent": "#d9aa46",
        "accent2": "#fff0bd",
        "visual": "boards",
    },
    {
        "slug": "observatory",
        "title": "Observatory",
        "eyebrow": "Real-time insights",
        "body": "Track preview release status, evidence, blockers, and project health.",
        "category": "module",
        "routes": ["/observatory", "/support"],
        "bullets": ["Project health", "Risk monitor", "AI insights"],
        "action": "Open Observatory",
        "bg": "#061719",
        "mid": "#0f3030",
        "accent": "#48d9d0",
        "accent2": "#7dd36e",
        "visual": "observatory",
    },
    {
        "slug": "ai-co-pilot",
        "title": "AI Co-Pilot",
        "eyebrow": "Partner in every decision",
        "body": "Suggest concepts, analyze budgets, and check local forecast context.",
        "category": "module",
        "routes": ["/ai"],
        "bullets": ["Smart recommendations", "Budget advisor", "Risk analyzer"],
        "action": "Chat with AI",
        "bg": "#16071f",
        "mid": "#2f0e46",
        "accent": "#d56cff",
        "accent2": "#ff72df",
        "visual": "ai",
    },
    {
        "slug": "assets-library",
        "title": "Assets Library",
        "eyebrow": "Reusable local preview assets",
        "body": "Browse generated meshes, furniture, decor, lighting, and boards.",
        "category": "module",
        "routes": ["/assets", "/gallery"],
        "bullets": ["3D models", "Textures and materials", "Decor and furniture"],
        "action": "Browse Assets",
        "bg": "#071607",
        "mid": "#172d11",
        "accent": "#8ed06c",
        "accent2": "#d9aa46",
        "visual": "assets",
    },
    {
        "slug": "templates",
        "title": "Templates",
        "eyebrow": "Professional setups for every need",
        "body": "Load Vedic, royal, garden, Navagraha, and sci-fi layouts.",
        "category": "module",
        "routes": ["/templates"],
        "bullets": ["Wedding templates", "Layout templates", "Report templates"],
        "action": "Explore Templates",
        "bg": "#191504",
        "mid": "#372d0b",
        "accent": "#ead15c",
        "accent2": "#d9aa46",
        "visual": "templates",
    },
    {
        "slug": "admin-panel",
        "title": "Admin Panel",
        "eyebrow": "Control, monitor, scale",
        "body": "Manage users, system health, blockers, and preview release gates.",
        "category": "module",
        "routes": ["/admin", "/auth"],
        "bullets": ["User management", "System health", "Business insights"],
        "action": "Open Admin Panel",
        "bg": "#061526",
        "mid": "#10284a",
        "accent": "#6bb6ff",
        "accent2": "#d9aa46",
        "visual": "admin",
    },
    {
        "slug": "settings",
        "title": "Settings",
        "eyebrow": "Customize, configure, make it yours",
        "body": "Set themes, preferences, integrations, and local security options.",
        "category": "workspace",
        "routes": ["/dashboard/settings", "/admin/settings"],
        "bullets": ["Preferences", "Integrations", "Security"],
        "action": "Open Settings",
        "bg": "#061117",
        "mid": "#142332",
        "accent": "#8ab7ff",
        "accent2": "#d9aa46",
        "visual": "settings",
    },
    {
        "slug": "cad-editor",
        "title": "CAD Editor",
        "eyebrow": "Design with precision",
        "body": "Create scene graphs, inspect objects, assign materials, and save JSON.",
        "category": "runtime",
        "routes": ["/cad", "/cad/editor"],
        "bullets": ["3D authoring", "Accurate and smart", "Open CAD editor"],
        "action": "Open CAD Editor",
        "bg": "#061321",
        "mid": "#122840",
        "accent": "#75b8ff",
        "accent2": "#d9aa46",
        "visual": "cad",
    },
    {
        "slug": "board-composer",
        "title": "Board Composer",
        "eyebrow": "Beautiful boards that tell your story",
        "body": "Compose board packages from scene, render, budget, and BOM data.",
        "category": "runtime",
        "routes": ["/exports/boards", "/contact", "/about", "/blog", "/features"],
        "bullets": ["Drag and drop", "Smart layouts", "Print and share"],
        "action": "Create Board",
        "bg": "#1b1207",
        "mid": "#392710",
        "accent": "#d9aa46",
        "accent2": "#ffdf94",
        "visual": "composer",
    },
]


COLUMNS = [(6, 510), (516, 1019), (1025, 1529)]
ROWS = [(53, 205), (210, 361), (367, 514), (519, 658), (661, 792), (797, 923), (927, 1021)]


def main() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    HIRES_DIR.mkdir(parents=True, exist_ok=True)
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    EVIDENCE_PATH.parent.mkdir(parents=True, exist_ok=True)

    source_size = {"width": 0, "height": 0}
    if SOURCE.exists():
        with Image.open(SOURCE) as source:
            source_size = {"width": source.width, "height": source.height}

    records = []
    for index, banner in enumerate(BANNERS):
        row = index // 3
        column = index % 3
        left, right = COLUMNS[column]
        top, bottom = ROWS[row]
        reference_crop = {"x": left, "y": top, "width": right - left + 1, "height": bottom - top + 1}

        image = render_banner(index, banner)
        raw_path = RAW_DIR / f"{banner['slug']}.png"
        hires_path = HIRES_DIR / f"{banner['slug']}.webp"
        image.save(raw_path, "PNG", optimize=True)
        image.save(hires_path, "WEBP", quality=94, method=6)
        records.append(
            {
                "id": f"hero-{banner['slug']}",
                "slug": banner["slug"],
                "title": banner["title"],
                "category": banner["category"],
                "status": "READY",
                "generationMode": "GENERATED_HIRES_FROM_REFERENCE",
                "sourceBoard": str(SOURCE),
                "sourceCrop": reference_crop,
                "rawImage": f"/hero-banners/raw/{banner['slug']}.png",
                "hiresImage": f"/hero-banners/hires/{banner['slug']}.webp",
                "hiresSize": {"width": WIDTH, "height": HEIGHT},
                "routes": banner["routes"],
                "evidenceRef": "release/evidence/hero-banners.json",
            }
        )

    registry = {
        "generatedAt": "2026-06-09T00:00:00.000Z",
        "status": "READY",
        "generationMode": "GENERATED_HIRES_FROM_REFERENCE",
        "source": str(SOURCE),
        "sourceSize": source_size,
        "count": len(records),
        "hiresSize": {"width": WIDTH, "height": HEIGHT},
        "records": records,
    }
    DATA_PATH.write_text(json.dumps(registry, indent=2) + "\n")

    evidence = {
        "generatedAt": "2026-06-09T00:00:00.000Z",
        "verdict": "CONTROLLED_PREVIEW_READY",
        "productionReady": False,
        "status": "READY",
        "generationMode": "GENERATED_HIRES_FROM_REFERENCE",
        "assetTruth": "Generated high-res local preview raster banners based on the supplied board reference. These are not live marketplace assets, stock photographs, or production-certified CAD deliverables.",
        "source": str(SOURCE),
        "sourceSize": source_size,
        "heroBannerCount": len(records),
        "rawOutputDir": "public/hero-banners/raw",
        "hiresOutputDir": "public/hero-banners/hires",
        "hiresSize": registry["hiresSize"],
        "records": [
            {
                "id": record["id"],
                "title": record["title"],
                "generationMode": record["generationMode"],
                "rawImage": record["rawImage"],
                "hiresImage": record["hiresImage"],
                "routes": record["routes"],
            }
            for record in records
        ],
    }
    EVIDENCE_PATH.write_text(json.dumps(evidence, indent=2) + "\n")
    print(f"hero:banners generated {len(records)} high-res local preview banners to {HIRES_DIR.relative_to(ROOT)}")


def render_banner(index: int, banner: Banner) -> Image.Image:
    random.seed(f"tlp-hero-{banner['slug']}")
    bg = hex_to_rgb(banner["bg"])
    mid = hex_to_rgb(banner["mid"])
    accent = hex_to_rgb(banner["accent"])
    accent2 = hex_to_rgb(banner["accent2"])
    image = Image.new("RGB", (WIDTH, HEIGHT), bg)
    pixels = image.load()
    for y in range(HEIGHT):
        for x in range(WIDTH):
            horizontal = x / (WIDTH - 1)
            vertical = y / (HEIGHT - 1)
            glow = max(0.0, 1.0 - math.dist((horizontal, vertical), (0.74, 0.42)) / 0.74)
            shade = 0.62 + 0.2 * horizontal - 0.18 * vertical
            base = mix(bg, mid, horizontal * 0.78)
            base = mix(base, accent, glow * 0.17)
            pixels[x, y] = tuple(clamp(int(channel * shade)) for channel in base)

    draw = ImageDraw.Draw(image, "RGBA")
    draw_background_grid(draw, accent, accent2)
    draw_light_flares(image, accent, accent2)
    draw_text_panel(draw, banner, accent, accent2)
    visual = VISUALS[banner["visual"]]
    visual(draw, accent, accent2)
    draw_border(draw, accent)
    return image.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120, threshold=3))


def draw_text_panel(draw: ImageDraw.ImageDraw, banner: Banner, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    serif_title = font(SERIF_FONT, 64)
    sans_eyebrow = font(SANS_FONT, 23)
    sans_body = font(SANS_FONT, 29)
    sans_small = font(SANS_FONT, 22)
    sans_button = font(SANS_FONT, 21)

    panel = (0, 0, 720, HEIGHT)
    draw.rectangle(panel, fill=(0, 0, 0, 132))
    for i in range(70):
        alpha = int(110 * (1 - i / 70))
        draw.line((720 + i * 4, 0, 720 + i * 4, HEIGHT), fill=(0, 0, 0, alpha), width=4)

    draw.line((56, 58, 204, 58), fill=(*accent, 170), width=2)
    draw.text((56, 86), banner["title"], fill=(255, 246, 223, 255), font=serif_title)
    draw.text((58, 168), banner["eyebrow"].upper(), fill=(*accent, 245), font=sans_eyebrow)

    body_lines = wrap_text(draw, banner["body"], sans_body, 520)
    body_y = 212
    for line in body_lines:
        draw.text((58, body_y), line, fill=(245, 238, 218, 220), font=sans_body)
        body_y += 36

    bullet_y = 318
    for bullet in banner["bullets"]:
        draw.ellipse((60, bullet_y + 4, 78, bullet_y + 22), outline=(*accent2, 235), width=2)
        draw.ellipse((66, bullet_y + 10, 72, bullet_y + 16), fill=(*accent, 235))
        draw.text((94, bullet_y), bullet, fill=(255, 255, 255, 218), font=sans_small)
        bullet_y += 42

    button = (58, 476, 320, 532)
    draw.rounded_rectangle(button, radius=9, fill=(*accent, 198), outline=(*accent2, 210), width=1)
    draw.text((88, 492), banner["action"], fill=(20, 16, 8, 255), font=sans_button)


def draw_background_grid(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    for x in range(720, WIDTH, 78):
        draw.line((x, 0, x - 300, HEIGHT), fill=(*accent, 22), width=1)
    for y in range(36, HEIGHT, 58):
        draw.line((690, y, WIDTH, y + 38), fill=(*accent2, 20), width=1)
    for _ in range(44):
        x = random.randint(760, WIDTH - 50)
        y = random.randint(40, HEIGHT - 40)
        r = random.randint(1, 3)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(*accent2, random.randint(70, 150)))


def draw_light_flares(image: Image.Image, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay, "RGBA")
    for x, y, radius, color in [
        (1370, 230, 250, accent),
        (1650, 410, 180, accent2),
        (880, 120, 130, accent2),
    ]:
        for step in range(radius, 0, -8):
            alpha = int(30 * (step / radius) ** 2)
            draw.ellipse((x - step, y - step, x + step, y + step), fill=(*color, alpha))
    image.paste(Image.alpha_composite(image.convert("RGBA"), overlay).convert("RGB"))


def draw_border(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int]) -> None:
    draw.rounded_rectangle((8, 8, WIDTH - 9, HEIGHT - 9), radius=14, outline=(*accent, 205), width=2)
    draw.rounded_rectangle((18, 18, WIDTH - 19, HEIGHT - 19), radius=12, outline=(255, 255, 255, 38), width=1)
    draw.line((WIDTH - 315, 44, WIDTH - 160, 44), fill=(*accent, 150), width=2)
    draw.line((WIDTH - 116, 44, WIDTH - 44, 44), fill=(*accent, 120), width=2)


def draw_site(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    x0, y0 = 860, 85
    w, h = 870, 420
    draw.rounded_rectangle((x0, y0, x0 + w, y0 + h), radius=28, fill=(5, 31, 20, 178), outline=(*accent, 120), width=2)
    for i in range(9):
        x = x0 + 40 + i * 92
        draw.line((x, y0 + 28, x, y0 + h - 28), fill=(*accent, 44), width=1)
    for i in range(5):
        y = y0 + 45 + i * 72
        draw.line((x0 + 28, y, x0 + w - 28, y), fill=(*accent, 44), width=1)
    draw.rectangle((x0 + 345, y0 + 150, x0 + 525, y0 + 285), fill=(*accent2, 70), outline=(*accent2, 180), width=2)
    draw.ellipse((x0 + 385, y0 + 172, x0 + 485, y0 + 272), outline=(*accent, 220), width=5)
    for i in range(34):
        x = x0 + random.randint(60, w - 60)
        y = y0 + random.randint(60, h - 60)
        draw.ellipse((x - 9, y - 9, x + 9, y + 9), fill=(*accent, 135))
    for i in range(7):
        draw.line((x0 + 80 + i * 110, y0 + h - 28, x0 + 140 + i * 110, y0 + 330), fill=(*accent2, 150), width=7)


def draw_mandap(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    cx, base_y = 1320, 438
    draw.rounded_rectangle((860, base_y, 1768, base_y + 52), radius=10, fill=(210, 144, 65, 95), outline=(*accent2, 190), width=2)
    draw.rounded_rectangle((930, base_y - 56, 1698, base_y), radius=12, fill=(245, 196, 132, 45), outline=(*accent, 170), width=2)
    for x in [970, 1140, 1500, 1670]:
        draw.rounded_rectangle((x - 22, 180, x + 22, base_y - 15), radius=8, fill=(*accent2, 120), outline=(255, 239, 190, 180), width=2)
        draw.ellipse((x - 34, 154, x + 34, 198), fill=(*accent, 130), outline=(255, 239, 190, 190), width=2)
    draw.arc((1005, 45, 1635, 315), 190, 350, fill=(*accent, 235), width=10)
    draw.arc((1080, 72, 1560, 302), 195, 345, fill=(*accent2, 180), width=5)
    for i in range(24):
        x = 930 + i * 34
        y = 124 + 18 * math.sin(i / 2)
        draw.ellipse((x - 13, y - 13, x + 13, y + 13), fill=flower_color(i, accent, accent2))
    draw.ellipse((cx - 86, base_y - 118, cx + 86, base_y - 32), fill=(250, 235, 210, 160), outline=(*accent2, 180), width=3)
    draw.ellipse((cx - 135, base_y - 102, cx - 40, base_y - 42), fill=(245, 236, 220, 105), outline=(*accent2, 130), width=2)
    draw.ellipse((cx + 40, base_y - 102, cx + 135, base_y - 42), fill=(245, 236, 220, 105), outline=(*accent2, 130), width=2)


def draw_floral(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    draw_mandap(draw, accent, accent2)
    for i in range(170):
        x = random.randint(830, 1810)
        y = random.randint(48, 360)
        r = random.randint(7, 24)
        color = flower_color(i, accent, accent2)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=color, outline=(255, 255, 255, 38))
    for x in range(900, 1780, 80):
        length = random.randint(80, 180)
        draw.line((x, 88, x + random.randint(-8, 8), 88 + length), fill=(115, 170, 92, 140), width=5)
        draw.ellipse((x - 8, 88 + length - 8, x + 8, 88 + length + 8), fill=(*accent2, 160))


def draw_lighting(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    stage_y = 445
    draw.rounded_rectangle((850, stage_y, 1780, stage_y + 48), radius=12, fill=(0, 0, 0, 170), outline=(*accent, 170), width=2)
    for x in range(880, 1760, 110):
        color = accent if (x // 110) % 2 else accent2
        draw.polygon([(x, 80), (x + 36, 80), (x + 120, stage_y), (x - 84, stage_y)], fill=(*color, 44))
        draw.ellipse((x - 7, 72, x + 43, 103), fill=(*color, 175), outline=(255, 255, 255, 120), width=1)
    for x in range(960, 1700, 185):
        draw.rectangle((x - 24, stage_y - 160, x + 24, stage_y), fill=(*accent, 82), outline=(*accent2, 160), width=2)


def draw_blueprint(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    x0, y0 = 820, 80
    for i in range(12):
        x = x0 + i * 78
        draw.line((x, y0, x, 505), fill=(*accent, 55), width=1)
    for i in range(7):
        y = y0 + i * 64
        draw.line((x0, y, 1810, y), fill=(*accent2, 44), width=1)
    for i, rect in enumerate([(900, 150, 1160, 300), (1210, 145, 1460, 275), (1040, 330, 1360, 460), (1500, 260, 1740, 440)]):
        color = accent if i % 2 else accent2
        draw.rounded_rectangle(rect, radius=8, outline=(*color, 210), width=5)
        draw.line((rect[0], rect[1], rect[2], rect[3]), fill=(*accent, 88), width=2)
        draw.line((rect[2], rect[1], rect[0], rect[3]), fill=(*accent2, 88), width=2)


def draw_budget(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    cx, cy = 1030, 292
    for start, end, color in [(20, 165, accent), (165, 282, accent2), (282, 380, (60, 130, 210))]:
        draw.arc((cx - 150, cy - 150, cx + 150, cy + 150), start, end, fill=(*color, 235), width=38)
    draw.ellipse((cx - 88, cy - 88, cx + 88, cy + 88), fill=(5, 18, 14, 210), outline=(255, 255, 255, 42))
    chart_x = 1250
    for i in range(10):
        x = chart_x + i * 54
        h = 60 + i * 23
        draw.rounded_rectangle((x, 468 - h, x + 28, 468), radius=5, fill=(*accent, 90 + i * 10))
        draw.line((x + 14, 468 - h, x + 65, 428 - h + random.randint(-18, 22)), fill=(*accent2, 180), width=3)
    draw.line((chart_x, 468, 1810, 468), fill=(*accent2, 115), width=2)


def draw_seating(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    for row in range(4):
        for col in range(7):
            cx = 880 + col * 126 + (row % 2) * 38
            cy = 150 + row * 78
            draw.ellipse((cx - 32, cy - 32, cx + 32, cy + 32), fill=(255, 236, 190, 52), outline=(*accent2, 130), width=2)
            for a in range(0, 360, 60):
                x = cx + math.cos(math.radians(a)) * 50
                y = cy + math.sin(math.radians(a)) * 50
                draw.rounded_rectangle((x - 10, y - 10, x + 10, y + 10), radius=4, fill=(*accent, 115))
    draw.rounded_rectangle((1450, 162, 1765, 348), radius=16, fill=(*accent, 58), outline=(*accent2, 150), width=2)


def draw_vendor(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    draw.rounded_rectangle((860, 232, 1260, 348), radius=52, fill=(*accent, 115), outline=(255, 236, 190, 95), width=2)
    draw.rounded_rectangle((1320, 232, 1720, 348), radius=52, fill=(*accent2, 115), outline=(255, 236, 190, 95), width=2)
    draw.ellipse((1190, 210, 1390, 390), fill=(255, 238, 205, 145), outline=(*accent, 190), width=3)
    for i in range(10):
        x = 1140 + i * 42
        y = 420 + random.randint(-20, 20)
        draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill=(*accent2, 180))


def draw_gantt(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    x0, y0 = 840, 105
    for i in range(7):
        y = y0 + i * 58
        draw.line((x0, y, 1790, y), fill=(*accent, 35), width=1)
        start = x0 + random.randint(0, 380)
        end = start + random.randint(140, 410)
        color = accent if i % 2 else accent2
        draw.rounded_rectangle((start, y + 18, end, y + 38), radius=8, fill=(*color, 210))
    draw.line((x0, y0 + 425, 1790, y0 + 425), fill=(*accent2, 90), width=2)


def draw_drone(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    cx, cy = 1340, 240
    draw.rounded_rectangle((cx - 100, cy - 32, cx + 100, cy + 32), radius=24, fill=(*accent, 175), outline=(255, 255, 255, 80), width=2)
    for dx, dy in [(-260, -120), (260, -120), (-260, 120), (260, 120)]:
        x, y = cx + dx, cy + dy
        draw.line((cx, cy, x, y), fill=(*accent2, 160), width=8)
        draw.ellipse((x - 78, y - 22, x + 78, y + 22), outline=(*accent2, 220), width=5)
        draw.ellipse((x - 14, y - 14, x + 14, y + 14), fill=(*accent, 230))
    draw_site(draw, tuple(int(c * 0.7) for c in accent), accent2)


def draw_vr(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    draw.rounded_rectangle((850, 150, 1250, 360), radius=60, fill=(5, 18, 26, 210), outline=(*accent, 230), width=5)
    draw.rounded_rectangle((910, 206, 1190, 306), radius=38, fill=(*accent, 55), outline=(*accent2, 135), width=2)
    draw_mandap(draw, accent2, accent)


def draw_boards(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    for i in range(8):
        x = 900 + i * 105
        y = 140 + (i % 3) * 28
        draw.rounded_rectangle((x, y, x + 180, y + 240), radius=8, fill=(238, 225, 197, 210), outline=(*accent, 150), width=2)
        draw.rectangle((x + 16, y + 18, x + 164, y + 92), fill=(*accent2, 80))
        draw.line((x + 18, y + 122, x + 160, y + 122), fill=(70, 52, 34, 125), width=2)
        draw.line((x + 18, y + 150, x + 132, y + 150), fill=(70, 52, 34, 90), width=2)


def draw_observatory(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    for i in range(6):
        x = 850 + (i % 3) * 300
        y = 100 + (i // 3) * 205
        draw.rounded_rectangle((x, y, x + 260, y + 155), radius=14, fill=(0, 0, 0, 96), outline=(*accent, 95), width=2)
        points = []
        for j in range(8):
            px = x + 24 + j * 30
            py = y + 120 - random.randint(20, 96)
            points.append((px, py))
            draw.ellipse((px - 3, py - 3, px + 3, py + 3), fill=(*accent2, 210))
        draw.line(points, fill=(*accent2, 200), width=3)


def draw_ai(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    cx, cy = 1130, 292
    draw.ellipse((cx - 138, cy - 170, cx + 118, cy + 125), outline=(*accent, 220), width=5)
    draw.arc((cx - 80, cy - 88, cx + 150, cy + 165), 290, 110, fill=(*accent2, 180), width=5)
    for i in range(34):
        x = 1320 + random.randint(0, 430)
        y = 110 + random.randint(0, 330)
        draw.rounded_rectangle((x, y, x + 260, y + 34), radius=9, fill=(*accent, 38), outline=(*accent, 82), width=1)


def draw_assets(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    for i in range(18):
        x = 840 + (i % 6) * 148
        y = 100 + (i // 6) * 132
        draw.rounded_rectangle((x, y, x + 116, y + 92), radius=14, fill=(255, 235, 180, 42), outline=(*accent, 110), width=2)
        if i % 3 == 0:
            draw.ellipse((x + 26, y + 22, x + 92, y + 64), outline=(*accent2, 200), width=5)
        elif i % 3 == 1:
            draw.rectangle((x + 28, y + 24, x + 88, y + 70), outline=(*accent2, 200), width=5)
        else:
            draw.polygon([(x + 58, y + 18), (x + 92, y + 70), (x + 24, y + 70)], outline=(*accent2, 200))


def draw_templates(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    names = ["Royal", "Lotus", "Temple", "Garden"]
    for i, name in enumerate(names):
        x = 900 + i * 215
        y = 120 + i * 8
        draw.rounded_rectangle((x, y, x + 178, y + 285), radius=12, fill=(238, 224, 190, 205), outline=(*accent, 170), width=2)
        draw.rectangle((x + 18, y + 26, x + 160, y + 150), fill=(*accent2, 90))
        draw.text((x + 32, y + 184), name, fill=(58, 37, 10, 230), font=font(SERIF_FONT, 28))


def draw_admin(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    draw_observatory(draw, accent, accent2)
    for i in range(4):
        x = 1550
        y = 94 + i * 86
        draw.rounded_rectangle((x, y, x + 230, y + 52), radius=10, fill=(*accent, 55), outline=(*accent2, 100), width=1)


def draw_settings(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    for i in range(3):
        x = 850 + i * 300
        draw.rounded_rectangle((x, 120, x + 260, 360), radius=14, fill=(0, 0, 0, 105), outline=(*accent, 110), width=2)
        for j in range(4):
            y = 165 + j * 42
            draw.line((x + 36, y, x + 210, y), fill=(*accent2, 92), width=4)
            draw.ellipse((x + 84 + j * 24, y - 10, x + 104 + j * 24, y + 10), fill=(*accent, 210))
    for i in range(12):
        x = 890 + i * 64
        draw.rounded_rectangle((x, 420, x + 42, 458), radius=9, fill=palette_color(i), outline=(255, 255, 255, 55), width=1)


def draw_cad(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    x0, y0 = 820, 100
    for i in range(11):
        draw.line((x0 + i * 88, 470, 1160 + i * 88, 170), fill=(*accent, 44), width=1)
    for i in range(7):
        draw.line((x0, 470 - i * 48, 1780, 470 - i * 48), fill=(*accent2, 38), width=1)
    draw.polygon([(1040, 380), (1320, 260), (1610, 380), (1320, 505)], fill=(*accent, 45), outline=(*accent2, 180))
    draw_mandap(draw, accent, accent2)
    draw.rounded_rectangle((1580, 100, 1810, 392), radius=12, fill=(0, 0, 0, 130), outline=(*accent, 110), width=2)
    for i in range(7):
        y = 132 + i * 34
        draw.line((1604, y, 1786, y), fill=(*accent2, 92), width=2)


def draw_composer(draw: ImageDraw.ImageDraw, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> None:
    draw_boards(draw, accent, accent2)
    draw.rounded_rectangle((1360, 112, 1780, 445), radius=20, fill=(248, 232, 196, 215), outline=(*accent, 190), width=2)
    for i in range(4):
        x = 1390 + (i % 2) * 180
        y = 150 + (i // 2) * 126
        draw.rectangle((x, y, x + 145, y + 90), fill=(*accent2, 70), outline=(95, 68, 32, 120), width=1)


VISUALS: dict[str, Callable[[ImageDraw.ImageDraw, tuple[int, int, int], tuple[int, int, int]], None]] = {
    "venue": draw_site,
    "site": draw_site,
    "mandap": draw_mandap,
    "blueprint": draw_blueprint,
    "floral": draw_floral,
    "lighting": draw_lighting,
    "budget": draw_budget,
    "seating": draw_seating,
    "vendor": draw_vendor,
    "gantt": draw_gantt,
    "drone": draw_drone,
    "vr": draw_vr,
    "boards": draw_boards,
    "observatory": draw_observatory,
    "ai": draw_ai,
    "assets": draw_assets,
    "templates": draw_templates,
    "admin": draw_admin,
    "settings": draw_settings,
    "cad": draw_cad,
    "composer": draw_composer,
}


def wrap_text(draw: ImageDraw.ImageDraw, text: str, text_font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=text_font)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def mix(a: tuple[int, int, int], b: tuple[int, int, int], amount: float) -> tuple[int, int, int]:
    amount = max(0.0, min(1.0, amount))
    return tuple(int(a[i] * (1 - amount) + b[i] * amount) for i in range(3))


def clamp(value: int) -> int:
    return max(0, min(255, value))


def flower_color(index: int, accent: tuple[int, int, int], accent2: tuple[int, int, int]) -> tuple[int, int, int, int]:
    palette = [
        (*accent, 205),
        (*accent2, 210),
        (255, 210, 225, 220),
        (255, 245, 214, 205),
        (190, 80, 96, 205),
        (110, 170, 100, 180),
    ]
    return palette[index % len(palette)]


def palette_color(index: int) -> tuple[int, int, int, int]:
    colors = [
        "#ef4d93",
        "#ff6b69",
        "#ffc247",
        "#f59e0b",
        "#28c7d8",
        "#fb923c",
        "#a855f7",
        "#6b7280",
        "#d9aa46",
        "#84cc16",
        "#38bdf8",
        "#f8d78b",
    ]
    return (*hex_to_rgb(colors[index % len(colors)]), 220)


if __name__ == "__main__":
    main()
