---
phase: 15-conversion-accelerators
title: Research findings feeding the 5 plans
created: 2026-04-24
owner: Daley
---

# RESEARCH — Conversion Accelerators

All seven research items below are scoped tightly to the phase. Each entry states: the question, the short answer Daley can act on, and the source citation or follow-up action required.

---

## R-1 | Calendly inline widget + URL-param auto-fill (2026 pattern)

**Question**: What's the minimum-friction way to embed Calendly inline in a React 19 / Next.js 16 success state, with `name` and `email` pre-filled?

**Short answer**:
- Codebase already depends on `react-calendly`. `InlineWidget` accepts `prefill={{ name, email }}` directly — NO URL query-string construction required. See existing usage in `src/components/interactive/CalendlyModal.tsx:79`.
- For the Calendly form field to actually auto-fill, the Calendly event type MUST have `Share your Calendly link with pre-filled information` enabled in event settings. Verify once with Daley's account.
- `react-calendly` ships with a built-in CSS shim; no external stylesheet needed.
- For fallback: if `mounted === false` OR the dynamic import errors, render an anchor `<a href="https://calendly.com/futureai/strategy-call?email=...&name=...">Plan een slot direct in Daley's agenda</a>`. URL params on `calendly.com` fall back to the hosted flow which also reads `email` and `name` query args (Calendly public docs, 2025 update).

**Action**: Use existing `InlineWidget` pattern. Confirm prefill is enabled on `futureai/strategy-call` event. Ship with fallback anchor behind a `try/catch` in the dynamic import.

**Source**: `src/components/interactive/CalendlyModal.tsx`; `react-calendly` npm readme (v10.4+ covers React 19 support via peerDependency relax).

---

## R-2 | Resend Audiences API + double-opt-in flow

**Question**: How to capture newsletter subscribers with GDPR double-opt-in, using Resend as the only provider?

**Short answer**:
- Resend has `contacts` API (`resend.contacts.create`, `resend.contacts.list`) scoped per audience. Env needed: `RESEND_API_KEY` (already planned in Phase 10) + new `RESEND_AUDIENCE_ID`.
- Resend does NOT ship a native double-opt-in flow. We implement it ourselves:
  1. `POST /api/newsletter` receives email. Validate (zod + rate-limit).
  2. Insert row into Supabase `newsletter_consents` table with status `pending`, `token = crypto.randomUUID()`, `ip_hashed`, `user_agent`, `created_at`.
  3. Send transactional email via Resend (`resend.emails.send`) with link `https://futuremarketingai.com/newsletter/confirm?token={token}`.
  4. User clicks → `/newsletter/confirm` page calls API internally → flip row to `confirmed`, `confirmed_at=now()`, add to Resend Audience via `resend.contacts.create({ audienceId, email, unsubscribed: false })`, and trigger the PDF-delivery transactional email.
- Single opt-in is legally defensible under GDPR + EU DSA if you record IP + timestamp + user-agent + explicit checkbox (`"Ik ga akkoord met de nieuwsbrief en privacybeleid"`), but double-opt-in dramatically reduces spam and bounces. We ship double.
- Unsubscribe link must be in every mail. Resend auto-injects the `list-unsubscribe` header when audienceId is attached.

**Action**: Schema below.

```sql
-- Phase 15 migration: newsletter_consents
create table newsletter_consents (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  token text unique not null,
  status text not null default 'pending' check (status in ('pending','confirmed','unsubscribed')),
  ip_hashed text,
  user_agent text,
  consent_text text not null,
  created_at timestamptz default now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz
);
create index on newsletter_consents (email);
create index on newsletter_consents (token);
```

**Source**: resend.com/docs/api-reference/contacts; EU DSA + AVG guidance on consent audit trails (EDPB guidelines 05/2020).

---

## R-3 | NL AI Readiness assessment benchmarks (competitive look)

**Question**: What does "AI Readiness" look like as a gated PDF in the NL agency market? What do McKinsey, Bain, HubSpot, Google Think publish as analogous assets?

**Short answer**:
- McKinsey "State of AI 2024/2025" — 60+ pages, data-heavy, not actionable for one agency. Good research anchor but NOT a template for a 1-page download.
- HubSpot "AI Readiness Checklist for Marketers" (EN, 2025) — 20-item checklist, scored 0-5 per item, then tiered action list. This is our reference format.
- Google Think Insights AI Maturity Framework — 4 pillars, 16 questions. Good scoring axis idea.
- Bain "Agency AI Playbook" (2024) — gated behind contact form, not email. Uses scoring matrix with 5 tiers (Explorer → Embedder → Experimenter → Innovator → Native). Adapt this naming axis.
- NL market specifics: zero Dutch agencies publish a free readiness checklist as of audit date. We are first-mover on this asset class in NL.

**Recommended structure for OUR PDF**:
1. Cover + intro (1 page)
2. 4 categories × 5 questions = 20 questions (2 pages)
3. Scoring sheet with axes: `Data Hygiene`, `Operational Readiness`, `Team AI Fluency`, `Commercial Model Fit` (1 page)
4. 3-tier action guide: Score 0-30 (Explorer), 31-60 (Builder), 61-100 (Operator). 3-4 actions each (2 pages)
5. CTA back to `/apply` with Founding-tier callout (1 page)

Total: 7 pages, NL-native, branded, A4.

**Action**: Daley drafts the 20 questions + action guide. Designer (or Stitch export) produces the PDF. Sits in `public/downloads/nl-bureau-ai-readiness-checklist.pdf`. Filename stable so Resend transactional mail links to it.

**Source**: Hubspot Academy AI Checklist 2025; Bain & Co 2024 Agency AI Playbook; Google Think Insights AI Maturity Framework.

---

## R-4 | StickyMobileCTA accessibility specifics

**Question**: What's the failure mode for a sticky bottom bar on mobile, and how do we dodge it?

**Short answer**:
- **Must NOT overlap text input focus**: when the iOS keyboard opens, `position: fixed` elements can cover the active input. Fix: attach a `focusin` listener on `document`; if the event target is `input | textarea | [contenteditable]`, temporarily set `display: none` on the sticky bar. Restore on `focusout`.
- **Must be dismissible**: close button with `aria-label="Sluit mobiele CTA-balk"`. Persist dismiss state in `sessionStorage` (not localStorage — we want it to reappear next visit) with key `fmai_sticky_cta_dismissed_v1`.
- **Must NOT block screen-reader nav**: use `role="complementary"` (not `banner` or `navigation`, those are taken). Include a visually hidden `<h2 className="sr-only">Snelle actie</h2>` for landmark nav.
- **Should NOT appear before 50% scroll**: IntersectionObserver on a sentinel `<div>` at 50% of `document.body.scrollHeight`, OR `useEffect` with throttled scroll listener comparing `window.scrollY / (document.body.scrollHeight - window.innerHeight)`.
- **Should be hidden on desktop**: Tailwind `md:hidden` — desktop has sticky header CTA.
- **Motion**: slide-in-from-bottom via CSS transform; wrap in `@media (prefers-reduced-motion: reduce)` → instant show. Matches Phase 11 motion rules.
- **Focus**: when bar appears, do NOT steal focus. The user is mid-scroll. Only move focus if they click the bar itself.
- **z-index**: below cookie-consent (`z-50`), above content. Use `z-40`.

**Source**: WCAG 2.4.11 (Focus Not Obscured), WCAG 1.4.10 (Reflow), WCAG 2.3.3 (Animation from Interaction), MDN 2025 sticky-footer patterns.

---

## R-5 | Sindy interview template (consulting-case-study style)

**Question**: What 10 questions unlock the real numbers needed for a case study that converts?

**Short answer**: Adapted from Accenture / McKinsey case-study intake templates. Ordered from easiest to most sensitive — earliest questions warm up, latest questions extract the commercial reality.

```
1. Baseline: vóór Clyde, hoeveel uur/week kostte social content voor de 3 accounts samen?
2. Baseline: was er een freelancer of agency betrokken? Zo ja, wat was de maandelijkse cost?
3. Output volume nu: kan je bevestigen 21 carrousels + 15 posts + 2-4 blogs/maand over de 3 accounts?
4. Goedkeuringstijd: van ~4 minuten naar ~30 seconden per post — meet je die? Heb je week-over-week data?
5. Engagement: welke metric heb je (reach? saves? follower growth?)? Wat is de delta sinds Clyde live ging?
6. Omzet/CAC: als ik "time saved" optel bij "reduced outsourced content cost" — waar komt SKC uit op een maand-bespaarde-€?
7. Quality bar: zijn er dingen die Clyde NIET kan? Waar zeg je nog "nee, dat doe ik zelf"?
8. Faillure modes: is er een keer iets misgegaan? Wat gebeurde, hoe snel gefixt?
9. Recommendation quote: als een bevriend bureau zou vragen "moet ik dit doen", wat zou je in één zin zeggen? (Dit is de testimonial.)
10. Toestemming: mag ik (a) je naam + titel + foto + LinkedIn gebruiken; (b) deze exacte cijfers publiek zetten; (c) jou citeren als Founding partner?
```

**Delivery**: Daley schedules 30 min via Calendly, records (with permission), transcribes (Whisper), then fills `messages/nl.json case_studies.skc.*` + testimonial block.

**Must-haves from interview to unblock 15-03**:
- At least 3 quantified deltas (time, engagement, cost, or similar).
- Testimonial quote (can reuse existing one in `messages/nl.json:1651` if Sindy confirms).
- Written consent for name + title + photo + LinkedIn URL.
- "Founding partner" confirmation for Person schema.

**Source**: Accenture Thought Leadership Interview Template; McKinsey Impact Story Framework; Storybrand case-study structure.

---

## R-6 | GDPR compliance for newsletter capture

**Question**: What's the minimum compliant stack for NL newsletter capture in 2026?

**Short answer**:
- **Legal basis**: consent (Art. 6(1)(a) AVG). Must be freely given, specific, informed, unambiguous.
- **Consent checkbox**: NOT pre-ticked. Label: `Ja, stuur me de checklist plus maandelijkse inzichten. Ik kan me op elk moment uitschrijven.` Separate from ToS acceptance if there's a form with multiple submits.
- **Audit trail**: store `ip_hashed` (sha256 + salt, do NOT log raw IP), `user_agent`, `consent_text` (verbatim label shown), `created_at`. Double-opt-in confirmation creates a second timestamp (`confirmed_at`). All in `newsletter_consents` table.
- **Info requirements**: link to privacy policy from the form, disclose WHO processes (FMai + Resend as processor — add to DPA in Phase 4 if not already).
- **Unsubscribe**: every mail has `List-Unsubscribe` header (Resend auto-adds when `audienceId` set) + visible unsubscribe link in footer.
- **Cookie banner impact**: newsletter capture is outside cookies, but if we set any tracking cookies (e.g. GA4 attribution of newsletter submissions), those need consent per ePrivacy Directive.
- **Retention**: keep `newsletter_consents` rows indefinitely (audit trail), but flip `status='unsubscribed'` on opt-out. Do NOT hard-delete rows — the audit trail IS the proof of consent at the time.
- **DPA with Resend**: Resend publishes a DPA at resend.com/legal. Sign once, store in Daley's legal vault. Reference from SiteTos.

**Action**: Add consent checkbox to `LeadMagnetCTA`. Implement `ip_hashed` via `crypto.subtle.digest` in the API route. Link privacy policy.

**Source**: AVG Art. 6 + 7; EDPB Guidelines 05/2020 on consent; ePrivacy Directive; Resend Trust Center 2025.

---

## R-7 | A/B testing infrastructure (Next.js 16)

**Question**: For measuring lift from plans 15-01 through 15-05, what's the simplest ab-test stack today?

**Short answer**:
- **PostHog** (SaaS, generous free tier, GDPR region EU) — `posthog-js` npm package, `useFeatureFlag` hook, works with Next 16 `use client`. Recommended.
- **Vercel Edge Config + custom logic** — cheaper but roll-your-own exposure tracking and stats. Not recommended for solo founder.
- **GrowthBook self-hosted** — too ops-heavy for solo.

**Recommendation**: we do NOT ship A/B infrastructure IN Phase 15. We ship clean, measurable baselines (event names, before/after snapshots, GA4 events fired) so that in a future Phase 18 we can add PostHog feature flags on top of the existing code without refactoring. Specifically: every CTA in plans 15-01/02/04 MUST fire a `gtag('event', 'cta_click', { location, variant: 'v1' })` event — so we can retro-attribute.

**Action**: out of scope for Phase 15 implementation. Document the event-naming convention in each plan.

**Source**: posthog.com/docs/libraries/next-js; Vercel feature-flags docs; Growthbook comparison.

---

## Summary of research outcomes feeding the plans

| Plan | Uses research | Key decision |
|---|---|---|
| 15-01 | R-4, R-7 | StickyMobileCTA uses IntersectionObserver + focusin listener; GA4 event `cta_click` with `location=sticky_mobile`. |
| 15-02 | R-1, R-7 | Use existing `react-calendly` `InlineWidget` with `prefill` prop. Fallback anchor. Fire `gtag('event', 'calendly_load')` + `calendly_book`. |
| 15-03 | R-5 | Interview template above. Blocks on Sindy call. Testimonial block schema: `{ quote, author, role, photoSrc, linkedIn }`. |
| 15-04 | R-2, R-3, R-6 | Double-opt-in flow. Resend `contacts.create`. Supabase `newsletter_consents`. 7-page NL PDF per R-3 structure. Consent checkbox mandatory. |
| 15-05 | n/a | Pure layout reorder + date constants. No research dependency. |

## Open items flagged for Daley before implementation

1. Confirm `futureai/strategy-call` Calendly event has `prefill` enabled.
2. Create Resend Audience "FMai Newsletter NL" → capture `RESEND_AUDIENCE_ID`.
3. Schedule Sindy interview (30 min) — deadline: before 15-03 plan starts.
4. Draft 20-question PDF content (Daley-hours, ~4 hours).
5. Decide designer path for PDF: Canva export or Figma + Stitch.
6. Confirm domain SSoT is `futuremarketingai.com` (Phase 10 decision) — newsletter confirm URL depends on this.
7. Confirm Supabase is provisioned and connected from Phase 10 — `newsletter_consents` migration depends on it.
