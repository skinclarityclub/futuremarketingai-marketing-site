#!/usr/bin/env bash
#
# verify-palette.sh
# WHY: after Phase 12 palette migration, prevent regression.
# Exits 1 if any deprecated hex leaks back into src/.
#
# Run from repo root:   bash fmai-nextjs/scripts/verify-palette.sh
# Run from fmai-nextjs:  npm run check:palette
#

set -euo pipefail

# Resolve src/ relative to this script so it works from any cwd.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$(cd "${SCRIPT_DIR}/../src" && pwd)"

STALE_HEX='#050814|#00D4FF|#A855F7|#0A0E27'
MATCHES=$(grep -rnE "$STALE_HEX" \
  --include='*.tsx' \
  --include='*.ts' \
  --include='*.css' \
  "${SRC_DIR}/" 2>/dev/null || true)

if [ -n "$MATCHES" ]; then
  echo "FAIL: deprecated palette hex found in src/:"
  echo "$MATCHES"
  exit 1
fi

echo "PASS: no stale palette hex in src/"
exit 0
