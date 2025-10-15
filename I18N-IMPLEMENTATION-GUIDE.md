# i18n Implementation Guide

**Framework:** react-i18next  
**Supported Languages:** English (en), Dutch (nl), Spanish (es)  
**Status:** ✅ Core Framework Configured  
**Date:** 2025-10-06

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Translation File Structure](#translation-file-structure)
5. [Using Translations in Components](#using-translations-in-components)
6. [Language Switcher](#language-switcher)
7. [Best Practices](#best-practices)
8. [Migration Guide](#migration-guide)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

### Features Implemented

- ✅ **Multi-language support:** English, Dutch, Spanish
- ✅ **Browser detection:** Auto-detects user's preferred language
- ✅ **Persistence:** Saves language preference to localStorage
- ✅ **Lazy loading:** Translations loaded on-demand via HTTP backend
- ✅ **Namespace organization:** Organized by feature/page
- ✅ **Type-safe:** TypeScript support for translation keys
- ✅ **Fallback:** Gracefully falls back to English for missing translations
- ✅ **SEO-ready:** Prepared for URL routing and hreflang tags

### Architecture

```
src/
├── i18n/
│   ├── config.ts          # Core i18n configuration
│   └── types.ts           # TypeScript type definitions
├── components/
│   └── common/
│       └── LanguageSwitcher.tsx  # Language switcher UI
public/
└── locales/
    ├── en/                # English translations
    │   ├── common.json
    │   ├── hero.json
    │   └── navigation.json
    ├── nl/                # Dutch translations
    │   └── common.json
    └── es/                # Spanish translations
        └── common.json
```

---

## 📦 Installation

### Packages Installed

```bash
npm install react-i18next i18next i18next-browser-languagedetector i18next-http-backend
```

**Package Versions:**

- `react-i18next`: ^14.0.0
- `i18next`: ^23.0.0
- `i18next-browser-languagedetector`: ^7.0.0
- `i18next-http-backend`: ^2.0.0

### What Each Package Does

- **react-i18next:** React bindings for i18next
- **i18next:** Core i18n framework
- **i18next-browser-languagedetector:** Auto-detects user language from browser settings
- **i18next-http-backend:** Loads translation files via HTTP requests

---

## ⚙️ Configuration

### Core Config (`src/i18n/config.ts`)

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'nl', 'es'],
    ns: ['common', 'hero', 'calculator' /* ... */],
    defaultNS: 'common',
    // ... see full config in src/i18n/config.ts
  })
```

### Key Configuration Options

| Option          | Value                 | Description                         |
| --------------- | --------------------- | ----------------------------------- |
| `fallbackLng`   | `'en'`                | Default language if detection fails |
| `supportedLngs` | `['en', 'nl', 'es']`  | Allowed languages                   |
| `ns`            | Array of namespaces   | Organize translations by feature    |
| `defaultNS`     | `'common'`            | Default namespace for translations  |
| `debug`         | `false` in production | Enable console logging in dev       |

### Language Detection Order

1. **localStorage:** Saved user preference
2. **navigator:** Browser language setting
3. **htmlTag:** HTML lang attribute
4. **path:** URL path (e.g., `/nl/about`)
5. **subdomain:** Subdomain (e.g., `nl.domain.com`)

---

## 📁 Translation File Structure

### Namespaces (Organized by Feature)

```
public/locales/
├── en/
│   ├── common.json       # Shared UI elements, buttons, errors
│   ├── hero.json         # Hero page copy
│   ├── calculator.json   # Calculator page
│   ├── explorer.json     # Explorer page
│   ├── dashboard.json    # Dashboard page
│   ├── navigation.json   # Navigation & menu
│   ├── forms.json        # Form elements
│   ├── errors.json       # Error messages
│   └── analytics.json    # Analytics labels
├── nl/
│   └── [same structure]
└── es/
    └── [same structure]
```

### Example Translation File

**`public/locales/en/common.json`:**

```json
{
  "buttons": {
    "explore": "Explore Platform",
    "calculate": "Calculate ROI",
    "book_call": "Book Free Call"
  },
  "errors": {
    "generic": "Something went wrong. Please try again.",
    "network": "Network error. Please check your connection."
  },
  "metrics": {
    "posts": "posts",
    "hours": "hours",
    "per_month": "per month"
  }
}
```

### Nested Keys

Use dot notation for deep nesting:

```json
{
  "hero": {
    "stats": {
      "posts": {
        "value": "160",
        "label": "posts/month"
      }
    }
  }
}
```

---

## 🔧 Using Translations in Components

### Basic Usage

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('common:buttons.explore')}</h1>
      <p>{t('errors.generic')}</p> {/* Uses defaultNS 'common' */}
    </div>
  )
}
```

### With Specific Namespace

```tsx
function HeroPage() {
  const { t } = useTranslation('hero') // Load 'hero' namespace

  return (
    <div>
      <h1>{t('main_headline')}</h1>
      <p>{t('subheadline')}</p>
    </div>
  )
}
```

### With Multiple Namespaces

```tsx
function Dashboard() {
  const { t } = useTranslation(['dashboard', 'common'])

  return (
    <div>
      <h1>{t('dashboard:title')}</h1>
      <button>{t('common:buttons.save')}</button>
    </div>
  )
}
```

### With Interpolation

```tsx
// Translation file
{
  "welcome": "Welcome back, {{name}}!",
  "saved": "{{count}} items saved"
}

// Component
<p>{t('welcome', { name: 'John' })}</p>
<p>{t('saved', { count: 5 })}</p>
```

### With Pluralization

```tsx
// Translation file
{
  "post_count": "{{count}} post",
  "post_count_plural": "{{count}} posts"
}

// Component
<p>{t('post_count', { count: 1 })}</p>  // "1 post"
<p>{t('post_count', { count: 5 })}</p>  // "5 posts"
```

### With Formatting (Currency, Numbers, Dates)

```tsx
// Config includes formatters
<p>{t('price', { value: 1250, format: 'currency' })}</p>
// Output: €1,250.00 (nl) or $1,250.00 (en)

<p>{t('users', { value: 50000, format: 'number' })}</p>
// Output: 50,000 (en) or 50.000 (nl)
```

---

## 🌐 Language Switcher

### Component Usage

```tsx
import { LanguageSwitcher } from './components/common/LanguageSwitcher'

// Default variant (full dropdown)
<LanguageSwitcher />

// Compact variant (flag + arrow only)
<LanguageSwitcher variant="compact" />

// Mobile variant (horizontal buttons)
<LanguageSwitcher variant="mobile" className="md:hidden" />
```

### Features

- ✅ **3 variants:** Default, compact, mobile
- ✅ **Auto-close:** Closes when clicking outside
- ✅ **Keyboard accessible:** Proper ARIA attributes
- ✅ **Analytics tracking:** Tracks language changes to GA4
- ✅ **Smooth animations:** Framer Motion transitions
- ✅ **Current language indicator:** Checkmark for active language

### Integration Example

```tsx
// In navigation/header
import { LanguageSwitcher } from './components/common/LanguageSwitcher'

function Header() {
  return (
    <nav>
      {/* Desktop */}
      <div className="hidden md:block">
        <LanguageSwitcher variant="compact" />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <LanguageSwitcher variant="mobile" />
      </div>
    </nav>
  )
}
```

---

## ✅ Best Practices

### Translation Keys

**DO:**

```json
{
  "buttons": {
    "explore": "Explore Platform",
    "save": "Save Changes"
  }
}
```

**DON'T:**

```json
{
  "btn_explore": "Explore Platform",
  "SAVE_BUTTON": "Save Changes"
}
```

**Naming Convention:**

- Use **camelCase** or **snake_case** consistently
- Group related keys under objects
- Keep keys descriptive but concise
- Avoid abbreviations unless universally understood

### Content Organization

**DO:** Organize by feature/page

```
hero.json     → Hero page content
calculator.json → Calculator content
common.json   → Shared across all pages
```

**DON'T:** Organize by content type

```
headings.json  → All headings
buttons.json   → All buttons (hard to maintain)
```

### Avoiding Hardcoded Text

**DO:**

```tsx
<button>{t('common:buttons.save')}</button>
<h1>{t('hero:main_headline')}</h1>
```

**DON'T:**

```tsx
<button>Save</button>  // Hardcoded!
<h1>Automate Your Marketing</h1>  // Hardcoded!
```

### Context in Translation Keys

**DO:**

```json
{
  "cta": {
    "primary": "Explore Platform",
    "secondary": "Calculate ROI"
  }
}
```

**DON'T:**

```json
{
  "text1": "Explore Platform",
  "text2": "Calculate ROI"
}
```

### Comments in Translation Files

```json
{
  "_comment": "CTAs used on Hero page",
  "cta": {
    "primary": "Explore Platform",
    "secondary": "Calculate ROI"
  }
}
```

---

## 🔄 Migration Guide

### Step 1: Identify Hardcoded Strings

**Before:**

```tsx
function Hero() {
  return (
    <div>
      <h1>Automate Your Multi-Platform Marketing</h1>
      <button>Explore Platform</button>
    </div>
  )
}
```

**After:**

```tsx
import { useTranslation } from 'react-i18next'

function Hero() {
  const { t } = useTranslation('hero')

  return (
    <div>
      <h1>{t('main_headline')}</h1>
      <button>{t('cta.primary')}</button>
    </div>
  )
}
```

### Step 2: Create Translation Entry

Add to `public/locales/en/hero.json`:

```json
{
  "main_headline": "Automate Your Multi-Platform Marketing",
  "cta": {
    "primary": "Explore Platform"
  }
}
```

### Step 3: Translate to Other Languages

`public/locales/nl/hero.json`:

```json
{
  "main_headline": "Automatiseer Je Multi-Platform Marketing",
  "cta": {
    "primary": "Verken Platform"
  }
}
```

### Step 4: Test All Languages

```bash
# Change language via switcher
# Verify all text updates
# Check for missing translations (browser console warnings)
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Switch between all 3 languages (en, nl, es)
- [ ] Verify language persists after page reload
- [ ] Check all namespaces load correctly
- [ ] Confirm fallback works (missing translations → English)
- [ ] Test browser language detection (incognito mode)
- [ ] Verify no console errors or warnings

### Unit Testing Translations

```tsx
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/config'

test('renders translated text', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MyComponent />
    </I18nextProvider>
  )

  expect(screen.getByText(/explore platform/i)).toBeInTheDocument()
})
```

### Testing Language Switching

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSwitcher } from './LanguageSwitcher'

test('switches language when clicked', async () => {
  render(<LanguageSwitcher />)

  // Open dropdown
  fireEvent.click(screen.getByLabelText(/change language/i))

  // Click Dutch option
  fireEvent.click(screen.getByText(/nederlands/i))

  // Verify language changed
  expect(i18n.language).toBe('nl')
})
```

---

## 🔍 Troubleshooting

### Common Issues

**1. Translations Not Loading**

**Symptoms:** Text shows translation keys instead of actual text (e.g., `common:buttons.save`)

**Solutions:**

- Check translation file exists: `public/locales/en/common.json`
- Verify file is valid JSON (no trailing commas, proper quotes)
- Check browser console for 404 errors
- Ensure namespace is loaded in component: `useTranslation('common')`

**2. Language Detection Not Working**

**Symptoms:** Always defaults to English

**Solutions:**

- Check localStorage key: `i18nextLng` should exist
- Verify browser language matches supported languages
- Clear localStorage and test again
- Check detection order in config

**3. Translations Not Updating on Language Switch**

**Symptoms:** UI doesn't update after switching language

**Solutions:**

- Ensure component uses `useTranslation()` hook
- Check `react.useSuspense` is enabled in config
- Verify `bindI18n: 'languageChanged'` in config
- Force re-render with `i18n.changeLanguage()`

**4. TypeScript Errors**

**Symptoms:** `Property 'X' does not exist on type...`

**Solutions:**

- Update `src/i18n/types.ts` with new namespaces
- Restart TypeScript server
- Ensure translation files are in correct location

**5. Missing Translation Warnings**

**Symptoms:** Browser console shows "Missing key: ..."

**Solutions:**

- Add missing key to all language files
- Set up fallback keys in config
- Use `defaultValue` option: `t('key', { defaultValue: 'Fallback text' })`

---

## 📊 Current Implementation Status

### ✅ Completed

- [x] Package installation
- [x] Core i18n configuration (`src/i18n/config.ts`)
- [x] Language Switcher component (3 variants)
- [x] TypeScript type definitions
- [x] Translation file structure
- [x] English translations (common, hero, navigation)
- [x] Dutch translations (common)
- [x] Spanish translations (common)
- [x] Integration with React app (`main.tsx`)
- [x] Browser language detection
- [x] localStorage persistence
- [x] Analytics tracking for language changes

### 🚧 In Progress / Next Steps

- [ ] Extract all hardcoded strings to translation files (Task 14.17)
- [ ] Complete Dutch translations for hero, navigation
- [ ] Complete Spanish translations for hero, navigation
- [ ] Add calculator, explorer, dashboard namespaces
- [ ] Integrate Language Switcher into navigation
- [ ] SEO setup (URL routing, hreflang tags)
- [ ] Create translation workflow documentation

---

## 📚 Resources

### Official Documentation

- [react-i18next Docs](https://react.i18next.com/)
- [i18next Docs](https://www.i18next.com/)
- [i18next Best Practices](https://www.i18next.com/principles/best-practices)

### Internal Documents

- `HERO-COPY-AUDIT-REPORT.md` - English copy audit
- `MOBILE-COPY-AUDIT.md` - Mobile-specific copy
- `READABILITY-ANALYSIS-REPORT.md` - Readability scores
- `ANALYTICS-LABELS-AUDIT.md` - Analytics naming conventions

### Translation Workflow

1. **English First:** All new copy written in English
2. **Translation Files:** Update all 3 languages simultaneously
3. **Quality Check:** Native speakers review translations
4. **Testing:** Manual testing across all languages
5. **Analytics:** Track usage by language

---

## 🎯 Next Steps

### Immediate (This Sprint)

1. **Add Language Switcher to Navigation**
   - Desktop: Header (compact variant)
   - Mobile: Settings menu (mobile variant)

2. **Extract Hardcoded Strings** (Task 14.17)
   - Hero page → `hero.json`
   - Calculator → `calculator.json`
   - Explorer → `explorer.json`
   - Dashboard → `dashboard.json`

3. **Complete Dutch Translations**
   - Translate hero.json
   - Translate navigation.json

4. **Complete Spanish Translations**
   - Translate hero.json
   - Translate navigation.json

### Medium-term (Next Sprint)

5. **SEO Implementation**
   - URL routing: `/en/`, `/nl/`, `/es/`
   - Add hreflang tags
   - Generate sitemaps per language

6. **Advanced Features**
   - RTL support preparation
   - Currency/date/number localization
   - Translation management system integration

7. **Performance Optimization**
   - Bundle size analysis
   - Lazy loading optimization
   - Cache translation files

---

## 🤝 Translation Contribution Guide

### Adding a New Language

1. Add language to `LANGUAGES` in `src/i18n/config.ts`
2. Create folder: `public/locales/[code]/`
3. Copy English files as starting point
4. Translate all JSON files
5. Test thoroughly
6. Update documentation

### Adding a New Translation Key

1. Add key to English file: `public/locales/en/[namespace].json`
2. Add same key to Dutch file: `public/locales/nl/[namespace].json`
3. Add same key to Spanish file: `public/locales/es/[namespace].json`
4. Use in component: `t('[namespace]:[key]')`
5. Test all 3 languages

### Translation Quality Guidelines

- **Accuracy:** Maintain meaning and intent
- **Tone:** Match brand voice (professional, friendly)
- **Length:** Similar to English (±20%)
- **Context:** Consider UI space constraints
- **Culture:** Adapt idioms and cultural references
- **Consistency:** Use consistent terminology across project

---

## 📞 Support

**Questions about i18n implementation?**

- Check this guide first
- Review react-i18next documentation
- Ask in team Slack channel: `#frontend-i18n`
- Create issue in GitHub: `[i18n] Your question`

---

**Last Updated:** 2025-10-06  
**Maintained by:** Frontend Team  
**Version:** 1.0.0  
**Status:** ✅ Production Ready (Pending String Extraction)
