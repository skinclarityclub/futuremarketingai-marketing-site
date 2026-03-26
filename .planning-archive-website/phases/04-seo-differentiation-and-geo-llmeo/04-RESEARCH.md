# Phase 4: SEO Differentiation and GEO/LLMEO - Research

**Researched:** 2026-03-18
**Domain:** FAQPage/HowTo JSON-LD schema, GEO content patterns, llms.txt/llms-full.txt, dynamic OG image generation with Next.js ImageResponse
**Confidence:** HIGH

<phase_requirements>

## Phase Requirements

| ID        | Description                                                                    | Research Support                                                                                                               |
| --------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| SEO-11    | Open Graph images for all pages (static or generated)                          | opengraph-image file convention + ImageResponse API covers static fallbacks; one root-level file covers all pages by default   |
| SEO-12    | Dynamic OG image generation with Satori for branded social previews            | `next/og` ImageResponse builds on Satori; place `opengraph-image.tsx` per route segment with locale param                      |
| SCHEMA-06 | FAQPage JSON-LD with 5-8 FAQ items per service page                            | FAQPage requires `mainEntity` array of Question objects with `name` + `acceptedAnswer.text`; reuse existing `JsonLd` component |
| SCHEMA-07 | HowTo JSON-LD on How It Works page                                             | HowTo requires `name` + `step[]` of HowToStep with `text`; inject via `JsonLd` in how-it-works page                            |
| GEO-01    | llms.txt at domain root with site summary and key page links                   | Static file at `public/llms.txt`; markdown H1 + blockquote + H2-grouped link lists                                             |
| GEO-02    | llms-full.txt with expanded content for AI crawlers                            | Static file at `public/llms-full.txt`; same format as llms.txt with full page descriptions                                     |
| GEO-03    | Quick-answer blocks (1-2 sentence definitions) above fold on each service page | Inline JSX block within each service page before first H2; no external library needed                                          |
| GEO-04    | Entity-first content — consistent FMai entity definition across all pages      | Shared entity description constant in seo-config.ts used across pages                                                          |
| GEO-05    | Prompt-aligned headings — question-based H2/H3 matching AI query patterns      | Content/copy change to existing page headings; no library needed                                                               |

</phase_requirements>

---

## Summary

Phase 4 adds two distinct capability layers on top of the Phase 2 page foundation: AI-discovery infrastructure (llms.txt, llms-full.txt, entity consistency, quick-answer blocks, question-based headings) and extended structured data + dynamic OG images. All work happens inside `fmai-nextjs/` — the Vite codebase at `src/` is reference only.

The technical complexity is moderate. FAQPage and HowTo JSON-LD reuse the existing `JsonLd` component already in place. The llms.txt files are plain markdown served from the `public/` directory — no route handler complexity needed for a static site. Dynamic OG images use Next.js's native `opengraph-image.tsx` file convention backed by `next/og` (Satori), which is already bundled with Next.js 16 — no additional library installation required.

The GEO content work (quick-answer blocks, entity-first copy, question-based headings) is content architecture, not infrastructure. It means adding a new JSX block at the top of each service page, updating heading copy, and standardizing the entity description. None of it requires new dependencies.

**Primary recommendation:** Use the native `opengraph-image.tsx` file convention (not a Route Handler) for OG images — it gives static optimization at build time and colocates with each route. Serve llms.txt/llms-full.txt as static public files, not Route Handlers, since the content is curated and stable. Extend existing `JsonLd` component for FAQ and HowTo schemas.

---

## Standard Stack

### Core

| Library      | Version                    | Purpose                                                           | Why Standard                                                                             |
| ------------ | -------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `next/og`    | bundled in Next.js 16.1.7  | ImageResponse for dynamic OG images (Satori-based PNG generation) | Officially maintained by Vercel; no separate install; statically optimized at build time |
| `schema-dts` | ^1.1.5 (already installed) | TypeScript types for JSON-LD structured data                      | Already in devDependencies from Phase 2; provides type safety for FAQPage/HowTo          |

### Supporting

| Library     | Version                    | Purpose                                 | When to Use                                                          |
| ----------- | -------------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `next-intl` | ^4.8.3 (already installed) | Translations inside opengraph-image.tsx | Pass explicit `locale` from params; needed for localized OG alt text |

### Alternatives Considered

| Instead of                            | Could Use                                | Tradeoff                                                                                                                                         |
| ------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `opengraph-image.tsx` file convention | Route Handler at `app/api/og/route.ts`   | File convention is simpler, auto-caches at build time, colocates with route; Route Handler adds complexity for no benefit when content is static |
| Static `public/llms.txt`              | Route Handler at `app/llms.txt/route.ts` | Static file is simpler and caches aggressively; Route Handler only needed if content must be generated dynamically from a database               |

**Installation:** No new dependencies required. `next/og` is bundled with Next.js. All other tools are already installed.

---

## Architecture Patterns

### Recommended Project Structure for Phase 4

```
fmai-nextjs/
├── public/
│   ├── llms.txt                          # GEO-01: AI site map
│   └── llms-full.txt                     # GEO-02: Expanded AI content
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── opengraph-image.tsx        # SEO-11/12: Root OG image (homepage + fallback)
│   │   │   ├── (services)/
│   │   │   │   ├── automations/
│   │   │   │   │   ├── opengraph-image.tsx  # Per-service OG image
│   │   │   │   │   └── page.tsx             # + FAQPage JSON-LD + QuickAnswer block
│   │   │   │   ├── chatbots/
│   │   │   │   │   ├── opengraph-image.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── voice-agents/
│   │   │   │   │   ├── opengraph-image.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── marketing-machine/
│   │   │   │       ├── opengraph-image.tsx
│   │   │   │       └── page.tsx
│   │   │   └── (marketing)/
│   │   │       └── how-it-works/
│   │   │           └── page.tsx             # + HowTo JSON-LD
│   ├── components/
│   │   ├── seo/
│   │   │   ├── FaqJsonLd.tsx               # New: reusable FAQPage schema component
│   │   │   └── HowToJsonLd.tsx             # New: HowTo schema component
│   │   └── ui/
│   │       └── QuickAnswerBlock.tsx         # New: GEO-03 quick-answer UI block
│   └── lib/
│       ├── seo-config.ts                    # Add: ENTITY_DESCRIPTION constant (GEO-04)
│       └── og-image.tsx                     # New: shared OG image JSX template
```

### Pattern 1: FAQPage JSON-LD Component

**What:** Server component that injects FAQPage structured data via the existing JsonLd wrapper.
**When to use:** Every service page (automations, chatbots, voice-agents, marketing-machine).

```typescript
// src/components/seo/FaqJsonLd.tsx
// Source: https://nextjs.org/docs/app/guides/json-ld + https://schema.org/FAQPage
import { JsonLd } from './JsonLd'

interface FaqItem {
  question: string
  answer: string
}

interface FaqJsonLdProps {
  items: FaqItem[]
}

export function FaqJsonLd({ items }: FaqJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }}
    />
  )
}
```

### Pattern 2: HowTo JSON-LD Component

**What:** Injects HowTo structured data for the How It Works page.
**When to use:** Only on the `/how-it-works` page.

```typescript
// src/components/seo/HowToJsonLd.tsx
// Source: https://schema.org/HowTo
import { JsonLd } from './JsonLd'

interface HowToStep {
  name: string
  text: string
}

interface HowToJsonLdProps {
  name: string
  description?: string
  steps: HowToStep[]
}

export function HowToJsonLd({ name, description, steps }: HowToJsonLdProps) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        ...(description ? { description } : {}),
        step: steps.map((step, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: step.name,
          text: step.text,
        })),
      }}
    />
  )
}
```

### Pattern 3: opengraph-image.tsx with Locale

**What:** Per-route OG image using ImageResponse; locale-aware for localized page titles.
**When to use:** Place one file per route segment. Shared template in `lib/og-image.tsx`.

```typescript
// src/app/[locale]/(services)/automations/opengraph-image.tsx
// Source: https://nextjs.org/docs/app/api-reference/functions/image-response
import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Future Marketing AI — Automations'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'automations' })

  // Load font from public/fonts/ (ttf preferred over woff for Satori)
  const fontData = await readFile(
    join(process.cwd(), 'public/fonts/DMSans-SemiBold.ttf')
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#050814',
          padding: '80px',
        }}
      >
        {/* Brand mark */}
        <div style={{ display: 'flex', color: '#00D4FF', fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
          Future Marketing AI
        </div>
        {/* Page title */}
        <div style={{ display: 'flex', color: '#FFFFFF', fontSize: 64, fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
          {t('meta.title')}
        </div>
        {/* Description */}
        <div style={{ display: 'flex', color: '#8890A4', fontSize: 28, lineHeight: 1.4 }}>
          {t('meta.description')}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'DM Sans', data: fontData, weight: 600, style: 'normal' }],
    }
  )
}
```

### Pattern 4: QuickAnswer Block

**What:** A visually distinct 1-2 sentence definition block placed above the first H2 on each service page.
**When to use:** All 4 service pages.

```typescript
// src/components/ui/QuickAnswerBlock.tsx
interface QuickAnswerBlockProps {
  definition: string
}

export function QuickAnswerBlock({ definition }: QuickAnswerBlockProps) {
  return (
    <div
      className="border-l-4 border-[#00D4FF] bg-[#00D4FF]/5 px-6 py-4 rounded-r-lg mb-12"
      role="note"
      aria-label="Quick answer"
    >
      <p className="text-base leading-relaxed text-white/90">{definition}</p>
    </div>
  )
}
```

### Pattern 5: llms.txt Static File Format

**What:** Plain markdown file at `public/llms.txt` — served at `futuremarketingai.com/llms.txt`.
**Format spec:** H1 title, optional blockquote summary, H2-grouped link lists.

```markdown
# Future Marketing AI

> B2B AI marketing automation agency helping growth-stage companies deploy
> AI-powered automations, chatbots, voice agents, and full-stack marketing machines.

## Services

- [AI Marketing Automations](/en/automations): End-to-end workflow automation for lead qualification, email sequences, and CRM sync
- [AI Chatbots](/en/chatbots): Conversational AI with persona configuration and demo playground
- [AI Voice Agents](/en/voice-agents): Inbound/outbound voice automation for sales and support
- [AI Marketing Machine](/en/marketing-machine): Integrated content, ads, and pipeline automation

## Company

- [About Future Marketing AI](/en/about): Mission, team, and founding story
- [How It Works](/en/how-it-works): Step-by-step delivery process
- [Pricing](/en/pricing): Service tiers and investment overview

## Optional

- [Contact](/en/contact): Book a discovery call
```

### Anti-Patterns to Avoid

- **FAQPage on forums/community pages:** Google only shows FAQPage rich results for government/health sites since a policy change — but the JSON-LD still helps AI systems understand content. Always include it even without rich result eligibility.
- **Grid CSS in ImageResponse JSX:** Satori only supports flexbox + a subset of CSS. Never use `display: grid`, CSS Grid properties, or complex selectors.
- **Loading fonts from Google Fonts URLs in ImageResponse:** Satori requires the raw font bytes (`ArrayBuffer`). Always load the TTF file from disk via `readFile`.
- **`use client` on opengraph-image.tsx:** ImageResponse runs server-side. Never add `'use client'` to these files.
- **Single opengraph-image.tsx at root only:** The root-level file at `app/[locale]/opengraph-image.tsx` serves as a fallback but each service page should have its own file for branded, page-specific previews.
- **Route Handler for static llms.txt:** A Route Handler adds edge complexity for content that changes only when the site structure changes. Use `public/llms.txt` static file.

---

## Don't Hand-Roll

| Problem                          | Don't Build                        | Use Instead                                   | Why                                                                                   |
| -------------------------------- | ---------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------- |
| PNG image generation from JSX    | Custom Canvas/Puppeteer renderer   | `next/og` ImageResponse                       | Bundled with Next.js, runs at Edge/Node, Satori handles font rendering and SVG-to-PNG |
| Type safety for FAQ/HowTo schema | Raw objects without types          | `schema-dts` types + `WithContext<FAQPage>`   | Already installed; prevents malformed schema submissions                              |
| Font bytes for Satori            | Fetch from external URL at runtime | Read from `public/fonts/*.ttf` via `readFile` | External fetch adds latency; disk read is synchronous and cached                      |

**Key insight:** This phase is almost entirely configuration and content — not infrastructure. The heavy lifting (JSON-LD injection, metadata, routing) was done in Phases 1 and 2. Phase 4 is additive.

---

## Common Pitfalls

### Pitfall 1: Satori CSS Limitations

**What goes wrong:** OG image renders blank or throws runtime error.
**Why it happens:** Satori only supports a subset of CSS flexbox properties. Using `display: grid`, `gap` (partially), `transform`, or complex selectors causes silent failures.
**How to avoid:** Use only `display: flex`, `flexDirection`, `alignItems`, `justifyContent`, `padding`, `margin`, `background`, `color`, `fontSize`, `fontWeight`, `lineHeight`, `border`, `borderRadius` in ImageResponse JSX.
**Warning signs:** Build succeeds but OG preview shows blank image.

### Pitfall 2: Font Format Incompatibility

**What goes wrong:** Text in OG image renders as boxes or falls back to system font.
**Why it happens:** Satori only accepts `ttf`, `otf`, or `woff` (ttf/otf preferred). The project currently uses `next/font/google` which loads woff2 — a format Satori cannot parse.
**How to avoid:** Download the TTF files for DM Sans from Google Fonts and place them in `public/fonts/`. Reference via `readFile` + `join(process.cwd(), 'public/fonts/...')`.
**Warning signs:** OG image text appears as fallback font or garbled characters.

### Pitfall 3: next-intl Locale Routing Breaks opengraph-image Route

**What goes wrong:** `opengraph-image.tsx` in `app/[locale]/` throws 404 or middleware redirect loop.
**Why it happens:** next-intl middleware intercepts all paths including the auto-generated `/en/opengraph-image` URL that Next.js creates for the image endpoint.
**How to avoid:** Update middleware matcher to bypass opengraph-image paths:

```typescript
// middleware.ts matcher
matcher: ['/((?!api|_next|_vercel|.*/opengraph-image|.*\\..*).*)']
```

**Warning signs:** OG image returns 404 or redirects to locale homepage.

### Pitfall 4: FAQ Content Not Visible on Page

**What goes wrong:** Google ignores FAQPage JSON-LD; rich results test shows error.
**Why it happens:** Google requires FAQ content to be visible on the actual page — not just in the JSON-LD. The questions and answers must be in the HTML.
**How to avoid:** The FAQ section component must render visibly on page. The JSON-LD should exactly mirror the visible content — use the same strings from the same source.
**Warning signs:** Rich Results Test shows "FAQ items not found on page."

### Pitfall 5: llms.txt Not Accessible at Exact Path

**What goes wrong:** AI crawlers can't find `futuremarketingai.com/llms.txt`.
**Why it happens:** If placed in a locale-prefixed path (`/en/llms.txt`), the file is not at the expected domain root.
**How to avoid:** Place in `public/llms.txt` (not inside a locale route). The `public/` directory in Next.js serves files at the root without any routing.
**Warning signs:** `curl https://futuremarketingai.com/llms.txt` returns 404.

### Pitfall 6: Entity Definition Inconsistency Across Locales

**What goes wrong:** AI systems receive conflicting entity descriptions depending on which locale page they crawl.
**Why it happens:** Each locale's translation file may have slightly different phrasing for the entity definition.
**How to avoid:** Define the canonical English entity description in `seo-config.ts` as `ENTITY_DESCRIPTION`. Use this constant in the Organization JSON-LD (already in Phase 2) and in the quick-answer blocks. Translations can adapt the phrasing but the entity core (name, type, domain) must be consistent.

---

## Code Examples

### FAQPage JSON-LD — Usage in Service Page

```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
// Add to automations/page.tsx inside the Server Component
const FAQ_ITEMS = [
  {
    question: 'What is AI marketing automation?',
    answer: 'AI marketing automation uses machine learning to execute repetitive marketing tasks — lead qualification, email sequences, CRM sync — without human intervention.',
  },
  {
    question: 'How long does it take to deploy an automation workflow?',
    answer: 'Most workflow automations go live within 2-3 weeks: one week for audit and design, one week for build and testing, and a final integration and handoff sprint.',
  },
  // ... 3-6 more items
]

// In the page component JSX:
<FaqJsonLd items={FAQ_ITEMS} />
```

### HowTo JSON-LD — How It Works Page

```typescript
// Source: https://schema.org/HowTo
// Map existing STEP_KEYS to HowTo steps
const HOW_TO_STEPS = [
  {
    name: 'Discovery & Research',
    text: 'We audit your current marketing stack, identify automation opportunities, and map your ideal customer journey.',
  },
  {
    name: 'Content Strategy',
    text: 'We develop AI-optimized content plans aligned with your ICP and funnel stages.',
  },
  {
    name: 'Workflow Build',
    text: 'We build and configure automations, chatbots, or voice agents in your stack.',
  },
  {
    name: 'Publishing & Launch',
    text: 'We deploy, test end-to-end, and launch with monitoring in place.',
  },
  {
    name: 'Learning & Optimization',
    text: 'AI models learn from real interactions; we tune monthly for performance gains.',
  },
  {
    name: 'Paid Amplification',
    text: 'We layer targeted ads to amplify organic growth and generate pipeline.',
  },
]
```

### QuickAnswer Block — Usage in Service Page

```typescript
// Place directly after hero section, before first H2 body section
<QuickAnswerBlock
  definition="AI Marketing Automations by Future Marketing AI replace manual marketing workflows with intelligent, self-running systems — so your team focuses on strategy while AI handles execution."
/>
```

### Entity-First seo-config.ts Addition

```typescript
// src/lib/seo-config.ts — Add to existing file
export const ENTITY_DESCRIPTION =
  'Future Marketing AI is a B2B AI marketing automation agency that deploys AI-powered automations, chatbots, voice agents, and integrated marketing machines for growth-stage companies.'
```

### llms-full.txt Structure (Expanded Version)

```markdown
# Future Marketing AI

> Future Marketing AI is a B2B AI marketing automation agency.
> We deploy AI-powered automations, chatbots, voice agents, and integrated
> marketing machines for growth-stage companies.

## Services

- [AI Marketing Automations](https://futuremarketingai.com/en/automations): Replace manual workflows with AI-driven lead qualification, email sequences, social media publishing, invoice handling, onboarding, and data synchronization. Most workflows launch within 2-3 weeks.

- [AI Chatbots](https://futuremarketingai.com/en/chatbots): Conversational AI agents configured per persona (e-commerce, lead generation, customer support). Includes a live demo playground with 3 pre-configured personas.

...full descriptions for all pages...
```

---

## State of the Art

| Old Approach                          | Current Approach                                               | When Changed     | Impact                                                                                  |
| ------------------------------------- | -------------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| `@vercel/og` separate package         | `next/og` built-in                                             | v14.0.0          | No separate install; import from `next/og`                                              |
| `ImageResponse` from `next/server`    | `ImageResponse` from `next/og`                                 | v14.0.0          | Cleaner import, same API                                                                |
| Edge Runtime required for OG images   | Node.js runtime also supported                                 | v15+             | Can use `readFile` (Node fs) directly in opengraph-image.tsx                            |
| `params` as plain object              | `params` as Promise (must `await`)                             | v16.0.0          | Match existing Phase 2 pattern — already using `await params` throughout                |
| FAQPage rich results widely supported | FAQPage rich results restricted to gov/health                  | ~2023            | JSON-LD is still valuable for AI systems; just don't rely on Google visual rich results |
| llms.txt entirely unofficial          | Growing de-facto standard; Anthropic, Cursor, Mintlify adopted | Late 2024 - 2025 | Implement it; AI crawlers increasingly check for it                                     |

**Deprecated/outdated:**

- `@vercel/og` direct dependency: Superseded by `next/og` built-in. Never install `@vercel/og` separately in a Next.js 14+ project.
- `ImageResponse` from `next/server`: Deprecated import path since v14. Use `next/og`.

---

## Open Questions

1. **Font files for Satori**
   - What we know: Satori requires TTF/OTF bytes; `next/font/google` loads woff2 (incompatible); the project uses DM Sans.
   - What's unclear: Whether to download TTF files manually or use a fetch-at-build pattern from `fonts.google.com` CDN.
   - Recommendation: Download `DMSans-Regular.ttf` and `DMSans-SemiBold.ttf` from Google Fonts and commit to `public/fonts/`. This is the pattern used by Next.js official examples. Add to `.gitignore` is NOT appropriate — font files must be in the repo.

2. **OG image locale strategy**
   - What we know: Each `opengraph-image.tsx` receives `params` with `{ locale }`. Generating 3 locales × 5+ pages = 15+ images at build time.
   - What's unclear: Build time impact with 10+ locale-specific OG images.
   - Recommendation: Use a shared OG template component in `src/lib/og-image.tsx` that all per-route `opengraph-image.tsx` files import. This avoids copy-paste and keeps styling in one place.

3. **llms.txt linking strategy**
   - What we know: The spec recommends linking to the default locale (`/en/`) pages; but robots.txt already uses locale-prefixed URLs.
   - What's unclear: Whether to link to `/en/automations` or use absolute URLs like `https://futuremarketingai.com/en/automations`.
   - Recommendation: Use absolute URLs with the English locale path (`https://futuremarketingai.com/en/automations`). This removes ambiguity for AI crawlers.

4. **FAQ content source (translation keys vs hardcoded)**
   - What we know: Phase 2 pages use next-intl translation keys for all user-facing content.
   - What's unclear: Whether FAQ items should live in translation files (requiring 3-locale FAQ copy) or be hardcoded in English only (acceptable given the AI-citability goal is English-first).
   - Recommendation: Add FAQ items to the EN translation namespace for the service pages. NL/ES can be added later. For Phase 4, English-only FAQ is acceptable and keeps scope manageable.

---

## Sources

### Primary (HIGH confidence)

- [Next.js ImageResponse API Reference](https://nextjs.org/docs/app/api-reference/functions/image-response) — Parameters, supported CSS, font loading, code examples (v16.1.7, fetched 2026-03-18)
- [Next.js opengraph-image file convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) — File placement, dynamic route params, static vs dynamic generation (v16.1.7, fetched 2026-03-18)
- [FAQPage structured data — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/faqpage) — Required properties, eligibility, restrictions (fetched 2026-03-18)
- [llmstxt.org specification](https://llmstxt.org/) — Official format spec: H1, blockquote, H2-grouped link lists (fetched 2026-03-18)
- [next-intl — Metadata and Route Handlers](https://next-intl.dev/docs/environments/actions-metadata-route-handlers) — Middleware bypass pattern for opengraph-image (fetched 2026-03-18)

### Secondary (MEDIUM confidence)

- [llms-txt.io — Adding llms.txt to Next.js](https://llms-txt.io/blog/how-to-add-llms-txt-to-nextjs-react) — Public directory vs Route Handler tradeoffs, content-type headers
- [GEO content structure guide — strapi.io](https://strapi.io/blog/generative-engine-optimization-geo-guide) — Quick-answer block placement, entity-first pattern, 40-60 word summary blocks
- [Satori CSS support reference](https://github.com/vercel/satori#css) — Supported properties list (cross-referenced with official Next.js docs)

### Tertiary (LOW confidence)

- [HowTo schema — unhead.unjs.io](https://unhead.unjs.io/docs/schema-org/api/schema/how-to) — HowToStep properties (Google removed HowTo rich results in 2023; value now primarily AI understanding)

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — `next/og` is official Next.js; `schema-dts` already installed; no new dependencies
- Architecture: HIGH — File placement patterns from official docs; verified with current Next.js 16.1.7 docs
- OG image with next-intl locale routing: MEDIUM — Middleware bypass pattern verified via next-intl docs but middleware.ts will need testing
- GEO content patterns: MEDIUM — Best practices verified via multiple credible sources; AI citation impact is inherently difficult to measure
- HowTo schema value: LOW — Google removed HowTo rich results in 2023; JSON-LD still meaningful for AI but no rich result eligibility

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable APIs; llms.txt ecosystem may evolve faster)
