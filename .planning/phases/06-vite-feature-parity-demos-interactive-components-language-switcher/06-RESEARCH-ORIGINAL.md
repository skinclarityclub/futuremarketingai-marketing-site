# Phase 6: Vite Feature Parity -- Demos, Interactive Components & Language Switcher - Research

**Researched:** 2026-03-20
**Domain:** Next.js App Router component porting, interactive demos, i18n UI enhancement
**Confidence:** HIGH

## Summary

This phase is a component-porting effort from an existing Vite/React app to an existing Next.js 16 App Router site. Both codebases are in the same monorepo (`C:\Users\daley\Desktop\Futuremarketingai`). The Vite app lives at root `src/`, the Next.js app at `fmai-nextjs/src/`. The gap analysis provided in the phase brief is accurate and verified against the actual source files. Every component referenced exists in the Vite codebase and can be ported.

The porting work breaks into five categories: (1) interactive demo components for chatbots and voice agents, (2) architecture/showcase components, (3) pricing tier cards and trust metrics sections for all four service pages, (4) VisionTimeline and FeatureShowcase for marketing-machine, and (5) language switcher UI enhancement. The primary technical challenge is adapting Vite components that use `react-i18next`, `framer-motion`, and `import.meta.env` to Next.js equivalents using `next-intl`, `motion/react`, and `process.env.NEXT_PUBLIC_*`.

**Primary recommendation:** Port components in page-priority order (chatbots first since it has the most gaps and highest demo value), treating each page as a self-contained plan. Language switcher is a cross-cutting concern that should be its own plan.

<phase_requirements>

## Phase Requirements

| ID     | Description                                                                      | Research Support                                                                                                                                      |
| ------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| WEB-01 | Website rebrand: all copy targeting "marketing agencies" instead of "businesses" | Pricing tiers and trust metrics need AaaS-reframed copy (already done in Phase 1 locale files -- this phase ports the UI components that render them) |
| WEB-03 | Website new pricing page with Agent tiers                                        | On-page pricing sections per service page complement the main pricing page -- uses GATEWAY_TIERS data pattern from Vite, adapted for AaaS tiers       |

</phase_requirements>

## Standard Stack

### Core (Already in Next.js package.json)

| Library        | Version | Purpose                             | Status    |
| -------------- | ------- | ----------------------------------- | --------- |
| next           | 16.1.7  | Framework                           | Installed |
| react          | 19.2.3  | UI                                  | Installed |
| next-intl      | 4.8.3   | i18n (replaces react-i18next)       | Installed |
| motion         | 12.38.0 | Animations (replaces framer-motion) | Installed |
| lucide-react   | 0.577.0 | Icons                               | Installed |
| zustand        | 5.0.12  | State (chatbotStore)                | Installed |
| tailwind-merge | 3.5.0   | Utility class merging               | Installed |

### Needs Installation

| Library           | Version | Purpose                 | Why Needed                                                           |
| ----------------- | ------- | ----------------------- | -------------------------------------------------------------------- |
| @elevenlabs/react | ^0.14.3 | Voice demo WebRTC calls | Used by useElevenLabsCall hook; installed in Vite but NOT in Next.js |

### Not Needed (Vite-only)

| Library          | Reason                                          |
| ---------------- | ----------------------------------------------- |
| react-i18next    | Replaced by next-intl                           |
| framer-motion    | Replaced by motion/react (already using it)     |
| react-router-dom | Replaced by next/navigation + @/i18n/navigation |

**Installation:**

```bash
cd fmai-nextjs && npm install @elevenlabs/react
```

## Architecture Patterns

### Component Porting Pattern: Vite to Next.js

Every ported component follows this translation map:

| Vite Pattern                                     | Next.js Equivalent                                                                                                      |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `import { useTranslation } from 'react-i18next'` | `import { useTranslations } from 'next-intl'` (client) or `import { getTranslations } from 'next-intl/server'` (server) |
| `const { t } = useTranslation('namespace')`      | `const t = useTranslations('namespace')`                                                                                |
| `t('namespace:key.path')`                        | `t('key.path')` (namespace already scoped)                                                                              |
| `import { motion } from 'framer-motion'`         | `import { motion } from 'motion/react'`                                                                                 |
| `import { Link } from 'react-router-dom'`        | `import { Link } from '@/i18n/navigation'`                                                                              |
| `import.meta.env.VITE_*`                         | `process.env.NEXT_PUBLIC_*`                                                                                             |
| `import { cn } from '../../lib/utils'`           | `import { cn } from '@/lib/utils'` (already exists)                                                                     |

### Client vs Server Component Decision

| Component Type                                 | Directive           | Reason                                           |
| ---------------------------------------------- | ------------------- | ------------------------------------------------ |
| DemoPlayground, ChatWidget                     | `'use client'`      | useState, event handlers, real-time chat         |
| VoiceDemoSection, VoiceDemoFAB, VoiceDemoPhone | `'use client'`      | WebRTC calls, useState, timers                   |
| MultiPlatformShowcase                          | `'use client'`      | CSS animations via style tag, ScrollReveal child |
| VisionTimeline, FeatureShowcase                | `'use client'`      | motion/react whileInView, useInView              |
| PricingTiers (per page)                        | Server component OK | Static data, no interactivity                    |
| TrustMetrics (per page)                        | Server component OK | Static data rendering                            |
| LanguageSwitcher                               | `'use client'`      | useState, dropdown, router.replace               |

### Project Structure for New Components

```
fmai-nextjs/src/
  components/
    chatbot/
      MultiPlatformShowcase.tsx     # NEW - architecture diagram
      DemoPlayground.tsx            # MODIFY - add 4th persona
      ProgressiveCTA.tsx            # EXISTS - wire into page
    voice/
      VoiceDemoSection.tsx          # NEW
      VoiceDemoFAB.tsx              # NEW
      VoiceDemoPhone.tsx            # NEW
      PhoneMockup.tsx               # NEW
      WaveformVisualizer.tsx        # NEW
      CallTranscript.tsx            # NEW
    pricing/
      ServicePricingTiers.tsx       # NEW - reusable 3-tier card grid
      TrustMetrics.tsx              # NEW - reusable 3-column metrics
    marketing-machine/
      VisionTimeline/               # NEW - 5-file directory
        index.tsx
        types.ts
        EraCard.tsx
        TimelineConnector.tsx
        InsightBanner.tsx
      FeatureShowcase.tsx           # NEW
      SocialProof.tsx               # NEW
    layout/
      LanguageSwitcher.tsx          # NEW - extracted from HeaderClient
  hooks/
    useElevenLabsCall.ts            # NEW
    useIntersectionObserver.ts      # NEW (for VoiceDemoFAB visibility)
```

### Design Token Mapping (Verified)

The project already uses the Living System design tokens. Vite and Next.js both share the same token names:

| Token                   | Value          | Used For         |
| ----------------------- | -------------- | ---------------- |
| `bg-bg-deep`            | #050814        | Page backgrounds |
| `bg-bg-elevated`        | Surface cards  | Card backgrounds |
| `text-accent-system`    | #00D4FF (cyan) | Primary accent   |
| `border-border-primary` | white/10       | Card borders     |
| `text-text-primary`     | White          | Headings         |
| `text-text-secondary`   | white/80       | Body text        |
| `text-text-muted`       | white/60       | Muted labels     |

**No token mapping needed** -- both codebases use identical CSS custom property names. Some Vite components use older names (`bg-dark-bg`, `text-accent-primary`) that need updating to the Living System equivalents listed above.

### Pricing Data: AaaS Reframe

The Vite `gateway-pricing.ts` uses old pricing (Starter EUR 1,497 / Growth EUR 2,497 / Scale EUR 3,997). Phase 1 already established AaaS pricing:

| Tier            | Monthly   | Purpose           |
| --------------- | --------- | ----------------- |
| Founding Member | EUR 997   | First 10 agencies |
| Starter         | EUR 1,497 | Entry-level       |
| Growth          | EUR 1,997 | Scaling agencies  |
| Agency          | EUR 3,497 | Full deployment   |

The on-page pricing sections should show **per-service feature limits**, not the full agent tiers. For example, the chatbots page shows conversations/mo limits, voice-agents shows minutes/mo. This data can be hardcoded per-page or extracted into a shared pricing config. Since the main pricing page already exists, on-page pricing serves as a teaser linking to `/pricing`.

## Don't Hand-Roll

| Problem                 | Don't Build                       | Use Instead                         | Why                                          |
| ----------------------- | --------------------------------- | ----------------------------------- | -------------------------------------------- |
| Voice call WebRTC       | Custom WebRTC                     | `@elevenlabs/react` useConversation | Handles ICE, codec negotiation, reconnection |
| i18n routing            | Manual locale detection           | `next-intl` router.replace          | Already integrated, handles URL rewriting    |
| Animation orchestration | Custom IntersectionObserver + CSS | `motion/react` whileInView          | Consistent with existing codebase            |
| Scroll reveal           | Custom observer                   | Existing `ScrollReveal` component   | Already ported to Next.js                    |

## Common Pitfalls

### Pitfall 1: Framer Motion vs Motion Import Path

**What goes wrong:** Importing from `framer-motion` instead of `motion/react`
**Why it happens:** Vite source uses `framer-motion`, Next.js project uses the renamed `motion` package
**How to avoid:** Search-replace all `from 'framer-motion'` with `from 'motion/react'` during porting
**Warning signs:** Build error about missing module

### Pitfall 2: Server Component Importing Client Hook

**What goes wrong:** Page (server component) tries to use `useState` or `useTranslations`
**Why it happens:** Vite has no server/client boundary distinction
**How to avoid:** Interactive sections must be extracted as `'use client'` components, imported by the server page with `dynamic()` for heavy ones
**Warning signs:** "useState is not a function" or "useTranslations is not supported in server components"

### Pitfall 3: ElevenLabs Environment Variable

**What goes wrong:** Voice demo shows "Voice demo not configured"
**Why it happens:** Vite uses `VITE_ELEVENLABS_DEMO_AGENT_ID`, Next.js needs `NEXT_PUBLIC_ELEVENLABS_DEMO_AGENT_ID`
**How to avoid:** Add env var to `.env.local` and reference via `process.env.NEXT_PUBLIC_ELEVENLABS_DEMO_AGENT_ID`
**Warning signs:** Error state in VoiceDemoPhone

### Pitfall 4: CSS-in-JSX Style Tags in Next.js

**What goes wrong:** MultiPlatformShowcase uses inline `<style>` tags for CSS keyframes
**Why it happens:** Valid in Vite, works in Next.js client components too but may cause SSR hydration warnings
**How to avoid:** Move keyframe animations to `globals.css` or use motion/react `animate` prop instead
**Warning signs:** Hydration mismatch warnings in console

### Pitfall 5: Translation Key Mismatch

**What goes wrong:** Ported component references translation keys that don't exist in Next.js locale files
**Why it happens:** Vite and Next.js use different i18n key structures (Vite: `chatbots:trust_metrics.inquiries.value`, Next.js: `trust_metrics.inquiries.value`)
**How to avoid:** Add missing translation keys to all 3 locale files (EN/NL/ES) before testing
**Warning signs:** Translation key shown as raw string instead of translated text

### Pitfall 6: ProgressiveCTA Already Exists But Not Wired

**What goes wrong:** ProgressiveCTA component exists in Next.js but is never rendered
**Why it happens:** It was created during an earlier phase but the chatbots page doesn't include it
**How to avoid:** Wire it into the chatbots page below the DemoPlayground section, passing `messageCount` from `useChatbotStore`
**Warning signs:** No progressive CTAs appearing during demo interaction

### Pitfall 7: useInView from Motion vs Custom Hook

**What goes wrong:** VisionTimeline uses `useInView` from `framer-motion`
**Why it happens:** The `motion/react` package exports `useInView` -- same API
**How to avoid:** Import from `motion/react` not `framer-motion`

## Code Examples

### Pattern 1: Porting a Vite Client Component to Next.js

```typescript
// BEFORE (Vite): src/components/chatbot/MultiPlatformShowcase.tsx
import { useTranslation } from 'react-i18next'
import { Brain, Globe, ShoppingBag, MessageCircle } from 'lucide-react'
import { ScrollReveal } from '../common/ScrollReveal'

export const MultiPlatformShowcase: React.FC = () => {
  const { t } = useTranslation('chatbots')
  // ...
}

// AFTER (Next.js): fmai-nextjs/src/components/chatbot/MultiPlatformShowcase.tsx
;('use client')

import { useTranslations } from 'next-intl'
import { Brain, Globe, ShoppingBag, MessageCircle } from 'lucide-react'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

export function MultiPlatformShowcase() {
  const t = useTranslations('chatbots')
  // Same JSX, same token classes, just different imports
}
```

### Pattern 2: Adding 4th Persona to DemoPlayground

```typescript
// Current PersonaSelector.tsx has:
export const DEMO_PERSONAS = ['ecommerce', 'leadgen', 'support'] as const

// Needs to become:
export const DEMO_PERSONAS = ['ecommerce', 'leadgen', 'support', 'concierge'] as const

// Plus add to DemoPlayground.tsx:
import { CONCIERGE_STARTERS } from '@/lib/chatbot/personas'

const PERSONA_STARTERS: Record<DemoPersonaId, Record<string, string[]>> = {
  ecommerce: ECOMMERCE_STARTERS,
  leadgen: LEADGEN_STARTERS,
  support: SUPPORT_STARTERS,
  concierge: CONCIERGE_STARTERS, // NEW
}
```

### Pattern 3: useElevenLabsCall Porting

```typescript
// Key change: import.meta.env -> process.env
'use client'

import { useConversation } from '@elevenlabs/react'
// ...

export function useElevenLabsCall(): UseElevenLabsCallReturn {
  // ...
  const start = useCallback(async () => {
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_DEMO_AGENT_ID
    if (!agentId) {
      setError('Voice demo not configured')
      return
    }
    // Rest identical to Vite version
  }, [conversation])
}
```

### Pattern 4: Reusable Pricing Tiers Server Component

```typescript
// fmai-nextjs/src/components/pricing/ServicePricingTiers.tsx
// Server component -- no 'use client' needed
import { getTranslations } from 'next-intl/server'
import { CheckCircle } from 'lucide-react'
import { Link } from '@/i18n/navigation'

interface PricingTier {
  name: string
  price: string
  features: string[]
  highlighted?: boolean
  badge?: string
  limit?: string
}

interface ServicePricingTiersProps {
  tiers: PricingTier[]
  heading: string
  subtitle: string
}

export function ServicePricingTiers({ tiers, heading, subtitle }: ServicePricingTiersProps) {
  return (
    <section className="py-20 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* heading + 3-col grid + link to /pricing */}
      </div>
    </section>
  )
}
```

### Pattern 5: Enhanced Language Switcher

```typescript
// fmai-nextjs/src/components/layout/LanguageSwitcher.tsx
'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { motion, AnimatePresence } from 'motion/react'

// Flag data (from Vite LANGUAGES constant)
const LANGUAGES = {
  en: { name: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
  nl: { name: 'Nederlands', flag: '\u{1F1F3}\u{1F1F1}' },
  es: { name: 'Espa\u00F1ol', flag: '\u{1F1EA}\u{1F1F8}' },
} as const

// IMPORTANT: Keep router.replace() mechanism from next-intl
// Only enhance the visual UI (flags, names, checkmark, variants)
```

### Pattern 6: Dynamic Import for Heavy Components

```typescript
// In marketing-machine/page.tsx (server component)
import dynamic from 'next/dynamic'

const VisionTimeline = dynamic(
  () => import('@/components/marketing-machine/VisionTimeline').then(m => ({ default: m.VisionTimeline })),
  { loading: () => <div className="py-24 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent-system" /></div> }
)
```

## Component Inventory & Effort Estimates

### Chatbots Page (Highest Priority)

| Component                  | Status          | Effort | Notes                                    |
| -------------------------- | --------------- | ------ | ---------------------------------------- |
| DemoPlayground 4th persona | Modify existing | Small  | Add concierge persona + starters         |
| MultiPlatformShowcase      | Port from Vite  | Medium | Architecture diagram with CSS animations |
| ProgressiveCTA wiring      | Wire existing   | Small  | Already exists, just add to page         |
| Pricing Tiers (3 cards)    | New component   | Medium | Reusable across pages                    |
| Trust Metrics (3 columns)  | New component   | Small  | Reusable across pages                    |

### Voice Agents Page (High Priority)

| Component               | Status                | Effort | Notes                               |
| ----------------------- | --------------------- | ------ | ----------------------------------- |
| VoiceDemoSection        | Port from Vite        | Large  | PhoneMockup + VoiceDemoPhone + hook |
| VoiceDemoFAB            | Port from Vite        | Medium | Floating button + mini phone panel  |
| useElevenLabsCall hook  | Port from Vite        | Medium | @elevenlabs/react integration       |
| WaveformVisualizer      | Port from Vite        | Small  | Pure visual component               |
| CallTranscript          | Port from Vite        | Small  | Scrollable message list             |
| useIntersectionObserver | Port from Vite        | Small  | Controls FAB visibility             |
| Pricing Tiers           | Reuse chatbot pattern | Small  | Different limits                    |
| Trust Metrics           | Reuse chatbot pattern | Small  | Different metrics                   |

### Marketing Machine Page (Medium Priority)

| Component                | Status         | Effort | Notes                          |
| ------------------------ | -------------- | ------ | ------------------------------ |
| VisionTimeline (5 files) | Port from Vite | Large  | Multi-file component directory |
| FeatureShowcase          | Port from Vite | Medium | 6-card grid with stats         |
| SocialProof              | Port from Vite | Small  | Trust section                  |
| Pricing Tiers            | Reuse pattern  | Small  | Different tier names/features  |

### Automations Page (Lower Priority)

| Component     | Status        | Effort | Notes                          |
| ------------- | ------------- | ------ | ------------------------------ |
| Pricing Tiers | Reuse pattern | Small  | 5/10/20 workflows              |
| Trust Metrics | Reuse pattern | Small  | hours saved, delivery, success |

### Language Switcher (Cross-cutting)

| Component                  | Status               | Effort | Notes                                    |
| -------------------------- | -------------------- | ------ | ---------------------------------------- |
| LanguageSwitcher (desktop) | Enhance HeaderClient | Medium | Flag emojis, names, checkmark, animation |
| LanguageSwitcher (mobile)  | Enhance HeaderClient | Small  | Flag buttons in mobile menu              |

## State of the Art

| Old Approach (Vite)                     | Current Approach (Next.js)                  | Impact                                        |
| --------------------------------------- | ------------------------------------------- | --------------------------------------------- |
| `framer-motion`                         | `motion/react` (same API, new package name) | Import path change only                       |
| `react-i18next` with namespace prefix   | `next-intl` with scoped `useTranslations`   | Simpler key paths, no colon prefix            |
| Client-side lazy loading (`React.lazy`) | `next/dynamic` with SSR support             | Better initial load performance               |
| All components client-rendered          | Server components default, client islands   | Pricing/trust sections can be server-rendered |
| `import.meta.env.VITE_*`                | `process.env.NEXT_PUBLIC_*`                 | Env var naming convention                     |

## Open Questions

1. **Concierge persona system prompt and starters**
   - What we know: Vite has 4 personas (ecommerce, leadgen, support, concierge), Next.js has 3
   - What is unclear: Whether the concierge persona definition exists in `@/lib/chatbot/personas.ts` or needs creation
   - Recommendation: Check personas.ts during implementation; create concierge persona with agency-focused system prompt if missing

2. **ElevenLabs agent ID for Next.js**
   - What we know: Vite uses `VITE_ELEVENLABS_DEMO_AGENT_ID`
   - What is unclear: Whether the same agent ID works, or a separate one is needed
   - Recommendation: Reuse same agent ID, just set `NEXT_PUBLIC_ELEVENLABS_DEMO_AGENT_ID` in `.env.local`

3. **Pricing data source for on-page tiers**
   - What we know: Vite imports from `gateway-pricing.ts` which has old pricing (pre-AaaS pivot)
   - What is unclear: Whether to create a new pricing data module or hardcode per-page
   - Recommendation: Create a shared `@/lib/pricing-config.ts` with AaaS-aligned data, or use translations for pricing text (more flexible for i18n)

4. **Translation keys for missing sections**
   - What we know: Pricing, trust metrics, multi_platform, and vision_timeline keys are needed in EN/NL/ES
   - What is unclear: Exact key structure -- whether to reuse Vite key names or create new ones
   - Recommendation: Mirror Vite key structure where possible for easier porting, add to all 3 locale files

## Sources

### Primary (HIGH confidence)

- Vite source files: `C:\Users\daley\Desktop\Futuremarketingai\src\` -- all component implementations verified by reading source
- Next.js source files: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\src\` -- current state verified
- `package.json` -- exact dependency versions confirmed

### Secondary (MEDIUM confidence)

- Phase 1 plan decisions (from STATE.md) -- pricing tiers, persona IDs, locale key structures
- Gap analysis provided in phase brief -- verified against actual source files

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- all dependencies verified in package.json, only @elevenlabs/react needs adding
- Architecture: HIGH -- both codebases read, porting pattern is mechanical translation
- Pitfalls: HIGH -- based on actual code differences observed between the two codebases
- Effort estimates: MEDIUM -- based on component line counts and complexity, not implementation experience

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable -- no external API changes expected)
