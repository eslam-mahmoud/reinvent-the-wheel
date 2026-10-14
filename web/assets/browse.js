// Shared folder browser for nginx `autoindex_format json` listings.
// Folder navigation lives in the URL hash so back/forward work.

export function currentPath() {
  return decodeURIComponent(location.hash.slice(1)) || "/";
}

export async function listDir(base, path) {
  const url = base + path.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(url.endsWith("/") ? url : url + "/");
  if (!res.ok) throw new Error(res.status + " " + res.statusText);
  return res.json(); // [{name, type: "file"|"directory", mtime, size}]
}

export function fileUrl(base, path, name) {
  return base + (path + name).split("/").map(encodeURIComponent).join("/");
}

export function humanSize(n) {
  if (n == null) return "";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return (i ? n.toFixed(1) : n) + " " + u[i];
}

export function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v; else e.setAttribute(k, v);
  }
  e.append(...children);
  return e;
}

export function crumbs(path) {
  const box = el("div", { class: "crumbs" });
  box.append(el("a", { href: "#/" }, "🏠"));
  let acc = "/";
  for (const part of path.split("/").filter(Boolean)) {
    acc += part + "/";
    box.append(" / ", el("a", { href: "#" + encodeURIComponent(acc) }, part));
  }
  return box;
}

// Wires a search box that hides list items not matching the query.
export function filterList(input, list) {
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    for (const li of list.children) li.hidden = q && !li.textContent.toLowerCase().includes(q);
  });
}

const ICONS = { pdf: "📕", epub: "📗", apk: "📦", zip: "🗜️", md: "📝", txt: "📄",
  mp3: "🎵", mp4: "🎬", jpg: "🖼️", jpeg: "🖼️", png: "🖼️", html: "🌐", zim: "🌐", pmtiles: "🗺️" };
export const iconFor = (name) => ICONS[name.split(".").pop().toLowerCase()] || "📄";

// Renders a searchable folder listing into `root`. Files link straight to the
// raw URL; `fileLink(path, name)` can override (e.g. notes open a viewer).
export function mountBrowser(root, { base, emptyText, fileLink, accept }) {
  async function render() {
    const path = currentPath();
    root.replaceChildren(crumbs(path), el("p", { class: "empty" }, "…"));
    let items;
    try { items = await listDir(base, path); }
    catch (e) { root.replaceChildren(crumbs(path), el("p", { class: "empty" }, "⚠️ " + e.message)); return; }

    items = items.filter((i) => i.type === "directory" || !accept || accept.test(i.name));
    items.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name, "ar") : a.type === "directory" ? -1 : 1));

    const search = el("input", { class: "search", type: "search", placeholder: "🔍 بحث / Search" });
    const list = el("ul", { class: "files" });
    for (const it of items) {
      const isDir = it.type === "directory";
      const href = isDir ? "#" + encodeURIComponent(path + it.name + "/")
        : (fileLink ? fileLink(path, it.name) : fileUrl(base, path, it.name));
      const a = el("a", { href, dir: "auto" }, isDir ? "📁" : iconFor(it.name), " " + it.name,
        el("span", { class: "meta" }, isDir ? "" : humanSize(it.size)));
      if (!isDir && !fileLink) a.setAttribute("download", it.name);
      list.append(el("li", {}, a));
    }
    filterList(search, list);
    root.replaceChildren(crumbs(path), search, items.length ? list : el("p", { class: "empty" }, emptyText));
  }
  addEventListener("hashchange", render);
  render();
}
