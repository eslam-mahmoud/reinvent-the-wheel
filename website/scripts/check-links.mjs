// Checks every link in the built site (dist/).
//   node scripts/check-links.mjs            internal links + #anchors
//   node scripts/check-links.mjs --external also requests every external URL
import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const external = process.argv.includes("--external");

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (p.endsWith(".html")) yield p;
  }
}
const exists = (p) => stat(p).then(() => true, () => false);
const pages = new Map();       // url path -> { ids:Set }
const links = [];              // { from, href }

for await (const file of walk(DIST)) {
  const html = await readFile(file, "utf8");
  const path = "/" + file.slice(DIST.length).replace(/index\.html$/, "");
  pages.set(path, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) links.push({ from: path, href: m[1].replace(/&amp;/g, "&") });
}

const problems = [];
const ext = new Map();
for (const { from, href } of links) {
  if (/^(mailto:|tel:|data:|javascript:)/.test(href)) continue;
  if (/^https?:\/\//.test(href)) {
    if (href.startsWith("https://reinvent-the-wheel.com")) continue; // canonical/og self-links
    (ext.get(href) || ext.set(href, new Set()).get(href)).add(from);
    continue;
  }
  const url = new URL(href, "https://x" + from);
  let target = decodeURIComponent(url.pathname);
  const file = target.endsWith("/") ? join(DIST, target, "index.html") : join(DIST, target);
  if (!(await exists(file))) { problems.push(`${from} → ${href} (missing)`); continue; }
  if (url.hash && target.endsWith("/")) {
    const ids = pages.get(target);
    if (ids && !ids.has(decodeURIComponent(url.hash.slice(1)))) problems.push(`${from} → ${href} (no #${url.hash.slice(1)})`);
  }
}

console.log(`${pages.size} pages, ${links.length} links, ${ext.size} unique external URLs`);
if (external) {
  await Promise.all([...ext.keys()].map(async (u) => {
    try {
      let r = await fetch(u, { method: "HEAD", redirect: "follow", headers: { "user-agent": "Mozilla/5.0 rtw-link-check" } });
      if (r.status >= 400) r = await fetch(u, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 rtw-link-check" } });
      if (r.status >= 400) problems.push(`${u} → HTTP ${r.status} (on ${[...ext.get(u)].join(", ")})`);
      else console.log(`ok ${r.status} ${u}`);
    } catch (e) {
      problems.push(`${u} → ${e.cause?.code || e.message}`);
    }
  }));
}
if (problems.length) { console.error("\nProblems:\n" + problems.join("\n")); process.exit(1); }
console.log("All links OK");
