#!/usr/bin/env bash
# Install the offline library on an Android tablet inside Termux
# (no root, no Linux distro). Run after the Mac pushed the project:
#
#   termux-setup-storage            # once: allow Termux to read shared storage
#   bash ~/storage/shared/IIAB/_setup/server/install-termux.sh
#
# Safe to re-run (also how you update): refreshes app files and config,
# never touches content or the admin password.
set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)"      # .../IIAB/_setup
ROOT="$HOME/iiab"
CONTENT="${IIAB_CONTENT:-/storage/emulated/0/IIAB}"

say() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

if [ ! -r "$CONTENT" ]; then
    echo "Cannot read $CONTENT. Run 'termux-setup-storage', allow access, then re-run." >&2
    exit 1
fi

say "Installing packages (nginx, kiwix-tools, python, openssl)"
pkg update -y
pkg install -y nginx kiwix-tools python termux-tools iproute2
command -v openssl >/dev/null || pkg install -y openssl-tool || pkg install -y openssl

say "Copying app to $ROOT"
mkdir -p "$ROOT"
rm -rf "$ROOT/web" "$ROOT/server" "$ROOT/bin"   # bin/: layout of older versions
cp -r "$SRC/web" "$SRC/server" "$ROOT/"
cp "$SRC/iiab" "$ROOT/iiab"
# Android has no /usr/bin/env; point the shebang at Termux's bash.
sed -i "1s|.*|#!$PREFIX/bin/bash|" "$ROOT/iiab"
chmod +x "$ROOT/iiab"
[ -d "$ROOT/web/vendor/maplibre" ] || echo "WARNING: web/vendor missing — maps page won't work (run 'iiab fetch vendor' on the Mac, then push)." >&2

# Older versions kept config in ~/iiab/conf; move it (keeps the password).
if [ -d "$ROOT/conf" ] && [ ! -d "$ROOT/state/conf" ]; then
    mkdir -p "$ROOT/state"; mv "$ROOT/conf" "$ROOT/state/conf"
fi

say "Writing config"
ROOT="$ROOT" CONTENT="$CONTENT" MIME_TYPES="$PREFIX/etc/nginx/mime.types" \
    bash "$ROOT/server/configure.sh"

# Commands: iiab <cmd>, plus iiab-start / iiab-stop / iiab-status / iiab-passwd.
ln -sf "$ROOT/iiab" "$PREFIX/bin/iiab"
for c in start stop restart status passwd; do
    ln -sf "$ROOT/iiab" "$PREFIX/bin/iiab-$c"
done

# Autostart if the Termux:Boot add-on is installed.
mkdir -p "$HOME/.termux/boot"
cat > "$HOME/.termux/boot/start-iiab" <<EOF
#!/data/data/com.termux/files/usr/bin/sh
termux-wake-lock
exec "$ROOT/iiab" start
EOF
chmod +x "$HOME/.termux/boot/start-iiab"

say "Done. Start the server with:  iiab start"
