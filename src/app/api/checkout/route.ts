import { NextRequest, NextResponse } from "next/server";
import { createOrder, createOrderItems, hasSupabaseConfig } from "@/lib/supabase";
import type { CheckoutResponse } from "@/types";

interface CheckoutItemPayload {
  selectionId?: string | null;
  quantity: number;
  price: number;
}

interface CheckoutPayload {
  items: CheckoutItemPayload[];
  total: number;
  currency?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<CheckoutResponse>> {
  try {
    const body = (await request.json()) as Partial<CheckoutPayload>;
    const items = body.items ?? [];
    const total = body.total ?? 0;

    if (items.length === 0 || total <= 0) {
      return NextResponse.json(
        { success: false, error: "Hiányzó vagy hibás rendelési adatok." },
        { status: 400 }
      );
    }

    if (!hasSupabaseConfig()) {
      return NextResponse.json({ success: true, orderId: null });
    }

    const orderId = await createOrder({
      totalCents: total,
      currency: body.currency ?? "HUF",
    });

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Nem sikerült rendelést létrehozni." },
        { status: 500 }
      );
    }

    const ok = await createOrderItems({
      orderId,
      items: items.map((item) => ({
        selectionId: item.selectionId ?? null,
        quantity: item.quantity,
        priceCents: item.price,
      })),
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Nem sikerült a rendelési tételeket menteni." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("[API] Checkout error:", error);
    return NextResponse.json(
      { success: false, error: "Váratlan hiba történt a checkout során." },
      { status: 500 }
    );
  }
}
