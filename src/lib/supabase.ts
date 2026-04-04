import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

const hasSupabaseConfig = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export const getSupabase = (): SupabaseClient | null => {
  if (!hasSupabaseConfig()) {
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return supabaseClient;
};

/**
 * Elmenti a generált design adatait a `designs` táblába.
 *
 * @returns Az újonnan beszúrt sor `id`-ja (UUID string), vagy null ha hiba történt.
 *
 * FONTOS: Ez a függvény NEM dob hibát! Ha a DB írás sikertelen,
 * loggolja a hibát szerver oldalon és null-t ad vissza.
 * Ez azért van, mert a Supabase hiba NEM kell, hogy blokkolja a user UX-et.
 */
export async function saveDesign(params: {
  cloudinaryUrl: string;
  occasion: string;
  style: string;
  recipient: string;
  motif: string;
}): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping save.");
    return null;
  }

  const { data, error } = await supabase
    .from("designs")
    .insert({
      cloudinary_url: params.cloudinaryUrl,
      occasion: params.occasion,
      style: params.style,
      recipient: params.recipient,
      motif: params.motif,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Failed to save design:", error.message);
    return null;
  }

  return data.id;
}

export async function saveRawAsset(params: {
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
}): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping raw asset save.");
    return null;
  }

  const { data, error } = await supabase
    .from("raw_assets")
    .insert({
      cloudinary_public_id: params.cloudinaryPublicId,
      cloudinary_url: params.cloudinaryUrl,
      width: params.width ?? null,
      height: params.height ?? null,
      bytes: params.bytes ?? null,
      format: params.format ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Failed to save raw asset:", error.message);
    return null;
  }

  return data.id;
}

export async function saveProcessedAsset(params: {
  rawAssetId: string | null;
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
  status: "processed" | "fallback";
}): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping processed asset save.");
    return null;
  }

  const { data, error } = await supabase
    .from("processed_assets")
    .insert({
      raw_asset_id: params.rawAssetId,
      cloudinary_public_id: params.cloudinaryPublicId,
      cloudinary_url: params.cloudinaryUrl,
      status: params.status,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Failed to save processed asset:", error.message);
    return null;
  }

  return data.id;
}

export async function saveGeneration(params: {
  userId?: string | null;
  rawAssetId: string | null;
  status: "generated" | "processed";
  prompt?: string | null;
  source?: string;
  occasion?: string;
  style?: string;
  recipient?: string;
  motif?: string;
  contentType?: string;
}): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping generation save.");
    return null;
  }

  const { data, error } = await supabase
    .from("generations")
    .insert({
      user_id: params.userId ?? null,
      raw_asset_id: params.rawAssetId,
      status: params.status,
      prompt: params.prompt ?? null,
      source: params.source ?? "gemini",
      occasion: params.occasion ?? null,
      style: params.style ?? null,
      recipient: params.recipient ?? null,
      motif: params.motif ?? null,
      content_type: params.contentType ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Failed to save generation:", error.message);
    return null;
  }

  return data.id;
}

export { hasSupabaseConfig };
