import type { TemplateId } from "@/data/templateCatalog";

interface ComposeRequest {
  templateId: TemplateId;
  payload: Record<string, unknown>;
}

export interface ComposedTemplateResult {
  svg: string;
  dataUrl: string;
  normalizedPayload: Record<string, unknown>;
}

const CANVAS = 3600;
const CENTER = CANVAS / 2;

const monthColorMap: Record<string, string> = {
  jan: "#5b7cfa",
  feb: "#8c6ad6",
  mar: "#5ba36a",
  apr: "#f08c6b",
  may: "#4aa87d",
  jun: "#f7b267",
  jul: "#ff7a59",
  aug: "#f2a541",
  sep: "#5f9ea0",
  oct: "#d96c4f",
  nov: "#6b705c",
  dec: "#4f7bd9",
};

const monthValues = new Set(Object.keys(monthColorMap));

const esc = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .trim();

const normalizeText = (value: unknown, maxLen: number, fallback: string, forceUpper = true): string => {
  const cleaned = esc(value)
    .replace(/\s+/g, " ")
    .slice(0, maxLen)
    .trim();

  if (!cleaned) return fallback;
  return forceUpper ? cleaned.toUpperCase() : cleaned;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const fitFontSize = (text: string, base: number, min: number, maxCharsAtBase: number): number => {
  const safeLen = Math.max(1, text.length);
  const ratio = maxCharsAtBase / safeLen;
  return Math.round(clamp(base * ratio, min, base));
};

const fitLetterSpacing = (text: string, base: number, min: number): number => {
  const penalty = Math.max(0, text.length - 14) * 0.45;
  return Math.round(clamp(base - penalty, min, base));
};

const toDataUri = (svg: string): string => {
  const encoded = Buffer.from(svg, "utf8").toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
};

function ensureYear(input: unknown, fallback = "1990"): string {
  const raw = esc(input).replace(/[^0-9]/g, "");
  const year = raw.length === 4 ? raw : fallback;
  const yearNum = Number(year);
  if (Number.isNaN(yearNum)) return fallback;
  if (yearNum < 1900) return "1900";
  if (yearNum > 2100) return "2100";
  return year;
}

function ringText(text: string, id: string, dy: number, fontSize: number, letterSpacing: number): string {
  return `<text font-family="Arial Black, Montserrat, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="${letterSpacing}" fill="#2a1f16"><textPath href="#${id}" startOffset="50%" text-anchor="middle" dominant-baseline="middle" dy="${dy}">${esc(text)}</textPath></text>`;
}

function normalizeVintagePayload(payload: Record<string, unknown>) {
  return {
    year: ensureYear(payload.year, "1988"),
    name: normalizeText(payload.name, 36, "LIMITED EDITION"),
    city: normalizeText(payload.city, 24, "BUDAPEST"),
    slogan: normalizeText(payload.slogan, 34, "CRAFTED FOR LEGENDS"),
  };
}

function vintageYearBadge(payload: ReturnType<typeof normalizeVintagePayload>): string {
  const topFont = fitFontSize(payload.name, 170, 112, 22);
  const bottomFont = fitFontSize(payload.city, 170, 120, 16);
  const sloganFont = fitFontSize(payload.slogan, 118, 88, 22);
  const topSpacing = fitLetterSpacing(payload.name, 12, 4);
  const bottomSpacing = fitLetterSpacing(payload.city, 12, 4);
  const sloganSpacing = fitLetterSpacing(payload.slogan, 7, 2);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <defs>
    <path id="topArc" d="M 700 1800 A 1100 1100 0 0 1 2900 1800" />
    <path id="bottomArc" d="M 700 1800 A 1100 1100 0 0 0 2900 1800" />
  </defs>
  <rect width="${CANVAS}" height="${CANVAS}" fill="none"/>
  <circle cx="${CENTER}" cy="${CENTER}" r="1120" fill="none" stroke="#2a1f16" stroke-width="70"/>
  <circle cx="${CENTER}" cy="${CENTER}" r="980" fill="none" stroke="#b78555" stroke-width="26" stroke-dasharray="28 32"/>
  ${ringText(payload.name, "topArc", -10, topFont, topSpacing)}
  ${ringText(payload.city, "bottomArc", 16, bottomFont, bottomSpacing)}
  <text x="${CENTER}" y="1640" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="640" fill="#2a1f16" letter-spacing="14">${payload.year}</text>
  <line x1="880" y1="1960" x2="2720" y2="1960" stroke="#2a1f16" stroke-width="24"/>
  <text x="${CENTER}" y="2140" text-anchor="middle" font-family="Arial, sans-serif" font-size="${sloganFont}" font-weight="700" letter-spacing="${sloganSpacing}" fill="#5b4632">${payload.slogan}</text>
  <polygon points="980,1550 1060,1710 1230,1740 1110,1870 1140,2040 980,1950 820,2040 850,1870 730,1740 900,1710" fill="#b78555" opacity="0.92"/>
  <polygon points="2620,1550 2700,1710 2870,1740 2750,1870 2780,2040 2620,1950 2460,2040 2490,1870 2370,1740 2540,1710" fill="#b78555" opacity="0.92"/>
</svg>`;
}

function normalizePetPayload(payload: Record<string, unknown>) {
  const rawPetType = normalizeText(payload.petType, 10, "DOG");
  const petType = rawPetType === "CAT" ? "cat" : "dog";
  return {
    petType,
    name: normalizeText(payload.name, 20, "MILO"),
    year: ensureYear(payload.year, "2026"),
  };
}

function petNameEmblem(payload: ReturnType<typeof normalizePetPayload>): string {
  const nameFont = fitFontSize(payload.name, 360, 250, 10);
  const nameSpacing = fitLetterSpacing(payload.name, 10, 2);

  const icon =
    payload.petType === "cat"
      ? `<path d="M1300 930 L1500 1180 L1700 930 L1900 1180 L2100 930 L2100 2050 Q2100 2400 1700 2480 L1700 2620 L1500 2620 L1500 2480 Q1100 2400 1100 2050 L1100 930 Z" fill="#2a1f16"/>`
      : `<path d="M1060 1120 Q1060 930 1260 900 L1380 730 L1520 900 L1700 900 L1880 730 L2020 900 Q2220 930 2220 1120 L2220 1980 Q2220 2360 1830 2450 L1830 2620 L1590 2620 L1590 2450 Q1200 2360 1200 1980 L1200 1120 Z" fill="#2a1f16"/>`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <rect width="${CANVAS}" height="${CANVAS}" fill="none"/>
  <circle cx="${CENTER}" cy="${CENTER}" r="1200" fill="none" stroke="#2a1f16" stroke-width="48"/>
  <circle cx="${CENTER}" cy="${CENTER}" r="1040" fill="none" stroke="#b78555" stroke-width="20" stroke-dasharray="14 18"/>
  ${icon}
  <text x="${CENTER}" y="2930" text-anchor="middle" font-family="Arial Black, Montserrat, sans-serif" font-size="${nameFont}" letter-spacing="${nameSpacing}" fill="#2a1f16">${payload.name}</text>
  <text x="${CENTER}" y="3220" text-anchor="middle" font-family="Arial, sans-serif" font-size="120" font-weight="700" letter-spacing="14" fill="#6b5a4a">EST. ${payload.year}</text>
</svg>`;
}

interface FamilyMember {
  name: string;
  month: string;
}

function normalizeFamilyMembers(input: unknown): FamilyMember[] {
  if (!Array.isArray(input)) return [];

  const normalized = input
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const name = normalizeText((entry as { name?: unknown }).name, 18, "", true);
      const monthCandidate = normalizeText((entry as { month?: unknown }).month, 3, "JAN", true).toLowerCase();
      if (!name) return null;
      const month = monthValues.has(monthCandidate) ? monthCandidate : "jan";
      return { name, month };
    })
    .filter((item): item is FamilyMember => Boolean(item));

  return normalized.slice(0, 6);
}

function normalizeGardenPayload(payload: Record<string, unknown>) {
  const members = normalizeFamilyMembers(payload.members);
  const safeMembers =
    members.length >= 2
      ? members
      : [
          { name: "ANNA", month: "jan" },
          { name: "MATE", month: "feb" },
        ];

  return {
    title: normalizeText(payload.title, 34, "A MI CSALADI KERTUNK"),
    members: safeMembers,
  };
}

function familyBirthGarden(payload: ReturnType<typeof normalizeGardenPayload>): string {
  const titleFont = fitFontSize(payload.title, 170, 118, 20);
  const titleSpacing = fitLetterSpacing(payload.title, 7, 2);

  const count = payload.members.length;
  const usableWidth = 2350;
  const startX = CENTER - usableWidth / 2;
  const spacing = count === 1 ? 0 : usableWidth / (count - 1);

  const plants = payload.members
    .map((member, index) => {
      const x = Math.round(startX + index * spacing);
      const flowerY = 1550;
      const color = monthColorMap[member.month] ?? "#b78555";
      const nameFont = fitFontSize(member.name, 118, 86, 10);
      const nameSpacing = fitLetterSpacing(member.name, 4, 1);

      return `
      <g>
        <line x1="${x}" y1="1750" x2="${x}" y2="2500" stroke="#2f6b3f" stroke-width="34" stroke-linecap="round"/>
        <ellipse cx="${x - 70}" cy="2000" rx="95" ry="44" fill="#4f8a5f" transform="rotate(-32 ${x - 70} 2000)"/>
        <ellipse cx="${x + 72}" cy="2140" rx="95" ry="44" fill="#4f8a5f" transform="rotate(32 ${x + 72} 2140)"/>
        <circle cx="${x}" cy="${flowerY}" r="84" fill="${color}"/>
        <circle cx="${x - 92}" cy="${flowerY}" r="62" fill="${color}" opacity="0.92"/>
        <circle cx="${x + 92}" cy="${flowerY}" r="62" fill="${color}" opacity="0.92"/>
        <circle cx="${x}" cy="${flowerY - 92}" r="62" fill="${color}" opacity="0.92"/>
        <circle cx="${x}" cy="${flowerY + 92}" r="62" fill="${color}" opacity="0.92"/>
        <circle cx="${x}" cy="${flowerY}" r="40" fill="#f6efe6"/>
        <text x="${x}" y="2740" text-anchor="middle" font-family="Arial Black, Montserrat, sans-serif" font-size="${nameFont}" fill="#2a1f16" letter-spacing="${nameSpacing}">${esc(member.name)}</text>
      </g>`;
    })
    .join("\n");

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <rect width="${CANVAS}" height="${CANVAS}" fill="none"/>
  <text x="${CENTER}" y="620" text-anchor="middle" font-family="Arial Black, Montserrat, sans-serif" font-size="${titleFont}" fill="#2a1f16" letter-spacing="${titleSpacing}">${payload.title}</text>
  <line x1="680" y1="740" x2="2920" y2="740" stroke="#b78555" stroke-width="18" stroke-linecap="round"/>
  ${plants}
  <path d="M500 2550 Q1800 2440 3100 2550" fill="none" stroke="#b78555" stroke-width="14" opacity="0.8"/>
</svg>`;
}

export function normalizeTemplatePayload(templateId: TemplateId, payload: Record<string, unknown>): Record<string, unknown> {
  if (templateId === "vintage_year_badge") return normalizeVintagePayload(payload);
  if (templateId === "pet_name_emblem") return normalizePetPayload(payload);
  return normalizeGardenPayload(payload);
}

export function composeTemplateSvg(input: ComposeRequest): ComposedTemplateResult {
  const normalizedPayload = normalizeTemplatePayload(input.templateId, input.payload);

  let svg: string;
  if (input.templateId === "vintage_year_badge") {
    svg = vintageYearBadge(normalizedPayload as ReturnType<typeof normalizeVintagePayload>);
  } else if (input.templateId === "pet_name_emblem") {
    svg = petNameEmblem(normalizedPayload as ReturnType<typeof normalizePetPayload>);
  } else {
    svg = familyBirthGarden(normalizedPayload as ReturnType<typeof normalizeGardenPayload>);
  }

  return {
    svg,
    dataUrl: toDataUri(svg),
    normalizedPayload,
  };
}
