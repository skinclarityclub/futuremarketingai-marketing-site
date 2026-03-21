# Codebase Concerns

**Analysis Date:** 2026-03-21

## Tech Debt

**Entire old Vite project still in repository root (HIGH):**

- Issue: The original Vite/React SPA (442 source files) remains alongside the active Next.js project (`fmai-nextjs/`). Root-level `src/`, `dist/`, `public/`, `node_modules/`, config files (`vite.config.ts`, `tailwind.config.js`, `tsconfig.json`, `postcss.config.js`, `playwright.config.ts`), and the old `package.json` (with 40+ dependencies including Three.js, GSAP, D3, Storybook, etc.) are all still present.
- Files: `src/` (442 .ts/.tsx files, 4.8 MB), `dist/` (15 MB), `package.json` (root), `vite.config.ts`, `vite.config.analyze.ts`, `tailwind.config.js`, `tsconfig.json`, `tsconfig.node.json`, `tsconfig.api.json`, `postcss.config.js`, `playwright.config.ts`, `index.html`, `.eslintrc.cjs`, `.eslintrc.override.cjs`, `.storybook/`, `api/`, `scripts/`, `tests/e2e/` (old Vite tests)
- Impact: Confusing dual-project layout. Root `node_modules/` installs ~40 unused dependencies. Any tooling running from root may pick up wrong config. Bloats git history and clone size.
- Fix approach: Delete `src/`, `dist/`, `public/`, `coverage/`, `playwright-report/`, `test-results/`, old config files, old `package.json`/`package-lock.json`, `node_modules/` (root), `.storybook/`, `api/`, `scripts/`, `tests/`. Move `fmai-nextjs/` contents to root, or keep as subdirectory but remove old project entirely.

**211 orphaned markdown audit/task documents at repository root (HIGH):**

- Issue: Over 200 `.md` files from the old Vite-era project remain at the repo root (90,000+ lines total). These include old audit reports, task summaries, mobile optimization docs, i18n tracking, and session summaries that are no longer relevant to the Next.js project.
- Files: `ACCESSIBILITY-AUDIT-WCAG-2-2-AA-2025.md`, `AI-CHATBOT-*.md` (12 files), `I18N-*.md` (25+ files), `MOBILE-*.md` (30+ files), `TASK-*.md` (10+ files), `SESSION-SUMMARY-*.md`, etc.
- Impact: Clutters repository, confuses contributors, inflates clone size. Some may contain outdated architectural decisions that conflict with current Next.js patterns.
- Fix approach: Archive to `.planning-archive-website/` (which already exists but is empty) or delete entirely. Keep only `CLAUDE.md`, `README.md`, `DEPLOYMENT.md` if still relevant.

**55+ screenshot PNG files at repository root (MEDIUM):**

- Issue: Old comparison screenshots from Vite-to-Next.js migration remain at root level.
- Files: `vite-*.png` (18 files), `next-*.png` (18 files), `new-*.png` (6 files), `order-*.png` (5 files)
- Impact: ~10+ MB of binary files in git history. No longer serve any purpose.
- Fix approach: Delete all `*.png` files from repository root.

**Old utility scripts at repository root (LOW):**

- Issue: CJS/JS scripts from the Vite era remain: `check-keys.js`, `check-vite-nav.cjs`, `compare-layouts.cjs`, `verify-new-skills.cjs`, `verify-order.cjs`, `lighthouse.config.js`, `.lighthouserc.js`, `.lighthouserc.json`
- Files: Listed above, all at repository root
- Impact: Dead code, potential confusion
- Fix approach: Delete all old scripts

**Orphaned persona files in chatbot engine (MEDIUM):**

- Issue: Six persona definition files exist (`concierge.ts`, `demo-guide.ts`, `flagship.ts`, `ecommerce.ts`, `leadgen.ts`, `support.ts`) but only `clyde.ts` is imported via the personas index. The other files each call `registerPersona()` but are never imported, so they never execute.
- Files: `fmai-nextjs/src/lib/chatbot/personas/concierge.ts`, `fmai-nextjs/src/lib/chatbot/personas/demo-guide.ts`, `fmai-nextjs/src/lib/chatbot/personas/flagship.ts`, `fmai-nextjs/src/lib/chatbot/personas/ecommerce.ts`, `fmai-nextjs/src/lib/chatbot/personas/leadgen.ts`, `fmai-nextjs/src/lib/chatbot/personas/support.ts`
- Impact: Dead code. The engine references persona IDs like `'flagship'` in `fmai-nextjs/src/lib/chatbot/engine.ts:177` but only Clyde is registered. DemoPlayground uses persona IDs `ecommerce`, `leadgen`, `support`, `concierge` but sends them to the API as `personaId` -- this would fail with "Unknown persona" if those IDs are actually sent to the engine. Related knowledge bases (`fmai-nextjs/src/lib/chatbot/knowledge/`) and tool files (`fmai-nextjs/src/lib/chatbot/tools/`) are also dead.
- Fix approach: Either import all needed personas in `fmai-nextjs/src/lib/chatbot/personas/index.ts`, or remove unused files. Verify which persona IDs the DemoPlayground actually sends to the API.

**DemoPlayground uses same starters/welcome for all personas (MEDIUM):**

- Issue: All four demo persona tabs use `CLYDE_STARTERS` and hardcoded English welcome messages. The persona selector displays different names but the chat behavior is identical.
- Files: `fmai-nextjs/src/components/chatbot/DemoPlayground.tsx:12-35`
- Impact: Demo playground appears to offer 4 distinct personas but they all behave the same. Welcome messages and persona names are hardcoded English strings, bypassing i18n.
- Fix approach: Either differentiate the demo personas (import distinct starters/configs) or simplify to a single demo chatbot. Extract hardcoded strings to translation keys.

**Contact form only logs submissions (MEDIUM):**

- Issue: The contact form API route validates and rate-limits but only `console.log`s the submission. No email is sent.
- Files: `fmai-nextjs/src/app/api/contact/route.ts:86-95`
- Impact: Contact form submissions are lost on every deployment/restart. Users see "Thank you" but no one receives their message.
- Fix approach: Integrate Resend, SendGrid, or similar email service. The TODO comment on line 95 acknowledges this.

**Hardcoded English strings in service pages (MEDIUM):**

- Issue: Several service pages have hardcoded English strings that bypass the `next-intl` translation system. These will not translate when the locale changes to `nl` or `es`.
- Files:
  - `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx:182-186` - SocialProof quote, author, role, company
  - `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx:204-207` - "The Evolution of Marketing", subtitle
  - `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx:216` - "See the Marketing Machine in Action"
  - `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx:224-227` - "Choose Your Plan", subtitle, "Get Started"
  - `fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx:241,252` - "Automation Dashboard Preview", "Get Started"
  - `fmai-nextjs/src/app/[locale]/(services)/voice-agents/page.tsx:210` - "Get Started"
  - `fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx:228` - "Get Started"
- Impact: Broken i18n for service pages. Dutch/Spanish visitors see English headings and CTAs.
- Fix approach: Extract all hardcoded strings to `next-intl` translation keys in `fmai-nextjs/messages/en.json`, `nl.json`, `es.json`.

**Hardcoded English strings in header navigation (MEDIUM):**

- Issue: The `SKILL_CATEGORIES` and `NAV_ITEMS` arrays in `HeaderClient.tsx` contain hardcoded English labels, descriptions, and the "Meet Clyde" / "Try your AI employee live" CTA text. These do not use `useTranslations`.
- Files: `fmai-nextjs/src/components/layout/HeaderClient.tsx:27-98`, `fmai-nextjs/src/components/layout/HeaderClient.tsx:252-257`
- Impact: Navigation menu is English-only regardless of locale.
- Fix approach: Use `useTranslations('nav')` and move all nav strings to translation files.

**Hardcoded pricing data in service pages (MEDIUM):**

- Issue: Pricing tiers (names, prices, features) are hardcoded as TypeScript constants in each service page rather than coming from translation files or a shared config.
- Files:
  - `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx:64-100`
  - `fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx:81-114`
  - Voice agents page (similar pattern)
- Impact: Pricing cannot be localized. Changes require editing each page individually. Feature descriptions are English-only.
- Fix approach: Move pricing data to translation files or a shared pricing config that supports localization.

**Services pages are orphaned from navigation (LOW):**

- Issue: The `(services)` route group contains 4 pages (`/chatbots`, `/marketing-machine`, `/voice-agents`, `/automations`) but the header navigation links exclusively to `(skills)` pages. The service pages cross-link to each other but are not reachable from the main nav.
- Files: `fmai-nextjs/src/app/[locale]/(services)/`, `fmai-nextjs/src/components/layout/HeaderClient.tsx:93-98`
- Impact: Service pages exist but have no navigation path from the header. They may still be indexed by search engines or linked from external sources.
- Fix approach: Either remove the service pages, redirect them to corresponding skill pages, or add them back to navigation. Clarify the relationship between "services" and "skills".

## Security Considerations

**CORS wildcard on contact API (LOW):**

- Risk: `Access-Control-Allow-Origin: '*'` allows any website to submit the contact form.
- Files: `fmai-nextjs/src/app/api/contact/route.ts:45`
- Current mitigation: Rate limiting (3 requests/minute per IP)
- Recommendations: Restrict to the production domain. Add CSRF protection or honeypot field.

**In-memory rate limiting resets on deploy (MEDIUM):**

- Risk: Both the chatbot engine and contact form use in-memory `Map` objects for rate limiting. These reset on every deployment, cold start, or serverless function recycle.
- Files: `fmai-nextjs/src/lib/chatbot/rate-limiter.ts:24`, `fmai-nextjs/src/app/api/contact/route.ts:12`
- Current mitigation: None -- rate limits are ephemeral
- Recommendations: Use Vercel KV, Upstash Redis, or similar persistent store for rate limiting in production. For a demo site the current approach may be acceptable, but document this limitation.

**Anthropic API key exposure risk (LOW):**

- Risk: The `ANTHROPIC_API_KEY` is used server-side only (correct), but there is no spending cap or usage monitoring.
- Files: `fmai-nextjs/src/lib/chatbot/engine.ts:80`
- Current mitigation: Rate limiting (in-memory), input validation, 500-char message limit
- Recommendations: Set Anthropic API spending limits. Monitor usage via Anthropic dashboard. Consider adding a session-based conversation limit that persists across deploys.

**ElevenLabs agent ID exposed client-side (LOW):**

- Risk: `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` is a public env var exposed in client bundles.
- Files: `fmai-nextjs/src/hooks/useElevenLabsCall.ts:52,84`
- Current mitigation: The hook gracefully degrades when unavailable
- Recommendations: This is expected for client-side SDK integrations, but ensure the ElevenLabs agent has its own usage limits configured.

## Performance Bottlenecks

**Spline 3D runtime loaded on homepage (MEDIUM):**

- Problem: `@splinetool/react-spline` and `@splinetool/runtime` are dependencies that load a heavy 3D runtime.
- Files: `fmai-nextjs/src/components/hero/HeroSpline.tsx`, `fmai-nextjs/src/components/ui/splite.tsx`
- Cause: Spline runtime is a large JavaScript bundle that may block interactivity.
- Improvement path: Lazy-load with `next/dynamic` and `{ ssr: false }`. Consider showing a static fallback image during loading. Verify these components are actually used on rendered pages.

**Six knowledge base files loaded on every chatbot request (LOW):**

- Problem: Each persona file imports its full knowledge base. The engine imports `./personas` which side-effect-registers all personas (currently just Clyde, but if expanded, all KBs load into memory).
- Files: `fmai-nextjs/src/lib/chatbot/knowledge/*.ts` (6 files, ~225 lines each)
- Cause: Side-effect import pattern loads everything at module evaluation time.
- Improvement path: Lazy-load knowledge bases on-demand when a specific persona is requested.

**HeaderClient.tsx is the largest component (409 lines) (LOW):**

- Problem: Single client component handling logo, desktop nav, mobile nav, skills dropdown, locale switching, all scroll/keyboard listeners.
- Files: `fmai-nextjs/src/components/layout/HeaderClient.tsx`
- Cause: Everything consolidated into one "use client" component.
- Improvement path: Extract dropdown menu, mobile drawer, and locale switcher into separate components. Reduces re-render scope and improves code maintainability.

## Fragile Areas

**Chatbot persona registration system:**

- Files: `fmai-nextjs/src/lib/chatbot/personas/index.ts`, `fmai-nextjs/src/lib/chatbot/persona-router.ts`, `fmai-nextjs/src/lib/chatbot/engine.ts`
- Why fragile: The system relies on side-effect imports to register personas. Only `./clyde` is imported in the index, but the engine code references `'flagship'` on line 177. If a persona ID is sent that is not registered, the request returns a 404 error. The DemoPlayground sends persona IDs (`ecommerce`, `leadgen`, `support`, `concierge`) that may not be registered.
- Safe modification: Always verify that any persona ID referenced in frontend components is imported in `fmai-nextjs/src/lib/chatbot/personas/index.ts`. Add the import before adding UI references.
- Test coverage: No unit tests exist for the chatbot engine or persona registration.

**Service pages with duplicated pricing data:**

- Files: `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx`, `fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx`, `fmai-nextjs/src/app/[locale]/(services)/voice-agents/page.tsx`, `fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx`
- Why fragile: Each service page defines its own `PRICING_TIERS` array with hardcoded prices and features. A pricing change requires updating 4 files independently with no shared source of truth.
- Safe modification: Update all 4 pages simultaneously when changing pricing. Better: extract to shared config.
- Test coverage: No tests verify pricing consistency across pages.

## Test Coverage Gaps

**No unit tests in the Next.js project (HIGH):**

- What's not tested: There are zero unit tests in `fmai-nextjs/src/`. The project only has E2E tests via Playwright.
- Files: `fmai-nextjs/tests/e2e/` (9 spec files), no unit test files in `fmai-nextjs/src/`
- Risk: Chatbot engine logic (security validation, rate limiting, topic routing, prompt building) has no unit tests. Any refactoring is high-risk.
- Priority: High -- the chatbot engine handles user input, API key usage, and rate limiting. These are critical paths that should have unit test coverage.

**E2E tests may reference old Vite routes (MEDIUM):**

- What's not tested: Old E2E tests at `tests/e2e/` (root level) reference the Vite app. The newer `fmai-nextjs/tests/e2e/` tests may not cover the skills pages or service pages.
- Files: `tests/e2e/` (root, 7 old spec files), `fmai-nextjs/tests/e2e/` (9 spec files)
- Risk: Old tests pass against wrong app. New tests may have gaps.
- Priority: Medium -- verify `fmai-nextjs/tests/e2e/` tests target correct routes.

## Dependencies at Risk

**Dual `node_modules` installation (HIGH):**

- Risk: Root `package.json` installs ~75 dependencies (including Three.js, GSAP, D3, Storybook, Framer Motion, etc.) that are not used by the active Next.js project. `fmai-nextjs/package.json` has its own clean dependency set.
- Impact: Confusing `npm install` behavior. Root lockfile may conflict. CI/CD may install wrong dependencies.
- Migration plan: Delete root `package.json`, `package-lock.json`, and `node_modules/`. Only `fmai-nextjs/` should have dependencies.

**`setInterval` in module scope (LOW):**

- Risk: Both `fmai-nextjs/src/lib/chatbot/rate-limiter.ts:102-110` and `fmai-nextjs/src/app/api/contact/route.ts:35-42` use `setInterval` at module scope for cleanup. In serverless environments, these timers may not behave as expected.
- Impact: Memory leak potential if rate limit maps grow without cleanup in long-lived server processes.
- Migration plan: Replace with request-time cleanup or use a proper cache with TTL (e.g., Vercel KV).

## Missing Critical Features

**No email delivery for contact form:**

- Problem: Contact form submissions are `console.log`'d and discarded.
- Blocks: Cannot receive customer inquiries through the website.
- Files: `fmai-nextjs/src/app/api/contact/route.ts:86-95`

**No analytics integration in Next.js project:**

- Problem: The old Vite project had `react-ga4` but the Next.js project has no analytics dependency or implementation.
- Blocks: No visitor tracking, conversion measurement, or behavior analytics.
- Files: `fmai-nextjs/package.json` (no analytics dependency)

---

_Concerns audit: 2026-03-21_
