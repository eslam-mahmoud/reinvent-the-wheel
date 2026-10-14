// What each platform can actually do today. Keep this honest: only list a
// capability as "available" once it has been run end to end on that platform.
// Commands here are the real ones from the repository's `rtw` tool.

import { rawUrl, site } from "../config/site";

export type Status = "available" | "testing" | "planned";

export interface Capability {
  label: string;
  status: Status;
  note?: string;
}

export interface Platform {
  id: "macos" | "android";
  name: string;
  summary: string;
  status: Status;
  statusText: string;
  /** No packaged releases exist yet; this links to one when it does. */
  release: { version: string; url: string; date: string } | null;
  requirements: string[];
  install: { title: string; commands?: string[]; text?: string }[];
  limitations: string[];
  capabilities: Capability[];
  docs: string;
}

const bootstrap = rawUrl("bootstrap.sh");

export const platforms: Platform[] = [
  {
    id: "macos",
    name: "macOS",
    summary: "Run the full library on a Mac and share it with devices on the same Wi-Fi.",
    status: "available",
    statusText: "Available from source",
    release: null,
    requirements: [
      "macOS on Apple Silicon or Intel",
      "Homebrew (installs nginx)",
      "git and a terminal",
      "Free disk space for content — Arabic Wikipedia (text only) is about 8.4 GB",
    ],
    install: [
      {
        title: "Get the code",
        commands: site.repo.url
          ? [`git clone ${site.repo.url}.git`, "cd reinvent-the-wheel"]
          : undefined,
      },
      { title: "Install dependencies and set an admin password", commands: ["./rtw setup"] },
      { title: "Start the library", commands: ["./rtw start"] },
      { title: "Download content while you're online", commands: ["./rtw fetch all"] },
    ],
    limitations: [
      "No packaged macOS app yet — it runs from a terminal.",
      "The Mac must stay awake while other devices use the library.",
      "Showing your location on the map from another device needs the HTTPS address and a one-time certificate warning.",
    ],
    capabilities: [
      { label: "Offline Wikipedia and other Kiwix ZIM files", status: "available" },
      { label: "Books (PDF, EPUB), notes, downloads, static sites", status: "available" },
      { label: "Offline vector maps (Saudi Arabia + Egypt extract)", status: "available" },
      { label: "Upload and manage content from a browser (password)", status: "available" },
      { label: "Share with devices on the same Wi-Fi", status: "available" },
      { label: "Packaged installer", status: "planned" },
    ],
    docs: "/docs/macos-installation/",
  },
  {
    id: "android",
    name: "Android",
    summary: "Turn a phone or tablet into a portable library that nearby devices reach over its hotspot.",
    status: "testing",
    statusText: "In testing",
    release: null,
    requirements: [
      "64-bit ARM device (arm64-v8a)",
      "Termux — the F-Droid build supports Android 7+; the Google Play build we tested needs Android 12L or newer",
      "Several GB of free storage for content",
      "About 4 GB of RAM or more is comfortable",
    ],
    install: [
      { title: "Install Termux and open it" },
      {
        title: "Run the installer (asks for storage access and an admin password)",
        commands: bootstrap ? [`bash -c "$(curl -fsSL ${bootstrap})"`] : undefined,
      },
      { title: "Start the library", commands: ["rtw start"] },
      { title: "Turn on the Android hotspot and share the address it prints" },
    ],
    limitations: [
      "Runs inside Termux — there's no standalone Android app.",
      "Android may stop background apps: set Termux's battery usage to “No restrictions”.",
      "Starting on boot needs the separate Termux:Boot add-on.",
      "External USB storage is not supported yet.",
    ],
    capabilities: [
      { label: "Dependencies install in Termux (nginx, kiwix-tools, Python)", status: "available", note: "Verified on a Redmi Pad 2 Pro, Android 16" },
      { label: "Full library served from the device", status: "testing" },
      { label: "Sharing over the device's own hotspot", status: "testing" },
      { label: "Downloading content directly on the device", status: "testing" },
      { label: "External USB-C storage", status: "planned" },
      { label: "Standalone app", status: "planned" },
    ],
    docs: "/docs/android-installation/",
  },
];

export const statusLabel: Record<Status, string> = {
  available: "Available",
  testing: "In testing",
  planned: "Planned",
};
