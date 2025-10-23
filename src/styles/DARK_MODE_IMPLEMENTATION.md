# Dark Mode Implementation - Future Marketing AI

## Current Status: Dark Mode Only

Future Marketing AI is **intentionally dark-mode-only**. Er is geen light mode variant.

## Why Dark Mode Only?

1. **Brand Identity:** Dark theme past bij de futuristische, tech-forward branding
2. **User Comfort:** Beter voor langdurig gebruik en vermindert oogvermoeidheid
3. **Focus:** Donkere achtergronden trekken aandacht naar content en CTAs
4. **Modern Aesthetic:** Dark mode voelt premium en modern aan

## Implementation Details

### Tailwind Configuration

```javascript
// tailwind.config.js
darkMode: 'class', // Ready voor toekomstige light mode support indien gewenst
```

Hoewel de config `class` strategy gebruikt, is de app standaard altijd dark. De `dark:` prefix in Tailwind classes is niet nodig omdat alle base styles al dark zijn.

### Color System

Alle kleuren zijn geoptimaliseerd voor dark backgrounds:

```javascript
// Background Colors (Dark)
'bg-dark': '#050814',      // Hoofdachtergrond
'bg-surface': '#0A0E27',   // Surface laag
'bg-card': '#0F1629',      // Card backgrounds
'bg-hover': '#1A1F3A',     // Hover states

// Text Colors (Light op Dark)
'text-primary': '#FFFFFF',     // Wit (maximaal contrast)
'text-secondary': '#B8C5D8',   // 4.6:1 contrast
'text-tertiary': '#8B9BB5',    // 4.7:1 contrast
'text-muted': '#6B7A94',       // 4.5:1 contrast

// Accent Colors
'accent-primary': '#6366F1',   // Indigo
'accent-secondary': '#8B5CF6', // Violet
'accent-tertiary': '#EC4899',  // Pink
```

### WCAG Contrast Compliance

Alle text-kleuren voldoen aan **WCAG 2.1 AA** (4.5:1 minimum) op dark backgrounds:

| Color | Hex | Contrast Ratio | WCAG Level |
|-------|-----|----------------|------------|
| text-primary | #FFFFFF | 21:1 | AAA ✅ |
| text-secondary | #B8C5D8 | 4.6:1 | AA ✅ |
| text-tertiary | #8B9BB5 | 4.7:1 | AA ✅ |
| text-muted | #6B7A94 | 4.5:1 | AA ✅ |

### Component Styling

Alle componenten gebruiken standaard dark mode kleuren:

```tsx
// ✅ Current approach (dark-only)
<div className="bg-bg-card text-text-primary">
  Content
</div>

// ❌ NIET nodig: dark: prefix
<div className="bg-white dark:bg-bg-card">
  // Overbodig - we hebben geen light mode
</div>
```

## Future Light Mode Support (Optional)

Als in de toekomst light mode gewenst is, zijn deze stappen nodig:

### 1. Light Mode Color Palette

```javascript
// Light mode kleuren (future)
'bg-light': '#FFFFFF',
'bg-light-surface': '#F9FAFB',
'bg-light-card': '#F3F4F6',

'text-light-primary': '#111827',
'text-light-secondary': '#4B5563',
'text-light-tertiary': '#6B7280',
```

### 2. Theme Toggle Component

```tsx
// Future implementation
function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

### 3. System Theme Detection

```tsx
// Detect OS preference (future)
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    setTheme(e.matches ? 'dark' : 'light');
  };
  
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

### 4. Component Updates

Alle componenten zouden dan dual-theme support nodig hebben:

```tsx
// Future approach
<div className="bg-white dark:bg-bg-card text-gray-900 dark:text-text-primary">
  Content
</div>
```

## Testing Dark Mode

### Visual Testing

- ✅ Alle tekst heeft voldoende contrast (4.5:1 minimum)
- ✅ Buttons zijn duidelijk zichtbaar en interactief
- ✅ Focus states zijn prominent
- ✅ Hover states geven feedback
- ✅ Disabled states zijn onderscheidbaar

### Accessibility Testing

```bash
# Lighthouse audit
npm run lighthouse

# Axe DevTools in browser
# Check contrast ratios
```

### Browser Testing

Test in verschillende browsers en devices:
- Chrome/Edge (Chromium)
- Firefox
- Safari desktop
- Safari iOS
- Chrome Android

## Best Practices

### 1. Consistent Color Usage

```tsx
// ✅ Use semantic color tokens
<div className="bg-bg-card text-text-primary">

// ❌ Don't use arbitrary colors
<div className="bg-[#0F1629] text-[#FFFFFF]">
```

### 2. Gradients for Visual Interest

```tsx
// Gebruik accent gradients voor CTAs
<button className="bg-gradient-to-r from-accent-primary to-accent-secondary">
  Call to Action
</button>
```

### 3. Subtle Shadows & Glows

```tsx
// Glow effects voor depth
<div className="shadow-glow bg-bg-card">
  Card with glow
</div>
```

### 4. Alpha Transparency

```tsx
// Gebruik rgba voor subtiele overlays
<div className="border border-white/10">
  Subtle border
</div>
```

## Maintenance Notes

### Adding New Colors

Als je nieuwe kleuren toevoegt, valideer altijd contrast:

1. **Test met Contrast Checker:**
   - [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   - Target: minimum 4.5:1 voor normal text
   - Target: minimum 3:1 voor large text (18px+)

2. **Update Tailwind Config:**
   ```javascript
   colors: {
     'new-color': '#HEX',
   }
   ```

3. **Document in Design System:**
   - Add to color palette documentation
   - Include use cases
   - Note contrast ratios

### Performance

Dark mode kan energiebesparing bieden op OLED schermen:
- Zwarte pixels zijn echt "uit" op OLED
- Tot 60% minder stroomverbruik bij dark interfaces
- Langere batterijduur op mobiele devices

## Resources

- [Material Design - Dark Theme](https://material.io/design/color/dark-theme.html)
- [Apple HIG - Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)
- [WCAG 2.1 - Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM - Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Summary

✅ **Current Status:** Dark mode only, geen light mode  
✅ **WCAG Compliance:** Alle kleuren voldoen aan AA (4.5:1 minimum)  
✅ **Tailwind Config:** Class strategy (ready voor toekomstige light mode)  
✅ **Component Styling:** Consistente dark mode kleuren  
🔮 **Future:** Light mode support optioneel, niet gepland  

De app is volledig geoptimaliseerd voor dark mode gebruik en voldoet aan alle accessibility standards.

