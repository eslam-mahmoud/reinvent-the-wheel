// Minimal Markdown → HTML (headings, lists, quotes, code, links, emphasis).
// Input is HTML-escaped first, so note files can't inject markup.

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inline(s) {
  return s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) =>
      /^(https?:|\/|#|\.)/.test(u) || !/^[a-z]+:/i.test(u) ? `<a href="${u}">${t}</a>` : t)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
}

export function renderMarkdown(src) {
  const lines = esc(src.replace(/\r\n?/g, "\n")).split("\n");
  const out = [];
  let para = [], list = null, inCode = false, code = [];

  const flushPara = () => { if (para.length) { out.push(`<p dir="auto">${inline(para.join(" "))}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`</${list}>`); list = null; } };

  for (const line of lines) {
    if (inCode) {
      if (/^```/.test(line)) { out.push(`<pre><code>${code.join("\n")}</code></pre>`); inCode = false; code = []; }
      else code.push(line);
      continue;
    }
    let m;
    if (/^```/.test(line)) { flushPara(); flushList(); inCode = true; }
    else if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
      flushPara(); flushList();
      out.push(`<h${m[1].length} dir="auto">${inline(m[2])}</h${m[1].length}>`);
    }
    else if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { flushPara(); flushList(); out.push("<hr>"); }
    else if ((m = line.match(/^\s*(?:[-*+]|(\d+)[.)])\s+(.*)$/))) {
      flushPara();
      const type = m[1] ? "ol" : "ul";
      if (list !== type) { flushList(); out.push(`<${type}>`); list = type; }
      out.push(`<li dir="auto">${inline(m[2])}</li>`);
    }
    else if ((m = line.match(/^&gt;\s?(.*)$/))) { flushPara(); flushList(); out.push(`<blockquote dir="auto">${inline(m[1])}</blockquote>`); }
    else if (!line.trim()) { flushPara(); flushList(); }
    else { flushList(); para.push(line.trim()); }
  }
  if (inCode) out.push(`<pre><code>${code.join("\n")}</code></pre>`);
  flushPara(); flushList();
  return out.join("\n");
}
