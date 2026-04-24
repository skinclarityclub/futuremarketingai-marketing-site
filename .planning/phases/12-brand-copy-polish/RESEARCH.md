---
phase: 12-brand-copy-polish
type: research
created: 2026-04-24
---

# Research — Brand Assets + Copy Polish

Pre-execution research log. Answers the unknowns that would otherwise block 12-01 through 12-04.

---

## 1. `@vercel/og` image generation with Tailwind in App Router (2026 pattern)

**Question**: best practice for dynamic OG images in Next.js 16 App Router, including Tailwind-like styling and per-locale tagline injection.

**Findings**:

- Official pattern lives at `src/app/api/og/route.tsx` using `ImageResponse` from `next/og`. NOT `@vercel/og` directly — since Next.js 14 the React adapter is bundled in `next/og` and the external `@vercel/og` package is deprecated for App Router use.
- `ImageResponse` accepts JSX with **inline styles only** (no Tailwind classes — it uses Satori which parses a strict subset of CSS). To mimic Tailwind tokens, import values from `src/lib/og-theme.ts` (new file) that mirrors our design tokens.
- Fonts: load from `fs.readFileSync` of a woff file placed at `public/fonts/og/Inter-Bold.woff` or from `fetch` of a Google Fonts URL. Per Vercel docs, `fetch` is simpler but adds latency; static file read is preferred.
- Size contract: 1200×630 px, JPEG or PNG. Response cache: `{ headers: { 'cache-control': 's-maxage=31536000, stale-while-revalidate' } }`.

**Reference route** (for `/api/og?locale=nl`):

```tsx
import { ImageResponse } from 'next/og'
export const runtime = 'edge'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') ?? 'nl'
  const tagline = {
    nl: 'Jouw AI Marketing Medewerker. Voor Nederlandse bureaus.',
    en: 'Your AI Marketing Employee. For agencies.',
    es: 'Tu Empleado AI de Marketing. Para agencias.',
  }[locale]
  // ... ImageResponse JSX with <div style={{background: '#0a0d14', color: '#00d4aa'}}>
}
```

**Decision for 12-01**:
- **Ship STATIC `public/og-image.png`** (1200×630) + `public/logo.png` (512×512) now. This is a 2-minute P0 fix.
- **Optionally add `/api/og` route** for per-locale dynamic variants — nice-to-have, non-blocking. Include it in 12-01 as an "if time permits" task. If skipped, the static PNG works for all 3 locales (tagline in image = EN-ish "AI Marketing Employee for agencies" — tolerable since OG cards are read by English-language crawlers anyway).

**Asset generation path**: Daley uses Figma or Orshot (existing skill) to produce the static PNG. Spec:
- Background: `#0a0d14`
- Accent: `#00d4aa` (teal)
- Amber highlight: `#f5a623`
- Typography: DM Sans Bold for headline, JetBrains Mono for tagline
- Logo placement: top-left, 64px margin
- Headline center: "Clyde" in 120pt teal, "Jouw AI Marketing Medewerker" in 48pt white, "future-marketing.ai" in 32pt amber
- Export PNG at 1200×630 and 1200×1200 (square) — the square variant is referenced in some Twitter summary_large_image variants but audits do NOT cite it as required, so make it optional.

---

## 2. `next-intl` message namespace splitting for 500+ keys

**Question**: `messages/nl.json` is approaching 2200 lines. Is per-namespace file splitting worth it now?

**Findings**:

- `next-intl` 4.x supports namespaced messages out of the box — `useTranslations('pricing')` scopes into the `pricing.*` subtree regardless of file layout.
- Splitting into `messages/nl/pricing.json` + `messages/nl/home.json` etc. requires `getMessages()` refactor in `src/i18n/request.ts` to merge them at request time:

```ts
// src/i18n/request.ts
const messages = {
  ...(await import(`../../messages/${locale}/common.json`)).default,
  ...(await import(`../../messages/${locale}/home.json`)).default,
  // ...
}
```

**Decision**: **Do NOT split in this phase.** Bundle-size audit (01-performance.md, F-3) already flags full message tree ship as a P1 issue; the real fix there is **per-segment scoped `NextIntlClientProvider`** (P1 rank 5), not file-splitting. File-split without provider-scoping does nothing for bundle size.

**Implication for 12-02 / 12-03 / 12-04**: keep adding/modifying keys in the existing flat `messages/{nl,en,es}.json` files. Use `jq` for diff validation post-commit.

---

## 3. Orphan `chatbots.*` namespace — keep or delete?

**Question**: audit 02 §2.10 claims `messages/nl.json:140-334` (`chatbots.*`, 194 lines) is orphan because `/chatbots` route was deleted in Phase 09. Verify before deletion.

**Investigation**:

```bash
grep -rn "useTranslations('chatbots'\|getTranslations('chatbots'\|t('chatbots\." fmai-nextjs/src/
```

**Actual result**:
```
src/components/chatbot/DemoContextCard.tsx:12:  const t = useTranslations('chatbots')
src/components/chatbot/DemoPlayground.tsx:38:  const t = useTranslations('chatbots')
src/components/chatbot/MultiPlatformShowcase.tsx:20:  const t = useTranslations('chatbots')
src/components/chatbot/PersonaSelector.tsx:22:  const t = useTranslations('chatbots')
```

These components are actively used:
```
src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx:6: import { DemoPlayground }
src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx:7: import { MultiPlatformShowcase }
src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx:39: customProof={<div ...><DemoPlayground /><MultiPlatformShowcase /></div>}
```

**Verdict**: the `chatbots.*` namespace is **NOT orphan**. It is reused by `DemoPlayground` + `MultiPlatformShowcase` on `/skills/lead-qualifier` (the old 4-persona demo migrated to lead-qualifier page during Phase 06/07). Audit 02 §2.10 was wrong on this point.

**Decision for 12-04**: **DO NOT DELETE** `chatbots.*` namespace. Instead:
- (optional, not required) rename the namespace to `chatbotDemo.*` to reflect real semantic (the playground demo, not a deleted `/chatbots` route).
- Rename involves 4 component refactors + 3 JSON files + key walk — significant effort for pure naming clarity. **Skip in Phase 12.** Park as tech-debt for Phase 13+.
- Cross-reference the 4 glossary fixes audit 02 §2.1 flagged in `chatbots.*`:
  - `nl.json:257` `"tools"` → `"systemen"`
  - `nl.json:268` `"tools"` → `"systemen"`
  - **Do include these 2 rewrites in 12-04** since they are live glossary violations even though the namespace lives on.

---

## 4. `next-intl` variable interpolation pattern for `MAX_PARTNERS_PER_YEAR`

**Question**: 8 message keys hardcode `20 partners` / `20 bureaus` / `20 agencies`. How to interpolate from `src/lib/constants.ts`?

**Findings**:

- `next-intl` supports ICU message format: `"Max {maxPartners} bureaus per jaar"` + `t('key', { maxPartners: MAX_PARTNERS_PER_YEAR })` at call site.
- Existing pattern in the codebase (confirmed at `nl.json:8` `home.hero.badge`): `"{taken} van {total} founding plekken bezet"` with call-site `t('badge', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })`.
- **Challenge**: `home.hero.trustAnchor`, `home.cta.subtitle`, `pricing.hero.description` etc. are used in ~5 different server components. Each needs the import + param pass at the call site.

**Pattern for 12-04**:

```tsx
// src/app/[locale]/page.tsx (or wherever trustAnchor renders)
import { MAX_PARTNERS_PER_YEAR } from '@/lib/constants'
const t = await getTranslations('home.hero')
t('trustAnchor', { maxPartners: MAX_PARTNERS_PER_YEAR })
```

**Alternative**: provide a global default at the `NextIntlClientProvider` level (`layout.tsx`), so all interpolations resolve automatically:

```tsx
<NextIntlClientProvider
  messages={messages}
  locale={locale}
  defaultTranslationValues={{ maxPartners: MAX_PARTNERS_PER_YEAR }}
>
```

**Decision for 12-04**: use the **global default** approach. Single-point-of-truth, no per-call-site imports. Add `defaultTranslationValues` in the server `NextIntlClientProvider` at `src/app/[locale]/layout.tsx` AND in the server-side `getTranslations` config if needed. Verify via `next-intl` docs (v4.x supports this).

Affected keys (8, all get the `{maxPartners}` interpolation):
- `home.hero.trustAnchor`
- `home.trust.founderAccess`
- `home.cta.subtitle`
- `home.cta.description` (pricing.cta.description rendered on pricing, same structure)
- `pricing.hero.description`
- `about.capacity.reasoning` (mentions `20 bureaus` twice in same string — interpolate once, second mention literal-copy is OK since "200 bureaus waar..." is rhetorical reference)
- `apply.meta.description`
- (8th tbd during 12-04 execution — grep may reveal extra)

---

## 5. Contrast-check script (automated palette verification)

**Question**: after palette migration we want an automated check so stale color refs cannot regress.

**Options**:

- `axe-core` Playwright integration via `@axe-core/playwright`. Runs full WCAG rule set. Already hinted at in Phase 0.4 (Playwright). Overkill for pure color-hex-grep.
- Simple grep regression test in a pre-commit hook or CI step:

```bash
#!/bin/bash
MATCHES=$(grep -rnE '#050814|#00D4FF|#A855F7' fmai-nextjs/src/ --include='*.tsx' --include='*.ts' --include='*.css' | grep -v 'stale-allowlist.json')
if [ -n "$MATCHES" ]; then
  echo "FAIL: stale color hex found:"
  echo "$MATCHES"
  exit 1
fi
```

**Decision for 12-01**: ship the grep script as `fmai-nextjs/scripts/verify-palette.sh`, wire into `package.json` scripts as `"check:palette": "bash scripts/verify-palette.sh"`. Optionally add to `prebuild`. Keep axe + Playwright contrast audits for Phase 11 (a11y-dedicated phase).

---

## 6. ES native copy review — external resource option

**Question**: audit 02 §10 flags ES as "acceptable but stiff" with `Empleado AI` flagged unnatural. Does Phase 12 address this?

**Findings / decision**: ES native review is a **P2 strategic item (S-8)** per master action plan, not a P0/P1 polish. It requires either:

- A native NL-ES copywriter (Fiverr Pro: EUR 150-250 for 2h review of ~20k words) — best fidelity to brand.
- DeepL Pro rewrite pass with domain glossary (free, fast, low fidelity).

**Decision for Phase 12**: **out of scope**. Phase 12 fixes only mechanical ES issues auto-flagged in audit 02 (EN-loanword sweeps, dunglish mirrors) — but no stylistic native review. A dedicated "ES native review" phase should follow after Phase 13.

Relevant ES mechanical fixes to include in 12-04 (small batch):
- `es.json:95` `"IA con RGPD primero"` → `"IA con RGPD por defecto"` (remove dunglish mirror)
- `es.json:122` `"partnership AI high-touch"` → `"asociación AI high-touch"` (half-translate)

These are low-effort, zero-review-needed rewrites based on audit recommendation.

---

## 7. `Onbeperkt` credit pack rename — what should the new name be?

**Question**: `pricing.creditPacks.items.unlimited.name: "Onbeperkt"` names a 15,000-credit pack as "Onbeperkt" (unlimited) — ondermijnt transparantie. Audit suggests `"Max"` or `"Scale XL"` or `"Ultra"`.

**Options (pros / cons)**:

| Name | NL pros | EN equivalent | ES equivalent | Risk |
|---|---|---|---|---|
| `"Max"` | kort, duidelijk, past bij pricing-hiërarchie (Partner Top-Up / Boost / Scale / Max) | `"Max"` (identical) | `"Max"` | klinkt als midden-tier (consumer electronics analogy: iPhone Max is top-of-line, past) |
| `"Scale XL"` | expliciet een tier boven `Scale`, intuitief | `"Scale XL"` | `"Scale XL"` | 2 woorden, minder compact |
| `"Ultra"` | premium-connotatie | `"Ultra"` | `"Ultra"` | EN-leenwoord-feel, schuurt met NL-first |
| `"Power"` | actie-woord | `"Power"` | `"Power"` | vaag |

**Recommended default for 12-04**: **`"Max"`** — kortst, consistent met consumer-tech naming (iPhone Max, iPad Pro Max), ES/EN identiek, past in pricing card zonder layout-shift. **Open question voor Daley** — if he prefers `"Scale XL"` or `"Ultra"`, update the 3 touch points (`pricing.creditPacks.items.unlimited.name` + `pricing.faq.q2.answer` + any Stripe product name sync in `fma-app/src/lib/skills.ts`).

**Note on key-name**: `pricing.creditPacks.items.unlimited` as a KEY is OK (JSON keys can be semantic-English). Just the VALUE needs to change. Optionally rename the key to `pricing.creditPacks.items.max` for full consistency — but that touches Stripe webhook integration (fma-app), so defer the key-rename to a Stripe-sync sprint.

---

## 8. `skills-data.ts` i18n refactor — architectural shape

**Question**: `skills-data.ts` is the mirror of `fma-app/src/lib/skills.ts` SSoT. Labels like `'unlimited'` and `'30 min/mo'` are data, not UI copy. How to thread them through i18n without breaking the SSoT mirror pattern?

**Findings**:

- Current render: `SkillsTierMatrix.tsx:40` does `cap.label ?? \`${cap.included}${labels.perMonth}\`` — so if `label` is `undefined`, it falls back to interpolated i18n. 
- Fix strategy: **strip all hardcoded `label` strings** from `skills-data.ts` where i18n can handle it, and let the fallback render via `pricing.matrix.*` keys. Only keep `label` in the TypeScript interface for edge cases where the i18n fallback is insufficient.

**Refactor shape for 12-02**:

```typescript
// before
ENTERPRISE: { included: -1, label: 'unlimited' },
PARTNER: { included: 0, label: 'add-on €97' },
GROWTH: { included: 30, label: '30 min/mo' },

// after
ENTERPRISE: { included: -1 },  // label stripped — matrix renders from i18n `pricing.matrix.unlimited`
PARTNER: { included: 0, labelKey: 'pricing.matrix.addOn' },  // labelKey resolves from i18n
GROWTH: { included: 30, unit: 'min' },  // renders "30 min/mnd" via interpolated i18n
```

**New i18n keys needed in `pricing.matrix.*`** (add to all 3 locales):

```json
{
  "pricing": {
    "matrix": {
      "unlimited": "Onbeperkt",        // existing, verify
      "notAvailable": "—",              // existing
      "addOn": "Add-on €{price}",       // NEW — takes price variable
      "perMonth": "/mnd",               // existing, verify rename from /mo
      "minPerMonth": "{count} min/mnd",  // NEW
      "dmsPerMonth": "{count} DM's/mnd", // NEW
      "itemsPerMonth": "{count}/mnd"     // NEW (generic count)
    }
  }
}
```

**Refactor-scope trade-off**: introducing `labelKey` / `unit` properties changes the TypeScript shape → also touches `fma-app/src/lib/skills.ts` mirror if strict SSoT parity is required. **Decision**: keep `skills-data.ts` shape FLEXIBLE (add optional `labelKey` + `unit`) — do NOT mirror back to `fma-app` since fma-app uses the data server-side only (Stripe tier logic) and doesn't render matrix cells. This is a website-only concern.

See 12-02-PLAN.md for the full edit table.

---

## 9. Legal "last updated" date format

**Question**: audits flag `March 2026` on privacy/terms/cookies. What format to migrate to, and how to avoid this going stale again?

**Options**:

1. ISO date: `"2026-04-24"` — locale-independent, machine-readable. Downside: reads clinical.
2. Localized long form: NL `"24 april 2026"`, EN `"April 24, 2026"`, ES `"24 de abril de 2026"`. Reads natural but requires per-locale updates.
3. Month+year: NL `"April 2026"`, EN `"April 2026"`, ES `"Abril 2026"`. Middle ground.
4. **Anti-stale**: render the date from a single build-time constant (`BUILD_DATE` env var or `src/lib/legal-meta.ts`), injected at build time via `next/headers` or server component.

**Decision for 12-04**: **option 2 (localized long form)** with **option 4 anti-stale mechanism** as a follow-up.

For Phase 12 action:
- `nl.json:928` `"Laatst bijgewerkt: maart 2026"` → `"Laatst bijgewerkt: 24 april 2026"`
- `en.json:928` `"Last updated: March 2026"` → `"Last updated: April 24, 2026"`
- `es.json:928` `"Última actualización: marzo de 2026"` → `"Última actualización: 24 de abril de 2026"`

**Anti-stale**: park as tech-debt — requires `getTranslations` to accept injected values, doable but adds complexity for a once-per-quarter touch. Not worth it in Phase 12.

---

## 10. Phone number in `VoiceDemoSection.tsx` — decision required

**Finding**: `src/components/voice/VoiceDemoSection.tsx:67,93` displays `+1 (570) 783-8236` — a US phone number — on a Dutch marketing site.

**Options**:

- **Replace** with NL number (e.g. `+31 20 808 0000` — Daley provides).
- **Hide** the literal number, render only `[Bel de demo — klik hieronder]` with the `VoiceDemoFAB` as sole CTA.
- **Keep** (US number is linked to existing Vapi demo routing; swapping requires Vapi config update).

**Decision**: **BLOCK this fix — flag for Daley**. Phase 12 plan should NOT auto-rewrite this number. 12-01 RESEARCH note only. Daley to decide:
- NL nummer via Vapi numberrouting → needs Vapi config + €5/mo phone number rental → low effort.
- Hide: UI-only change, zero infra impact, easy.
- Keep: accept the US number is visible (current state).

**Added to 12-01-PLAN.md as `<task type="manual">` with action `"flag for Daley decision"`.** No code change in Phase 12.

---

## Summary of open questions for Daley

| # | Question | Default if unanswered |
|---|---|---|
| 1 | `Onbeperkt` credit pack new name — `"Max"`, `"Scale XL"`, or `"Ultra"`? | `"Max"` |
| 2 | Legal "last updated" format — ISO (`2026-04-24`) or localized (`24 april 2026`)? | Localized long form |
| 3 | Voice demo phone number — swap to NL, hide, or keep US? | Flag only, no auto-fix |
| 4 | Ship `/api/og` dynamic route in 12-01, or static PNG only? | Static PNG only (dynamic route optional if time permits) |

All four decisions can be made during 12-01/12-04 execution — they do not block planning.
