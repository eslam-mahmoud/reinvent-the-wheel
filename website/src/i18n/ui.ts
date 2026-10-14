// Strings shared across pages (header, footer, buttons, badges).
import type { Lang } from "./config";

export const ui = {
  en: {
    skip: "Skip to content",
    home: "home",
    nav: { how: "How It Works", download: "Download", library: "Library", docs: "Docs", about: "About", contribute: "Contribute" },
    getStarted: "Get Started",
    github: "GitHub",
    viewGithub: "View on GitHub",
    themeToggle: "Switch color theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main",
    switchTo: "اقرأ بالعربية",
    footer: {
      project: "Project", platforms: "Platforms", resources: "Resources", legal: "Legal",
      knowledgeLibrary: "Knowledge Library", roadmap: "Roadmap", quickStart: "Quick Start",
      documentation: "Documentation", acknowledgments: "Acknowledgments", privacy: "Privacy", terms: "Terms",
      rights: "and contributors.",
      licensed: (name: string) => ` Released under the ${name} license.`,
      unlicensed: " Open source; license to be published in the repository.",
      builtOn: "Built on Kiwix, OpenStreetMap, Protomaps, nginx and MapLibre.",
    },
    status: { available: "Available", testing: "In testing", planned: "Planned", concept: "Concept" },
    copy: "Copy", copied: "Copied", copyFail: "Select & copy", terminal: "Terminal",
    setup: (p: string) => `${p} Setup`,
  },
  ar: {
    skip: "انتقل إلى المحتوى",
    home: "الرئيسية",
    nav: { how: "كيف يعمل", download: "التنزيل", library: "المكتبة", docs: "التوثيق", about: "عن المشروع", contribute: "ساهم" },
    getStarted: "ابدأ الآن",
    github: "GitHub",
    viewGithub: "شاهده على GitHub",
    themeToggle: "تبديل المظهر",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    mainNav: "القائمة الرئيسية",
    switchTo: "Read in English",
    footer: {
      project: "المشروع", platforms: "المنصات", resources: "موارد", legal: "قانوني",
      knowledgeLibrary: "مكتبة المعرفة", roadmap: "خارطة الطريق", quickStart: "البدء السريع",
      documentation: "التوثيق", acknowledgments: "شكر وتقدير", privacy: "الخصوصية", terms: "الشروط",
      rights: "والمساهمون.",
      licensed: (name: string) => ` منشور بموجب رخصة ${name}.`,
      unlicensed: " مفتوح المصدر؛ ستُنشر الرخصة في المستودع لاحقًا.",
      builtOn: "مبني على Kiwix وOpenStreetMap وProtomaps وnginx وMapLibre.",
    },
    status: { available: "متاح", testing: "قيد الاختبار", planned: "مخطط له", concept: "تصوّر" },
    copy: "نسخ", copied: "تم النسخ", copyFail: "حدّد وانسخ", terminal: "الطرفية",
    setup: (p: string) => `إعداد ${p}`,
  },
} satisfies Record<Lang, unknown>;

export const t = (lang: Lang) => ui[lang];
