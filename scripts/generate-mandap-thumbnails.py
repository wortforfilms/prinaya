#!/usr/bin/env python3
"""Generate preview SVG thumbnails for Mandap Designer component galleries.

These are procedural luxury preview thumbnails (black/gold), NOT photoreal renders
or vendor assets. Run: npm run assets:mandap-thumbnails
Output: public/generated-assets/mandap-thumbnails/*.svg
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "generated-assets", "mandap-thumbnails")
os.makedirs(OUT, exist_ok=True)

W, H = 480, 320
GOLD = "#d9aa46"
GOLD2 = "#f8d78b"


def frame(body: str, label: str) -> str:
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a1f1b"/><stop offset="1" stop-color="#02100e"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="60%">
      <stop offset="0" stop-color="{GOLD}" stop-opacity="0.22"/><stop offset="1" stop-color="{GOLD}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{GOLD2}"/><stop offset="1" stop-color="{GOLD}"/>
    </linearGradient>
  </defs>
  <rect width="{W}" height="{H}" fill="url(#bg)"/>
  <rect width="{W}" height="{H}" fill="url(#glow)"/>
  <rect x="6" y="6" width="{W-12}" height="{H-12}" rx="10" fill="none" stroke="{GOLD}" stroke-opacity="0.35"/>
  {body}
  <text x="{W/2}" y="{H-22}" text-anchor="middle" fill="{GOLD2}" font-family="Georgia, serif" font-size="20" font-weight="600">{label}</text>
  <text x="{W/2}" y="{H-40}" text-anchor="middle" fill="#9fb5ad" font-family="Arial, sans-serif" font-size="9" letter-spacing="2">PREVIEW · TLPS WEDDING OS</text>
</svg>'''


def pillar_shape(cx, scale=1.0, color="url(#gold)"):
    w = 16 * scale
    return f'''<g fill="{color}">
    <rect x="{cx-w}" y="70" width="{2*w}" height="14" rx="3"/>
    <rect x="{cx-w*0.7}" y="84" width="{1.4*w}" height="120"/>
    <rect x="{cx-w}" y="204" width="{2*w}" height="16" rx="3"/>
    <circle cx="{cx}" cy="64" r="{w*0.7}"/>
  </g>'''


def thumbs():
    out = {}
    # Mandap concept: 4 pillars + canopy arch + platform
    body = (
        f'<path d="M70 120 Q240 30 410 120" fill="none" stroke="url(#gold)" stroke-width="6"/>'
        + pillar_shape(95) + pillar_shape(175, 0.85) + pillar_shape(305, 0.85) + pillar_shape(385)
        + '<rect x="60" y="218" width="360" height="18" rx="5" fill="url(#gold)" opacity="0.9"/>'
        + '<ellipse cx="240" cy="232" rx="70" ry="10" fill="#b7375f" opacity="0.5"/>'
        + ''.join(f'<circle cx="{70+ i*30}" cy="{118 - (1-((i-5.5)/5.5)**2)*44:.0f}" r="5" fill="#b7375f"/>' for i in range(12))
    )
    out["mandap-concept"] = frame(body, "Royal Heritage Mandap")

    out["pillar"] = frame(
        pillar_shape(160, 1.4) + pillar_shape(320, 1.4)
        + '<rect x="120" y="60" width="240" height="8" rx="3" fill="url(#gold)" opacity="0.6"/>',
        "Carved Pillars")

    out["canopy"] = frame(
        '<path d="M50 130 Q240 20 430 130" fill="none" stroke="url(#gold)" stroke-width="8"/>'
        '<path d="M70 128 Q120 230 95 250" fill="none" stroke="#b7375f" stroke-width="6" opacity="0.7"/>'
        '<path d="M410 128 Q360 230 385 250" fill="none" stroke="#b7375f" stroke-width="6" opacity="0.7"/>'
        '<path d="M150 96 Q240 70 330 96 L330 110 Q240 86 150 110 Z" fill="url(#gold)" opacity="0.85"/>'
        + ''.join(f'<circle cx="{60+i*32}" cy="{130-(1-((i-5.8)/5.8)**2)*92:.0f}" r="6" fill="{GOLD2}"/>' for i in range(13)),
        "Canopy & Roofs")

    out["backdrop"] = frame(
        '<rect x="110" y="70" width="260" height="150" rx="8" fill="none" stroke="url(#gold)" stroke-width="5"/>'
        + ''.join(f'<rect x="{122+i*40}" y="82" width="30" height="126" rx="4" fill="{GOLD}" opacity="{0.15+0.12*(i%3)}"/>' for i in range(6))
        + '<circle cx="240" cy="145" r="34" fill="none" stroke="#b7375f" stroke-width="4"/>',
        "Backdrops")

    out["decor"] = frame(
        # kalash
        '<path d="M150 200 Q120 150 150 120 Q180 100 210 120 Q240 150 210 200 Z" fill="url(#gold)"/>'
        '<ellipse cx="180" cy="118" rx="34" ry="10" fill="#b7375f"/>'
        '<circle cx="180" cy="100" r="12" fill="{0}"/>'.format(GOLD2)
        # diyas
        + ''.join(f'<g><path d="M{290+i*40} 200 q15 14 30 0 z" fill="url(#gold)"/><circle cx="{305+i*40}" cy="190" r="5" fill="#ff9b3d"/></g>' for i in range(3)),
        "Decor & Props")

    out["lighting"] = frame(
        '<line x1="240" y1="30" x2="240" y2="78" stroke="url(#gold)" stroke-width="4"/>'
        '<ellipse cx="240" cy="92" rx="60" ry="18" fill="url(#gold)" opacity="0.9"/>'
        + ''.join(f'<line x1="{200+i*16}" y1="100" x2="{200+i*16}" y2="150" stroke="{GOLD2}" stroke-width="2"/>' for i in range(6))
        + ''.join(f'<circle cx="{200+i*16}" cy="155" r="4" fill="#ffd98a"/>' for i in range(6))
        + ''.join(f'<polygon points="240,92 {120+i*120},230 {150+i*120},230" fill="{GOLD}" opacity="0.08"/>' for i in range(3)),
        "Lighting Design")

    out["floral"] = frame(
        ''.join(
            f'<g transform="translate({110+i*65},{140 if i%2==0 else 175})">'
            + ''.join(f'<ellipse cx="0" cy="0" rx="13" ry="6" transform="rotate({a})" fill="{["#b7375f","#e06a8b","#f0a93f","#f3d27a"][i%4]}" opacity="0.85"/>' for a in range(0,180,36))
            + '<circle r="5" fill="{0}"/></g>'.format(GOLD2)
            for i in range(5))
        + '<path d="M70 210 Q240 250 410 210" fill="none" stroke="#36715d" stroke-width="6"/>',
        "Floral & Greens")

    out["stage"] = frame(
        '<rect x="80" y="150" width="320" height="60" rx="6" fill="url(#gold)" opacity="0.85"/>'
        '<rect x="120" y="80" width="240" height="70" rx="4" fill="none" stroke="{0}" stroke-width="4"/>'.format(GOLD2)
        + '<rect x="170" y="120" width="140" height="30" rx="4" fill="#176f8f" opacity="0.6"/>'
        + '<ellipse cx="240" cy="210" rx="150" ry="12" fill="{0}" opacity="0.3"/>'.format(GOLD),
        "Stage Design")
    return out


count = 0
for name, svg in thumbs().items():
    with open(os.path.join(OUT, f"{name}.svg"), "w") as f:
        f.write(svg)
    count += 1
print(f"generated {count} mandap thumbnails -> public/generated-assets/mandap-thumbnails/")
