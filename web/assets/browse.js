// Folder browser for nginx `autoindex_format json` listings. Folder
// navigation lives in the URL hash so back/forward work.
import { t, humanSize, lang } from "./i18n.js";
import { icon, iconFor } from "./icons.js";
import { el } from "./shell.js";

export const currentPath = () => decodeURIComponent(location.hash.slice(1)) || "/";
export const fileUrl = (base, path, name) => base + (path + name).split("/").map(encodeURIComponent).join("/");

export async function listDir(base, path) {
  const url = base + path.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(url.endsWith("/") ? url : url + "/");
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json(); // [{name, type: "file"|"directory", mtime, size}]
}

export function crumbs(path, rootLabel) {
  const box = el("nav", { class: "crumbs", "aria-label": "breadcrumbs" });
  box.append(el("a", { href: "#/" }, rootLabel));
  let acc = "/";
  for (const part of path.split("/").filter(Boolean)) {
    acc += part + "/";
    box.append(el("span", { "aria-hidden": "true" }, "›"), el("a", { href: "#" + encodeURIComponent(acc), dir: "auto" }, part));
  }
  return box;
}

const collator = new Intl.Collator(lang === "ar" ? "ar" : "en", { numeric: true });

/**
 * Searchable folder listing.
 * fileLink(path, name) can override where a file opens (e.g. notes viewer);
 * download: true marks links as downloads (APKs etc.).
 */
export function mountBrowser(root, { base, rootLabel, emptyText, fileLink, accept, download = false }) {
  async function render() {
    const path = currentPath();
    root.replaceChildren(crumbs(path, rootLabel), el("p", { class: "empty" }, t.loading));
    let items;
    try { items = await listDir(base, path); }
    catch (e) { root.replaceChildren(crumbs(path, rootLabel), el("p", { class: "empty" }, "⚠️ " + e.message)); return; }

    items = items.filter((i) => !i.name.startsWith(".") && (i.type === "directory" || !accept || accept.test(i.name)));
    items.sort((a, b) => (a.type === b.type ? collator.compare(a.name, b.name) : a.type === "directory" ? -1 : 1));

    const filter = el("div", { class: "search", style: "margin-bottom:14px" },
      el("span", { html: icon("search") }), el("input", { class: "input", type: "search", placeholder: t.filter, "aria-label": t.filter }));
    const list = el("ul", { class: "files" });
    for (const it of items) {
      const isDir = it.type === "directory";
      const href = isDir ? "#" + encodeURIComponent(path + it.name + "/") : fileLink ? fileLink(path, it.name) : fileUrl(base, path, it.name);
      const a = el("a", { class: "item", href, download: !isDir && download ? it.name : null },
        el("span", { class: "ficon", html: icon(isDir ? "folder" : iconFor(it.name)) }),
        el("span", { class: "name", dir: "auto" }, it.name),
        el("span", { class: "meta" }, isDir ? "" : humanSize(it.size)));
      list.append(el("li", {}, a));
    }
    filter.querySelector("input").addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      for (const li of list.children) li.hidden = !!q && !li.textContent.toLowerCase().includes(q);
    });
    root.replaceChildren(crumbs(path, rootLabel), ...(items.length ? [filter, list] : [el("p", { class: "empty" }, emptyText)]));
  }
  addEventListener("hashchange", render);
  render();
}
