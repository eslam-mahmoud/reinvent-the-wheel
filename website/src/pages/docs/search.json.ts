import type { APIRoute } from "astro";
import { getDocs, docUrl } from "../../data/docs";

// Build-time search index for the docs sidebar.
export const GET: APIRoute = async () => {
  const docs = await getDocs();
  const strip = (md = "") =>
    md
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#>*_`|[\]()-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  return new Response(
    JSON.stringify(
      docs.map((d) => ({ title: d.data.title, description: d.data.description, url: docUrl(d.id), text: strip(d.body) })),
    ),
    { headers: { "Content-Type": "application/json" } },
  );
};
