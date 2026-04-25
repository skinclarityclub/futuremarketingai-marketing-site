-- =============================================================================
-- Phase 10-02 — Supabase migration for /api/apply + /api/contact lead storage
-- Run this once in Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
-- Idempotent (uses if not exists), safe to re-run.
-- =============================================================================

-- Applications: every form submission from /apply
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- identity
  name text not null,
  email text not null,
  agency text not null,
  role text not null,
  -- qualification
  revenue text not null,
  client_count text not null,
  tier text not null,
  problem text not null,
  -- context
  locale text not null default 'nl',
  source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  ip_hash text,
  user_agent text,
  -- state
  status text not null default 'new'
    check (status in ('new','contacted','qualified','booked','lost'))
);

create index if not exists applications_created_at_idx
  on public.applications (created_at desc);
create index if not exists applications_status_idx
  on public.applications (status);

alter table public.applications enable row level security;

-- Only the service_role (used by /api/apply via SUPABASE_SERVICE_ROLE_KEY) can insert.
-- No SELECT policy: read via Supabase Dashboard Table Editor only.
drop policy if exists "service_role inserts applications" on public.applications;
create policy "service_role inserts applications"
  on public.applications
  for insert
  to service_role
  with check (true);

-- Contact submissions: every form submission from /contact
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  locale text not null default 'nl',
  ip_hash text,
  user_agent text,
  status text not null default 'new'
    check (status in ('new','replied','spam'))
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

drop policy if exists "service_role inserts contact_submissions" on public.contact_submissions;
create policy "service_role inserts contact_submissions"
  on public.contact_submissions
  for insert
  to service_role
  with check (true);
