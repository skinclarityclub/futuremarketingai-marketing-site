# Golf 8a: verificatie (2026-11-07, deel 1 van 2)

Branch `feature/golf8a-client-portal` in `C:/tmp/fmai-golf6`, vanaf `docs/golf8-plan` (origin/main `d542c173` plus de plancommits). Port: `4fc8ff23` (29 bestanden). Niets gepusht.

## Akkoord

- **Daley**, één AskUserQuestion op 2026-11-07: zo porten in twee PR's (8a pagina's, 8b header en footer), alle adviezen, vier portaalschermen echt (Luwte, alleen-kijken-sessie), nieuwsbrief in 8b standaard uit. Vastgelegd in `R/golf8-ONTWERP.md` ("Keuzes van Daley") en de vault-note `Agency/Rapporten/2026-11-07 Golf 8 prototype.md`.
- Gevolg van de echte schermen: drie echt (kalender, onderbalk op de telefoon, aanvraagformulier), Vraag Clyde blijft nagebouwd. Prototype opnieuw gemeten: `g8/r4` 0 PROBLEEM.

## Poorten, gemeten in deze sessie

| Poort | Commando | Uitkomst |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | rc 0 |
| ESLint | `npx eslint` op de geraakte code- en testbestanden | rc 0 |
| Zes checks | `check:palette`, `copy`, `i18n-orphans`, `sitemap-lastmod`, `indexability`, `llms` | alle zes OK (44 namespaces in 3 talen, 33 sitemappaden met lastmod, 37 pagina's met robotsbeleid) |
| Build | `npx next build` | rc 0; `/[locale]/client-portal` en `/[locale]/skills/clyde` SSG voor nl en en |
| Titles en metas | lengte uit de JSON bij het schrijven (assert in `g8a_apply.py`) | nl CP 55/150, CL 48/146; en CP 57/140, CL 53/154; es CP 45/147, CL 45/153 |
| Regels in de diff | grep op de toegevoegde regels | 0 em-dash; 0x "AI Collega", DataForSEO, "jouw domein", Reel Builder |

## Nog te meten (deel 2, plan Task 6)

- curl op `/nl` en `/en` van beide pagina's plus home, pricing en trust (de stopmomentzinnen): 200, title, H1.
- Tekstpariteit `.g6` innerText van `R/golf8-client-portal.html` en `R/golf8-clyde.html` tegen de port, regel voor regel.
- JSON-LD uit de HTML (WebPage met speakable, BreadcrumbList, FAQPage, Service op clyde) en `/sitemap.xml`.
- `m-g6` op de port (1440/1280/1024/390, ook `--reduce`, EN op 1280 en 390), server alleen via `detach.ps1`.
- e2e `navigation`, `nl-content-smoke`, `sitewide-visual-audit`, `conversion-polish`; rode tests tegen prod vergelijken zoals in 7b.
