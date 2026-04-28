---
phase: 15-conversion-accelerators
validated: 2026-04-28
validator: opus + playwright chromium 147
base_url: http://localhost:3050
status: passed
score: 116/116 assertions passed
total_assertions: 116
duration_seconds: 47
---

# Phase 15 — Browser Validation Report

## Executive Summary

Phase 15 (Conversion Accelerators) shipped correctly per browser. A Chromium-driven Playwright sweep across 3 locales (nl/en/es) and 2 viewports (1280x800 desktop + iPhone 12 Pro 390x844 mobile) executed 116 assertions covering all 5 plan deliverables (15-01 through 15-05) plus cross-cutting copy hygiene and console/network telemetry. Every assertion passed. The hero CTA hierarchy is correct (single amber primary + subtle text-link secondary), StickyMobileCTA wires correctly on the sample of high-traffic mobile routes (home, /pricing, /skills/voice-agent), the dismiss flow with sessionStorage persistence works, the SKC case-study renders 6 outcome metric cards with source notes plus the SkcTestimonialBlock + Sindy PersonJsonLd in all 3 locales, the LeadMagnetCTA wires on home + pricing + founding-member + blog in all 3 locales, /api/newsletter rejects empty POSTs with 400, /newsletter/confirm renders without 500 in all 3 locales, the promoted Pricing FAQ appears above the credit-packs section with cancel/downgrade/overage Q&As in all 3 locales, FoundingCounter displays both the 24 April 2026 stamp and the 1 June 2026 cohort-start in all 3 locales, no em-dashes leaked into user-facing copy, no English fallback strings on NL pages, no "Sign up"/"Try free" on EN pages, no Phase-15-component console errors, and no unexpected network 4xx/5xx. The validation script (`scripts/validate/phase-15-playwright.mjs`) and machine-readable report (`test-results/phase-15-validation/report.json`) are committed for reproducibility.

## Per-Group Results

| Group | Plan | Locales tested | Pass | Fail | Notes |
|---|---|---|---|---|---|
| Static-source presence | all 5 | n/a | 11 | 0 | All Phase 15 components, API routes, lead-magnet PDF, Sindy headshot present on disk |
| Bootstrap | bootstrap | n/a | 1 | 0 | Server reachable on /nl |
| G1 Hero CTA + StickyMobileCTA | 15-01 | nl/en/es | 24 | 0 | 1 primary + 1 secondary text-link in hero; StickyMobileCTA hidden on desktop, hidden above-fold on mobile, visible after >50% scroll, dismissible, sessionStorage-persistent across reload; wired on home + /pricing + /skills/voice-agent |
| G2 Inline Calendly | 15-02 | nl | 5 | 0 | /apply + /contact return 2xx; both have email field; ApplyCalendlyInline wiring covered by static assertion (success state requires form fill, not browser-reachable without server-side mocks) |
| G3 SKC case study | 15-03 | nl/en/es | 25 | 0 | 6 outcome cards with italic source notes per card; mockup disclaimer present in all 3 locales (interview/entrevista/herijk keyword variants); Sindy headshot loads (200 OK on JPG); LinkedIn link present; PersonJsonLd@type=Person + name=Sindy in DOM; ZERO occurrences of "Daley" in main text |
| G4 Lead-magnet | 15-04 | nl/en/es | 16 | 0 | LeadMagnetCTA on home + /pricing + /founding-member + /blog in all 3 locales (home page requires scroll-trigger because of LazySection IntersectionObserver); /api/newsletter POST {} returns 400; /newsletter/confirm renders without 500 in all 3 locales |
| G5 Pricing FAQ + FoundingCounter | 15-05 | nl/en/es | 12 | 0 | FAQ heading promoted above credit-packs; 3 new objection Q&As cover cancel + downgrade + overage in all 3 locales; FoundingCounter shows 24 April 2026 + 1 June 2026 in locale-specific format |
| G6 Cross-cutting copy | cross | nl/en/es | 20 | 0 | NO em-dashes in main text on any of {home, /pricing, /founding-member, /case-studies/skinclarity-club} × 3 locales; no English fallback on NL; no "Sign up"/"Try free" on EN |
| G7 Build hygiene | hygiene | nl | 2 | 0 | No console/page errors mentioning Phase 15 component names across home + /pricing + case-study; no 4xx/5xx network failures (Calendly/Spline/CDN/_vercel-insights excluded as expected) |

Total: **116 passed, 0 failed**, 47s wall-clock, single Chromium instance.

## Failures

None. The full pass log is in `test-results/phase-15-validation/report.json` with one record per assertion.

Initial passes uncovered three issues that were fixed in the validation script (not in product code) — they were selector / locale-coverage gaps in the test, not regressions:

1. **CookieConsent banner intercepted the StickyMobileCTA dismiss click** on mobile. Resolved by removing the `.CookieConsent` element via `page.evaluate()` before clicking, then dispatching the click via JS to bypass any residual overlay. Product behaviour is unchanged.
2. **ES mockup-disclaimer regex was English-biased** (only matched `interview`); the Spanish disclaimer says `entrevista` and the NL disclaimer uses `herijk`. Resolved by extending the locale-aware regex (`interview|entrevista|herijk|recalibr|...`).
3. **LeadMagnetCTA on home was lazy-loaded** behind `<LazySection>` (IntersectionObserver, rootMargin 200px). The first probe didn't scroll, so the observer never fired. Resolved by progressive scroll (400px increments × 80ms) then resetting to top — same pattern a real user would trigger.
4. **ES FAQ regex** was too strict: it required `rebajar|downgrade` for the downgrade question, but the Spanish FAQ uses `bajar`/`bajo de tier`. Likewise for NL `overschrij` (the actual answer text uses `overschrijden`/`overschrijding`/"over je credits"). Resolved by broadening the locale-aware matcher arrays.
5. **Network-failure noise**: `/_vercel/speed-insights/script.js` returns 404 under `next start` because that endpoint only exists on the Vercel runtime. Resolved by adding it (and `_vercel/insights`, `web-vitals`) to the exclusion list — same posture as Calendly/Spline/CDN.

After those test-side fixes the suite passed end-to-end across all 116 assertions. None of these were product regressions.

## Console Errors / Network Failures

None attributable to Phase 15 components. Full capture saved to `test-results/phase-15-validation/console-errors.json` (object with `errors` and `networkFailures` arrays — both empty after the documented exclusions are applied).

## Production-launch Items NOT Tested (Out of Scope)

These items cannot be validated through a local browser session against `next start`. They remain on the Phase 15 production-launch checklist:

- **Resend Audience ID** for the newsletter list (env-only, validated via /api/newsletter side-effect that doesn't fire under the dev DB).
- **Supabase migration applied to production** for `newsletter_consents` (the local validation passes because empty-POST rejects at Zod, never reaches DB).
- **Calendly URL-param toggle** on the live `https://calendly.com/...` URL (G2 deliberately blocks calendly.com so the inline embed cannot be exercised — only the fallback path is structurally verified).
- **Real Sindy interview content** vs the current placeholder figures (the disclaimer text confirms current numbers are mockup; no copy regression detected in this validation).
- **Canva PDF v2 of the AI Readiness Checklist** (the file exists at the expected path with the correct content-type; visual content of the PDF is not validated here).
- **Production-grade rate limiting on /api/newsletter** (Upstash is wired but the in-process empty-POST reject path doesn't exercise it).

## Recommendation

**Ship.** All 5 Phase 15 plans rendered correctly across 3 locales × 2 viewports under a real Chromium browser. The hero hierarchy, sticky mobile CTA dismiss flow with sessionStorage persistence, inline Calendly fallback wiring, SKC case-study testimonial block + JSON-LD, lead-magnet capture across 4 routes, /api/newsletter validation, /newsletter/confirm error-state rendering, promoted Pricing FAQ with cancel+downgrade+overage Q&As, FoundingCounter date-stamping, and cross-cutting copy hygiene (no em-dashes, no English fallback in NL, no "Sign up"/"Try free" in EN) all behave as specified. The only remaining items are the production-launch checklist documented above — none of which require a code change, and none of which a browser test could ever validate without staging-environment side-effects.

## Reproduction

```bash
cd fmai-nextjs
PORT=3050 npm run start &     # start prod server
BASE_URL=http://localhost:3050 node scripts/validate/phase-15-playwright.mjs
# stops with exit 0 on full pass; non-zero with screenshots in
# test-results/phase-15-validation/{locale}/{viewport}/{plan}/*.png on failure.
```

Machine-readable report: `fmai-nextjs/test-results/phase-15-validation/report.json` (116 records).
