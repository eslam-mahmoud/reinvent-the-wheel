# Contributing to the website

See the project-wide [CONTRIBUTING.md](../CONTRIBUTING.md) first.

- Documentation pages are Markdown in `src/content/docs/`. Keep them accurate:
  only include commands that have actually been run, and mark anything
  untested as such (`draft: true` for whole pages).
- Change project facts (links, status, requirements) in `src/config/site.ts`
  and `src/data/`, not in page markup.
- Before opening a pull request: `npm run build && npm run check-links`.
- Keep it fast and private: no new third-party scripts, fonts or trackers.
