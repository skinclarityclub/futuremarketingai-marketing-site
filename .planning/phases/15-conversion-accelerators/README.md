---
phase: 15-conversion-accelerators
title: Conversion Accelerators
created: 2026-04-24
owner: Daley (solo)
status: planned
depends_on:
  - 10-production-integrity-domain-ssot   # forms wired: Resend + Supabase on /api/apply + /api/contact
  - 11-eaa-accessibility-compliance       # per-field errors + aria + focus infra in place
  - 12-brand-assets                       # og-image, founder photo, Sindy photo — BLOCKS plan 15-03
---

# Phase 15: Conversion Accelerators

## One-liner

Stop passive funnels. Turn every moment of buyer intent into a calendar booking, a captured email, or a proof artifact.

## Business goal

Lift application conversion by 15-30 percent. Open a second mid-funnel pipeline via lead magnet (3-5x top-of-funnel). Rewrite SKC case study with real metrics so the single case study actually sells.

## Scope (what's IN)

| Plan | Title | Wave | External dep |
|---|---|---|---|
| 15-01 | Hero CTA demote + StickyMobileCTA component rolled out to 15 pages | 1 | none |
| 15-02 | Post-submit Calendly embed on ApplicationForm + optional on ContactForm | 2 | Phase 10 (forms wired) |
| 15-03 | SKC case study: Sindy interview brief + content rewrite + testimonial block | 2 | Sindy interview; Phase 12 (photo); Phase 14 (PersonJsonLd) |
| 15-04 | Lead magnet programme: PDF + Resend Audience + /api/newsletter + LeadMagnetCTA | 3 | Phase 10 (Resend); PDF design |
| 15-05 | Pricing FAQ promotion + founding counter credibility | 3 | none |

## Out of scope (deferred)

- Multi-step apply form (audit 03 leak #16) — separate phase (Phase 16 proposed).
- ROI calculator + annual-prepay pricing (audit 03 leak #6) — Phase 16.
- Second case study acquisition (audit S-7) — GTM work, not website.
- Skill-page proof artifacts (audit S-5) — Phase 17 proposed.
- A/B testing infrastructure itself — research deliverable in `RESEARCH.md`; implementation is Phase 18.
- "vs DIY / vs Make.com" comparison pages — Phase 14 GEO content program.

## Success criteria (must be TRUE at phase-close)

1. Home hero shows ONE dominant CTA (`Plan een gesprek` → `/apply`). Secondary is an unstyled text link `Leer Clyde kennen`.
2. `StickyMobileCTA` renders on mobile only, appears after 50 percent scroll, is dismissible, does NOT push above text-input focus, is wired on 15 routes (home, memory, pricing, founding-member, case-studies/skinclarity-club, all 12 skill pages).
3. ApplicationForm success state renders an inline Calendly widget pre-filled with submitted `name` + `email`; `within 3 werkdagen` reassurance sits BELOW the embed; fallback text-link shows when Calendly fails.
4. `messages/nl.json case_studies.skc.*` contains at least 5 quantified outcome metrics with source-noten (e.g. "uren/week bespaard", "engagement delta", "time-to-approval drop 4 min → 30 sec verified"). Testimonial block shows Sindy name + title + photo + LinkedIn URL. NO mention of Daley co-ownership.
5. Newsletter capture via Resend Audience works end-to-end: email submitted → double-opt-in mail sent → confirmed → audience member created → PDF link delivered. GDPR audit trail stored in Supabase (`newsletter_consents` table).
6. `LeadMagnetCTA` component present on home (below hero section 1), founding-member page (sidebar or below hero), pricing (sidebar), blog index sidebar.
7. Pricing page: FAQ is section 4 (directly after tier cards), not section 5. FaqJsonLd exists (Phase 14 adds the helper if not already present).
8. `FOUNDING_LAST_UPDATED` + `FOUNDING_COHORT_START` constants exist in `src/lib/constants.ts`. Counter shows "1 van 10 plekken vergeven per 24 april 2026. Cohort start 1 juni 2026."
9. `npm run build` passes. `npm run lint` passes. No hardcoded English strings introduced in NL locale.
10. Key copy rules respected throughout: `Plan een gesprek` (never "Sign up"); merken not klanten; vaardigheden not features; no em-dashes; no emoji.

## Expected combined lift (conservative)

- `+15-25%` home apply rate (15-01 hero demote).
- `+20-40%` mobile conversion (15-01 sticky CTA).
- `+30-60%` book-to-apply rate (15-02 Calendly embed).
- `+40-80%` case-study-to-apply trust (15-03 metrics).
- `3-5x` top-of-funnel email capture (15-04 lead magnet).
- `+8-12%` pricing-to-apply (15-05 FAQ promotion).

Weighted blended expectation: `+25-45%` overall application submission volume and a net-new remarketing audience of 50-200 emails/month assuming 2-4k monthly visitors.

## Wave / execution order

- Wave 1 (independent): 15-01 can start immediately after Phase 11 ships.
- Wave 2 (requires Phase 10 forms + depends on Phase 12 assets + external Sindy call): 15-02 and 15-03 run in parallel.
- Wave 3 (requires Phase 10 Resend + PDF ready): 15-04 and 15-05 run in parallel.

## External dependencies (non-code)

1. **Sindy interview** (30 min) — Daley schedules. Blocks 15-03 content rewrite, but NOT the brief.
2. **PDF design**: `NL Bureau AI Readiness Checklist` (20 questions + scoring + 3-tier action guide). Canva or Figma export. Daley creates or delegates to designer.
3. **Sindy photo** (headshot) and LinkedIn URL consent — Phase 12 brand assets, or collect during Sindy call.
4. **Resend Audience ID** — env `RESEND_AUDIENCE_ID`. Daley creates at resend.com/audiences.
5. **Calendly event URL** — existing `https://calendly.com/futureai/strategy-call` (see `CalendlyModal.tsx:12`) confirmed usable for inline.

## Files touched (summary)

- `src/lib/constants.ts` — new date constants.
- `src/app/[locale]/page.tsx` — hero secondary CTA demote.
- `src/components/ui/StickyMobileCTA.tsx` — NEW.
- `src/components/apply/ApplicationForm.tsx` — success state rewrite with Calendly embed.
- `src/components/forms/ContactForm.tsx` — optional success-state Calendly link.
- `src/components/conversion/LeadMagnetCTA.tsx` — NEW.
- `src/app/api/newsletter/route.ts` — NEW.
- `src/app/[locale]/newsletter/confirm/page.tsx` — NEW (double-opt-in landing).
- `messages/nl.json`, `messages/en.json`, `messages/es.json` — new keys: `stickyCta.*`, `newsletter.*`, `leadMagnet.*`, updated `case_studies.skc.*`, updated `founding.*` dating.
- `src/app/[locale]/(marketing)/pricing/page.tsx` — FAQ section reorder.
- Supabase migration: `newsletter_consents` table.

## Post-phase verification

- Manual browser flow per plan (see `<verify>` in each PLAN).
- Submit a real application as `Daley Test / daley-test@example.com` → Calendly embeds with prefilled email → book a slot → both confirmation mails arrive.
- Newsletter capture: enter email → receive double-opt-in link → confirm → PDF link email arrives → entry appears in Resend Audience dashboard.
- Mobile Chrome at 375px: StickyMobileCTA appears after 50 percent scroll on home, dismiss works, does NOT overlay an open input, does NOT appear on desktop at 1280px.
- SKC case study: count metrics in page output, verify no Daley co-ownership language, verify testimonial photo + LinkedIn rendered.

## References

- Audit summary: `docs/audits/2026-04-24-full-audit/MASTER-ACTION-PLAN.md` — P1 items 2, 7, 9, 17; plus P2 pricing FAQ (leak #14).
- Deep audit: `docs/audits/2026-04-24-full-audit/03-marketing-conversion.md`.
- Plan format reference: `.planning/phases/09-.../09-03-PLAN.md`.
- Repo rules: `fmai-nextjs/CLAUDE.md`.


---

## Committed Decisions (2026-04-24)

Alle open questions voor deze phase zijn vastgelegd in `.planning/phases/DECISIONS-2026-04-24.md`.

Execute agents: lees dat document vóór elke `plan-XX` die een decision-gate heeft. De decisions zijn bindend voor deze wave, reversible via commit als later blijkt dat een keuze herziening vereist.
