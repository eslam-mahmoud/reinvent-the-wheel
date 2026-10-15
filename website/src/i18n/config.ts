// Languages the site is published in. Arabic (the default) lives at the
// root, English under /en/. Add a locale here, then its strings in ui.ts and the views.

export const locales = ["en", "ar"] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = "ar";

export const langMeta: Record<Lang, { name: string; dir: "ltr" | "rtl"; og: string; short: string }> = {
  en: { name: "English", dir: "ltr", og: "en_US", short: "EN" },
  ar: { name: "العربية", dir: "rtl", og: "ar_AR", short: "ع" },
};

/** Text in every language. */
export type Localized<T = string> = Record<Lang, T>;

export const pick = <T,>(value: Localized<T>, lang: Lang): T => value[lang];

/** Prefix an internal path for a language: ("/docs/", "en") → "/en/docs/". */
export function href(path: string, lang: Lang): string {
  if (!path.startsWith("/") || lang === defaultLang) return path;
  return `/${lang}${path}`;
}

/** The language a URL path belongs to. */
export function langFromPath(path: string): Lang {
  const first = path.split("/")[1];
  return (locales as readonly string[]).includes(first) ? (first as Lang) : defaultLang;
}

/** The same page in another language. */
export function switchLang(path: string, to: Lang): string {
  const from = langFromPath(path);
  const bare = from === defaultLang ? path : path.slice(from.length + 1) || "/";
  return href(bare, to);
}
