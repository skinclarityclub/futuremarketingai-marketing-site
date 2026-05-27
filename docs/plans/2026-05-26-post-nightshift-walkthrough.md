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

### Footer ✅ VOLTOOID 2026-05-27

**Commit**: `e363ff3` fix Clyde label overflow + scherpere eyebrows + cookie-link

**Diagnose**:
- Skill-label "Clyde AI Marketing Medewerker" overflowt in 2-col grid (truncate werkt niet door Tailwind flex `min-w-0` gotcha)
- Newsletter eyebrow "BUREAU" verwarrend boven email-input
- "Cookie-instellingen wijzigen" lang label

**Wijzigingen**:
- Footer.tsx skill-Link: `min-w-0 max-w-full` + `shrink-0` op status-dot
- i18n NL/EN/ES `nav.clyde`: lange labels → unified "Clyde Orchestrator" (cross-locale, product-naam-anchor)
- i18n `eyebrow.brand`: "Bureau"/"Agency"/"Agencia" → "Nieuwsbrief"/"Newsletter"/"Boletín"
- i18n `cookies.reopenLink`: shorter "Cookies aanpassen"/"Cookie settings"/"Ajustes de cookies"

**Open TODO**: meer socials toevoegen wanneer beschikbaar (nu LinkedIn + X).

### Sectie 17 — TrustStrip ❌ VERWIJDERD 2026-05-27

**Commit**: `f511086` verwijder sectie 17 — anti-climactic + content-overlap

**Diagnose**:
- Anti-climactic plaatsing direct na sectie 16 Final CTA (massive amber close-block)
- Content overlap: SKC autonomy claims al gezegd in sectie 3 + sectie 10
- Sales-after-sale pattern: premium close-flow = Final CTA → Footer direct

**Verwijderd**: inline JSX + home.trustStrip namespace uit NL/EN/ES.

### Fix tussendoor: cta.foundingLabel restored

**Commit**: `2cc983d` herstel home.cta.foundingLabel — nog door ServicesBento gebruikt

Per ongeluk verwijderd in commit ad0144f (Final CTA simplification). Key wordt ook door sectie 4 ServicesBento bottom-CTA gebruikt voor secondary button "Bekijk Founding tier" → /founding-member.

### Sectie 16 — Final CTA + scarcity ✅ VOLTOOID 2026-05-27

**Commit**: `ad0144f` definitive close-block + scarcity eyebrow + fix 'lifetime' jargon

**Diagnose huidige staat (v1)**:
- Title was vraag "Klaar om Clyde te leren kennen?" (zacht voor moment-of-decision)
- "lifetime founding-tarief" Engels jargon in NL-zin + ambigu (one-time payment risico)
- Dense subtitle (4 zinnen in 1 paragraph)
- Secondary CTA "Lees SKC case" competeerde met primary
- Geen visual weight als moment-of-decision
- Heavy dupe met sectie 14 closing-block (na vorige upgrade)

**Wijzigingen**:
- **Eyebrow** (nieuw): "Founding open · {taken}/{total} bezet" mono-amber scarcity-anchor met constants interpolatie
- **Title**: "Klaar om Clyde te leren kennen?" → "Tien plekken open. Daarna sluit founding." (5xl-6xl display, 2-line statement, scarcity-driven)
- **Subtitle**: "Tien founding plekken. 1 bezet. ... lifetime founding-tarief. Plan een gesprek van 30 minuten." → "€997 per maand, levenslang vast tarief. Een gesprek van 30 minuten zegt of het past." (factual, 2 short zinnen)
- **Verwijderd**: secondary CTA "Lees SKC case" + i18n keys buttonSecondary + foundingLabel (orphan)
- **Visual**: rounded-3xl amber-bordered card met `from-accent-human/[0.08] gradient bg` + radial blur top-center (echoes sectie 14 closing-block, maar BIGGER + premium "decision moment" weight)
- i18n NL/EN/ES: title, subtitle, button herschreven. Nieuwe eyebrow key. Orphan keys weg.

**Funnel-flow nu**: sectie 14 closing-block (qualifying "Klopt het verhaal?") → sectie 15 FAQ (objection-handling) → sectie 16 definitive close (scarcity + decision)

**Validatie**: NL/EN/ES alle 200, screenshot toont huge title + amber bg + single CTA als visuele closing-statement.

### Sectie 15 — FAQ accordion (5 vragen) ✅ VOLTOOID 2026-05-27

**Commit**: `304c980` sharper title + subtitle ipv generieke 'Veelgestelde vragen'

**Diagnose huidige staat (v1)**:
- Radix Accordion was technisch al strong (a11y-correct, single-collapsible, hover/open states)
- 5 vragen correct fact-checked tegen pricing + skills-data + ProcessTimeline + constants — geen feitelijke fouten
- Title "Veelgestelde vragen" generiek (zegt nieks)
- Geen subtitle/context

**Wijzigingen**:
- Title NL: "Veelgestelde vragen" → "Vragen die in elk eerste gesprek terugkomen" (confident, positioneert FAQ als social-proof + hint op high-touch nature)
- Title EN: → "Questions that come up in every first conversation"
- Title ES: → "Preguntas que aparecen en cada primera conversación"
- Subtitle toegevoegd: "Vijf antwoorden zodat ons 30-minuten gesprek over jouw situatie kan gaan." (legt FAQ-purpose uit, sluit aan op /apply Calendly 30 min)
- page.tsx wrapper aangepast: text-center mb-10 verplaatst naar div-container om subtitle te accommoderen

**Validatie**: NL/EN/ES alle 200, screenshot toont title + subtitle clean rendered boven 5 accordion items.

### Sectie 14 — IcpSection (who-is-this-for / not-for) ✅ VOLTOOID 2026-05-27

**Commit**: `eed4792` light polish + symmetric headings + closing CTA

**Diagnose huidige staat (v1)**:
- 2-col GlassCard fit/not-fit layout was al genre-standard sterk
- Subtitle "Geen marketingpraatje. Eerlijk gezegd: we werken liever niet met iedereen." al uitstekend
- Title was vraag ("Voor welke bureaus bouwen we Clyde?") — minder confident dan statement
- Headings asymmetrisch ("Voor wie werkt dit?" vraag vs "Waarschijnlijk geen match als" conditional)
- Geen closing CTA — user die zich in fit-column herkende had geen next-action

**Wijzigingen**:
- **Title**: "Voor welke bureaus bouwen we Clyde?" → "Voor wie dit werkt (en voor wie niet)" (statement met honest parenthetical)
- **Headings symmetrisch**: "Voor wie werkt dit?" → "Voor wie dit werkt", "Waarschijnlijk geen match als" → "Voor wie dit niet werkt" (parallel structure)
- **Closing CTA-row** toegevoegd: `flex-col sm:flex-row centered` met "Herken je jezelf links?" prompt + amber CTAButton "Plan een gesprek" → /apply
- i18n NL/EN/ES: title + fitTitle + notFitTitle herschreven + 2 nieuwe keys (`closingPrompt`, `closingCta`)
- `about.icp` namespace (andere page) intact gelaten

**Validatie**: NL/EN/ES alle 200, screenshot toont symmetrische headings + closing CTA visible centered onder de 2 kaarten.

### Sectie 13 — Trust 01-04 grid ❌ VERWIJDERD 2026-05-27

**Commit**: `5b2d941` verwijder sectie 13 — alle 4 claims dupliceerden andere secties

**Diagnose**:
Sectie 13 (4 numbered tiles in 1x4 editorial pattern) had massieve content-overlap met andere homepage secties:
- 01 "Clyde onthoudt alles" = sectie 5 MemoryUSPTeaser dupe
- 02 "AI-partner, max 20/jaar, Daley-onboarding" = sectie 12 Partnership pillar dupe
- 03 "SKC 3 IG, 4 merken" = sectie 3 CaseStudyCard + sectie 10 hero dupe
- 04 "EU-native, geen lock-in" = sectie 12 Compliance pillar dupe

Title "Waarom bureaus met Clyde werken" was variant van sectie 12 "Drie pijlers die geen US-tool kan matchen".

**Verwijderd**:
- Inline JSX block uit `src/app/[locale]/page.tsx`
- `home.trust` namespace uit `messages/nl.json`, `en.json`, `es.json`
- E2e test "should render Trust/Why Teams section" uit `tests/e2e/homepage.spec.ts`

**Resultaat**: pagina-flow wordt sectie 12 Pillars → sectie 14 IcpSection. Schoner, sterker, minder herhaling. Sectie-nummering blijft (13 is gewoon overgeslagen).

**Validatie**: NL/EN/ES alle 200, geen render-errors door missing translation-keys.

### Sectie 12 — Pillars bento (3 inhoudelijke tiles) ✅ VOLTOOID 2026-05-27

**Commit**: `ae0238b` polish-pass + subtitle + per-tile CTAs + fix heading-wrap

**Diagnose huidige staat (v1)**:
- Layout an sich was al SOTA (asymmetric bento, niet 1x4) — compliance col-span-2 + 2 stat-tiles
- **Compliance heading wraps lelijk**: "GDPR · EU AI Act" bij text-6xl breekt naar "GDPR · EU AI" / "Act" — middle-dot · op regel-eind
- Geen subtitle (sectie 10 + 11 hadden wel context)
- Geen CTA-links per tile (dood-end na proof-claims)
- Title "Gebouwd voor Europese bureaus" generiek/defensief

**Wijzigingen**:
- **Title**: "Gebouwd voor Europese bureaus" → "Drie ankers die geen US-tool kan matchen" (confident, EU-vs-US positioning)
- **Subtitle** toegevoegd: "EU-native compliance, EU-native infra en directe partnership. Geen CSM-laag, geen US-clouds, geen vendor lock-in."
- **Compliance heading** gesplitst van single-line "GDPR · EU AI Act" naar designed 2-line "GDPR-first." / "EU AI Act ready." (block-displayed spans). Font van text-4xl/5xl/6xl naar text-4xl/5xl (geen lg:6xl). i18n `compliance.heading` vervangen door `headingLine1` + `headingLine2`
- **Per-tile CTA-links** toegevoegd voor funnel-anchoring:
  - Compliance → /privacy ("Hoe wij data behandelen")
  - Infrastructure → /memory ("Bekijk de geheugenlaag")
  - Partnership → /about ("Lees meer over Daley")
- i18n NL/EN/ES: nieuwe `subtitle` + 3 `linkText` keys + headingLine split

**Validatie**: NL/EN/ES alle 200, screenshot toont 2-line compliance heading clean rendered, 3 tile-CTAs visible onderaan elk tile.

### Sectie 11 — PricingTeaser (founding-now + future preview) ✅ VOLTOOID 2026-05-27

**Commit**: `b1e35b0` founding-now hero + future-preview strip + lifetime-lock copy

**Diagnose huidige staat (v1)**:
- 1x4 uniform tier-grid (zelfde AI-pattern issue als oude sectie 10)
- **CRITICAL bug**: founding tile rendered "€997 per maand" naast Crown badge "LEVENSLANG VAST" en desc "Eenmalige founding-tarief" — driedubbele contradictie
- Geen per-tier CTA-buttons, alleen 1 tekst-link onder voor alle 4
- Title "geen verborgen credits" defensief
- 3 future tiers visueel gelijk aan founding terwijl alleen founding nu actionable is

**Belangrijke pricing-context (gemist in v1)**:
Founding €997 is een **MAANDPRIJS** met levenslang gelockt tarief (rate locked for life, never recalibrated). De andere tiers Growth/Pro/Ent recalibreren elk halfjaar, founding blijft €997. Niet "eenmalig" / one-time payment. Bewaard in `project_pricing_founding_lifetime_lock.md`.

**User-correctie tijdens implementatie**:
"Maar de founding prijs is wel een maandprijs he niet eenmalig 997, dit is per maand" — eerste versie had ik per ongeluk als one-time/lifetime payment gerenderd. Revert + herschrijf copy om "maandtarief, levenslang gelockt" precies te zeggen.

**Wijzigingen**:
- Layout: van 1x4 uniform-grid naar founding-dominant hero + 3 future-tier preview-strip
- **Founding hero** (full-width amber-bordered tile met radial bg-accent): Crown tagline-badge "Levenslang vast", label, big €997 met "per maand" unit, desc verwijst naar levenslang gelockt maandtarief, spotsTaken counter, amber CTAButton "Word founding partner" (primary variant, lg) → /apply
- **Eyebrow-divider** "Na de founding-fase" met horizontale line: visuele scheiding tussen actief-nu en preview-later
- **3 future tiers** compact 3-col strip (Growth/Pro/Enterprise): standaard card-pattern, geen CTA-buttons (niet actionable nu), "Beschikbaar na founding-fase" mono-footer voor preview-state-signaal
- Section-CTA reroute van /pricing → /apply met label "Plan een gesprek"
- Title: "Founding-tarief levenslang gelockt. Daarna per werkruimte." (was defensief "Transparante prijzen, geen verborgen credits")
- Subtitle: founding = €997 per maand nooit herijkt, andere tiers recalibreren elk halfjaar, founding blijft €997, hieronder preview
- Component-API toegevoegd: `futurePhaseEyebrow`, `futureAvailability`, `foundingCtaLabel`
- i18n NL/EN/ES title, subtitle, ctaLink, founding.desc herschreven. Em-dashes vervangen door komma per feedback_no_em_dashes

**Validatie**: NL/EN/ES alle 200, desktop screenshot toont founding-hero dominant met correct "€997 per maand" + Crown "Levenslang vast", 3 future-tiers preview-strip met "Beschikbaar na founding-fase" footer.

### Sectie 10 — TrustSignalsGrid (4 numerieke tiles) ✅ VOLTOOID 2026-05-27

**Commit**: `b4db912` asymmetric bento layout + scherpere cijfers + visible eyebrow

**Diagnose huidige staat (v1)**:
- 1x4 uniform grid (= AI-tell volgens premium B2B design-research)
- Heading `sr-only` (geen visuele anchor wat dit "is")
- Values inconsistent: mix van cijfers ("9 vaardigheden live", "1 van 10") en kwalitatieve facts ("NL en EU")
- "9 vaardigheden live" dupliceert sectie 4 ServicesBento subtitle
- "4 huismerken" abstract (leest als FMai-fact ipv SKC-fact)
- Tiles min-h 200px = veel lege witruimte, voelt onafgemaakt

**2 parallel agents geraadpleegd**:
1. **Explore** — homepage design-DNA inventory: card-pattern (`rounded-2xl border-border-primary bg-white/[0.02] hover:bg-white/[0.04] -translate-y-0.5`), typography-hiërarchie, sectie 4 ServicesBento doet asymmetric featured-tile (Clyde col-span-2), sectie 11 PricingTeaser doet featured-styling op founding (amber border+bg). Anti-patterns geïdentificeerd in v1 grid.
2. **General-purpose (Gemini Flash fallback, Perplexity quota op)** — externe research Stripe/Plausible/Vercel/Cursor "by-the-numbers" patterns. Conclusie: 70% premium sites = asymmetric of stat-strip, NIET 1x4. Numbers als hero (5xl-7xl), count-up alleen op echte cijfers, mixed value-types via visual differentiatie.

**Wijzigingen**:
- Visible eyebrow "Het bewijs in cijfers" (was `sr-only` heading "Belangrijke cijfers")
- Component-API herzien: `hero` + `signals` (3 secondaries) ipv `signals` (4 equal)
- **Hero tile** (full-width col-span-3 op md+): "36 per week" als 6xl-7xl display-font, narrative label "Posts autonoom uitgevoerd voor SkinClarity Club", sub-detail "21 carrousels + 15 posts, 3 IG-accounts, sinds Q4 2025", link rechtsonder, subtle radial bg-accent in top-right corner
- **3 secondary tiles** in 3-col strip (md+) of stacked (mobile):
  - skills: "9 / 12" + "Vaardigheden direct inzetbaar" (fraction-framing vermijdt echo met sectie 4)
  - founding: "1 / 10" + amber border `accent-human/40` + bg-gradient `from-accent-human/[0.06]` + "Schaarste"-eyebrow rechtsboven (visuele scarcity-differentiatie)
  - sovereignty: "100% EU" + "Data-residency en infra" (was "NL en EU" — harder cijfer)
- LazySection min-h 200px → 280px (past bij nieuwe density)
- Section padding `py-12` → `py-16 lg:py-20` (premium breathing room)
- Container max-w-5xl → max-w-6xl
- Hover-pattern voegt `border-accent-system/35` (resp `border-accent-human/60` voor founding) toe naast bestaande `bg-white/[0.04] -translate-y-0.5`

**Validatie**: NL/EN/ES alle 200, desktop + mobile screenshots OK. Hero "36 per week" dominant zichtbaar, founding amber-tile duidelijk visueel onderscheiden van skills/sovereignty.

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

## Wave 1 — Marketing depth

### /memory ✅ VOLTOOID 2026-05-27

**Commit**: `c4f91e5` SOTA upgrade — narrative reorder + scarcity CTA + drop tech jargon

**Route gekozen**: C + D + drop technical "geheugen-call" blocks (user-feedback: niet interessant voor bezoekers)

**Diagnose huidige staat (v1)**:
- 6× duplicate `hero.eyebrow` ("Geheugen per merk") in 6 verschillende sectie-headings + CTA — klassieke AI-tell
- "ChatGPT / Claude" in contrast-tile self-attack — Clyde wordt gebouwd op Claude API zelf
- Comparison.intro overcommit: "Niet hypothetisch: dit is hoe een dag eruit ziet" claimt dat demo-turns echte transcripts zijn
- "Week 1 vs week 12" mismatch met homepage 4-weken processTimeline ramp
- CTA mist homepage scarcity-pattern (geen `1/10` anchor, geen amber decision-energy)
- LayerCube cube + right-column hebben technische `memory.recall(...)` code-blocks die niet interesteren voor bureau-eigenaars
- MemoryComparison gebruikt inline mono-p ipv EyebrowLabel primitive (Fase 0 consistency)
- "Supabase RLS" technische jargon in isolation.body2

**Wijzigingen**:
- **6 unieke eyebrows** per sectie: Architectuur · Tijdcurve · Isolatie per merk · Dag en nacht · Geheugen in actie · Vergelijking · Founding scarcity. Hero behoudt "Geheugen per merk" als section-1 anchor.
- **Narrative-arc reorder**: hero → layers → progress → isolation → decay → comparison → contrast → CTA (wat → hoe → wanneer-merkbaar → trust → ritme → bewijs → vs → next)
- **Maand 1 versus maand 3** (was: Week 1 versus week 12) — natuurlijk maand-ritme, aligned met month-3 ramp-tijd post 4-weken onboarding
- **"Chat-AI (generiek)"** (was: "ChatGPT / Claude") — geen Claude self-attack, generieker = breder van toepassing
- **Comparison.intro softer**: "Dit patroon zien we elke werkweek terug bij SkinClarity Club" (was: "Niet hypothetisch: dit is hoe een dag eruit ziet")
- **CTA scarcity-pattern**: amber eyebrow "Founding open · 1/10 bezet" (via `FOUNDING_SPOTS_TAKEN/TOTAL` constants interpolation), invitational title "Klaar voor een AI die je merken kent?", 30-min subtitle aligned met homepage CTA
- **LayerCube**: drop `codeLabel` + per-layer `codeLine` props/keys (cube + right-column code-pre blocks). Active-state sterker: scale 1.02, ACTIEF/ACTIVE/ACTIVO pulse-badge, inactive opacity 0.35→0.18 voor sharper contrast, ring-opacity 50→60.
- **MemoryComparison**: EyebrowLabel primitive ipv inline mono-p
- **Drop Supabase RLS** jargon in isolation.body2 (technical detail niet user-facing)
- **Hero "AI-tool"** → "generieke AI-prompt" (CLAUDE.md glossary compliance)
- i18n: nieuw `activeLabel` key + 6 nieuwe section-eyebrows + reframe keys voor 3 locales

**Validatie**: NL/EN/ES alle 200, screenshot toont clean cube zonder technical code, 6 unieke eyebrows per sectie, amber scarcity-eyebrow op CTA, Maand 1/3 framing.

**Vervolg-iteraties same session**:
- `21f1dd5` fix(memory/layer-cube) — leesbaarheid Hot + Warm lagen. Gradient `via-bg-surface` -> `via-bg-deep`, tint /20 -> /15, body `text-text-secondary` -> `text-text-primary/90`, inactive opacity 0.18 -> 0.08.
- `ca236ec` fix(memory/layer-cube) — slide 1 duidelijker + z-ordering fix. Title 'Vandaag' -> 'Nu live' / 'Live now' / 'En vivo' (3 locales). Cube card title text-2xl -> text-3xl + meta.accent (per-layer kleur), mt-4 -> mt-5. Body shortened 27 -> 16 woorden, concreet-eerst. Z-ordering bug: activeShift 100 -> 220 (max baseZ delta was 180), active card nu altijd voorgrond, geen ghost-text meer.
- `0ab8c5a` test(memory) — mobile e2e script 8 sections × 3 locales. Per nieuwe feedback_mobile_test_per_page memory.

### /pricing ✅ VOLTOOID 2026-05-27

**Commit**: `47b58a7` restructure — bug-fixes + narrative reorder + progressive disclosure

**Route gekozen**: D (major restructure) + Lead Magnet naar onder hero

**Diagnose huidige staat (v1)**:
- Bug: `cta.description` bevatte `{maxPartners}` placeholder maar `t('cta.description')` werd zonder interpolation params aangeroepen, rendered LITERAAL als tekst in productie
- Dual-CTA: primary 'Plan een gesprek' + secondary 'Lees SkinClarity case' competeerden op moment-of-decision (homepage section 16 pattern al weggehaald)
- Lead Magnet CTA stond mid-page (tussen Visibility en Credit Packs), non-sequitur in flow
- FAQ vóór Visibility — trust-frame hoort vóór objection-handling
- Founding tier subtitle 'Aanbevolen voor early adopters' weak voor 10-plekken scarcity
- Skill Packs + Credit Packs = 2 vrij identieke 4-grids achter elkaar

**Wijzigingen**:
- **Bug-fix**: `t('cta.description', { maxPartners: MAX_PARTNERS_PER_YEAR })` interpolation. Mobile validation toont '20' rendered.
- **Single-button CTA**: secondary 'Lees SkinClarity case' verwijderd uit page.tsx + i18n cta.secondary key uit alle 3 locales (NL/EN/ES).
- **Founding subtitle**: 'Aanbevolen voor early adopters' / 'Recommended for early adopters' / 'Recomendado para early adopters' -> '10 plekken · levenslang anker' / '10 seats · lifetime anchor' / '10 plazas · ancla de por vida'.
- **Section reorder** (nu: hero -> lead-magnet -> tiers -> visibility -> matrix -> credit -> skill -> FAQ -> CTA). Visibility moet trust-frame zijn voor matrix; FAQ moet objection-handling vlak voor CTA zijn; Lead Magnet als top-funnel optie ipv mid-funnel interrupt.
- **Skill Packs progressive disclosure**: wrapped in `<details>` element met custom summary (eyebrow + title + chevron). Default-collapsed. Matrix blijft visible (trust-anchor die Visibility belooft).

**Validatie**: NL/EN/ES alle 200, mobile e2e 30/30 (3 locales × 10 sections), 0 JS errors van pricing zelf, `{maxPartners}` rendert '20', single-button CTA, Skill Packs collapse-state werkt.

**Vervolg-iteratie same session**:
- `da9fe04` fix(pricing) — verwijder Lead Magnet. User-feedback: page laadde traag tussen scan en tier overzicht. Scan is top-funnel-capture, /pricing bezoekers zijn al in decision-mode. Lead Magnet blijft op homepage + footer waar exploration-context past.

### /founding-member ✅ VOLTOOID 2026-05-27

**Commit**: `464c0f8` hero polish + section reorder + SpotScarcityGrid upgrade

**Route gekozen**: C (B + SpotScarcityGrid visueel upgraden)

**Diagnose huidige staat (v1)**:
- Hero title 'Eén keer, levenslang' / 'Once, for life' / 'Una vez, de por vida' — 'Eén keer' / 'Once' is ambigu (one-time payment misinterpretation risk per memory project_pricing_founding_lifetime_lock)
- Hero geen inline CTA — skim-readers moeten naar pricing-section scrollen voor eerste klikbare actie
- Pricing heading 'Jouw investering' / 'Your investment' / 'Tu inversión' generiek
- SKC proof onderaan tussen FAQ en final CTA — trust-anchor hoort vóór objection-handling, niet erna
- Quick Apply mid-page (na benefits) — friction-reducer past beter near-close dan mid-funnel
- SpotScarcityGrid was 5×2 rounded-full circles met generieke Check icon op bezet-tile — visueel licht, geen brand-recognition

**Wijzigingen**:
- **Hero polish**: 'Eén keer' → 'Eén keuze' + 'levenslang' → 'levenslang vast'/'gelockt' (vermijd one-time payment misinterpretation). Pricing card heading → 'De Founding-prijs'/'The Founding price'/'El precio Founding'. Nieuwe `hero.cta` i18n key 'Reserveer je plek'/'Reserve your seat'/'Reserva tu plaza' + amber CTAButton in hero.
- **Section reorder**: SKC proof verplaatst van bottom naar na benefits (trust-anchor positie). Quick Apply verplaatst van mid-page naar voor final CTA (near-close friction-reducer). Nieuwe order: hero → pricing → value → scarcity → benefits → proof → FAQ → quick-apply → CTA.
- **SpotScarcityGrid visual upgrade**: rounded-full circles → rounded-2xl tiles. Bezet-tile bg-[#127059] (SKC brand-green) + Image van `/brand/skc-emblem.png` heart-emblem ipv Check icon (consistent met homepage CaseStudyCard SKC badge pattern). Interface TakenSpot krijgt optionele `emblem` prop. Tile size: h-14/h-16 fixed → aspect-square w-full (responsive).

**Validatie**: NL/EN/ES alle 200, mobile e2e 30/30 (3 locales × 10 sections), 0 JS errors, SKC heart-emblem tile rendert correct op alle 3 locales, hero inline CTA + scherpere title bevestigd.

---

## Resterende secties (volgende sessies)

Volgorde, agent niet vooruitlopen:
- [x] Sectie 1-12, 14-16 + Footer (zie issue log)
- [x] Sectie 13 — Trust 01-04 grid (VERWIJDERD wegens overlap)
- [x] Sectie 17 — TrustStrip (VERWIJDERD wegens overlap + anti-climactic)
- [x] **HOMEPAGE VOLLEDIG VOLTOOID** 🎉
- [x] **Wave 1 page 1: /memory** ✅ (c4f91e5 + 21f1dd5 + ca236ec + 0ab8c5a)
- [x] **Wave 1 page 2: /pricing** ✅ (47b58a7 + da9fe04)
- [x] **Wave 1 page 3: /founding-member** ✅ (464c0f8)
- [ ] Wave 1 page 4: /case-studies/skinclarity-club (ScrollProgressRail, BeforeAfterTimeline)
- [ ] Wave 1 page 5: /about (MissionTimeline, CapacityBar)
- [ ] Wave 1 page 6: /how-it-works (5-stappen onboardingreis)
- [ ] Wave 2 — Skills (SkillPageTemplate + /skills index + 12 detail pages)
- [ ] Wave 3 — Conversion (/contact, /apply, /assessment, /assessment/result)
- [ ] Wave 4 — Utility (/roadmap, /legal/{cookies,privacy,terms})
- [ ] Wave 5 — Final cross-page consistency scan

---

## Hoe te resumeren bij context-reset

**Prompt voor nieuwe sessie:**

```
Lees C:\Users\daley\Desktop\Futuremarketingai\docs\plans\2026-05-26-post-nightshift-walkthrough.md

Homepage walkthrough VOLLEDIG VOLTOOID. Wave 1 page 1-3 voltooid 2026-05-27:
- /memory (c4f91e5 + 3 iteraties) — narrative reorder, drop tech blocks, slide 1 duidelijker, z-ordering fix
- /pricing (47b58a7 + da9fe04) — bug-fixes, section reorder, progressive disclosure, Lead Magnet weg
- /founding-member (464c0f8) — hero polish, section reorder, SpotScarcityGrid upgrade (SKC heart-emblem op brand-green tile)

Volgende: Wave 1 page 4 = /case-studies/skinclarity-club (DEEP — ScrollProgressRail, BeforeAfterTimeline, CountUp, 5 hoofdstukken). Path: `src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx`. i18n: `case_studies.skc` (41+ keys). Red flags: gallery section heeft placeholder `<Boxes />` icons (geen echte assets), BeforeAfterTimeline no length-validation, operator section duplicates SkcTestimonialBlock + 2 hardcoded quotes.

Daarna: /about, /how-it-works (Wave 1 rest), dan Wave 2 (Skills), Wave 3 (Conversion), Wave 4 (Utility), Wave 5 (final consistency scan).

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
3. **HOMEPAGE VOLTOOID** 🎉. Volgende fase: andere pagina's in volgorde. Begin met /memory (LayerCube 3D + comparison demo).
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
