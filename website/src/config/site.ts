// Central project settings. Everything the site says about the project's
// identity, links and ownership comes from here — change it in one place.
//
// Leave a value `null` when it isn't real yet; the site then shows it as
// "not available yet" instead of linking somewhere made up.

export const site = {
  name: "Reinvent the Wheel",
  shortName: "RTW",
  tagline: "Civilization, Offline.",
  statement: "Knowledge worth keeping.",
  description:
    "Reinvent the Wheel (RTW) is a free, open-source, offline-first knowledge library. Preserve, access and share useful human knowledge on a Mac or Android device — no internet required to use what you've downloaded.",
  url: "https://reinvent-the-wheel.com",
  locale: "en",

  repo: {
    // The real repository. Set to null to hide every GitHub link.
    url: "https://github.com/eslam-mahmoud/reinvent-the-wheel" as string | null,
    branch: "main",
    // Enable these once they exist on GitHub.
    discussions: null as string | null,
    contributing: "https://github.com/eslam-mahmoud/reinvent-the-wheel/blob/main/CONTRIBUTING.md" as string | null,
  },

  maintainer: {
    name: "Islam Mahmoud",
    url: "https://github.com/eslam-mahmoud" as string | null,
  },

  // No license file has been published in the repository yet. Set this
  // (e.g. { name: "MIT", url: ".../LICENSE" }) once it has.
  license: null as null | { name: string; url: string },

  // Date the Privacy and Terms pages were last reviewed.
  legalUpdated: "2026-10-14",
};

export const repoLink = (path = "") =>
  site.repo.url ? `${site.repo.url}${path}` : null;

export const issuesUrl = repoLink("/issues");
export const newIssueUrl = repoLink("/issues/new");
export const rawUrl = (file: string) =>
  site.repo.url
    ? site.repo.url.replace("https://github.com/", "https://raw.githubusercontent.com/") +
      `/${site.repo.branch}/${file}`
    : null;
