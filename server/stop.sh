#!/usr/bin/env bash
source "$(dirname "$0")/common.sh"

if running nginx; then
    nginx -p "$STATE/run" -c "$STATE/conf/nginx.conf" -s stop && echo "nginx stopped"
fi
halt admin
halt kiwix
command -v termux-wake-unlock >/dev/null && termux-wake-unlock || true
