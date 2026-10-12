# FMai-site: Clyde, de AI-collega van je bureau (implementatieplan, stream 3)

> **Uitvoering:** native in de hoofdloop (copy schrijf ik zelf, global regel). Stappen met `- [ ]`.

**Doel:** future-marketing.ai vertelt het goedgekeurde verhaal: Clyde als AI-collega, de kring, de mensen, de ingangen,
van post naar lead, controle en EU, zonder volumecijfers of claims die niet live zijn.

**Aanpak:** copy-werk in `fmai-nextjs/messages/{nl,en,es}.json` plus de paar plekken in `src/` die tekst hardcoden.
Nieuwe secties hergebruiken `StepsSection` in `src/app/[locale]/page.tsx`; alleen "mensen" krijgt een klein eigen blok.
Een controlescript bewijst de eindtoestand; build en screenshots op 1440 en 390 px bewijzen dat het rendert.

**Stack:** Next.js 16, next-intl 4.8, Tailwind 4. **Spec:** `fma-app` branch `docs/fmai-verhaal-ai-collega`,
`docs/superpowers/specs/2026-10-12-fmai-verhaal-ai-collega-design.md` (§3, §3.6, §4, §8, §11.1).

## Vaste regels (uit de spec)

- Clyde is het merk, "AI-collega" de omschrijving: "Clyde, de AI-collega van je bureau". Nooit "AI Collega" als losse
  naam, kop of zoekterm (concurrent aicollegas.nl). EN "AI colleague", ES "compañero de IA".
- Vermijd: AI-medewerker, digitale werknemer, AI employee, empleado; "vervangt personeel", "zonder extra fte" als belofte;
  "X uur bespaard" als kop; "24/7"; "100% EU".
- EU-zin: "data, servers en database in de EU; het taalmodel draait standaard bij Anthropic (VS), EU-only via Mistral op
  verzoek". Geen BYOK noemen.
- Alleen live stations claimen (§4). Aanvragen alleen "vanuit haar eigen dashboard". Geen "teamlid ziet in Clyde's
  geheugen alleen zijn klanten". Kennisbank en "analytics compleet" niet als bestaand.
- Geen volumetelling als kop of hoofdbewijs; kleine getallen alleen als concreet verhaal, nooit als percentage.
- ICP publiek: "bureaus met 5 tot 20 mensen en 5 tot 20 merken". Solo niet benadrukken.
- Founding: grens rond 15 werkruimtes; exact getal en meerprijs bevestigt Daley. Tot dan een zichtbare placeholder
  `[DALEY: ...]` die het controlescript laat falen, zodat hij niet ongemerkt live gaat.
- Slugs en ids blijven (glossary-id `ai-marketing-medewerker`, blog-slugs): URL's breken niet.
- Citaten van echte mensen (Sindy) herschrijf ik niet; wat niet past gaat weg of gaat als vraag naar Daley.
- NL leidt; EN/ES volgen uit de definitieve NL. Geen merge of deploy zonder Daley's ja; juridische tekst eerst naar hem.

## Wat bewust NIET in deze PR zit

- Blogartikelen in `content/blog/` (≈300 keer "medewerker", één artikel heeft het woord als slug): vraag aan Daley.
- App-kant van de founding-grens (`fma-app/src/lib/skills.ts`): stream P onder de plan-gate.
- Hero-animatie en nieuwe screenshots: taak 6, wacht op stream 2a/2b.

## Review-focus (wat geen test vangt)

1. Mensen-tekst ("woorden over menselijke medewerkers" in de AI-scan en in `skills-data`) mag niet mee-vervangen worden:
   het script heeft een expliciete toelatingslijst per sleutel.
2. Een EN/ES-sleutel die in NL wel en daar niet bestaat (of andersom) laat next-intl een sleutelnaam renderen:
   het script vergelijkt de sleutelsets van de drie locales.
3. Lange NL-koppen op 390 px (Space Grotesk): screenshot per nieuwe sectie op telefoonbreedte.
4. De chatbot op de site herhaalt claims uit `src/lib/chatbot/**`: dezelfde regels gelden daar.
5. Juridische tekst: woord en founding-grens wijzigen in voorwaarden/privacy, maar niets anders.

---

### Taak 1: controlescript (de toets voor alles hierna)

**Bestanden:** maak `fmai-nextjs/scripts/check-verhaal-copy.mjs`; voeg `"check:copy"` toe aan `package.json`.

- [ ] Script vlakt `messages/*.json` af tot `sleutel = waarde` en leest `src/**/*.{ts,tsx}` en `public/llms*.txt` per regel.
  Regels (hoofdletterongevoelig): `medewerker|werknemer|employee|empleado` (behalve toegelaten sleutels/regels over mensen),
  `100 ?% ?EU|US-clouds|US clouds|nubes de EE`, `36 posts|36 per week|21 carrousels|5\.000 ?/ ?maand|EUR 5\.000|\+18 ?%|\+34 ?%`,
  `5 tot 30|10 tot 50|5 to 30|10 to 50|5 a 30|10 a 50`, `\bAI Collega`, `\[DALEY:`, plus sleutelset-gelijkheid nl/en/es.
  Exit 1 met een lijst `bestand:sleutel/regel  regel  tekst`.
- [ ] Draai: `node scripts/check-verhaal-copy.mjs`. Verwacht nu: FAIL met de inventaris (≈60 per locale + src).
  Die uitvoer is de werklijst voor taak 2 en 3.

### Taak 2: woordwissel nl/en/es (meta, glossary, Clyde-pagina, about, pricing, chatbot, mails, OG, JSON-LD)

**Bestanden:** `messages/{nl,en,es}.json`; `src/lib/{og-theme,seo-config,glossary?,skills-data}.ts`;
`src/lib/chatbot/{personas/clyde,skill-i18n,knowledge/*,tools/*}.ts`; `src/components/chatbot/ChatWidgetIsland.tsx`;
`src/lib/email/apply-templates.ts`; `src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx:147`.

- [ ] Per locale een patchbestand (scratchpad, niet in de repo) `sleutel → nieuwe waarde`, toegepast met een
  roundtrip die CRLF en volgorde behoudt (gemeten: `JSON.stringify(x,null,2)` met CRLF + slot-CRLF is byte-gelijk).
- [ ] Hero: tagline "De <accent>AI-collega</accent> van je bureau." Meta-titel "FutureMarketingAI: Clyde, de AI-collega
  van je bureau". Glossary-term "Clyde, de AI-collega van je bureau" (id blijft).
- [ ] "Net zoals een vaste/goede medewerker" → "collega"; "AI-medewerker tijdperk" (about) → herschreven zonder het woord.
- [ ] Voorwaarden/privacy: alleen de dienstnaam ("AI Marketing Medewerker-diensten" → "de diensten van Clyde, de
  AI-collega voor bureaus"). Diff apart bewaren voor Daley.
- [ ] Sindy's citaat op de case-kaart ("werkt als een vaste medewerker") niet herschrijven: van de kaart halen
  (de testimonial verderop blijft) en als vraag naar Daley.
- [ ] Draai het script: de woordregel is leeg in alle drie locales en `src/`. Commit
  `content(i18n): Clyde is de AI-collega van je bureau, niet een medewerker`.

### Taak 3: cijfers, EU, WhatsApp, kanalen (§8.3-8.5, §8.7)

**Bestanden:** `messages/*.json` (home.services.clyde, home.stats, home.caseStudyCard, home.memoryUsp, home.pillars,
case_studies, skills-social-media, skills-manychat, memory, about); `src/app/[locale]/page.tsx` (TrustSignalsGrid weg);
`src/components/marketing/PlatformStrip.tsx`.

- [ ] Clyde-voorbeeldantwoorden zonder tellingen (wat hij deed, niet hoeveel). Case-kaart en casepagina: volume eruit,
  mechanisme erin (4 merken met elk een eigen stem, Sindy keurt goed, 3 accounts volgens één agenda).
- [ ] TrustSignalsGrid ("Het bewijs in cijfers": 36/week, 100% EU) van de homepage; ongebruikte `home.stats`-sleutels weg.
- [ ] "9 vaardigheden" op de memory-pagina → klopt met 10 live / 12 totaal.
- [ ] EU-zin uit de regels overal waar "100% EU", "geen US-clouds", "self-hosted EU-servers, data nooit naar de VS" staat.
  (De eigen privacyverklaring noemt Anthropic en OpenAI al als VS-subverwerkers.)
- [ ] ManyChat-FAQ: klant-WhatsApp niet meer "roadmap". Clyde op WhatsApp voor de klant van het bureau is live
  (eigen koppeling); WhatsApp Business als DM-kanaal voor eindklanten blijft niet geclaimd.
- [ ] Kanalen, gemeten 2026-10-12 op prod (`content_schedule`, 60 d): Instagram 259 gepubliceerd over 10 accounts,
  LinkedIn 5 (1 account, sinds 2026-10-05). Eén waarheid: publiceert vandaag op Instagram en LinkedIn, Clyde zelf op
  WhatsApp en Telegram, de rest van Postiz op verzoek. LinkedIn naar de LIVE-rij in `PlatformStrip`, comment bijwerken.
  Social-pagina die Facebook als live noemt in lijn brengen.
- [ ] Script: cijfer-, EU- en ICP-regel leeg. Commit `content(proof): volume en 100% EU eruit, kanalen zoals productie`.

### Taak 4: nieuwe NL-secties, ICP, founding

**Bestanden:** `messages/nl.json` (home.kring, home.people, home.entries, home.lead, home.pillars herschreven, home.icp,
pricing/founding-member founding-copy); `src/app/[locale]/page.tsx`; `src/lib/constants.ts`.

- [ ] Kring (vervangt `strategy`): `StepsSection` met 5 stations doel → research → agenda → uitvoering → analytics,
  kop dat Clyde in elk station zit en per merk onthoudt. Screenshot blijft `contentkalender.webp` tot 2a levert.
- [ ] Mensen (nieuw, direct erna): twee kolommen "Je team" (toegewezen aan klanten, overzicht, rapporten vanzelf, Clyde haalt
  werk weg en vervangt niemand) en "Je klant" (eigen dashboard, goedkeuren, contentbibliotheek, aanvragen vanuit haar
  dashboard, eigen Clyde ook op WhatsApp). `StepsSection.screenshot` wordt optioneel.
- [ ] Drie ingangen (vervangt `watch`): dashboard (Clyde in elk scherm), WhatsApp (bereikbaar, meldt zich zelf, vrijdagrapport),
  mobiele app als "in aanbouw" (richting, niet als bestaand).
- [ ] Van post naar lead (nieuw, na de kanalen): post → link met tracking → DM, Clyde antwoordt met merkkennis → formulier,
  lead bij de juiste klant. Mechanisme, geen resultaatcijfer.
- [ ] Controle en EU (herschrijft `pillars`): autonomie per taak + goedkeuring, de EU-zin, 1:1 met Daley.
- [ ] ICP `fit1` en `notFit4` naar "5 tot 20 mensen en 5 tot 20 merken"; de andere plekken uit taak 1 mee.
- [ ] Founding: "onbeperkt aantal werkruimtes" → "tot `{cap}` werkruimtes, daarna `[DALEY: meerprijs per werkruimte]`".
  `FOUNDING_WORKSPACE_CAP = 15` in `constants.ts` met comment dat Daley het getal bevestigt. `pricing-data.ts` niet aanraken
  tot het getal en de meerprijs vastliggen (de slider-vergelijking hangt eraan).
- [ ] Build + screenshots NL 1440/390 → naar Daley voor de copy. Commit `content(home): de kring, de mensen, de ingangen`.

### Taak 5: EN en ES uit de definitieve NL

- [ ] Na Daley's akkoord op de NL-copy (of zijn wijzigingen): dezelfde sleutels in `en.json` en `es.json`, zelf geschreven.
- [ ] Script: sleutelsets gelijk, alle regels leeg behalve `[DALEY:`. Build groen. Commit `content(i18n): EN/ES volgen de nieuwe NL`.

### Taak 6: hero en screenshots (wacht op 2a/2b)

- [ ] Lees `C:/tmp/fmai-verhaal-beeld/MANIFEST.md`; alleen bestanden met toestemmingsregel. Robot (Spline) eruit, de
  netwerkloop erin; demo-org-screens vervangen. Build + screenshots.

### Afronding

- [ ] `npm run build`, `npm run lint`, `node scripts/check-verhaal-copy.mjs` (alleen nog de `[DALEY:`-regels als het getal
  er niet is), screenshots /nl /en /es op 1440 en 390 px zelf bekeken.
- [ ] `docs/plans/2026-10-12-fmai-verhaal-site-VERIFICATION.md`: wat gemeten, met welk commando, wat open bleef.
- [ ] Draft-PR; merge en deploy alleen op Daley's ja.
