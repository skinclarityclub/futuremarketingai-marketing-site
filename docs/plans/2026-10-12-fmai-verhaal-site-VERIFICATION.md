# VERIFICATION: FMai-verhaal site, taak 1-4 (tussenstand 2026-10-12)

Worktree C:/tmp/fmai-verhaal-site, branch feature/fmai-verhaal-ai-collega, HEAD 2697906, basis origin/main. fma-app gelezen via `origin/master` (git grep / git show), niet via de werkende checkout.

| # | Claim | Verdict | Bewijs |
|---|---|---|---|
| 1 | 2697906 op de branch, branch niet op remote | PASS | `git branch --contains 2697906` geeft alleen feature/fmai-verhaal-ai-collega; `git ls-remote --heads origin feature/fmai-verhaal-ai-collega` is leeg. `git diff 2697906 --stat` en `git status --short` zijn leeg: working tree = commit. |
| 2 | nl.json: strategy/watch weg; kring 5, people 4+4+note, entries 3, lead 4 | PASS | Node-check op messages/nl.json: `'strategy' in home` false, `'watch' in home` false. kring.steps s1-s5 (t+d) + caption; people.team.items i1-i4, people.client.items i1-i4, people.note; entries.steps s1-s3; lead.steps s1-s4. |
| 3 | page.tsx: volgorde, aria-labelledby, screenshot optioneel, alle sleutels bestaan | PASS | src/app/[locale]/page.tsx: ServicesBento r.205-209, kring r.220, people r.239-240 (`aria-labelledby="people"`, `SectionHeading id="people"` r.244), entries r.287, lead r.305, PlatformStrip r.317. StepsSection r.628 zet `aria-labelledby={id}` en `SectionHeading id={id}`; `screenshot?: string` (r.~642), lead krijgt er geen (r.305-310) en valt terug op 2 kolommen. Alle 49 t()-sleutels van de vier secties afgeleid uit de code en gecontroleerd tegen nl.json: 0 ontbrekend. public/screenshots/contentkalender.webp en rapportage.webp bestaan. |
| 4 | Geen founding-tekst belooft onbeperkte werkruimtes | PASS | Grep onbeperkt/unlimited/ilimitad in nl.json: r.1120 matrix-label, r.1129 legenda "fair use", r.1151 creditpakket "Max", r.1190-1191 FAQ over caps. Het matrixlabel `unlimited` wordt alleen gezet op ENTERPRISE (src/lib/skills-data.ts:104,131,157,184,230,256). chatbot: tool-data.ts:68 is Enterprise (`maxWorkspaces: -1`), support-kb.ts:199 is het Enterprise-rekenvoorbeeld (20 merken). Geen founding-treffer in nl.json of src/lib/chatbot. Placeholder `[DALEY: grens ~15]` staat er (o.a. nl.json r.308, 1102, 1429, 2077-2092, 2139). Buiten scope van deze claim: en.json en es.json beloven nog wel onbeperkt voor founding (zie Open). |
| 5 | FOUNDING_WORKSPACE_CAP niet toegevoegd; pricing-data.ts ongewijzigd | PASS | `grep -rn FOUNDING_WORKSPACE_CAP src` leeg; `git diff origin/main..2697906 -- src/lib/pricing-data.ts` leeg. |
| 6 | tsc exit 0; check:copy NL alleen placeholders | PASS | `npx tsc --noEmit` exit 0. `npm run check:copy` exit 1, 159 treffers: NL (messages/nl.json) 9, alle placeholder. Overig: EN 73 sleutelverschil + 2 "eu"; ES 64 sleutelverschil; 11 placeholder in src/lib/chatbot (concierge-kb 1, support-kb 6, tool-data 4). |
| 7 | eslint op gewijzigde .ts/.tsx exit 0 | FAIL | Exit 1, 5 errors, alle in src/components/chatbot/ChatWidgetIsland.tsx r.381, 395, 416 (setState in effect), 445, 451 (React Compiler memoization). Het diff van 2697906 raakt dat bestand alleen op r.22, 45, 66, 87 (commentaar en welkomststrings), dus de fouten lijken al op origin/main te staan. Dat laatste is afgeleid uit de regelnummers, niet gemeten op de basis. De overige 18 bestanden: geen meldingen. |
| 8 | Build 93/93 exit 0 | PASS (afgeleid) | build-t4.log r.7 "Compiled successfully", r.9 TypeScript klaar, r.556 "Generating static pages (93/93)", r.560+ routetabel. Een exitcode staat niet in het log. Alle in 2697906 gewijzigde bestanden hebben mtime ≤ 17:51:58, log eindigt 17:53:05; de starttijd van de build staat niet in het log, dus "niets gewijzigd tussen build en commit" is niet bewezen. |
| 9 | Lead-copy klopt met fma-app origin/master | PASS, met 1 kanttekening | Stap 1 reactie/DM: src/lib/instagram-dm/match.ts:10 (`RuleTrigger = 'comment' \| 'dm' ...`), poll.ts:12 (`listComments`), decide.ts:106-107 (rule_reply), clyde.ts:52-55 (Clyde-antwoord uit brand_voice/products/ctas), decide.ts:113 (handover = naar inbox). Stap 2 link: create-link.ts:12 (`fma_tracked_links`), :56 (`placement: 'dm'`), process.ts:7+474-482 (`resolveRuleReplyText`); redirect src/app/l/[code]/route.ts:42 (`classifyBot`), :50 (`isBot`), :63 (302 naar `redirectUrl`); bots: src/lib/tracked-links/bot.ts:2-9 (markers), :22 (HEAD), :23 (geen UA), :27-28 (`meta_link_scan`); tellen alleen niet-bot: overview.ts:199 (`.eq('is_bot', false)`). Stap 3 formulier: src/app/api/webhooks/leads/route.ts:24-26 (`fmc`), :64-65 (`findOwnDmLink`), tracked_link_id op de lead. Stap 4 trechter: src/app/(protected)/social/page.tsx:154 (`FunnelBlock`), src/components/social/funnel-block.tsx:139-143 (`biggestDrop`, één zin, klik of aanvraag). Geen link op posts: links bestaan alleen met `placement: 'dm'` (create-link.ts:56, :91, :172). De copy noemt geen attributie in rapporten. Kanttekening: zie bullet in Open (rule_reply versus Clyde). |
| 10 | legal.* alleen dienstnaam + founding-grens | PASS | Sleutelvergelijking origin/main vs 2697906 op legal.*: 7 sleutels veranderen. Alleen dienstnaam (zin-voor-zin diff): sections.terms.content, terms.subsections.service_description.content, terms.subsections.ai_output_disclaimer.content, sections.privacy.content, privacy.subsections.purpose_of_processing.content, privacy.subsections.ai_data_processing.content. Founding-grens met placeholder: sections.terms.subsections.subscription_terms.content ("onbeperkt aantal werkruimtes" wordt "maximaal [DALEY: grens ~15] werkruimtes, daarboven [DALEY: meerprijs] per extra werkruimte"). Geen andere zin in die zeven teksten is veranderd. |
| 11 | EN/ES missen kring/people/entries/lead | PASS | Node-check: en.json en es.json hebben `home.kring/people/entries/lead` niet (false); beide hebben nog `home.strategy`, en.json ook nog `home.watch`. check:copy meldt de ontbrekende sleutels; build-t4.log bevat 98 MISSING_MESSAGE-regels, 49 voor `home` (en). De build slaagt toch, dus /en en /es tonen kale sleutels (taak 5). |

## Open

- Exitcode van de build is niet vastgelegd; of er iets veranderde tussen build en commit is niet te meten (zie rij 8).
- ESLint-fouten in ChatWidgetIsland.tsx zijn niet op origin/main gemeten; alleen uit de regelnummers afgeleid.
- Live gedrag van de DM-keten (Meta-verzending, memory noemt code 10 op DM-replies voor @skinclarityclub) en of het formulier op een klantsite echt `fmc` doorgeeft, zijn niet gemeten. Claim 9 toetst de code, niet productie.
- Visuele weergave van /nl op 1440 en 390 is niet bekeken.
- en.json en es.json noemen founding nog "unlimited workspaces" / "ilimitados" (en.json r.308, 1055, 1382, 1802, 2030-2045; es.json r.308, 1031, 1358, 1778, 2006-2021). Claim 4 vroeg alleen om nl.json en src/lib/chatbot; dit valt onder taak 5.
- es.json mist verder `skills-template.toc.kennisbank` en `skills-template.kennisbank.title/intro` (check:copy).
- Kanttekening bij claim 9: een reactie met het gekozen woord activeert een regel met vaste tekst (decide.ts:107 `rule_reply`, process.ts:474-482); het antwoord uit merkkennis is `clyde_reply` op een DM (clyde.ts:52-55). De copy in home.lead.steps.s1.d zegt "antwoordt Clyde met de kennis van dat merk" voor beide. Aan te scherpen vóór de eindcontrole.
- Trechter is per Instagram-account, niet per klant als eenheid (funnel-block toont `accounts`); acceptabel zolang een klant één account heeft.

De eindverificatie (lint, build, /nl /en /es op 1440 en 390) volgt bij de afronding van taak 6.

## Nagekomen (na deze meting)

- **Claim 9, kanttekening verwerkt.** `home.lead.steps.s1.d` zegt nu dat een reactie met het gekozen woord een DM
  met de vaste tekst van de regel krijgt (`rule_reply`, fma-app decide.ts:107), en dat alleen andere DM's een
  antwoord uit merkkennis krijgen (`clyde_reply`). `s4.d` zegt "Per Instagram-account" in plaats van "Per klant",
  omdat het funnel-blok per account telt. `npm run check:copy` daarna: NL nog steeds alleen placeholdertreffers
  (159 totaal, ongewijzigd).
- **Claim 7.** De 5 ESLint-fouten in `ChatWidgetIsland.tsx` zijn in de vorige handover (stream 3, bij `a7fe90e`)
  gemeten op een kopie van de origin/main-versie van dat bestand en stonden daar ook. Geen werk voor deze stream.

## Taak 5: EN/ES (gemeten 2026-10-12 22:20 lokale tijd, HEAD 8320b0a)

Commits 43a90a2, 211565c, 0bbd4d4, 283c529, ed0449a, 2b92091 (messages) en 8320b0a (src/lib/chatbot/skill-i18n.ts).
Alles gemeten vanuit `fmai-nextjs/`, de werkboom was schoon.

| # | Claim | Verdict | Bewijs |
|---|---|---|---|
| 12 | EN/ES volgen elke NL-sleutel die op de branch veranderde | PASS | `T5_MAX=99999 node ~/.claude/fmai-site-tools/t5/check.mjs` geeft `parity OK`, exit 0. Bij de baseline waren het 1038 issues. |
| 13 | Copy-check schoon (vervangt rij 6) | PASS | `npm run check:copy` geeft `check-verhaal-copy: schoon`, exit 0. Er staan geen `[DALEY:`-placeholders meer. |
| 14 | Geen verweesde of ontbrekende i18n-sleutels | PASS | `npm run check:i18n-orphans` geeft `OK (42 namespaces, 3 locales)`, exit 0. `prune.mjs` verwijderde 0 sleutels in EN en 0 in ES. |
| 15 | llms.txt en llms-full.txt kloppen met de SSoT | PASS | `npm run check:llms` geeft OK (12 skills: 10 live, 2 coming soon; max 10 partners per jaar; 10 founding-plekken), exit 0. |
| 16 | Types kloppen na de overlay-edit | PASS | `npx tsc --noEmit` exit 0. |
| 17 | De 9 chatbot-overlays volgen skills-data.ts (NL) | PASS (gelezen, geen test) | In skill-i18n.ts zijn deze claims weg: optimal timing, Facebook, 1.500-3.000 woorden, automatisch publiceren, direct naar Meta publiceren, leads/CPL, A/B, real-time, anomaly, keyword ranking, de Clyde-feature "Knowledge base with search". Voice Agent en Reel Builder heten nu "Coming soon / Próximamente … Not available yet / Todavía no disponible". lead-qualifier, email-management en manychat zijn niet aangeraakt (zij waren al bijgewerkt in 0bc13a6). |
| 18 | Drift buiten de werklijst opgeruimd | PASS | Een token-sweep (EN/ES-tokens die niet in NL voorkomen) vond 2 ES-claims: `skills-reporting.features.feature1.body` beloofde "lunes 08:00" en `skills-clyde.features.feature3.body` noemde Slack. Beide zijn rechtgezet in 283c529 en ed0449a. "Vapi" staat nog 2 keer per locale in `skills-voice-agent` q5; dat is de bewuste vergelijkingsvraag. |

Open na taak 5:

- `legal.last_updated` zegt "October 12, 2026" / "12 de octubre de 2026" (NL idem). Zet het bij de merge op de mergedatum.
- Niet gemeten: `next build`, lint, en de visuele controle van /nl /en /es op 1440 en 390 px, inclusief /legal (de `\n`-regels). Dat hoort bij taak 6.
