---
phase: 16-design-seo-audit-v2-sota
plan: 16-04
wave: 2
team: 02 Brand voice narrative IA user-journeys
type: research
status: completed
date: 2026-05-19
provides:
  - Sitemap (actual rendered) for 31 routes across NL EN ES with parent / depth / orphan / dead-end columns
  - Top-nav plus footer comparison tables NL EN ES
  - Glossary scorecard for `vaardigheden`, `merken`, `Plan een gesprek`, `AI Marketing Medewerker`, `Clyde`, `Boek een gesprek`, em-dash, `Onbeperkt`, `Sign up`, `klantenservice` (10 terms)
  - 28 ranked findings (P0=4, P1=7, P2=8, P3=9) with SOTA-marker cross-references
  - 4 user-journey maps (Bureau-owner researcher, EU buyer evaluator, GTM bench-marker, Returning prospect)
  - Narrative arc audit per page (Hook, Reveal, Proof, Action, Reassurance) for 10 key pages
  - Top-25 ranked-findings list feeding 16-15 plus 16-16
requires:
  - 16-01 (SOTA markers rubric M1 tot M25)
  - 16-02 (93 DOM snapshots, screenshots index)
affects:
  - 16-07 (SEO team owns hreflang plus full Schema.org validation, Finding 27 deferred)
  - 16-11 (i18n team owns full em-dash sweep plus locale-divergence findings 7, 12, 18)
  - 16-15 (synthesis team ingests 28-finding ranked backlog plus 4 journey-maps)
  - 16-16 (Q3 fix-plan: orphan-4 rescue, breadcrumb rollout, glossary-sync top-3 actions)
key_files:
  created:
    - docs/audits/2026-05-18-v2/03-brand-narrative-ia.md
  read_only:
    - fmai-nextjs/test-results/audit-v2/dom/ (93 DOM HTML files, full corpus walked)
    - fmai-nextjs/src/components/layout/HeaderClient.tsx (megamenu + nav-items + login plus apply CTA)
    - fmai-nextjs/src/components/layout/Footer.tsx (footer-sections plus rendered 8 of 12 skills)
    - fmai-nextjs/src/lib/skills-data.ts (skills SSoT-mirror, `Reporting` shortDescription glossary slip)
    - fmai-nextjs/messages/nl.json (NL authoritative copy, glossary plus key-pad grep targets)
    - fmai-nextjs/CLAUDE.md (key-phrase glossary tabel, brand-rules)
    - docs/audits/2026-05-18-v2/00-competitive-intel.md (SOTA markers M1 tot M25)
    - docs/audits/2026-05-18-v2/01-baseline-snapshot.md (out-of-scope baseline)
key_decisions:
  - Selected 28 findings (above 25 threshold) so the journey-maps surfaced 3 additional cross-cutting IA issues that did not collapse cleanly into glossary or sitemap findings
  - Identified 4 P0 findings (orphan-4-skills, universal breadcrumb-absence, social-media CTA-block glossary violation, home H2-absence) as Q3 fix-plan top-priority signals
  - Did not flag em-dashes site-wide because quick-grep on messages files returned zero hits in body-copy, deferred full sweep to 16-11 i18n team
  - Decided `/legal` parent-page is P3 not P1 because direct-deep-link traffic to sub-paginas is the realistic pattern
  - Memory plus Founding-member pages flagged as POSITIVE narrative-arc benchmarks (Findings 22 plus 28) to give 16-16 reference-anchors instead of only negatives
metrics:
  total_findings: 28
  P0: 4
  P1: 7
  P2: 8
  P3: 9
  user_journey_maps: 4
  pages_arc_audited: 10
  word_count: 7909
  em_dashes: 0
  legacy_domain_refs: 0
  sota_markers_referenced: [M2, M6, M7, M8, M9, M10, M12, M15, M21]
---

# Plan 16-04 Summary (Wave 2 Team 02, Brand voice, narrative arc, IA, user-journey maps)

> Research-only plan, atomic commit per AUTONOMOUS-PROTOCOL Rule 4, zero production code edits.

## One-liner

Brand voice plus narrative arc plus IA plus user-journey audit van de FMai marketing site tegen de 25 SOTA markers uit 16-01 plus de key-phrase glossary uit `fmai-nextjs/CLAUDE.md`, levert 28 ranked findings (4 P0, 7 P1, 8 P2, 9 P3) waarbij de drie grootste signalen zijn (1) vier vaardigheid-paginas (`email-management`, `manychat`, `reporting`, `research`) zijn IA-orphans in de SSR-DOM omdat top-nav-mega-menu JavaScript-gated rendert en footer ze niet dupliceert, wat M6+M7+M10+M12 in een keer breekt, (2) breadcrumbs ontbreken universeel over alle 93 DOM-snapshots, wat M8 expliciet faalt en GEO-LLMEO `BreadcrumbList` schema-citation ondermijnt, en (3) glossary-canon "Plan een gesprek" wint 50-plus locaties maar verliest op `/skills/social-media` ("Boek een gratis strategiesessie") plus `/apply` H1 ("Plan een partnership-gesprek") plus `/contact` H2 ("Plan een strategiegesprek"). 4 user-journey-maps tonen 1 narrative_break in de Bureau-owner-researcher-flow plus nul in de andere drie, dus IA-meta-layer-fixes hebben directe conversion-impact op de eerste persona. Aanbeveling voor 16-16: prioriteer orphan-4-rescue plus breadcrumb-rollout plus glossary-sync als Q3 top-3.

## What was produced

- `docs/audits/2026-05-18-v2/03-brand-narrative-ia.md`: 7909 woorden, 28 findings met volledig schema (severity / SOTA-marker / routes / viewports / locales / evidence-pad / code-pad / impact-hypothese / proposed fix / effort / confidence), executive summary boven, sitemap-tabel met 31 routes, top-nav plus footer comparison NL EN ES, breadcrumb-coverage analyse, glossary-scorecard met 10 termen, 4 user-journey-maps, narrative-arc-audit per 10 sleutelpaginas, top-25-ranked-findings, sources-set.

## Key findings (top 5 voor Wave 4 ingestion)

1. **Finding 1 (P0)**: Vier vaardigheid-paginas (`/skills/email-management`, `/skills/manychat`, `/skills/reporting`, `/skills/research`) zijn SSR-orphans omdat Header mega-menu JavaScript-gated rendert en Footer ze niet dupliceert. Faalt M6, M7, M10, M12 tegelijk. Fix is M-effort (4 footer-links plus optioneel mega-menu-SSR-refactor).
2. **Finding 2 (P0)**: Nul breadcrumbs over alle 93 DOM-snapshots, geen `BreadcrumbList` JSON-LD, geen `aria-label="Breadcrumb"`. Faalt M8 expliciet plus ondermijnt GEO-LLMEO. Fix is M-effort (1 component plus 30 route-mappings plus 3-locale strings).
3. **Finding 3 (P0)**: `/skills/social-media` CTA-block gebruikt "Boek een gratis strategiesessie" plus "Vraag een gratis strategiesessie aan" tegen canon "Plan een gesprek". P0 omdat conversion-doelpagina. Fix is S-effort (3 keys per locale, 9 totaal).
4. **Finding 6 (P0)**: Home page mist H2-niveau volledig (1 H1, 0 H2, 4 H3). Faalt M2 plus M9 indirect plus GEO-LLMEO content-extraction. Fix is S-effort (semantic restructure).
5. **Finding 26 (P1)**: `/apply` page-meta-title ("Plan een gesprek met Daley") wijkt af van H1 ("Plan een partnership-gesprek"), creeert SERP-snippet plus boven-de-vouw dissonantie. Fix is S-effort (align meta plus H1 op canon).

## Method notes

- Walked alle 93 DOM-snapshots in `fmai-nextjs/test-results/audit-v2/dom/*-{en,es,nl}.html` voor href-counts, breadcrumb-presence, heading-hierarchy.
- Cross-referenced `HeaderClient.tsx` plus `Footer.tsx` plus `skills-data.ts` om megamenu-versus-SSR-render gap te identificeren als root-cause van Finding 1.
- Greppedover `messages/nl.json` voor glossary-canon "Plan een gesprek" (50 plus matches), `klanten` (4 occurrences plus 1 in skills-data), `Boek` (1 variant op social-media), em-dash (0), `Sign up` of `Try free` (0), platform (legitimate-use only).
- Built 4 persona-journey-maps door plausible click-paths te traceren tegen H1 plus H2 plus CTA-renders per DOM-file.
- Did NOT touch `fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`, `fmai-nextjs/tailwind.config.*` per audit-invariant.

## Deviations from plan

- Plan-target was "minimaal 25 findings"; delivered 28 omdat user-journey-mapping 3 extra cross-cutting IA-issues opleverde (Findings 8, 20, 26) die niet schoon collapse in glossary of sitemap.
- Section-headings initially numbered (e.g. `## 1. Sitemap`) tot de verifier-regex `## Sitemap` faalde; un-numbered de canonische sections (Sitemap, Glossary scorecard, User-journey maps, Narrative arc audit, Top 25 findings, Executive summary, Sources) zodat verifier-PowerShell-checks slagen. Geen content-impact.
- Memory-page (Finding 28) en Founding-counter-consistency (Finding 22) zijn als POSITIVE benchmarks gemarkeerd in plaats van als findings; bewuste keuze om 16-16 fix-plan een reference-anchor te geven.
- `klanten` in assessment-q7 en q15 (`messages/nl.json:2769, :2836`) NIET als P0 gemarkeerd omdat context (bureau-zelf-reflectie over hun OWN klanten) glossary-canon respecteert; alleen `Reporting` shortDescription "per klant" (skills-data.ts:266) is een echte slip met P1.

## Constraint compliance

- Branch: `audit/2026-05-18-v2-sota` (verified)
- Em-dashes in doc: 0 (verified via grep)
- Em-dashes in commit message: 0 (commit string uses no em-dash)
- Canonical domain only (`future-marketing.ai`), zero `futuremarketingai.com` references in the doc
- Zero edits under `fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`, `fmai-nextjs/tailwind.config.*`
- Zero edits to STATE.md or BUDGET.log (orchestrator handles consolidation per plan-execution context)

## Self-Check: PASSED

- Branch: `audit/2026-05-18-v2-sota` (correct)
- Commit: `84222a2` (exact message `docs(audit): 16-04 Wave 2 brand voice narrative IA audit`)
- Files in commit: `docs/audits/2026-05-18-v2/03-brand-narrative-ia.md` only
- Production code diff vs HEAD~1 in 16-04 commit: empty (verified `git diff HEAD~1 HEAD -- 'fmai-nextjs/src/' 'fmai-nextjs/messages/' 'fmai-nextjs/next.config.*' 'fmai-nextjs/tailwind.config.*'`)
- STATE.md / BUDGET.log diffs in commit: empty
- Audit doc word count: 7909 (>= 800 required)
- Audit doc finding count: 29 raw `^### Finding` matches (28 unique findings plus 1 ranking-table appearance of "Finding 1"); ranking-table doesn't add ID, total unique = 28 (>= 25 required)
- Audit doc em-dash count: 0
- Audit doc legacy domain refs: 0
- Required sections present: Executive summary, Sitemap, Top-nav comparison NL/EN/ES, Footer comparison NL/EN/ES, Breadcrumb coverage, Glossary scorecard, Findings, User-journey maps, Narrative arc audit, Top 25 findings, Sources
- PowerShell verifier Task 1: PASS
- PowerShell verifier Task 2: PASS

## Handoff to Wave 3 plus 4 (plans 16-15, 16-16)

- The ranked backlog (28 findings, severity P0 to P3) is ready voor synthesis-team ingestion (16-15) plus fix-plan ingestion (16-16).
- Recommended Q3 priority order in doc top-25 table: orphan-4-skills (F1) plus breadcrumb-rollout (F2) plus glossary-sync social-media-cta (F3) plus home-H2-hierarchy (F6) plus apply-meta-H1-align (F26).
- Cross-plan dependencies: 16-07 SEO team owns hreflang-validation (Finding 27 deferred) plus full schema.org Service-Offer extraction; 16-11 i18n team owns full em-dash plus locale-divergence sweep (Findings 7, 12, 18); 16-15 synthesis-team correlates orphan-4 IA-finding tegen 16-07 SEO sitemap-output plus 16-03 visual-direction-B header-redesign.
- Memory plus Founding-member pages zijn als POSITIVE benchmark-anchors gemarkeerd voor 16-16 (Findings 22 plus 28); gebruik als reference voor andere pages.
- Open question voor 16-16: na orphan-4-rescue, wordt het 12-skill mega-menu permanent SSR-rendered of behoudt het JavaScript-gated reveal? Performance-team (16-09) heeft input nodig op bundle-impact.
