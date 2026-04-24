# Performance Audit — FutureMarketingAI Marketing Site

> Audit date: 2026-04-24
> Codebase: `C:/Users/daley/Desktop/Futuremarketingai/fmai-nextjs`
> Stack: Next.js 16.1.7 (Turbopack), React 19.2.3, TS strict, Tailwind 4, next-intl 4.8, Motion (Framer), Spline 3D
> Method: static analysis + production build (`npm run build`) + chunk inspection in `.next/static/`
> Scope: READ-ONLY. No code modified.

---

## Executive summary

1. **Initial JS on homepage is ~787 KB uncompressed / ~207 KB gzipped** across 13 chunks linked in `<head>`. This sits on top of a 108 KB CSS file. Before lazy assets kick in the page already ships ~315 KB over the wire — acceptable but not lean for a marketing site; the bulk is React + Motion + next-intl runtime + Zustand persist store + next-intl messages.
2. **Spline 3D costs ~4 MB of JS** (`42e392231e9661a1.js` = 2.0 MB Three.js + `069fd89e42ee45dd.js` = 1.9 MB Spline runtime/WASM glue). Loading is deferred via a 3 s `setTimeout` + `next/dynamic(..., { ssr:false })` with a static `hero-robot-preview.webp` (22 KB) covering the visual. The deferral strategy is sound, but the scene chunk itself (`/spline/scene.splinecode` = 1.3 MB) is also prefetched from the root `<head>` on **every page**, not just the homepage — waste on all non-home routes.
3. **Chatbot, Calendly, and booking modal always ship to every page** via `ClientIslands` in the root layout. `ChatWidgetIsland` pulls in 20+ client files, `@ai-sdk/react`, `ai`, `react-markdown`, `zustand/persist`, Motion, and the whole tool-results tree. Even with `ssr:false` Turbopack links these chunks on every route — likely ~100 KB gz added to every page, dominated by `8582ac18072bd57d.js` (352 KB / 71 KB gz). The store is also rehydrated eagerly by `StoreProvider` even when the widget never opens.
4. **Three full-viewport blurred gradient blobs run infinite CSS animations on every page** (`GradientMesh` + `.blob-warm/.blob-cool/.blob-mixed` with `filter:blur(100px)` and 20–30 s animations). Each is 400–600 px, position-fixed, `z-0`, permanently composited. These hammer the GPU compositor and can degrade INP on lower-end hardware — especially given they're stacked with the Spline scene and Motion animations.
5. **The i18n message JSON is 117 KB (NL) / 111 KB (EN) / 121 KB (ES) and loaded in full on every request** via `src/i18n/request.ts` dynamic import. `NextIntlClientProvider` serializes it into the HTML and ships it to the client, so every page payload grows by ~100 KB of translations, most of which the page never uses (skills translations loaded on `/about`, etc.). No per-route splitting is configured.

---

## Current state (measured)

### Route / build topology
- **29 distinct routes × 3 locales = 87 prerendered pages** (see `.next/app-path-routes-manifest.json`). Build took 12.1 s on Turbopack; SSG generation 2.6 s.
- **Route groups**: `(marketing)` (home + 8 pages), `(skills)` (12 skills), `(blog)` (index + dynamic `[slug]`), `(legal)` (4 pages). All SSG (`●`) except `/[locale]/blog` (`ƒ` dynamic), `/[locale]/opengraph-image`, `/api/*` routes, and `/[locale]/blog/[slug]` (SSG but `revalidate 1h`).
- **Client components**: 60 files total with `'use client'`. App-router files: only `src/app/[locale]/error.tsx`. Everything else is server by default — good baseline.
- **Middleware**: `middleware.ts` wraps `createMiddleware(routing)` from next-intl. Matcher excludes `api`, `_next`, `_vercel`, OG images, and files with extensions. Standard, lightweight.

### Bundle sizes (from `.next/static/chunks/`)
Total compiled chunks: **6.04 MB uncompressed** / 39 JS files.

| Chunk | Raw | Gzip | Content (best guess) |
|---|---:|---:|---|
| `42e392231e9661a1.js` | 2.0 MB | — | **Three.js** (111 hits on `BufferGeometry`/`WebGLRenderer`/`Scene`). Lazy. |
| `069fd89e42ee45dd.js` | 1.9 MB | — | **Spline runtime + WASM glue** (`Float64Array`/`memory.buffer` pattern). Lazy. |
| `8582ac18072bd57d.js` | 352 KB | ~71 KB | **Chat widget + AI SDK + markdown** (matches `ai-sdk`, `react-markdown`, `calendly`). |
| `064103ffd82e97a1.js` | 266 KB | — | Page-level code (per-route) |
| `f4c31ddbc3ca1a54.js` | 220 KB | 70 KB | **React + react-dom 19** (in `rootMainFiles`) |
| `7e671c663689300b.js` | 164 KB | — | Per-route code |
| `f3945bdd3fd3cce2.js` | 132 KB | 44 KB | **Messages + page data** (gzip ratio suggests JSON-heavy) |
| `a6dad97d9634a72d.js` | 110 KB | 30 KB | Framework (noModule polyfills) |
| `7d6514a90169e63d.js` | 109 KB | 31 KB | next-intl client runtime (in rootMainFiles) |
| `748681575dab7415.css` | 99 KB | 16 KB | **Main CSS** (Tailwind 4 utilities) |
| `d6b9a27456f1bd0a.js` | 90 KB | — | Additional Spline glue (on-demand) |
| `e8701153e61b2336.js` | 80 KB | — | Framework chunk |

`rootMainFiles` (loaded on every page) total: **~411 KB raw**.

### Homepage (`/en`) — scripts & stylesheets linked in HTML (from prerendered `.next/server/app/en.html`)
- 3 `next/font/google` woff2 files (preloaded, 3 × ~15 KB estimate — DM Sans + JetBrains Mono + Space Grotesk)
- 2 CSS files (`747ec66f84e14d2a.css` = 9 KB + `748681575dab7415.css` = 99 KB)
- 13 JS chunks async loaded, totalling **787 KB raw / 207 KB gzipped**
- 5 `application/ld+json` scripts (Org + Site + Page + Breadcrumb + FAQ). Minor.
- `<link rel="preconnect" href="https://unpkg.com">` and `<link rel="prefetch" href="/spline/scene.splinecode" as="fetch">` — see finding P-3.

### Prerendered HTML sizes
- `/en` = 195 KB, `/nl` = 200 KB, `/es` = ~200 KB
- `/en/pricing` = **262 KB** (biggest — Tier matrix + tables)
- Skill pages = 167–200 KB (lead-qualifier largest at 200 KB due to embedded chat demo markup)
- Legal, apply, contact = 155–171 KB

Roughly half of each HTML page is the inlined `__NEXT_DATA__`-style RSC payload + the full i18n message tree.

### Public assets (`public/`)
| Path | Size | Notes |
|---|---:|---|
| `spline/scene.splinecode` | 1.3 MB | Hero 3D scene. Prefetched on every page. |
| `fonts/DMSans-Variable.ttf` | 235 KB | Used only by `/[locale]/opengraph-image` (OG render). Not loaded in browser. OK. |
| `images/hero-robot.png` | 229 KB | PNG fallback. Not currently referenced by any `.tsx`. Dead. |
| `images/hero-robot.webp` | 13 KB | Referenced nowhere (Grep confirms). Dead. |
| `images/hero-robot-preview.webp` | 22 KB | Used by `src/components/ui/splite.tsx:37` as preview image. |
| `llms.txt`, `llms-full.txt` | 3 KB + 17 KB | Static. OK. |
| `case-studies/skc/` | empty dir | — |
| `screenshots/skills/` | empty dir | — |

### Fonts
`src/lib/fonts.ts` loads **three Google fonts** via `next/font/google`:
- DM Sans (4 weights: 400/500/600/700)
- JetBrains Mono (variable default)
- Space Grotesk (4 weights)

All with `display: 'swap'`, `preload: true`, `adjustFontFallback: true`, latin only. That's 3 font families × multiple weights preloaded — confirmed by 3 `<link rel="preload">` entries in every HTML.

### Animations / Motion
- **25 components** import from `motion/react`. With `optimizePackageImports: ['motion']` in `next.config.ts:87`, tree-shaking should be effective, but `motion` still ships in the initial Header bundle (`HeaderClient.tsx` is a client component in the root layout).
- `ScrollReveal` is used 8+ times on the homepage alone, each wrapping a section — fine individually but adds `IntersectionObserver` + animation machinery for every section.
- `OrbitVisual.tsx` (Grep shows zero imports) — **dead code** (111 lines, animations + SVG).

### CSS
- `globals.css` = 361 lines, defines `@theme` tokens, 18 `@keyframes`, 3 full-viewport blobs (`.blob-warm|cool|mixed`).
- Final compiled CSS = 99 KB raw / 16 KB gzip. Tailwind 4 JIT is doing its job — final size is fine, but blob animations + `filter:blur(100px)` + `will-change:transform` on 3 fixed elements is expensive to composite.

### Caching / rendering
- `next.config.ts:76–82` — good: `compress: true`, `images.formats: ['image/avif','image/webp']`, `minimumCacheTTL: 31_536_000` (1 yr).
- 7 permanent redirects set (`next.config.ts:108–148`) — handled in proxy, no runtime cost on target routes.
- CSP (`next.config.ts:15–29`) allows `unsafe-inline` + `unsafe-eval` in `script-src`, and `https://unpkg.com` (Spline WASM). Accepted per Spline's requirements but worth documenting.
- `generateStaticParams()` is invoked on every top-level page → all locales prerendered. Good.
- `/[locale]/blog/[slug]` uses `revalidate: 3600` (ISR 1 h). OK.

### Third-party scripts
- **Calendly** via `react-calendly` (`InlineWidget`) — dynamically imported inside `CalendlyModal` which itself is inside a dynamically imported `CalendlyIsland`. Good — fires only when user triggers booking.
- **Spline** (`@splinetool/react-spline` + `@splinetool/runtime`) — dynamic, 3 s delay. Good.
- **react-cookie-consent** — imported statically by `CookieConsentBanner`, rendered directly in root layout (`layout.tsx:12,70`). Ships on every page, not gated.
- **GA/GTM** — CSP allows `googletagmanager.com` but no `next/script` found referencing it. Currently no analytics script; `WebVitalsReporter` calls `navigator.sendBeacon('/api/vitals', …)` which does **not exist** (`src/app/api/` has only `apply`, `chatbot`, `contact`) — every page load in prod fires a failing POST beacon (silently 404).

### Network waterfall
- 3 font woff2 preloads + 2 stylesheets + 13 async scripts + 1 prefetch (`scene.splinecode`) + 1 preconnect (`unpkg.com`) — about 20 requests before React mounts on homepage.
- `preconnect` to `https://unpkg.com` happens on **every page** (layout-level), even though Spline is only on `/`. Wasted connection warm-up everywhere else.

---

## Findings ranked by impact

### F-1 | Spline scene is prefetched on every page, not just home — [M] [LCP/bandwidth]
**Evidence**: `src/app/[locale]/layout.tsx:57–59`:
```tsx
<link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
<link rel="prefetch" href="/spline/scene.splinecode" as="fetch" />
```
These are in the shared `<head>` of the `[locale]/layout.tsx`, so every route (29 pages × 3 locales = 87) instructs the browser to prefetch a **1.3 MB binary** it never uses, and open a TCP+TLS connection to `unpkg.com` for the WASM. On `/pricing`, `/about`, skill pages, etc. this is pure waste.

**Impact**: Extra 1.3 MB download + connection setup on non-home pages → worse LCP/TTFB on slow connections; wasted bandwidth on every internal nav.
**Fix**: Move the `<link rel="prefetch">` + `<link rel="preconnect">` into the home page only (`src/app/[locale]/page.tsx`), or conditionally render them in a server component that reads the current pathname. Keep Spline chunk lazy via `next/dynamic` as-is.
**Effort**: S

---

### F-2 | `ChatWidgetIsland`, `CalendlyIsland`, `BookingModal` mount on every page — [H] [INP / initial JS]
**Evidence**:
- `src/app/[locale]/layout.tsx:71` renders `<ClientIslands />`.
- `src/components/providers/ClientIslands.tsx:16–28` dynamically imports 3 heavy islands with `ssr:false`.
- `ChatWidgetIsland` pulls `ChatWidget` → `usePersonaChat`, `@ai-sdk/react`, `ai`, `react-markdown`, `AnimatePresence/motion`, `zustand`, + 20+ sibling client components (Grep: 60 `'use client'` files, >30 are under `src/components/chatbot/`).
- Per bundle inspection, chunk `8582ac18072bd57d.js` = 352 KB / ~71 KB gz contains `@ai-sdk`, `react-markdown`, calendly, motion — and is linked on the homepage HTML.
- `StoreProvider` (`src/components/providers/StoreProvider.tsx:14–18`) also forces a `useChatbotStore.persist.rehydrate()` on mount for every visitor.

**Impact**: ~70–100 KB of gzipped JS + ~350+ KB raw shipped to every page even when the user never clicks the chat or books. Adds parse/compile cost → INP regression, especially on mid-range Android.
**Fix**:
1. Make `ClientIslands` *visibility-driven*: render `<FloatingButton />` only (a ~3 KB component), and only import the full `ChatWidget` on click via lazy import inside `FloatingButton`'s click handler.
2. Gate `CalendlyIsland` + `BookingModal` behind a `useState` hook that activates only when the store flips `calendlyOpen` / `isBookingOpen` to true. Use `dynamic(..., { ssr:false, loading: () => null })` inside a conditional.
3. Remove `StoreProvider`'s eager rehydrate; let Zustand's default lazy rehydrate run when the store is first *read* from a mounted client island.

**Effort**: M

---

### F-3 | Whole i18n message tree ships to client on every page — [M] [bundle / LCP]
**Evidence**:
- `src/i18n/request.ts:11`: `messages: (await import(\`../../messages/${locale}.json\`)).default` — loads the whole file (NL 117 KB, EN 111 KB, ES 121 KB).
- `src/app/[locale]/layout.tsx:63`: `<NextIntlClientProvider messages={messages}>` passes the full tree to the client.
- Matches gzip ratio of chunk `f3945bdd3fd3cce2.js` (132 KB raw → 44 KB gz, typical of JSON).

**Impact**: ~40 KB gz of unused translations on every page; adds to hydration cost and serialised RSC payload. Skill-page translations (`skills-voice-agent`, `skills-clyde`, etc.) are shipped to `/pricing`.
**Fix**: Split `messages/*.json` into per-namespace files. In `request.ts`, read the page segment (or pass the namespaces from layout/page metadata) and merge only what's needed. next-intl officially supports this via `NextIntlClientProvider.messages={pick(allMessages, ['common', 'nav', 'home'])}`. Alternative: use `getTranslations` in server components everywhere and only pass a minimal subset to the client provider (common + nav). Many pages can omit the client provider entirely since all text is server-rendered.
**Effort**: M

---

### F-4 | Three infinite-animation blurred blobs run on every page — [M] [INP / CLS-adjacent paint]
**Evidence**:
- `src/components/hero/GradientMesh.tsx:6–14` renders three `.blob-*` divs mounted fixed in root layout.
- `src/app/globals.css:275–306`: `filter:blur(100px)`, 400–600 px elements, `animation: blobFloat{1,2,3}` infinite 20–30 s.
- `spline-loading` class pauses them while Spline compiles (`globals.css:318–322`), acknowledging the cost.

**Impact**: A 600×600 px layer with `blur(100px)` produces a promoted compositor layer ~800×800 px (blur radius × 2 padding). Three stacked with infinite transforms means continuous GPU composition even at idle. On a low-end mobile this can drop to 30 fps and raise INP. They're currently active on every page while users read static copy.
**Fix**:
1. Reduce blur to 60 px and blob size to 300–400 px (visually indistinguishable at those dimensions).
2. Replace `animation` with CSS `@media (prefers-reduced-motion: no-preference)` wrapping, and additionally disable on viewports < 1024 px.
3. Consider rendering the mesh only when the hero is in view (IntersectionObserver gating on the home page, no-op on other pages) — or swap to a static SVG/WebP for non-home routes. `OrbitVisual` already demonstrates in-view pause pattern (`OrbitVisual.tsx:12` uses `useInView`).
**Effort**: S

---

### F-5 | Broken `/api/vitals` beacon on every page load — [L] [noise / minor CPU]
**Evidence**: `src/lib/web-vitals.ts:41` calls `navigator.sendBeacon('/api/vitals', ...)` for 5 metrics. No `src/app/api/vitals/route.ts` exists (only `apply`, `chatbot`, `contact`). `WebVitalsReporter` is rendered in root layout (`layout.tsx:72`).

**Impact**: 5 failing POSTs per page-load in prod → 404 responses, wasted edge traffic, and noisy error logs. No data captured — so Vercel's actual speed-insights are blind.
**Fix**: Either (a) add a minimal `src/app/api/vitals/route.ts` that accepts + forwards to an analytics backend, or (b) swap to `@vercel/speed-insights` or `@vercel/analytics`, both of which report without a custom endpoint. Given this is a Vercel deploy, option (b) is trivial and gives proper dashboards.
**Effort**: S

---

### F-6 | `OrbitVisual` is dead code — [L] [bundle hygiene]
**Evidence**: `src/components/hero/OrbitVisual.tsx` (111 lines, client component with `useInView` + 5 rings + dozens of SVG dots). Grep shows no importer anywhere in `src/`. Likely orphan from a prior hero design.
**Impact**: Not in the bundle (tree-shaken) but confuses maintenance.
**Fix**: Delete the file.
**Effort**: S

---

### F-7 | Dead asset: `hero-robot.png` (229 KB) and `hero-robot.webp` (13 KB) — [L] [repo hygiene]
**Evidence**: Only `hero-robot-preview.webp` is referenced (`src/components/ui/splite.tsx:37` passes it via `previewSrc`). The .png and non-preview .webp are never imported. Also 30+ PNG screenshots in repo root (hero-1920.png 422 KB, chatbots-scroll*.png 100–175 KB each, check-*.png, mega-menu-final.png, etc. — ~3–4 MB of stray artifacts in the project root).
**Impact**: Slower git clones + Vercel build uploads. No runtime impact as long as these root-level pngs aren't in `public/`.
**Fix**: Delete `public/images/hero-robot.png`, `public/images/hero-robot.webp`, the empty `public/case-studies/skc/` and `public/screenshots/skills/` dirs, and move root-level screenshots to `test-results/` or `.screenshots/` (gitignored).
**Effort**: S

---

### F-8 | Three Google font families with 4 weights each = 8 font files + 3 preloads — [M] [LCP]
**Evidence**: `src/lib/fonts.ts:3–27` loads DM Sans (400/500/600/700), JetBrains Mono, Space Grotesk (400/500/600/700). Rendered in `<html className=...>` on every page (`layout.tsx:53`) with 3 preload links in HTML head.
**Impact**: 3 additional font preload requests on every page; mono is used only in `--font-mono` token, which Grep suggests is rarely visible (JetBrains Mono is only referenced through the CSS variable, not the class). Each extra font file blocks LCP until it resolves (swap mitigates but render is still deferred briefly on first paint).
**Fix**:
1. Drop Space Grotesk (display) or DM Sans — pick one, use its weights to fulfill both display and body. Inter (currently in CLAUDE.md but not actually used) and DM Sans cover the same ground.
2. Slim DM Sans to 2 weights actually in use (check `font-bold` / `font-semibold` counts; 400+600 is usually enough; drop 500/700 if the headline uses `font-black` = 900 from Space Grotesk).
3. Consider removing JetBrains Mono if mono text is rare — fall back to system mono.
**Effort**: S

---

### F-9 | `schema-dts` is a type-only dep but listed as runtime — [L] [DX]
**Evidence**: `package.json:54` has `schema-dts: ^1.1.5` under **devDependencies** already (good!). `src/components/seo/JsonLd.tsx` only imports `type` from it. No runtime import. No issue — flagging for completeness: `schema-dts` is correctly classified.
**Impact**: None. Skip.
**Effort**: —

---

### F-10 | `motion` is loaded on every page via HeaderClient — [M] [bundle]
**Evidence**: `src/components/layout/HeaderClient.tsx:6` imports `motion, AnimatePresence` from `motion/react`. `HeaderClient` is rendered by `Header` in every layout (`layout.tsx:66`). Motion is also used by `FloatingLocaleSwitcher` (line 7), `ScrollReveal`, `WebVitalsReporter` neighbors, etc.
`optimizePackageImports` is on for `motion`, which tree-shakes, but the core animation engine (~10–15 KB gz) is still shipped for the header dropdown animations alone.

**Impact**: ~10–15 KB gz on every page for a single dropdown + mobile menu.
**Fix**: The Header dropdown can be CSS-only (group-hover + CSS transitions + `<details>`). Remove `motion` from `HeaderClient.tsx` and reserve it for genuinely animated surfaces (ChatWidget panel, BookingModal). Similarly in `FloatingLocaleSwitcher` — swap `AnimatePresence` for a conditional `max-height/opacity` transition.
**Effort**: M

---

### F-11 | `CookieConsentBanner` not dynamically imported — [L] [bundle]
**Evidence**: `src/app/[locale]/layout.tsx:12` statically imports `CookieConsentBanner`. `react-cookie-consent` ships with its own styles and a ~6 KB gz runtime. Banner only shows until accepted (~1 page load per user per year).
**Impact**: Small but constant cost for returning users.
**Fix**: Wrap in `next/dynamic(..., { ssr:false })` inside `ClientIslands` or similar, gated behind a cookie check — if the user has `futuremarketingai-cookie-consent` set already, don't even load the bundle.
**Effort**: S

---

### F-12 | `HeaderClient` registers 3 global listeners on mount — [L] [INP]
**Evidence**: `src/components/layout/HeaderClient.tsx:147–180`:
- `scroll` listener (passive OK, but fires constantly).
- `document.addEventListener('keydown', …)` for Escape.
- `document.addEventListener('click', …)` for outside-click to close dropdown — this fires on **every click anywhere in the document**, even when the menu is closed.
**Impact**: Tiny but avoidable; a click listener is always hot.
**Fix**: Only attach the outside-click listener when `skillsOpen` is true. Merge with keydown into one `useEffect` that conditionally subscribes.
**Effort**: S

---

### F-13 | Static JSON-LD adds 5 inline scripts — [L] [HTML size]
**Evidence**: Home page inlines 5 `<script type="application/ld+json">` (Org, Site, Page, Breadcrumb, FAQ) — visible in `.next/server/app/en.html`. Each is 200–1000 bytes; cumulative ~3 KB of HTML.
**Impact**: Negligible. Ignore.
**Effort**: —

---

### F-14 | HTML page payloads include full RSC message payload — [M] [TTFB / bandwidth]
**Evidence**: Prerendered `/en/pricing.html` = **262 KB**; `/en/skills/lead-qualifier.html` = 200 KB. The payload inlines both the HTML markup *and* the RSC streaming payload (Next.js 16 default). With `compress:true` in `next.config.ts`, gzip brings these to ~40–50 KB over the wire.
**Impact**: For an SSG-heavy site this is expected and mostly fine. But combined with F-3 (full message tree), this is where the bloat originates.
**Fix**: See F-3.
**Effort**: M (same as F-3)

---

## Top 10 quick wins (< 1 day each)

1. **Remove `<link rel="prefetch" href="/spline/scene.splinecode">` and `preconnect` from root layout** — move them inside `src/app/[locale]/page.tsx` (home only). Saves 1.3 MB of waste on every non-home pageview. (F-1)
2. **Delete `hero-robot.png` + unused `hero-robot.webp`** and the 20+ stray root-level PNG screenshots. Tidies repo + Vercel upload. (F-7)
3. **Delete `OrbitVisual.tsx`** — dead code, 111 lines. (F-6)
4. **Install `@vercel/speed-insights`** (or add `/api/vitals/route.ts`) to stop the 404-per-pageload beacon storm. (F-5)
5. **Reduce blob blur from 100 px to 60 px and size from 600 px to 400 px** in `globals.css:275–305`. Add `hidden lg:block` on the `GradientMesh` container (or gate via IntersectionObserver). (F-4)
6. **Drop Space Grotesk OR JetBrains Mono** from `src/lib/fonts.ts`. Save 1–2 font requests + preload entries. (F-8)
7. **Dynamic-import `CookieConsentBanner`** + skip entirely when cookie already set. (F-11)
8. **Fix HeaderClient click listener** to attach only when `skillsOpen === true` (F-12).
9. **Remove `motion` from `HeaderClient` and `FloatingLocaleSwitcher`** — replace AnimatePresence with CSS transitions. Keeps Motion only in truly-animated components (chat, booking, voice-agent FAB). (F-10)
10. **Disable the `StoreProvider` eager rehydrate** — Zustand persist rehydrates on first store access anyway. Chat is lazy-loaded, so no users hit the store unless they open chat. (F-2, partial)

---

## Strategic recommendations

### S-1 | Redesign `ClientIslands` as open-on-demand islands
Today, mounting a `ChatWidget` + `BookingModal` + `CalendlyModal` on every page, even dynamically, ships ~350 KB raw of client JS + ~70 KB gzipped that 95% of visitors never exercise.

Target architecture:
- `layout.tsx` renders only the **triggers** — a ~2 KB `<FloatingChatTrigger>` button, a `<CalendlyTriggerListener>` hook that subscribes to the store, and nothing else.
- The full `ChatWidget`, `CalendlyModal`, `BookingModal` chunks download **only** when the corresponding open-state flips true. This is the "interaction-driven lazy-load" pattern (see `partytown` / `vercel/react-tweet` docs).
- Zustand store stays tiny; remove `persist` from anything not UI-critical (session id, demo mode) — or use `createJSONStorage(() => sessionStorage)` so it doesn't touch localStorage on every navigation.

Savings: estimated 70 KB gz shaved from initial load on every page for non-chat users (~95%+).

### S-2 | Per-segment i18n bundles (+ server-only messages where possible)
next-intl supports passing `messages={pick(allMessages, ['nav', 'home'])}` to the client provider. Most pages of this site are 100% server-rendered (`ScrollReveal` is the only client-side text consumer, and it takes `children` from server). Consider:
- Keep `NextIntlClientProvider` in the root layout with **only** the `common` + `nav` namespaces.
- Inside each page, use `getTranslations` in server components (already the pattern). No client provider needed for those strings.
- For truly interactive sections (ChatWidget context messages, ApplicationForm), provide a scoped `<NextIntlClientProvider messages={pick(…)}>` wrapper.

Savings: 30–40 KB gz per page (most of the 44 KB gz in `f3945bdd3fd3cce2.js`).

### S-3 | Move hero away from Spline on mobile and low-bandwidth
The current mobile fallback (`HeroSpline.tsx:43–78`) is already CSS-only — excellent. But the **lg** breakpoint still pulls the 4 MB Spline+Three bundle even on mid-range laptops and 3G networks. Consider:
- Use `navigator.connection?.effectiveType` (NetworkInformation API) to gate Spline behind `4g` + `!saveData`.
- Fall back to a WebP+SVG hero for anyone else — the current `hero-robot-preview.webp` already serves as a great static fallback.
- Alternatively, export the Spline scene as a looped WebM (~500 KB) and use `<video autoplay muted playsinline>` — gives the "animated robot" feel without Three.js.

### S-4 | Replace `react-cookie-consent` with a bespoke 1-KB banner
`react-cookie-consent` is 6–8 KB gz + inline CSS + an opinionated API. A <50-line component using `localStorage` + Tailwind classes does the same job and avoids a third-party that updates rarely.

### S-5 | Adopt `@vercel/speed-insights` + `@vercel/analytics`
Zero-config, auto-wired on Vercel, replaces the broken custom `/api/vitals` beacon. Gives Core Web Vitals dashboards out of the box. ~2 KB gz added; much less than the cost of debugging the 404s today.

### S-6 | Turn on Partial Prerendering (PPR) for interactive routes
Next.js 16 supports PPR (see `vercel:next-cache-components` skill). Pages like `/apply` and `/contact` have a mostly-static shell + small interactive form. PPR would stream the static part first (better LCP) and hydrate the form island independently.

### S-7 | Enable Turbopack's webpack-incompatibility alert for bundle analyzer
`@next/bundle-analyzer` is wired in `next.config.ts:8` but running `ANALYZE=true npm run build` with Turbopack silently ignores it — no `.next/analyze/*.html` produced. For one-off analysis, run the build with `NEXT_TURBOPACK=0 ANALYZE=true npm run build` (Webpack mode) to get the treemap. Useful for verifying the Spline/Three split and confirming chat-chunk composition.

---

## Appendix A — Raw build output

```
> fmai-nextjs@0.1.0 build
> next build

▲ Next.js 16.1.7 (Turbopack)
- Environments: .env.local
- Experiments (use with caution):
  · optimizePackageImports

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
  Creating an optimized production build ...
✓ Compiled successfully in 12.1s
  Running TypeScript ...
  Collecting page data using 15 workers ...
  Generating static pages using 15 workers (0/87) ...
  Generating static pages using 15 workers (87/87) in 2.6s
  Finalizing page optimization ...

Route (app)                                  Revalidate  Expire
┌ ○ /_not-found
├ ● /[locale]                               (3 locales SSG)
├ ● /[locale]/about                         (3 locales SSG)
├ ● /[locale]/apply                         (3 locales SSG)
├ ƒ /[locale]/blog                          (dynamic)
├ ● /[locale]/blog/[slug]                            1h      1y  (only /en/blog/ai-marketing-automation-guide exists)
├ ● /[locale]/case-studies/skinclarity-club (3 locales SSG)
├ ● /[locale]/contact                       (3 locales SSG)
├ ● /[locale]/founding-member               (3 locales SSG)
├ ● /[locale]/how-it-works                  (3 locales SSG)
├ ● /[locale]/legal                         (3 locales SSG)
├ ● /[locale]/legal/cookies                 (3 locales SSG)
├ ● /[locale]/legal/privacy                 (3 locales SSG)
├ ● /[locale]/legal/terms                   (3 locales SSG)
├ ● /[locale]/memory                        (3 locales SSG)
├ ƒ /[locale]/opengraph-image               (dynamic)
├ ● /[locale]/pricing                       (3 locales SSG)
├ ● /[locale]/skills/* × 12 skills          (3 locales each SSG)
├ ƒ /api/apply                              (dynamic)
├ ƒ /api/chatbot                            (dynamic)
├ ƒ /api/contact                            (dynamic)
├ ○ /robots.txt
└ ○ /sitemap.xml
```

> Note: Next.js 16 + Turbopack does not emit per-route First-Load JS sizes in build output (Webpack-only today). Figures above derived manually from `.next/static/chunks/` + `.next/build-manifest.json` + prerendered HTML.

---

## Appendix B — Heavy dependencies (from `package.json`)

| Package | Version | Weight | Notes |
|---|---|---:|---|
| `@splinetool/react-spline` + `@splinetool/runtime` | 4.1.0 / 1.12.70 | ~4 MB raw | 3D runtime + WASM. Lazy-loaded. |
| `motion` | 12.38.0 | ~100 KB raw / ~30 KB gz (tree-shaken) | In Header, ScrollReveal, ChatWidget, etc. |
| `@ai-sdk/anthropic` + `@ai-sdk/react` + `ai` | 3.0.58 / 3.0.118 / 6.0.116 | ~150 KB raw | In chat widget only (lazy) |
| `react-markdown` | 10.1.0 | ~50 KB raw / ~15 KB gz | In ChatMessages only |
| `react-calendly` | 4.4.0 | ~10 KB raw | Dynamic, opens Calendly iframe |
| `react-cookie-consent` | 10.0.1 | ~8 KB gz | Static in root layout (see F-11) |
| `zustand` | 5.0.12 | ~3 KB gz | With persist middleware |
| `schema-dts` | 1.1.5 | 0 KB runtime | Types only. ✓ correctly in devDeps. |
| `web-vitals` | 5.1.0 | ~2 KB gz | Beacon endpoint missing (F-5) |
| `next-intl` | 4.8.3 | ~15 KB gz client | See F-3 for bloat from messages |
| `lucide-react` | 0.577.0 | Tree-shaken per icon | `optimizePackageImports` enabled ✓ |
| `@google/stitch-sdk` | 0.0.3 | — | Grep shows no imports. **Candidate for removal.** |
| `@mdx-js/loader`, `@mdx-js/react`, `@next/mdx` | 3.1.1 / 16.1.7 | — | Used by blog posts only. ✓ |

---

## Appendix C — Observed file-level evidence index

| Finding | File | Line(s) |
|---|---|---|
| F-1 Spline prefetch in root | `src/app/[locale]/layout.tsx` | 55–60 |
| F-2 ClientIslands always mount | `src/app/[locale]/layout.tsx` | 71 |
| F-2 Island bundle | `src/components/providers/ClientIslands.tsx` | 16–28 |
| F-2 Eager rehydrate | `src/components/providers/StoreProvider.tsx` | 14–18 |
| F-3 Full message import | `src/i18n/request.ts` | 11 |
| F-3 Client provider pass-through | `src/app/[locale]/layout.tsx` | 63 |
| F-4 Gradient mesh | `src/components/hero/GradientMesh.tsx` | 6–14 |
| F-4 Blob CSS | `src/app/globals.css` | 275–322 |
| F-5 Missing endpoint | `src/lib/web-vitals.ts` | 41 |
| F-6 Dead OrbitVisual | `src/components/hero/OrbitVisual.tsx` | 1–111 |
| F-8 Three font families | `src/lib/fonts.ts` | 3–27 |
| F-10 Motion in header | `src/components/layout/HeaderClient.tsx` | 6 |
| F-11 Cookie banner static | `src/app/[locale]/layout.tsx` | 12, 70 |
| F-12 Global click listener | `src/components/layout/HeaderClient.tsx` | 174–180 |
| Spline strategy (good) | `src/components/ui/splite.tsx` | 1–105 |
| Lazy sections on home | `src/app/[locale]/page.tsx` | 147, 170, 246, 281, 320, 327, 352, 376 |
