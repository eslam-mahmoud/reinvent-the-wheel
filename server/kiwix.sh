#!/usr/bin/env bash
# kiwix.sh start|stop|restart — serves every .zim in IIAB/wikipedia under /wiki.
set -euo pipefail
source "$(dirname "$0")/common.sh"

if ! command -v kiwix-serve >/dev/null; then
    echo "kiwix-serve not installed — Wikipedia disabled"; exit 0
fi

start() {
    shopt -s nullglob
    local zims=("$CONTENT"/wikipedia/*.zim)
    if running kiwix; then
        echo "kiwix already running"
    elif [ ${#zims[@]} -eq 0 ]; then
        echo "No .zim files in $CONTENT/wikipedia — Wikipedia disabled"
    else
        spawn kiwix kiwix-serve --address=127.0.0.1 --port="$KIWIX_PORT" \
            --urlRootLocation=/wiki "${zims[@]}"
        echo "kiwix started (${#zims[@]} ZIM file(s))"
    fi
}

case "${1:-start}" in
    start)   start ;;
    stop)    halt kiwix ;;
    restart) halt kiwix; sleep 1; start ;;
    *)       echo "usage: $0 start|stop|restart" >&2; exit 1 ;;
esac
