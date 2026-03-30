import type { KreaJobCreateResponse, KreaJobStatusResponse } from "@/types";

const KREA_BASE_URL = "https://api.krea.ai/v1";
const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 60000;

// Magyar alkalom -> angol DTF prompt
const OCCASION_PROMPTS: Record<string, string> = {
  "Születésnap": "A festive and joyful birthday theme. Include subtle celebratory elements like confetti, a single glowing candle, or colorful streamers seamlessly integrated into the graphic. Bright, vivid, and party-ready colors.",
  "Karácsony": "A cozy, winter holiday theme. Incorporate elements like pine needles, soft warm glowing lights, snowflakes, or wrapped presents. Use a rich palette of deep reds, forest greens, and snowy whites.",
  "Esküvő": "An elegant, romantic, and sophisticated theme. Feature delicate floral arrangements and interlocking rings or soft doves. Use a refined palette of golds, soft pastels, and whites.",
  "Ballagás": "A proud and triumphant academic theme. Include subtle nods to accomplishment such as a graduation cap (mortarboard), a rolled diploma, or laurel wreaths. Bold, successful, and empowering colors.",
  "Búcsúztató": "A warm, heartfelt farewell theme. Convey a sense of journey and new beginnings. Use flight, open roads, or rising sun motifs. Colors: warm oranges, sky blues, hopeful yellows.",
  "Valentin-nap": "A passionate and affectionate theme. Emphasize stylized hearts, cupid arrows, or rose petals. A warm, romantic palette focused on deep crimsons, bright reds, and soft pinks.",
  "Névnap": "A celebratory, flower-inspired theme with a personal touch. Incorporate spring blooms, ribbons, and a festive banner aesthetic. Soft, joyful, and warm pastel palette.",
  "Csapatépítő": "A strong, unified team spirit theme. Use bold geometric shapes, interlocking elements, or abstract figures representing collaboration. Corporate-friendly but energetic palette.",
  "Egyedi": "Focus purely on the Motif and Style without specific occasion constraints.",
};

// contentType -> prompt módosítás
const CONTENT_TYPE_PROMPTS: Record<string, string> = {
  "graphic_text": "The design MUST combine a central graphic illustration with a bold text element (a short phrase, word, or witty slogan). The text and image must be harmoniously integrated into a single composition.",
  "graphic_only": "The design MUST be PURELY VISUAL with absolutely NO text, words, letters, or numbers anywhere in the graphic. Pure illustration only.",
  "text_only": "This is a TYPOGRAPHY-ONLY design. The design MUST consist exclusively of lettering, words, and typographic elements. NO figurative illustrations or clipart. The typography itself IS the artwork — create bold, creative, layered text composition.",
};

const STYLE_PROMPTS: Record<string, string> = {
  "Minimalist": "Ultra-clean, modern minimalist line art or flat shapes. Maximize negative space. Use only 1 to 3 bold, solid colors. Absolutely no clutter; the essence of the subject stripped down to its most elegant and simple geometric or continuous line form.",
  "Retro": "Vintage 70s/80s/90s aesthetic. Use bold, distressed textures, retro sunset stripes, and nostalgic typography layouts. Color palette should be muted but contrasting: mustard yellows, teal, burnt orange, and faded denim blue.",
  "Streetwear": "Edgy, hypebeast urban streetwear style. High-contrast, bold, aggressive graphics. Look for a mix of grunge, glitch effects, or heavy halftone dot patterns. Think modern skater or underground fashion brand graphics.",
  "Cartoon": "Vibrant, thick-outlined vector illustration style similar to classic comic books or 90s animation pop-art. Bright, fully saturated, solid colors with cel-shading (hard edge shadows and highlights). Highly expressive and dynamic.",
  "Abstract": "A modern, non-representational fluid layout. Focus on organic flowing shapes, geometric collisions, and bold splashes of contrasting color. Let the motif be recognizable but deconstructed into artistic strokes and splatters.",
  "Typography": "A typography-centric design where bold, massive lettering dominates the graphic. The words are woven into the shape of the motif. Focus on typographic hierarchy, custom lettering, swashes, and extreme contrast between text and the white background.",
};

/**
 * Összeállítja a DTF-nyomtatásra kész design promptot.
 */
export function buildDtfPrompt(
  alkalom: string,
  stilus: string,
  kinek: string,
  motivum: string,
  contentType: string = "graphic_text"
): string {
  const occasionModifier = OCCASION_PROMPTS[alkalom] || OCCASION_PROMPTS["Egyedi"];
  const styleModifier = STYLE_PROMPTS[stilus] || "";
  const contentTypeModifier = CONTENT_TYPE_PROMPTS[contentType] || CONTENT_TYPE_PROMPTS["graphic_text"];

  return `You are a master graphic designer specializing in Direct-to-Film (DTF) t-shirt printing. Create a single, isolated t-shirt graphic based on the following parameters:

- Target Audience / Recipient: ${kinek}
- Main Subject / Motif: ${motivum}
- Occasion Details: ${occasionModifier}
- Visual Style Details: ${styleModifier}
- Content Structure: ${contentTypeModifier}

CRITICAL DTF PRINTING CONSTRAINTS (YOU MUST STRICTLY FOLLOW THESE):
1. SINGLE GRAPHIC ONLY: Create exactly ONE isolated graphic. DO NOT show multiple versions, DO NOT create a grid, and DO NOT include concept sheets.
2. PURE WHITE BACKGROUND: The background MUST be pure, solid white (#FFFFFF) with no environment, no floor, and no scenery. This is mandatory for automated background removal.
3. VECTOR & FLAT DESIGN: The artwork must look like a crisp vector illustration with flat, bold colors. Minimum line thickness 2pt — absolutely NO hairlines thinner than 2pt, they will not survive DTF printing.
4. NO PLASTIC SHIELD EFFECT: Incorporate negative space within the design so the t-shirt fabric can breathe. Break up large solid blocks of color.
5. STRICT PROHIBITIONS: NO photorealism, NO soft gradients, NO 3D rendering, NO drop shadows, NO glowing effects, and NO blurry edges.
6. OUTLINES: Use clean, sharp edges. Use strong, clearly defined outlines (minimum 2pt) to contain the colors. All text must be at least 14pt equivalent in size.`;
}

/**
 * Generál egy képet a Krea.ai API segítségével.
 */
export async function generateDesignImageViaKrea(
  alkalom: string,
  stilus: string,
  kinek: string,
  motivum: string,
  contentType: string = "graphic_text"
): Promise<string> {
  const token = process.env.KREA_API_TOKEN;
  if (!token) {
    throw new Error("KREA_API_TOKEN is not configured.");
  }

  const modelEndpoint = process.env.KREA_MODEL_ENDPOINT || "google/nano-banana-flash";
  const width = parseInt(process.env.IMAGE_WIDTH || "1024", 10);
  const height = parseInt(process.env.IMAGE_HEIGHT || "1024", 10);
  const steps = parseInt(process.env.IMAGE_STEPS || "28", 10);

  const prompt = buildDtfPrompt(alkalom, stilus, kinek, motivum, contentType);

  // === STEP 1: Job létrehozása ===
  console.log("[Krea] Creating generation job...");
  const createRes = await fetch(
    `${KREA_BASE_URL}/generate/image/${modelEndpoint}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, width, height, steps }),
    }
  );

  if (!createRes.ok) {
    const errorBody = await createRes.text();
    console.error("[Krea] Job creation failed:", createRes.status, errorBody);
    throw new Error(`Krea API error (${createRes.status}): ${errorBody}`);
  }

  const { job_id } = (await createRes.json()) as KreaJobCreateResponse;
  console.log(`[Krea] Job created: ${job_id}`);

  // === STEP 2: Poll-olás completed-ig ===
  const startTime = Date.now();

  while (true) {
    if (Date.now() - startTime > POLL_TIMEOUT_MS) {
      console.error("[Krea] Job timed out after 60s:", job_id);
      throw new Error("Krea generation timed out (60s). Please try again.");
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    console.log("[Krea] Polling job status...");
    const pollRes = await fetch(`${KREA_BASE_URL}/jobs/${job_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!pollRes.ok) {
      const errorBody = await pollRes.text();
      console.error("[Krea] Poll error:", pollRes.status, errorBody);
      throw new Error(`Krea poll error (${pollRes.status}): ${errorBody}`);
    }

    const jobStatus = (await pollRes.json()) as KreaJobStatusResponse;

    if (jobStatus.status === "completed") {
      const imageUrl = jobStatus.result?.urls?.[0];
      if (!imageUrl) {
        throw new Error("Krea job completed but returned no image URL.");
      }
      console.log("[Krea] Generation completed:", imageUrl);
      return imageUrl;
    }

    if (jobStatus.status === "failed") {
      console.error("[Krea] Job failed:", jobStatus.error);
      throw new Error(`Krea generation failed: ${jobStatus.error || "Unknown error"}`);
    }

    // status === "processing" → folytatjuk a poll-olást
  }
}
