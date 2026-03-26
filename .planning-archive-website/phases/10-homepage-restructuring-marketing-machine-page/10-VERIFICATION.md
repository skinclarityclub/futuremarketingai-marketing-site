---
phase: 10-homepage-restructuring-marketing-machine-page
verified: 2026-03-13T02:40:34Z
status: passed
score: 13/13 must-haves verified
re_verification: false
---

# Phase 10: Homepage Restructuring & Marketing Machine Page — Verification Report

**Phase Goal:** Transform homepage from marketing-focused to general FutureAI overview. Create /marketing-machine page with relocated SocialProof/Features content + demo CTA. Ensure all translations consistent across EN/NL/ES.
**Verified:** 2026-03-13T02:40:34Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                                | Status   | Evidence                                                                                                                                                                                            |
| --- | -------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ----------------------------------------------------------------------------------------- |
| 1   | Homepage hero shows general FutureAI pitch (all services), not marketing-only                                        | VERIFIED | `LandingPage.tsx` SEOHead title "FutureAI - AI Systems That Run Your Business"; `Hero.tsx` i18n keys `landing.hero_landing.*` (badge: "AI Implementation Partner", headline: "AI Systems That Run") |
| 2   | Homepage displays 4 service cards linking to /marketing-machine, /chatbots, /voice-agents, /automations              | VERIFIED | `Hero.tsx` line 475-523: `MotionLink` cards with hrefs to all 4 service routes; `landing.hero_landing.services.*` i18n keys bound to card content                                                   |
| 3   | VisionTimeline and FeatureShowcase no longer render on the homepage                                                  | VERIFIED | `grep -c "VisionTimeline\|FeatureShowcase" src/components/landing/Hero.tsx` = 0; `LandingPage.tsx` has no MobileEvolutionTimeline import                                                            |
| 4   | SimpleHeader shows empty brandMiddle on / (FutureAI); shows "Marketing" on /marketing-machine                        | VERIFIED | `SimpleHeader.tsx` line 50: `if (path.startsWith('/automations')                                                                                                                                    |     | path.startsWith('/marketing-machine'))`returns 'Marketing';`/`falls through to`return ''` |
| 5   | Services dropdown links to /marketing-machine instead of /demo                                                       | VERIFIED | `SimpleHeader.tsx` line 213: `{ label: 'AI Marketing Machine', href: '/marketing-machine' }`                                                                                                        |
| 6   | /marketing-machine route renders MarketingMachinePage                                                                | VERIFIED | `App.tsx` line 55: lazy import; line 117: marketingPaths entry; line 205: `<Route path="/marketing-machine" element={<MarketingMachinePage />} />`                                                  |
| 7   | MarketingMachinePage shows FutureMarketingAI content (VisionTimeline, FeatureShowcase, FeaturesSection, SocialProof) | VERIFIED | `MarketingMachinePage.tsx` (254 lines): lazy imports + Suspense renders of all 4 components at lines 134, 139, 162, 167                                                                             |
| 8   | /marketing-machine in marketingPaths (gets footer + no FloatingNav)                                                  | VERIFIED | `App.tsx` line 117: `'/marketing-machine'` in marketingPaths array                                                                                                                                  |
| 9   | MarketingMachinePage follows Living System design tokens                                                             | VERIFIED | `MarketingMachinePage.tsx`: `bg-bg-deep`, `bg-accent-system/10`, `border-accent-system/20`, `rounded-sm`, `text-text-primary`, `text-text-secondary`, `bg-bg-surface` throughout                    |
| 10  | NL hero_landing keys match EN structure (no stale wachtlijst copy)                                                   | VERIFIED | `nl/common.json`: badge="AI Implementatie Partner", cta.secondary="Plan een Strategiegesprek" (no Wachtlijst); services keys match EN exactly                                                       |
| 11  | ES hero_landing keys match EN structure (no stale founding-member copy)                                              | VERIFIED | `es/common.json`: badge="Socio de Implementacion AI", cta.primary="Explora Nuestros Servicios"; services keys match EN exactly; no "Lista de Espera"                                                |
| 12  | ES common.json has no duplicate pricing or actions blocks                                                            | VERIFIED | `pricing occurrences: 3` (1 top-level object + 2 footer nav strings — correct); `actions occurrences: 1` (no duplicate)                                                                             |
| 13  | All three locale files have services.\* keys (EN, NL, ES)                                                            | VERIFIED | All three: keys `["title","subtitle","cta_label","marketing","chat","voice","automations"]` — exact match across locales                                                                            |

**Score:** 13/13 truths verified

---

### Required Artifacts

| Artifact                                          | Expected                                                                     | Status   | Details                                                                                                                                                    |
| ------------------------------------------------- | ---------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/landing/Hero.tsx`                 | Reworked desktop hero: service cards grid, no VisionTimeline/FeatureShowcase | VERIFIED | 0 references to VisionTimeline/FeatureShowcase; MotionLink service grid with 4 cards; #services anchor                                                     |
| `src/components/landing/SimplifiedHeroMobile.tsx` | Mobile hero uses i18n key (no hardcoded Dutch)                               | VERIFIED | Line 188: `t('landing.hero_landing.badge')` — hardcoded "Live interactieve demo beschikbaar" replaced                                                      |
| `src/pages/LandingPage.tsx`                       | No MobileEvolutionTimeline; SEOHead updated; bg-bg-deep wrapper              | VERIFIED | No MobileEvolutionTimeline import; title="FutureAI - AI Systems That Run Your Business"; `bg-bg-deep` wrapper confirmed                                    |
| `src/components/landing/SimpleHeader.tsx`         | Updated brandMiddle logic and /marketing-machine serviceLink                 | VERIFIED | brandMiddle: `/` returns `''`; `/marketing-machine` returns `'Marketing'`; serviceLinks href corrected                                                     |
| `public/locales/en/common.json`                   | New services.\* keys + updated final_cta/cta.primary                         | VERIFIED | `services.title/subtitle/cta_label/marketing/chat/voice/automations` all present; final_cta.button="Book a Free Audit"; cta.primary="Explore Our Services" |
| `src/pages/MarketingMachinePage.tsx`              | Dedicated FutureMarketingAI page with relocated components                   | VERIFIED | 254 lines; SimpleHeader, SEOHead, SocialProof, VisionTimeline, FeatureShowcase, FeaturesSection, pricing teaser, Calendly CTA                              |
| `src/App.tsx`                                     | Route and marketingPaths entry for /marketing-machine                        | VERIFIED | Lazy import line 55; marketingPaths line 117; Route line 205                                                                                               |
| `public/locales/nl/common.json`                   | Synced NL translations with service cards + fixed hero_landing keys          | VERIFIED | Services keys match EN; badge/headline/cta all updated to Dutch gateway services copy                                                                      |
| `public/locales/es/common.json`                   | Synced ES translations with service cards + fixed structural issues          | VERIFIED | Services keys match EN; structural issues fixed (no duplicates); cookie_consent added                                                                      |

---

### Key Link Verification

| From                                      | To                                         | Via                                                        | Status | Details                                                                                                                                         |
| ----------------------------------------- | ------------------------------------------ | ---------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/landing/Hero.tsx`         | `public/locales/en/common.json`            | `useTranslation('common')` — `landing.hero_landing.*` keys | WIRED  | `t('landing.hero_landing.services.title')` and service card keys found at lines 464-521                                                         |
| `src/components/landing/SimpleHeader.tsx` | `/marketing-machine route`                 | serviceLinks href + brandMiddle logic                      | WIRED  | href='/marketing-machine' at line 213; brandMiddle condition at line 50                                                                         |
| `src/App.tsx`                             | `src/pages/MarketingMachinePage.tsx`       | lazy import + Route element                                | WIRED  | `lazy(() => import('./pages/MarketingMachinePage'))` line 55; `<Route path="/marketing-machine" element={<MarketingMachinePage />} />` line 205 |
| `src/pages/MarketingMachinePage.tsx`      | `src/components/landing/SimpleHeader.tsx`  | SimpleHeader import                                        | WIRED  | Line 3: `import { SimpleHeader } from '../components/landing/SimpleHeader'`; rendered line 73                                                   |
| `src/pages/MarketingMachinePage.tsx`      | `src/components/common/VisionTimeline.tsx` | lazy import                                                | WIRED  | Lines 9-11: lazy import; Suspense render line 139                                                                                               |
| `src/components/landing/Hero.tsx`         | `public/locales/nl/common.json`            | useTranslation with NL language                            | WIRED  | Same `landing.hero_landing.*` keys; NL has matching structure confirmed programmatically                                                        |
| `src/components/landing/Hero.tsx`         | `public/locales/es/common.json`            | useTranslation with ES language                            | WIRED  | Same `landing.hero_landing.*` keys; ES has matching structure confirmed programmatically                                                        |

---

### Requirements Coverage

| Requirement              | Source Plans        | Description                                                               | Status    | Evidence                                                                                                                                                                                                                                                                      |
| ------------------------ | ------------------- | ------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-HOMEPAGE-RESTRUCTURE | 10-01, 10-02, 10-03 | Full homepage-to-hub transformation + /marketing-machine page + i18n sync | SATISFIED | All 9 sub-points from REQUIREMENTS.md confirmed in codebase: hero reworked, service cards grid, VisionTimeline/FeatureShowcase relocated, /marketing-machine page created, SimpleHeader brandMiddle updated, serviceLinks href corrected, App.tsx routing added, NL/ES synced |

No orphaned requirements found — REQUIREMENTS.md maps REQ-HOMEPAGE-RESTRUCTURE to this phase only, and all three plans claim it.

---

### Anti-Patterns Found

No anti-patterns detected across modified files:

- No TODO/FIXME/PLACEHOLDER comments in Hero.tsx, SimpleHeader.tsx, MarketingMachinePage.tsx, LandingPage.tsx, SimplifiedHeroMobile.tsx
- No stub return patterns (`return null`, `return []`, `return {}`)
- No empty handlers
- No hardcoded Dutch strings remaining in SimplifiedHeroMobile.tsx
- TypeScript compiles cleanly (`npx tsc --noEmit` — no output = no errors)

---

### Human Verification Required

The following items cannot be verified programmatically and require a browser check:

#### 1. Homepage header branding renders "FutureAI"

**Test:** Open the dev server homepage (`/`). Check the header logo/brand text.
**Expected:** Header shows "FutureAI" (no "Marketing" middle segment).
**Why human:** `brandMiddle` returns `''` for `/` — but how the header renders an empty brandMiddle (whether it collapses or shows just "Future" + "AI") requires visual confirmation.

#### 2. Service cards scroll behavior

**Test:** On the homepage, click the "Explore Our Services" primary CTA.
**Expected:** Page smoothly scrolls to the service cards grid (anchored at `#services`).
**Why human:** `CTAButton` with `href="#services"` — need to confirm CTAButton renders as an `<a>` tag for hash scrolling vs a React Router Link that would not scroll.

#### 3. /marketing-machine page full render

**Test:** Navigate to `/marketing-machine` in the browser.
**Expected:** Page renders with hero, SocialProof, VisionTimeline (3-era timeline), FeatureShowcase (6 module cards), FeaturesSection, pricing teaser (3 tiers), and final Calendly CTA. Header shows "FutureMarketingAI".
**Why human:** Lazy-loaded Suspense components (VisionTimeline, FeatureShowcase, FeaturesSection, SocialProof) may have runtime errors or render issues not visible in TypeScript check.

#### 4. NL/ES service cards on homepage

**Test:** Switch language to NL, then ES. Observe service card names and pitches on homepage.
**Expected:** Cards show Dutch translations in NL (e.g., "Meer info" CTA label, Dutch pitch text); Spanish translations in ES.
**Why human:** i18n runtime resolution cannot be verified statically — need browser language switch to confirm correct key resolution.

---

### Gaps Summary

No gaps. All 13 truths verified against the actual codebase. Phase goal fully achieved.

---

_Verified: 2026-03-13T02:40:34Z_
_Verifier: Claude (gsd-verifier)_
