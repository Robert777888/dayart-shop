import { NextRequest, NextResponse } from "next/server";
import { generateDesignImage } from "@/lib/gemini";
import { uploadWithBackgroundRemoval } from "@/lib/cloudinary";
import { saveDesign } from "@/lib/supabase";
import type { GeneratePayload, GenerateResponse } from "@/types";

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    // ── Step 1: Parse & Validate ──────────────────────────────
    const body = (await request.json()) as Partial<GeneratePayload>;
    const { occasion, recipient, motif, style, contentType } = body;

    console.log("[API] Generate Request:", { occasion, recipient, motif, style, contentType });

    if (
      !occasion || occasion.trim() === "" ||
      !recipient || recipient.trim() === "" ||
      !motif || motif.trim() === "" ||
      !style || style.trim() === "" ||
      !contentType
    ) {
      return NextResponse.json(
        { success: false, error: "Minden mezőt ki kell tölteni." },
        { status: 400 }
      );
    }

    const safeContentType = contentType || "graphic_text";

    // ── Step 2: Image Generation (Gemini) ────────────────────
    let imageBase64: string;
    try {
      console.log("[API] Step 2: Calling Gemini...");
      imageBase64 = await generateDesignImage(occasion, style, recipient, motif, safeContentType);
    } catch (err) {
      console.error("[API] Gemini failed:", err);
      const error = err instanceof Error ? err : new Error("Unknown Gemini error");
      const code = (error as Error & { code?: string }).code;
      if (code === "MISSING_GEMINI_KEY") {
        return NextResponse.json(
          { success: false, error: "Hiányzó Gemini API kulcs. Állítsd be a GEMINI_API_KEY változót a szerveren." },
          { status: 500 }
        );
      }
      if (error.message.includes("reported as leaked")) {
        return NextResponse.json(
          { success: false, error: "A Gemini API kulcs kompromittáltnak lett jelölve. Rotáld a kulcsot a Google Cloud konzolban, majd frissítsd a szerveren." },
          { status: 403 }
        );
      }
      if (error.message.includes("API key expired") || error.message.includes("API_KEY_INVALID")) {
        return NextResponse.json(
          { success: false, error: "A Gemini API kulcs lejárt vagy érvénytelen. Hozz létre egy új kulcsot, és frissítsd a szerveren." },
          { status: 403 }
        );
      }
      const isDev = process.env.NODE_ENV !== "production";
      return NextResponse.json(
        {
          success: false,
          error: isDev
            ? `Gemini hiba: ${error.message}`
            : "A tervező szerverünk jelenleg túlterhelt. Kérlek, próbáld meg újra pár pillanat múlva!",
        },
        { status: 502 }
      );
    }

    // ── Step 3: Cloudinary feltöltés ─────────────────────────
    const canUploadToCloudinary =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    let designUrl: string;

    if (canUploadToCloudinary) {
      console.log("[API] Step 3: Uploading to Cloudinary...");
      try {
        designUrl = await uploadWithBackgroundRemoval(imageBase64);
      } catch (err) {
        console.error("[API] Cloudinary error, using base64 fallback:", err);
        designUrl = `data:image/png;base64,${imageBase64}`;
      }
    } else {
      console.log("[API] Step 3: Cloudinary keys missing, using base64 fallback.");
      designUrl = `data:image/png;base64,${imageBase64}`;
    }

    // ── Step 4: Supabase mentés (silent fail) ────────────────
    const canSaveToSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    let designId: string | undefined = undefined;

    if (canSaveToSupabase) {
      console.log("[API] Step 4: Saving to Supabase...");
      const savedId = await saveDesign({
        cloudinaryUrl: designUrl,
        occasion,
        style,
        recipient,
        motif,
      });
      designId = savedId ?? undefined;
    }

    // ── Step 5: Válasz ────────────────────────────────────────
    console.log("[API] SUCCESS — designUrl length:", designUrl.length);

    return NextResponse.json({
      success: true,
      designUrl,
      designId,
      provider: "gemini",
    });

  } catch (err) {
    console.error("[API] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Váratlan hiba történt. Kérjük, próbáld újra!" },
      { status: 500 }
    );
  }
}
