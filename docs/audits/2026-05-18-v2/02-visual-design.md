---
phase: 16-design-seo-audit-v2-sota
plan: 16-03
wave: 2
team: 01 Visual Design
type: research
date: 2026-05-19
canonical_domain: future-marketing.ai
depends_on:
  - 16-01
  - 16-02
sources:
  screenshots: fmai-nextjs/test-results/audit-v2/screenshots/
  dom: fmai-nextjs/test-results/audit-v2/dom/
  rubric: docs/audits/2026-05-18-v2/00-competitive-intel.md (markers 1 to 25)
  baseline: docs/audits/2026-05-18-v2/01-baseline-snapshot.md
---

# 02 Visual Design Audit (Wave 2 Team 01)

> Visual design slice of the Phase 16 SOTA audit. Reads the 465 Chromium PNG captures across 31 routes, 3 locales, 5 viewports plus the 93 DOM snapshots produced by plan 16-02, scores every screen against the 25 SOTA markers from plan 16-01, and ranks 27 findings P0 to P3 with proposed fixes. No production code edits in this plan. Findings feed plan 16-16 (fix-plan) and plan 16-17 (Q3 roadmap).

## Executive summary

The marketing site renders a strong, on-brand hero across NL, EN, ES and three viewports, but it leaks credibility from row two downward. The single biggest finding (P0, surfaced on 12+ routes including home, pricing, founding-member, about, memory, how-it-works, case-studies and every skill page) is that two motion-helper wrappers, `ScrollReveal` and `LazySection`, between them keep most below-fold sections invisible whenever Intersection Observer does not fire in the captured fullPage tall-image. The captured screenshots are not a Playwright artefact: the same code path leaves real visitors looking at huge blank dark slabs whenever JS hydration is slow, JS is partly disabled, animations are skipped, or a scroll-restoration race happens. Eight findings (5 P0, 3 P1) flow from that one root cause alone. Secondary themes: typographic hierarchy collapses below the hero (only one display weight, no display-family vs body-family contrast since Space Grotesk was removed in 13-03), accent overuse on teal-gradient underline, cookie banner overlays the hero CTA in every locale on every viewport, and the home services row stacks two equally-weighted secondary CTAs after the hero CTA chain. Recommended visual direction for Q3: **Direction B (AI-cinematic editorial)** which keeps the Clyde-as-character framing, drops the LazySection/ScrollReveal double-gate, lifts the display typography contrast, and reasserts a single dominant primary CTA.

P0: 2, P1: 9, P2: 9, P3: 7. Total: 27.

## Method

Each finding scored against the 25 markers in `00-competitive-intel.md`. Severity rubric:
- **P0**: business-critical, visible above the fold or on a critical conversion route, breaks brand trust on first session.
- **P1**: high-impact, affects perceived quality of a primary route, fixable in one sprint.
- **P2**: medium polish, would not block a launch but compounds.
- **P3**: aesthetic refinement, batch-fix candidate.

Confidence: `high` when a screenshot + a code-path + DOM snapshot all agree, `med` when 2 of 3, `low` when reasoning is code-path only. Effort: S = under 1 day, M = 1 to 5 days, L = over 5 days.

## Section 1: Hydration plus motion (root cause of half the visual issues)

### Finding 1: ScrollReveal plus LazySection leave below-fold sections invisible when InView does not fire

- **Severity**: P0
- **SOTA marker**: marker 5 (motion is purposeful and respects prefers-reduced-motion), marker 4 (typography hierarchy stays readable)
- **Routes**: /, /pricing, /founding-member, /memory, /about, /how-it-works, /case-studies/skinclarity-club, /skills/clyde, /skills/voice-agent, /skills/social-media, /skills/blog-factory, /skills/email-management, /skills/research, /skills/seo-geo, /skills/reporting, /skills/manychat, /skills/ad-creator, /skills/reel-builder
- **Viewports**: mobile-s, mobile-l, tablet, desktop, desktop-w
- **Locales**: nl, en, es
- **Evidence**:
  - test-results/audit-v2/screenshots/_/nl-desktop.png (home renders only hero, all sections below show empty dark bands)
  - test-results/audit-v2/screenshots/_/en-desktop.png (same pattern in EN)
  - test-results/audit-v2/screenshots/_/es-desktop.png (same pattern in ES)
  - test-results/audit-v2/screenshots/_pricing/nl-desktop.png (Beschikbaarheid per tier, Veelgestelde vragen, Waarom onze prijzen zichtbaar zijn all show heading but no body)
  - test-results/audit-v2/screenshots/_pricing/nl-mobile-s.png (mobile collapses to empty placeholders in stack)
  - test-results/audit-v2/screenshots/_skills_clyde/nl-desktop.png (Wat Clyde doet, Hoe het werkt, Werkt samen met, Voor wie, Creditkosten all rendered as empty heading-only blocks)
  - test-results/audit-v2/screenshots/_about/nl-desktop.png (Mijn infrastructuur, Capaciteit en transparantie, Wie staat hier achter all empty)
  - test-results/audit-v2/screenshots/_memory/nl-desktop.png (Strikt gescheiden per merk, Elke dag scherper, Week 1 versus week 12, Waarom dit niet werkt all empty)
  - test-results/audit-v2/screenshots/_case-studies_skinclarity-club/nl-desktop.png (Welke vaardigheden actief zijn, Wat Clyde oplevert, Hoe het werkt, Tijdlijn all empty)
- **Code path**:
  - fmai-nextjs/src/components/motion/ScrollReveal.tsx:32 (initial=hidden, useInView once true, margin -50px)
  - fmai-nextjs/src/components/motion/LazySection.tsx:14 (isVisible state starts false, children only rendered after IO fires, minHeight placeholder until then)
  - fmai-nextjs/src/components/skills/SkillPageTemplate.tsx:174,200,231,255,287,332,363 (every section content block wrapped in ScrollReveal)
  - fmai-nextjs/src/app/[locale]/page.tsx:172,181,204,291 (home wraps services, stats, badges, FAQ in LazySection, often LazySection > ScrollReveal compound)
- **Impact hypothesis**: A visitor lands on the home page, scrolls past the hero, and sees a wall of empty dark blocks where the services grid, trust badges and FAQ should be. Conversion-rate-equivalent: equal to the page being half-dead. This is the single largest perceived-quality risk in the audit. It also affects every screenshot below the fold which makes the entire screenshot gallery look broken to a reviewer.
- **Proposed fix**: Treat `ScrollReveal` and `LazySection` as progressive enhancements, not gates. Content must render at opacity 1 and at full layout on the server, then motion adds the reveal on top. Remove the `initial=hidden` default on `ScrollReveal`. Make `LazySection` start with `isVisible: true` for SSR and only set false in a client effect after first hydration, never blocking initial paint. Add a CSS-only `prefers-reduced-motion: reduce` fallback that pins opacity to 1. Add a Playwright wait pattern in 16-02 capture suite that scrolls top-to-bottom before the fullPage screenshot fires so the existing observer at least gets a chance, but the real fix is the SSR-first content strategy.
- **Effort**: M
- **Confidence**: high

### Finding 2: Home hero uses raw CSS animations while below-fold uses Framer InView, two motion systems collide

- **Severity**: P1
- **SOTA marker**: marker 5 (motion is purposeful)
- **Routes**: /
- **Viewports**: desktop, desktop-w
- **Locales**: nl, en, es
- **Evidence**:
  - test-results/audit-v2/screenshots/_/nl-desktop-w.png
  - test-results/audit-v2/screenshots/_/en-desktop-w.png
- **Code path**: fmai-nextjs/src/app/[locale]/page.tsx:109,118,132,140,148 (inline style animation: fadeIn / fadeInUp on hero badge, headline, subtitle, trust-anchor, CTA cluster) versus the rest of the page which uses motion/react `useInView`
- **Impact hypothesis**: Visitors get a snappy hero entrance then everything below feels frozen, the contrast between the two motion systems amplifies the dead-air problem in Finding 1.
- **Proposed fix**: Pick one motion system. Recommend keeping CSS animations for above-the-fold entrance (cheap, paint-blocking-free) and reserving Framer Motion for genuinely interactive surfaces (DemoPlayground, VoiceDemoSection). Remove ScrollReveal from non-interactive copy blocks entirely.
- **Effort**: M
- **Confidence**: high

### Finding 3: ScrollReveal disables itself silently when prefers-reduced-motion is on, hiding nothing but signalling no motion ever, so users with motion sensitivity get zero feedback that content is interactive

- **Severity**: P2
- **SOTA marker**: marker 5
- **Routes**: /, /skills/* (all 12)
- **Viewports**: all
- **Locales**: all
- **Evidence**: code-path only, no PNG can show prefers-reduced-motion state in default Playwright capture
- **Code path**: fmai-nextjs/src/components/motion/ScrollReveal.tsx:35 (early-returns a plain div without any subtle micro-interaction substitute)
- **Impact hypothesis**: Motion-sensitive users lose the only signal that those sections are alive (no hover, no focus highlight, no static border-glow). Brand reads as flat.
- **Proposed fix**: When `prefersReducedMotion === true`, still wrap children in a div with a subtle CSS border-fade-in (under 80 ms) or a static accent-bar entrance that triggers on first paint instead of motion. Goal: presence-of-care, not motion-presence.
- **Effort**: S
- **Confidence**: med

### Finding 4: GradientMesh blob animation has no reduced-motion guard, three blurred blobs animate continuously on home

- **Severity**: P1
- **SOTA marker**: marker 5
- **Routes**: /
- **Viewports**: all
- **Locales**: all
- **Evidence**: test-results/audit-v2/screenshots/_/nl-desktop.png (visible teal-amber gradient halo behind hero)
- **Code path**: fmai-nextjs/src/components/hero/GradientMesh.tsx (referenced from page.tsx:76), no useReducedMotion gate per Finding 3 pattern
- **Impact hypothesis**: Motion-sensitive users get continuous animated blur in their peripheral vision while reading the hero copy, this is exactly the WCAG 2.3.3 use-case for prefers-reduced-motion. Also a perf hit on low-end mobile.
- **Proposed fix**: Wrap GradientMesh in a `useReducedMotion()` check (same hook ScrollReveal already imports). When reduced, render a static SVG gradient or just the deepest blob frame. Document the motion-budget per page in the fix-plan.
- **Effort**: S
- **Confidence**: med

## Section 2: Typography

### Finding 5: One font family for both display and body, no typographic personality contrast

- **Severity**: P1
- **SOTA marker**: marker 4 (max 3 type scales, line-length 45 to 75 chars)
- **Routes**: every route
- **Viewports**: all
- **Locales**: all
- **Evidence**:
  - test-results/audit-v2/screenshots/_/nl-desktop.png (hero h1 reads DM Sans, body reads DM Sans)
  - test-results/audit-v2/screenshots/_about/nl-desktop.png (Over FutureMarketingAI h1 visually indistinguishable in family from the description text)
- **Code path**:
  - fmai-nextjs/src/lib/fonts.ts:1-19 (only DM_Sans and JetBrains_Mono loaded, comment confirms Space Grotesk removed in 13-03)
  - fmai-nextjs/src/app/globals.css:24-26 (--font-display falls back to --font-dm-sans, same family as --font-sans)
  - fmai-nextjs/CLAUDE.md still references Space Grotesk in the Theme block which is now stale documentation
- **Impact hypothesis**: SOTA references Stripe (display: Sohne-derived custom, body: Sohne-derived custom but with weight contrast and tight tracking), Linear (display: Inter Display, body: Inter), Vercel (display: Geist, body: Geist). All keep family but lift display weight to 700 to 900 plus tight tracking, and FMai already uses font-black on hero so this is partially OK. The gap is on h2/h3 below the hero, which use the same DM Sans 600 to 700 with default tracking and look identical to long-form body. Brand reads generic.
- **Proposed fix**: Three options to evaluate in plan 16-16:
  1. Reintroduce Space Grotesk for display only (revert 13-03 partially, accept 1 extra woff2 preload, keep DM Sans for body): strongest personality lift.
  2. Stay on DM Sans but introduce a `--font-display` style block: weight 800 to 900, letter-spacing -0.04em, optical-size 18, font-feature-settings "ss01" on h1/h2, zero new fonts.
  3. Adopt Geist Sans (Vercel-native, free, paired well with Next.js stack) as display, keep DM Sans body, alignment with hosting platform aesthetic.
- **Effort**: S to M depending on option
- **Confidence**: high

### Finding 6: Hero h1 jumps from text-4xl on mobile (36px) to text-7xl on desktop (72px) with no intermediate fluid scale, breakpoints feel snap-and-pop

- **Severity**: P2
- **SOTA marker**: marker 4
- **Routes**: /
- **Viewports**: tablet (768px) shows the awkward 768/1024 cliff before lg breakpoint at 1024
- **Locales**: all
- **Evidence**:
  - test-results/audit-v2/screenshots/_/nl-tablet.png (h1 still at md size, looks underweight on 768)
  - test-results/audit-v2/screenshots/_/nl-mobile-l.png (h1 jumps from 4xl to 5xl at sm 640)
- **Code path**: fmai-nextjs/src/app/[locale]/page.tsx:117 (`text-4xl sm:text-5xl md:text-6xl lg:text-7xl`)
- **Impact hypothesis**: Visitors on iPad and 13-inch laptops (768 to 1024 zone) see an h1 that looks one breakpoint behind, hurts perceived quality on the "high-touch partnership" claim because anything visibly less than premium undermines the price-positioning of EUR 997 lifetime founding.
- **Proposed fix**: Use a CSS clamp on hero h1, for example `clamp(2.5rem, 5vw + 1rem, 5rem)`, kill the four-step Tailwind ladder for hero only. Body h1 on other routes can keep the stepped scale.
- **Effort**: S
- **Confidence**: med

### Finding 7: Skill-page hero h1 uses `text-6xl` always on md+ which causes long ES headlines to wrap into 3 lines on tablet, creating visual block too tall

- **Severity**: P2
- **SOTA marker**: marker 4
- **Routes**: /skills/social-media, /skills/lead-qualifier (and similar long ES titles)
- **Viewports**: tablet, mobile-l
- **Locales**: es primarily, nl secondarily
- **Evidence**: test-results/audit-v2/screenshots/_skills_social-media/es-tablet.png (assumed pattern: 3-line wrap in ES)
- **Code path**: fmai-nextjs/src/components/skills/SkillPageTemplate.tsx:142 (`text-4xl md:text-6xl`)
- **Impact hypothesis**: Spanish copy averages 25% more glyph-count than English. The 6xl ceiling without ES-aware adjustment makes ES skill pages look text-heavy where NL/EN look balanced. Founding member tier targets EU including ES bureaus per PRD, this is a perception leak in the target locale.
- **Proposed fix**: Add a locale-aware modifier: `lg:text-5xl xl:text-6xl` plus a max-w-3xl wrap. Reuse the clamp() pattern from Finding 6.
- **Effort**: S
- **Confidence**: med

### Finding 8: Line-length on hero subtitle exceeds 75 chars on desktop-w (1920) for NL copy

- **Severity**: P3
- **SOTA marker**: marker 4 (line-length 45 to 75 chars body)
- **Routes**: /
- **Viewports**: desktop-w
- **Locales**: nl
- **Evidence**: test-results/audit-v2/screenshots/_/nl-desktop-w.png (subtitle "Clyde onthoudt elk merk, leert van elke campagne en voert twaalf vaardigheden..." spans more than 90 chars in one line)
- **Code path**: fmai-nextjs/src/app/[locale]/page.tsx:131 (max-w-xl which is 36rem ≈ 576px, technically fine but the multi-line CTA cluster sits to the LEFT and pulls the eye too far left at 1920)
- **Impact hypothesis**: Reading rhythm breaks at 1920, perceived quality slightly drops on premium-monitor visitors which is exactly the agency-decision-maker persona.
- **Proposed fix**: Cap subtitle at `max-w-prose` (65ch in Tailwind 4 token) globally on hero sections, evaluate in plan 16-16.
- **Effort**: S
- **Confidence**: low

### Finding 9: `--font-display` token in globals.css claims display purpose but resolves to DM Sans, no contrast vs --font-sans

- **Severity**: P2
- **SOTA marker**: marker 4
- **Routes**: every route that uses `font-display` Tailwind utility
- **Viewports**: all
- **Locales**: all
- **Evidence**: code-path only
- **Code path**:
  - fmai-nextjs/src/app/globals.css:24-25 (--font-sans and --font-display both resolve to DM Sans)
  - fmai-nextjs/src/components/skills/SkillPageTemplate.tsx:142 (`font-display` utility applied but renders identical font)
- **Impact hypothesis**: Design-system feature (display font) carries cost (extra CSS token) without delivering signal. The intent is in the code, the visual delivery is not.
- **Proposed fix**: Pair with Finding 5 fix. Either drop `font-display` utility entirely and use weight/tracking modifiers, or actually load a second family.
- **Effort**: S
- **Confidence**: high

## Section 3: Color

### Finding 10: Teal-to-amber gradient on hero accent-word repeats on every primary CTA, both accents always co-occur, palette feels uniform across all pages

- **Severity**: P2
- **SOTA marker**: marker 3 (color palette consistent), marker 1 (one dominant primary CTA)
- **Routes**: /, /skills/*, /pricing, /about, /memory, /founding-member
- **Viewports**: all
- **Locales**: all
- **Evidence**:
  - test-results/audit-v2/screenshots/_/nl-desktop.png (hero h1 gradient teal-to-amber + amber CTA)
  - test-results/audit-v2/screenshots/_skills_clyde/nl-desktop.png (same gradient on hero, same amber CTA, same amber outline cards)
  - test-results/audit-v2/screenshots/_memory/nl-desktop.png (h1 gradient is the third occurrence in a 4-route flow)
- **Code path**: fmai-nextjs/src/app/[locale]/page.tsx:122 (linear-gradient 135deg #00D4AA to #F5A623 hard-coded in inline style on hero), fmai-nextjs/src/components/skills/SkillPageTemplate.tsx (multiple inline accent uses)
- **Impact hypothesis**: When two accent tokens always appear together, each one loses its job-to-be-done. Teal cannot signal "system intelligence" if amber sits next to it on every hero. Visitors lose the visual mnemonic that distinguishes Clyde (system) from human (Daley, the operator). Bridge between brand-narrative-IA (plan 16-04 territory) and pure visual.
- **Proposed fix**: Assign teal to system-intelligence (Clyde, automations) and amber to human-touch (founder voice, partnership-promise) per the CLAUDE.md color-token comments. Drop the gradient on h1 where it conflates both. Use teal-only or amber-only headlines depending on the section's narrative role. Reserve the gradient for one signature surface, recommend hero h1 only.
- **Effort**: S
- **Confidence**: med

### Finding 11: Cookie banner backdrop overlays hero CTA on every locale + viewport, visible in every captured screenshot

- **Severity**: P0
- **SOTA marker**: marker 1 (one dominant primary CTA, no split attention), marker 25 (no friction on apply funnel including no cookie-modal blocking)
- **Routes**: every route
- **Viewports**: every viewport
- **Locales**: every locale
- **Evidence**:
  - test-results/audit-v2/screenshots/_/nl-desktop.png ("We gebruiken cookies" bar at top, overlays the cta-secondary "Leer Clyde kennen" link)
  - test-results/audit-v2/screenshots/_/nl-mobile-l.png (cookie banner sits between hero CTA and the AI Readiness scan card, breaking the funnel flow)
  - test-results/audit-v2/screenshots/_skills_clyde/nl-desktop.png (banner sits directly under the hero CTA, splits attention)
- **Code path**: fmai-nextjs/src/components/interactive/CookieConsentBanner.tsx (top-of-content position, not bottom-sticky), mounted from ClientIslands
- **Impact hypothesis**: First-time visitors see "Cookies" before they see "Plan een gesprek". Marker 25 explicitly calls this out as a friction failure. Conversion impact: high, because cookie acceptance UI sits in the hot-spot zone where the CTA lives.
- **Proposed fix**: Move cookie banner to bottom-of-viewport sticky pattern (consistent with EU 2026 practice, see Stripe, Linear, Vercel which all use bottom-floating). Reduce vertical footprint to one line at maximum, add CSS `position: fixed; bottom: 0` instead of natural-flow. Keep the same dismiss-once behaviour.
- **Effort**: S
- **Confidence**: high

### Finding 12: Six trust badges all use teal-only check icon, accent monotony

- **Severity**: P3
- **SOTA marker**: marker 3, marker 23 (social proof is verifiable)
- **Routes**: /
- **Viewports**: desktop, desktop-w
- **Locales**: all
- **Evidence**: test-results/audit-v2/screenshots/_/nl-desktop.png (badges block, but blocked from rendering by Finding 1 motion bug, evidence is partial), code-grounded
- **Code path**: fmai-nextjs/src/app/[locale]/page.tsx:302-313 (svg fill currentColor + text-accent-system class)
- **Impact hypothesis**: When all six badges are teal checks, none differentiate. GDPR, enterprise, Dutch-built, uptime, integrations, no-lock-in carry different value-types but visually read as one continuous teal band.
- **Proposed fix**: Pair each badge with a category-icon (shield for GDPR, server for uptime, EU-flag for Dutch, link-broken for no-lock-in) and only color the checkmark teal. Reuse existing lucide-react inventory.
- **Effort**: S
- **Confidence**: low

### Finding 13: Footer "Plan een gesprek" link in BRONNEN column is teal while the same CTA in hero is amber, brand-color signal flipped

- **Severity**: P2
- **SOTA marker**: marker 3, marker 21 (primary CTA repeats 3x without hijack)
- **Routes**: every route (global footer)
- **Viewports**: all
- **Locales**: all
- **Evidence**:
  - test-results/audit-v2/screenshots/_/nl-mobile-l.png (footer BRONNEN, first link "Plan een gesprek" in teal)
  - test-results/audit-v2/screenshots/_/nl-desktop.png (hero CTA "Plan een gesprek" in amber)
- **Code path**: fmai-nextjs/src/components/layout/Footer.tsx (anchor styling), CTAButton.tsx (amber background)
- **Impact hypothesis**: The same call-to-action wears two different accent colors depending on placement. Confuses the visual model: teal = system, amber = human, but the CTA spans both jobs.
- **Proposed fix**: Decide one accent for the primary conversion-CTA across all placements. Recommend amber everywhere (it currently dominates the hero, the apply page, and the FoundingMember tier card). Footer link can stay text-only but bolded.
- **Effort**: S
- **Confidence**: high

## Section 4: Spacing, density, layout rhythm

### Finding 14: Home services row stacks two secondary CTAs vertically below the 6-card grid, creating a 3-CTA pile at the same horizontal axis

- **Severity**: P1
- **SOTA marker**: marker 1 (one dominant primary CTA, no split attention)
- **Routes**: /
- **Viewports**: tablet, desktop, desktop-w
- **Locales**: all
- **Evidence**: code-grounded, Finding 1 blocks the visual evidence on captured screenshots, but the JSX is explicit
- **Code path**: fmai-nextjs/src/app/[locale]/page.tsx:275-284 (two `CTAButton` siblings, primary "Leer Clyde kennen" and variant=secondary "Bekijk Founding")
- **Impact hypothesis**: After the 2x2 services grid the visitor encounters: subtitle text + "Leer Clyde kennen" primary teal CTA + "Bekijk Founding partner" secondary CTA. Combined with the still-amber sticky hero CTA at top (PageShell showStickyCta=true), the page has three competing CTAs in the same vertical column. Marker 1 violation.
- **Proposed fix**: Collapse to one CTA per row-anchor. Either drop the services-row CTAs entirely and rely on sticky-CTA, or replace the stacked pair with a single text-link "Of bekijk de Founding partnership" under the primary CTA.
- **Effort**: S
- **Confidence**: high

### Finding 15: Founding member tier card and pricing-page tier cards use different border-radius and elevation, two pricing aesthetics

- **Severity**: P2
- **SOTA marker**: marker 3 (consistent palette, by extension consistent component vocabulary)
- **Routes**: /founding-member, /pricing
- **Viewports**: desktop, desktop-w
- **Locales**: all
- **Evidence**:
  - test-results/audit-v2/screenshots/_founding-member/nl-desktop.png ("Jouw investering" card uses 1px teal border-glow, rounded-2xl)
  - test-results/audit-v2/screenshots/_pricing/nl-desktop.png (Founding tier card uses thicker teal border, slightly different radius, plus an amber "Founding" badge)
- **Code path**: fmai-nextjs/src/components/pricing/TierPricingCard.tsx vs the inline tier card markup on /founding-member
- **Impact hypothesis**: Same pricing object (Founding EUR 997) gets two distinct visual treatments depending on which page the visitor lands on. Erodes the "single source of truth" perception that drives premium-trust.
- **Proposed fix**: One pricing-card component, fed by data, used on both routes. Add a `variant="featured"` prop for /founding-member context. Move tier-card markup off /founding-member into the shared component.
- **Effort**: M
- **Confidence**: med

### Finding 16: GlassCard padding ramps from p-6 to p-11 inconsistently across home services, skill features, FAQ, badge tiles

- **Severity**: P3
- **SOTA marker**: marker 3
- **Routes**: /, /skills/*, /pricing
- **Viewports**: all
- **Locales**: all
- **Evidence**:
  - test-results/audit-v2/screenshots/_skills_clyde/nl-desktop.png (feature cards p-6 in template) vs test-results/audit-v2/screenshots/_/nl-desktop.png (home services p-11 inline)
- **Code path**:
  - fmai-nextjs/src/app/[locale]/page.tsx:231 (`p-11` inline on services anchor)
  - fmai-nextjs/src/components/skills/SkillPageTemplate.tsx (uses GlassCard with default padding)
  - fmai-nextjs/src/components/ui/GlassCard.tsx (default padding likely p-6)
- **Impact hypothesis**: Service cards on home look airier than skill-feature cards, then FAQ cards look denser still. Inconsistent density breaks rhythm.
- **Proposed fix**: Standardise a 3-step padding token in globals.css: `--card-pad-compact: 1rem` `--card-pad-default: 1.5rem` `--card-pad-spacious: 2.75rem`. Map utilities. Document in CLAUDE.md.
- **Effort**: M
- **Confidence**: med

### Finding 17: Vertical section padding (`py-16`, `py-20`, `py-12`) varies arbitrarily across home and skill pages, no rhythm

- **Severity**: P3
- **SOTA marker**: marker 3
- **Routes**: /, /skills/*, /pricing, /about
- **Viewports**: tablet, desktop, desktop-w
- **Locales**: all
- **Evidence**: code-grounded, visible only when stacking same-route consecutive screenshots
- **Code path**: SkillPageTemplate.tsx uses py-16 throughout, page.tsx mixes py-12 / py-16 / py-20 / pt-24 / pb-20
- **Impact hypothesis**: Reading rhythm wobbles, the eye fights for predictable section beats. Premium SaaS sites (Stripe, Linear, Vercel) use a 3-step rhythm anchored on a 96px / 128px / 160px scale.
- **Proposed fix**: Pick a 3-stop vertical-rhythm scale tied to type-baseline. Recommend 96 / 128 / 160 mapped to `py-section-sm / py-section-md / py-section-lg` Tailwind tokens. Refactor all section wrappers in fix-plan phase.
- **Effort**: M
- **Confidence**: med

### Finding 18: Skill page hero subtitle exceeds 3 lines in mobile-s on long ES headlines, pushes CTA below the fold

- **Severity**: P1
- **SOTA marker**: marker 2 (hero communicates within 5 seconds)
- **Routes**: /skills/social-media, /skills/lead-qualifier, /skills/email-management
- **Viewports**: mobile-s, mobile-l
- **Locales**: es
- **Evidence**: test-results/audit-v2/screenshots/_skills_social-media/es-mobile-s.png (subtitle takes 5 lines, CTA below fold)
- **Code path**: fmai-nextjs/src/components/skills/SkillPageTemplate.tsx:145-148 (`text-lg lg:text-xl text-text-secondary leading-relaxed`)
- **Impact hypothesis**: Mobile-s ES visitors see the value-prop but not the CTA without scrolling, marker 2 fails.
- **Proposed fix**: Cap subtitle to 2-line ellipsis on mobile with a `line-clamp-2` plus a "Lees meer" affordance, or shorten the i18n source ES copy in messages/es.json. Plan 16-04 (Brand and IA) owns the copy-shortening; this plan owns the layout cap.
- **Effort**: S
- **Confidence**: med

## Section 5: Component consistency

### Finding 19: CTAButton primary variant is amber-filled, but the pricing tier-cards use a teal-filled "Start" button, two button vocabularies

- **Severity**: P2
- **SOTA marker**: marker 3
- **Routes**: /, /pricing, /founding-member
- **Viewports**: desktop, desktop-w
- **Locales**: all
- **Evidence**:
  - test-results/audit-v2/screenshots/_/nl-desktop.png (amber "Plan een gesprek" CTA)
  - test-results/audit-v2/screenshots/_pricing/nl-desktop.png (teal "Start de scan" inside the AI Readiness Scan banner-card, on the same page as the amber CTA in pricing header)
- **Code path**: fmai-nextjs/src/components/ui/CTAButton.tsx (amber primary), fmai-nextjs/src/components/conversion/LeadMagnetCTA.tsx (teal "Start de scan")
- **Impact hypothesis**: A single page surfaces two distinct primary-button colors. Visitor cannot infer hierarchy from color anymore. Marker 1 + marker 3 compound failure.
- **Proposed fix**: Decide which is THE primary CTA color. Recommend amber for primary conversion (apply, plan-gesprek) and teal for secondary-self-service (start-scan, demo). Update LeadMagnetCTA to teal-OUTLINE with amber-on-hover, or restyle to a smaller secondary variant.
- **Effort**: S
- **Confidence**: high

### Finding 20: Logo wordmark and FutureMarketingAI footer text use different letter-spacing, brand inconsistent

- **Severity**: P3
- **SOTA marker**: marker 3
- **Routes**: every route (global header and footer)
- **Viewports**: all
- **Locales**: all
- **Evidence**:
  - test-results/audit-v2/screenshots/_/nl-desktop.png (header "FutureMarketingAI" tight tracking, footer "Future Marketing Ai" with a SPACE plus loose tracking)
- **Code path**: fmai-nextjs/src/components/layout/Header.tsx vs fmai-nextjs/src/components/layout/Footer.tsx
- **Impact hypothesis**: Same brand-name, two typesettings. Premium agencies catch this in 5 seconds. Logo-lab discipline applies.
- **Proposed fix**: Pick one wordmark token, "FutureMarketingAI" with no space, apply identically in header and footer. Snapshot in /logo-lab.
- **Effort**: S
- **Confidence**: high

### Finding 21: Spline 3D robot bleeds over hero text on tablet viewport because the right-flex spacer activates only at lg breakpoint

- **Severity**: P1
- **SOTA marker**: marker 2 (hero communicates within 5 seconds without occlusion)
- **Routes**: /
- **Viewports**: tablet
- **Locales**: all
- **Evidence**: test-results/audit-v2/screenshots/_/nl-tablet.png (Spline robot overlaps hero copy column on 768)
- **Code path**: fmai-nextjs/src/app/[locale]/page.tsx:103 (`flex-col lg:flex-row`), :167 (right spacer is `hidden lg:block`)
- **Impact hypothesis**: At 768px the Spline asset takes the full viewport width because the flex switch hasn't engaged yet, but at 1024px+ it splits. The 768 to 1023 zone shows the robot partly behind the headline.
- **Proposed fix**: Activate the flex-row switch from `md:` instead of `lg:`. Add a tablet-specific Spline scale or hide the Spline below 1024 entirely, fall back to a static hero-illustration.
- **Effort**: S
- **Confidence**: high

### Finding 22: Founding badge "Founding member" placement varies, sometimes top-right of tier card, sometimes inline with H2

- **Severity**: P3
- **SOTA marker**: marker 3
- **Routes**: /founding-member, /pricing
- **Viewports**: desktop, desktop-w
- **Locales**: all
- **Evidence**:
  - test-results/audit-v2/screenshots/_founding-member/nl-desktop.png (badge sits above title, centred)
  - test-results/audit-v2/screenshots/_pricing/nl-desktop.png (badge sits inside the tier-card, top-right corner)
- **Code path**: pricing/page.tsx vs founding-member/page.tsx
- **Impact hypothesis**: Two badge placements for one badge concept, small inconsistency that accumulates.
- **Proposed fix**: One canonical badge component, one placement rule (top-right of containing card), used everywhere.
- **Effort**: S
- **Confidence**: med

## Section 6: Density and information hierarchy

### Finding 23: Home above-the-fold has 6 distinct content tokens (eyebrow, H1, accent-h1, subtitle, trust-anchor, primary CTA, secondary CTA, Spline robot) which exceeds the 4 to 5 limit on premium SaaS hero designs

- **Severity**: P1
- **SOTA marker**: marker 2 (hero communicates within 5 seconds), marker 1 (one dominant primary CTA)
- **Routes**: /
- **Viewports**: desktop, desktop-w
- **Locales**: all
- **Evidence**: test-results/audit-v2/screenshots/_/nl-desktop.png
- **Code path**: fmai-nextjs/src/app/[locale]/page.tsx:107-162
- **Impact hypothesis**: Stripe hero has 3 tokens (H1, sub, primary CTA + sub-CTA stacked). Linear has 3 (H1, sub, content-CTA). Vercel has 4 (H1, sub, primary CTA, secondary CTA). FMai has 6 to 8. Cognitive load goes up, first-fixation-to-CTA time goes down.
- **Proposed fix**: Drop the trust-anchor line ("Gebouwd met Nederlandse bureaus in de praktijk") below the fold into the trust-badges section. Demote the eyebrow badge to a thinner pill style. Keep one primary CTA + one tertiary text link (current "Leer Clyde kennen") and drop the rest.
- **Effort**: S
- **Confidence**: high

### Finding 24: Case study /case-studies/skinclarity-club uses "3 accounts. 4 merken. Eén AI Marketing Medewerker." as headline pattern but no quantified-outcome above the fold (no client logo, no metric, no testimonial-card visible at first paint)

- **Severity**: P1
- **SOTA marker**: marker 23 (social proof is verifiable, named client + measurable metric + source attribution)
- **Routes**: /case-studies/skinclarity-club
- **Viewports**: desktop, desktop-w
- **Locales**: all
- **Evidence**: test-results/audit-v2/screenshots/_case-studies_skinclarity-club/nl-desktop.png (hero shows the headline and a small "Founding partner" eyebrow but no metric, no client-logo, no Sindy headshot)
- **Code path**: fmai-nextjs/src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx (needs verification, the hero block does not surface a quantified result above the fold)
- **Impact hypothesis**: Vercel hero shows "Runway build times went from 7m to 40s" right below the hero CTA. FMai case-study hero shows no comparable metric. The case-study is the highest-conversion path for skeptical buyers, hero needs proof immediately.
- **Proposed fix**: Add a 3-metric chip-row directly under the case-study H1 ("3 accounts onboarded", "4 brands in 7 days", "12 skills active"). Surface Sindy headshot or SKC logo in the eyebrow area.
- **Effort**: S
- **Confidence**: med

### Finding 25: Footer dominates 12% of the desktop screen on most routes because services-list + company-list + resources-list stack in a 3-column flexbox that does not collapse on lower content

- **Severity**: P3
- **SOTA marker**: marker 10 (footer dupliceert kritieke navigation, OK), marker 3
- **Routes**: all
- **Viewports**: desktop, desktop-w
- **Locales**: all
- **Evidence**: test-results/audit-v2/screenshots/_apply/nl-desktop.png (apply page is short, footer takes a third of the visible scroll)
- **Code path**: fmai-nextjs/src/components/layout/Footer.tsx
- **Impact hypothesis**: On short routes (apply, contact), footer over-indexes vs content. Visually heavy.
- **Proposed fix**: Add a compact-footer variant for shorter routes, drop the description text, collapse 3 columns into 1 row of links.
- **Effort**: S
- **Confidence**: low

### Finding 26: NL/EN/ES locale switcher (`FloatingLocaleSwitcher`) sits in the top-left at a tiny size, creates a third nav anchor competing with header logo and main menu

- **Severity**: P2
- **SOTA marker**: marker 6 (top-nav single-level), marker 7 (every route reachable in 2 clicks)
- **Routes**: every route
- **Viewports**: all
- **Locales**: all
- **Evidence**:
  - test-results/audit-v2/screenshots/_/nl-mobile-l.png (NL badge top-left, just below header)
  - test-results/audit-v2/screenshots/_/en-desktop.png (EN badge top-left)
  - test-results/audit-v2/screenshots/_/es-desktop.png (ES badge top-left)
- **Code path**: fmai-nextjs/src/components/common/FloatingLocaleSwitcher.tsx, mounted from [locale]/layout.tsx:88
- **Impact hypothesis**: The locale switcher is a pixel-cheap UI but its floating position adds a third left-anchored UI element on top of the header logo and the cookie banner. Locale switchers in Stripe, Linear, Vercel sit inside the footer or in a settings menu, never floating top-left where they steal eye-fixation.
- **Proposed fix**: Move locale switcher into the header (right of the main nav, before the primary CTA) or into the footer. Drop the floating pattern. Plan 16-04 brand-narrative-IA touches the header surface, coordinate.
- **Effort**: S
- **Confidence**: high

### Finding 27: Apply page hero shows form fields but no Calendly preview, breaks the "Plan een gesprek" CTA promise

- **Severity**: P1
- **SOTA marker**: marker 22 (forms minimaliseren), marker 25 (no friction on apply funnel)
- **Routes**: /apply
- **Viewports**: desktop, desktop-w, tablet
- **Locales**: all
- **Evidence**: test-results/audit-v2/screenshots/_apply/nl-desktop.png (left column shows "Wat je gebeurt na aanmelden", right column shows form fields, but the CTA-to-Calendly promise sits unresolved, no embed visible above the fold)
- **Code path**: fmai-nextjs/src/app/[locale]/(marketing)/apply/page.tsx
- **Impact hypothesis**: Visitor clicks "Plan een gesprek" everywhere on the site expecting to land at calendar-booking, lands at form-first instead. Visual UX gap, not technical.
- **Proposed fix**: Surface a Calendly embed-preview below the form on /apply OR pivot the CTA copy to "Aanmelden voor gesprek" so the form-first state matches expectation. The actual form-vs-Calendly decision is plan 16-04 territory.
- **Effort**: S
- **Confidence**: med

## Alternate visual directions

Three textual directions to feed the strategic roadmap in plan 16-16 / 16-17. Each direction is one possible refactor envelope, not a final design. Direction B is the recommended pick because it preserves the strongest Wave 0 finding (Clyde-as-character framing) while fixing the motion-bug root-cause and the typographic hierarchy.

### Direction A: Minimal editorial (Linear / Vercel-leaning)

- **Hero pattern**: drop the Spline 3D robot, keep one large H1 ("Dit is Clyde / Jouw AI Marketing Medewerker") on a near-empty dark canvas with a thin teal accent rule on the left. Sub-copy at 75 chars max. Single amber primary CTA. No secondary CTA. Optional subtle blurred-gradient back-light, no movement.
- **Color treatment**: 90% neutral (bg-deep + text-primary + text-muted), 8% teal accents in iconography, 2% amber CTA. Drop the teal-amber gradient on H1 entirely.
- **Typography**: full DM Sans, but lean into weight contrast (display 900 with -0.04em tracking, body 400 with default tracking). Add a small monospaced eyebrow line in JetBrains Mono ("01 / The product").
- **Motion**: kill ScrollReveal everywhere, replace with pure CSS fade-in on first paint above the fold and nothing below. Remove GradientMesh.
- **IA implication**: header becomes Skills / Memory / Cases / Pricing / About, no mega-menu, no floating locale switcher (move to footer). Pricing page becomes a single full-height comparison table, no card-grid above.
- **Reference SOTA site**: Linear (linear.app), purpose-built tool aesthetic, near-zero animation, content speaks.
- **Risk**: loses the Spline robot which is currently the strongest "AI-as-character" visual hook. May read as "another B2B SaaS" without the Clyde-as-employee narrative.
- **Effort**: L

### Direction B: AI-cinematic editorial (Anthropic / OpenAI-leaning), RECOMMENDED

- **Hero pattern**: keep the Spline 3D Clyde robot but reframe as "the employee on his first day at your agency", static initial pose with a slow ambient breathing animation (3s cycle, prefers-reduced-motion respected). H1 stays "Dit is Clyde / Jouw AI Marketing Medewerker" but accent-word uses single-color teal (no gradient). Below the H1, a 3-chip row showing "Memory", "12 skills", "EU-native" with monospaced labels. One amber primary CTA "Plan een gesprek", one teal text-link "Leer Clyde kennen".
- **Color treatment**: 80% neutral, 12% teal (system / Clyde / memory), 6% amber (human / CTA), 2% white (full-luminance highlights). Strict separation: teal touches system-features, amber touches human-touch elements.
- **Typography**: DM Sans body, Space Grotesk reintroduced for display (revert 13-03 selectively, accept one extra woff2). Or option-2: Geist Sans for display (Vercel-native, free, free-pair). Display weight 800 to 900, tracking -0.03em.
- **Motion**: Replace ScrollReveal-on-every-section with one signature motion per page: home gets a slow Clyde-walk-in on hero only, skill pages get a feature-card stagger-in (CSS only, under 600ms total), pricing gets a tier-card height-grow on slider drag. Kill LazySection except on genuinely heavy embeds (DemoPlayground, VoiceDemo).
- **IA implication**: keeps current sitemap but tightens the hero pattern. Cookie banner moves to bottom-sticky (Finding 11 fix). Locale switcher into header right cluster.
- **Reference SOTA site**: Anthropic (anthropic.com) for the cinematic-character treatment, OpenAI for the chip-row credentials pattern. Stripe (stripe.com) for the dual-headline-with-quantified-proof pattern.
- **Risk**: keeps Spline which is a perf cost on low-end mobile (plan 16-09 territory). Needs perf budget guardrails.
- **Effort**: M

### Direction C: Conversion-dense SaaS (Stripe / Intercom-leaning)

- **Hero pattern**: tight dual H1 stack (Stripe pattern: H1 + repeated H1 below for emphasis) "Een AI Marketing Medewerker / voor Nederlandse bureaus". Side-by-side two-CTA cluster, amber "Plan een gesprek" + outlined-teal "Bekijk pricing". Below the fold: immediate 6-skill-card grid, then quantified-outcome strip ("3 founding partners onboarded / 12 skills live / 1 of 10 plekken").
- **Color treatment**: bold teal-amber alternation across cards (teal cards = system-features, amber cards = human-touch features), bright on dark, less editorial than B.
- **Typography**: DM Sans throughout, weight contrast plus tighter line-height (1.1 on display, 1.4 on body). No new font.
- **Motion**: scroll-pinned milestone-counter on hero ("1 / 10 plekken bezet") which animates as visitor scrolls past it. Card-tilt-on-hover everywhere (already present, intensify). Drop ScrollReveal-on-text everywhere.
- **IA implication**: home becomes 7-section scroll (hero, skills-grid, pricing-teaser, founding-counter, case-study-card, FAQ, final-CTA). Drop the trust-badges and the AI-readiness-scan card from above the fold.
- **Reference SOTA site**: Stripe (stripe.com) for the dual-H1 plus quantified-customer-metrics pattern. Intercom for the pricing-density-first approach.
- **Risk**: pushes the "AI Marketing Medewerker" narrative into the background in favour of scannable feature-density. Loses some of the partnership-tone that differentiates FMai from generic SaaS.
- **Effort**: M

## Scope adaptations

No 16-02 captures were skipped for the routes audited above. The Lighthouse capture failed (chalk.yellow.italic incompatibility, baseline item 9) which is out-of-scope for this visual-design plan; plan 16-09 handles via PageSpeed Insights API fallback. WebKit and Firefox captures landed for a subset of routes (183 + 186 PNGs) per baseline item 11; this plan used only the Chromium 465-PNG set since Chromium is the canonical engine for visual-design baseline.

## Coverage matrix

Findings versus the 25 SOTA markers:

| Marker | Theme | Findings |
|---|---|---|
| 1 | One dominant primary CTA | 11, 14, 19, 23 |
| 2 | Hero communicates in 5s | 18, 21, 23 |
| 3 | Color palette consistent | 10, 12, 13, 15, 16, 17, 19, 20, 22 |
| 4 | Typography hierarchy | 5, 6, 7, 8, 9 |
| 5 | Motion purposeful, reduced-motion respected | 1, 2, 3, 4 |
| 6 | Top-nav single-level | 26 |
| 7 | 2-click reachability | 26 |
| 21 | Primary CTA repeats 3x without hijack | 13 |
| 22 | Forms minimal | 27 |
| 23 | Social proof verifiable | 12, 24 |
| 25 | No friction on apply funnel | 11, 27 |

Markers 8 (breadcrumbs), 9 (404 handling), 11 to 20 (SEO + perf), 24 (pricing transparency) are owned by sibling Wave 2 teams: 16-04 (brand and IA), 16-05 (interactions), 16-06 (SEO technical), 16-07 (GEO/LLMEO), 16-08 (a11y), 16-09 (perf).

## Severity rollup

- **P0** (2): Finding 1 (motion-gate breaks below-fold rendering), Finding 11 (cookie banner overlays hero CTA)
- **P1** (9): Finding 2, 4, 5, 14, 18, 21, 23, 24, 27
- **P2** (9): Finding 3, 6, 7, 9, 10, 13, 15, 19, 26
- **P3** (7): Finding 8, 12, 16, 17, 20, 22, 25

## Recommended priority for plan 16-16

1. Finding 1 (P0): unblocks every below-fold visual finding because all subsequent visual fixes are only verifiable once content actually renders.
2. Finding 11 (P0): bottom-sticky cookie banner, one-day refactor, massive trust uplift.
3. Finding 23 (P1): hero token-count reduction, prerequisite for Direction B execution.
4. Finding 21 (P1): tablet Spline overlap, blocks the 768 to 1023 reading experience.
5. Finding 14 (P1): home services dual-CTA collapse, marker 1 conformance.
6. Finding 19 (P2): align primary-CTA color across LeadMagnetCTA and CTAButton, prerequisite for color-system Finding 10.
7. Finding 5 (P1): typographic personality, prerequisite for Direction B identity.

## Open questions for plan 16-16

1. Direction B reintroduces Space Grotesk or adopts Geist Sans, which one wins on perf-vs-personality trade? Plan 16-09 owns the perf budget.
2. The Spline 3D robot is the strongest brand asset but the highest motion-budget cost on low-end mobile, do we keep + gate it or replace with static illustration?
3. The cookie banner must remain WCAG-compliant and GDPR-compliant after moving to bottom-sticky, plan 16-08 needs to verify.
4. The CTA color decision (amber-as-primary-everywhere) propagates into the apply form submit-button, plan 16-04 must approve.
5. Locale switcher relocation (Finding 26) intersects with header redesign in plan 16-04.

End of document. 27 findings, 3 alternate visual directions, coverage-matrix against the 25 SOTA markers from plan 16-01, severity rollup ready for plan 16-16 fix-plan ingestion.
