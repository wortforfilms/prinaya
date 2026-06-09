from __future__ import annotations

import json
import os
import shutil
from pathlib import Path
from typing import TypedDict

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(os.environ.get("TLPS_HOMEPAGE_SOURCE", "/Users/vesahe/Downloads/TLPS_All_Generated_Images_Descriptive/TLPS_Wedding_OS_Homepage.png"))
OUT_DIR = ROOT / "public" / "tlps-wedding-os" / "homepage"
DATA_PATH = ROOT / "data" / "tlps-wedding-os-homepage.json"
EVIDENCE_PATH = ROOT / "release" / "evidence" / "tlps-wedding-os-homepage.json"


class Crop(TypedDict):
    id: str
    label: str
    x: int
    y: int
    width: int
    height: int


SECTIONS: list[Crop] = [
    {"id": "hero", "label": "Hero Header", "x": 0, "y": 0, "width": 864, "height": 386},
    {"id": "ecosystem", "label": "Complete Wedding Ecosystem", "x": 0, "y": 386, "width": 864, "height": 123},
    {"id": "destinations", "label": "Destination Weddings", "x": 0, "y": 509, "width": 864, "height": 211},
    {"id": "design-studio", "label": "Wedding Design Studio", "x": 0, "y": 720, "width": 864, "height": 205},
    {"id": "film-studio", "label": "Wedding Filmy Studio", "x": 0, "y": 925, "width": 864, "height": 210},
    {"id": "signature-experiences", "label": "Signature Experiences", "x": 0, "y": 1135, "width": 864, "height": 138},
    {"id": "stats-band", "label": "Stats Band", "x": 0, "y": 1273, "width": 864, "height": 75},
    {"id": "why-ai", "label": "Why Choose and AI Co-Pilot", "x": 0, "y": 1348, "width": 864, "height": 204},
    {"id": "cta", "label": "Love Story CTA", "x": 0, "y": 1552, "width": 864, "height": 103},
    {"id": "footer", "label": "Footer", "x": 0, "y": 1655, "width": 864, "height": 166},
]

DESTINATION_CARDS: list[Crop] = [
    {"id": "udaipur", "label": "Udaipur", "x": 28, "y": 558, "width": 110, "height": 138},
    {"id": "jaipur", "label": "Jaipur", "x": 145, "y": 558, "width": 110, "height": 138},
    {"id": "goa", "label": "Goa", "x": 262, "y": 558, "width": 110, "height": 138},
    {"id": "bali", "label": "Bali", "x": 379, "y": 558, "width": 110, "height": 138},
    {"id": "dubai", "label": "Dubai", "x": 496, "y": 558, "width": 110, "height": 138},
    {"id": "santorini", "label": "Santorini", "x": 613, "y": 558, "width": 110, "height": 138},
    {"id": "italy", "label": "Italy", "x": 730, "y": 558, "width": 110, "height": 138},
]

DESIGN_CARDS: list[Crop] = [
    {"id": "two-d-plans", "label": "2D Plans", "x": 151, "y": 762, "width": 166, "height": 136},
    {"id": "three-d-visuals", "label": "3D Visuals", "x": 326, "y": 762, "width": 166, "height": 136},
    {"id": "vr-walkthroughs", "label": "VR Walkthroughs", "x": 501, "y": 762, "width": 166, "height": 136},
    {"id": "board-generation", "label": "Board Generation", "x": 676, "y": 762, "width": 164, "height": 136},
]

FILM_CARDS: list[Crop] = [
    {"id": "pre-wedding-films", "label": "Pre Wedding Films", "x": 28, "y": 967, "width": 94, "height": 126},
    {"id": "wedding-teasers", "label": "Wedding Teasers", "x": 129, "y": 967, "width": 94, "height": 126},
    {"id": "highlights", "label": "Highlights", "x": 230, "y": 967, "width": 94, "height": 126},
    {"id": "full-wedding-films", "label": "Full Wedding Films", "x": 331, "y": 967, "width": 94, "height": 126},
    {"id": "wedding-reels", "label": "Wedding Reels", "x": 432, "y": 967, "width": 94, "height": 126},
    {"id": "drone-films", "label": "Drone Films", "x": 534, "y": 967, "width": 94, "height": 126},
    {"id": "destination-films", "label": "Destination Films", "x": 636, "y": 967, "width": 94, "height": 126},
    {"id": "celebrity-style-films", "label": "Celebrity Style Films", "x": 738, "y": 967, "width": 94, "height": 126},
]


def main() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(f"TLPS homepage source not found: {SOURCE}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    EVIDENCE_PATH.parent.mkdir(parents=True, exist_ok=True)

    source = Image.open(SOURCE).convert("RGB")
    full_page_path = OUT_DIR / "full-page.png"
    shutil.copyfile(SOURCE, full_page_path)

    section_records = crop_many(source, SECTIONS, "sections")
    destination_records = crop_many(source, DESTINATION_CARDS, "destinations")
    design_records = crop_many(source, DESIGN_CARDS, "design-studio")
    film_records = crop_many(source, FILM_CARDS, "film-studio")

    registry = {
        "generatedAt": "2026-06-09T00:00:00.000Z",
        "status": "READY",
        "verdict": "CONTROLLED_PREVIEW_READY",
        "productionReady": False,
        "source": str(SOURCE),
        "sourceSize": {"width": source.width, "height": source.height},
        "route": "/wedding-os",
        "fullPageImage": "/tlps-wedding-os/homepage/full-page.png",
        "sections": section_records,
        "destinationCards": destination_records,
        "designStudioCards": design_records,
        "filmCards": film_records,
        "navigation": ["Home", "Experiences", "Destinations", "Design Studio", "Wedding Films", "Services", "Marketplace", "About Us", "Contact"],
        "hero": {
            "brand": "TLPS Wedding OS",
            "headline": "From destination scouting to wedding films.",
            "subcopy": "One platform. One production team. One unforgettable experience.",
            "tagline": "Plan · Design · Film · Execute",
            "actions": ["Plan My Wedding", "Explore Experiences", "Watch Wedding Films"]
        },
        "floatingActions": ["WhatsApp", "Call Us", "Enquire", "Brochure"],
        "ecosystemModules": [
            "Destination Weddings",
            "Venue Design",
            "Mandap Design",
            "Wedding Decor",
            "Flowers & Florals",
            "Lighting Design",
            "Guest Management",
            "Production Planning",
            "Drone Cinematography",
            "Wedding Films",
            "Artist & Entertainment",
            "Hospitality & Logistics"
        ],
        "destinations": [
            {"label": "Udaipur", "subtitle": "The City of Lakes", "assetId": "udaipur"},
            {"label": "Jaipur", "subtitle": "The Pink City", "assetId": "jaipur"},
            {"label": "Goa", "subtitle": "Beach Bliss", "assetId": "goa"},
            {"label": "Bali", "subtitle": "Tropical Paradise", "assetId": "bali"},
            {"label": "Dubai", "subtitle": "Luxury Redefined", "assetId": "dubai"},
            {"label": "Santorini", "subtitle": "Greek Romance", "assetId": "santorini"},
            {"label": "Italy", "subtitle": "Timeless Beauty", "assetId": "italy"}
        ],
        "designStudio": {
            "tools": ["Venue Designer", "Mandap Designer", "Layout Generator", "Floral Designer", "Lighting Designer", "Budget Planner"],
            "cards": [
                {"label": "2D Plans", "assetId": "two-d-plans"},
                {"label": "3D Visuals", "assetId": "three-d-visuals"},
                {"label": "VR Walkthroughs", "assetId": "vr-walkthroughs"},
                {"label": "Board Generation", "assetId": "board-generation"}
            ]
        },
        "filmStudio": [
            {"label": "Pre Wedding Films", "assetId": "pre-wedding-films"},
            {"label": "Wedding Teasers", "assetId": "wedding-teasers"},
            {"label": "Highlights", "assetId": "highlights"},
            {"label": "Full Wedding Films", "assetId": "full-wedding-films"},
            {"label": "Wedding Reels", "assetId": "wedding-reels"},
            {"label": "Drone Films", "assetId": "drone-films"},
            {"label": "Destination Films", "assetId": "destination-films"},
            {"label": "Celebrity Style Films", "assetId": "celebrity-style-films"}
        ],
        "signatureExperiences": ["Proposal Planning", "Mehendi", "Haldi", "Sangeet", "Wedding Ceremony", "Reception", "After Party"],
        "stats": [
            {"value": "750+", "label": "Weddings Planned"},
            {"value": "15+", "label": "Years of Experience"},
            {"value": "50+", "label": "Destinations Worldwide"},
            {"value": "250+", "label": "In-House Experts"},
            {"value": "1000+", "label": "Happy Families"},
            {"value": "24/7", "label": "Dedicated Support"}
        ],
        "whyChoose": [
            "End-to-end wedding planning & execution",
            "In-house design, decor & production team",
            "Award winning wedding filmmakers",
            "Advanced wedding CAD & 3D visualization",
            "Global network & local expertise",
            "24/7 personal wedding concierge"
        ],
        "aiCoPilot": [
            "Suggest theme",
            "Suggest venue",
            "Estimate budget",
            "Generate seating plan",
            "Generate timeline",
            "Generate decor ideas"
        ],
        "cta": {
            "headline": "Let's create your love story",
            "subcopy": "From dreams to reality, we make every detail magical.",
            "tags": ["Destination Wedding", "Traditional Wedding", "Luxury Wedding", "Wedding Film", "Proposal Planning", "Complete Wedding Production"],
            "actions": ["Book Consultation", "Schedule Discovery Call"]
        },
        "footer": {
            "brand": "TLPS Wedding OS",
            "contact": ["+91 98765 43210", "hello@tlpswedding.com", "Mumbai · Delhi · Jaipur · Udaipur · Goa · Dubai · Bali"],
            "links": ["Experiences", "Destinations", "Design Studio", "Wedding Films", "Services", "Marketplace"],
            "services": ["Venue Selection", "Mandap & Decor", "Floral & Lighting", "Guest Management", "Production Planning", "Hospitality & Logistics"],
            "resources": ["Wedding Guide", "Budget Calculator", "Checklist", "Blog", "FAQs", "Contact Us"]
        }
    }

    DATA_PATH.write_text(json.dumps(registry, indent=2) + "\n")

    evidence = {
        "generatedAt": registry["generatedAt"],
        "status": "READY",
        "verdict": registry["verdict"],
        "productionReady": False,
        "source": str(SOURCE),
        "sourceSize": registry["sourceSize"],
        "route": registry["route"],
        "assetTruth": "Local preview extraction from a supplied PNG reference. This does not prove live marketplace, live vendor, payment, or production compliance capabilities.",
        "counts": {
            "sections": len(section_records),
            "destinationCards": len(destination_records),
            "designStudioCards": len(design_records),
            "filmCards": len(film_records),
            "ecosystemModules": len(registry["ecosystemModules"]),
            "stats": len(registry["stats"])
        },
        "outputDir": "public/tlps-wedding-os/homepage",
        "dataRef": "data/tlps-wedding-os-homepage.json"
    }
    EVIDENCE_PATH.write_text(json.dumps(evidence, indent=2) + "\n")
    print(
        "tlps:homepage extracted "
        f"{len(section_records)} sections, {len(destination_records)} destinations, "
        f"{len(design_records)} design cards, {len(film_records)} film cards"
    )


def crop_many(source: Image.Image, crops: list[Crop], folder: str) -> list[dict[str, object]]:
    target = OUT_DIR / folder
    target.mkdir(parents=True, exist_ok=True)
    records = []
    for crop in crops:
        image = source.crop((crop["x"], crop["y"], crop["x"] + crop["width"], crop["y"] + crop["height"]))
        file_name = f"{crop['id']}.png"
        path = target / file_name
        image.save(path, "PNG", optimize=True)
        records.append(
            {
                "id": crop["id"],
                "label": crop["label"],
                "image": f"/tlps-wedding-os/homepage/{folder}/{file_name}",
                "crop": {"x": crop["x"], "y": crop["y"], "width": crop["width"], "height": crop["height"]},
                "status": "READY",
            }
        )
    return records


if __name__ == "__main__":
    main()
