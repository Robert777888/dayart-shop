// ===== API Payload és Response típusok =====

/** A frontend ezt küldi a POST /api/generate-nek */
export interface GeneratePayload {
  occasion: string;
  recipient: string;
  motif: string;
  style: string;
  contentType: 'text_only' | 'graphic_text' | 'graphic_only';
}

/** Az API route ezt adja vissza a frontendnek */
export interface GenerateResponse {
  success: boolean;
  designUrl?: string;
  designId?: string;
  provider?: 'krea' | 'gemini';
  error?: string;
}

// ===== Krea.ai API típusok =====

/** POST /generate/image/{model} válasz */
export interface KreaJobCreateResponse {
  job_id: string;
}

/** GET /jobs/{job_id} válasz */
export interface KreaJobStatusResponse {
  status: 'processing' | 'completed' | 'failed';
  result?: {
    urls: string[];
  };
  error?: string;
}

// ===== Magyar Varázsló Opciók =====

export const OCCASION_OPTIONS = [
  { value: "Születésnap", label: "🎂 Születésnap" },
  { value: "Karácsony", label: "🎄 Karácsony" },
  { value: "Ballagás", label: "🎓 Ballagás" },
  { value: "Esküvő", label: "💍 Esküvő" },
  { value: "Búcsúztató", label: "👋 Búcsúztató / Utolsó munkanap" },
  { value: "Valentin-nap", label: "❤️ Valentin-nap" },
  { value: "Névnap", label: "🌸 Névnap" },
  { value: "Csapatépítő", label: "🤝 Csapatépítő / Céges" },
  { value: "Egyedi", label: "✨ Egyéb alkalom" },
] as const;

export const STYLE_OPTIONS = [
  {
    value: "Minimalist",
    label: "Minimalista",
    description: "Tiszta, modern vonalak. Kevesebb több.",
    icon: "◻",
  },
  {
    value: "Retro",
    label: "Retró",
    description: "70-es, 80-as évek hangulata, vintage érzés.",
    icon: "📼",
  },
  {
    value: "Streetwear",
    label: "Streetwear",
    description: "Merész, városias, erős kontrasztok.",
    icon: "🔥",
  },
  {
    value: "Cartoon",
    label: "Rajzfilm",
    description: "Vibráló, vastag körvonalak, játékos világ.",
    icon: "🎨",
  },
  {
    value: "Abstract",
    label: "Absztrakt",
    description: "Folyékony formák, modern művészet.",
    icon: "🌊",
  },
  {
    value: "Typography",
    label: "Betűközpontú",
    description: "A szöveg maga az alkotás, karakteres tipográfia.",
    icon: "Aa",
  },
] as const;

export const CONTENT_TYPE_OPTIONS = [
  {
    value: "graphic_text" as const,
    label: "Grafika + Szöveg",
    description: "Egy kép és egy ütős felirat együtt.",
    icon: "🖼️",
  },
  {
    value: "graphic_only" as const,
    label: "Csak Grafika",
    description: "Szöveg nélkül, tisztán vizuális.",
    icon: "🎭",
  },
  {
    value: "text_only" as const,
    label: "Csak Szöveg",
    description: "Nagy, erős betűk, tipográfiai design.",
    icon: "💬",
  },
] as const;

export type OccasionOption = typeof OCCASION_OPTIONS[number]['value'];
export type StyleOption = typeof STYLE_OPTIONS[number]['value'];
export type ContentType = 'text_only' | 'graphic_text' | 'graphic_only';
