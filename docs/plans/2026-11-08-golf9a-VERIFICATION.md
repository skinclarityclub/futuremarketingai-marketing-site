# Golf 9a: verificatie (2026-11-08)

Branch `feature/golf9a-skills` in `C:/tmp/fmai-golf6`, vanaf `c1114d90` op origin/main `1b02db38` (bij `git fetch` op 2026-11-08 nog de top). Port `51d8fd6f` (49 bestanden, +1802 / -2293) en fix `24798198` (4 bestanden). Niets gepusht.

## Akkoord vooraf

- **Daley**, AskUserQuestion op 2026-11-08: het prototype van de hub en `/skills/strategy` (`R/golf9-skills.tpl.html`, `R/golf9-strategy.tpl.html`), keuze 1 "9a zoals gepland": hub, strategie, de rest van lead-qualifier zonder chatdemo, de vijf adressen weg met een redirect, het aantal vaardigheden weg, de footer (plan, sectie "Daleys keuzes").

## Wat er gebouwd is

- Port (`51d8fd6f`): zie de handover `docs/handover/2026-11-08-website-golf9a-verify-handover.md` (desktop-checkout), sectie "Key files changed".
- Fix (`24798198`), gevonden bij deze verificatie:
  - **Voorwaarden, artikel 1** noemde ManyChat DM en Research nog als losse vaardigheden. Artikel 2 verwijst daarnaar voor "alle AI-vaardigheden die nu beschikbaar zijn". Nu: ManyChat DM eruit (de DM's vallen onder Lead Qualifier, dat artikel 1 al met DM's beschrijft) en Research wordt "Strategie en onderzoek (een strategie per klant, met markt- en concurrentieonderzoek en bronvermelding)", gelijk aan de rij op /pricing. nl, en en es.
  - **/en-bento**: zonder de ManyChat-tegel bleef er een gat in de laatste rij (3 tegels in 4 kolommen, en 9 in 2 kolommen). De strategietegel krijgt `featured` (twee kolommen breed, zoals Social bovenaan).

## Poorten, gemeten in deze sessie

| Poort | Commando | Uitkomst |
|---|---|---|
| Build | `npx next build` | rc 0, drie keer (port, na de voorwaarden, na de bento). `/[locale]/skills/strategy` SSG in nl en en; de vijf oude routes staan niet meer in de lijst |
| TypeScript | `npx tsc --noEmit` na de build | rc 0 (de fouten in de verouderde `.next/types/validator.ts` waren weg na de build) |
| ESLint | `npx eslint` op de 37 gewijzigde `.ts`/`.tsx` en `ServicesBento.tsx` | rc 0, 0 errors; 2 warnings die er al waren (`Archetype` in ResultReveal, `expect` in sitewide-visual-audit) |
| Zes checks | `check:palette`, `copy`, `i18n-orphans`, `sitemap-lastmod`, `indexability`, `llms` | alle zes OK, ook na de fix (40 namespaces in 3 talen, 29 sitemappaden, 33 pagina's met robotsbeleid, llms "11 skills, 9 live, 2 coming soon") |

`npx next start -p 3049` via `detach.ps1`, zonder `.env.local`; bewijs: de log meldt "Ready", curl geeft 200. Na elke build gestopt (alleen mijn eigen PID's) en opnieuw gestart.

| Poort | Commando | Uitkomst |
|---|---|---|
| curl, nieuw | `/nl/skills`, `/en/skills`, `/nl/skills/strategy`, `/en/skills/strategy` | 4x 200 |
| curl, redirects | manychat, research, voice-agent, reel-builder, roadmap en voice-agents, nl en en | 12x 308: manychat naar `/skills/lead-qualifier#instagram-dm`, research naar `/skills/strategy#research`, de rest naar `/skills#binnenkort`, telkens in de eigen taal |
| Ankers | `id="research"`, `id="binnenkort"`, `id="instagram-dm"` in de HTML van de doelen | elk precies 1x, nl en en |
| Sitemap | `/sitemap.xml` lokaal tegen prod | 73 tegen 81 URL's: de 10 oude weg, de 2 strategiepagina's erbij |
| Oude links | `href` naar de vijf oude paden in de HTML van alle 73 sitemappagina's | 0 pagina's |
| Tekstpariteit | `.g6` innerText van `R/golf9-skills.html` en `R/golf9-strategy.html` (gebouwd uit de tpl's) tegen `/nl/...`, regel voor regel, plaatshouders eruit, details open | hub 88 tegen 87 regels, strategie 58 tegen 56; het enige verschil zijn de "/"-scheiders van de kruimel (1 en 2), want de site tekent chevrons |
| Title en meta | gerenderde HTML | hub nl 57/147, en 47/148; strategie nl 41/143, en 43/144; alle 16 gemeten pagina's binnen 58 en 155 |
| Woorden | `words9a.py`: zichtbare tekst, title, meta en JSON-LD van home, hub, strategie, lead-qualifier, pricing, voorwaarden, clyde en how-it-works (nl en en), plus llms.txt en llms-full.txt | 0 treffers op em-dash, "AI Collega", DataForSEO, "jouw domein"/"your domain", ManyChat, orchestr/orkestr, "weekrapport pas", "past zich automatisch aan", onderzoeksbriefing, het aantal vaardigheden (`\b(\d+\|tien\|elf\|twaalf\|ten\|eleven\|twelve) (vaardigheden\|skills)`, "10 live"). Voice Agent en Reel Builder staan alleen naast "binnenkort", "soon" of "aangekondigd, maar nog niet beschikbaar". Gemini 1x in llms-full.txt, zie "Gezien, niet in 9a" |
| m-g6, NL | `PAGES=skills,strategy=skills/strategy node tools/m-g6.mjs g9/port9a --base http://localhost:3049`, 1440/1280/1024/390 | 0 PROBLEEM |
| m-g6, reduce | idem, `--reduce` | 0 PROBLEEM (`g9/port9a-reduce`) |
| m-g6, EN | kopie van `m-g6.mjs` met `LOC=en` (scratchpad), 1280 en 390 | 0 PROBLEEM (`g9/port9a-en`) |
| m-g6, lead-qualifier | `PAGES=lead-qualifier=skills/lead-qualifier`, 4 breedtes | 0 PROBLEEM (`g9/port9a-lq`). Het RUST-scherm staat op ware grootte (773 px) in een `.g6-scroll`-regio met label; op 390 scrolt het binnen zijn kader, de pagina zelf niet |
| /en-bento | rechterrand van de laatste rij tegen het grid, 390/768/1024/1280/1440 | lokaal na de fix 5x dicht (11 tegels), prod 5x dicht (12 tegels); vóór de fix een gat op 1280 (gezien op het scherm) |
| e2e | navigation, nl-content-smoke, skill-template-smoke, sitewide-visual-audit, chatwidget-mocked; chromium, standaard workers | 167 passed, 10 failed (gemeten vóór de bento-fix, één prop op de home) |
| e2e naast prod | dezelfde 10 met `--last-failed` tegen `https://future-marketing.ai` | 5 failed, 5 passed. Rood op allebei: navigation "should load homepage successfully", nl-content-smoke home en apply, skill-template-smoke clyde (die test verwacht nog het oude sjabloon; clyde is sinds golf 6 een bewijspagina), chatwidget "header: AI label" |
| e2e chatwidget | `chatwidget-mocked.spec` lokaal, apart | standaard workers: 11 failed, een ander setje dan de eerste keer, allemaal `locator.click: Timeout 2000ms` op de chatknop. `--workers=2`: 71/71 groen. 9a raakt de chatknop niet (ClydePresence: alleen een commentaar; fixture: één URL) |

Geen regressie gevonden: elke rode test is ook rood op prod of wordt groen met minder gelijktijdige belasting op de ene lokale server.

## Gezien, niet in 9a

- **/en home, al zo op prod**: "The SEO report on WhatsApp every Friday" (tegel Reporting), "messages you on WhatsApp the moment something comes up" (subtitel), "Ask in plain language, Clyde picks the right skill" (Clyde-tegel), "A Clyde of their own, in the dashboard and on WhatsApp". De /en-home is nog niet herschreven zoals /nl. 9a haalde alleen het getal uit die subtitel.
- **Gemini** in llms-full.txt, sectie SEO/GEO ("ChatGPT, Perplexity, Gemini and Google AI Overviews"), ook op prod: hoort bij 9c (seo-geo, "geen Gemini").
- De handover noemt voor 9b/9c al: "jouw domein" in widget-copy (seo-geo), WhatsApp-regels en "picks the right skill" in concierge-kb.
- Voorwaarden, de lijst met koppelingen noemt nog "ManyChat en Shopify" als platform; dat is een koppeling, geen vaardigheid, en bleef staan.

## Akkoord op de diff

Diffpagina `A/alle-paginas/golf9a-diff/index.html` (A = `.../design/siteplan`), vault-note `Agency/Rapporten/2026-11-08 Golf 9a diff`. Daleys antwoord: open.
