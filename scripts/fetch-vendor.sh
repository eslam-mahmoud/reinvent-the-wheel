#!/usr/bin/env bash
# Download the map viewer's JS/CSS, fonts and icons into web/vendor (~15 MB),
# so the maps page works with no internet. Pinned versions.
# Needs only curl, tar and git — works on the Mac and in Termux.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENDOR="$ROOT/web/vendor"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/vendor.XXXXXX")"; trap 'rm -rf "$TMP"' EXIT

MAPLIBRE=5.24.0          # last release with a single-file UMD build
PMTILES=4.5.0
BASEMAPS=5.7.2
RTL=0.2.3                # plain-JS plugin that maplibre 5 loads by URL

npm_get() {  # npm_get <package> <version> <dir> — fetch a package tarball from the npm registry
    local name=$1 ver=$2 dir=$3
    mkdir -p "$TMP/$dir"
    curl -fsSL "https://registry.npmjs.org/$name/-/${name##*/}-$ver.tgz" | tar xz -C "$TMP/$dir"
}
npm_get maplibre-gl "$MAPLIBRE" maplibre
npm_get pmtiles "$PMTILES" pmtiles
npm_get @protomaps/basemaps "$BASEMAPS" basemaps
npm_get @mapbox/mapbox-gl-rtl-text "$RTL" rtl

rm -rf "$VENDOR"; mkdir -p "$VENDOR"/{maplibre,pmtiles,basemaps,rtl-text}
cp "$TMP"/maplibre/package/dist/maplibre-gl.{js,css} "$VENDOR/maplibre/"
cp "$TMP/pmtiles/package/dist/pmtiles.js" "$VENDOR/pmtiles/"
cp "$TMP/basemaps/package/dist/basemaps.js" "$VENDOR/basemaps/"
cp "$TMP/rtl/package/mapbox-gl-rtl-text.js" "$VENDOR/rtl-text/"

# Fonts (glyph PBFs incl. Arabic) and sprites used by the Protomaps style.
git clone --quiet --depth 1 --filter=blob:none --sparse \
    https://github.com/protomaps/basemaps-assets.git "$TMP/assets"
git -C "$TMP/assets" sparse-checkout set "fonts/Noto Sans Regular" "fonts/Noto Sans Medium" "fonts/Noto Sans Italic" sprites/v4
mkdir -p "$VENDOR/basemaps-assets"
cp -r "$TMP/assets/fonts" "$TMP/assets/sprites" "$VENDOR/basemaps-assets/"

du -sh "$VENDOR"
