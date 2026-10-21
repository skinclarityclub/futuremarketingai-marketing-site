-- DOWN of 20261021_applications_heard_from.sql: drops applications.heard_from (and its CHECK with it).
-- Refuses while any row has a value: the answers cannot be recovered once dropped. To roll back after data exists, revert the
-- app first and keep the column.
-- WHY the lock first: an insert that commits between the check and the DROP would lose its answer silently. With lock_timeout
-- 3s a long writer makes this fail loudly instead of hanging; a short one is seen by the check, which then refuses.
BEGIN;
SET LOCAL lock_timeout = '3s';
LOCK TABLE public.applications IN ACCESS EXCLUSIVE MODE;
DO $down$
BEGIN
  IF EXISTS (SELECT 1 FROM public.applications WHERE heard_from IS NOT NULL) THEN
    RAISE EXCEPTION 'heard_from has values, refusing';
  END IF;
END
$down$;
ALTER TABLE public.applications DROP COLUMN heard_from;
COMMIT;
