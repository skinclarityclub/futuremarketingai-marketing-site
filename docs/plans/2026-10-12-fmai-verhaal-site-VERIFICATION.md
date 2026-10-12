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

## Taak 6: hero, screenshots, eindcontrole (gemeten 2026-10-12 ~23:00 lokale tijd, HEAD bbb384e)

Commits 106d85b (hero), ba0a7e7 (screens), 8fc2bff (legal-regels), bbb384e (video-menging). Alles gemeten vanuit
`fmai-nextjs/`, werkboom schoon. Visuele controle met `next start -p 3047` en Playwright op Chrome-channel (de eigen
Chromium van Playwright speelt geen H.264); script en beelden in de scratchpad van sessie 28c848f3 (`shoot-t6.cjs`, `vis/`).

| # | Claim | Verdict | Bewijs |
|---|---|---|---|
| 19 | Spline-robot volledig weg | PASS | `grep -rli 'splinetool\|HeroSpline\|hero-robot' src next.config.ts package.json scripts tests` geeft 0 bestanden. Weg: HeroSpline, ui/spline, useIsDesktop, scene.splinecode, hero-robot-preview.webp, regenerate-hero-preview.mjs; `npm uninstall @splinetool/react-spline @splinetool/runtime gsap` (gsap had alleen HeroSpline als gebruiker); lockfile-diff alleen verwijderingen (86 regels). CSP: `prod.spline.design` en `unpkg.com` weg (unpkg stond er sinds 84d6899 alleen voor de Spline-CDN, zie phase-15-playwright.mjs:744). |
| 20 | Kringvideo speelt op /nl desktop, met werkende pauzeknop | PASS | 1440x900: `video.paused=false`, `currentTime` 9,2 s na laden en 16,35 s later, readyState 4, 714x402 px; klik op de knop geeft `paused=true` en label "Speel de animatie af" (WCAG 2.2.2). Zelf bekeken: geen donkere 16:9-rechthoek meer dankzij `mix-blend-mode: lighten` (bbb384e), alle stationslabels en de staptekst leesbaar. |
| 21 | Telefoon en reduced-motion laden de video niet | PASS | 390x844: `paused=true`, readyState 0, 0 requests naar `.mp4`. 1440 met `reducedMotion: 'reduce'`: `paused=true`, t=0, 0 requests naar `.mp4`. Beide tonen de poster (`/images/clyde-kring-poster.webp`, 5,4 KB). |
| 22 | /en en /es tonen alleen de poster | PASS | /en 1440 en 390: geen `<video>`, `<img src=/images/clyde-kring-poster.webp alt="">` (alleen het logo, dus decoratief). /es geeft 200 op /en: `es` is sinds 2026-10-02 geen locale meer (`src/i18n/routing.ts`, redirect in next.config.ts). |
| 23 | Hero-alt en knoplabels in pariteit | PASS | `home.hero.imageAlt` beschrijft nu de animatie (nl/en/es), plus `home.hero.videoPause` en `videoPlay`. `T5_MAX=99999 node ~/.claude/fmai-site-tools/t5/check.mjs` geeft `parity OK`, exit 0. |
| 24 | contentkalender.webp en rapportage.webp vervangen door beeld met status klaar | PASS | Kring: `public/screenshots/jaaragenda.webp` uit `screens/s01a-jaaragenda.png` (SKC-ok, klaar); bijschrift "De jaaragenda van onze eerste klant, gebouwd op de strategie". Rapportage: `weekrapport.webp` uit `screens/s07d-weekrapport.png` (demo, klaar); bijschrift en alt noemen "demoklant" en "demodata" (§4, alleen mechanisme). Beide zelf bekeken, op /nl en /nl/skills/reporting gerenderd. Herkomst in MANIFEST.md, sectie "site (stream 3, fmai-site)". |
| 25 | De zes niet-bekeken screenshots zelf bekeken | PASS, met opmerkingen | portaal-review-clyde: demo-portaal met Clyde-paneel, gelijk aan s13-portaal-review-met-clyde, in orde. blog-factory, seo-geo, goedkeuringen, doelen, onboarding-11-stappen: bruikbaar, opmerkingen onder Open. |
| 26 | /legal toont de `\n`-regels als losse regels | PASS (na fix 8fc2bff) | Vóór de fix: `<p>` zonder white-space-regel, de regels liepen in elkaar (ook op origin/main, waar al 1 legaltekst een `\n` had). Na de fix: 2 alinea's met `\n`, computed `white-space: pre-wrap`, 8 en 11 gerenderde regels, op nl/en en 1440/390. Zelf bekeken op 390 (subverwerkers per categorie op een eigen regel). `/legal/privacy` gebruikte al `whitespace-pre-wrap` (LegalSectionPage.tsx:99,109). |
| 27 | Homepage-secties renderen op 1440 en 390 | PASS | kring, people, entries, lead per sectie gefotografeerd voor nl/en/es op beide breedtes en zelf bekeken (nl volledig, en/es steekproef): geen kale i18n-sleutels (regex op `home.`/`legal.`/`skills-*.` in body-tekst: 0), geen horizontale scroll, precies 1 `<h1>`. |
| 28 | Copy-, i18n- en llms-checks op de eindstand | PASS | `npm run check:copy` schoon, `check:i18n-orphans` OK (42 namespaces, 3 locales), `check:llms` OK, `npx tsc --noEmit` exit 0, allemaal op bbb384e. |
| 29 | `next build` slaagt | PASS | `npx next build` exit 0, "Compiled successfully", "Generating static pages (93/93)", op de eindstand van de code (de build volgde na de laatste codewijziging; daarna alleen commits). Exitcode vastgelegd, dus Open-punt 1 van taak 1-4 is dicht. |
| 30 | Lint voegt geen fouten toe | PASS | `npm run lint` exit 1 met 14 errors en 29 warnings, allemaal al op origin/main: 9 errors in bestanden die deze branch niet raakt (not-found, ChatInput, ChatWidget, MemoryLiveComparison, ChatSimulation, usePersonaChat), en 5 in ChatWidgetIsland.tsx, waar de origin/main-versie via `eslint --stdin` ook 5 geeft. Open-punt 2 van taak 1-4 is daarmee gemeten en dicht. |

Open na taak 6 (beslissingen voor Daley, niet gebouwd):

- **EN-hero heeft geen eigen video.** De kring-animatie bevat NL-tekst ("Dit is Clyde", "Elke klant een eigen kring"),
  dus /en toont alleen de logo-poster en heeft een lege rechterkolom. Een EN-render hoort bij stream 2b
  (`animatie/kring/scene.js`); of NL-video op /en beter is dan alleen het logo, is aan Daley.
- **Mobiel toont de poster als los logo** tussen de knop en de volgende sectie (~190 px). Dat volgt de opdracht
  ("mobiel poster"), maar levert weinig op; weglaten is één regel.
- **Onderste derde van de viewport is gedimd** door de vaste vignet in `HeroBackdrop` (fixed, z-0, over de inhoud).
  Op live prod ook zo ("Voor wie dit werkt" valt daar weg). Raakt stap 5 en het bijschrift van de kring tijdens het
  scrollen. Niet aangeraakt: bestaand ontwerp, buiten taak 6.
- **Kleine dingen in de bewaarde demo-screenshots:** de creditteller staat op 4.259-4.268 / 4.000 (boven het budget) op
  blog-factory, seo-geo, goedkeuringen en doelen; doelen.webp toont "FitnessFlow: 50 nieuwe leads via
  proefles-flow" als voltooid doel (fictief resultaat); onboarding-11-stappen.webp heeft een Engelstalige UI
  ("Workspace is ready", "Website: Not set"). Vervangen kan met s01c-doelen (Paul-ok); er is geen nieuwe
  onboarding-opname.
- **/legal laat twee privacy-subsecties weg** die /legal/privacy wel heeft (`platform_data`,
  `ai_readiness_assessment`): de gecombineerde pagina gebruikt een eigen, kortere lijst. Al zo op origin/main.
- Console lokaal: `/_vercel/speed-insights/script.js` 404 en MIME-fout; bestaat alleen op Vercel, geen fout van de branch.
- Nog steeds bij Daley: verwerkersovereenkomst, Meta-verwijder-URL, ROI-tool, `legal.last_updated` op de mergedatum,
  en push plus draft-PR.

## Fixen, mergen en prod-validatie (2026-10-12, sessie 5ace0030)

Daley 2026-10-12: "doe alles fixe en daarna merge en op productie valideren". Vóór de merge drie commits op de branch:
`dee89f1` (DPF-correctie), `0b9135b` (/legal-lijst) en `57fc93c` (verwerkersovereenkomst). PR #55 is gemerged als
merge commit `b79096d` (2026-10-12 16:51:56Z = 18:51 NL-tijd). Prod gemeten met `shoot-t6.cjs` (BASE=https://future-marketing.ai,
Chrome-channel, uitgebreid met Spline-requests, CSP-header en privacy-checks; script en beelden in de scratchpad van sessie
5ace0030, `vis-prod/`, `report.json`).

| # | Claim | Verdict | Bewijs |
|---|---|---|---|
| 31 | De legaltekst claimt geen DPF meer voor Anthropic en OpenAI | PASS | Volgens de research staan ze niet op dataprivacyframework.gov: Ierse entiteit plus SCC's (as of 2026-10, `subverwerkers-research.md`). Na `dee89f1` meet de grep op "Data Privacy Framework certific" 0 treffers in nl/en/es. De DPF-opsomming is nu "o.a. Vercel, Stripe, Google". Op de eindstand: t5 `parity OK` exit 0, `check:copy` exit 0, `check:i18n-orphans` OK, `check:llms` OK; legal-sleutels nl/en/es gelijk (54, 0 missend, 0 extra). Prod /nl en /en `/legal/privacy`: `dpfClaimForAiLabs=false`, `irishSccLine=true` op 1440 en 390. |
| 32 | /legal toont ook `ai_readiness_assessment` en `platform_data` | PASS | `0b9135b` (+2 regels), `tsc` exit 0. Prod /nl/legal bevat de Meta-platformtekst en de AI Readiness Scan-tekst; het aantal alinea's met regelafbrekingen gaat van 2 naar 3 (platform_data), alle drie `white-space: pre-wrap`. |
| 33 | Verwerkersovereenkomst volgt de privacyverklaring | PASS (CONCEPT) | `57fc93c`: Annex A telt 19 sub-verwerkers plus 2 derde partijen (Meta IG/FB, Telegram), dus alle 20 namen uit artikel 5, met entiteit, land, locatie, waarborg en DPA. Grep op Vapi, Twilio, Voice Agent, MFA, `futuremarketingai.com` en "AI Marketing Employee" geeft 0. Annex B volgt `data_retention`. Er staan 7 open punten bovenaan, en het concept wordt niet verstuurd zonder Daley. Gemeten aanvullingen: Hetzner-VPS `nbg1-dc3` (metadata-API), Resend verzendt vanuit eu-west-1 (MX van `send.future-marketing.ai`), QStash eu-central-1. Redis lost vanuit de EU op naar eu-central-1, vanuit Azië naar ap-southeast-1 (DNS plus AWS ip-ranges). In productie staat geen `SENTRY_DSN` (`vercel env ls`). |
| 34 | Meta-verwijderinstructie staat live | PASS | URL: https://future-marketing.ai/en/legal/privacy#privacy-platform_data (alinea "Deletion": app verwijderen plus een verzoek naar privacy@future-marketing.ai, binnen 30 dagen). Het anker staat op /nl en /en. Vóór de merge beloofde de EN-tekst op prod "We then receive a deletion request automatically"; na de merge geeft die zin 0 treffers. De callback-route bestaat alleen op `origin/feature/meta-data-deletion-callback` (`856227685`, niet gemerged). |
| 35 | `legal.last_updated` = mergedatum | PASS | Prod /nl/legal "Laatst bijgewerkt: 12 oktober 2026", /en "Last updated: October 12, 2026". De merge was op 12 oktober NL-tijd. |
| 36 | Homepage op prod | PASS | /nl 1440: video speelt (t 13,28 s, daarna 20,4 s, readyState 4, 714x402), de pauzeknop geeft `paused=true` en label "Speel de animatie af". /nl 390 en reduced-motion: `paused=true`, 0 requests naar `.mp4`. /en: poster, geen video. /es geeft 200 op /en. Overal 1 `<h1>`, 0 kale i18n-sleutels, geen horizontale scroll. Zelf bekeken: hero nl/en 1440 en de subverwerkers op 390 (elke categorie op een eigen regel). |
| 37 | Geen Spline meer en een schone CSP | PASS | Op alle 6 homepage-weergaven 0 requests naar spline/unpkg. De `content-security-policy`-header (708 tekens) noemt spline en unpkg niet. 0 console-errors, 0 CSP-violations. |
| 38 | gdpr-cleanup anonimiseert ook rijen met summary NULL | PASS (code en deploy), cronrun open | skinclarityclub/fma-app#1293 gemerged als `a183e3794`, gate groen (6m23s). De prod-deploy `fma-btbobve02` staat op `a183e3794` met alias app.future-marketing.ai. Prod HEAD-telling (consent false, >30 d): oude filter 0, nieuwe filter 1. De test faalt op de oude route. SELECT 2026-10-12 17:08Z: 1 achterstallige rij met summary NULL (2026-07-01), 0 geanonimiseerd. |
| 39 | Vercel-preview van #55 | DEELS | De build van head `57fc93c` is Ready (`futuremarketingai-9av7x5gti`). Bekijken lukte niet: de preview staat achter Vercel-SSO en de Chrome-browser is niet ingelogd bij Vercel. De visuele controle is daarom op prod gedaan (rij 36-37). |

Open na de merge:

- **gdpr-cleanup:** na de cronrun van 2026-11-01 04:00 UTC verwacht dezelfde SELECT 0 achterstallige rijen met NULL en 1 of meer geanonimiseerd.
- **Meta-dashboard (Daley):** de URL uit rij 34 invullen als "Data Deletion Instructions URL" van de Meta-app(s).
- **Verwerkersovereenkomst:** de 7 open punten in het document (partijen, Firecrawl zonder DPA, Upstash-replica in Singapore, Hetzner-DPA, Gemini-billing, ongetoetste TOM-beweringen, Meta/Telegram als derde partij).
- **Interne documenten met dezelfde DPF-fout** (niet live, niet aangepast): `docs/legal/dpia-ai-agent-processing.md:166,215` en `docs/wetgeving-aaas-nederland-eu.md:154`.
- **Perplexity:** de DPF-hercertificering is op 2026-10-08 verlopen (as of 2026-10-12, dataprivacyframework.gov). De legaltekst noemt Perplexity niet onder DPF, dus daar staat geen fout.
- Ongewijzigd uit "Open na taak 6": EN-hero, mobiele poster, vignet, demo-screenshots (creditteller, het fictieve voltooide doel op `doelen.webp`, Engelse onboarding-UI).

## Vervolg: de laatste acties (2026-10-13 ~00:40-01:10 lokale tijd)

Daley: "Jij moet de laatste acties doen".

| # | Claim | Verdict | Bewijs |
|---|---|---|---|
| 40 | De Meta-app heeft een verwijder-URL | PASS | Meta-app `1809736196273684` (FutureMarketingAI), App settings > Basic > User data deletion: "Data deletion instructions URL" = https://future-marketing.ai/en/legal/privacy#privacy-platform_data. Het veld was leeg. Opgeslagen en na herladen teruggelezen. De callback in het Instagram-product is niet aangeraakt; die is van de data-deletion-sessie (peers-sleutel `meta:deletion-instructions-url`). |
| 41 | Upstash Redis staat in de EU | PASS | `INFO` via de REST-API: `all_members:eu-central-1-r4,eu-central-1-r6`, `primary_member:eu-central-1-r4`, vanuit de EU (VPS) en vanuit Azië hetzelfde. Het ap-southeast-1-IP uit de DNS was een netwerk-ingang, geen kopie van de data. Open punt in de verwerkersovereenkomst gesloten. |
| 42 | Het Gemini-project valt onder de DPA voor betaalde diensten | PASS, met bijvangst | Een minimale call met `GEMINI_API_KEY` uit `.env.local` geeft 402 "Your prepayment credits are depleted", dus het project heeft prepaid billing. Bijvangst: het tegoed is op. Of prod dezelfde key gebruikt is niet gemeten, want de waarde is versleuteld. |
| 43 | Interne documenten claimen geen DPF meer voor Anthropic en OpenAI | PASS | `docs/legal/dpia-ai-agent-processing.md` (beschrijving 3.4, maatregelrij 3.4 nu "Deels", plus een kop "Verouderd") en `docs/wetgeving-aaas-nederland-eu.md:154`. Gemeten TOM-feiten staan in open punt 4 van de verwerkersovereenkomst: ufw en fail2ban actief, wachtwoord-login uit, geen TIA-document, audit-tabellen alleen per onderdeel. |

Nog steeds bij Daley: partijen en KvK, Firecrawl-DPA, Hetzner-DPA (accountpagina achter een botcontrole), de TOM-beweringen, Meta/Telegram in de privacyverklaring, Gemini-tegoed.
