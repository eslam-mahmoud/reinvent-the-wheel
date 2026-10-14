---
title: Architecture
description: How the pieces fit together, for contributors.
order: 12
---

RTW is deliberately small: a shell command, a web server configuration, a few static pages and a standard-library Python service. Everything heavy is done by established tools.

## Components

```
 readers ──Wi-Fi──▶ nginx :8080 (http) / :8443 (https, self-signed)
                       │
                       ├─ /            home page and viewers   (web/)
                       ├─ /wiki/  ───▶ kiwix-serve 127.0.0.1:8081
                       ├─ /data/  ───  content files + JSON listings
                       ├─ /sites/ ───  content/www
                       └─ /admin/ ───▶ admin_server.py 127.0.0.1:8082
                                       (behind nginx basic auth)
```

| Part | Role |
|---|---|
| `rtw` | One command for setup, start/stop, password, fetching and updates. Same script on macOS and Termux. |
| `server/nginx.conf.in` | Template rendered by `server/configure.sh` for each machine. |
| `server/start.sh`, `stop.sh` | Start services and track PIDs — Android has no systemd. |
| `server/admin_server.py` | Upload, rename, move, delete and edit. Streams uploads to disk; restricts each section to its file types. |
| `web/` | Plain HTML, CSS and JavaScript. No build step. |
| `scripts/` | Content downloads (Mac and Android) and the USB push. |

## Design choices

- **Reuse, don't rebuild.** Kiwix serves ZIM files; nginx serves everything else; MapLibre renders maps from a single PMTiles file with no tile server.
- **Folders are the database.** Content is plain files. Directory listings come from nginx as JSON, so any file manager is also a content manager.
- **Small trusted surface.** Only nginx listens on the network. The admin API binds to localhost and is reached through nginx's password check. A custom request header blocks cross-site requests.
- **Same code everywhere.** Platform differences are confined to setup: Homebrew on macOS, `pkg` in Termux.

## Runtime layout

```
state/conf/    rtw.env · nginx.conf · htpasswd · tls.crt/key · config.js
state/logs/    nginx, kiwix and admin logs
state/run/     PID files and nginx temp folders
state/bin/     downloaded tools (kiwix on macOS, pmtiles on Linux)
```
