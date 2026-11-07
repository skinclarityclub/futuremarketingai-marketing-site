# Golf 7b: verificatie (2026-11-07)

Branch `feature/golf7b-saleslobe` in `C:/tmp/fmai-golf6`, vanaf origin/main `ff8fa6d1` (#100). Commits: `327f06a6` (cherry-pick van `1bb44139`, de live-sectie van 7a) en de port `2515d9bb` (23 bestanden). Gemeten op `2515d9bb`, `next start` op poort 3047, zonder `.env.local`. Niets gepusht.

## Akkoord

- **Paul**: ja op de mockup (https://claude.ai/artifact/KhwYExv5yuPpvDfBtucFd2, versie 2), alle vijf vragen "zo laten": tekst, LinkedIn-post van 23 oktober (ingekort) en carrousel van 27 oktober; de stemronde; de aantallen (23 posts: 9 op Instagram, 14 op LinkedIn); "B2B"; geen logo-wijziging. Gemeld door Daley op 2026-11-07 (één AskUserQuestion).
- **Daley**, zelfde vraag: geen agendascherm uit de app (port wat Paul zag); de hubkaart wisselt naar de "not right now"-carrousel. Die kaart heeft Paul niet in de mockup gezien; het zijn wel zijn eigen slides.

## Poorten

| Poort | Commando | Uitkomst |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | rc 0 |
| ESLint | `npx eslint` op de 11 geraakte code- en testbestanden | rc 0 |
| Zes checks | `check:palette`, `copy`, `i18n-orphans`, `sitemap-lastmod`, `indexability`, `llms` | alle zes rc 0 (sitemap 32 paden, 36 pagina's met robotsbeleid) |
| Build | `npx next build` | rc 0; `/[locale]/case-studies/saleslobe` SSG voor nl en en |
| curl | saleslobe nl/en, hub nl/en, SKC nl | 5x 200 met de nieuwe title en H1 |
| Titles en metas | uit de HTML | nl 52 / 131, en 53 / 135 |
| Regels | tekst van de 4 pagina's (saleslobe en hub, nl en en) | 0x em-dash, %, Corty, "elke week"/"every week", "AI Collega", DataForSEO; casepagina 0x Sindy (hub: de bestaande FAQ "Zijn dit echte klanten?") |
| Tekstpariteit | `.g6` innerText van `R/golf7-saleslobe.html` tegen `/nl/case-studies/saleslobe`, regel voor regel (plaatshouder en "/"-scheiders eruit) | 84 = 84 regels, 0 VERSCHIL |
| Schema | JSON-LD uit de HTML | case: WebPage, BreadcrumbList (Home > Cases > SalesLobe), Organization (`https://saleslobe.com`, "B2B-merk van oprichter Paul den Hartogh."), Article met `about` = SalesLobe, `author` = `#org`, `url` = canonical per taal, `datePublished` = `dateModified` = `PAGE_DATES` 2026-11-07; geen Person-node voor Paul. Hub: CollectionPage met ItemList (SKC, SalesLobe) |
| Sitemap | `/sitemap.xml` | 6 case-URL's met lastmod 2026-11-07, waarvan nl en en saleslobe nieuw |
| m-g6, NL | `m-g6-webp.mjs` (m-g6 met `Accept: image/webp` op `/_next/image`, de lokale AVIF-hang uit 7a), `cases` en `saleslobe`, 1440/1280/1024/390 | 0 PROBLEEM; schermen `ronde1b/g7/port7b` |
| m-g6, reduce | idem, `--reduce` | 0 PROBLEEM (`g7/port7b-reduce`) |
| m-g6, EN | /en hub en saleslobe op 1280 en 390 | 0 PROBLEEM (`g7/port7b-en`) |
| Beelden | zes slides van rij 57600 als WebP 720x900 (30-42 KB), `public/proof/sl-notnow-s01..06.webp`, vooraf bekeken | geen gezicht, geen Corty, geen "every week"; het ≠-teken in het bijschrift rendert |
| e2e, 134 tests | `navigation`, `nl-content-smoke`, `sitewide-visual-audit`, `conversion-polish`, chromium, list | branch 15 failed / 118 passed / 1 skipped. De nieuwe tests `case-study-saleslobe` en `/en/case-studies/saleslobe` groen |
| e2e baseline | dezelfde 15 met `--grep` tegen prod (= origin/main `ff8fa6d1`), alleen-kijken-tests | 15 failed op prod: dezelfde tests (conversion-polish P1-A, P1-B NL, P1-G; navigation homepage, header, scroll; content-smoke home, apply, skill-clyde, skill-voice, skill-lead). Geen regressie |

Na build en e2e: `git status` schoon; `test-results/.last-run.json` teruggezet; `tsconfig.json` en `playwright-report/index.html` onaangeroerd.

## Wat de port meer doet dan het prototype

- Hubkaart: de drie losse posts worden slide 1-3 van de carrousel, met "1 van 6" enz. en "Lees de case"; de drie sleutels `case_studies.posts.sl-*` en `hub.clients.sl.label` zijn weg (alleen de hub las ze; de home gebruikt `klanten.alt.*`).
- `breadcrumb-config.ts` + `common.breadcrumbs.case_studies_sl`, sitemap, `PAGE_DATES`, ItemList op de hub.
- `llms.txt` (regel "Case: SalesLobe"), `llms-full.txt` (sectie "Case Study: SalesLobe"), `concierge-kb.ts` (link naar de case), `prompt-builder.ts` (paginahint: geen resultaten, niet zeggen wie goedkeurt).
- Pauls eigen tekst (LinkedIn-post, bijschrift, hashtags, drie openingen) staat als Engelse constanten in `SlCaseSections.tsx` met `lang="en"`, in elke taal gelijk. `es.json` spiegelt `en.json`.
- Het r4-CSS-blok (`golf6.css` regels 163-170) staat ongewijzigd achteraan `src/components/proof/proof.css`.

## Open

- Daleys ja op de diffpagina (`A/alle-paginas/golf7b-diff/index.html`), dan push, PR, merge na een groene preview, PSI 3x mobiel en desktop op `/nl/case-studies/saleslobe` en `/nl/case-studies`.
- Merge na 2026-11-07: `PAGE_DATES['/case-studies/saleslobe']` en `'/case-studies'` naar de mergedag.
