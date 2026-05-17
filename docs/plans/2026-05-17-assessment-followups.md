# AI Readiness Assessment — Follow-up Backlog

> Drafted 2026-05-17 at end of build-session (waves 1-5 shipped, commits 3b9ea50..e3eaf6b).
> Pick this up in a fresh chat. Each item is self-contained — pick by priority, not order.
> Status at hand-off: assessment is fully functional + visually polished + on `main`. No
> blockers. The items below would improve conversion + polish but are not ship-stoppers.

## How to use this doc

In a new chat:
1. Reference this file path.
2. Pick one item (or a coherent group) to work on.
3. Each item has its own file refs + concrete fix description. Skip to it.
4. After execution, delete the line from the backlog and commit.

## Done in this session (waves 1-5)

Quick recap so the new chat has context without scrolling git:

- **Wave 1** (`3b9ea50`): Foundation — Supabase migration applied, 16-question SSoT, scoring engine, skill-routing matrix.
- **Wave 2** (`8e38678`): Interactive UI — `/assessment` route, intro → 16 questions → persona reveal, Zustand state, framer-motion, NL/EN/ES copy.
- **Wave 3** (`cb71207`): Email capture + delivery — `/api/assessment` POST, extended `/api/newsletter/confirm`, persona-aware Resend templates.
- **Wave 4** (`a20767b`): Analytics events + LeadMagnetCTA rewired to `/assessment` on home/pricing/founding/blog.
- **Wave 5** (`e3eaf6b`): Pre-launch hardening from critical review — 6 question fixes + 0/2/3/4 ladder, inline reveal enrichment (score bars + lowest highlight + week-1 + skill chips), sessionStorage persistence, explicit consent (12-mo retention), measurable email roadmap, per-persona apply-CTA.

## Backlog (P1 first, then P2)

### P1-C — Newsletter/confirm page with retry flow

**Why**: current `/api/newsletter/confirm` is a POST endpoint with no client-facing page that handles token-fail, Resend-bounce, or expired-link states gracefully. Users who click a stale link see a blank page.

**Files** to create:
- `fmai-nextjs/src/app/[locale]/newsletter/confirm/page.tsx` (already exists but needs review)
- Possibly new client component for the retry form

**Concrete fix**: walk through the actual page state today (`grep -r "newsletter/confirm" fmai-nextjs/src/app/`) and ensure: loading → success → error variants render. Add a "request a new link" form to the error variant that POSTs to a new `/api/newsletter/resend-confirm` endpoint (rate-limit 3/hour/IP). Effort: 2 hours.

### P1-D — Question UX consistency call

**Why**: single-select auto-advances after 350ms; Likert requires explicit "Volgende". This inconsistency was identified in the holistic review as polish-perception cost.

**Decision needed from user**: pick one of:
- **Auto-advance for both** (Likert too) — feels snappy, risk of fat-finger errors
- **Volgende button for both** — cleaner, slightly slower
- **Keep mixed** — explicit fast lane for confident single-select picks, deliberate confirm for nuanced Likert

**Recommended**: present this as an A/B test option in the new chat rather than picking blindly.

**Files** if implementing button-for-all:
- `fmai-nextjs/src/components/assessment/QuestionCard.tsx` lines 50-65 (remove auto-advance timer)
- `fmai-nextjs/src/components/assessment/OptionButton.tsx` (no change)

Effort: 30 min once decided.

### P1-E — Mobile progress-bar positioning

**Why**: holistic review noted that the bottom-fixed progress bar may be hidden behind the cookie-banner on mobile. Move to top on `<lg` breakpoint.

**File**: `fmai-nextjs/src/components/assessment/AssessmentProgress.tsx`

**Concrete fix**: split into two media-query variants — bottom-fixed on desktop, top-fixed (below nav) on mobile. Or: pin to top globally, since it works well on both. Effort: 20 min.

### P1-F — ES copy native-speaker pass

**Why**: holistic review flagged that ES translations are literal NL→ES, missing idiomatic phrasing ("sistematízalo" feels stiff). Native LATAM/Spain speaker would prefer "estandariza" or "automatiza".

**Files**: all `*.es.json` strings under `assessment.*`, `leadMagnet.*`, plus inline strings in `src/lib/email/assessment-templates.ts` PERSONA_SUMMARY/ROADMAP_STEPS/etc. for `es` locale.

**Concrete fix**: outsource to a native speaker, OR re-run via an LLM with the prompt "Rewrite for LATAM agency vernacular, avoid gerunds where imperative is clearer, prefer 'descubre' over 'encuentra'." Effort: 1 hour with LLM pass + 30 min review.

### P2-A — GTM-loader install + cookie-consent wiring

**Why**: `NEXT_PUBLIC_GTM_ID` is empty in `.env.local`, and `CookieConsentBanner` accept/decline handlers are stubs. Our assessment-specific events fire to `window.gtag` but never reach GA because the loader isn't installed. This is a pre-existing audit Phase 6 item; doing it would activate ALL the events we've wired across the site, not just assessment ones.

**Files**:
- `fmai-nextjs/src/app/[locale]/layout.tsx` — add `<Script>` for GTM with `src={`https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}` gated on consent + env presence
- `fmai-nextjs/src/components/common/CookieConsentBanner.tsx` — wire handleAccept/handleDecline to a consent-state context that the loader subscribes to
- `fmai-nextjs/src/lib/analytics.ts` (new) — thin `track()` wrapper for type safety

**Concrete fix**: standard Next.js + GTM consent-mode setup. See https://developers.google.com/tag-platform/security/guides/consent. Effort: 3 hours.

**Decision needed**: requires user to (a) create GTM container in their Google account, (b) set `NEXT_PUBLIC_GTM_ID` env var in Vercel + .env.local.

### P2-B — LinkedIn share button on result page

**Why**: viral loop. Builder gets a result they want to brag about → 1-click LinkedIn share with persona + scores embedded as image or text.

**Files**:
- `fmai-nextjs/src/components/assessment/ResultReveal.tsx`
- Likely a new `/api/og/assessment-result` route for the share-card image

**Concrete fix**: add `<a>` to LinkedIn share-with-text URL. For the OG-image, generate dynamically at /api/og with `persona`, `total`, `scores` query params (next/og). Effort: 2 hours.

### P2-C — Anonymous benchmark "you scored higher than X%"

**Why**: increases curiosity + share-likelihood. Requires real data + cron-aggregated percentile.

**Files**:
- New `fmai-nextjs/src/lib/assessment/benchmark.ts` for the percentile calc
- Likely a cron job to refresh benchmark stats nightly into a cached materialized view
- ResultReveal extension

**Concrete fix**: wait for N>=50 completes; build a Supabase materialized view that calculates the percentile distribution of `assessment_scores->>'total'` per persona. Cron refreshes nightly. ResultReveal renders "You scored higher than 62% of agencies in this cohort". Effort: 4 hours including the data-pipeline work.

### P2-D — Resend webhook for bounce/complaint tagging

**Why**: `/api/webhooks/resend` already logs critical events but doesn't act on them. Bounced or complained emails should mark `newsletter_consents.status` so we don't keep trying to resend.

**File**: `fmai-nextjs/src/app/api/webhooks/resend/route.ts`

**Concrete fix**: on `email.bounced` or `email.complained` events, UPDATE newsletter_consents SET status='unsubscribed' WHERE email = event.data.to (lower-cased). Effort: 45 min.

### P2-E — Admin dashboard

**Why**: Daley currently inspects assessments via Supabase Studio. A simple admin view would surface completion rate, persona distribution, recent submissions.

**Out of scope for this followup**: requires auth + RLS policies + UI. Defer until volume justifies (>100 completes).

### P2-F — A/B test rigs

Three obvious experiments from the holistic review:
1. Email subject: "Bevestig je AI Readiness Scan — je bent een Explorer" vs. "Jouw AI Readiness rapport: Explorer (53/100)" (score-first)
2. Email-gate timing: post-result (current) vs. mid-quiz at Q8 with "unlock your roadmap now"
3. Intro CTA copy: "Start de scan" vs. "Bekijk mijn persona (gratis, 5 min)"

**Out of scope** without an A/B framework. Vercel Edge Config + middleware-flag is the right vehicle. Phase 14+ work.

### Calibration: persona thresholds

**Why**: thresholds `<40 Explorer / 40-69 Builder / >=70 Operator` are research-based, not data-validated. With the new 0/2/3/4 ladder all-b lands at 50% (Builder); calibrate once we have 50+ completes.

**File**: `fmai-nextjs/src/lib/assessment/scoring.ts` constants `EXPLORER_MAX = 39`, `BUILDER_MAX = 69`.

**Action**: monitor distribution in Supabase Studio. If >70% of completes are landing as Builder, raise BUILDER_MAX to 74 to widen Operator window. Effort: 5 min once data justifies.

## Suggested batching for new chats

If you want focused chats with clear deliverables:

- **Chat 1 — Conversion polish**: ~~P1-A (trust anchors) + P1-B (badge) + P1-G (privacy page)~~ — DONE 2026-05-17.
- **Chat 2 — UX consistency call**: P1-D (auto-advance vs button) + P1-E (mobile progress) — wants a design call, then implementation.
- **Chat 3 — Confirm-page hardening**: P1-C alone. Isolated, error-handling-focused, end-to-end test.
- **Chat 4 — Tracking infrastructure**: P2-A (GTM loader). Cross-cutting infra change touching layout + consent banner; deserves its own session.
- **Chat 5 — ES quality pass**: P1-F alone. Native-speaker / LLM rewrite of all ES strings.
- **Anything else**: parked until data + volume justifies.

## Files added/modified during this build (for the next chat to know)

```
docs/plans/2026-05-17-ai-readiness-assessment-plan.md          (plan)
docs/plans/2026-05-17-assessment-followups.md                  (this file)
fmai-nextjs/supabase/migrations/20260517_assessment_columns.sql

fmai-nextjs/src/app/[locale]/(marketing)/assessment/page.tsx
fmai-nextjs/src/app/[locale]/(marketing)/assessment/AssessmentClient.tsx

fmai-nextjs/src/app/api/assessment/route.ts
fmai-nextjs/src/app/api/newsletter/confirm/route.ts            (extended)

fmai-nextjs/src/components/assessment/AssessmentIntro.tsx
fmai-nextjs/src/components/assessment/AssessmentProgress.tsx
fmai-nextjs/src/components/assessment/QuestionCard.tsx
fmai-nextjs/src/components/assessment/OptionButton.tsx
fmai-nextjs/src/components/assessment/LikertScale.tsx
fmai-nextjs/src/components/assessment/ResultReveal.tsx
fmai-nextjs/src/components/assessment/AssessmentEmailGate.tsx
fmai-nextjs/src/components/assessment/AssessmentSuccess.tsx
fmai-nextjs/src/components/conversion/LeadMagnetCTA.tsx        (rewritten)

fmai-nextjs/src/lib/assessment/types.ts
fmai-nextjs/src/lib/assessment/questions.ts
fmai-nextjs/src/lib/assessment/scoring.ts
fmai-nextjs/src/lib/assessment/skill-routing.ts
fmai-nextjs/src/lib/assessment/store.ts
fmai-nextjs/src/lib/email/assessment-templates.ts

fmai-nextjs/src/lib/i18n-namespaces.ts                         (added 'assessment')
fmai-nextjs/messages/nl.json                                   (assessment + leadMagnet namespaces)
fmai-nextjs/messages/en.json                                   (same)
fmai-nextjs/messages/es.json                                   (same)
```

## Open assumptions / unknowns

- **GTM-ID**: not set up. Decision pending from user.
- **RESEND_AUDIENCE_ID + RESEND_WEBHOOK_SECRET**: also unset in `.env.local`. Non-fatal but means audience-add is a no-op and webhook events would fail signature verification.
- **Domain verification for outbound mail**: Resend send currently uses `apply@future-marketing.ai`. Verify this domain is verified in Resend dashboard.
- **Threshold calibration**: deferred until 50+ completes.

## Test rows in Supabase

Two leftover test rows in `newsletter_consents` from this build:
- `info+assessment-test-wave3@skinclarityclub.com` — status=confirmed
- `info+assessment-ui-test@skinclarityclub.com` — status=pending

Safe to delete via Supabase Studio after verifying email delivery worked.
