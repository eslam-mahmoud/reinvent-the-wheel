---
title: Preparing Your Library
description: Choose, download and organise content while you're online.
order: 5
---

A library is only as useful as what's in it. Prepare it **while you have a connection** — downloads are large, and you can't fetch anything once you're offline.

## Sections and file types

Each section only accepts the file types that belong in it, so the library stays organised.

| Folder | Accepts | Shown at |
|---|---|---|
| `wikipedia/` | `.zim` | `/wiki/` |
| `books/` | `.pdf` `.epub` `.mobi` `.azw3` `.djvu` `.cbz` `.fb2` `.txt` | `/books/` |
| `notes/` | `.md` `.markdown` `.txt` | `/notes/` |
| `maps/` | `.pmtiles` — the first one found is used | `/maps/` |
| `downloads/` | anything | `/downloads/` |
| `www/` | anything — one folder per site with an `index.html` | `/sites/` |

Subfolders are fine everywhere. On a Mac the folders are in `content/`; on Android in the shared `RTW` folder.

## Three ways to add content

1. **Fetch commands** — `rtw fetch wikipedia | maps | osmand | bitchat | all`. Resumable; unfinished downloads wait in hidden `.partial` folders and are never shown to readers.
2. **The admin page** — open `/admin/`, log in as `admin`, and drop files. *Quick upload* sends each file to the right section by type. You can also rename, move, replace and delete files, and write notes in the browser.
3. **Copy files directly** into the folders — Finder, the Android Files app, a USB cable or a memory card.

## Sizing

Approximate sizes of the default collections:

| Collection | Size |
|---|---|
| Arabic Wikipedia, text only (`wikipedia_ar_all_nopic`) | ~8.4 GB |
| Arabic Wikipedia, introductions only (`wikipedia_ar_all_mini`) | ~3 GB |
| Saudi Arabia + Egypt map to zoom 15 | ~1.1 GB |
| OsmAnd app + Saudi Arabia/Egypt navigation maps | ~1.5 GB |
| Bitchat app (arm64 + universal) | ~70 MB |

Leave headroom: the server refuses an upload if it would leave less than about 200 MB free.

## Choosing what to keep

See the [Knowledge Library](/en/library/) for categories and reputable sources. Check each publisher's license before sharing material with others — not everything that's free to download is free to redistribute.

## Maps for other regions

`rtw fetch maps` cuts a region out of the latest [Protomaps](https://protomaps.com) world build. The region is defined in `scripts/fetch-maps.sh` as a GeoJSON polygon — edit the coordinates for your area. `MAXZOOM=14 rtw fetch maps` makes a smaller file with less street detail.
