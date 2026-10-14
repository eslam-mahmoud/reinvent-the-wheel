#!/data/data/com.termux/files/usr/bin/bash
# One-line install on an Android tablet, straight from GitHub — no computer.
# In Termux:
#
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/eslam-mahmoud/reinvent-the-wheel/main/bootstrap.sh)"
#
# Clones the repo into ~/rtw, installs everything, asks for an admin password.
# Re-running it updates an existing install.
set -euo pipefail

REPO="${RTW_REPO:-https://github.com/eslam-mahmoud/reinvent-the-wheel.git}"
ROOT="$HOME/rtw"

# Shared storage (/sdcard/RTW) holds the library content.
if [ ! -r /storage/emulated/0 ]; then
    echo "Allow Termux to access storage (tap Allow on the pop-up)…"
    termux-setup-storage
    for _ in $(seq 60); do [ -r /storage/emulated/0 ] && break; sleep 1; done
    [ -r /storage/emulated/0 ] || { echo "Storage access not granted. Re-run after allowing it." >&2; exit 1; }
fi

pkg install -y git

if [ -d "$ROOT/.git" ]; then
    git -C "$ROOT" pull --ff-only
else
    if [ -d "$ROOT" ]; then
        # An earlier USB install: keep its state (config, password), replace the rest.
        mv "$ROOT" "$ROOT.old"
    fi
    git clone --depth 1 "$REPO" "$ROOT"
    if [ -d "$ROOT.old" ]; then
        [ -d "$ROOT.old/state" ] && mv "$ROOT.old/state" "$ROOT/state"
        [ -d "$ROOT.old/web/vendor" ] && mv "$ROOT.old/web/vendor" "$ROOT/web/vendor"
        rm -rf "$ROOT.old"
    fi
fi

bash "$ROOT/server/install-termux.sh"
