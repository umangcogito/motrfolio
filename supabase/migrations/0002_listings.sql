-- Motrfolio · car listings + buyer leads.
-- One listing = one shareable car page (motrfolio.in/<slug>).

create table if not exists public.listings (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  status             text not null default 'published',   -- draft | published
  created_at         timestamptz not null default now(),

  -- dealer (denormalised for MVP; a dealers table comes with auth later)
  dealer_name        text,
  dealer_city        text,
  dealer_phone       text,                                 -- digits only, for wa.me

  -- vehicle
  make               text,
  model              text,
  variant            text,
  year               int,
  km_driven          int,
  fuel_type          text,
  transmission       text,
  owners             int,
  registration_state text,
  color              text,
  price              int,                                   -- INR

  -- generated content
  title              text,
  description        text,
  highlights         text[] not null default '{}',
  specs              jsonb  not null default '{}'::jsonb,   -- flexible extra specs
  photos             jsonb  not null default '[]'::jsonb,   -- [{url, alt}]
  voice_transcript   text
);

create index if not exists listings_status_created_idx
  on public.listings (status, created_at desc);

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  listing_id  uuid references public.listings (id) on delete cascade,
  name        text,
  phone       text not null,
  message     text,
  source      text default 'listing'
);

create index if not exists leads_listing_idx on public.leads (listing_id, created_at desc);

-- ── RLS ──────────────────────────────────────────────────────────────
alter table public.listings enable row level security;
alter table public.leads    enable row level security;

-- Anyone may read PUBLISHED listings (the public car page). No writes via anon.
drop policy if exists "public can read published listings" on public.listings;
create policy "public can read published listings"
  on public.listings for select
  to anon, authenticated
  using (status = 'published');

-- Anyone may submit a lead; nobody may read leads with the public key.
drop policy if exists "anon can submit leads" on public.leads;
create policy "anon can submit leads"
  on public.leads for insert
  to anon
  with check (true);

-- ── Storage buckets ──────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('listing-audio', 'listing-audio', false)
on conflict (id) do nothing;
