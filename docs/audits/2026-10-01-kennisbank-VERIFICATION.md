# Verificatie kennisbank SOTA, copyronde 1 (1 okt 2026)

HEAD `e7954a7`, build `fmai-nextjs/.next/` (BUILD_ID 1 okt 2026 22:47:30 UTC+7, sitemap.xml.body 22:47:34). Gemeten op de gebouwde HTML, `routes-manifest.json`, de mdx-bronnen en live HTTP-aanroepen naar de geciteerde bronnen. Geen dev-server, geen browser, geen nieuwe build.

Meetinstrumenten: Node-scripts die de prerendered HTML parsen (zichtbare tekst na het strippen van scripts, JSON-LD uit `<script type="application/ld+json">`, `og:locale`), `curl` en `firecrawl scrape`.

| claim | verdict | bewijs |
| --- | --- | --- |
| 1a. NL-datum Nederlands, geen "June" of "min read" (meetbare, medewerker) | BEWEZEN | Zichtbare tekst bevat "Gepubliceerd 2 juni 2026" op beide pagina's; "June" 0 treffers, "min read" 0 treffers; leestijd staat als "9 min lezen" en "12 min lezen". |
| 1b. "Laatst bijgewerkt 1 oktober 2026" bij updatedAt > publishedAt; weg bij gelijke datums | BEWEZEN | meetbare en medewerker: "Laatst bijgewerkt 1 oktober 2026" (`dateTime="2026-10-01"`), frontmatter publishedAt 2026-06-02, updatedAt 2026-10-01. `ai-efficientie-marketingbureau` (beide 2026-06-02): 0 treffers op "Laatst bijgewerkt", de RSC toont `null` op die plek. |
| 1c. Auteursblok met link naar /nl/about en LinkedIn | BEWEZEN | Zichtbaar: "Geschreven door Daley van Diest, Founder en operator, FutureMarketingAI, Meer over de auteur, LinkedIn". Hrefs: `/nl/about` en `https://www.linkedin.com/in/daley-van-diest` (beide pagina's). |
| 1d. Sectie "Gerelateerde artikelen" met kaarten voor relatedSlugs | BEWEZEN | meetbare: frontmatter-relatedSlugs (3) gelijk aan de 3 kaartlinks onder de kop (marketingbureau-schalen-met-ai, ai-efficientie-marketingbureau, ai-marketing-resultaat-in-de-praktijk). medewerker: 2 van 2 (ai-agent-vs-ai-tool-marketing, ai-marketing-agent-geheugen-en-leren). |
| 1e. BlogPosting.mainEntityOfPage.@id wijst naar WebPage-node op dezelfde pagina, dateModified = updatedAt | BEWEZEN, met afwijking | meetbare: `...#article` (BlogPosting) wijst naar `...meetbare-ai-marketing-resultaten#webpage`; die WebPage-node staat in dezelfde JSON-LD, dateModified 2026-10-01 = updatedAt. medewerker idem (`#webpage`, 2026-10-01), maar het type is `Article`, niet `BlogPosting`: frontmatter `schemaType: "Article"` (ook bij geo-generative-engine-optimization). |
| 1f. author is Person met @id `https://future-marketing.ai/about/#daley` | BEWEZEN, met afwijking | In alle gemeten artikelen (NL en EN): `{"@type":"Person","@id":"https://future-marketing.ai/about/#daley","name":"Daley van Diest",...}`. Dit is een INLINE auteur; er is op de pagina geen losse node met dat @id, dus de @id resolveert nergens op de pagina zelf. |
| 1g. publisher @id `https://future-marketing.ai/#org`, node staat op de pagina | BEWEZEN | publisher.@id = `https://future-marketing.ai/#org`; in dezelfde JSON-LD staat een node met dat @id (types Organization en ProfessionalService). Gemeten op meetbare, medewerker, efficientie en de EN-gids. |
| 1h. og:locale nl_NL | BEWEZEN | `<meta property="og:locale" content="nl_NL">` op meetbare, medewerker en efficientie; `<html lang="nl">`. |
| 1i. EN-gids: Engelse datum en og:locale en_US | BEWEZEN | `en/kennisbank/ai-marketing-automation-guide`: "Published March 18, 2026", `og:locale` = `en_US`, `<html lang="en">`; geen "Gepubliceerd". Geen "Last updated" (updatedAt = publishedAt, correct). "min read" komt hier wel voor, wat in het Engels klopt. |
| 2a. Geen gebouwde pagina voor de oude slug | BEWEZEN | `find .next/server -name "*wat-is-een-ai-marketing-medewerker*"` geeft niets; geen html onder `app/*/kennisbank` of `app/*/blog`; geen enkele prerendered html noemt de slug. |
| 2b. 301-redirects voor de oude slug, voor de algemene `/blog/:slug*`-regel | BEWEZEN | `routes-manifest.json` redirects: index 9 `/:locale/:section(kennisbank\|blog)/wat-is-een-ai-marketing-medewerker` en index 10 `/:section(kennisbank\|blog)/wat-is-een-ai-marketing-medewerker`, beide 301 naar `/nl/kennisbank/ai-marketing-medewerker`. De algemene regels staan op index 13 (`/:locale/blog/:slug*`) en 15 (`/blog/:slug*`). Geen tweestapsketen. Bron: `fmai-nextjs/next.config.ts:176` en `:181`. |
| 2c. grep op de oude slug in content, public, src, scripts geeft niets | BEWEZEN | `grep -rn wat-is-een-ai-marketing-medewerker content public src scripts` gaf 0 regels; alleen `next.config.ts` (regel 176, 181) heeft treffers. |
| 2d. Sitemap noemt de oude slug niet | BEWEZEN | `.next/server/app/sitemap.xml.body`: 0 treffers op de oude slug, 1 regel met `ai-marketing-medewerker`. |
| 3a. title ten hoogste 60 tekens (4 mdx) | BEWEZEN | meetbare 56, geo-generative-engine-optimization 57, geo-vs-seo-waar-investeren-2026 45, ai-marketing-medewerker 59. |
| 3b. description 120 tot 160 tekens | BEWEZEN | meetbare 157, geo-generative 151, geo-vs-seo 151, medewerker 157. |
| 3c. updatedAt is "2026-10-01" | BEWEZEN | Alle vier: `2026-10-01`. |
| 3d. Geen U+2014 of U+2013 in het bestand | BEWEZEN | Telling over het volledige bestand: 0 in alle vier. |
| 3e. Elke citatie-URL in de frontmatter geeft inhoud | BEWEZEN | 12 unieke URL's uit de frontmatter van de vier bestanden. `curl -sL -A Mozilla/5.0`: 10 x 200, 2 x 403. De 200's hebben een echte paginatitel en geen redirect naar een foutpagina (emerce, marketingtribune, Think with Google, 2 x arxiv, Google Search Central, Pew, SparkToro, HubSpot, future-marketing.ai/nl/memory). De 403's (cxl.com en gartner.com) via `firecrawl scrape`: cxl geeft het echte artikel (19 KB, "Where Google AI Overviews pull their answers from"), gartner het echte persbericht van 19 feb 2024 (7,8 KB, "Search Engine Volume Will Drop 25% by 2026"). Inhoud wel gelezen, niet naar de cijfers in de copy gecontroleerd. |
| 3f. mdx-links in de body wijzen naar bestaande gebouwde HTML | BEWEZEN | Alle `](/nl/kennisbank/<slug>)`-links (meetbare 3, geo-generative 4, geo-vs-seo 3, medewerker 4) staan in `.next/server/app/nl/kennisbank/*.html`; 0 gebroken. Alleen links met dat padpatroon getoetst. |
| 4a. Build slaagt met exit 0 | BEWEZEN | Buildlog: "Compiled successfully in 15.1s", daarna draait `postbuild` ("Processed: 106 Skipped: 0"). De achtergrondtaak die `npm run build` draaide, printte daarna `exit 0` (aangevuld door de hoofdsessie; het log zelf bevat de exit-code niet). |
| 4b. Lint-baseline 14 errors en 29 warnings | BEWEZEN | Buildlog: "43 problems (14 errors, 29 warnings)"; regeltelling 14 error- en 29 warning-regels. |
| 4c. De lintbestanden zijn door deze branch niet aangeraakt | BEWEZEN | De 20 bestanden met lintmeldingen (scripts/check-*, screenshot-chat-controls, site-audit, validate/*, not-found, ResultReveal, ChatInput, ChatWidget, ChatWidgetIsland, ServiceCard, MemoryLiveComparison, HeaderClient, ChatSimulation, WaveformVisualizer, usePersonaChat, 3 tests/e2e) hebben nul overlap met `git diff --name-only main...HEAD`. Let op: er is geen branch `master` lokaal; vergeleken met `main` (merge-base `45c2c3a86`). Dit is een bestandsvergelijking, geen lintrun op de basis. |

## Open en ongemeten

- Live prod is NIET gemeten: er is niets gepusht of gedeployed. Alles hierboven is gemeten op de lokale build van HEAD `e7954a7`. Of de 301's, de JSON-LD en de datums in productie hetzelfde zijn, en of Google ze oppikt, is niet gemeten.
- Afwijking bij 1e: `ai-marketing-medewerker` geeft `Article` uit, niet `BlogPosting` (frontmatter `schemaType: "Article"`). De mainEntityOfPage-bedrading klopt wel. Alleen een probleem als de claim letterlijk BlogPosting voor de pillar bedoelde.
- Afwijking bij 1f: de auteur-@id `https://future-marketing.ai/about/#daley` wordt als inline Person uitgegeven en verwijst naar geen losse node op de pagina. Dat is geldig JSON-LD, maar een @id-lookup op de pagina vindt alleen de inline kopie.
- 3e: de geciteerde cijfers in de copy zijn niet opnieuw tegen de brontekst gelegd, alleen dat de URL echte inhoud geeft. Bij 1d is alleen getoetst dat de kaarten de relatedSlugs volgen, niet hoe ze er visueel uitzien (geen browser).
- 4c: gemeten tegen `main` (de standaardbranch van deze repo), als bestandsvergelijking.

# Verificatie kennisbank SOTA, copyronde 2 (1 okt 2026)

HEAD `2aedfe0`, build `fmai-nextjs/.next/` (BUILD_ID 1 okt 2026 23:46:08 UTC+7). Ronde 2 herschreef de negen artikelen die na ronde 1 openstonden (`ea14ae3` tot en met `cf55fd3`), daarna volgden `a3f5f07` (glossary) en `2aedfe0` (llms-full.txt). Gemeten op de gebouwde HTML onder `.next/server/app/nl/kennisbank/`, de mdx-frontmatter, `sitemap.xml.body`, de repo-checks en live HTTP-aanroepen. Geen dev-server, geen browser.

Meetinstrument: een Python-script dat per artikel `<title>`, H1, meta description, de JSON-LD-blokken, de zichtbare tekst en de citatielinks uit de prerendered HTML haalt en ze naast de frontmatter legt, plus `curl -sL` op elke citatie-URL.

| claim | verdict | bewijs |
| --- | --- | --- |
| 5a. Build slaagt met exit 0 | BEWEZEN | Twee builds, op `cf55fd3` en op `2aedfe0`: beide "Compiled successfully", "Generating static pages (125/125)", postbuild "Processed: 106 Skipped: 0", achtergrondtaak `exit 0`. |
| 5b. Lint-baseline ongewijzigd | BEWEZEN | Beide buildlogs: "43 problems (14 errors, 29 warnings)". |
| 5c. `<title>` en H1 volgen de nieuwe frontmatter-title | BEWEZEN | Gemeten op zichtbaarheid-meten-ai-overviews ("AI Overviews SEO: zo meet je zichtbaarheid per AI-engine"), clyde-vs-jasper-chatgpt-semrush en ai-marketing-agent-geheugen-en-leren: `<title>`, H1 en frontmatter zijn gelijk. Geen merksuffix in `<title>` (zie open punt). |
| 5d. Meta description gelijk aan frontmatter, alle 13 NL-artikelen | BEWEZEN | 13 van 13 `meta desc == fm: True`. |
| 5e. Elke frontmatter-citatie staat als link op de pagina | BEWEZEN | 13 van 13 artikelen: aantal gerenderde `href` gelijk aan het aantal `url:`-regels (zichtbaarheid 6, geo-monitoring 7, agent-vs-tool 4, bureaus 2, clyde-vs-jasper 4, schalen 2, efficientie 3, praktijk 1, geheugen 3; ronde-1-artikelen 5, 5, 3, 3). |
| 5f. FAQPage-JSON-LD volgt de frontmatter-FAQ, ook de nieuwe vraag | BEWEZEN | 13 van 13: vragen in FAQPage gelijk aan de frontmatter, in dezelfde volgorde. ai-marketing-agent-geheugen-en-leren begint met "Heeft AI een geheugen?". |
| 5g. Geen U+2014 of U+2013 | BEWEZEN | 0 in de zichtbare tekst en 0 in de mdx, alle 13. |
| 5h. ComparisonTable met "Niet genoemd" | BEWEZEN | clyde-vs-jasper: 1 tabel, kop Clyde, Jasper, ChatGPT Business, Semrush, 5 cellen per rij, 8 keer "Niet genoemd" in de mdx. geo-monitoring-tools: 1 tabel met Profound, Peec AI, Otterly, SE Ranking als kolommen, 11 keer "Niet genoemd". |
| 5i. Interne links in de body wijzen naar gebouwde HTML | BEWEZEN | Alle `](/nl/...)`-links in de 13 mdx-bestanden hebben een `.html` onder `.next/server/app`, 0 ontbrekend. `/nl/skills/seo-geo` en `/nl/memory` bestaan als gebouwde pagina. |
| 5j. Elke citatie-URL van ronde 2 geeft inhoud | BEWEZEN | 31 citaties in de negen artikelen: 29 x 200 zonder redirect naar een foutpagina, 2 x 403 (gartner.com, openai.com). Die twee zijn in de schrijfsessie met Firecrawl geopend; de kopie staat in het brongeheugen van die sessie. |
| 5k. Steekproef: het geciteerde cijfer staat letterlijk in de bron | BEWEZEN | SparkToro "60-100X" (60 tot 100 runs), Ahrefs "0.5% ... 12.1%", arXiv 2311.09735 "up to 40%" en "up to 37%" (Perplexity), Tow Center "37 percent" en "94 percent", Emerce over DDMA 2025 "62 procent", "48 procent", "532", Pew live "18%", "8% of all visits", "15% of visits", "88%". |
| 5l. "martech.org/" en "basis.com/" weg als citatie | BEWEZEN | `grep -rlE` over `content/blog/`: 0 bestanden. |
| 5m. Glossary: geen eindklant van een bureau als "klant" | BEWEZEN na fix | De verificatie vond nog "marge per klant naarmate je portfolio groeit" (`ai-marketing-resultaat-in-de-praktijk.mdx:86`); `a3f5f07` maakt er "merk" van, de build toont "marge per merk" 2 keer en "marge per klant" 0 keer. "klanttevredenheid" en "klantwaarde" bleven, dat zijn vaktermen. |
| 5n. `llms-full.txt` beschrijft elk artikel met zijn nieuwe description | BEWEZEN | `2aedfe0`: 13 van 13 kennisbankregels gelijk aan de frontmatter-description (scriptvergelijking, ASCII-gevouwen zoals de rest van het bestand), 0 niet-ASCII-bytes. `npm run check:llms` geeft OK, maar dat script toetst alleen skills en constants, niet deze regels. |
| 5o. Sitemap toont de nieuwe datum | BEWEZEN | `sitemap.xml.body`: lastmod `2026-10-01` voor zichtbaarheid, geheugen en bureaus; `check:sitemap-lastmod` OK (29 paden), `check:indexability` OK (33 pagina's). |

## Open en ongemeten na ronde 2

- Live prod is nog steeds NIET gemeten: niets is gemerged of gedeployed. De 301 van de oude wat-is-URL, de live HTML en of Google de nieuwe titels oppikt, meet de sessie na Daleys merge.
- De cijfersteekproef (5k) dekt zes bronnen. De overige claims zijn in de schrijfsessie per citatie opgezocht, maar hier niet opnieuw tegen de brontekst gelegd. Concurrentieclaims (Jasper, ChatGPT Business, Semrush, de zes monitoringtools) verouderen het snelst.
- Prijsfeiten in de copy (tarief per werkruimte, 800 credits) komen uit `messages/nl.json`. Verandert de prijspagina, dan moeten deze artikelen mee.
- `check:llms` dekt de kennisbank niet. Een volgende copywijziging kan `llms-full.txt` weer laten achterlopen zonder dat een check rood wordt.
- De EN-gids `ai-marketing-automation-guide` (H-08, H-09) valt buiten deze branch.
- Open vraag aan Daley: een merksuffix in `<title>`. Onder de 60-tekensregel past het bij geen enkel artikel; advies is weglaten.
