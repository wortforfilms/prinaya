#!/usr/bin/env python3
"""
Generate photoreal imagery for the Spark Planners deck using OpenAI's image
model (gpt-image-1), then rebuild the deck so it picks the images up.

WHY THIS RUNS LOCALLY (not inside Cowork):
  The Cowork sandbox has no network route to api.openai.com, so image
  generation must run on your machine, where your API key and internet live.

PREREQUISITES
  pip install --upgrade openai pillow
  export OPENAI_API_KEY="sk-..."        # your key

USAGE
  python3 generate_assets.py            # generate any missing assets
  python3 generate_assets.py --force    # regenerate everything
  python3 generate_assets.py --only mandap floral   # subset by key
  python3 generate_assets.py --no-build # skip rebuilding the .pptx

Images are saved to ../public/generated/. The deck build script
(build_spark_deck.py) automatically uses any image found there and falls
back to the clean typographic layout for anything missing — so it is safe
to generate only a subset.
"""
import argparse
import base64
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "public", "generated")

STYLE = (
    "Ultra-photorealistic, cinematic, luxurious. Restrained ivory-and-gold "
    "palette with warm 2700K light. No text, no logos, no watermarks, no people "
    "in the foreground. Elegant, editorial wedding-magazine quality."
)

# key -> (filename, size, prompt)
ASSETS = {
    "hero": (
        "udaipur-palace-night-hero.png", "1536x1024",
        "A grand white-marble Rajasthani lake palace in Udaipur at blue-hour "
        "twilight. Warm golden light glows from arched windows; ornate domes and "
        "jharokha balconies; a calm lake mirrors the palace in the foreground; "
        "soft mist; a romantic destination-wedding mood. " + STYLE,
    ),
    "venue": (
        "udaipur-venue-aerial.png", "1024x1024",
        "An elevated three-quarter establishing view of a grand Udaipur palace "
        "courtyard set for a luxury wedding of about 600 guests: symmetrical rows "
        "of ivory-draped seating, a central mandap stage, manicured grounds, the "
        "lake-palace architecture behind at golden hour, a warm festive ambiance. "
        + STYLE,
    ),
    "mandap": (
        "royal-heritage-mandap.png", "1024x1024",
        "A single ornate Indian wedding mandap in a royal heritage style: eight "
        "intricately carved gold-and-ivory pillars, a domed canopy with lotus "
        "motifs, brushed-brass detailing, ivory drapery, lotus and marigold "
        "garlands, a low sacred-fire vedi at the centre, candlelit at night, "
        "symmetrical, an empty ceremonial stage. " + STYLE,
    ),
    "lighting": (
        "lighting-night-scene.png", "1536x1024",
        "A luxury Indian wedding stage at night under a warm lighting wash: a "
        "crystal chandelier overhead, LED light ribs framing an aisle, golden "
        "uplighting on ivory drapes, a candlelit pathway, an elegant romantic "
        "atmosphere. " + STYLE,
    ),
    "floral": (
        "floral-lotus-marigold.png", "1536x1024",
        "An opulent Indian wedding floral installation: lush lotus-pink blooms, "
        "saffron marigold garlands, white jasmine strands and fresh green neem "
        "foliage draped across an ivory-and-gold canopy, soft warm light, rich "
        "macro detail. " + STYLE,
    ),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="regenerate even if a file exists")
    ap.add_argument("--only", nargs="*", choices=list(ASSETS), help="generate only these keys")
    ap.add_argument("--quality", default="high", choices=["low", "medium", "high"])
    ap.add_argument("--no-build", action="store_true", help="do not rebuild the .pptx after")
    args = ap.parse_args()

    if not os.environ.get("OPENAI_API_KEY"):
        sys.exit("ERROR: set OPENAI_API_KEY in your environment first.")

    try:
        from openai import OpenAI
    except ImportError:
        sys.exit("ERROR: pip install --upgrade openai pillow")

    client = OpenAI()
    os.makedirs(OUT, exist_ok=True)
    keys = args.only or list(ASSETS)

    for key in keys:
        fn, size, prompt = ASSETS[key]
        path = os.path.join(OUT, fn)
        if os.path.exists(path) and not args.force:
            print(f"skip  {fn} (exists)")
            continue
        print(f"gen   {fn}  [{size}, {args.quality}] ...", flush=True)
        r = client.images.generate(
            model="gpt-image-1", prompt=prompt, size=size, quality=args.quality, n=1
        )
        with open(path, "wb") as f:
            f.write(base64.b64decode(r.data[0].b64_json))
        print(f"saved {path}")

    if not args.no_build:
        print("\nRebuilding deck ...")
        subprocess.run([sys.executable, os.path.join(HERE, "build_spark_deck.py")], check=True)
        print("Done. Open presentations/spark-planners-client-deck.pptx")


if __name__ == "__main__":
    main()
