import { NextRequest, NextResponse } from "next/server";
import { composeTemplateSvg, normalizeTemplatePayload } from "@/lib/templates/composer";
import { hasCloudinaryConfig, uploadProcessedSvgAsset, uploadRawSvgAsset } from "@/lib/cloudinary";
import { hasSupabaseConfig, saveGeneration, saveProcessedAsset, saveRawAsset } from "@/lib/supabase";
import type { TemplateId } from "@/data/templateCatalog";

interface ComposeTemplatePayload {
  templateId: TemplateId;
  payload: Record<string, unknown>;
}

interface ComposeTemplateResponse {
  success: boolean;
  designUrl?: string;
  generationId?: string;
  rawAssetId?: string;
  processedAssetId?: string;
  error?: string;
}

const ACTIVE_TEMPLATE_IDS: TemplateId[] = ["vintage_year_badge", "pet_name_emblem", "family_birth_garden"];

function validateTemplatePayload(templateId: TemplateId, payload: Record<string, unknown>): string | null {
  if (templateId === "vintage_year_badge") {
    const year = String(payload.year ?? "").replace(/[^0-9]/g, "");
    const name = String(payload.name ?? "").trim();
    if (year.length !== 4) return "Az evszam pontosan 4 szamjegy legyen.";
    if (name.length < 2) return "A fo felirat legyen legalabb 2 karakter.";
    return null;
  }

  if (templateId === "pet_name_emblem") {
    const name = String(payload.name ?? "").trim();
    const year = String(payload.year ?? "").replace(/[^0-9]/g, "");
    if (name.length < 2) return "A kedvenc neve legyen legalabb 2 karakter.";
    if (year.length !== 4) return "Az evszam pontosan 4 szamjegy legyen.";
    return null;
  }

  const members = Array.isArray(payload.members) ? payload.members : [];
  const validNames = members
    .filter((member) => member && typeof member === "object")
    .map((member) => String((member as { name?: unknown }).name ?? "").trim())
    .filter((name) => name.length >= 2);
  if (validNames.length < 2) return "A Csaladi Viragoskert sablonhoz legalabb 2 ervenyes nevet adj meg.";
  return null;
}

export async function POST(request: NextRequest): Promise<NextResponse<ComposeTemplateResponse>> {
  try {
    const body = (await request.json()) as Partial<ComposeTemplatePayload>;
    const templateId = body.templateId;

    if (!templateId || !ACTIVE_TEMPLATE_IDS.includes(templateId)) {
      return NextResponse.json(
        { success: false, error: "Ismeretlen vagy inaktiv sablon." },
        { status: 400 }
      );
    }

    const rawPayload =
      body.payload && typeof body.payload === "object" ? body.payload : {};
    const validationError = validateTemplatePayload(templateId, rawPayload);
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    }

    const normalizedPayload = normalizeTemplatePayload(templateId, rawPayload);
    const composed = composeTemplateSvg({
      templateId,
      payload: normalizedPayload,
    });

    let designUrl = composed.dataUrl;
    let rawAssetId: string | undefined;
    let processedAssetId: string | undefined;
    let generationId: string | undefined;

    if (hasCloudinaryConfig()) {
      try {
        const rawAsset = await uploadRawSvgAsset(composed.svg);
        const processedAsset = await uploadProcessedSvgAsset(composed.svg);

        designUrl = processedAsset.secureUrl || rawAsset.secureUrl;

        if (hasSupabaseConfig()) {
          rawAssetId =
            (await saveRawAsset({
              cloudinaryPublicId: rawAsset.publicId,
              cloudinaryUrl: rawAsset.secureUrl,
              width: rawAsset.width,
              height: rawAsset.height,
              bytes: rawAsset.bytes,
              format: rawAsset.format,
            })) ?? undefined;

          processedAssetId =
            (await saveProcessedAsset({
              rawAssetId: rawAssetId ?? null,
              cloudinaryPublicId: processedAsset.publicId,
              cloudinaryUrl: processedAsset.secureUrl,
              status: "processed",
            })) ?? undefined;

          generationId =
            (await saveGeneration({
              rawAssetId: rawAssetId ?? null,
              status: processedAssetId ? "processed" : "generated",
              source: "template",
              prompt: JSON.stringify({ templateId, payload: normalizedPayload }),
              motif: templateId,
              style: "template",
              contentType: "graphic_text",
            })) ?? undefined;
        }
      } catch (error) {
        console.error("[API] Template cloud upload failed, fallback to data URI:", error);
      }
    }

    return NextResponse.json({
      success: true,
      designUrl,
      generationId,
      rawAssetId,
      processedAssetId,
    });
  } catch (error) {
    console.error("[API] Template compose error:", error);
    return NextResponse.json(
      { success: false, error: "Varatlan hiba tortent a sablon generalas kozben." },
      { status: 500 }
    );
  }
}
