# Golf 5c verificatie (2026-11-06)

Branch `feature/golf5c-copy` op origin/main `83cd16bc`, gemeten in worktree `C:/tmp/fmai-golf10` met `npx next build` en `npx next start -p 3050`. Plan: `docs/plans/2026-11-06-golf5c-copy-plan.md`.

| # | Claim | Commando | Verdict |
|---|---|---|---|
| 1 | Typecheck schoon | `npx tsc --noEmit` | GREEN, exit 0 |
| 2 | Productiebuild | `npx next build` (3 keer, de laatste na de tabelkop) | GREEN, exit 0 |
| 3 | Eslint op de 10 geraakte TS-bestanden | `npx eslint <bestanden>` | GREEN, exit 0 |
| 4 | Copyregels | `npm run check:copy` | GREEN, schoon |
| 5 | llms tegen de SSoT | `npm run check:llms` | GREEN, "10 founding spots, no yearly cap" |
| 6 | i18n-wezen | `npm run check:i18n-orphans` | GREEN, 43 namespaces |
| 7 | Sitemap-lastmod | `npm run check:sitemap-lastmod` + curl `/sitemap.xml` | GREEN: /nl, /nl/apply, /nl/about en /nl/legal/terms op 2026-11-06 |
| 8 | Robots-beleid | `npm run check:indexability` | GREEN, 34 pagina's |
| 9 | Catalogus nl+en zonder oude termen | flatten-script: levenslang, lifetime, for life, voor altijd, `{maxPartners}`, `{maxPerYear}`, per jaar, directe lijn met Daley, contactpersoon, volgende cohort | GREEN, 0 hits |
| 10 | Code zonder `MAX_PARTNERS_PER_YEAR` | `grep -rn` in src en scripts | GREEN, alleen een historische comment in `check-llms-consistency.mjs:11` |
| 11 | Server-HTML: nieuwe zinnen erin, oude eruit | curl op /nl, /en, /nl+/en/apply, /nl+/en/about, /nl+/en/legal/terms | GREEN, allemaal 200; nieuw 3 tot 11 hits per pagina, oud 0 |
| 12 | Render op 390 en 1280 px | Playwright, `scrollWidth` tegen `clientWidth`, 11 shots voor (prod) en na (lokaal) | GREEN, geen overflow en 0 page errors |
| 13 | Em-dashes in de toegevoegde regels | `git diff -U0` + grep | GREEN, 0 |
| 14 | e2e `apply-wizard` | `PLAYWRIGHT_BASE_URL=http://localhost:3050 npx playwright test tests/e2e/apply-wizard.spec.ts --project=chromium` | 4 pass, 8 fail, 9 niet gedraaid. Zie hieronder |

## e2e apply-wizard: waarom 8 rood, en waarom dat niet aan deze branch ligt

- **6 tests** (API scoring en de critical paths): ze klikken door de pakketvraag, ook op "Founding (€997" met de nieuwe tekst, en lopen pas vast bij `waitForResult` (`apply-wizard.spec.ts:83`). `/api/apply` geeft lokaal een 500, want de worktree heeft geen `.env.local`: geen Supabase-sleutels en een placeholder voor Resend. Daardoor is er ook geen mail verstuurd.
- **2 tests** (`/en/apply` en `/es/apply` zonder JS-fouten): ze tellen de 404 van `/_vercel/speed-insights/script.js` mee. Dat script bestaat alleen op Vercel en niet onder `next start`.
- **Niet gemeten**: dezelfde spec tegen een build van origin/main zonder deze branch. Tegen prod draai ik hem bewust niet, want de API-test zou dan een echte aanvraag versturen.

## Niet gecheckt

- De prijskaartjes in de chatbot zijn niet in beeld gebracht. Die kun je alleen tonen door een gesprek met Clyde te starten, en dat kost LLM-calls. Ze zijn wel als tekst gecheckt (punt 9).
- De admin-mail met het nieuwe tierlabel is niet verstuurd.
- es: geen locale sinds 2026-10-02. es.json is niet aangeraakt, en zijn `{maxPartners}`-strings worden nergens meer geladen.
