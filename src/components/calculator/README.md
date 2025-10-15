# Calculator Components

Modern, accessible, and high-performance chart visualizations for the ROI Calculator.

## Components

### ComparisonCharts

Main chart component with three visualization modes:

```tsx
import { ComparisonCharts } from './components/calculator'
;<ComparisonCharts metrics={roiMetrics} inputs={calculatorInputs} systemCost={1200} />
```

**Features:**

- 📊 Bar Chart - Financial comparison
- 🎯 Radar Chart - Capability comparison
- 📈 Area Chart - ROI projection over time
- 📱 Mobile-optimized with swipe navigation
- 🎨 Interactive legend with toggle
- 📸 Export to PNG/PDF
- ♿ WCAG 2.2 Level AA compliant

**Props:**

| Prop         | Type               | Description            |
| ------------ | ------------------ | ---------------------- |
| `metrics`    | `ROIMetrics`       | Calculated ROI metrics |
| `inputs`     | `CalculatorInputs` | User input values      |
| `systemCost` | `number`           | Monthly system cost    |

---

## Hooks

### useChartExport

Export charts to PNG or PDF formats.

```tsx
import { useChartExport } from '../../hooks/useChartExport'

const { exportToPNG, exportToPDF, isExporting, error } = useChartExport()

// Export as PNG
exportToPNG(chartRef.current, 'my-chart', { scale: 2, backgroundColor: '#0f172a' })

// Export as PDF
exportToPDF(chartRef.current, 'my-chart', { scale: 2 })
```

**Returns:**

- `exportToPNG(element, filename, options)` - Export as PNG
- `exportToPDF(element, filename, options)` - Export as PDF
- `isExporting: boolean` - Loading state
- `error: string | null` - Error message
- `clearError()` - Clear error

---

## Accessibility

All components are fully accessible:

- ✅ Keyboard navigation (Tab, Arrow keys, Space, Enter, Escape)
- ✅ Screen reader support (ARIA labels, hidden data tables)
- ✅ High contrast mode support
- ✅ Reduced motion support
- ✅ Touch targets ≥44px
- ✅ Color contrast ≥4.5:1

### Keyboard Shortcuts

| Key               | Action                    |
| ----------------- | ------------------------- |
| `Tab`             | Navigate between controls |
| `←` `→`           | Switch chart types        |
| `Space` / `Enter` | Toggle legend items       |
| `Escape`          | Close export menu         |

---

## Performance

Optimized for high performance:

- 🚀 React.memo on components
- 🚀 useMemo for data calculations
- 🚀 useCallback for event handlers
- 🚀 Lazy loading on route level
- 🚀 2x scale exports (retina quality)

**Benchmarks:**

- Initial render: ~50ms
- Re-renders: 1-2 per interaction
- Memory: Stable, no leaks

---

## Mobile & Touch

Fully responsive with touch support:

- 📱 Adaptive chart heights (300px → 400px)
- 👆 Swipe navigation (mobile only)
- 📏 Responsive padding and sizing
- 🎯 Touch-optimized buttons (44px min)
- 💫 Visual swipe indicators

---

## Export

High-quality chart exports:

**PNG:**

- 2x scale for retina displays
- Dark theme preserved
- Exact styling match
- Filename: `prefix-chartname-YYYY-MM-DD.png`

**PDF:**

- A4 format
- Auto-orientation (portrait/landscape)
- Printable quality
- Filename: `prefix-chartname-YYYY-MM-DD.pdf`

---

## Color Palette

WCAG AA compliant colors (`src/styles/chartColors.ts`):

```typescript
SEMANTIC_COLORS = {
  primary: '#8B5CF6', // Purple (4.6:1)
  danger: '#EF4444', // Red (5.2:1)
  success: '#10B981', // Green (6.1:1)
  warning: '#F59E0B', // Orange (7.8:1)
  info: '#3B82F6', // Blue (4.8:1)
  // ... all tested for 4.5:1+ contrast
}
```

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Android Chrome)

---

## Examples

### Basic Chart

```tsx
<ComparisonCharts
  metrics={{
    totalROI: 250,
    currentROAS: 3.5,
    laborCostSavings: 5000,
    revenueIncrease: 10000,
    netBenefit: 15000,
  }}
  inputs={{
    teamSize: 5,
    avgSalary: 60000,
    campaignsPerMonth: 20,
  }}
  systemCost={1200}
/>
```

### With Export

```tsx
const chartRef = useRef<HTMLDivElement>(null);
const { exportToPNG, exportToPDF, isExporting } = useChartExport();

<div ref={chartRef}>
  <ComparisonCharts {...props} />
</div>

<ExportButton
  onExportPNG={() => exportToPNG(chartRef.current, 'roi-chart')}
  onExportPDF={() => exportToPDF(chartRef.current, 'roi-chart')}
  isExporting={isExporting}
/>
```

---

## Troubleshooting

**Chart not rendering:**

- Check that all required props are provided
- Verify data format matches expected types
- Check browser console for errors

**Export not working:**

- Ensure chartRef is attached to correct element
- Check for CORS issues with images
- Verify html2canvas and jsPDF are installed

**Poor mobile performance:**

- Check memoization is working (React DevTools)
- Reduce data complexity if needed
- Verify touch-manipulation CSS is applied

---

## Related

- [Implementation Guide](../../.taskmaster/docs/charts-implementation-guide.md)
- [Audit Report](../../.taskmaster/docs/charts-current-state-audit.md)
- [Technical Specs](../../.taskmaster/docs/charts-upgrade-2025-spec.md)

---

_Last Updated: October 14, 2025_
