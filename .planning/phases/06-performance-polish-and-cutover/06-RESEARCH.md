# Phase 6: Performance, Polish, and Cutover - Research

**Researched:** 2026-03-18
**Domain:** Core Web Vitals optimization, structured data validation, cross-browser testing, Vercel domain cutover
**Confidence:** HIGH

## Summary

Phase 6 is the final validation and production-readiness phase for the Next.js migration. The site is feature-complete (Phases 1-5 done) and needs performance optimization to hit Core Web Vitals green scores, structured data validation with zero errors, sitemap/robots/hreflang verification, cross-browser testing, and domain cutover from the Vite site.

The project is well-positioned for good CWV scores: it uses Next.js 16 App Router with React Server Components (minimal client JS), next/font with `display: swap` (zero font-related CLS), static generation via `generateStaticParams`, and only 2 motion wrapper components marked "use client." The main optimization work will be lazy-loading the heavy chatbot bundle, validating all 9 JSON-LD schema types, and verifying hreflang across 3 locales x 14 pages (42 URL combinations).

**Primary recommendation:** Use `@next/bundle-analyzer` to identify the heaviest client bundles (likely chatbot + motion + react-calendly), apply `next/dynamic` with `ssr: false` to defer non-critical client islands, then validate all structured data with Google Rich Results Test and Schema Markup Validator before domain cutover.

<phase_requirements>

## Phase Requirements

| ID     | Description                                                    | Research Support                                                                                                                                   |
| ------ | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEO-13 | Core Web Vitals green scores (LCP <2.5s, INP <200ms, CLS <0.1) | Bundle analysis, dynamic imports for chatbot/calendly, font optimization verified, image optimization via next/image, Lighthouse auditing workflow |

</phase_requirements>

## Standard Stack

### Core (Already Installed)

| Library                | Version   | Purpose                                                        | Why Standard       |
| ---------------------- | --------- | -------------------------------------------------------------- | ------------------ |
| next                   | 16.1.7    | Framework with built-in image/font/code-splitting optimization | Project framework  |
| motion                 | 12.38.0   | Animations via MotionDiv/ScrollReveal client components        | Already integrated |
| react-calendly         | 4.4.0     | Calendly modal integration                                     | Already integrated |
| ai + @ai-sdk/anthropic | 6.x / 3.x | Chatbot streaming                                              | Already integrated |

### Supporting (Add for This Phase)

| Library               | Version    | Purpose                                     | When to Use                               |
| --------------------- | ---------- | ------------------------------------------- | ----------------------------------------- |
| @next/bundle-analyzer | latest     | Visualize client/server bundle sizes        | During optimization to find heavy bundles |
| lighthouse            | 12.x (CLI) | Local CWV auditing against production build | Verification of LCP/INP/CLS targets       |

### No New Libraries Needed

This phase is primarily about configuration, optimization, and validation -- not adding features. All tooling is either built into Next.js or available as CLI tools.

**Installation:**

```bash
npm install --save-dev @next/bundle-analyzer
```

Lighthouse is run via Chrome DevTools or `npx lighthouse` -- no install needed.

## Architecture Patterns

### Current Architecture (Favorable for CWV)

The project already follows server-first architecture:

```
fmai-nextjs/src/
  app/[locale]/          # All pages are Server Components (SSG via generateStaticParams)
  components/
    seo/                 # 9 JSON-LD components (server-rendered)
    layout/              # Header (server) + HeaderClient (client island for locale switcher)
    chatbot/             # Heavy client island (~20 "use client" files)
    interactive/         # CalendlyIsland, CookieConsentBanner (client)
    motion/              # MotionDiv, ScrollReveal, AnimatePresenceWrapper (client wrappers)
    ui/                  # GlassCard, CTAButton, etc. (server components)
```

### Pattern 1: Dynamic Import for Heavy Client Islands

**What:** Use `next/dynamic` with `ssr: false` to lazy-load the chatbot widget and Calendly modal, deferring their JavaScript from the initial page load.
**When to use:** For components that are not visible on initial render (floating chatbot button, modal dialogs).
**Example:**

```typescript
// Source: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
import dynamic from 'next/dynamic'

const ChatWidgetIsland = dynamic(() => import('@/components/chatbot/ChatWidgetIsland'), {
  ssr: false,
})

const CalendlyIsland = dynamic(() => import('@/components/interactive/CalendlyIsland'), {
  ssr: false,
})
```

**Impact:** The chatbot bundle (AI SDK + streaming + 17 tool components + Zustand store) is the single largest client bundle. Lazy-loading it removes it from the critical rendering path, directly improving LCP and INP.

### Pattern 2: Bundle Analyzer Configuration

**What:** Add `@next/bundle-analyzer` to next.config.ts for on-demand analysis.
**Example:**

```typescript
// next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer'

const analyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Wrap outermost: analyze(withNextIntl(withMDX(nextConfig)))
```

Run with: `ANALYZE=true npm run build`

### Pattern 3: Lighthouse Audit Workflow

**What:** Run Lighthouse against production build (`next build && next start`) to get accurate CWV scores.
**Workflow:**

1. `npm run build` -- production build
2. `npm run start` -- serve on localhost:3000
3. Open Chrome DevTools > Lighthouse > run audit on each page
4. Or: `npx lighthouse http://localhost:3000/en --output json --output html`

### Anti-Patterns to Avoid

- **Testing CWV in dev mode:** `next dev` includes dev tooling, HMR, and unoptimized bundles. Always test against `next build && next start`.
- **Optimizing before measuring:** Run bundle analyzer and Lighthouse FIRST to identify actual bottlenecks, not assumed ones.
- **Adding `loading="eager"` to images:** next/image already handles lazy-loading correctly. Only the LCP image (hero) should be eager/priority.
- **Inlining all translations:** The project loads all messages in the locale layout via `getMessages()`. For a 14-page site this is fine -- do NOT prematurely split message bundles.

## Don't Hand-Roll

| Problem                    | Don't Build                  | Use Instead                                                                  | Why                                                      |
| -------------------------- | ---------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------- |
| Bundle size analysis       | Custom webpack stats parser  | `@next/bundle-analyzer`                                                      | Visual treemap, maintained by Vercel                     |
| CWV measurement            | Custom performance observers | Lighthouse CLI / Chrome DevTools                                             | Industry standard, same tool Google uses                 |
| Structured data validation | Manual JSON-LD inspection    | Google Rich Results Test (online) + Schema Markup Validator                  | Authoritative validation against Google's actual parsing |
| Hreflang verification      | Manual URL checking          | `npx next build` output + manual sitemap.xml inspection                      | Build output shows all generated routes                  |
| Cross-browser testing      | Custom test harness          | Manual browser testing (Chrome/Firefox/Safari/Edge)                          | 14 pages x 4 browsers = 56 checks, manageable manually   |
| Image optimization         | Custom image pipeline        | `next/image` (already used via OG images)                                    | Built into Next.js, serves WebP/AVIF automatically       |
| Font optimization          | Custom font loading strategy | `next/font` (already configured with DM Sans, JetBrains Mono, Space Grotesk) | Zero CLS from font swap, subset automatically            |

**Key insight:** Next.js 16 handles most performance optimization automatically (code splitting, image optimization, font subsetting, static generation). Phase 6 is about verifying the built-in optimizations work correctly and fixing the few areas where manual intervention is needed (chatbot lazy-loading, priority hints).

## Common Pitfalls

### Pitfall 1: ChatWidget Blocking Initial Load

**What goes wrong:** The ChatWidgetIsland is statically imported in the locale layout, meaning its entire dependency tree (AI SDK, streaming, tool components, Zustand store) is bundled into the initial page load for every page.
**Why it happens:** The chatbot was wired in during Phase 3 as a direct import for simplicity.
**How to avoid:** Convert to `next/dynamic` with `ssr: false` in the locale layout. The floating button can show a skeleton or appear after hydration.
**Warning signs:** Large First Load JS in build output, high TBT in Lighthouse.

### Pitfall 2: ScrollReveal Causing CLS

**What goes wrong:** ScrollReveal components that animate elements from `opacity: 0` to `opacity: 1` with vertical translation can cause CLS if the element's space isn't reserved before animation triggers.
**Why it happens:** IntersectionObserver-based reveal fires after layout, potentially shifting content below.
**How to avoid:** Ensure ScrollReveal wrapper preserves the element's dimensions even before animation (no `display: none`, use `opacity: 0` + `transform` only which don't affect layout). Verify the current ScrollReveal implementation already does this.
**Warning signs:** CLS > 0.1 on pages with many ScrollReveal sections.

### Pitfall 3: CookieConsentBanner Causing CLS

**What goes wrong:** Cookie consent banner appears after hydration, pushing page content up or down.
**Why it happens:** The banner is client-rendered and appears after JavaScript loads.
**How to avoid:** Ensure the banner uses `position: fixed` or `position: sticky` at bottom of viewport so it overlays rather than pushes content. Verify current implementation.
**Warning signs:** CLS spike shortly after page load.

### Pitfall 4: Missing `priority` on LCP Images

**What goes wrong:** The Largest Contentful Paint element (typically the hero heading or any hero image) loads slowly because all images default to `loading="lazy"`.
**Why it happens:** next/image lazy-loads by default, which is correct for below-fold images but wrong for the LCP element.
**How to avoid:** Add `priority` prop to any `<Image>` component that is above the fold on the homepage. For text-only heroes (which this project uses), LCP is likely the `<h1>` text, so font loading speed (already optimized with next/font `display: swap`) is the key factor.
**Warning signs:** LCP > 2.5s with "image was lazy-loaded" in Lighthouse diagnostics.

### Pitfall 5: Vercel Domain Cutover Without SSL Pre-Generation

**What goes wrong:** Downtime during domain cutover because SSL certificate isn't ready when DNS propagates.
**Why it happens:** Vercel needs to provision SSL for the custom domain, which takes time if not pre-configured.
**How to avoid:** Add the custom domain in Vercel dashboard BEFORE changing DNS. Vercel will attempt to provision SSL using HTTP challenge or TXT record verification. Only switch DNS after SSL is verified.
**Warning signs:** Users see SSL errors for 10-30 minutes after DNS change.

### Pitfall 6: Testing Lighthouse on Dev Instead of Production Build

**What goes wrong:** Scores are terrible because dev mode includes HMR, source maps, unminified code.
**Why it happens:** Developers test `localhost:3000` during `next dev` instead of production build.
**How to avoid:** Always run `npm run build && npm run start` and test against that.
**Warning signs:** Performance score < 50 on a simple SSG page.

### Pitfall 7: Hreflang Self-Referencing Missing

**What goes wrong:** Google reports hreflang errors because pages don't include a self-referencing hreflang tag.
**Why it happens:** Developers only add alternates for OTHER locales, not the current one.
**How to avoid:** The current `generatePageMetadata` should include all 3 locales (en, nl, es) in alternates including self. Verify the sitemap.xml output includes all locale URLs for each page.
**Warning signs:** Google Search Console hreflang errors after indexing.

## Code Examples

### Dynamic Import for ChatWidget in Locale Layout

```typescript
// src/app/[locale]/layout.tsx
import dynamic from 'next/dynamic'

// Lazy-load heavy client islands
const ChatWidgetIsland = dynamic(() => import('@/components/chatbot/ChatWidgetIsland'), {
  ssr: false,
})

const CalendlyIsland = dynamic(() => import('@/components/interactive/CalendlyIsland'), {
  ssr: false,
})

// In JSX, replace static imports with these dynamic versions
```

### Bundle Analyzer Setup

```typescript
// next.config.ts addition
import withBundleAnalyzer from '@next/bundle-analyzer'

const analyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Outermost wrapper
export default analyze(withNextIntl(withMDX(nextConfig)))
```

### Lighthouse CLI Command

```bash
# Build and serve production
npm run build && npm run start &

# Run Lighthouse on key pages
npx lighthouse http://localhost:3000/en --output html --output-path ./lighthouse-home.html
npx lighthouse http://localhost:3000/en/chatbots --output html --output-path ./lighthouse-chatbots.html
npx lighthouse http://localhost:3000/en/blog --output html --output-path ./lighthouse-blog.html
```

### Structured Data Validation

Validate all JSON-LD by:

1. Deploy to Vercel preview (or use `ngrok` for local)
2. Run each page URL through https://search.google.com/test/rich-results
3. Check for zero errors on all schema types:
   - Organization (all pages via layout)
   - WebSite (homepage)
   - WebPage (all subpages)
   - Service (4 service pages)
   - BreadcrumbList (all pages)
   - FAQPage (service pages)
   - HowTo (how-it-works page)
   - Article (blog posts)

### Hreflang Verification

```bash
# After build, verify sitemap covers all locale/page combinations
# Expected: 14 pages x 3 locales = 42 entries (plus blog posts)
curl http://localhost:3000/sitemap.xml | grep -c "<url>"

# Check a specific entry has all 3 alternates
curl http://localhost:3000/sitemap.xml | grep -A 10 "automations"
```

## State of the Art

| Old Approach                 | Current Approach                 | When Changed      | Impact                                                                   |
| ---------------------------- | -------------------------------- | ----------------- | ------------------------------------------------------------------------ |
| FID (First Input Delay)      | INP (Interaction to Next Paint)  | March 2024        | INP measures full interaction lifecycle, not just delay. Harder to pass. |
| `framer-motion` package name | `motion` package name            | motion v12 (2024) | Project already uses `motion/react` imports correctly                    |
| Manual font optimization     | `next/font` automatic            | Next.js 13+       | Zero CLS from fonts, automatic subsetting                                |
| Manual image srcset          | `next/image` automatic           | Next.js 10+       | Automatic WebP/AVIF, lazy loading, CLS prevention                        |
| Webpack-only bundle analysis | Turbopack support (experimental) | Next.js 15+       | @next/bundle-analyzer works with both                                    |

## Cross-Browser Testing Strategy

The site must render correctly in Chrome, Firefox, Safari, and Edge. Key areas to check:

| Area                            | Chrome       | Firefox      | Safari                 | Edge         | Risk Level |
| ------------------------------- | ------------ | ------------ | ---------------------- | ------------ | ---------- |
| CSS @theme (Tailwind v4)        | Full support | Full support | Full support           | Full support | LOW        |
| CSS backdrop-filter (GlassCard) | Full support | Full support | -webkit- prefix needed | Full support | MEDIUM     |
| Motion animations               | Full support | Full support | Full support           | Full support | LOW        |
| Streaming (chatbot)             | Full support | Full support | Full support           | Full support | LOW        |
| next/font                       | Full support | Full support | Full support           | Full support | LOW        |
| Calendly embed                  | Full support | Full support | Full support           | Full support | LOW        |

**Primary risk:** Safari `-webkit-backdrop-filter`. Tailwind v4 should handle vendor prefixes automatically via Lightning CSS, but verify GlassCard rendering in Safari.

## Domain Cutover Checklist

For migrating from the Vite site to the Next.js site on Vercel:

1. **Pre-cutover (same Vercel project or new):**
   - Deploy Next.js build to Vercel preview URL
   - Run full Lighthouse audit on preview URL
   - Validate all JSON-LD on preview URL via Rich Results Test
   - Verify sitemap.xml and robots.txt are accessible
   - Test all 3 locales route correctly

2. **Domain setup:**
   - Add custom domain in Vercel dashboard for the Next.js project
   - Pre-generate SSL certificate (Vercel does this automatically when domain is added)
   - Wait for SSL verification before DNS change

3. **DNS cutover:**
   - Update A record (apex) or CNAME (subdomain) to point to Vercel
   - Keep old hosting active for 48 hours during DNS propagation

4. **Post-cutover verification:**
   - Verify all pages load with HTTPS
   - Verify locale routing works (/, /en/, /nl/, /es/)
   - Verify sitemap.xml is accessible at new domain
   - Submit updated sitemap to Google Search Console
   - Monitor Core Web Vitals in Search Console for 7 days

## Open Questions

1. **Current Vercel deployment setup**
   - What we know: Project deploys to Vercel, domain is futuremarketingai.com
   - What's unclear: Whether the Next.js project is a separate Vercel project or will replace the existing one
   - Recommendation: Clarify during planning -- if same project, just push new code. If separate, need domain transfer between projects.

2. **Bundle size of chatbot dependency tree**
   - What we know: The chatbot has ~20 "use client" files plus AI SDK, streaming logic, and tool components
   - What's unclear: Exact bundle size impact on initial load
   - Recommendation: Run bundle analyzer as FIRST task in this phase to get actual numbers before optimizing.

3. **Safari backdrop-filter behavior with Tailwind v4**
   - What we know: Tailwind v4 uses Lightning CSS which handles vendor prefixes
   - What's unclear: Whether all GlassCard components render correctly in Safari
   - Recommendation: Include Safari testing as explicit verification step.

## Sources

### Primary (HIGH confidence)

- Next.js 16 official docs -- lazy loading, bundle analyzer, image optimization, font optimization
- Google Rich Results Test -- https://search.google.com/test/rich-results
- Vercel zero-downtime migration guide -- https://vercel.com/kb/guide/zero-downtime-migration

### Secondary (MEDIUM confidence)

- https://markaicode.com/optimize-core-web-vitals-nextjs-16-lighthouse-12/ -- Next.js 16 + Lighthouse 12 optimization guide
- https://dev.to/studiomeyer-io/core-web-vitals-2026-performance-optimization-for-better-google-rankings-16d6 -- CWV 2026 overview
- https://github.com/GoogleChrome/lighthouse-ci -- Lighthouse CI for automated auditing

### Tertiary (LOW confidence)

- None -- all findings verified against official docs or multiple sources

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- project already uses Next.js 16 with all optimization primitives built in
- Architecture: HIGH -- server-first pattern already in place, optimization is surgical (chatbot lazy-loading)
- Pitfalls: HIGH -- well-documented patterns for Next.js CWV optimization
- Cross-browser: MEDIUM -- Tailwind v4 with Lightning CSS is newer, Safari vendor prefix handling needs verification
- Domain cutover: HIGH -- Vercel's domain management is well-documented

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable domain, Next.js 16 is current)
