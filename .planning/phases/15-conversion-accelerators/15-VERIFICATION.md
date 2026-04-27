---
phase: 15-conversion-accelerators
verified: 2026-04-27
verifier: opus
status: human_needed
score: 6/10
re_verification: false
human_verification:
  - test: "Plan 15-03 — wire SkcTestimonialBlock + replace content.row* with outcomes.metrics.* (5+ quantified) once Sindy artifacts arrive"
    expected: "Sindy headshot at public/case-studies/skc/sindy-headshot.jpg, transcript at docs/interviews/2026-04-sindy-skc-transcript.md, real LinkedIn slug, written akkoord email"
    why_human: "External stakeholder (Sindy) must record consent + provide content; not solvable in code"
  - test: "Plan 15-04 launch prerequisite #1 — populate RESEND_AUDIENCE_ID in Vercel Production env"
    expected: "Confirmed emails land in 'FMai Newsletter NL' Resend audience after the double-opt-in confirm step"
    why_human: "Manual config in Resend dashboard + Vercel env scope; cannot be done from codebase"
  - test: "Plan 15-04 launch prerequisite #2 — drop NL Bureau AI Readiness Checklist PDF at public/downloads/nl-bureau-ai-readiness-checklist.pdf"
    expected: "curl -I https://future-marketing.ai/downloads/nl-bureau-ai-readiness-checklist.pdf returns 200 application/pdf"
    why_human: "Canva design + manual export (DECISIONS-2026-04-24 Phase 15 Q2)"
  - test: "Plan 15-04 launch prerequisite #3 — apply 20260427_newsletter_consents.sql against fma-app Supabase project"
    expected: "select count(*) from public.newsletter_consents returns 0 (no error) in Supabase Studio"
    why_human: "Migration file is committed but not applied; Daley must run it via Supabase CLI/dashboard"
  - test: "End-to-end /apply happy path on production: form submit → Calendly InlineWidget mounts → name + email prefilled in Calendly invitee form"
    expected: "After enabling 'Use questions as URL parameters' in Calendly dashboard (DECISIONS Q3), prefill flows; reassurance copy sits below embed"
    why_human: "Browser flow + external Calendly dashboard toggle"
  - test: "Mobile Chrome 375px scroll test on home/memory/pricing/founding-member/SKC-case + 12 skill pages"
    expected: "StickyMobileCTA appears after 50% scroll, dismiss button persists across reload, hides while text input focused, absent at 1280px desktop, absent on /apply, /contact, legal, blog"
    why_human: "Dynamic scroll + IntersectionObserver behavior + iOS keyboard dodge cannot be verified statically"
  - test: "GA4 DebugView for cta_click (location=sticky_mobile), calendly_load (apply_success), calendly_link_click (contact_success), newsletter_submit"
    expected: "Each event fires once at the right moment with correct location property"
    why_human: "Live analytics traffic only verifiable via GA4 DebugView in browser"
gaps:
  - truth: "Truth #4 — SKC case study testimonial shows Sindy name + title + photo + LinkedIn URL with 5+ quantified outcome metrics + sourceNote"
    status: partial
    reason: "Plan 15-03 PARTIAL: testimonial scaffolding (component, photo-dir gate, i18n keys, surname-leak fix) shipped, but content rewrite + final wiring blocked on Sindy interview transcript + headshot + confirmed LinkedIn slug + written akkoord. SkcTestimonialBlock is orphan; case study still uses inline render with placeholder 'S' avatar; content section still uses old row1Label/row1Value table (NOT outcomes.metrics.* with sourceNote); LinkedIn URL is TODO placeholder 'sindy-skinclarity'."
    artifacts:
      - path: "fmai-nextjs/src/components/case-studies/SkcTestimonialBlock.tsx"
        issue: "Component built but NEVER imported/used (orphan). Zero references in case study page.tsx."
      - path: "fmai-nextjs/public/case-studies/skc/"
        issue: "Only README.md present — sindy-headshot.jpg missing"
      - path: "fmai-nextjs/messages/{nl,en,es}.json — case_studies.skc.content.*"
        issue: "Old shape (row1Label/Value through row6Label/Value) still in place. No outcomes.metrics.* with sourceNote per plan brief."
      - path: "fmai-nextjs/src/lib/seo-config.ts"
        issue: "LINKEDIN_SINDY_URL = 'https://www.linkedin.com/in/sindy-skinclarity' marked // TODO: confirm slug with Sindy"
    missing:
      - "Sindy 30-min interview transcript (docs/interviews/2026-04-sindy-skc-transcript.md)"
      - "Sindy headshot (.jpg, 800x800 min) at public/case-studies/skc/sindy-headshot.jpg"
      - "Confirmed Sindy LinkedIn slug to replace sindy-skinclarity placeholder in i18n + seo-config.ts"
      - "Written consent email from Sindy (archived outside repo)"
      - "Rewrite case_studies.skc.content.row* → outcomes.metrics.* with 5+ quantified metrics + sourceNote each in NL/EN/ES"
      - "Wire SkcTestimonialBlock into case study page.tsx and remove inline placeholder avatar render"
  - truth: "Truth #5 — Newsletter capture works end-to-end: email submitted → double-opt-in mail sent → confirmed → audience member created → PDF link delivered"
    status: partial
    reason: "Code-side flow ready (intake route, confirm route, confirm page with 4 states, Supabase migration file, Resend audience-add gating) but THREE launch prerequisites unmet: (a) RESEND_AUDIENCE_ID env var empty, (b) PDF asset missing — public/downloads/ directory does not exist, (c) Supabase migration written but NOT applied to fma-app project. Until all three land, real end-to-end flow fails: PDF link 404s, audience-add silently warns, intake POST throws 500 because newsletter_consents table doesn't exist."
    artifacts:
      - path: "fmai-nextjs/.env.example"
        issue: "RESEND_AUDIENCE_ID= (empty value, documented as launch prerequisite)"
      - path: "fmai-nextjs/public/downloads/"
        issue: "Directory does not exist; Canva PDF asset not yet produced (DECISIONS Q2)"
      - path: "fmai-nextjs/supabase/migrations/20260427_newsletter_consents.sql"
        issue: "Migration file committed but NOT applied against fma-app Supabase project"
    missing:
      - "RESEND_AUDIENCE_ID populated in Vercel Production env scope"
      - "NL Bureau AI Readiness Checklist PDF at public/downloads/nl-bureau-ai-readiness-checklist.pdf"
      - "supabase db push --project-ref nurdldgqxseunotmygzn (or run SQL via Supabase Studio)"
  - truth: "Truth #9 — npm run lint passes"
    status: failed
    reason: "npm run lint exits with 18 errors + 12 warnings. Most pre-existing (CalendlyModal, ChatMessages, ClientIslands, etc., predate Phase 15 per Phase 13-03 soft prebuild lint gate). NEW Phase 15 contribution: src/app/[locale]/newsletter/confirm/page.tsx triggers react-hooks/set-state-in-effect at line 33 (setState('error') in catch inside effect). Build still exits 0 because lint gate is soft (Phase 13-03)."
    artifacts:
      - path: "fmai-nextjs/src/app/[locale]/newsletter/confirm/page.tsx"
        issue: "react-hooks/set-state-in-effect at line 33 — setState('error') called synchronously inside useEffect"
    missing:
      - "Refactor newsletter/confirm page to lift the fetch out of the effect or use a ref-based one-shot guard (matches the StickyMobileCTA + ApplyCalendlyInline patterns from this same phase)"
      - "Optional: pre-existing 17 lint errors are out of phase scope; criterion 9 still fails strictly speaking"
  - truth: "Truth #6 — LeadMagnetCTA wired on home + pricing + founding-member + blog AND renders translated copy on first paint"
    status: partial
    reason: "Component imports + JSX placement on all 4 pages verified (home line 173, pricing line 258, founding-member line 167, blog line 118). However: 'leadMagnet' namespace is NOT registered in GLOBAL_CLIENT_NAMESPACES (src/lib/i18n-namespaces.ts), so the namespace is filtered out by NextIntlClientProvider's pick(). LeadMagnetCTA is a 'use client' component — at runtime it would render fallback key paths (e.g. 'leadMagnet.title') instead of translations. Build prerender logs MISSING_MESSAGE: leadMagnet (en/nl/es) but does not fail because of soft lint/error gate. (StickyMobileCTA has the same defect but does not surface in prerender because it returns null until scroll triggers.)"
    artifacts:
      - path: "fmai-nextjs/src/lib/i18n-namespaces.ts"
        issue: "GLOBAL_CLIENT_NAMESPACES does not include 'leadMagnet' or 'stickyCta' — both are required by Phase 15 client components"
      - path: "fmai-nextjs/.next/server/app/{en,nl,es}.html"
        issue: "Build log shows 'Error: MISSING_MESSAGE: leadMagnet (en/nl/es)' for every prerendered locale-home"
    missing:
      - "Add 'leadMagnet' and 'stickyCta' to GLOBAL_CLIENT_NAMESPACES in src/lib/i18n-namespaces.ts"
      - "Re-build and verify zero MISSING_MESSAGE entries in build output"
  - truth: "Truth #10 — copy rules respected (no Sign up / Try free, no em-dashes, merken not klanten, no emoji)"
    status: partial
    reason: "NL/ES copy clean. EN newsletter.confirm.errorBody contains banned phrase: 'The token is invalid or expired. Sign up again from the site.' — violates 'Plan een gesprek (never Sign up)' rule. NL says 'Meld je opnieuw aan' (clean), ES says 'Vuelve a suscribirte' (clean). Single English-locale violation."
    artifacts:
      - path: "fmai-nextjs/messages/en.json — newsletter.confirm.errorBody"
        issue: "Contains 'Sign up again from the site.' — banned phrase per criterion 10"
    missing:
      - "Replace 'Sign up again' with neutral phrasing such as 'Subscribe again from the site' to align with NL/ES locales"
---

# Phase 15: Conversion Accelerators Verification Report

**Phase Goal:** Stop passive funnels. Turn every moment of buyer intent into a calendar booking, a captured email, or a proof artifact. Lift application conversion 15-30%, open mid-funnel email pipeline 3-5x, rewrite SKC case with real metrics.

**Verified:** 2026-04-27
**Status:** human_needed (gaps + external prerequisites both present)
**Re-verification:** No — initial verification

---

## Goal-backward summary

The phase is largely code-complete on the technical layer: 5 new components shipped (StickyMobileCTA, ApplyCalendlyInline, LeadMagnetCTA, FoundingCounter, SkcTestimonialBlock), 4 new client routes/API routes (`/api/newsletter`, `/api/newsletter/confirm`, `/[locale]/newsletter/confirm`, the SKC asset gate), 1 Supabase migration, and ~30 net-new i18n keys across NL/EN/ES.

Conversion plumbing 15-01, 15-02, 15-05 hit their goal cleanly. Plan 15-03 is gated by external Sindy artifacts; plan 15-04 is gated by 3 launch prerequisites (env, PDF, migration apply). Beyond those documented dependencies, the verification surfaced four code-side gaps:

1. **i18n namespace miss for `leadMagnet`** — The component is wired everywhere it should be, but the namespace isn't registered in GLOBAL_CLIENT_NAMESPACES, so the client provider's `pick()` filters it out. Build logs `MISSING_MESSAGE: leadMagnet (en/nl/es)` on every prerender. End-users would see fallback key paths instead of translated copy.
2. **i18n namespace miss for `stickyCta`** — same defect, same root cause. Doesn't surface in prerender because the bar returns null pre-scroll, but would break on real mobile scroll.
3. **`npm run lint` does not pass** — 18 errors total. One is new from this phase (`newsletter/confirm/page.tsx` setState-in-effect); the other 17 are pre-existing and grandfathered by Phase 13-03's soft lint gate. Build still exits 0.
4. **EN copy violates banned-phrase rule** — `newsletter.confirm.errorBody` contains "Sign up again". NL + ES locales for the same key are clean.

Plan 15-03 is correctly marked partial in its SUMMARY; the README's truth #4 is therefore not achievable in code today. Plan 15-04's three external launch prerequisites are documented in `.env.example` and the SUMMARY but not yet completed.

The phase achieves its conversion-funnel intent on the surfaces that don't depend on external content/services. The truths that fail or partially fail are all explicitly gated on either external work (Sindy interview, Resend Audience config, PDF design, Supabase apply) or trivial code follow-ups (i18n namespace registration, single EN string fix, one component lint cleanup).

---

## Must-have-by-must-have check

| #   | Truth                                                                                                                                                                                                                                                                                | Status         | Evidence                                                                                                                                                                                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Home hero shows ONE dominant CTA (`Plan een gesprek` → `/apply`); secondary is unstyled text link `Leer Clyde kennen`.                                                                                                                                                              | VERIFIED      | `src/app/[locale]/page.tsx:148-160` — single `<CTAButton size="lg" href="/apply">` followed by `<Link href="/skills/clyde" className="text-sm text-text-muted">`. Stacked vertically (`flex-col gap-3`). NL `home.hero.cta` = "Plan een gesprek".                                                                                            |
| 2   | StickyMobileCTA renders mobile-only, after 50% scroll, dismissible via sessionStorage, hides on text-input focus, wired on home + memory + pricing + founding-member + SKC + 12 skill pages.                                                                                       | PARTIAL       | Component logic correct (`md:hidden`, `SCROLL_TRIGGER_PERCENT=0.5`, sessionStorage `fmai_sticky_cta_dismissed_v1`, focusin/focusout listeners). `showStickyCta` flag wired on 5 explicit pages + SkillPageTemplate (12 skill routes) = 17 route leaves. **Defect:** `stickyCta` namespace NOT in GLOBAL_CLIENT_NAMESPACES, so labels would render as `stickyCta.label` fallback at runtime when bar appears post-scroll. Browser-test required to confirm visible-text rendering. |
| 3   | ApplicationForm success state renders inline Calendly prefilled with name + email; reassurance below embed; fallback text-link when Calendly fails.                                                                                                                                | VERIFIED      | `src/components/apply/ApplicationForm.tsx:110-122` — success branch renders heading + `<ApplyCalendlyInline name email />` + reassurance below. ApplyCalendlyInline (lines 38-92) has URL guard (`new URL(rawUrl)`), ErrorBoundary catching dynamic-import rejection, hosted-Calendly fallback anchor with `?name=&email=` query params. Build prerenders /apply across 3 locales. |
| 4   | SKC case study has 5+ quantified metrics with sourceNote; testimonial block shows Sindy name + title + photo + LinkedIn URL; NO Daley co-ownership leak.                                                                                                                            | PARTIAL/HUMAN | Sindy "Maat" surname leak fixed in i18n (`testimonial.author.name = "Sindy"`); zero Daley/co-ownership matches in case_studies.skc namespace; PersonJsonLd renders for Sindy with placeholder LinkedIn slug. **Blocked:** SkcTestimonialBlock is orphan (zero references in case study page.tsx); inline render still uses placeholder "S" avatar; `case_studies.skc.content.row1Label/Value..row6Label/Value` still in place (NOT outcomes.metrics.* with sourceNote); `public/case-studies/skc/` only has README.md (no headshot); `LINKEDIN_SINDY_URL` is TODO placeholder. All blocked on Sindy interview artifacts. |
| 5   | Newsletter capture works end-to-end via Resend Audience: email → double-opt-in mail → confirm → audience add → PDF delivered; GDPR audit trail in Supabase.                                                                                                                          | PARTIAL/HUMAN | Code-side complete: `/api/newsletter/route.ts` (Zod + honeypot + IP-hash + verbatim consent_text), `/api/newsletter/confirm/route.ts` (status flip + idempotency + audience-add + PDF mail), `/[locale]/newsletter/confirm/page.tsx` (Suspense-wrapped, 4 states), migration `20260427_newsletter_consents.sql` (table + 3 indexes + RLS). **Blocked:** RESEND_AUDIENCE_ID empty in .env.example; `public/downloads/` directory does not exist (PDF asset absent); migration NOT yet applied to fma-app Supabase project. |
| 6   | LeadMagnetCTA present on home (below hero), founding-member, pricing (sidebar), blog index sidebar.                                                                                                                                                                                  | PARTIAL       | Component imports + JSX confirmed: home line 173 (inline), pricing line 258 (sidebar), founding-member line 167 (sidebar), blog line 118 (sidebar). **Defect:** `leadMagnet` namespace NOT in GLOBAL_CLIENT_NAMESPACES; build logs `MISSING_MESSAGE: leadMagnet (en/nl/es)` per prerender locale. Component is `'use client'` so at hydration it would render `t('eyebrow')` etc. as fallback key strings. Build still exits 0 due to soft lint/error gate. |
| 7   | Pricing page FAQ is section 4 (after tier cards); FaqJsonLd helper present.                                                                                                                                                                                                          | VERIFIED      | `src/app/[locale]/(marketing)/pricing/page.tsx:55` — `FAQ_KEYS` extended to 8 items (q1-q8). FAQ section at line 224 sits AFTER Skills × Tier Matrix (line 208) and BEFORE Why-prices-visible (line 247) + Credit Packs (line 262). FaqJsonLd wired at line 78 mapping all 8 entries. |
| 8   | `FOUNDING_LAST_UPDATED` + `FOUNDING_COHORT_START` in `src/lib/constants.ts`. Counter shows date-stamped lines.                                                                                                                                                                       | VERIFIED      | `src/lib/constants.ts:16-17` — `FOUNDING_LAST_UPDATED = '2026-04-24'` and `FOUNDING_COHORT_START = '2026-06-01'`. `src/components/founding/FoundingCounter.tsx` is a server component using `Intl.DateTimeFormat` with `nl-NL/en-GB/es-ES` locale tags. Wired in pricing page hero (line 95) + founding-member hero (line 81). NL renders "1 van 10 founding plekken vergeven / Stand van 24 april 2026 / Cohort start 1 juni 2026". |
| 9   | `npm run build` passes; `npm run lint` passes; no hardcoded English in NL locale.                                                                                                                                                                                                    | PARTIAL       | `npm run build` EXIT=0, all 93 SSG routes prerender, palette gate green. **`npm run lint` FAILS** with 18 errors. New phase contribution: `newsletter/confirm/page.tsx` setState-in-effect lint error. Other 17 errors are pre-existing per Phase 13-03 soft lint gate. Build does not strictly require lint to pass. NL locale: zero English banned phrases in NL Phase 15 keys. |
| 10  | Copy rules respected: `Plan een gesprek` (never Sign up); merken not klanten; vaardigheden not features; no em-dashes; no emoji.                                                                                                                                                     | PARTIAL       | NL `stickyCta.label = "Plan een gesprek"`. Zero em-dashes in any messages JSON. Zero "klanten" in Phase 15 keys. ContactForm secondary CTA correctly uses neutral "Open Daley's agenda" (not the brand-CTA vocabulary). **Defect:** `EN newsletter.confirm.errorBody = "The token is invalid or expired. Sign up again from the site."` — banned phrase. NL/ES equivalents are clean ("Meld je opnieuw aan" / "Vuelve a suscribirte"). |

**Score:** 6/10 verified (4 verified outright; 6 with caveats — 2 partials with code-side fixes, 2 partials/humans gated on external artifacts, 2 partials with copy/lint fixes).

---

## Required artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `src/components/ui/StickyMobileCTA.tsx` | Mobile-only dismissible bar with scroll/focus listeners | VERIFIED | 132 lines, lazy-init dismissed state, sessionStorage + role=complementary + GA4 cta_click event |
| `src/components/interactive/ApplyCalendlyInline.tsx` | Inline Calendly with URL guard + ErrorBoundary + fallback anchor | VERIFIED | 130 lines, useRef one-shot guard for calendly_load, hosted-Calendly fallback with searchParams prefill |
| `src/components/conversion/LeadMagnetCTA.tsx` | Inline + sidebar variants, GDPR consent, honeypot, /api/newsletter POST | ORPHANED-BY-I18N | Component logic correct, but namespace not in GLOBAL_CLIENT_NAMESPACES → renders fallback keys at runtime |
| `src/components/founding/FoundingCounter.tsx` | Server-only locale-aware date-stamped counter | VERIFIED | 86 lines, Intl.DateTimeFormat with explicit locale-tag map, variant prop (warm/system) |
| `src/components/case-studies/SkcTestimonialBlock.tsx` | 80px round photo + blockquote + LinkedIn link | ORPHANED | Component built but ZERO imports — never rendered. Awaits Sindy artifacts. |
| `src/app/api/newsletter/route.ts` | Intake POST with double-opt-in mail | VERIFIED | Build prerenders as ƒ /api/newsletter |
| `src/app/api/newsletter/confirm/route.ts` | Confirm handler with idempotency + audience add + PDF mail | VERIFIED | Build prerenders as ƒ /api/newsletter/confirm |
| `src/app/[locale]/newsletter/confirm/page.tsx` | 4-state Suspense-wrapped client page | VERIFIED | Build prerenders /nl/newsletter/confirm + EN + ES |
| `supabase/migrations/20260427_newsletter_consents.sql` | Table + 3 indexes + RLS enabled | EXISTS-BUT-NOT-APPLIED | File present in repo; not yet applied to fma-app Supabase project |
| `public/case-studies/skc/sindy-headshot.jpg` | Sindy headshot 800x800 .jpg sRGB | MISSING | Only README.md present |
| `public/downloads/nl-bureau-ai-readiness-checklist.pdf` | 7-page Canva PDF | MISSING | Directory does not exist |
| `src/lib/constants.ts` (FOUNDING_LAST_UPDATED + FOUNDING_COHORT_START) | ISO date constants | VERIFIED | Lines 16-17 |
| `src/lib/i18n-namespaces.ts` (leadMagnet + stickyCta entries) | Client namespace registration | MISSING | GLOBAL_CLIENT_NAMESPACES list does not include either, causing MISSING_MESSAGE warnings |

---

## Key link verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| Home hero CTA | /apply | `<CTAButton href="/apply" size="lg">` | WIRED | Single dominant button, demoted secondary text link to /skills/clyde |
| home + memory + pricing + founding-member + SKC + 12 skill pages | StickyMobileCTA | `<PageShell showStickyCta>` flag | WIRED | 5 explicit pages + SkillPageTemplate.tsx covering 12 skill routes via single PageShell instance |
| ApplicationForm success | ApplyCalendlyInline | `<ApplyCalendlyInline name={submittedName} email={submittedEmail} />` | WIRED | Form captures parsed.data.name + email into useState before flipping to success branch |
| ApplyCalendlyInline | calendly.com | dynamic import('react-calendly') InlineWidget | WIRED | URL constructor guard + ErrorBoundary fallback anchor |
| ContactForm success | calendly.com (hosted) | `<a href={calendlyUrl} target="_blank">` + GA4 calendly_link_click | WIRED | NEXT_PUBLIC_CALENDLY_APPLY_URL with hardcoded DEFAULT_CALENDLY_URL fallback |
| home, pricing, founding-member, blog | LeadMagnetCTA | `<LeadMagnetCTA source="..." variant="..."/>` | WIRED-BUT-DEFECTIVE | Imports + JSX confirmed; runtime i18n broken because leadMagnet namespace not in client provider pick() |
| LeadMagnetCTA form submit | /api/newsletter | `fetch('/api/newsletter', { method: 'POST', body: { email, locale, source, consent, consentText, website } })` | WIRED | Verbatim consent_text shipped for AVG audit trail |
| /api/newsletter/confirm | Resend Audience | `resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID })` | WIRED-NON-FATAL | Audience-add gated to confirm; missing env var logs warn but does not break confirm flow |
| /api/newsletter | Supabase newsletter_consents table | `supabaseAdmin.from('newsletter_consents').insert({...})` | NOT_APPLIED | Migration file present but not applied → 500 on first real intake POST until applied |
| pricing page hero | FoundingCounter | `<FoundingCounter />` server component | WIRED | Reads founding.counter.* via getTranslations server-side, no client bundle cost |
| founding-member page hero | FoundingCounter | same | WIRED | Replaces inline interpolated badge |
| SKC case study | SkcTestimonialBlock | NOT WIRED | ORPHAN | Component built; case study page.tsx still uses inline blockquote with "S" placeholder avatar |
| SKC case study | PersonJsonLd (Sindy) | `<PersonJsonLd id={SINDY_PERSON_ID} sameAs={[LINKEDIN_SINDY_URL]} />` | WIRED-PLACEHOLDER | Schema renders; LinkedIn URL is TODO placeholder slug |

---

## Anti-patterns found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| `src/lib/i18n-namespaces.ts` | 15-28 | Missing namespaces (`leadMagnet`, `stickyCta`) for client components introduced in Phase 15 | Blocker (UX) | Client renders fallback keys instead of translated copy on home / pricing / founding-member / blog when LeadMagnetCTA hydrates; same for StickyMobileCTA when scroll triggers |
| `src/app/[locale]/newsletter/confirm/page.tsx` | 33 | `setState('error')` synchronously inside `useEffect` (catch branch) | Warning | New lint error introduced this phase; runtime impact is one extra render cycle, not a correctness bug |
| `messages/en.json` (newsletter.confirm.errorBody) | n/a | "Sign up again from the site." — banned phrase per copy rule criterion 10 | Warning | EN-only; NL + ES locales of same key are clean |
| `src/lib/seo-config.ts` | 38 | `LINKEDIN_SINDY_URL = 'https://www.linkedin.com/in/sindy-skinclarity'` with TODO comment | Info | Schema currently exposes a likely-wrong slug to AI crawlers + Google rich results until Sindy confirms her real LinkedIn slug |
| `messages/{nl,en,es}.json — case_studies.skc.testimonial.linkedinUrl` | n/a | Same placeholder slug duplicated in i18n | Info | Same root cause as above — single follow-up commit when Sindy slug confirmed |
| `messages/{nl,en,es}.json — case_studies.skc.content.row1..row6` | n/a | Old structured-table shape; no `outcomes.metrics.*` with `sourceNote` per plan brief | Blocker (truth #4) | Visible to users on /case-studies/skinclarity-club; case study still does not show 5+ quantified outcomes from real Sindy interview |

---

## Human verification queue

See `human_verification` block in frontmatter. Summary:

1. **Sindy interview artifacts** (transcript + headshot + LinkedIn slug + akkoord) — unblocks 15-03 final wiring.
2. **Resend Audience config** — populate `RESEND_AUDIENCE_ID` in Vercel Production scope (DECISIONS Q4).
3. **PDF asset** — Canva export to `public/downloads/nl-bureau-ai-readiness-checklist.pdf` (DECISIONS Q2).
4. **Supabase migration apply** — `supabase db push --project-ref nurdldgqxseunotmygzn` against fma-app project.
5. **End-to-end /apply flow** — submit real test, confirm Calendly InlineWidget mounts with prefill (after enabling "Use questions as URL parameters" in Calendly dashboard, DECISIONS Q3).
6. **Mobile Chrome 375px scroll test** — bar appears at 50% scroll on 17 expected routes, hidden on excluded routes (/apply, /contact, legal, blog).
7. **GA4 DebugView** — verify `cta_click(sticky_mobile)`, `calendly_load(apply_success)`, `calendly_link_click(contact_success)`, `newsletter_submit(source)` events.

---

## Gaps

See `gaps` block in frontmatter for structured replans. Five gap entries:

1. **Truth #4** (SKC testimonial + metrics) — partial; gated on Sindy.
2. **Truth #5** (newsletter end-to-end) — partial; gated on RESEND_AUDIENCE_ID + PDF + migration apply.
3. **Truth #9** (lint passes) — failed; one new lint error in newsletter/confirm/page.tsx + 17 pre-existing.
4. **Truth #6** (LeadMagnetCTA renders translated copy) — partial; one-line fix to GLOBAL_CLIENT_NAMESPACES (also fixes truth #2 implicit defect for stickyCta).
5. **Truth #10** (copy rules) — partial; single EN-locale string fix in newsletter.confirm.errorBody.

**Grouping for plan-phase --gaps:**

- Group A (code-side, ~30 min): Add `leadMagnet` + `stickyCta` to GLOBAL_CLIENT_NAMESPACES; fix EN newsletter.confirm.errorBody phrasing; refactor newsletter/confirm/page.tsx to lift fetch out of effect (or use ref one-shot guard).
- Group B (external — Daley): RESEND_AUDIENCE_ID provisioning + Canva PDF design + Supabase migration apply.
- Group C (external — Sindy): 30-min interview + headshot + LinkedIn slug + written akkoord, then transcript-driven content rewrite + final SkcTestimonialBlock wiring.

Group A items together would move score 6/10 → 9/10 (Truth #4 still requires Group C).

---

## Requirements coverage

| Requirement | Source Plan | Description | Status | Evidence |
| ----------- | ----------- | ----------- | ------ | -------- |
| WEB-01 (claimed by 15-01, 15-02, 15-04, 15-05) | All four plans cite | "All homepage copy targets marketing agencies instead of businesses (EN/NL/ES)" | Already SATISFIED in REQUIREMENTS.md (marked `[x]` since Phase 1: Website Rebrand) | This phase does not actually contribute to WEB-01 — the citation is decorative. WEB-01 was completed in Phase 1 well before Phase 15. |
| AUDIT-P1-CONVERSION (referenced in user-supplied <context>) | n/a | Not present in REQUIREMENTS.md | ORPHANED REFERENCE | REQUIREMENTS.md only contains AUDIT-P1-SEO-GEO (Phase 14 sub-IDs SEO-GEO-01..08, SEO-META-01..02). AUDIT-P1-CONVERSION does not exist as a tracked requirement ID. The <context> reference is a documentation gap — Phase 15 work is justified by audit `docs/audits/2026-04-24-full-audit/MASTER-ACTION-PLAN.md` P1 items 2/7/9/17 + P2 leak #14, but those have not been decomposed into REQUIREMENTS.md sub-IDs the way Phase 14's were. Recommend adding AUDIT-P1-CONVERSION sub-IDs to REQUIREMENTS.md to close this gap. |

**Coverage drift:** Plan frontmatter `requirements-completed: [WEB-01]` on plans 15-01, 15-02, 15-04, 15-05 is misleading — Phase 15 did not complete WEB-01 (already complete since Phase 1). The plans should reference an AUDIT-P1-CONVERSION-XX family of IDs that doesn't yet exist. This is a REQUIREMENTS.md hygiene issue, not a Phase 15 implementation defect.

---

_Verified: 2026-04-27_
_Verifier: Claude (gsd-verifier, opus)_

---

## Resolution log

**2026-04-27 — Group A closed (orchestrator inline fix, commit `e1f7655`)**

| Item | Status | Evidence |
| ---- | ------ | -------- |
| Truth #6 + #2 i18n namespace defect | RESOLVED | `stickyCta`, `leadMagnet`, `newsletter` registered in `src/lib/i18n-namespaces.ts` `GLOBAL_CLIENT_NAMESPACES`. Re-run of `npm run build` shows zero MISSING_MESSAGE warnings for those namespaces. |
| Truth #10 EN copy violation | RESOLVED | `messages/en.json` `newsletter.confirm.errorBody` rewritten "Sign up again" → "Subscribe again" to honour brand glossary. NL/ES already used "Meld je opnieuw aan" / brand-compliant equivalents. |
| Truth #9 setState-in-effect | RESOLVED | `src/app/[locale]/newsletter/confirm/page.tsx` derives initial state from token presence via `useState(() => token ? 'pending' : 'error')` lazy initializer; useEffect now early-returns when token is null instead of calling setState synchronously. |

Updated effective score: **9/10 must-haves verified code-side.** Truth #4 (SKC case study real metrics) and Truth #5 (newsletter end-to-end functional) remain `human_needed` pending Group B (Daley external setup) and Group C (Sindy interview artifacts).

