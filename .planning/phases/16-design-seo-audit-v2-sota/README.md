---
phase: 16-design-seo-audit-v2-sota
title: Design + SEO/GEO SOTA Audit v2 (Research-only)
created: 2026-05-18
owner: Daley (solo)
status: planned
autonomous: true
depends_on: []
mode: research-only
budget:
  wall_clock_hours: 6
  gemini_calls_max: 100
  firecrawl_calls_max: 80
  webfetch_calls_max: 50
  artifact_disk_max_gb: 3
  cost_eur_soft_cap: 5
research_provider: gemini-2.5-flash-google-grounded
research_provider_script: ~/.claude/scripts/gemini-research.mjs
---

# Phase 16: Design + SEO/GEO SOTA Audit v2

## One-liner

Volledige doorlichting van de marketingsite op SOTA-niveau, met 12 parallelle audit-teams, 5 viewports × 3 locales × 3 browser-engines, multi-LLM citation matrix, en strategische 12-weekse roadmap als deliverable. Geen code-changes.

## Business goal

Eén autoritatief audit-pakket dat (a) baseline-data vastlegt voor alle huidige design/SEO/GEO/conversion-KPIs, (b) een prioritized fix-plan met ~50 ranked findings oplevert, en (c) een 12-weekse executable roadmap met KPI-targets levert. Output dient als input voor Phase 17 (fix-uitvoering).

## Scope (what's IN)

| Plan | Title | Wave | Mode |
|---|---|---|---|
| 16-01 | Wave 0 Pre-audit Intelligence: competitor matrix + SOTA markers + reference-site scrape | 1 (solo) | research |
| 16-02 | Wave 1 Setup: branch + dirs + testing-playbook baseline + Playwright multi-engine capture infra | 1 (solo, after 16-01) | research |
| 16-03 | Team 01 Visual Design + Style Catalog Evaluation (ui-ux-pro-max lens) | 2 (parallel) | research |
| 16-04 | Team 02 Brand, Narrative & Information Architecture | 2 (parallel) | research |
| 16-05 | Team 03 Interactions, Forms & Microcopy (every CTA + form) | 2 (parallel) | research |
| 16-06 | Team 04 SEO Technical & Schema.org Validation | 2 (parallel) | research |
| 16-07 | Team 05 GEO/LLMEO Cross-LLM Citation Audit (Gemini + Claude + Bing + ChatGPT via WebFetch) | 2 (parallel) | research |
| 16-08 | Team 06 Accessibility Deep-dive (WCAG 2.2 AA + axe + readability) | 2 (parallel) | research |
| 16-09 | Team 07 Performance + CWV + Bundle Analysis (Lighthouse + CrUX) | 2 (parallel) | research |
| 16-10 | Team 08 Cross-browser & Device Compatibility (Chromium + WebKit + Firefox) | 2 (parallel) | research |
| 16-11 | Team 09 Content, Copy & i18n Cultural Adaptation | 2 (parallel) | research |
| 16-12 | Team 10 Conversion Psychology, CRO & Trust Signals (Nielsen + Cialdini) | 2 (parallel) | research |
| 16-13 | Team 11 Security Headers, Privacy & GDPR Compliance | 2 (parallel) | research |
| 16-14 | Team 12 Competitive Benchmark + Cross-stack Consistency | 2 (parallel) | research |
| 16-15 | Wave 3 Cross-cutting Synthesis (pattern detection, conflict resolution, heatmap) | 3 (solo) | research |
| 16-16 | Wave 4+5 Strategic Synthesis + 12-week Roadmap + Deliverable Bundling | 4 (solo) | research |

## Out of scope (deferred)

- **Geen code-changes** in deze fase. Geen edits aan `src/`, `messages/`, `next.config.*`, `tailwind.config.*`, `package.json` (behalve dev-only deps `@axe-core/playwright`, `playwright-lighthouse` met motivatie-commit).
- **Geen visuele mockup-generatie** via Stitch/Higgsfield. Top-3 redesign-proposals worden tekstueel beschreven; mockup-generatie verschuift naar Phase 17 als gewenst.
- **Geen baseline re-measurement na fixes** — dat is Phase 17 verification work.
- **Geen Stripe/billing audit** — buiten website-scope.
- **Geen n8n workflow audit** — separate codebase (`C:\Users\daley\Desktop\FMai`).
- **Geen Obsidian vault sync** — los onderhoud, niet website-audit.

## Success criteria (must be TRUE at phase-close)

1. **Audit-rapport compleet**: `docs/audits/2026-05-18-v2/00-executive-summary.md` (≤1 A4) + `00-competitive-intel.md` (5-7 named competitors + 25 SOTA markers) + `01-baseline-snapshot.md` (TSC/lint/palette/playwright/build baselines) + 12 team-vindings-docs (`02-visual-design.md` t/m `13-competitive-cross-stack.md`) + `14-cross-cutting-synthesis.md` — alle 16 bestanden bestaan, elk ≥800 woorden, severity-tagged findings.

2. **Visuele galerij compleet**: `test-results/audit-v2/screenshots/index.html` opent in browser en toont thumbnails voor minimaal 432 primary shots (32 routes × 3 locales × ≥4.5 viewports gemiddeld, met expliciet gedocumenteerde skips voor failing routes). HAR-files + DOM-snapshots aanwezig in respectievelijke subdirs.

3. **Cross-LLM citation baseline**: 7 standard queries × ≥3 LLM-providers (Gemini primary via Google Search grounding, plus ≥2 anderen via WebFetch) = ≥21 measure-points gedocumenteerd in `06-geo-llmeo.md` met (a) wel/niet-geciteerd, (b) URL geciteerd indien wel, (c) reproduceerbaar meet-script committed onder `scripts/audit/measure-llm-citations.mjs`.

4. **Fix-plan executable**: `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` bestaat met Phases A-F (P0/P1/P2/P3 + GEO + design-system + perf + cleanup), elke phase met `<tasks>` blocks compatibel met `superpowers:executing-plans` of `/gsd:plan-phase` (file-paden + verification-commands).

5. **12-weekse roadmap**: `docs/plans/2026-05-18-design-seo-roadmap-q3.md` bestaat met 12 weekly milestones, KPI baseline + targets (Lighthouse Performance avg, WCAG 2.2 AA pass-rate, cross-LLM citation rate, bundle size, i18n parity, apply-form conversion).

6. **Audit-artefacten gecommit op `audit/2026-05-18-v2-sota` branch**: één commit met `docs/audits/2026-05-18-v2/` + `docs/plans/2026-05-18-design-seo-*.md` + `tests/e2e/audit-v2-*.spec.ts` + `scripts/audit/*.mjs`. Raw screenshots/HAR/DOM gitignored (alleen index.html commit).

7. **Geen productie-code wijzigingen**: `git diff main -- 'fmai-nextjs/src/' 'fmai-nextjs/messages/' 'fmai-nextjs/next.config.*' 'fmai-nextjs/tailwind.config.*'` returneert leeg. Diff op `fmai-nextjs/package.json` bevat alleen dev-deps additions met motivatie-comment.

8. **Budget compliance**: ≤100 Gemini grounded calls (gratis tier 250 RPD), ≤80 Firecrawl calls, ≤50 WebFetch calls, artifact-dir ≤3 GB. Indien overschreden: gedocumenteerd in `00-executive-summary.md` met justificatie.

9. **Resume-protocol getest**: indien een wave-2 team faalt of crashed, de executor leest `STATE.md` van Phase 16 en restart vanaf laatst geslaagde team zonder duplicate work. Test door één team handmatig te `--abort` flaggen tijdens dry-run (optioneel, niet blocking).

10. **Daley-checkpoint pas aan einde**: Phase 16 vraagt GEEN human-in-the-loop tijdens Waves 0-5. Eind-checkpoint: review van `00-executive-summary.md` + decide op Phase 17 scope. Alle overige autonomous decisions per AUTONOMOUS-PROTOCOL.md.

## Wave / execution order

- **Wave 1 solo** (sequential):
  - 16-01 Pre-audit intelligence (~30 min)
  - 16-02 Setup + capture infra (~60 min, includes Playwright multi-engine specs)
- **Wave 2 parallel** (12 teams, max 4 concurrent agents per executor budget):
  - 16-03 t/m 16-14 (~90-120 min wall-clock)
- **Wave 3 solo**:
  - 16-15 Cross-cutting synthesis (~45 min)
- **Wave 4 solo**:
  - 16-16 Strategic roadmap + deliverable bundling (~60-90 min)

**Totaal wall-clock**: ~5-6 uur autonoom werk.

## External dependencies (non-code)

1. **Gemini API key** (primair voor alle research + citation queries) in `~/.claude/.env` (`GEMINI_API_KEY`) — verifieer met `node -e "console.log(!!process.env.GEMINI_API_KEY)"` vóór Wave 2. Gebruikt via `~/.claude/scripts/gemini-research.mjs` met `--model flash` default (gratis tier, 250 RPD).
2. **Perplexity NIET gebruikt** in deze phase — research provider is uitsluitend Google grounding via Gemini.
3. **Productie URL bereikbaar**: `https://future-marketing.ai` 200 OK met geldig SSL.
4. **Vercel CLI of Vercel Speed Insights access** voor CrUX data (optioneel — als niet beschikbaar, WebFetch PageSpeed Insights API).
5. **Lokale dev server** kan starten zonder env-var fouten. Vereist: `.env.local` met development credentials.
6. **Playwright browsers** geïnstalleerd (`npx playwright install chromium webkit firefox`).

## Files touched (summary)

**Created (audit artefacts)**:
- `docs/audits/2026-05-18-v2/00-executive-summary.md`
- `docs/audits/2026-05-18-v2/00-competitive-intel.md`
- `docs/audits/2026-05-18-v2/01-baseline-snapshot.md`
- `docs/audits/2026-05-18-v2/02-visual-design.md`
- `docs/audits/2026-05-18-v2/03-brand-narrative-ia.md`
- `docs/audits/2026-05-18-v2/04-interactions-forms-microcopy.md`
- `docs/audits/2026-05-18-v2/05-seo-technical.md`
- `docs/audits/2026-05-18-v2/06-geo-llmeo.md`
- `docs/audits/2026-05-18-v2/07-accessibility.md`
- `docs/audits/2026-05-18-v2/08-performance.md`
- `docs/audits/2026-05-18-v2/09-cross-browser.md`
- `docs/audits/2026-05-18-v2/10-content-copy-i18n.md`
- `docs/audits/2026-05-18-v2/11-conversion-psychology.md`
- `docs/audits/2026-05-18-v2/12-security-privacy.md`
- `docs/audits/2026-05-18-v2/13-competitive-cross-stack.md`
- `docs/audits/2026-05-18-v2/14-cross-cutting-synthesis.md`
- `docs/audits/2026-05-18-v2/comparisons/` (directory with side-by-side artefacten)
- `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md`
- `docs/plans/2026-05-18-design-seo-roadmap-q3.md`
- `scripts/audit/measure-llm-citations.mjs`
- `scripts/audit/generate-gallery-index.mjs`
- `tests/e2e/audit-v2-screenshots.spec.ts` (Chromium primary)
- `tests/e2e/audit-v2-screenshots-webkit.spec.ts`
- `tests/e2e/audit-v2-screenshots-firefox.spec.ts`
- `tests/e2e/audit-v2-har-capture.spec.ts`
- `tests/e2e/audit-v2-dom-snapshot.spec.ts`
- `tests/e2e/audit-v2-axe.spec.ts`
- `tests/e2e/audit-v2-lighthouse.spec.ts`
- `test-results/audit-v2/` (artefacten dir, gitignored except index.html)

**Modified (gitignore + dev-deps only)**:
- `fmai-nextjs/.gitignore` (add `test-results/audit-v2/screenshots/*.png`, etc.)
- `fmai-nextjs/package.json` (dev-deps only: `@axe-core/playwright`, `playwright-lighthouse`)
- `fmai-nextjs/package-lock.json` (sync na install)

**NOT touched** (verification target):
- `fmai-nextjs/src/**/*` (production code — must remain untouched)
- `fmai-nextjs/messages/**/*.json` (content — must remain untouched)
- `fmai-nextjs/next.config.*`
- `fmai-nextjs/tailwind.config.*`

## Post-phase verification

Automated checks at phase-close (run by gsd-verifier):

```bash
# Phase 16 verification suite
cd C:/Users/daley/Desktop/Futuremarketingai

# 1. All 16 audit docs exist
test -f docs/audits/2026-05-18-v2/00-executive-summary.md
test -f docs/audits/2026-05-18-v2/00-competitive-intel.md
test -f docs/audits/2026-05-18-v2/01-baseline-snapshot.md
for n in 02 03 04 05 06 07 08 09 10 11 12 13 14; do
  test -f docs/audits/2026-05-18-v2/${n}-*.md || echo "MISSING ${n}"
done

# 2. Both plan docs exist
test -f docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md
test -f docs/plans/2026-05-18-design-seo-roadmap-q3.md

# 3. Cross-LLM citation script exists + runs
test -f fmai-nextjs/scripts/audit/measure-llm-citations.mjs

# 4. No production code changes
git diff main -- 'fmai-nextjs/src/' 'fmai-nextjs/messages/' 'fmai-nextjs/next.config.*' 'fmai-nextjs/tailwind.config.*'
# Expected: empty

# 5. Gallery index opens
test -f fmai-nextjs/test-results/audit-v2/screenshots/index.html

# 6. Branch ready for review
git log --oneline audit/2026-05-18-v2-sota | head -5
# Expected: single commit with conventional message
```

## References

- Source plan: `docs/plans/2026-05-18-design-seo-audit-v2-sota.md` (canonical)
- Autonomous protocol: `.planning/phases/16-design-seo-audit-v2-sota/AUTONOMOUS-PROTOCOL.md`
- PRD: `.planning/phases/16-design-seo-audit-v2-sota/PRD.md`
- Vorige audit: `docs/audits/2026-05-18-website-full-audit.md` (P0/P1 closed)
- Open backlog: `docs/audits/2026-05-18-website-full-audit-backlog.md`
- Vorige followup-plan: `docs/plans/2026-05-18-website-audit-followup.md`
- Research-doc SEO: `docs/research-schema-markup-structured-data-seo-geo.md`
- Research-doc GEO: `docs/research/2026-03-28-geo-llmeo-ai-citation-research.md`
- Pricing SSoT: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts`
- Repo rules: `fmai-nextjs/CLAUDE.md`, `Futuremarketingai/CLAUDE.md`
