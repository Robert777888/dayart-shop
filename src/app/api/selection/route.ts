import { NextRequest, NextResponse } from "next/server";
import { createSelection, hasSupabaseConfig, upsertProductVariant } from "@/lib/supabase";
import type { SelectionResponse } from "@/types";

interface SelectionPayload {
  processedAssetId: string;
  product: {
    baseSku: string;
    color: string;
    size: string;
    price: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<SelectionResponse>> {
  try {
    const body = (await request.json()) as Partial<SelectionPayload>;
    const { processedAssetId, product } = body;

    if (!processedAssetId || !product?.baseSku || !product?.color || !product?.size) {
      return NextResponse.json(
        { success: false, error: "Hiányzó adatok a kiválasztáshoz." },
        { status: 400 }
      );
    }

    if (!hasSupabaseConfig()) {
      return NextResponse.json({ success: true, selectionId: null, variantId: null });
    }

    const variantId = await upsertProductVariant({
      baseSku: product.baseSku,
      color: product.color,
      size: product.size,
      printPosition: "center",
      priceCents: product.price,
    });

    if (!variantId) {
      return NextResponse.json(
        { success: false, error: "Nem sikerült a termék variáns mentése." },
        { status: 500 }
      );
    }

    const selectionId = await createSelection({
      processedAssetId,
      variantId,
    });

    if (!selectionId) {
      return NextResponse.json(
        { success: false, error: "Nem sikerült a design kiválasztás mentése." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, selectionId, variantId });
  } catch (error) {
    console.error("[API] Selection error:", error);
    return NextResponse.json(
      { success: false, error: "Váratlan hiba történt a kiválasztásnál." },
      { status: 500 }
    );
  }
}
