import { getDocs, docUrl } from "../data/docs";
import type { Lang } from "../i18n/config";

// Build-time search index for the docs sidebar, one per language.
export async function searchIndex(lang: Lang): Promise<Response> {
  const docs = await getDocs(lang);
  const strip = (md = "") =>
    md
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#>*_`|[\]()-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  return new Response(
    JSON.stringify(
      docs.map(({ entry, slug }) => ({
        title: entry.data.title,
        description: entry.data.description,
        url: docUrl(slug, lang),
        text: strip(entry.body),
      })),
    ),
    { headers: { "Content-Type": "application/json" } },
  );
}
