# Phase 13: Performance + Bundle Cleanup

Created: 2026-04-24
Audit basis: `docs/audits/2026-04-24-full-audit/01-performance.md` + `08-technical-quality.md`
Master plan theme: **T-4 Dead + legacy client-bundle op elke route** (MASTER-ACTION-PLAN.md)
Health score delta target: Performance 72 to 85+, Tech Quality 66 to 72+

## Goal

Strip roughly 70 KB gzipped off the initial JS bundle on all non-home pages, eliminate the 1.3 MB Spline prefetch waste on 86 non-home pages, kill dead code and debug artifacts, and pave the road to Lighthouse Performance 90+ on mobile.

## Why this phase exists

Seven distinct audits agree: the site ships a chat widget, a Calendly modal, a booking modal, a 1.3 MB 3D scene prefetch, a 120 KB i18n message tree, three Google font families, and three 600 px blurred blobs on **every** route, even `/legal/privacy`. 95 percent of visitors never open chat or Calendly. Today, those visitors still parse, compile, and composite all of it.

This phase is pure bundle dietetics. Zero new features. Zero copy changes. Zero SEO changes. Outcome is measured in kilobytes on the wire and INP milliseconds on a mid-range Android.

## Scope

### In scope (P1-3, P1-4, P1-5 + cleanup)

**Wave 1 (independent, run in parallel):**

- `13-01-PLAN.md` — ClientIslands lazy-on-interaction refactor + Spline prefetch gated to home + CookieConsentBanner lazy + gradient blob downgrade + HeaderClient click listener fix. Biggest runtime lift (~50 KB gz + 1.3 MB bandwidth).
- `13-02-PLAN.md` — Per-segment i18n messages. Strip full namespace tree from client provider, scope namespaces per route. Biggest structural change (~30-40 KB gz per page).

**Wave 2 (runs after Wave 1, low-risk cleanup):**

- `13-03-PLAN.md` — Dead code purge, font trim, dep hygiene, use-client demotions. Pure hygiene.

### Out of scope (explicitly)

- `/api/vitals` beacon endpoint: already covered in Phase 10 (B-10). Phase 13 verifies only.
- `next@16.2.4` CVE bump: already in Phase 10 (B-10). Phase 13 does not touch `next` version.
- Spline hero rewrite: CLAUDE.md red flag. We only relocate the prefetch hint, we do NOT touch the hero component itself.
- VoiceDemoSection, VoiceDemoFAB, DemoPlayground, MultiPlatformShowcase: CLAUDE.md red flag. Untouched.
- Server Actions migration of `/api/apply` + `/api/contact`: deferred to a Next.js 16 modernization phase.
- React Compiler lint errors: deferred to Phase 11 (lint gate).
- PPR adoption: deferred to Next.js 16 modernization phase.

## Files expected to change

```
src/app/[locale]/layout.tsx                            (remove prefetch + preconnect + heavy provider setup)
src/app/[locale]/page.tsx                              (add Spline prefetch + preconnect as home-only)
src/components/providers/ClientIslands.tsx             (rewrite: mount only triggers, lazy on open)
src/components/providers/StoreProvider.tsx             (remove eager rehydrate)
src/components/interactive/CookieConsentBanner.tsx     (short-circuit if cookie present)
src/components/hero/GradientMesh.tsx                   (home-only + reduced-motion gating)
src/components/layout/HeaderClient.tsx                 (gate click listener on skillsOpen)
src/app/globals.css                                    (blob blur + size reduction)
src/i18n/request.ts                                    (split namespaces by segment)
src/lib/fonts.ts                                       (drop 1-2 font families)
src/lib/skills-data.ts                                 (if font or icon cleanup touches it)
messages/nl.json + en.json + es.json                   (split into per-namespace folders OR leave + pick())
src/app/[locale]/(skills)/layout.tsx                   (scoped provider with skills namespace)
package.json                                           (prune unused deps + bump safe ones)
public/images/hero-robot.png                           (delete)
public/images/hero-robot.webp                          (delete)
public/images/                                         (dir audit)
public/case-studies/skc/                               (empty dir, delete)
public/screenshots/skills/                             (empty dir, delete)
fmai-nextjs/*.png (20+ debug screenshots at repo root) (delete/move to gitignored .screenshots/)
fmai-nextjs/verify-mega.cjs                            (delete)
fmai-nextjs/verify-screenshots.js                      (delete)
fmai-nextjs/scroll-screenshot.js                       (delete)
fmai-nextjs/scroll-vite.js                             (delete, references Vite)
fmai-nextjs/fmai-nextjs/                               (nested scaffold artifact, delete)
src/components/hero/OrbitVisual.tsx                    (delete, zero imports)
src/components/chatbot/tool-results/ProductCard.tsx    (demote to RSC if possible)
src/components/chatbot/tool-results/TicketCard.tsx     (demote to RSC)
src/components/chatbot/tool-results/BookingCard.tsx    (demote to RSC)
src/components/chatbot/tool-results/KBArticleCard.tsx  (demote to RSC)
```

## Expected savings

| Source | Before (per page) | After (per page) | Delta gz |
|---|---:|---:|---:|
| Chat + Calendly + Booking lazy triggers | ~71 KB gz | ~2 KB gz | **-69 KB gz** on every non-chat page (approx 95% of sessions) |
| Spline scene prefetch | 1.3 MB binary on 86 pages | 0 on 86 pages | **-1.3 MB bandwidth** per non-home navigation |
| i18n message tree shipped to client | ~44 KB gz | ~8 KB gz (common+nav) + per-route namespace | **-30-40 KB gz** on every page |
| CookieConsent lazy for returners | ~8 KB gz | 0 for returning visitors | **-8 KB gz** for ~50% of traffic |
| Font family reduction (3 to 2) | 3 woff2 preloads | 2 woff2 preloads | **-15-25 KB** binary + 1 preload request |
| Gradient blobs on non-home | 3 animated on every page | static or home-only | INP improvement, no bundle change |
| Dead code (`OrbitVisual`, unused PNGs, verify scripts, nested scaffold) | ~3.5 MB repo + 111 LOC | 0 | clone/build speedup |
| `@google/stitch-sdk` removal (verify) | 0 runtime, deps + lock bloat | 0 | cleaner audit surface |
| 21 outdated deps (incl. AI SDK 52 patches) | stale | current | fewer CVE vectors |

**Total initial JS on non-home pages: roughly -70 KB gzipped.** Combined with i18n split, non-home pages drop toward ~100 KB gz initial JS, Lighthouse Performance likely 90+.

## Entry criteria

- Phase 10 is done or running in parallel. If Phase 10 bumps `next` version, rebase Phase 13 after it.
- `npm run build` passes on current main.
- A clean `.next/` folder exists for the "before" baseline measurement.

## Exit criteria

- All three plans verified with before/after `npm run build` chunk-size comparison.
- No regressions in `/api/chatbot` streaming.
- Cookie accept/decline still works.
- Chat widget opens on click and streams normally.
- Calendly modal opens from CTA and books.
- Booking modal opens from the booking CTAs.
- Three-locale parity intact: NL, EN, ES all render every page with correct translations.
- `npm run build` succeeds on clean install.
- Spline hero on `/` still loads and renders.
- Documented bundle delta in `13-VERIFICATION.md`.

## Verification command

```bash
cd fmai-nextjs
rm -rf .next
npm run build 2>&1 | tee ../before-build.log
# ... apply plan ...
rm -rf .next
npm run build 2>&1 | tee ../after-build.log
diff before-build.log after-build.log
ls -la .next/static/chunks/ | awk '{print $5, $9}' | sort -n
```

Also run Turbopack-disabled analyzer mode once for chunk composition:

```bash
NEXT_TURBOPACK=0 ANALYZE=true npm run build
# Opens .next/analyze/client.html
```

## Risks

1. **Chat widget regression**: swapping eager island mount for click-driven lazy import changes load order. Must keep Zustand store selector API stable; store rehydrate timing shifts from mount to first store read.
2. **Calendly open from chat tool result**: some chatbot tool-result cards have CTAs that open Calendly. If CalendlyModal is not mounted until Calendly open-state flips, the first click must be handled correctly by the trigger component that flips the state AND lazy-loads the modal.
3. **i18n split breaks a namespace reference**: if page uses a namespace the provider does not pick, `useTranslations('x')` throws. Must add a dev-only runtime check plus build-time verify.
4. **Font drop affects visual polish**: removing Space Grotesk means `--font-display` falls back to DM Sans. Acceptable per audit, but the hero h1 may look slightly different on `/` and `/pricing`. Worth a side-by-side screenshot check.
5. **AI SDK 52 patches behind**: AI SDK v5 to v6 had breaking changes. Must check the changelog before bumping. Conservative: pin on current v6.x latest patch, do not bump major.
6. **Windows-path globbing during dead-asset deletion**: handle carefully; use `git rm` for tracked files.

## Open questions

1. Does `@google/stitch-sdk` actually get used by `scripts/stitch-review.mjs`? If yes, move to `devDependencies`, do not delete.
2. Should we use a per-segment folder layout (`messages/nl/common.json`, `messages/nl/skills.json`) or `pick()` at provider level? The folder approach scales better but requires reorg of 3 large JSONs. The `pick()` approach is reversible.
3. Is the Spline preview webp (`hero-robot-preview.webp`, 22 KB) fine to stay in `/public/images/`? Yes per audit, it is referenced in `splite.tsx:37`.
4. Can the `GradientMesh` component move to the home page only, or do other marketing pages depend on it visually? Audit says it is the global atmosphere; decision log entry needed.
5. Do we need to preserve `stitch-review.mjs` script? Check with user before removing `@google/stitch-sdk`.

## Execution order

1. Create worktree or branch `feature/phase-13-perf-cleanup`.
2. Run Wave 1 plans in parallel (`13-01-PLAN.md` and `13-02-PLAN.md`).
3. Merge Wave 1 results, run a build, capture baseline.
4. Run Wave 2 plan (`13-03-PLAN.md`).
5. Write `13-VERIFICATION.md` with before/after chunk table.
6. Commit and PR.

## References

- `docs/audits/2026-04-24-full-audit/01-performance.md` (F-1 to F-14, S-1 to S-7)
- `docs/audits/2026-04-24-full-audit/08-technical-quality.md` (sections 4, 8, 11)
- `docs/audits/2026-04-24-full-audit/MASTER-ACTION-PLAN.md` (theme T-4, ranks 3, 4, 5, 16 in P1 table)
- `.planning/phases/13-performance-bundle-cleanup/RESEARCH.md` (sibling)
- CLAUDE.md red flags: Spline, VoiceDemo*, DemoPlayground, MultiPlatformShowcase


---

## Committed Decisions (2026-04-24)

Alle open questions voor deze phase zijn vastgelegd in `.planning/phases/DECISIONS-2026-04-24.md`.

Execute agents: lees dat document vóór elke `plan-XX` die een decision-gate heeft. De decisions zijn bindend voor deze wave, reversible via commit als later blijkt dat een keuze herziening vereist.
