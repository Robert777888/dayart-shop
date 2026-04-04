import { NextRequest, NextResponse } from "next/server";
import { buildMockupUrl, hasCloudinaryConfig } from "@/lib/cloudinary";
import {
  getProcessedAssetById,
  hasSupabaseConfig,
  saveMockupAsset,
  upsertProductVariant,
} from "@/lib/supabase";
import type { MockupResponse } from "@/types";

interface MockupPayload {
  processedAssetId: string;
  product: {
    baseSku: string;
    color: string;
    size: string;
    price: number;
  };
  productType: "tshirt" | "sweatshirt";
  productColor: "black" | "white";
}

const mockupBaseMap = {
  tshirt: {
    black: process.env.CLOUDINARY_MOCKUP_TSHIRT_BLACK_PUBLIC_ID,
    white: process.env.CLOUDINARY_MOCKUP_TSHIRT_WHITE_PUBLIC_ID,
  },
  sweatshirt: {
    black: process.env.CLOUDINARY_MOCKUP_SWEATSHIRT_BLACK_PUBLIC_ID,
    white: process.env.CLOUDINARY_MOCKUP_SWEATSHIRT_WHITE_PUBLIC_ID,
  },
} as const;

export async function POST(request: NextRequest): Promise<NextResponse<MockupResponse>> {
  try {
    const body = (await request.json()) as Partial<MockupPayload>;
    const { processedAssetId, productType, productColor, product } = body;

    if (!processedAssetId || !productType || !productColor || !product?.baseSku) {
      return NextResponse.json(
        { success: false, error: "Hiányzó adatok a mockup generáláshoz." },
        { status: 400 }
      );
    }

    const basePublicId = mockupBaseMap[productType][productColor];
    if (!basePublicId) {
      return NextResponse.json({ success: true, mockupUrl: null, mockupAssetId: null });
    }

    if (!hasCloudinaryConfig()) {
      return NextResponse.json({ success: true, mockupUrl: null, mockupAssetId: null });
    }

    const processedAsset = hasSupabaseConfig()
      ? await getProcessedAssetById(processedAssetId)
      : null;

    if (!processedAsset) {
      return NextResponse.json(
        { success: false, error: "Nem található feldolgozott asset a mockuphoz." },
        { status: 404 }
      );
    }

    const mockupUrl = buildMockupUrl({
      basePublicId,
      overlayPublicId: processedAsset.cloudinaryPublicId,
    });

    let mockupAssetId: string | null = null;
    if (hasSupabaseConfig()) {
      const variantId = await upsertProductVariant({
        baseSku: product.baseSku,
        color: product.color,
        size: product.size,
        printPosition: "center",
        priceCents: product.price,
      });

      mockupAssetId = await saveMockupAsset({
        processedAssetId,
        variantId: variantId ?? null,
        cloudinaryPublicId: basePublicId,
        cloudinaryUrl: mockupUrl,
      });
    }

    return NextResponse.json({ success: true, mockupUrl, mockupAssetId });
  } catch (error) {
    console.error("[API] Mockup error:", error);
    return NextResponse.json(
      { success: false, error: "Váratlan hiba történt a mockup készítéskor." },
      { status: 500 }
    );
  }
}
