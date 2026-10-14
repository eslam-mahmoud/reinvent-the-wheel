// Stroke icons (24×24, currentColor) — same set as the website.
const P = {
  home: '<path d="M4 11 12 4l8 7M6 9.5V20h12V9.5"/>',
  wiki: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3"/>',
  books: '<path d="M5 4h4v16H5zM9 4h4v16H9zM14 5l3.8-1 3.2 15.5-3.8 1z"/>',
  notes: '<path d="M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  maps: '<path d="m3 6 6-2.5 6 2.5 6-2.5v14.5L15 21l-6-2.5L3 21z"/><path d="M9 3.5v15M15 6v15"/>',
  downloads: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
  sites: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  admin: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  folder: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/>',
  file: '<path d="M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/>',
  pdf: '<path d="M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M8.5 16.5h7"/>',
  apk: '<path d="M5 10v6M19 10v6M7 9h10v9a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1zM7 8a5 5 0 0 1 10 0zM9.5 5.5 8 3M14.5 5.5 16 3"/>',
  zip: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v2M12 7v2M12 11v2M10.5 15h3v3h-3z"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/>',
  media: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  upload: '<path d="M12 21V9M7 14l5-5 5 5M4 4h16"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
  swap: '<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.6-4.5L3 9M3 4v5h5M4 13a8 8 0 0 0 14.6 4.5L21 15M21 20v-5h-5"/>',
  wifi: '<path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
};
const FLIP = new Set(["arrow", "back"]);

export function icon(name, cls = "icon") {
  const body = P[name] || P.file;
  return `<svg class="${cls}${FLIP.has(name) ? " flip" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

const EXT = { pdf: "pdf", epub: "books", mobi: "books", azw3: "books", djvu: "books", fb2: "books", cbz: "books",
  apk: "apk", zip: "zip", gz: "zip", "7z": "zip", obf: "maps", pmtiles: "maps", md: "notes", txt: "notes", markdown: "notes",
  jpg: "image", jpeg: "image", png: "image", gif: "image", webp: "image", mp3: "media", mp4: "media", webm: "media", html: "sites", zim: "wiki" };
export const iconFor = (name) => EXT[name.split(".").pop().toLowerCase()] || "file";

/** The wheel logo (8 spokes, brass arc). */
export const logo = (size = 26) => `<svg width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M16 3.5A12.5 12.5 0 0 1 26.83 9.75" fill="none" stroke="var(--accent)" stroke-width="2.4" stroke-linecap="round"/><path d="M16 12.6V5.6M16 19.4v7M19.4 16h7M12.6 16h-7M18.4 13.6l4.95-4.95M13.6 18.4l-4.95 4.95M18.4 18.4l4.95 4.95M13.6 13.6l-4.95-4.95" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="16" r="3.4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16" cy="16" r="1" fill="var(--accent)"/></svg>`;
