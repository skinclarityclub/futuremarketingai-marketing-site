# Extern signaal — future-marketing.ai

**STATUS: bijna compleet.** Punt 1 (exacte backlink-telling) staat nog uit bij de `seo-backlinks`
subagent (loopt op de achtergrond). Punten 2 t/m 5 zijn gemeten, ook gekruist met eerder
gemeten projectgeheugen (DataForSEO SERP/Labs 2026-07-03, GSC-onderzoek 2026-08-11,
brand-entity-onderzoek). Punt 6 en 7 zijn opgesteld op basis van 2-5 en worden na binnenkomst van
punt 1 nog eenmaal bijgewerkt indien dat de conclusie materieel verandert.

Datum onderzoek: 2026-09-01.

---

## 1. Backlinkprofiel

**Nog niet binnen** — gedelegeerd aan de `seo-backlinks` subagent (Common Crawl, Moz/Bing
Webmaster indien keys aanwezig, gerichte zoekopdrachten). **Geen API-keys gevonden** voor
Moz/Ahrefs/Bing Webmaster/DataForSEO in `fma-app/.env.local` of `Futuremarketingai/fmai-nextjs/.env.local`
— alleen `GSC_OAUTH_*` (Google Search Console, geen backlink-tool) trof ik aan. Dit deel wordt
bijgewerkt zodra de agent terugkomt; de rest van dit rapport staat er los van overeind.

## 2. Domeingeschiedenis

**GEMETEN** (WHOIS via who.is, gescraped met firecrawl, 2026-09-01):

| Veld | Waarde |
|---|---|
| Domein | future-marketing.ai |
| Geregistreerd op | **2025-07-03** |
| Verloopt op | 2027-07-03 |
| Laatst gewijzigd | 2026-08-12 |
| Registrar | GoDaddy.com, LLC |
| Registrant | Domains By Proxy (privacy-proxy, geen bedrijfsnaam zichtbaar) |

Het domein is dus **~14 maanden oud** (as of 2026-09, who.is via firecrawl). Ter vergelijking:
zichtbare content op de site zelf dateert van rond april 2026 (bv. `future-marketing.ai/en` toont
"April 20, 2026" als publicatiedatum in de Brave-snippet, zie punt 5) en de GTM-documenten in
`docs/gtm/` dateren van 2026-03-20 — de site lijkt dus feitelijk pas ~5-6 maanden publiek live te
zijn, ondanks een domeinregistratie van 14 maanden geleden. Dat is een jong domein naar elke
maatstaf.

**Wayback Machine / eerste crawl — NIET sluitend vastgesteld.** Degraded laag, expliciet:
- Wayback CDX API (`web.archive.org/cdx/search/cdx`) — eigen WebFetch-tool weigert dit host
  expliciet ("Claude Code is unable to fetch from web.archive.org").
- RDAP (`rdap.org/domain/future-marketing.ai`) — HTTP 403 Forbidden.
- `archive.org/wayback/available` (via WebFetch, wél technisch bereikbaar) gaf lege
  `archived_snapshots` terug voor een test-timestamp — een aanwijzing, geen bewijs, dat er weinig
  of geen Wayback-snapshots zijn, want deze API retourneert alleen de dichtstbijzijnde snapshot
  bij één timestamp en niet "alle snapshots ooit".
- Directe `curl`/Perplexity-pogingen leverden geen concrete eerste-crawl-datum op.

**Conclusie punt 2**: domeinregistratie is hard gemeten (2025-07-03, ~14 maanden oud). Eerste
Wayback-crawl is met de beschikbare tools niet vast te stellen — vermoedelijk weinig tot geen
Wayback-geschiedenis (consistent met een jong, klein domein), maar dat is een **schatting**, geen
meting.

**Bevestiging uit projectgeheugen** (DataForSEO Labs, gemeten 2026-07-03, bron:
`fmai-website-brand-entity-seo` memory): **0 ranked keywords** voor future-marketing.ai — een
onafhankelijke, eerdere meting die "kaal jong domein" bevestigt zonder dat dit rapport DataForSEO
zelf hoefde aan te roepen.

## 3. Merkvermeldingen

**GEMETEN** (Perplexity search, 3 losse queries, ~35 resultaten totaal, as of 2026-09):

- **LinkedIn-bedrijfspagina bestaat**: `linkedin.com/company/futuremarketingai` — "Privately
  Held · Founded 2025 · 1-10 employees · **3 followers**", Amsterdam NL. Bio + linkt naar
  future-marketing.ai.
- **Persoonlijk LinkedIn-profiel Daley van Diest bestaat en heeft bereik**:
  `linkedin.com/in/daley-van-diest` — **317 followers, 314 connecties**, actieve bio die Clyde en
  FutureMarketingAI noemt, huidige rol "Founder & Lead Engineer, FutureMarketingAI, January 2025 -
  Present".
- **Geen enkele andere echte externe vermelding gevonden** in drie brede zoekopdrachten
  ("future-marketing.ai" OR "FutureMarketingAI"; merk + Crunchbase/Product Hunt/G2/Capterra/
  Clutch/Sortlist; "Clyde AI marketing medewerker" OR "Daley van Diest"). Alle overige treffers
  waren ruis: generieke "toekomst van AI-marketing"-artikelen (McKinsey, Forbes, HubSpot, Braze),
  naamgelijkenis met ongerelateerde bedrijven ("Future Marketing LLC" VS, "futuremarketing.co"
  adbureau), vacatureteksten die toevallig "AI marketing medewerker" bevatten, of generieke
  directory-listicles die FMai niet specifiek noemen.

**Conclusie punt 3**: buiten twee LinkedIn-profielen (bedrijf: 3 volgers, oprichter: 317 volgers)
heeft het merk **geen vindbaar extern digitaal voetspoor** — geen pers, geen directories, geen
forums, geen nieuwsbrieven, geen Reddit-vermeldingen.

**Twee belangrijke correcties/aanvullingen uit projectgeheugen** (memories
`fmai-website-brand-entity-seo` en `fmai-website-seo-recovery-2026-08`, gemeten 2026-07/08, dus
ouder dan dit rapport maar niet vervangen door iets nieuwers):

1. **Naamgenoot-collisie is een aparte, gemeten oorzaak naast het ontbrekende signaal.**
   DataForSEO SERP (google.nl, 2026-07-03): op de generieke term "futuremarketingai"/"future
   marketing ai" staat het domein **nergens in de top 100** — Google leest de zoekterm als
   generiek en vult de pagina met SAS/Harvard/Gartner. Een naamgenoot, `futuremarketing.agency`
   (een Antwerps bureau), bezet de merksignalen (Knowledge Panel/reviews) voor "future marketing".
   Op de specifiekere term **"FutureMarketingAI Clyde" rankt het domein wél organisch #1.** Dit
   betekent: het is niet dat Google het merk niet kent, het is dat het merk op generieke
   zoektermen verliest van ruis en een naamgenoot — dat is een ander mechanisme dan "geen extern
   signaal", al versterkt zwak extern signaal het probleem wel (een sterker extern voetspoor zou
   de entiteit scherper onderscheiden).
2. **Social-profielen bestaan waarschijnlijk wél, maar zijn niet aan de site gekoppeld.** Uit
   `account_keys` in de eigen database blijken Instagram (`fmai-ig-main`), TikTok (`fmai-tiktok`)
   en Threads (`fmai-threads`) te bestaan naast de twee LinkedIn-keys — maar hun profiel-URL's
   staan **nergens in de code of database** (`sameAs` in de Organization-schema bevat alleen
   LinkedIn). Dit is dus geen "profiel aanmaken"-actie maar een **URL's-aanleveren-en-koppelen**-
   actie, veel goedkoper dan een nieuw profiel. X/Twitter is wél degelijk dood geverifieerd (beide
   handles 404) en correct al uit de footer verwijderd (PR #37) — dat kanaal hoort niet in de
   actielijst.

## 4. Profielen die er horen te zijn

**Randvoorwaarde (bevestigd)**: FutureMarketingAI is **niet ingeschreven bij de KvK**
(Perplexity-zoekopdracht op kvk.nl/Handelsregister vond geen record; niet 100% sluitend te
bewijzen zonder betaald KvK-uittreksel, maar consistent met projectgeheugen). **KvK-inschrijving
kost eenmalig €85,15, duurt doorgaans 1-3 weken tot een afspraak, en je krijgt het KvK-nummer
direct bij de afspraak** (bron: kvk.nl tarieven 2026 + inschrijfproces, as of 2026-09). Dit is dus
geen langdurige blocker — wel een harde voorwaarde voor een deel van onderstaande profielen.

**GEVERIFIEERD live** (directe URL-check via firecrawl, 2026-09-01): Crunchbase
(`crunchbase.com/organization/futuremarketingai` → redirect naar 404), Product Hunt
(`producthunt.com/products/futuremarketingai` → 404), G2 (`g2.com/products/futuremarketingai` →
404) — **geen van deze bestaat.**

| Profiel | Bestaat al? | KvK vereist? | Moeite | Verwachte waarde |
|---|---|---|---|---|
| LinkedIn-bedrijfspagina | **JA** (3 volgers) | Nee (al aangemaakt zonder) | — (groeien, niet aanmaken) | Al aanwezig; groeipotentieel via posts/outreach uit `docs/gtm/` (0 van 80 taken afgevinkt, zie hieronder) |
| LinkedIn persoonlijk (Daley) | **JA** (317 volgers) | Nee | — | Grootste bestaande asset — actief houden, niet negeren |
| KvK-inschrijving (Handelsregister) | **NEE** | N.v.t. — dit ís de actie | Laag: €85,15, 1 afspraak, 1-3 weken | Hoog — randvoorwaarde voor Google Bedrijfsprofiel-vertrouwen, facturatie, en meerdere onderstaande profielen |
| Google Bedrijfsprofiel (Maps) | **NEE** (geen match gevonden, live gecheckt) | Niet strikt technisch vereist, wel sterk aan te raden ná KvK voor geloofwaardigheid/verificatie | Laag: 15-30 min | Laag-matig voor een remote B2B SaaS zonder bezoekadres — GBP is primair ontworpen voor lokale/fysieke bedrijven; toch gratis entity-signaal |
| Crunchbase | **NEE** (404, live geverifieerd) | Nee | Laag: 20 min, self-service profiel | Matig — expliciet genoemd in de eigen interne schema-audit (`docs/audits/2026-04-24-full-audit/05-geo-llm-citation.md`) als #1 ontbrekend `sameAs`-signaal, "3.2x AI Mode citation lift" volgens dat onderzoek |
| Product Hunt | **NEE** (404, live geverifieerd) | Nee | Matig: vereist een echte "launch" (tagline, gallery, maker comment), geen simpel formulier | Matig-hoog als eenmalige traffic-spike + backlink, maar moment moet bewust gekozen worden (niet nu al verbruiken) |
| G2 | **NEE** (404, live geverifieerd) | Nee voor gratis listing | Matig: profiel is gratis, waarde zit in reviews verzamelen (SkinClarity Club als eerste referentie) | Hoog voor AI-citaties — externe bron (SE Ranking, via Perplexity) zegt G2+Capterra+Gartner+Software Advice+TrustRadius samen 88% van alle review-platform AI-citaties |
| Capterra | **NEE** (aan te nemen, zelfde eigenaar/proces als G2 sinds fusie feb. 2026) | Nee | Matig, zelfde als G2 | Hoog, zie G2 |
| AlternativeTo | NEE (niet apart geverifieerd, aannemelijk gezien geen enkele vermelding elders) | Nee | Laag: gratis, kort formulier | Matig — sterk voor "alternatief voor X"-zoekopdrachten, alleen zinvol als categorie/concurrenten duidelijk zijn |
| There's An AI For That / Futurepedia / FutureTools | NEE | Nee | Laag elk: 15-20 min per stuk | Matig per stuk, cumulatief — genoemd als hoge-AI-citatie-coverage bronnen (mediafa.st-onderzoek, as of 2024-01, oud maar structureel type bron) |
| Instagram/TikTok/Threads koppelen aan `sameAs` | Profielen bestaan **vermoedelijk al** (account_keys `fmai-ig-main`/`fmai-tiktok`/`fmai-threads`), URL's staan alleen nergens in code/DB | Nee | Zeer laag: URL's opvragen bij Daley + 15 min code | Matig — kost bijna niets, dicht een concreet gemeten gat (`sameAs` bevat nu alleen LinkedIn) |
| Wikidata-entry | **NEE** (bevestigd gat in interne audit, `04-seo-technical.md:244`) — **én al bewust gedegradeerd** op 2026-08-11 (zie `fmai-website-seo-recovery-2026-08`: onderzoek met citaties vond géén overtuigend causaal bewijs dat een Wikidata-item een jong domein sneller laat indexeren/ranken, en Wikidata eist notabiliteit met onafhankelijke bronnen) | Nee | Matig-hoog: vereist notability-onderbouwing; kan worden afgewezen/verwijderd voor een klein bedrijf zonder persdekking | Laag op dit moment — al eerder afgeschaald van "actie" naar "later, als er pers is"; dit rapport bevestigt die eerdere beslissing, verhoogt de prioriteit niet |
| Techleap Startup Finder (NL) | Niet geverifieerd, vermoedelijk nee | Waarschijnlijk in de praktijk wel (mature NL-entiteit verwacht) | Matig: curated, geen garantie op opname | Laag-matig — vooral ecosystem-zichtbaarheid, geen directe SEO/GEO-waarde |
| DDMA-lidmaatschap | NEE | Niet per se, wel betaald lidmaatschap o.b.v. omzet | Hoog (kosten + geen gratis listing) | Laag als los "profiel" — waarde zit in netwerk/kennis, niet in extern signaal. **Niet aanraden voor dit doel.** |
| Emerce100 | NEE | N.v.t. | N.v.t. — geen self-submission mogelijk, redactionele ranking | Geen — kun je niet zelf aanmaken, dus geen actiepunt |
| Sortlist / Clutch.co (bureau-marktplaatsen) | NEE eigen profiel; FMai verschijnt wel indirect in een generieke Sortlist NL "AI marketing bureaus"-lijst zonder eigen kaart | Vermoedelijk nee voor basisprofiel | Laag-matig: gratis profiel, waarde stijgt met reviews | Laag-matig — deze platforms zijn primair bedoeld om bureaus te VINDEN voor klanten, niet als GEO/AI-citatiebron; wel een reëel klantkanaal |
| EU AI-bedrijvenregister | **Bestaat niet als vrije, gezaghebbende, self-service optie** (geverifieerd: geen EU-institutionele "AI-bedrijvengids" gevonden waar je zelf een gratis vermelding aanmaakt) | — | — | Geen — expliciet **niet aanraden**, zou neerkomen op private spam-directories |

**Eerlijk over wat waardeloos is**: DDMA (betaald, geen listing-waarde voor dit doel), Emerce100
(niet self-service), StartupDelta (legacy merk, bestaat niet meer los van Techleap), en generieke
"EU AI-directories" (geen gezaghebbend gratis register gevonden) horen NIET in een prioriteitenlijst.

## 5. Indexatie elders

**GEMETEN** (site-zoekopdrachten via firecrawl, 2026-09-01):

- **DuckDuckGo (lite.duckduckgo.com, Bing-backed)**: **wél geïndexeerd**, rijk. `site:future-marketing.ai`
  gaf 10 relevante resultaten: homepage (NL+EN), /about, /pricing, /contact, /kennisbank,
  /kennisbank/[gids], /memory, /assessment, en `app.future-marketing.ai/login`. Meerdere resultaten
  hebben zichtbare publicatiedata (2026-03-18, 2026-04-24).
- **Brave Search**: **wél geïndexeerd**, meerdere pagina's incl. skills-subpagina's
  (`/skills/social-media`, `/skills/email-management`, `/skills/blog-factory`) en de kennisbank-gids.
- **Bing (rechtstreeks, `bing.com/search`)**: **niet betrouwbaar te testen** — twee pogingen met
  een `site:`-query kregen zichtbaar generieke/irrelevante resultaten terug (trein-status-sites,
  Expedia) in plaats van een index-antwoord. Dit patroon (query genegeerd, decoy-content) wijst op
  bot-detectie bij een niet-interactieve fetch, niet op non-indexatie. Omdat DuckDuckGo's index
  Bing-technologie gebruikt en daar wél rijke, actuele resultaten uit kwamen, is de **praktische
  conclusie dat Bing het domein ook indexeert** — maar dit is afgeleid, niet rechtstreeks
  bevestigd bij Bing zelf. Degraded laag, expliciet gemarkeerd.
- **Google**: niet apart hertest — de opdracht zelf stelt al vast dat het domein 246
  zoekimpressies in 3 maanden krijgt, wat per definitie betekent dat Google het domein indexeert
  en toont (impressies zijn onmogelijk zonder indexatie). Dit is dus al gemeten, alleen op zeer
  laag volume.

**Conclusie punt 5**: **indexatie op domeinniveau is geen probleem.** Google, Bing (afgeleid) en
DuckDuckGo tonen het domein; Brave zelfs met meerdere subpagina's. Dit sluit een technische
crawlability-verklaring voor de lage zichtbaarheid uit — de content wordt gevonden.

**Nuance uit projectgeheugen (GSC per-URL, gemeten 2026-08-11, `fmai-website-seo-recovery-2026-08`)**:
op paginaniveau was de dekking historisch wél onvolledig — 's ochtends 43 van 102 URL's
geïndexeerd (42 "onbekend bij Google", 17 gecrawld-niet-geïndexeerd); na een sitemap-herindiening
diezelfde avond 30 van 73 URL's (ES uit de sitemap gehaald) — **~41%**. Oorzaak destijds: Google
had de sitemap 52 dagen niet gelezen omdat de site zelf 40 dagen niet werd gedeployd. Daley deed
op 2026-08-11 handmatig "Verzoek om indexering" voor 8 kernpagina's. Dit rapport heeft die
per-URL-dekking niet opnieuw gemeten (GSC vereist authenticatie, niet gedaan in dit onderzoek) —
het is dus mogelijk dat de dekking sindsdien is verbeterd, maar dat is een **aanname**, geen
meting. Combinatie van beide bevindingen: het domein wordt gevonden, maar een deel van de losse
pagina's was drie weken geleden nog niet volledig geïndexeerd bij Google specifiek.

## 6. Conclusie

**Extern signaal is de hoofdoorzaak, maar het is zelf een symptoom van iets groters: de
go-to-market is nooit uitgevoerd. Daarnaast speelt een aparte, gemeten bijoorzaak mee: een
naamgenoot bezet de generieke merktermen.**

Onderbouwing met de cijfers uit dit rapport én uit eerder gemeten projectgeheugen:

1. **Domein is jong** (~14 maanden geregistreerd, 0 ranked keywords op 2026-07-03 per DataForSEO
   Labs, site vermoedelijk pas ~5-6 maanden echt live met content) — een deel van de trage groei
   is simpelweg leeftijd, niet een defect.
2. **Extern voetspoor buiten twee LinkedIn-profielen is nagenoeg nul** — geen Crunchbase, geen
   Product Hunt, geen G2/Capterra, geen KvK, geen Google Bedrijfsprofiel, geen pers, geen
   directory-vermeldingen (alle vier live geverifieerd op 2026-09-01). Dit weegt zwaar: **eerder
   onderzoek (as of 2026-08, Perplexity met citaties, vastgelegd in `fmai-website-seo-recovery-2026-08`)
   vond dat merkvermeldingen op het bredere web 0,664 correleren met AI-Overview-zichtbaarheid,
   tegen slechts 0,218 voor ruwe backlink-aantallen.** Dat betekent dat punt 3 (vrijwel nul
   merkvermeldingen) zwaarder weegt dan punt 1 (het exacte aantal verwijzende domeinen) — de
   soort signaal dat hier ontbreekt, is precies het type met de sterkste gemeten samenhang.
3. **Correctie op een aanname uit de interne april-audit**: die audit citeerde een externe claim
   dat sameAs-uitbreiding een "3.2x AI Mode citation lift" geeft. Een latere, gerichte matched-study
   (1.885 pagina's met nieuwe JSON-LD tegen ~4.000 controlepagina's, zie dezelfde
   augustus-2026-memory) vond in de praktijk **+2,4% (Google AI Mode) en +2,2% (ChatGPT), beide
   niet van nul te onderscheiden.** Schema/sameAs-uitbreiding blijft de moeite waard (goedkoop,
   geen risico), maar moet niet als bewezen hoge hefboom worden ingeschat — dat verlaagt de
   urgentie van sommige technische SEO-taken relatief ten opzichte van punt 4 hieronder.
4. **Indexatie op domeinniveau is GEEN probleem** (punt 5) — Google, Bing en DuckDuckGo vinden en
   tonen de site; per-URL-dekking bij Google was drie weken geleden nog onvolledig (~41%) maar dat
   is een aparte, kleinere kwestie dan "extern signaal".
5. **Aparte, gemeten bijoorzaak: naamgenoot-collisie.** Op de generieke term "future marketing ai"
   staat het domein nergens in de Google-top-100 (2026-07-03) — een Antwerps bureau
   (`futuremarketing.agency`) bezet de merksignalen. Op de specifieke term "FutureMarketingAI
   Clyde" rankt FMai wél organisch #1. Dit is geen extern-signaal-probleem maar een
   entiteitsonderscheid-probleem — en juist méér, sterkere externe vermeldingen (punt 3) zijn ook
   hier de remedie, want ze zijn wat een zoekmachine gebruikt om twee gelijknamige entiteiten uit
   elkaar te houden.
6. **De go-to-market die dit alles zou moeten oplossen, is nooit uitgevoerd**: `docs/gtm/` bevat 9
   documenten met in totaal **80 checklist-items, waarvan 0 zijn afgevinkt** (43 in
   `launch-checklist.md`, 25 in `outreach-templates.md`, 12 in `call-script.md`). De eerste sectie
   van die checklist — "Update LinkedIn headline", "Update LinkedIn about-sectie", "Bouw NL/UK
   target lijst" — is exact het werk dat de 3-volgers-bedrijfspagina en het ontbrekende externe
   signaal zou verhelpen. `target-agencies.csv` bevat uitsluitend rijen die letterlijk gelabeld
   zijn als **"Fictional example"** — er is dus nooit een echte prospectlijst opgebouwd, laat
   staan uitgevoerd.

**Scherp antwoord**: het gebrek aan extern signaal ís de grootste losse verklaring voor 246
impressies/3 maanden, en dat is nu dubbel onderbouwd — zowel doordat het meetbaar bijna nul is
(punt 3-4) als doordat precies dít type signaal (merkvermeldingen) de sterkste gemeten correlatie
heeft met AI/zoek-zichtbaarheid van de twee die zijn onderzocht. Maar de **rem erachter** is niet
technisch en niet toevallig: het is een go-to-market-plan dat volledig op papier bleef staan. Een
losstaande, kleinere factor (naamgenoot-collisie op generieke termen) versterkt het probleem op
specifiek de kortste zoektermen, maar wordt met dezelfde remedie aangepakt. Extern signaal
oplossen zonder de GTM uit te voeren, is symptoombestrijding — de acties in punt 7 zijn dan ook
grotendeels dezelfde acties die al in `docs/gtm/launch-checklist.md` stonden, nu geprioriteerd op
basis van wat gemeten is.

## 7. Actieplan

Geprioriteerd, legitiem, geen linkbuilding-trucs, geen betaalde linkschema's, geen directory-spam.
KvK-markering (**K**) = vereist of sterk aan te raden vóór deze actie.

| # | Actie | KvK nodig? | Moeite | Doorlooptijd | Verwachte opbrengst |
|---|---|---|---|---|---|
| 1 | **KvK-inschrijving als eenmanszaak** (€85,15, 1 afspraak) | — (dit ís de actie) | Laag | 1-3 weken tot afspraak, nummer direct erna | Ontgrendelt Google Bedrijfsprofiel-vertrouwen, facturatie, en meerdere onderstaande profielen. Hoogste hefboom omdat het alles erna versnelt. |
| 2 | **`docs/gtm/launch-checklist.md` sectie "LinkedIn Profiel" alsnog uitvoeren** (headline, about, featured, banner) op zowel bedrijfspagina als Daley's profiel (317 volgers — grootste bestaande asset, nu onderbenut) | Nee | Laag: 1-2 uur, copy staat al klaar in `linkedin-profile-copy.md` | Direct | Hoog — activeert het enige kanaal met al enig bereik |
| 3 | **Instagram/TikTok/Threads-URL's opvragen en koppelen** aan `sameAs` + footer — profielen bestaan vermoedelijk al (`account_keys`), alleen de URL's ontbreken in code/DB | Nee | Zeer laag: URL's opvragen + 15 min code | Direct | Matig — bijna gratis, dicht een concreet gemeten gat |
| 4 | **Organization `sameAs` in code uitbreiden** met Crunchbase + KvK zodra beschikbaar (bestaand P0-actiepunt uit `04-seo-technical.md`, nu met externe profielen gevuld). **Impact-correctie**: een matched study (1.885 vs ~4.000 pagina's, zie punt 6) mat voor schema-uitbreiding +2,4%/+2,2%, niet van nul te onderscheiden — dit is dus goedkope hygiëne, geen bewezen hoge hefboom | Deels (KvK-link pas na stap 1) | Laag: 30 min code + profiel-aanmaak | Direct na stap 1 | Laag-matig — de moeite is klein genoeg om toch te doen, verwacht er geen doorbraak van |
| 5 | **Crunchbase self-service profiel aanmaken** | Nee | Laag: 20 min | Direct | Matig — entity-signal, gratis, laag risico |
| 6 | **`docs/gtm/launch-checklist.md` sectie "Demo Video" opnemen en publiceren** (script staat al klaar) | Nee | Matig: 1-2 uur opname + upload | Dagen | Matig — geeft LinkedIn-posts en outreach iets om naar te linken |
| 7 | **Eerste echte NL-prospectlijst bouwen** (30 bureaus, LinkedIn Sales Nav of handmatig) — vervangt de huidige fictieve CSV | Nee | Matig: paar uur | 1 week | Hoog indirect — zonder dit blijft outreach (en dus vermeldingen/backlinks via samenwerkingen) stilstaan |
| 8 | **5-touch outreach starten op batch 1 (10 bureaus)** uit `outreach-templates.md` | Nee | Matig: doorlopend, 30-60 min/dag | 2-4 weken voor eerste resultaten | Matig-hoog — elke geaccepteerde connectie/reactie is potentieel een vermelding of partnerschap |
| 9 | **Google Bedrijfsprofiel aanmaken** | Aan te raden na stap 1 | Laag: 15-30 min | Direct na verificatie | Laag-matig — geen fysieke locatie, maar gratis entity-signaal en Maps-vindbaarheid op merknaam |
| 10 | **G2 gratis profiel aanmaken + eerste review vragen aan SkinClarity Club** (founding partner, al referentieklant) | Nee | Matig: profiel 20 min, review vragen is een relatiegesprek | 2-4 weken voor eerste review | Hoog — G2+Capterra domineren AI-citaties op reviewplatforms (88% aandeel volgens SE Ranking-bron) |
| 11 | **Product Hunt-launch voorbereiden en bewust plannen** (niet nu al "verbruiken" zonder voorbereiding) | Nee | Matig-hoog: tagline, gallery, maker-comment, launch-dag-planning | 2-3 weken voorbereiding | Matig-hoog — eenmalige traffic-spike + permanente backlink, maar alleen als het goed voorbereid is |
| 12 | **AlternativeTo + 2-3 gerichte AI-tool-directories** (There's An AI For That, Futurepedia) | Nee | Laag: 15-20 min per stuk | Direct | Matig, cumulatief — kleine losse signalen die samen tellen |
| 13 | **Eerste LinkedIn-contentkalender publiceren** (`linkedin-content-calendar.md`, 2 weken klaarstaand, nog nooit gebruikt) | Nee | Laag-matig: 3-5x/week posten | Doorlopend | Matig-hoog — enige manier om organisch bereik op het bestaande LinkedIn-kanaal te laten groeien i.p.v. stil te laten staan |
| 14 | **Wikidata-entry** — bewust NIET nu, pas na stap 10 (Product Hunt) of een eerste persvermelding als notability-bewijs | Nee | Matig-hoog | Na stap 10 | Potentieel hoog, maar risico op afwijzing/verwijdering als het nu al geprobeerd wordt |
| 15 | **Vermijd**: DDMA-lidmaatschap (betaald, geen listing-waarde voor dit doel), Emerce100 (niet self-service), generieke "EU AI-directories" (geen gezaghebbende gratis optie gevonden), Sortlist/Clutch als primair GEO-kanaal (waarde zit in klant-leads, niet in AI-citaties) | — | — | — | Tijd hier niet aan besteden |
