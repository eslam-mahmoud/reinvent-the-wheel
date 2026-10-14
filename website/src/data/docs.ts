import { getCollection } from "astro:content";

export async function getDocs() {
  const docs = await getCollection("docs");
  return docs.sort((a, b) => a.data.order - b.data.order);
}

export const docUrl = (id: string) => `/docs/${id}/`;
