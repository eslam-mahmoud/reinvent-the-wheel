#!/usr/bin/env bash
# OsmAnd (offline GPS navigation app) + Egypt and Saudi Arabia maps for the
# Downloads section. Phones install the APK, then open each .obf with OsmAnd.
# Uses the F-Droid build "OsmAnd~" (no download limits). ~800 MB total.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/content/downloads/OsmAnd"
mkdir -p "$OUT"

# F-Droid version codes end in 03 = arm64 (most phones), 01 = 32-bit ARM (old phones).
LATEST=$(curl -fsSL https://f-droid.org/api/v1/packages/net.osmand.plus \
    | python3 -c 'import sys,json; print(json.load(sys.stdin)["packages"][0]["versionCode"] // 100)')
for abi in 03:arm64 01:arm32-old-phones; do
    code="${LATEST}${abi%%:*}"
    dest="$OUT/OsmAnd-${abi#*:}.apk"
    echo "==> $dest"
    curl -fL -C - --retry 5 -o "$dest" "https://f-droid.org/repo/net.osmand.plus_${code}.apk"
done

for map in Egypt_africa_2 Saudi-arabia_asia_2; do
    [ -f "$OUT/$map.obf" ] && { echo "$map.obf already present"; continue; }
    echo "==> $map.obf"
    curl -fL --retry 5 -o "$OUT/$map.obf.zip" \
        "https://download.osmand.net/download?standard=yes&file=$map.obf.zip"
    unzip -o -q "$OUT/$map.obf.zip" -d "$OUT" && rm "$OUT/$map.obf.zip"
done

cat > "$OUT/اقرأني - README.txt" <<'TXT'
1. ثبّت OsmAnd-arm64.apk (أو arm32 للهواتف القديمة).
2. نزّل ملفات الخرائط .obf ثم افتحها بتطبيق OsmAnd.
3. الملاحة تعمل بدون إنترنت باستخدام GPS الهاتف.

1. Install OsmAnd-arm64.apk (arm32 for old phones).
2. Download the .obf map files and open them with OsmAnd.
3. Navigation then works offline using the phone's GPS.
TXT
ls -lh "$OUT"
