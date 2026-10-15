---
title: Sharing over Local Wi-Fi
description: Let nearby phones, laptops and tablets use the library.
order: 8
---

A Wi-Fi network is a connection between nearby devices. It doesn't need the internet: when a phone opens the library's address, the host device answers directly.

## Two ways to connect

1. **The host's hotspot** — on Android, turn on the hotspot and let people join it. Best for the field: no router needed, and some routers block devices from seeing each other. (A Mac is easiest to use on an existing network.)
2. **An existing Wi-Fi network** — the host and readers join the same router.

`rtw start` prints the address to share, for example:

```
Open on this device:   http://127.0.0.1:8080
Open on other devices: http://192.168.43.1:8080   (GPS on map: https://192.168.43.1:8443)
```

### The address changes

The address depends on the network. It changes when the host joins a different Wi-Fi, and on Android **the hotspot gets a new address every time it's turned on**. Check the current one at any time:

```bash
rtw address
```

The library's home page also shows it, under **Share this library**.

## On the readers' devices

Nothing to install. Any reasonably modern browser works, so older phones make good readers.

- **Books, Wikipedia, notes, sites** — open and read.
- **Apps** — tap an `.apk` in *Downloads*; Android asks once to allow installs from the browser.
- **Location on the map** — browsers only share location with HTTPS pages. The map page links to the `https://…:8443` address; accept the certificate warning once.
- **Chat without internet** — install **Bitchat** from *Downloads → Bitchat*. It messages nearby phones over Bluetooth mesh, with no network at all.
- **Turn-by-turn navigation** — install **OsmAnd** from *Downloads → OsmAnd*, download the `.obf` map files there and open them with OsmAnd. The phone then navigates offline with its own GPS, even away from the host.

## Security notes

- Anyone on the same network can read the library. Only uploads and changes need the password.
- Log in to `/admin/` over the `https://…:8443` address so the password isn't sent as plain text.
- The certificate is self-signed, so browsers warn about it. That's expected on a private network.
