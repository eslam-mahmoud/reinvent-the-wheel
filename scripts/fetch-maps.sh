#!/usr/bin/env bash
# Cut a Saudi Arabia + Egypt map out of the latest Protomaps planet build
# (only the needed byte ranges are downloaded, not the 130 GB planet).
#   MAXZOOM=14 rtw fetch maps     # smaller file, less street detail
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${CONTENT:-$ROOT/content}/maps"
MAXZOOM="${MAXZOOM:-15}"
PMTILES_VERSION=1.31.2

# pmtiles CLI: Homebrew on the Mac; official static Linux build elsewhere (Termux).
PMTILES=$(command -v pmtiles || true)
if [ -z "$PMTILES" ]; then
    if [ "$(uname)" = Darwin ]; then
        brew install pmtiles; PMTILES=pmtiles
    else
        PMTILES="$ROOT/state/bin/pmtiles"
        if [ ! -x "$PMTILES" ]; then
            arch=$(uname -m); [ "$arch" = aarch64 ] && arch=arm64
            mkdir -p "$ROOT/state/bin"
            curl -fsSL "https://github.com/protomaps/go-pmtiles/releases/download/v$PMTILES_VERSION/go-pmtiles_${PMTILES_VERSION}_Linux_$arch.tar.gz" \
                | tar xz -C "$ROOT/state/bin" pmtiles
        fi
    fi
fi

BUILD=$(curl -fsSL https://build-metadata.protomaps.dev/builds.json \
    | python3 -c 'import sys,json; print(json.load(sys.stdin)[-1]["key"])')
echo "Using build $BUILD"

# Two boxes: Egypt (incl. Sinai, Halaib) and Saudi Arabia.
REGION="$(mktemp "${TMPDIR:-/tmp}/region.XXXXXX")"
trap 'rm -f "$REGION"' EXIT
cat > "$REGION" <<'JSON'
{"type":"MultiPolygon","coordinates":[
 [[[24.6,21.7],[37.1,21.7],[37.1,31.8],[24.6,31.8],[24.6,21.7]]],
 [[[34.4,16.3],[55.7,16.3],[55.7,32.2],[34.4,32.2],[34.4,16.3]]]
]}
JSON

# extract can't resume, so write to a hidden .partial/ dir and retry; only a
# complete file is moved into place (the maps page would pick up a broken one).
mkdir -p "$OUT/.partial"
for attempt in 1 2 3 4 5; do
    if "$PMTILES" extract "https://build.protomaps.com/$BUILD" "$OUT/.partial/ksa-egypt.pmtiles" \
        --region="$REGION" --maxzoom="$MAXZOOM" --download-threads=4; then
        mv "$OUT/.partial/ksa-egypt.pmtiles" "$OUT/ksa-egypt.pmtiles"
        rm -rf "$OUT/.partial"
        ls -lh "$OUT/ksa-egypt.pmtiles"
        exit 0
    fi
    echo "Attempt $attempt failed, retrying in 10s…" >&2
    sleep 10
done
rm -rf "$OUT/.partial"
exit 1
