# Search Console: waarom 89 pagina's niet geindexeerd zijn (2026-10-02)

Bron: Search Console, property `sc-domain:future-marketing.ai`, rapport Pagina-indexering (data t/m 21-09-2026), uitgelezen op 1 okt 2026 rond 19:30 UTC via het account `info@future-marketing.ai`. Aangevuld met URL-inspectie op dezelfde avond en met `curl` tegen productie (geen browser, geen dev-server). Ruwe crawl: `sitemap-crawl.json` in de scratchpad van de sessie, niet in de repo.

## Stand

| | Aantal |
|---|---|
| Geindexeerd | 30 |
| Niet geindexeerd | 89, verdeeld over 7 redenen |
| URL's in de sitemap | 72 (42 NL, 30 EN), sitemap laatst gelezen 27 sep, status Succesvol |

De techniek is gezond. Alle 72 sitemap-URL's geven 200, hebben een canonical naar zichzelf, geen noindex, hreflang op de pagina en in de sitemap, en robots.txt blokkeert niets behalve `/api/`. Er is geen technische blokkade die Google buiten de deur houdt.

## De 89, ingedeeld naar oorzaak

| Oorzaak | Aantal | Verdict |
|---|---|---|
| Geen echte pagina of al correct | 19 | geen actie |
| Spaans | 16 | opgelost in deze branch: `/es` gaat met een 301 naar `/en` |
| Locale-loze URL met een 307 | 2 | opgelost in deze branch: 308 |
| Inlogpagina's van `app.future-marketing.ai` | 2 | open, fma-app |
| Echte NL- en EN-pagina's die Google niet wil opnemen | 50 | deels in deze branch (interne links), de rest is autoriteit en tijd |

### Geen echte pagina of al correct (19)

- **Pagina met omleiding (8)**: `http://` en `https://` van de root, beide `www`-varianten, en `/skills/reporting`, `/skills/lead-qualifier`, `/skills/ad-manager` en `/skills/email-management/`. Omleidingen horen niet in de index. De locale-loze skill-URL's krijgen nu een 308, zie F1.
- **Geblokkeerd door robots.txt (3)**: drie `_next/static`-chunks uit mei, twee via `www`. De huidige robots.txt blokkeert `_next` niet meer.
- **404 (1)**: `www.future-marketing.ai/explorer`, een pagina die niet meer bestaat.
- **Bronbestanden (6)**: vier `_next/static`-chunks, de favicon en een `.woff2` van de app. Dat zijn geen pagina's.
- **Oude slug (1)**: `/nl/kennisbank/wat-is-een-ai-marketing-medewerker` geeft sinds PR #47 een 301 naar de pillar.

### Spaans (16, plus 7 Spaanse URL's die WEL in de index staan)

Noindex (4): `/es/skills/clyde`, `/es/roadmap`, `/es/skills/voice-agent`, `/es/skills/reporting`. Gecrawld maar niet geindexeerd (12): `/es/pricing`, `/es/founding-member`, `/es/legal` met cookies, terms en privacy, `/es/skills/` email-management, manychat, reel-builder, seo-geo en social-media, en `www.future-marketing.ai/es/skills/lead-qualifier`. Nog in de index (7): `/es/memory`, `/es/skills/blog-factory`, `/es/assessment`, `/es/apply`, `/es/contact`, `/es/kennisbank`, `/es/skills`.

Spaans stond sinds september op noindex, maar bleef crawls kosten en 7 pagina's in de index houden. Besluit Daley 2026-10-02: NL eerst, EN tweede, Spaans eruit. Zie F3.

### Locale-loos met een 307 (2)

`/nl/kennisbank/meetbare-ai-marketing-resultaten` staat als "Dubbele pagina, Google heeft een andere canonieke pagina gekozen": Google koos `/kennisbank/meetbare-ai-marketing-resultaten` zonder `/nl/`. Ook `/skills/manychat` staat los in "gecrawld". In de index staan bovendien `/kennisbank/meetbare-ai-marketing-resultaten` en `/skills/email-management`, beide zonder locale. Oorzaak: next-intl stuurt een locale-loze URL met een **307** door, en een tijdelijke omleiding zegt tegen Google dat de bron-URL de echte is (curl 1 okt: `/kennisbank/<slug>` en `/skills/clyde` geven 307). Zie F1.

### Inlogpagina's van de app (2)

`app.future-marketing.ai/login` en `/forgot-password`. De app geeft geen `noindex` en `app.future-marketing.ai/robots.txt` stuurt door naar de inlogpagina in plaats van een robots-bestand te serveren (curl 1 okt). Valt buiten deze repo, zie Open.

### Echte pagina's die Google niet opneemt (50)

Gecrawld, niet geindexeerd (20): `/nl/kennisbank` en de artikelen ai-agent-vs-ai-tool-marketing, geo-monitoring-tools-chatgpt-perplexity, ai-marketing-agent-geheugen-en-leren, ai-marketing-automation-voor-bureaus, geo-vs-seo-waar-investeren-2026 en ai-marketing-resultaat-in-de-praktijk; `/nl/skills` en de skills clyde, lead-qualifier, voice-agent, research, manychat, email-management en reel-builder; `/nl/legal` en `/nl/legal/terms`; `/en/about`, `/en/kennisbank` en `/en/skills/voice-agent`.

Gevonden, niet gecrawld (30): 22 EN-pagina's (apply, case study, contact, founding-member, how-it-works, de vier legal-pagina's, memory, pricing, `/en/skills` en tien skills) en 8 NL-pagina's (`/nl/about`, de SkinClarity-case, de artikelen ai-efficientie-marketingbureau, marketingbureau-schalen-met-ai en zichtbaarheid-meten-ai-overviews, `/nl/legal/cookies`, `/nl/legal/privacy`, `/nl/skills/ad-manager`).

Dit zijn geen fouten maar een oordeel van Google: het domein is jong, heeft weinig externe links, en 1 klik uit zoekresultaten in drie maanden. Google neemt dan alleen op wat het duidelijk de moeite waard vindt. Drie dingen die wij in de hand hebben:

1. **Interne links naar de kennisbank.** Een artikel kreeg alleen links van de kennisbankindex, van zusterartikelen en soms van de homepage (3 tot 6). De twaalf skillpagina's staan via de navigatie op elke pagina en linkten naar geen enkel artikel. Zie F2.
2. **Zelf aanvragen in URL-inspectie**, tien per dag. Gedaan op 1 okt voor 11 van de 13 artikelen; de andere twee lopen tegen het quotum aan.
3. **Externe links en vermeldingen.** Buiten de code, zie Open.

Dunne pagina's in de sitemap: `/legal/cookies` heeft 29 (NL) en 36 (EN) zichtbare woorden, `/assessment` 99, `/apply` 126, `/contact` 129, `/roadmap` 140. Apply, assessment en contact zijn formulieren en staan voor NL al in de index; laten zo.

## Fixes in deze branch (`fix/gsc-indexering`)

| | Wat | Waar |
|---|---|---|
| F1 | Locale-loze URL's krijgen een 308 in plaats van een 307, behalve `/` (die onderhandelt de taal per bezoeker) | `fmai-nextjs/src/middleware.ts` |
| F2 | Elke skillpagina toont drie bijpassende kennisbankartikelen (EN: de Engelse gids), via de bestaande `KennisbankTeaser` | `fmai-nextjs/src/components/skills/SkillPageTemplate.tsx`, `messages/{nl,en}.json` |
| F3 | `es` is geen locale meer; `/es` en `/es/*` gaan met een 301 naar `/en`; de Spaanse regels uit `llms.txt` | `fmai-nextjs/src/i18n/routing.ts`, `fmai-nextjs/next.config.ts`, `fmai-nextjs/public/llms.txt` |

De Spaanse teksten in chatbot, formulieren en API-routes blijven staan als dode code. Opruimen kan in een eigen PR; het raakt tientallen bestanden en levert voor indexering niets op.

Effect van F2 op de interne links per NL-artikel (live voor, build na): ai-marketing-automation-voor-bureaus 5 naar 11, marketingbureau-schalen-met-ai 6 naar 10, ai-agent-vs-ai-tool-marketing 5 naar 9, ai-efficientie-marketingbureau 3 naar 8, meetbare-ai-marketing-resultaten 4 naar 7, en de overige acht 3 tot 6 naar 5 tot 7. De Engelse gids gaat van 1 naar 13.

## Verificatie (lokaal, voor merge)

| Check | Commando | Uitkomst |
|---|---|---|
| Redirectstatus | `node scripts/check-locale-redirects.mjs` (draait de echte middleware op een `NextRequest`) | `/` 307 naar `/nl`; `/kennisbank/meetbare-ai-marketing-resultaten` en `/skills/email-management` 308 naar `/nl/...`; `/nl/skills/clyde` 200. Tegen de oude middleware: exit 1 op beide 308-regels |
| Types | `npx tsc --noEmit` | exit 0 |
| Build | `npm run build` | exit 0, 93 statische pagina's (was 125: de Spaanse vallen weg), lint gelijk aan de baseline (14 errors, 29 warnings, alle van voor deze branch) |
| Redirectvolgorde | `.next/routes-manifest.json` | `/es` en `/es/:path*` staan voor elke andere regel, met 301 |
| Links in de HTML | grep op `.next/server/app/nl/skills/*.html` | `nl/skills/clyde` linkt naar ai-marketing-medewerker, ai-agent-vs-ai-tool-marketing en ai-marketing-agent-geheugen-en-leren; `en/skills/clyde` naar de Engelse gids |
| Geen Spaans meer | grep op alle gebouwde NL/EN-HTML naar `/es` en `hrefLang="es"` | 0 bestanden |
| Bestaande checks | `check:i18n-orphans`, `check:indexability`, `check:sitemap-lastmod`, `check:llms` | alle OK |

Na de deploy, met curl op productie: `/kennisbank/meetbare-ai-marketing-resultaten` geeft 308, `/es/pricing` geeft 301 naar `/en/pricing`, `/nl/skills/clyde` bevat de drie artikellinks.

## Open

1. **Search Console na de deploy**: bij "Dubbele pagina" en "Uitgesloten door tag noindex" op "Oplossing valideren" klikken. Daarna dagelijks tien URL-inspecties, in deze volgorde: de twee artikelen die op 1 okt tegen het quotum liepen (ai-agent-vs-ai-tool-marketing, ai-marketing-agent-geheugen-en-leren), dan `/nl/kennisbank`, `/nl/skills`, `/nl/skills/clyde` en de andere NL-skillpagina's, zodat Google de nieuwe links ziet. EN pas als NL binnen is.
2. **`app.future-marketing.ai`**: een `robots.txt` met `Disallow: /` serveren (nu een redirect naar login) en `noindex` op de publieke auth-pagina's. Hoort in fma-app.
3. **GA4 laadt zonder toestemming.** `src/app/[locale]/layout.tsx` laadt `gtag.js` en roept `gtag('config', 'G-08FEWKC77B')` op elke pagina aan; de cookiebanner bewaart de keuze in `localStorage`, maar niets in de GA4-code leest hem. Voor analytische cookies vraagt de Telecommunicatiewet (art. 11.7a) in de regel toestemming. Dit is geen indexeringszaak, maar wel een AVG-risico en het raakt de cookiepagina (29 woorden). Voorstel: Consent Mode v2 met `analytics_storage: 'denied'` als standaard en een update bij toestemming. Dat verlaagt de gemeten bezoekersaantallen, dus het is een besluit van Daley.
4. **Externe links**: LinkedIn-bedrijfspagina, vermeldingen bij klanten (SkinClarity Club), relevante gidsen en directories. Zonder signalen van buiten blijft Google bij een jong domein terughoudend.
5. **Skillpagina's zijn sjabloonpagina's van 410 tot 900 woorden** met dezelfde opbouw. Wat er per vaardigheid echt anders is (schermen, cijfers, praktijkvoorbeeld) maakt ze sterker dan meer tekst.
6. **Opnieuw meten over 2 tot 4 weken**: hetzelfde rapport, dezelfde indeling.
