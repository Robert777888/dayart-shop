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
  generationId?: string;
  rawAssetId?: string;
  processedAssetId?: string;
  provider?: 'gemini';
  error?: string;
}

export interface SelectionResponse {
  success: boolean;
  selectionId?: string | null;
  variantId?: string | null;
  error?: string;
}

export interface CartResponse {
  success: boolean;
  cartItemId?: string | null;
  error?: string;
}

export interface CheckoutResponse {
  success: boolean;
  orderId?: string | null;
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
    value: "minimalist",
    label: "Minimalista",
    description: "Tiszta, modern vonalak. Kevesebb több.",
    icon: "◻",
  },
  {
    value: "retro",
    label: "Retró",
    description: "70-es, 80-as évek hangulata, vintage érzés.",
    icon: "📼",
  },
  {
    value: "streetwear",
    label: "Streetwear",
    description: "Merész, városias, erős kontrasztok.",
    icon: "🔥",
  },
  {
    value: "cartoon",
    label: "Rajzfilm",
    description: "Vibráló, vastag körvonalak, játékos világ.",
    icon: "🎨",
  },
  {
    value: "abstract",
    label: "Absztrakt",
    description: "Folyékony formák, modern művészet.",
    icon: "🌊",
  },
  {
    value: "typography",
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
