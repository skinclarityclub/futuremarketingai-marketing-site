---
title: Technical Quality Audit — fmai-nextjs
date: 2026-04-24
auditor: senior-nextjs-architect
scope: code quality, architecture correctness, security, Next.js 16 best practices
status: READ-ONLY
repo: C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs
---

# Technical Quality Audit

## Executive summary

- **Build passes, lint fails hard.** `next build` succeeds in 9.8s with 87 prerendered pages, but `eslint` exits with **36 errors + 13 warnings** — most from the Next.js 16 React Compiler rules (`react-hooks/set-state-in-effect`, `react-hooks/purity`, `react-hooks/preserve-manual-memoization`, `react-hooks/static-components`) plus a string of `@next/next/no-html-link-for-pages` violations. Lint is not part of the build gate, so this silently ships.
- **Zero adoption of Next.js 16 headline features.** No `use cache`, no `cacheLife`/`cacheTag`, no Partial Prerendering hints, no Server Actions, no Suspense/streaming, zero `loading.tsx` files. Uses legacy `middleware.ts` which the build itself warns is **deprecated in favor of `proxy.ts`**.
- **Security baseline is solid, with gaps.** Comprehensive security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy) are configured and shipped via `next.config.ts`. BUT CSP allows `script-src 'unsafe-inline' 'unsafe-eval'` and loads from `unpkg.com`, rate limiting is in-memory (resets on cold start, ineffective on Vercel Fluid Compute across instances), `/api/contact` has `Access-Control-Allow-Origin: *` with no origin check, and secrets validation is ad-hoc.
- **Client-component bloat.** 60 files use `"use client"` — over a third of `src/components`. The entire chatbot subtree (~25 files) and Header are fully client-side despite huge opportunities for RSC split. The TS config is strict but missing `noUncheckedIndexedAccess` / `exactOptionalPropertyTypes`.
- **10 `any` / `eslint-disable` escape hatches**, all concentrated in the chatbot / tool-results layer and the ElevenLabs integration. No `@ts-ignore`/`@ts-nocheck` anywhere — at least that line is held. `/api/vitals` is called by the web-vitals reporter but **does not exist** as a route, so every page view emits a silent 404 beacon.

---

## 1. Build status — PASS (with deprecation warning)

```
▲ Next.js 16.1.7 (Turbopack)
- Environments: .env.local
- Experiments (use with caution):
  · optimizePackageImports

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
  Learn more: https://nextjs.org/docs/messages/middleware-to-proxy

  Creating an optimized production build ...
✓ Compiled successfully in 9.8s
  Running TypeScript ...
  Collecting page data using 15 workers ...
  Generating static pages using 15 workers (0/87) ...
✓ Generating static pages using 15 workers (87/87) in 1823.7ms
```

- 87 static pages prerendered across 3 locales (~29 unique routes × 3).
- 3 dynamic routes: `/api/apply`, `/api/chatbot`, `/api/contact`. Plus `/[locale]/blog` (SSR with revalidate) and `/[locale]/opengraph-image` (dynamic).
- Blog post routes use ISR with `revalidate = 3600`, `dynamicParams = false` — correct.
- No prerender errors, no type errors surfaced at build time.
- `.next/static` = 6.5 MB.

**Build warning (unaddressed):** the middleware convention is deprecated in Next.js 16. The file `src/middleware.ts` should be renamed to `src/proxy.ts`.

## 2. Lint status — FAIL (36 errors, 13 warnings)

`npm run lint` did not exit cleanly. Full error list (from Next.js 16 React Compiler rules + `next` plugin):

| Rule | File:line | Count |
|---|---|---|
| `react-hooks/set-state-in-effect` | `components/interactive/CalendlyModal.tsx:42`, `components/interactive/CookieConsentBanner.tsx:19`, `components/layout/HeaderClient.tsx:157` | 3 |
| `react-hooks/purity` | `components/chatbot/demo/DemoOrchestrator.tsx:210` (`Date.now()` in render), `components/voice/WaveformVisualizer.tsx:19` (`Math.random()` in render) | 2 |
| `react-hooks/preserve-manual-memoization` | `components/chatbot/ChatMessages.tsx:106`, `hooks/usePersonaChat.ts:18` | 2 |
| `react-hooks/static-components` | `components/chatbot/tool-results/ServiceCard.tsx:63` (Icon component resolved during render) | 1 |
| `@next/next/no-html-link-for-pages` | `components/chatbot/ChatWidget.tsx:108` (×2), `components/chatbot/ProgressiveCTA.tsx:84` (×2), `components/chatbot/tool-results/CaseStudyCard.tsx:78` (×2), `components/chatbot/tool-results/LeadScoreCard.tsx:185,287` (×4), `components/chatbot/tool-results/ServiceCard.tsx:171,276` (×4) | 14 |
| `@typescript-eslint/no-explicit-any` | `components/chatbot/tool-results/ServiceCard.tsx:260`, `components/chatbot/tool-results/index.tsx:96` | 2 |
| `@typescript-eslint/no-require-imports` | `verify-mega.cjs:1`, `verify-screenshots.js:1` | 2 |
| Unused `eslint-disable` | `ServiceCard.tsx:139,252,258`, `tool-results/index.tsx:97` | 4 (warn) |
| Unused vars / imports | `HeaderClient.tsx` (Mic, locale), `hooks/usePersonaChat.ts:31` dep warning, `lib/chatbot/engine.ts:131`, `tests/e2e/homepage.spec.ts:108` | 5 (warn) |
| `react-hooks/exhaustive-deps` | `hooks/usePersonaChat.ts:31` | 1 (warn) |

**Severity of the top hits:**

- `DemoOrchestrator.tsx:210` — `Date.now()` in JSX props computes on every render, causing an unstable `durationSeconds` prop on `<DemoCompletionCard>`. Memoize or snapshot on completion transition.
- `WaveformVisualizer.tsx:19` — `Math.random()` called during initial ref setup. Not a render-time issue for a `useRef` initializer but the compiler flags it; the real fix is to seed in `useEffect`.
- `ServiceCard.tsx:63` — resolving `const Icon = getServiceIcon(data.name)` inside a component body is the pattern that defeats state preservation. Move to a prop-based lookup or a map.
- 14 `<a href="/contact/">` calls that should be `<Link from '@/i18n/navigation'>`. These break i18n routing (no locale prefix) and defeat client-side navigation.

## 3. Architecture scores (0-10, conservative)

| Category | Score | Notes |
|---|---|---|
| App Router structure | 7 | Clean route groups (`(marketing)/(skills)/(blog)/(legal)`), consistent `generateStaticParams` + `generateMetadata`, no `loading.tsx`, one root `error.tsx`, single `not-found.tsx` — missing granular error/loading per route group. |
| RSC / Client split | 4 | 60 `"use client"` files; entire chatbot, header, motion wrappers are client. Several components trivially convertible (see section 4). |
| Data fetching | 6 | Blog uses ISR; no waterfalls because there's barely any data fetching. No use of `cache()`, no `fetch` with Next 16 cache directives. |
| i18n | 8 | `next-intl` 4.8 wired correctly (`defineRouting`, `getRequestConfig` with `requestLocale`, `setRequestLocale` in pages, `getTranslations` server-side, `useTranslations` client-side). hreflang correctly generated per-route. Minor: redirects regex `/:locale/...` doesn't constrain locale. |
| Security | 6 | CSP + HSTS + Permissions-Policy present. Weakened by `'unsafe-inline' 'unsafe-eval'` + wildcard CORS on `/api/contact` + in-memory rate-limit + no auth on public APIs. |
| TypeScript | 6 | `strict: true` on. `noUncheckedIndexedAccess`/`exactOptionalPropertyTypes` off. 10 `any` uses, all in chatbot layer. No `@ts-ignore`. |
| Dependency hygiene | 6 | 7 npm audit vulnerabilities (4 moderate, 3 high — `picomatch`, `postcss`). 21 packages out-of-date. |
| Next.js 16 adoption | 2 | No Cache Components, no PPR, no Server Actions, no `proxy.ts` migration. |
| Accessibility (surface) | 7 | `aria-label`, `aria-labelledby`, visually-hidden honeypot done. Not in scope for deep a11y check. |
| Build health | 8 | Build passes, 87 pages, ~10s cold. Turbopack on. |

## 4. `"use client"` inventory

60 files total (count via grep on first-line directive). Grouped:

### Chatbot subtree (25 files) — entirely client-side

`components/chatbot/*` — `ChatWidget`, `ChatWidgetIsland`, `ChatMessages`, `ChatInput`, `ChatHeader`, `DemoPlayground`, `MultiPlatformShowcase`, `PersonaSelector`, `FloatingButton`, `ProgressiveCTA`, `SuggestedPrompts`, `NavigationButton`, `SidePanel`, `DemoContextCard`, and the `demo/*` subdir (4 files), plus 8 `tool-results/*` cards.

**Justified as client**: `ChatWidget`, `ChatInput`, `ChatMessages`, `usePersonaChat`, demo orchestrator — these hold conversational state and call the AI SDK.

**Could be RSC or islands (4 candidates)**:
- `tool-results/ProductCard.tsx`, `TicketCard.tsx`, `BookingCard.tsx`, `KBArticleCard.tsx` — pure render-from-props. Pass data already lives server-side (tool output); the cards render it. If imported only inside a client map, the `"use client"` can be dropped (client components importing other client components don't require nested directives). Removing unlocks React Server Components conversion if the parent map could also move server-side.

### Motion wrappers (4 files)

`components/motion/ScrollReveal.tsx`, `LazySection.tsx`, `MotionDiv.tsx`, `AnimatePresenceWrapper.tsx` — necessarily client because of `IntersectionObserver` / `motion/react`.

### Layout (3 files)

`Header` is an RSC that re-exports `HeaderClient`. OK. `HeaderClient` is **456 lines** and owns the entire mega menu; candidate for split — the mega-menu panel content (skill categories array, copy) is static and could be rendered server-side and composed with a small client disclosure.

`FloatingLocaleSwitcher` must stay client (pathname manipulation).

### Providers + islands (4 files)

`Providers.tsx`, `ClientIslands.tsx`, `StoreProvider.tsx`, `CookieConsentBanner.tsx` — all justified. `ClientIslands` properly uses `next/dynamic` with `ssr:false` for BookingModal/CalendlyIsland/ChatWidgetIsland. Good pattern.

### Hooks (4 files)

All hooks are correctly flagged client.

### Interactive / voice / booking (remaining)

Most are tied to DOM APIs (Calendly, ElevenLabs, Zustand persist) — justified.

**Suggested conversions:** 3-4 files can be demoted from client; real value is elsewhere. The 456-line HeaderClient is the single biggest code-split win.

## 5. `any` / escape-hatch inventory

No `@ts-ignore`, `@ts-nocheck`, or `@ts-expect-error` in `src/`. 10 `any` occurrences, all in chatbot layer:

| File:line | Use |
|---|---|
| `hooks/useElevenLabsCall.ts:25` | `type ElevenLabsModule = { useConversation?: any; [key: string]: any }` — dynamic import bridge for optional peer dep |
| `hooks/useElevenLabsCall.ts:41` | `const sessionRef = useRef<any>(null)` — SDK session object |
| `lib/chatbot/tool-executor.ts:9` | `type AnyToolRecord = Record<string, Tool<any, any>>` — AI SDK Tool type erasure |
| `lib/chatbot/tools/flagship-tools.ts:11` | same pattern |
| `components/chatbot/ChatMessages.tsx:77,113,161` | `getToolName(part: any)` + casts around AI SDK message parts |
| `components/chatbot/tool-results/index.tsx:56,96` | `Record<string, ComponentType<{ data: any }>>` tool-card map |
| `components/chatbot/tool-results/ServiceCard.tsx:148,260` | `Object.values(data.tiers).map((tier: any) => ...)` — tool-output shape |

**Evaluation:** the AI SDK `Tool<any, any>` pattern is excusable (library types). The tool-results `any` is laziness — these can be typed as discriminated unions over the tool-output shapes already defined in `lib/chatbot/types.ts`. Cost: ~2 hours of type plumbing.

## 6. Next.js 16 feature adoption

| Feature | Adopted? | Evidence |
|---|---|---|
| `proxy.ts` (replaces `middleware.ts`) | **No** | `src/middleware.ts:1-8`. Build emits deprecation warning. |
| `"use cache"` directive | **No** | Zero matches in `src/`. |
| `cacheLife()` / `cacheTag()` / `updateTag()` | **No** | Zero matches. |
| Cache Components (PPR) | **No** | No `experimental.ppr` in `next.config.ts`. |
| Server Actions | **No** | Zero `"use server"` directives. Forms post via client `fetch` → `/api/*`. |
| Suspense + streaming | **No** | No `Suspense` imports, no `loading.tsx` files. |
| Fluid Compute awareness | **No** | Chatbot/contact/apply use in-memory rate-limit maps (won't survive cold start; won't share across instances). |
| AI Gateway | **No** | Direct `@ai-sdk/anthropic` import with `ANTHROPIC_API_KEY`. |
| Turbopack (build) | **Yes** | Build log confirms Turbopack bundler. |
| `optimizePackageImports` | **Yes** | `lucide-react`, `motion`, `react-markdown`, `zustand`. |
| `generateMetadata` (async) | **Yes** | Every page. |
| ImageResponse (OG) | **Yes** | `src/app/[locale]/opengraph-image.tsx`. |
| ISR with `revalidate` | **Yes, partial** | Blog only (`3600`). |

**Gap analysis:**

1. `/api/apply` is an archetypal Server Action candidate: form-only, no third-party callers, no need for CORS. Converting saves ~95 lines of boilerplate and enables progressive enhancement.
2. Pricing, memory, skill pages are static modulo the locale param — ideal for `"use cache"` with long `cacheLife`.
3. Home hero with founding counter could adopt PPR: static shell + dynamic counter via `<Suspense>` once counter becomes a real data source instead of `FOUNDING_SPOTS_TAKEN = 1` constant.
4. Suspense wrappers around `<ClientIslands>` are missing; `LazySection` reinvents IntersectionObserver-based lazy-render rather than using Suspense + `fetchPriority`.

## 7. Security findings

### CSP configuration — `next.config.ts:15-29`

Current CSP:

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com
  https://www.google-analytics.com https://assets.calendly.com https://unpkg.com;
style-src 'self' 'unsafe-inline' https://assets.calendly.com;
img-src 'self' data: blob: https://www.google-analytics.com
  https://www.googletagmanager.com https://assets.calendly.com https://prod.spline.design;
font-src 'self' data:;
connect-src 'self' https://api.anthropic.com https://www.google-analytics.com
  https://calendly.com https://assets.calendly.com https://vitals.vercel-insights.com
  https://prod.spline.design https://unpkg.com;
frame-src https://calendly.com;
worker-src 'self' blob:;
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
```

Issues:
- `'unsafe-inline' 'unsafe-eval'` in `script-src` nullifies most XSS protection. Likely demanded by Spline (WASM eval) and inline Next.js boot scripts. **Mitigation**: migrate to a nonce-based CSP with `strict-dynamic`, or keep `unsafe-eval` only for Spline-hosting paths via middleware-generated per-response CSP.
- `connect-src` includes **`https://api.anthropic.com`** — this exposes that the Anthropic key is called directly from the browser, or is a leftover. Verified in `lib/chatbot/engine.ts:31`: `ANTHROPIC_API_KEY` is server-side only (Anthropic SDK runs in `/api/chatbot`). The `connect-src` entry is therefore unnecessary and should be removed — it only helps an attacker who injects a script to call Anthropic from the user's browser with the user's credentials. **Finding: CSP over-permissive.**
- `unpkg.com` in `script-src` + `connect-src` for Spline WASM — pinning to a specific CDN path would be tighter.
- Good: `frame-ancestors 'none'` + legacy `X-Frame-Options: DENY` kept for older browsers.

### Other headers

- **HSTS** `max-age=63072000; includeSubDomains; preload` — correct.
- **X-Content-Type-Options: nosniff** — correct.
- **Referrer-Policy: strict-origin-when-cross-origin** — correct.
- **Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()** — good baseline, but `/skills/voice-agent` uses ElevenLabs which requires microphone. When that demo is invoked the call will be silently blocked. Needs conditional relaxation to `microphone=(self)` on that route.

### API route security

**`/api/apply`** (`src/app/api/apply/route.ts:1-94`)
- Zod validation + honeypot (`website`) + rate limit 3/min/IP.
- Rate limit is `const rateLimit = new Map<...>()` at module scope — **breaks on Vercel Fluid Compute** (per-instance Maps, no cross-instance sharing; globals can be preserved across invocations within an instance but are not guaranteed and don't survive cold start).
- `setInterval` at module scope runs in each warm instance, not production-friendly.
- On success, **logs to `console.log`** and returns `{success: true}`. `APPLY_EMAIL_TO`/`RESEND_API_KEY` are documented in `.env.example` but the integration isn't wired (`TODO: wire to Resend/SMTP`, line 84). This means every legitimate application submission is discarded to stdout.
- No size limit on request body beyond Zod `max(5000)` on the `problem` field — Next.js default 1 MB body limit saves this.
- No CSRF token — acceptable because POST from same-origin page via fetch with same-site cookie SameSite=Lax defaults would work; but if the app ever gets a session cookie this becomes an issue.

**`/api/contact`** (`src/app/api/contact/route.ts:1-102`)
- **Wildcard CORS** (`Access-Control-Allow-Origin: *`, line 45). Same concerns as /apply regarding rate-limit + unwired email. With `*` origin, any site can POST to this endpoint — combined with the discard-to-stdout pattern, this mostly wastes bytes but still a hygiene issue.
- `TODO: Send email via Resend, SendGrid, etc.` on line 95.

**`/api/chatbot`** (`src/app/api/chatbot/route.ts` + `lib/chatbot/engine.ts`)
- Has its own rate-limit module (`rate-limiter.ts` — separate from the inline maps above). 30s `maxDuration`, `runtime: nodejs`.
- Explicit API key guard at engine line 31.
- Security module for input validation (`security.ts`).
- Good design overall. Still suffers from in-memory state.

**Missing:** no `/api/vitals` route. `lib/web-vitals.ts:41` sends `navigator.sendBeacon('/api/vitals', ...)` — this produces a 404 on every page load. Either ship the route or strip the call.

### Environment variables

- `.env.example` complete and documented (40 lines), with placeholders and explicit commented-out Stripe block.
- `.env.local` contains 2 keys: `OPENAI_API_KEY` (not referenced anywhere in code — may be stale), `VERCEL_OIDC_TOKEN` (Vercel CLI artefact). No `ANTHROPIC_API_KEY` in local env — means the chatbot is effectively disabled locally unless developer adds it.
- `.gitignore` correctly excludes `.env*` and `.env*.local`.
- `NEXT_PUBLIC_*` audit:
  - `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL` — safe (public URLs).
  - `NEXT_PUBLIC_CALENDLY_URL` — safe (public scheduling link).
  - `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` — Agent ID is public per ElevenLabs design. OK.
  - `NEXT_PUBLIC_GTM_ID` — public by design.
- No secrets leak into `NEXT_PUBLIC_*`. CLAUDE.md rule respected.

### Third-party embeds

- Calendly loaded via `react-calendly` iframe inside `react-calendly` component. CSP allows `frame-src https://calendly.com`. `sandbox` attribute not used — the iframe inherits top-level trust. Given Calendly is first-party trusted, acceptable but worth adding `loading="lazy"` + `sandbox="allow-scripts allow-same-origin allow-forms"`.
- Spline — runs in a WASM worker, loads `.splinecode` scene. Preconnect + prefetch hints present in layout (`layout.tsx:57-59`). WASM worker is sandboxed by browser. `script-src unpkg.com` is the supply-chain weak point here.

### Supply-chain

- `package-lock.json` present (4 MB+).
- **`npm audit`: 7 vulnerabilities (4 moderate, 3 high)** — picomatch ReDoS + POSIX injection (transitive via `@parcel/watcher`), postcss XSS via `</style>` in CSS stringify (transitive via `next` itself). Fix requires `next@16.2.4`, which is available and would also close 21 other stale deps.
- No pinned Node version (`engines` missing from `package.json`). Vercel defaults to Node 24 LTS per current platform; fine.

## 8. Dependency audit

### Outdated (21 packages, 2026-04-24)

Critical:
- `next` 16.1.7 → 16.2.4 (7 patches behind, fixes postcss CVE)
- `eslint-config-next` 16.1.7 → 16.2.4
- `@next/mdx` 16.1.7 → 16.2.4
- `@next/bundle-analyzer` 16.1.7 → 16.2.4
- `next-intl` 4.8.3 → 4.9.1
- `react` 19.2.3 → 19.2.5, `react-dom` same

Minor:
- `@ai-sdk/anthropic` 3.0.58 → 3.0.71
- `@ai-sdk/react` 3.0.118 → 3.0.170 (52 patches behind — AI SDK moves fast)
- `ai` 6.0.116 → 6.0.168 (same)
- `@splinetool/runtime` 1.12.70 → 1.12.88
- `@tailwindcss/postcss`, `tailwindcss` 4.2.1 → 4.2.4
- `@playwright/test` 1.58.2 → 1.59.1
- `web-vitals` 5.1.0 → 5.2.0
- `@types/node` 20.19.37 → 20.19.39

Major bumps available (not necessarily safe):
- `lucide-react` 0.577.0 → 1.11.0 (major, review breaking changes)
- `schema-dts` 1.1.5 → 2.0.0
- `typescript` 5.9.3 → 6.0.3
- `eslint` 9 → 10
- `@types/node` 20 → 25

### Duplicate / unused

- `@google/stitch-sdk` (design tool SDK) — **not imported anywhere** in `src/`. Used in scripts only? Check `scripts/` dir. Likely removable from prod deps.
- `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx` — MDX is used for blog; keep.
- `gray-matter` — used in `lib/blog.ts`, keep.
- No duplicate deps detected.

### Security vulnerabilities

```
picomatch  GHSA-3v7f-55p6-f55p (POSIX injection, high)
picomatch  GHSA-c2c7-rcm5-vvqj (ReDoS, high)
postcss    GHSA-qx2v-qp2m-jg93 (XSS via </style>, moderate)
Total: 7 vulnerabilities (4 moderate, 3 high)
```

Fixed by `npm audit fix --force` which installs `next@16.2.4`.

## 9. Top 20 technical debt items (risk × effort)

Ordered by `risk × (10 − effort)`, high risk + low effort first.

| # | Item | Risk (1-5) | Effort (h) | File |
|---|---|---|---|---|
| 1 | Legit application/contact submissions are `console.log`-ed and discarded | 5 | 2 | `api/apply/route.ts:86`, `api/contact/route.ts:86` |
| 2 | `npm audit` — 3 high + 4 moderate CVEs, fix via next 16.2.4 | 4 | 0.5 | `package.json` |
| 3 | `middleware.ts` deprecated in 16 — rename to `proxy.ts` | 3 | 0.25 | `src/middleware.ts` |
| 4 | 14 `<a>` → `<Link>` violations break i18n locale routing | 4 | 1 | chatbot tool-results, `ProgressiveCTA.tsx`, `ChatWidget.tsx` |
| 5 | `/api/vitals` endpoint missing — every page load 404s a beacon | 3 | 0.5 | `lib/web-vitals.ts:41` or add route |
| 6 | In-memory rate-limit on Fluid Compute is ineffective | 4 | 3 | `api/apply`, `api/contact`, `lib/chatbot/rate-limiter.ts` |
| 7 | CSP allows `'unsafe-eval'` globally — migrate to nonce + `strict-dynamic` | 4 | 4 | `next.config.ts:15-29` |
| 8 | `Math.random()` and `Date.now()` in render (React 19 purity violation) | 3 | 1 | `WaveformVisualizer.tsx:19`, `DemoOrchestrator.tsx:210` |
| 9 | `setState` sync in `useEffect` — cascading renders | 3 | 1 | `CalendlyModal.tsx:42`, `CookieConsentBanner.tsx:19`, `HeaderClient.tsx:157` |
| 10 | Wildcard CORS on `/api/contact` | 3 | 0.5 | `api/contact/route.ts:45-48` |
| 11 | `ANTHROPIC_API_KEY` connect-src CSP entry exposes attack surface | 3 | 0.25 | `next.config.ts:21` |
| 12 | 10 `any` casts in chatbot tool-results — type them | 2 | 3 | `tool-results/*`, `useElevenLabsCall.ts` |
| 13 | `@google/stitch-sdk` ships in deps but appears unused in src | 2 | 0.25 | `package.json` |
| 14 | `HeaderClient.tsx` is 456 lines of client code — split server/client | 2 | 4 | `components/layout/HeaderClient.tsx` |
| 15 | `/api/apply` converts cleanly to Server Action — remove 95 LOC boilerplate | 2 | 2 | `api/apply/*` + `ApplicationForm.tsx` |
| 16 | No `loading.tsx` — no streaming UX | 2 | 2 | `app/[locale]/**` |
| 17 | `ServiceCard.tsx` creates `Icon` component at render — state reset | 2 | 1 | `tool-results/ServiceCard.tsx:63` |
| 18 | Permissions-Policy blocks microphone; voice-agent demo will 0-permission | 3 | 0.5 | `next.config.ts:59` |
| 19 | 21 packages outdated incl. AI SDK 52 patches behind | 2 | 1 | `package.json` |
| 20 | `noUncheckedIndexedAccess` / `exactOptionalPropertyTypes` off | 2 | 6 | `tsconfig.json` (iterative) |

## 10. Upgrade paths (incremental modernization plan)

### Phase A — Security + hygiene (4-6 hours)

1. `npm install next@16.2.4 eslint-config-next@16.2.4 @next/mdx@16.2.4 @next/bundle-analyzer@16.2.4` — closes CVEs.
2. Wire Resend to `/api/apply` and `/api/contact`. Use the already-documented env vars. Keep the current validation + rate-limit wrappers.
3. Remove `NEXT_PUBLIC_` references to Anthropic in CSP `connect-src`.
4. Fix Permissions-Policy: allow `microphone=(self)` if voice demo stays.
5. Origin-check `/api/contact` (explicit list of allowed origins) or drop the CORS OPTIONS handler entirely since it's same-origin.
6. Rename `middleware.ts` → `proxy.ts`.
7. Add `/api/vitals` route (minimum: store-and-discard with Upstash Redis or Vercel Analytics forwarder) OR remove the `sendBeacon` call.
8. Run `npm run lint -- --fix` for trivial unused-disable/unused-var hits; manually fix the 14 `<a>` → `<Link>`.

### Phase B — React 19 / Next 16 compliance (1-2 days)

9. Fix all 10 React Compiler errors: `Date.now()` in render, `Math.random()` in render, `setState` in effect, manual-memoization issues, `Icon` in render.
10. Enable lint as part of build by adding `"prebuild": "npm run lint"` to `package.json` scripts, or set `eslint.ignoreDuringBuilds: false` explicitly.
11. Pin Node: add `"engines": { "node": ">=22.0.0" }`.
12. Tighten TS config: enable `noUncheckedIndexedAccess` and fix resulting errors iteratively (~6h).

### Phase C — Architecture modernization (1-2 weeks)

13. Convert `/api/apply` → Server Action (`actions.ts` co-located with the form). Remove API route.
14. Add `"use cache"` with `cacheLife('hours')` + `cacheTag` for pricing + memory + skill pages. Gives instant navigation + tag-based invalidation via `updateTag` when pricing SSoT changes in `fma-app`.
15. Split `HeaderClient.tsx`: `Header` (server) owns the skill-category data + branding; `HeaderDisclosure` (client) owns open/close mobile state and scroll watcher. Net reduction ~200 LOC client-side.
16. Migrate in-memory rate-limit to Upstash Redis (`@upstash/ratelimit`). ~50 LOC change, works across Fluid Compute instances.
17. Strip `@google/stitch-sdk` from deps unless genuinely needed in scripts (move to devDependencies in that case).
18. Add per-route `loading.tsx` + Suspense boundaries around `<ClientIslands>` to enable streaming of above-the-fold content independent of Spline load.
19. Enable PPR (`experimental.ppr = 'incremental'`) and opt specific routes in. Founding counter → dynamic hole; everything else static.

## 11. Legacy / dead code

Files at repo root that are legacy tooling (not part of app):

- `/c/Users/daley/Desktop/Futuremarketingai/fmai-nextjs/verify-mega.cjs` (lint error)
- `/c/Users/daley/Desktop/Futuremarketingai/fmai-nextjs/verify-screenshots.js` (lint error)
- `/c/Users/daley/Desktop/Futuremarketingai/fmai-nextjs/scroll-screenshot.js`
- `/c/Users/daley/Desktop/Futuremarketingai/fmai-nextjs/scroll-vite.js` ← references **Vite**, a bundler no longer used
- 25+ PNG files at repo root (`hero-*.png`, `vite-*.png`, `verify-*.png`, `chatbots-*.png`, `voice-*.png`, etc.) — debug screenshots committed to tree

Nested accidental directory:
- `fmai-nextjs/fmai-nextjs/components/` exists (empty per listing) — stale scaffold artifact.

No legacy `src/` at repo root (root CLAUDE.md warned of possible legacy Vite tree; confirmed absent).

In `src/`:
- `components/chatbot/MultiPlatformShowcase.tsx` + `DemoPlayground.tsx` — CLAUDE.md notes these are due to move to lead-qualifier in Phase 3. Still present; verify post-migration.
- `components/chatbot/ChatWidget.tsx` vs `ChatWidgetIsland.tsx` — coexist intentionally (island wraps widget); OK.
- `hooks/useCalendlyBooking.ts` — imported by `DemoCompletionCard`, `ProgressiveCTA`, and CTA buttons per comment. Used.
- `src/app/api/apply/` + `src/app/[locale]/(marketing)/apply/page.tsx` — duplicate `apply` directories; the `/api/apply` is the route, `/apply/page.tsx` is the application page. Intentional, no conflict.

## 12. Commit hygiene

Per `git log --oneline`: consistent `type(scope): message` format, why-focused, scope matches pages. Recent history shows single-phase-per-commit discipline. **PASS.**

One cosmetic concern: em-dashes in older commits (`b062c46 content(home): shorter hero headline — 'Dit is Clyde.' ipv 'Maak kennis met Clyde.'`) — user's global rules forbid em-dashes in user-facing copy; commit messages aren't user-facing, so moot.

## 13. Testing posture

- Playwright e2e installed, `tests/e2e/homepage.spec.ts` present.
- No unit tests, no component tests — content-centric project per CLAUDE.md, acceptable.
- `npm run build` is the effective integration gate. Lint is not gated.

**Recommendation:** add lint as a pre-build step, add a single CI workflow that runs build + lint + playwright headless.

---

## Appendix A — raw lint output (tail)

(Full errors captured in section 2.)

## Appendix B — raw build output (summary)

```
▲ Next.js 16.1.7 (Turbopack)
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
✓ Compiled successfully in 9.8s
✓ Generating static pages using 15 workers (87/87) in 1823.7ms

Route (app)                                  Revalidate  Expire
● /[locale]                                   static, 3 locales prerendered
● /[locale]/about                             static, 3 locales
● /[locale]/apply                             static, 3 locales
ƒ /[locale]/blog                              SSR with 3600s revalidate
● /[locale]/blog/[slug]                       1h, 1y expire — 1 EN post
● /[locale]/case-studies/skinclarity-club     static, 3 locales
● /[locale]/contact                           static, 3 locales
● /[locale]/founding-member                   static, 3 locales
● /[locale]/how-it-works                      static, 3 locales
● /[locale]/legal                             static, 3 locales
● /[locale]/legal/cookies                     static, 3 locales
● /[locale]/legal/privacy                     static, 3 locales
● /[locale]/legal/terms                       static, 3 locales
● /[locale]/memory                            static, 3 locales
ƒ /[locale]/opengraph-image                   dynamic
● /[locale]/pricing                           static, 3 locales
● /[locale]/skills/{ad-creator,blog-factory,clyde,email-management,
   lead-qualifier,manychat,reel-builder,reporting,research,seo-geo,
   social-media,voice-agent}                  all static, 3 locales each = 36 pages
ƒ /api/apply                                  dynamic (POST)
ƒ /api/chatbot                                dynamic (POST, maxDuration 30)
ƒ /api/contact                                dynamic (POST)
○ /robots.txt                                 static
○ /sitemap.xml                                static
ƒ Proxy (Middleware)                          dynamic
```

Static bundle: 6.5 MB in `.next/static`.

## Appendix C — `npm audit` raw

```
picomatch (transitive via @parcel/watcher)
  GHSA-3v7f-55p6-f55p — POSIX Character Class injection — HIGH
  GHSA-c2c7-rcm5-vvqj — ReDoS via extglob quantifiers — HIGH
postcss (transitive via next)  <8.5.10
  GHSA-qx2v-qp2m-jg93 — XSS via unescaped </style> — MODERATE
Total: 7 vulnerabilities (4 moderate, 3 high)
Fix: npm audit fix --force  (installs next@16.2.4)
```

## Appendix D — `npm outdated` raw (21 packages)

See section 8 for full table. Critical upgrades: `next`, `next-intl`, `@ai-sdk/*`, `ai` (52 patches behind on AI SDK chat).

## Appendix E — files referenced

- `src/middleware.ts:1-8` — deprecated convention
- `src/app/layout.tsx:1-5` — minimal root layout
- `src/app/[locale]/layout.tsx:1-78` — locale layout, correct `setRequestLocale` + `getMessages`
- `src/app/[locale]/page.tsx:1-392` — home
- `src/app/[locale]/error.tsx:1-25`
- `src/app/[locale]/not-found.tsx:1-20`
- `src/app/api/apply/route.ts:1-94` — in-memory rate limit, Resend TODO
- `src/app/api/contact/route.ts:1-102` — wildcard CORS, Resend TODO
- `src/app/api/chatbot/route.ts:1-9` + `src/lib/chatbot/engine.ts:1-169`
- `src/i18n/routing.ts:1-7` — 3 locales, `localePrefix: always`
- `src/i18n/request.ts:1-13` — correct `getRequestConfig`
- `src/i18n/navigation.ts:1-4`
- `next.config.ts:15-107` — CSP + redirects + images
- `tsconfig.json:1-35` — strict on, `noUncheckedIndexedAccess` off
- `eslint.config.mjs:1-18`
- `vercel.json:1-5`
- `src/lib/constants.ts:1-10` — founding counter SSoT
- `src/lib/web-vitals.ts:1-55` — sends to missing `/api/vitals`
- `src/lib/metadata.ts:1-66` — correct hreflang generation
- `src/app/sitemap.ts:1-80`
- `src/app/robots.ts:1-15`
- `src/components/providers/ClientIslands.tsx:1-40` — good dynamic-import pattern
- `src/components/providers/StoreProvider.tsx:1-20` — correct Zustand rehydrate pattern
- `src/components/layout/Header.tsx:1-9` + `HeaderClient.tsx:1-456`
- `src/hooks/useElevenLabsCall.ts:1-192`
- `src/hooks/usePersonaChat.ts:1-50`
- `src/stores/chatbotStore.ts:1-174`
- `src/stores/bookingStore.ts:1-14`
- `src/components/apply/ApplicationForm.tsx:1-249`
- `src/components/seo/JsonLd.tsx:1-16` — correct `dangerouslySetInnerHTML` with escape
- `src/components/chatbot/tool-results/ServiceCard.tsx:53-100` — Icon in render
- `src/components/voice/WaveformVisualizer.tsx:13-35` — Math.random in init
- `src/components/chatbot/demo/DemoOrchestrator.tsx:210` — Date.now in render

---

END OF REPORT
