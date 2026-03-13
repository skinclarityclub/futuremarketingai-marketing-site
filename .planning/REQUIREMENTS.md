# Requirements — FMai Website v1.0

## REQ-DESIGN: Living System Design Tokens

- Replace indigo/violet/pink palette with teal (#00D4AA) + amber (#F5A623) system
- Update Tailwind config colors, fonts, shadows, gradients
- Update CSS custom properties to match new palette
- Add Space Grotesk font, keep Inter + JetBrains Mono, remove Satoshi
- **Phase:** 3

## REQ-COMPONENTS: Shared Component Library

- SystemPanel: primary container (replaces GlassCard)
- StatusIndicator: pulsing status dots with monospace labels
- MetricDisplay: large monospace numbers with labels
- CTAButton: consistent CTA with Calendly modal integration
- SectionContainer: consistent section layout wrapper
- **Phase:** 3 → **Gap closure Phase:** 13 (remove orphaned components, keep CTAButton)
- **Status:** Orphaned — Phase 11 rebuild used inline Tailwind patterns instead. CTAButton is the only actively used component.

## REQ-UX-FIXES: Critical UX & Accessibility Fixes

- VoiceAgents page: add missing secondary CTA + trust metrics
- prefers-reduced-motion support for Framer Motion
- Mobile menu focus trap (WCAG)
- All Calendly CTAs open as modal, not new tab
- Footer emoji replaced with Lucide icon
- CalendlyModal dark theme colors
- **Phase:** 3

## REQ-BRAND: FMai Rebrand

- Update ~80 brand references to "FMai"
- Fix domain mismatch in SEO components
- Fix hardcoded Dutch text in mobile hero
- Update service pages to use new design components
- **Phase:** 3 (Wave 4)

## REQ-HOMEPAGE-RESTRUCTURE: Homepage Restructuring & Marketing Machine Page

- Transform homepage from marketing-automation-focused to general FutureAI hub
- Homepage hero reworked for FutureAI identity (all services, not just marketing)
- New service cards grid on homepage linking to /automations, /chatbots, /voice-agents, /marketing-machine
- VisionTimeline, FeatureShowcase, MobileEvolutionTimeline relocated from homepage to /marketing-machine
- New /marketing-machine page created with FutureMarketingAI branding
- SimpleHeader brandMiddle logic updated: homepage shows FutureAI, /marketing-machine shows FutureMarketingAI
- Services dropdown link updated from /demo to /marketing-machine
- /marketing-machine added to router and marketingPaths
- i18n: NL/ES hero_landing keys synced with EN (remove stale founding-member copy)
- i18n: ES common.json structural issues fixed (duplicate blocks, missing keys)
- **Phase:** 10

## REQ-LIVING-SYSTEM-REBUILD: Living System Full Structural Rebuild

- Complete structural rebuild of every page to match prototype-2-living-system.html
- Switch body font from Inter to DM Sans, keep Space Grotesk + JetBrains Mono
- Add global GradientMesh background (3 CSS blobs, replaces 4 Framer Motion bg layers)
- Rebuild Hero with left-aligned layout + orbit visual (spinning rings with dots)
- Rebuild service cards as 2x2 numbered grid with gradient border hover (::before mask)
- CTAButton primary: warm amber gradient (not flat teal), rounded-14px
- CTAButton secondary: glass backdrop-blur effect
- Navigation: full-width backdrop-blur, gradient underline hover on links, FM+gradient-ai logo
- Footer: replace remaining hardcoded slate/indigo classes with Living System tokens
- Service pages: structural rebuild with gradient mesh, card-gradient-border, warm CTAs
- Supporting pages: same structural rebuild (About, Pricing, HowItWorks, Contact, Legal)
- MarketingMachinePage: add i18n support (currently all hardcoded EN)
- SimplifiedHeroMobile: rebuild to match new design language
- CSS animations for blobs/orbit/fadeIn (replace Framer Motion where simple CSS suffices)
- Preserve all existing content, routes, i18n keys, and functionality
- **Phase:** 11

## REQ-HERO-3D: Interactive 3D Hero Visual

- Install @splinetool/react-spline + @splinetool/runtime
- Create SplineHero component with React.lazy + Suspense loading
- OrbitVisual kept as permanent fallback during Spline load and below lg breakpoint
- Hero heading text remains LCP element (Spline never blocks initial paint)
- Spline hidden on mobile (desktop-first per CLAUDE.md)
- prefers-reduced-motion respected (static fallback)
- **Phase:** 12

## REQ-SCROLL-MICRO: Scroll Reveals & Card Micro-Interactions

- ScrollReveal reusable wrapper component using Framer Motion whileInView
- useTilt custom hook for mouse-tracking card parallax (desktop only, disabled on touch)
- Apply scroll reveals to below-fold sections across all pages (section-level, not per-element)
- Apply card tilt to service cards and pricing cards
- CTAButton icon micro-animation on hover (arrow shift)
- All animations respect useMotionSafe / prefers-reduced-motion
- **Phase:** 12

## REQ-PRODUCT-MEDIA: Product Media Components

- ProductMedia component for video/screenshot with poster frame
- Video uses autoPlay muted loop playsInline with preload="none"
- Reduced motion shows static poster image instead of video
- Placeholder media structure on service pages (swap real assets when available)
- Create public/media/ directory with lightweight placeholder assets
- **Phase:** 12 → **Gap closure Phase:** 13 (fix placeholder 404s)

## REQ-TYPOGRAPHY-POLISH: Typography Fine-Tuning

- Letter-spacing adjustments for Space Grotesk display headings
- Consistent section spacing rhythm across all pages
- Fine-tune heading sizes for 1280px and 1440px breakpoints
- **Phase:** 12

## REQ-SERVICE-I18N: Service Page Internationalization

- Wire useTranslation into AutomationsPage, ChatbotsPage, VoiceAgentsPage
- Extract all hardcoded English strings into EN locale JSON
- Add NL translations for all service page content
- Add ES translations for all service page content
- Language switcher produces correct content on all service routes
- **Phase:** 14
