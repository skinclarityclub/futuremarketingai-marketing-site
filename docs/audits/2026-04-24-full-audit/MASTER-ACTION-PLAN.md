---
title: FutureMarketingAI Master Audit Action Plan
created: 2026-04-24
scope: synthesis van 8 parallelle Opus audits (performance, copy, conversion, SEO, GEO, data accuracy, UX/a11y, tech quality)
auditors: 8 senior agents, totaal circa 4.000 regels output
doel: één uitvoerbaar roadmap voor Daley (solo founder) voor de komende 90 dagen
---

# FutureMarketingAI Master Audit Action Plan
*Synthese van 8 parallelle Opus audits. 2026-04-24.*

## TL;DR (5 regels)

De site zit architectonisch sterk (Next.js 16 SSG, 100 procent metadata coverage, IK-stem copy, transparante pricing) maar lekt business-kritiek op drie plekken: `/api/apply` dropt elke aanvraag in `console.log` zonder e-mail of DB-write, de live chatbot quoteert v9-prijzen (€1.497 Growth in plaats van €2.497), en `llms.txt` voedt AI-crawlers met het oude 4-service productmodel. Daarbovenop: geen skip-link plus een muisgestuurd mega-menu plus contrast-falen maakt de site niet EAA-compliant per 28-06-2025. Sterkte om te beschermen: de NL-copy en pricing-transparantie zijn uitzonderlijk voor een solo founder project.

## Health Score per domein

| Domein | Score / 100 | Trend | Kern-gap |
|---|---:|---|---|
| Performance | 72 | → | Spline-prefetch op elke pagina, chat-bundle ongeconditioneerd op elke page, full i18n tree client-side |
| Copywriting | 84 | ↗ | Engelse labels in tier-matrix (`skills-data.ts`), 8 `klanten`→`merken` slips, IK/WIJ slips op about/contact/founding |
| Marketing + Conversion | 60 | ↓ | `/api/apply` dropt aanvragen, geen post-submit Calendly, SKC case study heeft 0 metrics, geen lead-magnet |
| SEO Technical | 68 | → | `og-image.png` 404, `llms.txt` stale (v9), `sameAs` mist Wikidata, Person schema voor Daley ontbreekt, Service schema dode code |
| GEO / LLM Citation | 42 | ↓ | Stale `llms.txt` poisoned AI crawlers, geen `sameAs` breedte, 0 Person schema, 0 Speakable, geen vs-pages |
| Data Accuracy | 58 | ↓ | Chatbot tools quoten v9-prijs (€1.497), `llms.txt` v9, 5 contact-mails tegelijk, Partner "all 12 skills" claim in KB (hoort 8) |
| UX + Accessibility | 55 | ↓ | Geen skip-link, Skills mega-menu niet keyboard-bedienbaar, `text-muted` contrast 3.23:1, ApplicationForm geen per-field errors, EAA-risico |
| Technical Quality | 66 | → | 36 lint errors silent, geen Next.js 16 features (cache, PPR, Server Actions), `middleware.ts` deprecated, 7 CVEs in deps, `/api/vitals` 404 per pageload |

---

## Cross-cutting themes

Zeven patterns die in meerdere audits terugkomen. Elke theme heeft één gebundelde fix strategy i.p.v. 35 losse edits.

### T-1 | Stale v9 product data lekt naar drie publieke surfaces
- **Evidence**: audit 04 (SEO), 05 (GEO), 06 (Data). Chatbot tools (`leadgen-tools.ts:98-192`, `concierge-tools.ts:18-54`) quoten Growth op €1.497, Pro op €2.997, Ent op €4.997. `public/llms.txt` en `public/llms-full.txt` beschrijven "Starter/Growth/Scale" bundels en dead URLs (`/chatbots`, `/automations`, `/voice-agents`, `/marketing-machine`). Partner tier bestaat niet in de chatbot tools.
- **Root cause**: de 2026-04-20 content-upgrade vernieuwde `messages/*.json` + `skills-data.ts` + `PricingJsonLd` maar de chatbot subsystem en public AI-surfaces zijn nooit meegepivot.
- **Fix strategy**: één sprint (ongeveer 5 uur) die (a) chatbot tools herschrijft met v10 tier-object dat uit `skills-data.ts` importeert (1 bron), (b) `llms.txt` + `llms-full.txt` volledig regenereert vanaf `messages/nl.json` + Clyde-positionering, (c) contact-mail unificeert op `hello@`. Test: chat-prompt "wat kost Growth" moet €2.497 zeggen, Perplexity query moet correcte pricing citeren.

### T-2 | Domain SSoT mismatch tussen CLAUDE.md en codebase
- **Evidence**: audit 04, 05, 06. CLAUDE.md root zegt `future-marketing.ai` (hyphenated). Alle code (`seo-config.ts:1`, `.env.example`, `llms.txt`, `OrganizationJsonLd`, sitemap) gebruikt `futuremarketingai.com`. 35+ refs in llms-full.txt alleen al.
- **Root cause**: onduidelijk welke domain live is. Vercel config niet geverifieerd in audit.
- **Fix strategy**: één beslissing (15 min Vercel dashboard check), daarna één search-and-replace + Vercel redirect 301 van het niet-canonieke domein naar het canonieke. Update CLAUDE.md root + fmai-nextjs CLAUDE.md + `seo-config.ts`. Deze fix raakt 40+ refs maar is 1 taak.

### T-3 | Form-to-business-result keten is gebroken
- **Evidence**: audit 03 (conversion), 08 (tech). `/api/apply/route.ts:86` doet enkel `console.log`, geen Resend, geen Supabase. Zelfde voor `/api/contact/route.ts:95`. `.env.example` documenteert `APPLY_EMAIL_TO`, `RESEND_API_KEY` maar ze zijn niet bedraad. Geen confirmation-mail naar applicant, geen notificatie naar Daley.
- **Root cause**: TODO in code, ingeplande integratie is nooit uitgevoerd. In-memory rate-limit (`const rateLimit = new Map()`) werkt niet correct op Vercel Fluid Compute.
- **Fix strategy**: 1 sprint met 3 atomic steps: (a) Resend integratie + HTML templates voor apply + contact, (b) Supabase `applications` tabel + insert, (c) rate-limit migreren naar Upstash Redis (`@upstash/ratelimit`). Geen nieuwe features, alleen bedrading. Totaal circa 4 uur.

### T-4 | Dead + legacy client-bundle op elke route
- **Evidence**: audit 01, 07, 08. `ClientIslands` mount chat + calendly + booking modal ongeconditioneerd op elke page (gzip circa 70 KB). Spline scene gets prefetched (1.3 MB) op non-home routes. Full i18n tree (44 KB gz) ship op elke page. CookieConsentBanner statisch geladen. `/api/vitals` beacon 404t op elke pageload. `OrbitVisual`, `hero-robot.png`, 20+ PNG debug screenshots op repo root.
- **Root cause**: architectuur-keuze om alles eager te laden voor gemak, geen interaction-driven lazy-loading pattern.
- **Fix strategy**: 2-3 uur werk met 10 kleine quick wins (zie P1 sectie). Target: ongeveer 70 KB gz af van initial bundle op niet-home pages.

### T-5 | Stale palette + typography tokens
- **Evidence**: audit 07. `CookieConsentBanner.tsx:44-80` hardcodet `#050814` + `#00D4FF` terwijl codebase naar `#0a0d14` + `#00d4aa` is gemigreerd. `not-found.tsx:9` gebruikt `#00D4FF` stale cyan. `error.tsx` gebruikt purple `#A855F7` niet in design system. `--color-text-muted: #5a6378` heeft 3.23:1 contrast (fail AA normal text) op 46+ plekken.
- **Root cause**: palette-migratie was incompleet, geen globale color-token audit uitgevoerd.
- **Fix strategy**: 1 uur: (a) `--color-text-muted` verhogen naar `#8C98AD` (6.67:1), (b) hardcoded colors vervangen door CSS vars in CookieBanner + not-found + error, (c) grep alle `#00D4FF` + `#050814` + `#A855F7` refs en fixen.

### T-6 | Hardcoded English strings in NL/ES locales
- **Evidence**: audit 02, 07, 08. `pricing/page.tsx:127` "Most popular" hardcoded. `ContactForm.tsx:66,85,87,94,189` "Sending...", "Message sent!", "Network error..." hardcoded. `error.tsx:13-22` hele pagina EN. `HeaderClient.tsx:40-135` mega-menu skill labels hardcoded EN. `SkillsTierMatrix.tsx:85` "Coming soon" EN. `ChatWidget.tsx:107,110,180` "Demo limit reached", "Type a message..." EN. `VoiceDemoSection.tsx:67,93` `+1 (570) 783-8236` (US phone). `apply success` screen hardcoded EN.
- **Root cause**: geen build-time check op hardcoded user-facing strings, reviewers missen slipjes.
- **Fix strategy**: één grep-based cleanup sprint (1.5 uur) + eslint-rule tegen string-literals in JSX props (preventief).

### T-7 | Schema + entity-graph is shallow
- **Evidence**: audit 04, 05. `OrganizationJsonLd` heeft alleen LinkedIn in `sameAs`, geen Wikidata, geen KvK, geen Twitter, geen Crunchbase. `ServiceJsonLd.tsx` bestaat maar wordt nergens geïmporteerd (12 dead-code skill opportunities). Geen Person schema voor Daley (0 E-E-A-T signal). Geen Speakable. `hasOfferCatalog` lijst "Marketing Machine" (v9 product, niet meer op site). FAQ schema alleen op home + pricing (2 van 22 pages met FAQ-content).
- **Root cause**: schema is gebouwd voor layout dekking, niet voor GEO-depth. Research doc sec 2 expliciet zegt `sameAs` is #1 KG signaal.
- **Fix strategy**: dedicated schema-upgrade sprint (4-6 uur): Organization `sameAs` expansion + Wikidata create + Person `@id` component + Service op alle 12 skill-pagina's + FAQ op 12 skill-pagina's + Speakable op memory/home/case-study.

### T-8 | Copy-glossary slips op conversie-kritieke pagina's
- **Evidence**: audit 02. 16 `unlimited`/`add-on €X`/`/mo`/`niet beschikbaar` labels in `skills-data.ts` renderen als Engelse labels in de NL tier-matrix. 8 `klanten` → `merken` schendingen waaronder apply-form (`clientCountLabel` + problem placeholder). Pricing credit-pack heet `"Onbeperkt"` maar is 15.000 credits (ondermijnt transparantie). 11 IK/WIJ slips (about, contact, founding-member) in contexten die IK-stijl voorschrijven per style-guide. `about.cta.demo_button: "Boek een strategiegesprek"` terwijl overal elders "Plan een gesprek".
- **Root cause**: style-guide bestaat maar is nooit in CI-check gegoten. Skills-data.ts is uit legacy mirror (fma-app) geïmporteerd zonder translation audit.
- **Fix strategy**: één copy-polish sprint (2-3 uur): alle items in audit 02 §1-3 in één commit, plus `skills-data.ts` rewrite.

---

## BLOCKERS — fix deze week (P0)

Business-kritiek. Alles hier valt onder data-integriteit, lost-revenue, of EAA legal risk. Max 10, maar het zijn er 10.

| ID | Titel | Evidence | Impact | Fix | Effort |
|---|---|---|---|---|---|
| **B-1** | `/api/apply` dropt elke aanvraag naar `console.log`, geen e-mail, geen DB | `src/app/api/apply/route.ts:86` | Elke prospect-applicatie sinds launch is verloren tenzij Vercel logs geharvest | Resend integratie (template naar Daley + confirmation naar applicant) + Supabase `applications` insert + Slack webhook optional | 2 u |
| **B-2** | `/api/contact` idem — wildcard CORS + console.log | `src/app/api/contact/route.ts:45-95` | Contactformulier-leads verloren + open voor abuse van elk domein | Resend integratie + origin-check of CORS-strip (same-origin only) | 1 u |
| **B-3** | Chatbot quoteert v9-pricing (Growth €1.497, Pro €2.997, Ent €4.997, geen Partner tier) | `src/lib/chatbot/tools/leadgen-tools.ts:98-192`, `concierge-tools.ts:18-54` | Prospect hoort €1.497 van Clyde, ziet €2.497 op pricing-page: bait-and-switch klacht + trust-breuk | Rewrite chatbot tools vanuit `skills-data.ts` (5 tiers v10, 12 skills, correcte onboarding + credits). Partner toevoegen aan enum. 16 specifieke fixes in audit 06 §14 | 2.5 u |
| **B-4** | `public/llms.txt` + `llms-full.txt` beschrijven oud v9 product | `public/llms.txt`, `llms-full.txt` (volledig) | ChatGPT / Perplexity / AI Overviews citeren verkeerde prijzen, dead URLs (`/chatbots`, `/automations`), verkeerd product ("160 posts/month" claim) | Volledig regenereren volgens llmstxt.org spec met Clyde + 12 skills + 5 tiers + founding + SKC + memory USP | 2 u |
| **B-5** | `public/og-image.png` bestaat niet | referenced by `metadataBase` + OG cards + `OrganizationJsonLd:logo` | Elke social share (LinkedIn, Twitter, WhatsApp) broken preview + Organization logo 404 voor AI crawlers | 1200×630 px image ontwerpen (Clyde + FMai logo + tagline). Kan met `@vercel/og` of statisch PNG | 0.5 u |
| **B-6** | Skip-to-content link ontbreekt + Skills mega-menu niet keyboard-bedienbaar | `src/app/[locale]/layout.tsx` (geen `<a href="#main" class="sr-only focus:not-sr-only">`), `HeaderClient.tsx:215-226` (button heeft geen `onClick`, menu opens alleen op `mouseEnter`) | WCAG 2.4.1 + 2.1.1 fail. EAA per 2025-06-28. Keyboard user komt nergens bij 12 skill-pagina's | Skip-link as first child van body + `id="main"` op PageShell. Skills button: `onClick` toggle `setSkillsOpen`, `aria-expanded`, verwijderen global document-click handler die ertegen vecht, ArrowDown keyboard navigation | 2.5 u |
| **B-7** | `text-text-muted` (#5a6378) contrast 3.23:1 op 46+ plekken | `src/app/globals.css:18` plus gebruik in HeaderClient, Footer, apply reassurance, pricing captions | WCAG 1.4.3 fail voor normale tekst. EAA-risico | Token verhogen naar `#8C98AD` (6.67:1). Automatische fix — alle 46 usage sites worden compliant | 0.5 u |
| **B-8** | ApplicationForm geen per-field errors, geen `aria-invalid`, geen `autoComplete` | `ApplicationForm.tsx:232-236` (generiek `<p role="alert">`), geen fieldErrors state | WCAG 3.3.1 + 4.1.2 fail. EAA high-risk op conversie-stap. Screen-reader gebruiker kan niet herstellen | Mirror pattern van `ContactForm.tsx:120,136,176`: `fieldErrors` state, per-input `<p id="name-err">`, `aria-describedby` + `aria-invalid`, `autoComplete` tokens (name/email/organization/organization-title) | 2 u |
| **B-9** | `skills-data.ts` tier-matrix labels renderen Engels ("unlimited", "add-on €97", "/mo", "niet beschikbaar") op NL pricing-page | `src/lib/skills-data.ts:87,111,114,137,140,164-168,209,212,235-239` (16 label-fixes) | Kritieke conversie-pagina toont Engels voor EN-tier labels en `/mo` i.p.v. `/mnd`. Ondermijnt NL-native positionering | 16 specifieke label-fixes per audit 02 §2.6. Refactor naar `labels.unlimited` uit i18n + strip hardcoded labels | 0.5 u |
| **B-10** | `middleware.ts` deprecated + `/api/vitals` 404 per pageload + npm audit 7 CVEs | `src/middleware.ts`, `src/lib/web-vitals.ts:41`, `package.json` | Build warning, silent 404 storm, drie high-severity CVEs (picomatch ReDoS + POSIX injection, postcss XSS) | (a) rename naar `proxy.ts`, (b) install `@vercel/speed-insights` of voeg `/api/vitals/route.ts` toe, (c) `npm install next@16.2.4 @next/mdx@16.2.4 @next/bundle-analyzer@16.2.4 eslint-config-next@16.2.4` | 1 u |

**Totaal P0: circa 14.5 uur = 2 intensieve werkdagen.** Dit zijn alle data-integriteit + legal-risk issues. Alles onder dit punt is polish.

---

## HIGH IMPACT — komende 2-4 weken (P1)

Top 20, gerankt op `(impact × reversibility) / effort`. Groepering: waar 3+ fixes logisch samen horen, staan ze als één rank.

| Rank | Fix | Audit(s) | File:line | Impact | Effort |
|---:|---|---|---|---|---|
| 1 | **Domain SSoT + schema entity graph** — beslis `future-marketing.ai` vs `futuremarketingai.com`, unify `sameAs` (Wikidata create, Twitter `FutureMarketAI`, LinkedIn, KvK zodra ingeschreven, Crunchbase), voeg stable `@id` + Person schema voor Daley toe | 04 F-3/4, 05 §1-3, 06 §8.2 | `src/lib/seo-config.ts:1`, `src/components/seo/OrganizationJsonLd.tsx:13-79`, nieuw `PersonJsonLd.tsx` | GEO 3.2x citation lift + E-E-A-T baseline | 4 u |
| 2 | **Post-submit Calendly embed** — ApplicationForm success state vervangt door Calendly inline. Zelfde voor ContactForm optional | 03 leak #2 | `ApplicationForm.tsx:64-70` success state | +30-60% book-to-apply rate (actief vs passief) | 1.5 u |
| 3 | **ClientIslands lazy-on-interaction refactor** — `FloatingChatTrigger` (2 KB) in layout, volledige ChatWidget + CalendlyModal + BookingModal alleen bij click | 01 F-2, S-1 | `src/components/providers/ClientIslands.tsx:16-28`, `StoreProvider.tsx:14-18` | circa 70 KB gz af van initial load op elke page | 3 u |
| 4 | **Spline scene prefetch + preconnect gated op home only** | 01 F-1 | `src/app/[locale]/layout.tsx:57-59` verplaatsen naar `page.tsx` | 1.3 MB waste bespaard op 28 niet-home routes | 0.5 u |
| 5 | **Per-segment i18n messages** — strip full message tree van client, laat alleen `common + nav` passeren via `NextIntlClientProvider`, scoped provider op pages die interactieve text hebben | 01 F-3, S-2 | `src/i18n/request.ts:11`, `src/app/[locale]/layout.tsx:63` | circa 30-40 KB gz per page | 4 u |
| 6 | **Copy glossary cleanup batch** — `klanten` → `merken` (8 plekken incl. apply-form), hernoem credit pack `"Onbeperkt"` → `"Max"` of `"Scale XL"`, IK-stem doortrekken (11 rewrites about + contact + founding), `skills-data.ts` em-dashes + "brand voice" → "merkstem" (14 edits), "Feature-verzoeken" → "verzoeken voor nieuwe vaardigheden" (2 edits) | 02 §1-3 | `messages/nl.json:568,587,606,1461,1544-1550,1562,1657,1719`, `668`, `614`, `1358`, about/contact/founding IK-slips, `skills-data.ts:50-288` | Glossary-discipline + geloofwaardigheid partnership-stem | 2.5 u |
| 7 | **SKC case study: echte outcome metrics** — interview Sindy voor: uren/week bespaard, engagement delta, post-volume delta, CAC impact. Vervang huidige vage claims door cijfers met bron-noten | 03 leak #3, 05 §11 | `messages/nl.json case_studies.skc.*` + `nl.json:1651` testimonial (foto + LinkedIn toevoegen) | +40-80% trust + #1 GEO citation gap dicht | 2 u interview + 1 u schrijven |
| 8 | **Schema coverage batch** — Service schema op alle 12 skill-pagina's (`ServiceJsonLd` is dead code), FaqJsonLd op `/founding-member` (FAQ zichtbaar, schema mist), Article.image + publisher.logo + mainEntityOfPage, Speakable op home + memory + case-study key paragraphs, update `hasOfferCatalog` naar v10 | 04 fix #5/7/8/9/13, 05 fix #3/11 | `SkillPageTemplate.tsx:81`, `founding-member/page.tsx:158`, `ArticleJsonLd.tsx:26-50`, nieuw helper voor speakable, `OrganizationJsonLd.tsx:35-65` | SERP rich results + GEO citation precision | 4 u |
| 9 | **Hero CTA discipline + sticky mobile CTA** — home hero secondary CTA demoten naar text link (niet `size=lg` button), sticky bottom-bar "Plan een gesprek" na 50% scroll op home + memory + pricing + case study + skill pages | 03 leak #8/9 | `src/app/[locale]/page.tsx:128-138`, nieuw `StickyMobileCTA` component | +15-25% home apply + +20-40% mobile conversion | 2 u |
| 10 | **Header mega-menu i18n + Apply in mobile drawer** — move 12 skill labels + group labels + nav items naar `messages/*/header.*`, voeg Apply CTA toe aan mobile drawer state | 06 §8, 03 leak onder mobile CTA | `HeaderClient.tsx:40-135` + `438-448` | NL/ES visitors zien Nederlandse/Spaanse mega-menu ipv EN | 2 u |
| 11 | **Meta descriptions trim naar ≤160 chars** — home (228 nu), pricing (172), apply (200), founding (205), how-it-works (180) | 04 fix #6 | `messages/{nl,en,es}.json` meta.description keys | Google SERP truncation fix, beter CTR | 1 u |
| 12 | **Robots.ts explicit AI-crawler rules** + fix contact emails (unify op `hello@`), verwijder CSP `connect-src api.anthropic.com` (niet browser-side gebruikt) | 05 §2, 06 §8.1, 08 §7 | `src/app/robots.ts`, `src/lib/seo-config.ts:3`, `src/lib/chatbot/knowledge/concierge-kb.ts:220`, `next.config.ts:21` | GEO-ready signal + single customer-facing email + tighter CSP | 1 u |
| 13 | **React Compiler + lint errors fixen** — 36 errors (3 `setState-in-effect`, 2 purity `Date.now`/`Math.random` in render, 14 `<a>`→`<Link>`, 2 `any`). Set `prebuild: "npm run lint"` om regressie te voorkomen | 08 §2 | `DemoOrchestrator.tsx:210`, `WaveformVisualizer.tsx:19`, `CalendlyModal.tsx:42`, `CookieConsentBanner.tsx:19`, `HeaderClient.tsx:157`, `ServiceCard.tsx:63`, 14 chatbot tool-results link refs | Voorkomt render-loops + i18n-breakage via hardcoded `/contact/` links | 2 u |
| 14 | **Global focus-visible ring + scroll-padding-top + focus return to trigger** — `*:focus-visible { outline: 2px solid var(--color-accent-system); outline-offset: 2px; }` + `html { scroll-padding-top: 5rem; }` + BookingModal returnt focus naar trigger onClose | 07 §2.4.7, §2.4.11, §6 | `globals.css`, `BookingModal.tsx` focus trap | WCAG 2.4.7 + 2.4.11 | 1 u |
| 15 | **Reduced-motion complete coverage** — `@media (prefers-reduced-motion: reduce)` wrapper rond alle 17 keyframes in globals.css + hero inline `fadeInUp` animaties (niet alleen blobs) | 07 §A.5, 01 F-4 | `globals.css:275-322` + `page.tsx:87,96,110,118,126` | WCAG 2.3.3 | 1 u |
| 16 | **CookieConsentBanner palette + lazy import** — hardcoded `#050814` + `#00D4FF` vervangen door CSS vars. `next/dynamic(..., { ssr:false })` + skip bundle als cookie al geset | 01 F-11, 07 §6 | `CookieConsentBanner.tsx:44-80` | Brand consistency + circa 8 KB gz minder voor returning users | 0.5 u |
| 17 | **Lead magnet programma — tier 1** — 1 gated PDF "NL Bureau AI Readiness Checklist" + newsletter capture (Resend audience). Eén CTA op home + blog + pricing + founding | 03 leak #4 | nieuw component `LeadMagnetCTA`, `/api/newsletter` route | 3-5x top-of-funnel pipeline, remarketing-base opbouwen | 6 u |
| 18 | **Blog content engine kickoff** — 2 NL posts schrijven: "AI marketing automation Nederland 2026" + "ChatGPT vs Clyde voor bureaus". Add RSS feed at `/feed.xml`. Category landing pages met unieke URL (niet querystring) | 04 fix #15, 05 §3 | `content/blog/*.mdx`, nieuw `src/app/feed.xml/route.ts` | Topical authority + GEO signal (AI crawlers parsen feeds) | 8 u |
| 19 | **Pricing page herstructurering** — FAQ naar boven (nu sectie 5 van 7), annual discount toevoegen, Pro tier visueel breder + pre-highlighted, ROI calculator component, comparison matrix collapsible | 03 leak #14, pricing deep-dive | `pricing/page.tsx:39`, layout reorg, nieuwe components | +10-20% pricing-to-apply + +10-20% ACV via annual | 6 u |
| 20 | **Dead code cleanup + dep hygiene** — delete `OrbitVisual.tsx`, `hero-robot.png`, `hero-robot.webp`, 20+ stray PNG screenshots op root, lege dirs `public/case-studies/skc/` + `public/screenshots/skills/`. Remove `@google/stitch-sdk` uit prod deps (unused). Update 21 outdated packages | 01 F-6/7, 08 §8 | div. root files + `package.json` | Repo hygiene + circa 10 KB gz via tree-shaking | 1.5 u |

**Totaal P1: circa 49 uur = ongeveer 6 werkdagen.** Spreiden over 3 weken zodat testen + monitoring per batch kan.

---

## STRATEGIC — komende kwartaal (P2)

Grotere initiatieven. Niet elk hoeft in Q1 te landen, maar de roadmap moet ze benoemen zodat ze niet wegvallen.

### S-1 | Next.js 16 modernization
Stap 1 (2 dagen): `use cache` + `cacheLife('hours')` + `cacheTag` op pricing, memory, skill pages. `updateTag` hook in fma-app pricing SSoT zodra skills.ts verandert. Stap 2 (1 dag): `/api/apply` converteren naar Server Action (strip 95 LOC API boilerplate). Stap 3 (1 dag): `experimental.ppr = 'incremental'` + PPR op home (statische shell + founding counter dynamic hole). Stap 4 (0.5 dag): per-route `loading.tsx` + Suspense around ClientIslands zodat above-the-fold streamt onafhankelijk van Spline. Return: instant navigation + tag-based invalidation + betere LCP.

### S-2 | GEO content program (5 citation-bait pages)
Uit audit 05. `/onderzoek/staat-van-ai-marketing-nl-2026` (survey 40 bureaus, 3-5k woorden + charts, Dataset schema). `/frameworks/clyde-partnership-model` (2k woorden + HowTo schema). `/woordenlijst` (30+ DefinedTerm schema). `/vs/fmai-vs-losse-tools` + `/vs/ai-agency-vs-in-house` (comparison tables + FAQPage). Elke page krijgt speakable + last-updated visible + internal linking plan. Budget 60-80 uur over 8 weken.

### S-3 | Schema.org depth upgrade (`@graph` consolidation)
Uit audit 04 + 05. Vervang per-page losse JSON-LD blocks door één `@graph` array per page met cross-@id refs: Org + WebSite + WebPage + Breadcrumb + FAQ/Article. Voeg Speakable toe aan Article/WebPage. Add DefinedTerm op `/woordenlijst`. Creëer Wikidata entry voor Future Marketing AI als organisatie (30 min task maar cruciaal voor Knowledge Graph). Budget 8 uur.

### S-4 | Probleem-section op home + storytelling arc fix
Uit audit 02 §12. Home arc is nu Oplossing → Proof → Aanbod → Apply zonder Probleem. Voeg lichte 40-60 woord Problem-section toe tussen hero en services: "Elke bureau-eigenaar kent het probleem: 10 tot 50 merken, freelancers schalen niet mee, tools lossen het niet op. Clyde is de oplossing die ik zelf wilde hebben." Scheppt "ja, dat is mijn probleem"-trigger voor sceptische bureau-eigenaar. Budget 2 uur (copy + render).

### S-5 | Skill-page proof artifacts (11 van 12 skill-pagina's)
Uit audit 03 leak #10. 11 skill-pagina's zijn template-copy zonder demo/screenshot/video. Elke page krijgt 1 artifact: screenshot van actuele output (social media carrousel, gegenereerde blog snippet), sample email-classificatie, 30-sec Loom, embedded voorbeeld. Voice-agent is de referentie (interactieve `VoiceDemoSection`). Budget 20 uur over 4 weken (elke week 3 pages).

### S-6 | Lead magnet programma — tier 2 en 3
Uitgaand van P1 #17 (tier 1 checklist PDF). Tier 2: ROI calculator widget op pricing (agency size → monthly savings). Tier 3: "AI readiness audit" mini-quiz (5 vragen → gepersonaliseerd rapport per mail). Elk houdt email capture + pre-fill tier voor apply flow. Budget 12 uur.

### S-7 | Second case study acquire + publish
Uit audit 03 leak #11. SKC-only case is kwetsbaar ("werkt alleen omdat Daley co-bouwde"). Verwerven van tweede partner (Growth of Pro tier), 12 weken tracken, case study publiceren met eigen metrics. Dit vraagt client acquisition + 10 uur documentatie. Timeline 8-12 weken.

### S-8 | ES native-review + EN contraction sweep
Uit audit 02 §10. ES: "Empleado AI" is ongewoon (verifieer "Asistente" / "Agente"). 2 Dunglish-spiegels ("IA con RGPD primero"). EN: alle "do not"/"would rather" → contractions ("doesn't", "we'd"). Budget 3 uur (vraag native strateeg + pass).

### S-9 | Blog tot 10 posts binnen Q1 (NL prioriteit)
Uit audit 04 fix #15. Huidig: 1 EN post. Target: 7 NL + 2 EN posts binnen 90 dagen. Topics per audit 04 keyword gaps: "AI marketing automation Nederland", "ChatGPT vs Clyde", "n8n marketing automatisering", "AVG + EU AI Act voor bureaus", "persistent AI memory B2B". Budget 16 uur/post.

### S-10 | Founder presence + E-E-A-T boost
Uit audit 03 leak #12. Daley photo op /about (nu een initiaal "D"), LinkedIn link, 60-90s intro video op /about en apply hero. Publish founding-story blog series (3 posts: "Why I'm not building a SaaS", "How SKC became founding partner", "The memory architecture behind Clyde"). Person schema met `knowsAbout` 10+ topics, sameAs LinkedIn+Twitter+GitHub. Budget 8 uur + video shoot.

---

## 30/60/90 day roadmap

Alle werk door Daley solo. Geen parallel werk aangenomen.

### Week 1 (day 1-7): BLOCKERS
- Dag 1-2: B-1 + B-2 (forms bedrading) + B-3 (chatbot pricing) + B-4 (llms.txt regenerate). Testen met curl + Perplexity smoke-query.
- Dag 3: B-5 (og-image) + B-6 (skip-link + mega-menu keyboard) + B-7 (text-muted contrast).
- Dag 4: B-8 (ApplicationForm a11y) + B-9 (tier-matrix NL labels) + B-10 (proxy rename + vitals + CVE patches).
- Dag 5: regressie-testen (`npm run build && npm run lint`), Lighthouse + axe audit, handmatige keyboard-flow check.
- Dag 6-7: deploy + monitor 48 u, bug-fix passes.

### Dag 8-30 (weeks 2-4): P1 execution
Volgorde: rank 1-5 eerst (domain + Calendly + lazy + Spline + i18n) in week 2. Rank 6-12 in week 3 (copy polish + SKC metrics + schema + CTAs + mobile + meta + crawlers). Rank 13-20 in week 4 (lint errors + focus + motion + cookie banner + lead magnet MVP + blog kickoff + pricing restructure + cleanup). Na elke batch: smoke-test + commit met phase-label.

### Dag 31-60 (weeks 5-8): P2 strategic
Week 5-6: Next.js 16 modernization (S-1) + schema depth upgrade (S-3) + storytelling Problem-section (S-4).
Week 7-8: Start GEO content program (S-2) — eerste vs-page + glossary + eerste blog post. Skill-page proof artifacts batch 1 (4 skill pages). Lead magnet tier 2 (ROI calc).

### Dag 61-90 (weeks 9-13): iteration + measurement
Week 9-10: GEO content batch 2 (survey report draft, remaining vs-pages, 4 blog posts). Skill-page proof batch 2 (7 remaining).
Week 11-12: Founder presence push (S-10) + ES native-review (S-8) + second case study prospecting (S-7 start).
Week 13: measurement — Lighthouse CI, Vercel speed insights, conversion funnel (apply/visit), AI citation sampling (manual in ChatGPT/Perplexity/Google AI Mode). Dashboard bouwen in Vercel Analytics + Supabase applications tabel.

---

## Estimated effort vs lift

Rough guide. "Lift" is conservatieve schatting, niet gegarandeerd.

| Block of work | Uren | Verwachte lift |
|---|---:|---|
| P0 blockers (B-1 t/m B-10) | 14.5 | Stop revenue leak op `/apply` + `/contact` (onmeetbaar, maar was 0). Chatbot trust herstel. EAA compliance ready. OG-card + LLM citation correctheid. |
| P1 rank 1-5 (foundation) | 13 | Initial-load -70 KB gz + -1.3 MB prefetch waste. Post-submit Calendly +30-60% book rate. Schema entity-graph: 3.2x AI Mode citation lift per research. |
| P1 rank 6-12 (polish + mobile + SEO) | 14 | Mobile conversion +20-40% sticky CTA. NL-native-feeling partnership. GEO-ready robots + schema. SEO meta fixes voorkomt 30 procent SERP truncation. |
| P1 rank 13-20 (tech debt + content) | 22 | Lint as build gate. Next 16.2.4 CVE close. Lead magnet capture 5-10% cold traffic. Eerste 2 blog posts voor topical authority. |
| S-1 Next.js 16 modernization | 30 | Instant navigation + PPR + Server Actions. LCP verbetering 20-30 procent verwacht. |
| S-2 GEO content program (5 pages) | 70 | Perplexity/ChatGPT citation probability +3-5x voor definition-queries. Survey-rapport wordt primary citation asset voor hele topic cluster. |
| S-3 Schema depth (@graph + DefinedTerm) | 8 | Rich results op 15+ URLs. SEO maturity 68 → 85. |
| S-5 Skill-page proof artifacts | 20 | Skill-to-apply conversie +25-50 procent. |
| S-9 Blog tot 10 posts | 130 | Long-tail keyword capture. Volume geeft topical-authority signal voor Google. |
| S-10 Founder presence + Person schema | 12 | Apply trust +10-20 procent. E-E-A-T baseline. |

---

## Known unknowns

Dingen die deze audits niet konden meten.

- **Werkelijke conversie-cijfers**: geen Vercel Analytics data geanalyseerd. Unknown: visitors per maand, bounce-rate per page, actual apply-rate, drop-off points. P1 #13 (lint fix) + `/api/vitals` fix zijn cruciaal om dit zichtbaar te maken.
- **Stripe live prices**: `.env.example` lijst Stripe price IDs maar de audit kon niet verifiëren of live Stripe products matchen met pricing-page. Risk: zelfde bait-and-switch als chatbot issue als Stripe products niet zijn geüpdatet naar v10.
- **Vercel domain config**: of `future-marketing.ai` of `futuremarketingai.com` is de primary en welke is redirect. 15 min Vercel dashboard check lost dit op.
- **Werkelijke visitor bron**: geen GA4/Plausible data. Unknown: komt traffic vooral van Google organic, LinkedIn, direct, of referral? Beïnvloedt prioriteit van GEO vs SEO vs social proof work.
- **Calendly bezetting Daley**: onbekend of huidige calendar-structuur vol zit of leeg is. Beïnvloedt of post-submit Calendly embed (P1 #2) overweldigend of perfect getimed is.
- **Perplexity / ChatGPT baseline citation rate**: onbekend of FMai vandaag al wordt geciteerd op "AI marketing NL" queries. Baseline meten (handmatig 10-20 queries) nu, herhaal na 8 weken, meet delta.
- **Kv K registratie status**: Wikidata + `sameAs` kunnen pas complete als FMai officieel ingeschreven is bij Kamer van Koophandel. Timing van S-3 hangt af van formele bedrijfsvorm.
- **Real mobile visitor share**: zonder analytics onbekend of de mobile UX gaps (sticky CTA, pricing carousel, hamburger hit area) 10 of 60 procent van traffic raken.
- **Sindy's instemming voor case-study cijfers**: P1 #7 vraagt interview + publiceren van concrete SKC metrics. Sindy moet akkoord zijn met specifieke getallen (uren, engagement, omzet indien van toepassing).

---

## Appendix A — by-audit summary

### 01 — Performance (`C:\Users\daley\Desktop\Futuremarketingai\docs\audits\2026-04-24-full-audit\01-performance.md`)
Initial JS 787 KB uncompressed / 207 KB gzipped over 13 chunks op home. Spline 3D kost 4 MB (Three.js + WASM) maar is correct lazy, alleen `scene.splinecode` (1.3 MB) wordt op elke route geprefetched. ChatWidgetIsland, CalendlyIsland, BookingModal mounten op elke page (circa 70 KB gz waste). Volledige i18n message tree (circa 44 KB gz) naar client op elke page. Drie blurred blob animations op elke page hameren GPU. `/api/vitals` 404t op elke pageload. `OrbitVisual` + `hero-robot.png` dode code. Drie Google font families = 3 preloads. Top wins: 5-10 kleine fixes die initial load circa 70 KB gz lichter maken.

### 02 — Copywriting (`C:\Users\daley\Desktop\Futuremarketingai\docs\audits\2026-04-24-full-audit\02-copywriting.md`)
NL-copy is sterk (84/100) op positionering en IK/WIJ maar lekt in drie plekken: `skills-data.ts` tier-matrix labels Engels (16 fixes — kritieke conversie-page), credit-pack `"Onbeperkt"` voor 15k credits (ondermijnt transparantie), `klanten` → `merken` slips op apply-form en pricing-descriptions. 11 IK/WIJ slips op about + contact + founding waar style-guide IK voorschrijft. `chatbots.*` namespace is orphan (194 regels). EN copy is goed maar te stijf (uncontracted verbs). ES "Empleado AI" is ongewoon, vraagt native-review. 1 kritieke + 2 hoge + circa 25 polish fixes.

### 03 — Marketing + Conversion (`C:\Users\daley\Desktop\Futuremarketingai\docs\audits\2026-04-24-full-audit\03-marketing-conversion.md`)
Conversion maturity 60/100. Critical: `/api/apply` dropt elke aanvraag naar console.log (data loss), geen post-submit Calendly, SKC case heeft 0 outcome metrics, geen lead magnet = geen remarketing base. Hero splits intent met 2 equal-weight CTAs. Pricing mist annual discount + "Most popular" visual anchor + ROI calc + risk reversal. 11/12 skill-pagina's hebben geen demo/proof artifact (alleen voice-agent). Apply form 8 fields single-step zonder progress bar. 20 conversion leaks gerankt. Top 10 A/B test hypotheses met expected lift.

### 04 — SEO Technical (`C:\Users\daley\Desktop\Futuremarketingai\docs\audits\2026-04-24-full-audit\04-seo-technical.md`)
SEO maturity 68/100. Metadata coverage 100 procent (28 pages). Schema breedte OK maar diepte shallow: Organization `sameAs` alleen LinkedIn (mist Wikidata, KvK, Twitter, Crunchbase), geen Person schema, `ServiceJsonLd` dead code niet gebruikt op 12 skill pages, FaqJsonLd mist op founding-member. `og-image.png` bestaat niet (elke social share broken). `hasOfferCatalog` refereert v9 "Marketing Machine" bundels. Meta descriptions te lang (home 228, pricing 172, etc. Google cut-off 160). `x-default: /en` conflicts met NL-source-of-truth claim. Blog index hardcoded EN titel. 1 blog post. Redirects OK.

### 05 — GEO / LLM Citation (`C:\Users\daley\Desktop\Futuremarketingai\docs\audits\2026-04-24-full-audit\05-geo-llm-citation.md`)
GEO maturity 42/100. `llms.txt` + `llms-full.txt` beschrijven verouderd v9 product met oud pricing + dead URLs = actively poisoning LLM crawlers. `sameAs` + Person schema missen = geen entity graph = 3.2x citation lift gemist. 0 Speakable. 0 DefinedTerm. FAQ alleen op 2 van 22 pages. Geen `/skills` hub page. Geen `/vs` comparison pages. Citation-worthy assets dun (geen proprietary benchmarks, frameworks, surveys). Roadmap: 5 "citation-bait" pages (survey, glossary, framework, 2 vs-pages). Top-3 strategic: publish research rapport, put real SKC numbers, build glossary + vs-pages.

### 06 — Data Accuracy (`C:\Users\daley\Desktop\Futuremarketingai\docs\audits\2026-04-24-full-audit\06-data-accuracy.md`)
Verdict FAIL: twee surfaces serveren v9 pricing. Chatbot tools (`leadgen-tools.ts`, `concierge-tools.ts`) quoten Growth €1.497 (moet 2.497), Pro €2.997 (4.497), Ent €4.997 (7.997), "11 skills" (12), geen Partner tier. Chatbot KB zegt Partner heeft "all 12 skills" (echt 8 + 2 add-ons). `llms.txt` + `llms-full.txt` v9 product model. 5 verschillende contact emails in codebase (hello/privacy/info/apply/contact@). Domain mismatch `future-marketing.ai` vs `futuremarketingai.com`. Header mega-menu hardcoded EN. US phone number `+1 (570) 783-8236` in voice demo. Legal "March 2026" stale. Good news: pricing page, messages, JSON-LD, legal terms, skill counts zijn ALLES in sync.

### 07 — UX + Accessibility (`C:\Users\daley\Desktop\Futuremarketingai\docs\audits\2026-04-24-full-audit\07-ux-accessibility.md`)
Geen skip-to-content link (WCAG 2.4.1 fail). Skills mega-menu niet keyboard-bedienbaar (2.1.1 fail). `text-muted` #5a6378 contrast 3.23:1 op 46+ plekken (1.4.3 fail). ApplicationForm geen per-field errors (3.3.1 fail). BookingModal focus trap brittle. Focus-visible rings ontbreken globaal. Reduced-motion dekt alleen blobs, niet de 17 andere keyframes. CookieBanner stale palette #050814/#00D4FF. Hardcoded EN in ContactForm + error + 404. Mobile: geen sticky CTA, pricing 5 stacked tiers, no horizontal-scroll affordance op tier-matrix. EAA per 2025-06-28 = niet compliant op 5 critical-path items (skip-link, mega-menu, contrast, form errors, focus indicators). Remediation ongeveer 1 week focused work.

### 08 — Technical Quality (`C:\Users\daley\Desktop\Futuremarketingai\docs\audits\2026-04-24-full-audit\08-technical-quality.md`)
Build passes (9.8 s) maar lint fails hard: 36 errors + 13 warnings silent omdat lint niet in build gate. Zero Next.js 16 features adopted (geen `use cache`, geen `cacheTag`, geen Server Actions, geen PPR, geen loading.tsx). `middleware.ts` deprecated (build warning). 60 `use client` files (HeaderClient 456 lines client candidate voor split). 10 `any` casts in chatbot layer. npm audit 7 CVEs (picomatch + postcss). 21 packages outdated. CSP permissive (`unsafe-eval` + `unsafe-inline` + `api.anthropic.com` unnecessary). Rate-limit in-memory Map werkt niet op Fluid Compute. `/api/vitals` 404t maar geen route. Root screenshots committed (legacy Vite + PNGs). Upgrade path in 3 phases: security+hygiene (4-6 u), React 19 compliance (1-2 d), architecture modernization (1-2 w).

---

## Appendix B — fix registry (deduped)

Alle fixes uit de 8 audits, geconsolideerd, met: ID · bron audit(s) · file:line · fix · impact · effort · phase. Waar eenzelfde fix door meerdere audits wordt gevraagd, is er één rij met gecombineerde bron.

Legend: Effort XS <15 min, S <1 u, M 1-4 u, L >4 u. Phase = P0 (deze week) / P1 (2-4 wk) / P2 (kwartaal).

| ID | Source | File:line | Fix | Impact | Effort | Phase |
|---|---|---|---|---|---|---|
| R-001 | 03,08 | `api/apply/route.ts:86` | Resend integratie + Supabase insert + Slack webhook | Stop lost apply leads | M | P0 |
| R-002 | 03,08 | `api/contact/route.ts:45,95` | Resend + origin-check (geen wildcard CORS) | Stop lost contact leads + abuse risk | S | P0 |
| R-003 | 06,04,05 | `lib/chatbot/tools/leadgen-tools.ts:98-192`, `concierge-tools.ts:18-54` | Rewrite v10 tier-object (5 tiers + 12 skills + correcte onboarding) import vanuit skills-data.ts | Stop bait-and-switch trust-bug | M | P0 |
| R-004 | 04,05,06 | `public/llms.txt`, `llms-full.txt` | Volledige regeneratie v10 model | Stop AI-crawler poisoning | M | P0 |
| R-005 | 04 | `public/og-image.png` (ontbreekt) | 1200×630 PNG design + opslaan | Social share cards + Org logo werkt | S | P0 |
| R-006 | 07 | `src/app/[locale]/layout.tsx`, `PageShell.tsx:8` | Skip-to-content link + `id="main"` | WCAG 2.4.1 | S | P0 |
| R-007 | 07 | `components/layout/HeaderClient.tsx:215-313` | Skills mega-menu onClick + `aria-expanded` + ArrowDown keyboard + remove global doc-click handler | WCAG 2.1.1 + 4.1.2 | M | P0 |
| R-008 | 07 | `src/app/globals.css:18` | `--color-text-muted` van #5a6378 → #8C98AD | WCAG 1.4.3 op 46+ sites | S | P0 |
| R-009 | 07 | `components/apply/ApplicationForm.tsx:232-236` | Per-field errors + `aria-invalid` + `aria-describedby` + `autoComplete` tokens | WCAG 3.3.1 + 4.1.2 + EAA | M | P0 |
| R-010 | 02 | `src/lib/skills-data.ts:87,111,114,137,140,164-168,209,212,235-239` | Vervang "unlimited"/"add-on €X"/"/mo"/"niet beschikbaar" labels door NL of undefined (valt terug op i18n) | NL-native tier-matrix op pricing-page | S | P0 |
| R-011 | 08 | `src/middleware.ts` → `src/proxy.ts` | Rename file | Next.js 16 convention | XS | P0 |
| R-012 | 01,08 | `lib/web-vitals.ts:41` of nieuw `/api/vitals/route.ts` | Install @vercel/speed-insights of add route | Stop 404 storm + real metrics | S | P0 |
| R-013 | 08 | `package.json` | `npm install next@16.2.4 eslint-config-next@16.2.4 @next/mdx@16.2.4 @next/bundle-analyzer@16.2.4` | 7 CVEs dicht | S | P0 |
| R-014 | 04,05,06 | `src/lib/seo-config.ts:1` + `.env.example` + CLAUDE.md | Domain SSoT beslissing + unify (`future-marketing.ai` of `futuremarketingai.com`) | Consistentie 40+ refs | S | P1 |
| R-015 | 04,05 | `OrganizationJsonLd.tsx:13,74`, nieuwe `PersonJsonLd.tsx` | `sameAs` expansion (Wikidata create, LinkedIn, X, Crunchbase, KvK) + `@id` fragment + Person schema voor Daley | GEO 3.2x citation lift + E-E-A-T | M | P1 |
| R-016 | 03 | `ApplicationForm.tsx:64-70` success state | Vervang met inline Calendly embed | +30-60% book-to-apply rate | M | P1 |
| R-017 | 01 | `ClientIslands.tsx:16-28`, `StoreProvider.tsx:14-18` | Lazy-on-interaction pattern (FloatingChatTrigger + on-click load chat/calendly/booking) | -70 KB gz initial load | M | P1 |
| R-018 | 01 | `src/app/[locale]/layout.tsx:57-59` → `page.tsx` | Move Spline prefetch + preconnect naar home only | -1.3 MB waste op 28 routes | S | P1 |
| R-019 | 01 | `src/i18n/request.ts:11`, `layout.tsx:63` | Per-segment messages + scoped NextIntlClientProvider | -30-40 KB gz per page | M | P1 |
| R-020 | 02 | `messages/nl.json:568,587,606,1461,1544-1550,1562,1657,1719` | `klanten` → `merken` (8 schendingen) | Brand glossary discipline | S | P1 |
| R-021 | 02 | `messages/nl.json:668,719`, `pricing.faq.q2` | Hernoem credit pack "Onbeperkt" → "Max" of "Scale XL" | Behoud transparantie-belofte | S | P1 |
| R-022 | 02 | `nl.json:440,494,511,811,830,1345,1370,1410` + `about.capacity.body:511-512`, `contact.applyCallout.body:830`, `founding-member.benefits.community.description:1370` | IK-stem doortrekken (11 rewrites) | Partnership-stem credibility | S | P1 |
| R-023 | 02 | `src/lib/skills-data.ts:50,54,72,78,96,98,123,125,149,151,226,288` | 9 em-dashes removen + 5 "brand voice" → "merkstem" | Copy hygiene | S | P1 |
| R-024 | 02 | `messages/nl.json:614, 1358` | "Feature-verzoeken" → "verzoeken voor nieuwe vaardigheden" | Glossary | XS | P1 |
| R-025 | 02 | `messages/nl.json:1966, 2015` | `skills-clyde` "losse tools" self-ref → "uitvoerders"/"schermen" | Brand glossary | XS | P1 |
| R-026 | 02 | `messages/nl.json:472` | `about.cta.demo_button: "Boek een strategiegesprek"` → `"Plan een gesprek"` | CTA consistency | XS | P1 |
| R-027 | 02 | `messages/nl.json:140-334` | Verwijder orphan `chatbots.*` namespace (194 regels) na verificatie route niet bestaat | Content hygiene | S | P1 |
| R-028 | 03 | interview + `messages/nl.json case_studies.skc.*` | SKC outcome metrics (uren/wk, engagement delta, post volume, CAC impact) + testimonial foto + LinkedIn | Trust +40-80%, GEO citation fix | L | P1 |
| R-029 | 04,05 | `SkillPageTemplate.tsx:81` | Wire up `ServiceJsonLd` op 12 skill-pagina's (dead code nu) | 12 rich-result opportunities | S | P1 |
| R-030 | 04 | `founding-member/page.tsx:158-176` | Add FaqJsonLd | Rich result op conversion-critical page | XS | P1 |
| R-031 | 04 | `ArticleJsonLd.tsx:26-50` | Add `image` + `publisher.logo` + `mainEntityOfPage` | Article rich result requirement | XS | P1 |
| R-032 | 05 | nieuwe helper in WebPage/Article + CSS `.speakable` class op home/memory/SKC paragraphs | Speakable schema | GEO citation precision | M | P1 |
| R-033 | 04 | `OrganizationJsonLd.tsx:35-65` | Update `hasOfferCatalog` naar v10 (12 skills + 5 tiers) | Content-parity (spam flag risk) | S | P1 |
| R-034 | 03 | `src/app/[locale]/page.tsx:128-138` | Demote hero secondary CTA naar text link (niet size=lg button) | +15-25% home apply clicks | XS | P1 |
| R-035 | 03 | nieuw `StickyMobileCTA` component | Sticky bottom-bar "Plan een gesprek" op home/memory/pricing/case/skill na 50% scroll | +20-40% mobile conversion | M | P1 |
| R-036 | 06 | `HeaderClient.tsx:40-135,438-448`, `messages/*/header.*` | i18n migratie mega-menu + Apply CTA in mobile drawer | NL/ES visitors correcte labels + mobile apply path | M | P1 |
| R-037 | 04 | `messages/{nl,en,es}.json` meta.description keys | Trim naar ≤160 chars (home 228→150, pricing 172→150, apply 200→150, founding 205→150, hiw 180→150) | Stop SERP truncation | S | P1 |
| R-038 | 05 | `src/app/robots.ts` | Expliciete Allow rules voor GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot, ChatGPT-User, Claude-Searchbot, CCBot | GEO-ready signal | S | P1 |
| R-039 | 06,08 | `seo-config.ts:3`, `concierge-kb.ts:220`, rest | Unify contact emails op `hello@` (customer-facing), houd `info@` alleen in Org ContactPoint | Single SSoT | S | P1 |
| R-040 | 08 | `next.config.ts:21` | Remove `https://api.anthropic.com` uit connect-src (niet browser-side) | Tighter CSP | XS | P1 |
| R-041 | 08 | 14 files in chatbot tool-results + `ProgressiveCTA.tsx:84` + `ChatWidget.tsx:108` | `<a href>` → `<Link>` from i18n navigation | Fix i18n locale routing breakage | S | P1 |
| R-042 | 08 | `DemoOrchestrator.tsx:210`, `WaveformVisualizer.tsx:19`, `CalendlyModal.tsx:42`, `CookieConsentBanner.tsx:19`, `HeaderClient.tsx:157`, `ServiceCard.tsx:63` | React Compiler purity fixes (Date.now/Math.random in render, setState in effect, Icon in render) | Voorkom render-loops + state preservation | M | P1 |
| R-043 | 08 | `package.json` scripts | Add `"prebuild": "npm run lint"` | Lint als build gate | XS | P1 |
| R-044 | 07 | `src/app/globals.css` | `*:focus-visible { outline: 2px solid var(--color-accent-system); outline-offset: 2px; }` + `html { scroll-padding-top: 5rem; }` | WCAG 2.4.7 + 2.4.11 | XS | P1 |
| R-045 | 07 | `BookingModal.tsx` focus trap | Return focus to trigger on close | WCAG 2.4.3 | S | P1 |
| R-046 | 07,01 | `globals.css:275-322` + `page.tsx:87-126` | `@media (prefers-reduced-motion: reduce)` wrapper rond alle 17 keyframes + hero inline animations | WCAG 2.3.3 | S | P1 |
| R-047 | 07 | `CookieConsentBanner.tsx:44-80` | Vervang `#050814`/`#00D4FF` door CSS vars | Brand consistency | XS | P1 |
| R-048 | 01 | `CookieConsentBanner` import | `next/dynamic(..., {ssr:false})` + skip als cookie geset | -8 KB gz returning users | S | P1 |
| R-049 | 07 | `pricing/page.tsx:127`, `ContactForm.tsx:66,85,87,94,189`, `error.tsx:13-22`, `not-found.tsx:9`, `ChatWidget.tsx:107,110,180` | Alle hardcoded EN strings → i18n keys | NL/ES locale parity | S | P1 |
| R-050 | 07 | `SkillsTierMatrix.tsx:63` | Add `role="region" aria-label="Pricing comparison" tabIndex=0` + shadow-gradient edge hint | WCAG 1.4.10 + mobile UX | S | P1 |
| R-051 | 07 | `HeaderClient.tsx:347` (mobile hamburger) + `Footer.tsx:224-241` (social) | Extend hit areas naar ≥44px | WCAG 2.5.8 best-practice | XS | P1 |
| R-052 | 07 | `FloatingLocaleSwitcher.tsx:67` | `aria-expanded` + `aria-haspopup` + `aria-controls` | WCAG 4.1.2 | XS | P1 |
| R-053 | 07 | `pricing/page.tsx:116-130` | "Most popular" badge als `aria-describedby` op card | WCAG 1.3.1 | XS | P1 |
| R-054 | 07 | `error.tsx` | Localise + suppress raw error.message (info-leak risk) | i18n + security | S | P1 |
| R-055 | 07 | `ApplicationForm.tsx:220` | Character counter (value.length / 5000) op problem textarea | Form UX | XS | P1 |
| R-056 | 07,08 | `VoiceDemoFAB.tsx` + `FloatingButton.tsx` | Stagger z-index of hide one op mobile (collide op bottom-6 right-6) | Mobile UX | XS | P1 |
| R-057 | 03 | nieuwe `LeadMagnetCTA` + `/api/newsletter` + Resend audience | 1 gated PDF "NL Bureau AI Readiness Checklist" | 3-5x top-of-funnel pipeline | L | P1 |
| R-058 | 04,05 | `content/blog/*.mdx` (2 nieuwe NL posts) + `src/app/feed.xml/route.ts` | "AI marketing automation Nederland 2026" + "ChatGPT vs Clyde voor bureaus" + Atom feed + category URL paths | Topical authority + GEO feed signal | L | P1 |
| R-059 | 03 | `pricing/page.tsx` herstructurering | FAQ naar top, annual discount, Pro tier visual anchor, ROI calc, comparison matrix collapsible | +10-20% pricing-to-apply + +10-20% ACV | L | P1 |
| R-060 | 01 | `src/components/hero/OrbitVisual.tsx` + `public/images/hero-robot.png` + `hero-robot.webp` + 20+ root PNGs + empty dirs | Delete dead code + stray artifacts | Repo hygiene | S | P1 |
| R-061 | 08 | `package.json` | Remove `@google/stitch-sdk` uit prod deps (unused) + `npm update` 21 outdated | Bundle + supply-chain | S | P1 |
| R-062 | 03 | `ApplicationForm.tsx` | Multi-step (2 steps) + progress indicator + pre-fill tier van skill page source | +10-25% form completion + +5-10% | M | P1 |
| R-063 | 03 | `ApplicationForm.tsx` tier dropdown | Haal prijzen uit opties (premature anchoring), laat tier-naam staan | +5-10% form completion | XS | P1 |
| R-064 | 03 | `HeaderClient.tsx:338-343` | Header Apply CTA via `<CTAButton>` component (niet raw `<Link>` met hand-rolled classes) | Brand consistency | XS | P1 |
| R-065 | 02 | 12 skill-page integrations.subtitle + allocation.subtitle + cta.subtitle | Variatie per skill (nu 12× identiek) | Polish tegen monotonie | S | P1 |
| R-066 | 03 | case-study testimonial structure | Sindy foto + LinkedIn URL toevoegen | Single testimonial verdient beter | S | P1 |
| R-067 | 03 | `messages/nl.json:738` | Pricing final CTA herhaal counter: "{taken} van 10 Founding plekken nog open" | Urgency | XS | P1 |
| R-068 | 07 | `nl.json home.stats.hours.value:86` | "Persistent" → "Voor altijd" | Jargon removal | XS | P1 |
| R-069 | 07 | `apply.form.clientCountLabel` + form tier options | Tier-options zonder prijs, portfolio-maat ipv tier-naam | Minder premature anchoring | S | P1 |
| R-070 | 08 | `src/app/api/contact/route.ts:45-48` | Drop CORS OPTIONS handler (same-origin only) of explicit origin-allowlist | Security hygiene | XS | P1 |
| R-071 | 01 | `src/lib/fonts.ts:3-27` | Drop Space Grotesk OR JetBrains Mono (3 font families = 3 preloads) | -1-2 font requests | S | P1 |
| R-072 | 01 | `HeaderClient.tsx:6` + `FloatingLocaleSwitcher.tsx:7` | Remove Motion import, swap AnimatePresence voor CSS transitions | -10-15 KB gz op elke page | M | P1 |
| R-073 | 01 | `HeaderClient.tsx:174-180` | Outside-click listener alleen attachen als `skillsOpen === true` | Micro INP | XS | P1 |
| R-074 | 04 | `legal/privacy/page.tsx:11-23`, `terms`, `cookies` | Route legal subpages door `generatePageMetadata` | OG/Twitter/hreflang coverage | S | P1 |
| R-075 | 04 | `blog/page.tsx:24-26` | Vervang hardcoded EN titel/description door `useTranslations` | ES/NL SEO | XS | P1 |
| R-076 | 04 | `src/lib/seo-config.ts ENTITY_DESCRIPTION` | Update met Clyde + founding/20-per-year + 12 skills | AI crawl SSoT | XS | P1 |
| R-077 | 04 | `src/app/sitemap.ts` | Add `/legal/privacy`, `/legal/terms`, `/legal/cookies`. Raise `/contact` priority van 0.6 naar 0.7 | Sitemap completeness | XS | P1 |
| R-078 | 06 | `messages/*/legal/last_updated` + `seo-config.ts PAGE_DATES` | Update naar "april 2026" / 2026-04-24 | Freshness | XS | P1 |
| R-079 | 06 | `src/components/voice/VoiceDemoSection.tsx:67,93` | Move US phone naar env var `NEXT_PUBLIC_VOICE_DEMO_NUMBER` + label "US demo line" | Localization | XS | P1 |
| R-080 | 06 | `es.json` strings | Normaliseer `347 €/mes` formatting (niet mix `347 EUR` / `347 €` / `347 €/mes`) | ES consistency | S | P1 |
| R-081 | 08 | `next.config.ts:59` | Permissions-Policy: `microphone=(self)` voor `/skills/voice-agent` route | Voice demo werkt | S | P1 |
| R-082 | 08 | `lib/chatbot/rate-limiter.ts` + api routes | Migreer in-memory rate-limit naar `@upstash/ratelimit` (Redis) | Werkt op Fluid Compute | M | P1 |
| R-083 | 08 | `tool-results/*`, `useElevenLabsCall.ts` | 10 `any` casts → discriminated unions uit `lib/chatbot/types.ts` | Type safety | M | P1 |
| R-084 | 08 | `package.json` engines | Pin Node `>=22.0.0` | Runtime stability | XS | P1 |
| R-085 | 02 | `messages/nl.json:8,12` (hero badge + trust anchor) | Badge inkorten van 87 chars + "met Nederlandse bureaus" → specifiek "met SkinClarity Club" | Scannability + eerlijkheid | XS | P1 |
| R-086 | 02 | nieuwe `home.problem.*` keys + home page sectie | Problem-section tussen hero en services (40-60 woorden) | Storytelling arc "ja, dat is mijn probleem" trigger | S | P2 |
| R-087 | 02 | `messages/nl.json:437` | `about.hero.tagline` minder zelfdeprecair (weg "solo founder") | Positioneringskracht | XS | P1 |
| R-088 | 08 | `.env.local` cleanup | Remove `OPENAI_API_KEY` (not referenced anywhere) | Hygiene | XS | P1 |
| R-089 | 08 | `HeaderClient.tsx:1-456` | Split: Header (server, static data) + HeaderDisclosure (client, 200 LOC reductie) | RSC optimization | L | P2 |
| R-090 | 08 | `/api/apply` → Server Action co-located met form | Strip 95 LOC + progressive enhancement | Next.js 16 pattern | M | P2 |
| R-091 | 08 | `pricing/page.tsx`, `memory/page.tsx`, skill pages | `"use cache"` + `cacheLife('hours')` + `cacheTag` + `updateTag` hook | Instant navigation + tag invalidation | M | P2 |
| R-092 | 08 | `next.config.ts` | `experimental.ppr = 'incremental'` + opt-in home | Static shell + dynamic counter | M | P2 |
| R-093 | 08 | `src/app/[locale]/**` | Per-route `loading.tsx` + Suspense around ClientIslands | Streaming UX | M | P2 |
| R-094 | 05 | nieuwe `/onderzoek/staat-van-ai-marketing-nl-2026` page | Survey 40 bureaus, 3-5k woorden + Dataset schema | Primary GEO citation asset | L | P2 |
| R-095 | 05 | nieuwe `/frameworks/clyde-partnership-model` page | 2k woorden + HowTo + DefinedTerm | Named framework citation | L | P2 |
| R-096 | 05 | nieuwe `/woordenlijst` (+ `/glossary`, `/glosario`) | 30-50 DefinedTerm entries | "Wat is X" queries | L | P2 |
| R-097 | 05 | nieuwe `/vs/fmai-vs-losse-tools` + `/vs/ai-agency-vs-in-house` | Comparison tables + FAQPage + Review schema | Comparison queries (30% B2B research) | L | P2 |
| R-098 | 04 | nieuwe `/skills` hub page | ItemList schema met 12 skills + definition paragraphs | Definitive overview URL | M | P2 |
| R-099 | 08 | `tsconfig.json` | Enable `noUncheckedIndexedAccess` (itereer errors) | Type safety | L | P2 |
| R-100 | 04 | `OrganizationJsonLd.tsx:25` | Expand `knowsAbout` van 4 naar 8-15 topics | Topical authority | XS | P1 |
| R-101 | 04 | visible breadcrumb component | Add above H1 op pricing/skills/memory/founding/case-studies/about | Rich snippet requirement (schema + visible match) | S | P1 |
| R-102 | 03 | home services card + home page | Client logo strip "1 Founding partner:" met SKC + 9 placeholder boxes "Open — Apply for spot 2" | Scarcity visualization | S | P1 |
| R-103 | 03 | `/about` + apply hero | Daley photo (vervang "D" initial) + LinkedIn + 60-90s intro video | E-E-A-T +10-20% apply | L | P2 |
| R-104 | 03 | per skill page | 1 proof artifact (screenshot, Loom, sample output) per skill | +25-50% skill-to-apply | L | P2 |
| R-105 | 03 | verwerven second client + publiceren | Tweede case study vignette (Growth of Pro tier) | +20-40% cross-vertical credibility | L | P2 |
| R-106 | 02 | `en.json` file-wide | Contractions pass (do not → don't, would rather → we'd) | EN warmth match NL | S | P2 |
| R-107 | 02 | `es.json` file-wide | Native-review voor "Empleado AI", "IA con RGPD primero", "partnership" | Premium brand polish ES | M | P2 |
| R-108 | 03 | `messages/nl.json:1414` booking + `/apply` preview | Testimonial pull-quote van Sindy op homepage above-the-fold | +5-10% scroll-to-FAQ conversion | XS | P1 |
| R-109 | 04 | `content/blog/*.mdx` | Publish 5 more NL blog posts (total 7 NL) + 2 EN | Topical authority + long-tail SEO | L | P2 |
| R-110 | 05 | Wikidata create FMai entity | Create entry + link via Organization sameAs | #1 GEO signal (3.2x citation) | S | P1 |

---

*Einde Master Action Plan. Totaal 110 fixes geregistreerd na dedup (van circa 250+ unique issues across 8 audits). Uitvoering start bij B-1 t/m B-10 (P0, deze week).*
