# Phase 14: Service Page i18n - Research

**Researched:** 2026-03-13
**Domain:** React i18next internationalization -- service page string extraction
**Confidence:** HIGH

## Summary

Phase 14 wires i18n into the three service pages (AutomationsPage, ChatbotsPage, VoiceAgentsPage) that currently have all text hardcoded in English. The project already has a mature i18n setup using `i18next` + `react-i18next` + `i18next-http-backend` with three supported languages (EN, NL, ES). Six other pages (About, HowItWorks, Pricing, Contact, Legal, MarketingMachine) are already fully internationalized, providing clear patterns to follow.

The work is mechanical but voluminous: each service page has 7-8 sections with hardcoded strings in both JSX and top-level const arrays (painPoints, useCases, pricingTiers, processSteps, faqs, trust metrics). The const arrays must be moved inside the component function or converted to translation key arrays so `t()` calls execute within React's render context.

**Primary recommendation:** Create three dedicated namespace files (automations.json, chatbots.json, voice-agents.json) per language, following the established pattern used by about.json, pricing.json, and how-it-works.json. Register namespaces in i18n config. Refactor each page to use `useTranslation(['automations', 'common'])` pattern.

<phase_requirements>

## Phase Requirements

| ID               | Description                                                                                                                                                                  | Research Support                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-SERVICE-I18N | Wire useTranslation into AutomationsPage, ChatbotsPage, VoiceAgentsPage; extract hardcoded EN strings; add NL/ES translations; language switcher works on all service routes | Established i18n patterns from 6 already-translated pages; dedicated namespace file pattern; const-array refactoring strategy; verification via language switcher |

</phase_requirements>

## Standard Stack

### Core (already installed)

| Library                          | Purpose                                           | Why Standard                             |
| -------------------------------- | ------------------------------------------------- | ---------------------------------------- |
| i18next                          | Translation framework                             | Already configured in src/i18n/config.ts |
| react-i18next                    | React bindings (useTranslation hook)              | Already used across 6+ pages             |
| i18next-http-backend             | Lazy-loads JSON from /locales/{{lng}}/{{ns}}.json | Already configured                       |
| i18next-browser-languagedetector | Browser language detection                        | Already configured                       |

### No new dependencies needed

This phase requires zero new packages. All infrastructure exists.

## Architecture Patterns

### Pattern 1: Dedicated Namespace Files Per Page

**What:** Each page gets its own JSON namespace file (e.g., `automations.json`) rather than nesting inside common.json
**When to use:** Always for page-specific content (headings, descriptions, FAQ items, pricing tiers)
**Why:** Established pattern -- AboutPage uses `about.json`, PricingPage uses `pricing.json`, HowItWorksPage uses `how-it-works.json`

**Existing file structure:**

```
public/locales/
  en/
    common.json          # shared UI strings
    about.json           # AboutPage content
    pricing.json         # PricingPage content
    how-it-works.json    # HowItWorksPage content
    contact.json         # ContactPage content
  nl/
    [same structure]
  es/
    [same structure]
```

**New files to create:**

```
public/locales/
  en/
    automations.json     # NEW
    chatbots.json        # NEW
    voice-agents.json    # NEW
  nl/
    automations.json     # NEW
    chatbots.json        # NEW
    voice-agents.json    # NEW
  es/
    automations.json     # NEW
    chatbots.json        # NEW
    voice-agents.json    # NEW
```

### Pattern 2: Namespace Registration in i18n Config

**What:** New namespaces must be added to the `ns` array in `src/i18n/config.ts`
**Current state:** The ns array lists: common, hero, calculator, explorer, dashboard, navigation, forms, errors, analytics, ai-assistant
**Note:** Existing page namespaces (about, pricing, how-it-works, contact) are NOT in the ns array -- they load on demand via the HTTP backend. The ns array only pre-lists namespaces that are loaded eagerly. Page-specific namespaces are loaded when `useTranslation(['automations', 'common'])` is called.

**Verified:** i18next-http-backend loads any namespace on demand from `/locales/{{lng}}/{{ns}}.json` regardless of whether it appears in the `ns` config array. The ns array only controls what gets pre-loaded. So no config change is strictly needed, matching the pattern of existing page namespaces.

### Pattern 3: useTranslation with Multiple Namespaces

**What:** Pages load their own namespace + common
**Example from existing code:**

```typescript
// AboutPage.tsx
const { t } = useTranslation(['about', 'common'])

// PricingPage.tsx
const { t } = useTranslation(['pricing', 'common', 'seo'])
```

**For service pages:**

```typescript
// AutomationsPage.tsx
const { t } = useTranslation(['automations', 'common'])

// ChatbotsPage.tsx
const { t } = useTranslation(['chatbots', 'common'])

// VoiceAgentsPage.tsx
const { t } = useTranslation(['voice-agents', 'common'])
```

### Pattern 4: Const Array Refactoring

**What:** Hardcoded const arrays (painPoints, useCases, pricingTiers, etc.) defined outside components cannot use `t()` because the hook only works inside React components. These must be refactored.
**Approach:** Use `t()` with `returnObjects: true` to load arrays/objects from JSON, or define key arrays and map over them with `t()` inside the component.

**Recommended approach (key-based mapping):**

```typescript
// Before (hardcoded outside component)
const painPoints = [{ icon: Clock, title: 'Hours Lost...', description: '...' }]

// After (inside component, using t() with returnObjects)
const painPointKeys = ['manual_work', 'disconnected_tools', 'scaling'] as const
const painPointIcons = { manual_work: Clock, disconnected_tools: Link2, scaling: TrendingUp }

// Inside component:
const painPoints = painPointKeys.map((key) => ({
  icon: painPointIcons[key],
  title: t(`automations:pain_points.${key}.title`),
  description: t(`automations:pain_points.${key}.description`),
}))
```

**Alternative (returnObjects):**

```typescript
// Inside component:
const { t } = useTranslation(['automations', 'common'])
const tiers = t('automations:pricing.tiers', { returnObjects: true }) as Array<{
  name: string
  price: string
  description: string
  features: string[]
}>
```

The `returnObjects` approach is used by PricingPage for FAQ items. Either works; key-based mapping is more type-safe while returnObjects is more concise.

### Pattern 5: SEO Meta Tags Stay Hardcoded EN

**What:** SEOHead title/description/keywords remain hardcoded English strings
**Why:** Established project decision from Phase 11: "SEO meta tags kept as hardcoded EN strings -- SEO handled separately from UI i18n" (STATE.md, decision [11-06])

### Anti-Patterns to Avoid

- **Nesting service page content inside common.json:** MarketingMachinePage did this, but all other pages use dedicated namespace files. Follow the majority pattern.
- **Defining translated arrays outside the component:** t() must run inside React render context; const arrays at module scope cannot use hooks.
- **Modifying the i18n config ns array for page namespaces:** Existing page namespaces (about, pricing, etc.) are NOT in the ns array. HTTP backend loads them on demand.

## Don't Hand-Roll

| Problem             | Don't Build                    | Use Instead                                           | Why                                         |
| ------------------- | ------------------------------ | ----------------------------------------------------- | ------------------------------------------- |
| Translation loading | Manual fetch/import of JSON    | i18next-http-backend (already configured)             | Handles caching, fallback, lazy loading     |
| Language detection  | URL params or manual detection | i18next-browser-languagedetector (already configured) | localStorage persistence, browser detection |
| Pluralization       | Conditional logic              | i18next plural rules (built-in)                       | Handles EN/NL/ES plural rules correctly     |
| Array translations  | Manual array building          | `t(key, { returnObjects: true })`                     | Built-in i18next feature                    |

## Common Pitfalls

### Pitfall 1: t() Called Outside React Component

**What goes wrong:** Hardcoded const arrays at module level cannot use the `useTranslation` hook
**Why it happens:** The 3 service pages define painPoints, useCases, pricingTiers, processSteps, faqs, and automations as top-level consts with English strings
**How to avoid:** Move array construction inside the component function, or use key arrays with icon mappings at module level and t() calls inside
**Warning signs:** Build errors about hooks called outside components; translations showing keys instead of values

### Pitfall 2: Missing Namespace in useTranslation Call

**What goes wrong:** `t('pain_points.manual_work.title')` returns the key instead of the value
**Why it happens:** Forgot to specify the namespace: `useTranslation(['automations', 'common'])`
**How to avoid:** Always use the namespace prefix pattern or ensure primary namespace is first in the array
**Warning signs:** Raw key strings appearing in the UI instead of translated text

### Pitfall 3: JSON Structure Mismatch Between Languages

**What goes wrong:** NL or ES file has different key structure than EN, causing missing translations
**Why it happens:** Copy-paste errors, forgotten keys, typos in nested paths
**How to avoid:** Create EN file first, then copy structure exactly for NL and ES, only changing values
**Warning signs:** Missing translation warnings in dev console (already configured: `saveMissing: true` in dev)

### Pitfall 4: CTAButton Children Not Translated

**What goes wrong:** Button labels like "Book Free Audit" or "Get Started" remain in English
**Why it happens:** CTAButton receives children as JSX text; easy to overlook
**How to avoid:** Every string child of CTAButton must use `t()`
**Warning signs:** Buttons showing English text when language switched to NL/ES

### Pitfall 5: Pricing Tiers With Mixed Concerns

**What goes wrong:** Pricing data (amounts like "EUR 1,000 -- EUR 2,500") gets translated incorrectly
**Why it happens:** Prices are business data, not translation content -- but they're mixed into the same arrays as translatable text
**How to avoid:** Keep price strings in the translation files but ensure NL/ES use the same EUR formatting. Alternatively, keep prices as constants and only translate labels/descriptions.
**Recommendation:** Include prices in JSON (they may need locale-appropriate formatting in future), matching the pattern of marketing_machine.pricing_tiers in common.json

### Pitfall 6: Duplicate "Most Popular" Badge Text

**What goes wrong:** "Most Popular" badge on highlighted pricing tiers needs translation
**Why it happens:** It appears inline in JSX, easy to miss
**How to avoid:** Include badge text in the namespace or use a common key

## Code Examples

### Example 1: Page Component with useTranslation (from AboutPage pattern)

```typescript
// Source: src/pages/AboutPage.tsx (existing, verified)
import { useTranslation } from 'react-i18next'

export const AboutPage: React.FC = () => {
  const { t } = useTranslation(['about', 'common'])

  return (
    <>
      <h1>{t('about:hero.title')}</h1>
      <p>{t('about:hero.tagline')}</p>
    </>
  )
}
```

### Example 2: returnObjects for Array Data (from PricingPage pattern)

```typescript
// Source: src/pages/PricingPage.tsx (existing, verified)
const allFAQs = t('seo:faq.items', { returnObjects: true }) as Array<{
  question: string
  answer: string
}>
```

### Example 3: Tier-Based Translation (from MarketingMachinePage pattern)

```typescript
// Source: src/pages/MarketingMachinePage.tsx (existing, verified)
const TIER_KEYS = ['starter', 'marketing_machine', 'enterprise'] as const

// Inside component, for each tier:
t(`marketing_machine.pricing_tiers.${tierKey}.name`)
t(`marketing_machine.pricing_tiers.${tierKey}.features`, { returnObjects: true })
```

### Example 4: Recommended JSON Structure for automations.json

```json
{
  "hero": {
    "badge": "Delivered in 1-2 Weeks",
    "title": "Automate Your Business With AI",
    "description": "We build custom AI workflows that eliminate manual work...",
    "cta_primary": "Get a Free Automation Audit",
    "cta_secondary": "See Examples"
  },
  "pain_points": {
    "manual_work": {
      "title": "Hours Lost to Manual Work",
      "description": "Your team spends hours on work AI can do in minutes"
    },
    "disconnected_tools": {
      "title": "Disconnected Tools",
      "description": "Your tools don't talk to each other..."
    },
    "scaling": {
      "title": "Scaling Means Hiring",
      "description": "Scaling means hiring more people, not working smarter"
    }
  },
  "what_we_automate": {
    "title": "What We Automate",
    "subtitle": "From lead generation to customer onboarding...",
    "items": {
      "lead_qualification": "Lead qualification & CRM enrichment",
      "email_sequences": "Email sequences & follow-ups",
      "social_media": "Social media scheduling & content",
      "invoicing": "Invoice & billing workflows",
      "onboarding": "Customer onboarding flows",
      "data_sync": "Data sync between platforms"
    }
  },
  "process": {
    "title": "How It Works",
    "steps": {
      "audit": {
        "title": "Free Audit",
        "description": "We map your manual processes..."
      },
      "build": {
        "title": "Build",
        "description": "1-2 weeks delivery..."
      },
      "optimize": {
        "title": "Optimize",
        "description": "Optional ongoing retainer..."
      }
    }
  },
  "pricing": {
    "title": "Pricing",
    "subtitle": "Transparent pricing. No surprises.",
    "most_popular": "Most Popular",
    "tiers": {
      "starter": {
        "name": "Starter",
        "price": "\u20ac1,000 \u2013 \u20ac2,500",
        "description": "Perfect for getting started",
        "features": ["1-3 workflows", "Full documentation", "7-day delivery", "Email support"],
        "cta": "Get Started"
      }
    }
  },
  "trust_metrics": {
    "hours_saved": { "value": "15-30 hrs", "label": "saved per week" },
    "delivery_time": { "value": "1-2 weeks", "label": "delivery time" },
    "success_rate": { "value": "2.5x", "label": "success rate with AI partner" }
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "items": {
      "integrations": { "q": "What tools do you integrate with?", "a": "..." },
      "delivery": { "q": "How long does delivery take?", "a": "..." }
    }
  },
  "final_cta": {
    "title": "Book a Free 30-min Automation Audit",
    "description": "We'll map your manual processes...",
    "button": "Book Free Audit"
  }
}
```

## String Inventory Per Page

### AutomationsPage (src/pages/AutomationsPage.tsx)

- **Hero section:** 5 strings (badge, h1, description, 2 CTA buttons)
- **Pain points:** 3 items x 2 strings = 6 strings
- **What We Automate:** 2 section strings + 6 item labels = 8 strings
- **Process steps:** 1 section title + 3 items x 2 strings = 7 strings
- **Pricing:** 2 section strings + 1 badge + 3 tiers x (name + price + description + cta + 4 features) = ~27 strings
- **Trust metrics:** 3 items x 2 strings = 6 strings
- **FAQs:** 1 title + 5 items x 2 strings = 11 strings
- **Final CTA:** 3 strings
- **Total: ~73 strings**

### ChatbotsPage (src/pages/ChatbotsPage.tsx)

- **Hero section:** 5 strings
- **Use cases:** 1 title + 4 items x 2 = 9 strings
- **Process steps:** 1 title + 3 items x 2 = 7 strings
- **Pricing:** 2 section strings + 1 badge + 3 tiers x ~7 = ~24 strings
- **Trust metrics:** 3 items x 2 = 6 strings
- **FAQs:** 1 title + 4 items x 2 = 9 strings
- **Final CTA:** 3 strings
- **Total: ~64 strings**

### VoiceAgentsPage (src/pages/VoiceAgentsPage.tsx)

- **Hero section:** 5 strings
- **Use cases:** 1 title + 4 items x 2 = 9 strings
- **Pricing:** 2 section strings + 1 badge + 3 tiers x ~7 = ~24 strings
- **Partnership note:** 2 strings
- **Trust metrics:** 3 items x 2 = 6 strings
- **FAQs:** 1 title + 4 items x 2 = 9 strings
- **Final CTA:** 3 strings
- **Total: ~59 strings**

**Grand total: ~196 EN strings to extract, ~196 NL translations, ~196 ES translations**

## State of the Art

| Old Approach                       | Current Approach                  | Impact                                           |
| ---------------------------------- | --------------------------------- | ------------------------------------------------ |
| Nest all content in common.json    | Dedicated namespace per page      | Better code splitting, smaller JSON payloads     |
| Hardcoded arrays outside component | Key arrays + t() inside component | Enables translation without breaking hooks rules |
| i18n namespace pre-registration    | HTTP backend on-demand loading    | No config changes needed for new namespaces      |

## Open Questions

1. **NL/ES translation quality**
   - What we know: Machine-translated content may need human review
   - What's unclear: Whether the user wants professional-grade NL/ES or "good enough" machine translations
   - Recommendation: Produce high-quality translations (the user is Dutch-speaking and can verify NL); for ES, do best-effort with clear, professional language

2. **Price formatting locale differences**
   - What we know: Current prices use Euro formatting like "EUR 1,000 -- EUR 2,500"
   - What's unclear: Whether NL/ES should use locale-specific number formatting (1.000 vs 1,000)
   - Recommendation: Keep identical price formatting across all languages (EUR notation is universal in EU context)

## Sources

### Primary (HIGH confidence)

- `src/i18n/config.ts` -- verified i18n configuration, namespace loading, HTTP backend setup
- `src/pages/AboutPage.tsx` -- verified page-level namespace pattern
- `src/pages/PricingPage.tsx` -- verified returnObjects pattern for arrays
- `src/pages/MarketingMachinePage.tsx` -- verified tier-key translation pattern
- `public/locales/en/about.json` -- verified JSON structure for page namespace
- `public/locales/en/common.json` -- verified marketing_machine keys structure
- `.planning/STATE.md` -- verified SEO stays hardcoded EN decision

### Secondary (MEDIUM confidence)

- String count inventory -- manually counted from source files, approximate

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- all libraries already in use, zero new dependencies
- Architecture: HIGH -- 6 existing i18n pages provide clear, consistent patterns
- Pitfalls: HIGH -- common React i18n pitfalls well-documented; project-specific patterns verified from source

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable -- no library changes expected)
