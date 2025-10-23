# Mobile Logo Optimization Guide

This document provides guidelines for optimizing company logos for mobile display in the social proof section.

## Target Specifications

- **File Size:** <40KB per logo
- **Format:** SVG (preferred) or optimized PNG/WebP
- **Display Size:** 80-120px width on mobile
- **Quantity:** 3-4 key logos
- **Quality:** Crisp rendering on high-DPI screens (2x, 3x)

## Recommended Logos

Select logos that represent:
1. **Well-known brands** (instant credibility)
2. **Industry relevance** (target market alignment)  
3. **Diversity** (various company sizes/industries)
4. **Visual balance** (varied shapes/styles)

Example selection:
- Fortune 500 company (if applicable)
- Industry leader in SaaS/Tech
- Notable mid-market success story
- Fast-growing startup with recognition

## Optimization Process

### For SVG Logos:

```bash
# 1. Clean up SVG with SVGO
npx svgo input.svg -o output.svg

# 2. Inline styles and remove unnecessary attributes
# 3. Verify file size <40KB
# 4. Test rendering at different sizes
```

### For Raster Logos (PNG/JPG):

```bash
# 1. Resize to 240px width (2x for 120px display)
# 2. Convert to WebP for better compression
cwebp -q 90 input.png -o output.webp

# 3. Generate PNG fallback
pngquant --quality=85-95 input.png -o output.png

# 4. Verify both files <40KB
```

## Implementation

### Logo Grid Component

```tsx
<div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
  {logos.map((logo) => (
    <div key={logo.id} className="flex items-center justify-center p-4">
      <img
        src={logo.src}
        alt={logo.alt}
        loading="lazy"
        className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
      />
    </div>
  ))}
</div>
```

### Lazy Loading with IntersectionObserver

Already handled by browser's native `loading="lazy"` attribute, but for more control:

```tsx
const LogoImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}
      alt={alt}
      className="h-12 w-auto"
    />
  )
}
```

## Responsive Sizing

```css
/* Mobile: 80px */
.logo-sm {
  height: 2.5rem; /* 40px */
}

/* Tablet: 100px */
@media (min-width: 640px) {
  .logo-sm {
    height: 3rem; /* 48px */
  }
}

/* Desktop: 120px */
@media (min-width: 1024px) {
  .logo-sm {
    height: 3.5rem; /* 56px */
  }
}
```

## Accessibility

- Always provide descriptive `alt` text: "Company Name Logo"
- Ensure sufficient contrast with background
- Test with screen readers
- Verify logos are recognizable at small sizes

## Performance Checklist

- [ ] All logos <40KB
- [ ] SVG format used where possible
- [ ] WebP with PNG fallback for raster
- [ ] Lazy loading implemented
- [ ] No layout shift (specify width/height or aspect-ratio)
- [ ] Tested on 2x and 3x DPI screens
- [ ] Lighthouse audit passes for images
- [ ] No console errors on load

## Common Issues

### Issue: Logo too large
**Solution:** Use SVGO or image compression tools, reduce complexity

### Issue: Blurry on retina displays
**Solution:** Provide 2x size images or use SVG

### Issue: Layout shift on load
**Solution:** Specify explicit dimensions or aspect-ratio

### Issue: Slow loading
**Solution:** Implement progressive loading, optimize file size further

