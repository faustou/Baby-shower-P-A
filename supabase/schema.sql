-- ============================================================
-- Baby Shower — Revelación de Género
-- Schema completo para Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension (ya activo en Supabase por defecto)
-- create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────────────────
-- Table: confirmations
-- ──────────────────────────────────────────────────────────────
create table if not exists confirmations (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  guests_count integer not null default 1,
  message      text
);

-- ──────────────────────────────────────────────────────────────
-- Table: gifts
-- ──────────────────────────────────────────────────────────────
create table if not exists gifts (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  description         text,
  price               integer,                         -- en pesos ARS, null si es tipo "elijo"
  type                text not null check (type in ('choose', 'contribute')),
  product_url         text,                            -- solo para type='choose'
  image_url           text,
  is_chosen           boolean not null default false,
  chosen_by           text,                            -- nombre del que eligió
  contributed_amount  integer not null default 0,      -- solo para type='contribute'
  target_amount       integer,                         -- monto objetivo para type='contribute'
  display_order       integer not null default 0
);

-- ──────────────────────────────────────────────────────────────
-- Table: contributions
-- ──────────────────────────────────────────────────────────────
create table if not exists contributions (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  gift_id           uuid references gifts(id) on delete cascade,
  contributor_name  text,
  amount            integer not null,
  note              text
);

-- ──────────────────────────────────────────────────────────────
-- RLS — Row Level Security
-- ──────────────────────────────────────────────────────────────
alter table confirmations enable row level security;
alter table gifts          enable row level security;
alter table contributions  enable row level security;

-- gifts: SELECT público
create policy "gifts_public_read"
  on gifts for select
  using (true);

-- gifts: UPDATE público (para elegir regalo desde el frontend)
create policy "gifts_choose"
  on gifts for update
  using (true)
  with check (true);

-- confirmations: INSERT público
create policy "confirmations_insert"
  on confirmations for insert
  with check (true);

-- confirmations: SELECT público (el admin lo ve desde el frontend sin auth real)
create policy "confirmations_read"
  on confirmations for select
  using (true);

-- contributions: INSERT y SELECT públicos
create policy "contributions_insert"
  on contributions for insert
  with check (true);

create policy "contributions_read"
  on contributions for select
  using (true);

-- ──────────────────────────────────────────────────────────────
-- Datos de ejemplo (opcional — descomentar para insertar)
-- ──────────────────────────────────────────────────────────────
/*
insert into gifts (name, description, price, type, image_url, target_amount, display_order)
values
  ('Cochecito', 'Cochecito travel system liviano', 180000, 'contribute', null, 250000, 1),
  ('Moisés', 'Moisés portátil con colchón', 85000, 'contribute', null, 120000, 2),
  ('Kit de baño', 'Tina + accesorios', 25000, 'choose', null, null, 3),
  ('Ropa 0-3 meses', 'Bodys, pijamas y onesies', 15000, 'choose', null, null, 4),
  ('Monitor de bebé', 'Monitor con video HD', 95000, 'choose', null, null, 5);
*/
