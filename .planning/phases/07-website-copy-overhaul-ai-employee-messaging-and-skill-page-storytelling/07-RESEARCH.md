# Phase 7: Website Copy Overhaul -- AI Employee Messaging and Skill Page Storytelling - Research

**Researched:** 2026-03-20
**Domain:** Website copy, i18n/next-intl translation architecture, brand messaging
**Confidence:** HIGH

## Summary

This phase rewrites all website copy to introduce "Clyde" as the AI marketing employee. The codebase investigation reveals a clear picture: 9 pages need copy changes (1 homepage + 8 skill pages), plus the header navigation. The i18n architecture uses next-intl with namespace-based JSON translation files (en.json, nl.json, es.json). Six skill pages (content-creator, voice-agent, lead-qualifier, social-media, ad-creator, reporting) use full translation keys via `getTranslations()`. Two skill pages (chatbot, email) have almost entirely hardcoded English strings in their page.tsx files -- these must be converted to translation keys first. The homepage is fully translated via the `home` namespace.

The critical finding is the inconsistency between pages: some use `t()` translation functions throughout, while chatbot and email pages have inline hardcoded strings for hero text, use cases, pricing, trust metrics, and CTAs. This means the copy overhaul has two distinct workstreams: (1) rewrite translation keys in JSON files for the 6 properly-translated pages + homepage, and (2) refactor chatbot/email pages to use translation keys AND write the new copy simultaneously.

**Primary recommendation:** Fix chatbot/email translation architecture first, then do a single systematic pass through all 3 JSON files rewriting every string to Clyde-centric messaging with task-result storytelling.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- The AI employee is named **Clyde** -- "FutureMarketingAI presents Clyde"
- Clyde is positioned as a **real colleague**, not a tool or platform
- Agencies interact with Clyde via **chat (ad-hoc tasks) AND dashboard (configuration/monitoring)**
- Emotional hook: **wow/ontzag** -- visitors should feel amazed at what's possible
- Messaging hierarchy on every page: **wow first** (what Clyde can do) -> **human comparison** (unlike a human, Clyde works 24/7, never gets sick, learns continuously) -> **results** (hard numbers and proof)
- Every skill page shows an **"opdracht -> resultaat" (task -> result) flow** -- a concrete example of giving Clyde a task and seeing the output
- Each skill gets its own example command (8 specific commands defined in CONTEXT.md)
- Tone: **Premium and authority** -- high-end positioning matching EUR 997+/mo price point
- Confident, not salesy. Authoritative, not arrogant. No "possibly" or "can help with" -- Clyde DOES it
- Short, powerful sentences. No fluff
- Primary CTA: **"Meet Clyde"** -> routes to interactive demo/kennismaking
- Secondary CTA: **"Book a Strategy Call"** -> Calendly booking
- **Native-quality copy per language** -- not translations but rewrites
- English is primary (crafted first), NL and ES are **herschreven** (rewritten)
- "Clyde" stays "Clyde" in all languages -- only surrounding copy adapts
- Product name: **Clyde** by FutureMarketingAI

### Claude's Discretion

- Exact wording of each skill page's example command
- How to visually present the task -> result flow (chat bubble mockup, terminal-style, or card-based)
- Specific trust badges and social proof placement
- FAQ content per skill page
- Exact metrics/numbers in trust sections (should be realistic/aspirational)

### Deferred Ideas (OUT OF SCOPE)

- Clyde avatar/mascot design -- visual identity for Clyde (design phase)
- Clyde chatbot personality -- updating the actual chatbot widget to respond as "Clyde" (separate implementation phase)
- Video content showing Clyde in action -- demo videos for each skill
- Client testimonials/case studies featuring Clyde results

</user_constraints>

## Architecture Patterns

### Current Page Inventory and Translation Status

| Page            | File Path                                                   | Translation Namespace    | Status                                                                                                                                                     |
| --------------- | ----------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage        | `src/app/[locale]/page.tsx`                                 | `home`                   | FULLY TRANSLATED -- all strings use `t()`                                                                                                                  |
| Content Creator | `src/app/[locale]/(skills)/skills/content-creator/page.tsx` | `skills-content-creator` | MOSTLY TRANSLATED -- hero/features/how-it-works/use-cases/cta use `t()`, but SocialProof/FeatureShowcase/ProductMedia/Pricing have hardcoded English props |
| Voice Agent     | `src/app/[locale]/(skills)/skills/voice-agent/page.tsx`     | `skills-voice-agent`     | MOSTLY TRANSLATED -- hero/features/how-it-works/use-cases/cta use `t()`, but Pricing/TrustMetrics have hardcoded English props                             |
| Lead Qualifier  | `src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx`  | `skills-lead-qualifier`  | MOSTLY TRANSLATED -- same pattern, Pricing/TrustMetrics hardcoded                                                                                          |
| Social Media    | `src/app/[locale]/(skills)/skills/social-media/page.tsx`    | `skills-social-media`    | MOSTLY TRANSLATED -- SocialProof/FeatureShowcase/Pricing/TrustMetrics hardcoded                                                                            |
| Ad Creator      | `src/app/[locale]/(skills)/skills/ad-creator/page.tsx`      | `skills-ad-creator`      | FULLY TRANSLATED -- no hardcoded strings (no pricing/trust sections)                                                                                       |
| Reporting       | `src/app/[locale]/(skills)/skills/reporting/page.tsx`       | `skills-reporting`       | FULLY TRANSLATED -- no hardcoded strings (no pricing/trust sections)                                                                                       |
| **Chatbot**     | `src/app/[locale]/(skills)/skills/chatbot/page.tsx`         | `skills-chatbot`         | **CRITICAL: Almost entirely hardcoded** -- hero, use cases, pricing, trust metrics, CTA all inline English. Only `meta` namespace exists in JSON           |
| **Email**       | `src/app/[locale]/(skills)/skills/email/page.tsx`           | `skills-email`           | **CRITICAL: Almost entirely hardcoded** -- hero, use cases, pricing, trust metrics, CTA all inline English. Only `meta` namespace exists in JSON           |
| Header          | `src/components/layout/HeaderClient.tsx`                    | N/A (hardcoded)          | **HARDCODED** -- SKILL_ITEMS array has inline English titles/descriptions, NAV_ITEMS has inline labels, CTA button text is hardcoded                       |

### Translation Key Structure (Established Pattern)

The 6 fully-translated skill pages follow this exact key structure per namespace:

```json
{
  "skills-{slug}": {
    "meta": { "title": "...", "description": "..." },
    "hero": { "badge": "...", "title": "...", "description": "..." },
    "features": {
      "heading": "...",
      "items": {
        "{key}": { "title": "...", "description": "..." }
      }
    },
    "how_it_works": {
      "heading": "...",
      "steps": {
        "{key}": { "title": "...", "description": "..." }
      }
    },
    "use_cases": {
      "heading": "...",
      "items": {
        "{key}": { "title": "...", "description": "..." }
      }
    },
    "cta": { "title": "...", "subtitle": "...", "button": "..." }
  }
}
```

Each skill namespace has approximately 29 keys. This structure must be replicated for chatbot and email pages.

### New Keys Needed for Clyde Messaging

Each skill page needs NEW translation keys added for the task-result storytelling section:

```json
{
  "task_demo": {
    "heading": "...",
    "command": "...",
    "result_title": "...",
    "result_description": "..."
  }
}
```

### Homepage Key Structure (home namespace)

The homepage has these sections that all need Clyde rewriting:

- `hero` (badge, headlineMain, headlineAccent, subtitle, trustAnchor, cta, ctaSecondary)
- `services` (title, subtitle, and 6 skill cards with number/title/description)
- `trust` (title, 4 trust cards with title/description)
- `stats` (4 stats with value/label)
- `badges` (title + 6 badge labels)
- `cta` (title, subtitle, button)
- `faq` (title + 5 Q&A pairs)

### Hardcoded Strings Inventory

**Chatbot page (page.tsx) hardcoded strings to extract:**

- WebPageJsonLd name and description
- Hero badge ("Chatbot Skill"), h1, description, CTA button
- Use case items (4 items, each with key/title/description)
- SectionHeading texts ("Use Cases", "Pricing", "Results That Speak", "Ready to Deploy AI Chatbots?")
- PricingTiers props (3 tiers with name/price/period/features/badge)
- TrustMetrics props (3 metrics with value/label/description)
- CTA description text and button text

**Email page (page.tsx) hardcoded strings to extract:**

- WebPageJsonLd name and description
- Hero badge ("Email Skill"), h1, description, CTA button
- Use case items (4 items, each with key/title/description)
- SectionHeading texts
- PricingTiers props (3 tiers)
- TrustMetrics props (3 metrics)
- CTA text and button text

**Content Creator page hardcoded strings:**

- SocialProof props (quote, author, role, company)
- FeatureShowcase features array (6 items with title/description/icon)
- SectionHeading "The AI Content Engine", "See It in Action", "Pricing"
- ProductMedia props (title, description)
- PricingTiers props (3 tiers)

**Voice Agent page hardcoded strings:**

- SectionHeading "Pricing", "Results That Speak"
- PricingTiers props (3 tiers)
- TrustMetrics props (3 metrics)

**Lead Qualifier page hardcoded strings:**

- SectionHeading "Pricing", "Results That Speak"
- PricingTiers props (3 tiers)
- TrustMetrics props (3 metrics)

**Social Media page hardcoded strings:**

- SocialProof props
- FeatureShowcase features array (6 items)
- SectionHeading "The AI Social Media Engine", "Pricing", "Results That Speak"
- PricingTiers props (3 tiers)
- TrustMetrics props (3 metrics)

**Header (HeaderClient.tsx) hardcoded strings:**

- SKILL_ITEMS array: 8 items with title/description
- NAV_ITEMS array: 4 items with label
- CTA button text "See Our Work"
- Login text "Login" / "Log In"

### File Modification Map

Total files that need changes:

| File                                                        | Change Type                                                           |
| ----------------------------------------------------------- | --------------------------------------------------------------------- |
| `messages/en.json`                                          | Rewrite all copy to Clyde messaging + add new keys                    |
| `messages/nl.json`                                          | Native Dutch rewrite of all copy                                      |
| `messages/es.json`                                          | Native Spanish rewrite of all copy                                    |
| `src/app/[locale]/page.tsx`                                 | Update CTA hrefs (Meet Clyde routing), possibly add task-demo section |
| `src/app/[locale]/(skills)/skills/chatbot/page.tsx`         | Convert hardcoded strings to `t()` calls                              |
| `src/app/[locale]/(skills)/skills/email/page.tsx`           | Convert hardcoded strings to `t()` calls                              |
| `src/app/[locale]/(skills)/skills/content-creator/page.tsx` | Convert remaining hardcoded props to `t()` calls                      |
| `src/app/[locale]/(skills)/skills/voice-agent/page.tsx`     | Convert hardcoded pricing/trust to `t()` calls                        |
| `src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx`  | Convert hardcoded pricing/trust to `t()` calls                        |
| `src/app/[locale]/(skills)/skills/social-media/page.tsx`    | Convert hardcoded props to `t()` calls                                |
| `src/app/[locale]/(skills)/skills/ad-creator/page.tsx`      | Minimal -- add task-demo section                                      |
| `src/app/[locale]/(skills)/skills/reporting/page.tsx`       | Minimal -- add task-demo section                                      |
| `src/components/layout/HeaderClient.tsx`                    | Update SKILL_ITEMS descriptions for Clyde messaging                   |

### Recommended Project Structure for Copy Work

```
Wave 1: Translation Architecture Fix
  - Convert chatbot/email pages to use t() translation keys
  - Add getTranslations import and namespace binding
  - Create full skill namespace in all 3 JSON files
  - Convert hardcoded props on other skill pages to t() keys

Wave 2: Homepage + Header Clyde Rewrite (EN)
  - Rewrite home namespace with Clyde messaging
  - Update header SKILL_ITEMS descriptions
  - Update CTA links and button text

Wave 3: Skill Pages Clyde Rewrite (EN) + Task-Result Section
  - Rewrite all 8 skill namespaces with Clyde storytelling
  - Add task_demo keys for each skill
  - Add task-result UI section to each page

Wave 4: NL and ES Native Rewrites
  - Native Dutch rewrite of all changed keys
  - Native Spanish rewrite of all changed keys
```

## Don't Hand-Roll

| Problem                     | Don't Build              | Use Instead                                                    | Why                                                  |
| --------------------------- | ------------------------ | -------------------------------------------------------------- | ---------------------------------------------------- |
| Translation key management  | Manual key tracking      | next-intl namespace pattern already established                | Consistency with existing 29-key-per-skill structure |
| Component-level translation | Custom translation hooks | `getTranslations({ locale, namespace })` from next-intl/server | Already used by 6 skill pages, proven pattern        |
| Hardcoded string detection  | Manual code review       | This research doc's inventory                                  | Complete audit already done                          |

## Common Pitfalls

### Pitfall 1: Forgetting to update all 3 JSON files simultaneously

**What goes wrong:** Adding/renaming keys in en.json but not nl.json/es.json causes runtime errors
**Why it happens:** Easy to focus on English first and forget the other files
**How to avoid:** Always update all 3 files in the same commit. JSON structure must match exactly across files
**Warning signs:** Build warnings about missing translation keys, blank text on non-English locale pages

### Pitfall 2: Mixing hardcoded and translated strings on the same page

**What goes wrong:** Some text translates, some stays English on NL/ES pages
**Why it happens:** Shared components like PricingTiers/TrustMetrics receive props as hardcoded strings
**How to avoid:** Pass translated strings as props: `<PricingTiers tiers={[{ name: t('pricing.tier1.name'), ... }]} />`
**Warning signs:** Any string literal in JSX that is not wrapped in `t()`

### Pitfall 3: Breaking existing translation key references

**What goes wrong:** Renaming keys breaks pages that reference them
**Why it happens:** Changing key names during copy rewrite without updating component references
**How to avoid:** Keep existing key names, only change values. If keys must change, update both JSON and component references
**Warning signs:** Missing translation warnings in dev console

### Pitfall 4: CTA routing inconsistency

**What goes wrong:** "Meet Clyde" CTA has no destination page, or different pages link to different targets
**Why it happens:** New CTA strategy ("Meet Clyde" + "Book a Strategy Call") differs from current CTAs ("See Pricing", "Get Started")
**How to avoid:** Define CTA targets upfront. "Meet Clyde" likely routes to `/chatbot` demo or a new `/meet-clyde` page (decision needed). "Book a Strategy Call" routes to `/contact` or Calendly modal
**Warning signs:** CTAs pointing to non-existent routes

### Pitfall 5: Chatbot/email page refactor breaks existing functionality

**What goes wrong:** Converting from hardcoded to t() breaks because page was not importing getTranslations
**Why it happens:** Chatbot page imports `setRequestLocale` but not `getTranslations`. Email page same.
**How to avoid:** Add `getTranslations` import and `const t = await getTranslations(...)` before converting strings
**Warning signs:** TypeScript errors about `t` not being defined

### Pitfall 6: SocialProof/FeatureShowcase/ProductMedia components accept hardcoded props

**What goes wrong:** These shared components receive string props directly, so they can't be translated without changing the call site
**Why it happens:** Components were built with hardcoded English props, not translation keys
**How to avoid:** Keep components as-is (they accept string props), but pass translated strings from the page level: `<SocialProof quote={t('social_proof.quote')} />`

## Code Examples

### Converting a hardcoded page to use translations (chatbot example)

Current (broken for i18n):

```tsx
// No getTranslations import
export default async function ChatbotPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <h1>AI Chatbots for Your Agency Clients</h1> // hardcoded
  )
}
```

Fixed:

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server'

export default async function ChatbotPage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'skills-chatbot' })

  return (
    <h1>{t('hero.title')}</h1> // from translation file
  )
}
```

### Passing translated strings to shared components

```tsx
<PricingTiers
  tiers={[
    {
      name: t('pricing.tiers.starter.name'),
      price: t('pricing.tiers.starter.price'),
      period: t('pricing.tiers.starter.period'),
      features: [
        t('pricing.tiers.starter.features_0'),
        t('pricing.tiers.starter.features_1'),
        t('pricing.tiers.starter.features_2'),
      ],
    },
  ]}
/>
```

### Task-Result storytelling section pattern (new)

```tsx
{
  /* Task Demo -- Clyde in Action */
}
;<section aria-labelledby="task-demo" className="py-20 px-6 lg:px-12">
  <div className="max-w-4xl mx-auto">
    <SectionHeading id="task-demo">{t('task_demo.heading')}</SectionHeading>
    <div className="mt-10 space-y-6">
      {/* Command bubble */}
      <GlassCard className="border-accent-system/30">
        <div className="flex items-start gap-3">
          <span className="text-sm font-mono text-accent-system">You:</span>
          <p className="text-text-primary font-medium">{t('task_demo.command')}</p>
        </div>
      </GlassCard>
      {/* Result */}
      <GlassCard>
        <div className="flex items-start gap-3">
          <span className="text-sm font-mono text-[#00FF88]">Clyde:</span>
          <div>
            <p className="text-text-primary font-semibold mb-2">{t('task_demo.result_title')}</p>
            <p className="text-text-secondary">{t('task_demo.result_description')}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
</section>
```

## Key Metrics for Copy

### Pages and Translation Keys Affected

| Scope                                  | Count                                                                         |
| -------------------------------------- | ----------------------------------------------------------------------------- |
| Pages needing copy changes             | 9 (homepage + 8 skills)                                                       |
| Page files needing code changes        | 8 (chatbot, email need full refactor; 4 need partial prop extraction; header) |
| Translation namespaces to rewrite      | 9 (home + 8 skills-\*)                                                        |
| JSON files to update                   | 3 (en.json, nl.json, es.json)                                                 |
| Estimated new/changed translation keys | ~350-400 across all namespaces                                                |
| Current en.json size                   | 1525 lines -- will grow to ~1700-1800 with task_demo keys                     |

### CTA Routing Decision Needed

The "Meet Clyde" primary CTA needs a target. Options:

1. Route to `/skills/chatbot` page where DemoPlayground lives (existing)
2. Route to `/#demo` anchor on homepage (if demo section is added)
3. Create a new `/meet-clyde` page (scope creep)

**Recommendation:** Route to `/skills/chatbot` for now -- it has the DemoPlayground interactive demo. This is the closest "meeting Clyde" experience without building new pages.

## State of the Art

| Old Approach                              | Current Approach                        | Impact                                        |
| ----------------------------------------- | --------------------------------------- | --------------------------------------------- |
| Generic "AI Marketing Employee" messaging | Named employee "Clyde" with personality | More memorable, tangible, differentiated      |
| Feature-first copy ("we offer X")         | Wow-first + human comparison + results  | Higher emotional impact, better conversion    |
| "See Pricing" / "Get Started" CTAs        | "Meet Clyde" + "Book a Strategy Call"   | Buyer-stage-appropriate, curiosity-driven     |
| Same copy translated                      | Native rewrites per language            | Sounds natural, builds trust in local markets |

## Open Questions

1. **"Meet Clyde" CTA target route**
   - What we know: Primary CTA should be "Meet Clyde"
   - What's unclear: What page/section this routes to
   - Recommendation: Use `/skills/chatbot` (has DemoPlayground) or homepage `#demo` section

2. **Header navigation copy language**
   - What we know: HeaderClient.tsx uses hardcoded English, was kept that way intentionally per prior decision (01-02)
   - What's unclear: Should header SKILL_ITEMS descriptions now mention Clyde, or stay generic? Should they be translated?
   - Recommendation: Update descriptions to reference Clyde (e.g., "Clyde writes blog posts, social content, newsletters"), keep English-only per existing pattern

3. **Skill-page pricing sections: keep or remove?**
   - What we know: Per-skill pricing tiers (separate from main pricing page) exist on some pages with different prices than the AaaS tiers
   - What's unclear: These per-skill prices (EUR 497/597/997 etc.) conflict with the AaaS agent tier pricing (EUR 997/1,497/1,997/3,497)
   - Recommendation: Remove per-skill pricing sections from skill pages. Link to main `/pricing` page instead. Avoids confusion with the agent tier model.

## Sources

### Primary (HIGH confidence)

- Direct codebase inspection of all 8 skill page.tsx files
- Direct inspection of messages/en.json (1525 lines, all namespaces)
- Direct inspection of HeaderClient.tsx
- Direct inspection of homepage page.tsx

### Secondary (MEDIUM confidence)

- 07-CONTEXT.md decisions and competitive references (Lindy.ai pattern)

## Metadata

**Confidence breakdown:**

- Translation architecture: HIGH -- direct code inspection, patterns clearly established
- Page inventory: HIGH -- every file read and catalogued
- Hardcoded strings audit: HIGH -- line-by-line inspection of all pages
- Copy strategy: HIGH -- detailed CONTEXT.md with locked decisions
- CTA routing: MEDIUM -- target page needs user decision

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable -- architecture is frozen, only copy changes)
