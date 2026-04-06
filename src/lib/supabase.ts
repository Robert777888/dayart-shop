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

export async function getProcessedAssetById(id: string): Promise<{
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
} | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping processed asset lookup.");
    return null;
  }

  const { data, error } = await supabase
    .from("processed_assets")
    .select("cloudinary_public_id, cloudinary_url")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("[Supabase] Failed to fetch processed asset:", error?.message);
    return null;
  }

  return {
    cloudinaryPublicId: data.cloudinary_public_id,
    cloudinaryUrl: data.cloudinary_url,
  };
}

export async function saveMockupAsset(params: {
  processedAssetId: string;
  variantId: string | null;
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
}): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping mockup save.");
    return null;
  }

  const { data, error } = await supabase
    .from("mockup_assets")
    .insert({
      processed_asset_id: params.processedAssetId,
      variant_id: params.variantId,
      cloudinary_public_id: params.cloudinaryPublicId,
      cloudinary_url: params.cloudinaryUrl,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Failed to save mockup asset:", error.message);
    return null;
  }

  return data.id;
}

export interface CustomerProfileInput {
  userId: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
}

export async function upsertCustomerProfile(params: CustomerProfileInput): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping customer profile upsert.");
    return false;
  }

  const { error } = await supabase.from("customer_profiles").upsert(
    {
      id: params.userId,
      email: params.email,
      full_name: params.fullName ?? null,
      phone: params.phone ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("[Supabase] Failed to upsert customer profile:", error.message);
    return false;
  }

  return true;
}

export async function getCustomerProfile(userId: string): Promise<{
  email: string;
  fullName: string | null;
  phone: string | null;
} | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("customer_profiles")
    .select("email, full_name, phone")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[Supabase] Failed to get customer profile:", error.message);
    return null;
  }

  if (!data) return null;

  return {
    email: data.email,
    fullName: data.full_name,
    phone: data.phone,
  };
}

export interface ShippingAddressInput {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  zip: string;
  city: string;
  addressLine1: string;
  comment?: string | null;
}

export async function saveShippingAddress(params: ShippingAddressInput): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping shipping address save.");
    return null;
  }

  const { data, error } = await supabase
    .from("shipping_addresses")
    .insert({
      user_id: params.userId,
      first_name: params.firstName,
      last_name: params.lastName,
      email: params.email,
      phone: params.phone,
      country: params.country,
      zip: params.zip,
      city: params.city,
      address_line1: params.addressLine1,
      comment: params.comment ?? null,
      is_default: true,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Failed to save shipping address:", error.message);
    return null;
  }

  return data.id;
}

export async function attachOrderFulfillment(orderId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Client not initialized. Skipping fulfillment attach.");
    return false;
  }

  const { error } = await supabase
    .from("order_fulfillment")
    .upsert(
      {
        order_id: orderId,
        status: "new",
        production_status: "pending",
      },
      { onConflict: "order_id" }
    );

  if (error) {
    console.error("[Supabase] Failed to attach fulfillment:", error.message);
    return false;
  }

  return true;
}

export async function listAdminOrders(params?: {
  status?: string;
  query?: string;
  limit?: number;
}): Promise<Array<Record<string, unknown>>> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const limit = params?.limit ?? 100;
  let q = supabase
    .from("admin_orders_overview")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (params?.status) {
    q = q.eq("fulfillment_status", params.status);
  }

  if (params?.query) {
    q = q.or(
      `order_ref.ilike.%${params.query}%,email.ilike.%${params.query}%,full_name.ilike.%${params.query}%,phone.ilike.%${params.query}%`
    );
  }

  const { data, error } = await q;
  if (error) {
    console.error("[Supabase] Failed to list admin orders:", error.message);
    return [];
  }
  return data ?? [];
}

export async function updateOrderFulfillment(params: {
  orderId: string;
  status: string;
  productionStatus?: string | null;
  internalNote?: string | null;
  shippingCarrier?: string | null;
  shippingTrackingCode?: string | null;
}): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    order_id: params.orderId,
    status: params.status,
    production_status: params.productionStatus ?? "pending",
    internal_note: params.internalNote ?? null,
    shipping_carrier: params.shippingCarrier ?? null,
    shipping_tracking_code: params.shippingTrackingCode ?? null,
    updated_at: now,
  };

  if (params.status === "shipped") {
    payload.shipped_at = now;
  }

  const { error } = await supabase
    .from("order_fulfillment")
    .upsert(payload, { onConflict: "order_id" });

  if (error) {
    console.error("[Supabase] Failed to update fulfillment:", error.message);
    return false;
  }

  return true;
}

export async function isAdminUser(userId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("customer_profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("[Supabase] Failed to check admin role:", error.message);
    return false;
  }

  return Boolean(data?.is_admin);
}

export async function insertAdminAuditLog(params: {
  actorUserId: string | null;
  action: string;
  targetType: string;
  targetId: string;
  payload?: Record<string, unknown> | null;
}): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase.from("admin_audit_logs").insert({
    actor_user_id: params.actorUserId,
    action: params.action,
    target_type: params.targetType,
    target_id: params.targetId,
    payload_json: params.payload ?? null,
  });

  if (error) {
    console.error("[Supabase] Failed to insert admin audit log:", error.message);
    return false;
  }

  return true;
}
