import { GoogleGenAI } from "@google/genai";

// A GEMINI_API_KEY-t a .env.local-ból olvassuk, server-side only
// Lusta (lazy) inicializálás a build hiba elkerülése érdekében
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("Missing GEMINI_API_KEY");
    (err as Error & { code?: string }).code = "MISSING_GEMINI_KEY";
    throw err;
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * DTF-nyomtatásra kész prompt összeállítása a megadott paraméterekből.
 * Krea nélkül, saját implementáció.
 */
function buildDtfPrompt(
  alkalom: string,
  stilus: string,
  kinek: string,
  motivum: string,
  contentType: string = "graphic_text"
): string {
  const styleMap: Record<string, string> = {
    minimalist: "minimalist, clean lines, lots of negative space",
    vintage: "vintage retro style, distressed textures, aged look",
    bold: "bold, high contrast, strong graphic elements",
    watercolor: "soft watercolor illustration, painterly style",
    geometric: "geometric shapes, modern abstract design",
    cartoon: "cartoon illustration style, fun and playful",
  };
  const contentMap: Record<string, string> = {
    graphic_text: "typography with graphic elements",
    illustration: "detailed illustration without text",
    pattern: "repeating pattern design",
    logo_style: "logo-style icon design",
  };

  const stylusDesc = styleMap[stilus] ?? stilus;
  const contentDesc = contentMap[contentType] ?? contentType;

  return [
    `Create a DTF (Direct-To-Film) print-ready t-shirt design.`,
    `Occasion: ${alkalom}.`,
    `Recipient: ${kinek}.`,
    `Main motif / theme: ${motivum}.`,
    `Visual style: ${stylusDesc}.`,
    `Design type: ${contentDesc}.`,
    `Requirements: transparent or white background, print-ready, high contrast, suitable for fabric printing.`,
    `The design should be centered, surrounded by plenty of empty space, no border or frame.`,
  ].join(" ");
}

/**
 * Generál egy DTF-nyomtatásra kész design képet szöveg prompt alapján.
 * Nano Banana 2 (Gemini 3.1 Flash Image Preview) modellspecifikus hívással.
 */
export async function generateDesignImage(
  alkalom: string,
  stilus: string,
  kinek: string,
  motivum: string,
  contentType: string = "graphic_text"
): Promise<string> {
  const prompt = buildDtfPrompt(alkalom, stilus, kinek, motivum, contentType);

  console.log("[Gemini] Generating with Nano Banana 2 (gemini-3.1-flash-image-preview)...");

  try {
    const aiClient = getAiClient();
    const response = await aiClient.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    const responseData = response;

    // A válaszból kikeressük az első inline image part-ot
    const parts = responseData.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("Gemini response contained no parts.");
    }

    const imagePart = parts.find(
      (part: { inlineData?: { mimeType?: string; data?: string } }) =>
        part.inlineData && part.inlineData.mimeType?.startsWith("image/")
    );

    if (!imagePart || !imagePart.inlineData?.data) {
      throw new Error("Gemini response contained no image data.");
    }

    // Visszaadjuk a nyers base64 stringet (nem data URI)
    return imagePart.inlineData.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("[Gemini] SDK Error:", error.message);
    } else {
      console.error("[Gemini] SDK Error:", error);
    }
    
    // Check if it's a Gemini error with a response field
    if (typeof error === 'object' && error !== null && 'response' in error) {
      console.error("[Gemini] Response Details:", JSON.stringify((error as { response: unknown }).response, null, 2));
    }
    throw error;
  }
}
