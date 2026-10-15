# RTW knowledge packs — implementation handoff

## Scope and status
A bilingual curated source catalog lives at `packages/catalog.json`, installed by `scripts/packs.py` through `rtw fetch` (macOS and Termux, Python standard library only). Documents/APKs are **not committed** to this repository.

### Implemented (2026-10-15)
- `rtw fetch` (TTY wizard), `list`, `status`, `group <id>`, `missing`, `all`, `--yes --groups a,b`; legacy `rtw fetch wikipedia|maps|osmand|bitchat|vendor` unchanged.
- `rtw fetch all` = vendor assets + **every** catalog group, non-interactive.
- Required baseline (`islamic-essentials`) installs with any first content fetch; offline it prints a retry hint and never fails the command.
- PDFs stream to `CONTENT/.rtw-packages/partial/` (hidden: not served, not pushed), resume with HTTP Range, reject non-2xx and HTML, check `%PDF-`, size and catalog SHA-256 when present, then move into place atomically. Receipts in `CONTENT/.rtw-packages/installed.json`; status re-checks files (signature + recorded size) and works without a receipt.
- `mode: link` items are never downloaded; each group's links are written to a bilingual note `notes/RTW-References/<group>.md` marked "needs internet".
- Labels follow `RTW_LANG` or the locale (Arabic / English).
- Website: Library page marks sources `rtw fetch` downloads vs. online links; knowledge packs marked available; docs (EN/AR) explain the commands.

### Verified
- Qur'an URL: `application/pdf`, 243,520,529 bytes, `%PDF-1.6`, range requests supported (2026-10-15). Forty Nawawi 597,077 bytes; FAO garden 8,364,980 bytes.
- Test catalog: baseline-first install, no re-download, HTML/404/no-host rejection, link note, damaged-file repair via `missing`, status without receipt, resume from a 200 KB partial (checksum matches a clean download), offline baseline exit 0, Arabic labels.

### Verified on devices (2026-10-15)
- macOS (Apple Silicon): `rtw fetch group islamic-essentials` — Qur'an + Nawawi installed, sizes match the publishers.
- Android (Redmi Pad 2 Pro, Termux): `rtw fetch list` detects existing content; the wizard (choice `4`) installed the baseline + FAO guide on the device (240.8 MB); files appear under Books → Islam in the offline app.

### Remaining
- Offline web UI: an Islamic Studies shortcut (files already appear under Books → Islam).
- Add `sha256` to catalog entries once publishers' files are confirmed stable.

## Required baseline
Install from original publishers on the first **explicit** content fetch:
- Qur'an: `islamic-essentials/quran-hafs` — King Fahd Qur'an Printing Complex (user-specified PDF; access test pending).
- Forty Nawawi: `islamic-essentials/nawawi-forty` — 32-page IslamHouse/Dar al-Salam source.

The default pair must be selected and installed even when the user chooses no optional groups; on failure show clear retry instructions. Don't re-download on every setup or update; verify a complete existing copy first. Preserve content on upgrades. Because installation may run without network, setup itself must not fail due to document downloads.

## Interactive fetch design (macOS Bash and Termux)
1. Keep `rtw fetch wikipedia|maps|osmand|bitchat|vendor` working. Keep `rtw fetch all` noninteractive for scripts, clearly define its group coverage.
2. Add `rtw fetch` (TTY wizard) and `rtw fetch list`, `rtw fetch status`, `rtw fetch group <id>`, `rtw fetch missing`, `rtw fetch --yes --groups <id,id>`.
3. Display the names in English/Arabic based on locale; show what is installed/missing, estimated bytes, free disk space, sources and licensing warnings.
4. Automatically select `islamic-essentials` as a required baseline during first content fetch; prompt for optional category groups (including the six Hadith references). Users can revisit selections later with `rtw fetch`.
5. Sources with `mode:link` must remain **reference-only**; store citation/URL metadata for local browsing, not scraped content. `sunnah.com/about` forbids scraping and mass reproduction. Only turn a Hadith title into a downloadable PDF when a verified original-publisher PDF and lawful download terms are identified.
6. Sources with `mode:pdf` download from the original URL on the user's machine to `CONTENT/<output>`. Stream to `.partial`, resume safely where possible, verify HTTP 2xx, reject HTML bodies, check the PDF signature, verify known hashes when available; only atomically rename after verification.
7. Keep a receipt `CONTENT/.rtw-packages/installed.json` with source URL, SHA-256, bytes, timestamp and status. A successful receipt must agree with files on disk.
8. On failures, preserve usable completed items and resumable temporary files; print failed items and `rtw fetch missing`. Do not silently skip required baseline files.
9. Ensure `rtw push` transfers packs correctly to Android and does not include incomplete files. Server should list PDFs in `/books/`, with `books/Islam/01-Quran` and `books/Islam/02-Hadith`, without requiring new MIME types.
10. Do not commit any third-party binary/PDF directly to git unless redistribution is explicitly approved. GitHub repository holds manifests, scripts and provider links only.

## Website / offline-server UI
- `website/src/data/library.ts` needs an Islamic Studies card in both languages including Qur'an PDF, Forty Nawawi PDF and all six Sunnah.com collection references.
- Update `website/src/views/Library.astro` copy only once the fetch wizard exists; currently it truthfully labels packs **Planned**.
- Add an Islamic Studies shortcut to the offline web UI as a future task; keep its files within the existing Books listing.
- Clearly distinguish “available source”, “downloadable by fetch”, and “installed locally”. A reference link is not an offline book.

## Suggested acceptance tests
- Fresh macOS and Termux install: first `rtw fetch` selects Qur'an + Nawawi by default.
- User skips all optional groups; later runs `rtw fetch group food-agriculture` and succeeds.
- Existing PDFs are never overwritten unless integrity fails or user requests refresh.
- `rtw fetch status` reflects actual files, not stale receipts.
- Offline mode: already fetched content opens; missing links show “requires internet”.
- Network interruption/restart: partial files never appear in Books; retries can resume.
- Existing `rtw fetch maps|bitchat|wikipedia|osmand` still behave exactly as before.
- macOS and Android use identical manifest parsing; tests cover RTL Arabic group names.
- Verify Qur'an publisher PDF by downloading/inspecting its first/last page before marking tested.

## Permissions
The Complex's site usage policy reserves rights unless specifically opened; user-side downloads differ from redistribution. The Six Hadith links are reference-only; Sunnah.com forbids scraping/mass reproduction and has a separately permissioned API. FAO's garden manual permits certain attribution-based non-commercial uses; verify before including it in any mirror.
