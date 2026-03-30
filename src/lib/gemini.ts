import { GoogleGenAI } from "@google/genai";
import { buildDtfPrompt } from "@/lib/krea";

// A GEMINI_API_KEY-t a .env.local-ból olvassuk, server-side only
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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
    const response = await ai.models.generateContent({
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
