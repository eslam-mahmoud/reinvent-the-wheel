#!/usr/bin/env bash
source "$(dirname "$0")/common.sh"

for s in nginx kiwix admin; do
    if running "$s"; then echo "$s: running (pid $(cat "$STATE/run/$s.pid"))"; else echo "$s: stopped"; fi
done

echo
echo "Content in $CONTENT:"
for d in wikipedia books notes maps www downloads; do
    printf '  %-10s %s\n' "$d" "$(du -sh "$CONTENT/$d" 2>/dev/null | cut -f1)"
done

echo
print_addresses
