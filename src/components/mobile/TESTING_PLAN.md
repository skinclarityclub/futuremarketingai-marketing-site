# Mobile Device & Accessibility Testing Plan

## Overview

Dit document definieert het testing framework voor de mobile-first responsive design system van Future Marketing AI, met focus op device compatibility, accessibility, en performance.

## Testing Scope

### 1. Device Testing
- iOS devices (iPhone, iPad)
- Android devices (verschillende fabrikanten)
- Tablet devices
- Browser emulators

### 2. Accessibility Testing
- WCAG 2.1 Level AA compliance
- Screen reader compatibility
- Keyboard navigation
- Touch target validation
- Color contrast verification

### 3. Performance Testing
- Core Web Vitals
- Load times
- Responsive performance
- Touch latency

## Device Matrix

### Priority 1: Must Test (Critical Devices)

| Device | OS | Screen Size | Browser | Priority |
|--------|----|-----------:|---------|----------|
| iPhone 14 Pro | iOS 17+ | 393×852px | Safari | High |
| iPhone SE (3rd gen) | iOS 17+ | 375×667px | Safari | High |
| iPad Air | iOS 17+ | 820×1180px | Safari | High |
| Samsung Galaxy S23 | Android 13+ | 360×800px | Chrome | High |
| Google Pixel 7 | Android 13+ | 412×915px | Chrome | High |
| Samsung Galaxy Tab S8 | Android 13+ | 800×1280px | Chrome | Medium |

### Priority 2: Should Test (Common Devices)

| Device | OS | Screen Size | Browser | Priority |
|--------|----|-----------:|---------|----------|
| iPhone 13 | iOS 16+ | 390×844px | Safari | Medium |
| iPhone 12 mini | iOS 16+ | 375×812px | Safari | Medium |
| OnePlus 10 Pro | Android 12+ | 412×919px | Chrome | Medium |
| Xiaomi Redmi Note 11 | Android 12+ | 393×851px | Chrome | Medium |

### Priority 3: Nice to Test (Edge Cases)

| Device | OS | Screen Size | Browser | Priority |
|--------|----|-----------:|---------|----------|
| iPhone 8 | iOS 15+ | 375×667px | Safari | Low |
| Samsung Galaxy A52 | Android 11+ | 412×915px | Chrome | Low |
| iPad Mini | iOS 16+ | 744×1133px | Safari | Low |

## Breakpoint Coverage

Test alle breakpoints:
- **Mobile:** 375px, 390px, 393px, 412px
- **Tablet:** 640px, 768px, 800px, 820px
- **Desktop:** 1024px, 1280px, 1440px, 1920px

## Browser Testing

### Desktop Browsers (Responsive Mode)

| Browser | Version | Engine | Priority |
|---------|---------|--------|----------|
| Chrome | Latest | Chromium | High |
| Firefox | Latest | Gecko | High |
| Safari | Latest | WebKit | High |
| Edge | Latest | Chromium | Medium |

### Mobile Browsers

| Browser | Platform | Priority |
|---------|----------|----------|
| Safari | iOS | High |
| Chrome | Android | High |
| Chrome | iOS | Medium |
| Samsung Internet | Android | Medium |
| Firefox | Android | Low |

## Testing Tools

### Automated Testing

#### 1. Lighthouse CI

```json
// lighthouse.config.js
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:4173/"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

**Run:**
```bash
npm run build
npm run preview
lighthouse http://localhost:4173 --view
```

#### 2. Axe DevTools

Install browser extension:
- Chrome: [Axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessibility/lhdoppojpmngadmnindnejefpokejbdd)
- Firefox: [Axe DevTools](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)

**Usage:**
1. Open DevTools
2. Navigate to "Axe DevTools" tab
3. Click "Scan ALL of my page"
4. Review issues
5. Export report

#### 3. Chrome DevTools

**Features to use:**
- Device emulation (Cmd/Ctrl + Shift + M)
- Lighthouse tab
- Coverage tab (unused CSS/JS)
- Performance tab (Core Web Vitals)
- Accessibility pane in Elements tab

#### 4. TouchTargetDebug Component

```tsx
// Add to App.tsx in development
import { TouchTargetDebug } from '@/components/mobile';

{process.env.NODE_ENV === 'development' && <TouchTargetDebug />}
```

**Features:**
- Visual overlay van touch targets
- Color-coded pass/fail indicators
- Real-time dimension display
- Detailed report panel

### Manual Testing

#### 1. Visual Inspection

**Checklist per page:**
- [ ] Layout niet broken bij elk breakpoint
- [ ] Geen horizontal scrolling
- [ ] Geen overlappende elementen
- [ ] Images laden correct
- [ ] Text is leesbaar
- [ ] CTAs zijn prominent zichtbaar
- [ ] Spacing is consistent
- [ ] Animaties werken smooth

#### 2. Interaction Testing

**Touch Interactions:**
- [ ] Alle buttons reageren op tap
- [ ] Swipe gestures werken (indien van toepassing)
- [ ] Pinch-to-zoom disabled waar nodig
- [ ] Pull-to-refresh werkt (indien geïmplementeerd)
- [ ] Long-press acties werken (indien van toepassing)
- [ ] Touch targets zijn ≥48×48px
- [ ] Geen dubbel-tap delay

**Keyboard Navigation:**
- [ ] Tab order is logisch
- [ ] Focus indicators zijn zichtbaar
- [ ] Enter/Space activeren buttons
- [ ] Escape sluit modals
- [ ] Arrows navigeren door lists/carousels

#### 3. Screen Reader Testing

**iOS VoiceOver:**
1. Settings → Accessibility → VoiceOver → On
2. Test alle interactive elements
3. Verify ARIA labels zijn correct
4. Check reading order

**Android TalkBack:**
1. Settings → Accessibility → TalkBack → On
2. Test alle interactive elements
3. Verify content descriptions
4. Check navigation flow

**Checklist:**
- [ ] Alle images hebben alt text
- [ ] Buttons hebben descriptive labels
- [ ] Form fields hebben labels
- [ ] Links zijn descriptive (niet "click here")
- [ ] Dynamic content updates announced
- [ ] Skip links aanwezig
- [ ] Landmarks gebruikt (nav, main, aside)

## Test Scenarios

### Critical User Flows

#### 1. Homepage Visit (Mobile)
```
Scenario: First-time visitor op mobile
Device: iPhone 14 Pro
Steps:
1. Open homepage
2. Verify hero CTA zichtbaar
3. Scroll door content
4. Check navigation menu werkt
5. Verify footer accessible

Expected:
- Hero loads < 2s
- All text readable
- No layout shifts (CLS < 0.1)
- Touch targets work
- Smooth scrolling
```

#### 2. Navigation Flow
```
Scenario: User navigeert door site
Device: Samsung Galaxy S23
Steps:
1. Open hamburger menu
2. Tap menu item
3. Navigate to sub-page
4. Use back button
5. Return to home

Expected:
- Menu opens smoothly
- Links respond immediately
- Page transitions smooth
- Back button works
- State maintained
```

#### 3. Form Interaction
```
Scenario: Contact form submission
Device: iPad Air
Steps:
1. Navigate to form
2. Focus first field
3. Fill out form
4. Submit form
5. View confirmation

Expected:
- Fields focusable
- Virtual keyboard appropriate
- Validation clear
- Submit button accessible
- Success message shown
```

## Performance Benchmarks

### Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤2.5s | 2.5s-4.0s | >4.0s |
| **FID** (First Input Delay) | ≤100ms | 100ms-300ms | >300ms |
| **CLS** (Cumulative Layout Shift) | ≤0.1 | 0.1-0.25 | >0.25 |

### Additional Metrics

| Metric | Target | Acceptable |
|--------|--------|------------|
| **Time to Interactive** | <3.5s | <5.0s |
| **First Contentful Paint** | <1.8s | <3.0s |
| **Speed Index** | <3.4s | <5.8s |
| **Total Blocking Time** | <200ms | <600ms |

### Network Conditions

Test onder verschillende netwerk condities:

| Profile | Download | Upload | Latency |
|---------|----------|--------|---------|
| **Fast 4G** | 4 Mbps | 3 Mbps | 20ms |
| **Slow 4G** | 1.6 Mbps | 750 Kbps | 150ms |
| **3G** | 1.6 Mbps | 750 Kbps | 300ms |
| **Slow 3G** | 400 Kbps | 400 Kbps | 2000ms |

**Chrome DevTools:**
Network tab → Throttling → Select profile

## Accessibility Checklist

### WCAG 2.1 Level AA Compliance

#### Perceivable

- [ ] **1.1.1** Text alternatives voor non-text content
- [ ] **1.3.1** Info and relationships programmatically determined
- [ ] **1.4.3** Contrast minimum 4.5:1 voor normal text
- [ ] **1.4.4** Text resizable tot 200% zonder loss of content
- [ ] **1.4.10** Reflow (no 2D scrolling at 320px width)
- [ ] **1.4.11** Non-text contrast 3:1 voor UI components

#### Operable

- [ ] **2.1.1** Keyboard accessible (all functionality)
- [ ] **2.1.2** No keyboard trap
- [ ] **2.4.1** Bypass blocks (skip links)
- [ ] **2.4.3** Focus order logical
- [ ] **2.4.7** Focus visible
- [ ] **2.5.1** Pointer gestures (alternatives available)
- [ ] **2.5.2** Pointer cancellation (up-event activation)
- [ ] **2.5.3** Label in name (visible label matches accessible name)
- [ ] **2.5.4** Motion actuation (no shake/tilt only)
- [ ] **2.5.5** Target size minimum 44×44 CSS pixels

#### Understandable

- [ ] **3.1.1** Language of page specified
- [ ] **3.2.1** On focus doesn't trigger unexpected changes
- [ ] **3.2.2** On input doesn't trigger unexpected changes
- [ ] **3.3.1** Error identification
- [ ] **3.3.2** Labels or instructions for input
- [ ] **3.3.3** Error suggestions provided

#### Robust

- [ ] **4.1.1** Parsing (valid HTML)
- [ ] **4.1.2** Name, Role, Value voor UI components
- [ ] **4.1.3** Status messages announced

## Test Report Template

```markdown
# Mobile Testing Report
Date: YYYY-MM-DD
Tester: [Name]
Environment: [Production/Staging/Local]

## Device Information
- Device: [Model]
- OS: [Version]
- Browser: [Name + Version]
- Screen Size: [WxH]
- Viewport: [WxH]

## Test Results

### Visual Inspection
- Layout: ✅/❌
- Spacing: ✅/❌
- Typography: ✅/❌
- Images: ✅/❌
- CTAs: ✅/❌
- Notes: [Any issues]

### Interactions
- Touch targets: ✅/❌
- Navigation: ✅/❌
- Forms: ✅/❌
- Gestures: ✅/❌
- Notes: [Any issues]

### Accessibility
- Keyboard nav: ✅/❌
- Screen reader: ✅/❌
- Color contrast: ✅/❌
- Focus indicators: ✅/❌
- Notes: [Any issues]

### Performance
- LCP: [value]s
- FID: [value]ms
- CLS: [value]
- Load time: [value]s
- Notes: [Any issues]

## Issues Found
1. [Issue description]
   - Severity: Critical/High/Medium/Low
   - Steps to reproduce:
   - Expected: [behavior]
   - Actual: [behavior]
   - Screenshot: [if applicable]

## Recommendations
- [Action item 1]
- [Action item 2]

## Overall Status
✅ Pass / ⚠️ Pass with issues / ❌ Fail

---
Next test: [Date]
```

## Continuous Testing Strategy

### Pre-Deployment
1. Run TouchTargetDebug scan
2. Run Lighthouse audit (score >90)
3. Run Axe accessibility scan (0 critical issues)
4. Test on 2-3 real devices
5. Verify Core Web Vitals

### Post-Deployment
1. Real User Monitoring (RUM)
2. Weekly Lighthouse CI runs
3. Monthly device testing
4. Quarterly accessibility audit

### Regression Testing
After elke major change:
1. Re-run automated tests
2. Spot-check critical flows
3. Verify no new accessibility issues
4. Check performance hasn't degraded

## Common Issues & Solutions

### Issue: Touch targets too small
**Solution:** Apply `.tap-target` class (48×48px minimum)

### Issue: Text not readable on mobile
**Solution:** Check font-size, line-height, and contrast

### Issue: Horizontal scrolling
**Solution:** Use `max-w-full` and `overflow-x-hidden`

### Issue: Layout shift on load
**Solution:** Reserve space for images with width/height attributes

### Issue: Slow initial load
**Solution:** Code splitting, lazy loading, image optimization

### Issue: Poor touch response
**Solution:** Remove hover-only interactions, add active states

## Resources

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE](https://wave.webaim.org/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://material.io/design)
- [Web.dev](https://web.dev/)

### Testing Services
- [BrowserStack](https://www.browserstack.com/) - Real device testing
- [LambdaTest](https://www.lambdatest.com/) - Cross-browser testing
- [Sauce Labs](https://saucelabs.com/) - Automated testing

## Summary

Dit testing plan voorziet in:
- ✅ Comprehensive device coverage
- ✅ Accessibility compliance verification
- ✅ Performance benchmarking
- ✅ Automated and manual testing procedures
- ✅ Clear success criteria
- ✅ Ongoing monitoring strategy

Regular testing volgens deze richtlijnen garandeert een high-quality mobile experience voor alle users.

