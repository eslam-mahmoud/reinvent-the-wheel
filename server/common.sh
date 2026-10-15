# Shared helpers for the service scripts. No systemd on Android, so each
# background service is tracked with a pid file in $STATE/run.
: "${RTW_ENV:?run via the rtw command}"
set -a; source "$RTW_ENV"; set +a   # exported for admin_server.py
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

lan_ips() {  # this device's network addresses, for the "open on other devices" hint
    {
        if [ "$(uname)" = Darwin ]; then
            for i in en0 en1; do ipconfig getifaddr "$i"; done
        else
            # Android blocks `ip addr` for apps (netlink), but the system
            # ifconfig (ioctl) still works; try both.
            ip -o -4 addr show | awk '{print $4}' | cut -d/ -f1
            for b in ifconfig /system/bin/ifconfig; do
                command -v "$b" >/dev/null && "$b"
            done | sed -nE 's/.*inet (addr:)?([0-9]+[.][0-9]+[.][0-9]+[.][0-9]+).*/\2/p'
        fi
    } 2>/dev/null | grep -v '^127[.]' | sort -u
}

print_addresses() {  # what to open, on this device and on others
    echo "Open on this device:   http://127.0.0.1:$PORT"
    local ip found=""
    for ip in $(lan_ips); do
        found=1
        echo "Open on other devices: http://$ip:$PORT   (GPS on map: https://$ip:$HTTPS_PORT)"
    done
    if [ -z "$found" ]; then
        echo "Not on a network yet — join Wi-Fi or turn on the hotspot, then run: rtw address"
    else
        echo "The address changes when you switch networks or turn the hotspot on; check again with: rtw address"
    fi
    echo "All commands: rtw help"
}
