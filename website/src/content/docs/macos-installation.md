---
title: macOS Installation
description: Requirements, installation and day-to-day use on a Mac.
order: 3
---

**Status: available from source.** Tested on an Apple Silicon Mac. There is no packaged app — RTW runs from a terminal.

## Requirements

- macOS on Apple Silicon or Intel
- [Homebrew](https://brew.sh)
- `git`
- Disk space for content (see [Preparing Your Library](/docs/preparing-your-library/))

## Install

```bash
git clone https://github.com/eslam-mahmoud/reinvent-the-wheel.git
cd reinvent-the-wheel
./rtw setup
./rtw start
```

`./rtw setup`:

1. Installs **nginx** with Homebrew if missing.
2. Downloads **kiwix-tools** for macOS from Kiwix into `state/bin`.
3. Downloads the map viewer's JavaScript, fonts and icons into `web/vendor`.
4. Writes configuration to `state/conf`, creates a self-signed HTTPS certificate and the content folders.
5. Asks for an admin password.

It's safe to run again; it never touches your content or password.

## Where things live

| Path | Contents |
|---|---|
| `content/` | Your library — one folder per section |
| `state/conf/` | Generated config, HTTPS certificate, password hash |
| `state/logs/` | Logs (`./rtw logs admin`, `./rtw logs kiwix`) |

## Addresses

| Address | Use |
|---|---|
| `http://127.0.0.1:8080` | On the Mac itself |
| `http://<mac-ip>:8080` | Other devices on the same Wi-Fi |
| `https://<mac-ip>:8443` | Same, over HTTPS — needed for location on the map page |

## Updating

```bash
./rtw update
```

Pulls the latest version from GitHub and restarts the services.

## Limitations

- The Mac must stay awake while serving. Prevent sleep in System Settings or with `caffeinate -d` in another terminal.
- macOS may ask to allow incoming connections for nginx the first time other devices connect.
