---
phase: 10
title: Homepage Restructuring & Marketing Machine Page
researched: 2026-03-13
confidence: MEDIUM
tags: [research, homepage, multi-brand, i18n, marketing-machine]
---

# Phase 10 Research: Homepage Restructuring & Marketing Machine Page

**Domain:** Multi-brand AI agency website — hub homepage + dedicated service page
**Overall confidence:** MEDIUM (web search verified against official docs where possible)

---

## 1. Multi-Brand Homepage Patterns

### How companies with sub-brands structure their homepage

**The hub-and-spoke model is the dominant pattern for branded-house architectures.**

A branded house (one parent brand with named sub-services — like FutureAI → FutureMarketingAI / FutureChatAI / FutureVoiceAI) keeps the parent brand visible while routing users into specialized service experiences. This is distinct from a "house of brands" (Unilever, P&G) where each brand operates independently.

**Google's pattern (HIGH confidence — observable):**

- Homepage is a _single product_ (Search), not a hub
- Across-product navigation lives in the 9-dot Waffle menu — a second-level layer, not the hero
- Sub-brands (Google Cloud, Google Maps, Google Workspace) each have completely independent homepages at separate URLs (cloud.google.com, workspace.google.com)
- The parent homepage does NOT try to sell all products simultaneously

**Adobe's pattern (HIGH confidence — observable):**

- adobe.com shows three clouds (Creative Cloud, Document Cloud, Experience Cloud) as distinct tabs/sections in the header
- Each cloud has its own landing page but shares the Adobe parent nav
- The homepage hero rotates between use cases, not products — it sells the _Adobe identity_ first
- Product discovery happens via mega-menu, not homepage hero cards

**Lesson for FutureAI:** The homepage should sell the _FutureAI identity_ (the parent vision) and route visitors into services, not simultaneously pitch three separate products. The hero should answer "What is FutureAI?" — services come below the fold or in dedicated sections.

### Hub-and-Spoke Web Architecture (MEDIUM confidence — WebSearch)

The hub-and-spoke pattern organizes a website around a central hub (parent brand page) with spokes radiating outward (service-specific pages). Key properties:

- Hub concentrates shared identity, navigation, and trust signals
- Spokes inherit authority from the hub domain (SEO benefit of subfolder paths: futureai.com/marketing vs separate domain)
- Hub does NOT duplicate spoke content — it summarizes and routes
- Navigation between spokes happens through the hub, not by jumping directly between spoke pages

**Subfolder > subdomain for branded houses** (MEDIUM confidence — 2026 SEO consensus): `futureai.com/marketing-machine` inherits domain authority. A separate `futuremarketingai.com` splits it. The current setup (routes inside one React app) is architecturally correct for SEO.

### Recommended homepage structure for FutureAI

Based on analysis of successful multi-service hubs:

```
ABOVE FOLD
  Hero: FutureAI parent identity + one-liner on the mission
  Primary CTA: "Explore Services" (scrolls down) or "Book a call"

BELOW FOLD — Service Cards (3 cards)
  [FutureMarketingAI]  [FutureChatAI]  [FutureVoiceAI]
  Each card: icon + name + 1-sentence value prop + "Learn more →"

BELOW FOLD — Trust / Social Proof
  Shared across all services (GDPR, pilot teams, founding members)

BELOW FOLD — Light CTA
  "Not sure where to start? Book a free 30-min AI audit"
```

The hero must NOT try to sell marketing automation — that content belongs on `/marketing-machine`. The homepage sells the _suite_.

---

## 2. Service Hub Page Design

### Best practices for routing from parent brand to child services

**The 3-card grid is the dominant pattern for 2-5 services** (HIGH confidence — observable across Stripe, HubSpot, Notion, Intercom product pages):

- Cards are **scannable in 3 seconds**: icon + service name + 1-line value prop + CTA
- Cards use **visual differentiation** (unique icon, optional accent color per service) while sharing the same card shell
- Each card links to a **dedicated service page** — no modals, no accordions
- Card hover state previews more detail (animated description reveal or border accent)

**Card content pattern that converts:**

```
[Icon]
Service Name          ← Brand name (FutureChatAI)
One-line pitch        ← "AI chat agents that qualify leads 24/7"
[CTA button]          ← "See how it works →"
```

**What to avoid:**

- Listing all features of all services on the homepage (information overload, kills clarity)
- Putting a pricing table on the hub page (premature — user hasn't chosen a service yet)
- Using tabs to switch between service content on the same page (creates confusion about what the company _actually_ is)

**Secondary navigation pattern:** Once a user clicks into `/marketing-machine`, the header can shift branding to "FutureMarketingAI" (your dynamic header already does this). A breadcrumb or "Back to all services" link closes the navigation loop back to the hub.

**Above-the-fold CTA placement** (HIGH confidence — multiple converging sources):

- CTAs placed above the fold outperform below-fold CTAs by 304% on average
- For a hub page, the above-fold CTA should be low-friction: "Explore Services" (scroll anchor) is better than "Book a Demo" because the visitor hasn't yet chosen a service
- The Calendly "Book a call" CTA belongs after the service cards — once the visitor has context

---

## 3. i18n Patterns for Multi-Brand Sites

### Current state

The project uses react-i18next with HTTP backend loading from `/locales/{lng}/{ns}.json`. Current namespaces: `common`, `hero`, `calculator`, `explorer`, `dashboard`, `navigation`, `forms`, `errors`, `analytics`, `ai-assistant`.

The `navigation.json` copyright line is hardcoded as "FutureMarketingAI" — this is a concrete problem for a hub that represents all brands.

### Recommended i18n architecture for multi-brand (MEDIUM confidence — official docs + WebSearch)

**Strategy: Page-scoped namespaces, not brand-scoped namespaces**

Do not create brand namespaces like `futuremarketingai.json` and `futurechatai.json`. Instead, create **page namespaces** that correspond to routes:

```
/locales/en/
  common.json          ← shared UI (keep as-is)
  navigation.json      ← nav + footer (update copyright to FutureAI)
  hero.json            ← existing, relocate to marketing-machine namespace
  marketing-machine.json  ← NEW: all content for /marketing-machine page
  chatbots.json           ← NEW or existing: content for /chatbots page
  voice-agents.json       ← NEW or existing: content for /voice-agents page
  homepage.json           ← NEW: hub homepage content (service cards, parent hero)
```

**Why page-scoped over brand-scoped:**

- react-i18next lazy-loads namespaces by route — you only load what the current page needs
- Avoids deep key nesting (`marketing.hero.headline` vs `hero.headline` in the `marketing-machine` namespace)
- Keeps JSON files under 200 lines — the practical readability limit
- Component reuse: a `<ServiceCard>` component takes translated props rather than knowing which brand namespace to pull from

**Key rule for shared components:** Pass translated strings as props, not namespace references. The `<ServiceCard>` component should receive `{ title, description, cta }` from its parent — the parent decides which namespace to read from.

**Namespace loading pattern:**

```typescript
// On homepage: load 'homepage' namespace
const { t } = useTranslation('homepage')

// On marketing-machine page: load 'marketing-machine' namespace
const { t } = useTranslation('marketing-machine')

// Shared components: accept translated strings as props
<ServiceCard title={t('services.marketing.title')} ... />
```

**i18next official guidance** (HIGH confidence — docs.i18next.com): Namespaces are the primary isolation mechanism. The `ns` array in config declares which namespaces to load eagerly at init — add new namespaces here. Additional namespaces load on-demand when components call `useTranslation('namespace-name')`.

**Translation key depth recommendation** (MEDIUM confidence — i18next community): Keep JSON max 2-3 levels deep. For the homepage service cards:

```json
// locales/en/homepage.json
{
  "hero": {
    "headline": "AI Services That Work While You Sleep",
    "subtitle": "Three specialized AI platforms. One agency.",
    "cta_primary": "Explore Services",
    "cta_secondary": "Book a Free Audit"
  },
  "services": {
    "marketing": {
      "name": "FutureMarketingAI",
      "pitch": "Autonomous content and campaign automation",
      "cta": "See how it works"
    },
    "chat": {
      "name": "FutureChatAI",
      "pitch": "AI chat agents that qualify leads 24/7",
      "cta": "See how it works"
    },
    "voice": {
      "name": "FutureVoiceAI",
      "pitch": "Voice agents that handle calls automatically",
      "cta": "See how it works"
    }
  },
  "trust": {
    "headline": "Trusted by founding teams across Europe"
  }
}
```

**Pitfall to avoid:** The existing `hero.json` is deeply tied to FutureMarketingAI content (36 marketing-automation-specific keys). Do not put hub homepage content into `hero.json` — create a new `homepage.json` namespace and keep `hero.json` for the demo sphere page or repurpose it for `marketing-machine.json`.

**copyright in navigation.json:** Change `"© {{year}} FutureMarketingAI. All rights reserved."` to `"© {{year}} FutureAI. All rights reserved."` across all three locales. This is a one-line fix per locale file.

---

## 4. Marketing Machine / Automation Landing Page Best Practices

### What converts for marketing automation SaaS

**Source confidence: MEDIUM-HIGH** (multiple 2025-2026 sources converging on consistent findings)

**Above-the-fold must-haves:**

1. **Outcome-first headline** — Not "AI Marketing Automation Platform" but "160 Posts/Month, Zero Manual Work". The existing hero.json already has strong variants ("10x Marketing Output, Same Team Size"). These belong on `/marketing-machine`, not on the hub homepage.

2. **One primary CTA above the fold** — For FMai's current stage (founding member pricing, discovery calls), this is "Book Discovery Call" (Calendly). Do not put "Start Free Trial" if there is no self-serve trial. Do not put two equally-weighted CTAs above the fold — one wins.

3. **Trust signal immediately below hero** — The existing SocialProof component (founding teams, tech credibility, GDPR badge) fits here. Move it from wherever it lives on the current homepage into the marketing-machine page's second section.

4. **Social proof stats before features** — Aggregate metrics (€2.5M+ time recovered, 50K+ posts, 20+ companies) should appear before the feature breakdown, not after. Users need to believe in the outcome before they'll care about the mechanism.

**Page structure for /marketing-machine:**

```
SECTION 1: Hero (above fold)
  Headline: outcome-focused
  Subtitle: mechanism in one line
  Primary CTA: "Book Discovery Call" (Calendly)
  Secondary CTA: "Calculate ROI" (internal link to /calculator)
  Trust indicators: "No credit card • 30-min call • 24h response"

SECTION 2: Social Proof / Stats
  SocialProof component (relocated from homepage)
  Aggregate metrics bar

SECTION 3: How It Works
  The 6 AI modules (FeaturesSection component)
  OR a simplified 3-step process visualization

SECTION 4: Case Studies / Results
  Existing case study data (EcoShop NL, TechForce, GreenLife Brands)
  These are strong — use them prominently

SECTION 5: Demo CTA
  "See It In Action" → links to /demo or /explorer
  OR embedded interactive demo preview

SECTION 6: Pricing Teaser
  "Founding member pricing: €X/month. 2 spots remaining."
  CTA: "Apply for Founders Pricing"

SECTION 7: Footer CTA
  "Still not sure? Talk to a human" → Calendly
```

**Demo CTA specifics** (HIGH confidence — multiple sources):

- "Book a Demo" outperforms "Contact Sales" by 30-40% for SaaS (less intimidating)
- Video/interactive demos on the page itself increase conversions by up to 80%
- The existing /explorer and /dashboard interactive demos are major assets — link to them prominently on the marketing-machine page as a no-commitment "try before you call" step
- Place the demo CTA in Section 5 (after social proof + features) — users need context before they're ready to engage with a demo

**Feature presentation pattern:**

- Lead with benefits, not features: "Your team gets 360 hours/month back" > "Automated publishing module"
- Show the output, not the interface: "160 posts/month" with a visual > a screenshot of the dashboard
- The existing case study data in hero.json is strong and specific — surface it in the features section, not just in a separate case studies section

**Urgency / scarcity** (MEDIUM confidence): "Only 2 slots remaining" is a high-performing pattern for founding-member plays. Keep it, but make it visually prominent in the hero section and in a sticky bottom bar (for mobile). The existing StickyBottomCTA and EarlyAdopterBadge components are already built for this.

**Two-CTA model for different buyer stages:**

- Self-serve: "Calculate ROI" (low commitment, existing /calculator page)
- Sales-assisted: "Book Discovery Call" (Calendly)
- Both should appear throughout the page but with different visual weight

---

## 5. Component Relocation Map

This section maps existing components to their new destinations to inform phase planning.

| Component                | Current location | Move to                  | Notes                                           |
| ------------------------ | ---------------- | ------------------------ | ----------------------------------------------- |
| `Hero.tsx` (LandingPage) | Homepage         | Homepage (rework)        | Content becomes FutureAI hub, not FMai pitch    |
| `SocialProof.tsx`        | Homepage         | /marketing-machine       | Already marketing-automation specific           |
| `FeaturesSection.tsx`    | Homepage         | /marketing-machine       | 6 AI modules are FMai-specific                  |
| `FeatureShowcase.tsx`    | Homepage         | /marketing-machine       | Marketing automation showcase                   |
| New: `ServiceCards`      | Does not exist   | Homepage                 | 3 cards for FMai / FutureChatAI / FutureVoiceAI |
| `EarlyAdopterBadge.tsx`  | Homepage         | /marketing-machine       | Founding member content                         |
| `StickyBottomCTA`        | Homepage mobile  | Both pages               | Reusable, parameterize the CTA text             |
| `FounderExpertise.tsx`   | Homepage         | /marketing-machine       | FMai credibility story                          |
| Case study data          | `hero.json`      | `marketing-machine.json` | Move translation keys                           |

---

## 6. Architecture Implications

### Route structure (confirmed existing + new)

```
/                        ← FutureAI hub homepage (NEW content)
/marketing-machine       ← NEW route — FutureMarketingAI dedicated page
/automations             ← Existing (can rename or redirect)
/chatbots                ← Existing (FutureChatAI service page)
/voice-agents            ← Existing (FutureVoiceAI service page)
```

The `/automations` route may need to become `/marketing-machine` or the two pages may serve different purposes. Clarify in planning: is `/automations` a feature list page, or is it the same as `/marketing-machine`? If the same, redirect `/automations` → `/marketing-machine`.

### Dynamic header already solved

Phase 9 context confirms: "Dynamic header branding already works per route." The header shows "FutureMarketingAI" branding on `/marketing-machine` automatically. This is a significant advantage — no new infrastructure needed for brand switching.

### SEO implications (MEDIUM confidence)

The homepage (`/`) should be optimized for "FutureAI" and "AI agency" terms. The `/marketing-machine` page should be optimized for "marketing automation AI" and "autonomous marketing" — the terms currently targeted on the homepage. This is the right split: don't lose existing SEO equity, redistribute it to the right page.

Structured data: the homepage Organization schema stays. Add a `Service` schema on each service page (FutureMarketingAI = a Service of FutureAI).

---

## 7. Pitfalls

### Critical

**Pitfall 1: Splitting brand identity too early**
If the hub homepage is too neutral/generic, it converts poorly. The homepage still needs a strong point of view — "We build AI agents for marketing teams" is specific enough to attract, broad enough to cover all three services.

- Prevention: The homepage hero should speak to a shared audience (marketing teams, growth teams, operations leaders) not to a generic "businesses."

**Pitfall 2: Duplicate content between homepage and /marketing-machine**
If the same case studies, metrics, and features appear on both pages, Google treats it as thin content and visitors who visit both pages feel no progression.

- Prevention: Homepage = teaser (outcome stats + 3-card grid). Marketing-machine = full story (case studies + features + pricing + demo CTA). No block-for-block duplication.

**Pitfall 3: Translation key migration breaking existing references**
Moving content from `hero.json` to `marketing-machine.json` (or `homepage.json`) requires updating every `useTranslation('hero')` call in relocated components.

- Prevention: Create new namespace files first, copy keys, update components, then delete old keys. Never delete first. Run `saveMissing: true` in dev to catch missed keys.

**Pitfall 4: Forgetting ES locale**
The project has EN/NL/ES. NL translations often get done alongside EN; ES sometimes gets missed. A new `homepage.json` namespace needs all three locale files created at the same time, or the Spanish fallback will silently show English keys.

- Prevention: Create all three locale files (`/locales/en/homepage.json`, `/locales/nl/homepage.json`, `/locales/es/homepage.json`) in the same commit, even if NL/ES contain placeholder English text initially.

### Moderate

**Pitfall 5: ServiceCards not designed with the Living System**
New components must use the Living System tokens (teal/amber, bg-deep/surface/elevated, sharp corners) established in Phase 3. If ServiceCards are built with ad-hoc Tailwind classes, they'll require re-tokenization in Phase 9.

- Prevention: Build ServiceCards using `SystemPanel`, `CTAButton`, and the existing token classes from the start.

**Pitfall 6: Mobile CTA confusion across two pages**
The `StickyBottomCTA` component exists for mobile on the homepage. If it migrates to the marketing-machine page, the homepage needs a different mobile CTA (or no sticky CTA if the hub page is not conversion-focused).

- Prevention: Parameterize `StickyBottomCTA` with a `ctaText` and `ctaHref` prop so both pages can use it with different content.

### Minor

**Pitfall 7: /automations route collision**
The existing `/automations` route (`AutomationsPage.tsx`) may be redundant with the new `/marketing-machine` page. Failing to handle this creates two URLs competing for the same keywords.

- Prevention: Decide in planning whether `/automations` becomes an alias, a redirect, or a different page (e.g., a feature-list page that feeds into the marketing-machine pitch).

---

## 8. Sources

- [Multi-Brand Website Examples & Strategy — Alokai](https://alokai.com/blog/multibrand-website-examples)
- [Multi-Brand Website Design Guide — Millennium Agency](https://mill.agency/web-design/guide-multi-brand-website-design/)
- [Best Multi-Brand Websites — Webstacks](https://www.webstacks.com/blog/multi-brand-websites)
- [Brand Architecture Models — Frontify](https://www.frontify.com/en/guide/brand-architecture)
- [Accessible Navigation for Complex Websites — Brand Vision 2026](https://www.brandvm.com/post/accessible-navigation-ux-guide-2026)
- [react-i18next Multiple Translation Files (official)](https://react.i18next.com/guides/multiple-translation-files)
- [i18next Namespaces (official)](https://www.i18next.com/principles/namespaces)
- [useTranslation Hook (official)](https://react.i18next.com/latest/usetranslation-hook)
- [Designing Maintainable Multilingual Apps with i18n — Medium](https://medium.com/@sefailyas1455/designing-maintainable-multilingual-apps-with-i18n-in-react-5868f542c89b)
- [SaaS Landing Pages Best Practices 2026 — Storylane](https://www.storylane.io/blog/saas-landing-pages-best-practices)
- [Marketing SaaS Landing Pages That Convert 2026 — DesignRevision](https://designrevision.com/blog/marketing-saas-landing-pages)
- [10 SaaS Landing Page Trends 2026 — SaaSFrame](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples)
- [Best CTA Placement Strategies 2025 — LandingPageFlow](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages)
- [B2B SaaS Product Page Design — PoweredBySearch](https://www.poweredbysearch.com/blog/how-to-design-b2b-saas-product-pages-with-examples/)
- [High Converting Landing Page Examples — Unbounce](https://unbounce.com/landing-page-examples/high-converting-landing-pages/)
- [25 CTA Statistics 2026 — WiserNotify](https://wisernotify.com/blog/call-to-action-stats/)
- [Hub-and-Spoke Design Pattern — Quora](https://www.quora.com/What-is-hub-and-spoke-design-in-web)
