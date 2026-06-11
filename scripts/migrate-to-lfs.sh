#!/usr/bin/env bash
#
# One-time migration of existing binary assets into Git LFS.
#
# WHY: .gitattributes only routes FUTURE commits through LFS. The ~190 MB of
# binaries already in history stay in the regular packfiles until you rewrite
# history with `git lfs migrate`. Do this BEFORE pushing to a remote — it
# rewrites commit SHAs, so it's painless while the repo is still local-only.
#
# Run from the repo root on your Mac (Git LFS is not available in the sandbox):
#   bash scripts/migrate-to-lfs.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v git-lfs >/dev/null 2>&1; then
  echo "Git LFS is not installed."
  echo "Install it first:  brew install git-lfs"
  exit 1
fi

echo "==> Installing Git LFS hooks for this repo"
git lfs install

# Make sure the working tree is clean before rewriting history.
if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is not clean. Commit or stash changes first."
  git status --short
  exit 1
fi

echo "==> Rewriting history to move binary assets into LFS"
git lfs migrate import --everything \
  --include="*.png,*.webp,*.jpg,*.jpeg,*.glb,*.gltf,*.pdf,*.dxf"

echo "==> Verifying tracked LFS patterns"
git lfs track

echo
echo "Done. The binaries are now stored in LFS."
echo "Next: push to your remote — LFS objects upload automatically."
echo "  git push -u origin master"
