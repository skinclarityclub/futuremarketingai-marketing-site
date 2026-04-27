-- Phase 15-04 migration: newsletter_consents
-- GDPR audit trail for newsletter double-opt-in.
--
-- WHY: The lead-magnet programme captures emails for the FMai newsletter.
-- AVG/GDPR requires a verifiable audit trail of explicit, opt-in consent —
-- which checkbox text was shown, when consent was granted, and when it was
-- confirmed via the double-opt-in link. This table is the source of truth.
--
-- WHERE: Per DECISIONS-2026-04-24 Phase 10 Q3, the marketing site reuses
-- the fma-app Supabase project. Run this migration there (NOT in a new
-- project). Same SUPABASE_SERVICE_ROLE_KEY env var as /api/apply.
--
-- RLS: enabled. API routes use service_role which bypasses RLS. No client-
-- side reads are required at this time. If a future dashboard needs read
-- access, add an authenticated SELECT policy in a follow-up migration.

create table if not exists public.newsletter_consents (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token text unique not null,
  status text not null default 'pending' check (status in ('pending','confirmed','unsubscribed')),
  ip_hashed text,
  user_agent text,
  consent_text text not null,
  locale text not null default 'nl' check (locale in ('nl','en','es')),
  source text,          -- e.g. 'home', 'pricing', 'founding', 'blog'
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz
);

create index if not exists newsletter_consents_email_idx on public.newsletter_consents (email);
create index if not exists newsletter_consents_token_idx on public.newsletter_consents (token);
create index if not exists newsletter_consents_status_idx on public.newsletter_consents (status);

alter table public.newsletter_consents enable row level security;
