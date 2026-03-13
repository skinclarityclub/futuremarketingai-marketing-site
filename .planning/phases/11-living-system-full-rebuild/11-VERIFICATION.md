---
phase: 11-living-system-full-rebuild
verified: 2026-03-13T12:00:00Z
status: human_needed
score: 13/13 must-haves verified
must_haves:
  truths:
    - 'DM Sans loads as primary body font across all pages'
    - 'Three animated gradient blobs float behind all page content'
    - 'Card and button border-radius tokens match prototype (20px cards, 14px buttons)'
    - 'CSS keyframe animations for blobs, fadeIn, fadeInUp, and spin are available globally'
    - 'Primary CTA buttons use warm amber gradient with rounded-14px corners'
    - 'Secondary CTA buttons use glass backdrop-blur effect with rounded-14px corners'
    - 'Navigation has full-width backdrop-blur with gradient underline on link hover'
    - 'Navigation logo shows FM with gradient ai suffix (no Sparkles icon)'
    - 'Footer has zero hardcoded slate/indigo classes'
    - 'Homepage hero has left-aligned content with orbit visual on the right'
    - 'Service cards display as 2x2 numbered grid (01-04) with gradient border hover'
    - 'All pages use card-gradient-border + rounded-card on cards'
    - 'MarketingMachinePage uses useTranslation with marketing_machine namespace in EN/NL/ES'
  artifacts:
    - path: 'index.html'
      provides: 'DM Sans Google Font link'
    - path: 'tailwind.config.js'
      provides: 'DM Sans fontFamily.sans, card/btn borderRadius tokens'
    - path: 'src/index.css'
      provides: 'Blob keyframes, card-gradient-border, fadeIn/fadeInUp/spin'
    - path: 'src/components/common/GradientMesh.tsx'
      provides: 'Global fixed gradient mesh background with 3 blobs'
    - path: 'src/components/common/OrbitVisual.tsx'
      provides: 'Decorative orbit rings with spinning dots and FM center'
    - path: 'src/components/common/CTAButton.tsx'
      provides: 'Warm gradient primary + glass secondary CTA variants'
    - path: 'src/components/landing/SimpleHeader.tsx'
      provides: 'Backdrop-blur nav with gradient underline, FM+ai logo'
    - path: 'src/components/common/Footer.tsx'
      provides: 'Footer with Living System tokens, zero slate/indigo'
    - path: 'src/components/landing/Hero.tsx'
      provides: 'Left-aligned hero + 2x2 service cards + OrbitVisual'
    - path: 'src/pages/LandingPage.tsx'
      provides: 'Landing page with GradientMesh wired globally'
    - path: 'src/components/landing/SimplifiedHeroMobile.tsx'
      provides: 'Mobile hero with blob background, warm CTAs, font-display'
  key_links:
    - from: 'index.html'
      to: 'tailwind.config.js'
      via: 'Font family declaration matches loaded font'
    - from: 'src/components/common/GradientMesh.tsx'
      to: 'src/index.css'
      via: 'Uses blob CSS classes defined in index.css'
    - from: 'src/pages/LandingPage.tsx'
      to: 'src/components/common/GradientMesh.tsx'
      via: 'GradientMesh rendered as global background'
    - from: 'src/components/landing/Hero.tsx'
      to: 'src/components/common/OrbitVisual.tsx'
      via: 'Hero renders OrbitVisual in the right side'
    - from: 'src/pages/MarketingMachinePage.tsx'
      to: 'public/locales/en/common.json'
      via: "useTranslation('common') + t('marketing_machine.*') calls"
human_verification:
  - test: 'Open homepage desktop and verify left-aligned hero with orbit animation on right'
    expected: 'Hero text left-aligned, spinning orbit rings visible on right side above lg breakpoint'
    why_human: 'Visual layout and animation quality cannot be verified programmatically'
  - test: 'Hover over service cards and nav links'
    expected: 'Service cards show gradient border on hover (amber to teal), nav links show gradient underline'
    why_human: 'Hover interaction quality and visual appearance need human eye'
  - test: 'Switch language to NL and ES on /marketing-machine'
    expected: 'All strings change to Dutch/Spanish translations with no missing keys'
    why_human: 'Translation quality and completeness need human review'
  - test: 'View site at 375px width on mobile'
    expected: 'Mobile hero renders with warm gradient CTAs, no horizontal scroll, blob background visible'
    why_human: 'Mobile layout and touch interaction quality need human verification'
  - test: 'Check all pages for visual consistency (About, Pricing, HowItWorks, Contact, Legal)'
    expected: 'All cards have rounded-card corners and gradient border hover, consistent design language'
    why_human: 'Overall visual cohesion across pages cannot be automated'
---

# Phase 11: Living System Full Rebuild Verification Report

**Phase Goal:** Complete structural rebuild of every page to match the Living System prototype. All existing page content, routes, i18n, and functionality must be preserved; only the visual structure, layout, and animations change.
**Verified:** 2026-03-13T12:00:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                 | Status   | Evidence                                                                                                                                                                                                        |
| --- | ------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | DM Sans loads as primary body font across all pages                                   | VERIFIED | index.html has DM+Sans Google Font link; tailwind.config.js fontFamily.sans = ['DM Sans', ...]                                                                                                                  |
| 2   | Three animated gradient blobs float behind all page content                           | VERIFIED | GradientMesh.tsx renders 3 blob divs (blob-warm, blob-cool, blob-mixed); CSS in index.css defines blob classes with blobFloat keyframes; LandingPage.tsx renders GradientMesh                                   |
| 3   | Card and button border-radius tokens match prototype (20px cards, 14px buttons)       | VERIFIED | tailwind.config.js borderRadius has card: '20px' and btn: '14px'                                                                                                                                                |
| 4   | CSS keyframe animations for blobs, fadeIn, fadeInUp, and spin are available globally  | VERIFIED | index.css contains blobFloat1, blobFloat2, blobFloat3, fadeIn, fadeInUp, spin keyframes                                                                                                                         |
| 5   | Primary CTA buttons use warm amber gradient with rounded-14px corners                 | VERIFIED | CTAButton.tsx primary variant: 'bg-gradient-to-br from-accent-human to-[#E8941A]'; baseClasses uses 'rounded-btn'                                                                                               |
| 6   | Secondary CTA buttons use glass backdrop-blur effect with rounded-14px corners        | VERIFIED | CTAButton.tsx secondary variant: 'bg-white/[0.04] backdrop-blur-[12px] border border-white/[0.08]'; uses rounded-btn                                                                                            |
| 7   | Navigation has full-width backdrop-blur with gradient underline on link hover         | VERIFIED | SimpleHeader.tsx: 'bg-[rgba(12,12,20,0.5)] backdrop-blur-[24px]'; nav links have after: pseudo-element with gradient underline                                                                                  |
| 8   | Navigation logo shows FM with gradient ai suffix (no Sparkles icon)                   | VERIFIED | SimpleHeader.tsx renders FM in white + ai with bg-gradient-to-r from-accent-human to-accent-system; no Sparkles import                                                                                          |
| 9   | Footer has zero hardcoded slate/indigo classes                                        | VERIFIED | grep for slate/indigo/gray-[0-9] in Footer.tsx returns 0 matches                                                                                                                                                |
| 10  | Homepage hero has left-aligned content with orbit visual on the right                 | VERIFIED | Hero.tsx: max-w-[720px] left-aligned content; OrbitVisual imported and rendered; absolute right-[4%] positioning                                                                                                |
| 11  | Service cards display as 2x2 numbered grid (01-04) with gradient border hover         | VERIFIED | Hero.tsx: grid grid-cols-1 md:grid-cols-2; SERVICE_CARDS array with numbers 01-04; card-gradient-border class                                                                                                   |
| 12  | All pages use card-gradient-border + rounded-card on cards                            | VERIFIED | grep confirms card-gradient-border in: AutomationsPage (6), ChatbotsPage (5), VoiceAgentsPage (5), AboutPage (6), PricingPage (1), HowItWorksPage (3), ContactPage (4), MarketingMachinePage (2), LegalPage (1) |
| 13  | MarketingMachinePage uses useTranslation with marketing_machine namespace in EN/NL/ES | VERIFIED | MarketingMachinePage.tsx uses useTranslation('common') with t('marketing_machine.\*'); all 3 locale files (EN, NL, ES) have marketing_machine namespace                                                         |

**Score:** 13/13 truths verified

### Required Artifacts

| Artifact                                          | Expected                                  | Status   | Details                                                                                                               |
| ------------------------------------------------- | ----------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `index.html`                                      | DM Sans Google Font link                  | VERIFIED | Line 49: DM+Sans:wght@300;400;500;600;700 loaded                                                                      |
| `tailwind.config.js`                              | DM Sans fontFamily, card/btn tokens       | VERIFIED | fontFamily.sans = ['DM Sans', ...]; borderRadius.card = '20px', borderRadius.btn = '14px'                             |
| `src/index.css`                                   | Blob CSS, card-gradient-border, keyframes | VERIFIED | 706 lines; blobFloat1-3, fadeIn, fadeInUp, spin keyframes; blob-warm/cool/mixed classes; card-gradient-border utility |
| `src/components/common/GradientMesh.tsx`          | Global gradient mesh background           | VERIFIED | 17 lines; renders 3 blob divs with fixed positioning, z-0, pointer-events-none                                        |
| `src/components/common/OrbitVisual.tsx`           | Decorative orbit rings                    | VERIFIED | 286 lines; 5 rings, 7 dots, 3 arc trails, 12 particles, FMai center text; SVG-based, CSS animations                   |
| `src/components/common/CTAButton.tsx`             | Warm gradient primary + glass secondary   | VERIFIED | 110 lines; warm gradient (from-accent-human to #E8941A), glass backdrop-blur, rounded-btn                             |
| `src/components/landing/SimpleHeader.tsx`         | Backdrop-blur nav, FM+ai logo             | VERIFIED | 563 lines; full-width backdrop-blur-[24px], gradient underline after: pseudo, FM+gradient-ai logo                     |
| `src/components/common/Footer.tsx`                | Living System tokens                      | VERIFIED | 149 lines; zero slate/indigo/gray hardcoded classes; uses text-text-secondary, border-border-primary, etc.            |
| `src/components/landing/Hero.tsx`                 | Left-aligned hero + 2x2 cards             | VERIFIED | 215 lines; max-w-[720px] left-aligned; 2x2 grid; card-gradient-border; OrbitVisual; no old bg layers                  |
| `src/pages/LandingPage.tsx`                       | GradientMesh wired globally               | VERIFIED | GradientMesh imported from common and rendered as first child in page wrapper                                         |
| `src/components/landing/SimplifiedHeroMobile.tsx` | Mobile hero with new design               | VERIFIED | 117 lines; blob background, CTAButton, font-display headings, font-mono badge, fadeIn CSS                             |
| `src/pages/AutomationsPage.tsx`                   | Prototype card patterns                   | VERIFIED | 6 instances of card-gradient-border + rounded-card; fadeIn animations (4 occurrences)                                 |
| `src/pages/ChatbotsPage.tsx`                      | Prototype card patterns                   | VERIFIED | 5 instances of card-gradient-border + rounded-card; fadeIn animations (4 occurrences)                                 |
| `src/pages/VoiceAgentsPage.tsx`                   | Prototype card patterns                   | VERIFIED | 5 instances of card-gradient-border + rounded-card; fadeIn animations (4 occurrences)                                 |
| `src/pages/AboutPage.tsx`                         | Prototype card patterns                   | VERIFIED | 6 instances of card-gradient-border + rounded-card; fadeIn animations (3 occurrences)                                 |
| `src/pages/PricingPage.tsx`                       | Prototype card patterns                   | VERIFIED | card-gradient-border + rounded-card present; fadeIn animations (4 occurrences)                                        |
| `src/pages/HowItWorksPage.tsx`                    | Prototype card patterns                   | VERIFIED | 3 instances of card-gradient-border + rounded-card; fadeIn animations (2 occurrences)                                 |
| `src/pages/ContactPage.tsx`                       | Glass form container + card patterns      | VERIFIED | Glass form: bg-white/[0.04] backdrop-blur-[12px] rounded-card; 4 instances of card-gradient-border                    |
| `src/pages/LegalPage.tsx`                         | Consistent typography                     | VERIFIED | rounded-card on content container; font-display on headings (5 occurrences)                                           |
| `src/pages/MarketingMachinePage.tsx`              | i18n + prototype layout                   | VERIFIED | useTranslation with t('marketing_machine.\*'); card-gradient-border + rounded-card on cards                           |
| `public/locales/en/common.json`                   | marketing_machine namespace               | VERIFIED | marketing_machine key present                                                                                         |
| `public/locales/nl/common.json`                   | marketing_machine namespace (NL)          | VERIFIED | marketing_machine key present                                                                                         |
| `public/locales/es/common.json`                   | marketing_machine namespace (ES)          | VERIFIED | marketing_machine key present                                                                                         |

### Key Link Verification

| From                       | To                             | Via                                | Status | Details                                                                                      |
| -------------------------- | ------------------------------ | ---------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| `index.html`               | `tailwind.config.js`           | DM Sans font declaration           | WIRED  | Both reference DM Sans                                                                       |
| `GradientMesh.tsx`         | `src/index.css`                | blob CSS classes                   | WIRED  | Component uses blob-warm/cool/mixed; CSS defines them                                        |
| `LandingPage.tsx`          | `GradientMesh.tsx`             | Import + render                    | WIRED  | Imported from common barrel, rendered in page                                                |
| `Hero.tsx`                 | `OrbitVisual.tsx`              | Import + render                    | WIRED  | Imported from common barrel, rendered in hero section                                        |
| `MarketingMachinePage.tsx` | `public/locales/*/common.json` | useTranslation + t() calls         | WIRED  | 25+ t('marketing_machine.\*') calls; all 3 locales have namespace                            |
| `SimpleHeader.tsx`         | `CTAButton.tsx`                | Import + render                    | WIRED  | CTAButton imported from common, rendered in header CTA                                       |
| `SimplifiedHeroMobile.tsx` | `CTAButton.tsx`                | Import + render                    | WIRED  | CTAButton imported, 2 instances rendered                                                     |
| `OrbitVisual.tsx`          | `src/index.css`                | spin keyframe + orbit-\* keyframes | WIRED  | Uses spin, orbit-pulse, orbit-particle-float, orbit-core-breathe -- all defined in index.css |
| `common/index.ts`          | `GradientMesh.tsx`             | Barrel export                      | WIRED  | export { GradientMesh } from './GradientMesh'                                                |
| `common/index.ts`          | `OrbitVisual.tsx`              | Barrel export                      | WIRED  | export { OrbitVisual } from './OrbitVisual'                                                  |

### Requirements Coverage

| Requirement               | Source Plan         | Description                                                                       | Status    | Evidence                                                                                         |
| ------------------------- | ------------------- | --------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------ |
| REQ-LIVING-SYSTEM-REBUILD | 11-01 through 11-07 | Complete structural rebuild of every page to match prototype-2-living-system.html | SATISFIED | All 13 observable truths verified; all artifacts exist, are substantive, and wired; build passes |

Sub-requirements breakdown:

- Switch body font from Inter to DM Sans: SATISFIED (index.html + tailwind.config.js)
- Add global GradientMesh background: SATISFIED (GradientMesh.tsx wired in LandingPage)
- Rebuild Hero with left-aligned layout + orbit visual: SATISFIED (Hero.tsx rebuilt)
- Rebuild service cards as 2x2 numbered grid: SATISFIED (Hero.tsx grid-cols-2 with 01-04)
- CTAButton primary warm amber gradient: SATISFIED (CTAButton.tsx from-accent-human)
- CTAButton secondary glass backdrop-blur: SATISFIED (CTAButton.tsx backdrop-blur-[12px])
- Navigation backdrop-blur + gradient underline + FM+ai logo: SATISFIED (SimpleHeader.tsx)
- Footer token cleanup: SATISFIED (zero slate/indigo/gray)
- Service pages structural rebuild: SATISFIED (all 3 have card-gradient-border + rounded-card)
- Supporting pages structural rebuild: SATISFIED (all 5 have card-gradient-border + rounded-card)
- MarketingMachinePage i18n: SATISFIED (useTranslation, EN/NL/ES locales)
- SimplifiedHeroMobile rebuild: SATISFIED (blob bg, warm CTAs, font-display)
- CSS animations replace Framer Motion where simple: SATISFIED (fadeIn/fadeInUp on hero load)
- Preserve all existing content, routes, i18n, functionality: SATISFIED (build passes, i18n keys maintained)

### Anti-Patterns Found

| File                        | Line   | Pattern                                     | Severity | Impact                                                |
| --------------------------- | ------ | ------------------------------------------- | -------- | ----------------------------------------------------- |
| `src/pages/ContactPage.tsx` | 35     | TODO: Integrate with backend/CRM            | Info     | Pre-existing; not related to phase 11                 |
| `src/pages/LandingPage.tsx` | 49     | Comment: "Now with placeholders"            | Info     | Stale comment from earlier phase; cosmetic only       |
| `src/pages/LoginPage.tsx`   | 75, 94 | Uses blue-300/50, blue-500 hardcoded colors | Info     | Pre-existing; LoginPage was not in scope for phase 11 |

No blocker or warning-level anti-patterns found in phase 11 deliverables.

### Human Verification Required

### 1. Homepage Desktop Visual Quality

**Test:** Open homepage at desktop width (1280px+). Check hero layout, orbit animation, service cards.
**Expected:** Hero text left-aligned (max-width 720px), orbit visual spinning on right with colored dots and FM center text, 2x2 service cards with gradient border appearing on hover, warm amber CTA buttons, floating gradient blobs in background.
**Why human:** Visual layout proportions, animation smoothness, and overall aesthetic quality.

### 2. Navigation Interactions

**Test:** Hover over nav links and services dropdown. Check logo appearance.
**Expected:** Gradient underline (amber to teal) grows on link hover. Services dropdown has backdrop-blur glass background. Logo shows "FM" white + "ai" gradient text. Scrolled state reduces padding.
**Why human:** Hover animation timing and visual quality.

### 3. Service and Supporting Pages Consistency

**Test:** Visit /automations, /chatbots, /voice-agents, /about, /pricing, /how-it-works, /contact, /legal.
**Expected:** All cards have rounded-card (20px) corners and gradient border on hover. Consistent design language. No jarring visual differences between pages.
**Why human:** Cross-page visual consistency assessment.

### 4. MarketingMachinePage Language Switching

**Test:** Visit /marketing-machine. Switch to NL, then ES via language switcher.
**Expected:** All hero text, module descriptions, pricing tiers, and CTAs change language. No missing translation keys (no raw key strings visible). Dutch and Spanish read naturally.
**Why human:** Translation quality and completeness.

### 5. Mobile Hero Experience

**Test:** View homepage at 375px width (mobile viewport).
**Expected:** Mobile hero renders with centered layout, warm gradient CTAs stacked vertically, subtle blob background, no horizontal scroll, font-display headings.
**Why human:** Mobile layout and responsive behavior.

### Gaps Summary

No gaps found. All 13 observable truths verified programmatically. All artifacts exist, are substantive (not stubs), and are properly wired. Build passes without errors.

The only remaining step is human visual verification to confirm the overall aesthetic quality matches the prototype design language and that animations/interactions feel correct in-browser.

---

_Verified: 2026-03-13T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
