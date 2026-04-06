import { NextRequest, NextResponse } from "next/server";
import { getSupabase, getCustomerProfile, hasSupabaseConfig, upsertCustomerProfile } from "@/lib/supabase";

interface CustomerProfileResponse {
  success: boolean;
  profile?: {
    email: string;
    fullName: string;
    phone: string;
  };
  error?: string;
}

const parseBearer = (req: NextRequest): string | null => {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const [type, token] = auth.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

const verifyUser = async (token: string): Promise<{ id: string; email: string } | null> => {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.id || !data.user.email) return null;
  return { id: data.user.id, email: data.user.email };
};

export async function GET(request: NextRequest): Promise<NextResponse<CustomerProfileResponse>> {
  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json({ success: false, error: "Supabase nincs beallitva." }, { status: 500 });
    }

    const token = parseBearer(request);
    if (!token) {
      return NextResponse.json({ success: false, error: "Hianyzik a token." }, { status: 401 });
    }

    const user = await verifyUser(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Ervenytelen token." }, { status: 401 });
    }

    const existing = await getCustomerProfile(user.id);
    return NextResponse.json({
      success: true,
      profile: {
        email: existing?.email ?? user.email,
        fullName: existing?.fullName ?? "",
        phone: existing?.phone ?? "",
      },
    });
  } catch (error) {
    console.error("[API] customer profile GET error", error);
    return NextResponse.json({ success: false, error: "Varatlan hiba." }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<CustomerProfileResponse>> {
  try {
    if (!hasSupabaseConfig()) {
      return NextResponse.json({ success: false, error: "Supabase nincs beallitva." }, { status: 500 });
    }

    const token = parseBearer(request);
    if (!token) {
      return NextResponse.json({ success: false, error: "Hianyzik a token." }, { status: 401 });
    }

    const user = await verifyUser(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Ervenytelen token." }, { status: 401 });
    }

    const body = (await request.json()) as Partial<{ email: string; fullName: string; phone: string }>;
    const email = String(body.email || user.email).trim();
    const fullName = String(body.fullName || "").trim();
    const phone = String(body.phone || "").trim();

    const ok = await upsertCustomerProfile({
      userId: user.id,
      email,
      fullName,
      phone,
    });

    if (!ok) {
      return NextResponse.json({ success: false, error: "Profil mentes sikertelen." }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: { email, fullName, phone } });
  } catch (error) {
    console.error("[API] customer profile POST error", error);
    return NextResponse.json({ success: false, error: "Varatlan hiba." }, { status: 500 });
  }
}
