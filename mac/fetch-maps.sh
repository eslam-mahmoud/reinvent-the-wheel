#!/usr/bin/env bash
# Cut a Saudi Arabia + Egypt map out of the latest Protomaps planet build
# (only the needed byte ranges are downloaded, not the 130 GB planet).
#   MAXZOOM=14 ./fetch-maps.sh     # smaller file, less street detail
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/content/maps"
MAXZOOM="${MAXZOOM:-15}"

command -v pmtiles >/dev/null || brew install pmtiles

BUILD=$(curl -fsSL https://build-metadata.protomaps.dev/builds.json \
    | python3 -c 'import sys,json; print(json.load(sys.stdin)[-1]["key"])')
echo "Using build $BUILD"

# Two boxes: Egypt (incl. Sinai, Halaib) and Saudi Arabia.
REGION="$(mktemp -t region).geojson"
cat > "$REGION" <<'JSON'
{"type":"MultiPolygon","coordinates":[
 [[[24.6,21.7],[37.1,21.7],[37.1,31.8],[24.6,31.8],[24.6,21.7]]],
 [[[34.4,16.3],[55.7,16.3],[55.7,32.2],[34.4,32.2],[34.4,16.3]]]
]}
JSON

mkdir -p "$OUT/.partial"
# extract can't resume, so write to a hidden .partial/ dir and retry; only a complete file is
# renamed into place (the maps page would otherwise pick up a broken one).
for attempt in 1 2 3 4 5; do
    if pmtiles extract "https://build.protomaps.com/$BUILD" "$OUT/.partial/ksa-egypt.pmtiles" \
        --region="$REGION" --maxzoom="$MAXZOOM" --download-threads=4; then
        mv "$OUT/.partial/ksa-egypt.pmtiles" "$OUT/ksa-egypt.pmtiles"
        ls -lh "$OUT/ksa-egypt.pmtiles"
        exit 0
    fi
    echo "Attempt $attempt failed, retrying in 10s…" >&2
    sleep 10
done
rm -rf "$OUT/.partial"
exit 1
