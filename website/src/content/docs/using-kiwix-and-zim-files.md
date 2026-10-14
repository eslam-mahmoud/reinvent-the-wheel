---
title: Using Kiwix and ZIM Files
description: How RTW serves Wikipedia and other collections with Kiwix.
order: 6
---

[Kiwix](https://kiwix.org) packages websites — Wikipedia, Wiktionary, Stack Exchange, and many more — into single compressed **ZIM** files that can be read offline. RTW runs Kiwix's own server, `kiwix-serve`, and shows every ZIM in the `wikipedia/` folder under `/wiki/`.

## Getting ZIM files

Browse the [Kiwix library](https://library.kiwix.org) or the [download directory](https://download.kiwix.org/zim/). File names describe the content:

```
wikipedia_ar_all_nopic_2026-08.zim
│         │  │   │     └ release (year-month)
│         │  │   └ variant: maxi (images) · nopic (no images) · mini (intros only)
│         │  └ scope: all, top, or a topic
│         └ language
└ project
```

## Fetching Wikipedia with RTW

```bash
rtw fetch wikipedia
```

Downloads the newest `wikipedia_ar_all_nopic` file, verifies it against Kiwix's published SHA-256 checksum, and keeps only the newest copy. For another language or variant, set a pattern:

```bash
ZIM_PATTERN=wikipedia_en_all_nopic rtw fetch wikipedia
```

## Adding any ZIM manually

Put the `.zim` file in the `wikipedia/` folder, then reload:

```bash
rtw restart
```

Uploading or deleting a ZIM through `/admin/` reloads Wikipedia automatically.

## Licenses

ZIM files carry the license of their source. Wikipedia content is CC BY-SA; other collections differ. Kiwix and its tools are free software — see [kiwix.org](https://kiwix.org).
