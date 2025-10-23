# Mobile Static Infographics

This directory contains optimized static images for mobile devices to replace heavy 3D visualizations.

## Required Images

### System Diagram
- **Filename:** `system-diagram-static.webp`
- **Size:** <100KB
- **Format:** WebP (with PNG fallback)
- **Dimensions:** 1200x800px (3:2 aspect ratio)
- **Content:** Static representation of the FutureMarketingAI system architecture showing:
  - 6 AI modules in a circular layout
  - Connections between modules
  - Key features/benefits text
  - Clean, modern design matching brand colors

### How to Create

1. **Screenshot Method:**
   - Open SystemDiagram on desktop
   - Take high-quality screenshot (2400x1600px)
   - Crop to 1200x800px
   - Optimize with `cwebp` tool: `cwebp -q 85 input.png -o system-diagram-static.webp`

2. **Design Tool Method:**
   - Create static infographic in Figma/Illustrator
   - Export as PNG (1200x800px)
   - Convert to WebP using online converter or CLI tool
   - Ensure file size <100KB

3. **Optimization Tools:**
   - [Squoosh.app](https://squoosh.app/) - Online image optimizer
   - `cwebp` - CLI tool from Google
   - ImageOptim (Mac) / FileOptimizer (Windows)

### Alternative: SVG
For even better compression and scalability, consider creating an SVG version:
- **Filename:** `system-diagram-static.svg`
- **Size:** <50KB
- **Benefits:** Infinite scaling, smaller file size, crisp at any resolution

## Fallback Behavior

If the image fails to load, the `StaticSystemInfographic` component will:
1. Show a loading spinner initially
2. Display error state with icon and message
3. Still show "View on Desktop" CTA for better UX
4. Track failed image loads for monitoring

## Implementation Notes

- Images are lazy-loaded for performance
- WebP format with PNG fallback for older browsers
- Responsive sizing with `srcset` for different screen sizes
- Analytics tracking on "View Interactive" button clicks

