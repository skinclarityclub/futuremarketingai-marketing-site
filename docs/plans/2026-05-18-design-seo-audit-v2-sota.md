# Plan: Design + SEO/GEO SOTA Audit v2 (Research-only)

> **Status**: Scheduled as GSD Phase 16. Autonomous-ready. See `.planning/phases/16-design-seo-audit-v2-sota/` for execution package.

## TL;DR

12 parallelle audit-teams over 32 routes × 3 locales × 5 viewports × 3 browser-engines. Multi-LLM citation matrix met Google Search grounding via Gemini 2.5 Flash als primary + Bing/Claude/ChatGPT via WebFetch. Cross-cutting synthesis + 12-weekse roadmap als deliverables. Geen code-changes — alleen audit-docs, test-scripts, gitignored artefacten. Geschat 5-6 uur autonomous wall-clock. Kosten: gratis tier dekt scope (Gemini 250 RPD).

## Context

Nieuwe design-skills (`ui-ux-pro-max` met 67 styles/96 palettes/57 font-pairings, `frontend-design`) zijn toegevoegd. 2026-05-18 P0/P1 audit-followup is gesloten (commit `fb5a661`) maar laat een backlog (B-P2-01 t/m B-P3-04). Twee research-docs over GEO/LLMEO en schema-markup wachten op vertaalslag. Doel is één diepe doorlichting op SOTA-niveau, output executive-ready én concrete uitvoerbaar, vóór de volgende grote contentslag.

## GSD-package locatie

| File | Doel |
|---|---|
| `.planning/phases/16-design-seo-audit-v2-sota/README.md` | Phase brief (Phase 15 format) |
| `.planning/phases/16-design-seo-audit-v2-sota/PRD.md` | Acceptatie-criteria voor `/gsd:plan-phase --prd` |
| `.planning/phases/16-design-seo-audit-v2-sota/AUTONOMOUS-PROTOCOL.md` | Decision rules, budget caps, abort criteria, resume-protocol, Playwright spec templates |
| `.planning/phases/16-design-seo-audit-v2-sota/STATE.md` | Plan-status + budget tracking (live tijdens executie) |
| `.planning/phases/16-design-seo-audit-v2-sota/KICKOFF.md` | Exacte commando's om de phase te starten |
| `.planning/ROADMAP.md` | Phase 16 entry toegevoegd |

## Autonomous execution flow

1. **Plan generatie** (~2-3 min):
   ```
   /gsd:plan-phase 16 --prd .planning/phases/16-design-seo-audit-v2-sota/PRD.md --skip-research
   ```
   Genereert 16 plan-XX-PLAN.md files in de phase-directory.

2. **Autonome uitvoering** (~5-6 uur):
   ```
   /gsd:execute-phase 16
   ```
   Wave-by-wave parallel uitvoering met atomic commits, budget-tracking, en resume-protocol.

3. **Verificatie** (~5 min):
   ```
   /gsd:verify-work 16
   ```
   Of run de verification suite handmatig uit `AUTONOMOUS-PROTOCOL.md` § Verification automation.

4. **Daley checkpoint**: review van `00-executive-summary.md` + decide Phase 17 scope (fixes).

## Outputs (post-phase)

**Audit-docs** in `docs/audits/2026-05-18-v2/`:
- `00-executive-summary.md` (≤1 A4)
- `00-competitive-intel.md` (5-7 named competitors + 25 SOTA markers)
- `01-baseline-snapshot.md` (TSC/lint/palette/playwright/build state)
- `02-visual-design.md` (ui-ux-pro-max + frontend-design lens)
- `03-brand-narrative-ia.md` (value-prop, IA, journeys)
- `04-interactions-forms-microcopy.md` (every CTA + form state)
- `05-seo-technical.md` (96-row metadata matrix + JSON-LD)
- `06-geo-llmeo.md` (gap-matrix + 7×≥3 cross-LLM citation baseline)
- `07-accessibility.md` (WCAG 2.2 AA + axe + readability)
- `08-performance.md` (64 Lighthouse + bundle + LCP-bron)
- `09-cross-browser.md` (engine-diff galerij + compat-matrix)
- `10-content-copy-i18n.md` (parity + glossary + readability)
- `11-conversion-psychology.md` (Nielsen + Cialdini + funnel)
- `12-security-privacy.md` (headers + cookies + GDPR)
- `13-competitive-cross-stack.md` (competitor scorecard + drift)
- `14-cross-cutting-synthesis.md` (meta-findings + coverage heatmap)

**Plans-deliverables** in `docs/plans/`:
- `2026-05-18-design-seo-audit-v2-fix-plan.md` (executable Phases A-F voor Phase 17)
- `2026-05-18-design-seo-roadmap-q3.md` (12-weekse roadmap + KPI targets)

**Test-artefacten** in `fmai-nextjs/test-results/audit-v2/`:
- `screenshots/index.html` (galerij, committed)
- `screenshots/`, `screenshots-webkit/`, `screenshots-firefox/` (raw PNGs, gitignored)
- `har/` (network-traces, gitignored)
- `dom/` (HTML snapshots, gitignored)
- `lighthouse/` (perf reports, gitignored)
- `axe/` (a11y reports, gitignored)

**Scripts** in `fmai-nextjs/scripts/audit/`:
- `measure-llm-citations.mjs` (reproduceerbare Gemini Google-grounded citation meting + Bing/Claude/ChatGPT WebFetch slots)
- `generate-gallery-index.mjs` (galerij-index builder)

**Tests** in `fmai-nextjs/tests/e2e/`:
- `audit-v2-screenshots.spec.ts` (Chromium primary, 480 shots)
- `audit-v2-screenshots-webkit.spec.ts` (~96 cross-browser)
- `audit-v2-screenshots-firefox.spec.ts` (~96 cross-browser)
- `audit-v2-har-capture.spec.ts`
- `audit-v2-dom-snapshot.spec.ts`
- `audit-v2-axe.spec.ts`
- `audit-v2-lighthouse.spec.ts`

## Budget & autonomy guarantees

Gespecificeerd in `AUTONOMOUS-PROTOCOL.md`. Samenvatting:

- **Geen human-in-the-loop** tijdens Waves 0-5
- **Skip-on-failure** voor individuele teams (zonder andere teams te blokkeren)
- **Hard-abort** alleen bij: branch-create fail, productie-code touched, disk full, dev-server crash-loop, productie URL >24u down
- **Atomic commits per plan** (geen branched commits binnen plan)
- **Resume-protocol** via STATE.md (crash-safe restart)
- **Budget caps**: 6h wall-clock, 100 Gemini grounded (gratis tier 250 RPD), 80 Firecrawl, 50 WebFetch, 3GB disk
- **Cost soft-cap**: €5 EUR (verwachte spend €0 op gratis tier; >€5 duidt op misconfiguratie)
- **Research provider**: Gemini 2.5 Flash met Google Search grounding uitsluitend, via `~/.claude/scripts/gemini-research.mjs`

## Quality bar

Per finding documenteren: severity (P0-P3), route(s), viewport(s), locale(s), evidence (screenshot of code-pad), impact-hypothese, voorgestelde fix, effort-estimate (S/M/L), confidence (low/med/high). Cross-team findings >3× = meta-finding in 14-cross-cutting-synthesis.md. Findings die competitors well-doen krijgen "vs benchmark" annotation.

## Verwijzingen

- Source-of-truth references: zie `.planning/phases/16-design-seo-audit-v2-sota/README.md` § References.
- Vorige audit-cycle: `docs/audits/2026-05-18-website-full-audit.md` + `-backlog.md` + `docs/plans/2026-05-18-website-audit-followup.md`.
- Research-docs: `docs/research-schema-markup-structured-data-seo-geo.md`, `docs/research/2026-03-28-geo-llmeo-ai-citation-research.md`.
