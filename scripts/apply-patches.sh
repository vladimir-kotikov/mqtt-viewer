#!/usr/bin/env bash
# apply-patches.sh – vendor dependencies and apply local patches.
#
# Wails v3 alpha.74 has two bugs that require patching before the server build
# compiles:
#
#   wails-v3alpha74-browser_window.patch
#     Adds the missing AttachModal stub so BrowserWindow satisfies the Window
#     interface when building with -tags server.
#
#   wails-v3alpha74-application_server.patch
#     Adds BASE_PATH env-var support so the app can be served under a sub-path
#     (e.g. behind a Traefik route that does NOT strip the prefix).
#
# Once Wails publishes a release that includes these fixes, remove the
# corresponding patches and bump the version in go.mod.
#
# Usage:
#   ./scripts/apply-patches.sh           # vendor + patch
#   ./scripts/apply-patches.sh --check   # dry-run (check patches apply cleanly)
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PATCHES_DIR="$REPO_ROOT/patches"
CHECK=0

for arg in "$@"; do
  [[ "$arg" == "--check" ]] && CHECK=1
done

cd "$REPO_ROOT"

if [[ $CHECK -eq 0 ]]; then
  echo "► go mod vendor"
  go mod vendor
fi

PATCH_ARGS=("-p1" "--no-backup-if-mismatch")
[[ $CHECK -eq 1 ]] && PATCH_ARGS+=("--dry-run")

for patch_file in "$PATCHES_DIR"/*.patch; do
  echo "► patch ${PATCH_ARGS[*]} < $patch_file"
  patch "${PATCH_ARGS[@]}" < "$patch_file"
done

echo "✓ All patches applied successfully."
