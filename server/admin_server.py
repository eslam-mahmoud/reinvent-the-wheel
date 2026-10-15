#!/usr/bin/env python3
"""Content management API for the offline library (stdlib only).

Listens on 127.0.0.1 only; nginx puts it behind HTTP basic auth at /admin/api/.
Uploads stream straight to disk, so multi-GB files (ZIMs, maps) work.

  GET  /admin/api/summary                       per-section counts/sizes + free space
  GET  /admin/api/list?path=books/sub           [{name, type, size, mtime}]
  PUT  /admin/api/upload?path=books/a.pdf[&overwrite=1]   raw file body
  POST /admin/api/mkdir?path=books/new
  POST /admin/api/rename?path=books/a.pdf&to=downloads/a.pdf   (rename or move)
  POST /admin/api/delete?path=books/old[&recursive=1]
  POST /admin/api/restart-wiki

Each section only accepts its own file types (see SECTIONS), so content stays
organised: PDFs/EPUBs in books, APKs in downloads, notes as .md/.txt, etc.
Changes under wikipedia/ restart kiwix-serve automatically.
"""
import json
import os
import re
import shutil
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

CONTENT = os.path.realpath(os.environ["CONTENT"])
ROOT = os.environ["ROOT"]
CHUNK = 1 << 20

# section -> allowed extensions (None = anything)
SECTIONS = {
    "books": {"pdf", "epub", "mobi", "azw3", "djvu", "cbz", "fb2", "txt"},
    "downloads": None,
    "notes": {"md", "markdown", "txt"},
    "wikipedia": {"zim"},
    "maps": {"pmtiles"},
    "www": None,
}


class ApiError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status


def resolve(rel, must_exist=True):
    """Map 'section/sub/file' to (absolute path, section, section root)."""
    parts = [p for p in (rel or "").split("/") if p not in ("", ".")]
    if not parts or parts[0] not in SECTIONS or ".." in parts:
        raise ApiError(400, "invalid path")
    root = os.path.join(CONTENT, parts[0])
    full = os.path.realpath(os.path.join(root, *parts[1:]))
    if full != root and not full.startswith(root + os.sep):
        raise ApiError(400, "invalid path")
    if must_exist and not os.path.exists(full):
        raise ApiError(404, "not found")
    return full, parts[0], root


def check_type(section, name):
    allowed = SECTIONS[section]
    ext = name.rsplit(".", 1)[-1].lower() if "." in name else ""
    if allowed is not None and ext not in allowed:
        raise ApiError(415, f"{section} accepts: " + ", ".join(sorted(allowed)))


def dir_stats(path):
    files = size = 0
    for dirpath, _, names in os.walk(path):
        for n in names:
            if n.endswith(".uploading"):
                continue
            try:
                size += os.path.getsize(os.path.join(dirpath, n))
                files += 1
            except OSError:
                pass
    return files, size


def lan_addresses():
    """IPv4 addresses other devices can reach, read fresh on every call
    (Android gives the hotspot a new address each time it starts)."""
    cmds = [["ipconfig", "getifaddr", "en0"], ["ipconfig", "getifaddr", "en1"]] if sys.platform == "darwin" \
        else [["ip", "-o", "-4", "addr", "show"], ["ifconfig"], ["/system/bin/ifconfig"]]
    found = []
    for cmd in cmds:
        try:
            out = subprocess.run(cmd, capture_output=True, text=True, timeout=3).stdout
        except (OSError, subprocess.SubprocessError):
            continue
        for ip in re.findall(r"(?:inet (?:addr:)?)?\b((?:\d{1,3}\.){3}\d{1,3})\b", out):
            if not ip.startswith(("127.", "255.", "0.")) and not ip.endswith(".255") and ip not in found:
                found.append(ip)
    return found


def restart_wiki():
    r = subprocess.run(["bash", os.path.join(ROOT, "server", "kiwix.sh"), "restart"],
                       capture_output=True, text=True, timeout=60)
    if r.returncode:
        raise ApiError(500, r.stderr.strip() or "restart failed")
    return r.stdout.strip()


class Handler(BaseHTTPRequestHandler):
    server_version = "rtw-admin"
    protocol_version = "HTTP/1.1"

    def _send(self, status, body):
        data = json.dumps(body, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _dispatch(self, method):
        # http.server decodes the request line as latin-1; recover raw UTF-8.
        url = urlparse(self.path.encode("latin-1").decode("utf-8", "replace"))
        action = url.path.rsplit("/", 1)[-1]
        self.query = {k: v[0] for k, v in parse_qs(url.query).items()}
        try:
            # Custom header forces a CORS preflight, so other sites can't
            # replay the browser's cached basic-auth credentials (CSRF).
            if method != "GET" and self.headers.get("X-RTW") != "1":
                raise ApiError(403, "missing X-RTW header")
            handler = getattr(self, f"{method.lower()}_{action.replace('-', '_')}", None)
            if not handler:
                raise ApiError(404, "unknown action")
            self._send(200, handler(self.query.get("path", "")) or {"ok": True})
        except ApiError as e:
            self._drain()
            self._send(e.status, {"error": str(e)})
        except OSError as e:
            self._drain()
            self._send(500, {"error": e.strerror or str(e)})

    def _drain(self):
        # Don't leave an unread body on a keep-alive connection.
        self.close_connection = True

    def do_GET(self):
        self._dispatch("GET")

    def do_PUT(self):
        self._dispatch("PUT")

    def do_POST(self):
        self._dispatch("POST")

    # ---- read ----

    def get_summary(self, _rel):
        sections = []
        for name, allowed in SECTIONS.items():
            files, size = dir_stats(os.path.join(CONTENT, name))
            sections.append({"name": name, "files": files, "size": size,
                             "accepts": sorted(allowed) if allowed else None})
        disk = shutil.disk_usage(CONTENT)
        return {"sections": sections, "free": disk.free, "total": disk.total,
                "addresses": lan_addresses(), "port": int(os.environ.get("PORT", "8080"))}

    def get_list(self, rel):
        full, _, _ = resolve(rel)
        out = []
        with os.scandir(full) as it:
            for e in it:
                if e.name.endswith(".uploading"):
                    continue
                st = e.stat()
                is_dir = e.is_dir()
                out.append({"name": e.name, "type": "directory" if is_dir else "file",
                            "size": None if is_dir else st.st_size, "mtime": int(st.st_mtime)})
        return sorted(out, key=lambda x: (x["type"] != "directory", x["name"]))

    # ---- write ----

    def put_upload(self, rel):
        full, section, root = resolve(rel, must_exist=False)
        if full == root:
            raise ApiError(400, "missing file name")
        check_type(section, os.path.basename(full))
        if os.path.isdir(full):
            raise ApiError(409, "a folder with that name exists")
        if os.path.exists(full) and self.query.get("overwrite") != "1":
            raise ApiError(409, "exists")
        length = self.headers.get("Content-Length")
        chunked = "chunked" in self.headers.get("Transfer-Encoding", "").lower()
        if length is None and not chunked:
            raise ApiError(411, "Content-Length required")
        if length and shutil.disk_usage(root).free < int(length) + (200 << 20):
            raise ApiError(507, "not enough free space")
        os.makedirs(os.path.dirname(full), exist_ok=True)
        tmp = full + ".uploading"
        try:
            with open(tmp, "wb") as f:
                body = self._chunked_body() if chunked else self._sized_body(int(length))
                size = 0
                for chunk in body:
                    f.write(chunk)
                    size += len(chunk)
            os.replace(tmp, full)
        finally:
            if os.path.exists(tmp):
                os.remove(tmp)
        if section == "wikipedia":
            restart_wiki()
        return {"ok": True, "size": size}

    def _sized_body(self, remaining):
        while remaining:
            chunk = self.rfile.read(min(CHUNK, remaining))
            if not chunk:
                raise ApiError(400, "upload interrupted")
            remaining -= len(chunk)
            yield chunk

    def _chunked_body(self):
        while True:
            size = int(self.rfile.readline().split(b";")[0].strip() or b"0", 16)
            if size == 0:
                while self.rfile.readline() not in (b"\r\n", b"\n", b""):
                    pass  # skip trailers
                return
            yield from self._sized_body(size)
            self.rfile.readline()  # CRLF after each chunk

    def post_mkdir(self, rel):
        full, _, root = resolve(rel, must_exist=False)
        if full == root:
            raise ApiError(400, "missing folder name")
        os.makedirs(full, exist_ok=True)

    def post_rename(self, rel):
        src, src_section, src_root = resolve(rel)
        dst, dst_section, dst_root = resolve(self.query.get("to", ""), must_exist=False)
        if src == src_root or dst == dst_root:
            raise ApiError(400, "cannot rename a section")
        if os.path.isfile(src):
            check_type(dst_section, os.path.basename(dst))
        if os.path.exists(dst):
            raise ApiError(409, "target exists")
        if dst.startswith(src + os.sep):
            raise ApiError(400, "cannot move a folder into itself")
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.move(src, dst)
        if "wikipedia" in (src_section, dst_section):
            restart_wiki()

    def post_delete(self, rel):
        full, section, root = resolve(rel)
        if full == root:
            raise ApiError(400, "cannot delete a section")
        if os.path.isdir(full):
            if self.query.get("recursive") == "1":
                shutil.rmtree(full)
            elif os.listdir(full):
                raise ApiError(409, "folder is not empty")
            else:
                os.rmdir(full)
        else:
            os.remove(full)
        if section == "wikipedia":
            restart_wiki()

    def post_restart_wiki(self, _rel):
        return {"ok": True, "output": restart_wiki()}

    def log_message(self, fmt, *args):
        sys.stderr.write("%s %s\n" % (self.log_date_time_string(), fmt % args))


if __name__ == "__main__":
    port = int(os.environ.get("ADMIN_PORT", "8082"))
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
