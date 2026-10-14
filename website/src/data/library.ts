// Curated reference directory — NOT a list of bundled content.
// RTW doesn't ship, mirror or redistribute third-party material. Each provider
// sets its own license and terms; visitors download from the source.

export type Format = "zim" | "pdf" | "epub" | "pmtiles" | "html" | "md" | "apk";

/** File types the RTW server can serve today, and where they appear. */
export const formats: Record<Format, { label: string; where: string }> = {
  zim: { label: "ZIM", where: "Wikipedia section (Kiwix)" },
  pdf: { label: "PDF", where: "Books or Downloads" },
  epub: { label: "EPUB", where: "Books" },
  pmtiles: { label: "PMTiles", where: "Maps" },
  html: { label: "HTML", where: "Sites" },
  md: { label: "Markdown / TXT", where: "Notes" },
  apk: { label: "APK", where: "Downloads" },
};

export interface Provider {
  name: string;
  url: string;
  note: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  examples: string[];
  formats: Format[];
  providers: Provider[];
}

const kiwix: Provider = {
  name: "Kiwix Library",
  url: "https://library.kiwix.org",
  note: "Offline ZIM archives of Wikipedia, Wiktionary, Wikibooks, Stack Exchange sites and more.",
};

export const categories: Category[] = [
  {
    id: "water",
    name: "Water & Sanitation",
    icon: "droplet",
    description: "Finding, treating and storing safe water, and keeping communities healthy through sanitation.",
    examples: ["Water purification methods", "Well and cistern construction", "Latrine design", "Hygiene education material"],
    formats: ["pdf", "zim", "html"],
    providers: [
      { name: "Appropedia", url: "https://www.appropedia.org", note: "Open wiki on appropriate technology and sustainability." },
      { name: "Hesperian Health Guides", url: "https://hesperian.org", note: "Community health books, including water and sanitation guides. Check each title's terms." },
    ],
  },
  {
    id: "food",
    name: "Food & Agriculture",
    icon: "sprout",
    description: "Growing, preserving and storing food, from small gardens to community-scale farming.",
    examples: ["Crop and soil guides", "Food preservation", "Irrigation basics", "Livestock care"],
    formats: ["pdf", "epub", "zim"],
    providers: [
      { name: "FAO publications", url: "https://www.fao.org/publications", note: "Food and Agriculture Organization of the UN. Licenses vary by publication." },
      { name: "Appropedia", url: "https://www.appropedia.org", note: "Practical agriculture and food-processing projects." },
    ],
  },
  {
    id: "medicine",
    name: "Medicine & Healthcare",
    icon: "cross",
    description: "Reference health information for learning and preparedness. Not a substitute for professional care.",
    examples: ["First-aid references", "Community health worker manuals", "Medical encyclopedia articles", "Maternal and child health guides"],
    formats: ["zim", "pdf"],
    providers: [
      { ...kiwix, note: "Includes medical collections such as WikiMed (Wikipedia's medicine articles)." },
      { name: "Hesperian Health Guides", url: "https://hesperian.org", note: "Widely used community health books. Check each title's terms." },
      { name: "WHO publications", url: "https://www.who.int/publications", note: "World Health Organization guidelines and manuals." },
    ],
  },
  {
    id: "engineering",
    name: "Engineering & Mechanics",
    icon: "gear",
    description: "How machines work and how to build, maintain and repair them.",
    examples: ["Repair guides", "Simple machines", "Workshop practice", "Historical trade manuals"],
    formats: ["zim", "pdf", "html"],
    providers: [
      { name: "iFixit", url: "https://www.ifixit.com", note: "Repair guides; also available as an offline ZIM in the Kiwix library." },
      { name: "Survivor Library", url: "https://www.survivorlibrary.com", note: "Scanned historical books on pre-industrial technology." },
      { name: "Open Source Ecology", url: "https://www.opensourceecology.org", note: "Open designs for essential machines." },
    ],
  },
  {
    id: "energy",
    name: "Energy & Electricity",
    icon: "bolt",
    description: "Generating, storing and using power safely — from solar panels to basic wiring.",
    examples: ["Small solar systems", "Battery care", "Basic electrical safety", "Micro-hydro and wind"],
    formats: ["pdf", "zim", "html"],
    providers: [
      { name: "Appropedia", url: "https://www.appropedia.org", note: "Renewable energy projects and how-tos." },
      { ...kiwix, note: "Wikipedia and Wikibooks articles on electricity and energy systems." },
    ],
  },
  {
    id: "construction",
    name: "Construction & Materials",
    icon: "brick",
    description: "Shelter, building techniques and working with local materials.",
    examples: ["Earthen and masonry building", "Basic structural concepts", "Roofing", "Tool use"],
    formats: ["pdf", "epub", "zim"],
    providers: [
      { name: "Survivor Library", url: "https://www.survivorlibrary.com", note: "Historical construction and materials texts." },
      { name: "Appropedia", url: "https://www.appropedia.org", note: "Low-cost building methods." },
    ],
  },
  {
    id: "science",
    name: "Science & Mathematics",
    icon: "atom",
    description: "The fundamentals that everything else rests on.",
    examples: ["Textbooks from school to university level", "Physics and chemistry references", "Math courses", "Interactive simulations"],
    formats: ["pdf", "zim", "html"],
    providers: [
      { name: "OpenStax", url: "https://openstax.org", note: "Free, openly licensed textbooks." },
      { name: "PhET Interactive Simulations", url: "https://phet.colorado.edu", note: "Science and math simulations, several downloadable for offline use." },
      kiwix,
    ],
  },
  {
    id: "electronics",
    name: "Communication & Electronics",
    icon: "radio",
    description: "Electronics, radio and keeping people in touch when networks are down.",
    examples: ["Electronics fundamentals", "Radio communication basics", "Q&A archives", "Component references"],
    formats: ["zim", "pdf"],
    providers: [
      { ...kiwix, note: "Includes offline archives of Stack Exchange sites such as Electrical Engineering." },
      { name: "Wikibooks", url: "https://www.wikibooks.org", note: "Open textbooks on electronics and more; offline via Kiwix." },
    ],
  },
  {
    id: "maps",
    name: "Maps & Geography",
    icon: "map",
    description: "Offline maps for finding your way, planning and understanding a region.",
    examples: ["Vector maps for a country or region", "Turn-by-turn navigation maps", "Travel guides", "Geography references"],
    formats: ["pmtiles", "apk", "zim"],
    providers: [
      { name: "Protomaps", url: "https://protomaps.com", note: "OpenStreetMap-based PMTiles — RTW extracts a region from their builds." },
      { name: "OpenStreetMap", url: "https://www.openstreetmap.org", note: "The open map data behind most offline maps (ODbL)." },
      { name: "OsmAnd", url: "https://osmand.net", note: "Offline navigation app with downloadable map files." },
    ],
  },
  {
    id: "general",
    name: "General Knowledge",
    icon: "book",
    description: "Encyclopedias, dictionaries and the long tail of everything else.",
    examples: ["Wikipedia in many languages", "Dictionaries", "Travel guides", "Quotations and reference works"],
    formats: ["zim", "epub"],
    providers: [
      { ...kiwix, note: "Wikipedia, Wiktionary, Wikivoyage and more, in many languages and sizes." },
      { name: "Project Gutenberg", url: "https://www.gutenberg.org", note: "Over 70,000 public-domain books (status varies by country)." },
    ],
  },
  {
    id: "education",
    name: "Education & Learning",
    icon: "cap",
    description: "Structured courses and teaching material for classrooms and self-learners.",
    examples: ["Textbooks", "Video lessons", "Exercises", "Teacher guides"],
    formats: ["pdf", "zim", "html"],
    providers: [
      { name: "Kolibri by Learning Equality", url: "https://learningequality.org/kolibri/", note: "A separate offline learning platform with curated channels — it can run alongside RTW." },
      { name: "OpenStax", url: "https://openstax.org", note: "Openly licensed textbooks." },
    ],
  },
  {
    id: "community",
    name: "Community & Infrastructure",
    icon: "people",
    description: "Organizing, governing and maintaining the shared systems communities depend on.",
    examples: ["Local notes and procedures", "Contact lists and schedules", "Maintenance logs", "Locally written guides"],
    formats: ["md", "html", "pdf"],
    providers: [
      { name: "Your own notes", url: "/docs/preparing-your-library/", note: "RTW's Notes and Sites sections are made for locally written material." },
      { name: "Appropedia", url: "https://www.appropedia.org", note: "Community-scale infrastructure projects." },
    ],
  },
];
