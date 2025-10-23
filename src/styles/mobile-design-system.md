# Mobile-First Responsive Design System

## Overview
Dit design systeem volgt een mobile-first benadering waarbij we eerst voor mobiele apparaten ontwerpen en daarna opschalen naar grotere schermen.

## Breakpoints

We gebruiken de volgende custom breakpoints:

```typescript
mobile:   0px - 639px   // Mobiele telefoons
tablet:   640px - 1023px // Tablets en kleine laptops
desktop:  1024px+        // Desktop computers
xl:       1280px+        // Extra grote schermen
2xl:      1536px+        // Ultra wide schermen
```

### Gebruik in Code

```tsx
// Mobile-first approach: default styling is voor mobile
<div className="text-sm tablet:text-base desktop:text-lg">
  Responsive tekst
</div>

// Layout example
<div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3">
  {/* Content */}
</div>
```

## Touch Targets

Alle interactieve elementen moeten voldoen aan Apple HIG en WCAG richtlijnen:

### Minimum Sizes

- **touch-sm**: 44x44px (iOS minimum)
- **touch-md**: 48x48px (WCAG AAA, aanbevolen)
- **touch-lg**: 56px (extra comfortabel)

### Implementatie

```tsx
// Button met minimum touch target
<button className="min-w-touch min-h-touch px-4 py-3">
  Klik hier
</button>

// Icon button
<button className="w-touch-md h-touch-md flex items-center justify-center">
  <Icon className="w-6 h-6" />
</button>
```

## Dark Mode

Dark mode wordt ondersteund via de `class` strategie:

```tsx
// Component met dark mode support
<div className="bg-white dark:bg-bg-dark text-gray-900 dark:text-text-primary">
  Inhoud met dark mode support
</div>
```

### System Theme Detection

We detecteren automatisch het OS theme voorkeur via CSS media queries en JavaScript:

```typescript
// Check system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

## Kleurcontrasten (WCAG 2.1 AA)

Alle kleuren voldoen aan WCAG 2.1 AA contrastratio's (4.5:1 minimum):

- **text-primary**: #FFFFFF (maximaal contrast)
- **text-secondary**: #B8C5D8 (4.6:1 contrast)
- **text-tertiary**: #8B9BB5 (4.7:1 contrast)  
- **text-muted**: #6B7A94 (4.5:1 contrast)

### Validatie

Test alle kleurcombinaties met:
- Chrome DevTools (Lighthouse)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Axe DevTools

## Spacing & Layout

### Relatieve Units

Gebruik altijd relatieve units (rem, em, %) voor betere schaalbaarheid:

```tsx
// ✅ Goed: Relatieve units
<div className="p-4 mb-6 text-base">

// ❌ Vermijd: Absolute pixels waar mogelijk
<div style={{ padding: '16px', marginBottom: '24px' }}>
```

### Fluid Typography

Onze font sizes schalen automatisch met line-heights:

```typescript
'xs':   ['0.75rem', { lineHeight: '1rem' }]     // 12px
'sm':   ['0.875rem', { lineHeight: '1.25rem' }]  // 14px
'base': ['1rem', { lineHeight: '1.5rem' }]       // 16px
'lg':   ['1.125rem', { lineHeight: '1.75rem' }]  // 18px
```

## Testing

### Device Testing

Test op echte apparaten:
- iOS (iPhone, iPad)
- Android (verschillende fabrikanten)
- Tablets (iPad, Android tablets)

### Browser Testing

- Chrome/Edge (Chromium)
- Safari (WebKit)
- Firefox
- Safari iOS
- Chrome Android

### Tools

1. **Chrome DevTools**: Device emulation en responsive testen
2. **Lighthouse**: Performance en accessibility scores
3. **Axe DevTools**: Gedetailleerde a11y audits
4. **Touch target validator**: Manual tap tests

## Best Practices

### Mobile-First CSS

```css
/* Start met mobile styles */
.component {
  padding: 1rem;
  font-size: 0.875rem;
}

/* Enhance voor grotere schermen */
@media (min-width: 640px) {
  .component {
    padding: 1.5rem;
    font-size: 1rem;
  }
}

@media (min-width: 1024px) {
  .component {
    padding: 2rem;
    font-size: 1.125rem;
  }
}
```

### Toegankelijkheid

1. **Keyboard navigatie**: Alle interacties toegankelijk via keyboard
2. **ARIA labels**: Voor screen readers
3. **Focus states**: Duidelijk zichtbaar
4. **Color contrast**: Minimaal 4.5:1
5. **Touch targets**: Minimaal 48x48px

### Performance

1. **Lazy loading**: Afbeeldingen en componenten
2. **Code splitting**: Per route
3. **Minimize layout shift**: Reserve ruimte voor content
4. **Optimize images**: WebP, correct formaat
5. **Reduce paint**: Gebruik transform/opacity voor animaties

## Voorbeelden

### Responsive Card

```tsx
<div className="
  bg-bg-card
  dark:bg-bg-surface
  rounded-lg
  p-4 tablet:p-6 desktop:p-8
  mobile:w-full tablet:w-1/2 desktop:w-1/3
  min-h-touch
">
  <h3 className="text-base tablet:text-lg desktop:text-xl">
    Card Title
  </h3>
  <p className="text-sm text-text-secondary mt-2">
    Card content
  </p>
  <button className="
    mt-4
    min-w-touch min-h-touch
    px-6 py-3
    bg-accent-primary
    text-white
    rounded-lg
    hover:bg-accent-secondary
    transition-colors
  ">
    Action
  </button>
</div>
```

### Responsive Navigation

```tsx
<nav className="
  flex
  flex-col mobile:space-y-2
  tablet:flex-row tablet:space-y-0 tablet:space-x-4
">
  {links.map(link => (
    <a
      key={link.href}
      href={link.href}
      className="
        min-h-touch
        flex items-center
        px-4 py-3
        text-sm tablet:text-base
      "
    >
      {link.label}
    </a>
  ))}
</nav>
```

## Maintenance

### Adding New Breakpoints

Update `tailwind.config.js`:

```javascript
screens: {
  'mobile': '0px',
  'phablet': '480px',  // Nieuwe breakpoint
  'tablet': '640px',
  // ...
}
```

### Adding New Touch Sizes

```javascript
spacing: {
  'touch-xs': '40px',  // Voor compacte UI
  'touch-sm': '44px',
  'touch-md': '48px',
  'touch-lg': '56px',
  'touch-xl': '64px',  // Voor prominente CTAs
}
```

## Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN: Mobile Web Development](https://developer.mozilla.org/en-US/docs/Web/Guide/Mobile)

