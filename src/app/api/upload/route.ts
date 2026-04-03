import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, uploadWithBackgroundRemoval } from "@/lib/cloudinary";

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

    const canUploadToCloudinary =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (!canUploadToCloudinary) {
      return NextResponse.json({ success: false, error: "Cloudinary nincs konfigurálva." }, { status: 500 });
    }

    let designUrl: string;

    try {
      designUrl = await uploadWithBackgroundRemoval(base64);
    } catch (err) {
      console.error("[API] Cloudinary bg removal failed, falling back:", err);
      designUrl = await uploadToCloudinary(base64);
    }

    return NextResponse.json({ success: true, designUrl });
  } catch (err) {
    console.error("[API] Upload error:", err);
    return NextResponse.json({ success: false, error: "Váratlan hiba történt a feltöltéskor." }, { status: 500 });
  }
}
