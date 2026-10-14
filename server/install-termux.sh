#!/usr/bin/env bash
# Install the offline library on an Android tablet inside Termux
# (no root, no Linux distro). Usually run for you by bootstrap.sh or
# `rtw setup` / `rtw update`. Two ways to get the code onto the tablet:
#
#   From GitHub (no computer needed) — see bootstrap.sh; installs in ~/rtw.
#   From the Mac over USB — `rtw push`, then in Termux:
#       bash ~/storage/shared/RTW/_setup/server/install-termux.sh
#
# Safe to re-run: refreshes app files and config, never touches content
# or the admin password.
set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)"   # repo clone, or .../RTW/_setup
ROOT="$HOME/rtw"
CONTENT="${RTW_CONTENT:-/storage/emulated/0/RTW}"

say() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

if [ ! -r /storage/emulated/0 ]; then
    echo "Termux can't read shared storage. Run 'termux-setup-storage', tap Allow, then re-run." >&2
    exit 1
fi

say "Installing packages"
pkg update -y
pkg install -y nginx kiwix-tools python git curl unzip termux-tools iproute2
command -v openssl >/dev/null || pkg install -y openssl-tool || pkg install -y openssl

if [ "$SRC" != "$ROOT" ]; then
    # Copied over USB: install a copy into ~/rtw.
    say "Copying app to $ROOT"
    mkdir -p "$ROOT"
    rm -rf "$ROOT/web/assets" "$ROOT/server" "$ROOT/scripts" "$ROOT/bin"
    cp -r "$SRC/web" "$SRC/server" "$ROOT/"
    [ -d "$SRC/scripts" ] && cp -r "$SRC/scripts" "$ROOT/"
    cp "$SRC/rtw" "$ROOT/rtw"
fi

if [ ! -d "$ROOT/web/vendor/maplibre" ]; then
    say "Downloading map viewer assets"
    bash "$ROOT/scripts/fetch-vendor.sh" || echo "WARNING: map assets failed — retry with: rtw fetch vendor" >&2
fi

say "Writing config"
mkdir -p "$CONTENT"
ROOT="$ROOT" CONTENT="$CONTENT" MIME_TYPES="$PREFIX/etc/nginx/mime.types" \
    bash "$ROOT/server/configure.sh"

# Commands: `rtw <cmd>` plus rtw-start / rtw-stop / rtw-status / rtw-passwd.
# A small wrapper (not a symlink): Android has no /usr/bin/env for the shebang.
rm -f "$PREFIX/bin/rtw"
cat > "$PREFIX/bin/rtw" <<EOF
#!$PREFIX/bin/bash
RTW_AS="\$(basename "\$0")" exec bash "$ROOT/rtw" "\$@"
EOF
chmod +x "$PREFIX/bin/rtw"
for c in start stop restart status passwd; do
    ln -sf "$PREFIX/bin/rtw" "$PREFIX/bin/rtw-$c"
done

# Autostart if the Termux:Boot add-on is installed.
mkdir -p "$HOME/.termux/boot"
cat > "$HOME/.termux/boot/start-rtw" <<EOF
#!$PREFIX/bin/sh
termux-wake-lock
exec bash "$ROOT/rtw" start
EOF
chmod +x "$HOME/.termux/boot/start-rtw"

say "Done. Start the server with:  rtw start"
echo "Get content on the tablet with: rtw fetch all   (or copy it from a computer)"
