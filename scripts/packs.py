#!/usr/bin/env python3
"""Knowledge packs: install curated content from packages/catalog.json.

Used by `rtw fetch` (macOS and Termux; Python standard library only).

  packs.py wizard                 interactive picker (TTY)
  packs.py list                   groups, items, sizes and what's installed
  packs.py status                 per-item state, checked against files on disk
  packs.py install --groups a,b   install the chosen groups
  packs.py install --all          every group, no questions (rtw fetch all)
  packs.py missing                retry anything selected before but not on disk

Item modes (catalog `mode`):
  pdf             download from the original publisher into CONTENT/<output>
  link            reference only; listed in a local note, never downloaded
  legacy_command  delegated to the existing scripts/fetch-<name>.sh

Nothing is installed unless the user chooses it; groups marked
"recommended" are only suggested.

Downloads stream into CONTENT/.rtw-packages/partial/ (hidden, never served or
pushed), resume when the server allows, are checked (HTTP 2xx, not HTML, PDF
signature, size, SHA-256 when the catalog has one) and only then moved into
place. Receipts live in CONTENT/.rtw-packages/installed.json; status always
re-checks the files themselves.
"""
import argparse
import datetime
import hashlib
import http.client
import json
import os
import shutil
import subprocess
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.realpath(os.environ.get("CONTENT") or os.path.join(ROOT, "content"))
# RTW_CATALOG lets tests use a small catalog.
CATALOG = os.environ.get("RTW_CATALOG") or os.path.join(ROOT, "packages", "catalog.json")
STATE = os.path.join(CONTENT, ".rtw-packages")
RECEIPT = os.path.join(STATE, "installed.json")
PARTIAL = os.path.join(STATE, "partial")
REFS_DIR = os.path.join(CONTENT, "notes", "RTW-References")
UA = "Mozilla/5.0 (compatible; rtw-fetch; +https://reinvent-the-wheel.com)"
CHUNK = 1 << 20

LEGACY = {  # legacy command -> (script, check that it's installed)
    "wikipedia": ("fetch-wikipedia.sh", lambda: any(f.endswith(".zim") for f in _ls("wikipedia"))),
    "maps": ("fetch-maps.sh", lambda: any(f.endswith(".pmtiles") for f in _ls("maps"))),
    "osmand": ("fetch-osmand.sh", lambda: any(f.endswith(".apk") for f in _ls("downloads/OsmAnd"))),
    "bitchat": ("fetch-bitchat.sh", lambda: any(f.endswith(".apk") for f in _ls("downloads/Bitchat"))),
}


def _ls(rel):
    try:
        return os.listdir(os.path.join(CONTENT, rel))
    except OSError:
        return []


# ---------- language ----------

def detect_lang():
    v = (os.environ.get("RTW_LANG") or os.environ.get("LC_ALL") or os.environ.get("LANG") or "").lower()
    return "ar" if v.startswith("ar") else "en"


LANG = detect_lang()
T = {
    "en": {
        "installed": "installed", "missing": "not installed", "damaged": "damaged — will re-download",
        "link": "online link", "partial": "partly downloaded", "recommended": "recommended",
        "free": "free disk space", "total": "selected download",
        "prompt": "Groups to install — numbers like 1 3 4, 'r' for recommended, 'a' for all, Enter to cancel: ",
        "nothing": "Nothing to install.", "done": "Done.", "failed": "Some items failed:",
        "retry": "Retry later with: rtw fetch missing", "no_space": "Not enough free space for",
        "linknote": "Online references — these need internet; they are not stored on this device.",
        "unknown_group": "Unknown group",
    },
    "ar": {
        "installed": "مثبّت", "missing": "غير مثبّت", "damaged": "تالف — سيُعاد تنزيله",
        "link": "رابط على الإنترنت", "partial": "منزّل جزئيًا", "recommended": "مقترح",
        "free": "المساحة الحرة", "total": "حجم التنزيل المختار",
        "prompt": "المجموعات المطلوبة — أرقام مثل 1 3 4، أو r للمقترح، أو a للكل، أو Enter للإلغاء: ",
        "nothing": "لا شيء للتثبيت.", "done": "تم.", "failed": "تعذّر تنزيل بعض العناصر:",
        "retry": "أعد المحاولة لاحقًا بالأمر: rtw fetch missing", "no_space": "لا توجد مساحة كافية لـ",
        "linknote": "روابط مرجعية — تحتاج إلى الإنترنت ولا تُحفظ على هذا الجهاز.",
        "unknown_group": "مجموعة غير معروفة",
    },
}[LANG]


def name(obj):
    title = obj.get("title", {})
    return title.get(LANG) or title.get("en") or obj.get("id")


def human(n):
    if n is None:
        return "?"
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.0f} {unit}" if unit == "B" else f"{n:.1f} {unit}"
        n /= 1024


# ---------- catalog & receipts ----------

def load_catalog():
    with open(CATALOG, encoding="utf-8") as f:
        cat = json.load(f)
    for g in cat["groups"]:
        for r in g["resources"]:
            r["_key"] = f'{g["id"]}/{r["id"]}'
    return cat


def load_receipt():
    try:
        with open(RECEIPT, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {"schema": 1, "selected_groups": [], "items": {}}


def save_receipt(rec):
    os.makedirs(STATE, exist_ok=True)
    tmp = RECEIPT + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(rec, f, ensure_ascii=False, indent=2)
    os.replace(tmp, RECEIPT)


def item_state(r, rec):
    """installed | missing | damaged | partial | link — always from disk."""
    mode = r["mode"]
    if mode == "link":
        return "link"
    if mode == "legacy_command":
        cmd = r["url"].split()[-1]
        return "installed" if cmd in LEGACY and LEGACY[cmd][1]() else "missing"
    try:
        out = output_path(r)
    except FetchError:
        return "damaged"
    if not os.path.isfile(out):
        return "partial" if os.path.exists(partial_path(r)) else "missing"
    size = os.path.getsize(out)
    want = (rec["items"].get(r["_key"]) or {}).get("bytes")
    try:
        with open(out, "rb") as f:
            ok_sig = f.read(5) == b"%PDF-"
    except OSError:
        ok_sig = False
    if not ok_sig or (want is not None and size != want):
        return "damaged"
    return "installed"


def output_path(r):
    """CONTENT/<output>, refusing paths that would escape the content folder."""
    out = os.path.realpath(os.path.join(CONTENT, r["output"]))
    if not out.startswith(CONTENT + os.sep):
        raise FetchError(f'unsafe output path in catalog: {r["output"]}')
    return out


def partial_path(r):
    return os.path.join(PARTIAL, r["_key"].replace("/", "__") + ".part")


# ---------- downloading ----------

class FetchError(Exception):
    pass


def download_pdf(r, rec, refresh=False, _retry=True):
    out = output_path(r)
    if not refresh and item_state(r, rec) == "installed":
        return "already"
    os.makedirs(PARTIAL, exist_ok=True)
    part = partial_path(r)
    meta = part + ".validator"  # ETag / Last-Modified of the partial's version
    have = os.path.getsize(part) if os.path.exists(part) else 0
    validator = ""
    if have and os.path.exists(meta):
        with open(meta, encoding="utf-8") as f:
            validator = f.read().strip()
    if have and not validator:  # can't prove it's the same file: start over
        have = 0
    expected = r.get("bytes")
    if expected and shutil.disk_usage(CONTENT).free < (expected - have) + (200 << 20):
        raise FetchError(f'{T["no_space"]} {name(r)} ({human(expected)})')

    req = urllib.request.Request(r["url"], headers={"User-Agent": UA})
    if have:
        # Resume only if the file is unchanged; otherwise the server sends it whole.
        req.add_header("Range", f"bytes={have}-")
        req.add_header("If-Range", validator)
    try:
        resp = urllib.request.urlopen(req, timeout=60)
    except urllib.error.HTTPError as e:
        if e.code == 416 and have and _retry:  # partial doesn't fit the file: restart it
            for f in (part, meta):
                if os.path.exists(f):
                    os.remove(f)
            return download_pdf(r, rec, refresh, _retry=False)
        raise FetchError(f"HTTP {e.code}") from None
    except (urllib.error.URLError, OSError) as e:
        raise FetchError(str(getattr(e, "reason", e))) from None

    with resp:
        if not 200 <= resp.status < 300:
            raise FetchError(f"HTTP {resp.status}")
        ctype = (resp.headers.get("Content-Type") or "").lower()
        if "text/html" in ctype:
            raise FetchError("server returned a web page, not a PDF")
        resuming = resp.status == 206
        if not resuming:
            have = 0
            tag = resp.headers.get("ETag") or resp.headers.get("Last-Modified") or ""
            with open(meta, "w", encoding="utf-8") as f:
                f.write(tag)
        length = resp.headers.get("Content-Length")
        total = have + int(length) if length else expected
        try:
            with open(part, "ab" if resuming else "wb") as f:
                done = have
                while True:
                    chunk = resp.read(CHUNK)
                    if not chunk:
                        break
                    f.write(chunk)
                    done += len(chunk)
                    progress(name(r), done, total)
        except (OSError, http.client.HTTPException):
            sys.stderr.write("\n")
            raise FetchError("connection lost — run again to resume") from None
        sys.stderr.write("\n")
        if total and os.path.getsize(part) != total:
            raise FetchError("download incomplete — run again to resume")

    with open(part, "rb") as f:
        if f.read(5) != b"%PDF-":
            os.remove(part)
            raise FetchError("not a PDF file")
    digest = sha256(part)
    if r.get("sha256") and digest != r["sha256"]:
        os.remove(part)
        raise FetchError("checksum mismatch")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    os.replace(part, out)
    if os.path.exists(meta):
        os.remove(meta)
    rec["items"][r["_key"]] = {
        "url": r["url"], "output": r["output"], "sha256": digest, "bytes": os.path.getsize(out),
        "installed_at": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        "status": "installed",
    }
    save_receipt(rec)
    return "installed"


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(CHUNK), b""):
            h.update(chunk)
    return h.hexdigest()


def progress(label, done, total):
    if total:
        pct = done * 100 // total
        bar = "#" * (pct // 4)
        sys.stderr.write(f"\r  {label[:40]:40} [{bar:<25}] {pct:3d}% {human(done)}/{human(total)}")
    else:
        sys.stderr.write(f"\r  {label[:40]:40} {human(done)}")
    sys.stderr.flush()


def run_legacy(r):
    cmd = r["url"].split()[-1]
    script = os.path.join(ROOT, "scripts", LEGACY[cmd][0])
    res = subprocess.run(["bash", script])
    if res.returncode:
        raise FetchError(f"{r['url']} failed")
    return "installed"


def write_references(group):
    """Reference-only links become a local note listing them (needs internet)."""
    links = [r for r in group["resources"] if r["mode"] == "link"]
    if not links:
        return
    os.makedirs(REFS_DIR, exist_ok=True)
    title = group["title"]
    lines = [f'# {title.get("ar", "")} — {title.get("en", "")}', "",
             "> روابط مرجعية — تحتاج إلى الإنترنت ولا تُحفظ على هذا الجهاز.",
             "> Online references — these need internet; they are not stored on this device.", ""]
    for r in links:
        t = r.get("title", {})
        lines.append(f'- [{t.get("ar", "")} — {t.get("en", "")}]({r["url"]})'
                     + (f' · {r["publisher"]}' if r.get("publisher") else ""))
        if r.get("license_status"):
            lines.append(f'  - {r["license_status"]}')
    lines += ["", "_Generated by `rtw fetch`._", ""]
    with open(os.path.join(REFS_DIR, f'{group["id"]}.md'), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


# ---------- commands ----------

def groups_by_id(cat):
    return {g["id"]: g for g in cat["groups"]}


def group_size(g, rec):
    """Bytes still to download for a group's PDFs (catalog estimate)."""
    return sum(r.get("bytes") or 0 for r in g["resources"]
               if r["mode"] == "pdf" and item_state(r, rec) != "installed")


def install(cat, group_ids, refresh=False):
    rec = load_receipt()
    by_id = groups_by_id(cat)
    order = list(dict.fromkeys(group_ids))  # as chosen, without duplicates
    if not order:
        print(T["nothing"])
        return 0
    for gid in order:
        if gid not in by_id:
            raise SystemExit(f'{T["unknown_group"]}: {gid}')
    rec["selected_groups"] = sorted(set(rec.get("selected_groups", [])) | set(order))
    save_receipt(rec)

    failures = []
    for gid in order:
        g = by_id[gid]
        print(f"\n== {name(g)}")
        write_references(g)
        for r in g["resources"]:
            state = item_state(r, rec)
            if r["mode"] == "link":
                print(f"  · {name(r)} — {T['link']}")
                continue
            if state == "installed" and not refresh:
                print(f"  ✓ {name(r)} — {T['installed']}")
                continue
            try:
                if r["mode"] == "pdf":
                    download_pdf(r, rec, refresh=refresh or state == "damaged")
                elif r["mode"] == "legacy_command":
                    run_legacy(r)
                print(f"  ✓ {name(r)}")
            except FetchError as e:
                failures.append((g, r, str(e)))
                print(f"  ✗ {name(r)} — {e}")
    print()
    if failures:
        print(T["failed"])
        for g, r, err in failures:
            print(f"  - {name(g)} / {name(r)}: {err}")
        print(T["retry"])
        return 1
    print(T["done"])
    return 0


def cmd_list(cat, statuses=False):
    rec = load_receipt()
    print(f'{T["free"]}: {human(shutil.disk_usage(CONTENT).free)}  ·  {CONTENT}\n')
    for i, g in enumerate(cat["groups"], 1):
        tag = f' [{T["recommended"]}]' if g.get("selection") == "recommended" else ""
        need = group_size(g, rec)
        print(f'{i:2}. {name(g)}{tag}  ({g["id"]}{", " + human(need) if need else ""})')
        for r in g["resources"]:
            st = item_state(r, rec)
            mark = {"installed": "✓", "link": "↗", "damaged": "!", "partial": "…"}.get(st, " ")
            extra = f"  {human(r.get('bytes'))}" if r["mode"] == "pdf" else ""
            print(f'      {mark} {name(r)} — {T[st]}{extra}' if statuses or st != "missing" else f'      {mark} {name(r)}{extra}')
    return 0


def cmd_missing(cat):
    rec = load_receipt()
    by_id = groups_by_id(cat)
    todo = [gid for gid in rec.get("selected_groups", []) if gid in by_id and any(
        r["mode"] != "link" and item_state(r, rec) != "installed" for r in by_id[gid]["resources"])]
    if not todo:
        print(T["nothing"])
        return 0
    return install(cat, todo)


def cmd_wizard(cat):
    if not sys.stdin.isatty():
        return cmd_list(cat)
    cmd_list(cat)
    rec = load_receipt()
    print()
    try:
        answer = input(T["prompt"]).strip().lower()
    except EOFError:  # Ctrl+D / closed input: same as cancel
        answer = ""
        print()
    groups = cat["groups"]
    if answer in ("", "q"):
        print(T["nothing"])
        return 0
    if answer == "a":
        chosen = [g["id"] for g in groups]
    elif answer == "r":
        chosen = [g["id"] for g in groups if g.get("selection") == "recommended"]
    else:
        chosen = []
        for tok in answer.replace(",", " ").split():
            if tok.isdigit() and 1 <= int(tok) <= len(groups):
                chosen.append(groups[int(tok) - 1]["id"])
    by_id = groups_by_id(cat)
    if not chosen:
        print(T["nothing"])
        return 0
    total = sum(group_size(by_id[g], rec) for g in set(chosen))
    print(f'{T["total"]}: {human(total)} · {T["free"]}: {human(shutil.disk_usage(CONTENT).free)}')
    return install(cat, chosen)


def main():
    sys.stdout.reconfigure(line_buffering=True)
    ap = argparse.ArgumentParser(prog="rtw fetch", description="Install curated knowledge packs.")
    ap.add_argument("command", nargs="?", default="wizard",
                    choices=["wizard", "list", "status", "install", "missing", "group"])
    ap.add_argument("group_id", nargs="?")
    ap.add_argument("--groups", default="")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--yes", action="store_true")
    ap.add_argument("--refresh", action="store_true")
    a = ap.parse_args()
    os.makedirs(CONTENT, exist_ok=True)
    cat = load_catalog()
    if a.command == "wizard":
        return cmd_wizard(cat)
    if a.command in ("list", "status"):
        return cmd_list(cat, statuses=a.command == "status")
    if a.command == "missing":
        return cmd_missing(cat)
    if a.command == "group":
        if not a.group_id:
            ap.error("rtw fetch group <id>")
        return install(cat, [a.group_id], refresh=a.refresh)
    groups = [g["id"] for g in cat["groups"]] if a.all else [g for g in a.groups.split(",") if g]
    return install(cat, groups, refresh=a.refresh)


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n" + T["retry"])
        sys.exit(130)
