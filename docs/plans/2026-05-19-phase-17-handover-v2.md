# Phase 17 Execution Handover v2 (2026-05-19 end-of-session)

> Successor to `2026-05-19-phase-17-handover.md`. Read this first in a new session before touching code. Captures state after the second 2026-05-19 working block.

## TL;DR

7 PRs open and stacked. Phase 17-A foundation + 17-A breadcrumbs wire-up + 17-B content sweep + 17-C a11y/webkit/cookie + 17-D forms/perf are all done. Phase 17-E is the only remaining sub-phase. Pick up at one of: review the 7-deep stack, start 17-E, or attend to deferred follow-ups.

## PR stack (open, bottom = newest)

```
main
 └── PR #2 ← fix/audit-2026-05-18-followup           (v1 audit followup, 20 commits)
      ├── PR #3 ← audit/2026-05-18-v2-sota           (Phase 16 SOTA audit, 31 commits)
      └── PR #4 ← feature/phase-17-b-content-sweep   (Phase 17-B, 1 commit)
           └── PR #5 ← feature/phase-17-a-foundation         (Phase 17-A, 1 commit)
                └── PR #6 ← feature/phase-17-a-breadcrumbs-wire   (Phase 17-A, 1 commit)
                     └── PR #7 ← feature/phase-17-c-a11y-webkit-cookie  (Phase 17-C, 7 commits)
                          └── PR #8 ← feature/phase-17-d-forms-perf    (Phase 17-D, 6 commits)
```

When PR #2 merges, the children rebase down. Stack-rebase strategy keeps the `messages/*.json` conflicts manageable; each phase touches i18n.

Verify state:
```bash
gh pr list
git log --oneline -20
```

## What landed this session (since v1 handover)

### Phase 17-A breadcrumbs wire-up (PR #6, commit 3fadebc)

Branch: `feature/phase-17-a-breadcrumbs-wire` off `feature/phase-17-a-foundation`.

- `<Breadcrumbs path={...} locale={locale} />` wired into 13 files → 23 newly-breadcrumbed routes.
- `SkillPageTemplate` (covers 12 /skills/* routes), `LegalSectionPage` (covers 3 legal sections), 8 standalone marketing pages (about, how-it-works, pricing, founding-member, memory, apply, assessment, roadmap, case-studies/skinclarity-club), 2 index pages (/legal, /blog).
- Fixed 2 pre-existing JSON-LD parent-path bugs in `SkillPageTemplate` and `case-studies/skinclarity-club` so structured data matches the visible chain from `breadcrumb-config`.
- **MF-04 fully closed** (was "partial" in v1 handover).

### Phase 17-C a11y + cookie + cross-browser parity (PR #7, 7 commits)

Branch: `feature/phase-17-c-a11y-webkit-cookie` off `feature/phase-17-a-breadcrumbs-wire`.

- **C1 (commit c7e35c6)**: MF-06 root-cause fix. `@theme inline` in `globals.css` + custom PostCSS plugin `discard-host-in-theme-layer` in `postcss.config.mjs` strips `:host` from `@layer theme`. Compiled CSS now has 0 `:root,:host` occurrences. Tokens resolve at `:root{...}`.
- **C2 (commit 29de33b)**: `tests/e2e/cross-browser-render.spec.ts` asserts body bg + h1 color across chromium/firefox/webkit on home + pricing + apply. `npm run test:e2e:cross-browser`.
- **C3 (commit f27e113)**: First-party CookieConsentBanner. Granular toggles (Essential/Analytics/Marketing), 3 buttons (Accept all/Save selection/Reject all), focus-visible rings, localStorage instead of document.cookie. Footer link "Cookie-instellingen wijzigen" via `fmai:cookie-reopen` window event. `react-cookie-consent` (~8KB gz) removed.
- **C4 (commit 08f67bc)**: 4 new AA-verified text tokens (`text-quiet`, `text-faint`, `text-on-elevated`, `text-help`) with measured contrast ratios. Swept all 24 `text-*/<N>` opacity-modifier utilities across 13 files.
- **C5 (commit e24221a)**: newsletter-confirm refactored to server-shell + client-island so `generateMetadata` can emit a real `<title>`. WCAG 2.4.2 closed in 3 locales.
- **C6 (commit 5e4469f)**: `focus-visible:outline-2` ring on CTAButton + ContactForm + ApplicationForm inputs. Removed `focus:outline-none` that was suppressing the global rule. Border highlight still fires on mouse focus.
- **C7 (commit 1a5ef98)**: `useReducedMotion` in SplineScene skips 3D + 638KB runtime entirely. ScrollReveal already passthrough; GradientMesh CSS-guarded.

### Phase 17-D forms + perf measurement (PR #8, 6 commits)

Branch: `feature/phase-17-d-forms-perf` off `feature/phase-17-c-a11y-webkit-cookie`.

- **D1 (commit c0c0493)**: Restored playwright-lighthouse harness from audit branch — `tests/e2e/audit-v2-lighthouse.spec.ts` + `_audit-v2-config.ts`. 180 tests (10 routes × 3 locales × 2 form factors × 3 projects, only chromium runs Lighthouse). Pinned `chalk@4.1.2` in `overrides`. `npm run audit:lighthouse`.
- **D2 (commit c98aa9a)**: `scripts/measure-crux.mjs` pulls CrUX p75 field data per route, PSI fallback for low-traffic URLs. Reads `GOOGLE_PSI_API_KEY` from env or `~/.claude/.env`. Exit-2 with setup message until key is provisioned. `npm run audit:crux`.
- **D3 (commit fdf3d50)**: `/api/vitals` POST route logs `[vitals] {...}` in a stable envelope. `beaconMetric` helper in `src/lib/web-vitals.ts` posts via `navigator.sendBeacon` (fetch+keepalive fallback). Parallel to `@vercel/speed-insights`.
- **D4 (commit 442740f)**: Apply form 8 fields → 3 (name, email, optional company). Tier/revenue/clientCount/problem deferred to Calendly step 2. API schema makes dropped fields `.optional()`, email templates render present fields only, Supabase columns NULL for omitted.
- **D5 (commit add49c2)**: `<Label htmlFor required>` component renders red `*` + pairs with `aria-required` on input. Top-of-form note. Swept ContactForm + ConfirmRetryForm. ApplicationForm already has inline asterisks from D4.
- **D6 (commit 1772c17)**: SplineScene upgrade via `requestIdleCallback({timeout: 4000})`, was hardcoded 3s setTimeout. Skip Spline entirely on `navigator.connection.saveData`.

## P0 status (cumulative across both sessions)

| Meta-finding | Status |
|---|---|
| MF-01 ScrollReveal SSR-hidden gate | ✓ A1 |
| MF-02 Pricing SSoT drift | ✓ B1+B2 |
| MF-03 Canonical CTA breach | ✓ B3+B5 |
| MF-04 breadcrumbs absent | ✓ A3 (foundation) + 17-A wire-up (PR #6) |
| MF-05 cookie banner | ✓ C3 |
| MF-06 WebKit unstyled render | ✓ C1 (validated via grep; real-Safari smoke still pending) |
| MF-07 GEO citation zero | **pending — Phase 17-E** |
| MF-08 4 SSR-orphan skill pages | ✓ A2 + A5 |
| MF-09 forms friction | ✓ D4 + D5 |
| MF-11 opacity-modifier contrast | ✓ C4 |
| MF-12 ES locale fragmentation | ✓ B4 |
| F-10 BreadcrumbList missing @id | ✓ A3 |
| 16-04 F1 /skills parent collapse | ✓ A4 |

## Pending work options

### Option 1: Phase 17-E (Schema graph + GEO citation) — only remaining sub-phase

- Closes the headline MF-07 finding (GEO citation zero across 7 Gemini queries).
- 6 tasks (E1-E6), 12-16h per v1 handover; verify against the actual fix-plan via `git show audit/2026-05-18-v2-sota:docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` and read the `## Phase E:` section.
- Expected scope: speakable selector class tokens, Wikidata QID on Organization sameAs, llms.txt + llms-full.txt regen for AI Overviews, schema graph wiring across the new structured-data emitters introduced in 17-A and 17-B.
- Branch: stack off `feature/phase-17-d-forms-perf`.

### Option 2: Drain the PR stack

7 open PRs against `main`. Review + rebase + merge each tip-down. Rebase order:
1. PR #2 (audit followup) → main
2. PR #4 (17-B content) → main
3. PR #5 (17-A foundation) → main
4. PR #6 (17-A breadcrumbs wire) → main
5. PR #7 (17-C a11y/cookie) → main
6. PR #8 (17-D forms/perf) → main

The audit branch (PR #3) is research-only — merge or close separately.

### Option 3: Attend to deferred follow-ups

These are listed below as the "Open follow-ups" section and are individually small, but together they unblock the measurement story.

## Key context for new session

### Branch strategy (stacked PR pattern, unchanged)

- Audit branch is research-only. No production code there.
- Each Phase 17 sub-phase = own feature branch stacked on the previous one.
- Avoids `messages/*.json` merge conflicts since every phase touches i18n.

### Conventions (unchanged from v1 handover)

- Commits: `type(scope): message`, why-focused.
- **No em-dashes in user-facing copy** (NL/EN/ES). Strict rule from `feedback_no_em_dashes.md`.
- Pricing SSoT: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` AGENT_TIERS.
- Locale source-of-truth: NL → EN → ES.
- Skills count: 12 total (9 live + 3 coming_soon).
- Founding spots: 1 of 10 taken, MAX_PARTNERS_PER_YEAR=20. Constants in `src/lib/constants.ts`.
- Canonical domain: `future-marketing.ai`. Never reference `futuremarketingai.com`.

### Gotchas hit this session

- **Lighthouse spec not in production codebase**: D1 expected `tests/e2e/audit-v2-lighthouse.spec.ts` to exist; it lived only on the audit branch. Cherry-picked from `audit/2026-05-18-v2-sota:fmai-nextjs/tests/e2e/...`. Future phase cross-refs should `git ls-tree` the audit branch first instead of assuming.
- **@theme inline alone wasn't enough**: Tailwind 4 still emits its own default-token block under `@layer theme {:root, :host {...}}` regardless of `@theme inline`. Required the PostCSS plugin in `postcss.config.mjs` to strip `:host` from the layer.
- **CookieConsentBanner i18n edit slip**: An accidental marker key (`cookie_consent_v2_marker`) was inserted then needed cleanup. Always verify locale-file edits with `node -e "Object.keys(...)"` cross-locale before claiming done.
- **Vercel KV is retired** (per session-start knowledge update). `/api/vitals` logs to console instead. Storage decision deferred to future marketplace database.
- **Workspaces fields stay in DB**: Apply form drops `workspaces` from the surface but the Supabase column is unchanged. New submissions write NULL there. No migration needed; reads should handle missing values.
- **Spec D6 hadn't seen C7**: D6 in fix-plan listed `useReducedMotion` as new work, but C7 already wired it. D6 enhancement layered `requestIdleCallback` + `saveData` skip on top. Always check what previous-phase commits already shipped before re-implementing.

### User preferences validated this session

- "Ga maar door" mode confirmed: user explicitly asked to skip questions when next step was obvious. Reserve `AskUserQuestion` for true forks (phase choice between 17-D vs 17-E).
- One PR per phase, atomic commits per task cluster. Holds for 7 phases now.
- Required-field UX preference: visible red `*` + top-of-form note + paired `aria-required`. Pattern documented in `src/components/ui/Label.tsx`.
- Build cleanliness is checked at every task boundary (0 errors). 24-25 pre-existing warnings are tolerated, not new ones.

### Memory state

`/dream` recommended (was already recommended in v1 handover, MEMORY.md ~19 lines). No new memory writes this session beyond what was already committed.

## How to resume

1. Read this file first.
2. Run `git log --oneline -20` and `gh pr list` to confirm state.
3. Pick one of the 3 options above.
4. If Phase 17-E: read the corresponding `## Phase E:` section in `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` via `git show audit/2026-05-18-v2-sota:fmai-nextjs/docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` (note the path is under `fmai-nextjs/` on the audit branch). Branch off `feature/phase-17-d-forms-perf`.
5. If PR drain: start with PR #2 and walk up the stack.

## Open follow-ups (tracked outside fix-plan)

Carryovers from v1 handover, still open:
- Stripe price IDs sync for workspace-pricing model (`project_pricing_handover.md` memory).
- Cleanup `chatbot` singular + `landing` top-level orphan namespaces (TODO in `scripts/check-orphan-i18n.mjs` ALLOW list).
- Real-Safari smoke test of MF-06 fix via BrowserStack / borrowed Mac/iPhone.
- Legacy `futuremarketingai-marketing-site` Vercel project cleanup.
- Vercel CLI install (`npm i -g vercel`).

New from this session:
- **GOOGLE_PSI_API_KEY provisioning** (D2). One-time GCP setup: create `fmai-perf-tracking` project, enable PSI + CrUX APIs, restrict an API key to those two services, store in `~/.claude/.env`. Script header in `scripts/measure-crux.mjs` has the full procedure. Until done, `npm run audit:crux` exits with a clear message.
- **`/api/vitals` storage decision** (D3). Endpoint currently logs to console. Decide: Vercel log drains → Datadog, n8n webhook target, or Supabase write (cost trade-off documented in route file). Stable JSON envelope is in place, picker just needs to wire the sink.
- **CI gate wiring for cross-browser-render.spec.ts** (C2). No GitHub Actions workflow exists in the repo. When CI is bootstrapped, run this spec on PR + main pushes.
- **Phase 16 audit branch cleanup**: `audit/2026-05-18-v2-sota` has 1.4MB of `tmp/` scratch (now gitignored, just not removed).

## Files reference

- This handover: `docs/plans/2026-05-19-phase-17-handover-v2.md`
- v1 handover (still useful for Phase 17-A/B context): `docs/plans/2026-05-19-phase-17-handover.md`
- Fix-plan canonical task source: on `audit/2026-05-18-v2-sota` branch, access via `git show audit/2026-05-18-v2-sota:fmai-nextjs/docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md`. (Path lives under `fmai-nextjs/` on the audit branch.)
- Pricing canon: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` (different repo).
- New harness files added this session:
  - `fmai-nextjs/tests/e2e/audit-v2-lighthouse.spec.ts` + `_audit-v2-config.ts`
  - `fmai-nextjs/tests/e2e/cross-browser-render.spec.ts`
  - `fmai-nextjs/scripts/measure-crux.mjs`
- New components added this session:
  - `fmai-nextjs/src/components/ui/Label.tsx`
  - `fmai-nextjs/src/components/layout/CookieReopenButton.tsx`
  - `fmai-nextjs/src/app/api/vitals/route.ts`
  - `fmai-nextjs/src/app/[locale]/newsletter/confirm/NewsletterConfirmClient.tsx`
