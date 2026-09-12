-- Motrfolio · waitlist signups captured from the marketing landing page.
-- Apply with the Supabase SQL editor or: supabase db push

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text,
  email       text not null,
  phone       text,
  city        text,
  dealership  text,
  source      text default 'landing'
);

-- Case-insensitive uniqueness on email so a dealer can't double-register.
create unique index if not exists waitlist_email_key
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- Public site uses the anon key: allow INSERT only. No SELECT/UPDATE/DELETE,
-- so the list itself is never readable with the public key.
drop policy if exists "anon can join waitlist" on public.waitlist;
create policy "anon can join waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);
