export type TemplateId = "vintage_year_badge" | "pet_name_emblem" | "family_birth_garden";

export interface TemplateIdea {
  id: TemplateId | string;
  title: string;
  subtitle: string;
  complexity: "easy" | "medium";
  avgFillTimeSec: number;
  status: "active" | "coming_soon";
  tags: string[];
}

export const TEMPLATE_IDEAS: TemplateIdea[] = [
  {
    id: "vintage_year_badge",
    title: "Vintage Évszámos Badge",
    subtitle: "Évszám + név + város, gyors ajándék bestseller.",
    complexity: "easy",
    avgFillTimeSec: 20,
    status: "active",
    tags: ["férfi", "szülinap", "retró"],
  },
  {
    id: "pet_name_emblem",
    title: "Kedvenc Név Embléma",
    subtitle: "Kutya/macska ikon + név + évszám.",
    complexity: "easy",
    avgFillTimeSec: 18,
    status: "active",
    tags: ["állatbarát", "név", "minimal"],
  },
  {
    id: "family_birth_garden",
    title: "Családi Virágoskert",
    subtitle: "2-6 családtag név + hónap, automatikus elrendezéssel.",
    complexity: "medium",
    avgFillTimeSec: 45,
    status: "active",
    tags: ["család", "anya", "személyes"],
  },
  {
    id: "line_art_couple",
    title: "Line Art Páros",
    subtitle: "Névpár + dátum, elegáns vonalas stílus.",
    complexity: "medium",
    avgFillTimeSec: 30,
    status: "coming_soon",
    tags: ["esküvő", "évforduló"],
  },
  {
    id: "zodiac_constellation",
    title: "Csillagkép Konstelláció",
    subtitle: "Csillagjegy + név + dátum kombináció.",
    complexity: "medium",
    avgFillTimeSec: 35,
    status: "coming_soon",
    tags: ["horoszkóp", "ajándék"],
  },
  {
    id: "team_motto",
    title: "Csapat Motto",
    subtitle: "Csapatnév + mottó + év, céges giftinghez.",
    complexity: "easy",
    avgFillTimeSec: 22,
    status: "coming_soon",
    tags: ["céges", "team"],
  },
  {
    id: "mom_handwritten",
    title: "Anyák napi Signature",
    subtitle: "Kézírásos névhatás + gyereknevek.",
    complexity: "medium",
    avgFillTimeSec: 40,
    status: "coming_soon",
    tags: ["anya", "család"],
  },
  {
    id: "dad_tools_badge",
    title: "Apa Műhely Badge",
    subtitle: "Szerszám ikon + felirat + évszám.",
    complexity: "easy",
    avgFillTimeSec: 20,
    status: "coming_soon",
    tags: ["apa", "hobbi"],
  },
  {
    id: "travel_stamp",
    title: "Travel Stamp",
    subtitle: "Város + koordináta + dátum szerkeszthető pecsét.",
    complexity: "medium",
    avgFillTimeSec: 35,
    status: "coming_soon",
    tags: ["utazás", "minimal"],
  },
  {
    id: "birthday_burst",
    title: "Birthday Burst",
    subtitle: "Név + életkor + mini ikonok, party verzió.",
    complexity: "easy",
    avgFillTimeSec: 15,
    status: "coming_soon",
    tags: ["szülinap", "gyerek"],
  },
];

export const MONTH_OPTIONS = [
  { value: "jan", label: "Január" },
  { value: "feb", label: "Február" },
  { value: "mar", label: "Március" },
  { value: "apr", label: "Április" },
  { value: "may", label: "Május" },
  { value: "jun", label: "Június" },
  { value: "jul", label: "Július" },
  { value: "aug", label: "Augusztus" },
  { value: "sep", label: "Szeptember" },
  { value: "oct", label: "Október" },
  { value: "nov", label: "November" },
  { value: "dec", label: "December" },
] as const;
