---
phase: 09-living-system-page-conversion
plan: 01
subsystem: ui
tags: [react, tailwind, framer-motion, design-tokens, living-system]

requires:
  - phase: 03-design-overhaul
    provides: Living System design tokens (tailwind.config.js), CTAButton, SystemPanel, SectionContainer components

provides:
  - SimpleHeader converted to Living System — bg-bg-surface, text-accent-system, rounded-sm, CTAButton CTA
  - Footer converted to Living System — text-accent-system icons, text-text-muted links, border-border-primary
  - Hero converted to Living System — bg-bg-deep, gradient-flow headlines, teal neural network, CTAButton CTAs
  - SimplifiedHeroMobile converted to Living System — bg-bg-deep, gradient-flow headlines, accent-system particles

affects:
  - 09-02: Homepage components (FeaturesSection, SocialProof, FeatureShowcase) — same token patterns
  - All service/supporting pages that share SimpleHeader and LandingFooter

tech-stack:
  added: []
  patterns:
    - 'bg-bg-deep for all page/section wrapper backgrounds (replaces from-slate-950 via-blue-950 gradient)'
    - 'CTAButton for all Calendly CTAs — no more hand-rolled gradient buttons or local state'
    - 'bg-gradient-flow bg-clip-text text-transparent for brand gradient text headings'
    - 'rounded-sm on all panel/card elements — no rounded-xl or rounded-2xl'
    - 'SVG gradients use #00D4AA (teal) and #F5A623 (amber) hex values directly'

key-files:
  created: []
  modified:
    - src/components/landing/SimpleHeader.tsx
    - src/components/landing/Footer.tsx
    - src/components/landing/Hero.tsx
    - src/components/landing/SimplifiedHeroMobile.tsx

key-decisions:
  - 'CTAButton replaces all hand-rolled Calendly anchor/motion.a elements in header and hero'
  - "SVG inline gradients (NeuralNetwork, GradientOrbs) use hex values directly (#00D4AA, #F5A623) rather than Tailwind tokens since SVG stopColor doesn't support Tailwind classes"
  - 'SimpleHeader CTA button simplified from motion.a with animated gradient to CTAButton size=sm — preserves all other motion wrappers'
  - "Hero's green-400 floating Zap icon reassigned to text-accent-human (amber) for Living System palette alignment"

patterns-established:
  - 'Pattern: Page wrapper — bg-bg-deep replaces all from-slate-950 via-blue-950 to-slate-900 gradients'
  - 'Pattern: Nav active states — text-accent-system + bg-accent-system/10 replaces text-blue-400 + bg-blue-500/10'
  - 'Pattern: Dropdown menus — bg-bg-elevated border border-border-primary rounded-sm replaces bg-slate-900/95 backdrop-blur-xl rounded-xl'
  - 'Pattern: Status badge — bg-accent-system/10 border-accent-system/20 rounded-sm replaces bg-purple-500/10 border-purple-500/20 rounded-full'
  - 'Pattern: Social icons — text-accent-system hover:text-text-primary replaces text-slate-400 hover:text-white'

requirements-completed:
  - REQ-PAGE-CONVERSION

duration: 8min
completed: 2026-03-13
---

# Phase 09 Plan 01: Homepage Foundation Components — Living System Conversion Summary

**SimpleHeader, Footer, Hero, and SimplifiedHeroMobile converted from indigo/violet/blue glassmorphism to Living System teal/amber tokens — zero old palette classes remain in all 4 files**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-13T01:18:38Z
- **Completed:** 2026-03-13T01:26:09Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- SimpleHeader: removed backdrop-blur glassmorphism, replaced brand gradient with text-accent-system, replaced hand-rolled Calendly CTA button with CTAButton component, converted all nav states and dropdown backgrounds to Living System tokens
- Footer: converted icon colors to text-accent-system, links to text-text-muted, status badge from purple to teal, borders to border-border-primary
- Hero: updated page wrapper to bg-bg-deep, neural network SVG gradients to teal/amber hex colors, particle effects to accent-system, headline gradient to bg-gradient-flow, all CTA buttons replaced with CTAButton (Calendly and href variants), floating icons updated to text-accent-system/human
- SimplifiedHeroMobile: grid lines to teal rgba, glow orbs to teal/amber radial gradients, particles to bg-accent-system/30, headline to bg-gradient-flow, CTAs to CTAButton component, status dot to bg-accent-system

## Task Commits

Both tasks were already committed in a prior session (commit `3268046` and HEAD state):

1. **Task 1: Convert SimpleHeader and Footer to Living System tokens** - `3268046` (feat(09-02) — committed in prior session alongside FeaturesSection/FeatureShowcase)
2. **Task 2: Convert Hero and SimplifiedHeroMobile to Living System tokens** - committed at HEAD (verified via git show, zero diff confirmed)

Note: Work was committed in a prior session with mismatched plan label (09-02 message). The actual changes are present and verified in HEAD.

## Files Modified

- `src/components/landing/SimpleHeader.tsx` — Living System header: bg-bg-surface, CTAButton, text-accent-system brand, rounded-sm dropdowns, no backdrop-blur
- `src/components/landing/Footer.tsx` — Living System footer: text-accent-system icons, text-text-muted links, border-border-primary dividers, teal status badge
- `src/components/landing/Hero.tsx` — Living System hero: bg-bg-deep wrapper, teal/amber SVG neural network, bg-gradient-flow headlines, CTAButton for all CTAs
- `src/components/landing/SimplifiedHeroMobile.tsx` — Living System mobile hero: bg-bg-deep, teal grid/glow, gradient-flow headline, CTAButton

## Decisions Made

- CTAButton replaces all hand-rolled Calendly anchor/button elements — state management removed from parents
- SVG inline elements use hex values #00D4AA / #F5A623 directly since SVG stopColor does not support Tailwind class names
- Hero's floating icon colors reassigned to text-accent-system (teal) for Bot/TrendingUp and text-accent-human (amber) for Brain/Zap — matches Living System semantic intent

## Deviations from Plan

None — plan executed exactly as specified. All 4 files converted with zero old palette classes remaining. All Framer Motion animations preserved (41 motion wrappers in Hero, 9 in SimplifiedHeroMobile).

## Issues Encountered

- Previous session had already committed the conversions for all 4 files under commit `3268046` (which was labeled as "09-02" but included SimpleHeader + Footer in addition to FeaturesSection + FeatureShowcase). Hero and SimplifiedHeroMobile were also already at HEAD with Living System tokens. This plan is confirming and documenting that completed work.

## Next Phase Readiness

- Homepage foundation (highest-visibility components) fully converted — brand transition is visible on first load
- Plan 09-02 (SocialProof, FeaturesSection, FeatureShowcase) already complete per existing SUMMARY
- Plans 09-03, 09-04 (service pages, supporting pages) also already complete per existing SUMMARYs
- Ready for Plan 09-05 (common components, LoadingFallback, FloatingNav, CookieConsent, CSS utilities)

---

_Phase: 09-living-system-page-conversion_
_Completed: 2026-03-13_
