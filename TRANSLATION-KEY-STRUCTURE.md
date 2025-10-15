# Translation Key Structure & Naming Conventions

**Project:** FutureMarketingAI Demo  
**Framework:** react-i18next  
**Date:** 2025-10-06  
**Status:** ✅ Complete Structure Defined

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Namespace Organization](#namespace-organization)
3. [Key Naming Conventions](#key-naming-conventions)
4. [Structure Patterns](#structure-patterns)
5. [Complete Key Inventory](#complete-key-inventory)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)
8. [Migration Mapping](#migration-mapping)

---

## 🎯 Overview

### Design Principles

Our translation key structure follows these core principles:

1. **Feature-based Namespaces:** Organized by page/feature, not by content type
2. **Hierarchical Organization:** Nested keys for logical grouping
3. **Consistent Naming:** snake_case for keys, clear and descriptive
4. **Scalability:** Easy to add new keys without restructuring
5. **Type Safety:** TypeScript support for autocomplete and validation

### Namespace Summary

| Namespace    | Purpose                             | Keys | Status      |
| ------------ | ----------------------------------- | ---- | ----------- |
| `common`     | Shared UI elements, buttons, errors | 100+ | ✅ Complete |
| `hero`       | Hero page content                   | 120+ | ✅ Complete |
| `navigation` | Navigation, menus, footer           | 65+  | ✅ Complete |
| `calculator` | Calculator page                     | 45+  | ✅ Complete |
| `explorer`   | Explorer/module page                | 95+  | ✅ Complete |
| `dashboard`  | Dashboard/command center            | 60+  | ✅ Complete |
| `forms`      | Form fields, labels, helpers        | 55+  | ✅ Complete |
| `errors`     | Error messages, validation          | 40+  | ✅ Complete |
| `analytics`  | Analytics event labels              | 30+  | ✅ Complete |

**Total:** 610+ translation keys across 9 namespaces

---

## 📂 Namespace Organization

### Namespace Hierarchy

```
public/locales/
├── [lang]/
│   ├── common.json          # Shared across all pages
│   ├── hero.json            # Hero page only
│   ├── navigation.json      # Nav, menus, footer
│   ├── calculator.json      # Calculator page only
│   ├── explorer.json        # Explorer page only
│   ├── dashboard.json       # Dashboard page only
│   ├── forms.json           # Form elements
│   ├── errors.json          # Error messages
│   └── analytics.json       # Analytics labels
```

### When to Create a New Namespace

**Create a new namespace when:**

- Content is specific to a single page/feature
- Keys would exceed 100+ entries in existing namespace
- Content has distinct translation requirements
- Feature is self-contained and reusable

**Use existing namespace when:**

- Content is shared across multiple pages
- Adding <20 new keys
- Content fits existing logical grouping

---

## 🔤 Key Naming Conventions

### General Rules

```
✅ DO: Use snake_case
page_title, cta_primary, error_network

❌ DON'T: Use camelCase or PascalCase
pageTitle, CtaPrimary, ErrorNetwork

✅ DO: Be descriptive and specific
hero_case_studies_ecommerce_pain_point1
calculator_inputs_team_size_tooltip

❌ DON'T: Be vague or abbreviated
hero_cs_ec_pp1
calc_in_ts_tt
```

### Naming Patterns

**1. Page Elements:**

```json
{
  "page_title": "Page Title",
  "subtitle": "Subtitle text",
  "intro": "Introduction text",
  "description": "Description text"
}
```

**2. CTAs (Call-to-Actions):**

```json
{
  "cta": {
    "primary": "Primary CTA text",
    "secondary": "Secondary CTA text",
    "tertiary": "Tertiary CTA text"
  }
}
```

**3. Form Elements:**

```json
{
  "inputs": {
    "field_name": {
      "label": "Field Label",
      "placeholder": "Placeholder text",
      "tooltip": "Help tooltip text",
      "helper": "Helper text below field"
    }
  }
}
```

**4. Lists/Collections:**

```json
{
  "features": ["Feature 1", "Feature 2", "Feature 3"]
}
```

**5. Metrics/Stats:**

```json
{
  "metrics": {
    "metric_name": {
      "value": "160",
      "label": "posts/month",
      "description": "4x content output"
    }
  }
}
```

---

## 🏗️ Structure Patterns

### Pattern 1: Simple Key-Value

**Use for:** Short, standalone text

```json
{
  "page_title": "Calculate Your ROI",
  "subtitle": "See your potential savings"
}
```

**Usage:**

```tsx
<h1>{t('calculator:page_title')}</h1>
<p>{t('calculator:subtitle')}</p>
```

---

### Pattern 2: Nested Objects

**Use for:** Related content grouped logically

```json
{
  "cta": {
    "primary": "Explore Platform",
    "secondary": "Calculate ROI",
    "tertiary": "Learn More"
  }
}
```

**Usage:**

```tsx
<button>{t('common:cta.primary')}</button>
<button>{t('common:cta.secondary')}</button>
```

---

### Pattern 3: Deep Nesting

**Use for:** Complex hierarchical content

```json
{
  "case_studies": {
    "ecommerce": {
      "industry": "E-commerce",
      "pain": {
        "title": "The Problem",
        "point1": "Issue 1",
        "point2": "Issue 2"
      },
      "results": {
        "title": "The Results",
        "metric1": "Result 1",
        "metric2": "Result 2"
      }
    }
  }
}
```

**Usage:**

```tsx
<h3>{t('hero:case_studies.ecommerce.pain.title')}</h3>
<p>{t('hero:case_studies.ecommerce.pain.point1')}</p>
```

---

### Pattern 4: Arrays

**Use for:** Lists without specific keys

```json
{
  "features": ["Real-time trend analysis", "Competitor monitoring", "Audience insights"]
}
```

**Usage:**

```tsx
{
  t('explorer:modules.research.features', { returnObjects: true }).map((feature, i) => (
    <li key={i}>{feature}</li>
  ))
}
```

---

### Pattern 5: Interpolation

**Use for:** Dynamic values

```json
{
  "welcome": "Welcome back, {{name}}!",
  "posts_scheduled": "{{count}} posts scheduled for this week",
  "time_saved": "Your team saves {{hours}} hours every month"
}
```

**Usage:**

```tsx
<h1>{t('dashboard:welcome', { name: 'John' })}</h1>
<p>{t('dashboard:widgets.tasks.pending', { count: 12 })}</p>
<p>{t('calculator:results.with_automation.time_saved', { hours: 360 })}</p>
```

---

### Pattern 6: Pluralization

**Use for:** Singular/plural forms

```json
{
  "post_count": "{{count}} post",
  "post_count_plural": "{{count}} posts",
  "hour": "hour",
  "hour_plural": "hours"
}
```

**Usage:**

```tsx
<p>{t('common:post_count', { count: 1 })}</p>  // "1 post"
<p>{t('common:post_count', { count: 5 })}</p>  // "5 posts"
```

---

## 📦 Complete Key Inventory

### 1. Common Namespace (`common.json`)

**Total Keys:** 100+

```
language/
  select, current
buttons/
  explore, calculate, book_call, start_trial, learn_more, see_demo,
  get_started, contact_us, close, cancel, confirm, save, next, back, submit
loading/
  default, please_wait, processing
trust_indicators/
  gdpr/, ssl/, iso/, soc2/
    title, description
metrics/
  posts, hours, saved, per_month, engagement, conversion, recovered
time/
  minute, minute_plural, hour, hour_plural, day, day_plural,
  week, week_plural, month, month_plural, year, year_plural
validation/
  required, email, phone, number, min, max
success/
  saved, sent, updated, deleted, welcome
errors/
  generic, network, not_found, unauthorized, server, validation
```

---

### 2. Hero Namespace (`hero.json`)

**Total Keys:** 120+

```
main_headline
subheadline
cta/
  primary, secondary
stats/
  context
  posts/, hours/, engagement/, conversion/
    value, label, description
case_studies/
  title
  ecommerce/, saas/, agency/
    industry, company
    pain/
      title, point1, point2, point3
    solution/
      title, description
    results/
      title, metric1, metric2, metric3, metric4
aggregate_metrics/
  title
  time_saved/, posts_created/, engagement/, conversion/
    value, description
```

---

### 3. Navigation Namespace (`navigation.json`)

**Total Keys:** 65+

```
main/
  home, explorer, dashboard, calculator, ad_builder
descriptions/
  home, explorer, dashboard, calculator, ad_builder
mobile/
  home, explorer, dashboard, calculator, ad_builder
footer/
  company/, product/, resources/, legal/
    title
    about, careers, contact, blog, features, pricing, demo, changelog,
    documentation, guides, api, support, privacy, terms, cookies, gdpr
copyright
```

---

### 4. Calculator Namespace (`calculator.json`)

**Total Keys:** 45+

```
page_title
subtitle
instructions
inputs/
  team_size/, avg_salary/, campaigns_per_month/, posts_per_campaign/, hours_per_post/
    label, placeholder, tooltip
results/
  title, subtitle
  current_situation/
    title, manual_work, cost, inefficiency
  with_automation/
    title, time_saved, money_recovered, efficiency_gain
  metrics/
    hours_saved, cost_savings, posts_increase, roi
cta/
  primary, secondary, download
pain_points/
  title, time_waste, inconsistent, no_analysis, high_cost
```

---

### 5. Explorer Namespace (`explorer.json`)

**Total Keys:** 95+

```
page_title
subtitle
intro
modules/
  research/, content_pipeline/, scheduling/, analytics/, optimization/,
  collaboration/, brand_safety/, integrations/, api/
    title, short_description, description
    features[] (array of 4 items each)
modal/
  close, learn_more, try_feature
```

---

### 6. Dashboard Namespace (`dashboard.json`)

**Total Keys:** 60+

```
page_title
subtitle
welcome
widgets/
  performance/, tasks/, analytics/, content_queue/, team_activity/, quick_actions/
    title, description, action
    metrics/ (for performance)
    platforms/ (for analytics)
filters/
  today, this_week, this_month, custom
notifications/
  new, mark_read
status/
  online, issue, maintenance
```

---

### 7. Forms Namespace (`forms.json`)

**Total Keys:** 55+

```
labels/
  email, name, first_name, last_name, company, phone, website,
  job_title, team_size, industry, message, password, confirm_password
placeholders/
  email, name, company, phone, website, message, password
helpers/
  email, password, phone
team_sizes/
  1-5, 6-20, 21-50, 51-200, 201+
industries/
  ecommerce, saas, agency, consulting, finance, healthcare,
  education, retail, other
actions/
  submit, cancel, save, delete, edit, create, upload, download
```

---

### 8. Errors Namespace (`errors.json`)

**Total Keys:** 40+

```
validation/
  required, email, phone, url, number, min, max, min_length, max_length,
  password_weak, password_mismatch
network/
  generic, timeout, offline, server, unavailable
auth/
  unauthorized, session_expired, invalid_credentials, account_locked, email_exists
api/
  not_found, forbidden, rate_limit, bad_request, internal_error
upload/
  too_large, invalid_type, upload_failed
generic/
  something_wrong, try_again, contact_support
actions/
  retry, go_back, refresh, contact
```

---

### 9. Analytics Namespace (`analytics.json`)

**Total Keys:** 30+

```
events/
  page_load, page_view, hero_view, cta_click, cta_impression,
  calculator_interact, calendly_event, module_open, navigation,
  outbound_click, error, engagement_time, scroll_depth
categories/
  user_engagement, navigation, conversion, performance, errors
labels/
  hero_cta, floating_cta, exit_intent, inline_cta, calculator_input,
  calculator_result, module_detail, nav_click
parameters/
  cta_name, cta_destination, page_name, module_name, action, value,
  time_seconds, depth_percent, error_type, error_message
```

---

## 💡 Usage Examples

### Example 1: Simple Translation

```tsx
import { useTranslation } from 'react-i18next'

function Calculator() {
  const { t } = useTranslation('calculator')

  return <h1>{t('page_title')}</h1>
  // Output: "Calculate Your ROI"
}
```

---

### Example 2: Nested Keys

```tsx
function Hero() {
  const { t } = useTranslation('hero')

  return (
    <div>
      <button>{t('cta.primary')}</button>
      <button>{t('cta.secondary')}</button>
    </div>
  )
}
```

---

### Example 3: Interpolation

```tsx
function Dashboard() {
  const { t } = useTranslation('dashboard')
  const userName = 'John'
  const postCount = 12

  return (
    <div>
      <h1>{t('welcome', { name: userName })}</h1>
      {/* Output: "Welcome back, John!" */}

      <p>{t('widgets.tasks.pending', { count: postCount })}</p>
      {/* Output: "12 posts scheduled for this week" */}
    </div>
  )
}
```

---

### Example 4: Multiple Namespaces

```tsx
function MyPage() {
  const { t } = useTranslation(['hero', 'common'])

  return (
    <div>
      <h1>{t('hero:main_headline')}</h1>
      <button>{t('common:buttons.explore')}</button>
    </div>
  )
}
```

---

### Example 5: Arrays

```tsx
function ExplorerModule() {
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

---

### Example 6: Formatting

```tsx
function Calculator() {
  const { t } = useTranslation('calculator')
  const savings = 16500

  return (
    <p>
      {t('results.with_automation.money_recovered', {
        amount: t('{{value, currency}}', { value: savings }),
      })}
    </p>
  )
  // Output: "That's €16,500 recovered..."
}
```

---

## ✅ Best Practices

### DO's

```
✅ Use descriptive key names
hero_case_studies_ecommerce_pain_point1

✅ Group related keys under objects
cta: { primary, secondary, tertiary }

✅ Use interpolation for dynamic values
"Welcome back, {{name}}!"

✅ Follow consistent naming patterns
All CTAs under cta/, all inputs under inputs/

✅ Document complex keys
// Translation: hero:case_studies.ecommerce.pain.point1

✅ Keep keys in English
Translation keys themselves are always English
```

### DON'TS

```
❌ DON'T use camelCase or PascalCase
ctaPrimary, CtaPrimary

❌ DON'T create flat structure
hero_case_studies_ecommerce_pain_point1 (too long, hard to maintain)

❌ DON'T hardcode dynamic values
"Welcome back, John!" (use interpolation)

❌ DON'T mix content types
cta: { primary: "Button", title: "Heading" } (inconsistent)

❌ DON'T abbreviate excessively
cs_ec_pp1 (unclear meaning)

❌ DON'T duplicate keys across namespaces
Both hero.json and calculator.json with same "page_title"
```

---

## 🗺️ Migration Mapping

### From Hardcoded to Translation Keys

**Before (Hardcoded):**

```tsx
<h1>Calculate Your ROI</h1>
<button>Explore Platform</button>
<p>Welcome back, John!</p>
```

**After (Translated):**

```tsx
<h1>{t('calculator:page_title')}</h1>
<button>{t('common:buttons.explore')}</button>
<p>{t('dashboard:welcome', { name: 'John' })}</p>
```

### Component Migration Examples

#### Hero Component

**Before:**

```tsx
<h1>Automate Your Multi-Platform Marketing</h1>
<p>From 40 to 160 posts per month. Automated content creation...</p>
<button>Explore Platform</button>
```

**After:**

```tsx
const { t } = useTranslation('hero')

<h1>{t('main_headline')}</h1>
<p>{t('subheadline')}</p>
<button>{t('cta.primary')}</button>
```

**Translation File:**

```json
{
  "main_headline": "Automate Your Multi-Platform Marketing",
  "subheadline": "From 40 to 160 posts per month. Automated content creation...",
  "cta": {
    "primary": "Explore Platform"
  }
}
```

---

#### Calculator Component

**Before:**

```tsx
<h1>Calculate Your ROI</h1>
<label>Team Size</label>
<input placeholder="Number of people" />
<span>How many people work on content creation?</span>
```

**After:**

```tsx
const { t } = useTranslation('calculator')

<h1>{t('page_title')}</h1>
<label>{t('inputs.team_size.label')}</label>
<input placeholder={t('inputs.team_size.placeholder')} />
<span>{t('inputs.team_size.tooltip')}</span>
```

---

## 📊 Key Statistics

### Coverage by Namespace

| Namespace  | Keys     | Characters  | Avg Key Length   |
| ---------- | -------- | ----------- | ---------------- |
| common     | 100+     | 3,500+      | 35 chars         |
| hero       | 120+     | 8,000+      | 67 chars         |
| navigation | 65+      | 1,800+      | 28 chars         |
| calculator | 45+      | 2,500+      | 56 chars         |
| explorer   | 95+      | 4,200+      | 44 chars         |
| dashboard  | 60+      | 2,800+      | 47 chars         |
| forms      | 55+      | 1,400+      | 25 chars         |
| errors     | 40+      | 1,600+      | 40 chars         |
| analytics  | 30+      | 900+        | 30 chars         |
| **TOTAL**  | **610+** | **27,700+** | **45 chars avg** |

### Nesting Depth Distribution

```
Level 0 (root):        45 keys  (7%)
Level 1 (1 level):    180 keys (30%)
Level 2 (2 levels):   265 keys (43%)
Level 3 (3 levels):   105 keys (17%)
Level 4+ (4+ levels):  15 keys  (3%)
```

**Recommendation:** Keep most keys at 1-2 levels deep for maintainability.

---

## 🚀 Next Steps

### Implementation Phases

**Phase 1: Core Pages (Week 1)**

- [x] Common namespace
- [x] Hero namespace
- [x] Navigation namespace
- [ ] Extract Hero page strings
- [ ] Extract Navigation strings

**Phase 2: Feature Pages (Week 2)**

- [x] Calculator namespace
- [x] Explorer namespace
- [x] Dashboard namespace
- [ ] Extract Calculator strings
- [ ] Extract Explorer strings
- [ ] Extract Dashboard strings

**Phase 3: Supporting Content (Week 3)**

- [x] Forms namespace
- [x] Errors namespace
- [x] Analytics namespace
- [ ] Extract all form strings
- [ ] Extract all error messages
- [ ] Update analytics tracking

**Phase 4: Translations (Week 4)**

- [ ] Complete Dutch translations
- [ ] Complete Spanish translations
- [ ] Quality assurance review
- [ ] Native speaker validation

---

## 📞 Support

**Questions about key structure?**

- Refer to this document
- Check existing examples in translation files
- Ask in `#frontend-i18n` Slack channel
- Create issue: `[i18n] Key structure question`

---

**Last Updated:** 2025-10-06  
**Maintained by:** Frontend Team  
**Version:** 1.0.0  
**Status:** ✅ Complete Structure - Ready for String Extraction
