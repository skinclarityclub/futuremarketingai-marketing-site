# Golf 5c: prijscopy buiten /pricing gelijk met /pricing (plan, 2026-11-06)

Daley koos op 2026-11-06 a, b en c: golf 5c (/apply, home, header), /about en IcpSection van "10 per jaar" af, en PR #63 sluiten. PR #63 is dicht: de Enterprise-offer op main noemt geen API meer.

Bron van waarheid is /pricing op `83cd16bc`:
- `pricing.founding.list.n5`: "Het tarief blijft vast zolang je klant blijft";
- `pricing.included.items.n5`: de WhatsApp-lijn met Daley zit in elk pakket;
- `pricing.later.enterprise`: "Enterprise heeft geen caps (fair use).";
- `pricing.founding.after`: zijn de 10 plekken bezet, dan sluit Founding, zonder heropening.

Branch `feature/golf5c-copy`, gemaakt van origin/main in worktree `C:/tmp/fmai-golf10`. De checkout op het bureaublad loopt 173 commits achter op origin/main en is daarom niet bruikbaar.

## Blok A: /apply, home, header (keuze a)

| Key | Waar | Nu | Wordt |
|---|---|---|---|
| `apply.form.tierOptions.founding` | /apply stap Q1, nl+en | Founding (€997/mnd levenslang): 10 plekken, voorrang nu open | Founding (€997 per maand, vast zolang je klant blijft): 10 plekken |
| `apply.form.tierOptions.{growth,professional,enterprise}` | idem | €499 per werkruimte: 2 tot 4 merken | €499 per klantmerk: 2 tot 4 klantmerken (zoals op /pricing) |
| `home.prijs.lists.n4` | /nl #prijs | Het tarief blijft voor altijd vast | Het tarief blijft vast zolang je klant blijft |
| `home.prijs.sub` | /nl #prijs | ... en het tarief blijft voor altijd vast. | ... en het tarief blijft vast zolang je klant blijft. |
| `home.prijs.enterprise` | /nl #prijs | Enterprise: een directe lijn met Daley. | Enterprise heeft geen caps (fair use). |
| `home.prijs.table.head.n3` | /nl #prijs | Per werkruimte per maand | Per klantmerk per maand (gelijk aan `pricing.later.head.n3`) |
| `home.pricingTeaser.title` | /en home | Founding rate locked for life. Per-workspace after that. | Founding rate fixed while you remain a client. Per-workspace after that. |
| `home.pricingTeaser.tiers.founding.tagline` | /en home | Locked for life | Fixed while you remain a client |
| `home.pricingTeaser.tiers.enterprise.desc` | /en home | ... and a dedicated contact person. | ... No caps on skills (fair use). |
| `home.cta.subtitle` | /en home | €997 per month, locked for life. | €997 per month, fixed for as long as you remain a client. |
| `header.priceMenu.foundingMember.subtitle` | header, nl+en | Levenslang vast tarief | Vast tarief zolang je klant blijft |

De `home.pricingTeaser.*`- en `home.cta.*`-keys worden alleen op /en gerenderd. De nl-waarden gaan mee, want nl is de bron voor elke vertaling.

## Blok B: /about en IcpSection (keuze b)

- `about.capacity.reasoning` (nl+en): "Liever {maxPartners} bureaus ... Zit ik vol, dan plan ik een gesprek voor het volgende cohort." wordt "Liever {total} bureaus ... Zijn de {total} plekken bezet, dan sluit Founding, zonder heropening. Nieuwe bureaus starten daarna op de tarieven per klantmerk." Een volgend cohort bestaat niet meer sinds /pricing zegt dat Founding sluit zonder heropening.
- Code: `MAX_PARTNERS_PER_YEAR` weg uit `constants.ts`, de ongebruikte `maxPerYear` weg uit `IcpSection`, en `maxPartners` weg uit `about/page.tsx`. `request.ts` verliest zijn globale `{maxPartners}`-vervanging. Dat was de enige globale vervanging, en hij liep bij elke request over de hele catalogus.
- es blijft ongemoeid: `es` is sinds 2026-10-02 geen locale meer (`routing.ts`), dus zijn `{maxPartners}`-strings worden nergens geladen.

## Blok C: chatbot en llms (Daley 2026-11-06: "Ja, meenemen")

- `tool-data.ts` (prijskaartjes in de chat, nl+en):
  - Founding: "Vast tarief van €997 zolang je klant blijft (wordt nooit herijkt)";
  - de WhatsApp-lijn met Daley in elk pakket: Growth had "E-mailondersteuning", Enterprise "Directe lijn met Daley", en Founding "Directe toegang tot de founder".
- `concierge-kb.ts`, `support-kb.ts`, `leadgen-tools.ts`: "lifetime price lock" wordt "rate fixed for as long as the agency remains a client". Elk pakket krijgt "Direct WhatsApp line with Daley". Daarmee vervallen "Email support" (Growth), "WhatsApp support plus a monthly strategy call" (Pro) en "Direct line with Daley" (Enterprise). Die maandelijkse strategiecall staat niet op /pricing en ook niet in `skills.ts`.
- `public/llms.txt` en `llms-full.txt`: dezelfde claims, want zoekmodellen herhalen die letterlijk. `check-llms-consistency` blijft groen.
- `apply-templates.ts`: het tierlabel in de admin-mail aan Daley.

## Blok D: algemene voorwaarden (Daley 2026-11-06: "Meenemen")

- `legal.sections.terms.subsections.subscription_terms.content`: "EUR 997/mnd levenslang" wordt "EUR 997/mnd, vast zolang het abonnement doorloopt" (nl+en).
- `legal.last_updated`: 6 november 2026. Die key is gedeeld met de andere juridische pagina's.

## Bewijs vóór de diffpagina

- `npx next build` groen;
- de nl/en-catalogus heeft 0 keer "levenslang", "for life" of `{maxPartners}` (behalve in D, als hij die laat staan);
- `npx tsc --noEmit`;
- e2e `apply-wizard`;
- shots voor en na op 390 en 1280 px: /nl #prijs, /en home pricing en CTA, het header-prijsmenu, /apply Q1 en /about capaciteit.

Niets pushen voor Daley ja zegt op de diffpagina.
