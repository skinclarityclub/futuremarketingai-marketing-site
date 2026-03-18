# Pitfalls Research

**Domain:** Vite/React SPA to Next.js App Router migration
**Researched:** 2026-03-18
**Confidence:** HIGH (official docs + multiple community sources + codebase analysis)

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Slapping "use client" on everything to make it compile

**What goes wrong:**
When migrating 199 Framer Motion files and all Zustand-connected components, the fastest way to silence errors is adding `"use client"` to every file. The result is a fully client-rendered Next.js app that is functionally identical to the Vite SPA -- zero SEO benefit, bloated JS bundles, and the entire migration was pointless.

**Why it happens:**
The existing codebase has zero server components. Every component uses either Framer Motion, Zustand, hooks, or browser APIs. The path of least resistance is marking everything client. Developers do not realize the `"use client"` boundary cascades -- a single directive at a layout level forces every child into the client bundle.

**How to avoid:**
Establish the client/server boundary architecture BEFORE migrating any components. The correct pattern is:

1. Page-level files (`page.tsx`) are Server Components that handle metadata, data fetching, and SEO markup
2. Create thin `"use client"` wrapper components that receive server-fetched data as props
3. Push `"use client"` boundaries as deep as possible -- wrap only the interactive leaf, not the entire page
4. Static content sections (hero text, feature descriptions, pricing tables) stay server-rendered even if they sit next to animated elements

For this project: each service page (Automations, Chatbots, Voice Agents, Marketing Machine) should have a server-rendered `page.tsx` that exports metadata and renders static SEO content, with animated sections imported as client components.

**Warning signs:**

- More than 60% of files in `/app` have `"use client"` at the top
- `page.tsx` files contain `"use client"` (pages should almost never be client components)
- Layout files have `"use client"` (forces entire subtree client-side)
- Bundle analyzer shows JS bundle size comparable to the original SPA

**Phase to address:**
Phase 1 (Project scaffolding / architecture). Define the component boundary strategy before writing any migration code. Create a documented pattern with examples.

---

### Pitfall 2: Framer Motion hydration mismatches and layout shift

**What goes wrong:**
Framer Motion's `motion.*` components animate from an initial state (e.g., `opacity: 0, y: 20`) to a final state. The server renders the initial state as static HTML. When React hydrates on the client, Framer Motion immediately applies the animation, causing a visible flash or layout shift. This tanks CLS scores -- the exact metric the migration aims to improve.

With 199 files importing Framer Motion, this is the single largest CLS risk in the migration.

**Why it happens:**
Server-rendered HTML contains the element at its initial animation state (invisible, offset, scaled down). The client hydrates and Framer Motion snaps/animates it to the final state. The browser reports this as cumulative layout shift. Additionally, `AnimatePresence` and shared layout animations have known issues with the App Router (see Next.js issue #49279).

**How to avoid:**

1. Set `initial={false}` on above-the-fold animations so they render in their final state on both server and client -- no animation on first paint, animations only trigger on scroll or interaction
2. Use `whileInView` instead of mount-based animations for below-the-fold content -- these only fire when the user scrolls to them, so there is no server/client mismatch
3. Add `suppressHydrationWarning` to motion components that must animate on mount
4. For page transitions with `AnimatePresence`, wrap in a client component that only renders after mount using a `useEffect` + `useState` pattern
5. Reserve explicit dimensions (`min-height`, `aspect-ratio`) for animated containers to prevent CLS even during animation

**Warning signs:**

- CLS score above 0.1 in Lighthouse
- Visual flash/jump on page load (elements appearing then re-animating)
- Console hydration mismatch warnings mentioning style attributes
- `AnimatePresence` throwing errors about missing `layoutId`

**Phase to address:**
Phase 2 (Component migration). Create a `MotionWrapper` client component pattern before migrating any animated components. Test CLS on every page after migration.

---

### Pitfall 3: Zustand persist middleware causing hydration errors

**What goes wrong:**
Three Zustand stores in this project use `persist` middleware (chatbotStore, userPreferencesStore, personalizationStore). Persist reads from `localStorage` on initialization. Server renders with default state, client hydrates with localStorage state -- the mismatch crashes React or causes visible content flicker.

**Why it happens:**
`localStorage` does not exist on the server. Zustand's persist middleware tries to rehydrate from localStorage immediately. In a Vite SPA this was fine (no server render). In Next.js, the server renders with empty/default store values, then the client hydrates with stored values, creating a mismatch.

**How to avoid:**

1. Create a `StoreHydration` client component that wraps the app and calls `persist.rehydrate()` inside `useEffect` -- this delays rehydration until after initial hydration completes
2. Use `skipHydration: true` in Zustand persist config and manually trigger rehydration
3. For UI that depends on persisted state (e.g., language preference, chatbot history), render a loading skeleton on the server and swap in the real content after client hydration
4. Alternatively, use `useSyncExternalStore` with separate server/client snapshots

**Warning signs:**

- "Text content does not match server-rendered HTML" errors in console
- Chatbot showing empty state then flashing to previous conversation
- Language switching to stored preference after initial English render
- User preferences resetting visually on page load

**Phase to address:**
Phase 1 (Scaffolding). Set up the store hydration pattern in the root layout before any store-dependent components are migrated.

---

### Pitfall 4: i18next to next-intl migration — losing all translation files

**What goes wrong:**
The current setup uses i18next with HTTP backend loading translations from `/locales/{{lng}}/{{ns}}.json` with 10 namespaces across 3 languages (30+ JSON files). Next.js App Router has no built-in i18n support. Developers either: (a) try to keep i18next which works poorly with Server Components, or (b) switch to next-intl but underestimate the migration effort for 30+ translation files.

**Why it happens:**
i18next relies on browser-side language detection (`i18next-browser-languagedetector`) and HTTP-based translation loading -- both fundamentally client-side patterns incompatible with Server Components. The `import.meta.env` references in the i18n config also do not work in Next.js (which uses `process.env`).

**How to avoid:**

1. Switch to `next-intl` which is purpose-built for the App Router with Server Component support, middleware-based locale routing, and ~2KB bundle
2. Translation JSON files can be reused -- next-intl reads the same JSON structure, though namespace organization changes
3. Set up locale routing first: `[locale]` dynamic segment in the app directory, middleware for locale detection/redirect
4. Call `setRequestLocale(locale)` in every `page.tsx` and `layout.tsx` before using translations
5. Export `generateStaticParams` returning all supported locales for static generation
6. Convert `useTranslation('namespace')` calls to `useTranslations('namespace')` (similar API, different import)

**Warning signs:**

- Translations not loading on server-rendered pages (blank text on first paint)
- Locale URLs not working (`/nl/pricing` returning 404)
- Missing `generateStaticParams` causing build failures in static generation
- Language switcher not updating the URL path

**Phase to address:**
Phase 1 (Scaffolding). i18n routing and locale infrastructure must be in place before any page content is migrated, since every page depends on it.

---

### Pitfall 5: AI SDK streaming chatbot breaking in Route Handlers

**What goes wrong:**
The chatbot uses AI SDK's `streamText` with Anthropic provider, custom tools (17 tools), and persona routing. Moving this from a Vite API endpoint to Next.js Route Handlers introduces subtle issues: streaming responses not flushing properly, tools not serializing across the server/client boundary, and the `useChat` hook requiring specific Route Handler response formats.

**Why it happens:**
Vite's API endpoint (likely via Vercel serverless function) and Next.js Route Handlers handle streaming differently. The AI SDK expects specific patterns for App Router (`return result.toDataStreamResponse()` in Route Handlers). Tool definitions that worked as direct imports in a Vite endpoint may need restructuring for Next.js's module resolution. The 17-tool setup with per-page filtering adds complexity.

**How to avoid:**

1. Use AI SDK's official Next.js App Router pattern: Route Handler at `app/api/chat/route.ts` returning `result.toDataStreamResponse()`
2. Keep ALL chatbot logic server-side in the Route Handler -- tool definitions, persona routing, complexity detection
3. The client component uses `useChat` from `ai/react` pointing to the route handler -- this part barely changes
4. Test streaming with a minimal setup first (one tool, one persona) before migrating the full 17-tool configuration
5. Verify tool result serialization -- tool results must be JSON-serializable across the network boundary
6. Consider the AI SDK RSC approach for richer streaming UI, but only after the basic Route Handler pattern works

**Warning signs:**

- Streaming responses arriving as a single chunk instead of token-by-token
- Tool calls failing silently (no error, just no response)
- `useChat` not receiving updates (check the response content-type header)
- CORS errors if the route handler path does not match the `useChat` api parameter

**Phase to address:**
Mid-migration phase (after routing and basic pages are set up). The chatbot is the most complex feature and should be migrated as a dedicated effort, not mixed with page migration.

---

### Pitfall 6: Tailwind CSS v3 to v4 breaking the entire design system

**What goes wrong:**
The project constraint specifies Tailwind CSS 4. Tailwind v4 is a complete architecture change: JavaScript config (`tailwind.config.js`) is replaced by CSS-first configuration (`@theme` directive), the PostCSS plugin changes, import syntax changes, and custom design tokens must be redefined in CSS. The existing Living System design with custom colors (#050814, #0A0E27, #00D4FF, #A855F7, #00FF88) and typography (Inter, JetBrains Mono) needs manual re-mapping.

**Why it happens:**
Tailwind v4 is not a minor upgrade -- it is a fundamentally different configuration approach. The existing `tailwind.config.js` with theme extensions, custom colors, and responsive breakpoints cannot be copy-pasted. The three-part CSS import (`@tailwind base; @tailwind components; @tailwind utilities;`) is replaced with a single `@import "tailwindcss"`.

**How to avoid:**

1. Run the official Tailwind upgrade tool (`npx @tailwindcss/upgrade`) as a starting point, but expect manual fixes
2. Migrate the design tokens early: convert all custom theme values to `@theme` CSS variables
3. The old config file can be referenced temporarily via `@config "./tailwind.config.js"` in the CSS entry point during migration
4. Test every page visually after the Tailwind migration -- subtle spacing, color, and responsive changes are common
5. If the migration is too risky, stay on Tailwind v3 initially and upgrade later. Tailwind v3 works fine with Next.js 15.

**Warning signs:**

- Build errors mentioning PostCSS or Tailwind plugin incompatibility
- Colors appearing wrong (custom palette not loading)
- Responsive breakpoints behaving differently
- `@apply` directives failing with unknown utility errors

**Phase to address:**
Phase 1 (Scaffolding). Tailwind configuration must be solid before any component migration. Consider keeping Tailwind v3 for initial migration and upgrading to v4 as a separate step.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut                                               | Immediate Benefit                 | Long-term Cost                                                            | When Acceptable                                                 |
| ------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Keeping i18next instead of switching to next-intl      | Zero translation file changes     | No Server Component translation support, larger bundle, no locale routing | Never for App Router                                            |
| Using `"use client"` on page.tsx files                 | Fast migration, everything works  | Zero SEO benefit on those pages, defeats purpose of migration             | Never                                                           |
| Copying Vite components verbatim without restructuring | Fast migration                    | Tight coupling, no server/client separation, unmaintainable               | Only as temporary step with immediate refactor planned          |
| Skipping metadata/SEO on initial migration             | Ship faster                       | Delays the core value proposition, may never get done                     | Never -- SEO is the reason for migrating                        |
| Using `@config` to keep old tailwind.config.js         | Avoids Tailwind v4 learning curve | Technical debt, misses v4 performance gains                               | Acceptable as Phase 1 shortcut with planned v4 migration        |
| Suppressing all hydration warnings                     | Silence console noise             | Hides real bugs, CLS issues go undetected                                 | Never globally; acceptable per-component with documented reason |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration        | Common Mistake                                                            | Correct Approach                                                                                                              |
| ------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Calendly embed     | Loading the Calendly script globally in layout, causing CLS on every page | Load Calendly only in the modal component using `next/script` with `afterInteractive` strategy, reserve container dimensions  |
| AI SDK / Anthropic | Putting API keys in client-accessible environment variables               | Use `ANTHROPIC_API_KEY` (no `NEXT_PUBLIC_` prefix) -- Route Handlers are server-only, keys never reach the client             |
| Vercel Analytics   | Importing analytics in a Server Component                                 | Analytics must be in a Client Component or use Vercel's `@vercel/analytics` package which handles this correctly              |
| Sentry             | Using `import.meta.env` (Vite-specific) in Sentry config                  | Replace with `process.env` for Next.js; use `@sentry/nextjs` which has App Router support with separate client/server configs |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap                                                                                 | Symptoms                                                 | Prevention                                                                                                                    | When It Breaks                                                    |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Loading all 30+ translation JSON files on every page                                 | Slow initial page load, large network waterfall          | Use next-intl's per-page message loading, only load translations needed for current page                                      | Immediately noticeable with 3 languages x 10 namespaces           |
| Importing entire Framer Motion in every client component                             | Bundle size bloats to 100KB+ for animation library alone | Use `motion` from `framer-motion/m` (tree-shakeable) or lazy-load animation-heavy sections                                    | Noticeable when more than 20 animated components load on one page |
| Rendering the full chatbot component (17 tools, persona system) on initial page load | LCP penalty, TTI delay                                   | Lazy-load the chatbot panel with `dynamic(() => import(...), { ssr: false })`, server-render only the floating button trigger | Always -- the chatbot is heavy client-side JS                     |
| Static generation with `generateStaticParams` for all locale/page combinations       | Build time grows linearly with locales x pages           | Use ISR (Incremental Static Regeneration) for less-trafficked locale/page combinations                                        | At 3 locales x 15+ pages = 45+ static pages, build time adds up   |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake                                                        | Risk                                                                     | Prevention                                                                                                          |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Exposing Anthropic API key via `NEXT_PUBLIC_ANTHROPIC_API_KEY` | Anyone can use your API key, run up costs                                | Keep as `ANTHROPIC_API_KEY` (server-only), access only in Route Handlers                                            |
| Missing rate limiting on chatbot Route Handler                 | Abuse via automated requests burning API credits                         | Migrate existing rate limiter (`rate-limiter.ts`) to Route Handler, add IP-based throttling                         |
| Tool execution results leaking internal data                   | Chatbot tools may expose internal URLs, pricing logic, or system prompts | Sanitize all tool results before returning to client, never return raw error messages                               |
| Translation files exposing internal business logic             | Competitors can read all marketing copy from public JSON files           | Acceptable for marketing site, but do not put internal pricing formulas or unreleased features in translation files |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall                                                        | User Impact                                                    | Better Approach                                                                              |
| -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Full-page loading spinner during hydration                     | Feels slower than the original SPA despite better architecture | Server-render meaningful content (headlines, images, structure), hydrate interactivity after |
| Locale redirect flash (English loads, then redirects to Dutch) | Jarring experience, double page load                           | Use Next.js middleware to detect locale and redirect BEFORE the page renders                 |
| Chatbot losing conversation on page navigation                 | Users lose context when clicking between service pages         | Persist chatbot state in a layout-level client component that survives page transitions      |
| Animations replaying on every back/forward navigation          | Feels broken, not polished                                     | Use `initial={false}` for scroll-reveal animations and check if the element was already seen |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **SEO metadata:** Page renders correctly but `generateMetadata` not implemented -- verify with `curl -s URL | grep "<title>"` and check Open Graph tags
- [ ] **Locale routing:** `/en/pricing` works but `/pricing` does not redirect to default locale -- verify middleware redirect logic
- [ ] **Streaming chatbot:** Chat appears to work but responses arrive as single chunk -- verify with Network tab that response is chunked transfer encoding
- [ ] **Static generation:** Pages render but are not actually statically generated -- verify with `next build` output showing "SSG" markers, not "SSR"
- [ ] **Image optimization:** Images display but are not using `next/image` -- verify no `<img>` tags in production HTML
- [ ] **JSON-LD structured data:** Page has meta tags but no structured data -- verify with Google Rich Results Test
- [ ] **Sitemap:** `/sitemap.xml` exists but does not include all locale variants -- verify all `/en/`, `/nl/`, `/es/` URLs are listed with `hreflang`
- [ ] **robots.txt:** File exists but blocks crawlers from important paths -- verify with `curl URL/robots.txt`
- [ ] **Core Web Vitals:** Lighthouse scores green but CLS only measured on initial load -- verify with real user monitoring (Vercel Analytics) across navigation patterns
- [ ] **Chatbot tool results:** Chat responds but tool-augmented responses (booking, case studies, lead scoring) do not render cards -- verify each of the 17 tools produces visible UI

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall                           | Recovery Cost | Recovery Steps                                                                                                                                   |
| --------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| "use client" everywhere           | MEDIUM        | Audit all `"use client"` files, extract static content into Server Components one page at a time, starting with highest-traffic pages            |
| Framer Motion CLS                 | LOW           | Add `initial={false}` to above-fold animations, add container dimensions, measurable improvement within hours                                    |
| Zustand hydration errors          | LOW           | Add `skipHydration: true` to persist config, create hydration wrapper component, apply to all stores in one session                              |
| i18next kept instead of next-intl | HIGH          | Full rewrite of i18n layer, every component using `useTranslation` must change, all locale routing must be added. Avoid this by switching early. |
| Chatbot streaming broken          | MEDIUM        | Start with minimal Route Handler (one tool, no persona), verify streaming works, add complexity incrementally                                    |
| Tailwind v4 visual regressions    | MEDIUM        | Fall back to `@config` bridge, fix design tokens one category at a time (colors first, then spacing, then typography)                            |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall              | Prevention Phase                    | Verification                                                                              |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| "use client" overuse | Phase 1: Architecture & scaffolding | Audit: no `page.tsx` or `layout.tsx` has `"use client"`, bundle size under target         |
| Framer Motion CLS    | Phase 2: Component migration        | Lighthouse CLS < 0.1 on all pages, no hydration warnings in console                       |
| Zustand hydration    | Phase 1: Store setup                | No hydration errors in console, persisted state loads without flash                       |
| i18n migration       | Phase 1: Locale routing setup       | All three locales route correctly, translations load server-side                          |
| Chatbot streaming    | Phase 3: Feature migration          | Streaming works token-by-token, all 17 tools produce results, rate limiter active         |
| Tailwind v4          | Phase 1: Styling infrastructure     | All custom design tokens render correctly, visual regression test passes against old site |
| SEO metadata         | Phase 2: Page migration             | Every page has unique title, description, OG tags, JSON-LD verified                       |
| Sitemap / robots.txt | Phase 4: SEO finalization           | Google Search Console validates sitemap, all locale URLs indexed                          |

## Sources

- [Next.js official Vite migration guide](https://nextjs.org/docs/app/guides/migrating/from-vite) -- HIGH confidence
- [Next.js App Router migration guide](https://nextjs.org/docs/app/guides/migrating/app-router-migration) -- HIGH confidence
- [Next.js "use client" directive docs](https://nextjs.org/docs/app/api-reference/directives/use-client) -- HIGH confidence
- [Next.js hydration error reference](https://nextjs.org/docs/messages/react-hydration-error) -- HIGH confidence
- [Framer Motion + Next.js App Router issue #49279](https://github.com/vercel/next.js/issues/49279) -- HIGH confidence
- [Framer Motion SSR workaround patterns](https://medium.com/@dolce-emmy/resolving-framer-motion-compatibility-in-next-js-14-the-use-client-workaround-1ec82e5a0c75) -- MEDIUM confidence
- [RSC performance pitfalls - LogRocket](https://blog.logrocket.com/react-server-components-performance-mistakes) -- MEDIUM confidence
- [next-intl App Router documentation](https://next-intl.dev/docs/getting-started/app-router) -- HIGH confidence
- [AI SDK Next.js App Router getting started](https://ai-sdk.dev/docs/getting-started/nextjs-app-router) -- HIGH confidence
- [Zustand hydration fix patterns](https://medium.com/@judemiracle/fixing-react-hydration-errors-when-using-zustand-persist-with-usesyncexternalstore-b6d7a40f2623) -- MEDIUM confidence
- [Tailwind CSS v4 migration guide](https://dev.to/pockit_tools/tailwind-css-v4-migration-guide-everything-that-changed-and-how-to-upgrade-2026-5d4) -- MEDIUM confidence
- [Next.js Core Web Vitals optimization 2025](https://makersden.io/blog/optimize-web-vitals-in-nextjs-2025) -- MEDIUM confidence
- Codebase analysis: 199 files import Framer Motion, 3 Zustand stores use persist, 10 i18n namespaces x 3 locales, AI SDK with 17 tools -- HIGH confidence (direct observation)

---

_Pitfalls research for: Vite/React SPA to Next.js App Router migration_
_Researched: 2026-03-18_
