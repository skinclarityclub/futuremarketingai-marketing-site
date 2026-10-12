# Claim-audit FMai-site (stream 3), brief voor elke auditor

Doel: elke FEITELIJKE claim op de marketingsite toetsen tegen wat FMai (de app, repo fma-app) vandaag echt doet.
Je schrijft GEEN copy en wijzigt GEEN bestanden in een repo. Je levert een tabel met bevindingen.

## Bronnen (alles read-only)

- Site-tekst: `C:/tmp/fmai-verhaal-site/fmai-nextjs/messages/nl.json` (NL leidt). Lees jouw namespaces met node:
  `node -e "const m=require('C:/tmp/fmai-verhaal-site/fmai-nextjs/messages/nl.json'); console.log(JSON.stringify(m['<ns>'],null,1))"`
- De app: repo `C:/Users/daley/Desktop/fma-app`, ALTIJD via `origin/master`, NOOIT de werkende checkout
  (die is van een andere sessie). Gebruik `git -C C:/Users/daley/Desktop/fma-app grep -n -i "<x>" origin/master -- src`
  en `git -C C:/Users/daley/Desktop/fma-app show origin/master:<pad>`. Geen checkout, geen fetch, geen schrijfacties.
- Productie-DB (Supabase project `nurdldgqxseunotmygzn`): alleen `SELECT` via de tool `mcp__supabase__execute_sql`
  (laden met ToolSearch `select:mcp__supabase__execute_sql`). Nooit INSERT/UPDATE/DELETE/DDL. Tabellen van de app
  hebben prefix `fma_`; kolomnamen eerst opvragen via information_schema als je twijfelt.
- Productregels (spec, besloten door Daley 2026-10-12):
  - Claim alleen wat LIVE is. Richting mag als richting ("we bouwen aan"), nooit als bestaand.
  - Live volgens de spec (2026-10-12): strategielaag (doelen, pijlers), research, Blog Factory, SEO/GEO, weekrapport
    SEO op WhatsApp, Clyde in elk scherm, Clyde op WhatsApp en Telegram (bureau), Clyde op WhatsApp voor de klant van
    het bureau (eigen koppeling), klantdashboard + contentbibliotheek + aanvragen via formulier (`/client/*`),
    DM-inbox + link-attributie post→DM→formulier (sinds 2026-10-11, nog 0 leads toegeschreven), autonomie per taak
    (observe/propose/act_report/full), teamtoewijzing aan klanten, weekrapporten.
  - NIET live / richting: aanvraag via Clyde-gesprek of WhatsApp, mobiele app, kennisbank als nette weergave,
    "analytics compleet", Mistral EU-taalmodel (alleen op verzoek, niet gebouwd), BYOK (nooit noemen).
  - Publiceren gebeurt vandaag op Instagram en LinkedIn (prod 60 d: IG 259 posts over 10 accounts, LinkedIn 5); de
    rest van Postiz op verzoek.
  - Verboden in copy: "AI-medewerker/werknemer/employee", "100% EU", "geen US-clouds", volumecijfers als bewijs,
    "X uur bespaard" als kop, "24/7", percentages als resultaat, "vervangt personeel".
  - EU: data, servers en database in de EU; het taalmodel draait standaard bij Anthropic (VS).
  - SKC-casecijfers en Sindy-citaten kwamen uit een MOCKUP-transcript; elk cijfer of citaat zonder bron is verdacht.

## Wat telt als claim

Een bewering die waar of onwaar kan zijn over het product, de dienst of resultaten: een koppeling ("native met HubSpot"),
een kanaal, een functie, een termijn ("live in 4 weken", "elk uur ververst"), een getal, een garantie, een
compliance-claim (GDPR, AI Act, ISO, ZDR), een bewaartermijn, een prijs/limiet, een status (live / coming soon).
Geen claim: smaak, toon, een voorbeeld dat duidelijk als voorbeeld staat, een vraag.

## Verdicts

- `ONWAAR`: de app doet het aantoonbaar niet of anders (bewijs: wat er wel is, of dat het ontbreekt na grondig zoeken).
- `NIET-LIVE`: bestaat in code maar staat uit / is niet gebruikt in prod / is richting die als bestaand staat.
- `ONBEWEZEN`: niet te toetsen in code of DB (een cijfer, een historische bewering, een externe claim). Noem wat je
  hebt geprobeerd.
- `VERBODEN`: botst met de woordregels hierboven.
- WAAR-claims rapporteer je NIET (alleen in de telling).

Zoek grondig vóór je ONWAAR zegt: probeer synoniemen (camelCase, snake_case, kebab-case), de i18n-teksten van de app
(`src/lib/i18n/messages/*.ts`), routes (`src/app/(protected)/**`), `src/lib/skills.ts` (canonieke lijst vaardigheden
met status) en de DB. Bij twijfel ONBEWEZEN, nooit een gok.

## Output

Schrijf je volledige tabel naar het bestand dat je opdracht noemt (markdown), kolommen:
`sleutel | claim (kort citaat) | verdict | bewijs (bestand:regel of SQL-resultaat, 1 regel) | wat wel waar is (1 regel, feit, geen copy)`

Geef als eindantwoord ALLEEN: het pad van je bestand, de telling per verdict (incl. aantal WAAR), en maximaal 5 bullets
met de zwaarste bevindingen. Geen logs, geen bestandsinhoud.
