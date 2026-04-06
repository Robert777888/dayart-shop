import type { NextRequest } from "next/server";
import { getSupabase, isAdminUser } from "@/lib/supabase";

export interface AdminAuthResult {
  ok: boolean;
  actorUserId: string | null;
  reason?: string;
}

const parseBearer = (request: NextRequest): string | null => {
  const auth = request.headers.get("authorization");
  if (!auth) return null;
  const [type, token] = auth.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

export async function authorizeAdminRequest(request: NextRequest): Promise<AdminAuthResult> {
  const adminKeyHeader = request.headers.get("x-admin-key");
  const expectedAdminKey = process.env.ADMIN_PANEL_KEY;

  if (expectedAdminKey && adminKeyHeader && adminKeyHeader === expectedAdminKey) {
    return { ok: true, actorUserId: null };
  }

  const token = parseBearer(request);
  if (!token) {
    return { ok: false, actorUserId: null, reason: "Nincs admin token vagy kulcs." };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, actorUserId: null, reason: "Supabase nincs beallitva." };
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.id) {
    return { ok: false, actorUserId: null, reason: "Ervenytelen felhasznaloi token." };
  }

  const isAdmin = await isAdminUser(data.user.id);
  if (!isAdmin) {
    return { ok: false, actorUserId: data.user.id, reason: "A felhasznalo nem admin jogosultsagu." };
  }

  return { ok: true, actorUserId: data.user.id };
}
