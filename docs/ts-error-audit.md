# TypeScript Error Audit Report

**Date**: January 7, 2025  
**Total Errors**: 108  
**Files Affected**: 37

---

## Executive Summary

This audit identifies and categorizes all TypeScript compilation errors found in the codebase. The errors are grouped by type and severity, with specific recommendations for each category.

### Error Distribution by Type

| Error Code | Count | Severity | Description                         |
| ---------- | ----- | -------- | ----------------------------------- |
| TS6133     | 39    | Low      | Declared but never used             |
| TS2345     | 18    | High     | Argument type mismatch              |
| TS2552     | 10    | High     | Cannot find name (with suggestion)  |
| TS2304     | 7     | High     | Cannot find name                    |
| TS2322     | 4     | Medium   | Type not assignable                 |
| TS2503     | 3     | Medium   | Cannot find namespace 'NodeJS'      |
| TS2556     | 3     | Medium   | Spread argument issues              |
| TS2339     | 3     | Medium   | Property does not exist             |
| TS2774     | 1     | Medium   | Condition always true               |
| TS2353     | 1     | Medium   | Unknown property in object literal  |
| TS2540     | 1     | Medium   | Cannot assign to read-only property |

---

## 1. TS6133: Declared but Never Used (39 errors)

**Severity**: Low  
**Impact**: Code cleanliness, bundle size  
**Fix Effort**: Easy

### Affected Files:

1. **src/components/calculator/**
   - `ComparisonCharts.tsx:17` - 'LineChart' unused
2. **src/components/command-center/analytics-hub/**
   - `FunnelVisualization.tsx:63` - 'isHovered' unused
   - `HeatMapCalendar.tsx:66` - 'maxEngagement' unused
   - `HeatMapCalendar.tsx:113` - 'rec' unused
   - `PlatformComparison.tsx` - Multiple unused imports

3. **src/components/command-center/campaign-management/**
   - `CampaignManagement.tsx:9` - 'FaPlus' unused
   - `CampaignCard.tsx:18` - 'FaCheck' unused

4. **src/components/command-center/hero-metrics/**
   - `HeroMetricsRow.tsx:9` - 'motion' unused
   - `MetricDetailModal.tsx:12,13` - 'LineChart', 'Line' unused

5. **src/components/command-center/multi-account-manager/**
   - `AccountDetailDrawer.tsx:12,17,18` - 'Clock', 'MessageCircle', 'Share2' unused
   - `AccountHierarchyTree.tsx:16` - 'mockAccounts' unused

6. **src/components/command-center/publishing-scheduler/**
   - `BulkScheduler.tsx:6` - 'FaExclamationTriangle' unused
   - `CalendarView.tsx:8,13,25,70` - Multiple unused variables
   - `TimelineView.tsx:3,5` - 'FaExclamationCircle', 'getContentTypeIcon' unused

7. **src/components/common/**
   - `CaseStudyCards.tsx:1` - 'React' unused
   - `IndustrySelector.test.tsx:117` - 'container' unused
   - `IndustrySelector.tsx:6` - 'Button' unused
   - `Modal.tsx:1` - 'useRef' unused
   - `PremiumBadge.test.tsx:1` - 'vi' unused
   - `PricingRevealModal.tsx:12,13` - 'TierConfig', 'getCurrentTier' unused
   - `StrategicCTA.tsx:84` - 'isVisible' unused
   - `TransparentRoadmapTable.tsx:332` - 'config' unused
   - `ValueStackingSection.tsx:147,295` - 'showFilters', 'index' unused

8. **src/components/layer1-hero/**
   - `CoreSphere3D.tsx:69` - 'prefersReducedMotion' unused
   - `HolographicInfoPanel.tsx:61` - 'position' unused
   - `ParticleTypes.ts:122,212` - 'canvas' unused (2x)
   - `SystemDiagram.tsx:91,124,125` - 'isDesktop', 'idleAnimationPhase', 'idleIntensity' unused

9. **src/config/**
   - `industryPersonalization.ts:11` - 'Industry' type unused

10. **src/data/mock/**
    - `generateScheduledContent.ts:17` - 'CONTENT_TYPES' unused

11. **src/hooks/**
    - `useCalendlyBooking.ts:89,90` - 'visitedPages', 'viewedModules' unused
    - `useShareCalculator.ts:1` - 'useEffect' unused

12. **src/pages/**
    - `Calculator.tsx:19,59,88` - 'TierBadge', 'DEFAULTS', 'updateURL', 'hasURLParams' unused
13. **src/stories/**
    - `Button.tsx:1` - 'React' unused
    - `Header.tsx:1` - 'React' unused

14. **src/test/**
    - `setup.ts:2` - 'expect' unused

15. **src/utils/**
    - `pricing-analytics.ts:34` - 'metadata' unused

**Recommendation**: Remove all unused imports and variables. Consider enabling `--noUnusedLocals` and `--noUnusedParameters` in tsconfig.json.

---

## 2. TS2345: Argument Type Mismatch (18 errors)

**Severity**: High  
**Impact**: Runtime errors, data corruption  
**Fix Effort**: Medium

### Critical File: src/utils/pdfExport.ts (18 errors)

All errors in this file involve passing `undefined` to functions expecting `string` parameters:

- **Lines 55, 61**: Font color issues
- **Lines 86, 90**: Text rendering issues
- **Lines 115, 121, 133**: Column formatting issues
- **Lines 216, 222, 228**: Header/title issues
- **Lines 252, 257, 264, 271, 274**: Content rendering issues
- **Lines 299, 333**: Summary section issues
- **Lines 364, 369**: Footer issues

**Root Cause**: Optional color/text properties not properly handled before being passed to PDF rendering functions.

**Recommendation**:

1. Add null checks before passing values to PDF functions
2. Provide default values for optional parameters
3. Update type definitions to allow `undefined` where appropriate
4. Example fix:

```typescript
// Before:
doc.text(someOptionalValue)

// After:
doc.text(someOptionalValue ?? 'Default value')
```

---

## 3. TS2552/TS2304: Cannot Find Name 'trackGA4Event' (17 errors)

**Severity**: High  
**Impact**: Analytics tracking broken  
**Fix Effort**: Easy

### Affected File: src/utils/pricing-analytics.ts

**Lines with errors**: 64, 98, 132, 159, 185, 213, 248, 269, 291, 309, 328, 351, 378, 405, 436

**Root Cause**: Function `trackGA4Event` is not imported or doesn't exist. TypeScript suggests using `trackEvent` instead.

**Recommendation**:

1. Verify if `trackGA4Event` should be `trackEvent`
2. Import the correct function from analytics utilities
3. Update all references consistently
4. Example fix:

```typescript
// Add to imports:
import { trackEvent } from './analytics';

// Replace all trackGA4Event calls:
trackEvent('pricing_calculator_opened', { ... });
```

---

## 4. TS2503: Cannot Find Namespace 'NodeJS' (3 errors)

**Severity**: Medium  
**Impact**: Build issues in strict environments  
**Fix Effort**: Easy

### Affected Files:

- `src/hooks/useIdleDetection.ts:42,102`
- `src/hooks/useScrollPosition.ts:37`
- `src/pages/Hero.tsx:236`

**Root Cause**: Missing `@types/node` package for NodeJS type definitions.

**Recommendation**:

```bash
npm install --save-dev @types/node
```

Then update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["node", "vite/client"]
  }
}
```

---

## 5. TS2322: Type Not Assignable (4 errors)

**Severity**: Medium  
**Impact**: Props not matching component interfaces  
**Fix Effort**: Medium

### Affected Files:

1. **src/components/command-center/analytics-hub/PlatformComparison.tsx:222**
   - Issue: `style` prop not accepted by component
   - Fix: Use `className` with Tailwind or update component props interface

2. **src/components/common/AggregateMetrics.tsx:131**
   - Issue: `prefix` and `suffix` props don't exist on `AnimatedMetricProps`
   - Fix: Update `AnimatedMetricProps` interface to include these props

3. **src/components/common/IndustrySelector.tsx:175**
   - Issue: `onMouseEnter` and `onMouseLeave` not in `GlassCardProps`
   - Fix: Add hover event handlers to `GlassCardProps` interface

**Recommendation**: Update component prop interfaces to match usage patterns.

---

## 6. TS2556: Spread Argument Issues (3 errors)

**Severity**: Medium  
**Impact**: Type safety in array operations  
**Fix Effort**: Easy

### Affected File: src/utils/pdfExport.ts

**Lines**: 205, 206, 223

**Root Cause**: Arrays being spread don't have proper tuple types.

**Recommendation**:

```typescript
// Before:
someFunction(...array)

// After:
someFunction(...(array as [type1, type2]))
// Or
someFunction.apply(null, array)
```

---

## 7. TS2339: Property Does Not Exist (3 errors)

**Severity**: Medium  
**Impact**: Runtime errors when accessing non-existent properties  
**Fix Effort**: Easy

### Affected Files:

1. **src/components/common/PremiumBadge.test.tsx:186**
   - Issue: `.focus()` doesn't exist on `Element`
   - Fix: Cast to `HTMLElement` before calling focus

2. **src/components/common/Responsive.tsx:74,89**
   - Issue: `isMobileOrTablet` and `isTabletOrDesktop` don't exist
   - Fix: Add these computed properties or use existing boolean combinations

**Recommendation**:

```typescript
// For focus issue:
;(element as HTMLElement).focus()

// For responsive issue:
const isMobileOrTablet = isMobile || isTablet
const isTabletOrDesktop = isTablet || isDesktop
```

---

## 8. TS2304: Cannot Find Name 'global' (2 errors)

**Severity**: Medium  
**Impact**: Test setup may fail  
**Fix Effort**: Easy

### Affected File: src/test/setup.ts

**Lines**: 11, 18

**Root Cause**: `global` object not typed in test environment.

**Recommendation**:

```typescript
// Add type declaration:
declare const global: typeof globalThis

// Or use globalThis directly:
globalThis.CSS = { supports: () => false }
```

---

## 9. Other Errors (4 errors)

### TS2774: Condition Always True

- **File**: `ShareExportButtons.tsx:227`
- **Fix**: Call the function or remove the condition

### TS2353: Unknown Property

- **File**: `FunnelVisualization.tsx:84`
- **Fix**: Remove `ringColor` or update MotionStyle type

### TS2540: Read-only Assignment

- **File**: `SystemDiagram.tsx:457`
- **Fix**: Don't assign to `.current` directly, or restructure ref usage

### TS2304: Cannot Find Name 'beforeEach'

- **File**: `IndustrySelector.test.tsx:10`
- **Fix**: Import `beforeEach` from test framework

---

## Priority Fix Order

### 🔴 Critical (Fix First)

1. **pdfExport.ts** (18 errors) - Blocking PDF export functionality
2. **pricing-analytics.ts** (17 errors) - Blocking analytics tracking

### 🟡 Important (Fix Second)

3. **NodeJS namespace** (4 errors) - Add @types/node
4. **Type mismatches** (4 errors) - Update component interfaces
5. **Property access** (3 errors) - Type casting fixes

### 🟢 Cleanup (Fix Third)

6. **Unused variables** (39 errors) - Remove dead code
7. **Spread arguments** (3 errors) - Type annotations
8. **Minor issues** (4 errors) - Various small fixes

---

## Estimated Fix Time

| Priority  | Error Count    | Est. Time      | Complexity  |
| --------- | -------------- | -------------- | ----------- |
| Critical  | 35 errors      | 4-6 hours      | Medium-High |
| Important | 11 errors      | 2-3 hours      | Medium      |
| Cleanup   | 62 errors      | 2-4 hours      | Low         |
| **Total** | **108 errors** | **8-13 hours** | **Mixed**   |

---

## Recommended Actions

1. **Immediate**: Fix critical errors in `pdfExport.ts` and `pricing-analytics.ts`
2. **Short-term**: Add missing type definitions (`@types/node`)
3. **Medium-term**: Update component prop interfaces for type safety
4. **Long-term**: Enable stricter TypeScript rules and clean up unused code

---

## Configuration Recommendations

Update `tsconfig.json` with stricter settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["node", "vite/client"]
  }
}
```

---

## Appendix: Full Error List

See `ts-errors-raw.txt` for the complete unprocessed error output from `tsc --noEmit`.
