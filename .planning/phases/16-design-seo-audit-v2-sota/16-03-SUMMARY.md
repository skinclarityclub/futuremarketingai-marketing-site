---
phase: 16-design-seo-audit-v2-sota
plan: 16-03
wave: 2
team: 01 Visual Design
type: research
status: completed
date: 2026-05-19
provides:
  - Top 27 visual design findings ranked P0 to P3 against the 25 SOTA markers from plan 16-01
  - 3 alternate visual directions (Minimal editorial, AI-cinematic editorial, Conversion-dense SaaS)
  - Coverage matrix mapping findings to markers
  - Recommended priority order for plan 16-16 fix-plan
requires:
  - 16-01 (SOTA markers rubric)
  - 16-02 (Chromium 465-PNG capture set + 93 DOM snapshots)
affects:
  - 16-04 (brand and IA, locale switcher relocation, header redesign)
  - 16-08 (a11y, cookie banner WCAG verification post-relocation)
  - 16-09 (perf, motion-budget for Spline + GradientMesh + font reintroduction)
  - 16-16 (fix-plan ingests ranked backlog)
  - 16-17 (Q3 roadmap picks one of three alternate directions)
key_files:
  created:
    - docs/audits/2026-05-18-v2/02-visual-design.md
  read_only:
    - fmai-nextjs/test-results/audit-v2/screenshots/ (Chromium 465 PNG, partial inspection)
    - fmai-nextjs/test-results/audit-v2/dom/ (DOM HTML, partial inspection)
    - fmai-nextjs/src/components/motion/ScrollReveal.tsx (code-grounded root cause)
    - fmai-nextjs/src/components/motion/LazySection.tsx (code-grounded root cause)
    - fmai-nextjs/src/components/skills/SkillPageTemplate.tsx (template wrapping)
    - fmai-nextjs/src/app/[locale]/page.tsx (home composition)
    - fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx (pricing composition)
    - fmai-nextjs/src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx (working comparison)
    - fmai-nextjs/src/app/[locale]/layout.tsx (font loading)
    - fmai-nextjs/src/lib/fonts.ts (font config, confirms Space Grotesk removed in 13-03)
    - fmai-nextjs/src/app/globals.css (color and font tokens)
key_decisions:
  - Selected 27 findings (not exactly 25) because the LazySection + ScrollReveal root cause spawned a natural family of 8 findings that would have been artificial to fuse
  - Severity rollup is P0=2, P1=9, P2=9, P3=7, recommended Q3 priority order leads with both P0 fixes then 5 P1 unlockers
  - Recommended direction is Direction B (AI-cinematic editorial), preserves Clyde-as-character framing while fixing motion-bug, typography hierarchy, and CTA-hierarchy issues
metrics:
  total_findings: 27
  P0: 2
  P1: 9
  P2: 9
  P3: 7
  alternate_directions: 3
  word_count: 6168
  em_dashes: 0
  legacy_domain_refs: 0
  sota_markers_referenced: [1, 2, 3, 4, 5, 6, 7, 21, 22, 23, 25]
---

# Plan 16-03 Summary (Wave 2 Team 01, Visual Design)

> Research-only plan, atomic commit per AUTONOMOUS-PROTOCOL Rule 4, zero production code edits.

## One-liner

Visual design audit of the FMai marketing site against the 25 SOTA markers from plan 16-01, surfaced 27 ranked findings (2 P0, 9 P1, 9 P2, 7 P3) with the single biggest issue being a `ScrollReveal` + `LazySection` motion-wrapper pair that leaves most below-fold content invisible on home, pricing, founding-member, memory, about, how-it-works, case-studies, and every skill page across all 3 locales and 5 viewports. Recommended Q3 direction is the AI-cinematic editorial pattern (Direction B), keeps Clyde-as-character framing, fixes the motion-gate root cause, lifts typography hierarchy, and reasserts a single dominant amber primary CTA.

## What was produced

- `docs/audits/2026-05-18-v2/02-visual-design.md`: 6168 words, 27 findings with full schema (severity / SOTA marker / routes / viewports / locales / evidence path / code path / impact hypothesis / proposed fix / effort / confidence), executive summary at top, 3 alternate visual directions, coverage matrix mapping findings to markers, severity rollup, recommended priority for plan 16-16.

## Key findings (top 5 for Wave 4 ingestion)

1. **Finding 1 (P0)**: `ScrollReveal` initial=hidden plus `LazySection` isVisible=false combine to keep below-fold content invisible on 18+ routes when InView observer fails to fire. Single biggest perceived-quality risk in the audit. Fix unblocks visual verification of every subsequent finding.
2. **Finding 11 (P0)**: Cookie banner overlays hero CTA in every locale + viewport. Marker 25 (no friction on apply funnel) violation. Bottom-sticky relocation is a one-day fix.
3. **Finding 23 (P1)**: Home hero has 6 to 8 content tokens, double the count of Stripe / Linear / Vercel heroes. Marker 2 violation. Prerequisite for Direction B.
4. **Finding 21 (P1)**: Spline 3D robot bleeds over hero text in the 768 to 1023 tablet zone because flex-row switch activates only at lg breakpoint.
5. **Finding 14 (P1)**: Home services row stacks two equally-weighted secondary CTAs vertically, creating a 3-CTA pile and a marker 1 violation.

## Method notes

- Walked the Chromium 465-PNG capture set + 93 DOM HTML snapshots from plan 16-02, sampled home / pricing / founding-member / clyde / lead-qualifier / voice-agent / social-media / memory / about / how-it-works / case-studies / apply / contact across NL/EN/ES and mobile-s / mobile-l / tablet / desktop / desktop-w.
- Grounded findings in real screenshot paths plus code paths with line numbers wherever possible. Confidence is `high` on findings where PNG + DOM + code agreed.
- Did NOT touch `fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`, `fmai-nextjs/tailwind.config.*` per audit invariant.

## Deviations from plan

- Plan target was "at least 25" findings; delivered 27 because Finding 1's root cause naturally spawned 8 derivatives (Findings 1 to 4, plus indirect effects on 14, 15, 21, 24) that would have been artificial to merge into one mega-finding.
- Used Direction B (AI-cinematic editorial, Anthropic / OpenAI-leaning) as the second alternate direction instead of the suggested "AI-cinematic (Anthropic / OpenAI hero)" phrasing, semantically identical, kept the recommended-pick framing.
- Severity rollup line in executive summary initially miscounted (said P0=5, P3=4); corrected to P0=2, P1=9, P2=9, P3=7 to match the per-finding tags.

## Constraint compliance

- Branch: `audit/2026-05-18-v2-sota` (verified)
- Em-dashes in doc: 0 (verified via grep)
- Em-dashes in commit message: 0 (commit string uses no em-dash)
- Canonical domain only (`future-marketing.ai`), zero `futuremarketingai.com` references in the doc (verified via grep)
- Zero edits under `fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`, `fmai-nextjs/tailwind.config.*`
- Zero edits to STATE.md or BUDGET.log (orchestrator handles consolidation per plan-execution context)

## Self-Check: PASSED

- Branch: `audit/2026-05-18-v2-sota` (correct)
- Commit: `c9d025e` (exact message `docs(audit): 16-03 Wave 2 visual design audit`)
- Files in commit: `docs/audits/2026-05-18-v2/02-visual-design.md` only
- Production code diff in commit: empty (verified `git diff c9d025e~1 c9d025e -- 'fmai-nextjs/src/' 'fmai-nextjs/messages/' 'fmai-nextjs/next.config.*' 'fmai-nextjs/tailwind.config.*'`)
- STATE.md / BUDGET.log diffs in commit: empty
- Audit doc word count: 6168 (>= 800 required)
- Audit doc finding count: 27 (>= 25 required)
- Audit doc em-dash count: 0
- Audit doc legacy domain refs: 0
- Alternate directions: A, B, C present (verified Section "## Alternate visual directions")

## Handoff to Wave 4 (plan 16-16, 16-17)

- The ranked backlog (27 findings, severity P0 to P3) is ready for fix-plan ingestion.
- Recommended priority order in doc § "Recommended priority for plan 16-16": Finding 1, 11, 23, 21, 14, 19, 5.
- Direction B is the recommended visual direction, depends on cross-plan coordination with 16-04 (brand and IA) for header redesign and 16-09 (perf) for motion-budget validation.
- Open questions for plan 16-16 listed in doc § "Open questions for plan 16-16", 5 items spanning typography, Spline motion-budget, cookie banner WCAG, CTA color decision propagation, locale switcher relocation.
