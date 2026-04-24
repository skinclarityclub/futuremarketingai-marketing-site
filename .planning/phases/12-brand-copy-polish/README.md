---
phase: 12-brand-copy-polish
title: Brand Assets + Copy Polish
created: 2026-04-24
owner: Daley
status: planned
depends_on: []
audit_sources:
  - docs/audits/2026-04-24-full-audit/MASTER-ACTION-PLAN.md
  - docs/audits/2026-04-24-full-audit/02-copywriting.md
  - docs/audits/2026-04-24-full-audit/06-data-accuracy.md
  - docs/audits/2026-04-24-full-audit/07-ux-accessibility.md
---

# Phase 12 — Brand Assets + Copy Polish

## Goal

Close all brand-asset and copy-polish gaps surfaced by the 2026-04-24 full audit in one focused sprint:

- Brand assets shipped: `og-image.png` + `logo.png` so `/api/apply` social previews, LinkedIn shares, and `OrganizationJsonLd.logo` stop returning 404.
- Palette migration completed: zero hardcoded `#050814` / `#00D4FF` / `#A855F7` in `src/`; `CLAUDE.md` Theme section reflects live `#0a0d14` / `#00d4aa`.
- Pricing tier-matrix fully NL: all 16 English labels in `skills-data.ts` routed through i18n (`pricing.matrix.*`) or rewritten.
- No hardcoded EN strings in user-facing surfaces: header mega-menu, pricing "Most popular", error/404 pages, ChatWidget placeholders, SkillsTierMatrix "Coming soon".
- Copy glossary enforced across `messages/nl.json`: 8× `klanten` → `merken`, 11× IK/WIJ slips rewritten, `Onbeperkt` credit pack renamed, `Feature-verzoeken` → `verzoeken voor nieuwe vaardigheden`, 9 em-dashes in `skills-data.ts` removed.
- `MAX_PARTNERS_PER_YEAR=20` interpolated from `src/lib/constants.ts` instead of hardcoded in 8 message keys.
- Legal "last updated" dates bumped from March 2026 to 2026-04-24 across NL/EN/ES.

Scope excludes: chatbot v9→v10 pricing fix (B-3, separate phase), `/api/apply` Resend wiring (B-1, separate phase), `llms.txt` regen (B-4, separate phase), orphan `chatbots.*` namespace deletion (chatbot components are still used on `/skills/lead-qualifier`, so it is NOT orphan — deletion deferred pending component-by-component audit, see RESEARCH.md §3).

## Scope

### In-scope (this phase)

| Ref | What |
|---|---|
| B-5 | `public/og-image.png` (1200×630) + `public/logo.png` (512×512) + optional `@vercel/og` dynamic route `/api/og` with per-locale tagline |
| B-9 | `src/lib/skills-data.ts` label migration to i18n (16 English labels) + 9 em-dashes + 5 `brand voice` → `merkstem` |
| T-5 | Palette migration: `CookieConsentBanner.tsx`, `not-found.tsx`, `error.tsx`, all stray `#00D4FF`/`#050814`/`#A855F7` refs → CSS vars; `fmai-nextjs/CLAUDE.md` Theme update |
| T-6 | Hardcoded EN strings → i18n: `HeaderClient.tsx` SKILL_CATEGORIES + NAV_ITEMS, `pricing/page.tsx:127` "Most popular", `SkillsTierMatrix.tsx:85` "Coming soon", `ChatWidget.tsx:107,180,230` placeholders, `error.tsx` body copy |
| T-8 | Copy glossary: `klanten`→`merken` (8 places), `Onbeperkt` credit pack rename, IK/WIJ slips (11 rewrites in about/contact/founding-member), `about.cta.demo_button` `"Boek een strategiegesprek"` → `"Plan een gesprek"`, template-repetition on 12 skill pages (integrations.subtitle, allocation.subtitle, cta.subtitle variants) |
| Legal | "last updated: March 2026" → "2026-04-24" on privacy/terms/cookies across NL/EN/ES |
| Interp | 8 hardcoded `20 partners`/`20 bureaus`/`20 agencies` → `{maxPartners}` via `MAX_PARTNERS_PER_YEAR` |
| Flag | Phone number `+1 (570) 783-8236` in `VoiceDemoSection.tsx:67,93` — flag for Daley decision (NL nummer of hiden) — do NOT auto-fix |

### Out-of-scope (defer)

- B-1 `/api/apply` Resend wiring
- B-2 `/api/contact` Resend wiring
- B-3 Chatbot v9 pricing in `leadgen-tools.ts` + `concierge-tools.ts`
- B-4 `public/llms.txt` + `llms-full.txt` regeneration
- B-6 Skip-to-content link + Skills mega-menu keyboard navigation
- B-7 `--color-text-muted` contrast fix (separate a11y phase)
- B-8 ApplicationForm per-field errors + `autoComplete`
- B-10 `middleware.ts` rename + `/api/vitals` + CVE patches
- ContactForm EN strings (`Sending...`, `Message sent!`, etc.) — owned by Phase 11 (a11y form work)
- Orphan `chatbots.*` namespace deletion (NOT orphan — see RESEARCH.md §3)

## Plans

All four plans are independently executable. Wave 1 (12-01, 12-02, 12-03) can run in parallel — they touch disjoint files. Wave 2 (12-04) depends on 12-03 for message-namespace alignment (the new `pricing.matrix.labels.*` keys introduced in 12-02 must exist before 12-04 rewrites adjacent pricing keys).

- [ ] **12-01-PLAN.md** — Brand assets: `og-image.png` + `logo.png` + optional `@vercel/og` dynamic route, palette migration in `CookieConsentBanner`/`not-found`/`error`, grep+fix all stale color refs, `fmai-nextjs/CLAUDE.md` Theme section update (Wave 1)
- [ ] **12-02-PLAN.md** — `src/lib/skills-data.ts` i18n refactor: route 16 English labels through `pricing.matrix.*` + 9 em-dashes + 5 `brand voice` → `merkstem` + `CATEGORY_LABELS` stays (it's already i18n-shaped) (Wave 1)
- [ ] **12-03-PLAN.md** — Hardcoded EN strings batch: `HeaderClient.tsx` SKILL_CATEGORIES + NAV_ITEMS → i18n, `pricing/page.tsx:127` "Most popular", `SkillsTierMatrix.tsx:85` "Coming soon", `ChatWidget.tsx` placeholders, `error.tsx` full i18n, SKIP `ContactForm.tsx` (Phase 11 owns it) (Wave 1)
- [ ] **12-04-PLAN.md** — Copy glossary + interpolation: 8× `klanten`→`merken`, `Onbeperkt` credit pack rename (PROPOSED: `"Max"` — confirm met Daley), 11 IK/WIJ slips in about/contact/founding-member, `about.cta.demo_button` rename, `Feature-verzoeken` → `verzoeken voor nieuwe vaardigheden` (2×), `MAX_PARTNERS_PER_YEAR` interpolation (8 keys), legal dates → 2026-04-24 (Wave 2, depends on 12-03)

## Success Criteria

When all four plans are complete the following must be TRUE:

1. **Assets present**: `GET /og-image.png`, `GET /og-image-square.png` (if referenced), `GET /logo.png` return 200 with correct content-type. Social share card in LinkedIn Post Inspector renders Clyde + FMai logo + tagline. `OrganizationJsonLd.logo` resolves.
2. **Zero stale color hex**: `grep -rE "#050814|#00D4FF|#A855F7" src/` returns 0 hits in `.tsx`/`.ts`/`.css` files (Spline-bundled assets excepted).
3. **Zero English labels** in live pricing matrix: verify NL + ES render `Onbeperkt` / `Ilimitado`, `Add-on €97`, `30 min/mnd`, `500 DM's/mnd` (not `unlimited`, `add-on €97`, `30 min/mo`).
4. **Zero hardcoded EN** in dev/build user-facing surfaces listed in §Scope. `grep` of flagged files returns only i18n call-sites (`t(...)`, `useTranslations(...)`).
5. **Glossary compliance**: `grep -n "klanten" messages/nl.json` returns zero hits on the 8 lines identified in audit 02 §2.4 (acceptable refs only in FMai-as-customer contexts at `:624`).
6. **IK/WIJ pass**: 11 rewrites in about/contact/founding-member committed; manual read-through of those 3 pages surfaces no third-person "Daley ... " or "we/wij" slips in IK contexts.
7. **MAX_PARTNERS_PER_YEAR interpolation**: 8 message keys (`home.hero.trustAnchor`, `home.trust.founderAccess`, `home.cta.subtitle`, `about.capacity.reasoning`, `pricing.hero.description`, `pricing.cta.description`, `apply.meta.description`) use `{maxPartners}` variable; `MessageProvider`-level param defaults to `MAX_PARTNERS_PER_YEAR` from `src/lib/constants.ts`.
8. **Legal dates**: NL/EN/ES `legal.last_updated` value reads `"2026-04-24"` (NL), `"2026-04-24"` (EN), `"2026-04-24"` (ES) — ISO format chosen for locale-independence (confirm with Daley if he prefers `"April 2026"` etc).
9. **`npm run build` passes** with zero new TypeScript errors. No i18n missing-key warnings in console during `npm run dev` for NL/EN/ES on home, pricing, about, contact, founding-member, apply, 404, error routes.
10. **CLAUDE.md updated**: `fmai-nextjs/CLAUDE.md` Theme section reads `#0a0d14` / `#00d4aa`, not `#050814` / `#00D4FF`.

## Constraints

- **NL first**: any new key gets NL value written first (authoritative), EN + ES derived from NL.
- **No em-dashes** (—) in any new user-facing copy — use comma, period, or colon.
- **Brand glossary**: `AI Marketing Medewerker`/`Clyde`, `vaardigheden`, `merken` (for agencies' clients), `Plan een gesprek`. NEVER `AI tool`, `platform`, `features`, `klanten` (for agencies' clients), `Sign up`.
- **IK-voice** on about/contact/founding-member; WIJ-voice on home/pricing/skills/how-it-works.
- **Domain canonical**: `future-marketing.ai` (do not touch `futuremarketingai.com` refs in this phase — owned by T-2 / P1 R-014).
- **SSoT discipline**: prices / tiers / caps come from `fma-app/src/lib/skills.ts` mirror (`skills-data.ts`) — label changes flow via i18n, numeric values via mirror-sync (already correct per audit 06 §1).

## Verification

Per-plan `<verify>` blocks include grep assertions + `npx tsc --noEmit` + spot-render screenshots. Phase-level verification:

```bash
cd fmai-nextjs
npm run build
npm run lint
# should show zero new errors vs baseline

# visual checks
open http://localhost:3000/nl/pricing        # tier matrix NL labels, "Max" pack
open http://localhost:3000/nl/404            # teal #00d4aa, not cyan #00D4FF
open http://localhost:3000/nl/apply          # "merken" in form labels
open https://cards-dev.twitter.com/validator # og-image preview
```

## Deliverables Summary

| File | Wave | Size |
|---|---|---|
| `.planning/phases/12-brand-copy-polish/README.md` | — | this file |
| `.planning/phases/12-brand-copy-polish/RESEARCH.md` | — | investigation log |
| `.planning/phases/12-brand-copy-polish/12-01-PLAN.md` | 1 | brand assets + palette |
| `.planning/phases/12-brand-copy-polish/12-02-PLAN.md` | 1 | skills-data.ts refactor |
| `.planning/phases/12-brand-copy-polish/12-03-PLAN.md` | 1 | hardcoded EN → i18n |
| `.planning/phases/12-brand-copy-polish/12-04-PLAN.md` | 2 | glossary + interpolation + dates |

Estimated total effort: **6 to 8 uur**. Solo dev, one sitting achievable.


---

## Committed Decisions (2026-04-24)

Alle open questions voor deze phase zijn vastgelegd in `.planning/phases/DECISIONS-2026-04-24.md`.

Execute agents: lees dat document vóór elke `plan-XX` die een decision-gate heeft. De decisions zijn bindend voor deze wave, reversible via commit als later blijkt dat een keuze herziening vereist.
