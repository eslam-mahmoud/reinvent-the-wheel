// What each platform can actually do today. Keep this honest: only list a
// capability as "available" once it has been run end to end on that platform.
// Commands here are the real ones from the repository's `rtw` tool.

import { rawUrl, site } from "../config/site";
import type { Localized } from "../i18n/config";

export type Status = "available" | "testing" | "planned";

export interface Capability {
  label: Localized;
  status: Status;
  note?: Localized;
}

export interface Platform {
  id: "macos" | "android";
  name: string;
  summary: Localized;
  status: Status;
  statusText: Localized;
  /** No packaged releases exist yet; this links to one when it does. */
  release: { version: string; url: string; date: string } | null;
  requirements: Localized[];
  install: { title: Localized; commands?: string[] }[];
  limitations: Localized[];
  capabilities: Capability[];
  docs: string;
}

const bootstrap = rawUrl("bootstrap.sh");

export const platforms: Platform[] = [
  {
    id: "macos",
    name: "macOS",
    summary: {
      en: "Run the full library on a Mac and share it with devices on the same Wi-Fi.",
      ar: "شغّل المكتبة كاملة على جهاز Mac وشاركها مع الأجهزة المتصلة بشبكة Wi-Fi نفسها.",
    },
    status: "available",
    statusText: { en: "Available from source", ar: "متاح من الشيفرة المصدرية" },
    release: null,
    requirements: [
      { en: "macOS on Apple Silicon or Intel (tested on Apple Silicon)", ar: "macOS على معالج Apple Silicon أو Intel (اختُبر على Apple Silicon)" },
      { en: "Xcode Command Line Tools (provides git and Python 3)", ar: "أدوات سطر أوامر Xcode (توفّر git وPython 3)" },
      { en: "Homebrew (installs nginx)", ar: "Homebrew (لتثبيت nginx)" },
      { en: "Free disk space for content — Arabic Wikipedia (text only) is about 8.4 GB", ar: "مساحة تخزين للمحتوى — ويكيبيديا العربية (نص فقط) نحو 8.4 غيغابايت" },
    ],
    install: [
      {
        title: { en: "Get the code", ar: "احصل على الشيفرة" },
        commands: site.repo.url ? [`git clone ${site.repo.url}.git`, "cd reinvent-the-wheel"] : undefined,
      },
      { title: { en: "Install dependencies and set an admin password", ar: "ثبّت المتطلبات واختر كلمة مرور للمشرف" }, commands: ["./rtw setup"] },
      { title: { en: "Start the library", ar: "شغّل المكتبة" }, commands: ["./rtw start"] },
      { title: { en: "Download content while you're online", ar: "نزّل المحتوى وأنت متصل بالإنترنت" }, commands: ["./rtw fetch all"] },
    ],
    limitations: [
      { en: "No packaged macOS app yet — it runs from a terminal.", ar: "لا يوجد تطبيق macOS جاهز بعد — يعمل من الطرفية." },
      { en: "The Mac must stay awake while other devices use the library.", ar: "يجب أن يبقى جهاز Mac مستيقظًا ما دامت الأجهزة الأخرى تستخدم المكتبة." },
      { en: "Showing your location on the map from another device needs the HTTPS address and a one-time certificate warning.", ar: "عرض موقعك على الخريطة من جهاز آخر يتطلب عنوان HTTPS وقبول تحذير الشهادة مرة واحدة." },
    ],
    capabilities: [
      { label: { en: "Offline Wikipedia and other Kiwix ZIM files", ar: "ويكيبيديا وملفات Kiwix ‏ZIM الأخرى دون اتصال" }, status: "available" },
      { label: { en: "Books (PDF, EPUB), notes, downloads, static sites", ar: "الكتب (PDF وEPUB) والملاحظات والتنزيلات والمواقع الثابتة" }, status: "available" },
      { label: { en: "Offline vector maps (Saudi Arabia + Egypt extract)", ar: "خرائط متجهية دون اتصال (السعودية ومصر)" }, status: "available" },
      { label: { en: "Upload and manage content from a browser (password)", ar: "رفع المحتوى وإدارته من المتصفح (بكلمة مرور)" }, status: "available" },
      {
        label: { en: "Share with devices on the same Wi-Fi", ar: "المشاركة مع الأجهزة على شبكة Wi-Fi نفسها" },
        status: "available",
        note: { en: "Verified from an Android tablet on the same network", ar: "تم التحقق من جهاز Android لوحي على الشبكة نفسها" },
      },
      { label: { en: "Packaged installer", ar: "مثبّت جاهز" }, status: "planned" },
    ],
    docs: "/docs/macos-installation/",
  },
  {
    id: "android",
    name: "Android",
    summary: {
      en: "Turn a phone or tablet into a portable library that nearby devices reach over its hotspot.",
      ar: "حوّل هاتفًا أو جهازًا لوحيًا إلى مكتبة متنقلة تصل إليها الأجهزة القريبة عبر نقطة الاتصال الخاصة به.",
    },
    status: "available",
    statusText: { en: "Available from source", ar: "متاح من الشيفرة المصدرية" },
    release: null,
    requirements: [
      { en: "64-bit ARM device (arm64-v8a)", ar: "جهاز ARM بنظام 64 بت ‏(arm64-v8a)" },
      {
        en: "Termux — the F-Droid build supports Android 7+; the Google Play build we tested needs Android 12L or newer",
        ar: "تطبيق Termux — نسخة F-Droid تدعم Android 7 فما فوق؛ ونسخة Google Play التي اختبرناها تتطلب Android 12L أو أحدث",
      },
      { en: "Several GB of free storage for content", ar: "عدة غيغابايتات من المساحة الحرة للمحتوى" },
      { en: "4 GB of RAM or more recommended (tested with 8 GB)", ar: "يُنصح بذاكرة 4 غيغابايت أو أكثر (اختُبر بـ8 غيغابايت)" },
    ],
    install: [
      { title: { en: "Install Termux and open it", ar: "ثبّت Termux وافتحه" } },
      {
        title: { en: "Run the installer (asks for storage access and an admin password)", ar: "شغّل المثبّت (يطلب إذن الوصول إلى التخزين وكلمة مرور للمشرف)" },
        commands: bootstrap ? [`bash -c "$(curl -fsSL ${bootstrap})"`] : undefined,
      },
      { title: { en: "Start the library", ar: "شغّل المكتبة" }, commands: ["rtw start"] },
      { title: { en: "Turn on the Android hotspot and share the address it prints", ar: "فعّل نقطة الاتصال في Android وشارك العنوان الذي يظهر" } },
    ],
    limitations: [
      { en: "Runs inside Termux — there's no standalone Android app.", ar: "يعمل داخل Termux — لا يوجد تطبيق Android مستقل." },
      { en: "Android may stop background apps: set Termux's battery usage to “No restrictions”.", ar: "قد يوقف Android التطبيقات في الخلفية: اضبط استهلاك البطارية لتطبيق Termux على «بلا قيود»." },
      { en: "Starting on boot needs the separate Termux:Boot add-on.", ar: "التشغيل عند الإقلاع يتطلب الإضافة المنفصلة Termux:Boot." },
      { en: "External USB storage is not supported yet.", ar: "التخزين الخارجي عبر USB غير مدعوم بعد." },
    ],
    capabilities: [
      {
        label: { en: "Dependencies install in Termux (nginx, kiwix-tools, Python)", ar: "تثبيت المتطلبات في Termux ‏(nginx وkiwix-tools وPython)" },
        status: "available",
        note: { en: "Verified on a Redmi Pad 2 Pro, Android 16", ar: "تم التحقق على Redmi Pad 2 Pro بنظام Android 16" },
      },
      {
        label: { en: "One-command install from GitHub (no computer)", ar: "التثبيت بأمر واحد من GitHub (دون حاسوب)" },
        status: "available",
        note: { en: "Verified on a Redmi Pad 2 Pro", ar: "تم التحقق على Redmi Pad 2 Pro" },
      },
      {
        label: { en: "Library served from the device, including Wikipedia and maps", ar: "تقديم المكتبة من الجهاز، بما فيها ويكيبيديا والخرائط" },
        status: "available",
        note: { en: "8.4 GB Arabic Wikipedia via Kiwix", ar: "ويكيبيديا العربية 8.4 غيغابايت عبر Kiwix" },
      },
      { label: { en: "Copy content from a Mac over USB (rtw push)", ar: "نسخ المحتوى من Mac عبر USB ‏(rtw push)" }, status: "available" },
      {
        label: { en: "Share with devices on the same Wi-Fi", ar: "المشاركة مع الأجهزة على شبكة Wi-Fi نفسها" },
        status: "available",
        note: { en: "Verified from a Mac on the same network", ar: "تم التحقق من جهاز Mac على الشبكة نفسها" },
      },
      {
        label: { en: "Sharing over the device's own hotspot", ar: "المشاركة عبر نقطة الاتصال الخاصة بالجهاز" },
        status: "available",
        note: { en: "Verified with a phone on the tablet's hotspot", ar: "تم التحقق بهاتف متصل بنقطة اتصال الجهاز اللوحي" },
      },
      {
        label: { en: "Downloading content directly on the device (rtw fetch)", ar: "تنزيل المحتوى مباشرة على الجهاز (rtw fetch)" },
        status: "available",
        note: { en: "Verified: knowledge packs wizard, 240 MB", ar: "تم التحقق: معالج حِزم المعرفة، 240 ميغابايت" },
      },
      { label: { en: "External USB-C storage", ar: "التخزين الخارجي عبر USB-C" }, status: "planned" },
      { label: { en: "Standalone app", ar: "تطبيق مستقل" }, status: "planned" },
    ],
    docs: "/docs/android-installation/",
  },
];
