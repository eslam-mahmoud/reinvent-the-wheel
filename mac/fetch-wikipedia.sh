#!/usr/bin/env bash
# Download the newest Arabic Wikipedia (text only) ZIM into content/wikipedia.
# Resumable: re-run after an interruption. Override with e.g.
#   ZIM_PATTERN=wikipedia_ar_all_mini ./fetch-wikipedia.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/content/wikipedia"
PATTERN="${ZIM_PATTERN:-wikipedia_ar_all_nopic}"
BASE=https://download.kiwix.org/zim/wikipedia

NAME=$(curl -fsSL "$BASE/" | grep -oE "${PATTERN}_[0-9]{4}-[0-9]{2}\.zim" | sort -u | tail -1)
[ -n "$NAME" ] || { echo "No ZIM matching $PATTERN" >&2; exit 1; }
echo "Latest: $NAME"

mkdir -p "$OUT"
curl -fL -C - --retry 5 -o "$OUT/$NAME" "$BASE/$NAME"

echo "Verifying checksum…"
expected=$(curl -fsSL "$BASE/$NAME.sha256" | awk '{print $1}')
actual=$(shasum -a 256 "$OUT/$NAME" | awk '{print $1}')
[ "$expected" = "$actual" ] && echo "OK" || { echo "Checksum mismatch!" >&2; exit 1; }

# Keep only the newest file for this pattern.
find "$OUT" -name "${PATTERN}_*.zim" ! -name "$NAME" -print -delete
