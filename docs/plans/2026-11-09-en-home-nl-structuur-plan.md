# Golf 10 /en: de Engelse homepage krijgt de /nl-structuur (2026-11-09)

Daley, 2026-11-08: "Golf 10: /en = /nl-structuur". Addendum 2026-11-09 13:30Z: "er moet een terminal aan de slag met de
engelse vertaling van de website". Vertaald is de /nl van main `c1b3cb9a` (#122), dus met Founding A1.4 (#117/#118),
zonder "cohort" (#119), doelgroep 5 tot 15 klantmerken (#120) en de bewaartermijn zonder oude tiers (#122).

Let op de naam: "golf 10" bestaat al als kennisbank-golf (`feature/golf10-kennisbank`, `A/golf10-diff/`). Deze golf
heet daarom in bestanden en mappen `en-home` / `g10-en`.

## 1. Inventaris (gemeten op origin/main `c1b3cb9a`)

**page.tsx** (`fmai-nextjs/src/app/[locale]/page.tsx`, 771 regels): elke sectie hing aan `locale === 'nl'` of
`locale !== 'nl'`. Sinds `/es` een 301 naar `/en` is (routing: `['en', 'nl']`) betekende `!== 'nl'` gewoon /en.

**Teksten die alleen in nl.json staan:** 12 groepen onder `home`, samen **513 teksten** (11-08 waren het er 530;
#117-#122 hebben de prijs- en vragenteksten ingekort):

| groep | teksten | | groep | teksten |
|---|---|---|---|---|
| hero3 | 64 | | waarom | 76 |
| week | 137 | | klanten | 36 |
| regie | 23 | | start | 37 |
| klant | 21 | | prijs | 29 |
| werk | 50 | | vragen | 23 |
| aanvraag | 12 | | afsluiting | 5 |

**Componenten:** de zes sectiecomponenten (`home/hero3`, `week`, `secties`, `werk`, `klanten`, `start`) halen ALLE
zichtbare tekst uit `t()`. Er staat geen Nederlandse tekst hard in de TSX en geen `locale`-logica. De enige
CSS-tekst is het decoratieve `"Ja · Nee"` op een kaart in een voorbeeldcarrousel (klantinhoud). Dus: /en vullen in
en.json en de takken uit page.tsx halen is de hele port. Nieuwe componenten zijn niet nodig.

**Beelden:** 39 bestanden in `public/home/` (hero3 8, week 14, werk 9, klanten 8). Twee soorten:
- app-opnames uit de demo (Nova Digital): `week/*.jpg` (8), `hero3/h3-kal.jpg`, `werk/g3-dm-regel-rust.png`;
- posts van de voorbeeldmerken en echte klanten, met Nederlandse tekst IN het beeld (bijv. "Een controle van tien
  minuten is te kort.", "Welke behandeling past bij jou?"). SalesLobe-posts zijn Engels.

**Links:** alle interne doelen bestaan op /en (gemeten op prod: /en/alternatives, /how-it-works,
/case-studies/skinclarity-club, /about, /assessment, /skills/* = 200), BEHALVE de vier kennisbank-artikelen:
`/en/kennisbank/clyde-vs-jasper-chatgpt-semrush` = 404. 14 van de 15 artikelen zijn alleen Nederlands.

## 2. Wat er op /en verdwijnt

Dezelfde ruil als op /nl in golf 2 tot en met 5. De oude /en-blokken en waar hun onderwerp nu staat:

| oud /en-blok | nieuw op /en |
|---|---|
| HeroSection + HeroBackdrop + kring-poster-preload | `#hero` (hero 3) |
| ReadInDutch onder de hero | vervalt: de pagina is nu volledig Engels, de vlagknop in de header (#109) wisselt taal |
| LeadMagnetCTA (AI-scan) | tweede regel in `#afsluiting` |
| CaseStudyCard (SKC) | `#klanten` |
| ServicesBento + PlatformStrip | `#werk` (lijst met zes vaardigheden + kanaalregel) |
| De kring (`#kring`, video) | `#een-week-met-clyde` |
| De mensen (`#people`) | `#regie` en `#klant` |
| Drie ingangen (`#entries`) | vraag 4 in `#vragen` (telefoon) |
| Van post naar lead (`#lead`) | `#aanvraag` |
| MemoryUSPTeaser + MemoryLiveComparison | `#waarom` (geheugenvenster van Luwte), zie §3 |
| ComparisonTable | tabel in `#waarom` |
| ProcessTimeline | `#start` |
| FounderSection | Daley in `#klanten` en `#afsluiting` |
| PricingTeaser + pillars + IcpSection | `#prijs` |
| KennisbankTeaser | links in `#waarom` en `#vragen` (naar /nl, zie §5) |
| FAQ (5 oude vragen) + FAQ-schema | `#vragen` (9 vragen) + FAQ-schema op die 9 |
| Final CTA | `#afsluiting` |

Daarmee verdwijnen ook de twee oude /en-regels "The SEO report on WhatsApp every Friday" (`home.services.reporting`)
en "messages you on WhatsApp the moment" (`home.hero.subtitle`) van de pagina. Ze staan nog als dode sleutel in
en.json, net als de oude sleutels in nl.json sinds golf 5: zie §7.

## 3. De geheugendemo

`MemoryLiveComparison` (in `MemoryUSPTeaser`) stond alleen op de /en-home; /nl verloor hem in golf 4 aan `#waarom`.
Voorstel: hij gaat ook van /en af, zodat /en = /nl. Het onderwerp blijft op de pagina (het geheugenvenster van Luwte
in `#waarom`, vraag 2 in `#vragen`) en de diepere uitleg blijft op `/memory`, in beide talen. De twee componenten
hebben daarna geen importer meer en gaan mee in de opruim-PR (§7). Wil Daley de demo bewaren, dan is `/memory` de
plek, voor nl en en tegelijk. Dat is een aparte, kleine golf.

## 4. De Engelse copy (zelf geschreven)

Bestand: `fmai-nextjs/messages/en.json`, `home.hero3` tot en met `home.afsluiting`, ingevoegd na `home.kring`, in de
volgorde van nl.json. 513 teksten, zelfde sleutels, zelfde tags (`<b>`, `<br>`, `<nw>`), gecontroleerd met een script.

Eén regel voor wat Engels wordt en wat Nederlands blijft:
- **Engels:** alles wat het bureau en de bezoeker lezen. Koppen, uitleg, de app-UI in de nagebouwde schermen, wat
  Clyde tegen het bureau zegt (ochtendbriefing, signalen, besluit uit de terugblik), het geheugen van Luwte, prijs,
  vragen. De UI-labels komen uit de echte Engelse app (`fma-app/src/lib/i18n/messages`): "For you", "Coming up",
  "Worth a look", "Let it go anyway", "Crisis pause", "Pause everything", "Stop moment", "Core memory",
  "Customer profile", "Brand voice", "Ways of working", "White-label for your clients", "Used your keyword",
  "Got your DM with the link", "Sent a request", "Put aside", "I receive the weekly report".
- **Nederlands:** de inhoud van de voorbeeldmerken. Posttitels, bijschriften, hashtags, de carrouseltekst, het
  trefwoord RUST, de blogtitel en de WhatsApp aan Noor (de klant). Reden: de postbeelden dragen zelf Nederlandse
  tekst; een Engels bijschrift naast een Nederlands beeld leest als een vertaalfout. De demoregel zegt het:
  "Example agency and example brands from the demo environment of the app. The brands are Dutch, so their posts are
  in Dutch." (hero) en "...so they write in Dutch." (`#werk`).
- **Alt-teksten:** Engels, met de Nederlandse titel letterlijk en de vertaling tussen haakjes.

Bestaande site-termen aangehouden: "Request a call", "founding spots", "A workspace is one client brand.",
"excl. VAT", de vier weken letterlijk uit `how-it-works.weeks` (en), "Example agency and example brands ...".

Prijs en aanbod getoetst tegen fma-app-memory `founding-a14-2026-11-09` en `founding-a14-site-live-2026-11-09` en
tegen `pricing-data.ts`: €1,297 excl. VAT, 5 klantmerken inbegrepen, €199 per extra tot 15, 1,500 credits per merk in
één pot, €0 onboarding, 12 betaalde maanden vast, maandelijks opzegbaar, drie founding-plekken. De verwachte reguliere
prijs (€2.400-2.500) en de 30% na maand 12 staan, net als op /nl, alleen op /pricing.

Gecontroleerd op de verboden lijst: geen em-dash, geen "cohort", geen DataForSEO, geen Gemini, geen "your domain",
geen voice of Reel Builder, geen WhatsApp-goedkeurknoppen, geen "weekrapport pas na jouw akkoord". "AI colleague"
staat alleen in de definitie van Clyde, net als "AI-collega" op /nl.

Meta (`home.meta`) blijft staan: titel 52, beschrijving 154 tekens, en dezelfde boodschap als de NL-meta.

## 5. Kennisbank-links

De vier links in `#waarom` en `#vragen` krijgen `locale="nl"` (`WaaromKlantenSections.tsx`,
`StartPrijsVragenSecties.tsx`). Op /nl verandert er niets, op /en gaan ze naar het Nederlandse artikel in plaats van
een 404, en de Engelse linktekst zegt "(in Dutch)".

## 6. De app-schermen: NL laten staan of een Engelse demo opnemen

Feiten (gemeten 2026-11-09):
- De UI-taal van een bureau komt alleen uit `fma_organizations.language` (`fma-app/src/lib/dal.ts:505`,
  `getRequestLanguage`). Er is geen cookie of gebruikersinstelling die hem overschrijft.
- Alle 27 demobureaus (Nova Digital, `demo-agency` en `demo-agency-k0001..k001a`) staan op `nl` (SELECT op prod).
- De inhoud van de demo (posts, strategie, geheugen, slides) is in beide talen Nederlands, dat is de "derde taal-as"
  uit `nl-en-leverbare-app-plan-2026-08-31`.

Opties:
- **A. NL-opnames laten staan (advies).** Kost niets en vraagt geen prod-wijziging. In de beelden is de inhoud
  Nederlands, wat klopt met de regel uit §4; alleen de menulabels in de JPG's zijn Nederlands.
- **B. Engelse opname.** Daarvoor moet `demo-agency` tijdelijk op `language = 'en'` (een prod-write op de demo-org,
  terugzetten na de opname) en dan de 10 app-schermen opnieuw met `R/tools/g9b-capture.mjs`. Het resultaat: Engelse
  menu's met nog steeds Nederlandse posts, strategie en geheugentekst. Zolang de vlag op `en` staat, ziet elke
  bezoeker van slot 0 Engels.

Los van A of B staat de verversing van de NL-schermen (`public/home/`, `public/proof/`) open sinds de demoreset van
2026-11-09 03:00Z (#1964: merknaam op het hoofdaccount, platformmarkering in de kalender). Die doe ik als aparte PR na
deze, met `g9b-capture.mjs` (viewer-sessie, alleen GET, signOut), zodat deze PR alleen over de taal gaat.

## 7. Niet in deze PR

- **Opruimen:** door deze PR hebben `HeroSection`, `HeroBackdrop`, `IcpSection`, `ServicesBento`, `MemoryUSPTeaser`,
  `MemoryLiveComparison`, `ComparisonTable`, `ProcessTimeline`, `FounderSection`, `PricingTeaser` en `PlatformStrip`
  geen importer meer (`CaseStudyCard`, `FaqAccordion`, `LeadMagnetCTA`, `KennisbankTeaser` en `ReadInDutch` wel, elders).
  Plus de oude `home.*`-sleutels in nl.json en en.json. Eén opruim-PR daarna, want hij raakt ook specs.
- **`lang="nl"` op de Nederlandse merkinhoud** binnen /en, zodat een schermlezer die met Nederlandse uitspraak leest.
  Dat vraagt een `lang`-attribuut op zo'n 40 plekken in de zes componenten. Kan in de opruim-PR.

## 8. Uitvoering en poorten

1. Prototype = de echte pagina op deze branch, lokaal gebouwd (`npx next build`, `next start` via detach.ps1).
   Shots /en naast /nl op 1440 en 390 in `R/g10-en/`, plus `R/g10-en/tools/m-g10en.mjs`: per viewport en sectie
   overflow, tekst uit zijn vak, Engelse tekst die wordt afgekapt waar de Nederlandse dat niet werd, tekst onder
   10.5px, kapotte beelden, axe en JS-fouten.
2. Daley kiest: akkoord op de copy, A of B, en de geheugendemo.
3. Daarna de specs: 12 e2e-bestanden openen /en (accessibility, chatbot, chatwidget-mocked, conversion-polish,
   demo-full-flow, home-hero3, homepage, i18n, navigation, performance, reveal, seo). Wat op de oude /en-secties
   toetst, volgt de site. Volledige suite `--workers=1` zonder lighthouse, tegen `next start`.
4. VERIFICATION, verschilpagina, vault-notitie, en Daleys ja voor push en merge.
5. Na de merge: prod-check van /en (16 doelen), PSI mobiel en desktop met `?cb=`.
