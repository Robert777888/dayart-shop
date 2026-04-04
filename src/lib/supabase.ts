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

export async function upsertProductVariant(params: {
  baseSku: string;
  color: string;
  size: string;
  printPosition?: string;
  priceCents?: number | null;
}): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping product variant upsert.");
    return null;
  }

  const { data, error } = await supabase
    .from("product_variants")
    .upsert(
      {
        base_sku: params.baseSku,
        color: params.color,
        size: params.size,
        print_position: params.printPosition ?? "center",
        price_cents: params.priceCents ?? null,
      },
      { onConflict: "base_sku,color,size,print_position" }
    )
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Failed to upsert product variant:", error.message);
    return null;
  }

  return data.id;
}

export async function createSelection(params: {
  userId?: string | null;
  processedAssetId: string;
  variantId: string;
  mockupAssetId?: string | null;
}): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping selection creation.");
    return null;
  }

  const { data, error } = await supabase
    .from("design_selections")
    .insert({
      user_id: params.userId ?? null,
      processed_asset_id: params.processedAssetId,
      variant_id: params.variantId,
      mockup_asset_id: params.mockupAssetId ?? null,
      status: "selected",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Failed to create selection:", error.message);
    return null;
  }

  return data.id;
}

export async function createCartItem(params: {
  userId?: string | null;
  selectionId: string | null;
  quantity: number;
  priceCents?: number | null;
}): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping cart item creation.");
    return null;
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      user_id: params.userId ?? null,
      selection_id: params.selectionId ?? null,
      quantity: params.quantity,
      price_cents: params.priceCents ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Failed to create cart item:", error.message);
    return null;
  }

  return data.id;
}

export async function createOrder(params: {
  userId?: string | null;
  totalCents: number;
  currency?: string;
}): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping order creation.");
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: params.userId ?? null,
      status: "ordered",
      total_cents: params.totalCents,
      currency: params.currency ?? "HUF",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Failed to create order:", error.message);
    return null;
  }

  return data.id;
}

export async function createOrderItems(params: {
  orderId: string;
  items: Array<{
    selectionId: string | null;
    quantity: number;
    priceCents?: number | null;
  }>;
}): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping order items creation.");
    return false;
  }

  const payload = params.items.map((item) => ({
    order_id: params.orderId,
    selection_id: item.selectionId ?? null,
    quantity: item.quantity,
    price_cents: item.priceCents ?? null,
  }));

  const { error } = await supabase.from("order_items").insert(payload);
  if (error) {
    console.error("[Supabase] Failed to create order items:", error.message);
    return false;
  }

  return true;
}
