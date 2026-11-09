# Golf 10 /en = /nl-structuur: VERIFICATION

Plan: `docs/plans/2026-11-09-en-home-nl-structuur-plan.md`. Branch `feature/en-home-nl-structuur`, basis `origin/main` c1b3cb9a (#122).
Port in `fc6fe4e1`, spec-update in de commit erna. Gemeten 2026-11-09 op een lokale productiebuild (`npx next build`, `next start -p 3125`).

## Besluiten van Daley

| Wanneer | Vraag | Antwoord |
|---|---|---|
| 11-08 | Wat krijgt /en? | "Golf 10: /en = /nl-structuur" |
| 11-09 14:08Z | Copy | "Akkoord" (513 Engelse teksten, vertaalregel: alles wat het bureau leest Engels, de posts van de voorbeeldmerken Nederlands) |
| 11-09 14:08Z | Geheugendemo | "Eraf, zoals /nl" |
| 11-09 14:08Z | App-schermen | "B: Engelse opname" |
| 11-09 ~14:45Z | Blokkade B (proefopname gaf andere beelden en laadfouten, zie vault-note) | "A: NL-beelden blijven". Geen prod-write, demobureau blijft `nl`, `b-shots-prop.patch` niet toegepast |

## Metingen

| Check | Commando | Uitkomst |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Build | `npx next build` (na de spec-wijziging opnieuw, want drie componenten waren door de patch aangeraakt en teruggezet) | exit 0 |
| Repo-checks | `npm run check:{palette,copy,i18n-orphans,sitemap-lastmod,indexability,llms}` | 6/6 OK |
| Copyregels | node-telling over de 13 `home.*`-groepen in en.json | title 52 tekens, meta 154; 0 em-dash, 0 en-dash, 0 "cohort", 0 "AI Collega" |
| Layout /nl naast /en | `R/g10-en/tools/m-g10en.mjs`, uitkomst `R/g10-en/meting-2.txt` en `meting-2rm.txt` (vorige sessie, zelfde broncode) | 1440/1280/1024/390, met en zonder reduced motion: geen overflow, geen kapotte beelden, axe 0, geen JS-fouten, geen Engelse tekst afgekapt; 1 subpixel-melding ("Pause", 2px in de eigen padding), geaccepteerd |
| Bijgewerkte specs | `PLAYWRIGHT_BASE_URL=http://localhost:3125 npx playwright test homepage home-hero3 conversion-polish reveal chatbot --project=chromium --project=mobile-chrome --workers=1` | 94 passed, 4 skipped (engine-afhankelijke view-timeline-skip en de bestaande `test.skip` op /nl/pricing) |
| Volledige suite | `PLAYWRIGHT_BASE_URL=http://localhost:3125 npx playwright test --project=chromium --project=mobile-chrome --workers=1 --grep-invert "lh (mobile\|desktop) "`, log `C:/tmp/g10en-e2e-full-2.log` | 759 passed, 5 failed, 32 skipped (53,7 min, 796 tests). Rood: 4x `apply-wizard.spec.ts:232/:247` (API guards, chromium + telefoon), bedoeld rood zonder Upstash-env lokaal; 1x `chatwidget-mocked.spec.ts:705` /nl telefoon, `openWidget`-timeout. Die herhaald met `--repeat-each=5` (beide locales): 10/10 groen, log `C:/tmp/g10en-e2e-705.log`. Bekende flake, raakt deze diff niet |

R = `C:/Users/daley/Desktop/80-Archief/fma-app-audits/2026-11-02-website-audit/design/ronde1b`

## Specs: wat ze toetsten en wat nu

Voor de port (vorige sessie, 12 /en-specs): 353 passed, 19 failed. De 19 = 9 per project plus 1 alleen op de telefoon; alle tien verschillende tests verwachtten de oude /en-home.

| Spec | Was | Nu |
|---|---|---|
| `homepage.spec.ts` | oude hero-CTA's, `#services` met 9 skill-links (2x), pillars-bento, oude Final CTA | /en en /nl renderen dezelfde twaalf `section[id]` in dezelfde volgorde; `#hero .ctas` naar `/en/apply` en `#een-week-met-clyde`; `#afsluiting` naar `/en/apply` |
| `home-hero3.spec.ts` | "Home hero on /en stays the old one" | "Home hero on /en is the same as /nl": titel, 1 h1, `#hero[data-b]` 1, oude hero 0, speakable 1/1, kring-preload 0, pauzeknop "Pause the animation", launcher 44px |
| `conversion-polish.spec.ts` | inline LeadMagnetCTA-badges op /en | `#afsluiting a[href="/en/assessment"]` "Or take the AI scan of your agency first" |
| `reveal.spec.ts` | `.fm-reveal` op /en (nu 0) | zelfde drie toetsen op `/en/about`, dat ScrollReveal nog gebruikt |
| `chatbot.spec.ts` | eerste zichtbare `a[href*="/pricing"]` (op de telefoon de externe planable.io-link in `#waarom`) | `a[href^="/en/pricing"]:visible` |

Verwijderd zonder vervanger: de twee tests op `#services` met 9 skill-links. De home linkt bewust niet meer naar de skillpagina's; de skillpagina's zelf hebben `skill-template-smoke.spec.ts`.

## Open

- Push, PR, merge: wacht op Daleys ja. Daarna prod-check /en en /nl plus PSI op /en.
- NL-app-beelden verversen: niet met een rechte heropname (proef 11-09: signalen weg, laadfouten op review en geheugen, verkeerde week). Pas met een seed die de copy dekt.
- Opruim-PR: 11 componenten zonder importer, oude `home.*`-sleutels in en.json, `lang="nl"` op de Nederlandse merkinhoud.
- ga4-consent-flake: eerst de oorzaak bewijzen.
