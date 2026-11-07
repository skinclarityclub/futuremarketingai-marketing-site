# Golf 7, de cases: implementatieplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** /case-studies (nu 404) wordt een hub, /case-studies/skinclarity-club gaat naar het sjabloon van de bewijspagina's met een echte week, en /case-studies/saleslobe komt erbij. NL en EN. Eerst een prototype dat Daley goedkeurt, daarna de port in twee PR's.

**Architecture:** Zoals golf 6. Het prototype staat in `R`: per pagina een `golf7-<pagina>.tpl.html`, met `shared.css` en de bestaande `golf6.css` (één sjabloon voor alle bewijspagina's, [02] §5). Komen er regels bij, dan staan ze in `golf6.css` onder `.g6`. `build10.py` bouwt ook de golf 7-pagina's en toetst dezelfde copyregels. `tools/m-g6.mjs` meet ze via `PAGES`. De port schrijft per pagina een server component met `proof.css`, plus de berichten in `nl.json`, `en.json` en `es.json` (es spiegelt en).

**Tech Stack:** Next.js 16, next-intl 4.8, Python 3 (build), Playwright (meten).

**Spec:**
- `A/10-siteplan.md` r723-755 (hub, SKC, SalesLobe) en r966-1000 ("SalesLobe als usecase").
- `A/02-paginas-verdieping-en-bewijs.md` r215-296 (SKC, hub, SalesLobe) en r445-458 (het sjabloon).
- `A/KEUZES-2026-11-03.md`: keuze 10 ("Wij bouwen Clyde en zetten hem in voor twee klanten, SKC en SalesLobe"), keuze 12 (SalesLobe zonder aantallen, logo en gezicht tot Paul antwoordt; het bericht aan Paul schrijven we voor Daley uit en Daley stuurt het zelf).

Daarbij: `A` = `C:/Users/daley/Desktop/80-Archief/fma-app-audits/2026-11-02-website-audit/design/siteplan`, `R` = `.../design/ronde1b`, `P` = `.../design/port`.

## Daleys keuzes (2026-11-07)

| Vraag | Antwoord |
|---|---|
| Volgende golf | **Golf 7: Cases** (AskUserQuestion, na de merge van #99) |
| Vragen vooraf | "go": geen vragen vooraf; ik volg het siteplan, splits in 7a en 7b en schrijf SKC in de verleden tijd tot er weer posts live gaan |

## Mijn keuzes (te toetsen in het prototype)

- **Twee PR's.** 7a = de hub plus de SKC-case plus het menu en de footer naar de hub. 7b = de SalesLobe-case, pas live na Pauls akkoord op tekst en beeld. In 7a staat de SalesLobe-kaart op de hub zonder link naar een casepagina. Op de home staat diezelfde kaart al met logo, Paul en "23 posts online" (Daleys ja van 2026-11-04, golf 4), dus de kaart zelf vraagt geen nieuw akkoord.
- **SKC in de verleden tijd.** De week op de pagina is 19 tot en met 25 oktober 2026, de laatste volle week. Geen "elke week" en geen "nu draait".
- **Geen vaardighedenlijst op de SKC-case.** Alleen wat aantoonbaar voor SKC draait: drie Instagram-accounts met elk een eigen stem, één geheugen, en een post gaat pas live na goedkeuring in de app. Lead Qualifier, ManyChat, Ad Manager, e-mail en de "nog geen"- en "volgt"-regels gaan eruit.
- **Geen aandelen** (38,6% / 33,5% / 27,8%) en geen volumecijfer als kop. Een aantal mag in de lopende tekst als het een structuurfeit is.
- **Geen weekrapportscherm.** Er bestaat voor SKC en SalesLobe geen rapport-editie (SELECT 2026-11-07).
- **Schema SKC:** Article met `author` FutureMarketingAI, de SKC-Organization als `about`, de Person-node van Sindy weg, Article-`url` gelijk aan de canonical per taal.
- **Hub-schema:** CollectionPage met ItemList. Dat is een nieuw JSON-LD-type op een nieuwe URL. Er verandert geen bestaande URL en geen slug, dus geen Codex-gate (zoals golf 6).

## Afhankelijkheden, gemeten op 2026-11-07 (prod, alleen SELECT)

- **SKC:** 176 posts geplaatst, van 2026-05-22 tot 2026-10-27; daarvan 175 met `review_status='approved'` en één shop-rij met `pending_review`. Sinds 2026-10-27 is er niets geplaatst; 28 concepten van 28 oktober tot 12 november wachten op review. `active_skills`: socialMedia, reporting, intelligence, blogFactory, emailManagement, leadQualifier, adCreator, seoAnalyst, clyde, socialCommandCenter (geen manychatDm).
- **De week van 19 oktober:** skinclarity_club 4, skinclarity_shop 4, sindy_huidtherapeut 5, alle carrousels.
- **Klantlogin SKC:** één `fma_client_members`-rij met de rol `manager`, een skinclarityclub.com-adres, geen lid van de bureau-organisatie, laatst ingelogd 2026-11-03. Wie dat is en wat die persoon ziet, is ONBEKEND. "Clyde op WhatsApp" is niet gemeten. Beide gaan dus niet op de pagina.
- **Wie goedkeurde:** `fma_content_approval_history` en `fma_content_approvals` hebben 0 goedkeuringen met een gebruiker op alle geplaatste rijen van SKC en SalesLobe. De pagina noemt dus geen persoon bij het goedkeuren, alleen het mechanisme.
- **SalesLobe:** 24 posts geplaatst (Instagram 9, laatste 2026-10-29; LinkedIn van Paul 15, laatste 2026-11-06), alle met `approved`. 9 Instagram-concepten tot 16 november wachten op review. `active_skills`: socialMedia, reporting, intelligence, blogFactory, seoAnalyst, clyde, socialCommandCenter.
- **Menu en footer:** "Cases" wijst nu naar `/case-studies/skinclarity-club` (`HeaderClient.tsx:102`, `Footer.tsx:156`). De sitemap kent alleen de SKC-case (`sitemap.ts:12`).

## Global Constraints

Dezelfde als golf 6, plus:
- Elke tekst rond een echt SKC- of SalesLobe-scherm komt letterlijk uit dat scherm. Onder een echt klantscherm staat NIET de demoregel, maar `Echt scherm uit de werkruimte van <klant>, <datum van de opname>.` Onder elk demoscherm blijft de demoregel staan.
- Geen omzet, geen leads, geen resultaten, geen citaten van Sindy of Paul, geen gezichten in nieuwe schermen.
- SalesLobe volgt "Wat de site mag zeggen" en "Wat niet" uit het siteplan (r986-1000): geen Corty-film, geen reel of LinkedIn-video als werk van Clyde, geen "Clyde schreef de maand zelf", geen weekrapporten, geen LinkedIn-tijdtest, geen "elke week", geen sectoromschrijving die Paul niet bevestigde.
- Niets van 7b gaat live zonder Pauls akkoord. Het bericht aan Paul schrijf ik voor Daley uit; Daley stuurt het zelf.

## Fase 1: prototype (in R, geen repo-code)

### Task 1: ONTWERP en copy
- [ ] `R/golf7-ONTWERP.md`: per pagina de doelvraag, title (<=58), meta (<=155), H1, de twee zinnen eronder, de secties met copy (NL), de vragen met antwoorden, de links en de bron van elk feit. De copy schrijf ik zelf.
- [ ] Een lijst "Weg" per pagina en "Open vragen voor Daley", gebundeld, plus het bericht aan Paul.

### Task 2: schermen
- [ ] Echte schermen uit de SKC-werkruimte op prod, alleen lezen, via Claude in Chrome op Max: de agenda per account in de week van 19 oktober, en een geplaatste post in het akkoordscherm. Nooit op goedkeuren, pauzeren of publiceren klikken. Geen gezichten in beeld.
- [ ] De SKC-posts van de home (`R/real/g4/skc-*.webp`) en drie SalesLobe-posts van de home blijven bruikbaar.

### Task 3: prototype bouwen en meten
- [ ] `build10.py` bouwt ook `golf7-cases`, `golf7-skinclarity-club` en `golf7-saleslobe`, met dezelfde asserts plus de regel voor echte klantschermen.
- [ ] `PAGES=... node tools/m-g6.mjs g7/r1` (en `--reduce`): 0 PROBLEEM. Zelf kijken op 1280 en 390.

### Task 4: presentatie en Daleys oordeel
- [ ] `P/presentatie-golf7.html`: per pagina voor en na, de keuzes, de open vragen en het bericht aan Paul. `m-pres`: 0 PROBLEEM.
- [ ] Vault `Agency/Rapporten/2026-11-07 Golf 7 prototype.md`, dan één AskUserQuestion. Fase 2 begint pas na zijn ja.

## Fase 2: port, PR 7a (hub en SKC)

Worktree `C:/tmp/fmai-golf6`, branch `feature/golf7a-cases` vanaf `docs/golf6b-live` (`49e29309`, op origin/main `3ee6b477`), zodat de live-sectie van 6b meegaat.

### Task 5: port
- [ ] `src/components/cases/CasesHubSections.tsx`, `src/components/cases/SkcCaseSections.tsx` met `proof.css`.
- [ ] Nieuwe route `src/app/[locale]/(marketing)/case-studies/page.tsx`; `skinclarity-club/page.tsx` herschreven.
- [ ] Namespaces `case_studies.hub` en `case_studies.skc` in nl, en en es.
- [ ] `HeaderClient.tsx` en `Footer.tsx`: "Cases" naar `/case-studies`.
- [ ] `sitemap.ts` en `seo-config.ts`: `/case-studies` erbij, lastmod van beide op de PR-dag.
- [ ] Weg, als `grep -rn` buiten deze pagina 0 treffers geeft: `ChapterSection`, `ScrollProgressRail`, `CaseStudyJsonLd`, `SkcTestimonialBlock`, en `SINDY_PERSON_ID` / `LINKEDIN_SINDY_URL` als niets anders ze leest.

### Task 6: poorten, diffpagina en Daleys ja
- [ ] tsc, eslint, de zes `check:*`, `npx next build`, curl op 4 URL's, tekstpariteit, `m-g6` op de port, e2e tegen een baseline van origin/main.
- [ ] `docs/plans/2026-11-0x-golf7a-VERIFICATION.md`, de diffpagina `A/alle-paginas/golf7a-diff/index.html`, de vault-note, dan zijn ja. Pas daarna push, PR, merge, en PSI 3x.

## Fase 3: PR 7b (SalesLobe), na Pauls akkoord

Een nieuwe branch vanaf main na de merge van 7a. De port, de poorten en de diff zoals in Task 5-6. De kaart op de hub krijgt dan zijn link. Daarvoor moet Pauls akkoord op de exacte tekst en beelden er zijn, via Daley.
