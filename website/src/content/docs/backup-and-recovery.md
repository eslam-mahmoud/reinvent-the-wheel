---
title: Backup & Recovery
description: Protect your library and recover from a lost device or password.
order: 10
---

A single copy of anything is fragile. Storage fails, devices get lost, phones get reset.

## What to back up

| What | Where | Why |
|---|---|---|
| Your content | `content/` (Mac) · `RTW` folder (Android) | Large, slow to re-download, and some sources change or disappear |
| Configuration | `state/conf/` | Password hash and HTTPS certificate — optional, both can be recreated |

The application itself doesn't need a backup: it can always be reinstalled from GitHub.

## How

- **Simplest:** copy the content folder to an external drive or another computer.
- **Mac to Android (or back):** `rtw push` copies the Mac's content to a connected Android device over USB, skipping files that are already there.
- **Two libraries:** keeping a second device with the same content is a backup you can also use.

Large Kiwix files come with published checksums. `rtw fetch wikipedia` checks them automatically; after copying a ZIM by hand you can compare it with the `.sha256` file on [download.kiwix.org](https://download.kiwix.org/zim/).

## Recovery

- **Forgot the admin password:** run `rtw passwd` on the device. No data is lost.
- **Broken install:** run the installer again (`rtw setup` on a Mac, the bootstrap command on Android). It never deletes content.
- **Lost device:** install RTW on a new one and copy your content backup into its content folder.
