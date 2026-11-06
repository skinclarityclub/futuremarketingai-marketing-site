# VERIFICATION: e2e apply-wizard (2026-11-06)

Plan: `docs/plans/2026-11-06-e2e-apply-wizard-plan.md`. Branch `fix/e2e-apply-wizard` op origin/main `b863899b`, worktree `C:/tmp/fmai-e2e-apply`. Alleen `fmai-nextjs/tests/e2e/apply-wizard.spec.ts` gewijzigd.

## Gemeten (chromium, worktree zonder `.env.local`, geen app-secrets in de omgeving)

| Run | Server | Spec | Groen | Rood | Overgeslagen | POSTs die de route haalden |
|---|---|---|---|---|---|---|
| baseline | `next start -p 3051` | origin/main | 4 | 8 | 9 | 6 (alle 500 bij de limiter) |
| fix, 3x | `next start -p 3051` | zonder hydration-wacht | 57 | 6 | 0 | 6 = 2 guards x 3 |
| fix, eind | `next start -p 3051` | eindversie | 19 | 2 | 0 | 2 = de guards |
| baseline | `next dev -p 3052` | origin/main | 20 | 1 | 0 | **16** |
| fix | `next dev -p 3052` | zonder hydration-wacht | 20 | 1 | 0 | 2 |
| fix, 3x | `next dev -p 3052` | eindversie | **63** | **0** | 0 | 6 = 2 guards x 3 |

Commando: `PLAYWRIGHT_BASE_URL=http://localhost:<poort> npx playwright test tests/e2e/apply-wizard.spec.ts --project=chromium --reporter=list [--repeat-each=3]`. De baseline draaide als tijdelijke kopie `zz-baseline-apply-wizard.spec.ts` uit `git show HEAD:`, en die kopie is weer weg. POSTs zijn geteld als `POST /api/apply`-regels in de dev-serverlog, en onder `next start` als Upstash-fouten in de log (16 in totaal = 6 baseline + 10 guards).

- **De kern**: de ongewijzigde spec stuurt op `next dev` 16 posts naar `/api/apply`. In deze worktree liepen die dood op placeholders (Supabase, Resend, Telegram en de inbox zijn allemaal dormant zonder env). In de hoofdcheckout, waar `.env.local` staat, waren dat 16 echte leads in `fma_leads` geweest, met mails en Telegram-alerts. De fix stuurt er alleen de 2 guards, en die keren terug vóór de insert.
- `npx tsc --noEmit`: exit 0. `npx eslint tests/e2e/apply-wizard.spec.ts`: 0 errors, 1 warning (`progressBar` ongebruikt), en die stond er al.
- **De speed-insights-fout** heeft twee vormen: "Refused to execute script from '.../_vercel/speed-insights/script.js' because its MIME type ('text/html')" (URL in de tekst) en "Failed to load resource ... 404" (URL alleen in `msg.location()`). De locale-test filtert beide, en alleen op `/_vercel/`.
- **De hydration-race onder `next dev`**: twee keer gezien, in een andere test (baseline: mobiel "starts in view", fix: Cal.com-fallback), met dezelfde vorm: de wizard bleef op de identiteitsstap. `waitForHydration` wacht op de React-fiber op `#apply-name`. Daarna 63/63.

## Open, bewust niet in deze PR

- **API-guards onder `next start` zonder Upstash-env: 500.** Een productiebuild draait `applyRateLimit` vóór de validatie (`route.ts:123-127`) en zonder `UPSTASH_REDIS_REST_URL` geeft die "Failed to parse URL from /pipeline". Op `next dev`, de webServer uit `playwright.config.ts`, staat de limiter uit en zijn ze groen. Staat in een commentaar in de spec.
- **Firefox en webkit** (`next start`, eenmalig): baseline 6 groen, 16 rood en 20 overgeslagen; fix 10 groen, 12 rood en 20 overgeslagen. Webkit: 11 rood in beide, al bij `#apply-name` zichtbaar, dus een omgevingsprobleem; niet onderzocht. Firefox na de fix: 1 rood, "Service Worker registration failed: Error" in de Branch A-test. Die test kwam in de baseline niet zo ver. Niet weggefilterd, want het is een echte appfout tot het tegendeel bewezen is.
- **De mock valideert niet met Zod.** De payload-asserts in Branch A en de handoff dekken de mapping van wizard naar body; de 422-guard raakt de echte validatie.
- Niet gemeten tegen prod of een preview, en dat hoort zo: de scoretests posten niets meer, en de guards slaan over buiten localhost.
