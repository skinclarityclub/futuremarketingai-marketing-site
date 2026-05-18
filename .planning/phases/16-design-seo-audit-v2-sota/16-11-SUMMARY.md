---
phase: 16-design-seo-audit-v2-sota
plan: 11
subsystem: audit-content-i18n
tags: [i18n, content-audit, glossary, em-dash, readability, flesch-kincaid, fernandez-huerta, mommers, gemini-grounded]

# Dependency graph
requires:
  - phase: 16-02
    provides: DOM snapshots 93 files in test-results/audit-v2/dom/
  - phase: 16-04
    provides: NL glossary scorecard 10 terms in 03-brand-narrative-ia.md sectie 2

provides:
  - i18n parity matrix NL/EN/ES (100 procent path-identical, 1644 leafs each)
  - ES glossary scorecard (NEW: 54-vs-1 CTA-canon-fragmentatie discovered)
  - EN glossary scorecard (NEW: AI Marketing Employee canon 100 procent)
  - Em-dash compliance scan (0 across 3 locales messages/*.json)
  - Readability scorecard per locale top-10 routes (NL Mommers, EN Flesch-Kincaid, ES Fernandez-Huerta)
  - Cultural-fit ES research (Gemini grounded call 11)
  - Hardcoded English DOM-scan (1 critical: DemoPlayground.tsx)
  - 25 ranked findings (4 P0, 9 P1, 9 P2, 3 P3)

affects: [16-15-cross-cutting-synthesis, 16-16-fix-plan, 17-content-i18n-cleanup]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "jq + python JSON-walk voor leaf-path parity-diff (100 procent identical confirmed)"
    - "Per-locale readability-formule: NL Mommers, EN Flesch-Kincaid, ES Fernandez-Huerta"
    - "Gemini grounded research budget tracking (call 11 of 100)"

key-files:
  created:
    - docs/audits/2026-05-18-v2/10-content-copy-i18n.md
  modified:
    - .planning/phases/16-design-seo-audit-v2-sota/BUDGET.log

key-decisions:
  - "ES CTA-canon recommendation: kies Agenda una llamada (de facto canon, 54 hits, Gemini-cited LinkedIn-strong) ipv Reserva una llamada (1 hit, header-only). Brand-decision: documenteer in CLAUDE.md Key-phrase glossary tabel."
  - "NL klant-naar-merk fix is high-priority op homepage stat-label + memory-page + case-study-hero subtitle. Conversion-funnel-critical."
  - "DemoPlayground.tsx hardcoded English greetings is P1 i18n-rule-violation: 4 strings need extraction naar messages/*.json + 3 locale-translations."
  - "/blog readability gebroken (Mommers 14.6 NL) is rendering-issue (thin SSR), niet copy-issue. Defer naar 16-06 SEO + 16-09 perf."
  - "Em-dash compliance op messages-level is 100 procent. MDX-blog + React-JSX-children em-dash-sweep is out-of-scope team 09; defer naar 16-15 synthesis."

patterns-established:
  - "i18n audit pattern: jq path-extraction + python walk + value-equality check + grep per glossary-term"
  - "Per-locale readability: extract DOM body-only (skip nav/header/footer/script/style), apply locale-specific formule"
  - "Gemini grounded budget-logging: 1 call per discrete cultural-fit-vraag in BUDGET.log"

requirements-completed: [AUDIT-V2-SOTA]

# Metrics
duration: ~40min
completed: 2026-05-19
---

# Phase 16 Plan 11: Wave 2 Content + Copy + i18n Audit Summary

**i18n parity 100 procent strak, em-dashes 0, maar ES-CTA-canon gefragmenteerd in 54 variants + NL "klant"-glossary-slip lekt op homepage + memory + case_studies (36 hits) + hardcoded English in DemoPlayground.tsx renders op /nl + /es lead-qualifier.**

## Performance

- **Duration:** ~40 min
- **Started:** 2026-05-19 (post 16-09 perf-audit completion)
- **Completed:** 2026-05-19
- **Tasks:** 2 (atomic single-commit per plan invariants)
- **Files modified:** 2 (`10-content-copy-i18n.md` created; `BUDGET.log` appended 1 line)
- **Words in audit doc:** 6915 (target was 800+)
- **Findings:** 25 (target was 25+)

## Accomplishments

- **i18n parity 100 procent confirmed**: NL/EN/ES alle 3 hebben identical 40 top-level namespaces + identical 1644 leaf paths (verified via `jq -r '[paths(scalars)] | map(join("."))' | sort | diff`). Phase 12-cleanup heeft hier strak werk geleverd.
- **ES CTA-canon-fragmentatie ontdekt**: 54 `Agenda una llamada` variants vs 1 `Reserva una llamada` (de jure canon per 03-brand-narrative-ia tabel). Cross-page brand-consistency-breach.
- **NL "klant" glossary-slip gequantificeerd**: 36 hits waar "merk" canonical is, met 9 high-impact hits op `/` (stat-tile) + `/memory` (USP-anchor + meta-description) + `/case-studies/skinclarity-club` (hero subtitle) + `/chatbots/demo` (4-cluster in ecommerce-tab).
- **Hardcoded English in DemoPlayground.tsx geidentificeerd**: 4 string-literals regel 28-34 die nooit door `useTranslations()` gaan, renders ongewijzigd op NL- + ES-pages. Faalt expliciet CLAUDE.md i18n-rule.
- **Em-dash + en-dash compliance**: 0 occurrences over alle 3 locale-files. Project-rule 100 procent nageleefd op messages-niveau.
- **Readability scorecard top-10 routes per locale**: NL Mommers, EN Flesch-Kincaid Reading Ease, ES Fernandez-Huerta. Pattern: NL scores systematisch lager (~9 punten) door compound-words; /blog kritisch laag op alle drie locales door thin SSR.
- **Gemini grounded ES cultural-fit (call 11)**: bevestigd dat beide `Reserva` + `Agenda` valide native EU-castellano zijn voor B2B-agency-audience. 5 EU-Spain SaaS-cites (chekin.com, ronspotflexwork.com, wiwink.com, founders-saas.eu, raiolanetworks.com).

## Task Commits

Atomic single-commit per plan invariants (geen task-split want plan-type is research):

1. **Audit doc + BUDGET.log append** - `b07cc16` (docs)

## Files Created/Modified

- `docs/audits/2026-05-18-v2/10-content-copy-i18n.md` (created) - 6915 words, 25 findings, frontmatter + i18n parity matrix + glossary scorecard NL/EN/ES + em-dash sweep + IK/WIJ slip-check + hardcoded-English DOM-scan + readability per locale + ES cultural-fit Gemini call + top-25 ranked + methodology + limits sections
- `.planning/phases/16-design-seo-audit-v2-sota/BUDGET.log` (modified) - 1 line appended: `gemini-flash-grounded call 11 of 100 (query: 16-11 ES CTA cultural-fit verb check Reserva vs Agenda una llamada)`

## Decisions Made

- **ES CTA recommendation = `Agenda una llamada`**: de facto canon (54 hits) > de jure canon (1 hit) + Gemini-cite LinkedIn-strong. Aanbeveling voor 16-16 fix-plan: 1 string-edit op `messages/es.json:6` ipv 54 string-edits. Brand-decision documenteren in CLAUDE.md.
- **NL klant-naar-merk-fix scope = 9 high-impact + 27 review**: 9 hits zijn pure conversion-funnel-critical (homepage stat + memory body + case-study hero + demo-cluster) en moeten in 16-16 fix-set. 27 randgevallen vereisen per-occurrence review.
- **DemoPlayground.tsx i18n-extract is P1 fix voor 16-16**: 4 strings naar `messages/*.json` namespace `demo.subtitles.*` + 3 locale-translations + component-refactor. Effort M.
- **/blog readability defer naar 16-06 + 16-09**: P0 score op alle 3 locales is rendering-artefact (thin SSR), niet copy-issue. Cross-ref 03 F19 + 08 perf audit.
- **Em-dash MDX-blog scope = out-of-team-09**: messages-level is clean; MDX + React-JSX-children + CSS-content-properties scope hoort bij 16-15 synthesis.

## Deviations from Plan

None. Plan executed exactly als geschreven. Plan-type is research-only, geen production-code edits, geen messages-edits.

## Issues Encountered

- **BUDGET.log race-condition tijdens 16-09 parallel commit**: eerste append van Gemini call 11 entry (timestamp 2026-05-18T18:47:20Z) is overschreven tijdens 16-09 perf-audit commit dat BUDGET.log compleet uitwerkte. Re-appended met 2026-05-19T19:58:00Z timestamp. Geen data-loss (call-content was reproducible uit chat).
- **PowerShell-via-Bash quoting issue tijdens verification**: `powershell -NoProfile -Command "$c = ..."` zonder escape mislukte want bash interpreteerde `$c` als shell-var. Workaround: vervangen door directe `grep -c` per sectie + `wc -w` voor word-count. Resultaat hetzelfde.
- **Em-dash hygiene in audit-doc zelf**: na eerste write had ik 10 em-dash lines + 1 en-dash line in mijn EIGEN doc (mostly als prose-pauze-marker). Scrubbed in 9 Edits naar punt/komma/dubbele punt per project-rule. Final state: 0 em-dashes, 0 en-dashes in audit doc.

## User Setup Required

None. Research-only plan, geen environment-changes, geen externe services.

## Self-Check: PASSED

- File `docs/audits/2026-05-18-v2/10-content-copy-i18n.md` exists (verified).
- Commit `b07cc16` exists on branch `audit/2026-05-18-v2-sota` (verified via `git log -1`).
- All required sections present: `## i18n parity matrix`, `## Glossary scorecard`, `## Em-dash sweep`, `## Readability per locale` (verified via `grep -c "^## "`).
- 25 findings present (verified via `grep -c "^### Finding "`).
- Word count 6915 (>= 800 plan-requirement).
- 0 em-dashes + 0 en-dashes in audit doc (verified via `python` char-count).
- BUDGET.log appended (verified via `tail -2`).
- No production-code edits, no STATE.md edits (verified via `git diff --name-only` scope-check pre-commit).

## Next Phase Readiness

- **Voor 16-15 synthesis-team**: 25 findings ranked + cross-reference index to 03 + 05 + 07 + 08 + 16-16. Top-3 P0 findings (F1 NL klant-slip, F2 ES CTA-canon, F9 /blog rendering) zijn synthesis-ready.
- **Voor 16-16 fix-plan**: concrete edit-lists per finding (specific keys + line-numbers in `messages/{nl,en,es}.json`) plus effort-estimates. Recommended priority: (a) ES CTA-canon (1 string-edit), (b) NL klant-naar-merk (9 high-impact edits), (c) DemoPlayground.tsx i18n-extract (4 strings x 3 locales + component-refactor).
- **Blockers**: geen.

---
*Phase: 16-design-seo-audit-v2-sota*
*Plan: 11 (Wave 2 Team 09 - Content/Copy/i18n)*
*Completed: 2026-05-19*
