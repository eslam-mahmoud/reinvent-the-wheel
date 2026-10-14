---
title: Running Offline
description: Starting, stopping and checking the library day to day.
order: 7
---

Once content is downloaded, RTW needs no internet connection at all.

## Commands

```bash
rtw start      # start everything and print the addresses
rtw stop
rtw restart
rtw status     # services and content sizes
rtw logs       # follow the web server's error log (also: admin, kiwix)
```

On a Mac, run them from the project folder as `./rtw …`. On Android, `rtw-start`, `rtw-stop`, `rtw-status` and `rtw-passwd` also work.

## What runs

| Service | Port | Purpose |
|---|---|---|
| nginx | 8080, 8443 | Pages, files, and the front door for everything else |
| kiwix-serve | 8081 (local only) | Wikipedia and other ZIM files |
| admin API | 8082 (local only) | Uploads and content management |

Only nginx is reachable from other devices.

## The admin password

Uploading and managing content requires the admin password. If you forget it, reset it **on the device itself**:

```bash
rtw passwd
```

Having access to the device's terminal is what proves you're the owner. The change takes effect immediately.

## Check before you need it

Before you rely on the library, switch off Wi-Fi and mobile data and try it: open a few Wikipedia articles, a book, a note and the map. It's much easier to fix a missing piece while you're still online.
