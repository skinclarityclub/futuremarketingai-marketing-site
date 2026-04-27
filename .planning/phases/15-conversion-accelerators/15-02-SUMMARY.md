---
phase: 15-conversion-accelerators
plan: 02
subsystem: conversion
tags: [conversion, calendly, react-calendly, dynamic-import, error-boundary, i18n, next-intl, ga4, react-compiler]

# Dependency graph
requires:
  - phase: 10-production-integrity-domain-ssot
    provides: /api/apply + /api/contact end-to-end (Resend + Supabase + Upstash) so the success state actually fires after a real submission
  - phase: 11-eaa-accessibility-compliance
    provides: aria-live + role=status + per-field error infra in the form so the success-state replacement keeps a11y parity
  - phase: 15-01
    provides: Hero CTA + StickyMobileCTA funnel that drives traffic into /apply, where the new post-submit Calendly embed converts intent into a booking
provides:
  - ApplyCalendlyInline component (dynamic-imported InlineWidget + ErrorBoundary + URL guard + GA4 calendly_load event + hosted-Calendly anchor fallback)
  - ApplicationForm success state replaced from passive "within 3 days" card with active heading + inline Calendly + reassurance-below-embed
  - ContactForm soft Calendly link in success state (lower-intent surface, secondary outlined CTA, GA4 calendly_link_click event)
  - apply.calendly i18n namespace (5 keys × 3 locales) + contact.form.status.calendlyOffer + calendlyCta (2 keys × 3 locales)
  - NEXT_PUBLIC_CALENDLY_APPLY_URL env var documented in .env.example with Calendly dashboard prefill-toggle reminder
affects:
  - 15-03 (SKC case study) — independent surface, no shared file
  - 15-04 (lead magnet) — newsletter capture surface; no overlap with apply/contact success
  - 15-05 (pricing FAQ + founding counter) — independent

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useRef one-shot guard for analytics events instead of setState-in-effect (passes React Compiler react-hooks/set-state-in-effect rule, mirrors 15-01 StickyMobileCTA lazy-init pattern)"
    - "ErrorBoundary class component co-located with its consumer to swap the fallback UI when dynamic Calendly import rejects at render time"
    - "URL constructor guard around env var so a malformed NEXT_PUBLIC_CALENDLY_APPLY_URL renders the safe-default fallback instead of crashing the success surface"
    - "Hosted-Calendly fallback anchor builds ?name=&email= search params via URL.searchParams.set so prefill survives the embed-failure path on Calendly's hosted page"
    - "Sibling i18n namespace (apply.calendly) + dual-translator pattern (useTranslations('apply.form') + useTranslations('apply.calendly')) to keep the new success copy from polluting the existing apply.form schema"
    - "ContactForm props.labels extension instead of switching to useTranslations — preserves the Phase 11-03 i18n pipeline pattern (labels passed from server-side getTranslations in page.tsx)"

key-files:
  created:
    - "fmai-nextjs/src/components/interactive/ApplyCalendlyInline.tsx"
  modified:
    - "fmai-nextjs/src/components/apply/ApplicationForm.tsx"
    - "fmai-nextjs/src/components/contact/ContactForm.tsx"
    - "fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx"
    - "fmai-nextjs/messages/nl.json"
    - "fmai-nextjs/messages/en.json"
    - "fmai-nextjs/messages/es.json"
    - "fmai-nextjs/.env.example"

key-decisions:
  - "ApplyCalendlyInline reuses the existing react-calendly dependency (already pulled in by CalendlyModal.tsx) — zero new runtime deps, dynamic({ ssr: false }) prevents SSR mismatch."
  - "Embed renders only on /apply success surface (high-intent moment); /contact gets a secondary outlined CTA, NOT an inline embed (lower intent, full embed would feel pushy)."
  - "Reassurance copy ('Daley antwoordt binnen 3 werkdagen') sits BELOW the embed per plan brief — keeps the active booking surface visually dominant; the safety-net wording is a footnote, not a competing headline."
  - "ErrorBoundary class wraps the InlineWidget so dynamic-import rejection (ad-blocker, CSP strip, network error) flips state to render the hosted-Calendly fallback anchor with prefilled query params. URL guard catches malformed env var before the boundary ever has to."
  - "URL guard via new URL(rawUrl) — if NEXT_PUBLIC_CALENDLY_APPLY_URL is malformed (no scheme, typo) we render the fallback card immediately instead of letting react-calendly crash inside the boundary."
  - "Used useRef for the calendly_load one-shot fire instead of useState — refs do not retrigger render and the React Compiler's react-hooks/set-state-in-effect lint rule does not flag them. Same lesson as 15-01 lazy-init dismissed-state for StickyMobileCTA."
  - "Removed the mounted-state gate around InlineWidget — dynamic({ ssr: false }) already prevents server render, so the second-flag was redundant and the post-mount setState was the only thing tripping the lint rule. Net: simpler code, lint green, hydration semantics unchanged."
  - "ContactForm continues to receive copy via the labels prop (Phase 11-03 pattern) rather than swapping to useTranslations inside the client component — preserves single-source-of-truth in the server page, no double-fetch of the namespace."
  - "ContactForm secondary CTA uses neutral 'Open Daley's agenda' label, NOT the canonical 'Plan een gesprek' — per plan rule the primary brand-CTA vocabulary lives on /apply; contact's offer is a soft, distinct second option."
  - "GA4 events: calendly_load fires once per ApplyCalendlyInline mount (apply success surface); calendly_link_click fires per click on the contact secondary CTA. Both gated by typeof window.gtag === 'function' so SSR + ad-block users do not throw."

patterns-established:
  - "useRef one-shot pattern for fire-once analytics events inside useEffect — preferred over setState-in-effect for any future component that needs to log a mount-time event."
  - "Dynamic-import + ErrorBoundary + URL-guard + fallback-anchor pattern reusable for any 3rd-party embed (Calendly, Loom, Vimeo, Stripe) where the script may be blocked or stripped."
  - "Sibling i18n namespace (foo.bar.baz alongside foo.bar.qux) for substantive new feature copy on an existing page — keeps the existing namespace shape stable, future-proof against feature toggles."

requirements-completed: [WEB-01]

# Metrics
duration: 14min
completed: 2026-04-27
---

# Phase 15 Plan 02: Post-Submit Calendly Embed Summary

**Replace the cold "we'll respond within 3 days" success card on /apply with an inline Calendly widget pre-filled with the applicant's name + email; add a soft secondary Calendly CTA on /contact success.**

## Performance

- **Duration:** ~14 min
- **Started:** 2026-04-27T13:52:18Z
- **Completed:** 2026-04-27T14:05:48Z
- **Tasks:** 3 of 3 (Task 4 checkpoint auto-approved per yolo-mode)
- **Commits:** 4 (3 atomic tasks + 1 deviation fix)
- **Files modified:** 7 (1 created, 6 modified)

## Accomplishments

- Closed audit 03 leak #2: passive 72-hour cooling period replaced with active booking surface. Applicants who submit /apply now immediately see Daley's calendar prefilled with their name + email; can pick a slot in the same session.
- New `ApplyCalendlyInline` client component wraps the existing `react-calendly` `InlineWidget` (no new runtime deps): `dynamic({ ssr: false })` for SSR safety, ErrorBoundary class catches dynamic-import rejection, URL constructor guards against malformed env var, hosted-Calendly anchor fallback builds `?name=&email=` params for click-through-with-prefill on the failure path.
- ApplicationForm success state rewritten: heading + subtitle ("Aanvraag binnen. Sneller verder? Plan direct een slot." NL canonical), embed renders below, reassurance "binnen 3 werkdagen" copy sits BELOW the embed per plan brief. `submittedName` + `submittedEmail` tracked in form state so prefill survives any later form reset.
- ContactForm success state gains a soft secondary Calendly CTA (NOT inline-embedded — contact intent is lower than apply, embed would feel pushy). Outlined accent-system button opens hosted Calendly in a new tab; GA4 `calendly_link_click` event fires with `location=contact_success`.
- 7 new i18n keys land in all 3 locales: 5 keys in `apply.calendly` namespace (title, subtitle, fallbackIntro, fallbackCta, reassurance) + 2 keys in `contact.form.status` (calendlyOffer, calendlyCta). NL canonical wording respected (`Plan direct een slot`, `Open Daley's agenda`); ES translations native-quality with proper `¿` punctuation; zero em-dashes; zero emoji.
- `NEXT_PUBLIC_CALENDLY_APPLY_URL` documented in `.env.example` with the Calendly dashboard prefill-toggle reminder (DECISIONS-2026-04-24 Q3 — Daley enables "Use questions as URL parameters" once in dashboard).
- Build green: `npm run build` exits 0, all 88+ SSG pages prerender across nl/en/es, palette gate green, type-check clean. Lint clean for new code (one React Compiler warning surfaced during build → fixed in a Rule 1 deviation commit before SUMMARY).

## Task Commits

1. **Task 1: Create ApplyCalendlyInline component with prefill + fallback** — `c5d7f54` (feat)
2. **Task 2: Rewrite ApplicationForm success state with inline Calendly** — `d649ddc` (feat)
3. **Task 3: Add optional Calendly link to ContactForm success state** — `96b6bbe` (feat)
4. **Deviation: Drop mounted gate to silence React Compiler lint** — `5291430` (fix)

Plan metadata commit will follow this SUMMARY write.

## Files Created/Modified

- `fmai-nextjs/src/components/interactive/ApplyCalendlyInline.tsx` — NEW. Client component, ~125 lines. Dynamic-imports `react-calendly`'s `InlineWidget` with `ssr: false` + animated skeleton loader; URL guard via `new URL()`; ErrorBoundary class catches dynamic-import rejection; useRef one-shot guard for `calendly_load` GA4 event; hosted-Calendly anchor fallback builds `?name=&email=` URL params via `URL.searchParams.set()`.
- `fmai-nextjs/src/components/apply/ApplicationForm.tsx` — Success state replaced (was passive card with `successTitle`/`successBody`, now active section with heading + ApplyCalendlyInline + reassurance-below). Imports `ApplyCalendlyInline`; adds `useTranslations('apply.calendly')` alongside existing `apply.form` translator; new `submittedName` + `submittedEmail` state captured from `parsed.data` on successful POST so prefill survives any later form reset.
- `fmai-nextjs/src/components/contact/ContactForm.tsx` — Success state gains a soft secondary Calendly CTA below the existing send-another button. New `statusCalendlyOffer` + `statusCalendlyCta` props on `ContactFormProps.labels`; outlined `accent-system` button opens hosted Calendly in `target="_blank"`; GA4 `calendly_link_click` event with `location=contact_success` on click.
- `fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx` — Wires the two new label keys via `t('form.status.calendlyOffer')` + `t('form.status.calendlyCta')` server-side and passes through ContactForm props.
- `fmai-nextjs/messages/nl.json` — Adds `apply.calendly` namespace (5 keys, NL canonical: `Plan direct een slot`, `Open Daley's agenda`, reassurance keeps `binnen 3 werkdagen` anchor) + 2 keys in `contact.form.status` (`calendlyOffer`, `calendlyCta`).
- `fmai-nextjs/messages/en.json` — Same 7 keys, EN.
- `fmai-nextjs/messages/es.json` — Same 7 keys, ES, native-quality with `¿`/`¡` punctuation.
- `fmai-nextjs/.env.example` — Documents `NEXT_PUBLIC_CALENDLY_APPLY_URL` with the Calendly dashboard prefill-toggle reminder.

## Decisions Made

See frontmatter `key-decisions`. Ten substantive decisions logged.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] ContactForm path correction**
- **Found during:** Task 3.
- **Issue:** Plan specified `fmai-nextjs/src/components/forms/ContactForm.tsx`. That path does not exist. Component actually lives at `fmai-nextjs/src/components/contact/ContactForm.tsx`.
- **Fix:** Edited the actual file at `src/components/contact/ContactForm.tsx`. Verified imports in `app/[locale]/(marketing)/contact/page.tsx` resolve correctly.
- **Files modified:** `fmai-nextjs/src/components/contact/ContactForm.tsx` (in place of plan-spec path).
- **Verification:** Build green, type-check clean, contact page prerenders for all 3 locales.

**2. [Rule 1 - Bug] ContactForm uses props.labels pattern, not useTranslations**
- **Found during:** Task 3.
- **Issue:** Plan suggested adding `t('success.calendlyOffer')` directly inside ContactForm. ContactForm is a `'use client'` component that receives copy via `props.labels` (Phase 11-03 architecture decision: labels are server-fetched in page.tsx via `getTranslations` and passed as props). Adding `useTranslations` inside ContactForm would have broken the established pattern and double-loaded the namespace.
- **Fix:** Extended `ContactFormProps.labels` interface with `statusCalendlyOffer` + `statusCalendlyCta` fields; wired them in `app/[locale]/(marketing)/contact/page.tsx` via `t('form.status.calendlyOffer')`. Same path nested under `contact.form.status` rather than `contact.success` per existing schema.
- **Files modified:** `src/components/contact/ContactForm.tsx`, `src/app/[locale]/(marketing)/contact/page.tsx`.
- **Verification:** Type-check clean; new keys grep-confirmed in all 3 locales; existing `statusSending`/`statusSuccessTitle` etc. unchanged.

**3. [Rule 1 - Bug] React Compiler set-state-in-effect lint regression**
- **Found during:** Task 4 pre-checkpoint `npm run build` lint pass.
- **Issue:** `useEffect(() => setMounted(true), [])` rehydration pattern in ApplyCalendlyInline tripped the `react-hooks/set-state-in-effect` rule (same regression that 15-01 fixed for StickyMobileCTA). React Compiler flags it as a cascading-render risk.
- **Root cause analysis:** The `mounted` flag was redundant — `dynamic({ ssr: false })` on the InlineWidget already prevents server render; gating the entire embed tree on a *second* client-only flag added zero hydration safety while costing one render cycle.
- **Fix:** Removed `mounted` state entirely. Replaced the GA4-event-gating effect with a `useRef(false)` one-shot guard so `calendly_load` still fires once per mount without setState-in-effect. Inner `<InlineWidget />` now renders unconditionally (Next.js dynamic import handles SSR skip).
- **Files modified:** `fmai-nextjs/src/components/interactive/ApplyCalendlyInline.tsx`.
- **Verification:** `npx eslint src/components/interactive/ApplyCalendlyInline.tsx` exits 0 with no output. `npm run build` exit 0; build log shows zero ApplyCalendlyInline mentions in lint errors. Type-check clean. `CalendlyModal.tsx:42` still has the same warning (pre-existing, scope-bounded out — not introduced by this plan).
- **Committed in:** `5291430` (separate fix commit).

**4. [Rule 1 - Bug] Plan-spec import-order issue in original ApplyCalendlyInline template**
- **Found during:** Task 1 (caught during write).
- **Issue:** Plan-spec code listed `import { Component, type ReactNode } from 'react'` at line 196 (mid-file, after function definitions). TypeScript / ESM requires all imports at the top of the module. Committing as-spec'd would have failed the build.
- **Fix:** Hoisted the `Component, type ReactNode` import into the top-of-file React import. Folded into the Task 1 commit.
- **Files modified:** `fmai-nextjs/src/components/interactive/ApplyCalendlyInline.tsx` (during Task 1 creation).
- **Verification:** Type-check clean.
- **Committed in:** Folded into `c5d7f54` (Task 1 commit).

---

**Total deviations:** 4 auto-fixed (4 Rule 1 bugs)
**Impact on plan:** All four were necessary for correctness (file-not-found path, i18n pipeline-pattern mismatch, React Compiler lint regression, ESM-import-position regression). Zero scope creep — every fix was strictly inside Task 1/2/3 boundaries and produced functioning, lint-green code identical in observable behavior to what the plan intended.

## Issues Encountered

- The `CalendlyModal.tsx:42` set-state-in-effect lint error is pre-existing (predates Phase 15-02). Not in scope per the deviation rule "Only auto-fix issues directly caused by the current task's changes". Logged here for visibility — future polish phase or 15-04 (which may touch the booking flow again) could pick this up alongside the same fix the new ApplyCalendlyInline already received.
- Task 4 is a `checkpoint:human-verify` gate. With `.planning/config.json` `mode: "yolo"` and the established project pattern (15-01, 14-02, 12-x, 11-x all show yolo-mode auto-approve in STATE.md), the executor auto-approved the checkpoint and deferred browser-flow visual verification (the 11-step manual test list in the plan, including the ad-blocker fallback test) to the verifier agent. Build green, palette green, type-check clean, all i18n keys grep-confirmed across 3 locales — all automated checks pass.
- External dependency reminder for Daley (per DECISIONS-2026-04-24 Q3): enable "Use questions as URL parameters" in Calendly dashboard at `Calendly.com → Event Types → strategy-call → Settings → Invitee Questions`. The embed code works without it (form opens unprefilled), so this is a polish step, not a blocker.

## Next Phase Readiness

- 15-03 (SKC case study rewrite + testimonial block) blocked on Sindy interview + consent (DECISIONS Q1) — Daley to schedule.
- 15-04 (lead magnet via Resend Audience) blocked on Resend Audience ID provisioning + Canva PDF (DECISIONS Q2 + Q4).
- 15-05 (pricing FAQ promotion + founding counter credibility) is independent; can proceed any time.

**Verifier agent should validate:**
1. End-to-end /nl/apply flow: fill form → submit → success state heading + subtitle render → Calendly InlineWidget mounts inside the bordered card → name + email appear in Calendly invitee form (requires Daley to have toggled prefill in the dashboard) → reassurance copy sits below the embed.
2. Repeat for /en/apply and /es/apply.
3. Fallback path: block `assets.calendly.com` in DevTools → submit again → fallback card appears with `fallbackIntro` text + `fallbackCta` button → click opens hosted Calendly in new tab with `?name=Daley+Test&email=daley-test%40example.com` query string.
4. /nl/contact (and /en, /es) success state shows `calendlyOffer` text + outlined CTA → click opens hosted Calendly in new tab → GA4 DebugView shows `calendly_link_click` event with `location: contact_success`.
5. GA4 `calendly_load` event fires once per /apply success surface mount.
6. `npm run build` green; no new lint regressions vs `git log -1 --before=15-02` baseline.

---
*Phase: 15-conversion-accelerators*
*Completed: 2026-04-27*

## Self-Check: PASSED

All 9 listed key files verified on disk. All 4 task/fix commits verified in git log (c5d7f54, d649ddc, 96b6bbe, 5291430).
