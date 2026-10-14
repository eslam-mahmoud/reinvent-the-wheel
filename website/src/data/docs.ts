import { getCollection, type CollectionEntry } from "astro:content";
import { href, type Lang } from "../i18n/config";

export interface Doc {
  entry: CollectionEntry<"docs">;
  /** Page slug without the language folder, e.g. "quick-start". */
  slug: string;
}

/** Docs for one language (files in src/content/docs/<lang>/), in sidebar order. */
export async function getDocs(lang: Lang): Promise<Doc[]> {
  const all = await getCollection("docs");
  return all
    .filter((e) => e.id.startsWith(`${lang}/`))
    .map((entry) => ({ entry, slug: entry.id.slice(lang.length + 1) }))
    .sort((a, b) => a.entry.data.order - b.entry.data.order);
}

export const docUrl = (slug: string, lang: Lang) => href(`/docs/${slug}/`, lang);
