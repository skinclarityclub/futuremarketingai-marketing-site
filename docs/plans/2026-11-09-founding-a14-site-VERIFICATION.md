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
| Next build | `npx next build` (op 3b911be4) | exit 0, 94/94 pagina's |
| Pricing-smoke | `tests/e2e/pricing-experience-smoke.spec.ts` | 3/3 |
| Apply-wizard e2e | `tests/e2e/apply-wizard.spec.ts` | 21/21 |
| Widget-copy e2e | widget-copy spec | 4/4 |
| Chatwidget gemockt | chatwidget-mocked spec | 66 groen, 5 flaky (openWidget-timeout, boundingBox null); bij herhaling groen, raken de prijs niet |
| Vercel-preview | `gh pr checks 117` op dc9816d3 | pass (Vercel en Vercel Preview Comments); de vijf blogs gecontroleerd op de beschermde preview met `vercel curl`: 1.297 aanwezig, 0x €997, 0x "tien bureaus", 0x "maandbudget" |
| Sweep lokale build | 75 URL's van `next start -p 3005` | pricing bevat 1.297 en 1,297, JSON-LD-offer 1297; twee echte restanten gevonden (blog, privacy), zie hieronder |
| Live-sweep na deploy | `live-check.sh https://future-marketing.ai` (16 controles, zie "Live") | 15/16 OK op 23:31:55Z; de ene FAIL is de niet-gerenderde `tierLabel`, zie "Deploy en live" |

## Screenshots (stap 2)

17 PNG's in fma-app `docs/audits/2026-11-09-founding-a14/site-screens/` (pricing, founding-member, home en apply in NL en EN op 390 en 1440 px, plus `es-pricing-1440`, dat naar /en redirect). Beoordeeld door ze in stroken te knippen en te lezen, plus element-screenshots van het prijsblok op de home tegen de lokale build:

- `nl-pricing-1440` en `nl-pricing-390`: hero, Founding-kaart, "0 van 3", "Wat je krijgt", "Een maand per merk", rekenvoorbeeld 5/10/15 (€259/€229/€219, 7.500/15.000/22.500 credits), D2-regel, credits, bijkooppakketten en FAQ kloppen met het feitenblok. Geen lege sectie of gat waar de caps-matrix stond.
- Op 390 px vallen de tabellen "Plaatsingen per merk" en het rekenvoorbeeld rechts buiten de kaart. Dat is het bestaande patroon `overflow-x-auto` met `min-w-[560px]`, en het stond al zo op `origin/main` (`TABLE_WRAP`/`TABLE` in `pricing/page.tsx`). De tabel scrolt binnen zijn kaart; de pagina zelf scrolt niet horizontaal (`document.documentElement.scrollWidth` 380 bij viewport 390). Niet gewijzigd.
- Home NL (`StartPrijsVragenSecties`, 390 en 1440): €1.297 voor vijf klantmerken, €259/€229/€219 per merk, D2-regel, "Drie plekken in het eerste cohort". Home EN (`PricingTeaser`, 390 en 1440): "One offer: Founding", €1,297, "0 of 3 spots taken", CTA naar `/apply`.
- `nl-apply-390`: badge "Maximaal 3 founding-plekken", stap 1 van 4, geen prijsfouten.
- `/nl/founding-member` is een 301 naar `/nl/pricing#founding`; daarom zijn die screenshots maar één viewport hoog.
- De twee keer "997" in de HTML van `/nl/pricing` is de hash van een fontbestand (`5e3a2858f2997077-s…woff2`), geen tekst.

## Blog en wizard (commit dc9816d3)

Na de code-PR bevatten vijf kennisbankartikelen nog verkooptekst van het oude model. Gericht aangepast, geen replace, `updatedAt` op 2026-11-09:

| Bestand | Was | Nu |
|---|---|---|
| `ai-marketing-automation-voor-bureaus.mdx:145` (tabel) | Vanaf €997 met 10 werkruimtes | €1.297 per maand excl. btw voor 5 klantmerken, €199 per extra merk |
| `ai-marketing-automation-voor-bureaus.mdx:57` (FAQ) | elke werkruimte krijgt een eigen maandbudget aan credits | elk merk voegt 1.500 credits per maand toe aan één pot voor je bureau |
| `ai-marketing-automation-voor-bureaus.mdx:198` | service-niveaus, instapniveau, hogere niveaus voor tientallen merken, elk halfjaar herijkt | één creditpot, 1.500 credits per klantmerk, prijs 12 betaalde maanden vast |
| `clyde-vs-jasper-chatgpt-semrush.mdx:51` (FAQ) | Founding-tarief voor de eerste tien bureaus | €1.297 voor vijf klantmerken, +€199 tot vijftien, 1.500 credits per merk, drie plekken |
| `ai-marketing-medewerker.mdx:64,104` | service-niveaus die meeschalen | één creditpot, €1.297 voor vijf merken plus €199 per extra merk; bronvermelding "prijzen en credits" |
| `marketingbureau-schalen-met-ai.mdx:126` | de service-niveaus van een AI-collega | een AI-collega als Clyde; "de credits per merk" in plaats van "de bijbehorende capaciteit" |
| `ai-marketing-resultaat-in-de-praktijk.mdx:96` | de service-niveaus zijn werkruimte-geprijsd | Clyde is werkruimte-geprijsd; idem credits |
| `messages/{nl,en,es}.json` `apply.wizard.qualification.q1Title` | Welk tier denk je aan? / Which tier… / ¿Qué tier… | Welk aanbod spreekt je aan? / Which offer are you considering? / ¿Qué oferta te interesa? |

De vorige handover noemde alleen r145, r51 en r104; r57, r198, medewerker r64, schalen r126 en resultaat r96 vond de verificatie erbij. `apply.form.tierLabel` ("Welk service-niveau past het best?") wordt nergens gerenderd en bleef in dc9816d3 staan; hij gaat mee in de docs-PR, zie "Deploy en live".

**Bewust laten staan:** "je betaalt per werkruimte, de kosten lopen lineair mee" (`ai-marketing-automation-voor-bureaus.mdx:22`, `clyde-vs-jasper:85,125`, `marketingbureau-schalen-met-ai.mdx`). Dat klopt grofweg met +€199 per merk en noemt geen bedrag. "Een bureau kan tientallen merken bedienen" (`ai-marketing-agent-geheugen-en-leren.mdx:79`, `ai-agent-vs-ai-tool-marketing.mdx:156`) gaat over contextscheiding, niet over het aanbod. `ai-marketing-automation-guide.mdx:58,60` "Growth-Stage" is een bedrijfsfase.

Controle: `grep -rnE "997|tien bureaus|tien plekken|eerste tien|service-niveau|Growth|Professional|Enterprise|halve prijs|instapniveau|herijkt|maandbudget" content/` geeft alleen nog `ai-marketing-automation-guide.mdx:58,60` (Growth-Stage).

## Open voor Daley

1. **Privacyretentie noemt nog de oude tiers.** `/legal/privacy` en `/legal`: "bij Founding zolang het abonnement loopt, bij Growth en Professional 12 maanden, bij Enterprise zolang het account actief is". Niet gewijzigd: juridische tekst die ook voor bestaande klanten geldt; een retentieclausule herschrijven is een juridische wijziging.
2. **Doelgroep 5 tot 20 merken tegenover Founding tot 15.** "Bureaus met 5 tot 20 klantmerken" staat op ±17 plekken (home "Wat is Clyde?", `fit1` in de messages, chatbot-persona, `fit.ts`, `leadgen-kb.ts`, `ai-marketing-medewerker.mdx:126`, contentkalender-blog), naast "5 tot 15" in llms.txt en `concierge-kb.ts`. Dat is de doelgroepomschrijving, niet het aanbod, en het liep al uiteen vóór deze PR. Gelijktrekken naar 15 is een positioneringskeuze, en de chatbot-fitlogica (`src/lib/chatbot/fit.ts`) hangt eraan. Niet gewijzigd.
3. **ES is geen live locale** (zie boven).
4. **Lint volledig: 13 bestaande errors** in 6 niet-geraakte bestanden.
5. **Apply-API-enum** in `api/apply/route.ts` kent nog growth/professional/enterprise, zodat oude aanvragen blijven valideren; de UI biedt alleen Founding en "weet ik nog niet". De bevestigingsmail toont "Service-niveau: Founding".
6. **FMai-social-drafts 79061, 79075, 79076** noemen nog €997 en "tien merken" (gemeld door het app-spoor; niet in deze repo).

## Deploy en live

Baseline vóór de merge (curl op productie): `/nl/pricing` 31x `€997`, 0x `1.297`, 0x `0 van 3`.

- PR #117 squash-gemerged 2026-11-08T23:28:57Z als `a5517890` op main.
- Productiedeploy: GitHub-deployment 7643495621, `success` om 23:30:35Z (`futuremarketingai-9j55fuenf-future-marketing-ai.vercel.app`, alias `future-marketing.ai`).
- Live-check om 23:31:55Z met `live-check.sh https://future-marketing.ai`. Het script telt per URL een verplicht en een verboden patroon. €997 matcht alleen als prijs (`(€|&euro;|EUR ?|€) ?997`), omdat een kale 997 ook in een fonthash staat; oude tiers matchen op hun prijs `€x.997` of op "Growth/Professional/Enterprise tier/plan/pakket", omdat "Growth opportunity" een label van de AI-scan is.

| URL | Verplicht | Treffers | Verboden | Treffers |
|---|---|---|---|---|
| `/nl/pricing` | `€1.297` | 31 | €997 | 0 |
| `/nl/pricing` | `0 van 3` | 2 | | |
| `/nl/pricing` | JSON-LD `"price":"1297"` | 2 | oude tiers | 0 |
| `/en/pricing` | `€1,297` | 31 | €997 / oude tiers | 0 / 0 |
| `/llms.txt` | 1297 | 2 | €997 | 0 |
| `/llms.txt` | 3 founding spots | 2 | | |
| `/llms-full.txt` | 1297 | 3 | €997 | 0 |
| `/nl`, `/en`, `/nl/apply`, `/nl/founding-member` | | | €997 | 0 |
| `/nl/kennisbank/ai-marketing-automation-voor-bureaus` | 1.297 | 3 | €997 | 0 |
| `/nl/kennisbank/clyde-vs-jasper-chatgpt-semrush` | 1.297 | 5 | "tien bureaus" | 0 |
| `/nl/kennisbank/ai-marketing-medewerker` | 1.297 | 3 | "service-niveau" | 1 |

JSON-LD-prijzen op `/nl/pricing`: 1297 (2x), 199, 40, 160, 400.

De ene treffer op "service-niveau" staat niet in het artikel. Het is `apply.form.tierLabel` in de messages-payload die elke pagina naar de client stuurt (`\"tierLabel\":\"Welk service-niveau past het best?\"`); de sleutel wordt nergens gerenderd. Deze docs-PR zet hem in NL/EN/ES op "Welk aanbod past het best?" / "Which offer fits best?" / "¿Qué oferta encaja mejor?". De hercheck na de deploy van deze PR kan pas na de merge draaien; de uitkomst staat in `~/.claude/founding-a14/status.md` en in het ochtendrapport (fma-app `docs/audits/2026-11-09-founding-a14/`).
