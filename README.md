# 🛞 RTW — Reinvent The Wheel

**RTW** is a small, self-contained **offline library server** — a lightweight
take on [Internet-in-a-Box](https://internet-in-a-box.org) that runs on an
**Android tablet** (inside the Termux app — no root, no flashing) or on a
**Mac**. It serves, with no internet:

| Section | What | URL |
|---|---|---|
| 🌐 Wikipedia | Arabic Wikipedia, text only (Kiwix ZIM) | `/wiki/` |
| 📖 Books | PDF, EPUB… browse & read | `/books/` |
| 📝 Notes | `.md` / `.txt` notes, rendered | `/notes/` |
| 🗺️ Maps | Saudi Arabia + Egypt, Arabic labels, GPS | `/maps/` |
| ⬇️ Downloads | APKs (e.g. OsmAnd navigation), PDFs, anything | `/downloads/` |
| 🧩 Sites | Your own static HTML sites | `/sites/` |
| 🔒 Admin | Upload & manage all of the above (password) | `/admin/` |

Phones and laptops just connect to the server's Wi-Fi and open it in a browser.

## How it works

```
 phones / laptops ──Wi-Fi──▶  server :8080 (http)  :8443 (https, self-signed)
                                  │
                                nginx ─┬─ /            home page + viewers (web/)
                                       ├─ /wiki/  ───▶ kiwix-serve  127.0.0.1:8081
                                       ├─ /data/  ───  files from content/ (JSON listings)
                                       ├─ /sites/ ───  content/www
                                       └─ /admin/ ───▶ admin_server.py 127.0.0.1:8082
                                                       (password via nginx basic auth)
```

- **nginx** serves the pages and the content files, and proxies the two
  internal services. Pages are plain HTML/JS — no build step.
- **kiwix-serve** serves Wikipedia from `.zim` files.
- **Maps** are a single `.pmtiles` file read directly by the browser
  (MapLibre) — no tile server. All map JS, fonts and icons are local (`web/vendor`).
- **admin_server.py** (Python stdlib only) handles uploads, rename/move,
  delete and note editing. It only listens on localhost; nginx checks the password.
- **Content** is plain files in folders — you can also manage it with a file
  manager, USB cable or microSD card.

## Repository layout

```
rtw               the one command: setup / start / stop / passwd / fetch / update / push
bootstrap.sh       one-line install on a tablet straight from GitHub
server/            nginx template, service scripts, admin API, Termux installer
web/               pages (home, books, notes, maps, downloads, admin)
scripts/           content downloads (Mac + tablet) and USB push (Mac)
website/           reinvent-the-wheel.com — the project website (Astro)
content/           the library itself (not in git)   ← on the tablet: /sdcard/RTW
state/             generated config, logs, pids, password (not in git)
```

## Content folders

| Folder | Accepts | Shown at |
|---|---|---|
| `wikipedia/` | `.zim` | `/wiki/` |
| `books/` | `.pdf .epub .mobi .azw3 .djvu .cbz .fb2 .txt` | `/books/` |
| `notes/` | `.md .markdown .txt` | `/notes/` |
| `maps/` | `.pmtiles` (first one is used) | `/maps/` |
| `downloads/` | anything | `/downloads/` |
| `www/` | anything (one folder per site, with `index.html`) | `/sites/` |

Subfolders are fine everywhere.

---

## 💻 On the Mac (run it locally)

Needs [Homebrew](https://brew.sh). Two commands:

```bash
./rtw setup     # installs nginx + kiwix, map assets, config; asks for admin password
./rtw start     # → http://127.0.0.1:8080
```

Other devices on the same Wi-Fi can use `http://<mac-ip>:8080` (printed by `start`).

Download the content (resumable — re-run if interrupted; unfinished files
wait in hidden `.partial` folders and are never served):

```bash
./rtw fetch all          # or one of: wikipedia | maps | osmand | bitchat | vendor
```

| Fetch | Size | Notes |
|---|---|---|
| `wikipedia` | ~8.4 GB | newest `wikipedia_ar_all_nopic`; `ZIM_PATTERN=wikipedia_ar_all_mini` for 3 GB |
| `maps` | ~1.2 GB | KSA + Egypt to zoom 15; `MAXZOOM=14` for smaller |
| `osmand` | ~850 MB | OsmAnd APK + KSA/EG navigation maps → `downloads/OsmAnd/` |
| `bitchat` | ~70 MB | Bitchat (offline Bluetooth mesh chat) APKs, checksum-verified → `downloads/Bitchat/` |
| `vendor` | ~15 MB | map viewer JS/fonts (done by `setup`) |

After a new `.zim` arrives: `./rtw restart` (or use **Reload** in admin).

## 📱 On the Android tablet (the server)

Tested on a Redmi Pad 2 Pro (Android 16, 8 GB RAM). Any 64-bit Android 8+
with ~4 GB RAM works; storage is the main need.

### Option A — straight from GitHub (no computer needed)

1. Install **Termux** (Play Store or F-Droid) and open it.
2. Paste:
   ```bash
   bash -c "$(curl -fsSL https://raw.githubusercontent.com/eslam-mahmoud/reinvent-the-wheel/main/bootstrap.sh)"
   ```
   It asks for storage access (tap **Allow**), installs everything into
   `~/rtw`, and asks you to choose the admin password.
3. Get content — on the tablet's own internet (Wi-Fi recommended, ~10 GB):
   ```bash
   rtw fetch all          # or: wikipedia | maps | osmand
   ```
   …or upload files from any device via `/admin/`, or copy them over USB.
4. `rtw start`, turn on the Android **hotspot**, and share the address it
   prints, e.g. `http://192.168.43.1:8080`.

Update later with `rtw update` (pulls from GitHub, keeps content and password).

### Option B — from the Mac over USB (no internet on the tablet)

With *USB debugging* on and the tablet plugged in, on the Mac:

```bash
./rtw push            # app + all content   (./rtw push app = app only)
```

Then in Termux:

```bash
termux-setup-storage                                         # once — tap Allow
bash ~/storage/shared/RTW/_setup/server/install-termux.sh   # asks for admin password
rtw start
```

To update: `./rtw push app` on the Mac, then re-run the `install-termux.sh` line.
Unfinished downloads (kept in hidden `.partial` folders) are never pushed.

Keep it running: Android Settings → Apps → Termux → Battery → **No restrictions**.
`rtw start` holds a wakelock. For start-on-boot, install the **Termux:Boot**
add-on from the same store as Termux (the boot script is already in place).

Content can be added three ways: the **admin page** from any device, `./rtw push`
from the Mac, or copying into the `RTW` folder with the Files app / microSD.

## 📲 On phones, laptops and other tablets (visitors)

Nothing to install — join the server's Wi-Fi and open the address in a browser.

- **Read**: Wikipedia, books (PDF/EPUB open or download), notes, HTML sites.
- **Install apps**: open **Downloads** and tap an `.apk` (Android asks to allow
  installs from the browser once).
- **Maps + GPS**: the map works everywhere; *showing your location* needs
  HTTPS, so the map page offers a link to `https://<server>:8443/maps/` —
  accept the certificate warning once. GPS works without internet.
- **Turn-by-turn navigation**: install **OsmAnd** from
  `Downloads → OsmAnd`, then download the `.obf` map files there and open them
  with OsmAnd. The phone then navigates fully offline, even away from the server.

## 🔒 Managing content (admin)

Open `/admin/` (preferably `https://<server>:8443/admin/` so the password isn't
sent in clear text) and log in as `admin`.

- **Dashboard**: files and size per section, free disk space.
- **Quick upload**: drop or pick any files — each goes to the right section
  by type (PDF/EPUB → books, APK & others → downloads, MD/TXT → notes,
  ZIM → wikipedia, PMTILES → maps, HTML → sites).
- **Inside a section**: upload into the current folder, create folders,
  **replace** a file with a new version, **rename / move** (also across
  sections), **delete** (folders with confirmation).
- **Notes**: create and **edit** notes in the browser.
- **Wikipedia**: adding/removing a `.zim` reloads Wikipedia automatically.

Uploads stream to disk, so multi-GB files work. A section rejects file types
that don't belong to it.

### Forgot the admin password?

Reset it on the server itself (terminal access proves you're the owner):

```bash
rtw passwd          # on the tablet (Termux)
./rtw passwd        # on the Mac
```

Takes effect immediately; no restart needed.

## Commands

```
rtw setup                 first-time setup (Mac)
rtw start|stop|restart    run the services
rtw status                services + content sizes
rtw passwd                set / reset admin password
rtw logs [name]           follow a log: nginx-error (default) | admin | kiwix
rtw fetch <what>          download content (Mac or tablet)
rtw update                pull the latest version from GitHub and re-install
rtw push [app]            Mac: copy to tablet over USB
```

On the tablet, `rtw-start`, `rtw-stop`, `rtw-status`, `rtw-passwd` also work.

## Troubleshooting

- **Page doesn't load from a phone**: same Wi-Fi? Use the IP printed by
  `rtw start`. Some routers isolate clients — the tablet's own hotspot avoids that.
- **Wikipedia missing**: `rtw status`, then `rtw logs kiwix`. A ZIM still
  downloading can't be served; restart once it's complete.
- **Server stopped after a while (tablet)**: Termux battery setting → No restrictions.
- **Map blank**: is there a `.pmtiles` file in `maps/`? Was `web/vendor` pushed?
