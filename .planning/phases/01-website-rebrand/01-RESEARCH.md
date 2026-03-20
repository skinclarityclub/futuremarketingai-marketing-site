# Phase 1: Website Rebrand - Research

**Researched:** 2026-03-20
**Domain:** Next.js 16 website content rebrand (i18n, routing, SEO, copy)
**Confidence:** HIGH

## Summary

Phase 1 is a brownfield content rebrand of an existing Next.js 16 website. The codebase is mature: 11+ pages, 59 components, full i18n (EN/NL/ES via next-intl 4.8), JSON-LD structured data, sitemap generation, and a dark-theme design system. The work is primarily content replacement and route restructuring -- not a technical rebuild. The current site positions FMai as a "generic AI automation agency for businesses" and must be reframed to "AI Marketing Employee for marketing agencies" with skill-based navigation and agent-tier pricing.

The key insight is that every existing page and component pattern can be reused. The architecture supports the rebrand natively: next-intl message files hold all copy, the header/footer are data-driven (arrays of nav items), SEO components are parameterized, and the routing uses Next.js App Router with route groups. The work divides cleanly into: (1) copy/translation updates across 3 JSON files, (2) route restructuring (services -> skills), (3) new pages (founding member landing, 6 skill pages), (4) pricing page redesign (3 tiers -> 4 agent tiers + add-ons), and (5) SEO metadata overhaul.

**Primary recommendation:** Treat this as a content-first migration. Update all 3 message JSON files first (establishes the new language), then restructure routes and navigation, then add the 2 new pages (founding member + skill template), and finally update SEO config. Existing component library (GlassCard, CTAButton, ScrollReveal, SectionHeading, PageShell) is sufficient -- no new UI components needed.

## Standard Stack

### Core (Already Installed -- No Changes)

| Library         | Version | Purpose                     | Why Standard                               |
| --------------- | ------- | --------------------------- | ------------------------------------------ |
| next            | 16.1.7  | Framework                   | Already in production                      |
| next-intl       | 4.8.3   | i18n routing + translations | All copy lives in messages/{en,nl,es}.json |
| react           | 19.2.3  | UI                          | Already in production                      |
| tailwindcss     | 4.x     | Styling                     | Already in production                      |
| motion (framer) | 12.38.0 | Animations                  | Already in production                      |
| lucide-react    | 0.577.0 | Icons                       | Already in production                      |
| schema-dts      | 1.1.5   | JSON-LD types               | Already in production                      |

### Supporting (Already Installed)

| Library        | Version | Purpose           | When to Use                                          |
| -------------- | ------- | ----------------- | ---------------------------------------------------- |
| zod            | 4.3.6   | Schema validation | If form validation needed for founding member signup |
| react-calendly | 4.4.0   | Booking widget    | Keep for CTA flows                                   |

### Alternatives Considered

| Instead of | Could Use | Tradeoff                                             |
| ---------- | --------- | ---------------------------------------------------- |
| N/A        | N/A       | No new libraries needed -- this is a content rebrand |

**Installation:**

```bash
# No new packages required
```

## Architecture Patterns

### Current Project Structure (Relevant Parts)

```
fmai-nextjs/
├── messages/
│   ├── en.json          # ~750 lines, ALL English copy
│   ├── nl.json          # Dutch translations
│   └── es.json          # Spanish translations
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx                    # Homepage
│   │   │   ├── layout.tsx                  # Root locale layout
│   │   │   ├── (services)/                 # Route group: service pages
│   │   │   │   ├── automations/page.tsx
│   │   │   │   ├── chatbots/page.tsx
│   │   │   │   ├── voice-agents/page.tsx
│   │   │   │   └── marketing-machine/page.tsx
│   │   │   ├── (marketing)/                # Route group: marketing pages
│   │   │   │   ├── about/page.tsx
│   │   │   │   ├── pricing/page.tsx
│   │   │   │   ├── how-it-works/page.tsx
│   │   │   │   └── contact/page.tsx
│   │   │   └── (legal)/legal/page.tsx
│   │   ├── sitemap.ts                      # Static + blog sitemap
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── HeaderClient.tsx            # Navigation (SERVICE_ITEMS, NAV_ITEMS arrays)
│   │   │   └── Footer.tsx                  # Footer links (hardcoded routes)
│   │   ├── seo/                            # JSON-LD components (10 types)
│   │   └── ui/                             # Reusable UI (GlassCard, CTAButton, etc.)
│   ├── lib/
│   │   ├── metadata.ts                     # generatePageMetadata() utility
│   │   └── seo-config.ts                   # SITE_URL, SITE_NAME, ENTITY_DESCRIPTION, PAGE_DATES
│   └── i18n/
│       ├── routing.ts                      # locales: ['en', 'nl', 'es'], defaultLocale: 'en'
│       └── navigation.ts                   # Link, redirect, usePathname, useRouter
```

### Pattern 1: Translation-Driven Copy (ALL Content via next-intl)

**What:** Every user-visible string comes from `messages/{locale}.json` via `getTranslations()` (server) or `useTranslations()` (client). Page components reference translation keys, not hardcoded strings.

**When to use:** All copy changes. This is the PRIMARY pattern for this phase.

**Example:**

```typescript
// Server component pattern (used by all pages)
const t = await getTranslations({ locale, namespace: 'home' })
return <h1>{t('hero.headlineMain')}</h1>

// Messages file structure
{
  "home": {
    "hero": {
      "headlineMain": "AI Marketing Employee for",
      "headlineAccent": "Your Agency."
    }
  }
}
```

**Critical detail:** The HeaderClient.tsx component has HARDCODED English strings for navigation items (SERVICE_ITEMS, NAV_ITEMS). These are NOT translated via next-intl. The rebrand must either:

- (a) Keep hardcoded but update the strings, OR
- (b) Migrate to translation keys (better, but more work)

Recommendation: Keep hardcoded for now (matches existing pattern), update strings. Footer already uses translations.

### Pattern 2: Route Groups for Page Organization

**What:** Next.js route groups `(services)`, `(marketing)`, `(legal)` organize pages without affecting URLs.

**When to use:** The services -> skills migration. Create a new `(skills)` route group with skill pages.

**Example:**

```
# Current
src/app/[locale]/(services)/chatbots/page.tsx     → /en/chatbots

# After rebrand
src/app/[locale]/(skills)/skills/content-creator/page.tsx  → /en/skills/content-creator
```

**Important:** The current service pages use flat URLs (/chatbots, /automations). The new skill pages need nested URLs (/skills/content-creator). This requires a `skills/` folder inside the route group.

### Pattern 3: Page Template Pattern

**What:** Every page follows the same structure: metadata export, generateStaticParams, server component with getTranslations, PageShell wrapper, JSON-LD components, sections with ScrollReveal.

**When to use:** Creating new skill pages and the founding member landing page.

**Example (page template):**

```typescript
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }) {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'skills-content-creator', path: '/skills/content-creator' })
}

export default async function SkillPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'skills-content-creator' })

  return (
    <PageShell>
      <WebPageJsonLd ... />
      <BreadcrumbJsonLd ... />
      {/* Page sections */}
    </PageShell>
  )
}
```

### Pattern 4: SEO Configuration Pattern

**What:** Centralized SEO config in `seo-config.ts` (SITE_URL, SITE_NAME, ENTITY_DESCRIPTION, PAGE_DATES). Metadata generated via `generatePageMetadata()` reading from translation files. Sitemap hardcodes page list.

**When to use:** All SEO updates. Must update seo-config.ts, sitemap.ts, and per-page JSON-LD.

### Anti-Patterns to Avoid

- **Do NOT create a separate "theme" or "branding config" file:** All copy lives in translation JSON files. Do not create a secondary content source.
- **Do NOT delete old service pages yet:** Add redirects from old URLs (/chatbots, /automations) to new skill URLs. Use Next.js redirects in next.config.ts.
- **Do NOT change the design system (colors, fonts, spacing):** This phase is content-only. Design changes would be a separate phase.
- **Do NOT introduce new UI component libraries:** The existing GlassCard, CTAButton, ScrollReveal, SectionHeading components cover all needs.

## Don't Hand-Roll

| Problem                 | Don't Build                 | Use Instead                                     | Why                                                                 |
| ----------------------- | --------------------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| SEO metadata            | Custom meta tag logic       | Existing `generatePageMetadata()`               | Already handles canonical URLs, hreflang, OG tags for all 3 locales |
| JSON-LD structured data | Raw JSON objects            | Existing `seo/` components (10 types)           | Type-safe via schema-dts, handles org/service/FAQ/breadcrumb        |
| Page scaffolding        | Custom layout per page      | `PageShell` + `ScrollReveal` + `SectionHeading` | Consistent spacing, animations, accessibility                       |
| Translation management  | Custom i18n solution        | next-intl (already configured)                  | Server + client components, locale routing, message namespaces      |
| Route redirects         | Custom middleware redirects | next.config.ts `redirects()`                    | Built into Next.js, no runtime cost                                 |

**Key insight:** This codebase already has solutions for every technical need. The work is updating content within existing patterns, not building new infrastructure.

## Common Pitfalls

### Pitfall 1: Translation Key Drift Across 3 Locales

**What goes wrong:** Updating en.json but forgetting nl.json and es.json leads to missing translation errors at build/runtime (next-intl throws).
**Why it happens:** 3 separate JSON files with identical key structures. Easy to add a key to one and miss the others.
**How to avoid:** Update all 3 locale files in the same commit. Use a diff tool to verify key parity. Consider a script that validates key structure matches across all locale files.
**Warning signs:** `next-intl` warnings in dev console about missing translations.

### Pitfall 2: Broken Internal Links After Route Migration

**What goes wrong:** Hardcoded hrefs in components (HeaderClient, Footer, page cross-links) still point to old routes (/chatbots instead of /skills/content-creator).
**Why it happens:** Links are scattered across: HeaderClient.tsx (SERVICE_ITEMS), Footer.tsx (nav links), homepage page.tsx (SERVICE_CARDS), sitemap.ts (pages array), and seo-config.ts (PAGE_DATES).
**How to avoid:** Grep for every old route path across the entire codebase before considering the migration complete. Key locations to check:

- `HeaderClient.tsx` — SERVICE_ITEMS array, NAV_ITEMS array
- `Footer.tsx` — hardcoded Link hrefs
- `page.tsx` (homepage) — SERVICE_CARDS array
- `sitemap.ts` — pages array
- `seo-config.ts` — PAGE_DATES object
- All service page cross-reference sections ("related services")
  **Warning signs:** 404s in production, broken breadcrumbs.

### Pitfall 3: Sitemap and SEO Config Out of Sync

**What goes wrong:** New skill pages added to the filesystem but not to sitemap.ts or seo-config.ts PAGE_DATES. Old service pages removed but still in sitemap.
**Why it happens:** Sitemap and PAGE_DATES are manually maintained arrays/objects, not auto-discovered.
**How to avoid:** Every time a page route changes, update sitemap.ts pages array AND seo-config.ts PAGE_DATES in the same commit.
**Warning signs:** Google Search Console reporting crawl errors.

### Pitfall 4: Pricing Page Structural Mismatch

**What goes wrong:** Current pricing page renders 3 tiers in a 3-column grid. New requirements call for 4 agent tiers + skill add-ons (a fundamentally different layout).
**Why it happens:** The TIER_KEYS array and grid layout are hardcoded for 3 items.
**How to avoid:** Redesign the pricing page component structure: 4-column grid (or 2x2 on desktop) for agent tiers, plus a separate section for skill add-ons. The GlassCard component supports `highlighted` prop for the recommended tier.
**Warning signs:** Layout breaks on desktop (4 items in 3-col grid).

### Pitfall 5: Founding Member Page Missing from Navigation

**What goes wrong:** Building the founding member landing page but not linking it from the pricing page CTA and the homepage.
**Why it happens:** Forgetting to update CTAButton hrefs and add the route to the nav/sitemap.
**How to avoid:** The founding member page should be linked from: pricing page CTA, homepage CTA (secondary), and possibly the header as a highlighted CTA button.

## Code Examples

### Updating Homepage Hero Copy (messages/en.json)

```json
{
  "home": {
    "meta": {
      "title": "AI Marketing Employee for Agencies | FMai",
      "description": "Your agency's first AI Marketing Employee. Runs 24/7, learns your clients, gets better every week. Content creation, social media, voice agents, and more."
    },
    "hero": {
      "badge": "AI Marketing Employee for Agencies",
      "headlineMain": "Your Agency's First",
      "headlineAccent": "AI Employee.",
      "subtitle": "One persistent AI marketing employee that runs 24/7 for your agency. Add skills as you grow — content creation, social media, voice agents, lead qualification, and more.",
      "trustAnchor": "Agencies with AI employees scale 3x faster without hiring",
      "cta": "Explore Skills",
      "ctaSecondary": "See Pricing"
    }
  }
}
```

### Adding Redirects for Old Routes (next.config.ts)

```typescript
const nextConfig: NextConfig = {
  // ... existing config
  async redirects() {
    return [
      {
        source: '/:locale/chatbots',
        destination: '/:locale/skills/lead-qualifier',
        permanent: true,
      },
      {
        source: '/:locale/automations',
        destination: '/:locale/skills/content-creator',
        permanent: true,
      },
      {
        source: '/:locale/voice-agents',
        destination: '/:locale/skills/voice-agent',
        permanent: true,
      },
      {
        source: '/:locale/marketing-machine',
        destination: '/:locale/skills/content-creator',
        permanent: true,
      },
    ]
  },
}
```

### New Skill Page Route Structure

```
src/app/[locale]/(skills)/
└── skills/
    ├── content-creator/page.tsx
    ├── voice-agent/page.tsx
    ├── lead-qualifier/page.tsx
    ├── social-media/page.tsx
    ├── ad-creator/page.tsx
    └── reporting/page.tsx
```

### Updated Navigation (HeaderClient.tsx)

```typescript
const SKILL_ITEMS = [
  {
    icon: PenTool,
    title: 'Content Creator',
    description: 'Blog posts, social content, newsletters — on autopilot',
    href: '/skills/content-creator' as const,
  },
  {
    icon: Mic,
    title: 'Voice Agent',
    description: 'AI-powered inbound and outbound calls',
    href: '/skills/voice-agent' as const,
  },
  {
    icon: Bot,
    title: 'Lead Qualifier',
    description: 'Chatbot that qualifies leads 24/7',
    href: '/skills/lead-qualifier' as const,
  },
  {
    icon: Share2,
    title: 'Social Media',
    description: 'Multi-platform scheduling and analytics',
    href: '/skills/social-media' as const,
  },
  {
    icon: Megaphone,
    title: 'Ad Creator',
    description: 'AI-generated static and video ads',
    href: '/skills/ad-creator' as const,
  },
  {
    icon: BarChart3,
    title: 'Reporting',
    description: 'Cross-platform dashboards and weekly reports',
    href: '/skills/reporting' as const,
  },
]

const NAV_ITEMS = [
  { label: 'Skills', href: '/#skills' as const, hasDropdown: true },
  { label: 'Pricing', href: '/pricing' as const },
  { label: 'About', href: '/about' as const },
  { label: 'How It Works', href: '/how-it-works' as const },
]
```

### New Pricing Tier Structure (messages/en.json)

```json
{
  "pricing": {
    "tiers": {
      "founding": {
        "name": "Founding Member",
        "price": "997",
        "badge": "10 Spots Only",
        "description": "Lock in the lowest price forever. For agencies ready to move first.",
        "service_count": "Agent + 1 skill",
        "features_0": "Full AI Marketing Employee",
        "features_1": "1 skill of your choice",
        "features_2": "Priority support + founder access",
        "features_3": "Locked price for life",
        "features_4": "6-month founding commitment"
      },
      "starter": {
        "name": "Starter",
        "price": "1,497",
        "description": "Your agency's first AI employee with one skill.",
        "service_count": "Agent + 1 skill"
      },
      "growth": {
        "name": "Growth",
        "price": "1,997",
        "badge": "Most Popular",
        "description": "Multiple skills for agencies scaling their client base.",
        "service_count": "Agent + 3 skills"
      },
      "agency": {
        "name": "Agency",
        "price": "3,497",
        "description": "Full skill suite for ambitious agencies.",
        "service_count": "Agent + all skills"
      }
    }
  }
}
```

## State of the Art

| Old Approach                                  | Current Approach                                               | When Changed            | Impact                                                   |
| --------------------------------------------- | -------------------------------------------------------------- | ----------------------- | -------------------------------------------------------- |
| Services model (chatbots, automations, voice) | Skills model (pluggable capabilities of one AI employee)       | 2026-03-20 (AaaS pivot) | All copy, navigation, pricing must change                |
| Generic B2B targeting                         | Agency-specific ICP targeting                                  | 2026-03-20              | Every page must speak to agency owners, not "businesses" |
| 3 pricing tiers (Starter/Growth/Scale)        | 4 agent tiers (Founding/Starter/Growth/Agency) + skill add-ons | 2026-03-20              | Pricing page needs structural redesign                   |
| Flat service URLs (/chatbots)                 | Nested skill URLs (/skills/content-creator)                    | 2026-03-20              | Route restructuring + redirects needed                   |

**Deprecated/outdated:**

- "AI Automation Agency" positioning: Replaced by "AI Marketing Employee for Agencies"
- Per-service pricing: Replaced by agent-tier + skill add-on model
- Generic trust badges ("Enterprise-grade Security"): Replace with agency-specific ("GDPR-First", "Powered by Enterprise AI", "Dutch Support")

## Open Questions

1. **Old service page content reuse**
   - What we know: 4 service pages exist (automations, chatbots, voice-agents, marketing-machine) with substantial content
   - What's unclear: How much content can be directly migrated vs needs full rewrite for skill pages
   - Recommendation: Map each old service to its closest new skill page. Reuse FAQ items and process steps where applicable. Rewrite hero sections and positioning copy.

2. **Founding member signup flow**
   - What we know: WEB-05 requires a "founding member landing page with 10-spot scarcity, benefits, and signup CTA"
   - What's unclear: Where the CTA leads (external form? Stripe checkout? Calendly call booking?)
   - Recommendation: Use existing CTAButton linking to contact page or Calendly for v1. The actual signup mechanism depends on Phase 2 (Stripe billing). For now, CTA should book a call.

3. **Chatbot demo personas (WEB-15)**
   - What we know: Current chatbot demo has 3 personas (e-commerce, lead gen, support). Needs updating for agency use cases.
   - What's unclear: What the agency-specific personas should be (agency client onboarding? skill demo? ROI calculator?)
   - Recommendation: Defer persona content definition to planning stage. The DemoPlayground component supports any persona config via translation keys.

4. **Old route preservation for SEO**
   - What we know: Old service pages may have Google indexed URLs
   - What's unclear: Whether the site has significant organic traffic on current service URLs
   - Recommendation: Use 301 permanent redirects for all old service URLs to prevent SEO loss. Add redirects in next.config.ts.

<phase_requirements>

## Phase Requirements

| ID     | Description                                                                       | Research Support                                                                                                                                                        |
| ------ | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WEB-01 | All homepage copy targets "marketing agencies" instead of "businesses" (EN/NL/ES) | Pattern 1 (translation-driven copy): Update all 3 message JSON files. Homepage uses `home` namespace with hero, services, stats, badges, trust, faq sections.           |
| WEB-02 | Hero section communicates "AI Marketing Employee for agencies" value prop         | Pattern 1: Update `home.hero.badge`, `headlineMain`, `headlineAccent`, `subtitle` in all 3 locales. Component structure unchanged.                                      |
| WEB-03 | Service pages restructured as skill pages (/skills/content-creator, etc.)         | Pattern 2 (route groups): Create `(skills)/skills/` route group with 6 skill page files. Pattern 3 (page template) for each. Add redirects for old URLs.                |
| WEB-04 | Pricing page shows 4 Agent tiers with skill add-ons                               | Pitfall 4: Current TIER_KEYS has 3 items. Must expand to 4 and restructure grid layout. Update pricing namespace in all 3 locale files.                                 |
| WEB-05 | Founding member landing page with 10-spot scarcity                                | Pattern 3 (page template): New page at `/founding-member`. Uses existing PageShell, GlassCard, CTAButton. Open Question 2 re: signup flow.                              |
| WEB-06 | Trust badges updated ("GDPR-First", "Powered by Enterprise AI", "Dutch Support")  | Pattern 1: Update `home.badges.*` keys in all 3 locale files. Component structure unchanged.                                                                            |
| WEB-07 | Stats section updated with agency-relevant metrics                                | Pattern 1: Update `home.stats.*` keys in all 3 locale files. STAT_KEYS array in page.tsx may need key name updates.                                                     |
| WEB-08 | Testimonials/social proof rewritten for agency audience                           | Pattern 1: Update `home.trust.*` keys in all 3 locale files.                                                                                                            |
| WEB-09 | FAQ rewritten for agency buyer questions                                          | Pattern 1: Update `home.faq.items.*` keys in all 3 locale files. FAQ_KEYS array in page.tsx unchanged.                                                                  |
| WEB-10 | SEO metadata updated for "AI marketing employee agencies"                         | Pattern 4: Update `meta.title` and `meta.description` in EVERY namespace across all 3 locale files. Update seo-config.ts ENTITY_DESCRIPTION. Update JSON-LD components. |
| WEB-11 | Navigation restructured (Services dropdown -> Skills dropdown)                    | HeaderClient.tsx: Replace SERVICE_ITEMS array with SKILL_ITEMS (6 skills). Change NAV_ITEMS[0] from "Services" to "Skills". Update Footer.tsx nav links.                |
| WEB-12 | Footer links and descriptions updated for AaaS positioning                        | Footer.tsx: Update skill links, tagline translation key. Update `common.landing.footer.*` in all 3 locale files.                                                        |
| WEB-13 | About page rewritten with AaaS mission and agency focus                           | Pattern 1: Replace `about.*` namespace content in all 3 locale files. Timeline eras should reflect AaaS evolution.                                                      |
| WEB-14 | How-it-works page reframed as agent onboarding journey                            | Pattern 1: Replace `how-it-works.*` namespace. STEP_KEYS and HOW_TO_STEPS need updating to reflect agent onboarding (not generic marketing process).                    |
| WEB-15 | Chatbot demo personas updated for agency use cases                                | DemoPlayground uses `chatbots.demo.tabs.*` translation keys. Update persona definitions in all 3 locale files. Update scenarios.ts if demo logic changes.               |

</phase_requirements>

## Sources

### Primary (HIGH confidence)

- Codebase inspection: All file paths, component structures, and patterns verified by direct file reading
- messages/en.json: Full translation key structure verified (750+ lines)
- next-intl 4.8.3: Routing config, navigation exports, middleware verified from source files
- Next.js 16.1.7: App Router, route groups, generateStaticParams verified from project files

### Secondary (MEDIUM confidence)

- AaaS pivot design document: `docs/plans/2026-03-20-aaas-pivot-design.md` — pricing tiers, skill definitions, ICP
- GTM positioning framework: `docs/plans/2026-03-20-gtm-positioning-framework.md` — messaging hierarchy, positioning language

### Tertiary (LOW confidence)

- None — all findings are based on direct codebase inspection and project documentation

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — verified from package.json and production codebase, no new dependencies needed
- Architecture: HIGH — all patterns verified by reading actual source files, not assumed
- Pitfalls: HIGH — identified from concrete codebase analysis (hardcoded links, manual sitemap, etc.)

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable — content rebrand, no fast-moving dependencies)
