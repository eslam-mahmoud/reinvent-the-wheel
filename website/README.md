# reinvent-the-wheel.com

The website for **Reinvent the Wheel (RTW)** — *Civilization, Offline.*
A static [Astro](https://astro.build) site: no backend, no cookies, no analytics,
no third-party requests. Deployed to Cloudflare (Workers static assets).

## Develop

Requires Node.js 22+.

```bash
cd website
npm install
npm run dev          # http://localhost:4321
```

## Build and check

```bash
npm run build        # → dist/
npm run preview      # serve dist/ locally
npm run check-links  # every internal link and #anchor in dist/
node scripts/check-links.mjs --external   # also request every external URL
```

## Where things live

| Path | What |
|---|---|
| `src/config/site.ts` | **Project facts in one place:** domain, GitHub URL, maintainer, license, legal date. A `null` value hides that link instead of inventing one. |
| `src/data/platforms.ts` | Platform status, requirements, install commands, capabilities (available / in testing / planned). Releases stay `null` until real ones exist. |
| `src/data/library.ts` | Knowledge Library categories and recommended sources. |
| `src/content/docs/{en,ar}/*.md` | Documentation pages (Markdown), one folder per language with the same file names. `order` sets sidebar order; `draft: true` shows a "work in progress" banner. |
| `src/views/` | Each page's markup **and its English + Arabic text**, side by side. |
| `src/pages/` | Thin routes: `/page/` renders a view with `lang="en"`, `/ar/page/` with `lang="ar"`. |
| `src/i18n/` | Languages (`config.ts`: direction, URL helpers) and shared UI strings (`ui.ts`). |
| `src/components/` | Header, footer, logo, diagrams, cards, code blocks, icons. |
| `src/styles/global.css` | Design tokens (colors, type, spacing) and shared styles. Dark first, light theme via OS setting or the toggle. |
| `public/` | Favicon, icons, Open Graph image, `_headers` (security and cache headers). |
| `scripts/` | `check-links.mjs`, `icons.mjs` (PNG icons from `favicon.svg`), `og.html` (source of `public/og.png`). |

## Languages

English is served at `/`, Arabic at `/ar/` (right-to-left). Every page has
`hreflang` alternates and a language switch in the header.

- Text lives next to the markup in `src/views/*.astro` as `{ en: …, ar: … }`.
- Project data with text (`src/data/*.ts`) uses the same shape.
- Use logical CSS (`margin-inline-start`, `inset-inline-end`, `text-align: start`)
  so layouts mirror automatically. Code and commands are always left-to-right.
- Don't add letter-spacing to Arabic text — it breaks letter joining
  (`global.css` resets it under `[dir="rtl"]`).
- Fonts: Inter for Latin, Noto Sans Arabic for Arabic; both self-hosted.

To add a language: add it to `src/i18n/config.ts` and `ui.ts`, add its text to each
view and data file, add `src/content/docs/<lang>/`, and create `src/pages/<lang>/`
routes like the `ar` ones.

## Deploy

### Cloudflare (production)

The site is a Worker with static assets (`wrangler.jsonc`), the same setup as
Cloudflare Pages but managed by `wrangler deploy`. Its custom domains,
`reinvent-the-wheel.com` and `www.reinvent-the-wheel.com`, are declared in
`wrangler.jsonc` and attached on deploy.

The GitHub Actions workflow `.github/workflows/website.yml` builds the site,
checks links, and deploys on every push to `main` that touches `website/`.
It needs one repository secret:

- `CLOUDFLARE_API_TOKEN` — a Cloudflare API token with **Workers Scripts: Edit**
  and **Workers Routes / Custom Domains** permissions for the account and zone.

Without the secret the workflow still builds and checks, and skips the deploy.

Manual deploy from a machine logged in with `wrangler login`:

```bash
npm run deploy       # build + wrangler deploy
```

### GitHub Pages (alternative)

The site builds for a sub-path too:

```bash
SITE=https://eslam-mahmoud.github.io BASE=/reinvent-the-wheel npm run build
```

Publish `dist/` with the standard `actions/upload-pages-artifact` +
`actions/deploy-pages` workflow. (Internal links assume the root path; for a
project sub-path, prefer a custom domain.)

## Regenerating assets

```bash
node scripts/icons.mjs     # after editing public/favicon.svg
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --window-size=1200,630 --screenshot=public/og.png "file://$PWD/scripts/og.html"
```

## Content rules

- Don't state a capability as available until it has been verified on that platform.
- Don't invent releases, versions, download counts, testimonials or contributors.
- Mark untested documentation as `draft: true` and say what's unknown.
