# Post-nightshift site walkthrough — handover

**Datum start**: 2026-05-26 13:59
**Laatste sessie**: 2026-05-27 (huidige handover)
**Status**: in progress — homepage sectie 1-8 voltooid, sectie 9+ open

---

## Context

Na de autonome nightshift (Fase 0-10, $106.87, 45 commits, all live op `origin/main`) doet user een **gerichte visuele walkthrough** van de hele site. Per sectie kritische evaluatie + grondige upgrade.

Aanpak per sectie: lezen → screenshot → eerlijke kritiek → user kiest verbeteringen → implementeren → atomic commit + push.

---

## Procedure

1. Read component + i18n + screenshot huidige state
2. Geef kritische evaluatie (severity per punt) + 3-5 concrete voorstellen
3. Voor diepe sectie's: spawn 2-3 parallel agents (design critic / copy research / strategie)
4. User kiest via `AskUserQuestion` welke fixes
5. Implementeer + visueel verify + atomic commit
6. Door naar volgende sectie

**Geen scope-creep**: alleen pakken wat user akkoord geeft.

---

## Issue log

### Header mega-menu (2 issues) ✅ VOLTOOID 2026-05-26

- `9b03a88` width 880→1240px, badge compacter (truncated labels gefixt)
- `2b51e9b` viewport-centered ipv left-edge (overlap met Clyde hero weg)

### Sectie 1 — Hero ✅ VOLTOOID 2026-05-27

**Commits**: `44b183a` content herpositie + sitewide eerlijke skill-count

**Wijzigingen**:
- Anthropic 2-tier hiërarchie: H1 "Dit is Clyde." + tagline "Jouw AI marketing medewerker."
- KineticHeadline timing langzamer (0.18 per-word) + duration 0.55s
- Subtitle alleen LIVE skills (was: voice+ads als if-live)
- Trust-anchor: "Live in productie sinds 2025" (was: hardcoded SKC)
- Trust-cluster chip 1: "Gebouwd voor bureaus" + Briefcase (was: hardcoded SkinClarity Club)
- Sitewide honest-12 fixes: FAQ q1, footer tagline, SKC case chip3, mega-menu tagline

**3 agents geraadpleegd**: design-critic (Anthropic pattern), copy-research (premium AI sites), positioning-strategist (Medewerker-frame). User koos Anthropic pattern.

### Sectie 2 — LeadMagnetCTA (bureau-scan) ✅ VOLTOOID 2026-05-27

**Commit**: `aaed995` i18n bug-fix in ResultPreview

**Wijzigingen**:
- Rechterkolom ResultPreview had 17 hardcoded NL strings (bars labels, profile text, skills descs, footer)
- Nieuwe `leadMagnet.preview.*` sub-namespace in NL/EN/ES
- ResultPreview gebruikt nu `useTranslations('leadMagnet.preview')`
- Skill brand-names (Blog Factory, Reporting, Research) blijven hardcoded

### Sectie 3 — CaseStudyCard (SKC) ✅ VOLTOOID 2026-05-27

**Commits**:
- `9cd62de` SKC lockup logo (vervangen placeholder)
- `70ae01f` logo op #127059 brand-groen badge
- `22fd581` switch naar heart-emblem in ronde badge (premium B2B avatar-pattern)
- `4522b2b` outcome-headline + eerlijke outcome-metrics
- `da1a7dc` naam-fix Sindy Kienstra (was: van der Wal — verzonnen) + 4 copy upgrades

**Wijzigingen**:
- Logo asset gekopieerd: `/c/Users/daley/Desktop/Logo/icon without text/PNG.png` → `public/brand/skc-emblem.png` (746x684 transparent)
- Full lockup ook beschikbaar: `public/brand/skc-logo.png`
- Outcome-headline pattern: "Hoe Clyde 36 posts per week autonoom publiceert"
- 3 outcome-metrics: Volledig autonoom | €5.000/maand bespaard (dominant) | 36 posts/week
- Detail page `case_studies.skc.outcomes.monthlySavings` bijgesteld €3K → €5K voor consistentie
- Quote 2-pronger: "...werkt als vaste medewerker, onthoudt elk merk apart en plant zelf over drie accounts."
- Eyebrow: "Operator interview · SkinClarity Club" (was "Bewijs"/"Founding case")
- CTA: "Bekijk het operationele rapport met bronnen" (was "Lees de volledige case")

**3 agents geraadpleegd**: copy-critic, premium B2B research, outcome-metric strategist.

### Sectie 4 — ServicesBento (12 skills) ✅ VOLTOOID 2026-05-27

**Commits**:
- `4e9dd8b` ManyChat live fix + ChatSimulation op Clyde tile
- `3e5f725` subtitle eerlijk (12/9 framing) + Social Media als featured tile (col-span-2)

**Wijzigingen**:
- ManyChat DM status: `coming_soon` → `live` in ServicesBento (skills-data.ts had al `live`)
- Nieuwe `ChatSimulation` component (`src/components/motion/ChatSimulation.tsx`): user typt → thinking dots → Clyde antwoordt word-by-word → erase → loop
- 3 prompt+response pairs in `home.services.clyde.response1/2/3`
- Subtitle: "Twaalf vaardigheden, negen direct inzetbaar" (was alleen "Negen vaardigheden")
- Social Media Manager `featured: true` → `sm:col-span-2` met grotere icon/title/desc

### Sectie 5 — MemoryUSPTeaser ✅ VOLTOOID 2026-05-27

**Commits**:
- `730efdd` v1: comparison demo + 2x2 grid + SKC-concrete layer bodies
- `b75cdfc` v2: live parallel typing (vervangt static cards) + product-name fix + eerlijke CTA
- `859b4a5` v3: parallel → sequential storytelling (user feedback: parallel te overweldigend)

**Wijzigingen**:
- Nieuwe `MemoryLiveComparison` component (`src/components/home/MemoryLiveComparison.tsx`)
- Sequential state-machine: thinking-other → typing-other → verdict-other → pauze → thinking-clyde → typing-clyde → verdict-clyde → finalHold → loop
- Inactive card dimmed (opacity 0.5), active card "Live" badge met pulsing dot
- 4 layer bodies SKC-concreet (echte @sindy_huidtherapeut accounts, +18% engagement)
- 2x2 grid layout (was vertikale stack)
- CTA: "Bekijk de 4-laagse geheugen-visualisatie" (eerlijk over wat /memory toont, geen overclaim)
- Clyde compare-response generiek brand-aware (geen product-name die niet klopte met shop)

**3 agents geraadpleegd**: copy-critic, premium B2B research, outcome-metric strategist.

### Sectie 6 — ComparisonTable (DIY/Bureau/Clyde) ✅ VOLTOOID 2026-05-27

**Commit**: `c98136a` 5 verbeteringen voor credibility + samenvatting

**Wijzigingen**:
- Title offensief: "Drie modellen, een keuze die schaalt" (was defensief "Waarom...NIET nog meer tools")
- Setup-cel Clyde: `strong` → `mixed` (4 weken IS langer dan DIY's 2-3w — eerlijke tradeoff voor credibility)
- Prijsrange: "1.196 tot 1.996" → "997 tot 1.996 euro" (match pricing SSoT)
- DIY hint modern: "ChatGPT, Jasper, Buffer" → "ChatGPT, Claude, Buffer"
- Nieuwe RESULTAAT recap-rij in `<tfoot>`: DIY ("Veel handwerk"), Bureau ("Lineaire kosten"), Clyde ("Schaalt mee" bold+accent)

### Sectie 7 — ProcessTimeline (4-week onboarding) ✅ VOLTOOID 2026-05-27

**Commits**:
- `b0d0886` deliverables per week + tijd-investering chip + CTA
- `29cb96d` koppel weken aan ECHTE product-features (brand-scan, Stitch, pijlers, voice-iteraties)
- `01a263c` realistic hours + perfect alignment + card design wrapper
- `0c8d4e9` verwijder scheve horizontal connector line

**Wijzigingen**:
- Per week: heading + body + deliverable (✓ check) + clientHours chip (🕐 klok)
- Echte product-features uit fma-app: brand-scan, IG-analyse, content-pijlers (4-6), Stitch design-system, brand-voice iteraties (max 3 — matched aan productslimiet), Founder Slack
- Uren herzien (realistisch): 2u / 2u / 4u / 2u per week doorlopend (totaal 8u setup + 2u/week)
- Cards in `<article>` wrapper met `border + bg-bg-surface/30 + rounded`
- `flex-col h-full + mt-auto` op deliverable → alle 4 deliverables exact uitgelijnd onderaan
- Title: "In 4 weken: van eerste gesprek naar autonome content"
- Subtitle positief-eerst (was defensief "Geen lange RFP, geen onboarding-PDF")
- CTA: "Plan een gesprek" + slot-hint "Beschikbare onboarding-slots: 2 per maand"
- Horizontal gradient-line verwijderd (was scheef + niet uitgelijnd met cards)

### Sectie 9 — TestimonialBlock (Sindy operator-stem) ✅ VOLTOOID 2026-05-27

**Commit**: `2c413c7` editorial pull-quote layout + brand-voice angle + verified attribution

**Wijzigingen**:
- Layout: van centered minimal stack (eyebrow + tiny avatar + quote-icon + 1-regel quote) naar **asymmetric portrait-left + editorial quote-right** (md+), met thin border-top separator naar attribution-rij
- `HAS_PORTRAIT` flag voor `/public/images/sindy-portrait.webp` (mirror van FounderSection-pattern, fallback `SK`-initials in accent-human gradient)
- Portrait verhoogd van w-24 h-24 (placeholder S) naar w-32 lg:w-36 (premium B2B testimonial scale)
- **Volledige naam Sindy Kienstra** (was: alleen "Sindy") — consistent met sectie 3 + case-study page
- **Nieuwe quote-angle (brand-voice)** breekt echo met sectie 3 ("vaste medewerker"). Quote ligt nu op brand-voice memory feature (max 3 voice-iteraties → 4 huismerken):
  - "Ik herken onze merken in elke caption die online gaat. Vier huismerken, vier stemmen, niet één keer generieke AI-toon. Dat had ik niet verwacht."
- Eyebrow "Het moment waarop het klikte" (was: "Operator-perspectief" — overlapte met sectie 3 "Operator interview · SkinClarity Club")
- Eyebrow kleur: **accent-human (amber)** — differentieert van sectie 3 + sectie 8 (beide accent-system teal)
- LinkedIn-link (case-study URL `https://www.linkedin.com/in/sindy-skinclarity`) + CTA `/case-studies/skinclarity-club` ("Lees het volledige interview") in attribution-rij
- Display-typografie 2xl md:3xl lg:[2.25rem] geeft sectie de weight die past bij sectie 8 manifest-stack
- Quote-icon verwijderd (typografie draagt het sentiment al)
- i18n in NL/EN/ES: 3 nieuwe keys (`linkedinUrl`, `linkedinLabel`, `ctaLabel`)

**TODO voor user**: foto van Sindy droppen op `/public/images/sindy-portrait.webp` (min 288×288, vierkant). `HAS_PORTRAIT` flipt automatisch true bij volgende build. Aparte file van case-study `sindy-headshot.jpg` (die ook nog placeholder is). Optie: later beide paden naar 1 SSoT mergen.

**Strategische lens**: sectie 3 (CaseStudyCard) = business-proof (metrics + autonomie), sectie 9 (TestimonialBlock) = human/emotional-proof (brand-voice moment van herkenning). Twee Sindy-quotes zijn nu complementair ipv redundant.

### Sectie 8 — FounderSection (Daley intro) ✅ VOLTOOID 2026-05-27

**Commits**:
- `00db443` type-first centered layout + eerlijke naam + credentials
- `b95e55f` manifest-stijl drievoudige ik-actie + correcte delivery-taal (quote-revisie)

**Wijzigingen**:
- Layout: van links-portret/rechts-tekst → type-first centrum (grote pull-quote, proof-laag, kleine avatar onderaan)
- Quote ingekort: 4 zinnen → 2 hero-zinnen ("Geen helpdesklaag, geen ticketing. Bij elke partner staat mijn nummer in de WhatsApp.")
- Proof-laag onder quote: "Founder-led builds. Geen account-manager tussen jou en de code."
- Volledige naam: `home.founder.name` Daley → **Daley van Diest** (+ /about `fullName` was foutief "Daley Maat" → fixed naar Daley van Diest in NL/EN/ES, PersonJsonLd nu correct)
- 3 credential-chips onder role: SENIOR ENGINEER · N8N + LLM STACK · EU-NATIVE INFRA
- CTA actie-gericht: "Bekijk mijn werkwijze →" (was vaag "Meer over Daley en de aanpak")
- Portret: `HAS_PORTRAIT` flag detecteert `/public/images/daley-portrait.webp` automatisch via `fs.existsSync` — placeholder "D" tot user foto dropt
- Avatar kleiner (w-20 lg:w-24) ipv groot (w-40 lg:w-56) — past bij type-first hiërarchie

**TODO voor user**: foto droppen op `/public/images/daley-portrait.webp` (min 192×192, vierkant, transparent of gradient bg). `HAS_PORTRAIT` flipt automatisch true bij volgende build.

**Quote-revisie 2026-05-27 (b95e55f)**:
- User-diagnose: vorige quote ("Geen helpdesklaag, geen ticketing. Bij elke partner staat mijn nummer in de WhatsApp.") sloot niet aan bij Clyde / AI-medewerker frame
- 2 parallel agents geraadpleegd: premium AI/dev founders (Anthropic, Linear, Cursor, Resend, Posthog, Marc Lou, Levels) + B2B AI agencies (Acuity AI sterkste pattern-match)
- Critical fact-check: Clyde is **hosted SaaS** (bureaus loggen in op Daley's dashboard), GEEN on-site install. Werkwoorden gecorrigeerd naar trainen/leren ipv installeren — opgeslagen in memory `project_clyde_delivery_model.md`
- Gekozen archetype: Acuity-pattern "person you meet is person who delivers" → drievoudige ik-actie
- Nieuwe quote (3 zinnen, manifest-stack):
  - "Ik schrijf Clyde's code."
  - "Ik leer hem jouw merken kennen."
  - "Ik blijf in onze Slack als je iets nodig hebt."
- Proof-laag uitgebreid: "Founder-led builds. Geen account-manager tussen jou en hoe Clyde voor jouw merken werkt."
- i18n: 3 keys (quote1/2/3) voor visuele controle, elke zin krijgt eigen `<p>` met `space-y-1 md:space-y-2`

---

## Resterende secties (volgende sessies)

Volgorde, agent niet vooruitlopen:
- [x] Sectie 1-9 (zie issue log)
- [ ] **Sectie 10 — TrustSignalsGrid (4 numerieke tiles)** ← HIER VERDER
- [ ] Sectie 11 — PricingTeaser (4 tiers, founding dominant)
- [ ] Sectie 12 — Pillars bento (3 inhoudelijke tiles)
- [ ] Sectie 13 — Trust 01-04 grid
- [ ] Sectie 14 — IcpSection (who-is-this-for/not-for)
- [ ] Sectie 15 — FAQ accordion (5 vragen)
- [ ] Sectie 16 — Final CTA + scarcity
- [ ] Sectie 17 — TrustStrip (compact close)
- [ ] **Andere pagina's** in volgorde:
  - /memory (LayerCube 3D, comparison demo)
  - /pricing (WorkspaceSlider, tier bento, FAQ)
  - /founding-member (SpotScarcityGrid, QuickApplyTeaser)
  - /case-studies/skinclarity-club (ScrollProgressRail, BeforeAfterTimeline)
  - /about (MissionTimeline, CapacityBar)
  - /how-it-works (5-stappen onboardingreis)
  - /skills (index bento + Clyde featured tile)
  - /skills/{12 skills} (template parts)
  - /contact, /apply, /assessment + /assessment/result
  - /blog (index + post), /roadmap, /logo-lab, /newsletter/confirm
  - /legal (cookies/privacy/terms)
  - Footer

---

## Hoe te resumeren bij context-reset

**Prompt voor nieuwe sessie:**

```
Lees C:\Users\daley\Desktop\Futuremarketingai\docs\plans\2026-05-26-post-nightshift-walkthrough.md

We doen een interactieve walkthrough van de homepage. Sectie 1-9 voltooid (laatste sessie: TestimonialBlock editorial pull-quote + brand-voice quote-angle, commit 2c413c7).

Volgende: sectie 10 TrustSignalsGrid (4 numerieke tiles).

Procedure per sectie:
1. Lokaliseer component (Glob/Grep) + lees component + i18n (alle 3 talen)
2. Screenshot via fmai-nextjs/scripts/screenshot-founder.mjs als template (kopieer + pas selector aan)
3. Kritische eval met severity-tabel + 3-5 concrete voorstellen
4. Spawn 2-3 parallel agents voor zware secties (design-critic + copy-research + strategist) — alleen wanneer warranted
5. AskUserQuestion welke fixes te implementeren — bij stuck, vraag eerst diagnose (welke laag faalt) voordat je opties presenteert
6. Implementeer + visueel verify (screenshot v2) + atomic commit + push
7. Update walkthrough doc met commit-SHA en wijzigingen onder issue-log

Pre-flight check vóór sectie 9:
- `git status --short` (main moet clean zijn, alleen playwright-report/screenshots als orphan)
- `git pull origin main` (user kan tussendoor scripts hebben gecommit)
- Dev server: `npm run dev` in fmai-nextjs/

Conventies:
- Clyde = hosted SaaS, geen on-site install (zie memory project_clyde_delivery_model.md). Werkwoorden: trainen/leren, NIET installeren/deployen
- Geen em-dashes (—) in user-facing copy
- Sindy = Kienstra (volledige naam Sindy Kienstra). Geen SKC co-eigendom claim voor Daley
- Atomic commits + push naar main per fix
- Bij design-keuze: 2-3 sentence advies + tradeoff, dan user beslist
- Geen scope-creep — alleen wat user akkoord geeft
- i18n ALTIJD in alle 3 talen (NL primary, EN+ES vertaald)
```

**Status bij hand-off (2026-05-27 einde sessie):**

- Branch: `main` synced met origin
- Sessie commits (chronologisch): zie issue log per sectie hierboven
- Main HEAD chronologisch (meest recent eerst):
  - `22b9f42` perf(critical-css): inline above-the-fold CSS via postbuild Beasties (door user, niet walkthrough)
  - `4fbcc86` chore(scripts): health-check.ps1 — one-glance PC status (door user)
  - `bb3b974` chore(cleanup): include python in orphan detection (door user)
  - `4f74256` chore(scripts): hourly auto-cleanup task + wider default port range (door user)
  - `710d5bd` docs(walkthrough): quote-revisie sectie 8 + clyde-delivery model captured ← walkthrough
  - `b95e55f` content(founder): manifest-stijl drievoudige ik-actie + correcte delivery-taal ← walkthrough
  - `354c189` chore(scripts): cleanup zombies + port-guarded start + EBUSY-fixed lighthouse (door user)
  - `cd4d4d0` docs(walkthrough): handover na sectie 8 FounderSection voltooid ← walkthrough
  - `00db443` content(founder): type-first centered layout, eerlijke naam + credentials ← walkthrough
- Dev server: niet draaiend bij hand-off
- Uncommitted: `playwright-report/index.html` (gewijzigd, niet commit-waardig) + screenshot-PNGs in working dir (founder-section-v*.png) + nieuwe agent-genoteerde plan-docs in `../docs/plans/2026-05-27-*` (door user gemaakt, niet door walkthrough — leave alone)

**Open TODO's bij hand-off:**

1. **Daley levert portretfoto** → drop in `fmai-nextjs/public/images/daley-portrait.webp` (min 192×192, vierkant). `HAS_PORTRAIT` flag in [FounderSection.tsx](../fmai-nextjs/src/components/home/FounderSection.tsx) flipt automatisch via `fs.existsSync`. Geen code-edit nodig — volgende build pakt 'm op.
2. **Sindy levert portretfoto** → drop in `fmai-nextjs/public/images/sindy-portrait.webp` (min 288×288, vierkant). `HAS_PORTRAIT` flag in [TestimonialBlock.tsx](../fmai-nextjs/src/components/home/TestimonialBlock.tsx) flipt automatisch via `fs.existsSync`. Aparte file van case-study `sindy-headshot.jpg` (die ook nog placeholder is).
3. **Sectie 10 — TrustSignalsGrid (4 numerieke tiles)** is HIER VERDER. Lees component + i18n, screenshot, kritische eval, AskUserQuestion, atomic commit.
4. Walkthrough doc is single source of truth — update na elke sectie.
- Nieuwe componenten in deze sessie:
  - `src/components/motion/ChatSimulation.tsx` (gebruikt door ClydeFeaturedTile)
  - `src/components/home/MemoryLiveComparison.tsx` (gebruikt door MemoryUSPTeaser)
- Nieuwe assets: `public/brand/skc-emblem.png`, `public/brand/skc-logo.png`
- i18n keys toegevoegd in alle 3 talen:
  - `home.hero.tagline` (was headlineAccent), `home.hero.trustCluster.target`
  - `home.services.clyde.response1/2/3`, `userLabel`, `clydeLabel`
  - `home.caseStudyCard.outcomeHeadline`, `metric1Value/Label..metric3Value/Label`
  - `home.memoryUsp.compare.*` (10 keys)
  - `home.comparison.recap.*` (label, diy, bureau, clyde)
  - `home.processTimeline.weeks.*.deliverable` + `clientHours`, plus `ctaLabel` + `ctaHint`
  - `leadMagnet.preview.*` (17 keys: heading, profile, bars, skills, etc.)
  - `home.founder.proof` + `home.founder.chips.engineer/stack/infra` + `home.founder.name` (Daley → Daley van Diest)
  - `home.founder.quote` → split into `quote1/quote2/quote3` (3 zinnen manifest-stack)
  - `about.founder.fullName` (Daley Maat → Daley van Diest — was foutief)

**Belangrijke ontdekkingen tijdens sessie:**

- Sindy heet **Kienstra**, niet "van der Wal" (ik had verzonnen) — fixed
- SKC brand-groen: **#127059** (gebruikt voor logo-badge)
- SKC logo-map ligt op `C:\Users\daley\Desktop\Logo\` met "icon with text" + "icon without text" subfolders
- ManyChat DM is **LIVE** maar stond per ongeluk als coming_soon in ServicesBento.tsx (skills-data.ts had wel `live`)
- fma-app heeft 2 echte onboarding-wizards (agency 4-step + client 10-step) met concrete features (brand-scan, IG-analyse, pijlers, Stitch design-system, brand-voice iteraties max 3) — gebruikt voor ProcessTimeline concretisering
- **Clyde is hosted SaaS** (bureaus loggen in op Daley's dashboard), GEEN on-site install. Marketing copy moet "trainen/leren" gebruiken, niet "installeren". Opgeslagen in memory `project_clyde_delivery_model.md`
- Daley's volledige naam = **Daley van Diest** (eerdere /about copy had foutief "Daley Maat")

**Convention reminders:**

- NIET committen: `playwright-report/`, `test-results/`, externe ongerelateerde modificaties van user (page.tsx perf-edits door user gemaakt — leave alone tenzij gevraagd)
- Wel committen: messages/*.json, eigen component edits, nieuwe assets in public/
- Bij i18n-updates: ALTIJD alle 3 talen (NL primary, EN+ES vertalen)
- Bij component refactor: update page.tsx prop-passing in zelfde commit
