import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase kliens (service role key-vel, nem anon key-vel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase: SupabaseClient | null = 
  (supabaseUrl && supabaseServiceKey) 
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

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
