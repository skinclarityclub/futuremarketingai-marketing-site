# Quick Start: Mobile Testing

Snelle handleiding om mobile testing te starten.

## 1. Development Testing (5 min)

### TouchTargetDebug Component

```tsx
// src/App.tsx
import { TouchTargetDebug } from '@/components/mobile';

function App() {
  return (
    <>
      {process.env.NODE_ENV === 'development' && <TouchTargetDebug />}
      {/* Your app */}
    </>
  );
}
```

**Actions:**
1. Open de app in development mode
2. Klik op "👁️ Show Touch Targets" (rechtsonder)
3. Review color-coded indicators:
   - 🟢 Green: Pass (≥48×48px)
   - 🟡 Yellow: Pass with recommendations
   - 🔴 Red: Fail (<48×48px)
4. Klik op "📊 Report" voor detailed report

## 2. Browser DevTools Testing (10 min)

### Responsive Design Mode

**Chrome/Edge:**
```
1. Open DevTools: F12 / Cmd+Option+I
2. Toggle device toolbar: Cmd+Shift+M / Ctrl+Shift+M
3. Select device: iPhone 14 Pro
4. Test all breakpoints: 375px, 768px, 1024px
5. Check landscape + portrait
```

**Firefox:**
```
1. Open DevTools: F12 / Cmd+Option+I
2. Responsive Design Mode: Cmd+Option+M / Ctrl+Shift+M
3. Select device or custom dimensions
```

### Touch Simulation

**Chrome DevTools:**
```
1. DevTools → Settings (⚙️)
2. Devices → Add custom device
3. Enable "Show device frame"
4. Select "Mobile" user agent
5. Test touch interactions
```

## 3. Lighthouse Audit (2 min)

### Run Lighthouse

**Option A: Chrome DevTools**
```
1. Open DevTools: F12
2. Click "Lighthouse" tab
3. Select:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
4. Device: Mobile
5. Click "Analyze page load"
```

**Option B: Command Line**
```bash
# Build production version
npm run build

# Start preview server
npm run preview

# Run Lighthouse
lighthouse http://localhost:4173 --view
```

### Target Scores
- Performance: ≥90
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥90

## 4. Axe Accessibility Scan (3 min)

### Install Extension

**Chrome:**
[Axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessibility/lhdoppojpmngadmnindnejefpokejbdd)

**Firefox:**
[Axe DevTools](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)

### Run Scan

```
1. Open page to test
2. Open DevTools
3. Click "Axe DevTools" tab
4. Click "Scan ALL of my page"
5. Review issues:
   - Critical: Fix immediately
   - Serious: Fix before deploy
   - Moderate: Fix soon
   - Minor: Fix when possible
```

### Critical Issues to Fix

- Missing alt text on images
- Insufficient color contrast
- Missing form labels
- Keyboard trap
- Missing ARIA attributes
- Touch targets too small

## 5. Real Device Testing (15 min)

### iOS (Safari)

**Simulator:**
```
1. Open Xcode Simulator
2. Select device: iPhone 14 Pro
3. Open Safari
4. Navigate to: http://localhost:5173
```

**Real Device:**
```
1. Ensure Mac and iPhone on same network
2. Get Mac IP: System Settings → Network
3. On iPhone Safari: http://[YOUR_IP]:5173
4. Enable Web Inspector: Settings → Safari → Advanced
5. Mac Safari: Develop → [Your iPhone]
```

### Android (Chrome)

**Real Device:**
```
1. Enable Developer Options on phone
2. Enable USB Debugging
3. Connect via USB
4. Chrome → More Tools → Remote Devices
5. Inspect your localhost
```

**Emulator:**
```
1. Install Android Studio
2. Open AVD Manager
3. Create device: Pixel 7
4. Start emulator
5. Open Chrome, navigate to app
```

## 6. Manual Interaction Testing (10 min)

### Touch Interactions Checklist

```
Mobile Device Test:
☐ All buttons respond to tap (no delay)
☐ Links are easily tappable
☐ Swipe/scroll works smoothly
☐ No accidental taps on nearby elements
☐ Touch targets feel comfortable
☐ Active states provide feedback
☐ No hover-only interactions
```

### Keyboard Navigation (Desktop)

```
☐ Tab through all interactive elements
☐ Tab order is logical
☐ Focus indicators clearly visible
☐ Enter/Space activate buttons
☐ Escape closes modals
☐ No keyboard traps
☐ Skip links work
```

### Screen Reader Test

**macOS VoiceOver:**
```
1. Enable: Cmd+F5
2. Navigate: VO+Right Arrow (Ctrl+Option+→)
3. Activate: VO+Space
4. Disable: Cmd+F5
```

**Windows Narrator:**
```
1. Enable: Ctrl+Win+Enter
2. Navigate: Caps Lock + Arrow keys
3. Activate: Caps Lock + Enter
4. Disable: Ctrl+Win+Enter
```

```
☐ All content is announced
☐ Images have alt text
☐ Buttons have clear labels
☐ Form fields have labels
☐ Navigation landmarks present
☐ Dynamic content announces changes
```

## 7. Performance Testing (5 min)

### Core Web Vitals

**Chrome DevTools Performance Tab:**
```
1. Open DevTools → Performance
2. Start recording
3. Reload page
4. Stop recording
5. Check metrics:
   - LCP: <2.5s (green in timeline)
   - FID: <100ms (interaction delay)
   - CLS: <0.1 (layout shift score)
```

### Network Throttling

```
1. DevTools → Network tab
2. Throttling dropdown
3. Select: Fast 3G or Slow 3G
4. Reload page
5. Verify acceptable load time
```

## 8. Quick Regression Test (5 min)

After making changes, verify:

```
☐ No console errors
☐ Layout not broken at 375px, 768px, 1024px
☐ Touch targets still work
☐ No horizontal scrolling
☐ CTAs visible and clickable
☐ Images load correctly
☐ Text readable
☐ No layout shifts on load
```

## Common Quick Fixes

### Issue: Touch target too small
```tsx
// Before
<button className="px-2 py-1">

// After
<button className="tap-target px-6 py-3">
```

### Issue: Text too small on mobile
```tsx
// Before
<p className="text-xs">

// After
<p className="text-sm tablet:text-base">
```

### Issue: Missing alt text
```tsx
// Before
<img src="logo.png" />

// After
<img src="logo.png" alt="Company Logo" />
```

### Issue: No focus indicator
```tsx
// Before
<button className="...">

// After
<button className="... focus-ring">
```

### Issue: Poor contrast
```tsx
// Before
<p className="text-gray-500"> // 3.2:1 contrast

// After
<p className="text-text-secondary"> // 4.6:1 contrast
```

## Testing Workflow

### Daily (During Development)
```
1. Check TouchTargetDebug overlay
2. Test in responsive mode
3. Fix any red indicators
```

### Before Commit
```
1. Run Lighthouse (target: >90)
2. Run Axe scan (0 critical issues)
3. Manual test on 1 device
```

### Before Deploy
```
1. Full Lighthouse audit
2. Full Axe audit
3. Test on 2-3 real devices
4. Manual keyboard navigation
5. Manual screen reader test
```

### Post-Deploy
```
1. Verify on production URL
2. Check real device performance
3. Monitor Core Web Vitals
```

## Emergency Checklist

If mobile is broken in production:

```
☐ Check console errors
☐ Verify viewport meta tag
☐ Test touch targets work
☐ Check images load
☐ Verify no horizontal scroll
☐ Test on actual device
☐ Check network requests
☐ Verify breakpoints work
```

## Resources Quick Links

- [TouchTargetDebug Component](../mobile/TouchTargetDebug.tsx)
- [Touch Target Standards](../mobile/TOUCH_TARGET_STANDARDS.md)
- [Full Testing Plan](../mobile/TESTING_PLAN.md)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)

## Get Help

Issues? Check:
1. Console errors
2. Network tab
3. TouchTargetDebug report
4. Lighthouse report
5. Axe scan results

Still stuck? Review full [Testing Plan](../mobile/TESTING_PLAN.md).

---

**Pro Tip:** Maak een gewoonte van deze quick tests na elke feature. Catch issues vroeg = minder werk later!

