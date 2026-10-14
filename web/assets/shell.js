// The app frame shared by every page: sidebar (sections, storage), top bar
// (title, language, theme). Pages call mountShell() and fill the returned
// <main>. Stats come from /api/stats (read-only); the page works without it.
import { t, lang, setLang, humanSize } from "./i18n.js";
import { icon, logo } from "./icons.js";

export const SECTIONS = [
  { id: "home", href: "/", icon: "home" },
  { id: "wiki", href: "/wiki/", icon: "wiki" },
  { id: "books", href: "/books/", icon: "books", stat: "books" },
  { id: "notes", href: "/notes/", icon: "notes", stat: "notes" },
  { id: "maps", href: "/maps/", icon: "maps" },
  { id: "downloads", href: "/downloads/", icon: "downloads", stat: "downloads" },
  { id: "sites", href: "/websites/", icon: "sites", stat: "www" },
];

let statsPromise;
export const getStats = () => (statsPromise ??= fetch("/api/stats").then((r) => (r.ok ? r.json() : null)).catch(() => null));

export function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  e.append(...children.filter((c) => c != null));
  return e;
}

/**
 * @param {{active: string, title?: string, wide?: boolean}} opts
 * @returns {HTMLElement} the content container
 */
export function mountShell({ active, title, wide = false }) {
  document.title = `${title || t.nav[active] || t.appName} · RTW`;
  const nav = el("ul", { class: "nav" });
  for (const s of SECTIONS) {
    nav.append(el("li", {}, el("a", { href: s.href, "aria-current": s.id === active ? "page" : null, "data-stat": s.stat || null, html: `${icon(s.icon)}<span>${t.nav[s.id]}</span>` })));
  }
  const side = el("aside", { class: "side", id: "side" },
    el("a", { class: "brand", href: "/", html: `${logo(28)}<span>RTW<small>${t.projectName}</small></span>` }),
    nav,
    el("div", { class: "nav-sep" }),
    el("ul", { class: "nav" }, el("li", {}, el("a", { href: "/admin/", "aria-current": active === "admin" ? "page" : null, html: `${icon("admin")}<span>${t.nav.admin}</span>` }))),
    el("div", { class: "storage" },
      el("span", {}, t.storage),
      el("div", { class: "meter" }, el("b", { id: "meter" })),
      el("span", { id: "free", class: "muted" }, " "),
      el("span", { class: "status", html: `<span class="dot"></span>${t.offline}` }),
    ),
  );

  const menuBtn = el("button", { class: "icon-btn menu-btn", type: "button", "aria-label": t.menu, "aria-controls": "side", "aria-expanded": "false", html: icon("menu") });
  const themeBtn = el("button", { class: "icon-btn", type: "button", "aria-label": t.theme, title: t.theme, html: icon("sun") });
  const langBtn = el("button", { class: "icon-btn", type: "button", lang: lang === "ar" ? "en" : "ar", title: t.switchLang }, lang === "ar" ? "EN" : "ع");
  const top = el("header", { class: "top" }, menuBtn, el("h1", {}, title || t.nav[active] || t.appName), el("span", { class: "spacer" }), langBtn, themeBtn);
  const content = el("main", { class: wide ? "content wide" : "content", id: "content" });
  document.body.replaceChildren(el("div", { class: "app" }, side, el("div", { class: "main" }, top, content)));

  // Mobile drawer
  let scrim;
  const setOpen = (open) => {
    side.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    if (open) { scrim = el("div", { class: "scrim", onclick: () => setOpen(false) }); document.body.append(scrim); }
    else scrim?.remove();
  };
  menuBtn.addEventListener("click", () => setOpen(!side.classList.contains("open")));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));

  langBtn.addEventListener("click", () => setLang(lang === "ar" ? "en" : "ar"));
  const root = document.documentElement;
  const syncTheme = () => (themeBtn.innerHTML = icon(getComputedStyle(root).colorScheme.includes("dark") ? "sun" : "moon"));
  syncTheme();
  themeBtn.addEventListener("click", () => {
    const next = getComputedStyle(root).colorScheme.includes("dark") ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("rtw-theme", next); } catch {}
    syncTheme();
  });

  getStats().then((s) => {
    if (!s) return;
    const used = s.total - s.free;
    document.getElementById("meter").style.width = `${Math.round((used / s.total) * 100)}%`;
    document.getElementById("free").textContent = t.free(humanSize(s.free), humanSize(s.total));
    const by = Object.fromEntries(s.sections.map((x) => [x.name, x]));
    for (const a of side.querySelectorAll("[data-stat]")) {
      const sec = by[a.dataset.stat];
      if (sec && sec.files) a.append(el("span", { class: "count" }, String(sec.files)));
    }
  });
  return content;
}
