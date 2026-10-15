// Curated reference directory — NOT a list of bundled content.
// RTW doesn't ship, mirror or redistribute third-party material. Each provider
// sets its own license and terms; visitors download from the source.
import type { Localized } from "../i18n/config";

export type Format = "zim" | "pdf" | "epub" | "pmtiles" | "html" | "md" | "apk";

/** File types the RTW server can serve today, and where they appear. */
export const formats: Record<Format, { label: string; where: Localized }> = {
  zim: { label: "ZIM", where: { en: "Wikipedia section (Kiwix)", ar: "قسم ويكيبيديا (Kiwix)" } },
  pdf: { label: "PDF", where: { en: "Books or Downloads", ar: "الكتب أو التنزيلات" } },
  epub: { label: "EPUB", where: { en: "Books", ar: "الكتب" } },
  pmtiles: { label: "PMTiles", where: { en: "Maps", ar: "الخرائط" } },
  html: { label: "HTML", where: { en: "Sites", ar: "المواقع" } },
  md: { label: "Markdown / TXT", where: { en: "Notes", ar: "الملاحظات" } },
  apk: { label: "APK", where: { en: "Downloads", ar: "التنزيلات" } },
};

export interface Provider {
  name: string;
  url: string;
  note: Localized;
}

export interface Category {
  id: string;
  name: Localized;
  icon: string;
  description: Localized;
  examples: Localized<string[]>;
  formats: Format[];
  providers: Provider[];
}

const kiwix = (note: Localized): Provider => ({ name: "Kiwix Library", url: "https://library.kiwix.org", note });
const kiwixGeneral = kiwix({
  en: "Offline ZIM archives of Wikipedia, Wiktionary, Wikibooks, Stack Exchange sites and more.",
  ar: "أرشيفات ZIM دون اتصال لويكيبيديا وويكاموس وويكي الكتب ومواقع Stack Exchange وغيرها.",
});
const appropedia = (note: Localized): Provider => ({ name: "Appropedia", url: "https://www.appropedia.org", note });
const hesperian = (note: Localized): Provider => ({ name: "Hesperian Health Guides", url: "https://hesperian.org", note });
const survivor = (note: Localized): Provider => ({ name: "Survivor Library", url: "https://www.survivorlibrary.com", note });
const openstax = (note: Localized): Provider => ({ name: "OpenStax", url: "https://openstax.org", note });

export const categories: Category[] = [
  {
    id: "water",
    name: { en: "Water & Sanitation", ar: "المياه والصرف الصحي" },
    icon: "droplet",
    description: {
      en: "Finding, treating and storing safe water, and keeping communities healthy through sanitation.",
      ar: "إيجاد المياه الآمنة ومعالجتها وتخزينها، والحفاظ على صحة المجتمعات من خلال الصرف الصحي.",
    },
    examples: {
      en: ["Water purification methods", "Well and cistern construction", "Latrine design", "Hygiene education material"],
      ar: ["طرق تنقية المياه", "بناء الآبار والخزانات", "تصميم المراحيض", "مواد التوعية الصحية"],
    },
    formats: ["pdf", "zim", "html"],
    providers: [
      appropedia({ en: "Open wiki on appropriate technology and sustainability.", ar: "موسوعة مفتوحة عن التقنيات الملائمة والاستدامة." }),
      hesperian({ en: "Community health books, including water and sanitation guides. Check each title's terms.", ar: "كتب صحة مجتمعية، منها أدلة المياه والصرف الصحي. راجع شروط كل كتاب." }),
    ],
  },
  {
    id: "food",
    name: { en: "Food & Agriculture", ar: "الغذاء والزراعة" },
    icon: "sprout",
    description: {
      en: "Growing, preserving and storing food, from small gardens to community-scale farming.",
      ar: "زراعة الغذاء وحفظه وتخزينه، من الحدائق الصغيرة إلى الزراعة على مستوى المجتمع.",
    },
    examples: {
      en: ["Crop and soil guides", "Food preservation", "Irrigation basics", "Livestock care"],
      ar: ["أدلة المحاصيل والتربة", "حفظ الأغذية", "أساسيات الري", "رعاية الماشية"],
    },
    formats: ["pdf", "epub", "zim"],
    providers: [
      { name: "FAO publications", url: "https://www.fao.org/publications", note: { en: "Food and Agriculture Organization of the UN. Licenses vary by publication.", ar: "منظمة الأغذية والزراعة للأمم المتحدة. تختلف الرخص من منشور لآخر." } },
      appropedia({ en: "Practical agriculture and food-processing projects.", ar: "مشاريع عملية في الزراعة وتصنيع الأغذية." }),
    ],
  },
  {
    id: "medicine",
    name: { en: "Medicine & Healthcare", ar: "الطب والرعاية الصحية" },
    icon: "cross",
    description: {
      en: "Reference health information for learning and preparedness. Not a substitute for professional care.",
      ar: "معلومات صحية مرجعية للتعلّم والاستعداد. لا تغني عن الرعاية المتخصصة.",
    },
    examples: {
      en: ["First-aid references", "Community health worker manuals", "Medical encyclopedia articles", "Maternal and child health guides"],
      ar: ["مراجع الإسعافات الأولية", "أدلة العاملين في الصحة المجتمعية", "مقالات موسوعية طبية", "أدلة صحة الأم والطفل"],
    },
    formats: ["zim", "pdf"],
    providers: [
      kiwix({ en: "Includes medical collections such as Wikipedia's medicine articles.", ar: "تضم مجموعات طبية مثل مقالات الطب في ويكيبيديا." }),
      hesperian({ en: "Widely used community health books. Check each title's terms.", ar: "كتب صحة مجتمعية واسعة الانتشار. راجع شروط كل كتاب." }),
      { name: "WHO publications", url: "https://www.who.int/publications", note: { en: "World Health Organization guidelines and manuals.", ar: "إرشادات وأدلة منظمة الصحة العالمية." } },
    ],
  },
  {
    id: "engineering",
    name: { en: "Engineering & Mechanics", ar: "الهندسة والميكانيكا" },
    icon: "gear",
    description: {
      en: "How machines work and how to build, maintain and repair them.",
      ar: "كيف تعمل الآلات وكيف تُبنى وتُصان وتُصلَح.",
    },
    examples: {
      en: ["Repair guides", "Simple machines", "Workshop practice", "Historical trade manuals"],
      ar: ["أدلة الإصلاح", "الآلات البسيطة", "العمل في الورشة", "أدلة الحِرف التاريخية"],
    },
    formats: ["zim", "pdf", "html"],
    providers: [
      { name: "iFixit", url: "https://www.ifixit.com", note: { en: "Repair guides; also available as an offline ZIM in the Kiwix library.", ar: "أدلة إصلاح؛ ومتاحة أيضًا كملف ZIM في مكتبة Kiwix." } },
      survivor({ en: "Scanned historical books on pre-industrial technology.", ar: "كتب تاريخية ممسوحة ضوئيًا عن تقنيات ما قبل الثورة الصناعية." }),
      { name: "Open Source Ecology", url: "https://www.opensourceecology.org", note: { en: "Open designs for essential machines.", ar: "تصاميم مفتوحة لآلات أساسية." } },
    ],
  },
  {
    id: "energy",
    name: { en: "Energy & Electricity", ar: "الطاقة والكهرباء" },
    icon: "bolt",
    description: {
      en: "Generating, storing and using power safely — from solar panels to basic wiring.",
      ar: "توليد الطاقة وتخزينها واستخدامها بأمان — من الألواح الشمسية إلى التمديدات الكهربائية الأساسية.",
    },
    examples: {
      en: ["Small solar systems", "Battery care", "Basic electrical safety", "Micro-hydro and wind"],
      ar: ["أنظمة شمسية صغيرة", "العناية بالبطاريات", "أساسيات السلامة الكهربائية", "الطاقة المائية الصغيرة والرياح"],
    },
    formats: ["pdf", "zim", "html"],
    providers: [
      appropedia({ en: "Renewable energy projects and how-tos.", ar: "مشاريع وأدلة في الطاقة المتجددة." }),
      kiwix({ en: "Wikipedia and Wikibooks articles on electricity and energy systems.", ar: "مقالات ويكيبيديا وويكي الكتب عن الكهرباء وأنظمة الطاقة." }),
    ],
  },
  {
    id: "construction",
    name: { en: "Construction & Materials", ar: "البناء والمواد" },
    icon: "brick",
    description: {
      en: "Shelter, building techniques and working with local materials.",
      ar: "المأوى وتقنيات البناء والعمل بالمواد المحلية.",
    },
    examples: {
      en: ["Earthen and masonry building", "Basic structural concepts", "Roofing", "Tool use"],
      ar: ["البناء بالطين والحجر", "مفاهيم إنشائية أساسية", "الأسقف", "استخدام الأدوات"],
    },
    formats: ["pdf", "epub", "zim"],
    providers: [
      survivor({ en: "Historical construction and materials texts.", ar: "نصوص تاريخية عن البناء والمواد." }),
      appropedia({ en: "Low-cost building methods.", ar: "طرق بناء منخفضة التكلفة." }),
    ],
  },
  {
    id: "science",
    name: { en: "Science & Mathematics", ar: "العلوم والرياضيات" },
    icon: "atom",
    description: {
      en: "The fundamentals that everything else rests on.",
      ar: "الأسس التي يقوم عليها كل شيء آخر.",
    },
    examples: {
      en: ["Textbooks from school to university level", "Physics and chemistry references", "Math courses", "Interactive simulations"],
      ar: ["كتب دراسية من المدرسة حتى الجامعة", "مراجع الفيزياء والكيمياء", "مقررات الرياضيات", "محاكاة تفاعلية"],
    },
    formats: ["pdf", "zim", "html"],
    providers: [
      openstax({ en: "Free, openly licensed textbooks.", ar: "كتب دراسية مجانية برخص مفتوحة." }),
      { name: "PhET Interactive Simulations", url: "https://phet.colorado.edu", note: { en: "Science and math simulations; also packaged as a ZIM in the Kiwix library.", ar: "محاكاة علمية ورياضية؛ ومتاحة أيضًا كملف ZIM في مكتبة Kiwix." } },
      kiwixGeneral,
    ],
  },
  {
    id: "electronics",
    name: { en: "Communication & Electronics", ar: "الاتصالات والإلكترونيات" },
    icon: "radio",
    description: {
      en: "Electronics, radio and keeping people in touch when networks are down.",
      ar: "الإلكترونيات والراديو والحفاظ على التواصل عند انقطاع الشبكات.",
    },
    examples: {
      en: ["Electronics fundamentals", "Radio communication basics", "Q&A archives", "Component references"],
      ar: ["أساسيات الإلكترونيات", "أساسيات الاتصال اللاسلكي", "أرشيفات الأسئلة والأجوبة", "مراجع المكوّنات"],
    },
    formats: ["zim", "pdf", "apk"],
    providers: [
      kiwix({ en: "Includes offline archives of Stack Exchange sites such as Electrical Engineering.", ar: "تضم أرشيفات دون اتصال لمواقع Stack Exchange مثل الهندسة الكهربائية." }),
      { name: "Wikibooks", url: "https://www.wikibooks.org", note: { en: "Open textbooks on electronics and more; offline via Kiwix.", ar: "كتب مفتوحة عن الإلكترونيات وغيرها؛ متاحة دون اتصال عبر Kiwix." } },
      { name: "Bitchat", url: "https://github.com/permissionlesstech/bitchat-android", note: { en: "Chat with nearby phones over Bluetooth mesh, no network needed (GPL-3.0). `rtw fetch bitchat` adds it to Downloads.", ar: "دردشة مع الهواتف القريبة عبر شبكة بلوتوث متداخلة دون أي شبكة (GPL-3.0). الأمر `rtw fetch bitchat` يضيفه إلى التنزيلات." } },
    ],
  },
  {
    id: "maps",
    name: { en: "Maps & Geography", ar: "الخرائط والجغرافيا" },
    icon: "map",
    description: {
      en: "Offline maps for finding your way, planning and understanding a region.",
      ar: "خرائط دون اتصال لمعرفة الطريق والتخطيط وفهم المنطقة.",
    },
    examples: {
      en: ["Vector maps for a country or region", "Turn-by-turn navigation maps", "Travel guides", "Geography references"],
      ar: ["خرائط متجهية لبلد أو منطقة", "خرائط ملاحة خطوة بخطوة", "أدلة سفر", "مراجع جغرافية"],
    },
    formats: ["pmtiles", "apk", "zim"],
    providers: [
      { name: "Protomaps", url: "https://protomaps.com", note: { en: "OpenStreetMap-based PMTiles — RTW extracts a region from their builds.", ar: "ملفات PMTiles مبنية على OpenStreetMap — يقتطع RTW منطقة من إصداراتهم." } },
      { name: "OpenStreetMap", url: "https://www.openstreetmap.org", note: { en: "The open map data behind most offline maps (ODbL).", ar: "بيانات الخرائط المفتوحة وراء معظم الخرائط دون اتصال (ODbL)." } },
      { name: "OsmAnd", url: "https://osmand.net", note: { en: "Offline navigation app with downloadable map files. `rtw fetch osmand` adds it to Downloads.", ar: "تطبيق ملاحة دون اتصال مع ملفات خرائط قابلة للتنزيل. الأمر `rtw fetch osmand` يضيفه إلى التنزيلات." } },
    ],
  },
  {
    id: "general",
    name: { en: "General Knowledge", ar: "المعرفة العامة" },
    icon: "book",
    description: {
      en: "Encyclopedias, dictionaries and the long tail of everything else.",
      ar: "الموسوعات والقواميس وكل ما تبقّى من معارف.",
    },
    examples: {
      en: ["Wikipedia in many languages", "Dictionaries", "Travel guides", "Quotations and reference works"],
      ar: ["ويكيبيديا بلغات كثيرة", "القواميس", "أدلة السفر", "الاقتباسات والأعمال المرجعية"],
    },
    formats: ["zim", "epub"],
    providers: [
      kiwix({ en: "Wikipedia, Wiktionary, Wikivoyage and more, in many languages and sizes.", ar: "ويكيبيديا وويكاموس وويكي رحلات وغيرها، بلغات وأحجام متعددة." }),
      { name: "Project Gutenberg", url: "https://www.gutenberg.org", note: { en: "Over 75,000 free eBooks, mostly public domain in the US (check your country).", ar: "أكثر من 75,000 كتاب إلكتروني مجاني، معظمها ملك عام في الولايات المتحدة (تحقق من وضعها في بلدك)." } },
    ],
  },
  {
    id: "education",
    name: { en: "Education & Learning", ar: "التعليم والتعلّم" },
    icon: "cap",
    description: {
      en: "Structured courses and teaching material for classrooms and self-learners.",
      ar: "مقررات منظمة ومواد تعليمية للفصول الدراسية والمتعلمين الذاتيين.",
    },
    examples: {
      en: ["Textbooks", "Video lessons", "Exercises", "Teacher guides"],
      ar: ["الكتب الدراسية", "الدروس المرئية", "التمارين", "أدلة المعلمين"],
    },
    formats: ["pdf", "zim", "html"],
    providers: [
      { name: "Kolibri by Learning Equality", url: "https://learningequality.org/kolibri/", note: { en: "A separate offline learning platform with curated course channels.", ar: "منصة تعلّم مستقلة تعمل دون اتصال، مع قنوات مقررات منتقاة." } },
      openstax({ en: "Openly licensed textbooks.", ar: "كتب دراسية برخص مفتوحة." }),
    ],
  },
  {
    id: "community",
    name: { en: "Community & Infrastructure", ar: "المجتمع والبنية التحتية" },
    icon: "people",
    description: {
      en: "Organizing, governing and maintaining the shared systems communities depend on.",
      ar: "تنظيم الأنظمة المشتركة التي تعتمد عليها المجتمعات وإدارتها وصيانتها.",
    },
    examples: {
      en: ["Local notes and procedures", "Contact lists and schedules", "Maintenance logs", "Locally written guides"],
      ar: ["ملاحظات وإجراءات محلية", "قوائم الاتصال والجداول", "سجلات الصيانة", "أدلة مكتوبة محليًا"],
    },
    formats: ["md", "html", "pdf"],
    providers: [
      { name: "RTW Notes & Sites", url: "/docs/preparing-your-library/", note: { en: "The Notes and Sites sections are made for locally written material.", ar: "قسما الملاحظات والمواقع مخصّصان للمواد المكتوبة محليًا." } },
      appropedia({ en: "Community-scale infrastructure projects.", ar: "مشاريع بنية تحتية على مستوى المجتمع." }),
    ],
  },
  {
    id: "islamic",
    name: { en: "Islamic Studies", ar: "العلوم الإسلامية" },
    icon: "book",
    description: {
      en: "The Qur'an, Forty Nawawi and the six major Hadith collections, linked to original publishers or specialized reference collections.",
      ar: "القرآن الكريم، والأربعون النووية، والكتب الستة للحديث من مصادرها الأصلية أو المكتبات الحديثية المتخصصة.",
    },
    examples: {
      en: ["Madinah Mushaf — Hafs", "Forty Hadith of an-Nawawi", "The six major Hadith collections"],
      ar: ["مصحف المدينة النبوية — رواية حفص", "الأربعون النووية", "الكتب الستة"],
    },
    formats: ["pdf", "html"],
    providers: [
      {
        name: "King Fahd Qur'an Printing Complex — Madinah Mushaf (PDF)",
        url: "https://qurancomplex.gov.sa/wp-content/uploads/isdarat/hafs/standard39-2.pdf",
        note: {
          en: "Direct PDF supplied for RTW. Core default when the content-pack downloader is implemented; publisher terms apply.",
          ar: "ملف PDF لمصحف المدينة. ضمن المحتوى الافتراضي عند تنفيذ تنزيل الحزم؛ تُراعى شروط المجمع.",
        },
      },
      {
        name: "IslamHouse / Dar al-Salam — Forty Nawawi (PDF)",
        url: "https://d1.islamhouse.com/data/ar/ih_books/parts/Forty_Nawawi_Hadith/ar_Forty_Nawawi_Hadith_Dar_Alsalam.pdf",
        note: {
          en: "32-page Arabic PDF. Core default when the content-pack downloader is implemented; source and publisher terms apply.",
          ar: "نسخة عربية من ٣٢ صفحة. ضمن المحتوى الافتراضي عند تنفيذ تنزيل الحزم؛ تُراعى شروط المصدر والناشر.",
        },
      },
      {
        name: "Sahih al-Bukhari — صحيح البخاري",
        url: "https://sunnah.com/bukhari",
        note: { en: "Online reference only, not bundled or bulk-downloaded.", ar: "رابط مرجعي فقط؛ لا يُضمَّن ولا يُنزَّل آليًا بالكامل." },
      },
      {
        name: "Sahih Muslim — صحيح مسلم",
        url: "https://sunnah.com/muslim",
        note: { en: "Online reference only.", ar: "رابط مرجعي فقط." },
      },
      {
        name: "Sunan Abi Dawud — سنن أبي داود",
        url: "https://sunnah.com/abudawud",
        note: { en: "Online reference only.", ar: "رابط مرجعي فقط." },
      },
      {
        name: "Jami at-Tirmidhi — جامع الترمذي",
        url: "https://sunnah.com/tirmidhi",
        note: { en: "Online reference only.", ar: "رابط مرجعي فقط." },
      },
      {
        name: "Sunan an-Nasa'i — سنن النسائي",
        url: "https://sunnah.com/nasai",
        note: { en: "Online reference only.", ar: "رابط مرجعي فقط." },
      },
      {
        name: "Sunan Ibn Majah — سنن ابن ماجه",
        url: "https://sunnah.com/ibnmajah",
        note: { en: "Online reference only.", ar: "رابط مرجعي فقط." },
      },
    ],
  },
];
