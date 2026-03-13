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
- **Phase:** 3

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
