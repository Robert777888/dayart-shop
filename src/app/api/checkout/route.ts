import { NextRequest, NextResponse } from "next/server";
import {
  attachOrderFulfillment,
  createOrder,
  createOrderItems,
  getSupabase,
  hasSupabaseConfig,
  saveShippingAddress,
  upsertCustomerProfile,
} from "@/lib/supabase";
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
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    zip: string;
    city: string;
    address: string;
    comment?: string;
  };
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

    let userId: string | null = null;
    let userEmail: string | null = null;
    const authHeader = request.headers.get("authorization");
    const token =
      authHeader && authHeader.toLowerCase().startsWith("bearer ")
        ? authHeader.slice(7).trim()
        : null;

    if (token) {
      const supabase = getSupabase();
      if (supabase) {
        const { data } = await supabase.auth.getUser(token);
        if (data.user?.id) {
          userId = data.user.id;
          userEmail = data.user.email ?? null;
        }
      }
    }

    const orderId = await createOrder({
      userId,
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

    await attachOrderFulfillment(orderId);

    if (userId && body.customer) {
      await upsertCustomerProfile({
        userId,
        email: body.customer.email || userEmail || "",
        fullName: `${body.customer.firstName} ${body.customer.lastName}`.trim(),
        phone: body.customer.phone,
      });

      await saveShippingAddress({
        userId,
        firstName: body.customer.firstName,
        lastName: body.customer.lastName,
        email: body.customer.email || userEmail || "",
        phone: body.customer.phone,
        country: body.customer.country,
        zip: body.customer.zip,
        city: body.customer.city,
        addressLine1: body.customer.address,
        comment: body.customer.comment ?? null,
      });
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
