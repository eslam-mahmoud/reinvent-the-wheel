#!/usr/bin/env bash
# Bitchat (offline Bluetooth mesh chat, GPL-3.0) for the Downloads section.
# Fetches the latest official Android release from GitHub and verifies it
# against the release's published SHA-256 checksums. ~70 MB.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${CONTENT:-$ROOT/content}/downloads/Bitchat"
REPO=permissionlesstech/bitchat-android
# arm64: most phones · universal: older 32-bit phones and anything else
APKS="bitchat-android-arm64.apk bitchat-android-universal.apk"

TAG=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" \
    | python3 -c 'import sys,json; print(json.load(sys.stdin)["tag_name"])')
BASE="https://github.com/$REPO/releases/download/$TAG"
echo "Bitchat $TAG"

mkdir -p "$OUT/.partial"
curl -fsSL -o "$OUT/.partial/SHA256SUMS" "$BASE/BITCHAT_SHA256SUMS"

sha() { if command -v sha256sum >/dev/null; then sha256sum "$1"; else shasum -a 256 "$1"; fi | awk '{print $1}'; }

for apk in $APKS; do
    name="${apk/bitchat-android/Bitchat-$TAG}"
    if [ -f "$OUT/$name" ]; then echo "$name already present"; continue; fi
    echo "==> $name"
    curl -fL -C - --retry 5 -o "$OUT/.partial/$apk" "$BASE/$apk"
    expected=$(grep -E "[ *]$apk\$" "$OUT/.partial/SHA256SUMS" | awk '{print $1}')
    [ -n "$expected" ] && [ "$expected" = "$(sha "$OUT/.partial/$apk")" ] \
        || { echo "Checksum mismatch for $apk" >&2; exit 1; }
    mv "$OUT/.partial/$apk" "$OUT/$name"
done
rm -rf "$OUT/.partial"
# Drop older versions.
find "$OUT" -maxdepth 1 -name 'Bitchat-*.apk' ! -name "Bitchat-$TAG-*" -print -delete

cat > "$OUT/اقرأني - README.txt" <<'TXT'
Bitchat — دردشة بدون إنترنت عبر البلوتوث بين الأجهزة القريبة.
ثبّت Bitchat-…-arm64.apk (أو universal للهواتف القديمة).

Bitchat — chat without internet over Bluetooth mesh with nearby devices.
Install Bitchat-…-arm64.apk (universal for older phones).
Source & license (GPL-3.0): https://github.com/permissionlesstech/bitchat-android
TXT
ls -lh "$OUT"
