# Golf 10 kennisbank: verificatie (2026-11-06)

Plan: `docs/plans/2026-11-06-golf10-kennisbank-plan.md`. Branch `feature/golf10-kennisbank`, gerebased op origin/main `c5da1503` (#92).
Gemeten in worktree `C:/tmp/fmai-golf10/fmai-nextjs` met een echte `node_modules` (robocopy), omdat Turbopack de junction weigert.

## Gemeten

| Wat | Commando | Uitkomst |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Productiebuild (Turbopack) | `npm run build` | exit 0, 98 statische pagina's, 72 s; de JSON-import in de K1-MDX bouwt |
| Copyregels | `npm run check:copy` | schoon, na de fix van de hub-meta ("zonder extra personeel" -> "schalen met AI") |
| llms tegen SSoT | `npm run check:llms` | OK |
| Robots-beleid | `npm run check:indexability` | OK, 35 pagina's |
| Sitemap lastmod | `npm run check:sitemap-lastmod` | OK, 31 paden |
| i18n-wezen | `npm run check:i18n-orphans` | OK, 44 namespaces, 3 talen |
| Lint | `npm run lint` | 14 errors, alle in bestanden die deze branch niet raakt (not-found, chatbot, home, motion) |
| 17 URL's op `next start -p 3047` | eigen fetch-script | alle 200 (behalve `/es/kennisbank`: 301 naar `/en/kennisbank`, ook op prod); gewijzigde titles <=60 en metas <=155; 1 H1; Article- en FAQ-JSON-LD op elk artikel; K1 in `sitemap.xml` |
| Statische bestanden | idem | xlsx 200 met spreadsheet-content-type, zonder redirect; K1-hero 200 |
| Render 390 en 1280 px | Playwright, scrollWidth en kapotte afbeeldingen | geen overflow en geen kapotte afbeelding op de gewijzigde pagina's |
| Externe bronlinks | curl op 23 nieuwe links | 20x 200; OpenAI (2) en Islamic Relief weigeren bots, inhoud bevestigd via Firecrawl |
| Em-dashes, "AI Collega" | grep op toegevoegde regels en gerenderde tekst | 0 en 0 |

## Productclaims (fma-app origin/master)

- Eén kalender met filter per klant: `content-engine/calendar/page.tsx:19-36`.
- Klant keurt goed of af in het portaal, afhankelijk van de rol: `client/calendar/page.tsx:19-22`.
- "Vanaf €997 met 10 werkruimtes" (K3): klopt, want iedereen die nu instapt is founding partner (`pricing.subtitle` op de site); `skills.ts:291` heeft includedWorkspaces 10.
- Clyde-rij in K3 (posts, blogs, inplannen, SEO en GEO, rapport): socialMedia, blogFactory, seoAnalyst en reporting staan in `skills.ts` op `live`.
- "Wat werkte" voedt de volgende planning (K1, merkgeheugen): claim op lopend werk, toegestaan door Daleys regel van 2026-11-01.

## Open, buiten deze branch

- `ai-marketing-medewerker`: title 62 tekens en 5 px overflow op 390 px, ook op prod.
- `meetbare-ai-marketing-resultaten`: meta 157 tekens.
- De 14 lint-errors hierboven.
