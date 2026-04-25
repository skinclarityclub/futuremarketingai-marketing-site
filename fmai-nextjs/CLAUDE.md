# FutureMarketingAI Marketing Website — Agent Operating Manual

> Read before every session. This is the authoritative operating manual for the marketing site codebase.

## One-liner

Marketing + application site voor FutureMarketingAI, een high-touch AI marketing partnership platform voor Nederlandse/EU bureaus en een solo-entrepreneur Partner tier. Serveert op `future-marketing.ai` (productie). Content in NL/EN/ES (NL authoritative). Leidt prospects van landing → application-gated Calendly-call.

## Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16.1.7** (App Router) |
| React | 19.2.3 |
| Language | TypeScript strict |
| i18n | `next-intl` 4.8 — NL / EN / ES |
| Styling | Tailwind CSS 4 (`@tailwindcss/postcss`) |
| State | Zustand 5 (booking modal, UI state) |
| Deployment | Vercel |
| Animations | Framer Motion (via components) |
| SEO | `schema-dts` voor JsonLd |

## Theme (dark-only)

- Background: `#0a0d14` (--color-bg-deep)
- Surface: `#111520` (--color-bg-surface)
- Elevated surface: `#1a1f2e` (--color-bg-elevated)
- Primary accent: `#00d4aa` (--color-accent-system, teal)
- Secondary accent: `#f5a623` (--color-accent-human, amber)
- Success / Status active: `#22c55e` (--color-status-active)
- Error: `#ef4444` (--color-error)
- Text primary: `#e8ecf4` (--color-text-primary)
- Text secondary: `#9ba3b5` (--color-text-secondary)
- Text muted: `#8C98AD` (--color-text-muted, raised in Phase 11-02 from `#5a6378` to PASS WCAG AA contrast on bg-deep + bg-surface)
- Typography: DM Sans (sans), Space Grotesk (display), JetBrains Mono (mono)

**Deprecated palette** (do NOT use, enforced via `npm run check:palette`):
- `#050814` old background
- `#0A0E27` old surface
- `#00D4FF` old cyan accent
- `#A855F7` purple (never in design system)

## Architecture

**Desktop-first**. Mobile is supplemental — separate mobile components met conditional rendering. **Nooit** desktop components wijzigen om mobile te fixen.

**Routes** (App Router, onder `src/app/[locale]/`):
- `(marketing)` group: home, about, how-it-works, pricing, founding-member, contact, memory, apply, case-studies/*
- `(skills)` group: 12 skill pages (social-media, voice-agent, lead-qualifier, email-management, ad-creator, reporting, research, blog-factory, seo-geo, clyde, manychat, reel-builder)
- `(blog)` group: blog index + MDX posts
- `(legal)` group: privacy, terms, cookies (gesplitst per 2026-04-20 redesign)
- API: `/api/apply` (application form POST)

**i18n flow**:
- NL is source-of-truth — copy wordt in NL geschreven
- EN en ES zijn machine-vertaald + reviewed
- Geen hardcoded user-facing strings — alles via `useTranslations()` of `getTranslations()`

## Commands

```bash
npm run dev       # dev server op http://localhost:3000
npm run build     # production build — MOET passen voor deploy
npm run lint      # ESLint 9
```

## Pricing Source of Truth

**KRITIEK**: alle prijzen, credit packs, skill allocations en tier caps worden gesynchroniseerd met `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts`.

Dit is het SaaS command center codebase dat Stripe subscriptions beheert. De marketing site toont deze data — mismatches zijn business-kritiek (klant ziet €2.497 op site, krijgt €1.497 op invoice). Bij prijsaanpassingen altijd **eerst** `fma-app/src/lib/skills.ts` updaten, **dan** site, **dan** Stripe price IDs in env.

De site heeft een local mirror in `src/lib/skills-data.ts` (gegenereerd/bijgehouden parallel) voor snellere renders zonder fma-app dependency.

## Shared Constants

Voor counters en UI-state die op meerdere pages terugkomt — centrale SSoT in `src/lib/constants.ts`:

```typescript
FOUNDING_SPOTS_TAKEN     // momenteel 1 (SkinClarity Club)
FOUNDING_SPOTS_TOTAL     // 10 founding plekken totaal
MAX_PARTNERS_PER_YEAR    // 20 plekken/jaar schaarste cap
```

Import overal — niet hardcoden.

## Related Projects

- `C:\Users\daley\Desktop\fma-app` — Next.js SaaS command center (multi-tenant, Stripe, Supabase). **Pricing SSoT lives here.**
- `C:\Users\daley\Desktop\FMai` — n8n content automation (WAT architecture) voor SkinClarity Club
- `C:\Users\daley\Desktop\Futuremarketingai\docs` — planning documenten (design docs, pricing research, audits)

## Content Upgrade Context (2026-04-20)

**Huidige fase**: website ondergaat volledige content-herpositionering naar high-touch AI partnership model. Zie:

- Design: `../docs/plans/2026-04-20-website-content-upgrade-design.md` (approved)
- Implementatieplan: `../docs/plans/2026-04-20-website-content-upgrade-plan.md` (6 phases, task-by-task)
- Pricing voorstel: `../docs/plans/2026-04-20-pricing-final-proposal.md` (approved)
- Audits: `2026-04-19-audit-*.md`, `audit-capabilities-inventory.md`

**Status bij session start**: vermoedelijk Phase 0 (setup) of later. Check `git log --oneline | head -20` en branch-status om te zien waar executie staat.

### Sleutelbeslissingen (uit design doc decisions log)

- **12 skills** totaal (9 live + 3 coming_soon) — consistent overal
- **5 tiers**: Partner €347 / Growth €2.497 / Professional €4.497 / Enterprise €7.997 / Founding €997 (10 plekken levenslang)
- **Counter**: `1/10 founding plekken bezet` — SSoT via constants
- **Hero**: "Maak kennis met Clyde / Jouw AI Marketing Medewerker" — behoud bestaande framing
- **CTAs**: allemaal `/apply` (application-gated), geen self-service signup
- **Proof**: SKC case via Sindy als operator (founder SkinClarity Club), géén vermelding van Daley's co-eigendom
- **Memory system**: eigen `/memory` page als USP (niet als skill)
- **Open-source framing**: gebruik "EU-native / zero lock-in / data van jou" — niet letterlijk "open source"

### Key-phrase glossary (gebruik consistent)

| Nooit | Altijd |
|---|---|
| "AI tool" / "platform" | "AI Marketing Medewerker" / "Clyde" |
| "features" | "vaardigheden" |
| "klanten" (voor bureau's eindklanten) | "merken" / "klantportfolio" |
| "unlimited" (zonder onderbouwing) | "zonder plafond voor zover infra reikt" |
| "Sign up" / "Try free" | "Plan een gesprek" / "Apply" |

## Conventions

### Commits

`type(scope): message` — scope matcht pagina of systeem:
- `content(home): hero copy — memory USP + founding counter`
- `feat(skills/memory): new /memory USP page — 4-layer memory system`
- `chore(i18n): remove orphan translation namespaces`

Why-focused waar mogelijk. Altijd frequent committen — één commit per page completion, niet per step.

### Branches

`feature/content-upgrade-phase-{N}-{slug}` voor phase-scoped branches (implementatieplan werkt op één `feature/content-upgrade` met sub-phases via commits).

### Tests

- `npm run build` moet passen — dit is de de-facto integratie-test
- Playwright voor screenshots + E2E (wordt opgezet in Phase 0.4)
- Geen uitgebreide unit-test suite — content-centric project

### i18n keys

Key-naming: `{namespace}.{section}.{field}` (bv. `home.hero.headline_main`). Structureer hiërarchisch zodat `jq` diff tussen locales mogelijk is.

Bij variable-interpolatie: `{var}` notation, bijv. `"badge": "{taken} van {total} plekken bezet"`.

## Red Flags — Nooit aanraken zonder reden

- `VoiceDemoSection` + `VoiceDemoFAB` op `/skills/voice-agent` — bestaande interactieve demo, werkt
- `DemoPlayground` + `MultiPlatformShowcase` — verhuist naar lead-qualifier in Phase 3, niet vergooien
- Spline 3D robot (`HeroSpline`) — zware asset, gedeeltelijk optimized, niet vervangen zonder design akkoord
- `messages/nl.json` keys die actief gebruikt worden — altijd verifiëren via grep vóór verwijderen
- Hardcoded `futuremarketingai.com` anywhere in code or copy — the domain was unified to `future-marketing.ai` on 2026-04-24. Always use the canonical. Customer-facing email is `hello@future-marketing.ai` except on the legal page which keeps `privacy@future-marketing.ai`.

## Environment

- Productie: Vercel — canonical `https://future-marketing.ai`. `futuremarketingai.com` 301-redirects (dashboard rule set 2026-04-24). `NEXT_PUBLIC_SITE_URL` in .env.local must match the canonical.
- Env vars in `.env.example` — Stripe price IDs zijn per tier (`STRIPE_PRICE_PARTNER`, `STRIPE_PRICE_GROWTH`, etc.). Niet comitteren naar git.
- Apply form POST: email via Resend (voor nu) of Supabase write (TBD)

## Waar vragen over op te zoeken

| Vraag | Waar |
|---|---|
| Wat claimt de site nu? | `../docs/plans/2026-04-19-audit-website-inventory.md` |
| Wat kan FMai echt? | `../docs/plans/audit-capabilities-inventory.md` |
| Welke prijs voor tier X? | `../docs/plans/2026-04-20-pricing-final-proposal.md` of `fma-app/src/lib/skills.ts` |
| Welke skills in welk tier? | `../docs/plans/2026-04-20-pricing-skill-gating.md` |
| Hoe ziet de sitemap eruit post-upgrade? | `../docs/plans/2026-04-20-website-content-upgrade-design.md` sectie 2 |
| Welke page moet ik nu maken? | `../docs/plans/2026-04-20-website-content-upgrade-plan.md` — task-by-task breakdown |

## Plan Execution

Plan wordt uitgevoerd via `superpowers:executing-plans` skill in nieuwe sessie. Bij resume: lees de laatste commit-messages om te zien welk task-cluster het laatst voltooid is, pak van daar op.
