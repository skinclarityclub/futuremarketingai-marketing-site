# Phase 10: Homepage Restructuring & Marketing Machine Page — Context

## What We're Doing

Transform the homepage from a marketing-automation-focused page into a general **FutureAI hub** that showcases all services. Create a dedicated `/marketing-machine` page with relocated marketing content + demo CTA.

## Dynamic Branding (Already Working)

| Route                | Brand                        | Header Shows                             |
| -------------------- | ---------------------------- | ---------------------------------------- |
| `/`                  | FutureAI → change to general | FutureMarketingAI → should show FutureAI |
| `/marketing-machine` | FutureMarketingAI            | Needs new route condition                |
| `/automations`       | FutureMarketingAI            | Already works                            |
| `/chatbots`          | FutureChatAI                 | Already works                            |
| `/voice-agents`      | FutureVoiceAI                | Already works                            |
| Other pages          | FutureAI                     | Already works                            |

**SimpleHeader.tsx** (lines 42-54): `brandMiddle` logic needs update:

- Remove `path === '/'` from Marketing condition → homepage should show FutureAI
- Add `path.startsWith('/marketing-machine')` → Marketing

**Services dropdown** (hardcoded, not i18n):

```typescript
serviceLinks[3] = { label: 'AI Marketing Machine', href: '/demo' } // → change to /marketing-machine
```

## Current Homepage Structure

**File:** `src/pages/LandingPage.tsx`

Components rendered in order:

1. `<SEOHead>` — meta tags (marketing-focused, needs update)
2. `<StructuredDataPresets.organization />` + `<StructuredDataPresets.website />`
3. `<SimpleHeader />`
4. `<Hero />` — renders:
   - Background effects (HolographicGrid, NeuralNetwork, FloatingParticles, GradientOrbs)
   - Badge: "AI Implementation Partner"
   - Headline: "AI Systems That Run / Your Business."
   - Description: generic AI implementation pitch
   - Trust anchor
   - CTAs: primary → `/automations`, secondary → Calendly
   - **VisionTimeline** (lazy) — 3-era timeline → MOVE to /marketing-machine
   - **FeatureShowcase** (lazy) — 6 AI module cards → MOVE to /marketing-machine
   - **Final CTA** — "Ready to Automate Your Business?" → rework for general services
5. `<MobileEvolutionTimeline />` — mobile-only 3-era timeline → MOVE to /marketing-machine
6. `<StickyBottomCTA />` — mobile-only sticky bar

## What Stays on Homepage vs Moves to /marketing-machine

### STAYS on Homepage (reworked)

- Hero headline + description (rework to general FutureAI pitch: all 3 services)
- Background effects
- CTAs (update to link to all services, not just automations)
- StickyBottomCTA (mobile)
- New: service cards/grid linking to /automations, /chatbots, /voice-agents, /marketing-machine

### MOVES to /marketing-machine

- VisionTimeline (3-era timeline: AI-Assisted → Pioneer → Mainstream)
- FeatureShowcase (6 AI module cards with stats)
- MobileEvolutionTimeline (mobile variant of timeline)
- FeaturesSection (detailed 6-module breakdown — NOT currently on homepage but belongs here)
- SocialProof (founding teams, milestones, guarantees — NOT currently on homepage but belongs here)

## New /marketing-machine Page Structure

Follow same pattern as service pages (AutomationsPage, ChatbotsPage, VoiceAgentsPage):

- `<SimpleHeader />` + `<SEOHead />`
- Hero section with FutureMarketingAI branding
- VisionTimeline
- FeatureShowcase (6 AI modules)
- FeaturesSection (detailed breakdown)
- SocialProof (founding teams, guarantees)
- Pricing/value section
- Final CTA → demo + Calendly
- `<Footer />`

## Router Changes Needed

**File:** `src/App.tsx`

- Add route: `/marketing-machine` → `MarketingMachinePage`
- Add `/marketing-machine` to `marketingPaths` array (controls footer/FloatingNav)

## i18n Issues (Critical)

### NL/ES out of sync with EN

The EN `landing.hero_landing.*` keys were updated for the gateway-services pivot. NL and ES still have old "founding member / wachtlijst" copy:

| Key             | EN (current)                | NL (stale)                    | ES (stale)                    |
| --------------- | --------------------------- | ----------------------------- | ----------------------------- |
| `badge`         | "AI Implementation Partner" | "Next-Gen AI Marketing"       | "Next-Gen AI Marketing"       |
| `main_headline` | "AI Systems That Run"       | "Turn content into growth."   | "Turn content into growth."   |
| `sub_headline`  | "Your Business."            | "On autopilot."               | "On autopilot."               |
| `description`   | Gateway services copy       | Old autonomous marketing copy | Old autonomous marketing copy |
| `cta.primary`   | "See What We Build"         | "Probeer Interactieve Demo"   | "Probar Demo Interactiva"     |
| `cta.secondary` | "Book a Strategy Call"      | "Sluit aan bij Wachtlijst"    | "Unirse a Lista de Espera"    |

### Hardcoded strings

- `SimplifiedHeroMobile.tsx` line 188: `"Live interactieve demo beschikbaar"` — Dutch, not in i18n
- Service pages (AutomationsPage, ChatbotsPage, VoiceAgentsPage) — ALL content hardcoded EN, zero i18n
- FeaturesSection has hardcoded EN strings ("Complete Marketing OS", "Key Benefits", etc.)
- SocialProof `TrustIndicators` export has hardcoded EN strings

### ES common.json structural issues

- Duplicate `"pricing"` block (lines 78-92 and 217-221)
- Duplicate `"actions"` block (lines 28-53 and 229-236)
- Missing `cookie_consent` block
- Extra top-level keys not in EN/NL

## Files That Need Changes

### Must modify

- `src/pages/LandingPage.tsx` — remove VisionTimeline/FeatureShowcase imports, add service grid
- `src/components/landing/Hero.tsx` — remove VisionTimeline/FeatureShowcase lazy loads, rework headline/CTAs
- `src/components/landing/SimplifiedHeroMobile.tsx` — rework for general FutureAI
- `src/components/landing/SimpleHeader.tsx` — update brandMiddle logic + serviceLinks href
- `src/App.tsx` — add /marketing-machine route
- `public/locales/en/common.json` — new keys for general homepage + marketing machine page
- `public/locales/nl/common.json` — sync with EN + new keys
- `public/locales/es/common.json` — sync with EN + new keys + fix structural issues

### Must create

- `src/pages/MarketingMachinePage.tsx` — new page assembling relocated components

### May need updates

- `src/components/landing/SocialProof.tsx` — i18n hardcoded strings
- `src/components/landing/FeaturesSection.tsx` — i18n hardcoded strings
- `src/components/landing/FeatureShowcase.tsx` — verify all strings are i18n'd
- SEO meta tags for both homepage and /marketing-machine

## Service Page Pattern (for reference)

All 3 service pages follow identical structure:

1. `<SimpleHeader />`
2. `<SEOHead />`
3. `<div className="min-h-screen bg-bg-deep">`
4. Hero section with badge + headline + description + 2 CTAs
5. Pain points / use cases grid
6. Process steps (3 steps)
7. Pricing tiers (3 tiers)
8. Trust metrics
9. FAQ accordion
10. Final CTA
11. `<Footer />`

All use `<CTAButton size="lg" calendly arrow>` for primary CTAs.
All content is hardcoded EN (no i18n) — this is a known gap.
