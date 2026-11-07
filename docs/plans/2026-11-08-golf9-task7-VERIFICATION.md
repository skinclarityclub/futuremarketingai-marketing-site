# Verificatie golf 9 Task 7: prototype van de vier vaardigheidspagina's (2026-11-08)

Alles hieronder is het prototype buiten de repo (R = `C:/Users/daley/Desktop/80-Archief/fma-app-audits/2026-11-02-website-audit/design/ronde1b`, P = `.../design/port`). In de site is niets gebouwd en niets gepusht.

| Claim | Verdict | Bewijs |
|---|---|---|
| Vier tpl's bouwen, met de golf-9b-toets en zelftest | GROEN | `python build10.py` vanuit R, opnieuw gedraaid bij de wrap: `OK golf6+7 16 pagina's`, placeholders 0 voor alle vier golf9-pagina's. De zelftest draait bij de import (asserts in `build10.py`, bron `patch-build10.py` in de scratchpad) |
| De toets vangt wat hij moet vangen | GROEN | Negatieve proef in de sessie: TikTok op social en "12 artikelen" op blog-factory lieten de build falen, daarna teruggezet |
| m-g6 0 PROBLEEM op 1440/1280/1024/390 | GROEN | Opnieuw gemeten bij de wrap: `PREFIX=golf9 PAGES=social-media,reporting,seo-geo,blog-factory node tools/m-g6.mjs g9/v1` geeft de regel `0 PROBLEEM` (eerste meting: `g9/b1`) |
| Idem met reduced motion | GROEN (één regel) | `... m-g6.mjs g9/v1-reduce --reduce`: precies één regel met PROBLEEM, de samenvattingsregel. De inhoud is bij de wrap niet geprint. Eerste meting `g9/b1-reduce`: `0 PROBLEEM` |
| Keuzepagina zonder problemen | GROEN | `node tools/m-pres.mjs ../port/presentatie-golf9b.html g9/vpres` geeft `0 PROBLEEM` |
| "Elke vrijdag een rapport" (seo-geo) klopt | GROEN | fma-app `vercel.json` r325-330: cron vrijdag 13:00 UTC. Op prod staan runs in `fma_seo_report_runs` op 9, 16, 23 en 30 oktober en 6 november (SELECT) |
| Blogonderwerpen komen uit striking distance | GROEN | fma-app `topic-planner.ts` r248-253: sortering op `is_striking_distance`, positie 11 t/m 20 |
| Geen open demosessies na de opnames | GROEN | `auth.sessions` voor demo-agency en demo-client: 0 rijen (SELECT, in de sessie) |
| Daleys keuzes vastgelegd | GROEN | vault `Agency/Rapporten/2026-11-08 Golf 9b prototype.md` (sectie Keuzes), `R/golf9-ONTWERP.md` (slot), plan Task 7 aangevinkt in `aaf554c8` |

## Open, bewust niet gemeten
- Het SEO-weekrapport is op 23 en 30 oktober bij 3 van de 4 sites niet bezorgd (status failed). Dat is een fma-app-bevinding: de pagina claimt het rapport, niet de bezorging.
- Demobevindingen, niet opgelost: in de demokalender van Luwte staat op 11 november drie keer dezelfde post plus de interne taak "Pipeline herstellen". De blogochtendreview labelt artikelen als "Instagram". De SERP-slug eindigt op "-2".
- Er is nog niets op een echte Next-build gemeten. Dat hoort bij Task 8 (PR 9b en 9c), elk met een eigen VERIFICATION.
