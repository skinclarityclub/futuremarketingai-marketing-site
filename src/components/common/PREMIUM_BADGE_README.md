# Premium Service Badge Component

Een glassmorphic badge systeem dat de 4 premium service pillars van FutureMarketingAI toont op alle main pages.

## Features

✅ **3 Display Variants:**

- **Floating**: Klein badge dat expandeert bij klik (perfect voor alle pages)
- **Banner**: Full-width banner met alle details (ideaal voor hero sections)
- **Inline**: Compacte inline weergave (flexibel voor content sections)

✅ **Glassmorphic Design**: Consistent met het bestaande design system

✅ **Fully Responsive**: Werkt perfect op mobile, tablet en desktop

✅ **Interactive**: Hover effects, expand/collapse functionaliteit

✅ **Accessible**: Keyboard navigatie, ARIA labels, tooltips

✅ **Type-Safe**: Volledig TypeScript met strikte types

✅ **Well-Tested**: Uitgebreide unit tests en Storybook stories

## Premium Pillars

De badge toont deze 4 core services:

1. **🤖 24/7 AI Automation**
   - Volledig geautomatiseerde content creation en publishing
   - Highlight: "Bespaar 80+ uur per maand"

2. **🎯 Research-Driven Strategy**
   - Realtime trend forecasting met Perplexity AI
   - Highlight: "+340% Ad ROI gemiddeld"

3. **🚀 Multi-Platform Command**
   - Alle merken en platforms in één dashboard
   - Highlight: "99.8% Publishing Success"

4. **🤝 Persoonlijke AI-Expert**
   - Direct toegang tot je persoonlijke AI-expert voor strategie en implementatie
   - Highlight: "Geen technische kennis nodig"

## Usage

### 1. Floating Badge (Recommended)

Beste keuze voor meeste pages. Verschijnt als klein badge en expandeert bij klik.

```tsx
import { PremiumBadge } from '@/components'

// In je page component
;<PremiumBadge variant="floating" position="top-right" showLabels />
```

**Positions:**

- `top-right` (default)
- `top-left`
- `bottom-right`
- `bottom-left`

### 2. Via AppLayout

Integreer de badge automatisch op alle pages via AppLayout:

```tsx
import { AppLayout } from '@/components'
;<AppLayout showPremiumBadge premiumBadgeVariant="floating" premiumBadgePosition="top-right">
  {/* Je page content */}
</AppLayout>
```

### 3. Banner Variant

Voor hero sections en landing pages waar je direct de value proposition wilt tonen:

```tsx
<PremiumBadge variant="banner" />
```

Full-width banner die alle 3 pillars prominent toont.

### 4. Inline Variant

Compacte weergave voor integratie in content sections:

```tsx
<div className="my-section">
  <h2>Premium Services</h2>
  <PremiumBadge variant="inline" />
</div>
```

## Props

```typescript
interface PremiumBadgeProps {
  // Display variant
  variant?: 'floating' | 'inline' | 'banner'

  // Position (alleen voor floating)
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

  // Start expanded (alleen voor floating)
  expandedByDefault?: boolean

  // Show "Premium Services" label in collapsed view
  showLabels?: boolean

  // Custom CSS classes
  className?: string
}
```

## Examples

### Hero Page Integration

De badge is al geïntegreerd op de Hero page als inline variant:

```tsx
// src/pages/Hero.tsx
<motion.div variants={itemVariants} className="mt-32">
  <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 text-center">
    All-in-One Premium Services
  </h2>
  <p className="text-lg text-text-secondary mb-8 text-center max-w-2xl mx-auto">
    Drie krachtige modules die naadloos samenwerken voor complete marketing automatisering
  </p>
  <PremiumBadge variant="inline" />
</motion.div>
```

### Dashboard met Floating Badge

```tsx
<AppLayout showPremiumBadge premiumBadgeVariant="floating">
  <DashboardContent />
</AppLayout>
```

### Landing Page met Banner

```tsx
<div className="landing-page">
  <header>...</header>

  {/* Sticky banner onder header */}
  <div className="sticky top-[73px] z-20">
    <PremiumBadge variant="banner" />
  </div>

  <main>...</main>
</div>
```

## Customization

### Pillar Data

De pillar data is gedefinieerd in `PREMIUM_PILLARS` en kan worden aangepast:

```typescript
export const PREMIUM_PILLARS: PremiumPillar[] = [
  {
    id: 'automation',
    title: '24/7 AI Automation',
    icon: '🤖',
    description: 'Volledig geautomatiseerde content creation...',
    color: 'primary',
    highlight: 'Bespaar 80+ uur per maand',
  },
  // ...
]
```

### Styling

De component gebruikt het bestaande design system:

- `GlassCard` voor glassmorphic effects
- Tailwind utility classes voor layout
- Framer Motion voor animations
- Design tokens voor colors en spacing

### Colors

Elke pillar heeft een eigen kleur variant:

- **primary**: Blue gradient (`accent-primary`)
- **success**: Green gradient (`accent-success`)
- **secondary**: Purple gradient (`accent-secondary`)

## Testing

Run tests:

```bash
npm run test PremiumBadge
```

View in Storybook:

```bash
npm run storybook
```

Navigate to: `Common/PremiumBadge`

## Storybook Stories

Available stories:

- FloatingCollapsed
- FloatingExpanded
- FloatingWithLabels
- FloatingTopLeft
- FloatingBottomRight
- Banner
- Inline
- InLandingPageContext
- InPageWithBanner
- AllVariantsComparison

## Accessibility

✅ **Keyboard Navigation**: Tab to focus, Enter/Space to expand

✅ **ARIA Labels**: Proper role and title attributes

✅ **Screen Reader Friendly**: All text content is accessible

✅ **Focus Management**: Clear focus indicators

## Performance

✅ **Lazy Animations**: Framer Motion animations only when visible

✅ **Optimized Re-renders**: useState for hover states only

✅ **Minimal DOM**: Clean, efficient markup

✅ **Responsive Images**: All icons are emoji (no image loading)

## Browser Support

Supports all modern browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Migration from Old System

Als je een oude versie had, migreer als volgt:

```tsx
// OLD
<div className="premium-services">
  <div>Service 1</div>
  <div>Service 2</div>
  <div>Service 3</div>
</div>

// NEW
<PremiumBadge variant="inline" />
```

## Related Components

- `GlassCard`: Base glassmorphic card component
- `AppLayout`: Main layout wrapper
- `TrustBadges`: Security and compliance badges
- `AggregateMetrics`: Stats showcase component

## Troubleshooting

### Badge not showing

- Check if `showPremiumBadge` is set to `true` in AppLayout
- Verify imports are correct
- Check z-index conflicts

### Animations not working

- Ensure Framer Motion is installed: `npm install framer-motion`
- Check for CSS conflicts

### Styling issues

- Ensure Tailwind is configured correctly
- Check if custom CSS is overriding styles
- Verify design tokens are defined in `index.css`

## Next Steps

Mogelijke uitbreidingen:

- [ ] Analytics tracking voor badge interactions
- [ ] A/B testing support
- [ ] Personalisatie per user segment
- [ ] Animated transitions tussen variants
- [ ] Dark/light mode toggle
- [ ] Internationalization support

## Feedback

Voor vragen of suggesties, check de Storybook docs of open een issue.

---

**Created**: Task 2 - Premium Service Badge System
**Version**: 1.0.0
**Status**: ✅ Complete
