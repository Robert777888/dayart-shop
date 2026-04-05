import { NextRequest, NextResponse } from "next/server";
import { hasCloudinaryConfig, uploadProcessedAsset, uploadRawAsset } from "@/lib/cloudinary";
import { hasSupabaseConfig, saveGeneration, saveProcessedAsset, saveRawAsset } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: "Nem található feltöltött fájl." }, { status: 400 });
    }

    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      return NextResponse.json({ success: false, error: "A fájl túl nagy (max 10MB)." }, { status: 413 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "Csak képfájl tölthető fel." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const canUploadToCloudinary = hasCloudinaryConfig();

    if (!canUploadToCloudinary) {
      return NextResponse.json({ success: false, error: "Cloudinary nincs konfigurálva." }, { status: 500 });
    }

    const rawAsset = await uploadRawAsset(base64);
    const processedResult = await uploadProcessedAsset(base64);
    const designUrl = processedResult.asset.secureUrl || rawAsset.secureUrl;

    let rawAssetId: string | undefined;
    let processedAssetId: string | undefined;
    let generationId: string | undefined;

    const canSaveToSupabase = hasSupabaseConfig();
    if (canSaveToSupabase) {
      rawAssetId = await saveRawAsset({
        cloudinaryPublicId: rawAsset.publicId,
        cloudinaryUrl: rawAsset.secureUrl,
        width: rawAsset.width,
        height: rawAsset.height,
        bytes: rawAsset.bytes,
        format: rawAsset.format,
      }) ?? undefined;

      processedAssetId = await saveProcessedAsset({
        rawAssetId: rawAssetId ?? null,
        cloudinaryPublicId: processedResult.asset.publicId,
        cloudinaryUrl: processedResult.asset.secureUrl,
        status: "processed",
      }) ?? undefined;

      generationId = await saveGeneration({
        rawAssetId: rawAssetId ?? null,
        status: processedAssetId ? "processed" : "generated",
        source: "upload",
      }) ?? undefined;
    }

    return NextResponse.json({
      success: true,
      designUrl,
      generationId,
      rawAssetId,
      processedAssetId,
    });
  } catch (err) {
    console.error("[API] Upload error:", err);
    return NextResponse.json({ success: false, error: "Váratlan hiba történt a feltöltéskor." }, { status: 500 });
  }
}
