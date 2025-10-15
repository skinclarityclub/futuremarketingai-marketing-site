# Analytics Tracking Labels Audit

**Datum:** 2025-10-06  
**Project:** FutureMarketingAI Demo  
**Task:** 14.13 - Analytics Tracking Labels Audit  
**Scope:** All analytics events across GA4, Hotjar, and cross-platform tracking

---

## 🎯 Executive Summary

### Audit Result

**STATUS: ✅ GOOD - Minor improvements needed**

**Overall Assessment:**

- ✅ Consistent snake_case naming (GA4 best practice)
- ✅ Clear event structure (category/action/label)
- ✅ Comprehensive event coverage
- ⚠️ Some parameter name inconsistencies
- ⚠️ Missing standard e-commerce events for potential future use

### Key Improvements Identified

1. **Parameter Naming:** Standardize to always use snake_case
2. **Event Names:** Add namespace prefixes for better organization
3. **Documentation:** Create centralized event catalog
4. **Missing Events:** Add user journey milestones
5. **Label Consistency:** Ensure all labels follow same format

---

## 📊 Current Event Inventory

### 1. Page & View Events

**Event: `page_load`**

```typescript
// Location: src/utils/ga4.ts:168-173
trackPageLoad(pageName: string)

// Parameters:
{
  page_name: string,
  timestamp: ISO string
}
```

- ✅ **Status:** Good
- ✅ **Naming:** Clear and descriptive
- ✅ **Parameters:** Consistent snake_case
- 📝 **Usage:** Tracked on every page mount

**Event: `page_view`**

```typescript
// Location: src/utils/ga4.ts:72-93
trackGA4PageView(path: string, title?: string)

// GA4 Hit Type: pageview
{
  hitType: 'pageview',
  page: string,
  title: string
}
```

- ✅ **Status:** Good (GA4 standard)
- ✅ **Naming:** Standard GA4 event
- ⚠️ **Note:** Automatically tracked by GA4, manual tracking should be limited

**Event: `hero_view`**

```typescript
// Location: src/utils/ga4.ts:176-180
trackHeroView()

// Parameters:
{
  section: 'hero'
}
```

- ✅ **Status:** Good
- ⚠️ **Improvement:** Consider renaming to `section_view` with dynamic section name
- 💡 **Recommendation:**

```typescript
// IMPROVED
trackSectionView(sectionName: string)
{
  section_name: sectionName, // 'hero', 'features', 'pricing', etc.
  section_type: 'landing' | 'content' | 'conversion'
}
```

---

### 2. CTA Events

**Event: `cta_impression`**

```typescript
// Location: src/utils/analytics.ts:75-91
trackCTAImpression(ctaName: string, location: string, metadata?: Record<string, any>)

// Parameters:
{
  cta_name: string,
  cta_location: string,
  ...metadata
}

// Legacy format:
{
  category: 'CTA',
  action: 'Impression',
  label: `${ctaName} at ${location}` // ⚠️ String concatenation in label
}
```

- ✅ **Status:** Good (GA4)
- ⚠️ **Legacy:** Label uses string concatenation (less queryable)
- 💡 **Recommendation:** Use only GA4 format with structured parameters

**Event: `cta_click`**

```typescript
// Location: src/utils/analytics.ts:100-123
trackCTAClick(ctaName: string, destination: string, metadata?: Record<string, any>)

// Parameters:
{
  cta_name: string,
  cta_destination: string,
  ...metadata // May include: timeToClick, variant, etc.
}

// Enhanced variant:
cta_click_enhanced
{
  cta_name: string,
  cta_destination: string,
  ...metadata
}
```

- ✅ **Status:** Good
- ✅ **Naming:** Clear and actionable
- ⚠️ **Two Events:** `cta_click` and `cta_click_enhanced` (consolidate?)
- 💡 **Recommendation:**

```typescript
// CONSOLIDATED
cta_interaction
{
  interaction_type: 'click' | 'impression' | 'hover',
  cta_name: string,
  cta_destination: string,
  cta_location: string,
  time_to_action_ms?: number, // For enhanced tracking
  cta_variant?: string
}
```

---

### 3. Calculator Events

**Event: `calculator_interact`**

```typescript
// Location: src/utils/ga4.ts:190-195
trackCalculatorInteract(action: string, value?: number)

// Parameters:
{
  action: string, // ⚠️ Free-text, inconsistent
  value?: number
}

// Legacy format (analytics.ts:132-143):
{
  category: 'ROI Calculator',
  action: string,
  label?: string,
  value?: number
}
```

- ⚠️ **Status:** Needs improvement
- ⚠️ **Issue:** `action` parameter is free-text, leading to inconsistency
- ❌ **Problem:** "Input Change", "Calculation Complete", "Result Displayed" not standardized
- 💡 **Recommendation:**

```typescript
// IMPROVED - Structured calculator events
calculator_input_changed
{
  input_field: 'team_size' | 'avg_salary' | 'campaigns_per_month',
  input_value: number,
  input_previous_value?: number
}

calculator_result_calculated
{
  calculation_type: 'roi' | 'time_savings' | 'cost_savings',
  result_value: number,
  input_team_size: number,
  input_avg_salary: number,
  input_campaigns: number
}

calculator_result_shared
{
  share_method: 'url' | 'export' | 'print',
  roi_value?: number
}
```

---

### 4. Calendly Events

**Event: `calendly_event`**

```typescript
// Location: src/utils/ga4.ts:214-219
trackCalendlyEvent(action: string, eventType?: string)

// Parameters:
{
  action: string, // ⚠️ Free-text: 'Modal Opened', 'Event Scheduled'
  event_type?: string
}
```

- ⚠️ **Status:** Needs standardization
- ❌ **Issue:** Action parameter inconsistent (sometimes "Modal Opened", sometimes "Event Scheduled")
- 💡 **Recommendation:**

```typescript
// IMPROVED - Separate events for each action
calendly_modal_opened
{
  trigger_location: string, // 'hero_cta', 'exit_intent', 'floating_cta'
  user_journey_stage: 'awareness' | 'consideration' | 'decision'
}

calendly_booking_started
{
  event_type: string,
  trigger_location: string
}

calendly_booking_completed
{
  event_type: string,
  event_date: string,
  trigger_location: string
}

calendly_modal_closed
{
  time_open_seconds: number,
  booking_completed: boolean
}
```

---

### 5. Navigation Events

**Event: `navigation`**

```typescript
// Location: src/utils/ga4.ts:222-227
trackNavigation(from: string, to: string)

// Parameters:
{
  from: string,
  to: string
}
```

- ✅ **Status:** Good
- ✅ **Naming:** Clear
- 💡 **Enhancement:**

```typescript
// ENHANCED
navigation
{
  navigation_from: string, // Changed from 'from' for clarity
  navigation_to: string,   // Changed from 'to' for clarity
  navigation_method: 'link_click' | 'back_button' | 'direct',
  time_on_previous_page_seconds: number
}
```

**Event: `module_open`**

```typescript
// Location: src/utils/ga4.ts:183-187
trackModuleOpen(moduleName: string)

// Parameters:
{
  module_name: string
}
```

- ✅ **Status:** Good
- ✅ **Naming:** Clear and specific
- 💡 **Enhancement:**

```typescript
// ENHANCED
module_interaction
{
  interaction_type: 'open' | 'close' | 'expand' | 'collapse',
  module_name: string,
  module_category: 'research' | 'content' | 'analytics' | 'automation',
  time_open_seconds?: number // For close events
}
```

---

### 6. Engagement Events

**Event: `engagement_time`**

```typescript
// Location: src/utils/ga4.ts:246-251
trackEngagementTime(section: string, timeInSeconds: number)

// Parameters:
{
  section: string,
  time_seconds: number
}
```

- ✅ **Status:** Good
- ✅ **Naming:** Clear
- ⚠️ **Consistency:** Use `time_seconds` vs `timeInSeconds` consistently
- 💡 **Recommendation:** Already well-structured ✅

**Event: `scroll_depth`** (Implied, tracked via hooks)

```typescript
// Location: src/hooks/useAnalytics.ts
// Tracked at 25%, 50%, 75%, 100% milestones

// Expected parameters:
{
  page_name: string,
  scroll_percentage: 25 | 50 | 75 | 100
}
```

- ✅ **Status:** Good concept
- ⚠️ **Issue:** Not formally defined in ga4.ts
- 💡 **Recommendation:** Add formal function

```typescript
// ADD TO ga4.ts
export const trackScrollDepth = (pageName: string, percentage: number): void => {
  trackGA4Event('scroll_depth', {
    page_name: pageName,
    scroll_percentage: percentage,
    scroll_milestone: `${percentage}%`,
  })
}
```

---

### 7. Form & Error Events

**Event: `form_submit`**

```typescript
// Location: src/utils/ga4.ts:206-211
trackFormSubmit(formName: string, success: boolean)

// Parameters:
{
  form_name: string,
  success: boolean
}
```

- ✅ **Status:** Good
- ✅ **Naming:** Clear
- 💡 **Enhancement:**

```typescript
// ENHANCED
form_submit
{
  form_name: string,
  form_success: boolean, // Renamed for clarity
  form_type: 'contact' | 'calculator' | 'profile' | 'subscription',
  error_message?: string, // If success=false
  time_to_submit_seconds: number
}
```

**Event: `error`**

```typescript
// Location: src/utils/ga4.ts:238-243
trackError(errorMessage: string, errorType?: string)

// Parameters:
{
  error_message: string,
  error_type: string // default: 'unknown'
}
```

- ✅ **Status:** Good
- ⚠️ **Enhancement needed:** Add more context
- 💡 **Recommendation:**

```typescript
// ENHANCED
error_occurred
{
  error_message: string,
  error_type: 'network' | 'validation' | 'javascript' | 'api' | 'unknown',
  error_severity: 'low' | 'medium' | 'high' | 'critical',
  error_location: string, // Component/page where error occurred
  error_stack?: string, // For critical errors only
  user_action_before_error?: string
}
```

---

### 8. Outbound Events

**Event: `outbound_click`**

```typescript
// Location: src/utils/ga4.ts:230-235
trackOutboundClick(url: string, label?: string)

// Parameters:
{
  url: string,
  label?: string
}
```

- ✅ **Status:** Good
- ⚠️ **Naming:** Could be more specific
- 💡 **Recommendation:**

```typescript
// ENHANCED
outbound_link_click
{
  link_url: string, // Renamed from 'url'
  link_label: string, // Renamed from 'label', made required
  link_category: 'social' | 'documentation' | 'partner' | 'other',
  link_location: string // Where on page the link was clicked
}
```

---

## 🔥 Hotjar Events

### Current Hotjar Events

**Defined in `src/utils/hotjar.ts` (HotjarEvents enum):**

```typescript
export enum HotjarEvents {
  // Page views
  PAGE_LOAD = 'page_load',

  // User actions
  CTA_CLICK = 'cta_click',
  CALCULATOR_START = 'calculator_start',
  CALCULATOR_COMPLETE = 'calculator_complete',
  CALENDLY_OPEN = 'calendly_open',
  CALENDLY_SCHEDULED = 'calendly_scheduled',

  // Module interactions
  MODULE_OPEN = 'module_open',
  MODULE_CLOSE = 'module_close',
  FEATURE_EXPLORE = 'feature_explore',

  // Conversions
  SIGNUP_START = 'signup_start',
  SIGNUP_COMPLETE = 'signup_complete',

  // High-value actions
  HIGH_ROI_CALCULATED = 'high_roi_calculated', // ROI > €50k
  CALENDLY_BOOKING_INTENT = 'calendly_booking_intent',
}
```

- ✅ **Status:** Well-structured enum
- ✅ **Naming:** Consistent snake_case
- ✅ **Organization:** Grouped by category (comments)
- 💡 **Minor enhancement:** Align exactly with GA4 event names where applicable

---

## 🎨 Naming Convention Standards

### Current Standards (What's Working ✅)

1. **Event Names:** snake_case ✅
   - Examples: `cta_click`, `calculator_interact`, `page_load`
   - GA4 best practice

2. **Parameter Names:** snake_case ✅
   - Examples: `page_name`, `cta_destination`, `time_seconds`
   - Consistent with GA4

3. **Enum Values:** UPPER_SNAKE_CASE ✅
   - Example: `HotjarEvents.CALCULATOR_COMPLETE`
   - TypeScript/JavaScript standard

### Inconsistencies Found ⚠️

1. **Mixed naming in function parameters:**

   ```typescript
   // ⚠️ INCONSISTENT
   trackCTAClick(ctaName: string, ...) // camelCase
   // vs
   { cta_name: string } // snake_case in event params
   ```

   - **Impact:** Low (internal only)
   - **Fix:** Keep as-is (TypeScript convention vs GA4 convention)

2. **Free-text action parameters:**

   ```typescript
   // ❌ PROBLEMATIC
   trackCalculatorInteract('Input Change', ...) // Not standardized
   trackCalculatorInteract('Calculation Complete', ...) // Different string
   ```

   - **Impact:** High (difficult to query, prone to typos)
   - **Fix:** Use enums or separate functions

3. **Label concatenation:**

   ```typescript
   // ⚠️ LESS QUERYABLE
   label: `${ctaName} at ${location}` // Hard to filter in GA4
   ```

   - **Impact:** Medium (harder to segment)
   - **Fix:** Use separate parameters instead

---

## 📋 Recommended Event Naming Standards

### Standard Event Name Format

```
<object>_<action>_<modifier?>
```

**Examples:**

- ✅ `cta_click` (object: cta, action: click)
- ✅ `calculator_result_calculated` (object: calculator, action: calculated, modifier: result)
- ✅ `form_submit_success` (object: form, action: submit, modifier: success)

### Parameter Naming Rules

1. **Always use snake_case**
2. **Be specific and descriptive**
3. **Include units in name if applicable**
   - ✅ `time_seconds` not just `time`
   - ✅ `roi_euros` not just `roi`
4. **Use consistent prefixes for related parameters**
   - ✅ `cta_name`, `cta_location`, `cta_destination`
   - ✅ `error_type`, `error_message`, `error_severity`

### Reserved Parameter Names (GA4 Standard)

Do NOT use these names for custom parameters (GA4 reserves them):

- `page_location`
- `page_referrer`
- `page_title`
- `screen_resolution`
- `language`
- `user_id`
- `session_id`

Use prefixes to avoid conflicts:

- ✅ `custom_page_type` instead of `page_type`
- ✅ `app_language_preference` instead of `language`

---

## 🚀 Recommended Improvements

### Priority 1: Critical Fixes

**1. Standardize Calculator Events**

```typescript
// BEFORE (inconsistent)
trackCalculatorInteract('Input Change', value)
trackCalculatorInteract('Calculation Complete', value)

// AFTER (structured)
trackCalculatorInputChanged(field: CalculatorField, value: number)
trackCalculatorResultCalculated(results: CalculatorResults)
trackCalculatorResultShared(method: ShareMethod)
```

**2. Standardize Calendly Events**

```typescript
// BEFORE (one event, free-text action)
trackCalendlyEvent('Modal Opened')
trackCalendlyEvent('Event Scheduled', eventType)

// AFTER (separate events)
trackCalendlyModalOpened(location: string)
trackCalendlyBookingCompleted(eventType: string, location: string)
trackCalendlyModalClosed(timeOpen: number, bookingCompleted: boolean)
```

### Priority 2: Enhanced Tracking

**3. Add Missing User Journey Events**

```typescript
// NEW EVENTS
trackUserJourneyMilestone(milestone: JourneyMilestone)
{
  milestone_name: 'awareness' | 'consideration' | 'decision' | 'purchase',
  milestone_timestamp: ISO string,
  time_since_first_visit_seconds: number
}

trackFeatureDiscovery(featureName: string)
{
  feature_name: string,
  feature_category: string,
  discovery_method: 'exploration' | 'tooltip' | 'onboarding'
}

trackValueRealization(valueType: string, value: number)
{
  value_type: 'time_saved' | 'money_saved' | 'efficiency_gain',
  value_amount: number,
  value_unit: 'hours' | 'euros' | 'percentage'
}
```

**4. Add Scroll Depth Tracking (Formalize)**

```typescript
// ADD TO ga4.ts
export const trackScrollDepth = (pageName: string, percentage: 25 | 50 | 75 | 100): void => {
  trackGA4Event('scroll_depth', {
    page_name: pageName,
    scroll_percentage: percentage,
    scroll_milestone: `${percentage}%`,
  })
}
```

### Priority 3: Documentation & Maintenance

**5. Create Event Catalog**

Create `ANALYTICS-EVENT-CATALOG.md` with:

- Complete list of all events
- Parameters for each event
- When/where each event fires
- Code examples
- GA4 dashboard queries

**6. Add TypeScript Types for Events**

```typescript
// NEW FILE: src/types/analytics.ts

export type AnalyticsEventName =
  | 'page_load'
  | 'cta_click'
  | 'calculator_input_changed'
  | 'calculator_result_calculated'
  | 'calendly_modal_opened'
  | 'calendly_booking_completed'
// ... all events

export interface CTAClickEvent {
  cta_name: string
  cta_destination: string
  cta_location: string
  cta_variant?: string
  time_to_click_ms?: number
}

export interface CalculatorResultEvent {
  result_roi_euros: number
  result_time_saved_hours: number
  input_team_size: number
  input_avg_salary_euros: number
  input_campaigns_per_month: number
}

// Type-safe tracking function
export function trackTypedEvent<T extends AnalyticsEventName>(
  eventName: T,
  params: EventParams[T]
): void
```

---

## 📊 Analytics Label Best Practices

### DO's ✅

1. **Use consistent snake_case for all event names and parameters**
2. **Be specific and descriptive** - `cta_click` not just `click`
3. **Include units** - `time_seconds` not `time`
4. **Group related parameters with prefixes** - `cta_name`, `cta_location`, `cta_destination`
5. **Use enums for fixed value sets** - `HotjarEvents`, `CalculatorField`
6. **Document every event** - In code and in catalog
7. **Test events in GA4 DebugView** before deploying
8. **Version your analytics** - Track breaking changes

### DON'Ts ❌

1. **Don't use free-text for action parameters** - Use enums or separate events
2. **Don't concatenate strings in labels** - Use structured parameters
3. **Don't use camelCase for GA4 parameters** - Use snake_case
4. **Don't create too many similar events** - Consolidate with parameters
5. **Don't use reserved GA4 parameter names**
6. **Don't track PII** - No emails, names, or sensitive data
7. **Don't create events without purpose** - Every event should inform decisions
8. **Don't forget to clean up unused events**

---

## 🧪 Testing & Validation

### GA4 DebugView Testing

All events should be tested in GA4 DebugView before production:

```typescript
// In development mode
if (import.meta.env.DEV) {
  console.log('📊 Analytics Event:', eventName, params)
}
```

**Test Checklist:**

- [ ] Event appears in DebugView
- [ ] All parameters are present
- [ ] Parameter names use snake_case
- [ ] Values are correct type (string, number, boolean)
- [ ] No PII is being tracked
- [ ] Event fires at correct time/interaction
- [ ] Cross-platform sync works (GA4 ↔ Hotjar)

### Event Naming Validation

Create linting rule to enforce naming:

```typescript
// .eslintrc.cjs - custom rule
rules: {
  'analytics-naming': {
    eventNames: 'snake_case',
    parameters: 'snake_case',
    noFreeText: ['action', 'type', 'category']
  }
}
```

---

## 📈 Impact & Success Metrics

### Expected Improvements

**Before Audit:**

- Some events use free-text (hard to query)
- Label concatenation makes filtering difficult
- No centralized event documentation
- Inconsistent parameter naming in some places

**After Implementation:**

- ✅ **100% structured events** (no free-text)
- ✅ **Consistent naming** across all events
- ✅ **Complete event catalog** for team reference
- ✅ **Type-safe tracking** with TypeScript
- ✅ **Better GA4 reports** (easier segmentation)
- ✅ **Reduced errors** (typos impossible with enums)

### Metrics to Monitor

- **Event collection rate:** Should remain 100%
- **Invalid event rate:** Should decrease to 0%
- **Query performance in GA4:** Should improve (structured data)
- **Team adoption:** Faster onboarding with clear docs

---

## ✅ Implementation Checklist

### Phase 1: Critical Standardization (Week 1)

- [ ] Standardize calculator events (separate functions + enums)
- [ ] Standardize Calendly events (separate events)
- [ ] Remove label string concatenation
- [ ] Add TypeScript types for all events

### Phase 2: Enhanced Tracking (Week 2)

- [ ] Add scroll depth tracking (formal function)
- [ ] Add user journey milestone events
- [ ] Add feature discovery tracking
- [ ] Add value realization tracking

### Phase 3: Documentation & Tools (Week 3)

- [ ] Create ANALYTICS-EVENT-CATALOG.md
- [ ] Add TypeScript event types
- [ ] Create ESLint rules for event naming
- [ ] Update code documentation

### Phase 4: Testing & Validation (Week 4)

- [ ] Test all events in GA4 DebugView
- [ ] Validate cross-platform sync
- [ ] Create automated event testing
- [ ] Train team on new conventions

---

## 📚 Resources

### GA4 Best Practices

- [GA4 Event Naming Guide](https://support.google.com/analytics/answer/9322688)
- [GA4 Parameter Limits](https://support.google.com/analytics/answer/9267744)
- [GA4 Reserved Names](https://support.google.com/analytics/answer/9267735)

### Tools

- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)
- [GA4 Event Builder](https://ga-dev-tools.google/ga4/event-builder/)
- [Hotjar API Documentation](https://help.hotjar.com/hc/en-us/articles/115011639927)

---

## 🎯 Conclusion

**Overall Assessment: ✅ GOOD with room for improvement**

The current analytics implementation is solid with:

- ✅ Consistent snake_case naming
- ✅ Good event coverage
- ✅ Clear documentation in code
- ✅ Cross-platform integration

**Key improvements needed:**

1. **Standardize calculator events** (Priority 1)
2. **Standardize Calendly events** (Priority 1)
3. **Add TypeScript types** (Priority 2)
4. **Create event catalog** (Priority 3)

**Implementation timeline:** 4 weeks  
**Effort level:** Medium  
**Impact level:** High (better insights, easier querying, reduced errors)

---

**Audit Completed:** 2025-10-06  
**Auditor:** AI Assistant  
**Status:** Ready for implementation
