---
title: Quick Start
description: Get an offline library running on a Mac in a few minutes.
order: 2
---

This is the fastest path: a Mac with the Xcode Command Line Tools (for `git` and Python 3) and [Homebrew](https://brew.sh). For Android, see [Android Installation](/docs/android-installation/).

## 1. Get the code

```bash
git clone https://github.com/eslam-mahmoud/reinvent-the-wheel.git
cd reinvent-the-wheel
```

## 2. Set up

```bash
./rtw setup
```

This installs nginx (via Homebrew) and the Kiwix server, downloads the map viewer's assets, writes the configuration and asks you to choose an **admin password** — used to upload and manage content from a browser.

## 3. Start

```bash
./rtw start
```

Open `http://127.0.0.1:8080` in a browser. The command also prints an address like `http://192.168.0.3:8080` that other devices on the same Wi-Fi can open.

## 4. Add content

While you're online:

```bash
./rtw fetch wikipedia   # Arabic Wikipedia, text only — about 8.4 GB
./rtw fetch maps        # Saudi Arabia + Egypt vector map — about 1.1 GB
./rtw fetch osmand      # OsmAnd navigation app and maps for phones
./rtw fetch bitchat     # Bitchat — offline Bluetooth mesh chat app
```

Or upload your own files at `/admin/`. After a new Wikipedia file arrives, run `./rtw restart`.

> The built-in fetch commands currently target Arabic Wikipedia and a Saudi Arabia + Egypt map — the first deployment's needs. Any language or region works; see [Using Kiwix and ZIM Files](/docs/using-kiwix-and-zim-files/) and [Preparing Your Library](/docs/preparing-your-library/).

## Everyday commands

```bash
./rtw status     # what's running, how much content
./rtw stop
./rtw passwd     # set or reset the admin password
```
