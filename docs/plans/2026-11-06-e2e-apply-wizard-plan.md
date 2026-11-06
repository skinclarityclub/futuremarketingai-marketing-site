# Plan: e2e apply-wizard groen zonder één echte aanvraag (2026-11-06)

Daleys keuze (a) na golf 5c. Alleen testcode, geen copy, geen productiecode.

## Probleem

`fmai-nextjs/tests/e2e/apply-wizard.spec.ts` is lokaal rood, en waar hij groen kan worden is hij gevaarlijk.

1. **De API-scoretests posten echte aanvragen.** Acht van de tien tests in `API scoring` sturen een geldige aanvraag naar `/api/apply`. Met `.env.local` (die staat in de hoofdcheckout) schrijft elke run acht leads in `fma_leads` op de gedeelde prod-DB, met een admin-mail, een bevestigingsmail en een Telegram-alert. Met `PLAYWRIGHT_BASE_URL` op prod gebeurt hetzelfde op de echte site. Zonder env falen ze.
2. **De vijf browserflows die indienen** (Branch A, Branch B, assessment-handoff, mobiel, Cal.com-fallback) posten dezelfde echte aanvraag vanuit de wizard, met dezelfde gevolgen. Zonder env lopen ze vast op `waitForResult`.
3. **De locale-test** telt de 404 van `/_vercel/speed-insights/script.js` onder `next start` als JS-fout. Dat pad bestaat alleen op Vercel. De console-tekst ("Failed to load resource ... 404") bevat de URL niet, dus filteren op de tekst helpt niet: de URL zit in `msg.location().url`.
4. **De locale-test draait `es`**, maar `es` staat sinds 2026-10-02 niet meer in `src/i18n/routing.ts` (`locales: ['en', 'nl']`). `/es/apply` stuurt door, dus die test meet een redirect en heet een locale-test.

## Aanpak (kleinste complete wijziging)

- **Scoring als pure test.** De acht scoregevallen roepen `scoreApplication` uit `src/lib/apply/scoring.ts` direct aan, met dezelfde invoer en dezelfde verwachtingen (`score` wordt `total`, `maxScore` wordt `max`). Dat is precies wat de route doet na Zod (`route.ts:178`), en het patroon bestaat al in `chat-fit.spec.ts` en `chat-logic.spec.ts`. Geen nieuwe dependency.
- **Honeypot en 422 blijven HTTP-tests**, want die keren terug vóór de Supabase-insert en de mails (`route.ts:165-170`, `247-257`). Ze slaan over als de basis-URL geen localhost is.
- **Browserflows met een mock van `/api/apply`**, via `page.route` zoals `apply-submit-event.spec.ts` al doet. De mock rekent het antwoord uit met dezelfde `scoreApplication` en `calHostedUrl`, dus de branch die de UI toont is de echte. Hij legt elke gepostte body vast; de Branch A- en de handoff-test toetsen dat de wizard de ingevulde identiteit en antwoorden echt meestuurt. De mock staat in een `beforeEach` voor het hele bestand, zodat geen browsertest in dit bestand ooit nog iets indient.
- **Locale-test**: errors krijgen hun bron-URL mee, en alles onder `/_vercel/` valt eruit. De lus wordt `['nl', 'en']`.

## Bewust niet

- Geen wijziging aan `route.ts` of het Zod-schema. De mock valideert niet met Zod; die gap dekken de payload-asserts deels, en de 422-test raakt de echte validatie.
- `nl-content-smoke` (13/18) en de andere bekende gaps uit de golf 5c-handover blijven buiten deze PR.

## Bewijs

- Baseline: de ongewijzigde spec op origin/main (`b863899b`) tegen `next start` zonder env, chromium.
- Na: dezelfde run met de fix, plus `npx tsc --noEmit` en `npx eslint` op de spec.
- Nul posts naar een echte `/api/apply` uit de browsertests: de mock telt de requests, en de serverlog toont geen apply-regels.
- Bewijs komt in `docs/plans/2026-11-06-e2e-apply-wizard-VERIFICATION.md`, de diff en de resultaten op een diffpagina voor Daley. Push en PR pas op zijn ja.
