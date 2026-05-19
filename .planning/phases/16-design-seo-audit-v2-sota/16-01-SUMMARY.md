---
phase: 16-design-seo-audit-v2-sota
plan: 01
subsystem: audit-research
tags: [audit, geo, llmeo, sota, competitive-intel, wave-0, gemini-grounded]
type: research
status: complete
completed_date: 2026-05-18
duration_minutes: 12
task_count: 3
file_count: 3
requirements: [AUDIT-V2-SOTA]
commit: a4d6b82
dependency_graph:
  requires: []
  provides:
    - 'competitive baseline for Wave 2 audit teams (plans 16-03 to 16-14)'
    - '25 SOTA markers as binary scoring rubric'
    - 'BUDGET.log call-telemetry pattern for the phase'
  affects:
    - 'Wave 2 team severity calls (uses 25 markers as consistent axis)'
    - 'Phase 16 budget tracker (3 of 100 Gemini + 3 of 80 firecrawl consumed)'
tech_stack:
  added: []
  patterns:
    - 'gemini-2.5-flash Google Search grounding via ~/.claude/scripts/gemini-research.mjs --json'
    - 'firecrawl-scrape CLI with --only-main-content for SOTA reference extraction'
    - 'append-only BUDGET.log with UTC ISO 8601 timestamps per API call'
    - 'tmp/ throwaway dir for raw research JSON (gitignored, reproducibility cache)'
key_files:
  created:
    - 'docs/audits/2026-05-18-v2/00-competitive-intel.md (2994 words, 7 sections, 25 SOTA markers, 7 competitors, 3 SOTA-reference sites)'
    - '.planning/phases/16-design-seo-audit-v2-sota/BUDGET.log (6 entries: 3 Gemini + 3 firecrawl)'
  modified:
    - '.planning/phases/16-design-seo-audit-v2-sota/STATE.md (plan 16-01 status: completed, commit a4d6b82)'
decisions:
  - 'Vercel substituted for Figma as 3rd SOTA reference site because Vercel is a direct stack-peer of fmai-nextjs (Next.js + Vercel deployment), more relevant for Wave 2 perf/headers/deploy teams than Figma collaboration patterns'
  - 'Stripe + Linear selected from Gemini query 2 top citations; both were directly named in the Gemini grounded response'
  - 'BUDGET.log force-added with git add -f because .gitignore *.log rule blocks it by default; PRD requires it committed for traceability'
  - '25 SOTA markers split into 5 categories of 5 (Visual / IA / SEO+GEO / Performance / Conversion) so each Wave 2 team-doc can publish a 5-bin scoring matrix per route'
  - 'tmp/ raw JSON kept on disk for reproducibility but NOT committed; gitignored and may be deleted post-phase'
metrics:
  gemini_grounded_calls: 3
  firecrawl_scrape_calls: 3
  webfetch_calls: 0
  raw_json_bytes: 48744
  raw_scrape_bytes: 53260
  artifact_disk_mb: 0.1
---

# Phase 16 Plan 01: Wave 0 Pre-audit Intelligence Summary

Eén-regel: Competitor-matrix plus 3 SOTA reference site scrapes plus 25-marker SOTA-rubric die de externe ijklat vormen voor alle 12 Wave 2 audit-teams, allemaal binnen 12 minuten via Gemini grounded research en firecrawl scrapes.

## What was accomplished

Task 1 (Gemini grounded research): 3 queries verbatim uitgevoerd zoals in plan-frontmatter gespecifieerd:
1. "Top AI marketing agencies and AI agent-as-a-service platforms for Dutch and EU B2B SMBs in 2026..." (14.825 bytes JSON, 16 citations)
2. "Best-in-class SaaS marketing websites 2026 - landing page design patterns, conversion optimization..." (16.324 bytes JSON, 17 citations)
3. "Current state of GEO and LLMEO best practices 2026 - schemas, llms.txt patterns, AI-citation tactics..." (17.595 bytes JSON, 30 citations)

Alle 3 calls succesvol op `gemini-2.5-flash` model, geen 429 rate-limits, geen model-swap nodig. Elke call gelogd in BUDGET.log met UTC ISO 8601 timestamp per AUTONOMOUS-PROTOCOL.md format.

Task 2 (firecrawl-scrape SOTA references): 3 sites geselecteerd op basis van Gemini query 2 output plus stack-relevantie:
1. Stripe (https://stripe.com) - 29.932 bytes markdown, hero-CTA-IA-palette-motion patterns geextraheerd
2. Linear (https://linear.app) - 14.331 bytes markdown, AI-era positioning plus product-as-hero motion gedocumenteerd
3. Vercel (https://vercel.com) - 8.997 bytes markdown, dual-CTA plus quantified social-proof pattern gedocumenteerd

Voor elke site is ook `<root>/llms.txt` geprobeerd via curl: alle 3 returnden HTTP 200, met Stripe en Linear in canonieke H1-blockquote-H2-links structuur en Vercel als documentation-pointer-only variant.

Task 3 (synthese): `docs/audits/2026-05-18-v2/00-competitive-intel.md` aangemaakt met alle 7 verplichte secties:
1. Scope (provider-disciplines, budget-context)
2. 7 named competitors (Mediacooks, MS618, Virtual Outcomes, Chatarmin, Solda.AI, Genesy AI, NUMRIQ) met URL, region, positioning, public pricing, differentiator, threat-level
3. 3 SOTA reference sites met hero-pattern, primary-CTA, IA, palette-tokens, motion, schema-extraction-notes, llms.txt-presence, UVP-phrasing
4. 25 SOTA markers in 5 categorieen van 5 (Visual / IA / SEO+GEO / Performance / Conversion)
5. GEO/LLMEO state-of-practice 2026 met 10 quantified case studies (Northeast Medical +893%, PlushBeds +753% LLM traffic, Codewars 22x Copilot, et cetera)
6. 10 open questions voor Wave 2 teams
7. Volledige source-set met Gemini citation-clusters per query plus firecrawl URLs plus internal references

Word count: 2994 (target >=800, 3.7x overachieved). Geen em-dashes (Grep gevalideerd op `[—]` returneert No matches). Canonical domain `future-marketing.ai` exclusief; legacy `futuremarketingai.com` enkel benoemd in negatief-context ("niet meer benoemen").

## Deviations from Plan

None of the 4 deviation rules triggered. Plan executed exactly as written:
- No bugs found (Rule 1)
- No missing critical functionality (Rule 2)
- No blocking issues (Rule 3, all 3 Gemini calls returned clean exit 0)
- No architectural decisions needed (Rule 4)

Niet-deviatie noteworthy events:
- **Vercel substitutie voor Figma**: gemarkeerd in doc sectie 3 ("Substitution note"). Plan stond fallback expliciet toe; Vercel is meer relevant voor Wave 2 stack-teams omdat fmai-nextjs op Vercel deployt.
- **BUDGET.log force-add**: `.gitignore` rule `*.log` blokkeert standaard, `-f` flag gebruikt per PRD-vereiste (BUDGET.log moet committed zijn voor traceability). Geen invariant-breach.
- **STATE.md commit-SHA update post-commit**: STATE.md werd vooraf gestaged met `PENDING_COMMIT_SHA` placeholder, daarna gepatcht na atomic commit naar `a4d6b82`. De gepatchte STATE.md staat als ongesignedde wijziging klaar voor de volgende plan's commit (16-02 of een interim metadata-commit).

## Authentication gates

None. Gemini key in `~/.claude/.env` werd correct geladen door `~/.claude/scripts/gemini-research.mjs` (auto-load mechanism), no manual auth ceremony nodig. Firecrawl CLI gebruikte cached API key uit prior sessies.

## Deferred Issues

Niet uitgevoerd in deze plan, expliciet doorgeschoven naar Wave 2:
- Schema.org JSON-LD extractie voor Stripe/Linear/Vercel: firecrawl `--only-main-content` stripte `<script type="application/ld+json">` blocks. Wave 2 plan 16-06 (SEO Technical) moet expliciete schema-extract draaien.
- Screenshot capture voor de 3 reference-sites: TODO-marker in doc sectie 3 verwijst naar `test-results/audit-v2/screenshots/refs/<slug>.png`. Plan 16-02 owns capture-infrastructure.
- Cross-LLM citation matrix (7 queries x >=3 LLMs): plan 16-07 ownership, niet 16-01.

Geen items toegevoegd aan `deferred-items.md` omdat geen out-of-scope discoveries werden gedaan; bovenstaande zijn allemaal in-scope voor expliciet andere plans in dezelfde phase.

## Key decisions documented in PROJECT.md style

- [16-01]: Vercel selected over Figma as 3rd SOTA reference site for stack-relevance to fmai-nextjs Next.js+Vercel deployment
- [16-01]: 25 SOTA markers split 5x5 across Visual/IA/SEO-GEO/Performance/Conversion so each Wave 2 team-doc can publish a clean 5-bin scoring matrix per route
- [16-01]: BUDGET.log force-added with `git add -f` (gitignored by `*.log` rule but PRD-required); precedent for all subsequent Phase 16 plans
- [16-01]: tmp/ raw research JSON kept on disk for reproducibility but never committed (gitignored, may be deleted post-phase)
- [16-01]: Zero Perplexity calls per AUTONOMOUS-PROTOCOL.md research-provider lock; Gemini grounded only (3/100 calls used)
- [16-01]: Competitor scorecard threat-levels: 5 Med, 2 Low, zero High because no EU-native productized multi-skill AI-marketing-agent with public per-workspace pricing surfaced in Gemini results (tactical SOTA-gap FMai can hold)

## Self-Check

Verifying claims before declaring done:

**Files created exist:**
- FOUND: docs/audits/2026-05-18-v2/00-competitive-intel.md (2994 words confirmed via PowerShell Measure-Object)
- FOUND: .planning/phases/16-design-seo-audit-v2-sota/BUDGET.log (6 entries: 3 gemini + 3 firecrawl confirmed via Select-String count >=3 both PASS)

**Files modified exist:**
- FOUND: .planning/phases/16-design-seo-audit-v2-sota/STATE.md (commit a4d6b82 recorded, status: completed)

**Commit exists:**
- FOUND: a4d6b82 on fix/audit-2026-05-18-followup ("docs(audit): 16-01 Wave 0 pre-audit intelligence (competitors + SOTA markers)")

**Plan automated verifications (Tasks 1, 2, 3):**
- PASS gemini (BUDGET.log gemini-flash-grounded count >=3)
- PASS firecrawl (BUDGET.log firecrawl-scrape count >=3)
- PASS doc (00-competitive-intel.md exists AND word count >=800)

**Invariants:**
- Zero changes to `fmai-nextjs/src/` (git status --short returned empty for that path)
- Zero changes to `fmai-nextjs/messages/` (git status --short returned empty for that path)
- Zero em-dashes in the audit doc (Grep `[—]` returned No matches)
- Canonical domain `future-marketing.ai` exclusive in new content; legacy `futuremarketingai.com` only in single negative-context line
- No `--no-verify` on commit, hooks ran clean

## Self-Check: PASSED
