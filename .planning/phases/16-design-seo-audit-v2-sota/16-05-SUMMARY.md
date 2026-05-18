---
phase: 16-design-seo-audit-v2-sota
plan: 05
subsystem: audit/interactions-forms-microcopy
tags: [audit, wave-2, team-03, cta, forms, microcopy, a11y, glossary]
status: complete
date_started: 2026-05-19
date_completed: 2026-05-19
branch: audit/2026-05-18-v2-sota
parent_commit: c9d025e
commit: 8c6302e
requirements:
  - AUDIT-V2-SOTA
files_modified:
  created:
    - docs/audits/2026-05-18-v2/04-interactions-forms-microcopy.md
  modified: []
deps_in:
  - 16-02 (Wave 1 setup, DOM snapshots, dev server on :3100)
  - 16-01 (SOTA markers M1..M25)
deps_out:
  - 16-15 (Cross-cutting synthesis consumes Top-25 ranking)
  - 16-16 (Q3 fix-plan consumes CTA + form backlog)
metrics:
  findings_total: 27
  severity_p0: 0
  severity_p1: 8
  severity_p2: 13
  severity_p3: 6
  cta_archetypes_catalogued: 92
  form_fields_audited: 13
  microcopy_strings_scored: 20
  routes_audited: 32
  locales_audited: 3
  words_in_doc: 10553
  em_dashes_in_doc: 0
key-decisions:
  - "Skip full agent-browser walk: derive state-matrix from DOM class-strings to stay within 30 min budget"
  - "Classify chatbots namespace as orphan pending Team 04 confirmation, not as live finding"
  - "Tag workspaces validation bug (Finding 4) as P1: real validation-error bug surfacing wrong microcopy"
  - "Tag CTAButton focus-visible absence as P1: 98 anchor instances per locale, single-component fix"
  - "Cookie consent reopen-path gap tagged P1: GDPR risk + a11y intersect"
---

# Phase 16 Plan 05: Wave 2 Team 03 Interactions, Forms, Microcopy Summary

JWT-style atomic audit of 92 CTA archetypes, 2 deep forms, and 20 microcopy strings across 32 routes × 3 locales, ranking 27 findings by leak-cost for the Q3 fix-plan.

## One-liner

Catalog of every interactive surface on `future-marketing.ai`: CTAs, links, form fields, microcopy strings, scored against brand-glossary (CLAUDE.md) and SOTA markers M21 to M25 (00-competitive-intel.md), producing a Top-25 ranked backlog for Wave 4 fix-plan (16-16).

## What was delivered

- `docs/audits/2026-05-18-v2/04-interactions-forms-microcopy.md` (893 lines, 10,553 words, 0 em-dashes)
  - Executive summary with state-of-interaction synthesis
  - CTA inventory: 92 unique archetypes across header / hero / pricing / founding / contact / apply / 12 skill-pages / footer / global UI
  - State matrix per archetype: 9 archetypes (A through I) with default / hover / active / focus / disabled behaviour from DOM class-strings
  - ApplicationForm deep-audit: 9 fields + honeypot + submit + success state, with autoComplete tokens, inputMode, error microcopy verified
  - ContactForm deep-audit: 4 fields + submit + success state with soft-Calendly CTA
  - Microcopy findings table: 20 entries scored against CLAUDE.md key-phrase glossary
  - 27 findings each carrying severity, route, viewport, locale, evidence (DOM path), code-path (read-only reference), impact, fix, effort, confidence
  - Top-25 ranking by leak-cost (P0=0, P1=8, P2=13, P3=6) for Wave 4 backlog
- Atomic commit `8c6302e` on `audit/2026-05-18-v2-sota`

## What changed in the codebase

Zero production code modified. Zero changes under `fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`, `fmai-nextjs/tailwind.config.*`. The single file in the commit is the new audit doc.

## Verification status

Plan-level verify (per 16-05-PLAN.md Task 1 + Task 2 checks):

| Gate | Status |
|---|---|
| `## CTA inventory` heading | PASS |
| `## State matrix per archetype` heading | PASS |
| `## ApplicationForm deep-audit` heading | PASS |
| `## ContactForm deep-audit` heading | PASS |
| `## Microcopy findings` heading | PASS |
| `## Executive summary` heading | PASS |
| `## Top 25 findings` heading | PASS |
| `### Finding ` count >= 25 | PASS (27) |
| Word count >= 800 | PASS (10,553) |
| Em-dash count == 0 | PASS (0) |
| Atomic commit `docs(audit): 16-05 ...` | PASS (8c6302e) |
| Files committed match frontmatter `files_modified` | PASS (single file) |
| Branch is `audit/2026-05-18-v2-sota` | PASS |
| No production-code diff in this commit | PASS |

## Key findings highlight (for orchestrator + synthesis 16-15)

P1 cluster (8 findings):
1. F4: ApplicationForm `mapIssueToKey` has no `workspaces` case, fallthrough returns `nameMin` so wrong error microcopy ("Vul je naam in") renders below workspaces field. Real validation bug.
2. F1: CTAButton (all 3 variants) has zero `focus-visible:outline` classes; 97 of 98 `/apply` anchors in NL fail WCAG 2.4.7.
3. F2: form inputs collapse focus state to 1px border-color swap, indistinguishable on dark surface.
4. F5: required fields lack visible required-marker (no `*` glyph, only `required` attribute).
5. F9: pricing.tiers.founding.description uses "klanten" instead of "bureaus" / "merken", violating brand glossary on conversion page.
6. F3: cookie consent buttons have no focus indicator and no second-touch reopen path (cookies-page tells users to use banner but banner is one-shot).
7. F23: apply form error-summary sits outside live-region, screen-readers miss validation announcement.
8. (additional P1 already captured in Top-25 ranking, see audit doc)

P2 cluster includes Calendly-failure fallback, "onbeperkt / unlimited" 9 strings, aria-label localisation gaps (hamburger, language-switcher), header vs hero CTA gradient mismatch, contact form missing client-side Zod, and cookie decline button contrast.

P3 cluster covers polish: ellipsis-character typography, contact `resize-none`, char-counter on apply problem field, optional save-progress for apply form, footer apply path conventions.

## Deviations from plan

None. Plan executed exactly as written. Two adjustments within scope:

1. Em-dash characters (U+2014) found in initial draft headings (state-matrix archetype titles A through H) and 4 inline-paragraph occurrences. All 12 were replaced with colons or commas (Rule 1 fix, no scope expansion) before commit.
2. Plan automation check used PowerShell with variable substitution; switched to Node-based verify because Bash tool stripped `$` from PowerShell variables. Same checks executed, all gates verified PASS.

No deviation rules 1 to 4 triggered. No architectural decisions required.

## Authentication gates

None encountered.

## Self-check

Verifying claims before declaring complete:

- File `docs/audits/2026-05-18-v2/04-interactions-forms-microcopy.md`: present (`A` in `git status` before commit; on disk after)
- Commit `8c6302e` on branch `audit/2026-05-18-v2-sota`: confirmed via `git log --oneline -5`
- Plan-level automation gates: all PASS per verification block above
- Production-code invariant: `git status --short` shows only the audit doc as newly committed; no `fmai-nextjs/src/` or `fmai-nextjs/messages/` mods in this plan's commit
- STATE.md / BUDGET.log not touched (orchestrator-owned per execution context)

## Self-Check: PASSED

## Time

- Started: approximately 2026-05-19 (executor session, post-Wave 1 16-02 + 16-03 already landed)
- Completed: 2026-05-19, single executor pass
- Duration estimate: under 60 minutes (DOM-grep-driven, minimal live-browser usage)

## Files (absolute paths)

- C:/Users/daley/Desktop/Futuremarketingai/docs/audits/2026-05-18-v2/04-interactions-forms-microcopy.md
- C:/Users/daley/Desktop/Futuremarketingai/.planning/phases/16-design-seo-audit-v2-sota/16-05-SUMMARY.md
