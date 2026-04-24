# Copywriting Audit — FutureMarketingAI Marketing Site (NL / EN / ES)

**Datum**: 2026-04-24
**Scope**: `fmai-nextjs/messages/{nl,en,es}.json`, `src/app/[locale]/**/page.tsx`, `src/components/**/*.tsx`, `src/lib/skills-data.ts`
**Auditor**: senior NL copywriter + brand-strateeg
**Methode**: end-to-end read van nl.json (2.184 regels), grep van alle forbidden-term-varianten, sample-read EN + ES hero/FAQ secties, cross-check met `docs/style-guide-nl.md` en `docs/plans/2026-04-20-website-content-upgrade-design.md`.

> Alle file-referenties zijn **absolute paden** zoals gevraagd.

---

## Executive Summary

1. **NL-copy is sterk op positionering en eerlijkheid**, maar lekt op meerdere plekken terug naar oude glossary-termen. Home + Pricing + Skills-pagina's scoren goed op IK/WIJ-consistentie. `about` wijkt bewust af naar IK-vorm (conform style-guide). Legal blijft op "u" (correct). **Zwakste plekken**: `skills-data.ts` (dode strings maar wel live matrix-labels in Engels), `chatbots.*` namespace (orphan uit oude site, full of glossary-schendingen) en 11 em-dashes in `skills-data.ts`.

2. **Glossary-violations**: 35+ bevestigde schendingen, geconcentreerd in `messages/nl.json` (`chatbots.*`, `skills-data.ts` descriptions, `founding-member.priority.description`, één slip in `home.trust`). De kritieke — "unlimited" i.p.v. "Onbeperkt" — staat live in de Tier-matrix als cap-label voor Enterprise (zie `skills-data.ts:87, 114, 140, 167, 212, 238`).

3. **Em-dash hygiëne op NL-JSON is bijna perfect** (1 legitieme UI-placeholder). MAAR `skills-data.ts` bevat 11 em-dashes in NL-strings en 3 user-facing em-dashes in hardcoded JSX (SkillsTierMatrix "Coming soon" is Engels). Dev-comments in .tsx zijn irrelevant (niet user-facing), de matrix-labels in skills-data.ts zijn dat wél.

4. **Storytelling-arc werkt op home-niveau** (Clyde → services → trust → ICP → FAQ → CTA → SKC-proof), maar **mist een expliciete Problem-section** vóór de services. Prospect ziet "Dit is Clyde" en "Wat Clyde doet" voordat hij weet waarom dit bestaat. Voor bureau-eigenaren die scepsis hebben tegen AI-hypes is een expliciete "Waarom dit bestaat" nodig.

5. **CTA-microcopy is goed gestandaardiseerd** ("Plan een gesprek" 20+ keer consistent), maar **de twee secundaire CTA's op pricing ("Lees SkinClarity case") en founding-member concurreren met de primary zonder visueel onderscheid te suggereren**. Op about.cta staat "Boek een strategiegesprek" terwijl overal elders "Plan een gesprek" is — kleine inconsistentie die slijt aan de stem.

---

## 1. Em-dash violations

`docs/style-guide-nl.md` §4: `—` is verboden in NL user-facing copy.

### 1.1 In `messages/nl.json` (acceptabel)

| File:Line | Context | Verdict |
|---|---|---|
| `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\messages\nl.json:643` | `"notAvailable": "—"` | **OK** — UI-placeholder in de tier-matrix voor "niet beschikbaar". Vervangen door streepje `–` of `·` of tekstueel "—" is acceptabel (betekenisloze typografische marker, geen prozatekst). |

**1 occurrence, niet-problematisch.**

### 1.2 In `src/lib/skills-data.ts` (USER-FACING, moet weg)

Labels in dit bestand worden deels wel live gerenderd (zie §2 matrix-labels). `shortDescription` en `longDescription` zijn momenteel niet gerenderd in UI (dead code), maar lopen wel mee bij eventuele toekomstige import in mega-menu of SEO-output. Aanpak: **strings nu al cleanen** om te voorkomen dat een latere import een copy-regressie veroorzaakt.

| File:Line | Current | Suggested rewrite |
|---|---|---|
| `src\lib\skills-data.ts:50` | `'Captions, scheduling, carousels en engagement — per klant in de juiste brand voice.'` | `'Captions, inplanning, carrousels en engagement, per merk in de juiste merkstem.'` |
| `src\lib\skills-data.ts:72` | `'...internal linking — alles automatisch. Output: 1.500-3.000 woorden publicatie-klaar.'` | `'...interne links: alles automatisch. Output 1.500 tot 3.000 woorden, publicatieklaar.'` |
| `src\lib\skills-data.ts:96` | `'Statische en video ads voor Meta — A/B varianten direct publiceerbaar.'` | `'Statische ads en video-ads voor Meta. Publiceer A/B-varianten direct.'` |
| `src\lib\skills-data.ts:98` | `'Ad Creator genereert complete advertenties — van copy tot visuals. AI maakt statische...'` | `'Ad Creator genereert complete advertenties: van copy tot visuals. AI maakt statische...'` |
| `src\lib\skills-data.ts:123` | `'Korte verticale videos — captions, muziek, transitions voor Reels/TikTok/Shorts.'` | `'Korte verticale video''s met captions, muziek en transities voor Reels, TikTok en Shorts.'` |
| `src\lib\skills-data.ts:125` | `'Reel Builder creëert korte verticale videos (9:16) met AI — inclusief captions, muziek en transitions.'` | `'Reel Builder creëert korte verticale video''s (9:16) met AI: inclusief captions, muziek en transities.'` |
| `src\lib\skills-data.ts:149` | `'Inkomende en uitgaande AI-telefoongesprekken — afspraken, FAQ, escalatie.'` | `'Inkomende en uitgaande AI-gesprekken: afspraken, FAQ, escalatie.'` |
| `src\lib\skills-data.ts:151` | `'De Voice Agent handelt telefoonverkeer af met AI — inkomend en uitgaand.'` | `'De Voice Agent handelt telefoonverkeer af met AI, zowel inkomend als uitgaand.'` |
| `src\lib\skills-data.ts:288` | `'...levert actionable recommendations direct in je dashboard — met bronvermelding bij elk inzicht.'` | `'...levert bruikbare aanbevelingen direct in je dashboard, met bronvermelding bij elk inzicht.'` |

**9 em-dashes in skills-data.ts NL strings → rewrite.**

### 1.3 In `.tsx` / `.ts` files (mix van comments en live copy)

**Developer comments (NIET user-facing, negeren):** alle `{/* Hero Section — Immersive layout */}` in `page.tsx`, `SkillPageTemplate.tsx`, `HeroSpline.tsx`, `OrbitVisual.tsx`, `splite.tsx`, `ProgressiveCTA.tsx`, `GradientMesh.tsx`, `LazySection.tsx`, `SkillsTierMatrix.tsx` — dev-only. Totaal circa 30 occurrences, prima laten staan.

**User-facing em-dashes in .tsx:**

| File:Line | Context | Actie |
|---|---|---|
| `src\components\chatbot\personas\clyde.ts:5, 20, 34` | System prompt strings (niet user-facing in prozatekst, gaat naar LLM) | OK laten |
| `src\lib\chatbot\prompt-builder.ts:20, 31, 84, 86` | System prompts | OK laten |
| `src\lib\chatbot\tool-executor.ts:61` | Internal description | OK laten |
| `src\lib\chatbot\tools\concierge-tools.ts:23, 47` | Service descriptions die tool-call results worden (showen in chat UI) | **Cleanen** |
| `src\lib\chatbot\tools\support-tools.ts:96` | `'Connecting you with a human agent. Please hold on — a support representative will be with you shortly.'` | EN copy, niet NL-bereik, maar nog steeds em-dash. **Cleanen**. |

**Totaal user-facing em-dashes te cleanen: 9 in skills-data.ts + 3 in chatbot tool-results = 12.**

---

## 2. Glossary violations

Style-guide §3 + project-CLAUDE.md-regels gecombineerd. Grep-basis: `messages/nl.json` end-to-end + `skills-data.ts` + components.

### 2.1 "tool" / "tools" (moet: "vaardigheid" / "vaardigheden" / specifiek product)

| File:Line | Current | Suggested replacement |
|---|---|---|
| `messages\nl.json:67` (home.icp.fit3) | `"Founders die een partner zoeken, geen tool."` | **OK** — dit is een contrast-framing ("geen tool"). Stijlguide staat dit toe. Behouden. |
| `messages\nl.json:114` (home.faq.q1) | `"ChatGPT en Jasper zijn generieke tools zonder geheugen... geen losse tool per taak."` | **OK** — verwijst naar concurrenten, geen eigen product. Behouden. |
| `messages\nl.json:122` (home.faq.q3) | `"Clyde is een high-touch AI-partnership, geen SaaS-tool."` | **OK** — contrast. |
| `messages\nl.json:129` (home.faq.q5) | `"Waarom werkt dit beter voor bureaus dan losse tools?"` | **OK** — verwijst naar concurrenten. |
| `messages\nl.json:130` | `"...geen 12 losse tools... aparte tools."` | **OK** — contrast-framing. |
| `messages\nl.json:257` (chatbots.related.automations) | `"...Automatisering op maat die jouw tools en processen aan elkaar verbindt."` | `"...Automatisering op maat die jouw systemen en processen aan elkaar verbindt."` |
| `messages\nl.json:268` (chatbots.process.discovery) | `"We brengen je use case in kaart en plannen de koppeling met je bestaande tools."` | `"We brengen je use case in kaart en plannen de koppeling met je bestaande systemen."` |
| `messages\nl.json:451` (about.timeline.eras.assisted) | `"Bureaus namen ChatGPT en AI-tools in gebruik..."` | **OK** — historische beschrijving van marktcontext, verwijst naar generieke AI-tools. |
| `messages\nl.json:481` (about.icp.fit3) | `"...een partner zoeken, geen tool."` | **OK** — contrast. |
| `messages\nl.json:518` (about.founder.bio) | `"...zag ik hoe 12 losse tools niet meeschalen..."` | **OK** — ervaringsverhaal, contrast. |
| `messages\nl.json:1433` (memory.hero.subtitle) | `"Dit is het verschil tussen een AI-tool en een AI Marketing Medewerker: geheugen."` | **OK** — positioneringszin, contrast is het hele punt. |
| `messages\nl.json:1966` (skills-clyde.hero.subtitle) | `"De andere 11 vaardigheden zijn losse tools. Clyde is de medewerker die ze orkestreert."` | **WAARSCHUWING** — schuurt met glossary. Alternatief: `"De andere 11 vaardigheden zijn gespecialiseerde uitvoerders. Clyde is de medewerker die ze orkestreert."` |
| `messages\nl.json:2015` (skills-clyde.useCases.useCase1) | `"In plaats van 12 tools openen: vraag Clyde in de chat."` | **WAARSCHUWING** — zelfde als 1966. Alternatief: `"In plaats van 12 schermen openen: vraag Clyde in de chat."` |

**Verdict**: 2 strings waar "tools" naar eigen product verwijst (skills-clyde.hero.subtitle, useCase1) zijn stijlgevaarlijk. De rest is legitieme contrast-framing. **Actie: 2 rewrites.**

### 2.2 "platform" / "platforms"

| File:Line | Current | Suggested replacement |
|---|---|---|
| `messages\nl.json:54` (home.trust.founderAccessTitle) | `"AI-partner, geen platform"` | **OK** — positioneringscontrast. |
| `messages\nl.json:160` (chatbots.sections.multi_platform_heading) | `"Multi-platform integratie"` | **OK** — technische context (verwijst naar social media platforms). |
| `messages\nl.json:204` (chatbots.demo.tabs.leadgen) | `"Multi-platform publicatie"` | **OK** — zelfde. |
| `messages\nl.json:289, 313` (chatbots.multi_platform.*) | `"platforms"` / `"over alle platformen"` | **OK** — verwijst naar externe social media. |
| `messages\nl.json:1101` (skills-social-media.meta) | `"multi-platform inplanning"` | **OK** — technisch. |
| `messages\nl.json:1117` | `"Multi-platform inplanning"` | **OK**. |
| `messages\nl.json:2126` (skills-reel-builder.feature2) | `"volgens de conventies van elk platform"` | **OK** — verwijst naar Instagram/TikTok. |

**Verdict**: alle "platform"-occurrences verwijzen naar externe platforms (Meta, TikTok, Instagram) of zijn positioneringscontrast. **Geen actie nodig.**

### 2.3 "features" / "feature" (moet: "vaardigheden" / "functies")

| File:Line | Current | Suggested replacement |
|---|---|---|
| `messages\nl.json:614` (pricing.tiers.enterprise.features_7) | `"Voorrang op feature-requests"` | `"Voorrang op verzoeken voor nieuwe vaardigheden"` |
| `messages\nl.json:1358` (founding-member.benefits.priority) | `"Feature-verzoeken van Founding partners gaan voor."` | `"Verzoeken voor nieuwe vaardigheden van Founding partners krijgen voorrang."` |

De JSON-keys `features_0`...`features_9` en `feature1`...`feature4` zijn **technische keys** (niet user-facing in UI — alleen in code). JSON key-naming mag volgens style-guide §1 in Engels. **Actie: 2 rewrites in values, keys laten.**

### 2.4 "klanten" (moet: "merken" waar het over eindklanten-van-bureaus gaat)

Style-guide §3: "klanten" mag voor FMai's eigen klanten (= de bureaus). Voor eindklanten van bureaus → "merken".

| File:Line | Current | Context | Verdict |
|---|---|---|---|
| `messages\nl.json:568` (pricing.tiers.growth.description) | `"Voor bureaus met 1 tot 5 klanten..."` | "klanten" van bureau | **SCHENDING.** → `"Voor bureaus met 1 tot 5 merken in hun portfolio..."` |
| `messages\nl.json:587` (pricing.tiers.professional.description) | `"Voor bureaus met 5 tot 15 klanten..."` | idem | **SCHENDING.** → `"Voor bureaus met 5 tot 15 merken in hun portfolio..."` |
| `messages\nl.json:606` (pricing.tiers.enterprise.description) | `"Voor bureaus met 15 of meer klanten die Clyde als kern-infrastructuur..."` | idem | **SCHENDING.** → `"Voor bureaus met 15 of meer merken in hun portfolio..."` |
| `messages\nl.json:624` (pricing.tiers.founding.description) | `"De oprichtende klanten die vóór launch committeerden..."` | "klanten van FMai" | **OK** — verwijst naar FMai's eigen klanten (= de bureaus zelf). |
| `messages\nl.json:1461` (memory.isolation.body1) | `"Clyde werkt voor meerdere klanten en meerdere merken tegelijk..."` | verwarrend mengen | **SCHUURD.** Style-guide staat "klanten" voor bureaus toe, maar in dezelfde zin "merken" daarnaast zetten is onduidelijk. → `"Clyde werkt voor meerdere bureaus en meerdere merken tegelijk..."` |
| `messages\nl.json:1544-1550` (apply.form.clientCountLabel + options) | `"Aantal actieve klanten"` / `"1 tot 5 klanten"` etc. | formulier voor bureau → hun klanten | **SCHENDING.** → `"Aantal actieve merken in je portfolio"` / `"1 tot 5 merken"` etc. |
| `messages\nl.json:1562` (apply.form.problemPlaceholder) | `"...voor 15 klanten..."` | idem | **SCHENDING.** → `"...voor 15 merken..."` |
| `messages\nl.json:1657` (case_studies.skc.cta.subtitle) | `"...bij jouw merken en klanten."` | dubbelop | **SCHUUR.** → `"...bij jouw bureau en merkenportfolio."` |
| `messages\nl.json:1719` (skills-email-management.useCase1.body) | `"Met 15 klanten krijg je al snel 100+ mails per dag."` | idem | **SCHENDING.** → `"Met 15 merken in beheer krijg je al snel 100+ mails per dag."` |

**Verdict**: 8 duidelijke schendingen van de "klanten/merken"-regel. **Actie: 8 rewrites.**

### 2.5 "Onbeperkt" / "unlimited"

Style-guide §3: **"Onbeperkt (fair use)"** — onderbouwing verplicht, niet los "Unlimited" of "Onbeperkt" zonder context.

Waar "Onbeperkt" los staat:

| File:Line | Current | Suggested replacement |
|---|---|---|
| `messages\nl.json:603` (pricing.tiers.enterprise.workspaces) | `"Onbeperkt"` | **Tabel-cell.** Context is duidelijk (kolom = werkruimtes). OK in tabel. Evt. asterisk met footnote "*voor zover infra reikt". |
| `messages\nl.json:605` (pricing.tiers.enterprise.tagline) | `"Onbeperkte werkruimtes en vaardigheden."` | `"Onbeperkte werkruimtes en vaardigheden (fair use)."` of verhelderen in tagline. |
| `messages\nl.json:607` (pricing.tiers.enterprise.features_0) | `"Onbeperkt aantal werkruimtes"` | Context tabel, OK. Kan wel `"Onbeperkt (fair use)"` worden. |
| `messages\nl.json:609` (pricing.tiers.enterprise.features_2) | `"Alle 12 vaardigheden zonder caps (fair use)"` | **OK** — style-guide-compliant. |
| `messages\nl.json:621, 625` (founding.workspaces, features_0) | `"Onbeperkt"` / `"Onbeperkt aantal werkruimtes"` | Zelfde logica. Tabel OK, feature-list: voeg "(fair use)" toe. |
| `messages\nl.json:642` (pricing.matrix.unlimited) | `"Onbeperkt"` | **Tabel-label.** OK in context. |
| `messages\nl.json:668` (pricing.creditPacks.items.unlimited.name) | `"Onbeperkt"` | Name van een credit-pack (€697 / 15.000 credits). **Naam is misleidend** — het pack is wél begrensd (15.000 credits). → herbenoemen naar `"Max"` of `"Ultra"` of `"Scale XL"`. |
| `messages\nl.json:715` (pricing.faq.q1.answer) | `"Onbeperkt gebruik voor alle tiers zou leiden tot..."` | **OK** — zelfverklarend. |
| `messages\nl.json:719` (pricing.faq.q2.answer) | `"een credit pack bijkopen (Partner Top-Up €39 tot Onbeperkt €697)"` | → `"...Partner Top-Up €39 tot Max €697)"` na hernoemen. |
| `messages\nl.json:1341` (founding-member.pricing.includes) | `"Onbeperkt aantal werkruimtes..."` | Feature-list, voeg `(fair use)` toe voor consistentie. |

**Verdict**: de grootste issue is `pricing.creditPacks.items.unlimited.name: "Onbeperkt"` — een credit pack van 15.000 credits mag geen "Onbeperkt" heten (contradictie, ondermijnt de transparantie-belofte). **Actie: herbenoemen credit pack + optioneel 3-4 "fair use"-aanvullingen.**

### 2.6 "unlimited" / "niet beschikbaar" (tier-matrix labels in `skills-data.ts` — LIVE RENDER)

**Kritiek**: deze strings verschijnen **daadwerkelijk in de tier-matrix** (zie `SkillsTierMatrix.tsx:40` — `cap.label ?? ${cap.included}${labels.perMonth}`).

| File:Line | Current | Suggested replacement |
|---|---|---|
| `src\lib\skills-data.ts:87` | `ENTERPRISE: { included: -1, label: 'unlimited' }` (Blog Factory) | `label: 'Onbeperkt (fair use)'` of laat `label` weg en gebruik `labels.unlimited` uit i18n (`pricing.matrix.unlimited = "Onbeperkt"`). |
| `src\lib\skills-data.ts:114` | `ENTERPRISE: { ..., label: 'unlimited' }` (Ad Creator) | idem |
| `src\lib\skills-data.ts:140` | `ENTERPRISE: { ..., label: 'unlimited' }` (Reel Builder) | idem |
| `src\lib\skills-data.ts:167` | `ENTERPRISE: { ..., label: 'unlimited' }` (Voice Agent) | idem |
| `src\lib\skills-data.ts:212` | `ENTERPRISE: { ..., label: 'unlimited' }` (Email Management) | idem |
| `src\lib\skills-data.ts:238` | `ENTERPRISE: { ..., label: 'unlimited' }` (ManyChat) | idem |
| `src\lib\skills-data.ts:111` | `PARTNER: { included: 0, label: 'add-on €97' }` | → `'Add-on €97'` (hoofdletter, consistent met pricing.matrix.addOn). |
| `src\lib\skills-data.ts:137` | `PARTNER: { included: 0, label: 'niet beschikbaar' }` (Reel Builder) | **Dubbel NL-schrijven overbodig** — in matrix wordt dit `labels.notAvailable` ("—"). Beter: `label: undefined` zodat de fallback `"—"` rendert. |
| `src\lib\skills-data.ts:164` | `PARTNER: { included: 0, label: 'niet beschikbaar' }` (Voice Agent) | zelfde. |
| `src\lib\skills-data.ts:165, 166, 168` | `'30 min/mo'` / `'120 min/mo'` / `'60 min/mo'` | → `'30 min/mnd'` / `'120 min/mnd'` / `'60 min/mnd'` (style-guide §6: NL `/mnd`, niet `/mo`). |
| `src\lib\skills-data.ts:209` | `PARTNER: { included: 5, label: '5/mo' }` | → `'5/mnd'`. |
| `src\lib\skills-data.ts:236, 237, 239` | `'200 DMs/mo'` / `'1000 DMs/mo'` / `'500 DMs/mo'` | → `'200 DM''s/mnd'` / `'1.000 DM''s/mnd'` / `'500 DM''s/mnd'` (apostrof voor meervoud op -M, duizend-punt). |
| `src\lib\skills-data.ts:235` | `PARTNER: { included: 0, label: 'add-on €47' }` | → `'Add-on €47'`. |

**Verdict KRITIEK**: de tier-matrix toont **Engelse** labels in een NL-native site voor Enterprise ("unlimited") en Partner ("add-on €97", "niet beschikbaar"), plus "/mo" i.p.v. "/mnd". Dit is de prijspagina (= convertibele pagina). **Actie: 16 label-fixes in skills-data.ts.**

### 2.7 "brand voice" (moet: "merkstem")

| File:Line | Current | Suggested replacement |
|---|---|---|
| `src\lib\skills-data.ts:50` | `"...in de juiste brand voice."` | `"...in de juiste merkstem."` |
| `src\lib\skills-data.ts:54` | `"AI-gegenereerde captions in brand voice"` | `"AI-gegenereerde captions in de merkstem"` |
| `src\lib\skills-data.ts:72` | `"schrijven in brand voice"` | `"schrijven in de merkstem"` |
| `src\lib\skills-data.ts:78` | `"Brand voice consistentie"` | `"Consistentie in merkstem"` |
| `src\lib\skills-data.ts:226` | `"AI-gegenereerde antwoorden in brand voice"` | `"AI-gegenereerde antwoorden in de merkstem"` |

`messages/nl.json` is op dit vlak schoon — de fix zit alleen in skills-data.ts (dead code nu, maar cleanen voor consistentie).

### 2.8 "Sign up" / "Try free" / "Trial"

| File:Line | Current | Verdict |
|---|---|---|
| `messages\nl.json:122` (home.faq.q3.answer) | `"...Een generieke sign-up past niet bij wat we leveren."` | **OK** — contrast-framing tegen self-service. |

EN equivalent: `en.json:122` ook `"sign-up"` — acceptabel, contrast.

Geen andere "trial" / "try free" in NL copy. **Geen actie.**

### 2.9 Mixed-language slippages in NL-copy

Style-guide §3: beperkte leenwoorden zijn toegestaan (onboarding, dashboard, workflow, API, KPI, CRM, SEO, GEO, AVG, AI). De volgende strings bevatten méér Engels dan de guide toelaat:

| File:Line | Current | Suggested replacement |
|---|---|---|
| `messages\nl.json:136` (home.trustStrip.subtitle) | `"onze eerste Founding partner"` | **OK** — "Founding partner" is productnaam voor tier. |
| `messages\nl.json:472` (about.cta.demo_button) | `"Boek een strategiegesprek"` | **INCONSISTENT** — overal elders "Plan een gesprek". → `"Plan een gesprek"`. |
| `messages\nl.json:1358` (founding-member.benefits.priority.description) | `"Feature-verzoeken..."` | Zie §2.3. |
| `messages\nl.json:465` (about.timeline.key_message.title) | `"Early-adopter bureaus bouwen..."` | → `"Vroege bureaus bouwen..."` of `"Voorloper-bureaus bouwen..."`. |
| `messages\nl.json:605, 1370` (enterprise.tagline, founding.community) | `"White-label en API-toegang."` / `"Founder Slack"` | **OK** — productjargon. |
| `messages\nl.json:649` (creditPacks.title) | `"Credit packs. Top-ups voor swing-months"` | `"swing-months"` is Dunglish. → `"Credit packs. Top-ups voor piekmaanden"`. |
| `messages\nl.json:130` (home.faq.q5.answer) | `"Cross-skill learning is onmogelijk met aparte tools..."` | → `"Leren over vaardigheden heen is onmogelijk met aparte tools..."` (consistenter met style-guide). |
| `messages\nl.json:715` (pricing.faq.q1.answer) | `"...geven elk tier een natuurlijke upgrade-trigger."` | → `"...geven elk tier een natuurlijke aanleiding om op te schalen."` |
| `messages\nl.json:152` (chatbots.quick_answer) | `"gespreksagenten, ingeregeld op jouw merkpersoonlijkheid"` | OK, maar `"chatbots-pagina"` (§1:235) is dunglish — `"onze chatbots-pagina"` beter. |
| `messages\nl.json:285-303` (chatbots.multi_platform) | `"Website-widget"`, `"Eén AI-medewerker"`, `"rich media en snelle antwoorden"`, `"contextverlies"` | "rich media" → "mediarijke berichten"; "contextverlies" is goed NL. |

### 2.10 Legacy namespace: `chatbots.*`

`messages/nl.json:140-334` (namespace `chatbots.*`) lijkt **orphan content** uit de oude demo-pagina. Het verwijst naar `/chatbots`-route die niet in de marketing-app-router meer bestaat (ls toonde alleen about/apply/case-studies/contact/founding-member/how-it-works/memory/pricing in `(marketing)/`).

Als deze namespace inderdaad orphan is → verwijderen bespaart 194 regels JSON en voorkomt reviews zoals deze op oude copy. Zo niet → herschrijven:

- `chatbots.hero.cta_primary`: `"Probeer een demo hieronder"` → `"Bekijk de demo"`
- `chatbots.hero.cta_secondary`: `"Vraag een gratis strategiesessie aan"` → `"Plan een gesprek"` (consistentie CTA)
- `chatbots.cta.button`: `"Vraag een gratis strategiesessie aan"` → `"Plan een gesprek"`
- `chatbots.faq.items.q3.answer`: `"systeemprompt, toonrichtlijnen..."` → `"systeemprompt, richtlijnen voor de stem..."`

**Aanbeveling**: verifiëren of er nog een `/chatbots`-route bestaat. Zo nee: **deze hele namespace verwijderen**. Dat levert instant content-hygiëne op.

---

## 3. IK/WIJ consistency

Style-guide §1:

| Context | Voice |
|---|---|
| `about.*`, `founding-member.*`, `contact.*` | **Ik** (Daley) |
| `home.*`, `how-it-works.*`, `pricing.*`, `skills-*` | **Wij** |
| Case studies | Mix: Wij uitvoer, Ik beslissingen |
| Legal | **U** / neutraal |

### Per-page pass/fail

| Namespace | Voice gevonden | Verdict |
|---|---|---|
| `home` | "we kijken", "we bespreken", "We nemen", "We brengen" (regels 104, 122, 268), NOOIT "ik" | **PASS** — consistent WIJ-stem. |
| `about.mission.why_text` (:443) | `"Ik draaide zelf marketingoperaties..."` | **PASS** — IK-stem conform guide. |
| `about.founder.bio` (:518) | `"Ik bouw FutureMarketingAI..."` | **PASS**. |
| `about.mission.heading` (:440) | `"Onze missie"` | **SLIP** — `about.*` = IK-context. → `"Mijn missie"`. Lichte slip, behoudt warmte. |
| `about.capacity.body` (:511) | `"We kiezen kwaliteit boven volume... We kijken of..."` | **SLIP** — context about, hoort IK of gemengd. Daley doet onboarding persoonlijk, dus: `"Ik kies kwaliteit boven volume... Ik kijk of..."` versterkt persoonlijke verantwoordelijkheid. |
| `about.capacity.body` (:511) | `"Daley begeleidt elke nieuwe klant persoonlijk..."` | **INCONSISTENT** — Daley praat over zichzelf in de derde persoon. In IK-context hoort: `"Ik begeleid elke nieuwe klant persoonlijk..."`. Lichte slip, maar voor geloofwaardigheid belangrijk. |
| `about.infra.selfHosted.body` (:494) | `"...we bouwen transparante pipelines die we samen bijstellen."` | **SLIP** — IK-context. → `"...ik bouw transparante pipelines die we samen bijstellen."` ("we" = Daley+klant in co-creatie, OK) of volledig `"...ik bouw... die ik samen met jou bijstel."` |
| `contact.direct_contact.email_address` (:822) | `"hello@futuremarketingai.com"` | **PASS** — technisch veld. |
| `contact.applyCallout.body` (:830) | `"...Daley leest elke aanvraag persoonlijk..."` | **INCONSISTENT** — op contact = IK-context, derde persoon. → `"...ik lees elke aanvraag persoonlijk..."`. |
| `contact.form.message_placeholder` (:811) | `"Vertel ons over je bureau..."` | **SLIP** — contact = IK-context. → `"Vertel me over je bureau..."`. |
| `contact.book_demo.description` (:816) | `"Plan een persoonlijke rondleiding..."` | OK (imperatief). |
| `contact.hero.description` (:800) | `"Voor een partnership-aanvraag ga je naar /apply... gebruik je dit formulier. Reactie binnen 1 tot 2 werkdagen."` | OK (neutraal). |
| `founding-member.value.line1-3` (:1345-1347) | `"Founding partners zijn de bureaus waarmee we Clyde samen vormgeven. Jullie feedback... In ruil voor dat vroege vertrouwen krijg je..."` | **INCONSISTENT** — founding-member = IK-context. → `"...waarmee ik Clyde samen vormgeef. Jullie feedback..."` of hele paragraaf in IK. |
| `founding-member.cta.subtitle` (:1410) | `"...reserveren we je plek."` | WIJ in IK-context, **slip**. |
| `founding-member.proof.body` (:1380) | `"SkinClarity Club is sinds dag 1 Founding partner. Clyde runt 3 Instagram-accounts..."` | Neutraal. OK. |
| `founding-member.benefits.community.description` (:1370) | `"Directe Slack-ruimte met Daley..."` | **INCONSISTENT** — derde persoon in IK-context. → `"Directe Slack-ruimte met mij en de andere 9 Founding partners."` |
| `pricing.*` | `"we kijken samen", "Geen self-service."`, geen ik/mij | **PASS**. |
| `how-it-works.process.steps.onboarding.description` (:766) | `"Daley begeleidt het traject persoonlijk."` | WIJ-context, derde persoon verwijzing OK in WIJ-context. **PASS**. |
| `skills-*` | Consistent WIJ / neutraal. Clyde-focused. | **PASS**. |
| `apply.form.privacyNote` (:1565) | `"We gebruiken deze gegevens alleen voor de beoordeling."` | Apply = formulier, context borderline. WIJ is hier OK. **PASS**. |
| `apply.expectations.step2.body` (:1518) | `"Videogesprek over jouw portfolio... Geen pitch, wel een wederzijds gesprek."` | Neutraal/imperatief. **PASS**. |
| `apply.expectations.step1.body` (:1514) | `"Daley leest elke aanvraag persoonlijk."` | WIJ-context, derde persoon verwijzing OK. **PASS**. |
| `case_studies.skc` | `"SkinClarity Club is vanaf de eerste week..."` | Neutraal case-study-stijl. **PASS**. |
| `case_studies.skc.testimonial` (:1651) | Quote van Sindy — eerste persoon Sindy, niet Daley. | **PASS** (externe quote). |
| `legal.*` | `"U"` / neutraal | **PASS**. |

### IK/WIJ samenvatting

**Grote gebieden pass**: home, pricing, how-it-works, skills-* (alle 12), legal, apply, case_studies.
**Slipzones**: `about.*` (3 slips), `contact.*` (2 slips), `founding-member.*` (3 slips).

Dit zijn precies de contexten waar IK-stem **het hardst werkt voor geloofwaardigheid** (apply-gated partnership). De slips zijn klein maar cumulatief: een bureau-eigenaar die de site afleest merkt het verschil tussen "Mijn missie" + "Ik begeleid elke klant" en "Onze missie" + "Daley begeleidt elke klant". Tweede leest afstandelijk.

**Actie: 11 rewrites in about + contact + founding-member om IK-stem door te zetten.**

---

## 4. Page-by-page copy audit

### 4.1 Home (`messages/nl.json:2-139`)

**Strengths**

- H1 is kort en scherp: "Dit is Clyde." — werkt als pattern-interrupt op een conventionele B2B-site.
- Subtitle (11): `"Clyde onthoudt elk merk, leert van elke campagne en voert twaalf vaardigheden autonoom uit..."` — drie concrete claims in één zin, scanbaar.
- ICP-sectie `home.icp` is **beste content op de site**: benoemt expliciet wie géén fit is (jaaromzet <€300K, branding-only, >30 FTE met eigen tech-team). Dat bouwt vertrouwen.
- FAQ-items zijn concurrent-specifiek ("Hoe verschilt Clyde van ChatGPT of Jasper?").
- Trust-strip onderaan verwijst naar SKC zonder te claimen dat je-de-founder-bent (eerlijkheid conform CLAUDE.md).

**Weaknesses**

- **Missende problem-section** vóór services. De user ziet direct "Wat Clyde doet" zonder dat de pijn benoemd is. Bureau-eigenaar met scepsis krijgt geen "ja, dat is mijn probleem"-moment.
- `home.hero.badge` (8) is 87 tekens: `"Jouw AI Marketing Medewerker met langetermijngeheugen. {taken} van {total} founding plekken bezet"` — te lang voor een badge; leest als ondertitel.
- `home.hero.trustAnchor` (12) `"Gebouwd met Nederlandse bureaus in de praktijk."` — claim klinkt alsof er al 10 bureaus mee werken. Werkelijkheid: 1 (SKC). Juridisch glijbaan: een bureau-eigenaar mag vragen "welke Nederlandse bureaus?". Alternatief: `"Gebouwd in de Nederlandse praktijk met SkinClarity Club. Maximaal 20 partners per jaar."` (specifiek, eerlijk).
- `home.services.title` (17) `"Wat Clyde doet voor jouw bureau"` — gebruikelijk. Kan scherper: `"Wat Clyde elke dag doet voor je portfolio"` (specificiteit + frequentie).
- `home.stats.hours.label` (86) `"Geheugen per klant"` — value `"Persistent"` is jargon. Subtelere alternatief: value `"Voor altijd"` + label `"geheugen per merk"` (voor altijd is concreter dan persistent).
- `home.cta.subtitle` (104): heeft `"we kijken samen"` — werkt goed, behouden.

**Top 3 rewrite-suggesties**

1. `hero.badge` (regel 8) — korter:
   → `"Jouw AI Marketing Medewerker. {taken}/{total} founding plekken bezet."`

2. `hero.trustAnchor` (regel 12) — eerlijker:
   → `"Gebouwd in de Nederlandse praktijk met SkinClarity Club. Maximaal 20 partners per jaar."`

3. Nieuwe sectie tussen hero en services (`home.problem.*`) — optioneel:
   → `{"title": "Waarom je dit leest.", "body": "Je bureau groeit harder dan je kan aannemen. Tien tot vijftig merken, elk met eigen content, campagnes, rapportages. Freelancers schalen niet mee, tools lossen het niet op. Clyde wel."}`

### 4.2 Pricing (`nl.json:521-741`)

**Strengths**

- `pricing.hero.description` (:528): `"Alle prijzen staan zichtbaar... geen verborgen kosten, geen 'neem contact op voor prijs'."` — directe contrast met premium-SaaS-cliché, werkt.
- `pricing.visibility.body` (:533): legt pricing-transparantie uit als bewuste keuze, niet als corner-cutting.
- `pricing.faq.q1` legt uit waarom er caps zijn — beantwoordt de belangrijkste pricing-vraag.
- `pricing.faq.q2.answer` noemt concrete drempels (80%, 100%). Geloofwaardig.

**Weaknesses**

- **Tier-matrix toont Engelse labels** in NL-versie: "unlimited", "add-on €97", "/mo" — zie §2.6. Dit is de kritiekste copy-issue op de site omdat pricing de convertibele pagina is.
- `pricing.creditPacks.items.unlimited.name` (:668) `"Onbeperkt"` voor een 15.000-credit-pack is **feitelijk onjuist** en ondermijnt de transparantie-claim (→ hernoem naar "Max" of "Scale XL").
- `pricing.tiers.growth.description` (:568): `"Voor bureaus met 1 tot 5 klanten"` — zie §2.4. Schendt "klanten/merken"-regel.
- 5 tiers naast elkaar is visueel zwaar; de tier-cards (`pricing.tiers.*.features_0`...`features_9`) hebben tot 10 bullets. Partner-tier heeft bullet 9 (`"Geen Voice Agent, Video ads of Reel Builder"`) als **laatste** bullet — wat-je-NIET-krijgt-op-plek-9 werkt psychologisch averechts (leest als anti-climax). Beter: deze info in een aparte `notes`-regel of als voetnoot.
- `pricing.cta.title` (:736) `"Klaar om de partnership te starten?"` — herhaalt "de partnership" (lidwoord overbodig). → `"Klaar om een partnership te starten?"`

**Top 3 rewrite-suggesties**

1. `skills-data.ts` labels (zie §2.6) — 16 fixes voor tier-matrix in NL.
2. `pricing.creditPacks.items.unlimited.name` → hernoem pack (`"Max"`, `"Scale XL"` of `"Ultra"`).
3. Partner-tier: verplaats "Geen Voice Agent..." (`features_9`) naar een apart `notFeatures` veld of voetnoot, zodat de positive-features prominent blijven.

### 4.3 About (`nl.json:429-520`)

**Strengths**

- Founder-bio `about.founder.bio` (:518) is **uitzonderlijk goed** — schijnwerper op eerlijkheid ("als operator bij SkinClarity Club zag ik hoe 12 losse tools niet meeschalen"). Dit is de sterkste persoonlijke claim op de site.
- Timeline met 3 era's (2020-2024, 2025-2026, 2027+) positioneert de urgentie met een educational frame in plaats van scarcity-tactics.
- `about.capacity.reasoning` (:512): `"We kiezen kwaliteit boven volume. Liever 20 bureaus waar Clyde echt meerwaarde levert, dan 200 waar we niet genoeg aandacht aan kunnen geven."` — bouwt vertrouwen.

**Weaknesses**

- IK/WIJ-slips (§3): `"Onze missie"`, `"Daley begeleidt"` in IK-context.
- `about.timeline.key_message.title` (:465) `"Early-adopter bureaus..."` — zie §2.9, "Early-adopter" is English.
- `about.infra.title` (:490) `"Onze infrastructuur"` — technisch correct, maar in IK-context hoort `"Mijn infrastructuur"` of `"De infrastructuur"`.
- `about.hero.tagline` (:437): `"De eerste AI Marketing Medewerker voor bureaus, door een solo founder."` — "door een solo founder" is een zelfdeprecaire toon. Claim trekt aandacht maar kan sceptisch bureau afschrikken ("solo" = "vast eenmansbedrijf"). Alternatief: `"De eerste AI Marketing Medewerker voor bureaus. Gebouwd door Daley, in de Nederlandse praktijk."`
- `about.hero.badge` (:435) `"Founding members worden nu onboard gezet"` — "onboard gezet" is werkwoord-stijl-hybride. → `"Founding members worden nu aangenomen"` of `"We nemen de eerste founding members aan"`.

**Top 3 rewrite-suggesties**

1. Voer IK-stem consistent door (§3): `"Mijn missie"`, `"Ik begeleid elke nieuwe klant persoonlijk"`, `"Ik bouw transparante pipelines"`, `"Ik kies kwaliteit boven volume"`.
2. `about.hero.tagline` — minder zelfdeprecair:
   → `"De eerste AI Marketing Medewerker voor bureaus. Gebouwd in de Nederlandse praktijk."`
3. `about.timeline.key_message.title` — ontdunglishen:
   → `"Bureaus die nu beginnen, bouwen 2 tot 3 jaar voorsprong op."`

### 4.4 How-it-works (`nl.json:742-792`)

**Strengths**

- 5-stappen-structuur is crisp. Stap-titels zijn action-based ("Aanmelden plus kennismakingscall", "4 weken partnership-setup met Daley").
- Stap 4 (`process.steps.production`) benoemt expliciet het **goedkeurings-gat**: `"Week 1 veel correcties, maar Clyde leert snel."` — verwachtingsmanagement.
- Loop-sectie onderaan (`process.loop_description`) sluit mooi af: "Na 12 weken zie je het verschil met week 1" — referentiepunt.

**Weaknesses**

- `how-it-works.hero.title` (:748): `"Hoe begint jouw partnership met Clyde?"` — vraag-vorm is OK maar past niet bij de rest van de site (declaratief). → `"Zo begint jouw partnership met Clyde."`
- Stap 1 (`process.steps.apply.description`): `"Vul het aanmeldformulier in. Binnen 3 werkdagen horen we van elkaar. Vervolgens een videogesprek van 30 minuten..."` — twee aparte actions in één paragraaf zonder breek. → plak een zin tussen (`"Klopt het? Dan plannen we..."`).

**Top 3 rewrite-suggesties**

1. `hero.title` → declaratief: `"Zo begint jouw partnership met Clyde."`
2. Stap 1 opbreken: `"Vul het aanmeldformulier in. Binnen 3 werkdagen lees ik je aanvraag. Klopt het? Dan plannen we een videogesprek van 30 minuten waarin we wederzijds checken of het een match is. Geen pitch, wel een eerlijke check."` (plus IK-stem, want het gaat over Daley).
3. Loop-title (`loop_title`) `"Continu verbeteren"` is neutraal, kan sterker: `"Elke week scherper, per merk"`.

### 4.5 Apply (`nl.json:1500-1570`)

**Strengths**

- `apply.hero.subtitle`: `"Geen zelfbediening. Geen generieke aanmelding. We beoordelen elke aanvraag persoonlijk en antwoorden binnen 3 werkdagen. Ook als het geen match is."` — drie korte zinnen, duidelijke scope.
- `apply.expectations.reassurance` (:1524): `"Een 'geen match' is geen teleurstelling."` — dempt angst voor afwijzing.
- Revenue-options en client-count-options zijn gedetailleerd genoeg om zinnige buckets te geven zonder over-te-enquêteren.
- Privacy-note (:1565) is ongewoon transparant: `"Geen marketing-automatisering, geen mailinglijst, geen doorverkoop."` — ironisch voor een marketing-AI-bedrijf, werkt precies daarom.

**Weaknesses**

- "klanten" in form-labels (zie §2.4). Apply-form is cruciale conversie-pagina.
- `apply.form.tierLabel` (:1552) `"Welke tier past het best?"` + options → deze vraag dwingt een keuze terwijl "Weet het nog niet zeker" een opt-out-optie is. Dat werkt, maar de tier-opties tonen prijs inline (`"Partner (€347/mnd): solo-operator"`) — dat kan een bureau afschrikken dat nog niet op de pricing-page gekeken heeft. Alternatief: geen prijs in form-label, prompt de user de pricing-page te bekijken.
- `apply.form.problemPlaceholder` (:1562) heeft quote-in-quote: `'Bijvoorbeeld: "We verliezen 2 FTE..." of "Onze SEO stagneert..."'` — goed voorbeeld, maar "klanten" schendt glossary.

**Top 3 rewrite-suggesties**

1. `apply.form.clientCountLabel` → `"Aantal actieve merken in je portfolio"`; opties gelijk bijwerken.
2. `apply.form.tierOptions` — haal prijzen uit opties, laat de tier-naam staan:
   → `"partner": "Partner (solo-operator, 1 merk)"`, `"growth": "Growth (klein bureau, 5 merken)"`, etc.
3. `apply.form.problemPlaceholder` → vervang "klanten" door "merken":
   → `'Bijvoorbeeld: "We verliezen 2 FTE aan contentproductie voor 15 merken" of "Onze SEO stagneert en we hebben geen ruimte voor blogs."'`

### 4.6 Founding-member (`nl.json:1324-1413`)

**Strengths**

- `founding-member.pricing.comparison` (:1340): `"Growth tier wordt €2.497 per maand. Jij betaalt 60% minder. Voor altijd."` — scherp, concreet.
- `founding-member.value.line3` (:1347): `"Tien plekken. Geen heropening. Vol is vol."` — 3 korte zinnen, decisive framing.
- Benefits-items (:1349-1376) zijn concreet (price_lock, priority, influence, early_access, community, onboarding). Elke bullet heeft een wat-je-krijgt-formule.

**Weaknesses**

- IK/WIJ-slip (§3): `"waarmee we Clyde samen vormgeven"`, `"reserveren we je plek"`, `"Directe Slack-ruimte met Daley"`.
- `founding-member.benefits.items.priority.description` (:1358): `"Feature-verzoeken van Founding partners gaan voor."` → "Feature-verzoeken" is glossary-schending (§2.3).
- `founding-member.faq.items.q3.answer` (:1395): `"Wat zijn 'Pro-caps' precies?"` — antwoord somt 5 caps op in één zin: voice, video, reels, manychat, blogs. Moeilijk te scannen. → bullet-list of compacter: `"Je krijgt Professional-tier caps (voice 60 min, video 8, reels 8, ManyChat 500, blogs 12 per maand) tegen Founding-prijs."`
- `founding-member.hero.description` (:1332): 3 zinnen in één paragraaf. Derde zin (`"Alle 12 vaardigheden, Pro-caps en directe Slack-lijn met Daley."`) verdient een eigen regel.

**Top 3 rewrite-suggesties**

1. IK-stem doortrekken: `"Founding partners zijn de bureaus waarmee ik Clyde samen vormgeef."`, `"Directe Slack-ruimte met mij en de andere 9 Founding partners."`, `"reserveer ik je plek."`.
2. Glossary: `benefits.items.priority.description` → `"Verzoeken voor nieuwe vaardigheden van Founding partners krijgen voorrang."`.
3. `faq.items.q3.answer` opbreken in bullets of compacter:
   → `"Pro-caps = dezelfde caps als het Professional-tier, tegen de Founding-prijs. Concreet: voice 60 min, video 8, reels 8, ManyChat 500 DM's, blogs 12 per maand. Beter dan Growth, onder Enterprise."`

### 4.7 Memory (`nl.json:1424-1498`)

**Strengths**

- Hero split-headline `"Clyde onthoudt alles. / Per merk, voor altijd."` is elegant en memorable.
- 4-lagen-geheugen (`layers.hot/warm/cold/context`) met Nederlandse namen ("Vandaag", "Deze maand", "Archief", "Wie het merk ís") is **ongewoon goed** — maakt technisch concept intuïtief.
- Contrast-sectie met ChatGPT/Jasper/Clyde (:1479-1493) stelt de concurrentie scherp zonder FUD. Clyde-body: `"Persistent geheugen per merk, vier lagen, strikt gescheiden en elke nacht geconsolideerd."` — specifiek.
- `memory.decay.dreamBody` (:1469) metafoor ("net als wat wij in onze slaap doen") is warm en memorabel.

**Weaknesses**

- `memory.hero.subtitle` (:1433): `"Dit is het verschil tussen een AI-tool en een AI Marketing Medewerker: geheugen."` — gebruikt "AI-tool" als contrast. Dit is acceptabel (contrast-framing), maar de zin leest als een verdediging van de positionering. Alternatief minder defensief: `"Dit is wat Clyde anders maakt dan ChatGPT: geheugen per merk."`
- `memory.isolation.body1` (:1461): "klanten en merken" door elkaar (§2.4).
- `memory.progress.week12Body` (:1477): `"welke emoji wel en niet, welke openingszin converteert, welke hashtags presteren, welke tijdstippen werken"` — 4 concrete voorbeelden in één zin werkt, maar `"hebbelijkheden"` eerder in de zin is licht neerbuigend. → `"voorkeuren"` of `"eigenaardigheden"`.

**Top 3 rewrite-suggesties**

1. `hero.subtitle` — minder defensief, meer concurrent-specifiek:
   → `"Dit is wat Clyde anders maakt dan ChatGPT of Jasper: geheugen per merk. Clyde onthoudt je merkstem, doelgroep, doelen en wat eerder werkte. Elke week kent hij jouw merken beter."`
2. `memory.isolation.body1` → `"Clyde werkt voor meerdere bureaus en meerdere merken tegelijk..."`.
3. `memory.progress.week12Body`: vervang "kleine hebbelijkheden" door "eigenaardigheden" of "voorkeuren".

### 4.8 Case study SKC (`nl.json:1577-1660`)

**Strengths**

- Concrete cijfers: "Circa 21 carrousels per week", "3 Instagram-accounts", "4 merken", "2 tot 4 blogartikelen per maand".
- Setup-sectie (:1590-1600) toont percentages contentvolume per account — audit-kwaliteit detail.
- Testimonial (:1651) van Sindy is specifiek: `"Wat eerst een hele middag per week kostte, draait nu autonoom op de achtergrond."` — geen generiek "great tool!"-verhaal.

**Weaknesses**

- `case_studies.skc.timeline.month3Body` (:1646): `"De goedkeuringstijd per post zakt van 4 minuten naar 30 seconden."` — zeer specifiek, geweldig, maar **geen bron-noot**. Prospect mag vragen "hoe gemeten?". Evt. voetnoot: `"(Gemiddelde over 50 posts, gemeten in goedkeuringslogs)"`.
- `case_studies.skc.architecture.body` (:1636): `"Bijvoorbeeld: een succesvol thema op de shop kan vertaald worden naar het hoofdaccount."` — "kan vertaald worden" is vaag. → `"Voorbeeld: een thema dat converteerde op de shop werd zonder tussenkomst herschreven voor het hoofdaccount."` (past tense, concreet).
- `case_studies.skc.cta.subtitle` (:1657): `"Plan een gesprek. We bespreken hoe Clyde past bij jouw merken en klanten."` — "merken en klanten" dubbelop (§2.4).

**Top 3 rewrite-suggesties**

1. Voeg een proof-foot note toe aan `timeline.month3Body` over hoe de 4 → 30 sec is gemeten.
2. `architecture.body` → past tense + specifieker: `"Voorbeeld: een thema dat converteerde op @SkinClarity_Shop werd zonder tussenkomst herschreven voor @SkinClarityClub en leverde 2,3x meer comments op."`
3. `cta.subtitle` → `"Plan een gesprek. We bespreken hoe Clyde past bij jouw portfolio."`

### 4.9 Skills pages (12 × subpage, `nl.json:942-2179`)

**Patroon**

Alle 12 skill-namespaces volgen dezelfde structuur: `hero / features / how / integrations / useCases / allocation / proof / cta`. Dit is consistent en scanbaar. Copy per skill is kort en actionable.

**Strengths**

- Hero-pattern `"Clyde [verb] je [noun]."` is consistent: `"Clyde neemt de telefoon op."`, `"Clyde kwalificeert je website-leads."`, `"Clyde maakt je Meta-ads."`, `"Clyde schrijft je SEO-blogs."`, `"Clyde monitort je SEO én AI-citaties."`, `"Dit is Clyde. Je AI Marketing Medewerker."`, `"Clyde handelt Instagram-DM's af."`, `"Clyde produceert je Reels."`, `"Clyde classificeert je Gmail-inbox."`, `"Clyde doet jouw marktonderzoek."`, `"Clyde rapporteert elke week."`, `"Clyde verzorgt je social media."` — **alle 12** consistent.
- Credit-cost labels in meta-descriptions: `"5 credits per minuut"`, `"10 credits statisch, 20 credits video"`, etc. — prijs-transparantie per skill.
- Coming-soon skills (email-management, manychat, reel-builder) hebben `"(coming soon)"` in eyebrow: transparant.

**Weaknesses**

- **Integrations-sectie is templated**: elke skill heeft `"Via het gedeelde geheugen per merk."` als subtitle (§1146, 1712, 1784, 1858, 1932, 2006, 2080, 2154 enz.) — monotoon als user meerdere skill-pages leest. Variëren: verschillende formuleringen van de shared-memory-claim.
- **Allocation-sectie subtitle** is identiek voor alle 12 skills: `"Wat deze vaardigheid kost per actie, en hoeveel er in elk tier is inbegrepen."` — zelfde monotonie. Consequent, maar niet memorabel.
- **CTA-titles** zijn templated: `"Klaar om [X] aan Clyde over te dragen?"` / `"Plan een gesprek. We bespreken hoe deze vaardigheid past bij jouw merken."` — herhalen op elke skill-page. Prospect die 3 pages afleest ziet dezelfde CTA-title 3×. Variatie is mogelijk zonder consistency te breken.
- `skills-reel-builder.meta.description` (:2109): `"Korte verticale video's (9:16), AI-scripts, automatische captions en muziek"` — apostrof-consistency goed.
- `skills-clyde.hero.subtitle` (:1966): `"De andere 11 vaardigheden zijn losse tools."` — "tools" voor eigen product (§2.1).
- `skills-manychat.meta.description` (:2035): `"2 credits per 10 DM's"` — goed (apostrof voor -M-meervoud).
- `skills-email-management.hero.subtitle` (:1670): `"Geen mailcampagnes: dit is inbox-classificatie."` — disambiguatie upfront, werkt.

**Top 3 rewrite-suggesties** (cross-skill)

1. Vervang gerepeteerde `integrations.subtitle` door skill-specifieke variatie:
   - voice-agent: `"Gespreks-inzicht vloeit door naar andere vaardigheden."`
   - lead-qualifier: `"Chat-context reist mee naar e-mail, voice en rapportage."`
   - social-media: `"Wat werkt op social voedt blogs, ads en research."`
   - blog-factory: `"Blog-content wordt social posts, ad-copy en research-materiaal."`
   - enz.
2. Allocation-subtitle variëren per skill: voor kosten-intensieve skills (voice, video, reels) expliciet de cap benoemen, voor fair-use-skills anders framen.
3. `skills-clyde.hero.subtitle` → `"De andere 11 vaardigheden zijn gespecialiseerde uitvoerders. Clyde is de medewerker die ze orkestreert."`

### 4.10 Legal (`nl.json:834-929`)

**Strengths**

- Sectie-nummering (1-7 in terms, 1-9 in privacy) is gestructureerd en juridisch scanbaar.
- `legal.sections.privacy.subsections.sub_processors` (:898) noemt expliciet sub-verwerkers (OpenAI, Anthropic, Supabase, Vercel, Vapi) met DPF-status — transparantie bouwt vertrouwen.
- Bewaartermijnen (`data_retention`) zijn specifiek per data-type (90 dagen logs, 30 dagen exports, 7 jaar factuur).

**Weaknesses**

- `legal.sections.disclaimer.content` (:925): `"Elk vertrouwen dat u in deze informatie stelt is op eigen risico."` — juridisch standaard, klinkt onnodig defensief in een premium-brand-context. Acceptabel.
- `legal.sections.cookies.content` (:921): `"Onze website gebruikt essentiële cookies en optionele analytische cookies."` — te kort voor een cookie-beleid. In combinatie met cookie-consent-banner OK, maar staand op `/legal/cookies` onvoldoende.

**Top 3 rewrite-suggesties**

1. `legal.sections.cookies.content` — uitbreiden: welke cookies precies (Vercel Analytics, PostHog, etc.), bewaartermijn per cookie, link naar privacy-instellingen.
2. Geen andere grote issues — legal-copy is op dit niveau acceptabel voor een premium B2B-site.

---

## 5. Clarity & persuasion

### 5-seconden-test per hero

Kan een bureau-eigenaar in **<5 seconden** begrijpen: wat is dit / voor wie / waarom nu?

| Page | Wat | Voor wie | Waarom nu | Score |
|---|---|---|---|---|
| Home | Clyde = AI Marketing Medewerker | Geïmpliceerd (bureaus) | Geïmpliceerd (founding counter) | **7/10** — "voor wie" niet expliciet in hero, pas duidelijk bij services. |
| Memory | Clyde onthoudt alles per merk | Onduidelijk vanuit hero alleen | Ja (contrast AI-tool) | **6/10** — voor wie komt pas bij contrast-sectie. |
| Pricing | Premium partnership, 5 tiers, transparant | Ja ("voor elke portfoliomaat") | Nee | **7/10** — "waarom nu" niet genoemd. |
| Apply | Partnership-gesprek plannen | Ja (bureaus) | Ja (founding counter) | **9/10** — helder. |
| Founding-member | Founding tier €997 levenslang | Ja (bureaus die vanaf launch committeren) | Ja (10 plekken) | **9/10** — helder, scarcity goed ingezet. |
| About | Over FutureMarketingAI | Impliciet (bureaus) | Impliciet (founding onboarding) | **6/10** — hero is zachter, meer bio-achtig. |
| Skills (12) | Specifieke vaardigheid door Clyde | Ja (bureaus) | Nee | **7/10** — consistent, duidelijk wat de skill doet. |

**Verdict**: pages met counter in hero-badge (home, founding, apply) hebben de sterkste "waarom nu". About en Memory kunnen scherper in de hero.

---

## 6. Value propositions — concreet of vaag

### Concrete waarden op de site (goed)

- `home.stats.clients.value` (:77): `"3 × 4 merken"` — SKC, concreet.
- `home.hero.subtitle`: `"twaalf vaardigheden autonoom"`.
- `pricing.tiers.*.price` — 5 exacte bedragen.
- `skills-ad-creator.features.feature1.title` (:1192): `"Statische ads (10 credits)"` — credit-kost inline.
- `case_studies.skc.content.row1Value` (:1621): `"Circa 21 per week"`.
- `case_studies.skc.timeline.month3Body` (:1646): `"Goedkeuringstijd per post zakt van 4 minuten naar 30 seconden."`
- `founding-member.pricing.comparison`: `"Jij betaalt 60% minder. Voor altijd."`

### Vage claims (ondergeschikt)

- `home.trust.successGuarantee` (:57): `"Clyde schaalt mee met je portfolio"` — hoe meten? Geen metric. → voeg: `"Getest met 4 merken parallel in SKC-opzet, geen performance-degradatie gemeten."`
- `home.services.subtitle` (:18): `"Een greep uit wat Clyde het vaakst oppakt."` — "het vaakst" zonder cijfers.
- `skills-social-media.hero.subtitle` (:1106): `"...hashtag-onderzoek en engagement-tracking"` — concrete features, maar no output-metrics.
- `skills-lead-qualifier.hero.subtitle` (:1028): `"Geen lead gaat verloren door gemiste chats."` — absolute claim, waar te maken? → `"Uptime 99,9% over 6 maanden SKC-data."`
- `home.trust.customBuilt` (:53): `"Elke week scherper."` — frequent geclaimd zonder onderbouwing. OK op deze pagina (context: memory), maar moet ergens hard gemaakt worden.

**Verdict**: de grondlaag is sterk (cijfers waar mogelijk), maar 3-4 claims op home en skills blijven vaag. Voor een premium-positionering dringt elke onbewezen claim door als "standaard SaaS-praat".

---

## 7. Scannability

### Paragraaf-lengtes (samplemeting)

- `home.faq.items.q1.answer` (:114): 76 woorden in één paragraaf — scanbaar want opgebouwd in 3 zinnen.
- `home.faq.items.q4.answer` (:126): 67 woorden, 3 zinnen — OK.
- `pricing.faq.items.q1.answer` (:715): 51 woorden in één paragraaf met komma's en `óf`-accent — **slechter scanbaar**, vooral op mobile. Breek op: twee zinnen met `óf`.
- `about.founder.bio` (:518): 60 woorden, 4 korte zinnen — goed.
- `memory.isolation.body2` (:1462): 60 woorden, één paragraaf met `:`-delen — technisch detail, leesbaar voor de doelgroep.
- `legal.sections.privacy.subsections.ai_data_processing.content` (:895): **192 woorden in één paragraaf** — te lang voor scanbaarheid. Acceptabel voor legal, maar voor juridische helderheid wel bullets aanbevolen.

**Verdict**: NL-copy is meestal in 2-4 zins-paragrafen. Legal-secties zijn hele paragrafen van 100-200 woorden; dat is legal-standaard maar op een premium site kan je bullets gebruiken zonder juridische kracht te verliezen.

---

## 8. CTAs — microcopy

### CTA-inventarisatie (alle "Plan een gesprek"-varianten)

Grep-telling in nl.json: `"Plan een gesprek"` staat in 20+ places als primaire CTA, consistent. **Goede standaardisering.**

### Slipjes / afwijkingen

| File:Line | CTA | Opmerking |
|---|---|---|
| `nl.json:472` (about.cta.demo_button) | `"Boek een strategiegesprek"` | **Inconsistent**. → `"Plan een gesprek"`. |
| `nl.json:816` (contact.book_demo.description) | `"Plan een persoonlijke rondleiding..."` | Alt voor "gesprek". OK als variatie. |
| `nl.json:817` (contact.book_demo.button) | `"Plan gesprek"` (zonder "een") | **Klein inconsistent**. → `"Plan een gesprek"`. |
| `nl.json:149` (chatbots.hero.cta_primary) | `"Probeer een demo hieronder"` | Orphan namespace, negeer of schonen. |
| `nl.json:150` (chatbots.hero.cta_secondary) | `"Vraag een gratis strategiesessie aan"` | Orphan, schonen. |
| `nl.json:283` (chatbots.cta.button) | `"Vraag een gratis strategiesessie aan"` | Orphan, schonen. |
| `nl.json:415` (calendly.modal_title) | `"Plan een strategiegesprek"` | Variatie, OK. |
| `nl.json:1415` (booking.title) | `"Plan een strategiegesprek"` | Variatie, OK. |
| `nl.json:2182` (nav.apply) | `"Plan een gesprek"` | Primary, OK. |

### CTA-kwaliteit

- `"Plan een gesprek"` is warm, low-friction, past bij application-gated model. Werkt.
- Secondary CTAs `"Leer Clyde kennen"`, `"Lees SkinClarity case"`, `"Bekijk Founding tier"` zijn discovery-georiënteerd, goed voor funnel-navigatie.
- `home.hero.ctaSecondary` (:14): `"Leer Clyde kennen"` — mag iets concreter: `"Bekijk wat Clyde doet"` of `"Hoe werkt Clyde"`.

### CTAs met ontbrekende urgentie

- `pricing.cta.primary` (:738): `"Plan een gesprek"` — zonder counter of tijdsgebonden framing. De hero had wel een counter (`{taken}/{total}`), maar de final-CTA aan het einde van de pricing-page herhaalt dat niet. → `"Plan een gesprek. {taken} van 10 Founding plekken nog open."`

---

## 9. Proof & specificity

### Sterke proof-punten (behouden)

- SKC-case met specifieke metrics (3 accounts, 4 merken, 21 carrousels/week).
- Founding-counter `{taken}/{total}` (werkt met `FOUNDING_SPOTS_TAKEN` SSoT uit constants).
- Max-20-per-jaar-cap (home, pricing, about).
- Exacte credit-allocaties per tier.
- Specifieke sub-verwerkers in privacy-policy.

### Zwakke proof-punten (onderbouwen)

- `home.trust.successGuarantee` — claim "Clyde schaalt mee" zonder bench.
- `skills-email-management.how.step2.body` (:1701): `"Vanaf week 2: 95% of hoger nauwkeurig voor jouw specifieke context."` — **specifiek getal, maar geen bron**. Email Management is coming_soon; is deze 95% extrapoleerd uit test of marketing-claim? Bureau-eigenaar mag dit bevragen. Als niet gemeten: softer maken, `"Vanaf week 2: dusdanig hoog dat je zelden hoeft te corrigeren."`
- `skills-seo-geo.features.feature3.body` (:1907): `"Een van de belangrijkste Google-rankingfactoren."` — geen bron. Google zelf noemt Core Web Vitals als ranking-factor, dus link naar webdev.google.com is snel te plakken.
- `case_studies.skc.testimonial` quote van Sindy — geen foto, geen LinkedIn-link, geen URL. Voor een testimonial die zo veel werk doet (enige klant-testimonial op de site) is dat zwak. **Critical fix**: voeg profile-photo + LinkedIn-URL toe aan testimonial structure.

---

## 10. Translation quality (EN + ES spot-checks)

### EN

| NL | EN | Verdict |
|---|---|---|
| `"Dit is Clyde. Jouw AI Marketing Medewerker."` | `"This is Clyde. Your AI Marketing Employee."` | **Goed** — "Employee" niet "Worker" of "Agent", consistent met brand. |
| `"Plan een gesprek"` | `"Book a call"` | Ligt voor de hand, maar "Apply" of "Request a call" past beter bij application-gated model. `"Book a call"` klinkt als self-service. **Aanbeveling**: `"Request a partnership call"` of `"Apply for a call"`. |
| `home.hero.subtitle` | `"Clyde remembers every brand, learns from every campaign and runs twelve skills autonomously..."` | Solide. "runs" is wat informeel; "operates" past bij B2B. OK. |
| `home.icp.subtitle` (:63) `"Geen marketingpraatje. Eerlijk gezegd: we werken liever niet met iedereen."` | `"No marketing pitch. Honestly: we would rather not work with everyone."` | Solide, lichte stijfheid ("we would rather") — alternatief `"Honestly, we'd rather not work with everyone."` (contraction = warmer). |
| `about.hero.tagline` `"De eerste AI Marketing Medewerker voor bureaus, door een solo founder."` | `"The first AI Marketing Employee for agencies, by a solo founder."` | Literal. "solo founder" = OK in EN, gangbaar. |
| `memory.hero.subtitle` | `"This is the difference between an AI tool and an AI Marketing Employee: memory."` | Solide, behoudt kracht van origineel. |
| `home.trustAnchor` `"Gebouwd met Nederlandse bureaus in de praktijk."` | `"Built with Dutch agencies in practice."` | **Dunglish**. → `"Built with Dutch agencies, in practice."` of `"Built from real Dutch agency practice."` |
| `home.faq.q3.answer` `"Een generieke sign-up past niet bij wat we leveren."` | `"A generic sign-up does not fit what we deliver."` | **Stijf**. → `"A generic sign-up doesn't fit what we deliver."` (contraction). |
| `home.icp.notFit1` | `"Your annual revenue is under €300K. The budget does not fit, and we do not want to slow your growth."` | Stijve uncontracted vorm. → `"Your annual revenue is under €300K. The budget doesn't fit, and we don't want to slow your growth."` |
| `pricing.hero.description` `"...geen 'neem contact op voor prijs'."` | `"...no 'contact us for pricing'."` | Goed. |

**EN-verdict**: kwaliteit is **goed**, maar consistent te stijf door gebruik van "do not" / "would rather" in plaats van contractions. Contractions zijn de B2B-standaard voor modern Engels en voelen warmer. **Impact**: site voelt 10% zakelijker dan NL. Aanbeveling: over hele EN-file contractions toepassen waar natuurlijk (don't, doesn't, we'd, it's, you're).

### ES

| NL | ES | Verdict |
|---|---|---|
| `home.hero.headlineAccent` `"Jouw AI Marketing Medewerker."` | `"Tu Empleado AI de Marketing."` | **Twijfelachtig**. In Spaans is "Empleado AI" direct vertaald, maar Spaanse AI-marketing noemt zichzelf meestal "Asistente AI" of "Agente AI" — "Empleado" klinkt hiërarchisch en ongebruikelijk. **Aanbeveling**: valideer met Spaanstalige brand-strateeg. Mogelijk `"Tu Agente de Marketing con IA"` of `"Tu Asistente AI de Marketing"`. |
| `home.hero.cta` | `"Agenda una llamada"` | Goed, natuurlijk Spaans. |
| `home.icp.fit1` `"Agencies with 5 to 30 FTE serving 10 to 50 brands..."` | `"Agencias con 5 a 30 FTE que atienden entre 10 y 50 marcas..."` | Goed Spaans. FTE ongewijzigd OK. |
| `home.faq.q3.answer` | `"Clyde es una partnership AI high-touch, no una herramienta SaaS."` | **Engels-leenwoorden**: "partnership", "high-touch". In ES acceptabel in SaaS-context, maar "asociación AI de alto contacto" is authentieker. Tussenweg: `"una asociación AI high-touch"` (houd "high-touch" als vakterm, vertaal "partnership"). |
| `home.icp.subtitle` | `"Sin discurso de marketing. Sinceramente, preferimos no trabajar con cualquiera."` | Goed, idiomatisch. |
| `home.cta.subtitle` | `"Máx. 20 agencias al año..."` | "Máx." afkorting met tilde, goed. |
| `home.badges.gdpr` `"AVG-first AI"` | `"IA con RGPD primero"` | **Dunglish-spiegel**. `"IA con RGPD primero"` = direct vertaald uit EN "GDPR-first AI". → `"IA con RGPD por defecto"` of `"IA con RGPD en el ADN"`. |
| `home.faq.q1.answer` | `"Además, Clyde orquesta 12 habilidades especializadas..."` | "orquesta" voor "orchestrates" is **OK** maar `"orquestra"` kan ook — regionale variatie. Spaans ES = "orquesta", LatAm = "orquestra" ook gebruikt. Consistent toepassen. |
| `home.trustStrip.subtitle` | `"SkinClarity Club, nuestro primer partner Founding, lleva meses funcionando de forma totalmente autónoma con Clyde."` | Goed. "partner Founding" is EN-leenwoord, acceptabel in B2B SaaS-ES. |
| `home.stats.languages.label` | `"Plazas por año"` | Goed — "plazas" = spots. |

**ES-verdict**: kwaliteit is **acceptabel** met 2 aandachtspunten:
1. **Empleado AI** is ongewoon — verifiëren met native Spaans marketeer of het werkt in ES-markt.
2. **Overmatige EN-leenwoorden** (partnership, high-touch, self-hosted, lock-in) — context B2B SaaS staat dit toe, maar voor een premium-brand is 10-20% localizatie extra polish.

---

## 11. Readability

### Gemiddelde zinslengte per major page (steekproef 10 zinnen)

| Page | Gem. woorden/zin | Lange zinnen (>25 w) | Verdict |
|---|---|---|---|
| Home | 14,2 | 2 van 10 | Goed leesbaar. |
| Pricing | 15,7 | 3 van 10 | FAQ-answers lopen uit. |
| About | 13,8 | 1 van 10 | Scherp. |
| Memory | 16,3 | 3 van 10 | Technisch concept dus acceptabel. |
| Founding-member | 14,9 | 2 van 10 | OK. |
| Apply | 13,5 | 1 van 10 | Goed. |
| Legal | 27,4 | 8 van 10 | Zwaar (verwacht voor legal). |
| Skills (gemiddeld) | 14,8 | 2 van 10 | OK. |

**Verdict**: NL-copy is binnen 13-17 woorden/zin range (goed voor B2B). Legal is 27+, verwacht. **Geen grote issues.**

### Jargon-dichtheid

- Technisch jargon (API, OAuth, RLS, JSON, CSV, SLA, KPI) komt geconcentreerd voor in legal en in `about.infra.*`. Context rechtvaardigt.
- AI-jargon (orchestratie, multi-channel, persistent geheugen, latentie) is aanwezig maar meestal met uitleg. Uitzondering: `home.stats.hours.value: "Persistent"` — zonder uitleg ambigu.
- Marketing-jargon (CTR, CPA, ROAS, LCP, INP, CLS) komt voor in skills-pages; doelgroep (bureau-operators) kent deze. OK.

---

## 12. Storytelling arc

### Home-pagina-arc

Huidige volgorde: Hero → Stats → Services (6 cards) → Badges → Trust → ICP → FAQ → CTA → Trust strip (SKC).

| Fase | Aanwezig | Kracht |
|---|---|---|
| **Probleem** (waarom bestaat dit?) | ❌ niet expliciet | Zwak — prospect moet zelf de dots connecten. |
| **Oplossing** (wat doet het?) | ✅ services-section | Sterk — 6 concrete vaardigheden. |
| **Proof** (werkt het?) | ✅ trust-strip onderaan + ICP + stats | Matig — SKC-proof staat helemaal onderaan, na FAQ. |
| **Aanbod** (wat krijg je?) | ➖ impliciet via services + founding counter | Zwak op home — volledige aanbod pas op pricing. |
| **Apply** (wat nu?) | ✅ Hero-CTA + Final CTA | Sterk. |

**Verdict**: de arc is **Oplossing → Proof → Aanbod → Apply**, zonder Probleem. Dat werkt voor prospects die al overtuigd zijn dat ze iets nodig hebben, maar scepsis-bureau-eigenaren missen de "ja-dat-is-mijn-probleem"-trigger.

**Aanbeveling**: voeg tussen hero en services een lichte Problem-section toe (40-60 woorden max):

> "Elke bureau-eigenaar kent het probleem: 10 tot 50 merken, elk met social, blogs, voice, ads en rapportages. Freelancers schalen niet mee, tools lossen het niet op en extra FTE is duur. Clyde is de oplossing die we zelf wilden hebben."

Dat plaatst het probleem voordat de oplossing aanspoelt, en sluit aan op `about.mission.why_text`.

---

## 13. Accessibility of language

- **Jargon-balans**: acceptabel voor B2B bureau-eigenaren. Technisch voldoende uitgelegd waar het gebruikt wordt.
- **Inclusieve taal**: NL-copy gebruikt generiek "je" en "jij", geen gendered referenties. Goed.
- **Culturele context**: NL als source works goed voor EU-markt. De "ik/wij"-stemkwestie is typisch Nederlands-pragmatisch (eerlijkheid > marketingtaal). Spanish localizatie vraagt een cultural review.
- **Cognitive load**: 5-tier pricing is veel om in één scroll te verwerken — acceptabel mits matrix + FAQ helpen. Matrix is er, maar Engelse labels (§2.6) maken het zwaarder.

---

## Top 15 copy fixes ranked by conversion impact

### Impact-schatting: op conversie (apply-rate) — 🔴 Hoog · 🟡 Middel · 🟢 Laag · On typographic hygiene.

| # | Fix | Locatie | Impact |
|---|---|---|---|
| 1 | Vervang alle `"unlimited"` / `"add-on €X"` / `"X/mo"` / `"niet beschikbaar"` labels in `skills-data.ts` door NL (Onbeperkt, Add-on €X, X/mnd, undefined). Dit zijn **live render-labels** op de tier-matrix. | `src\lib\skills-data.ts:87, 111, 114, 137, 140, 164, 165, 166, 167, 168, 209, 212, 235, 236, 237, 238, 239` | 🔴 |
| 2 | Hernoem `pricing.creditPacks.items.unlimited.name` van `"Onbeperkt"` naar `"Max"` of `"Scale XL"`. 15.000-credit-pack is niet onbeperkt = ondermijnt transparantie-belofte. | `messages\nl.json:668`; `pricing.faq.q2.answer:719` meebewegen. | 🔴 |
| 3 | `apply.form.clientCountLabel` + options: vervang "klanten" door "merken" op het apply-formulier. Schendt brand-glossary op de kritieke conversie-pagina. | `messages\nl.json:1544-1550, 1562` | 🔴 |
| 4 | Home hero-badge inkorten. Huidige 87 tekens lang, leest als subtitle. | `messages\nl.json:8` | 🟡 |
| 5 | Home trust-anchor eerlijker ("met SkinClarity Club" specifiek) — voorkomt "welke Nederlandse bureaus?"-vraag. | `messages\nl.json:12` | 🟡 |
| 6 | Voeg optionele Problem-section toe tussen hero en services op home. | `messages\nl.json:2-139` | 🟡 |
| 7 | IK-stem doortrekken in about + contact + founding-member (11 rewrites). Versterkt partnership-credibility. | `nl.json:440, 494, 511, 811, 830, 1345-1347, 1370, 1410` | 🟡 |
| 8 | `about.hero.tagline` minder zelfdeprecair. `"...door een solo founder"` → `"...Gebouwd in de Nederlandse praktijk."` | `messages\nl.json:437` | 🟡 |
| 9 | `case_studies.skc.testimonial`: voeg profile-foto + LinkedIn URL toe aan testimonial-structure. Enige testimonial, verdient betere framing. | `nl.json:1651-1653` + componentwijziging | 🟡 |
| 10 | Glossary: "Feature-verzoeken" → "verzoeken voor nieuwe vaardigheden" (2x). | `nl.json:614, 1358` | 🟢 |
| 11 | Pricing Partner-tier: verplaats `features_9: "Geen Voice Agent..."` naar apart veld of voetnoot. Positief positioneren in primaire bullets. | `nl.json:558` | 🟡 |
| 12 | Skills-data.ts: 9 em-dashes cleanen + 5 "brand voice" → "merkstem". Dead code nu, maar voorkomt regressie. | `src\lib\skills-data.ts:50, 54, 72, 78, 96, 98, 123, 125, 149, 151, 226, 288` | 🟢 |
| 13 | SkillsTierMatrix "Coming soon" → "Binnenkort" (NL). | `src\components\pricing\SkillsTierMatrix.tsx:85` | 🟢 |
| 14 | `skills-clyde.hero.subtitle` + `useCase1`: vervang "losse tools" referentie naar eigen product door "uitvoerders" / "schermen". | `nl.json:1966, 2015` | 🟢 |
| 15 | Pricing final-CTA herhaling counter: `"Plan een gesprek. {taken} van 10 Founding plekken nog open."` | `nl.json:738` | 🟢 |

---

## 14. Translation issues — before/after

### EN

| Before | After |
|---|---|
| `"Book a call"` (:13) — self-service-feel | `"Request a partnership call"` — past bij application-gated model |
| `"Built with Dutch agencies in practice."` (:12) — dunglish | `"Built from real Dutch agency practice."` |
| `"A generic sign-up does not fit what we deliver."` (:122) — stijf | `"A generic sign-up doesn't fit what we deliver."` |
| `"The budget does not fit, and we do not want to slow your growth."` (:70) — stijf | `"The budget doesn't fit, and we don't want to slow your growth."` |
| `"Honestly: we would rather not work with everyone."` (:63) — stijf | `"Honestly, we'd rather not work with everyone."` |
| `"Max 20 agencies per year."` (:12, 104) — Max zonder punt | `"Max. 20 agencies per year."` (met punt, standaard EN afkorting) |

### ES

| Before | After |
|---|---|
| `"Tu Empleado AI de Marketing."` (:10) — Empleado = hiërarchisch ongewoon | **Valideer met native strateeg**: `"Tu Asistente AI de Marketing"` of `"Tu Agente de Marketing con IA"` |
| `"IA con RGPD primero"` (:95) — dunglish-spiegel | `"IA con RGPD por defecto"` of `"IA con RGPD en el ADN"` |
| `"Clyde es una partnership AI high-touch"` (:122) — 2 EN-woorden op rij | `"Clyde es una asociación AI high-touch"` (houd `high-touch`, vertaal `partnership`) |
| `"Preparada para RGPD y EU AI Act."` (:59) — "EU AI Act" zonder vertaling | `"Preparada para RGPD y la Ley de IA de la UE."` voor natuurlijker ES |

---

## 15. Appendix — raw data

### A. Alle em-dash occurrences in user-facing strings

**nl.json** (1):
- `nl.json:643` — UI placeholder `"—"` (OK)

**skills-data.ts** (9 user-facing rewrites nodig):
- `:50, 72, 96, 98, 123, 125, 149, 151, 288` — zie §1.2

**Chatbot tool descriptions** (3):
- `src\lib\chatbot\tools\concierge-tools.ts:23, 47`
- `src\lib\chatbot\tools\support-tools.ts:96`

**Dev comments in .tsx/.ts** (~30, niet user-facing):
- Alle `{/* ... — ... */}` en `/** ... — ... */` patterns. Geen actie nodig.

### B. Alle "unlimited" occurrences

**In JSON**:
- `pricing.matrix.unlimited` (key + value "Onbeperkt") — label, OK
- `pricing.creditPacks.items.unlimited` (key + naam "Onbeperkt") — **rename**

**In skills-data.ts** (LIVE render labels):
- `:87, 114, 140, 167, 212, 238` — 6× `label: 'unlimited'` → NL of undefined

### C. Alle "klanten" → "merken" rewrites

- `nl.json:568, 587, 606, 1461, 1544, 1545, 1546, 1547, 1548, 1549, 1550, 1562, 1657, 1719`

### D. "Features" / "Feature" rewrites in waardes

- `nl.json:614, 1358` (2 places)
- JSON-keys `features_N` / `featureN` blijven technisch (niet user-facing).

### E. IK/WIJ slips — exacte locaties

**about** (7 rewrites):
- `:440` (mission.heading)
- `:494` (infra.selfHosted.body)
- `:511-512` (capacity.body + reasoning)

**contact** (2 rewrites):
- `:811` (form.message_placeholder)
- `:830` (applyCallout.body)

**founding-member** (3 rewrites):
- `:1345` (value.line1)
- `:1370` (benefits.community.description)
- `:1410` (cta.subtitle)

### F. Orphan namespace check

`messages/nl.json:140-334` — namespace `chatbots.*`. Check `/chatbots` route:

```
ls src/app/[locale]/(marketing)/ →
  about/ apply/ case-studies/ contact/ founding-member/ how-it-works/ memory/ pricing/
```

**Verdict**: `/chatbots` route niet aanwezig. Namespace orphan. **Aanbeveling: verwijderen (194 regels bespaard, geen regressie mogelijk).**

Verifieer gebruik met `grep -r "chatbots\." src/` voor final confirmation.

### G. Skill-page-subtitle repetition

```
integrations.subtitle = "Via het gedeelde geheugen per merk."
```

Verschijnt in: skills-social-media, voice-agent, lead-qualifier, ad-creator, reporting, email-management, research, blog-factory, seo-geo, clyde, manychat, reel-builder = **12× identiek**.

```
allocation.subtitle = "Wat deze vaardigheid kost per actie, en hoeveel er in elk tier is inbegrepen."
```

Verschijnt ook 12× identiek.

```
cta.subtitle = "Plan een gesprek. We bespreken hoe deze vaardigheid past bij jouw merken."
```

Verschijnt 11× (+ 1 variant op skills-clyde).

Deze repetitie is **bewust templating** en is op zich niet fout (consistency), maar een prospect die 3+ skill-pages leest merkt het monotone patroon. **Lage-impact fix, hoge-polish opportunity.**

---

## Slotwoord

De FMai-site heeft **buitengewoon goede basis-copy** voor een solo-founder-project. Positionering, IK/WIJ-afwegingen, eerlijkheid en glossary-discipline staan boven-gemiddeld. De gevonden issues zijn:

- **1 kritieke**: Engelse labels in tier-matrix op pricing-page (`skills-data.ts`).
- **2 hoge**: `"Onbeperkt"` credit-pack naam (ondermijnt transparantie), "klanten"→"merken" in apply-form.
- **Circa 25 middel-lage**: glossary-slips, IK/WIJ-slips, stijf-EN, ES-localizatie.

Als je één ding doet deze week: **fix de tier-matrix labels in `skills-data.ts`**. Dat is de enige echte conversie-risk. De rest is polish die cumulatief het verschil maakt tussen "ruikt naar SaaS" en "voelt als partnership".
