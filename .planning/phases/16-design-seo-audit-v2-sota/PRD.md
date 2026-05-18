# PRD: Phase 16 Design + SEO/GEO SOTA Audit v2

> Voor `/gsd:plan-phase 16 --prd .planning/phases/16-design-seo-audit-v2-sota/PRD.md --skip-research`. Deze PRD bevat alle vereisten zodat de planner direct 16 plan-XX-PLAN.md files kan genereren zonder discuss-phase loop.

## Mode

**Research-only**. Geen code-changes op productie-paden. Alleen audit-docs, test-scripts, en gitignored artefacten.

## Target

FMai marketing site (`fmai-nextjs/`). 32 routes × 3 locales (NL/EN/ES) × 5 viewports × 3 browser-engines. Productie `https://future-marketing.ai` + lokaal `http://localhost:3000`.

## Acceptance criteria

Zie `README.md` § "Success criteria" voor 10-puntige acceptatie. Samenvatting:
1. 16 audit-docs onder `docs/audits/2026-05-18-v2/` (alle gevuld, severity-tagged)
2. Screenshot-galerij `test-results/audit-v2/screenshots/index.html` met ≥432 thumbnails
3. Cross-LLM citation matrix 7×≥3 met reproduceerbaar script
4. Fix-plan `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` executable
5. 12-weekse roadmap `docs/plans/2026-05-18-design-seo-roadmap-q3.md`
6. Eén commit op `audit/2026-05-18-v2-sota`
7. Geen productie-code changes
8. Budget compliance (≤100 Gemini grounded calls op gratis tier 250 RPD, ≤80 Firecrawl, ≤50 WebFetch, ≤3GB artefacts)
9. Resume-protocol functioneert
10. Geen human-in-the-loop tijdens execution

## Plan structure (input voor gsd-planner)

Genereer 16 plan-XX-PLAN.md files volgens dit schema:

### Plan 16-01: Wave 0 Pre-audit Intelligence

- **wave**: 1
- **type**: research
- **autonomous**: true
- **depends_on**: []
- **files_modified**: `docs/audits/2026-05-18-v2/00-competitive-intel.md`
- **research provider**: Google Search grounding via Gemini 2.5 Flash (`~/.claude/scripts/gemini-research.mjs`). Geen Perplexity in deze phase.
- **tasks**:
  1. `node ~/.claude/scripts/gemini-research.mjs "<query>" --json` met 3 queries (zie hieronder)
  2. `firecrawl-scrape` op 3 referentie-sites uit research
  3. Schrijf `00-competitive-intel.md` met (a) 5-7 named competitors + URLs, (b) 3 reference-sites met key-pattern extraction, (c) 25 SOTA markers als rubric

**Queries voor Gemini Google-grounded research**:
1. "Top AI marketing agencies and AI agent-as-a-service platforms for Dutch and EU B2B SMBs in 2026 — named competitors, pricing models, positioning. Provide URLs and current pricing where public."
2. "Best-in-class SaaS marketing websites 2026 — landing page design patterns, conversion optimization, SOTA examples with URLs and what makes them stand out."
3. "Current state of GEO and LLMEO best practices 2026 — schemas, llms.txt patterns, AI-citation tactics, real-world case studies measuring AI traffic uplift."

### Plan 16-02: Wave 1 Setup + Capture Infrastructure

- **wave**: 1
- **type**: research
- **autonomous**: true
- **depends_on**: [16-01]
- **files_modified**:
  - `docs/audits/2026-05-18-v2/01-baseline-snapshot.md`
  - `tests/e2e/audit-v2-screenshots.spec.ts` (Chromium)
  - `tests/e2e/audit-v2-screenshots-webkit.spec.ts`
  - `tests/e2e/audit-v2-screenshots-firefox.spec.ts`
  - `tests/e2e/audit-v2-har-capture.spec.ts`
  - `tests/e2e/audit-v2-dom-snapshot.spec.ts`
  - `tests/e2e/audit-v2-axe.spec.ts`
  - `tests/e2e/audit-v2-lighthouse.spec.ts`
  - `fmai-nextjs/.gitignore` (audit-artefacten patterns)
  - `fmai-nextjs/package.json` (dev-deps: `@axe-core/playwright`, `playwright-lighthouse`)
- **tasks**:
  1. `git checkout -b audit/2026-05-18-v2-sota`
  2. Create dir tree: `docs/audits/2026-05-18-v2/`, `test-results/audit-v2/{screenshots,har,dom,lighthouse,axe}/`
  3. Run baseline: `npx tsc --noEmit`, `npm run lint`, `npm run check:palette`, `npx playwright test --reporter=line`, `npm run build` — capture outputs in `01-baseline-snapshot.md`
  4. Install dev-deps: `npm i -D @axe-core/playwright playwright-lighthouse` (+ `npx playwright install chromium webkit firefox` if missing)
  5. Start dev-server background: `npm run dev` (port 3000, wait for ready)
  6. Write 7 Playwright specs (templates in AUTONOMOUS-PROTOCOL.md § "Playwright spec templates")
  7. Run all specs in parallel: `npx playwright test tests/e2e/audit-v2-*.spec.ts --workers=4`
  8. Generate gallery index via `scripts/audit/generate-gallery-index.mjs`
  9. Verify ≥432 screenshots present, log skips with reasons

### Plans 16-03 t/m 16-14: Wave 2 Audit Teams (12 parallelle plans)

Elke team-plan heeft dezelfde structuur:

- **wave**: 2
- **type**: research
- **autonomous**: true
- **depends_on**: [16-02]
- **files_modified**: één doc onder `docs/audits/2026-05-18-v2/` + optioneel script onder `scripts/audit/`

**Per-team specs** (uit het canonical plan `docs/plans/2026-05-18-design-seo-audit-v2-sota.md` § "Wave 2"):

- **16-03 Team 01 Visual Design**: ui-ux-pro-max + frontend-design lens → `02-visual-design.md`
- **16-04 Team 02 Brand/Narrative/IA**: firecrawl competitors + glossary check → `03-brand-narrative-ia.md`
- **16-05 Team 03 Interactions/Forms/Microcopy**: agent-browser-copilot + Playwright → `04-interactions-forms-microcopy.md`
- **16-06 Team 04 SEO Technical**: firecrawl-scrape productie + JSON-LD validation → `05-seo-technical.md`
- **16-07 Team 05 GEO/LLMEO**: gemini-research script (Google grounded) primary + WebFetch op Bing/Claude/ChatGPT public surfaces voor cross-LLM matrix → `06-geo-llmeo.md` + `scripts/audit/measure-llm-citations.mjs`
- **16-08 Team 06 Accessibility**: axe-core batch + readability + WCAG 2.2 AA → `07-accessibility.md`
- **16-09 Team 07 Performance**: Lighthouse + bundle + CrUX → `08-performance.md`
- **16-10 Team 08 Cross-browser**: WebKit + Firefox screenshot diff → `09-cross-browser.md`
- **16-11 Team 09 Content/Copy/i18n**: parity + glossary + readability + (optioneel) gemini-research cultural-fit check → `10-content-copy-i18n.md`
- **16-12 Team 10 CRO/Psychology**: Nielsen + Cialdini + funnel-friction + gemini-research voor SOTA CRO patterns → `11-conversion-psychology.md`
- **16-13 Team 11 Security/Privacy/GDPR**: securityheaders + cookies + npm audit → `12-security-privacy.md`
- **16-14 Team 12 Competitive/Cross-stack**: competitor scorecard + SSoT diff → `13-competitive-cross-stack.md`

### Plan 16-15: Wave 3 Cross-cutting Synthesis

- **wave**: 3
- **type**: research
- **autonomous**: true
- **depends_on**: [16-03, 16-04, 16-05, 16-06, 16-07, 16-08, 16-09, 16-10, 16-11, 16-12, 16-13, 16-14]
- **files_modified**: `docs/audits/2026-05-18-v2/14-cross-cutting-synthesis.md`
- **tasks**:
  1. Read alle 12 team-docs uit Wave 2
  2. Pattern-detection: scan voor herhaalde route-mentions across teams (≥3 teams = meta-finding)
  3. Conflict-resolution: design vs perf, CRO vs brand, etc. — documenteer trade-offs
  4. Coverage-matrix: routes × teams density heatmap
  5. Severity heatmap visualisatie (ASCII-tabel)
  6. Schrijf `14-cross-cutting-synthesis.md` met meta-findings, conflict-trade-offs, coverage-heatmap

### Plan 16-16: Wave 4+5 Strategic Synthesis + Roadmap + Deliverable Bundling

- **wave**: 4
- **type**: research
- **autonomous**: true
- **depends_on**: [16-15]
- **files_modified**:
  - `docs/audits/2026-05-18-v2/00-executive-summary.md`
  - `docs/audits/2026-05-18-v2/comparisons/` (side-by-side artefacten)
  - `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md`
  - `docs/plans/2026-05-18-design-seo-roadmap-q3.md`
  - `test-results/audit-v2/screenshots/index.html` (gallery update na alle data binnen)
- **tasks**:
  1. Aggregeer alle ~200 findings → effort × impact × confidence triage
  2. Top 50 fixes prioritized
  3. Schrijf 12-weekse roadmap met weekly milestones + KPI baseline+targets
  4. Schrijf executable fix-plan (Phases A-F) compatible met `superpowers:executing-plans`
  5. Schrijf 1-pagina executive summary
  6. Update screenshot-galerij met annotaties van top-vindings
  7. Bouw comparisons-dir: FMai vs competitor side-by-side (3 paren minimum)
  8. Eén commit: `docs(audit): SOTA audit 2026-05-18 v2 — 12 teams, design + SEO/GEO + cross-LLM citations` op `audit/2026-05-18-v2-sota`

## Autonomous decision rules

Zie `AUTONOMOUS-PROTOCOL.md` voor de volledige beslissingsboom. Samengevat:

- **Skip on failure** (niet abort): individuele team-failure → continue andere teams, documenteer skip in 14-cross-cutting-synthesis.md
- **Hard abort**: lokale dev-server unreachable, Gemini 401/key-invalid, git branch creation fails, Playwright install fails
- **Soft warn**: budget overshoot, Gemini 429 rate-limit (250 RPD), cross-LLM citation matrix incomplete (<3 LLMs available), Lighthouse runs failing (use PageSpeed API fallback)
- **Resume**: STATE.md per phase, executor checkt voor laatst geslaagde plan-XX en restart vanaf daar
- **Atomic commits**: één commit per plan, conventional message format

## Constraints

- **No code-changes** op productie-paden (zie README success criterion 7).
- **Budget caps** (zie README budget frontmatter): wall-clock, API calls, disk.
- **Branch isolation**: alles op `audit/2026-05-18-v2-sota` off `fix/audit-2026-05-18-followup`.
- **Atomic per plan**: één commit per plan-XX, geen branched commits binnen plan.
- **Conventional commits**: `docs(audit): ...` of `chore(audit): ...` voor non-doc artefacten.
- **No `taskkill`/`killall`/`pkill`** ooit (project rule).
- **Geen em-dashes** in audit-docs (project rule — komma/punt/dubbele punt).
- **Nederlands voor user-facing, Engels voor code-comments**.

## External resources

- **Productie URL**: `https://future-marketing.ai`
- **Pricing SSoT**: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts`
- **Research-docs**: `docs/research-schema-markup-structured-data-seo-geo.md`, `docs/research/2026-03-28-geo-llmeo-ai-citation-research.md`
- **Research provider (primair, alle research)**: Google Search grounding via Gemini 2.5 Flash. Script: `~/.claude/scripts/gemini-research.mjs` (default `--model flash`, gratis tier 250 RPD). Env: `GEMINI_API_KEY` in `~/.claude/.env`. Voor scripting: `--json` flag.
- **Perplexity**: NIET gebruikt in deze phase.

## Notes for gsd-planner

- **Skip RESEARCH.md generation** (--skip-research flag). De research-docs zijn al gegeneerd in Wave 1 als onderdeel van 16-01.
- **Spawn 12 parallelle agents in Wave 2** indien executor budget toestaat (anders fan-out van 4 concurrent agents in 3 batches).
- **Per plan-XX-PLAN.md**: gebruik must_haves YAML met truths + artifacts + key_links zoals Phase 15 plans (zie `15-01-PLAN.md` als template).
- **autonomous: true** op alle 16 plans — geen human checkpoint binnen Phase 16.
- **gsd-plan-checker**: skip iteration loop indien planner-output strict aligned met success criteria 1-10.
