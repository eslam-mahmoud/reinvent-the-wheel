---
title: Contributing
description: How to help — code, docs, testing, translation and curation.
order: 13
---

RTW is open source and early. Every kind of help is useful, and many don't involve code. See [Contribute](/contribute/) for an overview.

## Report what works on your device

Hardware reports are especially valuable right now. Open an issue with:

- Device model and Android or macOS version
- How you installed Termux (F-Droid, GitHub or Google Play)
- What worked, what didn't, and the output of `rtw status`

## Develop

```bash
git clone https://github.com/eslam-mahmoud/reinvent-the-wheel.git
cd reinvent-the-wheel
./rtw setup
./rtw start
```

The library's pages in `web/` are plain HTML and JavaScript — edit and reload. The server's behaviour lives in `server/`. See [Architecture](/docs/architecture/).

## Improve these docs

This website lives in `website/` in the same repository. Each documentation page is a Markdown file in `website/src/content/docs/`. Every page has an *Edit this page* link at the bottom.

## Guidelines

- Prefer integrating an existing open-source tool over writing a new one.
- Keep it working offline: no runtime calls to external services.
- Be honest in docs: mark untested steps as untested.
- Respect content licenses — don't add third-party material to the repository.
