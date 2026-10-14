# Contributing to Reinvent the Wheel

Thanks for helping keep knowledge within reach. You don't need to write code
to contribute — testing, documentation, translation and resource suggestions
are just as valuable.

## Ways to help

- **Test on your hardware** and open an issue with: device model, OS version,
  how you installed Termux (F-Droid, GitHub or Google Play), what worked, what
  didn't, and the output of `rtw status`.
- **Report bugs** with steps to reproduce.
- **Improve the docs** — they live in `website/src/content/docs/` as Markdown.
- **Suggest resources** for the Knowledge Library (reputable, properly licensed).
- **Translate** the library pages (`web/`) or the documentation.
- **Write code** — see below.

## Development

```bash
git clone https://github.com/eslam-mahmoud/reinvent-the-wheel.git
cd reinvent-the-wheel
./rtw setup
./rtw start
```

| Path | What |
|---|---|
| `rtw` | The command-line tool (macOS and Termux) |
| `server/` | nginx template, service scripts, admin API, Termux installer |
| `web/` | The library's pages — plain HTML/JS, no build step |
| `scripts/` | Content downloads and USB push |
| `website/` | reinvent-the-wheel.com (Astro) — see `website/README.md` |

## Guidelines

- Prefer integrating an existing open-source tool over writing a new one.
- Keep the library working offline: no runtime calls to external services.
- Be honest in docs and on the website: mark untested steps as untested.
- Don't commit third-party content (books, ZIMs, maps, APKs) to the repository.
  Link to the original publisher instead.
