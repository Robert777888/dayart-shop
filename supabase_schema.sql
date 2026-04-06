-- AI TEE Webshop - Supabase Schema
-- Futtasd le ezt a Supabase SQL Editor-ban:
-- https://supabase.com/dashboard/project/toqrxqqsudnkvryyausn/sql/new

-- Legacy (deprecated) design table — keep for backward compatibility
create table if not exists designs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  cloudinary_url text not null,
  occasion text,
  style text,
  recipient text,
  motif text
);

-- RLS (Row Level Security) bekapcsolása
alter table designs enable row level security;

-- Mindenki olvashatja a designokat (webshop)
create policy "Public read" on designs
  for select using (true);

-- Csak service role írhat (szerver oldal)
create policy "Service role insert" on designs
  for insert with check (true);

-- New pipeline tables
create table if not exists raw_assets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  cloudinary_public_id text not null,
  cloudinary_url text not null,
  width integer,
  height integer,
  bytes integer,
  format text
);

create table if not exists generations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete set null,
  prompt text,
  source text default 'gemini',
  raw_asset_id uuid references raw_assets(id) on delete set null,
  status text not null default 'generated',
  occasion text,
  style text,
  recipient text,
  motif text,
  content_type text
);

create table if not exists processed_assets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  raw_asset_id uuid references raw_assets(id) on delete set null,
  cloudinary_public_id text not null,
  cloudinary_url text not null,
  status text not null default 'processed'
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  base_sku text,
  color text not null,
  size text not null,
  print_position text default 'center',
  price_cents integer
);

create unique index if not exists product_variants_unique
  on product_variants (base_sku, color, size, print_position);

create table if not exists mockup_assets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  processed_asset_id uuid references processed_assets(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  cloudinary_public_id text not null,
  cloudinary_url text not null
);

create table if not exists design_selections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete set null,
  processed_asset_id uuid references processed_assets(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  mockup_asset_id uuid references mockup_assets(id) on delete set null,
  status text not null default 'selected'
);

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete set null,
  selection_id uuid references design_selections(id) on delete set null,
  quantity integer not null default 1,
  price_cents integer
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete set null,
  selection_id uuid references design_selections(id) on delete set null,
  status text not null default 'ordered',
  total_cents integer,
  currency text default 'HUF'
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  order_id uuid references orders(id) on delete cascade,
  selection_id uuid references design_selections(id) on delete set null,
  quantity integer not null default 1,
  price_cents integer
);

alter table raw_assets enable row level security;
alter table generations enable row level security;
alter table processed_assets enable row level security;
alter table product_variants enable row level security;
alter table mockup_assets enable row level security;
alter table design_selections enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public read for variants + mockups (frontend preview)
create policy "Public read variants" on product_variants
  for select using (true);

create policy "Public read mockups" on mockup_assets
  for select using (true);

-- User-scoped read for personal tables
create policy "Users read own generations" on generations
  for select using (auth.uid() = user_id);

create policy "Users read own selections" on design_selections
  for select using (auth.uid() = user_id);

create policy "Users read own cart items" on cart_items
  for select using (auth.uid() = user_id);

create policy "Users read own orders" on orders
  for select using (auth.uid() = user_id);

create policy "Users read own order items" on order_items
  for select using (true);

-- Service role inserts
create policy "Service role insert raw assets" on raw_assets
  for insert with check (true);

create policy "Service role insert generations" on generations
  for insert with check (true);

create policy "Service role insert processed assets" on processed_assets
  for insert with check (true);

create policy "Service role insert mockup assets" on mockup_assets
  for insert with check (true);

create policy "Service role insert design selections" on design_selections
  for insert with check (true);

create policy "Service role insert cart items" on cart_items
  for insert with check (true);

create policy "Service role insert orders" on orders
  for insert with check (true);

create policy "Service role insert order items" on order_items
  for insert with check (true);

-- Customer + fulfillment admin extension
create table if not exists customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  email text not null,
  full_name text,
  phone text,
  is_admin boolean not null default false
);
alter table customer_profiles add column if not exists is_admin boolean not null default false;

create table if not exists shipping_addresses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  country text,
  zip text,
  city text,
  address_line1 text,
  comment text,
  is_default boolean default false
);

create table if not exists order_fulfillment (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique references orders(id) on delete cascade,
  status text not null default 'new',
  production_status text not null default 'pending',
  internal_note text,
  shipping_carrier text,
  shipping_tracking_code text,
  packed_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text not null,
  payload_json jsonb
);

alter table customer_profiles enable row level security;
alter table shipping_addresses enable row level security;
alter table order_fulfillment enable row level security;
alter table admin_audit_logs enable row level security;

create policy "Service role insert customer profiles" on customer_profiles
  for insert with check (true);
create policy "Service role update customer profiles" on customer_profiles
  for update using (true) with check (true);

create policy "Users read own customer profile" on customer_profiles
  for select using (auth.uid() = id);

create policy "Service role insert shipping addresses" on shipping_addresses
  for insert with check (true);
create policy "Users read own shipping addresses" on shipping_addresses
  for select using (auth.uid() = user_id);

create policy "Service role manage fulfillment" on order_fulfillment
  for all using (true) with check (true);

create policy "Service role insert admin audit logs" on admin_audit_logs
  for insert with check (true);

create or replace view admin_orders_overview as
select
  o.id as order_id,
  o.id::text as order_ref,
  o.created_at,
  o.total_cents,
  o.currency,
  o.status as order_status,
  f.status as fulfillment_status,
  f.production_status,
  f.internal_note,
  f.shipping_tracking_code,
  f.shipping_carrier,
  cp.email,
  cp.full_name,
  cp.phone,
  sa.city,
  sa.address_line1,
  (
    select count(*)::int
    from order_items oi
    where oi.order_id = o.id
  ) as item_count
from orders o
left join order_fulfillment f on f.order_id = o.id
left join customer_profiles cp on cp.id = o.user_id
left join lateral (
  select city, address_line1
  from shipping_addresses s
  where s.user_id = o.user_id
  order by s.created_at desc
  limit 1
) sa on true;
