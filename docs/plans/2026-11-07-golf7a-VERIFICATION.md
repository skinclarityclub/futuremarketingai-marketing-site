# Golf 7a: verificatie (2026-11-07)

Plan: `docs/plans/2026-11-07-golf7-cases-plan.md`. Branch `feature/golf7a-cases` in `C:/tmp/fmai-golf6`, port `ff9e2e47` op `61f6333d` / `49e29309` / origin/main `3ee6b477` (#99). Niets gepusht.
Gemeten op `ff9e2e47`, `next start` op poort 3047; baseline origin/main `3ee6b477` in worktree `C:/tmp/fmai-g7a-base` (na de meting verwijderd) op poort 3048. Geen `.env.local` in beide.

## Daleys ja op het prototype (2026-11-07, één AskUserQuestion)

Zo porten zonder aandelen; de homezin mee in 7a; alleen het mechanisme bij goedkeuren; het bericht aan Paul stuurt hij zelf. Prototype r3: `R/golf7-*.tpl.html`, ontwerp `R/golf7-ONTWERP.md`, presentatie `P/presentatie-golf7.html`, vault `Agency/Rapporten/2026-11-07 Golf 7 prototype`.

## Poorten

| Poort | Commando | Uitkomst |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | rc 0 |
| ESLint | `npx eslint` op alle geraakte bestanden | rc 0; 2 bestaande waarschuwingen in `HeaderClient.tsx:127,164`, niet van deze PR |
| Zes checks | `check:palette`, `copy`, `i18n-orphans`, `sitemap-lastmod`, `indexability`, `llms` | alle zes rc 0 (sitemap 31 paden, llms "10 live, 2 coming soon") |
| Build | `npx next build` | rc 0; `/[locale]/case-studies` en `/[locale]/case-studies/skinclarity-club` SSG voor nl en en |
| curl | 4 URL's plus /nl/case-studies/saleslobe | 4x 200 met de nieuwe title en H1 (nl en en); saleslobe 404 (7b); /nl heeft 2 links naar /nl/case-studies (header, footer) |
| Oude claims | tekst van de 4 pagina's | 0x "één collega", "10 vaardigheden", WhatsApp, "elke week", %, Corty, em-dash |
| Homezin | curl /nl | "Bij SkinClarity Club maakte Clyde van mei tot oktober 2026 de posts, bij SalesLobe maakt hij ze nu, ..." |
| Titles en metas | `g7a_messages.py` asserts | nl 46/53 tekens, metas 143/140; en 47/54, metas 146/139 |
| Tekstpariteit | `.g6` innerText prototype vs port (NL), regel voor regel | 0 VERSCHIL; toegestaan: de 7b-plaatshouder, één "Lees de case" minder (SalesLobe), de "/"-scheiders van het kruimelpad (de site tekent chevrons) |
| Schema | JSON-LD van de HTML | hub: CollectionPage + ItemList (1 item, SKC) + BreadcrumbList; SKC: WebPage, BreadcrumbList, Organization (SKC), Article met `author` = `#org`, `about` = SKC, `url` = canonical per taal; geen Person-node van Sindy |
| Sitemap | `/sitemap.xml` | 4 nieuwe/gewijzigde URL's met lastmod 2026-11-07 |
| m-g6, NL | `m-g6.mjs --base http://localhost:3047`, 1440/1280/1024/390, plus `--reduce` | met AVIF: 3 PROBLEEM (zie hieronder); met WebP voor `/_next/image`: 0 PROBLEEM en 0 PROBLEEM (reduce) |
| m-g6, EN | idem, /en op 1280 en 390 (WebP) | 0 PROBLEEM |
| e2e, 132 tests | `navigation`, `nl-content-smoke`, `sitewide-visual-audit`, `conversion-polish`, chromium, list | baseline 15 failed / 114 passed / 1 skipped; branch 15 / 116 / 1. Dezelfde 15 rode tests op beide (content-smoke van /nl/apply, /nl, skills; header-navigatie); de 2 extra op de branch (hub-smoke, /en/case-studies) zijn groen |

## De 3 PROBLEEM met AVIF

Op de SKC-case laadde op 1440, 1280 en 1024 de derde post niet (`skc-huid-conservering.webp`, variant w=375). Oorzaak: de lokale image-optimizer (sharp) blijft hangen op de AVIF-encode van precies die variant; `curl` met `Accept: image/avif` kwam na 120 s niet terug. Met `Accept: image/webp` gaf dezelfde variant lokaal 200 in 0,05 s. Op prod serveert Vercel die AVIF-variant gewoon: `https://future-marketing.ai/_next/image?url=%2Fhome%2Fklanten%2Fskc-huid-conservering.webp&w=375&q=75` gaf 200 `image/avif` in 0,9 s (ook w=256 en w=384). Het meetscript met de WebP-route staat in de scratchpad (`m-g6-webp.mjs`); het gedeelde `tools/m-g6.mjs` is niet aangepast.
Na de merge: dit beeld op de preview of prod bekijken op 1280 px (open punt voor de PSI-ronde).

## Wat de port meer doet dan het prototype

- llms.txt, llms-full.txt, de chatbotkennis (`concierge-kb.ts`), de casekaart van de chatbot (`concierge-tools.ts`, nl/en/es) en de paginaprompt (`prompt-builder.ts`) zeiden "10 vaardigheden", weekrapport, WhatsApp en "het bureau keurt goed". Die volgen nu de case, in de verleden tijd.
- Weg (0 treffers buiten de oude pagina): `ChapterSection`, `ScrollProgressRail`, `BeforeAfterTimeline`, `CaseStudyJsonLd`, `SINDY_PERSON_ID`, `LINKEDIN_SINDY_URL`. `SkcTestimonialBlock` blijft: `scripts/validate/phase-15-playwright.mjs` noemt hem nog.
- `es.json` spiegelt `en.json` (zoals 6a en 6b).

## Live (2026-11-07)

Daley zei "Ja, push en merge" op de diffpagina (`A/alle-paginas/golf7a-diff/index.html`, één AskUserQuestion). PR #100, squash-merge `ff8fa6d1` op 2026-11-07 ~10:30Z, dus lastmod 2026-11-07 is de merge-dag.

| Poort | Commando | Uitkomst |
|---|---|---|
| Preview | `gh pr checks 100 --watch` | Vercel pass |
| Derde SKC-post op de preview | `vercel curl` op `/_next/image?url=%2Fhome%2Fklanten%2Fskc-huid-conservering.webp&w={256,375,384,750}`, `Accept: image/avif`; plus Claude in Chrome op de pagina | 4x 200 `image/avif` (w=375 in 0,88 s); in Chrome 4/4 beelden geladen, 0 overflow. Chrome bleef gemaximaliseerd op 1707 px, dus 1280 is op prod gemeten (volgende rij) |
| Derde SKC-post op prod, 1280 | Playwright 1280x900 op `/nl/case-studies/skinclarity-club` | w=375 en w=256 200 `image/avif`, 4/4 beelden geladen; de lokale AVIF-hang is dus alleen lokaal |
| Productiedeploy | `vercel ls futuremarketingai --prod` | `dpl_5U5wDWSsMfh9xqU6xHA5vdwzR3qA` Ready |
| curl prod | 4 URL's plus saleslobe | 4x 200 met de nieuwe title en H1 (nl en en); `/nl/case-studies/saleslobe` 404 (7b); /nl 2x `href="/nl/case-studies"` (menu en footer) |
| Sitemap prod | `/sitemap.xml` | 4 URL's lastmod 2026-11-07 |
| PSI, 3 runs | `ronde1b/tools/port/m-psi.mjs`, JSON in `ronde1b/g7/psi7a/` | /nl/case-studies: mobiel 100x3 (LCP 1,1 s, CLS 0,019), desktop 100x3 (LCP 0,3-0,6 s, CLS 0,002). SKC-case: mobiel 100x3 (LCP 1,1 s, CLS 0,022), desktop 100x3 (LCP 0,3 s, CLS 0,002). LCP is altijd tekst (`p.g6-def` of `h1#skc-h1`) |

## Open

- 7b (SalesLobe) wacht op Pauls antwoord. Daley vroeg op 2026-11-07 een mockup om aan Paul te laten zien: Artifact https://claude.ai/artifact/KhwYExv5yuPpvDfBtucFd2 (privé, Daley deelt hem), kopie in `A/alle-paginas/golf7b-mockup/`. Daley stuurt het bericht aan Paul zelf.
