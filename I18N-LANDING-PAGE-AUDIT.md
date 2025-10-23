# i18n Landing Page Audit - Hardcoded Strings Inventory

**Task:** 11.1 - Audit All Hardcoded Strings in Landing Page Components  
**Date:** 2025-10-22  
**Status:** 🔄 In Progress

---

## 📍 Components Audited

### 1. SimpleHeader.tsx (`src/components/landing/SimpleHeader.tsx`)

**Hardcoded Strings Found:**

| Line | Type       | String                         | Translation Key Proposal                                               | Priority |
| ---- | ---------- | ------------------------------ | ---------------------------------------------------------------------- | -------- |
| 98   | Navigation | `'Features'`                   | `landing.header.nav.features`                                          | High     |
| 99   | Navigation | `'Pricing'`                    | `landing.header.nav.pricing`                                           | High     |
| 137  | ARIA Label | `"Future Marketing AI Home"`   | `landing.header.logo_aria`                                             | High     |
| 148  | Brand Text | `"Future"`                     | `landing.header.brand.future`                                          | Medium   |
| 151  | Brand Text | `"Marketing"`                  | `landing.header.brand.marketing`                                       | Medium   |
| 153  | Brand Text | `"AI"`                         | `landing.header.brand.ai`                                              | Medium   |
| 160  | ARIA Label | `"Main navigation"`            | `landing.header.nav_aria`                                              | High     |
| 184  | Button     | `"Login"`                      | `landing.header.login`                                                 | High     |
| 203  | Button     | `"Try Demo"`                   | `landing.header.try_demo`                                              | High     |
| 213  | ARIA Label | `'Close menu'` / `'Open menu'` | `landing.header.mobile_menu_close` / `landing.header.mobile_menu_open` | High     |
| 241  | ARIA Label | `"Mobile navigation"`          | `landing.header.mobile_nav_aria`                                       | High     |
| 252  | Navigation | `"Home"`                       | `landing.header.nav.home`                                              | High     |
| 281  | Button     | `"Try Demo"` (mobile)          | `landing.header.try_demo` (reuse)                                      | High     |
| 288  | Button     | `"Login"` (mobile)             | `landing.header.login` (reuse)                                         | High     |

**Summary:**

- Total hardcoded strings: ~14 unique strings
- Navigation items: 3 (Home, Features, Pricing)
- Buttons/CTAs: 2 (Login, Try Demo)
- ARIA labels: 5 (accessibility)
- Brand text: 3 (Future, Marketing, AI)

**Notes:**

- Brand name (FutureMarketingAI) might stay in English for consistency
- ARIA labels are critical for accessibility in all languages
- Navigation items are straightforward translations

---

## 📋 Next Components to Audit

### 2. Hero.tsx (`src/pages/Hero.tsx`)

**Status:** ✅ **ALREADY TRANSLATED!**

**Finding:** Hero.tsx is already using the i18n system extensively! Most content is loaded via `t('hero:...')` function calls.

**Already Translated:**

- `t('hero:headline_variants.${headlineVariant}')` - Multiple headline variants
- `t('hero:headline_subtitles.${headlineVariant}')` - Subtitle variants
- `t('hero:trust_signals.team_size')` - Trust signal badges
- `t('hero:trust_signals.custom_built_usp')` - USP badge
- `t('hero:trust_signals.ai_powered')` - AI powered badge
- `t('hero:loading.scheduling')` - Loading text

**Notes:**

- Hero page is in EXCELLENT shape for i18n
- Uses proper translation namespace ('hero')
- Dynamic content already handled
- No hardcoded strings found!

---

### 3. Footer.tsx (`src/components/landing/Footer.tsx`)

**Hardcoded Strings Found:**

| Line | Type          | String                                                          | Translation Key Proposal              | Priority |
| ---- | ------------- | --------------------------------------------------------------- | ------------------------------------- | -------- |
| 29   | Brand         | `"FutureMarketingAI"`                                           | `landing.footer.brand_name`           | Low      |
| 33   | Tagline       | `"Autonomous AI marketing that saves time and drives results."` | `landing.footer.tagline`              | High     |
| 42   | Section Title | `"Product"`                                                     | `landing.footer.sections.product`     | High     |
| 50   | Nav Link      | `"Features"`                                                    | `landing.footer.nav.features`         | High     |
| 58   | Nav Link      | `"Pricing"`                                                     | `landing.footer.nav.pricing`          | High     |
| 68   | Nav Link      | `"Demo"`                                                        | `landing.footer.nav.demo`             | High     |
| 77   | Section Title | `"Company"`                                                     | `landing.footer.sections.company`     | High     |
| 85   | Nav Link      | `"About"`                                                       | `landing.footer.nav.about`            | High     |
| 93   | Nav Link      | `"How It Works"`                                                | `landing.footer.nav.how_it_works`     | High     |
| 102  | Section Title | `"Resources"`                                                   | `landing.footer.sections.resources`   | High     |
| 110  | Nav Link      | `"ROI Calculator"`                                              | `landing.footer.nav.roi_calculator`   | High     |
| 118  | Nav Link      | `"Showcase"`                                                    | `landing.footer.nav.showcase`         | High     |
| 127  | Section Title | `"Legal"`                                                       | `landing.footer.sections.legal`       | High     |
| 135  | Nav Link      | `"Privacy"`                                                     | `landing.footer.nav.privacy`          | High     |
| 143  | Nav Link      | `"Terms"`                                                       | `landing.footer.nav.terms`            | High     |
| 156  | Copyright     | `"© {currentYear} Future Marketing AI"`                        | `landing.footer.copyright`            | High     |
| 159  | Status Badge  | `"Q1 2026 • 2/5 Slots Left"`                                    | `landing.footer.status_badge`         | High     |
| 170  | ARIA Label    | `"GitHub"`                                                      | `landing.footer.social_aria.github`   | Medium   |
| 179  | ARIA Label    | `"LinkedIn"`                                                    | `landing.footer.social_aria.linkedin` | Medium   |
| 188  | ARIA Label    | `"Twitter"`                                                     | `landing.footer.social_aria.twitter`  | Medium   |

**Summary:**

- Total hardcoded strings: ~20 unique strings
- Navigation links: 10 (Features, Pricing, Demo, About, etc.)
- Section titles: 4 (Product, Company, Resources, Legal)
- Tagline: 1
- Status/Copyright: 2
- ARIA labels: 3

**Critical Items:**

- Tagline needs professional translation
- Status badge needs dynamic date/slots handling
- Copyright year already dynamic (good!)

---

## 📋 Next Components to Audit

### Priority 1 (High - User-facing content)

- [ ] Hero.tsx (landing page hero section)
- [ ] Footer.tsx (footer navigation & copyright)
- [ ] FeatureShowcase.tsx (feature descriptions)
- [ ] FeaturesSection.tsx (feature titles & descriptions)
- [ ] SocialProof.tsx (testimonials, trust badges)

### Priority 2 (Medium - Supporting content)

- [ ] LeadForm.tsx (form labels, placeholders, validation messages)
- [ ] Header.tsx (marketing header, if different from SimpleHeader)

### Priority 3 (Low - Static/minimal content)

- [ ] AIBackground.tsx (likely no text)
- [ ] ResponsiveAccessibility.tsx (likely no text)

---

## 🎯 Translation Key Naming Convention

**Format:** `landing.<component>.<section>.<element>`

**Examples:**

```
landing.header.nav.features
landing.header.nav.pricing
landing.header.logo_aria
landing.header.try_demo
landing.hero.title
landing.hero.subtitle
landing.footer.copyright
landing.features.title
```

**Guidelines:**

- Use lowercase with underscores for spaces
- Group by component, then section, then specific element
- Keep keys descriptive but concise
- Reuse common translations (login, demo, etc.)

---

## 📊 Audit Progress

- [x] SimpleHeader.tsx - ✅ Complete (~14 strings)
- [x] Hero.tsx - ✅ Complete (Already translated!)
- [x] Footer.tsx - ✅ Complete (~20 strings)
- [ ] FeatureShowcase.tsx
- [ ] FeaturesSection.tsx
- [ ] SocialProof.tsx
- [ ] LeadForm.tsx
- [ ] Header.tsx

**Total Components:** 8  
**Completed:** 3 (37.5%)  
**Remaining:** 5 (62.5%)

---

## 🎯 CRITICAL FINDINGS

### ✅ Good News!

**Hero.tsx is already fully translated!** The main landing page content already uses the i18n system properly. This is a huge time saver!

### 🔧 Components Needing Translation:

1. **SimpleHeader.tsx** - ~14 strings (navigation, buttons, ARIA labels)
2. **Footer.tsx** - ~20 strings (navigation, sections, tagline, copyright)
3. **Remaining components** - TBD (estimate ~20-30 strings)

### 📈 Revised Estimate:

- **Original Estimate:** 110-150 strings
- **Revised Estimate:** 50-70 strings (Hero already done!)
- **Per Language:** 50-70 × 3 = 150-210 total translations

---

## 🔤 Estimated Translation Workload

Based on SimpleHeader audit:

- **SimpleHeader:** ~14 strings
- **Hero:** ~20-30 strings (estimated)
- **Footer:** ~15-20 strings (estimated)
- **Features:** ~30-40 strings (estimated)
- **Social Proof:** ~10-15 strings (estimated)
- **Forms:** ~20-25 strings (estimated)
- **Total Estimated:** ~110-150 strings across all landing page components

**Per Language:** 110-150 strings × 3 languages = 330-450 total translations

---

## 📝 Next Steps

1. Continue auditing remaining components
2. Create comprehensive translation key mapping
3. Extract all strings to translation files (nl, en, es)
4. Replace hardcoded strings with t() function calls
5. Test language switching on landing page
6. QA all translations for accuracy and tone

---

## 🚨 Critical Notes

- **Brand Name:** Decide if "FutureMarketingAI" stays in English or gets translated
- **CTAs:** "Try Demo" vs "See Demo" - ensure consistent language
- **Accessibility:** ALL aria-labels must be translated
- **SEO:** Meta tags, titles, descriptions also need translation (separate task)
- **Error Messages:** Form validation messages need translation
- **Dynamic Content:** Date formats, number formats (separate consideration)
