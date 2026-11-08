# Founding A1.4 op de site: VERIFICATION

Spoor `founding-site`, nacht van 9 november 2026 (Daley sliep vanaf ±05:00 lokaal). Plan: fma-app `docs/plans/2026-11-09-founding-a14-credits-PLAN.md` §1, §3, §8, §11. Manifest en canoniek feitenblok: `docs/plans/2026-11-09-founding-a14-site-MANIFEST.md`.
Branch `feature/founding-a14-site`, basis `origin/main` e3ef66b7.

## Wat er veranderde

| Oppervlak | Wijziging |
|---|---|
| `src/lib/pricing-data.ts` | Alleen Founding: €1.297 / 5 inbegrepen / +€199 / max 15 / 1.500 credits per merk / €0 onboarding / 12 maanden vast. Growth, Professional, Enterprise en het workspace-model weg. `CREDIT_PACKS` 500/€40, 2.000/€160, 5.000/€400. `foundingPrice()` weigert <1, >15 en niet-gehele aantallen |
| `src/lib/constants.ts` | `FOUNDING_SPOTS_TOTAL` 10 → 3, nieuw `FOUNDING_SPOTS_TAKEN = 0` |
| `/pricing` | Latere-tarieventabel en caps-matrix weg; nieuwe sectie "Een maand per merk" (plan §3); rekenvoorbeeld 5/10/15 met credits in plaats van "later tarief"; één regel D2 "Reguliere pakketten volgen na het Founding-cohort"; credits V2 + drie bijkooppakketten; FAQ herschreven |
| `WorkspaceSlider` | 1-15 merken, Founding-totaal plus creditpot; geen latere tier |
| `FoundingCounter` | "Eerste cohort: 0 van 3 plekken bezet" |
| `PricingJsonLd` | Eén Founding-offer (twee UnitPriceSpecifications, `valueAddedTaxIncluded: false`, 1-15 merken) plus de drie bijkooppakketten |
| Home NL (`StartPrijsVragenSecties`) | Tabel latere tarieven weg, prijsblok naar canon |
| Home EN (`PricingTeaser`) | Alleen Founding plus de D2-regel |
| Skillpagina's (`SkillPageTemplate`, `skills-data.ts`) | Tabel "caps per tier" en V1-creditlabels weg; capaciteit loopt via credits |
| Aanmeldformulier | Tier-keuze alleen Founding en "weet ik nog niet"; de API-enum blijft (oude aanvragen valideren nog) |
| Chatbot (kennisbank, tools, widget-copy), mails, llms.txt, llms-full.txt, OrganizationJsonLd | Naar canon; `get_pricing_info` kent alleen nog `founding`/`all` |
| `messages/{nl,en,es}.json` | Alle verkoopsleutels naar canon; oude tier-sleutels verwijderd |
| `legal/terms` | Abonnementsvoorwaarden naar Founding A1.4, met de zin dat bestaande overeenkomsten hun voorwaarden houden |
| `seo-config.ts` | lastmod 2026-11-09 voor 17 gewijzigde paden |

**ES is geen live locale.** `src/i18n/routing.ts` kent alleen `en` en `nl`; `/es` redirect naar `/en`. De ES-copy is bijgewerkt voor consistentie, maar is niet te screenshotten of live te controleren.

## Metingen

| Check | Commando | Uitkomst |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint gewijzigde bestanden | `npx eslint <gewijzigde .ts/.tsx>` | 0 errors, 1 bestaande warning (`apply-wizard.spec.ts:460`) |
| Lint volledig | `npm run lint` | 13 errors, allemaal in 6 niet-geraakte bestanden (React-Compiler-lint: not-found, ChatInput, ChatWidget, ChatWidgetIsland, ChatSimulation, usePersonaChat). Geen overlap met deze diff. `prebuild` draait `lint \|\| true`, Vercel `next build` |
| Repo-checks | `check:palette`, `check:copy`, `check:i18n-orphans`, `check:sitemap-lastmod`, `check:indexability`, `check:llms` | alle zes OK (`check:llms`: 3 founding spots) |
| Chat fit e2e | `chat-fit.spec.ts` (fork) | 13/13 |
