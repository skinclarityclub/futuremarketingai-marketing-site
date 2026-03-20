# Phase 6 Research: Vite Feature Parity

## Context

The FMai website was migrated from Vite/React-Router to Next.js/App Router (Phase 1: Website Rebrand). During the migration, interactive demos, pricing sections, trust metrics, and the enhanced language switcher were not ported. This phase closes the gap.

## Detailed Gap Analysis (Vite → Next.js)

### 1. Chatbots Skill Page

**Vite source:** `src/pages/ChatbotsPage.tsx`
**Next.js target:** `fmai-nextjs/src/app/[locale]/(services)/chatbots/page.tsx`

| Component             | Vite                                                                                         | Next.js                                                                                         | Action                                   |
| --------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------- |
| DemoPlayground        | 4 personas (ecommerce, leadgen, support, concierge)                                          | 3 personas (simplified, missing concierge)                                                      | Restore 4th persona, match Vite behavior |
| MultiPlatformShowcase | Architecture diagram: Claude AI → Website/Shopify/WhatsApp with animated connection lines    | MISSING entirely                                                                                | Port component                           |
| ProgressiveCTA        | Message-count-based CTA that changes content based on interaction depth                      | Component EXISTS (`fmai-nextjs/src/components/chatbot/ProgressiveCTA.tsx`) but NOT USED on page | Wire it into the page                    |
| Pricing Tiers         | 3-tier pricing cards (Starter/Growth/Scale) with setup fees, features list, highlighted tier | MISSING — redirects to /pricing                                                                 | Port pricing section                     |
| Trust Metrics         | 3-column grid (inquiries processed, 24/7 availability, CRM integrations)                     | MISSING                                                                                         | Port section                             |
| Process Steps         | 3 numbered cards (Discovery, Build, Optimize)                                                | Simpler 3-column grid                                                                           | Enhance styling                          |

**Vite component imports to port:**

- `src/components/chatbot/DemoPlayground.tsx` (already exists in Next.js, needs persona update)
- `src/components/chatbot/MultiPlatformShowcase.tsx` → NEW in Next.js
- `src/components/chatbot/ProgressiveCTA.tsx` (already exists, needs wiring)

### 2. Voice Agents Skill Page

**Vite source:** `src/pages/VoiceAgentsPage.tsx`
**Next.js target:** `fmai-nextjs/src/app/[locale]/(services)/voice-agents/page.tsx`

| Component           | Vite                                                                                                                                        | Next.js              | Action                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | --------------------- |
| VoiceDemoSection    | Full interactive demo with PhoneMockup, VoiceDemoPhone, useElevenLabsCall hook, direct phone number (+1 570-783-8236), 3 feature indicators | MISSING entirely     | Port component + hook |
| VoiceDemoFAB        | Floating action button appears when demo scrolls out of view                                                                                | MISSING              | Port component        |
| Pricing Tiers       | 3-tier (Starter 200min, Growth 500min, Scale 1000min/mo)                                                                                    | MISSING              | Port pricing section  |
| Trust Metrics       | 3-column (availability, calls completed, accuracy)                                                                                          | MISSING              | Port section          |
| Partnership Section | Card with partnership highlight                                                                                                             | Simplified text-only | Enhance to card       |

**Vite component imports to port:**

- `src/components/voice/VoiceDemoSection.tsx` → NEW in Next.js
- `src/components/voice/VoiceDemoFAB.tsx` → NEW in Next.js
- `src/components/voice/VoiceDemoPhone.tsx` → NEW in Next.js
- `src/components/voice/PhoneMockup.tsx` → NEW in Next.js
- `src/hooks/useElevenLabsCall.ts` → NEW in Next.js

### 3. Marketing Machine Skill Page

**Vite source:** `src/pages/MarketingMachinePage.tsx`
**Next.js target:** `fmai-nextjs/src/app/[locale]/(services)/marketing-machine/page.tsx`

| Component          | Vite                                                      | Next.js            | Action                  |
| ------------------ | --------------------------------------------------------- | ------------------ | ----------------------- |
| VisionTimeline     | 3-era AI adoption timeline (lazy-loaded)                  | MISSING            | Port component          |
| FeatureShowcase    | Card-based showcase of 6 AI modules with visual hierarchy | Simple 6-item grid | Port showcase component |
| FeaturesSection    | Detailed breakdown of module features (lazy-loaded)       | Basic cards only   | Port section            |
| SocialProof        | Trust element before features                             | MISSING            | Port section            |
| Pricing Tiers      | 3-tier with highlighted "Marketing Machine" tier          | MISSING            | Port section            |
| Product Demo Media | ProductMedia component with video placeholder             | MISSING            | Port component          |

**Vite component imports to port:**

- `src/components/marketing-machine/VisionTimeline.tsx` → NEW (check if exists)
- `src/components/marketing-machine/FeatureShowcase.tsx` → NEW
- `src/components/common/SocialProof.tsx` → NEW
- `src/components/common/ProductMedia.tsx` → NEW

### 4. Automations Skill Page

**Vite source:** `src/pages/AutomationsPage.tsx`
**Next.js target:** `fmai-nextjs/src/app/[locale]/(services)/automations/page.tsx`

| Component             | Vite                                                 | Next.js                          | Action          |
| --------------------- | ---------------------------------------------------- | -------------------------------- | --------------- |
| Pricing Tiers         | 3-tier (5/10/20 workflows)                           | MISSING                          | Port section    |
| Trust Metrics         | 3 metrics (hours saved, delivery time, success rate) | MISSING                          | Port section    |
| Product Demo Media    | ProductMedia with video placeholder                  | MISSING                          | Port component  |
| What We Automate Grid | 6 items with icons                                   | 6 items but no icons, simplified | Enhance styling |

### 5. Language Switcher (ALL pages)

**Vite source:** `src/components/common/LanguageSwitcher.tsx`
**Next.js current:** `fmai-nextjs/src/components/layout/HeaderClient.tsx` (lines 236-279 desktop, 374-391 mobile)

| Feature                  | Vite                               | Next.js                            | Action             |
| ------------------------ | ---------------------------------- | ---------------------------------- | ------------------ |
| Flag emojis              | Yes (🇬🇧/🇳🇱/🇪🇸)                     | No — just "EN"/"NL"/"ES" text      | Add flags          |
| Full language names      | Yes (English, Nederlands, Español) | Yes in dropdown                    | Keep               |
| Checkmark for selected   | Yes (animated SVG)                 | No — color highlight only          | Add checkmark      |
| Variants                 | 3 (default, compact, mobile)       | 2 (desktop button, mobile buttons) | Enhance both       |
| Analytics tracking       | Yes (gtag event)                   | No                                 | Add tracking       |
| Framer Motion animations | Yes (scale + opacity)              | Yes (basic)                        | Match Vite quality |

**Key difference:** Vite uses `react-i18next` / `i18n.changeLanguage()`. Next.js uses `next-intl` / `router.replace(pathname, { locale })`. The Next.js approach is correct for server-side routing — keep it, just enhance the UI.

## Technical Considerations

### i18n Approach

- Next.js uses `next-intl` with server components — this is CORRECT and should NOT change
- Vite uses `react-i18next` with client-side switching — DO NOT port the i18n mechanism
- Only port the UI/UX of the language switcher, keep `router.replace()` for actual switching

### Component Architecture

- Vite components are all client-side React
- Next.js uses Server Components by default, `'use client'` where needed
- Interactive demos (DemoPlayground, VoiceDemoSection) MUST be client components
- Pricing sections and trust metrics can be server components (static content)
- Use dynamic imports / `React.lazy()` for heavy components (VoiceDemoSection, DemoPlayground)

### Design System

- Vite uses custom Tailwind classes: `bg-dark-card`, `text-accent-primary`, `bg-dark-bg`
- Next.js uses updated tokens: `bg-bg-deep`, `text-accent-system`, `bg-bg-elevated`, `text-text-primary`
- Map Vite tokens → Next.js tokens when porting

**Token mapping:**
| Vite | Next.js |
|------|---------|
| `bg-dark-bg` | `bg-bg-deep` |
| `bg-dark-card` | `bg-bg-elevated` |
| `text-accent-primary` (#00D4FF) | `text-accent-system` |
| `text-accent-secondary` (#A855F7) | `text-accent-secondary` |
| `border-white/10` | `border-border-primary` |
| `text-white/80` | `text-text-secondary` |
| `text-white/60` | `text-text-muted` |

### ElevenLabs Voice Integration

- Vite has `useElevenLabsCall` hook connecting to ElevenLabs Conversational AI
- This requires an API key / agent ID — check if still active
- Port the hook but make it gracefully degrade if API is unavailable

## File Inventory — Source Files to Port

### From Vite `src/components/`

```
chatbot/
  DemoPlayground.tsx          → Already exists in Next.js, needs 4th persona
  MultiPlatformShowcase.tsx   → NEW
  ProgressiveCTA.tsx          → Already exists, needs wiring

voice/
  VoiceDemoSection.tsx        → NEW
  VoiceDemoFAB.tsx            → NEW
  VoiceDemoPhone.tsx          → NEW
  PhoneMockup.tsx             → NEW

common/
  LanguageSwitcher.tsx         → Enhance existing HeaderClient.tsx
  ProductMedia.tsx             → Check if exists, else NEW
  SocialProof.tsx              → Check if exists, else NEW

marketing-machine/
  VisionTimeline.tsx           → Check if exists, else NEW
  FeatureShowcase.tsx          → Check if exists, else NEW
```

### From Vite `src/hooks/`

```
useElevenLabsCall.ts          → NEW in Next.js
```

### From Vite `src/pages/` (section templates)

```
ChatbotsPage.tsx              → Reference for section order + pricing data
VoiceAgentsPage.tsx           → Reference for section order + pricing data
MarketingMachinePage.tsx      → Reference for section order + pricing data
AutomationsPage.tsx           → Reference for section order + pricing data
```

## Suggested Plan Breakdown

**Plan 06-01:** Language switcher enhancement (all pages, quick win)

- Enhance HeaderClient.tsx desktop locale button with flags + names
- Enhance mobile locale buttons with flags
- Add gtag analytics tracking
- Add animated checkmark for selected language

**Plan 06-02:** Chatbots page — DemoPlayground + MultiPlatformShowcase + ProgressiveCTA

- Restore 4th persona (concierge) to DemoPlayground
- Port MultiPlatformShowcase component
- Wire ProgressiveCTA into page
- Add pricing tiers section
- Add trust metrics section

**Plan 06-03:** Voice Agents page — VoiceDemoSection + VoiceDemoFAB

- Port VoiceDemoSection with PhoneMockup and VoiceDemoPhone
- Port useElevenLabsCall hook
- Port VoiceDemoFAB floating button
- Add pricing tiers section
- Add trust metrics section

**Plan 06-04:** Marketing Machine page — VisionTimeline + FeatureShowcase + SocialProof

- Port VisionTimeline component
- Port FeatureShowcase component
- Port SocialProof section
- Add pricing tiers section
- Add product demo media

**Plan 06-05:** Automations page — Pricing + Trust Metrics + Product Media

- Add pricing tiers section
- Add trust metrics section
- Add product demo media
- Enhance What We Automate grid with icons
