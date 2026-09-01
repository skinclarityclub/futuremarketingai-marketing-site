# Technische SEO-audit — future-marketing.ai

**STATUS: compleet.** Datum meting: 2026-09-01. Alle live-claims hieronder zijn met echte HTTP-calls (curl) of Lighthouse tegen `https://future-marketing.ai` geverifieerd, niet uit code afgeleid.

---

## 1. Indexeerbaarheid (live geverifieerd)

- `robots.txt` → HTTP 200. Wildcard `*` + 15 losse AI-crawler user-agents, allemaal `Allow: /` `Allow: /llms.txt` `Allow: /llms-full.txt`, `Disallow: /api/`. `Sitemap:` en `Host:` regel aanwezig.
- `sitemap.xml` → HTTP 200. **73 `<loc>` entries.** 30 EN + 43 NL (43 = 29 statische paden + 14 kennisbank-artikelen NL; EN heeft maar 1 vertaald artikel).
- **Geen ES-URL's in de sitemap.** Bevestigd: `grep -c "<loc>"` op de live sitemap = 73, geen enkele `/es/...`. Dit klopt met `INDEXABLE_LOCALES = ['nl','en']` in `src/i18n/routing.ts:30`. Het tegenstrijdige-signaal-risico dat de opdracht noemde (ES in sitemap terwijl noindex) **is NIET aanwezig** in de sitemap zelf — wel elders, zie bevinding P0-1 hieronder.
- `/es` en `/es/apply` → HTTP 200, `<meta name="robots" content="noindex, follow">` aanwezig en correct, canonical zelf-verwijzend (`https://future-marketing.ai/es`). ES rendert dus gewoon (voor bezoekers/bestaande links) maar is correct op noindex gezet.
- `/llms.txt` en `/llms-full.txt` → beide HTTP 200.
- `/_next/static/...` → HTTP 200, niet geblokkeerd. PR #38-claim ("deblokkeren") **live bevestigd**.

## 2. P0/P1-bevindingen (bewijs + oorzaak + fix)

### P0-1 — Hreflang via HTTP `Link`-header spreekt de correcte on-page hreflang tegen (ES lekt terug, x-default wijkt af)

**Bewijs (live curl, headers van `/nl`, `/en`, `/nl/pricing`, `/es`):**
```
Link: <https://future-marketing.ai/en>; rel="alternate"; hreflang="en",
      <https://future-marketing.ai/nl>; rel="alternate"; hreflang="nl",
      <https://future-marketing.ai/es>; rel="alternate"; hreflang="es",
      <https://future-marketing.ai/>;  rel="alternate"; hreflang="x-default"
```
Dit herhaalt zich op elke geteste locale/pad (bv. `/nl/pricing` geeft `.../es/pricing` met `hreflang="es"` en x-default naar `https://future-marketing.ai/pricing` zonder locale-prefix).

Ter vergelijking: de `<head>` van diezelfde pagina bevat de CORRECTE set (`nl`, `en`, `x-default→/nl`, geen `es`) — dat deel is dus goed gebouwd door `generatePageMetadata()` (`src/lib/metadata.ts:39-43`, gebruikt `INDEXABLE_LOCALES`).

**Oorzaak:** `src/middleware.ts:4` — `createMiddleware(routing)` van `next-intl`. Deze middleware genereert ZELF, automatisch, een `Link`-response-header met hreflang-alternates (feature `alternateLinks`, default `true`, zie `node_modules/next-intl/dist/types/routing/config.d.ts:34`). Hij bouwt die lijst uit `routing.locales` (`['en','nl','es']` — alle drie) in plaats van uit `INDEXABLE_LOCALES`. Dit is code die niemand in dit team schreef; het zit ingebakken in de library en werd nooit uitgeschakeld. Bron bevestigd in `node_modules/next-intl/dist/esm/production/middleware/getAlternateLinksHeaderValue.js`.

**Risico:** Google ondersteunt hreflang via HTTP-headers als een geldig signaal naast on-page tags en sitemap. Twee tegenstrijdige hreflang-signalen op dezelfde URL (on-page zegt "geen ES, x-default=/nl"; header zegt "wel ES, x-default=bare-domain") is precies het soort inconsistentie waarbij Google de hele hreflang-set voor een site gaat wantrouwen — het risico dat het team elders in de codebase (seo-config.ts comments) expliciet probeerde te vermijden.

**Fix:** `alternateLinks: false` toevoegen aan `defineRouting()` in `src/i18n/routing.ts`. De on-page implementatie (metadata.ts + sitemap.ts) dekt hreflang al correct en bewust; de header is puur redundant en op dit moment fout.

### P1-1 — Kapotte interne link `/privacy` (404) — 2x op de homepage

**Bewijs:** `curl -s -o /dev/null -w "%{http_code}" https://future-marketing.ai/nl/privacy` → **404**. Live gevonden als `href="/nl/privacy"` op twéé plekken in de gerenderde homepage-HTML (CTA "Hoe wij data behandelen" in de Compliance-tegel, en in de TrustSignals-sectie).

**Oorzaak:**
- `src/app/[locale]/page.tsx:392` — `<Link href="/privacy">`
- `src/components/marketing/TrustSignalsGrid.tsx:42` — `href: '/privacy'`

Beide gebruiken de locale-aware `Link` uit `@/i18n/navigation`, dus `/privacy` wordt `/nl/privacy` — een pad dat niet bestaat. De juiste route is `/legal/privacy` (zie `src/components/layout/Footer.tsx:217`, die het wél goed doet: `href="/legal/privacy"`).

**Fix:** beide `href`/`href:` waarden naar `/legal/privacy` — 2-regel diff, geen andere impact.

### P1-2 — Voice Agent en Reel Builder worden in `<title>`/meta description/JSON-LD als bestaand verkocht, terwijl de site zelf zegt dat ze "in ontwikkeling en testing" zijn

**Bewijs:**
- `/nl/roadmap` meta description (live, eigen bron van waarheid): *"De twee vaardigheden die momenteel in ontwikkeling en testing zijn: Voice Agent en Reel Builder."*
- `/nl/skills/voice-agent` — `<title>`: "Voice Agent. Inkomende en uitgaande AI-gesprekken \| Clyde". `<meta description>`: "Clyde **voert** AI-telefoongesprekken, **boekt** afspraken, **legt** elk gesprek vast en **escaleert** naar een mens..." — puur tegenwoordige tijd, geen "binnenkort"-kwalificatie. Op de zichtbare pagina staat het label **"Binnenkort"** wél (14x in de HTML, incl. in JSON-labels) — de disclaimer bereikt dus wél de menselijke bezoeker, maar NIET de SERP-snippet of een LLM/GEO-crawler die alleen title+description+JSON-LD leest.
- `home.meta.description` (`messages/nl.json:15` / `messages/en.json:15`, homepage van beide talen): "...Schrijft content, **belt leads** en onthoudt elk merk..." / "...writes content, **calls leads** and remembers every brand..." — Voice Agent-capability naast twee wél-live features, zonder onderscheid.
- JSON-LD `Organization.hasOfferCatalog` (staat op ELKE pagina met Organization-schema, dus site-breed): Voice Agent en Reel Builder staan als gewone `Offer`/`Service`-items tussen de 10 daadwerkelijk live skills in — geen `availability`-marker (bv. schema.org `PreOrder`) die het verschil aangeeft.
- Zelfde patroon bevestigd op `/nl/skills/reel-builder`: title/description in tegenwoordige tijd, geen coming-soon-taal.

**Risico:** dit is primair een content/productclaim-kwestie (buiten de codebase op te lossen), maar het heeft een technisch SEO/GEO-staartje: de SERP-snippet en structured data zijn de eerste (en voor AI-crawlers vaak de ENIGE) laag die gelezen wordt, en die laag maakt nu een claim die de site zelf een klik verderop tegenspreekt — een risico voor vertrouwen bij zowel Google's kwaliteitssystemen als AI Overviews/ChatGPT-citaties.

**Fix (buiten scope van deze technische audit, maar wel gelokaliseerd):** `home.meta.description`, de `skills-voice-agent`/`skills-reel-builder` meta-teksten in `messages/{nl,en}.json`, en de bijbehorende JSON-LD Service-omschrijvingen consistent maken met de "Binnenkort"-status — óf de features weglaten uit `hasOfferCatalog` tot ze live zijn.

### P2-1 — Redirect-omweg voor `www`-variant

`https://www.future-marketing.ai/` → 308 naar `https://future-marketing.ai/` → vervolgens 307 naar `/nl`. Twee hops i.p.v. één. Laag risico (weinig links wijzen naar de www-variant), maar makkelijk te verkorten door de eerste redirect direct naar `/nl` te laten wijzen.

### P2-2 — Keyword-cannibalisatie tussen twee kennisbank-artikelen

`/nl/kennisbank/ai-marketing-medewerker` ("AI Marketing Medewerker: de productcategorie en Clyde") en `/nl/kennisbank/wat-is-een-ai-marketing-medewerker` ("Wat is een AI Marketing Medewerker? Clyde uitgelegd") targeten vrijwel dezelfde zoekintentie ("wat is een AI marketing medewerker"). Twee losse URL's die om dezelfde head-term concurreren i.p.v. autoriteit te bundelen in één stuk — een contentkeuze, geen technisch defect, maar wel meetbaar uit titel+slug-overlap.

## 3. Metadata per pagina (steekproef, live gehaald)

| URL | Status | Title (lengte) | Meta description (lengte) | Canonical | Robots-meta | H1 | Content in server-HTML zonder JS? |
|---|---|---|---|---|---|---|---|
| `/` | 200 (307→/nl) | — | — | — | — | — | — |
| `/nl` | 200 | "FutureMarketingAI: Clyde, je AI-marketingmedewerker" (52) | "FutureMarketingAI bouwt Clyde: de AI-marketingmedewerker voor bureaus. Schrijft content, belt leads en onthoudt elk merk. Max 10 partners per jaar." (150) | `https://future-marketing.ai/nl` ✓ | geen (= index,follow, correct) | 1x, "Dit is Clyde." | **Ja** — H1 en volledige hero-tekst zit in de eerste curl zonder JS |
| `/en` | 200 | "FutureMarketingAI: Clyde, your AI Marketing Employee" | "...He writes content, calls leads and remembers every brand..." | `.../en` ✓ | geen | 1x, "This is Clyde." | Ja |
| `/nl/pricing` | 200 | "Prijzen: Founding €997 per werkruimte \| FutureMarketingAI" | "Founding €997 levenslang voor de eerste 10 bureaus..." (114) | ✓ | geen | 1x | Ja |
| `/nl/about` | 200 | "Over FutureMarketingAI: het team achter Clyde AI" (48) | 154 tekens | ✓ | geen | 1x | Ja |
| `/nl/apply` | 200 | "Aanmelden. Plan een gesprek met Daley \| FutureMarketingAI" (57) | 125 tekens | ✓ | geen | 1x | Ja |
| `/nl/memory` | 200 | "Geheugen. Clyde onthoudt elk merk \| FutureMarketingAI" (53) | 142 tekens | ✓ | geen | 1x | Ja |
| `/nl/how-it-works` | 200 | "Hoe het werkt: onboarding in 5 stappen \| FutureMarketingAI" (58) | 127 tekens | ✓ | geen | 1x | Ja |
| `/nl/case-studies/skinclarity-club` | 200 | "SkinClarity Club: 3 accounts, 4 merken \| FutureMarketingAI" (58) | 124 tekens | ✓ | geen | 1x | Ja |
| `/nl/kennisbank` | 200 | "Kennisbank: GEO en AI marketing voor bureaus" (44) | 147 tekens | ✓ | geen | 1x | Ja |
| `/nl/kennisbank/geo-vs-seo-waar-investeren-2026` | 200 | "GEO vs SEO: waar moet je in 2026 in investeren?" (47) | 153 tekens | ✓ | geen | 1x | Ja |
| `/nl/kennisbank/ai-marketing-medewerker` | 200 | "AI Marketing Medewerker: de productcategorie en Clyde" (53) | 151 tekens | ✓ | geen | 1x | Ja |
| `/nl/kennisbank/wat-is-een-ai-marketing-medewerker` | 200 | "Wat is een AI Marketing Medewerker? Clyde uitgelegd" (51) | 149 tekens | ✓ | geen | 1x | Ja |
| `/nl/skills/clyde` | 200 | "Clyde: de centrale AI Marketing Medewerker \| Clyde" (50) | 148 tekens | ✓ | geen | 1x | Ja |
| `/nl/skills/social-media` | 200 | "Social Media Manager: captions en carrousels \| Clyde" (52) | 140 tekens | ✓ | geen | 1x | Ja |
| `/nl/skills/blog-factory` | 200 | "Blog Factory. SEO-artikelen zoekwoord tot publicatie \| Clyde" (60) | 127 tekens | ✓ | geen | 1x | Ja |
| `/nl/skills/ad-manager` | 200 | "Ad Manager. Ads maken én sturen op leads en CPL \| Clyde" (55) | 156 tekens | ✓ | geen | 1x | Ja |
| `/nl/skills/voice-agent` | 200 | "Voice Agent. Inkomende en uitgaande AI-gesprekken \| Clyde" (57) | 152 tekens | ✓ | geen | 1x | Ja — zie P1-2, geen "Binnenkort" in title/description |
| `/nl/contact` | 200 | "Contact Future Marketing AI \| AI Marketing Bureau" | — | ✓ | geen | 1x, "Algemene vragen of feedback?" | Ja |

**Bevinding uit deze steekproef:** alle 20 geteste titles vallen binnen 44-60 tekens (Google's afkapgrens), alle descriptions binnen 114-156 tekens — geen enkele te lang of te kort. Elke pagina precies 1 H1. Geen enkele pagina leunt op client-side rendering voor kernin­houd: `curl` zonder JS toont H1 + hoofdtekst overal identiek aan wat een browser toont. Dit deel van de site is technisch schoon.

OG/Twitter-tags: aanwezig en correct gevuld op alle geteste pagina's (og:title/description/url/site_name/locale/image/type + twitter:card/title/description/image). `og:image` = `https://future-marketing.ai/og-image.png` (gedeeld, statisch) op elke pagina — geen per-pagina OG-image, maar functioneel geen fout.

Query-parameter test: `/nl/assessment?from=home` → canonical wijst correct naar `https://future-marketing.ai/nl/assessment` (zonder param). Geen parameter-crawlvallen gevonden op dit punt.

## 4. Structured data (JSON-LD, live geëxtraheerd en geparsed)

| Pagina | Types gevonden |
|---|---|
| `/nl` | Organization+ProfessionalService, WebSite, WebPage, BreadcrumbList, FAQPage |
| `/nl/pricing` | + ItemList (4x Offer met price/priceCurrency/priceSpecification) |
| `/nl/case-studies/skinclarity-club` | + Organization (SKC), Person (Sindy), Service, **Review**, Article |
| `/nl/kennisbank` | + DefinedTermSet (glossary) |
| `/nl/kennisbank/[slug]` | BlogPosting, BreadcrumbList, FAQPage |
| `/nl/skills/clyde` | + Service, FAQPage |
| `/nl/about` | + Person (Daley) |
| `/nl/how-it-works` | + HowTo |

**Organization-entiteit (`#org`)**: `name`, `alternateName` (2x), `logo` (ImageObject 512x512), `email`, `description`, `foundingDate`, `founder` (@id → Daley Person), `address` (NL), `areaServed`, `knowsAbout` (10 termen), `knowsLanguage`, `hasOfferCatalog` (12 Services), `contactPoint`, **`sameAs`: alleen LinkedIn company page** (Twitter/YouTube/Instagram/Wikidata bewust null — gedocumenteerd in `seo-config.ts` als intentionele E-E-A-T-keuze, geen lege profielen). Geen KvK-nummer in `sameAs` (KVK_URL nog null in seo-config.ts — bekend open punt, zie MEMORY).

Geen expliciet `Product`-schema, maar `Offer`/`ItemList` op de pricing-pagina dekt de functionele rijke-resultaten-behoefte voor een B2B-dienst. Geen ontbrekend type dat voor dit bedrijfstype evident node zou zijn.

**Kwaliteitsprobleem, geen ontbrekend type:** `Organization.hasOfferCatalog` (site-breed, op elke pagina) bevat Voice Agent en Reel Builder als gewone `Offer`/`Service`-items, zonder enige marker dat ze niet-live zijn — zie P1-2.

## 5. Interne linkstructuur (live, uit gerenderde HTML)

- Homepage linkt direct (1 klik) naar: alle 12 skills-pagina's, about, apply, assessment, case-study, contact, founding-member, how-it-works, kennisbank-hub, legal (4x), memory, pricing, roadmap (via footer) = alle 29 statische paden.
- Homepage linkt direct naar **5 van de 14** NL-kennisbank-artikelen (featured-sectie).
- Kennisbank-hub-pagina linkt naar **alle 14** NL-artikelen → dus elk artikel is binnen **2 klikken** vanaf de homepage bereikbaar. Geen wees-artikelen gevonden op dit punt.
- 1 bevestigde kapotte link (zie P1-1 hierboven), 2x voorkomend op de homepage.

## 6. Performance / Core Web Vitals (Lighthouse, live URL, mobiel, simulate throttling)

**Homepage `/nl`, mobiel:**
- Performance score: **56/100**
- LCP: **5.2s** (streefwaarde <2.5s — ruim over de grens)
- FCP: 3.6s
- CLS: 0.026 (goed)
- TBT: 550ms (streefwaarde <200ms)
- TTI: 5.3s, Speed Index: 5.1s
- Total byte weight: 690 KB (relatief licht — géén netwerkprobleem)
- Main-thread work: **12.6s totaal** — Style & Layout 3.68s, Rendering 2.63s, "Other" 4.55s, Script Evaluation 1.58s. **Dit is een CPU/main-thread-probleem, niet een netwerk/downloadgewicht-probleem.**
- Zwaarste requests: Google Tag Manager (170 KB, third-party), eigen JS-chunks (4x 20-71 KB), 2 webfonts (36-40 KB).
- **Spline 3D-asset laadde NIET mee in deze mobiele meting** — 0 spline-requests gevonden. Oorzaak bevestigd in code: `src/hooks/useIsDesktop.ts` gate op `min-width:1024px` (`HeroSpline`/`ui/spline.tsx`), dus mobiel krijgt een statische afbeelding (`hero-robot-preview.webp`) i.p.v. de 3D-scene. Spline's kosten treffen dus geen mobiele bezoeker.

**Homepage `/nl`, desktop:**
- Performance score: **54/100**
- LCP: 4.6s, FCP: 3.4s, CLS: 0.024, TBT: 210ms, TTI: 5.1s, Speed Index: 3.4s
- **Ook hier 0 Spline/unpkg-requests** — Spline laadt NIET binnen het Lighthouse-metingvenster, zelfs niet op desktop-viewport. Root cause, bevestigd in `src/components/ui/spline.tsx:98-125`: de 3D-scene wordt bewust met `requestIdleCallback` (timeout 4s) of een 3s-`setTimeout`-fallback UITGESTELD tot ná first paint/interactiviteit — precies om te voorkomen dat de ~638KB Spline-runtime + ~1,3MB scene + 186KB Rapier-WASM (**~2,1MB in code-comments genoemd**) de LCP/TBT-meting raakt. Dat werkt: Lighthouse's trace eindigt vóór de idle-callback vuurt, dus **Spline kost, gemeten tegen Google's eigen CWV-methodiek, feitelijk 0 — de asset downloadt pas nadat de pagina al "klaar" is voor de meting.** Dit weerlegt de aanname in de opdracht dat Spline een CWV-kostenpost is: het is bewust engineered om dat NIET te zijn. De ~2MB downloadt wel degelijk een paar seconden later voor elke desktop-bezoeker (dataverbruik, niet CWV).

**Kennisbank-artikel `/nl/kennisbank/geo-vs-seo-waar-investeren-2026`, mobiel:**
- Performance score: **68/100**
- LCP: 5.1s, FCP: 3.2s, CLS: 0.028, TBT: 230ms, TTI: 5.1s, Speed Index: 4.6s
- Total byte weight: 652 KB, waarvan 468 KB Script — **vrijwel identiek aan de homepage (459 KB Script) ondanks 0 afbeeldingen op deze pagina.** Dit bevestigt dat de LCP-vertraging site-breed zit in de gedeelde JS-bundel (layout, navigatie, animatiebibliotheek `motion/react`), niet in per-pagina content of afbeeldingen. Een artikel zonder enige hero-graphics haalt dezelfde trage LCP als de homepage.

**Kernbevinding performance:** het probleem is CPU-tijd (main-thread work), niet netwerkgewicht. 690 KB total transfer is licht voor een moderne site; 12,6s main-thread-werk op de homepage (waarvan 4,55s "Other" en 3,68s Style & Layout — vermoedelijk de vele `motion/react`/ScrollReveal-animatiecomponenten) is zwaar. Spline is, ondanks de suggestie in de opdracht, AANTOONBAAR NIET de oorzaak — het is er niet eens bij gemeten.

## 7. Crawl-vallen (live getest)

- Trailing slash `/nl/pricing/` → **308 permanent redirect** naar zonder slash. Correct, geen dubbele-content-risico.
- Hoofdletters `/NL` → 307 naar `/nl` (edge case, laag risico, Google normaliseert dit zelf doorgaans).
- `www.future-marketing.ai` → 308 → bare domain → 307 → `/nl` (2-hop, zie P2 hierboven).
- `http://` → correct naar `https://`, HSTS-header aanwezig (`max-age=63072000; includeSubDomains; preload`).
- Willekeurige niet-bestaande URL → **echte 404**, geen soft-404 (200 met foutmelding).
- Geen dubbele content gevonden tussen `/`, `/nl`, `/en`: `/` is een 307-redirect (geen eigen renderbare content), dus geen indexeerbare duplicate.

## 8. Verdict

### Onderzoek: "ai marketing contact" — positie 7, 216 impressies, 0 klikken

**Welke pagina rankt hier waarschijnlijk:** `/nl/contact` en/of `/en/contact`. Live opgehaalde titles:
- NL: **"Contact Future Marketing AI \| AI Marketing Bureau"**
- EN: **"Contact Future Marketing AI \| AI Marketing Agency"**

Beide titles bevatten "Contact", "Future Marketing AI" en "AI Marketing [Bureau/Agency]" — een sterke lexicale match met de query "ai marketing contact". H1 op de pagina is "Algemene vragen of feedback?" (generiek, geen keyword-versterking, maar dat raakt CTR niet — Google toont de `<title>`, niet de H1, in de snippet). Meta description: "Neem contact op met Future Marketing AI over Clyde, je AI-marketingmedewerker. Vragen over partnerships of de skills? We reageren binnen 24 uur." Canonical, robots-meta en JSON-LD (Organization, WebPage, BreadcrumbList) zijn allemaal correct — **geen technisch defect gevonden op deze pagina.**

**Waarom waarschijnlijk 0 klikken ondanks 216 impressies:** dit is met de beschikbare data niet met zekerheid vast te stellen (geen GSC-API-toegang in deze sessie, geen click-through-informatie per snippet-variant), maar twee niet-technische verklaringen zijn sterker dan een technisch defect:
1. **Statistische CTR-realiteit op positie 7**: branchebenchmarks leggen CTR op positie 7 doorgaans rond 1-3%. Bij 216 impressies verspreid over 88 dagen (klein aantal per dag) is 0 klikken geen anomalie — het past binnen normale variantie, zeker als de impressies over meerdere losse dagen/queries verspreid zijn i.p.v. geconcentreerd.
2. **Intentie-mismatch**: "ai marketing contact" is een generieke, samengestelde zoekterm zonder duidelijke commerciële intentie-signalen (geen merknaam, geen "prijzen"/"aanmelden"). Een zoeker met deze term zoekt waarschijnlijk niet specifiek naar "neem contact op met FutureMarketingAI" maar naar bredere AI-marketing-diensten — de snippet belooft exact wat de zoeker vermoedelijk niet zoekt, wat scrollen-voorbij verklaart zonder dat er iets technisch stuk is.

**Conclusie voor dit punt:** geen technisch SEO-defect; een contentmatch-/CTR-verklaring, niet oplosbaar met een codefix.

### Voice Agent/Reel Builder "sold as existing" — reikwijdte

Bevestigd voorbij `home.meta.description` (zie P1-2 hierboven): ook `/nl/skills/voice-agent`, `/nl/skills/reel-builder` (title + meta description, beide talen) en de site-brede JSON-LD `Organization.hasOfferCatalog` presenteren beide skills zonder "Binnenkort"-kwalificatie, terwijl `/nl/roadmap`'s eigen meta description ze expliciet "in ontwikkeling en testing" noemt. De zichtbare paginatekst toont het "Binnenkort"-label wel — het gat zit specifiek in de machineleesbare laag (title/description/JSON-LD), niet in de menselijke leeservaring.

### Eindverdict

**Is de site technisch vindbaar? Ja, grotendeels.** robots.txt (200, correcte AI-crawler-allowlist, `/_next/` open), sitemap.xml (200, 73 URL's, geen ES-lek), on-page canonical/hreflang/robots-meta/OG/Twitter/JSON-LD zijn op alle 20 steekproefpagina's correct, elke pagina heeft precies 1 H1, content staat zonder JavaScript in de server-HTML, interne links bereiken alle 29 statische pagina's binnen 1 klik en alle 14 NL-kennisbank-artikelen binnen 2 klikken. Dit is geen site die Google niet kan crawlen of begrijpen.

**Zijn de PR #32-38-fixes werkzaam op productie? Grotendeels ja, live geverifieerd:**
- ES uit de sitemap: **bevestigd** (0 ES-URL's in de 73).
- `/_next/` deblokkeren: **bevestigd** (200 op `/_next/static/...`).
- NL als default locale: **bevestigd** (root `/` → 307 naar `/nl`, x-default in on-page hreflang → `/nl`).
- Canonical/hreflang on-page: **bevestigd correct** op alle geteste pagina's.
- Meta descriptions: **bevestigd aanwezig en binnen lengte** op alle 20 steekproefpagina's.
- **Maar**: de hreflang-fix is **niet volledig** — de HTTP `Link`-header (P0-1, next-intl's automatische `alternateLinks`-feature) spreekt de zorgvuldig gebouwde on-page hreflang tegen en lekt ES + een afwijkende x-default terug. Dit zat niet in scope van PR #32-38 (het is een library-default, geen eigen code) en is dus nooit gefixt.

**Verklaart iets van dit technische werk de 246 impressies / 1 klik / positie 16,8 over 88 dagen? Grotendeels nee — en de cijfers die de coordinator aandroeg bevestigen dat:**
- De deploy is 21 uur oud en actueel — een stale deploy is uitgesloten.
- GSC-impressies per maand (jun 100, jul 36, aug 110) laten **geen stijgende lijn** zien. PR #32-38 zijn pas eind augustus gemerged, dus deze reeks is nog geen eerlijke meting van hun effect — augustus's 110 (t.o.v. juli's 36) is als enige datapunt licht positief, maar te vroeg en te klein om een fix-effect aan toe te schrijven.
- **Commit-cadans naar nul is de sterkere verklaring.** Commits/maand: mrt 457 → apr 205 → mei 333 → jun 106 → **jul 0** → aug 7. Alle 15 kennisbank-artikelen zijn op één dag in juni gepubliceerd; sindsdien geen nieuwe content. Een site met 246 impressies over 88 dagen en een contentmotor die al twee maanden stilstaat, is een **contentprobleem**, niet een crawl/indexeer-probleem — de technische laag (robots/sitemap/canonical/hreflang-on-page/structured data/interne links) is aantoonbaar gezond genoeg om te ranken; er is simpelweg weinig vers, nieuw materiaal om op te ranken, en 88 dagen is voor een greenfield-domein met een zeer klein aantal unieke pagina's (73 indexeerbare URL's) sowieso een korte horizon voor autoriteitsopbouw.

**Wat IS technisch mis (met cijfers):**
- P0-1: hreflang-tegenstrijdigheid via HTTP-header (ES lekt terug in de header op alle geteste pagina's, x-default wijkt af van de on-page-versie) — risico op een gewantrouwd hreflang-signaal sitebreed, niet lokaal aan 1 pagina.
- P1-1: 2 kapotte interne links (`/nl/privacy`, HTTP 404) op de homepage, twee losse componenten met dezelfde bug.
- P1-2: Voice Agent/Reel Builder-claims in title/meta/JSON-LD die de eigen roadmap-pagina tegenspreken — vooral een GEO/E-E-A-T-vertrouwensrisico, niet een crawl-blokkade.
- P2: 2-hop www-redirect, keyword-cannibalisatie tussen 2 kennisbank-artikelen.
- Geen van deze verklaart een aantal van 246 impressies over 88 dagen — die schaal (2-3 impressies/dag gemiddeld) wijst op een autoriteits-/content-volume-probleem, niet op een crawl- of renderprobleem. Een site die crawl-technisch kapot is scoort typisch 0 impressies, niet 246 met een gemiddelde positie van 16,8 (pagina 2) — positie 16,8 betekent dat Google de pagina's wél begrijpt en relevant genoeg acht om te tonen, alleen niet hoog genoeg om geklikt te worden.

**Wat NIET technisch is (afgebakend van het bovenstaande):** het ontbreken van nieuwe kennisbank-content sinds juni, de keyword-cannibalisatie tussen twee near-duplicate artikelen, de generieke/niet-overtuigende contact-snippet die op positie 7 nul klikken oplevert, en de Voice Agent/Reel Builder-claim-mismatch (een productclaim-/copy-beslissing, geen codebug) zijn allemaal content- en strategie-vraagstukken. Deze technische audit kan ze aanwijzen en met bewijs onderbouwen, maar de fix ligt niet in `src/`.
