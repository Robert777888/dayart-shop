-- AI TEE Webshop - Supabase Schema
-- Futtasd le ezt a Supabase SQL Editor-ban:
-- https://supabase.com/dashboard/project/toqrxqqsudnkvryyausn/sql/new

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
