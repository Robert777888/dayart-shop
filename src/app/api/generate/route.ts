import { NextRequest, NextResponse } from "next/server";
import { generateDesignImage } from "@/lib/gemini";
import { generateDesignImageViaKrea } from "@/lib/krea";
import { uploadWithBackgroundRemoval, uploadFromUrl } from "@/lib/cloudinary";
import { saveDesign } from "@/lib/supabase";
import type { GeneratePayload, GenerateResponse } from "@/types";

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    // ── Step 1: Parse & Validate ──────────────────────────────
    const body = (await request.json()) as Partial<GeneratePayload>;
    const { occasion, recipient, motif, style, contentType } = body;

    console.group(`[API] Generate Request: ${motif} (${style})`);
    console.log("[API] Params:", { occasion, recipient, motif, style, contentType });

    // Validáció
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

    // ── Step 2: Image Generation (Krea primary, Gemini fallback) ──
    const kreaToken = process.env.KREA_API_TOKEN;
    let imageResult: { type: 'url' | 'base64'; data: string; provider: 'krea' | 'gemini' };

    try {
      if (kreaToken) {
        console.log("[API] Step 2: Calling Krea.ai (Nano Banana Flash)...");
        try {
          const imageUrl = await generateDesignImageViaKrea(occasion, style, recipient, motif, safeContentType);
          imageResult = { type: 'url', data: imageUrl, provider: 'krea' };
        } catch (err) {
          console.warn("[API] Krea failed, falling back to Gemini:", err instanceof Error ? err.message : err);
          const base64Image = await generateDesignImage(occasion, style, recipient, motif, safeContentType);
          imageResult = { type: 'base64', data: base64Image, provider: 'gemini' };
        }
      } else {
        console.log("[API] Step 2: KREA_API_TOKEN not set, using Gemini...");
        const base64Image = await generateDesignImage(occasion, style, recipient, motif, safeContentType);
        imageResult = { type: 'base64', data: base64Image, provider: 'gemini' };
      }
    } catch (err) {
      console.error("[API] All AI providers failed:", err);
      return NextResponse.json(
        { success: false, error: "A tervező szerverünk jelenleg túlterhelt. Kérlek, próbáld meg újra pár pillanat múlva!" },
        { status: 502 }
      );
    }

    // ── Step 3: Cloudinary — feltöltés + BG removal ───────────
    const canUploadToCloudinary = 
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET;

    let designUrl: string;

    if (canUploadToCloudinary) {
      console.log("[API] Step 3: Uploading to Cloudinary...");
      try {
        if (imageResult.type === 'url') {
          designUrl = await uploadFromUrl(imageResult.data);
        } else {
          designUrl = await uploadWithBackgroundRemoval(imageResult.data);
        }
      } catch (err) {
        console.error("[API] Cloudinary error:", err);
        designUrl = imageResult.type === 'url'
          ? imageResult.data
          : `data:image/png;base64,${imageResult.data}`;
      }
    } else {
      console.log("[API] Step 3: Cloudinary keys missing, using LOCAL FALLBACK.");
      designUrl = imageResult.type === 'url'
        ? imageResult.data
        : `data:image/png;base64,${imageResult.data}`;
    }

    // ── Step 4: Supabase — mentés (silent fail) ───────────────
    const canSaveToSupabase = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    let designId: string | undefined = undefined;

    if (canSaveToSupabase && canUploadToCloudinary) {
      console.log("[API] Step 4: Saving to Supabase...");
      const savedId = await saveDesign({
        cloudinaryUrl: designUrl,
        occasion,
        style,
        recipient,
        motif,
      });
      designId = savedId ?? undefined;
    } else {
      console.log("[API] Step 4: Supabase keys missing or Local Fallback active, skipping DB save.");
    }

    // ── Step 5: Válasz a frontendnek ──────────────────────────
    console.log(`[API] SUCCESS: Provider=${imageResult.provider}, URL=${designUrl}`);
    console.groupEnd();
    
    return NextResponse.json({
      success: true,
      designUrl,
      designId: designId ?? undefined,
      provider: imageResult.provider,
    });

  } catch (err) {
    console.error("[API] Unexpected error:", err);
    console.groupEnd();
    return NextResponse.json(
      { success: false, error: "Váratlan hiba történt. Kérjük, próbáld újra!" },
      { status: 500 }
    );
  }
}
