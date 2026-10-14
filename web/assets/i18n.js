// Arabic / English for the library app. The language is remembered per
// device (localStorage); the first visit follows the browser's language.
// <head> of every page sets lang/dir early (see boot snippet) to avoid a flash.

const STRINGS = {
  en: {
    appName: "Library", projectName: "Reinvent the Wheel", tagline: "Offline knowledge library",
    nav: { home: "Home", wiki: "Wikipedia", books: "Books", notes: "Notes", maps: "Maps", downloads: "Downloads", sites: "Sites", admin: "Manage" },
    desc: {
      wiki: "Encyclopedia articles, searchable offline.",
      books: "PDF and EPUB books to read or download.",
      notes: "Notes and guides written locally.",
      maps: "Offline maps with your location.",
      downloads: "Apps and files for your phone.",
      sites: "Websites saved on this device.",
    },
    menu: "Menu", closeMenu: "Close menu", theme: "Switch color theme", switchLang: "العربية",
    offline: "Works without internet", connectedTo: "Connected to",
    storage: "Storage", free: (f, t) => `${f} free of ${t}`,
    files: (n) => `${n} ${n === 1 ? "file" : "files"}`,
    searchWiki: "Search Wikipedia…", search: "Search", filter: "Filter…",
    heroTitle: "Your offline library", heroSub: "Everything here is stored on this device. No internet needed.",
    sections: "Sections", empty: "Nothing here yet", emptyNotes: "No notes yet", emptyBooks: "No books yet", emptyFiles: "No files yet", emptySites: "No sites yet",
    back: "Back", home: "Home", open: "Open", download: "Download", loading: "Loading…",
    noMap: "No map yet — add a .pmtiles file to the maps folder.",
    gpsHint: "To show your location, open the map over HTTPS",
    phoneApps: "Apps for your phone", phoneAppsSub: "Install from Downloads — they work without internet too.",
    bitchat: "Chat with nearby phones over Bluetooth", osmand: "Offline turn-by-turn navigation",
  },
  ar: {
    appName: "المكتبة", projectName: "إعادة اختراع العجلة", tagline: "مكتبة معرفة دون اتصال",
    nav: { home: "الرئيسية", wiki: "ويكيبيديا", books: "الكتب", notes: "الملاحظات", maps: "الخرائط", downloads: "التنزيلات", sites: "المواقع", admin: "الإدارة" },
    desc: {
      wiki: "مقالات الموسوعة، مع البحث دون اتصال.",
      books: "كتب PDF وEPUB للقراءة أو التنزيل.",
      notes: "ملاحظات وأدلة مكتوبة محليًا.",
      maps: "خرائط دون اتصال مع موقعك.",
      downloads: "تطبيقات وملفات لهاتفك.",
      sites: "مواقع محفوظة على هذا الجهاز.",
    },
    menu: "القائمة", closeMenu: "إغلاق القائمة", theme: "تبديل المظهر", switchLang: "English",
    offline: "يعمل دون إنترنت", connectedTo: "متصل بـ",
    storage: "التخزين", free: (f, t) => `${f} متاحة من ${t}`,
    files: (n) => (n === 1 ? "ملف واحد" : n === 2 ? "ملفان" : n >= 3 && n <= 10 ? `${n} ملفات` : `${n} ملف`),
    searchWiki: "ابحث في ويكيبيديا…", search: "بحث", filter: "تصفية…",
    heroTitle: "مكتبتك دون اتصال", heroSub: "كل ما هنا محفوظ على هذا الجهاز، دون حاجة إلى الإنترنت.",
    sections: "الأقسام", empty: "لا شيء هنا بعد", emptyNotes: "لا توجد ملاحظات بعد", emptyBooks: "لا توجد كتب بعد", emptyFiles: "لا توجد ملفات بعد", emptySites: "لا توجد مواقع بعد",
    back: "رجوع", home: "الرئيسية", open: "فتح", download: "تنزيل", loading: "جارٍ التحميل…",
    noMap: "لا توجد خريطة بعد — أضف ملف ‎.pmtiles إلى مجلد الخرائط.",
    gpsHint: "لعرض موقعك، افتح الخريطة عبر HTTPS",
    phoneApps: "تطبيقات لهاتفك", phoneAppsSub: "ثبّتها من التنزيلات — وهي تعمل دون إنترنت أيضًا.",
    bitchat: "دردشة مع الهواتف القريبة عبر البلوتوث", osmand: "ملاحة خطوة بخطوة دون اتصال",
  },
};

function detect() {
  try {
    const saved = localStorage.getItem("rtw-lang");
    if (saved === "ar" || saved === "en") return saved;
  } catch {}
  return (navigator.language || "").toLowerCase().startsWith("en") ? "en" : "ar";
}

export const lang = detect();
export const t = STRINGS[lang];
export const dir = lang === "ar" ? "rtl" : "ltr";
document.documentElement.lang = lang;
document.documentElement.dir = dir;

export function setLang(next) {
  try { localStorage.setItem("rtw-lang", next); } catch {}
  location.reload();
}

/** Pick the right string from a { en, ar } pair. */
export const pick = (pair) => (pair && typeof pair === "object" ? pair[lang] ?? pair.en : pair);

// Western digits in both languages (common in Saudi/Gulf UIs, and matches the website).
const nf = new Intl.NumberFormat(lang === "ar" ? "ar-u-nu-latn" : "en");
export function humanSize(n) {
  if (n == null) return "";
  const units = lang === "ar" ? ["بايت", "ك.ب", "م.ب", "غ.ب", "ت.ب"] : ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${nf.format(i ? Math.round(n * 10) / 10 : n)} ${units[i]}`;
}
export const num = (n) => nf.format(n);
