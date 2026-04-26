# Phase 13 Performance + Bundle Cleanup — Verification

Phase-level rollup across 13-01 (interaction-gated heavy islands), 13-02 (scoped i18n providers), 13-03 (hygiene + deps + fonts + i18n links).

**Status: ALL THREE PLANS COMPLETE** — 88/88 static pages, all 12 skill routes SSG, 78 prerendered HTML files, 0 no-html-link-for-pages lint errors, ~6.3 MB chunk dir total.

## Initial JS / HTML per route (raw bytes)

| Route                            | Pre-13-01 baseline | After 13-01 + 13-02 | After 13-03 (final) | Total Phase 13 delta  |
| -------------------------------- | -----------------: | ------------------: | ------------------: | --------------------: |
| `en.html` (home)                 |            205,095 |             109,764 |          ~109,400 |       -95,695 (-46.7%) |
| `nl.html` (home)                 |            210,052 |             110,642 |          ~110,200 |       -99,852 (-47.5%) |
| `en/pricing.html`                |            273,636 |             177,421 |             176,996 |       -96,640 (-35.3%) |
| `nl/pricing.html`                |            279,371 |             179,077 |             178,652 |      -100,719 (-36.1%) |
| `en/about.html`                  |            184,455 |              88,240 |             ~88,000 |       -96,455 (-52.3%) |
| `en/skills/voice-agent.html`     |            184,180 |             131,657 |             131,232 |       -52,948 (-28.7%) |
| `en/legal/privacy.html`          |            170,816 |              74,558 |             ~74,000 |       -96,816 (-56.7%) |
| `nl/legal/privacy.html`          |            176,481 |              76,144 |             ~75,700 |      -100,781 (-57.1%) |

The 13-03 contribution (last column delta vs After-13-02) is small (~400-500 B per page) because Wave 2 was hygiene + deps, not payload restructuring. The 13-03 delta primarily comes from one fewer Google Fonts woof2 preload-link in every page's `<head>` after dropping Space Grotesk.

The dominant savings (>90% of payload reduction) come from 13-02's `pick(messages, GLOBAL_CLIENT_NAMESPACES)` namespace subset and 13-01's CookieConsentBanner / GradientMesh / Spline-link relocation.

## Spline prefetch presence (definitive 13-01 evidence)

| Route                               | scene.splinecode count | unpkg.com count |
| ----------------------------------- | ---------------------: | --------------: |
| `en.html` (home)                    |                      2 |               2 |
| `nl.html` (home)                    |                      2 |               2 |
| `es.html` (home)                    |                      2 |               2 |
| `en/pricing.html`                   |                      0 |               0 |
| `en/about.html`                     |                      0 |               0 |
| `en/legal/privacy.html`             |                      0 |               0 |
| `en/skills/voice-agent.html`        |                      0 |               0 |
| `nl/legal/privacy.html`             |                      0 |               0 |

86 non-home prerendered routes no longer ship the 1.3 MB Spline scene prefetch + cross-origin handshake. Per non-home pageload, ~1.3 MB bandwidth saved.

## Static-chunk dir totals

| Stage                         | Total bytes | Note                                                               |
| ----------------------------- | ----------: | ------------------------------------------------------------------ |
| Pre-13-01                     |  ~6,350,000 |                                                                    |
| After 13-01 + 13-02           |   6,367,442 | Slightly UP — 3 new lazy-boundary chunks replace 1 bundled chunk   |
| After 13-03 (final)           |  ~6,290,000 | -77 KB from Space Grotesk metadata gone + AI SDK 6.0.116 -> 6.0.168 |

## Dependencies bumped (Phase 13-03)

| Package                  | Pre-13-03 | After 13-03 | Notes                                          |
| ------------------------ | --------- | ----------- | ---------------------------------------------- |
| `@ai-sdk/anthropic`      | ^3.0.58   | ~3.0.71     | tilde-pinned per RESEARCH.md                   |
| `@ai-sdk/react`          | ^3.0.118  | ~3.0.170    | 52-patch jump, no breaking 3.x.x               |
| `ai`                     | ^6.0.116  | ~6.0.168    | 52-patch jump, no breaking 6.x.x               |
| `next-intl`              | ^4.8      | ^4.9.1      |                                                |
| `@splinetool/runtime`    | ^1.12.70  | ^1.12.88    |                                                |
| `tailwindcss`            | ^4        | ^4.2.4      |                                                |
| `@tailwindcss/postcss`   | ^4        | ^4.2.4      |                                                |
| `web-vitals`             | (latest)  | ^5.2.0      | already at latest                              |
| `react`                  | 19.2.3    | ^19.2.5     |                                                |
| `react-dom`              | 19.2.3    | ^19.2.5     |                                                |
| `@playwright/test` (dev) | ^1.58.2   | ^1.59.1     |                                                |

**Deferred (out of phase scope):** `next` / `@next/mdx` / `@next/bundle-analyzer` / `eslint-config-next` (Phase 10 owns next bumps); `lucide-react` 0.x -> 1.x; `schema-dts` 1 -> 2; `typescript` 5 -> 6; `eslint` 9 -> 10; `@types/node` 20 -> 25 (all major-version reviews required).

## Lint error count

| Category                                        | Pre-Phase-13 (audit) | After 13-03 |
| ----------------------------------------------- | -------------------: | ----------: |
| `@next/next/no-html-link-for-pages`             |                   14 |           0 |
| `@typescript-eslint/no-require-imports` (Vite-era root scripts) | 2 | 0 |
| `@typescript-eslint/no-require-imports` (scripts/check-translations + scripts/create-translations) | 4 | 4 (out of scope) |
| Other React Compiler errors                     |                  ~30 |         ~30 |
| **Total errors**                                |                  ~50 |         ~34 |

Net resolved by Phase 13: **16 audit-08 lint errors** (14 i18n-breaking link errors + 2 Vite-era `no-require-imports` from deleted scripts).

Remaining ~34 errors deferred to Phase 11 (React Compiler cleanup). Soft prebuild lint gate (`npm run lint || true`) added in 13-03 surfaces them at every build for monitoring; flip to strict happens after Phase 11.

## CVE count (`npm audit --omit=dev`)

| Stage          | Count                                            | Notes                                                       |
| -------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| Pre-Phase-13   | 7 (4 moderate, 3 high)                           | audit baseline                                              |
| After 10-04    | 0                                                | Phase 10-04 added `postcss` override                        |
| After 13-03    | 3 moderate (uuid via svix via resend)            | new transitive advisory, accepted risk per Phase 10-04      |

`npm audit fix --force` would downgrade `next`. Same decision as Phase 10-04.

## Smoke test results

Build smoke (executed at end of 13-03 final rebuild):

- [x] `npm run build` exits zero
- [x] 88/88 static pages generated
- [x] All 12 skill routes ● SSG (en/nl/es)
- [x] 78 prerendered HTML files in `.next/server/app`
- [x] 0 `MISSING_MESSAGE` errors in any HTML
- [x] Home routes (en/nl/es) contain Spline preconnect + prefetch (count = 2 each)
- [x] Non-home routes contain ZERO Spline preconnect / prefetch (count = 0)
- [x] `font-display` token resolves to DM Sans 700 (verified via globals.css inspection)
- [x] `<a href="/contact">` and `<a href="/apply">` count in chatbot subtree = 0 (eslint clean)

Runtime smoke deferred to verifier agent (Lighthouse run, three-locale browser walk):

- [ ] Chat widget opens, streams, closes — NL/EN/ES (deferred to verifier; static analysis confirmed import chain in 13-02 walkthrough)
- [ ] Calendly modal opens from CTA — NL/EN/ES
- [ ] Booking modal opens from booking CTA — NL/EN/ES
- [ ] Cookie banner on first visit, suppressed on return — NL/EN/ES
- [ ] Spline hero loads on / — NL/EN/ES
- [ ] All 12 skill pages render — NL/EN/ES
- [ ] Chat tool-result CTAs preserve locale on click (e.g., LeadScoreCard "Book a discovery call" from /nl context lands on /nl/contact, not /contact)

The runtime smoke checklist is the verifier's responsibility per `config.json` `workflow.verifier: true`.

## Files inventory

**Created across Phase 13 (3 plans):**

- `fmai-nextjs/src/components/chatbot/FloatingChatTrigger.tsx` (13-01)
- `fmai-nextjs/src/components/interactive/CalendlyTrigger.tsx` (13-01)
- `fmai-nextjs/src/components/booking/BookingTrigger.tsx` (13-01)
- `fmai-nextjs/src/lib/i18n-pick.ts` (13-02)
- `fmai-nextjs/src/lib/i18n-namespaces.ts` (13-02)
- `fmai-nextjs/src/app/[locale]/(skills)/layout.tsx` (13-02)
- `fmai-nextjs/.screenshots/` (13-03 — gitignored)
- `fmai-nextjs/scripts/dev/stitch-review.mjs` (13-03 — renamed)

**Deleted across Phase 13:**

- `fmai-nextjs/src/components/hero/OrbitVisual.tsx`
- `fmai-nextjs/public/images/hero-robot.png`, `hero-robot.webp`
- `fmai-nextjs/verify-mega.cjs`, `verify-screenshots.js`, `scroll-screenshot.js`, `scroll-vite.js`
- 21 debug PNGs at `fmai-nextjs/*.png` (untracked + moved to `.screenshots/`)
- Empty `fmai-nextjs/fmai-nextjs/` scaffold tree
- Empty `fmai-nextjs/public/case-studies/` tree

## Key cross-plan invariants preserved

| Invariant                                                  | Owner plan      | Confirmed in 13-03           |
| ---------------------------------------------------------- | --------------- | ---------------------------- |
| Spline preconnect + prefetch only on home routes           | 13-01           | YES (count = 2 home, 0 elsewhere) |
| GradientMesh blobs only on home, hidden under 1024px       | 13-01           | YES (globals.css unchanged)    |
| `prefers-reduced-motion: no-preference` gate on blob anims | 13-01           | YES (globals.css unchanged)    |
| HeaderClient document listeners gated on open-state        | 13-01           | YES (file unchanged)           |
| `pick(messages, GLOBAL_CLIENT_NAMESPACES)` in root layout  | 13-02           | YES (only fonts edit, pick intact) |
| (skills) scoped NextIntlClientProvider                     | 13-02           | YES (file unchanged)           |
| `setRequestLocale` + `generateStaticParams` in (skills)    | 13-01 + 13-02   | YES (12 skill routes still SSG) |
| `substituteGlobals()` walker in `src/i18n/request.ts`      | 12-04           | YES (file unchanged)           |

## Phase 13 ready to PR

All three plans complete. Bundle savings ready for verifier confirmation via Lighthouse / Vercel Analytics on production deploy. No blocking issues. Daley still owes 2 decisions deferred from Phase 12: VoiceDemoSection phone number (12-03) + Stripe Product rename to "Max Credit Pack" (12-04) — both unrelated to Phase 13.
