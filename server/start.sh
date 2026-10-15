#!/usr/bin/env bash
# Start all services: Wikipedia (kiwix), upload API, nginx.
set -euo pipefail
source "$(dirname "$0")/common.sh"

# Keep Android from suspending Termux while serving.
command -v termux-wake-lock >/dev/null && termux-wake-lock || true

bash "$ROOT/server/kiwix.sh" start

if running admin; then
    echo "admin already running"
else
    spawn admin python3 "$ROOT/server/admin_server.py"
    echo "admin started"
fi
[ -s "$STATE/conf/htpasswd" ] || echo "WARNING: no admin password set — run: rtw passwd"

if running nginx; then
    echo "nginx already running"
else
    nginx -p "$STATE/run" -c "$STATE/conf/nginx.conf"
    echo "nginx started"
fi

echo
print_addresses
