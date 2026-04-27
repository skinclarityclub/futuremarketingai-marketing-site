---
phase: 15-conversion-accelerators
plan: 04
subsystem: api
tags: [newsletter, lead-magnet, double-opt-in, gdpr, resend, supabase, zod, react]

requires:
  - phase: 10-production-integrity-domain-ssot
    provides: Resend API key + Supabase service-role key + supabase-admin helper + SITE_URL canonical
  - phase: 11-eaa-accessibility-compliance
    provides: focus-visible + aria patterns adopted in LeadMagnetCTA form

provides:
  - /api/newsletter intake endpoint with Zod schema + honeypot + IP-hash + verbatim consent_text
  - /api/newsletter/confirm handler with status idempotency + Resend Audience add + PDF delivery mail
  - /[locale]/newsletter/confirm page with 4 deterministic states (pending/ok/already/error)
  - LeadMagnetCTA reusable component with inline + sidebar variants
  - Wired on home, pricing, founding-member, blog (4/4 pages per plan)
  - newsletter_consents Supabase migration with status enum + 3 indexes + RLS enabled
  - leadMagnet.* + newsletter.confirm.* i18n keys in nl/en/es

affects: [16-multi-step-apply-form, 17-skill-page-proof-artifacts, 18-ab-testing]

tech-stack:
  added: []
  patterns:
    - 'AVG-compliant consent capture: z.literal(true) + verbatim consent_text + ip_hashed + non-pre-checked checkbox'
    - 'Double-opt-in pattern with token UUID + status state machine (pending/confirmed/unsubscribed)'
    - 'Resend Audience add gated AFTER confirm (not on intake) so unconfirmed emails never enter the audience'
    - 'Reuse Phase 10 supabase-admin singleton (placeholder URL pattern keeps next build green pre-provisioning)'
    - 'Honeypot website field returns 200 to mask bot detection (matches /api/apply pattern)'

key-files:
  created:
    - 'fmai-nextjs/src/app/api/newsletter/route.ts'
    - 'fmai-nextjs/src/app/api/newsletter/confirm/route.ts'
    - 'fmai-nextjs/src/app/[locale]/newsletter/confirm/page.tsx'
    - 'fmai-nextjs/src/components/conversion/LeadMagnetCTA.tsx'
    - 'fmai-nextjs/supabase/migrations/20260427_newsletter_consents.sql'
  modified:
    - 'fmai-nextjs/.env.example'
    - 'fmai-nextjs/src/app/[locale]/page.tsx'
    - 'fmai-nextjs/src/app/[locale]/(marketing)/founding-member/page.tsx'
    - 'fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx'
    - 'fmai-nextjs/src/app/[locale]/(blog)/blog/page.tsx'
    - 'fmai-nextjs/messages/nl.json'
    - 'fmai-nextjs/messages/en.json'
    - 'fmai-nextjs/messages/es.json'

key-decisions:
  - 'Reused Phase 10 supabase-admin singleton (no new client, placeholder pattern keeps next build green)'
  - 'Resend Audience add is gated to /api/newsletter/confirm AFTER status flip — unconfirmed emails NEVER enter audience'
  - 'Audience ID missing is non-fatal (warn-and-continue): user still confirmed + receives PDF; documented as launch prerequisite'
  - 'Site URL fallback uses canonical https://future-marketing.ai per Phase 10 SSoT'
  - 'Privacy link routes to /[locale]/legal/privacy (not /privacy) — matches actual route group at (legal)/legal/privacy'
  - 'Confirm page wrapped in Suspense — Next.js 16 useSearchParams() bails prerender otherwise (Rule 1 build fix)'
  - 'Email rendering inline (no messages/*.json coupling) — keeps Resend calls SSR-safe and decouples from client bundle'
  - 'Supabase migration written but NOT applied — Daley runs against fma-app Supabase project (DECISIONS Q3 of Phase 10)'

patterns-established:
  - 'Double-opt-in with idempotent status flip (re-clicking confirm link returns alreadyConfirmed without errors)'
  - 'AVG consent_text storage verbatim — proves which checkbox copy user agreed to at submit time'
  - 'Audience-add as non-fatal post-status-flip step (subscriber confirmed even if Resend Audience write fails)'
  - 'Sidebar variant of conversion CTAs uses muted border + bg-white/[0.02]; inline variant uses accent-system gradient'

requirements-completed: [WEB-01]

duration: 18min
completed: 2026-04-27
---

# Phase 15 Plan 04: Lead Magnet Programme Summary

**GDPR-compliant double-opt-in newsletter capture wired on 4 pages, with Supabase audit trail, Resend Audience integration, and a reusable LeadMagnetCTA component pitching the NL Bureau AI Readiness Checklist PDF**

## Performance

- **Duration:** 18 min
- **Started:** 2026-04-27T14:21:10Z
- **Completed:** 2026-04-27T14:39:12Z
- **Tasks:** 4 of 5 (Task 5 = checkpoint deferred to launch prerequisites — see below)
- **Files created:** 5
- **Files modified:** 8 (including the 3 messages/*.json captured into parallel-agent commits)

## Accomplishments

- Closed audit 03 leak #4 (zero mid-funnel capture). 95+ percent of cold traffic that won't apply today now has an opt-in capture path.
- Code-side flow is end-to-end ready: form -> intake -> double-opt-in mail -> confirm page -> audience add -> PDF delivery mail.
- AVG/GDPR audit trail in place: ip_hashed (SHA-256), consent_text verbatim, both timestamps, locale, source.
- Build exit 0; all 93 SSG routes prerender including /nl|/en|/es/newsletter/confirm.

## Task Commits

1. **Task 1: Supabase migration for newsletter_consents** - `e0e3dcb` (feat)
2. **Task 2: /api/newsletter intake endpoint with double-opt-in** - `0c30584` (feat)
3. **Task 3: /api/newsletter/confirm + confirm page + i18n keys** - `363ddf2` (provenance noise — see Issues)
4. **Task 4: LeadMagnetCTA + 4-page wiring + Suspense build fix** - `4e18dcb` (feat) + `ef0ce35` (provenance noise — pricing wire)

Plan metadata commit: pending after this SUMMARY lands.

## Files Created/Modified

**Created:**
- `fmai-nextjs/supabase/migrations/20260427_newsletter_consents.sql` — table + 3 indexes + RLS enable
- `fmai-nextjs/src/app/api/newsletter/route.ts` — POST intake: Zod + honeypot + ip_hash + Resend confirm mail
- `fmai-nextjs/src/app/api/newsletter/confirm/route.ts` — POST confirm: status flip + idempotency + audience add + PDF mail
- `fmai-nextjs/src/app/[locale]/newsletter/confirm/page.tsx` — Suspense-wrapped client confirm page (4 states)
- `fmai-nextjs/src/components/conversion/LeadMagnetCTA.tsx` — reusable inline + sidebar variants

**Modified:**
- `fmai-nextjs/.env.example` — RESEND_AUDIENCE_ID documented (absent value is non-fatal in dev)
- `fmai-nextjs/src/app/[locale]/page.tsx` — inline LeadMagnetCTA wired below hero
- `fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx` — sidebar variant between visibility + credit-packs (commit ef0ce35)
- `fmai-nextjs/src/app/[locale]/(marketing)/founding-member/page.tsx` — sidebar between benefits + FAQ
- `fmai-nextjs/src/app/[locale]/(blog)/blog/page.tsx` — 2-col layout, sticky sidebar on lg+
- `fmai-nextjs/messages/nl.json` — leadMagnet.* + newsletter.confirm.* (+commit 363ddf2)
- `fmai-nextjs/messages/en.json` — same (+commit 363ddf2)
- `fmai-nextjs/messages/es.json` — same (+commit 363ddf2)

## Decisions Made

See key-decisions in frontmatter. Key calls:

1. **Audience-add gated to confirm**, not intake. Stops unconfirmed bots/typos polluting the FMai newsletter audience.
2. **Audience ID missing is non-fatal**. Subscriber is still confirmed and PDF mail still sends. Server logs a `console.warn` so missing-env is observable but not user-facing.
3. **Privacy link path = `/[locale]/legal/privacy`**. The actual route is `(legal)/legal/privacy` so `/privacy` would 404. Documented inline in component for future maintenance.
4. **Suspense wrap on confirm page**. Next.js 16 requires `useSearchParams()` callers to be inside Suspense or the page bails out of prerender. Found at first build, fixed inline (Rule 1).
5. **Build does not gate on lint warnings**. The confirm page triggers the repo-wide React Compiler `set-state-in-effect` warning. This is the same pattern carried by all client components (Phase 13-03 soft prebuild lint gate). Acceptable.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Wrap confirm page useSearchParams in Suspense**
- **Found during:** Task 4 final build verification
- **Issue:** Next.js 16 prerender failed on `/[locale]/newsletter/confirm` because `useSearchParams()` was not inside a Suspense boundary, causing CSR-bailout to error during static generation.
- **Fix:** Renamed inner component to `NewsletterConfirmInner`, exported a default `NewsletterConfirmPage` that wraps it in `<Suspense fallback>`.
- **Files modified:** `fmai-nextjs/src/app/[locale]/newsletter/confirm/page.tsx`
- **Verification:** `npm run build` exits 0; all 93 routes prerender including the 3 confirm-page locales.
- **Committed in:** `4e18dcb`

**2. [Rule 3 - Blocking adjustment] Privacy link path corrected**
- **Found during:** Task 4 LeadMagnetCTA component drafting
- **Issue:** Plan-spec href was `/${locale}/privacy` but the actual route is `(legal)/legal/privacy` (Phase 04-02 + Phase 14-03 architecture).
- **Fix:** Use `/${locale}/legal/privacy` so the link resolves rather than 404s on click.
- **Files modified:** `fmai-nextjs/src/components/conversion/LeadMagnetCTA.tsx`
- **Verification:** Glob confirmed only one privacy page exists at the corrected path.
- **Committed in:** `4e18dcb`

---

**Total deviations:** 2 auto-fixed (1 build-blocking bug, 1 dead-link blocker)
**Impact on plan:** Both fixes were necessary for the page to ship green. No scope creep.

## Issues Encountered

### Provenance noise from parallel 15-05 agent

- The parallel 15-05 executor (running same wave, modifying overlapping files) ran `git add` while my Task 3 (newsletter confirm route + page + i18n keys) and Task 4 (pricing-page LeadMagnetCTA wire) were unstaged. Their `git add` swept my edits into commits `363ddf2` (Task 3 work) and `ef0ce35` (Task 4 pricing wire) under their commit subjects.
- Functional impact: zero. All files landed correctly; `npm run build` is green.
- Audit-trail impact: 2 of my 4 logical commits live under 15-05 commit subjects. Documented here so future archaeology surfaces the actual provenance.
- This is the same exact pattern documented in 15-03's SUMMARY ("provenance noise documented" — same wave, same agent class, same wave-3 parallel-modify-i18n race condition).

## User Setup Required

**External services require manual configuration before launch.** The following three prerequisites are NOT blocking the code ship but ARE blocking the user-facing flow being functional:

### 1. Resend Audience ID
- **What:** Create the audience "FMai Newsletter NL" in Resend dashboard at https://resend.com/audiences
- **Why:** `/api/newsletter/confirm` adds confirmed emails to this audience for retargeting. Without it, the confirm step still works but emails do not enter the FMai newsletter list (server logs `console.warn`).
- **Where to drop:** Vercel project env vars as `RESEND_AUDIENCE_ID=aud_xxx` (Production scope). Documented in `.env.example`.
- **Verification:** After deploy, submit a real email through the home LeadMagnetCTA, confirm via the link, then check the audience list in Resend dashboard for the email.

### 2. PDF asset
- **What:** Design and produce the 7-page "NL Bureau AI Readiness Checklist" PDF per RESEARCH.md R-3 structure (cover + 20 questions + scoring sheet + 3-tier action guide + CTA back page)
- **Where to drop:** `fmai-nextjs/public/downloads/nl-bureau-ai-readiness-checklist.pdf` (filename must match — the delivery mail hardcodes this path)
- **Why:** The PDF is the actual lead magnet. Until it exists, the confirm-page delivery email link will 404 on click. The page itself still renders, the form still submits, the consent flow still works.
- **Tooling:** Per DECISIONS-2026-04-24 Phase 15 Q2 = Canva free-tier, "Modern Minimal Report" or "Consulting Report" template. Daley draft + apply.
- **Verification:** `curl -I https://future-marketing.ai/downloads/nl-bureau-ai-readiness-checklist.pdf` returns 200 and Content-Type: application/pdf.

### 3. Supabase migration applied
- **What:** Run `fmai-nextjs/supabase/migrations/20260427_newsletter_consents.sql` against the **fma-app Supabase project** (NOT a new project — per DECISIONS-2026-04-24 Phase 10 Q3 the marketing site reuses the fma-app project)
- **Where:** Supabase dashboard SQL editor, or Supabase CLI: `supabase db push --project-ref nurdldgqxseunotmygzn`
- **Why:** The /api/newsletter intake fails with `internal_error` (500) until the table exists. Phase 10 already provisioned the fma-app project with the `applications` and `contact_submissions` tables; this is a sibling table.
- **Verification:** In Supabase Studio, run `select count(*) from public.newsletter_consents;` — should return 0 (no error).

### Existing env vars from prior phases (NOT new)

These are already populated in Vercel from Phase 10 and reused by this plan: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `APPLY_EMAIL_FROM`, `IP_HASH_SALT`, `NEXT_PUBLIC_SITE_URL`. No action required.

## Next Phase Readiness

- Phase 15 closure: 4 of 5 plans now complete (15-01, 15-02, 15-04, 15-05 in parallel). 15-03 remains PARTIAL pending Sindy interview transcript + photo.
- Phase 15 success criteria 5 + 6 (newsletter capture works end-to-end + LeadMagnetCTA rendered on 4 target pages) are GREEN code-side. They flip to fully GREEN once the three launch prerequisites above are completed by Daley.
- This plan does NOT block any subsequent phase. Phase 16 (multi-step apply form) and Phase 17 (skill-page proof) can start independently.
- Verifier agent should run end-to-end Playwright on a deploy that has all three prerequisites populated. Pre-prerequisites, the static analysis (build pass + palette pass + types pass + 4-wire grep) is sufficient confidence.

## Self-Check: PASSED

Verified files exist on disk:
- FOUND: `fmai-nextjs/src/app/api/newsletter/route.ts`
- FOUND: `fmai-nextjs/src/app/api/newsletter/confirm/route.ts`
- FOUND: `fmai-nextjs/src/app/[locale]/newsletter/confirm/page.tsx`
- FOUND: `fmai-nextjs/src/components/conversion/LeadMagnetCTA.tsx`
- FOUND: `fmai-nextjs/supabase/migrations/20260427_newsletter_consents.sql`
- FOUND: `fmai-nextjs/.env.example` (modified — RESEND_AUDIENCE_ID block added)

Verified commits exist in git log:
- FOUND: `e0e3dcb` (Task 1 Supabase migration)
- FOUND: `0c30584` (Task 2 /api/newsletter intake)
- FOUND: `363ddf2` (provenance — captured Task 3 work)
- FOUND: `ef0ce35` (provenance — captured Task 4 pricing wire)
- FOUND: `4e18dcb` (Task 4 own commit — LeadMagnetCTA + home/founding/blog wires + Suspense fix)

Verified build:
- `npm run build` exit 0, all 93 SSG routes prerender, /api/newsletter + /api/newsletter/confirm in dynamic ƒ section.
- `npm run check:palette` PASS — no stale palette hex in src/.
- `npx tsc --noEmit` clean.

Verified i18n parity (3 locales × 2 namespaces):
- `messages/{nl,en,es}.json` all contain `leadMagnet.*` (16 keys each) + `newsletter.confirm.*` (9 keys each).

---
*Phase: 15-conversion-accelerators*
*Completed: 2026-04-27*
