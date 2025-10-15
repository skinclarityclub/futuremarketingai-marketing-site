# String Extraction Implementation Guide

**Task:** 14.17 - Extract All Hardcoded Strings  
**Project:** FutureMarketingAI Demo  
**Date:** 2025-10-06  
**Status:** 🚧 In Progress

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Implementation Strategy](#implementation-strategy)
3. [Component Priority List](#component-priority-list)
4. [Before & After Examples](#before--after-examples)
5. [Step-by-Step Process](#step-by-step-process)
6. [Testing Checklist](#testing-checklist)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### Scope

**Total Estimated Strings:** 500+ hardcoded strings across the application

**Breakdown:**

- Hero page: ~150 strings
- Calculator page: ~50 strings
- Explorer page: ~100 strings
- Dashboard page: ~60 strings
- Navigation: ~40 strings
- Common components: ~80 strings
- Forms & Errors: ~30 strings

### Goals

- ✅ 100% of UI text uses translation keys
- ✅ No hardcoded strings remain
- ✅ All text is translatable to Dutch and Spanish
- ✅ Type-safe translation key usage
- ✅ Maintain existing functionality

---

## 📊 Implementation Strategy

### Phase 1: High-Priority Pages (Week 1)

**Priority 1 - Hero Page:**

- Main headline and subheadline
- CTAs (primary, secondary)
- Stats section
- Case studies (3 complete case studies)
- Trust indicators
- Aggregate metrics

**Priority 2 - Navigation:**

- Main nav items
- Descriptions
- Mobile nav
- Footer sections

### Phase 2: Feature Pages (Week 2)

**Priority 3 - Calculator Page:**

- Page title and instructions
- Input labels, placeholders, tooltips
- Results sections
- Pain points
- CTAs

**Priority 4 - Explorer Page:**

- Page intro
- 9 module descriptions
- Features lists
- Modal content

**Priority 5 - Dashboard Page:**

- Welcome message
- Widget titles and descriptions
- Filters
- Notifications

### Phase 3: Components (Week 3)

**Priority 6 - Common Components:**

- Buttons
- CTAs (StrategicCTA)
- Modals
- Loading states

**Priority 7 - Forms & Errors:**

- Form labels
- Placeholders
- Validation messages
- Error messages
- Success messages

---

## 🔄 Before & After Examples

### Example 1: Hero Page - Main Headline

**BEFORE:**

```tsx
// src/pages/Hero.tsx
<h1 className="text-5xl font-bold">
  Automate Your Multi-Platform Marketing
</h1>
<p className="text-xl text-white/80">
  From 40 to 160 posts per month. Automated content creation across all platforms with AI agents.
</p>
```

**AFTER:**

```tsx
// src/pages/Hero.tsx
import { useTranslation } from 'react-i18next'

function Hero() {
  const { t } = useTranslation('hero')

  return (
    <>
      <h1 className="text-5xl font-bold">{t('main_headline')}</h1>
      <p className="text-xl text-white/80">{t('subheadline')}</p>
    </>
  )
}
```

**Translation File:**

```json
// public/locales/en/hero.json
{
  "main_headline": "Automate Your Multi-Platform Marketing",
  "subheadline": "From 40 to 160 posts per month. Automated content creation across all platforms with AI agents."
}
```

---

### Example 2: Calculator - Input Fields

**BEFORE:**

```tsx
<label>Team Size</label>
<input
  placeholder="Number of people"
  type="number"
/>
<span className="tooltip">
  How many people work on content creation in your marketing team?
</span>
```

**AFTER:**

```tsx
import { useTranslation } from 'react-i18next'

function Calculator() {
  const { t } = useTranslation('calculator')

  return (
    <>
      <label>{t('inputs.team_size.label')}</label>
      <input placeholder={t('inputs.team_size.placeholder')} type="number" />
      <span className="tooltip">{t('inputs.team_size.tooltip')}</span>
    </>
  )
}
```

**Translation File:**

```json
// public/locales/en/calculator.json
{
  "inputs": {
    "team_size": {
      "label": "Team Size",
      "placeholder": "Number of people",
      "tooltip": "How many people work on content creation in your marketing team?"
    }
  }
}
```

---

### Example 3: Buttons with Dynamic CTAs

**BEFORE:**

```tsx
<button className="btn-primary">
  Explore Platform →
</button>
<button className="btn-secondary">
  Calculate ROI
</button>
```

**AFTER:**

```tsx
import { useTranslation } from 'react-i18next'

function CTAButtons() {
  const { t } = useTranslation('common')

  return (
    <>
      <button className="btn-primary">{t('buttons.explore')} →</button>
      <button className="btn-secondary">{t('buttons.calculate')}</button>
    </>
  )
}
```

**Translation File:**

```json
// public/locales/en/common.json
{
  "buttons": {
    "explore": "Explore Platform",
    "calculate": "Calculate ROI"
  }
}
```

---

### Example 4: Interpolation with Dynamic Values

**BEFORE:**

```tsx
<p>Welcome back, {userName}!</p>
<p>{postCount} posts scheduled for this week</p>
```

**AFTER:**

```tsx
import { useTranslation } from 'react-i18next'

function Dashboard() {
  const { t } = useTranslation('dashboard')

  return (
    <>
      <p>{t('welcome', { name: userName })}</p>
      <p>{t('widgets.tasks.pending', { count: postCount })}</p>
    </>
  )
}
```

**Translation File:**

```json
// public/locales/en/dashboard.json
{
  "welcome": "Welcome back, {{name}}!",
  "widgets": {
    "tasks": {
      "pending": "{{count}} posts scheduled for this week"
    }
  }
}
```

---

### Example 5: Lists/Arrays

**BEFORE:**

```tsx
const features = [
  'Real-time trend analysis',
  'Competitor monitoring',
  'Audience insights',
  'Content gap analysis',
]

return (
  <ul>
    {features.map((feature, i) => (
      <li key={i}>{feature}</li>
    ))}
  </ul>
)
```

**AFTER:**

```tsx
import { useTranslation } from 'react-i18next'

function ModuleFeatures() {
  const { t } = useTranslation('explorer')
  const features = t('modules.research.features', { returnObjects: true })

  return (
    <ul>
      {features.map((feature, i) => (
        <li key={i}>{feature}</li>
      ))}
    </ul>
  )
}
```

**Translation File:**

```json
// public/locales/en/explorer.json
{
  "modules": {
    "research": {
      "features": [
        "Real-time trend analysis",
        "Competitor monitoring",
        "Audience insights",
        "Content gap analysis"
      ]
    }
  }
}
```

---

## 📝 Step-by-Step Process

### Step 1: Component Analysis

1. Open component file
2. Identify all hardcoded strings
3. Note which namespace each string belongs to
4. Check if translation key already exists

### Step 2: Import useTranslation

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation('namespace')

  // Component code...
}
```

**Multiple Namespaces:**

```tsx
const { t } = useTranslation(['hero', 'common'])

// Usage:
<h1>{t('hero:main_headline')}</h1>
<button>{t('common:buttons.explore')}</button>
```

### Step 3: Replace Strings

**Simple Text:**

```tsx
// Before
<h1>Page Title</h1>

// After
<h1>{t('page_title')}</h1>
```

**Text with Variables:**

```tsx
// Before
<p>Welcome back, {userName}!</p>

// After
<p>{t('welcome', { name: userName })}</p>
```

**Attributes:**

```tsx
// Before
<button aria-label="Close menu">X</button>

// After
<button aria-label={t('close_menu')}>X</button>
```

**Placeholders:**

```tsx
// Before
<input placeholder="Enter your email" />

// After
<input placeholder={t('placeholders.email')} />
```

### Step 4: Verify Translation File

Ensure the key exists in the translation file:

```json
// public/locales/en/[namespace].json
{
  "page_title": "Page Title",
  "welcome": "Welcome back, {{name}}!",
  "close_menu": "Close menu",
  "placeholders": {
    "email": "Enter your email"
  }
}
```

### Step 5: Test

1. Save file
2. Reload browser
3. Verify text displays correctly
4. Check browser console for warnings
5. Test language switching

---

## ✅ Component Priority List

### Phase 1: Critical Pages (Week 1)

- [ ] **Hero Page** (`src/pages/Hero.tsx`)
  - [ ] Main headline
  - [ ] Subheadline
  - [ ] CTAs (primary, secondary)
  - [ ] Stats section (4 stats)
  - [ ] Case studies (3 full stories)
  - [ ] Trust indicators (4 badges)
  - [ ] Aggregate metrics (4 metrics)
  - **Estimated:** 150+ strings
  - **Priority:** 🔴 Critical

- [ ] **FloatingNav** (`src/components/common/FloatingNav.tsx`)
  - [ ] Nav items (5 items)
  - [ ] Descriptions (5 descriptions)
  - [ ] Mobile variants (5 short versions)
  - **Estimated:** 40+ strings
  - **Priority:** 🔴 Critical

### Phase 2: Feature Pages (Week 2)

- [ ] **Calculator** (`src/pages/Calculator.tsx`)
  - [ ] Page title, subtitle, instructions
  - [ ] Input fields (5 fields with labels/placeholders/tooltips)
  - [ ] Results sections (current/automation)
  - [ ] Pain points (4 points)
  - [ ] CTAs (3 buttons)
  - **Estimated:** 50+ strings
  - **Priority:** 🟠 High

- [ ] **Explorer** (`src/pages/Explorer.tsx`)
  - [ ] Page intro
  - [ ] Module cards (9 modules × 3 text fields = 27)
  - [ ] Module modal content (9 × 6 fields = 54)
  - [ ] Features lists (9 × 4 items = 36)
  - **Estimated:** 100+ strings
  - **Priority:** 🟠 High

- [ ] **Dashboard** (`src/pages/Dashboard.tsx`)
  - [ ] Welcome message
  - [ ] Widget titles (6 widgets)
  - [ ] Widget descriptions
  - [ ] Filters (4 options)
  - [ ] Notifications
  - **Estimated:** 60+ strings
  - **Priority:** 🟠 High

### Phase 3: Components (Week 3)

- [ ] **StrategicCTA** (`src/components/common/StrategicCTA.tsx`)
  - [ ] CTA titles
  - [ ] CTA descriptions
  - [ ] Button text
  - **Estimated:** 20+ strings
  - **Priority:** 🟡 Medium

- [ ] **Button** (`src/components/common/Button.tsx`)
  - [ ] Shared button text (if any)
  - **Estimated:** 5+ strings
  - **Priority:** 🟡 Medium

- [ ] **Modals** (Various modal components)
  - [ ] CalendlyModal
  - [ ] IndustrySelector
  - [ ] ProgressiveProfilingPrompt
  - [ ] Modal
  - **Estimated:** 30+ strings
  - **Priority:** 🟡 Medium

- [ ] **Form Components**
  - [ ] Labels, placeholders, helpers
  - [ ] Validation messages
  - [ ] Success messages
  - **Estimated:** 30+ strings
  - **Priority:** 🟡 Medium

### Phase 4: Supporting (Week 4)

- [ ] **Error Handling**
  - [ ] Error boundaries
  - [ ] Network errors
  - [ ] Validation errors
  - **Estimated:** 15+ strings
  - **Priority:** 🟢 Low

- [ ] **Loading States**
  - [ ] Loading messages
  - [ ] Progress indicators
  - **Estimated:** 5+ strings
  - **Priority:** 🟢 Low

---

## 🧪 Testing Checklist

### Per Component

- [ ] Component imports `useTranslation`
- [ ] All visible text uses translation keys
- [ ] No hardcoded strings remain
- [ ] Translation keys exist in translation file
- [ ] Text displays correctly in browser
- [ ] No console warnings
- [ ] TypeScript compiles without errors

### Full Application

- [ ] All pages display correctly
- [ ] Language switcher works (en/nl/es)
- [ ] All translations load
- [ ] No missing keys warnings in console
- [ ] Interpolation works (dynamic values)
- [ ] Pluralization works (count-based text)
- [ ] Arrays render correctly
- [ ] Mobile responsive text

### Automated Checks

Run this script to find remaining hardcoded strings:

```bash
# Search for hardcoded text in JSX
grep -r ">[A-Z][a-zA-Z\s]*<" src/

# Search for hardcoded placeholders
grep -r 'placeholder="' src/

# Search for hardcoded aria-labels
grep -r 'aria-label="' src/

# Search for hardcoded title attributes
grep -r 'title="' src/
```

---

## 🔍 Common Patterns

### Pattern 1: Simple Component

```tsx
import { useTranslation } from 'react-i18next'

function PageTitle() {
  const { t } = useTranslation('calculator')

  return <h1>{t('page_title')}</h1>
}
```

### Pattern 2: Component with Props

```tsx
interface Props {
  userName: string
}

function Welcome({ userName }: Props) {
  const { t } = useTranslation('dashboard')

  return <h2>{t('welcome', { name: userName })}</h2>
}
```

### Pattern 3: List Rendering

```tsx
function FeatureList() {
  const { t } = useTranslation('explorer')
  const features = t('modules.research.features', { returnObjects: true })

  return (
    <ul>
      {features.map((feature, i) => (
        <li key={i}>{feature}</li>
      ))}
    </ul>
  )
}
```

### Pattern 4: Conditional Text

```tsx
function StatusMessage({ status }: { status: 'online' | 'offline' }) {
  const { t } = useTranslation('dashboard')

  return <p>{status === 'online' ? t('status.online') : t('status.offline')}</p>
}
```

### Pattern 5: Formatted Values

```tsx
function PriceDisplay({ amount }: { amount: number }) {
  const { t } = useTranslation()

  return <span>{t('{{value, currency}}', { value: amount })}</span>
}
```

---

## ⚠️ Troubleshooting

### Issue 1: Translation Key Not Found

**Symptom:** Text shows as `namespace:key` instead of actual text

**Solutions:**

1. Check translation key exists in `public/locales/en/[namespace].json`
2. Verify namespace is correct in `useTranslation('[namespace]')`
3. Check for typos in key path
4. Restart dev server to reload translations

### Issue 2: Interpolation Not Working

**Symptom:** Text shows `{{variable}}` instead of value

**Solutions:**

1. Ensure variable is passed: `t('key', { variable: value })`
2. Check translation file uses correct syntax: `"key": "Text {{variable}}"`
3. Verify variable name matches in code and translation

### Issue 3: Arrays Not Rendering

**Symptom:** Array shows as `[object Object]`

**Solutions:**

1. Add `returnObjects: true`: `t('key', { returnObjects: true })`
2. Ensure translation file has array structure: `"key": ["item1", "item2"]`
3. Map over returned array properly

### Issue 4: TypeScript Errors

**Symptom:** TypeScript complains about translation keys

**Solutions:**

1. Ensure `src/i18n/types.ts` is up to date
2. Restart TypeScript server in VS Code
3. Add namespace to types file if new

### Issue 5: Translations Not Updating

**Symptom:** Changes to translation files don't appear

**Solutions:**

1. Clear browser cache
2. Restart dev server
3. Hard reload browser (Ctrl+Shift+R)
4. Check if correct namespace is loaded

---

## 📊 Progress Tracking

### Completion Checklist

**Hero Page:**

- [ ] Hero.tsx fully translated
- [ ] All Dutch translations added
- [ ] All Spanish translations added
- [ ] Tested language switching
- [ ] No console warnings

**Calculator Page:**

- [ ] Calculator.tsx fully translated
- [ ] All Dutch translations added
- [ ] All Spanish translations added
- [ ] Tested all inputs
- [ ] Results section works

**Explorer Page:**

- [ ] Explorer.tsx fully translated
- [ ] All 9 modules translated
- [ ] Modal content translated
- [ ] Dutch translations complete
- [ ] Spanish translations complete

**Dashboard Page:**

- [ ] Dashboard.tsx fully translated
- [ ] All widgets translated
- [ ] Dutch translations complete
- [ ] Spanish translations complete
- [ ] Dynamic values work

**Navigation:**

- [ ] FloatingNav.tsx translated
- [ ] Footer translated
- [ ] Mobile nav translated
- [ ] All languages complete

**Common Components:**

- [ ] StrategicCTA translated
- [ ] Button translated
- [ ] All modals translated
- [ ] Loading states translated

**Forms & Errors:**

- [ ] All form labels translated
- [ ] All error messages translated
- [ ] All success messages translated
- [ ] Validation messages translated

---

## 🎯 Final Validation

### Before Marking Complete

1. **Automated Scan:**

   ```bash
   # No hardcoded JSX text
   grep -r ">[A-Z][a-zA-Z\s]*<" src/ | wc -l
   # Should return 0 or very few (exclude comments)
   ```

2. **Manual Review:**
   - Open each page in browser
   - Switch between all 3 languages
   - Verify all text updates
   - Check console for warnings

3. **TypeScript Check:**

   ```bash
   npm run type-check
   # Should complete with 0 errors
   ```

4. **Build Test:**

   ```bash
   npm run build
   # Should complete successfully
   ```

5. **Accessibility Check:**
   - All aria-labels translated
   - All title attributes translated
   - Screen reader compatible

---

## 📚 Resources

- **Translation Files:** `public/locales/[lang]/[namespace].json`
- **Key Structure Guide:** `TRANSLATION-KEY-STRUCTURE.md`
- **i18n Config:** `src/i18n/config.ts`
- **Implementation Guide:** `I18N-IMPLEMENTATION-GUIDE.md`
- **react-i18next Docs:** https://react.i18next.com/

---

## 🚀 Deployment Checklist

Before deploying:

- [ ] All strings extracted
- [ ] All namespaces complete
- [ ] English 100% complete
- [ ] Dutch 100% complete
- [ ] Spanish 100% complete
- [ ] No console warnings
- [ ] Build succeeds
- [ ] Types validate
- [ ] Language switcher works
- [ ] SEO tags updated (hreflang)

---

**Last Updated:** 2025-10-06  
**Status:** 🚧 In Progress  
**Completion:** 0% (0/500+ strings extracted)  
**Next Priority:** Hero Page (~150 strings)
