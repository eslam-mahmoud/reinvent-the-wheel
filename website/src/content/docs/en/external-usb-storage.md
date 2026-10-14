---
title: External USB Storage
description: Status of keeping the library on an external drive.
order: 9
draft: true
---

> **Not supported yet.** Nothing on this page has been tested. It records what's known so far for anyone who wants to help — see [Contribute](/contribute/).

Large collections can outgrow a device's internal storage. Whether an external drive can hold the library depends on the device, its USB-C support, the drive's filesystem and Android's storage permissions — so there's no single answer that works everywhere.

## What's known

- **Android:** Termux reads shared storage after `termux-setup-storage`. Android only lets apps write to removable drives in limited, app-specific locations, and USB drives come and go. The installer accepts a different content folder through the `RTW_CONTENT` environment variable, but no removable-storage setup has been verified.
- **macOS:** external drives mount under `/Volumes/` and are ordinary folders, so pointing the library at one is likely to work. It hasn't been tested yet.

## Maintainer TODO

- [ ] Test `content/` on an external drive on macOS and document the steps.
- [ ] Test `RTW_CONTENT` with an SD card and a USB-C drive on Android.
- [ ] Document which filesystems (exFAT, FAT32, ext4) work on each platform.
