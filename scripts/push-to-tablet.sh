#!/usr/bin/env bash
# Copy the app and any downloaded content to the tablet over USB (adb).
#   ./push-to-tablet.sh            # app + all content
#   ./push-to-tablet.sh app        # app only (fast)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ADB="${ADB:-$(command -v adb || echo "$HOME/Library/Android/sdk/platform-tools/adb")}"
DEST=/sdcard/RTW

[ "$("$ADB" get-state 2>/dev/null)" = device ] || { echo "No device on adb" >&2; exit 1; }
[ -d "$ROOT/web/vendor" ] || echo "WARNING: web/vendor missing — run ./rtw fetch vendor for maps" >&2

echo "==> App → $DEST/_setup"
"$ADB" shell rm -rf "$DEST/_setup"
"$ADB" shell mkdir -p "$DEST/_setup"
"$ADB" push "$ROOT/server" "$ROOT/scripts" "$ROOT/web" "$ROOT/rtw" "$DEST/_setup/" >/dev/null

if [ "${1:-all}" != app ] && [ -d "$ROOT/content" ]; then
    for d in "$ROOT"/content/*/; do
        name=$(basename "$d")
        echo "==> content/$name → $DEST/$name"
        "$ADB" shell mkdir -p "$DEST/$name"
        # Skip hidden entries (.partial = unfinished downloads). --sync skips
        # files already on the tablet with the same timestamp.
        for entry in "$d"*; do
            [ -e "$entry" ] && "$ADB" push --sync "$entry" "$DEST/$name/"
        done
    done
fi

cat <<MSG

Done. In Termux on the tablet run:
  termux-setup-storage      (first time only — tap Allow)
  bash ~/storage/shared/RTW/_setup/server/install-termux.sh
  rtw start
MSG
