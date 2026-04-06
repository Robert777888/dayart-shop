import { NextRequest, NextResponse } from "next/server";
import { hasSupabaseConfig, insertAdminAuditLog, updateOrderFulfillment } from "@/lib/supabase";
import { authorizeAdminRequest } from "@/lib/adminAuth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json({ success: false, error: "Supabase nincs beallitva." }, { status: 500 });
    }

    const auth = await authorizeAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.reason || "Nincs jogosultsag." }, { status: 401 });
    }

    const body = (await request.json()) as Partial<{
      status: string;
      productionStatus: string;
      internalNote: string;
      shippingCarrier: string;
      shippingTrackingCode: string;
    }>;

    const status = String(body.status || "").trim();
    if (!status) {
      return NextResponse.json({ success: false, error: "Statusz kotelezo." }, { status: 400 });
    }

    const ok = await updateOrderFulfillment({
      orderId: params.orderId,
      status,
      productionStatus: body.productionStatus ?? null,
      internalNote: body.internalNote ?? null,
      shippingCarrier: body.shippingCarrier ?? null,
      shippingTrackingCode: body.shippingTrackingCode ?? null,
    });

    if (!ok) {
      return NextResponse.json({ success: false, error: "Statusz mentes sikertelen." }, { status: 500 });
    }

    await insertAdminAuditLog({
      actorUserId: auth.actorUserId,
      action: "order_fulfillment_update",
      targetType: "order",
      targetId: params.orderId,
      payload: {
        status,
        productionStatus: body.productionStatus ?? null,
        internalNote: body.internalNote ?? null,
        shippingCarrier: body.shippingCarrier ?? null,
        shippingTrackingCode: body.shippingTrackingCode ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] admin orders PATCH error", error);
    return NextResponse.json({ success: false, error: "Varatlan hiba." }, { status: 500 });
  }
}
