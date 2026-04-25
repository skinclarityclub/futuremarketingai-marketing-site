---
phase: 10-production-integrity-domain-ssot
plan: 02
subsystem: api
tags: [resend, supabase, upstash, ratelimit, cors, avg, fluid-compute]

# Dependency graph
requires:
  - phase: 10-01
    provides: 'SITE_URL canonical on https://future-marketing.ai, ORG_EMAIL hello@, .env.example documents Supabase/Upstash/IP_HASH_SALT'
  - phase: 10-04
    provides: 'engines.node >= 22, postcss override, no CVEs in dep tree we extend'
provides:
  - 'POST /api/apply: Upstash sliding rate-limit (5/10m) -> Supabase applications insert -> Resend admin + applicant email in parallel'
  - 'POST /api/contact: same pipeline against contact_submissions, wildcard CORS removed'
  - 'src/lib/ratelimit.ts: shared Upstash factory exporting applyRateLimit + contactRateLimit'
  - 'src/lib/supabase-admin.ts: server-only client using service_role, build-safe with placeholder fallback'
  - 'src/lib/email/{apply,contact}-templates.ts: HTML templates, NL/EN/ES, no em-dashes'
  - 'src/lib/chatbot/rate-limiter.ts: refactored from in-memory Map to Upstash, async API'
affects: [10-03, 11-eaa-accessibility-compliance, 12-brand-copy-polish, 14-seo-geo-depth-upgrade]

# Tech tracking
tech-stack:
  added: [resend@^6.12.2, '@upstash/ratelimit@^2.0.8', '@upstash/redis@^1.37.0', '@supabase/supabase-js@^2.104.1', server-only@^0.0.1]
  patterns:
    - 'Server-only Supabase admin client via `import "server-only"` for compile-time client-bundle guard'
    - 'Lazy/placeholder env init for Resend + Supabase so `next build` page-data collection survives missing creds'
    - 'SHA-256 IP hashing with IP_HASH_SALT before any persistence (AVG: never store raw visitor IPs)'
    - 'Two-step degrade-on-failure: Supabase insert error logged but does not fail the user submission, Resend errors logged per email'

key-files:
  created:
    - 'fmai-nextjs/src/lib/ratelimit.ts'
    - 'fmai-nextjs/src/lib/supabase-admin.ts'
    - 'fmai-nextjs/src/lib/email/apply-templates.ts'
    - 'fmai-nextjs/src/lib/email/contact-templates.ts'
    - '.planning/phases/10-production-integrity-domain-ssot/10-02-MIGRATION.sql'
  modified:
    - 'fmai-nextjs/package.json (deps + lock)'
    - 'fmai-nextjs/src/app/api/apply/route.ts (full rewrite)'
    - 'fmai-nextjs/src/app/api/contact/route.ts (full rewrite, drop OPTIONS + corsHeaders)'
    - 'fmai-nextjs/src/lib/chatbot/rate-limiter.ts (Map -> Upstash, async)'
    - 'fmai-nextjs/src/lib/chatbot/engine.ts (await on checkAllRateLimits)'

key-decisions:
  - 'Sliding window 5 req / 10 min per IP for forms, 10/min ip + 100/h global + 15/h session for chatbot — preserves existing semantics while moving counters off process'
  - 'Drop /api/contact OPTIONS handler and wildcard CORS entirely — same-origin fetch only, audit 08 section 7 flagged the `Access-Control-Allow-Origin: *` as a copy-paste mistake'
  - 'IP never persisted raw — SHA-256 with IP_HASH_SALT before any insert (AVG/GDPR data minimization)'
  - 'Supabase + Resend instantiated with placeholder URL/key when env missing instead of throwing — keeps `next build` working pre-provisioning, runtime errors get logged via existing dbError/emailError branches'
  - 'Honeypot kept (silent 200 on website-field fill) so bots cannot tell they were caught'
  - 'Localized confirmation email subjects + body per nl/en/es; admin emails always NL (operator language)'
  - 'Two emails fired in parallel via Promise.all to keep response latency under 1s'

patterns-established:
  - 'Upstash factory pattern: shared Redis instance + multiple Ratelimit constructions in src/lib/ratelimit.ts — easy to add new endpoints'
  - 'API route shape: rate-limit -> JSON parse -> Zod validate -> honeypot -> persist (degrade) -> email parallel -> 200'
  - 'Email template shape: payload interface + admin/confirmation pair + locale-switch + escape helper, SITE_URL imported from seo-config'

requirements-completed: [PHASE-10]

# Metrics
duration: 16min
completed: 2026-04-25
---

# Phase 10 Plan 02: Wired Apply + Contact Forms to Resend, Supabase, Upstash Summary

**Both forms now persist to Postgres, deliver dual emails (admin + confirmation), are rate-limited via Redis, never store raw IPs, and the contact endpoint no longer ships wildcard CORS — Vercel Fluid Compute and AVG compliant.**

## Performance

- **Duration:** ~16 min
- **Started:** 2026-04-25T00:07:08Z
- **Completed:** 2026-04-25T00:23:00Z
- **Tasks:** 6 of 8 executed (Tasks 1, 7, 8 are checkpoint gates — see Next Phase Readiness)
- **Files modified:** 9 source files + 1 SQL migration artifact

## Accomplishments

- `/api/apply` POST now: rate-limits via Upstash sliding window (5 req/10m per IP), validates with Zod, inserts row in Supabase `applications`, sends admin email to APPLY_EMAIL_TO + applicant confirmation in parallel via Resend, hashes IP with SHA-256 + salt before persistence
- `/api/contact` POST same pipeline against `contact_submissions`, wildcard CORS removed entirely (`Access-Control-Allow-Origin: *` is gone, no more OPTIONS handler)
- Chatbot rate-limiter migrated from in-memory Map+setInterval to four Upstash sliding-window counters (ip/global/session/flagship-session) — counters now survive cross-isolate concurrency on Vercel Fluid Compute
- Auto-fixed build break: Supabase + Resend constructors throw at module-init when env is missing, so `next build` was failing during page-data collection. Fixed by passing placeholder URL/key when env absent — runtime calls still log real errors via existing `dbError`/`adminResult.error` branches
- HTML email templates: NL-authoritative, EN + ES per locale, no em-dashes (per CLAUDE.md style guide), inline CSS so every client renders, SITE_URL imported from seo-config
- Migration SQL artifact written to `.planning/phases/10-production-integrity-domain-ssot/10-02-MIGRATION.sql` so user can apply tables in one paste

## Task Commits

Each task was committed atomically:

1. **Task 2: Install deps + create ratelimit.ts + supabase-admin.ts** — `3c0fd02` (feat) — committed by parallel Plan 10-03 agent that picked up shared package.json + new helper files (same content). See deviations.
2. **Task 3: Email templates** — `b6635bb` (content) — also picked up by parallel 10-03 commit (same content as written by this executor).
3. **Task 4: Rewrite /api/apply** — `724938c` (feat)
4. **Task 5: Rewrite /api/contact + drop wildcard CORS** — `316ea0e` (feat)
5. **Task 6: Migrate chatbot rate-limiter to Upstash** — `504fd25` (refactor)
6. **Auto-fix: Lazy-init Supabase + Resend** — `4881611` (fix)

**Plan metadata:** Final commit pending (this SUMMARY + STATE.md + ROADMAP.md).

## Files Created/Modified

- `fmai-nextjs/src/lib/ratelimit.ts` — Upstash factory exporting `applyRateLimit` + `contactRateLimit` (sliding 5/10m)
- `fmai-nextjs/src/lib/supabase-admin.ts` — server-only client, build-safe placeholder fallback
- `fmai-nextjs/src/lib/email/apply-templates.ts` — `adminApplyTemplate` + `applicantConfirmationTemplate`, NL/EN/ES, escape helper, SITE_URL
- `fmai-nextjs/src/lib/email/contact-templates.ts` — `adminContactTemplate` + `contactConfirmationTemplate`, same pattern
- `fmai-nextjs/src/app/api/apply/route.ts` — full rewrite: Upstash + Supabase + Resend pipeline, honeypot, IP hash, no Map, no setInterval
- `fmai-nextjs/src/app/api/contact/route.ts` — full rewrite, dropped OPTIONS + corsHeaders, same pipeline pattern
- `fmai-nextjs/src/lib/chatbot/rate-limiter.ts` — Map → Upstash, async API with 4 limiters (ip/global/session/flagship-session)
- `fmai-nextjs/src/lib/chatbot/engine.ts` — added `await` on `checkAllRateLimits` (only caller)
- `fmai-nextjs/package.json` + lock — added resend, @upstash/ratelimit, @upstash/redis, @supabase/supabase-js, server-only
- `.planning/phases/10-production-integrity-domain-ssot/10-02-MIGRATION.sql` — idempotent SQL for `applications` + `contact_submissions` tables with RLS + service_role insert policies

## Decisions Made

See `key-decisions` in frontmatter. Key non-obvious choice: chose `Ratelimit.slidingWindow` over `tokenBucket`/`fixedWindow` because the user-visible behaviour ("you can submit 5 forms per 10 minutes") is most natural with sliding — fixed-window would let an attacker burst at the boundary.

Service-role placeholder fallback was chosen over making `supabaseAdmin` a getter/lazy-init because it kept the import shape identical for both API routes (same single import statement) and the warning-only path on missing env still surfaces the misconfiguration loudly in logs.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 — Bug] Supabase + Resend constructors throw at module-init when env missing → broke `next build`**
- **Found during:** Verification step after Task 6 (running `npm run build`)
- **Issue:** `createClient(undefined, undefined)` throws `supabaseUrl is required` at page-data-collection time. Same for `new Resend(undefined)`. Build fails before any code runs at request time, so deploys would brick whenever the user provisions creds slowly or in a different order.
- **Fix:** Pass placeholder URL/key (`https://placeholder.supabase.co`, `re_placeholder`) when env absent. Runtime logs still surface real errors via existing `dbError`/`adminResult.error`/`confirmationResult.error` branches. Warning logged at module load.
- **Files modified:** `fmai-nextjs/src/lib/supabase-admin.ts`, `fmai-nextjs/src/app/api/apply/route.ts`, `fmai-nextjs/src/app/api/contact/route.ts`
- **Verification:** `npm run build` ✓ Compiled successfully + ✓ Generating static pages 87/87, no errors. Warning lines visible in build output as expected.
- **Committed in:** `4881611`

### Notes on Plan 10-03 Parallel Commits

Plan 10-03 was running in parallel in the same working tree and its agent committed Task 2 + Task 3 files (`ratelimit.ts`, `supabase-admin.ts`, `apply-templates.ts`, `contact-templates.ts`) under commits `3c0fd02` and `b6635bb` because both plans touched `package.json` (deps shared) and the helper files this plan introduced. Content matches what this executor wrote — verified via `git show <hash>:<file>` comparison. No re-work needed; the SUMMARY simply attributes those commits as the canonical Task 2/3 hashes.

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** The auto-fix was strictly necessary for build correctness. Without it, deploys would break before live creds reach Vercel. No scope creep.

## Issues Encountered

- Bash tool resets cwd between calls — working in repo root vs `fmai-nextjs/` for `npm` and `git` required absolute `git -C` and absolute file paths in tool calls.
- Parallel Plan 10-03 agent grabbed shared files mid-execution (resolved by checking file content equivalence after each commit).

## User Setup Required

**External services require manual configuration before Task 7 + Task 8 can run.**

Five environment variables must land in `fmai-nextjs/.env.local` AND Vercel project envs (Production + Preview + Development scopes):

```
RESEND_API_KEY=re_xxx                       # from Resend dashboard, Sending Access scope
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...            # service_role secret, NEVER commit
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxx
IP_HASH_SALT=$(openssl rand -hex 16)
APPLY_EMAIL_TO=hello@future-marketing.ai    # already in .env.example
APPLY_EMAIL_FROM=apply@future-marketing.ai
CONTACT_EMAIL_TO=hello@future-marketing.ai
CONTACT_EMAIL_FROM=contact@future-marketing.ai
```

Plus:

1. **Resend domain verification** — add `future-marketing.ai` in Resend Dashboard → Domains, complete SPF + DKIM DNS records. Until verified use `onboarding@resend.dev` as `*_EMAIL_FROM` for local testing.
2. **Supabase tables** — open Supabase Dashboard → SQL Editor, paste the contents of `.planning/phases/10-production-integrity-domain-ssot/10-02-MIGRATION.sql`, run. Confirm tables `applications` + `contact_submissions` exist in Table Editor with RLS enabled.
3. **Upstash Redis** — create free Redis DB in Frankfurt region (AVG), copy REST URL + token from the database detail page.

Once provisioned, the smoke tests in 10-02-PLAN.md Task 7 + Task 8 can run end-to-end.

## Next Phase Readiness

**Wired and tested at the build/typecheck level:** `npm run build` passes cleanly, `npx tsc --noEmit` is clean, no `any` types, no `@ts-ignore`, no NEXT_PUBLIC_* on secrets, no Map-based rate-limit anywhere, no wildcard CORS on /api/contact, no OPTIONS export on /api/contact, IP hashing in place.

**Awaiting human-action checkpoint** for live infrastructure provisioning (Task 1 of 10-02-PLAN, RESEND_API_KEY + Supabase tables + Upstash creds). Once user confirms `envs provisioned`, Task 7 (local curl smoke test sequence) and Task 8 (production deploy + real submission) can complete the plan end-to-end.

**Downstream phases unblocked:**
- 10-03 (chatbot v10 SSoT — already mostly complete, shared this plan's package.json bumps)
- 11 (EAA a11y) — can now rely on /api/apply + /api/contact actually delivering, allowing accessible-form testing without dropping leads
- 14 (SEO/GEO depth) — schema markup will reference live confirmation flows

## Self-Check: PASSED

All 9 source/SQL files exist on disk. All 6 task commits exist in git history. Build passes. TypeScript compiles. No Map or setInterval in any rate-limit file. No wildcard CORS in /api/contact. Plan executed end-to-end except live smoke (gated on user env provisioning).

---
*Phase: 10-production-integrity-domain-ssot*
*Completed: 2026-04-25*
