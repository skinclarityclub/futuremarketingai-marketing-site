# Charts & Visualizations - Current State Audit

**Date:** October 14, 2025  
**Auditor:** AI Development Assistant  
**Purpose:** Document current state before 2025 upgrade

---

## Executive Summary

We have **6 chart/visualization components** across the application:

- **3 are Recharts-based** (mature library, good foundation)
- **1 is a custom selector** (UI component, not a chart itself)
- **1 is a custom funnel** (pure CSS/HTML, no charting library)
- **1 is a holographic panel** (info panel, contains stats but not true data viz)

### Overall Health Score: **6/10**

- ✅ **Strengths:** Good use of glassmorphism, animations, interactivity
- ⚠️ **Issues:** Inconsistent tooltips, limited accessibility, no export functionality
- ❌ **Critical:** Tooltip background issues (partially fixed), no keyboard navigation

---

## Component 1: ComparisonCharts.tsx

**Location:** `src/components/calculator/ComparisonCharts.tsx`  
**Type:** Multi-chart component (Bar, Radar, Area)  
**Library:** Recharts v3.2.1

### Current Features

- ✅ Three chart types with tab switcher
- ✅ Glassmorphic card container
- ✅ Custom formatted tooltips
- ✅ Responsive container
- ✅ Color-coded data series
- ✅ Financial formatting (€)

### Technical Details

```typescript
// Props Interface
interface ComparisonChartsProps {
  metrics: ROIMetrics
  inputs: { teamSize, avgSalary, campaignsPerMonth }
  systemCost: number
}

// Chart Types
- Bar Chart: Financial comparison (Team Kosten, Platform, Revenue, etc.)
- Radar Chart: Capability comparison (6 metrics, 0-100 scale)
- Area Chart: 12-month ROI projection with cumulative calculations
```

### Styling & Colors

- **Voor (Before):** `#dc2626` (red-600) - ❌ Poor choice for "before"
- **Na (After):** `#10b981` (emerald-500) - ✅ Good
- **Grid Lines:** `rgba(255,255,255,0.1)` - ✅ Subtle
- **Background:** GlassCard component - ✅ Consistent

### Tooltip Implementation

```typescript
// BEFORE (ISSUE):
<div className="glass-card p-3 border border-accent-primary/30">
  // Would turn white on hover due to glass-card defaults

// AFTER (FIXED):
<div className="bg-gray-900/95 backdrop-blur-md p-3 rounded-lg border border-accent-primary/30 shadow-xl">
  // Consistently dark across all states
```

### Accessibility Score: **3/10**

- ❌ No ARIA labels on charts
- ❌ No keyboard navigation
- ❌ No screen reader alternatives
- ❌ No focus indicators
- ⚠️ Color contrast needs verification
- ✅ Responsive (works on mobile)

### Performance Score: **7/10**

- ✅ Uses ResponsiveContainer
- ✅ Data calculated once per render
- ⚠️ No memoization of chart components
- ⚠️ No lazy loading
- ✅ Small dataset (no virtualization needed)

### Interactivity Score: **4/10**

- ✅ Tab switching between chart types
- ✅ Hover tooltips
- ❌ No legend toggle
- ❌ No zoom/pan
- ❌ No export functionality
- ❌ No data point selection

### Issues Found

1. ❌ **CRITICAL:** Tooltip had white background issue (NOW FIXED)
2. ⚠️ **High:** No keyboard navigation between chart types
3. ⚠️ **High:** Using red for "Voor" contradicts common UX patterns
4. ⚠️ **Medium:** No export functionality
5. ⚠️ **Medium:** Chart type tabs not keyboard accessible
6. ⚠️ **Low:** No loading states shown

### Recommendations

1. Change "Voor" color to neutral (gray/blue)
2. Add keyboard shortcuts (1/2/3 for chart types)
3. Add ARIA labels to all interactive elements
4. Implement export to PNG/PDF
5. Add React.memo wrapper
6. Consider using semantic color scheme

---

## Component 2: ComparisonChart.tsx

**Location:** `src/components/command-center/analytics-hub/ComparisonChart.tsx`  
**Type:** Multi-account metrics comparison  
**Library:** Recharts v3.2.1

### Current Features

- ✅ Three chart types (Bar, Line, Radar)
- ✅ Multi-account comparison
- ✅ Dynamic metric selection
- ✅ Color-coded by metric
- ✅ Responsive
- ✅ useMemo for data transformation

### Technical Details

```typescript
// Props
interface ComparisonChartProps {
  accounts: Account[]
  selectedMetrics: MetricType[]
  chartType: ChartType
}

// Supported Metrics
;(-reach, engagement, clicks, conversions, cpl, roi)

// Color Palette
const metricColors = {
  reach: '#6366f1', // Indigo
  engagement: '#ec4899', // Pink
  clicks: '#8b5cf6', // Purple
  conversions: '#10b981', // Emerald
  cpl: '#f59e0b', // Amber
  roi: '#14b8a6', // Teal
}
```

### Styling & Colors

- ✅ Good color diversity
- ✅ Semantic colors (green for conversions)
- ⚠️ Color contrast not verified
- ✅ Responsive sizing

### Accessibility Score: **2/10**

- ❌ No ARIA labels
- ❌ No keyboard navigation
- ❌ No screen reader support
- ❌ No focus management
- ❌ No data table alternative

### Performance Score: **8/10**

- ✅ useMemo for chart data transformation
- ✅ Efficient data mapping
- ✅ Small to medium datasets
- ⚠️ No lazy loading
- ✅ No unnecessary re-renders

### Interactivity Score: **3/10**

- ✅ Hover tooltips
- ✅ Legend (Recharts default)
- ❌ No legend toggle functionality
- ❌ No export
- ❌ No zoom/pan
- ❌ No custom interactions

### Issues Found

1. ⚠️ **High:** No custom tooltip (uses Recharts default)
2. ⚠️ **High:** Tooltip styling inconsistent with app theme
3. ⚠️ **Medium:** Data scaling logic could be clearer
4. ⚠️ **Medium:** No empty state handling
5. ⚠️ **Low:** No loading states

### Recommendations

1. Add custom tooltip matching ComparisonCharts style
2. Implement legend toggle to show/hide metrics
3. Add keyboard navigation
4. Document data scaling rationale
5. Add empty state component

---

## Component 3: StrategyComparisonChart.tsx

**Location:** `src/components/command-center/strategy-matrix/StrategyComparisonChart.tsx`  
**Type:** Strategy metrics radar chart  
**Library:** Recharts v3.2.1

### Current Features

- ✅ Radar chart for strategy comparison
- ✅ Normalized metrics (0-100 scale)
- ✅ Custom tooltip
- ✅ Selective strategy display
- ✅ useMemo optimization
- ✅ Dynamic colors per strategy

### Technical Details

```typescript
// Metrics Compared
- Reach, Engagement, Conversions, ROI, CTR

// Normalization
maxValue approach - scales each metric to 100 based on max

// Custom Tooltip
- Dark themed: rgba(0, 0, 0, 0.4) + backdrop-blur
- Shows actual values (not normalized)
- Color-coded by strategy
```

### Styling & Colors

- ✅ Good tooltip styling (dark theme)
- ✅ Dynamic colors from strategy data
- ✅ Backdrop blur effect
- ⚠️ Grid color could be more visible

### Accessibility Score: **3/10**

- ❌ No ARIA labels
- ❌ No keyboard navigation
- ❌ No screen reader alternative
- ✅ Tooltip has good contrast
- ⚠️ Color-only differentiation

### Performance Score: **8/10**

- ✅ useMemo for expensive calculations
- ✅ Efficient filtering logic
- ✅ Small dataset
- ⚠️ No memoization of component
- ✅ No unnecessary renders

### Interactivity Score: **4/10**

- ✅ Custom tooltip with actual values
- ✅ Strategy filtering
- ✅ Hover states
- ❌ No legend toggle
- ❌ No export
- ❌ No additional interactions

### Issues Found

1. ⚠️ **High:** Normalization logic could confuse users
2. ⚠️ **Medium:** No explanation of normalized scale
3. ⚠️ **Medium:** Relies solely on color for differentiation
4. ⚠️ **Low:** No loading/empty states
5. ⚠️ **Low:** Tooltip could show normalized vs actual side-by-side

### Recommendations

1. Add scale explanation (tooltip or note)
2. Add patterns/shapes in addition to colors
3. Implement legend toggle
4. Add keyboard navigation
5. Consider adding absolute value chart as alternative view

---

## Component 4: MetricsChartSelector.tsx

**Location:** `src/components/command-center/analytics-hub/MetricsChartSelector.tsx`  
**Type:** UI selector component (not a chart)  
**Library:** None (pure React + Framer Motion)

### Current Features

- ✅ Metric selection buttons (6 metrics)
- ✅ Chart type selection (Bar, Line, Radar)
- ✅ Visual feedback (checkmarks, color changes)
- ✅ Framer Motion animations
- ✅ Icon-based UI
- ✅ Responsive grid

### Technical Details

```typescript
// Not a chart itself - controls other charts
// Provides selection UI for:
- MetricType: reach, engagement, clicks, conversions, cpl, roi
- ChartType: bar, line, radar

// Visual Design
- Glassmorphic buttons
- Color-coded icons per metric
- Check icon when selected
- Border highlights
```

### Styling & Colors

- ✅ Excellent glassmorphism
- ✅ Consistent with app theme
- ✅ Good hover states
- ✅ Active state indicators
- ✅ Responsive layout

### Accessibility Score: **5/10**

- ✅ Semantic buttons
- ✅ Click handlers
- ⚠️ No aria-pressed state
- ⚠️ No keyboard navigation
- ❌ No screen reader announcements
- ✅ Clear visual feedback

### Performance Score: **9/10**

- ✅ Lightweight component
- ✅ No heavy computations
- ✅ Efficient re-renders
- ✅ Framer Motion optimized

### Interactivity Score: **7/10**

- ✅ Click to toggle metrics
- ✅ Click to switch chart type
- ✅ Hover animations
- ✅ Visual feedback
- ❌ No keyboard shortcuts
- ⚠️ Multi-select could be clearer

### Issues Found

1. ⚠️ **Medium:** No aria-pressed for toggle buttons
2. ⚠️ **Medium:** Keyboard navigation limited
3. ⚠️ **Low:** No tooltips explaining metrics
4. ⚠️ **Low:** Could benefit from "Select All" option

### Recommendations

1. Add aria-pressed="true/false" to toggle buttons
2. Implement keyboard navigation (arrow keys)
3. Add tooltips with metric descriptions
4. Consider "Select All/None" quick actions
5. Add visual indicator for selected count

---

## Component 5: FunnelVisualization.tsx

**Location:** `src/components/command-center/analytics-hub/FunnelVisualization.tsx`  
**Type:** Custom funnel chart (CSS-based)  
**Library:** None (Framer Motion for animations)

### Current Features

- ✅ Animated funnel stages
- ✅ Drop-off indicators
- ✅ Clickable stages with expanded details
- ✅ Conversion rate calculations
- ✅ Summary statistics
- ✅ Color-coded stages
- ✅ Responsive width calculation

### Technical Details

```typescript
// Custom CSS funnel (not using chart library)
- Width based on percentage of max value
- Centered alignment with margins
- Border + background gradient
- Animated reveals with Framer Motion

// Features
- Click to expand stage details
- Drop-off percentage between stages
- 3-column summary footer
- Visual hierarchy with sizing
```

### Styling & Colors

- ✅ Beautiful glassmorphic design
- ✅ Gradient backgrounds per stage
- ✅ Border colors match stage color
- ✅ Warning color for drop-offs
- ✅ Excellent visual hierarchy

### Accessibility Score: **4/10**

- ✅ Click hint text
- ✅ Semantic HTML structure
- ⚠️ No keyboard navigation
- ❌ No ARIA labels
- ❌ No screen reader support
- ❌ No focus indicators
- ⚠️ Color-only differentiation

### Performance Score: **7/10**

- ✅ Lightweight (no heavy library)
- ✅ Efficient calculations
- ⚠️ Could memoize stage calculations
- ⚠️ Many conditional renders
- ✅ Smooth animations

### Interactivity Score: **7/10**

- ✅ Click to expand stages
- ✅ Hover animations
- ✅ Visual state changes
- ✅ Detailed metrics on expand
- ❌ No export functionality
- ❌ No keyboard interaction

### Issues Found

1. ⚠️ **High:** No keyboard navigation for stage selection
2. ⚠️ **Medium:** No ARIA labels for interactive elements
3. ⚠️ **Medium:** Expansion state not announced to screen readers
4. ⚠️ **Medium:** Drop-off indicators could use patterns not just color
5. ⚠️ **Low:** No loading states
6. ⚠️ **Low:** Could benefit from zoom controls on mobile

### Recommendations

1. Add keyboard navigation (Tab, Enter, Space)
2. Implement ARIA live regions for state changes
3. Add patterns/textures to stages
4. Add focus indicators
5. Consider export as image functionality
6. Add aria-expanded for clickable stages

---

## Component 6: HolographicInfoPanel.tsx

**Location:** `src/components/layer1-hero/HolographicInfoPanel.tsx`  
**Type:** Info panel with stats (not a true chart)  
**Library:** GSAP for animations

### Current Features

- ✅ Glassmorphic panel design
- ✅ Animated scan lines (holographic effect)
- ✅ GSAP entry animations
- ✅ Node-specific content
- ✅ Color-coded accents
- ✅ Keyboard support (ESC, arrows)
- ✅ ARIA live regions
- ✅ Mobile responsive

### Technical Details

```typescript
// Not a data viz component but info panel
// Displays:
- Node description
- Stats (label, value, trend)
- Features list
- Status indicator
- Pain points
- Monthly savings

// Animation
- GSAP for panel entry (0.4s)
- Continuous scan line animation (2s loop)
- Smooth scale and opacity transitions
```

### Styling & Colors

- ✅ Excellent glassmorphism
- ✅ Holographic scan effect
- ✅ Color-coded by node
- ✅ Good contrast
- ✅ Consistent with brand

### Accessibility Score: **7/10** ⭐ **Best in class**

- ✅ ARIA live regions
- ✅ Keyboard navigation (ESC, arrows)
- ✅ Focus management
- ✅ Semantic HTML
- ✅ Alt text provided
- ⚠️ Animated effects (respects prefers-reduced-motion?)
- ⚠️ Color contrast needs verification

### Performance Score: **8/10**

- ✅ GSAP optimized
- ✅ Animation cleanup on unmount
- ✅ Conditional rendering
- ✅ useRef to prevent re-animations
- ⚠️ Could memoize stats calculations

### Interactivity Score: **6/10**

- ✅ Keyboard navigation
- ✅ Close on ESC
- ✅ Navigate with arrows
- ✅ Link to details
- ❌ No click outside to close
- ⚠️ Limited stat interactions

### Issues Found

1. ⚠️ **Low:** Not a true data visualization component
2. ⚠️ **Low:** Stats are static, no charts
3. ⚠️ **Low:** Could benefit from mini sparklines
4. ✅ **None:** Best accessibility of all components

### Recommendations

1. This is NOT a chart - exclude from chart upgrades
2. Consider adding mini trend sparklines for stats
3. Add click-outside-to-close functionality
4. Verify prefers-reduced-motion support
5. Keep as reference for accessibility best practices

---

## Cross-Component Analysis

### Library Usage

- **Recharts:** 3 components ✅ Good choice, consistent
- **Custom/CSS:** 1 component ⚠️ Limited by custom implementation
- **None (UI):** 2 components ℹ️ Not chart components

### Common Strengths Across All

1. ✅ **Glassmorphism:** Consistent theme
2. ✅ **Animations:** Framer Motion/GSAP used well
3. ✅ **Responsiveness:** All work on mobile
4. ✅ **Visual Design:** Modern, appealing
5. ✅ **Color Usage:** Generally good choices

### Common Weaknesses Across All

1. ❌ **Accessibility:** Poor across the board (except HolographicInfoPanel)
2. ❌ **Keyboard Navigation:** Missing or limited
3. ❌ **Export:** No components have export functionality
4. ❌ **ARIA Labels:** Largely absent
5. ❌ **Screen Readers:** No support for data alternatives
6. ❌ **Focus Management:** Missing focus indicators
7. ❌ **Colorblind:** Heavy reliance on color alone

### Tooltip Consistency

- **ComparisonCharts:** ✅ Fixed (bg-gray-900/95)
- **ComparisonChart:** ❌ Uses Recharts default
- **StrategyComparisonChart:** ✅ Custom dark theme
- **FunnelVisualization:** N/A (expanded details instead)

### Performance Patterns

- **Good:** Small datasets, useMemo used
- **Missing:** No lazy loading, limited memoization
- **Opportunity:** Could add virtualization for future scaling

---

## Priority Matrix

### Critical (Do First)

1. **Add keyboard navigation** - All interactive charts
2. **Implement ARIA labels** - All components
3. **Fix tooltip inconsistencies** - ComparisonChart needs custom tooltip
4. **Add focus indicators** - All interactive elements

### High (Do Soon)

1. **Export functionality** - All chart components
2. **Screen reader alternatives** - Data tables
3. **Colorblind-safe patterns** - Add shapes/patterns
4. **Legend toggles** - All Recharts components

### Medium (Nice to Have)

1. **Zoom/pan controls** - Time-series charts
2. **Loading states** - All components
3. **Empty states** - All components
4. **Memoization** - Performance optimization

### Low (Future Enhancement)

1. **Touch gestures** - Mobile enhancement
2. **Animation preferences** - Respect prefers-reduced-motion
3. **Theme switching** - Light mode support
4. **Advanced interactions** - Data point selection, brushing

---

## Technical Debt

### Documentation

- ❌ No usage examples in code
- ⚠️ Limited JSDoc comments
- ⚠️ Props not fully documented
- ❌ No Storybook stories

### Testing

- ❌ No unit tests found
- ❌ No integration tests
- ❌ No visual regression tests
- ❌ No accessibility tests (axe-core)
- ❌ No performance benchmarks

### Code Quality

- ✅ TypeScript used consistently
- ✅ Props interfaces defined
- ⚠️ Some `any` types used
- ⚠️ Could benefit from more comments
- ✅ Generally clean code structure

---

## Estimated Upgrade Effort

### Phase 1: Critical Fixes (1 week)

- Keyboard navigation: 16 hours
- ARIA labels: 12 hours
- Tooltip consistency: 8 hours
- Focus indicators: 8 hours
  **Total:** 44 hours

### Phase 2: Visual Upgrade (1 week)

- Color palette update: 12 hours
- Colorblind patterns: 16 hours
- Legend toggles: 12 hours
- Loading/empty states: 8 hours
  **Total:** 48 hours

### Phase 3: Interactivity (1 week)

- Export functionality: 20 hours
- Zoom/pan controls: 16 hours
- Advanced interactions: 12 hours
  **Total:** 48 hours

### Phase 4: Accessibility (1 week)

- Screen reader support: 20 hours
- Data table alternatives: 12 hours
- Accessibility testing: 12 hours
- Documentation: 8 hours
  **Total:** 52 hours

### Phase 5: Performance & Polish (1 week)

- Lazy loading: 8 hours
- Memoization: 12 hours
- Visual regression tests: 16 hours
- Final QA: 12 hours
  **Total:** 48 hours

**GRAND TOTAL:** ~240 hours (6 weeks at full-time)
**Realistic Timeline:** 4 weeks with focused effort

---

## Conclusion

Our charts are **visually impressive** but **functionally limited**. The glassmorphic design and animations are excellent, but accessibility and interactivity need significant work.

### Must-Have for 2025 Standards

1. ✅ Modern visual design - **Already good**
2. ❌ WCAG 2.2 Level AA compliance - **Needs work**
3. ❌ Keyboard navigation - **Missing**
4. ❌ Export functionality - **Missing**
5. ⚠️ Mobile responsiveness - **Good but can improve**

### Next Steps

1. ✅ **Complete this audit** - Done
2. **Start Phase 1** - Accessibility foundations
3. **Implement custom tooltip standard** - Use ComparisonCharts as template
4. **Create Storybook stories** - Documentation & testing
5. **Set up visual regression** - Prevent regressions

---

**Audit completed by:** AI Development Assistant  
**Review date:** October 14, 2025  
**Next review:** After Phase 1 completion
