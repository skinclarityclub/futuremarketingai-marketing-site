# Loading States - Manual Testing Plan

**Task:** 16.12 - Add Loading States and Fallback UIs  
**Date:** October 7, 2025  
**Build Status:** ✅ Passing

---

## Overview

This document provides step-by-step instructions for manually testing all loading states and fallback UIs with simulated slow network conditions.

---

## Testing Environment Setup

### Chrome DevTools Network Throttling

1. **Open Chrome DevTools**
   - Press `F12` or `Ctrl+Shift+I`
   - Go to the **Network** tab

2. **Enable Throttling**
   - Click the dropdown that says "No throttling"
   - Select **"Slow 3G"** for realistic slow network simulation
   - Alternative: **"Fast 3G"** for moderate testing

3. **Disable Cache**
   - Check the **"Disable cache"** checkbox
   - This ensures fresh loads every time

4. **Optional: Custom Throttling**
   - Click "Add..." to create custom profiles
   - Example: 500 Kbps download, 250 Kbps upload, 400ms latency

---

## Test Cases

### 1. Route-Level Loading (Full Page Loads)

**Location:** All main routes  
**Expected Behavior:** Full-screen branded loading indicator with spinner and message

#### Test Steps:

1. Start with throttling enabled (Slow 3G)
2. Navigate to each route:
   - **Home (/)**: Hero page
   - **/explorer**: Explorer page
   - **/dashboard**: Dashboard page
   - **/calculator**: Calculator page
   - **/ad-builder**: Ad Builder page

#### Success Criteria:

- ✅ Loading indicator appears immediately (no blank screen)
- ✅ Spinner animates smoothly
- ✅ Message displays "Loading page..."
- ✅ Background gradient shows brand colors
- ✅ Transition to content is smooth (fade-in)
- ✅ No layout shift when content loads

---

### 2. Hero Page - SystemDiagram

**Location:** `src/pages/Hero.tsx`  
**Expected Behavior:** Loading indicator with message "Het diagram laden..." (NL) or equivalent

#### Test Steps:

1. Navigate to home page (/)
2. Scroll to SystemDiagram section
3. With throttling enabled, refresh the page
4. Observe loading state for SystemDiagram component

#### Success Criteria:

- ✅ LoadingFallback appears while diagram loads
- ✅ Translated message shows correctly (NL/EN)
- ✅ No jarring transition when diagram appears
- ✅ 3D elements load progressively

---

### 3. Calculator Page - Results Components

**Location:** `src/pages/Calculator.tsx`  
**Expected Behavior:** Loading indicator for AnimatedMetric and BreakEvenTimeline

#### Test Steps:

1. Navigate to /calculator
2. Fill in calculator form with sample data
3. Click "Calculate" or trigger results
4. With throttling, observe loading state

#### Success Criteria:

- ✅ LoadingFallback appears while results calculate
- ✅ Message displays "Resultaten laden..." (NL) or equivalent
- ✅ Animated metrics appear smoothly after load
- ✅ Timeline renders without layout shift

---

### 4. Explorer Page - Interactive Demos

**Location:** `src/pages/Explorer.tsx`

#### 4.1 Modal Loading

**Test Steps:**

1. Navigate to /explorer
2. Click on any feature card to open modal
3. Observe loading state

**Success Criteria:**

- ✅ LoadingFallback appears: "Details laden..." (NL) / "Loading details..." (EN)
- ✅ Modal content loads smoothly

#### 4.2 Telegram Mockup

**Test Steps:**

1. In Explorer, navigate to feature with Telegram demo
2. Observe Telegram component loading

**Success Criteria:**

- ✅ LoadingFallback: "Telegram mockup laden..." (NL)
- ✅ Mockup appears after loading

#### 4.3 HeatMap

**Test Steps:**

1. Navigate to feature with HeatMap
2. Observe HeatMap loading

**Success Criteria:**

- ✅ LoadingFallback: "Heatmap laden..." (NL)
- ✅ HeatMap renders correctly after load

#### 4.4 Ad Builder Demo

**Test Steps:**

1. Navigate to feature with Ad Builder demo
2. Observe Ad Builder loading

**Success Criteria:**

- ✅ LoadingFallback: "Ad builder laden..." (NL)
- ✅ Demo loads and is interactive

---

### 5. Calendly Modal - Async Loading

**Location:** `src/components/common/CalendlyModal.tsx`  
**Expected Behavior:** Custom loading spinner with message during Calendly widget initialization

#### Test Steps:

1. Trigger Calendly modal (usually via CTA button)
2. With throttling, observe loading state
3. Wait for Calendly widget to initialize

#### Success Criteria:

- ✅ Spinner appears immediately
- ✅ Message displays "Calendly laden..." or equivalent
- ✅ Spinner disappears when widget ready
- ✅ Widget is fully interactive after load
- ✅ No errors in console

---

### 6. 3D Components - Progressive Enhancement

#### 6.1 CoreSphere3D

**Location:** `src/components/layer1-hero/CoreSphere3D.tsx`

**Test Steps:**

1. Navigate to home page
2. Observe 3D sphere loading
3. Check for visual artifacts

**Success Criteria:**

- ✅ No jarring flicker during initialization
- ✅ Canvas renders without blocking UI
- ✅ Sphere appears smoothly
- ✅ Animations start correctly

#### 6.2 ParticleSystem

**Location:** `src/components/layer1-hero/SystemDiagram.tsx`

**Test Steps:**

1. Observe background particle system on Hero page
2. Check for smooth initialization

**Success Criteria:**

- ✅ Particles appear gradually (no flash)
- ✅ No layout shift
- ✅ Performance is acceptable
- ✅ Decorative elements don't block interaction

---

## Accessibility Testing

### Screen Reader Testing

1. **Enable screen reader** (NVDA on Windows, VoiceOver on Mac)
2. Navigate through loading states
3. Verify loading messages are announced

**Success Criteria:**

- ✅ Loading messages are read by screen reader
- ✅ User is informed when content loads
- ✅ Focus management is appropriate

### Keyboard Navigation

1. Use only keyboard (Tab, Enter, Esc)
2. Navigate through loading states
3. Verify interactions work

**Success Criteria:**

- ✅ Can't interact with loading content
- ✅ Focus is managed correctly
- ✅ Keyboard traps are avoided

---

## Performance Testing

### Metrics to Monitor

1. **Time to First Contentful Paint (FCP)**
   - Target: < 1.8s on Fast 3G
2. **Time to Interactive (TTI)**
   - Target: < 3.9s on Fast 3G
3. **Largest Contentful Paint (LCP)**
   - Target: < 2.5s on Fast 3G

### DevTools Performance Panel

1. Open DevTools > Performance
2. Record page load
3. Analyze timeline for:
   - JavaScript execution blocking rendering
   - Long tasks (> 50ms)
   - Layout shifts (CLS)

**Success Criteria:**

- ✅ Loading indicators don't cause performance regression
- ✅ No excessive reflows during load
- ✅ Animations are smooth (60fps)

---

## Error Scenarios

### 1. Failed Lazy Load

**Test Steps:**

1. Open DevTools > Network
2. Block requests to chunk files (right-click > Block request URL)
3. Try to navigate to blocked route
4. Observe error boundary

**Success Criteria:**

- ✅ Error boundary catches failure
- ✅ User sees friendly error message
- ✅ "Try again" button works
- ✅ No white screen

### 2. Slow Loading (Timeout)

**Test Steps:**

1. Set Custom Throttling to extremely slow (50 Kbps)
2. Navigate to heavy page (Dashboard)
3. Observe extended loading state

**Success Criteria:**

- ✅ Loading indicator persists appropriately
- ✅ No timeout errors in console
- ✅ Eventually loads successfully
- ✅ User can cancel/navigate away

---

## Multi-Device Testing

### Mobile Testing

**Devices to test:**

- iPhone 12 (iOS Safari)
- Samsung Galaxy S21 (Chrome Android)
- iPad Pro (Safari)

**Test Steps:**

1. Use DevTools Device Emulation
2. Select device preset
3. Run through all test cases above

**Success Criteria:**

- ✅ Loading indicators are visible on small screens
- ✅ Touch interactions work during/after load
- ✅ No horizontal scrolling during load
- ✅ Text is readable

### Desktop Testing

**Browsers:**

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (if available)

**Success Criteria:**

- ✅ Consistent behavior across browsers
- ✅ Fallbacks render correctly
- ✅ No browser-specific issues

---

## Internationalization (i18n) Testing

### Language Switching

**Test Steps:**

1. Navigate to page with loading states
2. Switch language (EN ↔ NL)
3. Refresh page
4. Observe loading messages

**Success Criteria:**

- ✅ Loading messages appear in correct language
- ✅ No missing translation keys
- ✅ Messages are contextually appropriate
- ✅ No layout issues with longer text

---

## Regression Testing Checklist

After any code changes, verify:

- [ ] All routes still have loading indicators
- [ ] No new console errors during load
- [ ] Build completes without errors
- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] Lighthouse score hasn't regressed
- [ ] Bundle size is acceptable
- [ ] No new accessibility issues

---

## Known Limitations & Expected Behavior

### 3D Components

- **CoreSphere3D** and **ParticleSystem** use `fallback={null}` intentionally
- **Rationale:** Three.js Canvas doesn't support React fallbacks
- **Impact:** No loading spinner, but parent page shows loading state

### Decorative Elements

- Some background effects load without explicit loading indicators
- **Rationale:** Prevents UI distraction and maintains flow
- **Impact:** User experience prioritizes content over decoration

---

## Troubleshooting

### Issue: Loading indicator not appearing

**Solution:**

1. Check that `LoadingFallback` is imported
2. Verify `Suspense` wrapper exists
3. Check translation keys are defined
4. Clear browser cache

### Issue: Infinite loading

**Solution:**

1. Check console for errors
2. Verify chunk files are being served
3. Check for circular dependencies
4. Test with cache disabled

### Issue: Layout shift during load

**Solution:**

1. Ensure fallback has same dimensions as content
2. Use skeleton screens for complex layouts
3. Reserve space with min-height
4. Use `fullScreen` prop for page-level loads

---

## Test Results Template

```markdown
## Test Session: [Date]

**Tester:** [Name]
**Environment:** Chrome 120, Slow 3G, Cache Disabled

### Route Loading

- [ ] Hero page: PASS/FAIL - Notes: \_\_\_
- [ ] Explorer page: PASS/FAIL - Notes: \_\_\_
- [ ] Dashboard page: PASS/FAIL - Notes: \_\_\_
- [ ] Calculator page: PASS/FAIL - Notes: \_\_\_
- [ ] Ad Builder page: PASS/FAIL - Notes: \_\_\_

### Component Loading

- [ ] SystemDiagram: PASS/FAIL - Notes: \_\_\_
- [ ] Calculator Results: PASS/FAIL - Notes: \_\_\_
- [ ] Explorer Modal: PASS/FAIL - Notes: \_\_\_
- [ ] Telegram Mockup: PASS/FAIL - Notes: \_\_\_
- [ ] HeatMap: PASS/FAIL - Notes: \_\_\_
- [ ] Ad Builder Demo: PASS/FAIL - Notes: \_\_\_
- [ ] Calendly Modal: PASS/FAIL - Notes: \_\_\_

### Accessibility

- [ ] Screen reader: PASS/FAIL - Notes: \_\_\_
- [ ] Keyboard navigation: PASS/FAIL - Notes: \_\_\_

### Performance

- [ ] FCP < 1.8s: PASS/FAIL
- [ ] TTI < 3.9s: PASS/FAIL
- [ ] LCP < 2.5s: PASS/FAIL

### Issues Found

1. [Issue description]
2. [Issue description]

### Overall Assessment

✅ PASS / ❌ FAIL

**Recommendations:**

- [Recommendation 1]
- [Recommendation 2]
```

---

## Next Steps

1. **Execute Tests:** Run through all test cases above
2. **Document Results:** Fill out test results template
3. **Fix Issues:** Address any failures found
4. **Regression Test:** Re-test after fixes
5. **Production Verification:** Test on live environment after deployment

---

## Conclusion

This test plan ensures comprehensive coverage of all loading states and fallback UIs. Follow these steps to verify that users experience smooth, professional loading transitions throughout the application.

**Estimated Testing Time:** 45-60 minutes (full suite)  
**Recommended Frequency:** Before each major release, after significant refactors

---

**Document Status:** ✅ Ready for Use  
**Last Updated:** October 7, 2025
