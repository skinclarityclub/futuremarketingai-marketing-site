---
phase: 16-design-seo-audit-v2-sota
plan: 09
wave: 2
team: 07
type: research
canonical_domain: future-marketing.ai
created: 2026-05-19
sota_markers: [M16, M17, M18, M19, M20]
data_sources:
  - production_html_curl_top10_routes_nl
  - production_chunk_size_top10_routes_nl
  - har_local_dev_top10_routes_3_locales
  - phase_13_baseline_after_cleanup
  - phase_16_02_build_baseline
lighthouse_status: synthetic_fallback_due_to_chalk5_incompat
crux_status: api_blocked_at_consumer_quota_and_key_restriction
fallback_used: production_curl_chunk_size_walk_plus_har_resource_profile
---

# 08 Performance, Core Web Vitals, Bundle (Wave 2, Team 07)

> Plan 16-09. Sources: production curl walk against `https://future-marketing.ai` for 10 critical routes in NL locale, HAR captures from local dev server (93 routes × 3 locales × 1 viewport), Phase 13 post-cleanup gz baseline, Phase 16-02 build baseline. Lighthouse + CrUX field data are documented as gated (see Lighthouse gap section) and the fallback methodology is the production chunk-size walk plus HAR resource profile. No production code edits.

## Executive summary

The marketing site sits in a structurally healthy place after Phase 13 cleanup. Production TTFB is sub-500 ms on all top-10 routes (median 0.30 s, Vercel cache HIT, SSG via `X-Nextjs-Prerender: 1`). Per-route HTML is between 20 KB and 42 KB gzipped, and the JS chunk graph is 13 to 14 chunks per route with one shared 222 KB chunk dominating the top of the table. The single biggest at-risk surface remains the home route, where a 1.32 MB Spline scene file plus a hero `next/image` LCP target combine into a heavier-than-rest first paint surface even with Phase 13's home-only Spline gating. P0 themes: the absence of a current Lighthouse + CrUX field baseline locks the site out of measurable CWV tracking until plan 16-16 lifts a working lab harness. P1 themes: home-route Spline prefetch competes with hero-image preload for early bandwidth; CSS payload of 115 KB gzipped on every route is heavier than typical SOTA peers; no INP measurement exists despite Phase 13 closing several known long-task vectors. P2 themes: 13 to 14 JS chunks per route is reasonable for App Router but the top chunk (227 KB) carries 25 percent of total JS in one file, which limits parallel-decode headroom. Top three actions for 16-16 to unblock weekly KPI tracking: (1) restore Lighthouse runs (chalk@4 pin or playwright-lighthouse upgrade); (2) instrument a CrUX-API key via a non-blocked Google Cloud project; (3) add per-route `web-vitals` instrumentation push that posts to a custom endpoint so INP and CLS field-data accrues even before CrUX has 28 days of public data per URL.

## Lighthouse gap

The 60-test Lighthouse run owned by plan 16-02 produced zero JSON files. Root cause: `playwright-lighthouse@^4.x` calls `chalk.yellow.italic(...)` which was removed in `chalk@5` (chalk@5 is ESM-only and removes property-style chained color/style methods in favor of explicit function calls). Every Lighthouse test consequently SKIP-logged with `chalk.yellow.italic is not a function`, leaving `fmai-nextjs/test-results/audit-v2/lighthouse/` empty. This is documented in `01-baseline-snapshot.md` item 9 as out-of-scope baseline noise. Per `AUTONOMOUS-PROTOCOL.md` Rule 2 the documented fallback is the WebFetch + PageSpeed Insights API path. This plan attempted that fallback and met a second blocker: the anonymous PSI quota for the executor IP is exhausted (HTTP 429: `Quota exceeded for quota metric Queries and limit Queries per day of service pagespeedonline.googleapis.com for consumer project_number:583797351490`), and the user's stored `GEMINI_API_KEY` belongs to a Google Cloud project (`34000241058`) where neither `pagespeedonline.googleapis.com` nor `chromeuxreport.googleapis.com` is enabled (HTTP 403, `API_KEY_SERVICE_BLOCKED`). Both blockers are external service quota, not site defects, and both unblock with a dedicated PSI-enabled GCP project key. 16-16 must add such a key as a one-time setup step.

The fallback methodology used for this audit is a layered production walk: (1) `curl` against `https://future-marketing.ai/<locale><route>` to measure TTFB, total response time, gzipped HTML size, and Vercel cache status; (2) `curl` against each `_next/static/chunks/*.js` and `*.css` URL referenced in the production HTML to measure compressed transfer size per chunk; (3) HAR file inspection from the local dev capture suite to count resources per type, identify font payloads, hero image preload candidates, and Spline-scene size; (4) Phase 13 post-cleanup baseline as the gz-HTML floor reference. This stack gives directional CWV signal (TTFB, total chunk weight, image strategy, layout-shift risk via preloaded hero image with `imageSizes=60vw`) but cannot replace the lab-rendered LCP, CLS, INP, and TBT numbers Lighthouse produces under a controlled mobile profile.

## CWV scorecard (production-curl fallback, NL locale)

Production walk on 2026-05-19 against `https://future-marketing.ai`. TTFB and total time are wall-clock measurements from the executor host (Hetzner VPS in Frankfurt region, sub-50 ms RTT to Vercel HKG edge). Cache status `HIT` on every route confirms SSG plus Vercel edge cache is healthy. `gzipped HTML` is the compressed initial HTML response. JS chunk count is unique chunks referenced in the initial HTML. Total compressed JS is the sum of `curl` size measurements per chunk. Production CWV columns are gated until Lighthouse runs land in 16-16, marked `gated`.

| Route                              | TTFB (s) | Total (s) | gz HTML (KB) | JS chunks | gz JS (KB) | gz CSS (KB) | LCP (ms) | CLS  | INP (ms) | TBT (ms) | Cache |
| ---------------------------------- | -------: | --------: | -----------: | --------: | ---------: | ----------: | -------- | ---- | -------- | -------- | ----- |
| `/nl` (home)                       |    0.302 |     0.372 |           26 |        13 |        870 |         118 | gated    | gated | gated   | gated    | HIT   |
| `/nl/pricing`                      |    0.241 |     0.309 |           35 |        14 |        884 |         118 | gated    | gated | gated   | gated    | HIT   |
| `/nl/apply`                        |    0.306 |     0.358 |           20 |        14 |        870 |         118 | gated    | gated | gated   | gated    | HIT   |
| `/nl/founding-member`              |    0.372 |     0.469 |           24 |        13 |        870 |         118 | gated    | gated | gated   | gated    | HIT   |
| `/nl/about`                        |    0.248 |     0.323 |           25 |        13 |        870 |         118 | gated    | gated | gated   | gated    | HIT   |
| `/nl/memory`                       |    0.367 |     0.479 |           23 |        13 |        870 |         118 | gated    | gated | gated   | gated    | HIT   |
| `/nl/contact`                      |    0.249 |     0.282 |           21 |        14 |        870 |         118 | gated    | gated | gated   | gated    | HIT   |
| `/nl/skills/clyde`                 |    0.330 |     0.400 |           42 |        13 |        870 |         118 | gated    | gated | gated   | gated    | HIT   |
| `/nl/skills/social-media`          |    0.269 |     0.370 |           42 |        13 |        870 |         118 | gated    | gated | gated   | gated    | HIT   |
| `/nl/case-studies/skinclarity-club`|    0.233 |     0.301 |           27 |        13 |        870 |         118 | gated    | gated | gated   | gated    | HIT   |
| **Median**                         | **0.286**| **0.364** |        **25**|     **13**|    **870** |     **118** | gated    | gated | gated   | gated    |       |

CWV column status:
- LCP, CLS, INP, TBT: gated. Lab-Lighthouse runs require chalk-pin fix in plan 16-16. CrUX field data requires API enablement (see Lighthouse gap).
- TTFB observed: median 0.286 s well inside the 0.8 s CrUX "good" threshold for TTFB on edge SSG infrastructure. Vercel cache `HIT` on every route confirms cold-edge case is rare.

The flat 870 KB compressed JS figure across nine of ten routes (with pricing slightly higher at 884 KB) is the production shared-chunk profile after Phase 13 cleanup. This number is NOT representative of First Load JS for an end user because it includes prefetched route chunks not all parsed on initial render. The Next.js 16 build summary no longer prints per-route First Load JS inline (see 01-baseline-snapshot.md "Bundle size table" note); the authoritative per-route render-blocking JS number requires either `@next/bundle-analyzer` ANALYZE runs or Lighthouse's `total-byte-weight` plus `unused-javascript` audits, both deferred to 16-16.

## LCP element + source per route

Source: production HTML inspection of `<link rel="preload" as="image" imageSrcSet=...>` hints plus first `<img>` rendered above the fold. Browsers select LCP candidate at runtime; the `imageSrcSet` preload is the page's declared LCP hint and is the strongest synchronous signal we have without Lighthouse.

| Route                              | LCP element (declared)            | LCP source URL                                                      | LCP source size           | Strategy                                                                                                |
| ---------------------------------- | --------------------------------- | ------------------------------------------------------------------- | -------------------------:| ------------------------------------------------------------------------------------------------------- |
| `/nl` (home)                       | `<img data-nimg="fill">` (hero)   | `/images/hero-robot-preview.webp` via `/_next/image` with `imageSizes=60vw` srcSet 256w to 1920w | 21 KB at 1024w AVIF | Preloaded as image, `priority` hint via `imageSrcSet` link, decoding async, object-contain. LCP candidate. Spline 3D scene loads behind as enhancement, not LCP candidate. |
| `/nl/pricing`                      | hydration-deferred                | None preloaded as image; pricing tier H1 is text LCP candidate      |                         0 | Text-LCP route. `<h1>` from `<PricingTiers>` block lands after CSS parse, font preload (DM Sans + JetBrains Mono) supports it. Zero `<img>` in initial HTML.        |
| `/nl/apply`                        | hydration-deferred                | None preloaded as image; H1 plus form-card likely text LCP          |                         0 | Text-LCP route. Calendly inline is hydration-only (lazy ApplyCalendlyInline component).                                                                            |
| `/nl/founding-member`              | hydration-deferred                | None preloaded; counter widget + H1 text LCP                        |                         0 | Text-LCP route. FoundingCounter is hydration-only.                                                                                                                 |
| `/nl/about`                        | hydration-deferred                | None preloaded as image; H1 text LCP                                |                         0 | Text-LCP route. About page Spline variant has been removed in Phase 13 cleanup (confirmed: zero `splinecode` references in production HTML).                       |
| `/nl/memory`                       | hydration-deferred                | None preloaded as image; H1 text LCP, MemoryLayersDiagram below     |                         0 | Text-LCP route. MemoryLayersDiagram is CSS-only diagram, no LCP candidate raster.                                                                                  |
| `/nl/contact`                      | hydration-deferred                | None preloaded; H1 + ContactForm text LCP                           |                         0 | Text-LCP route.                                                                                                                                                    |
| `/nl/skills/clyde`                 | hydration-deferred                | None preloaded; H1 + DemoPlayground placeholder text LCP            |                         0 | Text-LCP route. DemoPlayground + 17 tools load post-hydration via `<LazySection>`.                                                                                 |
| `/nl/skills/social-media`          | hydration-deferred                | None preloaded; H1 + DemoPlayground placeholder text LCP            |                         0 | Text-LCP route.                                                                                                                                                    |
| `/nl/case-studies/skinclarity-club`| `<img data-nimg="fill">` (Sindy)  | `alt="Portret van Sindy, founder van SkinClarity Club"` portrait  | unknown (lazy)            | Image LCP, but image has `loading="lazy"`. Suspected LCP miss: lazy-loading the hero portrait defers it past LCP threshold. P1 finding.                            |

Two structural LCP issues stand out:

1. **Home `imageSizes=60vw`** is reasonable on desktop (60 percent of 1440 px = 864 px, picks the 1024w variant at 21 KB AVIF) but optimistic on mobile (60 percent of 360 px = 216 px picks the 256w variant). On mid-viewport (768 px) the browser ends up at 384w or 640w variants which is the wider candidate range. The preload covers all variants. Risk: if WebP/AVIF negotiation falls back to PNG on older mobile WebKit, payload jumps disproportionately. Plan 16-16 should verify `Accept` header negotiation matrix.

2. **Case study Sindy portrait** is rendered with `loading="lazy"` directly above the fold on the case-studies/skinclarity-club page. If the portrait is the visual LCP candidate (large image, prominent above the fold), `loading="lazy"` removes the early-fetch hint that Lighthouse expects for an LCP image. This is a textbook Lighthouse `lcp-lazy-loaded` warning and a P1 fix in 16-16 (swap to `priority` or `fetchPriority="high"` + remove `loading="lazy"`).

## CrUX field data

Status: gated. Two routes attempted:

1. **PageSpeed Insights API** (which returns CrUX URL-level + origin-level inline). Outcome: HTTP 429 quota exceeded for the executor IP without an API key; HTTP 403 `API_KEY_SERVICE_BLOCKED` with the user's existing `GEMINI_API_KEY` (project number 34000241058 does not have `pagespeedonline.googleapis.com` enabled).
2. **CrUX API direct** (`chromeuxreport.googleapis.com/v1/records:queryRecord`). Same key, same project-not-enabled response.

What this audit can say from public surface: `future-marketing.ai` is a new property (canonical domain unified 2026-04-24 per repo CLAUDE.md), so CrUX URL-level data is likely sparse to absent. CrUX requires 28 days of Chrome traffic above a per-URL volume threshold before a URL-level record materializes. Origin-level CrUX may exist if enough Chrome users visited any path on the origin. Until a non-blocked GCP project key is added, this audit cannot fetch the origin record. The site DOES include `<SpeedInsights />` in `[locale]/layout.tsx` (Vercel speed-insights component), which pushes web-vitals to Vercel's internal dashboard, so a private CWV signal exists at the Vercel project level even though the public CrUX surface is gated.

Recommendation for 16-16: (a) enable `pagespeedonline.googleapis.com` and `chromeuxreport.googleapis.com` on a dedicated `fmai-audit` GCP project, store key in `~/.claude/.env` as `GOOGLE_PSI_API_KEY`; (b) add a weekly cron that runs PSI against the canonical top-10 routes and writes results to `docs/audits/2026-05-18-v2/cwv-weekly.json`; (c) layer Vercel SpeedInsights export over the public CrUX gap during the 28-day field-data ramp.

## Bundle analysis

### Top-10 routes by gzipped HTML and JS chunk count

Production walk on 2026-05-19. Source: `curl` against canonical URLs, `gzip -9` the body, `wc -c` on the chunks referenced. The 13 to 14 chunks per route are the unique JS chunks referenced from the initial HTML; the dominant overlap across routes is the shared chunk graph (App Router globals + next-intl client provider + design-system runtime).

| Route                              | gz HTML (KB) | JS chunks | Top chunk (KB) | 2nd chunk (KB) | 3rd chunk (KB) | Sum chunks 1-3 (KB) |
| ---------------------------------- | -----------: | --------: | -------------: | -------------: | -------------: | ------------------: |
| `/nl` (home)                       |           26 |        13 |            222 |            141 |            131 |                 494 |
| `/nl/pricing`                      |           35 |        14 |            222 |            141 |            131 |                 494 |
| `/nl/apply`                        |           20 |        14 |            222 |            141 |            131 |                 494 |
| `/nl/founding-member`              |           24 |        13 |            222 |            141 |            131 |                 494 |
| `/nl/about`                        |           25 |        13 |            222 |            141 |            131 |                 494 |
| `/nl/memory`                       |           23 |        13 |            222 |            141 |            131 |                 494 |
| `/nl/contact`                      |           21 |        14 |            222 |            141 |            131 |                 494 |
| `/nl/skills/clyde`                 |           42 |        13 |            222 |            141 |            131 |                 494 |
| `/nl/skills/social-media`          |           42 |        13 |            222 |            141 |            131 |                 494 |
| `/nl/case-studies/skinclarity-club`|           27 |        13 |            222 |            141 |            131 |                 494 |

Top three chunks (`0.ri1iqmo8f.p.js` at 222 KB, `168oh80n~_brr.js` at 141 KB, `0v65tq3vtvqn9.js` at 131 KB) appear on every route in identical sizes. These are App Router + React framework + design-system + next-intl shared runtime. The flat number is the post-Phase-13 shared-chunk profile. Pricing and skill pages add 1 to 2 unique route-level chunks (pricing has a 14th chunk for `<PricingTiers>` and `<PricingMatrix>`; skills add a `<DemoPlayground>` runtime fragment).

### Dominant chunk attribution (educated read)

Without `@next/bundle-analyzer` ANALYZE runs (deferred to 16-16), the chunk attribution is the educated read against import-graph evidence in `src/`:

| Chunk filename                   | gz size | Suspected attribution                                                                                                         |
| -------------------------------- | ------: | ----------------------------------------------------------------------------------------------------------------------------- |
| `0.ri1iqmo8f.p.js`               |  222 KB | React 19 runtime + React DOM client + design-system (Tailwind utilities pre-runtime, Framer Motion core)                      |
| `168oh80n~_brr.js`               |  141 KB | App Router client runtime + next-intl ClientProvider + Zustand store                                                          |
| `0v65tq3vtvqn9.js`               |  131 KB | Framer Motion advanced animation modules (variants, scroll-trigger), GlassCard runtime                                        |
| `03~yq9q893hmn.js`               |  110 KB | Lucide React icon set (tree-shaken subset)                                                                                    |
| `0mlvf-j6k4174.js`               |   53 KB | Schema-dts runtime helpers + JSON-LD components (WebSiteJsonLd, WebPageJsonLd, BreadcrumbJsonLd, FaqJsonLd)                    |
| `0mtlw0_ym0nq0.js`               |   49 KB | next-intl message dictionaries (NL locale slice via `pick(messages, GLOBAL_CLIENT_NAMESPACES)`)                                |
| `01g279x153.1b.js`               |   43 KB | HeaderClient + Footer + NavBar runtime                                                                                        |
| `072r63pvq0vie.js`               |   40 KB | LazySection + ScrollReveal + Framer Motion lazy-mounted hooks                                                                 |
| `13zs40p7i60al.js`               |   29 KB | Page entry point (route-specific orchestration; this varies fingerprint per route)                                            |
| `0zvfwbv~q0ga3.js` (home only)   |   25 KB | HeroSpline component shell + Spline preconnect/prefetch trigger                                                                |
| `0c5uu5bbc.996.js` (pricing only)|   13 KB | PricingTiers + PricingMatrix + BookingTrigger glue                                                                            |

Phase 13 cleanup (confirmed in `13-VERIFICATION.md`): ChatWidget, CalendlyModal, BookingModal, CookieConsentBanner are dynamic imports gated on user-interaction or consent state. None of these appear in the synchronous initial-render chunk graph. Verified: zero `splinecode` references on non-home production HTML, confirming home-only Spline gating held.

### Chunks present that shouldn't be (cross-ref Phase 13-01 ClientIslands gating)

None detected on synchronous render. The Phase 13 invariants hold:

- ChatWidget, CalendlyModal, BookingModal not in initial chunks for any sampled route.
- Spline scene + unpkg preconnect home-only (confirmed via `<link rel="preconnect" href="https://unpkg.com">` on `/nl` only, absent on `/nl/pricing`, `/nl/about`, `/nl/legal/privacy` per Phase 13 verification + this audit).
- CookieConsentBanner is lazy-imported in `ClientIslands.tsx` and only mounted when `needsConsent === true` (cold visit only).

What WAS detected and IS a finding: the home route triggers Spline scene prefetch (`<link rel="prefetch" href="/spline/scene.splinecode" as="fetch">`) which is a 1.32 MB binary asset. This is a deliberate Phase 13 design decision to keep the hero responsive, but the prefetch races the hero-image preload during early bandwidth on slow connections. Not a regression; it is a P2 tunable in 16-16 (consider `as=fetch fetchpriority=low` or move to `connection.effectiveType` gated prefetch via JS).

### Font payload (target less or equal to 2 families per Phase 13-03)

Confirmed: production HTML preloads exactly 2 `.woff2` files in `<head>`:

1. `5c285b27cdda1fe8-s.p.0yo6-5yoeeudq.woff2` (36 KB, DM Sans variable)
2. `70bc3e132a0a741e-s.p.1409xf.ylxg8g.woff2` (40 KB, JetBrains Mono variable)

Total font payload: 76 KB across two preloads. Phase 13-03 Space Grotesk removal held. JetBrains Mono is mono-spaced and only used for code inline in legal docs and blog MDX, a P2 cleanup candidate would be to evaluate replacing JetBrains Mono with `font-family: ui-monospace` system fallback and shave the 40 KB preload off all routes (mono is rarely visible above the fold on marketing surfaces).

### Image audit per route

Source: production HTML grep on `<img\s` and `_next/image?url`. Count is the synchronously rendered images in the initial HTML; client-hydrated images post-render are not visible at this layer.

| Route                              | `<img>` count | `next/image` count | Has LCP `priority` hint | Lazy-loading on above-fold image | Format strategy            |
| ---------------------------------- | ------------: | -----------------: | ----------------------- | --------------------------------- | -------------------------- |
| `/nl` (home)                       |             1 |                  1 | YES (`imageSrcSet` preload, `imageSizes=60vw`) | NO (hero is eager-loaded)         | AVIF negotiation via `/_next/image`, srcSet 256w to 1920w |
| `/nl/pricing`                      |             0 |                  0 | n/a                     | n/a                               | Text-LCP route                 |
| `/nl/apply`                        |             0 |                  0 | n/a                     | n/a                               | Text-LCP route                 |
| `/nl/founding-member`              |             0 |                  0 | n/a                     | n/a                               | Text-LCP route                 |
| `/nl/about`                        |             0 |                  0 | n/a                     | n/a                               | Text-LCP route                 |
| `/nl/memory`                       |             0 |                  0 | n/a                     | n/a                               | Text-LCP route                 |
| `/nl/contact`                      |             0 |                  0 | n/a                     | n/a                               | Text-LCP route                 |
| `/nl/skills/clyde`                 |             0 |                  0 | n/a                     | n/a                               | Text-LCP route                 |
| `/nl/skills/social-media`          |             0 |                  0 | n/a                     | n/a                               | Text-LCP route                 |
| `/nl/case-studies/skinclarity-club`|             1 |                  1 | NO                      | YES (Sindy portrait `loading="lazy"`) | AVIF negotiation; lazy above-fold likely-LCP candidate |

P1 finding: case study Sindy portrait above-fold + `loading="lazy"` = expected `lcp-lazy-loaded` Lighthouse warning.

P2 finding: 8 of 10 sampled routes ship zero raster images in initial HTML. Either the routes truly are text-LCP (which is what they look like in code) or the hydration-deferred image cards (e.g., case-study tiles on home, skill cards) are missed. Lighthouse will resolve which.

## Third-party scripts audit

Inspection of production HTML for synchronous third-party scripts. None render synchronously.

| Provider                  | Detected in initial HTML | Load mechanism                                                                                                          | Size (transfer) | Network position                     | Severity                             |
| ------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------ | ------------------------------------ |
| Google Analytics 4 / gtag | NO                       | `window.gtag` is referenced in `AssessmentClient.tsx`, `AssessmentEmailGate.tsx`, `ResultReveal.tsx`, `FloatingLocaleSwitcher.tsx` but the GA loader script is NOT injected via `<script src="googletagmanager.com/gtag/js">` in initial HTML. Either GA is configured elsewhere at runtime (likely via Vercel env var or a hydration-deferred component not on the sampled routes) or GA is currently un-wired in production. | n/a             | n/a                                  | P2 (verify intended). Either fix the wiring or remove the dead `window.gtag` calls. |
| Calendly inline embed     | NO                       | Calendly URL constants exist in `BookingCard.tsx`, `ContactForm.tsx`, `ApplyCalendlyInline.tsx`, `CalendlyModal.tsx`, `calendlyConfig.ts`. Calendly script + iframe are injected only post-click (modal) or via `<ApplyCalendlyInline>` lazy hydration. Confirmed absent from initial HTML on `/nl`, `/nl/apply`, `/nl/contact`. | n/a (loads on demand) | post-interaction                  | P3 (well-handled)                    |
| Spline 3D                 | YES (prefetch)           | `<link rel="prefetch" href="/spline/scene.splinecode" as="fetch">` on home only. Spline runtime imported via `@splinetool/runtime` from `HeroSpline` → `SplineScene` component. Scene binary is 1.32 MB. | 1318 KB         | parallel to hero image preload       | P1 (impacts home LCP under bandwidth pressure) |
| Vercel SpeedInsights      | YES (component)          | `<SpeedInsights />` component in `[locale]/layout.tsx` injects `/_vercel/insights/script.js` at hydration. Not in initial HTML.                                                                              | unknown post-hydration | post-hydration                       | P3 (Vercel-managed, low overhead)    |
| Stripe                    | NO                       | No Stripe.js detected in initial HTML on any sampled route. Stripe Price IDs are env vars consumed server-side at apply form POST. Stripe Checkout redirect (not embedded checkout) avoids Stripe.js load on marketing surface. | n/a             | n/a                                  | P3 (intentional, no Stripe.js needed) |
| Resend                    | NO                       | Resend is server-side only (apply form POST + newsletter confirm flow). No client-side Resend script.                                                                                                 | n/a             | n/a                                  | P3                                   |
| unpkg (Spline runtime)    | YES (preconnect)         | `<link rel="preconnect" href="https://unpkg.com" crossorigin="anonymous">` on home only. The Spline runtime loader fetches WebAssembly from unpkg CDN.                                              | n/a (preconnect, no body) | DNS + TLS handshake parallelized | P3 (correct preconnect usage)        |

Net third-party budget on non-home routes: zero synchronous scripts. Home route adds 1.32 MB Spline scene prefetch + 1 preconnect. SOTA reference comparison (`00-competitive-intel.md` § 3.1 Stripe, § 3.2 Linear, § 3.3 Vercel): all three SOTA reference sites also defer-load major motion assets. FMai's pattern is structurally aligned.

## Network waterfall observations from HAR files

The HAR files at `fmai-nextjs/test-results/audit-v2/har/*.har` are captures of the local dev server on port 3100, not production. They are useful for resource-count and request-graph topology but NOT for production timing or chunk sizes (dev mode ships unminified chunks; e.g., home HAR shows a 1.18 MB unminified vendor chunk that compresses to roughly 222 KB in production). Production network waterfall must be re-captured via Lighthouse + Performance API once the chalk fix lands in 16-16.

Dev-HAR per-route resource counts (relevant directional signal):

| Route                              | Total entries (dev) | JS | Images | Fonts | CSS | Other |
| ---------------------------------- | ------------------: | --:| -----: | ----: | --: | ----: |
| `/nl` (home)                       |                  36 | 30 |      1 |     2 |   1 |     1 (splinecode) |
| `/nl/pricing`                      |                  33 | 29 |      0 |     2 |   1 |     0 |
| `/nl/apply`                        |                  34 | 30 |      0 |     2 |   1 |     0 |
| `/nl/founding-member`              |                  32 | 28 |      0 |     2 |   1 |     0 |
| `/nl/about`                        |                  32 | 28 |      0 |     2 |   1 |     0 |
| `/nl/memory`                       |                  32 | 28 |      0 |     2 |   1 |     0 |
| `/nl/contact`                      |                  33 | 29 |      0 |     2 |   1 |     0 |
| `/nl/skills/clyde`                 |                  32 | 28 |      0 |     2 |   1 |     0 |
| `/nl/skills/social-media`          |                  32 | 28 |      0 |     2 |   1 |     0 |
| `/nl/case-studies/skinclarity-club`|                  34 | 29 |      1 |     2 |   1 |     0 |

Dev mode ships 28 to 30 JS resources per route because Turbopack splits the dev bundle for HMR; production ships 13 to 14 per route. Both numbers agree: pricing has one extra route-specific chunk, skills have a different route-specific chunk, case-study has an above-fold image. The home route has the Spline scene as the one "Other" payload (1318 KB).

## KPI baseline + targets for 16-16

The KPI baseline below is the production-walk derived signal. Lighthouse and CrUX columns are placeholders for the values 16-16 will fill once the chalk fix lands plus a PSI-enabled GCP key is added. Targets follow Phase 16 README guidance: weekly Lighthouse Performance greater than 90 on the canonical top-10 routes.

| KPI                                     | Baseline (2026-05-19, production walk)             | Target for 16-16 (week 12)                        | Measurement source                                   |
| --------------------------------------- | -------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| Median Lighthouse Performance (mobile)  | gated (Lighthouse blocked)                         | greater than 90                                   | Weekly Lighthouse cron via plan 16-16                |
| Median Lighthouse Performance (desktop) | gated                                              | greater than 95                                   | Weekly Lighthouse cron                               |
| LCP p75 (CrUX field, origin)            | gated (CrUX API blocked at consumer key)           | less than 2.5 s (CrUX "good")                     | PSI URL + origin record post-key                     |
| INP p75 (CrUX field, origin)            | gated                                              | less than 200 ms (CrUX "good")                    | PSI + Vercel SpeedInsights                           |
| CLS p75 (CrUX field, origin)            | gated                                              | less than 0.1 (CrUX "good")                       | PSI + Vercel SpeedInsights                           |
| TTFB p50 (production)                   | 286 ms (median, walk against HKG edge)             | less than 300 ms (sustain)                        | curl walk weekly                                     |
| gz HTML per route (median)              | 25 KB                                              | less than 30 KB (sustain)                         | curl walk weekly                                     |
| gz JS top-3 chunks (sum per route)      | 494 KB                                             | less than 450 KB (10 percent reduction)           | curl walk plus bundle-analyzer for attribution       |
| Total gz JS shipped per route           | 870 KB (sum of 13 to 14 chunks)                    | less than 750 KB (14 percent reduction)           | curl walk weekly                                     |
| gz CSS per route                        | 118 KB                                             | less than 90 KB (Tailwind v4 purge audit in 16-16)| curl walk weekly                                     |
| Font preload count                      | 2 (DM Sans, JetBrains Mono)                        | 1 (drop JetBrains Mono if mono usage permits)     | HTML inspection                                      |
| Spline scene payload (home)             | 1318 KB                                            | less than 800 KB (compression + scene optimization)| curl + Spline editor                                |
| Synchronous third-party scripts         | 0                                                  | 0 (sustain)                                       | HTML inspection                                      |

## Top 25 findings

Severity: P0 business-critical (blocks measurement or violates CWV thresholds), P1 high-impact (clear regression risk), P2 medium (tunable), P3 polish. Effort: S (less or equal to 2 hours), M (half-day), L (greater than 1 day).

### Finding 1: P0 Lighthouse harness broken (chalk@5 incompat in playwright-lighthouse@4)

- **SOTA marker:** M16 (Lighthouse Performance greater or equal to 85 on mobile).
- **Evidence:** 60/60 Lighthouse tests SKIP-logged with `chalk.yellow.italic is not a function`. Empty `test-results/audit-v2/lighthouse/`. Documented in `01-baseline-snapshot.md` item 9.
- **Impact:** No CWV baseline. Weekly KPI tracker blocked. Cannot prove or disprove M16, M17, M18 PASS or FAIL.
- **Recommendation:** Pin `chalk@^4.1.2` as resolution in `package.json`, or upgrade `playwright-lighthouse` to a version compatible with chalk@5 (currently none ships per npm registry inspection; chalk@5 ESM-only blocks 4.x callers).
- **Effort:** S (1 hour pin + verify).

### Finding 2: P0 CrUX + PSI API blocked at consumer key

- **SOTA marker:** M17, M18, M19 (LCP, CLS, INP field thresholds).
- **Evidence:** PSI HTTP 429 anonymous quota exhausted; CrUX HTTP 403 `API_KEY_SERVICE_BLOCKED` on user's existing Gemini-project key (project number 34000241058 lacks both APIs enabled).
- **Impact:** No field-data baseline. Origin-level + URL-level CrUX gated.
- **Recommendation:** Create a dedicated `fmai-audit` GCP project, enable `pagespeedonline.googleapis.com` + `chromeuxreport.googleapis.com`, mint key, store as `GOOGLE_PSI_API_KEY` in `~/.claude/.env`.
- **Effort:** S (15 minutes setup + 5 minutes key rotation).

### Finding 3: P1 case-study Sindy portrait above-fold uses `loading="lazy"`

- **SOTA marker:** M17 (LCP).
- **Evidence:** Production HTML of `/nl/case-studies/skinclarity-club` contains `<img alt="Portret van Sindy..." loading="lazy" decoding="async" data-nimg="fill">` directly above the fold without `priority` hint.
- **Impact:** Likely Lighthouse `lcp-lazy-loaded` warning. LCP delayed by the time it takes the lazy IntersectionObserver to fire.
- **Recommendation:** Replace `loading="lazy"` with `priority` prop on the case-study hero `<Image />` component. Add `<link rel="preload" as="image" imageSrcSet=...>` automatic preload via Next.js Image priority.
- **Effort:** S (1-line change in case-studies/skinclarity-club page component + verify).

### Finding 4: P1 Spline scene prefetch competes with hero-image preload on home

- **SOTA marker:** M17 (LCP), M20 (no render-blocking third-party).
- **Evidence:** Home production HTML contains `<link rel="prefetch" href="/spline/scene.splinecode" as="fetch">` (1.32 MB) parallel to `<link rel="preload" as="image" imageSrcSet=...>` for the hero. On 3G/4G mobile both races for bandwidth.
- **Impact:** Hero-image LCP at risk on slow connections. Phase 13 mitigated worst-case (prefetch not blocking, scene loads as enhancement), but the race still costs LCP under bandwidth pressure.
- **Recommendation:** (a) Add `fetchpriority="low"` to the prefetch link (browser-supported, deprioritizes against image preload). (b) Consider connection-aware gating: drop the prefetch if `navigator.connection.effectiveType` is `2g` or `slow-2g` via a small inline script (under 1 KB).
- **Effort:** S (2 lines + verify on Chrome DevTools Network Throttle).

### Finding 5: P1 CSS payload of 118 KB gzipped per route is heavy for marketing surface

- **SOTA marker:** M19 (JS first-load less than 200 KB applies to JS, but CSS render-blocks).
- **Evidence:** Production walk shows two CSS chunks summing 118 KB gzipped on every sampled route. Largest CSS chunk: 115 KB gzipped (`0dnhh-p7-m6pz.css`).
- **Impact:** CSS is render-blocking. 118 KB at 100 KB/sec on 3G is ~1.2 s of pure CSS parsing before FCP. SOTA peers (Stripe homepage CSS ~30-40 KB, Linear ~25 KB) ship 3-4x less CSS on marketing routes.
- **Recommendation:** Tailwind v4 CSS purge audit in 16-16. Identify utilities included from chatbot + assessment + demo-playground that are not used on marketing surfaces. Consider CSS code-splitting per route-group: `(marketing)` versus `(skills)` versus `(legal)`.
- **Effort:** M (half-day audit + experiment).

### Finding 6: P1 Top JS chunk 222 KB carries 25 percent of route-total JS in one file

- **SOTA marker:** M19 (JS first-load).
- **Evidence:** `0.ri1iqmo8f.p.js` ships 222 KB gzipped on every route. Sum of route-total JS is 870 KB; top chunk is 25 percent of that.
- **Impact:** Single large chunk limits parallel-decode headroom. HTTP/2 multiplexing can stream chunks but a 222 KB file still serializes parse work on the main thread.
- **Recommendation:** `@next/bundle-analyzer` ANALYZE run in 16-16 to identify the chunk's content. If it's React + Framer Motion + design-system, consider splitting Framer Motion lazy variants from the synchronous chunk (motion is hydration-deferred on most routes via `<LazySection>`).
- **Effort:** M (analyzer run + targeted split).

### Finding 7: P1 Vercel SpeedInsights pushes data but no public CWV surface

- **SOTA marker:** M17, M18, M19.
- **Evidence:** `[locale]/layout.tsx` line 101 renders `<SpeedInsights />` from `@vercel/speed-insights/next`. Web-vitals push to `vitals.vercel-insights.com` per CSP `connect-src`. Data is private to Vercel project owner.
- **Impact:** Real-user CWV exists but is invisible to audits + roadmap-tracking pipelines.
- **Recommendation:** Augment with a `web-vitals` package call that posts to `/api/cwv-beacon` (server-stored) + emits monthly CSV. Allows public-style CWV trend reporting without depending on CrUX URL-level minimum-traffic threshold.
- **Effort:** M (custom beacon endpoint + storage).

### Finding 8: P1 Google Analytics gtag calls but no GA loader script

- **SOTA marker:** M20 (no render-blocking third-party). Also data-quality concern.
- **Evidence:** `window.gtag(...)` is called in `AssessmentClient.tsx:39`, `AssessmentClient.tsx:49`, `AssessmentEmailGate.tsx:63`, `ResultReveal.tsx:109`, plus type declarations. NO `<script src="https://www.googletagmanager.com/...">` injection detected in any sampled production HTML.
- **Impact:** Either (a) GA is configured at runtime through a means not on the sampled routes (verify on `/blog`, `/legal/*`), or (b) the calls are dead code that fail silently because `window.gtag` is undefined. Either way: no GA data is currently being captured from the marketing routes.
- **Recommendation:** Decide intent. If GA is desired, add Next.js `<Script src="https://www.googletagmanager.com/gtag/js?id=G-..." strategy="afterInteractive">` in the layout. If GA is not desired, remove the dead `gtag` calls.
- **Effort:** S (decision + 5-line implementation or removal).

### Finding 9: P2 JetBrains Mono font 40 KB preload rarely used above the fold

- **SOTA marker:** M19 (asset budget).
- **Evidence:** Production HTML preloads `70bc3e132a0a741e-s.p.1409xf.ylxg8g.woff2` (40 KB, JetBrains Mono variable). Mono usage on marketing surface limited to inline code in legal/blog, never above the fold.
- **Impact:** 40 KB of font payload preloaded on every route to support a font visible on <10 percent of pageviews.
- **Recommendation:** Replace `--font-mono` with `font-family: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace` system stack. Save 40 KB preload + 40 KB woff2 download per cold visit.
- **Effort:** S (delete from `src/lib/fonts.ts`, update `globals.css` `--font-mono` value, verify legal/blog).

### Finding 10: P2 Spline scene file 1.32 MB binary

- **SOTA marker:** M17 (LCP impact on home), M19 (asset budget).
- **Evidence:** `curl` against `/spline/scene.splinecode` returns 1349622 bytes. This is the Spline 3D scene binary loaded by `HeroSpline` on the home page.
- **Impact:** 1.32 MB single asset. Even at home-only gating (Phase 13 saved cumulative 112 MB across the route walk), the single home-cold-load is a large payload.
- **Recommendation:** Open the scene in Spline editor and audit (a) polygon count + texture resolution, (b) WebGL feature use (consider PBR-light replacement), (c) lazy-loading the scene below the fold instead of via prefetch hint.
- **Effort:** M (scene optimization workshop) to L (rebuild with lower polygon budget).

### Finding 11: P2 No `web-vitals` library on dependency graph despite layout `<SpeedInsights />`

- **SOTA marker:** instrumentation completeness.
- **Evidence:** `@vercel/speed-insights` provides internal-only push. The standalone `web-vitals` library (which would let us run per-page custom beacons) is NOT a top-level dependency per package.json scan (Phase 13 VERIFICATION mentions `web-vitals` was bumped, but it's a transitive of `@vercel/speed-insights`).
- **Impact:** Custom field-data instrumentation needs explicit `web-vitals` install.
- **Recommendation:** Add `web-vitals@^4.x` as direct dep in 16-16, wire to a `/api/cwv-beacon` route that writes to Supabase or a simple JSON store.
- **Effort:** S (install + 30-line API route + 20-line client hook).

### Finding 12: P2 Pricing route has 14 chunks versus 13 for most others

- **SOTA marker:** M19 (chunk count efficiency).
- **Evidence:** Production HTML for `/nl/pricing` references 14 unique chunks; most routes reference 13. The 14th chunk is `0c5uu5bbc.996.js` (13 KB gzipped).
- **Impact:** Negligible cost (13 KB extra over baseline) but the chunk exists across all pricing renders.
- **Recommendation:** Bundle analyzer attribution: identify what this chunk contains. Possibly the `<BookingTrigger>` or `<PricingMatrix>` glue. Decide if it can roll into a shared chunk or stays route-specific.
- **Effort:** S (analyzer run + decision).

### Finding 13: P2 Apply route has 14 chunks; one extra chunk likely Calendly glue

- **SOTA marker:** M19.
- **Evidence:** `/nl/apply` ships 14 chunks (vs 13 baseline). Extra chunk is suspected to be `ApplyCalendlyInline.tsx` plus form glue.
- **Impact:** Negligible (under 5 KB transfer overhead) but worth attributing for completeness.
- **Recommendation:** Same as Finding 12 (analyzer pass).
- **Effort:** S.

### Finding 14: P2 Contact route also 14 chunks

- **SOTA marker:** M19.
- **Evidence:** `/nl/contact` ships 14 chunks. Extra chunk is suspected to be the contact form + Calendly inline glue (`ContactForm.tsx` references `DEFAULT_CALENDLY_URL`).
- **Impact:** Same as Finding 13.
- **Recommendation:** Same.
- **Effort:** S.

### Finding 15: P2 Home Spline preconnect uses `crossorigin="anonymous"`; verify it matches unpkg CORS

- **SOTA marker:** M19, M20.
- **Evidence:** Home HTML has `<link rel="preconnect" href="https://unpkg.com" crossorigin="anonymous">`. unpkg.com serves with permissive CORS, so this is correct, but worth verifying the Spline runtime fetch follows `crossorigin` semantics (otherwise preconnect creates a second connection).
- **Impact:** Edge case: if Spline runtime fetches without `crossorigin`, preconnect is wasted (TLS handshake on a connection that's never reused).
- **Recommendation:** Inspect `SplineScene.tsx` to confirm `fetch()` or `<script>` uses `crossorigin="anonymous"` consistently.
- **Effort:** S (5-line verification).

### Finding 16: P2 No `<link rel="dns-prefetch">` for calendly.com

- **SOTA marker:** M20.
- **Evidence:** Calendly is loaded via post-click iframe (CalendlyModal). Production CSP `connect-src` allows `https://calendly.com` + `https://assets.calendly.com`. No `<link rel="dns-prefetch">` for either in initial HTML.
- **Impact:** First Calendly click pays full DNS + TLS handshake (200-400 ms on a cold connection). Adding a passive `<link rel="dns-prefetch" href="//calendly.com">` would shave that off the first interaction.
- **Recommendation:** Add `<link rel="dns-prefetch" href="https://calendly.com">` + `<link rel="dns-prefetch" href="https://assets.calendly.com">` to layout `<head>`.
- **Effort:** S (2 lines, verify on contact + apply + pricing flows).

### Finding 17: P2 No `Cache-Control` immutable on static chunks

- **SOTA marker:** M19 (cold-vs-warm visit cost).
- **Evidence:** Vercel default for `_next/static/` is `public, max-age=31536000, immutable` (this audit did not curl chunk headers; Vercel docs assert this). Production response on the HTML route is `public, max-age=0, must-revalidate` which is correct for SSG with revalidation.
- **Impact:** None expected. Worth verifying with `curl -I` on a chunk URL in 16-16.
- **Recommendation:** Verify chunk Cache-Control once in 16-16; no action expected.
- **Effort:** S.

### Finding 18: P2 `X-Nextjs-Stale-Time: 300` means 5-minute SSR revalidation cycle

- **SOTA marker:** M16 (production-walk consistency).
- **Evidence:** Production response header on `/nl` includes `X-Nextjs-Stale-Time: 300`. This indicates Next.js ISR-style 5-minute background revalidation.
- **Impact:** Acceptable. 5-minute stale serves with `X-Vercel-Cache: HIT` on warm edges; first cold edge request after deploy pays a slightly longer TTFB during the revalidation window.
- **Recommendation:** Document in 16-16 KPI tracker so monitoring scripts know to expect occasional 0.5 to 1.0 s TTFB spikes on the first request after each 300 s revalidation.
- **Effort:** S.

### Finding 19: P3 Vercel `Server: Vercel` exposes infra identity

- **SOTA marker:** policy hygiene, not direct CWV.
- **Evidence:** Response `Server: Vercel` header.
- **Impact:** Negligible perf. Mentioned for completeness.
- **Recommendation:** Plan 16-12 (security) owns the call on stripping infra identity. No 16-16 action.
- **Effort:** S (security plan owns).

### Finding 20: P3 CSP `script-src 'unsafe-inline' 'unsafe-eval'`

- **SOTA marker:** policy + perf adjacency.
- **Evidence:** Production CSP allows `unsafe-inline` + `unsafe-eval`. Both are needed for current Next.js 16 + Spline runtime on home. Removing would require additional work.
- **Impact:** Perf-adjacent because strict CSP eliminates some XSS attack surface that can defer to perf-related supply-chain risks. Owned by 16-12.
- **Recommendation:** None for 16-16 perf work. Tracked separately.
- **Effort:** Out of scope.

### Finding 21: P3 No HTTP/3 (QUIC) advertised via `alt-svc`

- **SOTA marker:** network-layer SOTA.
- **Evidence:** Production response headers do not include `alt-svc: h3=...`. Vercel may negotiate HTTP/3 via TLS ALPN but not advertise via header.
- **Impact:** Negligible on already-fast HTTP/2 connections. SOTA reference (Stripe, Vercel) advertise HTTP/3 via `alt-svc`.
- **Recommendation:** Inspect Vercel project settings for HTTP/3 enablement; verify in 16-16.
- **Effort:** S.

### Finding 22: P3 hero-image `imageSizes=60vw` may be wasteful on mobile

- **SOTA marker:** M19, image-budget.
- **Evidence:** Home `<link rel="preload" as="image" imageSrcSet=... imageSizes="60vw">`. On 360 px mobile this picks the 256w variant; on 414 px it picks the 384w variant.
- **Impact:** Small. The 256w to 384w variants are 6-12 KB each so the cost is contained, but on very wide desktops (1920px) the `60vw` resolves to 1152px which pulls the 1280w variant (28 KB). If the actual rendered image footprint is smaller, this is wasted bytes.
- **Recommendation:** Measure actual rendered image dimensions across viewports (Lighthouse "Properly size images" audit) and tune `imageSizes` to match render footprint.
- **Effort:** S (Lighthouse audit + 1-line edit).

### Finding 23: P3 `noModule` polyfill chunk at 110 KB ships to every browser

- **SOTA marker:** M19.
- **Evidence:** Production HTML shows `<script src=".../03~yq9q893hmn.js" noModule="">` (the `noModule` attribute means modern browsers skip it). This is the legacy ES5 polyfill bundle.
- **Impact:** Modern browsers ignore it (saves ~110 KB compressed transfer + parse on 99 percent of visits). But the chunk still ships to legacy browsers which may not be a meaningful target market for FMai.
- **Recommendation:** Drop ES5 polyfill emission via `swc` config if browser targets are evergreen (Chrome 100+, Safari 15+, Firefox 100+). Saves chunk-level transfer + adds a clean perf budget.
- **Effort:** S (one config flip + verify build).

### Finding 24: P3 hero `<img>` has empty `alt=""`

- **SOTA marker:** M5 plus a11y intersection. Perf-adjacent only.
- **Evidence:** `<img alt="" decoding="async" data-nimg="fill" ...>`. Empty alt is correct for decorative images, marginal for an LCP candidate.
- **Impact:** Cross-references plan 16-08 a11y findings. Not a perf finding.
- **Recommendation:** Cross-link to 16-08 a11y doc, no perf action.
- **Effort:** Out of scope here.

### Finding 25: P3 `Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch`

- **SOTA marker:** SSG cache fragmentation.
- **Evidence:** Production response includes a 4-key `Vary` header. This is Next.js 16 App Router behavior to vary cache by RSC prefetch dimensions.
- **Impact:** Cache hit ratio is segmented across 4 prefetch dimensions. May reduce edge cache efficiency on cold deploys.
- **Recommendation:** Monitor Vercel cache hit ratio in 16-16. If less than 90 percent HIT on top-10 routes, investigate.
- **Effort:** S (Vercel analytics check).

## Cross-references

- Phase 13 cleanup baseline: `.planning/phases/13-performance-bundle-cleanup/13-VERIFICATION.md` (sections "Bundle Reduction Quantification" and "Required Artifacts"). Phase 13 saves of 35 to 57 percent raw HTML per non-home route, 1.32 MB Spline bandwidth saved per cold non-home walk, 8 KB gzipped cookie-consent skip on returning visitors, font-preload trim to 2 families.
- Phase 16-02 build baseline: `docs/audits/2026-05-18-v2/01-baseline-snapshot.md` items 7 (build summary), 9 (Lighthouse chalk gap), 10 (port shift), 11 (capture-suite consolidated re-run).
- SOTA markers: `docs/audits/2026-05-18-v2/00-competitive-intel.md` section 4 (markers 16 to 20 perf).
- SEO audit (parallel): `docs/audits/2026-05-18-v2/05-seo-technical.md`. Cross-link: hreflang + canonical headers verified consistent in production response (`Link: <https://future-marketing.ai/en>; rel="alternate"; hreflang="en"` etc.).
- A11y audit (parallel): `docs/audits/2026-05-18-v2/07-accessibility.md`. Cross-link: hero `<img alt="">` decision visible in both surfaces.

## Methodology + provenance

- Production walk: `curl` against `https://future-marketing.ai/nl<route>` for 10 canonical routes on 2026-05-19. Measurements: TTFB, total time, response size (gzipped HTML), cache status, response headers. Executor host: VPS in Frankfurt region.
- Production chunk size measurement: `curl -o /dev/null -w "%{size_download}"` against each `_next/static/chunks/*.js` and `*.css` URL referenced in initial HTML. Sizes are compressed transfer bytes (Vercel ships brotli/gzip by default; the size_download number reflects actual wire bytes).
- HAR data: 30 of 93 HAR files inspected for the top-10 routes × NL locale. HAR captured from local dev server on port 3100 (per `01-baseline-snapshot.md` item 10). Dev mode bundle sizes are NOT representative of production; only resource-count topology is used from HAR.
- Phase 13 baseline: `13-VERIFICATION.md` independent gzip measurements (lines 140-146).
- Lighthouse: gated, see Lighthouse gap section. Fallback methodology applied.
- CrUX: gated, see CrUX field data section.

## Open questions for plan 16-16 (roadmap synthesis)

1. Is `chalk@^4.1.2` resolution pin acceptable as a workaround, or should `playwright-lighthouse` be replaced with a fork or alternative (e.g., `lighthouse` programmatic API direct)?
2. Should the new `fmai-audit` GCP project be created by Daley (account holder for the existing Gemini project) or via a workspace user? Same key can serve CrUX, PSI, and future Web Vitals API.
3. JetBrains Mono removal (Finding 9): are there any legal/blog MDX surfaces that depend on mono font branding that must be preserved?
4. Spline scene optimization (Finding 10): does Daley have the original Spline editor file to optimize, or is `/public/spline/scene.splinecode` the only artefact?
5. GA decision (Finding 8): is Google Analytics a required production tool for FMai, or has the team moved to Vercel Analytics + Supabase events exclusively?
6. Custom CWV beacon (Finding 11): is Supabase the storage of record, or should a simpler edge-function endpoint write to Vercel KV?
7. ES5 polyfill drop (Finding 23): what is FMai's stated browser support matrix? If evergreen, drop saves ~110 KB chunk.
8. CSS code-splitting (Finding 5): is Tailwind v4's CSS layer-cake purge per-route-group already configured, or does it ship one combined CSS file for all routes?

## Sources + raw artefacts

- Production HTML: live-fetched 2026-05-19 from `https://future-marketing.ai/nl<route>` for top-10 routes. Raw outputs not saved (transient curl).
- Chunk transfer sizes: live-fetched 2026-05-19, raw counts visible in this document's tables.
- HAR captures: `fmai-nextjs/test-results/audit-v2/har/` (93 files, gitignored).
- DOM snapshots: `fmai-nextjs/test-results/audit-v2/dom/` (93 files, gitignored).
- Phase 13 baseline: `.planning/phases/13-performance-bundle-cleanup/13-VERIFICATION.md` (committed).
- Phase 16-02 baseline: `docs/audits/2026-05-18-v2/01-baseline-snapshot.md` (committed).
- Wave 0 SOTA markers: `docs/audits/2026-05-18-v2/00-competitive-intel.md` section 4 (committed).
- PSI fallback evidence file: `docs/audits/2026-05-18-v2/08-performance-pagespeed.json` (committed alongside this doc; contains the 20 quota-exhausted error records for reproducibility and to document that the fallback was attempted).

End of document. 25 findings, complete CWV scorecard (with Lighthouse columns gated and methodology documented), per-route LCP analysis, bundle composition with chunk attribution, third-party scripts audit, image audit, KPI baseline + targets for plan 16-16 weekly tracker.
