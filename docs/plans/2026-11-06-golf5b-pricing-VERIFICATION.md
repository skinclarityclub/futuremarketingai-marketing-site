# Golf 5b /pricing: verificatie (2026-11-06)

Branch `feature/golf5b-pricing` in `C:/tmp/fmai-golf10`, HEAD `9abfb721` (feat `81909b30` + fix `9abfb721` op de plan-commits `0024ae48` en `298d72c5`, op origin/main `53f422a7` = #94). Niet gepusht. Gemeten op `next build` (dezelfde opdracht als Vercel), `next start -p 3050` verborgen via detach.ps1.

## Bewijslijst uit het plan

| Check | Uitkomst | Bewijs |
|---|---|---|
| `tsc --noEmit` | GROEN | exit 0 |
| lint | GEEN NIEUWE | 14 errors, 30 warnings; allemaal in not-found, chatbot, home MemoryLiveComparison, motion ChatSimulation, usePersonaChat (bestaand, zie handover). `eslint` op de geraakte bestanden: exit 0 |
| `next build` | GROEN | exit 0; `npm run build` (met lint + Beasties-postbuild) ook exit 0 |
| `check:copy` | GROEN | "schoon" |
| `check:llms` | GROEN | "10 founding spots, no yearly cap" |
| `check:indexability` | GROEN | 34 pagina's |
| `check:sitemap-lastmod` | GROEN | 30 paden; /pricing 2026-11-06, /founding-member weg |
| `check:i18n-orphans` | GROEN | 43 namespaces, 3 locales (`founding-member` weg) |
| /nl/pricing, /en/pricing | 200 | curl |
| `<title>` | NL 53, EN 49 tekens | "Prijzen van Clyde: €997 per maand \| FutureMarketingAI" |
| meta description | NL 140, EN 146, ES 152 | alle ≤155 |
| H1 | "Wat kost Clyde?" / "What does Clyde cost?" | server-HTML |
| Offer-JSON-LD | VALIDE | SoftwareApplication `https://future-marketing.ai/#clyde`, 4 offers (997/499/399/299), unitText "per workspace per month", seller `{"@id": "…/#org"}`; FAQPage 11 vragen |
| `/nl/founding-member` | 301 → `/nl/pricing#founding` | `Location`-header; hash blijft staan |
| `/en/founding-member`, kaal `/founding-member` | 301 → `/en/…#founding`, `/nl/…#founding` | één hop |
| `/es/founding-member` | 301 → `/en/founding-member` → 301 | twee hops via de bestaande es-regel (es is geen locale meer) |
| Links naar /founding-member in HTML | 0 | /nl/pricing, /en/pricing, /nl; header + footer wijzen naar `/pricing#founding` |
| sitemap.xml, llms.txt | 0 keer founding-member | curl |
| Rekenvoorbeeld in server-HTML | KLOPT | 5: €997 / €199 · 10: €997 / €100 · 15: €2.492 / €166; later €1.995 (Pro), €3.990 (Pro), €4.485 (Ent) |
| Schuif SSR | €997, €100 per klantmerk | geen "€ 0" |
| 390 en 1280 px | GEEN OVERFLOW | scrollWidth ≤ clientWidth op NL en EN; tabellen scrollen binnen hun eigen region |
| Anker | `/nl/founding-member` landt op `#founding` (top 176 px) | Playwright, beide breedtes |
| em-dash, "AI Collega" los, "Premium", "swing", "Pro", "per jaar" | 0 in de nieuwe `pricing`-namespace (nl/en/es) | script |
| e2e | `pricing-experience-smoke` 3/3 groen (incl. 301-test); `nl-content-smoke` 13/18 | de 5 rode (home, apply, skill-clyde, skill-voice, skill-lead) zoeken zinnen die al niet in origin/main staan; home en apply falen ook tegen productie |

## Productclaims, getoetst tegen fma-app origin/master

| Claim (oud) | Verdict | Wat ermee gebeurde |
|---|---|---|
| Professional "maandelijkse strategiecall" | alleen belofte (handover 2026-10-12) | weg, ook uit de JSON-LD |
| Founding "Maandelijkse Founder-calls" | niet gevonden | weg |
| "Voorrang in de ontwikkel-queue" | niet gevonden | weg |
| "Vroege toegang tot nieuwe vaardigheden" | niet gevonden; `coming_soon` geldt voor alle tiers gelijk | weg |
| FAQ q5 "4 weken partnership-setup" | menselijk proces, vastgelegd (onboarding-concept), live op de home | blijft, in de woorden van de home |
| FAQ q8 "export binnen 30 dagen" | handmatig proces, keuze 10b (`founding-geheugen-retentie-PLAN.md:8`) | blijft |
| FAQ q7 Founding-retentie | #1938: `retention.ts:32,39` Founding `null` | "bewaart het geheugen en de gesprekken zolang je abonnement loopt", gelijk aan legal `data_retention` |
| Founding 10 incl., €299 extra, 8.000 credits, €0 onboarding | `skills.ts:290-295` | nu ook in `pricing-data.ts` |
| Caps per vaardigheid | `SKILL_CAPS` `skills.ts:369-406` | matrix klopt één op één; legenda zegt niet meer "per werkruimte" (de enige afgedwongen cap, DM's, geldt per organisatie) |
| Credits per actie (post 2, blog 15, ad 10, video 20, reel 25, voice 5/min) | `CREDIT_COSTS` `skills.ts:526` | in de creditsectie |
| Proefperiode | geen (`trial_period_days: null`) | FAQ zegt "Nee" |

## Onderweg gevonden

- De #418-hydratiefout op /nl/how-it-works komt alleen met `npm run build` (Beasties-postbuild). Met `next build`, zoals Vercel, slaagt de pagina. Niet uit deze branch.
- `/about` (`capacity.body`, `capacity.reasoning`) en `IcpSection` gebruiken nog `MAX_PARTNERS_PER_YEAR`; buiten /pricing, dus niet in deze PR.
- `/apply` zegt nog "Founding (€997/mnd levenslang): 10 plekken, voorrang nu open" (`apply.form.tierOptions.founding`); dat is golf 5c.
- Op de pushdag: prijzen opnieuw tegen de live site en `PRICING_CHECKED_ON` + `seo-config` `/pricing` op die datum zetten als het niet 2026-11-06 is.
