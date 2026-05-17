-- AI Readiness Assessment columns on newsletter_consents.
--
-- WHY: The lead magnet has been upgraded from a PDF-promise into a real
-- interactive assessment at /assessment. Each completed assessment writes a
-- pending consent row enriched with answers, per-category scores, and the
-- derived persona (Explorer | Builder | Operator). Confirming the double
-- opt-in unlocks a personalised result email instead of the generic
-- checklist mail.
--
-- WHERE: Same Supabase project as 20260427_newsletter_consents.sql (shared
-- with fma-app). Apply via service_role / `supabase db push`.
--
-- COMPAT: ADD COLUMN only. Existing newsletter-only signups keep all
-- assessment_* columns NULL and continue to hit the legacy confirm-and-send
-- branch in /api/newsletter/confirm.

alter table public.newsletter_consents
  add column if not exists assessment_answers jsonb,
  add column if not exists assessment_scores jsonb,
  add column if not exists assessment_persona text
    check (assessment_persona in ('explorer', 'builder', 'operator')),
  add column if not exists assessment_started_at timestamptz,
  add column if not exists assessment_completed_at timestamptz;

create index if not exists newsletter_consents_assessment_persona_idx
  on public.newsletter_consents (assessment_persona)
  where assessment_persona is not null;
