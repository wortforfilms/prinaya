# Asset & Git LFS strategy

This project carries ~190 MB of binary assets in `public/`. They are **served at
runtime** (referenced by `src/`), so they cannot simply be deleted or ignored
without breaking the app and any deployment. The strategy is therefore:

- **Large binaries → Git LFS** (`.gitattributes`): keeps clones and history
  lean while the files still ship.
- **Raw source inputs → not committed** (`.gitignore`): originals live outside
  the repo; only their processed outputs are tracked.

## What is source-of-truth vs. regenerable

| Path | Size | Origin | Strategy |
| --- | --- | --- | --- |
| `public/tlps-unique-extractions/sources/` | ~56 MB (30 files) | Copies of the originals in `$TLPS_UNIQUE_SOURCE_DIR` (`~/Downloads/TLPS_All_Generated_Images_Descriptive`) | **Keep (LFS).** Only in-repo copy of the originals. |
| `public/tlps-unique-extractions/frames/` | ~130 MB (591 files) | Crops derived from `sources/` by `scripts/extract-unique-tlps-assets.py` | Regenerable, but served → **keep (LFS).** |
| `public/extracted-boards/` | ~22 MB (9 files) | Derived from `$HERO_BANNER_SOURCE` | **Keep (LFS).** |
| `public/hero-banners/` | ~7.7 MB (42 files) | `scripts/extract-hero-banners.py` | Regenerable, served → **keep (LFS).** |
| `public/tlps-wedding-os/` | ~4.7 MB (30 files) | `scripts/extract-tlps-homepage.py` | **Keep (LFS).** |
| `public/generated-assets/glb/` | ~2.4 MB (592 files) | `scripts/generate-assets.ts` (no external input) | Fully CI-regenerable → **keep (LFS)** for now; safe to drop to a build step later. |
| cinematic WebP variants + `data/cinematic-image-assets.json` | large | `scripts/generate-cinematic-assets.py` | Derived, served → **keep (LFS / git).** |

The raw originals (the `~/Downloads/...` folders referenced via
`TLPS_UNIQUE_SOURCE_DIR`, `HERO_BANNER_SOURCE`, etc.) are **intentionally not
committed**. Keep a backup of them outside the repo if you need to regenerate.

## One-time migration into LFS

`.gitattributes` only affects **future** commits. To move the binaries already
in history into LFS and actually shrink the repo, run **on your Mac** (Git LFS
isn't available in the sandbox), while the repo is still local-only:

```bash
brew install git-lfs        # if not already installed
bash scripts/migrate-to-lfs.sh
git push -u origin master   # LFS objects upload automatically
```

Doing this before the first push is ideal — it rewrites commit SHAs, which is
harmless when no remote has the old history yet.

## Regenerating assets

```bash
export TLPS_UNIQUE_SOURCE_DIR="/path/to/originals"
export HERO_BANNER_SOURCE="/path/to/board.png"

npm run tlps:extract:unique   # frames + sources
npm run hero:extract          # hero banners + boards
npm run tlps:extract          # wedding-os homepage
npm run images:cinematic      # cinematic variants
npm run assets:generate       # GLB meshes
```
