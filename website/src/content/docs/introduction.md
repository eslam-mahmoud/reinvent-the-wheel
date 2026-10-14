---
title: Introduction
description: What Reinvent the Wheel is, what it does today, and what it doesn't.
order: 1
---

**Reinvent the Wheel (RTW)** turns a Mac or an Android device into an offline knowledge library. You download useful collections while you're online — an encyclopedia, books, maps, manuals — and RTW serves them as ordinary web pages. Nearby devices can read the same library over local Wi-Fi, with no internet connection.

## What it does today

| Section | What you put in it | Where readers find it |
|---|---|---|
| Wikipedia | Kiwix `.zim` files | `/wiki/` |
| Books | PDF, EPUB and similar | `/books/` |
| Notes | Markdown or plain-text files | `/notes/` |
| Maps | One `.pmtiles` vector map | `/maps/` |
| Downloads | Anything — APKs, PDFs, archives | `/downloads/` |
| Sites | Static HTML sites | `/sites/` |
| Admin | Upload and manage all of the above (password) | `/admin/` |

## What it is not

- **Not a native app.** RTW is a small set of scripts and web pages around proven tools: [nginx](https://nginx.org), [kiwix-serve](https://kiwix.org), Python's standard library and [MapLibre](https://maplibre.org). On Android it runs inside the [Termux](https://termux.dev) terminal app.
- **Not a content distributor.** RTW doesn't bundle or mirror third-party material. It helps you fetch content from its original publishers, under their licenses.
- **Not a replacement for professionals or emergency services.** Reference material is for learning and preparedness.

## Platform status

- **macOS** — available from source and tested end to end.
- **Android** — in testing. Dependencies install and run in Termux on a test tablet; the full flow is still being verified. See [Android Installation](/docs/android-installation/).

## Next

- [Quick Start](/docs/quick-start/) — running in a few minutes.
- [How It Works](/how-it-works/) — the architecture in plain language.
