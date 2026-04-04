import { NextRequest, NextResponse } from "next/server";
import { createCartItem, hasSupabaseConfig } from "@/lib/supabase";
import type { CartResponse } from "@/types";

interface CartPayload {
  selectionId?: string | null;
  quantity: number;
  price: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<CartResponse>> {
  try {
    const body = (await request.json()) as Partial<CartPayload>;
    const quantity = body.quantity ?? 1;

    if (!body.price || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Hiányzó vagy hibás kosár adatok." },
        { status: 400 }
      );
    }

    if (!hasSupabaseConfig()) {
      return NextResponse.json({ success: true, cartItemId: null });
    }

    const cartItemId = await createCartItem({
      selectionId: body.selectionId ?? null,
      quantity,
      priceCents: body.price,
    });

    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: "Nem sikerült kosár tételt menteni." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, cartItemId });
  } catch (error) {
    console.error("[API] Cart error:", error);
    return NextResponse.json(
      { success: false, error: "Váratlan hiba történt a kosárnál." },
      { status: 500 }
    );
  }
}
