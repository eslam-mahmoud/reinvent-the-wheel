// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// The canonical domain. For a GitHub Pages project site, set SITE and BASE
// (e.g. SITE=https://eslam-mahmoud.github.io BASE=/reinvent-the-wheel).
const SITE = process.env.SITE || "https://reinvent-the-wheel.com";

export default defineConfig({
  site: SITE,
  base: process.env.BASE || "/",
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
      // hreflang alternates between /page/ and /ar/page/
      i18n: { defaultLocale: "en", locales: { en: "en", ar: "ar" } },
    }),
  ],
  markdown: {
    shikiConfig: { theme: "css-variables", wrap: false },
  },
});
