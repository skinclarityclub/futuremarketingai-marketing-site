-- applications.heard_from: where an applicant says it heard of us (B3-4 bronvraag, plan D1).
--
-- WHY: the /apply wizard gets a required "where did you hear of us" question. The answer is a fixed list so it can be
-- counted; there is deliberately no free text (a phone number typed into "other" would land in the table, the lead
-- metadata and the mail). It is stated, not measured, and never mixed with utm_* / source.
--
-- WHERE: same Supabase project as 20260517_assessment_columns.sql (shared with fma-app).
-- HOW: apply with MCP apply_migration, name `applications_heard_from`, on Daley's yes. The ledger version will be the
-- apply time (14 digits) and will differ from this file name (R-B34-3: the earlier FMai migrations never got a ledger row
-- either). NEVER `supabase db push` (it would try to apply files the ledger does not know).
-- ORDER: migration first (additive, nullable), code that writes heard_from second. Code first does NOT 500 the form:
-- src/app/api/apply/route.ts only logs the failed insert and still returns 200, so the lead is kept but the
-- `applications` row (and its heard_from) is lost.
-- COMPAT: nullable, no default. NULL = a row from before the question (108 on prod), never backfilled.
-- Rollback: ../rollbacks/20261021_applications_heard_from_DOWN.sql (not in migrations/, so nothing applies it by accident).
-- Proof: throwaway db, fma-app supabase/tests/rls/tracking_b34.test.sql.
BEGIN;
SET LOCAL lock_timeout = '3s';
DO $pre$
BEGIN
  IF to_regclass('public.applications') IS NULL THEN
    RAISE EXCEPTION 'public.applications is missing, refusing';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'applications' AND column_name = 'heard_from') THEN
    RAISE EXCEPTION 'heard_from already exists, refusing';
  END IF;
END
$pre$;

ALTER TABLE public.applications
  ADD COLUMN heard_from text CONSTRAINT applications_heard_from_check CHECK (heard_from IS NULL OR heard_from IN
    ('linkedin','google','ai_assistant','instagram','podcast_event','referral','partner','other','unknown','not_asked'));

COMMENT ON COLUMN public.applications.heard_from IS
  'Stated source ("where did you hear of us"), fixed list. NULL = row from before the question existed, never backfilled; not_asked = submitted after the question without an answer.';
COMMIT;
