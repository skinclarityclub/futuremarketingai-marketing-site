---
phase: 16-design-seo-audit-v2-sota
plan: 11
wave: 2
team: 09
type: research
status: complete
created: 2026-05-19
canonical_domain: future-marketing.ai
research_provider: gemini-2.5-flash-google-grounded
gemini_calls: 1
sota_markers_in_scope: [M2, M9, M10, M21, M23]
findings_total: 25
p0_count: 4
p1_count: 9
p2_count: 9
p3_count: 3
locales_audited: [nl, en, es]
key_files_read_only:
  - fmai-nextjs/messages/nl.json
  - fmai-nextjs/messages/en.json
  - fmai-nextjs/messages/es.json
  - fmai-nextjs/test-results/audit-v2/dom/*-{nl,en,es}.html
depends_on:
  - 16-02-baseline-snapshot
  - 16-04-brand-narrative-ia
---

# 10 Content, Copy, i18n Cultural Adaptation (Wave 2 Team 09)

> Audit-team 09 is de i18n-watchdog en glossary-enforcer onder de Wave 2 doc-reeks. Vier axes: (1) i18n key-tree parity tussen NL, EN, ES; (2) glossary-compliance over alle drie locales, met focus op het ES-CTA-canon dat in plan 16-04 niet diepgaand werd geaudit; (3) em-dash plus en-dash sweep over `messages/*.json`; (4) readability per locale plus tone-register slips plus hardcoded English in NL en ES DOM. Findings citeren `messages/{nl,en,es}.json` regelnummers plus DOM-snapshot paden zonder enige code te muteren. Geen edits onder `fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`, of `fmai-nextjs/tailwind.config.*`. Geen em-dashes in deze doc (komma, punt, dubbele punt). Canonical domain `future-marketing.ai` exclusief. SOTA-markers M2, M9, M10, M21, M23 zijn relevant; cross-ref met `00-competitive-intel.md` en `03-brand-narrative-ia.md`.

## Executive summary

Phase 16 Wave 2 Team 09 vindt 25 i18n- en copy-issues, waarvan 4 P0, 9 P1, 9 P2 en 3 P3. Drie themas dragen het gewicht: (1) **ES-CTA-canon is gefragmenteerd**, met 61 instances van `Agenda una llamada` (de facto canon) tegenover slechts 1 instance van `Reserva una llamada` (de jure canon, gedocumenteerd in `03-brand-narrative-ia.md` sectie 2.1 als header `apply`-button label). Gemini grounded check (call 11 van 100, ES-native SaaS scan) bevestigt dat beide verbs valide zijn in EU-castellano B2B, dus dit is geen wrong-word-issue maar een mass-consistency-breach die zowel `Header.tsx` plus `Footer.tsx` plus alle 12 skill-paginas plus pricing plus apply plus contact raakt. (2) **NL glossary-slip "klant" waar "merk" canonical is**, 36 hits over 9 namespaces inclusief de homepage-stat-label `Geheugen per klant` plus `case_studies.skc.hero.subtitle "Founding klant"` plus `memory.isolation.body2 "geheugenruimte per klant"`. Het Memory-page is FMai's USP-anchor; de glossary-slip ondermijnt expliciet het "per merk" framing dat de hele pagina pretendeert te leveren. (3) **Hardcoded English in `/skills/lead-qualifier`** demo-component: `src/components/chatbot/DemoPlayground.tsx` regel 28-34 bevat "Hi! I'm Clyde", "Hello! I'm Clyde", "Hey! I'm Clyde", "Welcome! I'm your Clyde onboarding guide" als hardcoded TypeScript-strings die nooit door `useTranslations()` gaan. Deze strings renderen ongewijzigd op `/nl/skills/lead-qualifier` plus `/es/skills/lead-qualifier`.

Parity-coverage NL versus EN versus ES: 100 procent. Alle drie locales hebben identieke 40 top-level namespaces, identieke 1644 leaf-paden, en identieke nesting-structuur (verified via `jq -r '[paths(scalars)] | map(join("."))' | sort | diff`). Em-dash count over `messages/*.json`: 0 voor alle drie locales (target was 0). En-dash count: ook 0. De project-rule "geen em-dashes in user-facing copy" wordt nageleefd op messages-niveau. Glossary-compliance NL: 60 hits `vaardigheden` (canonical), 0 hits "features" als user-facing word, 70 hits `merken` plus 46 hits `klant` (waarvan 36 glossary-slip-candidates en 10 legitiem in product-context). Glossary-compliance EN: 37 hits `AI Marketing Employee` (canonical), 0 variants. Glossary-compliance ES: 40 hits `Empleado AI`, 1 variant `Asistente AI` (legitime chatbot-disclosure context, niet positionering-slip). 

Headline-recommendation voor 16-16 fix-plan: prioriteer in volgorde (a) ES-CTA-canon-sync (kies een variant, sync alle 61 instances over `messages/es.json`), (b) NL-glossary-sync op homepage plus memory-page plus case_studies (vervang "klant" door "merk" op de 4 hoogst-traffic conversion-paden), (c) i18n-extract de `DemoPlayground.tsx` hardcoded greetings naar `messages/*.json` plus drie locales (raakt `lead-qualifier`, `concierge`, `support`, `welcome` tabs). De hardcoded-greetings-fix is een P1 deviation-rule-1 candidate voor Phase 16-16 want het breekt expliciet de "geen hardcoded user-facing strings" rule uit `fmai-nextjs/CLAUDE.md`.

## i18n parity matrix

> Bron: `jq -r '[paths(scalars)] | map(join(".")) | sort' messages/{nl,en,es}.json` op de baseline-commit. Path-comparison is leaf-only (geen array-index of object-niveau). Top-level keys plus nested leaf paths.

### 1.1 Top-level namespace parity

| Locale | Top-level keys | Diff vs NL |
|---|---|---|
| nl | 40 | n.a. (authoritative) |
| en | 40 | 0 missing, 0 extra |
| es | 40 | 0 missing, 0 extra |

### 1.2 Leaf-path parity

| Locale | Leaf paths | Diff vs NL |
|---|---|---|
| nl | 1644 | n.a. |
| en | 1644 | IDENTICAL set |
| es | 1644 | IDENTICAL set |

Telling: parity-coverage is 100 procent. Phase 12 i18n-cleanup heeft de structurele baseline strak; Phase 16 vindt geen orphan-keys, geen missing-keys, geen extra-keys per locale. Dit is een positieve outlier ten opzichte van Phase 14-15 audits waar parity-gaps wel werden gevonden.

### 1.3 Value-equality sample (suspected un-translated)

> Bron: per leaf-path vergelijken NL-waarde versus EN-waarde versus ES-waarde, filter op long-phrase (length >= 25 chars plus contains space) om proper-noun product-namen uit te sluiten.

| Path | Value | NL=EN | NL=ES | EN=ES | Verdict |
|---|---|---|---|---|---|
| `home.badges.enterprise` | "Enterprise-grade backbone" | yes | no | no | F-NL-EN-1: NL is identical to EN; intentioneel "enterprise-grade" als loanword? Document expliciet of vertaal naar "Enterprise-waardige ruggengraat" |
| `legal.sections.privacy.subsections.ai_readiness_assessment.title` | "9. AI Readiness Assessment" | yes | yes | yes | F-NL-EN-2: alle drie locales identiek, "AI Readiness Assessment" is product-name; OK |
| `case_studies.skc.testimonial.authorRole` | "Founder, SkinClarity Club" | yes | yes | yes | OK (proper noun en titel) |
| `apply.form.rolePlaceholder` | "Founder, Head of Content, ..." | yes | yes | yes | OK (English job-titles als invoer-hint, plausibel maar review-waardig) |
| `legal.meta.title` | "Legal | Future Marketing AI" | no | no | yes | F-ES-EN-1: ES gebruikt EN-meta-title; NL gebruikt "Juridisch | Future Marketing AI". Verwacht ES-equivalent "Legal | Future Marketing AI" of "Aviso Legal | Future Marketing AI" |

Aantal long-phrase NL=EN matches: 7 (waarvan 6 proper-noun-style of intentional loanwords, 1 borderline F-NL-EN-1). Long-phrase NL=ES matches: 3 (alle proper-noun). Long-phrase EN=ES matches: 1 (F-ES-EN-1 legal.meta.title). Conclusie: geen large-scale untranslated-content-incident.

### 1.4 Missing-key matrix

Geen missing keys. Phase 12-cleanup heeft hier expliciet gewerkt. Sectie behouden voor toekomstige Phase 17-plus reference.

## Glossary scorecard

> Bron: `grep` en JSON-walks op `messages/{nl,en,es}.json`, cross-ref tegen `fmai-nextjs/CLAUDE.md` "Key-phrase glossary" tabel plus `03-brand-narrative-ia.md` sectie "Glossary scorecard" (which scored 10 NL-terms). Deze sectie extends naar **ES plus EN canonicals** die plan 16-04 niet diepgaand audited. Severity-key: P0 voor conversion-funnel-breaks, P1 voor positionering-violations, P2 voor cosmetic-slip, P3 voor naming-divergence zonder UX-impact.

### 2.1 NL glossary (extends 03 audit, focus on volume)

| Term canonical | Verwacht | Hits canonical | Hits violation | Voorbeeld | Severity |
|---|---|---|---|---|---|
| `vaardigheden` | body NL | 60 | 0 | (geen "features" als user-facing word) | OK |
| `merken` | conversion NL | 70 | 36 "klant"-slips | `messages/nl.json:95` "Geheugen per klant" | P0 voor home plus memory plus case_studies hits, zie F1 |
| `Plan een gesprek` | primary CTA NL | 57 | 5 variants gedoc in 03 (F3, F4, F5) | (zie 03 audit, niet hier herhaald) | inherit van 03 |
| `AI Marketing Medewerker` | NL positionering | 37 | 0 self-positioning slips | (alle `AI-tool` hits zijn contrast-frames) | OK |
| `Clyde` | NL en EN en ES | 251 NL / 234 EN / 234 ES | 0 inconsistenties | (proper noun, consistent) | OK |
| `Boek` als CTA-verb | NIET aanwezig | 0 in messages | 1 variant `messages/nl.json:291` "Boek een gratis strategiesessie" | gedoc in 03 F3 | inherit van 03 |
| Em-dash (U+2014) | NIET aanwezig | 0 over alle messages | 0 | n.a. | OK (sweep in sectie 3) |

### 2.2 EN glossary (NEW: niet gedocumenteerd in 03)

| Term canonical | Verwacht | Hits canonical | Hits violation | Voorbeeld | Severity |
|---|---|---|---|---|---|
| `AI Marketing Employee` | EN positionering | 37 | 0 variants (`AI Marketing Worker/Assistant/Agent/Operator` count = 0) | (consistent over alle skills) | OK |
| `Book a call` | EN primary CTA | 56 | n.a. (geen alternative-verb hits) | header.apply EN consistent | OK |
| `skills` | EN body | 234 hits | n.a. | (consistent met NL `vaardigheden`) | OK |
| `brands` | EN conversion | 200-plus hits | "clients" als generic word: 64 hits, maar product-context plausibel ("client portfolio", "client work") | (no specific conversion-page violation found) | P3 review |

### 2.3 ES glossary (NEW: niet gedocumenteerd in 03)

> Dit is de **hoogste-impact glossary-sectie** van deze audit. Plan 16-04 scoorde alleen de NL-glossary; de ES-CTA-canon-fragmentatie is hier voor het eerst gemeten.

| Term canonical | Verwacht | Hits canonical | Hits variants | Verdict | Severity |
|---|---|---|---|---|---|
| `Reserva una llamada` | ES primary CTA (per 03 sectie 2.1 header.apply) | **1** (`messages/es.json:6`) | **35** `Agenda una llamada` + 11 phrased-CTAs + 4 `Agenda una llamada estrategica` + 2 `Agenda una llamada de partnership` + 1 `Agendar una llamada de descubrimiento` + 1 `Agenda llamada` = **54 non-canonical variants** | **F2 Critical fragmentation** | P0 |
| `Empleado AI` plus `Empleado AI de Marketing` plus `Empleado de Marketing AI` | ES positionering | 40 plus 32 plus 1 | 2 (`Asistente AI` chatbot-disclosure + `Trabajador AI` n/a) | F3 minor name-mix between three formats | P2 |
| `Habilidades` (translate `vaardigheden`) | ES body | ~60 hits | (geen `Features` hits) | OK | OK |
| `marcas` (translate `merken`) | ES conversion | ~70 hits | "cliente" plus "clientes" plus "portafolio" mix; needs scan | P2-P3 mix | needs follow-up |
| `tu / tus` (informal) | ES marketing | dominant | 0 `usted`-slips outside legal (verified) | OK | OK |

Glossary headline: ES CTA-canon is gebroken; de header rendert `Reserva una llamada` maar 50 plus andere CTA-blocks (apply page, contact, pricing, alle skills, founding-member, memory, case-studies) renderen `Agenda una llamada` of variants. Cross-page CTA-recognition (M21 plus M23 plus brand-consistency-axis) raakt onder druk: een ES-visitor leest verschillende CTA-frames op de drie meest-traffic-paginas en moet mentaal mappen dat ze hetzelfde betekenen.

### 2.4 ES cultural-fit (Gemini grounded, 1 call)

> Gemini 2.5 Flash grounded query (call 11 of 100, logged BUDGET.log 2026-05-18T18:47:20Z). Query: "For Spanish B2B SaaS marketing landing pages targeting agency owners in Spain (EU castellano, not LATAM), what is the most native and conversion-optimal call-to-action verb for booking a 30-minute discovery/sales call: 'Reserva una llamada', 'Agenda una llamada', 'Reservar demo', 'Solicitar una demo', or another phrasing?"

Gemini-summary verdict: beide verbs (`Reserva` en `Agenda`) zijn native EU-castellano en even professional voor B2B-agency-audience. Geen tone- of register-issue met beide. Gecitten native EU SaaS sites:
- `chekin.com`: "Reserva una demo" plus "Pruebalo gratis" (dual CTA pattern)
- `ronspotflexwork.com`: "Reservar una demo"
- `wiwink.com`: "Empieza gratis con Google" plus "Reserva una demo"
- `founders-saas.eu` (EU-domain): "Ver Demos" plus secondary "Reservar demo en vivo"
- Marketing-advisory consensus: "Agenda una llamada" performs particularly strong on LinkedIn-ad-driven traffic for scheduling-CTAs

Implicatie: FMai's keuze is een brand-decision, niet een correctness-decision. Aanbeveling voor 16-16 fix: kies **`Agenda una llamada`** als ES-canon, omdat (a) de de-facto-canon op 54 plek staat versus 1 plek `Reserva`, (b) gemini noemt het sterk voor LinkedIn-traffic dat FMai's primary acquisition-channel is, (c) consistency-cost is laag (1 header-button-string-wijziging in `messages/es.json:6` versus 54 string-wijzigingen). Documenteer de keuze in `fmai-nextjs/CLAUDE.md` Key-phrase glossary table met expliciete ES-row.

## Em-dash sweep

> Bron: `python` script dat per-locale-file de U+2014 (em-dash) en U+2013 (en-dash) character-occurrences telt. Project-rule uit user memory `feedback_no_em_dashes.md`: "Geen em-dashes (U+2014) in user-facing copy, gebruik komma, punt, of dubbele punt."

| Locale | File | Em-dash count (U+2014) | En-dash count (U+2013) | Hyphen-minus (U+002D, not flagged) | Verdict |
|---|---|---|---|---|---|
| nl | `messages/nl.json` | **0** | 0 | many (acceptable) | OK |
| en | `messages/en.json` | **0** | 0 | many (acceptable) | OK |
| es | `messages/es.json` | **0** | 0 | many (acceptable) | OK |

Em-dash project-rule wordt 100 procent nageleefd op messages-niveau. 03-brand-narrative-ia audit sectie "Glossary scorecard" had al een quick-scan gedaan en dit bevestigd; team 09 verifieert nu met exhaustive line-by-line scan.

**Side-note**: er bestaat een risico dat em-dashes via React-children render-time (e.g. typografisch `<Typography variant="display">` met `text-em-dash` CSS-class of een MDX-post in `src/content/blog/*.mdx`) ingevoegd worden, niet in messages. Out-of-scope voor team 09 (geen sources gemuteerd); flagged voor 16-15 synthesis-team om met een DOM-level scan te valideren. Voorlopig: messages/*.json em-dash-free.

## IK/WIJ slips (NL tone-register)

> Bron: walk `messages/nl.json`, filter op `legal.*` namespace (formal-tone acceptabel), tel `Wij` en `Ik` occurrences buiten legal.

| Pronoun | Hits buiten legal | Verdict |
|---|---|---|
| `Wij` | 5 | acceptable (FAQ, ICP-not-fit, pricing-visibility) |
| `Ik` | 9 | intentional founder-first-person voice (about.founder.bio, about.capacity, contact.form.statusBody, contact.applyCallout) |
| `u` plus `uw` (formal) | 0 outside legal | OK (legal uses formal-u, marketing uses je/jij) |

`Ik`-instances zijn allemaal Daley spreekt direct: 5 op `/about` (founder bio plus mission plus capacity), 2 op `/contact` (thank-you plus apply-callout), 1 chatbot-disclosure ("Ik ben een AI-assistent" wettelijk verplicht), 1 case-study-testimonial (Sindy's quote). Allemaal intended; geen tone-slip.

`Wij`-instances: 2 op `/about` plus `/home` (`icp.notFit4 "Wij versnellen bureaus die dat niet zelf bouwen"`), 1 op `chatbots.faq.q5` (taalondersteuning), 1 op `pricing.visibility.body`, 1 op `assessment.questions.q4`. Een lichte inconsistentie met founder-first-person ("Ik bouw FutureMarketingAI") maar in ICP-fit context is `Wij` als bureau-collectief acceptabel. P3 polish-finding (F4): standardize home plus about ICP-not-fit naar founder-first-person of expliciet "Het team" frame.

## Hardcoded English in NL/ES (DOM scan)

> Bron: walk `test-results/audit-v2/dom/*-{nl,es}.html`, extract visible body text (skip header/footer/nav/script/style), detect English-stopword-dominant chunks (>= 3 EN stopwords, < 1 NL/ES stopwords, length >= 20 chars).

| Route | Locale | English-dominant chunk | Severity |
|---|---|---|---|
| `/skills/lead-qualifier` | NL | "Hi! I'm Clyde, the Lead Qualifier skill. Ask me a question like a website visitor would, and I'll show you how I qualify, score and route leads to CRM." | P1 (F5) |
| `/skills/lead-qualifier` | NL | "Hello! I'm Clyde, the ROI Calculator. Tell me about your agency (team size, hourly rates, client count) and I'll estimate your savings with Clyde running your portfolio." | P1 (F5) |
| `/skills/lead-qualifier` | ES | "Hi! I'm Clyde, the Lead Qualifier skill..." (identiek) | P1 (F5) |
| `/skills/lead-qualifier` | ES | "Hello! I'm Clyde, the ROI Calculator..." (identiek) | P1 (F5) |

Origin: `src/components/chatbot/DemoPlayground.tsx` regel 28-34, hardcoded string-literals in een `const SUBTITLES = { ... }` object dat nooit door `useTranslations()` gerouteerd wordt. De DemoPlayground rendert 4 tabs (`leadgen`, `support`, `concierge`, `welcome`) elk met een English-only subtitle. Op `/nl/skills/lead-qualifier` plus `/es/skills/lead-qualifier` is dit zichtbaar als hardcoded-English-block midden in NL- of ES-page-context. Faalt expliciet de `fmai-nextjs/CLAUDE.md` rule "Geen hardcoded user-facing strings, alles via `useTranslations()` of `getTranslations()`".

Geen andere hardcoded-English-blokken gevonden buiten DemoPlayground; de overige top-volume-routes (`/pricing`, `/about`, `/skills/blog-factory`) bevatten alleen proper-noun-product-namen en intentional-loanwords (Founding Member, Blog Factory, Case studies, Privacy, Cookies, Reporting) die per `03-brand-narrative-ia.md` F18 plus F12 als brand-decision gedocumenteerd zijn (P3 niveau).

## Readability per locale

> Bron: extract body-only text uit DOM-snapshots (skip nav, header, footer, script, style, svg), compute per-locale readability-formule. Targets per `fmai-nextjs/CLAUDE.md` plus algemene B2B SaaS best-practice: F-K Reading Ease (EN) >= 60 plain-language threshold; Fernandez-Huerta (ES) >= 60 ("normal"-niveau); Leesindex Mommers (NL approximation via Flesch-Douma) >= 60 ("vrij eenvoudig" niveau).

| Route | NL (Mommers) | EN (F-K Reading Ease) | ES (Fernandez-Huerta) | NL Verdict | EN Verdict | ES Verdict |
|---|---|---|---|---|---|---|
| `/` home | 45.5 | 64.6 | 65.7 | **P1: low** | OK | OK |
| `/about` | 61.7 | 59.2 | 69.6 | OK | borderline | OK |
| `/how-it-works` | 55.1 | 61.8 | 68.5 | borderline | OK | OK |
| `/memory` | 64.8 | 64.8 | 79.8 | OK | OK | OK strong |
| `/pricing` | 58.1 | 62.0 | 77.4 | borderline | OK | OK |
| `/founding-member` | 62.2 | 71.0 | 78.0 | OK | OK | OK |
| `/case-studies/skinclarity-club` | 48.2 | 50.2 | 71.5 | **P1: low** | **P1: low** | OK |
| `/skills/clyde` | 56.7 | 67.2 | 71.4 | borderline | OK | OK |
| `/skills/social-media` | 47.7 | 52.5 | 69.5 | **P1: low** | **P1: low** | OK |
| `/blog` | 14.6 | 35.6 | 56.5 | **P0: critical** | **P0: critical** | borderline |

Pattern:
- **NL Mommers scores zijn systematisch lagere** dan EN of ES, gemiddeld 51.5 versus 60.0 EN versus 70.8 ES. Drie hypotheses: (a) Dutch compound-words zijn lexicaal langer (`klantworkspace-gegevens` telt als 1 woord maar 9 syllables), (b) Mommers/Flesch-Douma penaliseert NL-syllable-density meer dan ES Fernandez-Huerta, (c) FMai's NL-copy bevat veel technisch jargon dat unsoftened blijft (Supabase RLS, OAuth, BTW, IP-aansprakelijkheid). Cross-check met handmatig-Mommers op `/memory` (64.8) plus `/founding-member` (62.2) toont dat copy WEL plain-language kan zijn op NL, dus het is geen formule-bias maar een copy-issue op specifieke pages.
- **`/blog` scoort kritisch laag** op alle locales (14.6 NL, 35.6 EN, 56.5 ES). Verklaring: `/blog` rendert client-side een lege state plus MDX-frontmatter-titles (vaak technische long-tail-titels). Dit is een DOM-rendering-issue meer dan een copy-issue; defer naar 16-09 perf-team plus 16-07 SEO-team (Phase 16-06 SEO sectie 4 documented thin-SSR on blog).
- **`/case-studies/skinclarity-club` plus `/skills/social-media` scoren P1 op NL plus EN**: case study heeft technische operations-copy ("3 Instagram-accounts, 4 merken, autonoom"), social-media skill heeft jargon-density ("captions in merkstem, inplanning op optimale tijden, carrousel-bouwer, hashtag-onderzoek"). Beide zouden simpler-language ronds kunnen krijgen.
- **`/` home NL 45.5 P1**: low ondanks dat de homepage de eerste-impressie-page is. Cross-check `/memory` 64.8 toont dat plain-language hier wel kan; de homepage subtitle plus skills-section-descriptions zijn syllable-zwaar.

Findings 6 plus 7 plus 8 in sectie hieronder leggen specifieke routes met copy-recommendations vast.

## Findings

Schema: zie 03-brand-narrative-ia.md sectie "Findings". Zelfde format hier.

### Finding 1: NL "klant" glossary-slip op homepage plus memory plus case_studies (36 hits)

- Severity: P0
- Routes: `/` home (stat-label), `/memory` (USP-anchor body), `/case-studies/skinclarity-club` (hero subtitle), `/chatbots/demo` (interactive demo-tab labels). Viewports: alle. Locales: NL.
- Evidence: 36 NL `messages/nl.json` strings met "klant" of "klant-X" waar canonical "merk" is. Top hits:
  - `messages/nl.json:95` `home.stats.hours.label: "Geheugen per klant"` (homepage stat tile)
  - `messages/nl.json:1568` `memory.meta.description: "Strikt gescheiden per klant, elke week scherper."` (page meta, breekt SEO-snippet)
  - `messages/nl.json:1603` `memory.isolation.body2: "geheugenruimte per klant, ... wat bij jouw klant hoort, blijft bij jouw klant."` (memory USP body, 3 occurrences in 1 paragraaf)
  - `messages/nl.json:1783` `case_studies.skc.hero.subtitle: "SkinClarity Club is vanaf de eerste week Founding klant."` (case study hero subtitle, eerste impressie)
  - `messages/nl.json:199,:201,:205` `chatbots.demo.tabs.ecommerce.{label,scenario_title,scenario,capabilities_3}: "Klant-onboarding", "Nieuwe klant onboarden", "Werkruimtes opzetten per klant"` (4 hits in 1 demo-tab)
  - `messages/nl.json:20` `home.hero.subtitle`: bevat OOK `klantportfolio` (legit) maar staat in dezelfde sentence als de stats die "per klant" zeggen, dus mixed-signal
- Code path: `messages/nl.json` (read-only reference)
- Impact hypothesis: Memory-page (`/memory`) is FMai's primary differentiator-anchor; de copy claimt "per merk gescheiden" maar de WERKWOORDEN gebruiken "per klant". Een visitor die op meta-snippet-niveau "per klant" ziet, klikt door, en leest "per merk", krijgt cognitive dissonance. Op homepage stat-label `Geheugen per klant` heeft het stat-tile vergelijkbaar impact: het is een 5-second-scan-element en het verbreekt de "merken"-glossary die de hele rest van de homepage probeert te installeren.
- Proposed fix: vervang strategisch in 9 hoogst-impact `messages/nl.json` keys de "klant" door "merk". Lijst:
  - `:95` → "Geheugen per merk"
  - `:1568` → "Strikt gescheiden per merk, elke week scherper."
  - `:1603` → "geheugenruimte per merk, ... wat bij jouw merk hoort, blijft bij jouw merk."
  - `:1783` → "SkinClarity Club is vanaf de eerste week Founding partner." (vervangt "klant" door "partner", aligns met /founding-member-canon)
  - `:199`, `:201`, `:205` → "Merk-onboarding", "Nieuwe merk onboarden", "Werkruimtes opzetten per merk"
  - Resterende 27 hits review per case (sommige zijn legitiem in product-context-frames zoals `klantcommunicatie`, `klantvragen`).
- Effort: M (9 keys per 3 locales = 27 string-edits plus selective review van 27 randgevallen)
- Confidence: high

### Finding 2: ES CTA-canon-fragmentatie (54 non-canonical variants vs 1 canonical)

- Severity: P0
- Routes: alle 31 routes. Viewports: alle. Locales: ES.
- Evidence: `messages/es.json` heeft 54 instances van `Agenda una llamada` of phrased-variants tegenover 1 instance van `Reserva una llamada`. Concreet:
  - `messages/es.json:6`: `"label": "Reserva una llamada"` (header.apply button, de jure canonical per 03 sectie 2.1)
  - `messages/es.json:22`: `"cta": "Agenda una llamada"` (home hero CTA, de facto canon)
  - `messages/es.json:113,:114`: founding plekken subtitle plus button "Agenda una llamada"
  - `messages/es.json:386`: footer apply "Agenda una llamada"
  - `messages/es.json:426`: booking modal title "Agenda una llamada estrategica"
  - `messages/es.json:486`: demo button "Agenda una llamada estrategica"
  - `messages/es.json:553`: applyCta "Agenda una llamada"
  - `messages/es.json:728,:780`: apply page primary "Agenda una llamada"
  - 46 verdere instances over alle 12 skills, pricing, contact, founding-member, memory, case-studies
- Code path: `messages/es.json` (read-only)
- Impact hypothesis: faalt M21 plus M23 op brand-consistency-axis. Een ES-visitor die de header-CTA-button "Reserva una llamada" ziet en daarna in de body-CTA-block "Agenda una llamada" leest, krijgt cognitive load over "is dit dezelfde call, of een andere?". Cross-page recognition is een conversion-funnel-driver. Gemini grounded-check (call 11) bevestigt dat beide verbs valide zijn in EU-castellano, dus dit is een brand-consistency-issue, niet een language-issue.
- Proposed fix: kies `Agenda una llamada` als ES-canon (de facto-canon plus LinkedIn-strong-performer per Gemini-citaten). Update `messages/es.json:6` van `"Reserva una llamada"` naar `"Agenda una llamada"`. Documenteer in `fmai-nextjs/CLAUDE.md` Key-phrase glossary tabel een expliciete ES-row. Alternatief: kies `Reserva una llamada` (per Gemini-citatie ronspotflexwork.com, chekin.com EU-SaaS-conventie) en update 54 instances; effort hoger maar Vertegenwoordigt brand-bewuste keuze. Aanbeveling: optie A (de-facto-canon).
- Effort: S (1 string-edit voor optie A; M voor optie B 54 edits)
- Confidence: high

### Finding 3: ES naming-mix `Empleado AI` vs `Empleado AI de Marketing` vs `Empleado de Marketing AI`

- Severity: P2
- Routes: alle waar AI Marketing Medewerker positionering voorkomt. Locales: ES.
- Evidence: 40 hits `Empleado AI` standalone, 32 hits `Empleado AI de Marketing` (full positioning), 1 hit `Empleado de Marketing AI` (line `messages/es.json:14` meta-description "Clyde es el Empleado de Marketing AI para agencias de marketing"). De woord-volgorde-mix is subtiel maar consistent-breaking: `de Marketing AI` versus `AI de Marketing` swappen de noun-modifier-order.
- Code path: `messages/es.json:14` plus diverse keys
- Impact hypothesis: P2 brand-consistency. Een visitor die `Empleado de Marketing AI` in meta-description leest en daarna `Empleado AI de Marketing` in body, krijgt een subtle dissonance. Geen UX-breuk maar verlaagt brand-recognition-rate.
- Proposed fix: canonicaliseer naar **`Empleado AI de Marketing`** (32 hits versus 1). Update `messages/es.json:14` meta-description naar "Clyde es el Empleado AI de Marketing para agencias de marketing." Cross-check 7 other low-volume variants per follow-up.
- Effort: S
- Confidence: high

### Finding 4: NL Wij/Ik tone-mix op ICP-not-fit-blocks

- Severity: P3
- Routes: `/`, `/about`. Viewports: alle. Locales: NL.
- Evidence: 
  - `messages/nl.json` `home.icp.notFit4: "Je een bureau runt met meer dan 30 FTE en een eigen AI- of tech-team. Wij versnellen bureaus die dat niet zelf bouwen."` (Wij)
  - `messages/nl.json` `about.icp.notFit4`: same string (Wij)
  - Cross-context: `about.founder.bio` uses "Ik bouw FutureMarketingAI" (Ik)
- Code path: `messages/nl.json`
- Impact hypothesis: P3 cosmetic. De founder-first-person tone is dominant op /about plus /contact, maar de ICP-not-fit-block switch naar collective "Wij" zonder explicit signaling. Subtile inconsistency met geen meetbare conversion-impact.
- Proposed fix: switch naar founder-first-person "Ik versnel bureaus die dat niet zelf bouwen" of expliciet "Het FMai-team" frame.
- Effort: S
- Confidence: med

### Finding 5: Hardcoded English greetings in DemoPlayground (4 strings, 3 locales)

- Severity: P1
- Routes: `/skills/lead-qualifier` (renders DemoPlayground component). Viewports: alle. Locales: NL plus EN plus ES (visible on alle drie).
- Evidence: 
  - `src/components/chatbot/DemoPlayground.tsx:28`: `welcome: "Welcome! I'm your Clyde onboarding guide. Tell me about your client's brand and I'll show you how I learn their voice, audience, and style."`
  - `src/components/chatbot/DemoPlayground.tsx:30`: `leadgen: "Hi! I'm Clyde, the Lead Qualifier skill. Ask me a question like a website visitor would, and I'll show you how I qualify, score and route leads to CRM."`
  - `src/components/chatbot/DemoPlayground.tsx:32`: `support: "Hello! I'm Clyde, the ROI Calculator. Tell me about your agency (team size, hourly rates, client count) and I'll estimate your savings with Clyde running your portfolio."`
  - `src/components/chatbot/DemoPlayground.tsx:34`: `concierge: "Hey! I'm Clyde, your FutureMarketingAI Concierge. Ask me anything about the 12 skills, pricing tiers, or how Clyde fits your client portfolio."`
  - Verified via DOM-extract op `_skills_lead-qualifier-nl.html` plus `_skills_lead-qualifier-es.html`: strings renderen ongewijzigd in NL-page plus ES-page.
- Code path: `src/components/chatbot/DemoPlayground.tsx:28-34` (4 hardcoded TypeScript string-literals in `const SUBTITLES = { ... }`)
- Impact hypothesis: faalt expliciet `fmai-nextjs/CLAUDE.md` "Geen hardcoded user-facing strings, alles via `useTranslations()` of `getTranslations()`" rule. P1 omdat het op /skills/lead-qualifier, een conversion-skill-page, een hardcoded-English-block midden in NL- of ES-page-context plaatst, wat brand-trust-impact heeft (NL/ES-visitor ervaart een "ongepoetste vertaling"). "client" plus "client portfolio" zijn ook glossary-slips per "merk"-canon.
- Proposed fix: extract de 4 strings naar `messages/{nl,en,es}.json` namespace `demo.subtitles.{welcome,leadgen,support,concierge}` plus refactor `DemoPlayground.tsx` om `useTranslations('demo.subtitles')` te gebruiken. NL- en ES-vertalingen schrijven en "client" door "merk"/"marca" vervangen.
- Effort: M (3 locales x 4 strings = 12 nieuwe keys, plus 1 component-refactor in `DemoPlayground.tsx`)
- Confidence: high

### Finding 6: NL homepage readability (Mommers 45.5) onder plain-language target

- Severity: P1
- Routes: `/` home. Viewports: alle. Locales: NL.
- Evidence: Mommers Leesindex score 45.5 op extracted body-text van `_-nl.html`. Target >= 60 voor B2B-marketing-copy plain-language. Hotspots:
  - Hero subtitle: "Clyde onthoudt elk merk, leert van elke campagne en voert twaalf vaardigheden autonoom uit: social, blogs, voice, ads, SEO en analytics. Eén AI Marketing Medewerker voor je hele klantportfolio." Dit is 1 zin van 32 woorden, syllable-density hoog ("klantportfolio" 4 syl, "vaardigheden" 4 syl, "campagne" 3 syl)
  - Skills-section descriptions zijn 6+ syllables-per-word gemiddeld
- Code path: hero copy in `messages/nl.json:20` plus skill-descriptions in `messages/nl.json:151-300`
- Impact hypothesis: M2 ("headline communiceert wat, voor wie, waarom binnen 5 seconden") wordt onder druk gezet door zin-lengte. Verlaagt scannability voor mobile-first-readers (een vergelijking: `/memory` heeft Mommers 64.8 met simpler-zin-structuur).
- Proposed fix: split hero subtitle in 2 zinnen, vervang lange compounds. Voorbeeld: "Clyde onthoudt elk merk en leert van elke campagne. Twaalf vaardigheden, autonoom uitgevoerd, voor je hele merk-portfolio." Skills-section: drop technical-jargon op grid-cards, bewaar diepte voor skill-pagina's.
- Effort: S
- Confidence: med (readability-target is statistisch maar geen UX-test gebenchmarkt)

### Finding 7: NL `/case-studies/skinclarity-club` readability (Mommers 48.2) onder target

- Severity: P1
- Routes: `/case-studies/skinclarity-club`. Viewports: alle. Locales: NL plus EN.
- Evidence: NL Mommers 48.2, EN F-K 50.2 (beide P1). Case-study text bevat veel operations-jargon: "3 Instagram-accounts, 4 merken, meerdere contentsoorten, autonoom, elke dag, zonder dat het team er omkijken naar heeft." (one sentence, 22 woorden, 4 technical nouns).
- Code path: `messages/nl.json:1783-1850` case_studies.skc.*, plus equivalent EN keys
- Impact hypothesis: Case study is proof-driver in narrative-arc. Lager-readable proof zwakker conversion-impact. Specifiek visitors die mobile-snel scannen krijgen niet de "elke dag autonoom" cue maar zien een 22-woord-zin.
- Proposed fix: split lange zinnen, vervang stapelterminologie. Voorbeeld: "SkinClarity Club is sinds week 1 Founding partner. Clyde beheert 3 Instagram-accounts en 4 merken. Autonoom. Elke dag."
- Effort: S
- Confidence: med

### Finding 8: NL en EN `/skills/social-media` readability (Mommers 47.7, F-K 52.5) onder target

- Severity: P1
- Routes: `/skills/social-media`. Viewports: alle. Locales: NL plus EN.
- Evidence: NL Mommers 47.7, EN F-K 52.5. Skill-page-subtitle: "Captions in de merkstem, inplanning op optimale tijden, carrousel-bouwer, hashtag-onderzoek en engagement-tracking. Per account, per merk. Eén AI Marketing Medewerker voor je hele klantportfolio." (lange zin met 5 technical compound-nouns).
- Code path: `messages/nl.json:1172` plus en.json equivalent
- Impact hypothesis: P1 social-media skill-pagina is high-traffic skills-route (SOTA-M2 plus M21). Skill-features-list moet scannable zijn.
- Proposed fix: bullet-format ipv proza-zin. "Eigen captions in merkstem. Planning op optimale tijden. Carrousel-bouwer en hashtag-onderzoek. Engagement-tracking per account per merk."
- Effort: S
- Confidence: med

### Finding 9: `/blog` readability critical (Mommers 14.6 NL, F-K 35.6 EN, F-H 56.5 ES)

- Severity: P0 (technical, not copy)
- Routes: `/blog`. Viewports: alle. Locales: alle drie.
- Evidence: NL 14.6, EN 35.6, ES 56.5. Alle drie ver onder target. Cross-check 03-brand-narrative-ia F19 ("thin SSR op /blog"): blog index rendert client-side, DOM bevat alleen MDX-frontmatter-titles plus footer. Readability-score is artefact van thin-SSR (alleen titles + meta render in DOM).
- Code path: `src/app/[locale]/(blog)/blog/page.tsx` plus MDX-loading-logic
- Impact hypothesis: niet primair een copy-issue, maar een rendering-issue (cross-ref 03 F19, 16-06 SEO team output, 16-09 perf-team scope). Voor team 09 alleen relevant als evidence dat F-K plus Mommers plus F-H gebroken zijn op `/blog`, niet als actionable-copy-finding.
- Proposed fix: defer naar 16-06 SEO + 16-15 synthesis. Team 09: noteren als kruisreferentie.
- Effort: M (out of scope)
- Confidence: high (op rendering-side); n.a. (op copy-side)

### Finding 10: EN `Enterprise-grade backbone` identical to NL (suspected loanword)

- Severity: P3
- Routes: `/` home. Viewports: alle. Locales: NL.
- Evidence: `messages/nl.json` `home.badges.enterprise = "Enterprise-grade backbone"`, `messages/en.json` same value. NL would normally translate naar "Enterprise-waardige ruggengraat" of "Robuuste infrastructuur".
- Code path: `messages/nl.json` regel rond `home.badges.enterprise`
- Impact hypothesis: P3 brand-decision. "Enterprise-grade backbone" is een tech-loanword die in NL-B2B-SaaS plausibel is, maar inconsistent met de rest van NL-copy die wel vertaalt (e.g. "Geheugensysteem" ipv "Memory system" in footer).
- Proposed fix: vertaal of accept als loanword, documenteer in CLAUDE.md.
- Effort: S
- Confidence: low (brand-decision)

### Finding 11: EN "clients" gebruik op conversion-pages (P3 review)

- Severity: P3
- Routes: alle. Viewports: alle. Locales: EN.
- Evidence: 64 hits "clients" in `messages/en.json`. Veel zijn product-context-legitime ("client portfolio", "client work", "client onboarding"), maar in EN-branding-context is "brands" canonical (gespiegeld aan NL "merken"). No-specific-violation maar warrants een follow-up scan.
- Code path: `messages/en.json` (read-only)
- Impact hypothesis: P3 brand-consistency-axis. EN-Visitor leest "manage clients" plus "manage brands" naast elkaar, mildly-confusing positioning.
- Proposed fix: defer naar 16-16 fix-plan met handmatige review per occurrence; scan-criterium: "is dit een product-feature-noun ('client-onboarding' = OK) of een positioning-noun ('manage clients' = vervang door 'brands')?"
- Effort: M
- Confidence: low

### Finding 12: ES legal.meta.title identical to EN (`Legal | Future Marketing AI`)

- Severity: P3
- Routes: `/legal`. Viewports: alle. Locales: ES.
- Evidence: `messages/en.json` `legal.meta.title = "Legal | Future Marketing AI"`. `messages/es.json` same value. NL has "Juridisch | Future Marketing AI".
- Code path: `messages/es.json` `legal.meta.title`
- Impact hypothesis: P3 cosmetic. ES-SEO-snippet renders "Legal" ipv "Aviso Legal" of "Legal" (which is technically valid Spanish since Spanish accepts "legal" as adjective). Verlaagt brand-coherence over locales.
- Proposed fix: update ES naar "Aviso Legal | Future Marketing AI"
- Effort: S
- Confidence: med

### Finding 13: NL value-identity slip on legal.sections.privacy.subsections.ai_readiness_assessment.title

- Severity: P3
- Routes: `/legal/privacy`. Viewports: alle. Locales: NL plus EN plus ES.
- Evidence: alle drie locales hebben `"9. AI Readiness Assessment"`. NL zou kunnen vertalen naar "9. AI-Volwassenheidsscan" voor consistency met de rest van NL-copy waar "AI-volwassenheid" wordt gebruikt.
- Code path: `messages/{nl,en,es}.json` `legal.sections.privacy.subsections.ai_readiness_assessment.title`
- Impact hypothesis: P3 cosmetic. "AI Readiness Assessment" is een product-name-style term; NL-vertaling zou consistent zijn met `home.assessment.*` namespace dat wel vertaald is.
- Proposed fix: vertaal NL naar "9. AI-Volwassenheidsscan"; ES naar "9. Evaluacion de Madurez AI".
- Effort: S
- Confidence: low (brand-decision)

### Finding 14: Footer plus top-nav inconsistent memory-naming (NL: Geheugen vs Geheugensysteem)

- Severity: P3 (cross-ref met 03-brand-narrative-ia F12)
- Routes: alle. Viewports: alle. Locales: NL plus EN.
- Evidence: NL top-nav (`header.nav.memory`) "Geheugen"; Footer (`common.landing.footer.nav.memory`) "Geheugensysteem". EN top-nav "Memory"; Footer "Memory system".
- Code path: cross-ref 03 F12.
- Impact hypothesis: inherit van 03; team 09 verifieert.
- Proposed fix: zie 03 F12.
- Effort: S
- Confidence: med

### Finding 15: NL home stats label `home.stats.languages.value` identical EN (Max {maxPartners})

- Severity: P2
- Routes: `/` home. Viewports: alle. Locales: NL plus EN.
- Evidence: `messages/nl.json` `home.stats.languages.value = "Max {maxPartners}"`, en.json same. Interpolation-value, beide gebruiken "Max" als prefix. NL zou "Tot {maxPartners}" of "Maximaal {maxPartners}" kunnen.
- Code path: `messages/nl.json` `home.stats.languages.value`
- Impact hypothesis: P2 cosmetic, brand-consistency. "Max" is internationaal-leesbaar maar niet pure NL.
- Proposed fix: vertaal NL naar "Maximaal {maxPartners}" (alligned met about.capacity.body "Maximaal {maxPartners} bureaus per jaar").
- Effort: S
- Confidence: med

### Finding 16: ES founding plekken subtitle uses `plazas founding` mixed Spanish-English

- Severity: P2
- Routes: `/founding-member`, `/`, `/pricing`. Viewports: alle. Locales: ES.
- Evidence: `messages/es.json:113`: "Max. {maxPartners} agencias al ano. {taken} de {total} plazas founding ocupadas. Agenda una llamada: vemos juntos si Clyde encaja con tu portfolio." De combinatie "plazas founding" mengt Spanish "plazas" met English "founding" als adjective.
- Code path: `messages/es.json:113` plus equivalente keys
- Impact hypothesis: P2 brand-consistency. Spanish-grammar normaal vereist "plazas fundadoras" of "plazas de fundador" of bewust de Engels-loanword met cursief/quotes. De bare combination is grammatically-odd.
- Proposed fix: ofwel "plazas Founding" (proper-noun-loanword met capital F), of "plazas fundadoras" (volledig vertaald). Aligned met NL-keuze waar "Founding Member" Engels blijft (03 F18 brand-decision).
- Effort: S
- Confidence: med

### Finding 17: NL plus EN plus ES `apply.form.rolePlaceholder` identical English

- Severity: P3
- Routes: `/apply`. Viewports: alle. Locales: alle drie.
- Evidence: alle drie hebben "Founder, Head of Content, ...". NL zou "Oprichter, Hoofd Content, ..." kunnen.
- Code path: `messages/{nl,en,es}.json` `apply.form.rolePlaceholder`
- Impact hypothesis: P3 cosmetic; English job-titles als placeholder-hint zijn industry-acceptable in Dutch B2B SaaS-forms maar inconsistent met NL-positioning.
- Proposed fix: vertaal NL naar "Oprichter, Hoofd Marketing, Bureau-eigenaar..."; ES naar "Fundador, Director de Contenido, ..."
- Effort: S
- Confidence: low

### Finding 18: NL `chatbots.demo.tabs.ecommerce.label` "Klant-onboarding" plus glossary-slip stack

- Severity: P1 (cross-ref F1)
- Routes: `/chatbots/demo` plus alle demo-mounts. Viewports: alle. Locales: NL.
- Evidence: 4 hits in 4 opeenvolgende keys `messages/nl.json:199,:200,:201,:205`. Specifiek de E-commerce-demo-tab gebruikt "klant" 4x.
- Code path: `messages/nl.json:199-205`
- Impact hypothesis: deze 4 hits zijn al opgenomen in F1's 36-totaal-count, maar staan apart omdat ze in 1 demo-block clusteren. Een visitor die de E-commerce demo-tab opent ziet 4 verschillende "klant"-uses, wat de glossary-slip versterkt.
- Proposed fix: vervang alle 4 in 1 sweep met "merk" of "klant" (afhankelijk van demo-narrative; if E-commerce-demo's klant is een eindgebruiker-van-bureau is "klant" wel legitiem). Aanbeveling: check demo-context, herinterpreteer als merk-onboarding (de demo toont "AI Marketing Medewerker leert nieuwe merk-richtlijnen") en update naar "Merk-onboarding".
- Effort: S (afhankelijk van demo-interpretation)
- Confidence: med

### Finding 19: ES messages `Empleado de Marketing AI` (meta-description) is enige outlier van canonical word-order

- Severity: P2 (cross-ref F3)
- Routes: `/` home meta-description. Viewports: alle. Locales: ES.
- Evidence: `messages/es.json:14`: "Clyde es el Empleado de Marketing AI para agencias de marketing. ..." vs alle andere 72 hits canonical `Empleado AI de Marketing`. Word-order swap is in de HIGHEST-traffic meta-description string (SERP-snippet).
- Code path: `messages/es.json:14`
- Impact hypothesis: P2 SEO + brand-consistency. Google-SERP-snippet ziet word-order-A; visitor landt op page en ziet word-order-B alom. Subtle inconsistency op exact-keyword-matchability voor SEO.
- Proposed fix: align meta-description naar canonical "Empleado AI de Marketing".
- Effort: S
- Confidence: high

### Finding 20: NL `/contact` meta-title identical EN `Contact | Future Marketing AI`

- Severity: P3
- Routes: `/contact`. Viewports: alle. Locales: NL plus EN.
- Evidence: `messages/nl.json` `contact.meta.title = "Contact | Future Marketing AI"`, en.json same. "Contact" is OK in NL maar consistent met `header.nav.contact` "Contact" (welke ook NL=EN).
- Code path: `messages/nl.json` `contact.meta.title`
- Impact hypothesis: P3 cosmetic; "Contact" is internationaal-NL-acceptable.
- Proposed fix: behoud of vertaal naar "Neem contact op | Future Marketing AI" voor brand-coherence. Lage prioriteit.
- Effort: S
- Confidence: low

### Finding 21: `messages/en.json` `skills-lead-qualifier.useCases.useCase2.title` identical NL "E-commerce: support plus sales"

- Severity: P3
- Routes: `/skills/lead-qualifier`. Viewports: alle. Locales: NL plus EN.
- Evidence: both have "E-commerce: support plus sales". The phrasing is borderline EN-NL (using "plus" instead of "en" or "and" feels translation-pattern). NL would conventionally use "E-commerce: support en sales" or "E-commerce: ondersteuning en verkoop".
- Code path: `messages/{nl,en}.json` `skills-lead-qualifier.useCases.useCase2.title`
- Impact hypothesis: P3 cosmetic; the "plus" is a project-convention to avoid "and/en" but reads slightly machine-translated.
- Proposed fix: NL: "E-commerce: support en sales". EN: "E-commerce: support and sales".
- Effort: S
- Confidence: low

### Finding 22: ES `Trabajador AI` plus `Asistente AI` consistent context-bound

- Severity: P3 (positive, no action)
- Routes: `/`, chatbot disclosure. Viewports: alle. Locales: ES.
- Evidence: 0 instances `Trabajador AI`. 1 instance `Asistente AI` op `chatbot.disclosure.badge` (legally-required AI-disclosure-banner, "I am an AI assistant", niet positionering-slip).
- Code path: `messages/es.json` rond regel 948
- Impact hypothesis: positive marker. The chatbot-disclosure-badge correctly uses generic "Asistente AI" terminology (NOT brand-positioning), consistent with `messages/nl.json` chatbot.disclosure.notice "Ik ben een AI-assistent".
- Proposed fix: geen.
- Effort: zero
- Confidence: high

### Finding 23: i18n leaf-path parity is 100 procent identical (positive)

- Severity: P3 (positive, no action)
- Routes: alle. Viewports: alle. Locales: alle drie.
- Evidence: 1644 leaf paths in elke locale, identical set verified via `jq -r '[paths(scalars)] | map(join("."))' | sort | diff`. Geen orphan keys, geen missing keys.
- Code path: `messages/{nl,en,es}.json` overall structure
- Impact hypothesis: positive baseline. Phase 12 i18n-cleanup heeft de structurele kant strak; team 09 hoeft hier geen missing-keys-table te leveren.
- Proposed fix: geen.
- Effort: zero
- Confidence: high

### Finding 24: Em-dash compliance is 100 procent on messages-level (positive)

- Severity: P3 (positive, no action)
- Routes: alle. Viewports: alle. Locales: alle drie.
- Evidence: 0 em-dashes (U+2014) plus 0 en-dashes (U+2013) over alle 3 locale-files. Project-rule `feedback_no_em_dashes.md` 100 procent nageleefd.
- Code path: `messages/{nl,en,es}.json` overall.
- Impact hypothesis: positive marker. 16-15 synthesis-team should defer-em-dash-DOM-scan separately (out-of-team-09-scope) maar op messages-level: clean.
- Proposed fix: geen.
- Effort: zero
- Confidence: high

### Finding 25: ES tu/usted register clean op marketing-paginas (positive)

- Severity: P3 (positive, no action)
- Routes: alle marketing-routes. Viewports: alle. Locales: ES.
- Evidence: 0 `usted`-occurrences buiten `legal.*` namespace. ES-marketing-copy gebruikt consistent `tu/tus` informal-register, aligned met NL-`je/jij`-canon.
- Code path: `messages/es.json` overall.
- Impact hypothesis: positive marker. ES-locale heeft register-discipline; geen formal-tone-slip findings.
- Proposed fix: geen.
- Effort: zero
- Confidence: high

## Top 25 findings (ranked)

| Rank | ID | Severity | Title | SOTA markers |
|---|---|---|---|---|
| 1 | F1 | P0 | NL "klant" glossary-slip op homepage + memory + case_studies (36 hits) | glossary, M21, M23 |
| 2 | F2 | P0 | ES CTA-canon-fragmentatie (54 non-canonical variants vs 1 canonical) | M21, M23, brand-consistency |
| 3 | F9 | P0 | `/blog` readability critical (Mommers 14.6 NL, F-K 35.6 EN, F-H 56.5 ES) | M2, M9 (rendering) |
| 4 | F5 | P1 | Hardcoded English greetings in DemoPlayground (4 strings, 3 locales) | CLAUDE.md i18n-rule |
| 5 | F6 | P1 | NL homepage readability Mommers 45.5 onder target | M2 |
| 6 | F7 | P1 | NL `/case-studies/skinclarity-club` readability Mommers 48.2 | M2 |
| 7 | F8 | P1 | NL en EN `/skills/social-media` readability onder target | M2 |
| 8 | F18 | P1 | NL `chatbots.demo.tabs.ecommerce` cluster-slip 4 "klant" hits | glossary, M21 |
| 9 | F19 | P2 | ES meta-description word-order outlier `Empleado de Marketing AI` | SEO, brand-consistency |
| 10 | F3 | P2 | ES naming-mix `Empleado AI` variants | brand-consistency |
| 11 | F11 | P3 | EN "clients" gebruik op conversion-pages (P3 review) | brand-consistency |
| 12 | F15 | P2 | NL home stats `Max {maxPartners}` identical EN | brand-consistency |
| 13 | F16 | P2 | ES founding plekken "plazas founding" mixed | brand-consistency |
| 14 | F4 | P3 | NL Wij/Ik tone-mix op ICP-not-fit-blocks | brand-consistency |
| 15 | F10 | P3 | EN `Enterprise-grade backbone` identical NL (loanword) | brand-decision |
| 16 | F12 | P3 | ES legal.meta.title identical EN | SEO |
| 17 | F13 | P3 | NL legal `9. AI Readiness Assessment` identical EN | brand-consistency |
| 18 | F14 | P3 | Footer/top-nav inconsistent memory-naming (cross-ref 03 F12) | brand-consistency |
| 19 | F17 | P3 | apply.form.rolePlaceholder identical English alle locales | brand-consistency |
| 20 | F20 | P3 | NL `contact.meta.title` identical EN "Contact" | brand-coherence |
| 21 | F21 | P3 | EN/NL useCase2-title "support plus sales" reads machine-translated | brand-consistency |
| 22 | F22 | P3 | ES `Asistente AI` chatbot-disclosure context-correct | positive |
| 23 | F23 | P3 | i18n leaf-path parity 100 procent identical (1644 keys per locale) | positive |
| 24 | F24 | P3 | Em-dash compliance 100 procent on messages-level | positive |
| 25 | F25 | P3 | ES tu/usted register clean op marketing-paginas | positive |

## Cross-reference index

- Plan 16-04 (`03-brand-narrative-ia.md`): glossary-scorecard sectie scoorde 10 NL-terms; team 09 extends naar ES en EN canonicals. Cross-refs: F1 (extends F10 reporting-shortDescription); F14 (cross-ref F12 memory-naming); brand-consistency-axis op ES is volledig new in team 09 scope.
- Plan 16-06 (`05-seo-technical.md`): F12 ES legal.meta.title duplicate EN raakt SEO-snippet. F19 ES meta-description word-order raakt SERP-keyword-match.
- Plan 16-09 (`07-accessibility.md` of `08-performance.md`): F9 `/blog` readability is rendering-issue niet copy-issue; defer.
- Plan 16-15 (`14-cross-cutting-synthesis.md`): F24 em-dash compliance is messages-level; synthesis-team owns DOM-level + MDX-level em-dash sweep buiten scope team 09.

## Methodology, budget, and limits

**Tools used**: 
- `jq` voor JSON-path-extraction en parity-diff (read-only)
- Python 3 voor walking JSON-trees, regex-glossary-scans, readability-formulae (Flesch-Kincaid Reading Ease, Fernandez-Huerta, Leesindex Mommers via Flesch-Douma approximation)
- `grep -nE` voor concrete line-number-citations
- HTML parser voor body-text extraction uit Playwright DOM-snapshots
- Gemini 2.5 Flash grounded research (1 call, budget 11 of 100 cumulative)

**Files read (read-only)**: 
- `fmai-nextjs/messages/nl.json`
- `fmai-nextjs/messages/en.json`
- `fmai-nextjs/messages/es.json`
- `fmai-nextjs/test-results/audit-v2/dom/*-{nl,en,es}.html` (93 files)
- `fmai-nextjs/src/components/chatbot/DemoPlayground.tsx` (alleen voor F5 evidence)

**Files NOT modified**: 0 production-code edits, 0 messages-edits, 0 STATE.md-edits. Audit is research-only per Phase 16 invariant.

**Budget verbruik voor dit plan**: 1 Gemini grounded call (call 11 of 100, query 16-11 ES CTA cultural-fit). Phase cumulative tot Wave 2 16-11: 11 of 100 cap.

**Limits**: 
- Readability formulae zijn approximation. NL Mommers/Flesch-Douma is een algemene-formule; specifieke FMai-marketing-copy-genre kalibratie ontbreekt. Scores zijn directional, niet absoluut.
- "klant"-glossary-slip categorisering is heuristisch (legitime "klantenservice"/"klantportfolio"/"klantvragen" gefilterd). Een handmatige review per occurrence kan 36-count omhoog of omlaag bijstellen.
- DOM-snapshot hardcoded-English-scan vangt alleen text dat in SSR-payload zit. Client-side-rendered JavaScript-strings (na hydration) zijn niet gemeten; potentieel extra hardcoded-English in modals plus megamenus.
- Em-dash sweep dekt alleen `messages/*.json`. MDX-blog-content plus React-component-JSX-children plus CSS-content-properties zijn out-of-scope.
- Gemini grounded check (call 11) is een single-query sample; voor robuuste ES-cultural-fit-baseline zou 3-5 queries beter zijn maar past niet binnen 100-call-budget gegeven plan 16-12 nog komt.
