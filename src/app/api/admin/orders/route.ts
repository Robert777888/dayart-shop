import { NextRequest, NextResponse } from "next/server";
import { hasSupabaseConfig, listAdminOrders } from "@/lib/supabase";
import { authorizeAdminRequest } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json({ success: false, error: "Supabase nincs beallitva." }, { status: 500 });
    }

    const auth = await authorizeAdminRequest(request);
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.reason || "Nincs jogosultsag." }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get("status") || undefined;
    const query = request.nextUrl.searchParams.get("query") || undefined;

    const orders = await listAdminOrders({ status, query, limit: 200 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("[API] admin orders GET error", error);
    return NextResponse.json({ success: false, error: "Varatlan hiba." }, { status: 500 });
  }
}
