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
