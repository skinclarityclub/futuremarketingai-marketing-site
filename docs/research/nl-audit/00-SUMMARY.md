# NL Audit — Geconsolideerd Rapport

**Datum**: 2026-04-20
**Scope**: alle user-facing NL strings in `fmai-nextjs/messages/nl.json`
**Methode**: 7 parallelle agents, één per content-domein

## Totaalcijfers

| # | Domein | Keys | Issues |
|---|---|---:|---:|
| 01 | Home / Landing / Nav / Common / Errors / Calendly / Booking | ~155 | 42 |
| 02 | About / How-it-works / Contact / Pricing / Founding / Apply / Memory | ~280 | 57 |
| 03 | Case Studies / Blog / Chatbots | ~150 | 38 |
| 04 | Skills: Social / Ad Creator / Reel Builder / Blog Factory | ~136 | 43 |
| 05 | Skills: Voice Agent / Email / ManyChat / Lead Qualifier | ~125 | 42 |
| 06 | Skills: Research / SEO-GEO / Reporting / Clyde | ~180 | 58 |
| 07 | Legal (Privacy / Terms / Cookies) | ~26 | 21 |
| | **Totaal** | **~1052** | **301** |

Hit-rate: ~29% van alle strings heeft minimaal één issue.

## Cross-cutting patronen (over meerdere agents)

### 1. Spatie-komma-spatie ` , ` als em-dash-vervanger (KRITIEK, systemisch)

Komt terug in agents 1, 2, 3, 5. Ontstaan door eerdere em-dash-removal commit. Leest als bug in de UI.

**Affected keys (selectie)**:
- `home.*` badges, meta, CTA subtitle
- `pricing.meta.title`, `pricing.meta.description`, `pricing.matrix.notAvailable`
- `how-it-works.meta.title`, `founding-member.meta.title`
- `apply.form.tierOptions.*`
- `case_studies.skc.meta.title`
- `skills-email-management.features.feature4.body`

**Fix**: global search op ` , ` (spatie-komma-spatie). Vervang context-afhankelijk door `:`, `.`, of herschrijf zin.

### 2. Title Case in NL titels (systemisch — agents 1, 3)

Engelse conventie: "Wat Clyde Doet voor Jouw Bureau" / "Waarom Bureaus Clyde Inhuren" / "Veelgestelde Vragen".
NL regel: alleen eerste woord + eigennamen krijgen hoofdletter.

**Affected**: 8+ keys in `home.*`, alle `chatbots.*.title` en `chatbots.*.heading` velden.

### 3. Glossary-violaties (KRITIEK — alle agents)

Uit FMai-glossary worden de volgende woorden systematisch overtreden:

| Moet zijn | Staat nu | Frequentie |
|---|---|---|
| vaardigheden | skills / skill | 40+ voorkomens |
| merken / klantportfolio | klanten (voor eindklanten van bureaus) | ~15 |
| AI Marketing Medewerker | AI-medewerker / AI Employee | 3+ (incl. `skills-clyde.hero`) |
| merk / merkstem | brand / brand voice | 10+ |
| Clyde | AI-tool / tool / platform | 6+ |
| Onbeperkt (fair use) | Unlimited | 3 in Enterprise-tier |
| /mnd | /mo | ~20 in pricing/apply |
| aanmelding | applicatie | ~8 in apply-namespace |
| beoordelen / controleren | review / reviewt / reviewen | ~6 |
| werkruimte(s) | workspace(s) | mixed |

### 4. Ontbrekende diakritieken (trema's + cedille)

Systemisch in agents 2, 3, 5, 7:

| Staat nu | Moet zijn | Locatie |
|---|---|---|
| creert | creëert | about, memory |
| coordineren | coördineren | how-it-works, pricing |
| beeindiging / beeindigen | beëindiging / beëindigen | legal (meermaals) |
| categorieen | categorieën | legal.privacy |
| essentiele | essentiële | legal.cookies |
| anomalieen | anomalieën | skills-reporting, legal |
| authoriteit | autoriteit | case_studies.skc |
| groeistrategieen | groeistrategieën | blog.subtitle |
| videos | video's | skills-content |
| content-themas | content-thema's | skills-blog-factory |

### 5. Dunglish / onvertaalde vakterminologie

Hoogste concentraties in skills-pagina's. Zie individuele rapporten voor volledige lijsten.

**Top repeat offenders**:
- `brand voice` / `brand styling` / `brand guidelines` → merkstem / huisstijl / merkrichtlijnen
- `performance digest` / `performance tracking` / `performance content` → prestatie-rapportage / prestatiemeting
- `anomaly detection` / `Set-and-forget` / `Drop-alerts` → anomalie-detectie / automatisch / prestatie-alerts
- `keyword research` / `keyword tracking` / `rank tracking` → zoekwoord-onderzoek / posities volgen
- `Natural language` (4 voorkomens in features) → gewone taal
- `actionable insights` → praktisch toepasbare inzichten / bruikbare inzichten
- `scheduling` / `schedulen` → inplannen
- `call logging` / `inbound/outbound` / `widget deployen` → gesprekslog / inkomend/uitgaand / widget plaatsen
- `managen` / `committen` / `empoweren` / `leveragen` / `connecten` / `editen` / `syncen` — overal beheren / koppelen / bewerken / synchroniseren

### 6. U/je-inconsistentie

- Overall: site gebruikt "je/jouw" (correct per style guide)
- Uitzonderingen die geharmoniseerd moeten:
  - `chatbots.demo.tabs.concierge.scenario` — "uw"
  - `chatbots.multi_platform.subtitle` — "uw"
  - `apply.errors.missingRequired` — "alsjeblieft" (please-vertaling)
- Legal namespace: intern inconsistent — terms+privacy = "u", cookies+disclaimer = "je". Voorstel: alles naar "u" (legal-standaard).

### 7. Harde grammaticale breuken (BLOKKERS)

| Key | Probleem | Fix |
|---|---|---|
| `skills-lead-qualifier.useCases.useCase1.body` | "Chat kwalificeert voor sales-team leads filtert." — niet parseerbaar | Volzin herschrijven |
| `skills-voice-agent.useCases.useCase1.body` | "hoge belvolume" (het-woord) | "hoog belvolume" |
| `skills-voice-agent.integrations.integration3` | "meetreizen" (typo) | "meereizen" |
| `skills-ad-creator.*` | "Ideal voor" | "Ideaal voor" |
| `skills-ad-creator.*` | "Ads generen" | "Ads genereren" |
| `skills-clyde.cta.title` | "Klaar om je AI-medewerker aan Clyde over te dragen?" — logica-fout (Clyde ÍS de medewerker) | "Klaar om Clyde als AI Marketing Medewerker in te zetten?" |
| `founding-member.benefits.items.onboarding.description` | "Enige eenmalige kost is gratis" — onlogisch | Herschrijven |
| `case_studies.skc.*` | "Score" als imperatief | "Scoor" |
| `chatbots.*` | "voordat publicatie" | "vóór publicatie" |
| `chatbots.*` | "in de achtergrond" | "op de achtergrond" |

### 8. Karakter-lek

`skills-email-management.useCases.useCase1.body` noemt **Sindy** in generieke email-copy. Sindy is alleen de operator in SKC case study, niet in algemene voorbeelden. Verwijderen of vervangen door generiek "de operator".

### 9. Duplicate namespaces

`common.errors` en `errors` zijn duplicaten met dezelfde issues. Overweeg samenvoeging in één namespace.

## Prioritering voor fix

### Wave A — quick wins (global find/replace, lage risico)
1. Global ` , ` (spatie-komma-spatie) sweep → context-afhankelijk vervangen
2. Global `/mo` → `/mnd` (~20x)
3. Global `skills` → `vaardigheden` in user-facing copy (niet in dev code)
4. Global trema-fixes (lijst in sectie 4)
5. `Unlimited` → `Onbeperkt (fair use)` in Enterprise-tier (3x)
6. `authoriteit` → `autoriteit`, `videos` → `video's`, etc.

### Wave B — per-key content rewrites (menselijk oordeel nodig)
7. Title Case → sentence case in NL titels (~8 in home, plus alle `chatbots.*` headings)
8. Glossary: `klanten` → `merken`/`klantportfolio` (context-afhankelijk)
9. Glossary: `brand voice` → `merkstem` etc.
10. Dunglish in hero-subtitles (agents 5, 6 hebben specifieke top-10)
11. U/je-harmonisatie in legal namespace

### Wave C — structurele rewrites
12. Harde grammaticale breuken (sectie 7)
13. Logica-fout `skills-clyde.cta.title`
14. Sindy-lek in generieke email-copy
15. Skill-feature bodies die 4 Engelse termen achter elkaar hebben (bv. `skills-reporting.hero.subtitle`)

### Wave D — bulk review
16. Per skill-pagina alle features/how/useCases/proof blokken nogmaals lezen als native NL copywriter

## Vervolgstappen

Optie 1 (aanbevolen): één PR per wave, beginnen met Wave A (find/replace). Dit geeft ~40-50% van issues weg met minimaal risico.

Optie 2: één grote rewrite-PR per domein (7 PR's, 1 per agent-rapport). Meer review-werk maar beter te beoordelen per pagina.

Aantallen per optie:
- Wave A alleen: ~60 issues weg
- Wave A+B: ~180 issues weg
- Alle waves: 301 issues weg

## Referentiebestanden

- `01-home-landing-nav.md`
- `02-core-marketing.md`
- `03-case-studies-blog.md`
- `04-skills-content.md`
- `05-skills-communication.md`
- `06-skills-intelligence.md`
- `07-legal.md`
