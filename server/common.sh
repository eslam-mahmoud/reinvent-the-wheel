# Shared helpers for the service scripts. No systemd on Android, so each
# background service is tracked with a pid file in $STATE/run.
: "${IIAB_ENV:?run via the iiab command}"
set -a; source "$IIAB_ENV"; set +a   # exported for admin_server.py
mkdir -p "$STATE"/{logs,run}

running() {  # running <name>
    [ -f "$STATE/run/$1.pid" ] && kill -0 "$(cat "$STATE/run/$1.pid")" 2>/dev/null
}

spawn() {  # spawn <name> <cmd...>  — background a command and record its pid
    local name=$1; shift
    nohup "$@" >> "$STATE/logs/$name.log" 2>&1 &
    echo $! > "$STATE/run/$name.pid"
}

halt() {  # halt <name>
    if running "$1"; then
        kill "$(cat "$STATE/run/$1.pid")" && echo "$1 stopped"
    fi
    rm -f "$STATE/run/$1.pid"
}

lan_ips() {
    if command -v ip >/dev/null; then
        ip -o -4 addr show 2>/dev/null | awk '{print $4}' | cut -d/ -f1 | grep -v '^127\.' || true
    else
        for i in en0 en1; do ipconfig getifaddr "$i" 2>/dev/null || true; done
    fi
}
