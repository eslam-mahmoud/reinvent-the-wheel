---
title: Troubleshooting
description: Fixes for common problems.
order: 11
---

Start with:

```bash
rtw status
rtw logs          # or: rtw logs admin · rtw logs kiwix
```

## Other devices can't open the library

- Are they on the **same Wi-Fi** as the host? Use the address from `rtw address` (or the library's home page), including `:8080`.
- **Turned on the hotspot after starting?** Android gives the hotspot a new address each time; the one `rtw start` printed earlier no longer works. Run `rtw address` for the current one.
- Some routers isolate devices from each other ("client isolation"). Use the host's own hotspot instead.
- On a Mac, allow incoming connections for nginx if macOS asks.

## Wikipedia shows an error

- `rtw status` should show `kiwix: running`. If not, check `rtw logs kiwix`.
- A ZIM that's still downloading can't be served. Wait until it finishes, then `rtw restart`.
- Make sure the file ends in `.zim` and sits directly in the `wikipedia/` folder.

## The map is blank

- Is there a `.pmtiles` file in `maps/`?
- Were the map assets installed? Run `rtw fetch vendor`, then reload the page.

## "Use the HTTPS address" for location

Browsers only share location with secure pages. Open `https://<host>:8443/maps/` and accept the certificate warning once. On the host device itself, `http://127.0.0.1:8080` works without it.

## Android stops serving after a while

Set Termux's battery usage to *No restrictions* (Android Settings → Apps → Termux → Battery). `rtw start` also takes a wakelock; leave the Termux notification in place.

## Uploads fail

- *"accepts: …"* — that section doesn't take this file type. Use *Quick upload*, which routes files automatically, or upload to *Downloads*.
- *"not enough free space"* — free some space; uploads keep about 200 MB in reserve.
- Wrong password? Reset it with `rtw passwd`.

## Still stuck

[Open an issue](https://github.com/eslam-mahmoud/reinvent-the-wheel/issues) with your platform, what you ran, and the output of `rtw status`.
