# E2E-specs verificatie

Datum: 2026-11-08. Gemeten tegen origin/main = 76c0ca3d87400ebfaf10abba257b4480bba8d8a8

| # | Claim | Verdict | Bewijs |
|---|-------|---------|--------|
| 1 | #111 squash-gemerged als 5fdf132e, alleen 3 specs plus taalknop-VERIFICATION, geen sitecode | BEWEZEN | `gh pr view 111`: MERGED, mergeCommit 5fdf132ee442. `git show --stat`: 4 bestanden, conversion-polish/homepage/i18n.spec.ts en docs/plans/2026-11-08-taalknop-VERIFICATION.md, geen src/ |
| 2a | #112 squash-gemerged als 76c0ca3d | BEWEZEN | `gh pr view 112`: MERGED, mergeCommit 76c0ca3d; = origin/main |
| 2b | Enige sitewijziging is ChatWidget.tsx; onStartDemo roept startDemo() en focusComposer() aan | BEWEZEN, met nuance | ChatWidget.tsx:425-428 (`startDemo()` + `focusComposer()`, alleen als `!demoMode`). `git show --stat`: 1 bestand onder src/ (ChatWidget.tsx, +10/-1), de overige 6 zijn tests/e2e-specs |
| 3a | Privacy-sectie "12. Contact en toezichthouder" in nl.json | BEWEZEN | messages/nl.json:2290 |
| 3b | Assessment-trust-strings in nl.json | BEWEZEN | nl.json:4771 ("Analytics alleen na jouw toestemming"), :4772 ("Gratis, 16 vragen, rapport per e-mail"); spec conversion-polish.spec.ts:17-18 |
| 3c | ServicesBento: 8 live secundaire tegels + Clyde = 9 links met /skills/ | BEWEZEN | ServicesBento.tsx:44-50 en :52 = 8 live (status 'live'); :144 Clyde-CTA `/skills/clyde`; grep geeft 9 treffers. Twee extra tegels zijn coming_soon (`/skills#binnenkort`) |
| 3d | /es geeft redirect naar /en | BEWEZEN | `curl -sI /es/pricing`: HTTP 301, `Location: /en/pricing` |
| 3e | /nl 0x fm-reveal, /en >0 | BEWEZEN | `curl \| grep -o fm-reveal \| wc -l`: NL=0, EN=30 |
| 4 | Prod serveert #112: nieuwste prod-deployment Ready, gemaakt na 09:38:31Z | BEWEZEN, krap | `vercel ls`: futuremarketingai-mrqsc331t, Ready, Production. `vercel inspect`: created 16:38:34 +0700 = 09:38:34Z (3 s na de drempel). Gedrag op prod bevestigt claim 5 |
| 5 | Focus na rondleiding in paneel, paneel dicht na Escape | BEWEZEN | probe-focus.cjs tegen prod: "na rondleiding: textarea[Typ een bericht voor Clyde] inPanel=true", "paneel zichtbaar na Escape: false", POSTs: geen |
| 6 | Doeltests guided-demo.spec.ts:80 en :217 groen op prod (chromium + mobile-chrome) | BEWEZEN | Playwright: `4 passed (16.0s)`. `git checkout --` op last-run.json en index.html uitgevoerd; geen gewijzigde tracked bestanden daarna |
| 7 | Branches docs/golf7b-live en docs/golf9a-live bestaan niet meer | BEWEZEN | `git branch --list` op beide namen: lege uitvoer |

## Afwijkingen

- Claim 2: "enige sitewijziging" klopt voor src/, maar #112 wijzigt daarnaast 6 spec-bestanden (audit-v2-lighthouse, clyde-audit, fase0-visual-validation, guided-demo, performance, reveal). Geen sitecode.
- Claim 4: deployment staat 3 seconden na de drempeltijd; geen marge, maar gedragsmeting (claim 5) bewijst dat de fix live is.
- Probe: "direct na open" staat focus nog op body en pas na 600 ms in de textarea. Dat is bestaand gedrag van openen, niet van de rondleiding-fix.
