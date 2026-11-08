# Golf 9 vervolg: taalknop en Bright Data, VERIFICATION (2026-11-08)

Gemeten tegen `origin/main` = `5ff81d1f` (na fetch) en tegen prod via curl. Geen build, geen server, geen e2e.

| # | claim | verdict | bewijs |
|---|---|---|---|
| 1a | PR #108 = `aa95353f` op main | BEWEZEN | `git log origin/main`: `aa95353f fix(home): main weer groen ... (#108)`; `git branch -a --contains` toont origin/main |
| 1b | accessibility.spec en navigation.spec gebruiken `getByRole('heading', { level: 1 })` | BEWEZEN | `tests/e2e/accessibility.spec.ts:27`, `tests/e2e/navigation.spec.ts:25` (via `git show origin/main:`) |
| 1c | MemoryLiveComparison zet geen state in een effect voor de reduced-motion-eindstand | BEWEZEN (bedrading) | `src/components/home/MemoryLiveComparison.tsx:35-38` `useSyncExternalStore`, `:69-71` stage en woordtellers afgeleid van `reduced`, `:74` `if (reduced) return` vóór alle `setStage`. De overige `setStage` (`:86-113`) lopen alleen in de niet-reduced animatiecyclus. Of de ESLint-regel nu groen is: niet gedraaid |
| 1d | `docs/plans/2026-11-08-golf9c-VERIFICATION.md` op main bevat de live-sectie van 9c | BEWEZEN | bestand op origin/main, regel 59 `## Live (2026-11-08)` met poorttabel; laatst gewijzigd in `aa95353f` |
| 2 | PR #109 = `5ff81d1f` op main | BEWEZEN | `git log`: `5ff81d1f feat(header): language switch shows the flag ... (#109)`; is `origin/main` HEAD en HEAD van deze worktree |
| 3a | HeaderClient toont `<LocaleFlag locale={locale} />`, inline SVG, NL-vlag voor nl, Union Jack voor en | BEWEZEN | `HeaderClient.tsx:301` aanroep; `:395-` `LocaleFlag`: `locale === 'nl'` rood/wit/blauw `rect`s, anders `#012169`/`#C8102E` kruisen |
| 3b | klikvak `h-11 w-11` | BEWEZEN | `HeaderClient.tsx:299` |
| 3c | `hrefLang`/`lang` = andere locale | BEWEZEN | `HeaderClient.tsx:291-292` `hrefLang={otherLocale}` `lang={otherLocale}` |
| 3d | gtag-event `language_switch` blijft | BEWEZEN | `HeaderClient.tsx:297` |
| 3e | aria-labels nl en en | BEWEZEN | `HeaderClient.tsx:293-295`, beide strings letterlijk gelijk aan de claim |
| 3f | geen vlag-emoji | BEWEZEN | python-scan op U+1F1E6-1F1FF in HeaderClient.tsx: 0 treffers (comment `:395` noemt de reden) |
| 4a | prod /nl: `aria-label="Language: Dutch. Switch to English"`, `hrefLang="en"` + href `/en` | BEWEZEN | curl /nl (200): `<a hrefLang="en" lang="en" aria-label="Language: Dutch. Switch to English" class="group inline-flex h-11 w-11 ..." href="/en">` |
| 4b | prod /en: `aria-label="Taal: Engels. Wissel naar Nederlands"`, href `/nl` | BEWEZEN | curl /en (200): `<a hrefLang="nl" lang="nl" aria-label="Taal: Engels. Wissel naar Nederlands" ... href="/nl">` |
| 4c | oude tekst "English (EN)" / "Nederlands (NL)" weg uit prod-header | BEWEZEN | `grep -c` op de volledige HTML van /nl en /en: 0 en 0 |
| 4d | prod serveert de vlag (niet alleen het label) | BEWEZEN | /nl bevat `AE1C28` (NL-vlag) 1x, 0 Union Jack; /en bevat `012169` 1x, 0 `AE1C28` |
| 5a | prod /legal/privacy nl bevat de Bright Data-regel, letterlijk, in groep Webdata en SEO | BEWEZEN | curl /nl/legal/privacy (200): tekst `... DataForSEO (...) en Bright Data (antwoorden van ChatGPT ophalen om vermeldingen in AI-antwoorden te meten; gevestigd in Israël, waarvoor een adequaatheidsbesluit van de Europese Commissie geldt).` binnen het `Webdata en SEO:`-blok. Letterlijk gelijk (ook in `messages/nl.json:2263`). Kanttekening: `/legal/privacy` zonder locale geeft 308 naar `/nl/legal/privacy`, niet 200 |
| 5b | `messages/es.json` op main bevat de es-variant | BEWEZEN | `messages/es.json:1571`: `Datos web y SEO: ... y Bright Data (obtención de respuestas de ChatGPT ... con sede en Israel, país que cuenta con una decisión de adecuación ...)` |
| 5c | `legal.last_updated` = 8 november 2026 | BEWEZEN | `nl.json:2308` "Laatst bijgewerkt: 8 november 2026"; prod /nl toont dezelfde zin; en.json:1616 en es.json:1616 ook bijgewerkt |
| 6a | `/es` geeft 301 naar `/en` | BEWEZEN | `curl -sI https://future-marketing.ai/es`: `HTTP/1.1 301`, `Location: /en` |
| 6b | /nl, /en, /nl/pricing, /nl/legal/privacy, /en/legal/privacy geven 200 | BEWEZEN | curl `-w %{http_code}`: 200 voor alle vijf |
| 7a | m-nav prod: 0 PROBLEEM | BEWEZEN (log) | `.../taalknop/prod.log`: 11 regels, 10 eindigen op `\| ok`, laatste regel `0 PROBLEEM` |
| 7b | idem `na.log` en `na-reduce.log` (lokale build) | BEWEZEN (log) | beide 11 regels, 10x `\| ok`, laatste regel `0 PROBLEEM`. Het zijn logs, ik heb de meting niet herhaald. `prod.log` en `na.log` hebben dezelfde grootte (1631 B) |
| 8 | `failB.txt` (24) is deelverzameling van `failBase.txt` (31) | BEWEZEN als verzamelingsrelatie | `comm -23 <(sort -u failB) <(sort -u failBase)` = 0 regels. Wat ik niet kan toetsen: dat `failBase.txt` echt "tegen prod vóór de merge" is gedraaid (geen tijdstempel in het bestand) |
| 9a | vault-note bestaat met frontmatter | BEWEZEN | `Agency/Rapporten/2026-11-08 Taalknop en Bright Data.md` (4599 B), frontmatter title/type/tags/created/source/summary |
| 9b | bronnen-URL's met "(as of 2026-11" | BEWEZEN | 5 voorkomens van "as of 2026-11" op regels 28-32; de 6 URL's in de note (brightdata license/privacy/DPA/trustcenter, EC adequacy, DPF) staan allemaal op die regels |
| 10a | werkboom schoon behalve untracked `.audit-screens/` | BEWEZEN | `git status --short`: alleen `?? fmai-nextjs/.audit-screens/`; `git diff --stat HEAD` leeg. Dit VERIFICATION-bestand kwam er als enige bij |
| 10b | `test-results/.last-run.json` en `playwright-report/index.html` niet gewijzigd | BEWEZEN | beide zijn tracked (`git ls-files`) en komen niet voor in `git status` |
| 10c | op poort 3122 luistert niets | BEWEZEN (nu) | `netstat -ano \| findstr :3122`: geen regels. Momentopname, zegt niets over eerder |

## Niet bewezen of afwijkend

- 7: de m-nav-logs zijn niet herhaald, en het log laat niet zien of het 44 px-klikvak van de taalknop zelf gemeten is.
- 8: de herkomst (prod, vóór merge) van `failBase.txt` is niet te toetsen; alleen de subset-relatie is gemeten.
- 5/6: `/legal/privacy` zonder locale is 308, geen 200. Geen conflict met de claim (die noemt `/nl/` en `/en/`), maar wel waar.

## Aanvulling hoofdloop (2026-11-08)

- **Claim 7, klikvak.** `hdr-shots.mjs` (scratchpad) mat de bounding box van `header a[hreflang]` op 2x DPR. Voor (prod vóór #109): 28x44 en 27x44. Na (lokale build van #109): 44x44 op nl en en, 1280 en 390. Shots staan in `ronde1b/g9/taalknop/close/`.
- **Claim 8, baseline.** `failBase.txt` komt uit `prB-e2e-prodbase.log`. Die run liep tegen https://future-marketing.ai vóór de merge van #109 (`mergedAt` 07:17:10Z). De bestandstijd staat in de handover.
