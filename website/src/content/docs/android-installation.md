---
title: Android Installation
description: Install RTW in Termux on an Android phone or tablet.
order: 4
---

**Status: in testing.** On a Redmi Pad 2 Pro (Android 16), the dependencies install and run in Termux. The complete install-and-serve flow is still being verified — please [report what works on your device](/contribute/).

RTW runs inside **Termux**, a terminal app for Android. There is no root, no custom firmware and no separate RTW app.

## Requirements

- A 64-bit ARM device (`arm64-v8a`)
- **Termux.** The F-Droid / GitHub build supports Android 7 and newer. The Google Play build we tested requires Android 12L or newer.
- Free storage for content
- About 4 GB of RAM or more is comfortable

## Install from GitHub (no computer)

Open Termux and run:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/eslam-mahmoud/reinvent-the-wheel/main/bootstrap.sh)"
```

The installer:

1. Asks for **storage access** — tap *Allow*. Content lives in the shared `RTW` folder (`/sdcard/RTW`).
2. Installs `nginx`, `kiwix-tools`, `python`, `git` and a few utilities with `pkg`.
3. Clones the project into `~/rtw`.
4. Downloads the map viewer assets and writes configuration.
5. Asks you to choose an **admin password**.

Then:

```bash
rtw start
```

## Install from a Mac over USB

Useful when the device has no internet. With *USB debugging* enabled and the device connected, on the Mac:

```bash
./rtw push
```

Then in Termux:

```bash
termux-setup-storage
bash ~/storage/shared/RTW/_setup/server/install-termux.sh
rtw start
```

## Keep it running

- **Battery:** Android Settings → Apps → Termux → Battery → *No restrictions*. Otherwise Android may stop the server in the background.
- `rtw start` takes a Termux wakelock.
- **Start on boot** requires the separate *Termux:Boot* add-on, installed from the same source as Termux. The installer already places its boot script.

## Share it

Turn on the Android hotspot and give people the address `rtw start` prints. See [Sharing over Local Wi-Fi](/docs/sharing-over-local-wifi/).

## Known limitations

- Ports below 1024 aren't available without root, so the library uses port `8080` (and `8443` for HTTPS).
- External USB storage is not supported yet — see [External USB Storage](/docs/external-usb-storage/).
