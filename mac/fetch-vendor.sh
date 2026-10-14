#!/usr/bin/env bash
# Download the map viewer's JS/CSS, fonts and icons into web/vendor (~100 MB),
# so the maps page works with no internet. Pinned versions.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="$ROOT/web/vendor"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

MAPLIBRE=5.24.0          # last release with a single-file UMD build
PMTILES=4.5.0
BASEMAPS=5.7.2
RTL=0.2.3                # plain-JS plugin that maplibre 5 loads by URL

cd "$TMP"
npm pack --silent "maplibre-gl@$MAPLIBRE" "pmtiles@$PMTILES" \
    "@protomaps/basemaps@$BASEMAPS" "@mapbox/mapbox-gl-rtl-text@$RTL" >/dev/null
for f in *.tgz; do mkdir "${f%.tgz}"; tar xzf "$f" -C "${f%.tgz}"; done

rm -rf "$VENDOR"; mkdir -p "$VENDOR"/{maplibre,pmtiles,basemaps,rtl-text}
cp maplibre-gl-$MAPLIBRE/package/dist/maplibre-gl.{js,css} "$VENDOR/maplibre/"
cp pmtiles-$PMTILES/package/dist/pmtiles.js "$VENDOR/pmtiles/"
cp protomaps-basemaps-$BASEMAPS/package/dist/basemaps.js "$VENDOR/basemaps/"
cp mapbox-mapbox-gl-rtl-text-$RTL/package/mapbox-gl-rtl-text.js "$VENDOR/rtl-text/"

# Fonts (glyph PBFs incl. Arabic) and sprites used by the Protomaps style.
git clone --quiet --depth 1 --filter=blob:none --sparse \
    https://github.com/protomaps/basemaps-assets.git assets
git -C assets sparse-checkout set "fonts/Noto Sans Regular" "fonts/Noto Sans Medium" "fonts/Noto Sans Italic" sprites/v4
mkdir -p "$VENDOR/basemaps-assets"
cp -r assets/fonts assets/sprites "$VENDOR/basemaps-assets/"

du -sh "$VENDOR"
