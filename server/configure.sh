#!/usr/bin/env bash
# Write runtime config for this machine (Mac or tablet). Called by `rtw setup`
# and install-termux.sh; safe to re-run — never touches content or the password.
#
# Needs: ROOT (folder holding web/ and server/), CONTENT, MIME_TYPES.
# Optional: PORT, HTTPS_PORT, KIWIX_PORT, ADMIN_PORT.
set -euo pipefail

: "${ROOT:?}" "${CONTENT:?}" "${MIME_TYPES:?}"
STATE="$ROOT/state"
PORT="${PORT:-8080}"
HTTPS_PORT="${HTTPS_PORT:-8443}"
KIWIX_PORT="${KIWIX_PORT:-8081}"
ADMIN_PORT="${ADMIN_PORT:-8082}"

mkdir -p "$STATE"/{conf,logs,run}

cat > "$STATE/conf/rtw.env" <<EOF
ROOT="$ROOT"
STATE="$STATE"
CONTENT="$CONTENT"
PORT="$PORT"
HTTPS_PORT="$HTTPS_PORT"
KIWIX_PORT="$KIWIX_PORT"
ADMIN_PORT="$ADMIN_PORT"
EOF

sed -e "s#@STATE@#$STATE#g" \
    -e "s#@WEB@#$ROOT/web#g" \
    -e "s#@CONTENT@#$CONTENT#g" \
    -e "s#@MIME_TYPES@#$MIME_TYPES#g" \
    -e "s#@PORT@#$PORT#g" \
    -e "s#@HTTPS_PORT@#$HTTPS_PORT#g" \
    -e "s#@KIWIX_PORT@#$KIWIX_PORT#g" \
    -e "s#@ADMIN_PORT@#$ADMIN_PORT#g" \
    "$ROOT/server/nginx.conf.in" > "$STATE/conf/nginx.conf"

echo "window.RTW = { httpsPort: $HTTPS_PORT };" > "$STATE/conf/config.js"

if [ ! -s "$STATE/conf/tls.crt" ]; then
    echo "Creating self-signed HTTPS certificate"
    openssl req -x509 -newkey rsa:2048 -nodes -days 3650 -subj "/CN=rtw.local" \
        -keyout "$STATE/conf/tls.key" -out "$STATE/conf/tls.crt" 2>/dev/null
    chmod 600 "$STATE/conf/tls.key"
fi

mkdir -p "$CONTENT"/{wikipedia,books,notes,maps,www,downloads}
if [ -z "$(ls -A "$CONTENT/notes")" ]; then
    cat > "$CONTENT/notes/مرحبا.md" <<'EOF'
# مرحبًا

ضع ملفات `.md` أو `.txt` هنا أو أنشئها من صفحة الإدارة.

Put `.md` or `.txt` files here, or create them from the admin page.
EOF
fi

# nginx won't start if the password file it references is missing.
touch "$STATE/conf/htpasswd"
chmod 600 "$STATE/conf/htpasswd"
if [ ! -s "$STATE/conf/htpasswd" ]; then
    if [ -t 0 ]; then
        echo
        echo "Set the admin password (used to upload and manage content):"
        RTW_ENV="$STATE/conf/rtw.env" python3 "$ROOT/server/passwd.py"
    else
        echo "No admin password yet — set one with: rtw passwd"
    fi
fi

nginx -t -q -p "$STATE/run" -c "$STATE/conf/nginx.conf"
echo "Config written to $STATE/conf"
