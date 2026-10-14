#!/usr/bin/env bash
# Download the newest Arabic Wikipedia (text only) ZIM into <content>/wikipedia.
# Resumable: re-run after an interruption. Override with e.g.
#   ZIM_PATTERN=wikipedia_ar_all_mini rtw fetch wikipedia
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${CONTENT:-$ROOT/content}/wikipedia"
PART="$OUT/.partial"          # hidden: not served until complete
PATTERN="${ZIM_PATTERN:-wikipedia_ar_all_nopic}"
BASE=https://download.kiwix.org/zim/wikipedia

NAME=$(curl -fsSL "$BASE/" | grep -oE "${PATTERN}_[0-9]{4}-[0-9]{2}\.zim" | sort -u | tail -1)
[ -n "$NAME" ] || { echo "No ZIM matching $PATTERN" >&2; exit 1; }
echo "Latest: $NAME"
[ -f "$OUT/$NAME" ] && { echo "Already downloaded."; exit 0; }

mkdir -p "$PART"
curl -fL -C - --retry 5 -o "$PART/$NAME" "$BASE/$NAME"

echo "Verifying checksum…"
expected=$(curl -fsSL "$BASE/$NAME.sha256" | awk '{print $1}')
if command -v sha256sum >/dev/null; then
    actual=$(sha256sum "$PART/$NAME" | awk '{print $1}')
else
    actual=$(shasum -a 256 "$PART/$NAME" | awk '{print $1}')
fi
[ "$expected" = "$actual" ] || { echo "Checksum mismatch — delete $PART/$NAME and retry" >&2; exit 1; }

mv "$PART/$NAME" "$OUT/$NAME"
rmdir "$PART" 2>/dev/null || true
# Keep only the newest file for this pattern.
find "$OUT" -maxdepth 1 -name "${PATTERN}_*.zim" ! -name "$NAME" -print -delete
echo "Done. Restart to serve it: rtw restart"
