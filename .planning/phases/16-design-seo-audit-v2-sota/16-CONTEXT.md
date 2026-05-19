# Phase 16: Design + SEO/GEO SOTA Audit v2 - Context

**Gathered:** 2026-05-18
**Status:** Ready for planning
**Source:** PRD Express Path (.planning/phases/16-design-seo-audit-v2-sota/PRD.md)

<domain>
## Phase Boundary

**Research-only audit pakket** voor de FMai marketing site (`fmai-nextjs/`). 12 parallelle audit-teams analyseren design, SEO/GEO, interactions, a11y, performance, content, conversion, security en cross-stack consistency over 32 routes × 3 locales (NL/EN/ES) × 5 viewports × 3 browser-engines.

**In scope:**
- Audit-documenten onder `docs/audits/2026-05-18-v2/` (16 markdown files)
- Visuele galerij in `test-results/audit-v2/screenshots/index.html`
- Playwright multi-engine capture infrastructure (`tests/e2e/audit-v2-*.spec.ts`)
- Cross-LLM citation matrix met reproduceerbaar script (`scripts/audit/measure-llm-citations.mjs`)
- Executable fix-plan + 12-weekse roadmap als deliverables
- Eén commit op `audit/2026-05-18-v2-sota` branch

**Out of scope (NIET aanraken):**
- Productie-code (`fmai-nextjs/src/`, `fmai-nextjs/messages/`, `next.config.*`, `tailwind.config.*`) — alleen dev-deps additions toegestaan in `package.json`
- Stripe/billing audit, n8n workflow audit, Obsidian vault sync
- Visuele mockup-generatie via Stitch/Higgsfield (verschuift naar Phase 17)
- Re-measurement na fixes (dat is Phase 17 verification work)

</domain>

<decisions>
## Implementation Decisions

### Mode
- **Research-only**: geen code-changes op productie-paden. Alleen audit-docs, test-scripts, gitignored artefacten.
- **Autonomous**: alle 16 plans hebben `autonomous: true` — geen human-in-the-loop tijdens Waves 0-5.
- **Branch**: `audit/2026-05-18-v2-sota` off `fix/audit-2026-05-18-followup`. Eén commit per plan (atomic).

### Research provider
- **Google Search grounding via Gemini 2.5 Flash uitsluitend** (`~/.claude/scripts/gemini-research.mjs` met `--model flash --json`).
- **Perplexity NIET gebruikt** in Phase 16 scope (per project memory feedback_fmai_research_provider.md).
- Bij 429: wait+retry+model-switch (`flash` → `pro` separate quota); GEEN fallback naar Perplexity.

### Target dimensies (audit-matrix)
- **32 routes**: 12 marketing + 12 skills (incl 3 coming_soon) + 2 blog + 4 legal + 2 misc
- **3 locales**: NL (authoritative), EN, ES
- **5 viewports**: 360×800 (mobile-s), 414×896 (mobile-l), 768×1024 (tablet), 1440×900 (desktop), 1920×1080 (desktop-w)
- **3 browser-engines**: Chromium (primary), WebKit, Firefox

### Wave-structure (16 plans)
- **Wave 1 solo (sequential)**: 16-01 (pre-audit intelligence), 16-02 (setup + capture infra)
- **Wave 2 parallel (12 teams)**: 16-03 t/m 16-14 (Visual, Brand/IA, Interactions, SEO, GEO/LLMEO, A11y, Perf, Cross-browser, Content, CRO, Security, Competitive)
- **Wave 3 solo**: 16-15 (cross-cutting synthesis)
- **Wave 4 solo**: 16-16 (strategic roadmap + deliverable bundling)

### Audit-team specs (uit PRD § "Plan structure")
- **16-03 Team 01**: ui-ux-pro-max + frontend-design lens → `02-visual-design.md` (Top 25 findings + 3 alternate visual directions)
- **16-04 Team 02**: brand/narrative/IA + glossary compliance + 4 user-journey maps → `03-brand-narrative-ia.md`
- **16-05 Team 03**: every CTA/form state + form UX deep-dive + microcopy → `04-interactions-forms-microcopy.md`
- **16-06 Team 04**: per-route metadata matrix + JSON-LD validation + sitemap/robots → `05-seo-technical.md` (96-row tabel)
- **16-07 Team 05**: cross-LLM citation matrix 7×≥3 LLMs + speakable + author bylines + Wikidata + LocalBusiness + llms.txt → `06-geo-llmeo.md` + `scripts/audit/measure-llm-citations.mjs`
- **16-08 Team 06**: WCAG 2.2 AA via @axe-core/playwright + keyboard + focus-trap + readability → `07-accessibility.md`
- **16-09 Team 07**: Lighthouse 64 reports + CrUX + bundle analysis + LCP-bron per route → `08-performance.md`
- **16-10 Team 08**: WebKit + Firefox cross-engine diff → `09-cross-browser.md`
- **16-11 Team 09**: i18n parity + glossary + em-dash sweep + Flesch-Kincaid readability per locale → `10-content-copy-i18n.md`
- **16-12 Team 10**: Nielsen 10 heuristics + Cialdini 7 + funnel-friction + F-pattern → `11-conversion-psychology.md`
- **16-13 Team 11**: HTTP headers + CSP + cookies + GDPR data-flow + npm audit → `12-security-privacy.md`
- **16-14 Team 12**: competitor scorecard (5-7 named) + 2×2 positioning + cross-stack SSoT diff → `13-competitive-cross-stack.md`

### Budget caps (zie README.md)
- 6h wall-clock soft cap
- 100 Gemini grounded calls (gratis tier 250 RPD ≈ €0 spend)
- 80 Firecrawl calls
- 50 WebFetch calls
- 3GB artifact disk
- €5 EUR cost soft cap (>€5 duidt op misconfiguratie)

### Autonomous decision rules (zie AUTONOMOUS-PROTOCOL.md)
- **Rule 1 Skip on failure**: individuele team-failure → continue andere teams, schrijf `SKIPPED-{team}.md`, geen retry binnen Phase 16
- **Rule 2 Soft warn**: budget overshoot, 429-rate-limit, Lighthouse fails, WebKit-Windows crashes → continue met fallback
- **Rule 3 Adapt within scope**: viewport/locale/engine/routes reductie toegestaan zonder user-input bij budget krap, gedocumenteerd in executive summary
- **Rule 4 Atomic commits**: één commit per plan, conventional `docs(audit): 16-XX <title>`, geen `--no-verify`

### Hard abort criteria (zie AUTONOMOUS-PROTOCOL.md § Hard abort)
1. Git branch creation fails
2. Production code touched (`fmai-nextjs/src/` of `messages/` diff > 0)
3. Cumulative API spend > €5 EUR
4. Gemini quota uitgeput >24u
5. Disk-usage > 5 GB
6. Productie URL >24u onbereikbaar
7. Lokale dev-server crash-loop (3× restart binnen 5 min)
8. Node/npm catastrophic state

### Resume protocol (zie AUTONOMOUS-PROTOCOL.md § Resume)
- STATE.md per phase met plan-status
- Identify last-completed + restart in_progress from scratch
- Wave 2 deels af: complete Wave 2 eerst voordat Wave 3 start

### Plan-XX-PLAN.md format
- YAML frontmatter: `phase`, `plan`, `type: research`, `wave`, `depends_on`, `files_modified`, `autonomous: true`, `requirements: [AUDIT-V2-SOTA]`
- `must_haves` YAML met `truths` + `artifacts` + `key_links` zoals Phase 15 plans (template: `.planning/phases/15-conversion-accelerators/15-01-PLAN.md`)
- `<objective>` block: 2-3 sentence purpose
- `<execution_context>` block: workflow refs
- `<context>` block: project file refs
- `<tasks>` block: één of meer `<task type="auto">` met name + files + action

### Project rules (zie fmai-nextjs/CLAUDE.md + Futuremarketingai/CLAUDE.md)
- Nederlands voor user-facing, Engels voor code-comments
- Geen em-dashes (—) in audit-docs (komma/punt/dubbele punt)
- Geen `taskkill`/`killall`/`pkill` (sluit terminals)
- Geen wrong domains: alleen `future-marketing.ai` canonical
- Geen secrets in `NEXT_PUBLIC_*`, geen `any`-types, geen `@ts-ignore`
- Conventional commits: `docs(audit): ...` of `chore(audit): ...`

### Claude's Discretion
- Exacte spec-bestand inhoud voor de 7 Playwright test-specs (template in AUTONOMOUS-PROTOCOL.md § "Playwright spec templates" is leidraad)
- Exacte BUDGET.log timestamp-format
- Detail-level binnen elke 16-XX team-vinding (richtlijn: 800+ woorden per doc, severity-tagged)
- Score-rubric within Nielsen/Cialdini/CWV evaluations
- Specifieke prompt-phrasing voor gemini-research calls binnen Wave 2 teams (gebruik de 3 queries uit PRD § Wave 0 als template)

</decisions>

<specifics>
## Specific Ideas

### Tooling installations toegestaan (dev-deps)
- `@axe-core/playwright` (a11y batch)
- `playwright-lighthouse` (CWV reports)
- Met motivatie-commit message: "chore(audit): add dev-only deps for Phase 16 a11y + perf capture"

### Cross-LLM citation queries (exact, uit PRD)
1. "Wat is FutureMarketingAI?"
2. "Welke AI marketing agency platforms zijn er voor Nederlandse bureaus in 2026?"
3. "Hoe werkt agent-as-a-service voor content marketing?"
4. "Wat is Clyde van FutureMarketingAI?"
5. "Pricing AI marketing agency platforms EU 2026"
6. "Memory system AI marketing platform - wat houdt het in?"
7. "SkinClarity Club case study AI marketing"

### Verification automation (zie AUTONOMOUS-PROTOCOL.md § Verification)
- PowerShell-suite test alle 16 audit-docs + 2 plan-docs + gallery + branch + zero production-code-diff
- Run aan einde van Phase 16 door gsd-verifier of executor

### Templates van vorige phases
- Phase 15 (`.planning/phases/15-conversion-accelerators/15-01-PLAN.md`) is de canonieke template voor plan-XX-PLAN.md format
- Phase 14 (`.planning/phases/14-seo-geo-depth-upgrade/`) heeft de meest relevante SEO/GEO plan-history voor Team 04+05 context

### External resources
- Productie URL: `https://future-marketing.ai`
- Pricing SSoT (read-only): `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts`
- Research-docs als acceptatie-criteria voor Team 04+05: `docs/research-schema-markup-structured-data-seo-geo.md`, `docs/research/2026-03-28-geo-llmeo-ai-citation-research.md`
- Gemini API key: env `GEMINI_API_KEY` in `~/.claude/.env`
- Script: `~/.claude/scripts/gemini-research.mjs`

</specifics>

<deferred>
## Deferred Ideas

- **Visuele mockup-generatie** via `mcp__stitch__*` of Higgsfield voor top-3 redesign proposals — Wave 5 optioneel, niet blockerend. Verschuift naar Phase 17 indien gewenst.
- **Baseline re-measurement na fixes** — Phase 17 verification work.
- **Stripe/billing audit** — buiten website-scope.
- **n8n workflow audit** — separate codebase (`C:\Users\daley\Desktop\FMai`).
- **Obsidian vault sync check** — los onderhoud, niet website-audit.
- **Higgsfield content asset audit** voor hero imagery / OG cards — verschuift naar Phase 17 als design-direction fix.
- **A/B testing infrastructure** voor de fixes — Phase 17 deliverable.

</deferred>

---

*Phase: 16-design-seo-audit-v2-sota*
*Context gathered: 2026-05-18 via PRD Express Path*
