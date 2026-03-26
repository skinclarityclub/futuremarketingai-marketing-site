# Phase 9: Living System Page Conversion - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning
**Source:** Existing design decisions + codebase audit

<domain>
## Phase Boundary

Convert ALL existing pages and components from the old indigo/violet/purple glassmorphism design to the Living System teal/amber design tokens that were established in Phase 3 Wave 1.

Phase 3 created the foundation (tailwind.config.js tokens, CSS custom properties, 5 shared components) but never converted the actual pages. This phase does the conversion.
</domain>

<decisions>
## Implementation Decisions

### Design System (LOCKED — from Phase 3)

- Living System palette: teal (#00D4AA) + amber (#F5A623) on deep dark (#0A0D14)
- Backgrounds: bg-deep (#0A0D14), bg-surface (#111520), bg-elevated (#1A1F2E)
- Text: text-primary (#E8ECF4), text-secondary (#9BA3B5), text-muted (#5A6378)
- Font stack: Inter (body), Space Grotesk (display), JetBrains Mono (data)
- Sharp corners (rounded-sm), not rounded-lg/xl
- System panels instead of glass cards
- Approved prototype: `prototype-2-living-system.html`

### Scope (LOCKED)

- Homepage (Hero, Header, Footer, Features, Social Proof)
- Service pages (AutomationsPage, ChatbotsPage, VoiceAgentsPage)
- Supporting pages (About, Pricing, Contact, HowItWorks, Legal)
- Common components (FloatingNav, Button, CookieConsent, LoadingFallback, etc.)
- CSS utilities in src/index.css (remaining old rgba(79,70,229) references)

### Existing Living System Components (USE, don't recreate)

- SystemPanel — primary container (replaces GlassCard)
- StatusIndicator — pulsing status dots
- MetricDisplay — large monospace numbers
- CTAButton — consistent CTA with Calendly modal
- SectionContainer — layout wrapper

### Brand (LOCKED)

- "Future AI" → "FMai" rebrand where visible
- Calendly URLs use dark theme params: background_color=111520&text_color=e8ecf4&primary_color=00D4AA

### Claude's Discretion

- Order of page conversion (suggest: homepage first, then service pages, then supporting pages)
- How to handle complex components (AI assistant panel, calculator, etc.) — may need separate phase
- Whether to convert rarely-visited pages (careers, partners) or defer

</decisions>

<specifics>
## Specific Requirements

### Codebase Audit Results (2026-03-13)

- **819 old color references** (indigo/violet/blue/purple) across **126 files**
- **43 new token references** across **20 files** (only new Phase 3 components)
- Key old patterns to replace:
  - `from-indigo-*`, `bg-indigo-*`, `text-indigo-*`, `border-indigo-*`
  - `from-violet-*`, `bg-violet-*`, `text-violet-*`
  - `from-purple-*`, `bg-purple-*`, `text-purple-*`
  - `from-blue-*`, `bg-blue-*`, `text-blue-*`, `border-blue-*`
  - `rgba(79, 70, 229, *)` (indigo in CSS)
  - Glassmorphism patterns: `backdrop-blur`, `bg-white/5`, `bg-gradient-to-br from-slate-950 via-blue-950`

### Key reference files

- `prototype-2-living-system.html` — approved design prototype
- `docs/plans/2026-03-13-phase3-wave1-foundation.md` — original foundation plan
- `tailwind.config.js` — Living System tokens already in place
- `src/components/common/index.ts` — shared component exports

### Screenshot evidence

Homepage still shows old indigo/purple glassmorphism design with "Future AI" branding, loading spinner, and blue/purple gradient background.
</specifics>

<deferred>
## Deferred Ideas

- AI Assistant panel redesign (complex, many sub-components)
- Calculator feature redesign (self-contained feature)
- Dashboard/Explorer pages (behind auth, low priority)
- Command Center components (complex, internal tools)
  </deferred>

---

_Phase: 09-living-system-page-conversion_
_Context gathered: 2026-03-13 from codebase audit and existing design decisions_
