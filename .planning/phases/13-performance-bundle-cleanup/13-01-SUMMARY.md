---
phase: 13-performance-bundle-cleanup
plan: 01
subsystem: ui
tags: [performance, bundle-size, lazy-loading, next-dynamic, zustand, gradient-mesh, ssr-hydration, app-router]

# Dependency graph
requires:
  - phase: 12-brand-copy-polish
    provides: stable v10 copy + brand-asset baseline that this plan does not touch
provides:
  - Interaction-gated chat / Calendly / booking modals (FloatingChatTrigger, CalendlyTrigger, BookingTrigger)
  - Home-only Spline prefetch + preconnect (was ablanket-injected to all 88 routes)
  - Home-only GradientMesh with reduced blur + size and prefers-reduced-motion gating
  - Lazy CookieConsentBanner with needsConsent guard for returning visitors
  - HeaderClient document listeners gated on open-state instead of always-hot
  - Lazy Zustand rehydrate (deferred from page-load to first chat click)
affects: [13-02, 13-03, 14, future a11y/perf phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Interaction-gated dynamic islands: store-subscriber components that only mount the heavy modal when state flips true"
    - "Cookie-gated lazy chunks: useEffect cookie check delays the dynamic import for returning visitors"
    - "Per-page <link> hints in App Router server components hoist into the document <head> (replaces blanket <head> in layout)"
    - "useEffect(()=>{...}, [openFlag]) listener attachment guard: zero document listeners during default/closed state"

key-files:
  created:
    - "fmai-nextjs/src/components/chatbot/FloatingChatTrigger.tsx"
    - "fmai-nextjs/src/components/interactive/CalendlyTrigger.tsx"
    - "fmai-nextjs/src/components/booking/BookingTrigger.tsx"
  modified:
    - "fmai-nextjs/src/app/[locale]/layout.tsx"
    - "fmai-nextjs/src/app/[locale]/page.tsx"
    - "fmai-nextjs/src/app/[locale]/(skills)/layout.tsx"
    - "fmai-nextjs/src/components/providers/ClientIslands.tsx"
    - "fmai-nextjs/src/components/providers/StoreProvider.tsx"
    - "fmai-nextjs/src/components/interactive/CookieConsentBanner.tsx"
    - "fmai-nextjs/src/components/layout/HeaderClient.tsx"
    - "fmai-nextjs/src/components/hero/GradientMesh.tsx"
    - "fmai-nextjs/src/app/globals.css"

key-decisions:
  - "FloatingChatTrigger renders a 1-button placeholder + inline SVG until first click; on click, stores isOpen=true THEN mounts ChatWidget so the user sees a one-click open instead of two"
  - "Reused existing ChatWidgetIsland inside the dynamic import (preserves the per-pathname welcome message + suggested prompts mapping that already lives there)"
  - "CookieConsentBanner double-gated: needsConsent state in ClientIslands prevents the chunk from being requested at all + the component itself short-circuits if cookie is present"
  - "Blob animations now wrapped in @media (prefers-reduced-motion: no-preference) instead of relying on the existing prefers-reduced-motion: reduce override block. Cleaner positive-default pattern"
  - "Blobs hidden via display:none under 1024px viewport — three 400px blurred composite layers were the largest INP contributor per audit doc 01-performance.md"
  - "(skills) nested layout regression discovered during verify rebuild: parallel plan 13-02 introduced an async layout calling getMessages() without setRequestLocale() — fixed under Rule 3 because plan 13-01 must_haves explicitly require all 87 prerendered pages to keep building successfully"

patterns-established:
  - "Trigger component pattern: thin client component that subscribes to a store flag and conditionally mounts the heavy modal via next/dynamic"
  - "Per-page Spline-style resource hints: render <link rel='preconnect'/> + <link rel='prefetch'/> directly in the page server component's JSX top-of-return; App Router hoists them into <head>"
  - "Listener-gating: useEffect early-return on the closed-state, attach + cleanup only while open. Goal: zero document listeners on the 99% of user-time menus are closed"

requirements-completed: [AUDIT-P1-PERF]

# Metrics
duration: ~30min
completed: 2026-04-27
---

# Phase 13 Plan 01: Lazy-load Heavy Islands + Home-only Spline + Lighter Blobs Summary

**Interaction-gated ChatWidget / CalendlyModal / BookingModal triggers, home-only Spline preconnect+prefetch, home-only and reduced GradientMesh, returning-visitor cookie banner skip, gated HeaderClient document listeners, deferred Zustand rehydrate.**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-04-27T00:14:00Z
- **Completed:** 2026-04-27T00:45:00Z
- **Tasks:** 9 (1 baseline capture + 7 refactors + 1 verify)
- **Files created:** 3 trigger components
- **Files modified:** 9
- **Commits:** 9 atomic + 1 cross-plan fix

## Accomplishments

- ChatWidget, CalendlyModal, BookingModal, react-cookie-consent are all interaction-gated. None of their chunks load until user actually opens chat / clicks a Calendly CTA / clicks a Booking CTA / first-time visitor sees the cookie banner.
- Spline prefetch (`/spline/scene.splinecode`, ~1.3 MB) + unpkg preconnect now ship only on `/` and `/nl` and `/es` (3 home routes), not on the 86 non-home prerendered routes. Verified by `grep -c scene.splinecode` returning 2 on home HTML and 0 on every non-home HTML.
- GradientMesh (3 blurred animated blobs) now home-only AND blur reduced 100→60px AND sizes 600/500/400→all 400px AND animations gated behind `prefers-reduced-motion: no-preference` AND blobs hidden below `lg` (max-width: 1023px).
- HeaderClient's two document-level listeners (Escape keydown + outside-click mousedown) are now gated on open-state. The keydown listener used to be unconditional; both now attach+cleanup only while a menu is open.
- Zustand `chatbotStore` no longer eager-rehydrates on every page load via StoreProvider. Rehydrate happens inside `FloatingChatTrigger.handleOpen` on first click (deferred to actual usage).
- Prerendered HTML size dropped 28-55% per route (most savings come from plan 13-02's i18n message subset, but Spline-link removal contributes to non-home routes specifically).
- Build still emits 88/88 pages including the 12 SSG skill routes (regression caught and fixed during verify; see Deviations).

## Task Commits

Each task was committed atomically:

1. **Task 1: Capture pre-refactor baseline build metrics** — `0503e64` (chore)
2. **Task 2: Relocate Spline prefetch + preconnect from layout to home page** — `64c29c9` (perf)
3. **Task 3: Add FloatingChatTrigger, CalendlyTrigger, BookingTrigger** — `e02602e` (feat)
4. **Task 4: Rewrite ClientIslands to mount only lightweight triggers** — `241524b` (refactor)
5. **Task 5: Remove eager Zustand rehydrate from StoreProvider** — `463f10f` (perf)
6. **Task 6: Lazy-load CookieConsentBanner with needsConsent gate** — `6c36281` (perf)
7. **Task 7: Gate GradientMesh to home only + reduce blob cost** — `60c6b19` (perf)
8. **Task 8: Gate HeaderClient document listeners on menu open state** — `24c8c55` (perf)
9. **Task 9 verify: Restore SSG for 12 skill routes (cross-plan fix)** — `d27a781` (fix)

**Plan metadata commit:** pending — created with this summary.

## Files Created/Modified

### Created

- `fmai-nextjs/src/components/chatbot/FloatingChatTrigger.tsx` — minimal placeholder button + inline SVG; lazy-imports ChatWidgetIsland on first click; rehydrates Zustand and sets isOpen=true so the click both loads and opens
- `fmai-nextjs/src/components/interactive/CalendlyTrigger.tsx` — store subscriber for `chatbotStore.calendlyOpen`; mounts CalendlyIsland only when true
- `fmai-nextjs/src/components/booking/BookingTrigger.tsx` — store subscriber for `bookingStore.isOpen`; mounts BookingModal only when true

### Modified

- `fmai-nextjs/src/app/[locale]/layout.tsx` — removed `<head>` block with Spline links, removed static CookieConsentBanner import + render, removed GradientMesh import + render
- `fmai-nextjs/src/app/[locale]/page.tsx` — added Spline preconnect + prefetch as inline `<link>` elements (App Router hoists them to `<head>`), added GradientMesh import + render
- `fmai-nextjs/src/app/[locale]/(skills)/layout.tsx` — added `generateStaticParams` + `setRequestLocale(locale)` to keep skill routes SSG (Rule 3 cross-plan fix for 13-02)
- `fmai-nextjs/src/components/providers/ClientIslands.tsx` — replaced eager-dynamic ChatWidgetIsland/CalendlyIsland/BookingModal with the three new triggers + dynamic CookieConsentBannerLazy gated on `needsConsent` state
- `fmai-nextjs/src/components/providers/StoreProvider.tsx` — removed `useEffect(rehydrate)`; pass-through wrapper kept
- `fmai-nextjs/src/components/interactive/CookieConsentBanner.tsx` — added `hasConsent` state with cookie check and short-circuit return (defense-in-depth)
- `fmai-nextjs/src/components/layout/HeaderClient.tsx` — Escape keydown listener now gated on `skillsOpen || mobileOpen`
- `fmai-nextjs/src/app/globals.css` — `.blob` blur 100→60px, sizes all 400×400, animations behind `prefers-reduced-motion: no-preference` media, blobs hidden under 1024px

## Metrics — Before vs After

### Prerendered HTML sizes (sample of 8 routes)

| Route | Before | After | Delta |
| --- | --- | --- | --- |
| `en.html` (home) | 205,095 B | 109,764 B | **−93 KB (−47%)** |
| `nl.html` (home) | 210,052 B | 110,642 B | **−95 KB (−47%)** |
| `en/pricing.html` | 273,636 B | 177,421 B | **−94 KB (−35%)** |
| `nl/pricing.html` | 279,371 B | 179,077 B | **−98 KB (−35%)** |
| `en/about.html` | 184,455 B | 88,240 B | **−94 KB (−51%)** |
| `en/skills/voice-agent.html` | 184,180 B | 131,657 B | **−51 KB (−28%)** |
| `en/legal/privacy.html` | 170,816 B | 74,558 B | **−94 KB (−55%)** |
| `nl/legal/privacy.html` | 176,481 B | 76,144 B | **−95 KB (−55%)** |

> Caveat: most of the HTML-size delta comes from plan 13-02's `pick(messages, ...)` call (which trims the inlined message tree). Plan 13-01's specific contribution is captured in the JS chunks + Spline link removal below.

### Spline prefetch presence per route (definitive 13-01 evidence)

| Route HTML | scene.splinecode count | unpkg.com count |
| --- | ---: | ---: |
| `en.html` (home) | 2 | 2 |
| `nl.html` (home) | 2 | 2 |
| `en/pricing.html` | 0 | 0 |
| `en/about.html` | 0 | 0 |
| `en/legal/privacy.html` | 0 | 0 |
| `en/skills/voice-agent.html` | 0 | 0 |
| `nl/legal/privacy.html` | 0 | 0 |

Per non-home pageload, 1.3 MB Spline scene fetch + cross-origin handshake is no longer issued. There are 86 such routes.

### Static chunk dir total

- Before: 6,364,648 B (6.07 MB)
- After: 6,367,442 B (6.07 MB) — essentially flat, by design. Wave 1 doesn't shrink the heavy chunks themselves; it changes WHEN they are downloaded. Three new tiny chunks for the lazy boundaries (~22 KB raw / 22 KB gz combined) replace one bundled island chunk.

### Build status

- 88/88 static pages generated, both before and after.
- All 12 skill routes remain SSG (●) — restored after the Task 9 cross-plan fix.

## Decisions Made

- **Reuse `ChatWidgetIsland` inside the dynamic import** instead of inlining its pathname-mapping logic into `FloatingChatTrigger`. Keeps the per-page welcome-message + suggested-prompts table centralised in one place; the trigger only adds the loading boundary.
- **Open chat on the same click that loads it.** The plan sketched a simple "swap placeholder for ChatWidget" but ChatWidget defaults to `isOpen=false` so the user would have to click TWICE. Set `isOpen=true` in the store immediately before mounting; one click opens.
- **Double-gate the cookie banner** (needsConsent in ClientIslands + hasConsent inside CookieConsentBanner). Either gate alone would be sufficient, but the inner short-circuit is cheap and prevents a race-window where the chunk fetches before the cookie check resolves.
- **Switch to positive-default media query for blob animations** (`prefers-reduced-motion: no-preference`) instead of relying on the existing `prefers-reduced-motion: reduce` universal override. Easier to reason about, doesn't depend on the global override block to halt blobs.
- **Hide blobs entirely on mobile/tablet (<1024px)** rather than just shrink/de-blur them further. Mid-range mobiles were the largest INP contributor per audit; zero composite layers is the cleanest fix.
- **Keep `StoreProvider` as a pass-through wrapper** instead of deleting it. Future provider work has a place to land without re-introducing a layer; diff stays small and reversible.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Restored SSG for 12 skill routes after parallel plan 13-02 regression**
- **Found during:** Task 9 (verify rebuild)
- **Issue:** Parallel plan 13-02 commit `05e8a0a` introduced a new `(skills)` route-group nested layout that calls `getMessages()` inside an async server component without `setRequestLocale(locale)`. This opted the entire `(skills)` subtree out of static generation, flipping all 12 skill routes from SSG (●) to dynamic (ƒ). My plan 13-01 must_haves explicitly require all 87 prerendered pages to keep building successfully, so this was a blocking issue for my plan's verification gate.
- **Fix:** Added `generateStaticParams()` exporting `routing.locales.map(...)` and `await params` + `setRequestLocale(locale)` at the top of the layout body in `src/app/[locale]/(skills)/layout.tsx`. Minimal change, matches the pattern used by all other route layouts in the codebase.
- **Files modified:** `fmai-nextjs/src/app/[locale]/(skills)/layout.tsx`
- **Verification:** Rebuild — all 12 skill routes once again show `●` (SSG) in the build output. 88/88 static pages still generated.
- **Committed in:** `d27a781`
- **Note for 13-02 verifier:** the fix lives inside 13-02's owned file, but the regression was caused by 13-02's commit `05e8a0a`. 13-02 will see this file already correct when its own verifier runs.

**2. [Rule 1 — Better UX] One-click chat open instead of two-click**
- **Found during:** Task 3 (writing FloatingChatTrigger)
- **Issue:** The plan sketched the trigger as a placeholder button that, on click, sets `mounted=true` and mounts ChatWidget. ChatWidget renders its own FloatingButton + panel based on `useChatbotStore.isOpen`. Default is `isOpen=false`, so after the placeholder swap, the user would see ChatWidget's own FloatingButton — they'd have to click AGAIN to actually open the chat. Two clicks for one open is a UX bug versus the prior eager-load behaviour.
- **Fix:** Inside `FloatingChatTrigger.handleOpen`, call `useChatbotStore.setState({ isOpen: true, isMinimized: false })` BEFORE setMounted. ChatWidget reads `isOpen=true` on first render and shows the panel directly. One click both loads and opens.
- **Files modified:** `fmai-nextjs/src/components/chatbot/FloatingChatTrigger.tsx`
- **Verification:** Logical trace — `handleOpen` runs `rehydrate -> setState({isOpen:true}) -> setMounted(true)` synchronously, so when ChatWidget first renders, `useChatbotStore` already returns `isOpen=true` and the panel `motion.div` mounts.
- **Committed in:** `e02602e` (part of Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking cross-plan regression, 1 UX correctness fix)
**Impact on plan:** Both auto-fixes were necessary. The cross-plan SSG fix was inside plan 13-02's territory but blocked plan 13-01's verification gate; the UX fix prevented an externally visible regression versus the prior eager-loaded behaviour. No scope creep.

## Issues Encountered

- **Bash glob inconsistency on Windows MinGW:** `fmai-nextjs/src/app/[locale]/page.tsx` literal-bracket paths in `grep` did not resolve (`No such file or directory`) but worked fine in Edit/Read/Write tools and via the GSD-tools binary. Worked around using the Grep tool for verification instead of inline `grep` in Bash. No code impact.
- **Build process lock between adjacent rebuilds:** the first verify rebuild produced the SSG regression; an immediate second rebuild attempt errored with "Another next build process is already running." Resolved with an 8-second wait then `rm -rf .next && npm run build` clean rebuild. Standard Next.js build-tracker behaviour, not a regression.

## User Setup Required

None — all changes are code-level. No env vars, no service config, no database changes. The deferred chunks load on demand from existing `_next/static/chunks/` paths.

## Next Phase Readiness

- Plan 13-02 (i18n message subsetting) ran in parallel and has already landed via commits `ddb07a0`, `74c96bb`, `05e8a0a`. The `setRequestLocale` fix in `(skills)/layout.tsx` is compatible with its design.
- Plan 13-03 (cleanup of orphaned legacy modules) can now safely identify `ChatWidgetIsland` and `CalendlyIsland` as still-in-use (referenced from the new triggers via dynamic import); other Vite-era artefacts can still be flagged.
- Wave 2 perf work (component-level code-splitting inside chatbot subtree, framer-motion → motion.dev migration if pursued, Spline lazy-mount on viewport-intersection rather than eager hero) has more headroom now that the obvious wins are landed.

## Self-Check: PASSED

Verified before final commit:

- `fmai-nextjs/src/components/chatbot/FloatingChatTrigger.tsx` — FOUND
- `fmai-nextjs/src/components/interactive/CalendlyTrigger.tsx` — FOUND
- `fmai-nextjs/src/components/booking/BookingTrigger.tsx` — FOUND
- `.planning/phases/13-performance-bundle-cleanup/baseline-before.txt` — FOUND
- `.planning/phases/13-performance-bundle-cleanup/baseline-after.txt` — FOUND
- All 9 commits present in `git log`: `0503e64`, `64c29c9`, `e02602e`, `241524b`, `463f10f`, `6c36281`, `60c6b19`, `24c8c55`, `d27a781`
- Build green (88/88 static pages, all 12 skill routes SSG)
- Non-home HTML files contain 0 references to `scene.splinecode` or `unpkg.com`
- Home HTML files contain exactly 2 references each (preconnect + prefetch as expected)

---

*Phase: 13-performance-bundle-cleanup*
*Plan: 01*
*Completed: 2026-04-27*
