# Mobile Analytics Event Tracking Schema

**Date**: 2025-10-24  
**Version**: 1.0  
**Platform**: Google Analytics 4 (GA4)  
**Status**: ✅ READY FOR IMPLEMENTATION

---

## Event Naming Convention

**Format**: `{category}_{action}`  
**Example**: `mobile_banner_dismiss`, `mobile_nav_click`, `mobile_cta_tap`

**Guidelines**:

- All lowercase with underscores
- Prefix mobile-specific events with `mobile_`
- Use consistent action verbs: `click`, `tap`, `swipe`, `view`, `open`, `close`

---

## 1. Desktop Banner Events

### Event: `mobile_banner_view`

**Trigger**: Desktop banner becomes visible  
**Category**: `Mobile Banner`  
**Action**: `View`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,          // e.g., '/', '/demo'
  banner_type: 'desktop_upsell'
}
```

**Business Goal**: Measure banner reach

---

### Event: `mobile_banner_email_click`

**Trigger**: User clicks "Email me link" button  
**Category**: `Mobile Banner`  
**Action**: `Email Click`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  cta_text: 'Email Link',      // Translation key value
  action_type: 'email_request'
}
```

**Business Goal**: Track desktop upsell interest  
**KPI**: Email click-through rate

---

### Event: `mobile_banner_dismiss`

**Trigger**: User dismisses banner  
**Category**: `Mobile Banner`  
**Action**: `Dismiss`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  dismissal_method: 'close_button',
  time_visible: number         // Seconds before dismiss
}
```

**Business Goal**: Understand banner friction

---

## 2. Mobile Navigation Events

### Event: `mobile_nav_open`

**Trigger**: User opens mobile menu  
**Category**: `Mobile Navigation`  
**Action**: `Open`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  nav_type: 'hamburger' | 'bottom_nav'
}
```

**Business Goal**: Track navigation engagement

---

### Event: `mobile_nav_click`

**Trigger**: User taps a nav item  
**Category**: `Mobile Navigation`  
**Action**: `Click`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  nav_item: string,            // e.g., 'features', 'pricing', 'home'
  nav_type: 'hamburger' | 'bottom_nav',
  item_position: number        // 1, 2, 3, etc.
}
```

**Business Goal**: Identify popular nav paths  
**KPI**: Nav item click-through rates

---

### Event: `mobile_nav_close`

**Trigger**: User closes mobile menu  
**Category**: `Mobile Navigation`  
**Action**: `Close`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  close_method: 'backdrop' | 'close_button' | 'nav_click',
  time_open: number            // Seconds menu was open
}
```

**Business Goal**: Understand menu usability

---

## 3. Feature Carousel Events

### Event: `mobile_carousel_swipe`

**Trigger**: User swipes carousel  
**Category**: `Mobile Carousel`  
**Action**: `Swipe`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  carousel_name: string,       // e.g., 'features', 'social_proof', 'modules'
  direction: 'left' | 'right',
  from_slide: number,
  to_slide: number,
  total_slides: number
}
```

**Business Goal**: Track feature discovery  
**KPI**: Carousel engagement rate

---

### Event: `mobile_carousel_dot_click`

**Trigger**: User taps pagination dot  
**Category**: `Mobile Carousel`  
**Action**: `Dot Click`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  carousel_name: string,
  target_slide: number,
  current_slide: number
}
```

**Business Goal**: Measure intentional navigation

---

### Event: `mobile_carousel_button_click`

**Trigger**: User taps prev/next button  
**Category**: `Mobile Carousel`  
**Action**: `Button Click`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  carousel_name: string,
  button_type: 'prev' | 'next',
  current_slide: number
}
```

**Business Goal**: Track navigation method preference

---

## 4. CTA Button Events

### Event: `mobile_cta_view`

**Trigger**: CTA becomes visible in viewport  
**Category**: `Mobile CTA`  
**Action**: `View`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  cta_text: string,            // e.g., 'Try Demo', 'Book Call'
  cta_location: string,        // e.g., 'hero', 'sticky_bottom', 'social_proof'
  cta_type: 'primary' | 'secondary'
}
```

**Business Goal**: Measure CTA reach  
**KPI**: CTA impression rate

---

### Event: `mobile_cta_click`

**Trigger**: User taps CTA button  
**Category**: `Mobile CTA`  
**Action**: `Click`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  cta_text: string,
  cta_location: string,
  cta_type: 'primary' | 'secondary',
  target_url: string,
  time_on_page: number         // Seconds before click
}
```

**Business Goal**: Track conversion paths  
**KPI**: CTA click-through rate, conversion rate

---

## 5. Demo & Module Events

### Event: `mobile_demo_view`

**Trigger**: User views demo page on mobile  
**Category**: `Mobile Demo`  
**Action**: `View`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  demo_type: 'home' | 'module' | 'full'
}
```

**Business Goal**: Measure demo reach on mobile

---

### Event: `mobile_module_click`

**Trigger**: User taps a module card  
**Category**: `Mobile Demo`  
**Action**: `Module Click`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  module_name: string,         // e.g., 'research', 'manager', 'content'
  module_position: number,
  total_modules: number
}
```

**Business Goal**: Track module interest  
**KPI**: Module engagement rate

---

## 6. Pricing & Social Proof Events

### Event: `mobile_pricing_view`

**Trigger**: Pricing section becomes visible  
**Category**: `Mobile Pricing`  
**Action**: `View`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  current_tier: string,        // e.g., 'founding', 'early', 'standard'
  slots_remaining: number,
  price: number
}
```

**Business Goal**: Track pricing visibility

---

### Event: `mobile_pricing_cta_click`

**Trigger**: User taps pricing CTA  
**Category**: `Mobile Pricing`  
**Action**: `CTA Click`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  current_tier: string,
  price: number,
  cta_text: string
}
```

**Business Goal**: Track pricing conversion intent

---

### Event: `mobile_social_proof_swipe`

**Trigger**: User swipes founding teams carousel  
**Category**: `Mobile Social Proof`  
**Action**: `Swipe`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  from_team: number,
  to_team: number,
  total_teams: number
}
```

**Business Goal**: Measure trust signal engagement

---

## 7. Calendly/Booking Events

### Event: `mobile_calendly_open`

**Trigger**: Calendly modal opens on mobile  
**Category**: `Mobile Calendly`  
**Action**: `Open`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  trigger_location: string,    // e.g., 'cta', 'nav', 'footer'
}
```

**Business Goal**: Track booking interest

---

### Event: `mobile_calendly_close`

**Trigger**: User closes Calendly modal  
**Category**: `Mobile Calendly`  
**Action**: `Close`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  close_method: 'button' | 'backdrop' | 'booking_complete',
  time_open: number            // Seconds
}
```

**Business Goal**: Understand drop-off points

---

### Event: `mobile_calendly_booking_complete`

**Trigger**: User completes booking  
**Category**: `Mobile Calendly`  
**Action**: `Booking Complete`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  booking_type: string,        // e.g., 'demo', 'consultation'
  time_to_book: number         // Seconds from open to complete
}
```

**Business Goal**: Track mobile conversions  
**KPI**: Mobile booking conversion rate

---

## 8. Accordion/Progressive Disclosure Events

### Event: `mobile_accordion_expand`

**Trigger**: User expands accordion item  
**Category**: `Mobile Accordion`  
**Action**: `Expand`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  accordion_name: string,      // e.g., 'features', 'faq'
  item_title: string,
  item_position: number
}
```

**Business Goal**: Track content discovery

---

### Event: `mobile_accordion_collapse`

**Trigger**: User collapses accordion item  
**Category**: `Mobile Accordion`  
**Action**: `Collapse`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  accordion_name: string,
  item_title: string,
  time_open: number            // Seconds item was open
}
```

**Business Goal**: Measure content engagement time

---

## 9. AI Assistant Events (Mobile-Specific)

### Event: `mobile_ai_assistant_open`

**Trigger**: User opens AI assistant on mobile  
**Category**: `Mobile AI Assistant`  
**Action**: `Open`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  trigger: 'button' | 'preview_bubble',
  first_time: boolean
}
```

**Business Goal**: Track AI engagement on mobile

---

### Event: `mobile_ai_assistant_close`

**Trigger**: User closes AI assistant  
**Category**: `Mobile AI Assistant`  
**Action**: `Close`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  messages_sent: number,
  time_open: number
}
```

**Business Goal**: Measure assistant usage depth

---

## 10. Personalization Events

### Event: `mobile_personalization_open`

**Trigger**: User opens personalization menu  
**Category**: `Mobile Personalization`  
**Action**: `Open`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string
}
```

**Business Goal**: Track personalization interest

---

### Event: `mobile_personalization_change`

**Trigger**: User changes industry/preferences  
**Category**: `Mobile Personalization`  
**Action**: `Change`  
**Properties**:

```typescript
{
  device: 'mobile',
  page_path: string,
  change_type: 'industry' | 'preferences',
  new_value: string
}
```

**Business Goal**: Understand user segments

---

## Business Goals & KPIs Mapping

### Primary KPIs

1. **Mobile Conversion Rate**: `mobile_calendly_booking_complete` / `mobile_demo_view`
2. **Mobile Engagement**: `mobile_nav_click` + `mobile_carousel_swipe` + `mobile_accordion_expand`
3. **Desktop Upsell Rate**: `mobile_banner_email_click` / `mobile_banner_view`
4. **CTA Performance**: `mobile_cta_click` / `mobile_cta_view`
5. **Feature Discovery**: `mobile_carousel_swipe` + `mobile_module_click`

### Secondary KPIs

6. **Navigation Efficiency**: `mobile_nav_click` / `mobile_nav_open`
7. **Content Depth**: `mobile_accordion_expand` / total accordion items
8. **Booking Drop-off**: `mobile_calendly_close` / `mobile_calendly_open`
9. **Pricing Interest**: `mobile_pricing_cta_click` / `mobile_pricing_view`
10. **AI Adoption**: `mobile_ai_assistant_open` / unique mobile users

---

## Event Implementation Checklist

### DesktopBanner Component

- [ ] `mobile_banner_view` - On mount (if visible)
- [ ] `mobile_banner_email_click` - On email button click
- [ ] `mobile_banner_dismiss` - On close button click

### MobileBottomNav Component

- [ ] `mobile_nav_click` - On nav item click

### MobileFullScreenMenu Component

- [ ] `mobile_nav_open` - On menu open
- [ ] `mobile_nav_click` - On menu item click
- [ ] `mobile_nav_close` - On menu close

### MobileFeatureCarousel Component

- [ ] `mobile_carousel_swipe` - On swipe gesture
- [ ] `mobile_carousel_dot_click` - On pagination dot click
- [ ] `mobile_carousel_button_click` - On prev/next button click

### StickyBottomCTA Component

- [ ] `mobile_cta_view` - On viewport visibility
- [ ] `mobile_cta_click` - On button click

### MobileDemoHome Component

- [ ] `mobile_demo_view` - On mount
- [ ] `mobile_module_click` - On module card click

### MobilePricing Component

- [ ] `mobile_pricing_view` - On viewport visibility
- [ ] `mobile_pricing_cta_click` - On CTA click

### MobileSocialProof Component

- [ ] `mobile_social_proof_swipe` - On carousel swipe

### MobileCalendlyModal Component

- [ ] `mobile_calendly_open` - On modal open
- [ ] `mobile_calendly_close` - On modal close
- [ ] `mobile_calendly_booking_complete` - On booking success

### AccordionItem Component

- [ ] `mobile_accordion_expand` - On expand
- [ ] `mobile_accordion_collapse` - On collapse

### AIJourneyAssistant Component

- [ ] `mobile_ai_assistant_open` - On chat open (mobile only)
- [ ] `mobile_ai_assistant_close` - On chat close (mobile only)

### MobilePersonalizationMenu Component

- [ ] `mobile_personalization_open` - On menu open
- [ ] `mobile_personalization_change` - On setting change

---

## Data Privacy & GDPR Compliance

### Required Implementations

1. **Consent Management**: Integrate consent banner before tracking
2. **Opt-Out Support**: Respect `window.doNotTrack` and opt-out preferences
3. **Data Anonymization**: No PII in event properties
4. **Cookie Policy**: Document analytics cookies
5. **User Controls**: Provide analytics opt-out in settings

### Compliant Properties

✅ **Safe to track**:

- Page paths
- Button clicks
- Navigation patterns
- Time measurements
- Device type
- Feature engagement

❌ **DO NOT track**:

- Email addresses
- Names
- Phone numbers
- IP addresses (auto-anonymized by GA4)
- Personal identifiers

---

## Testing Strategy

### Unit Tests

```typescript
describe('Mobile Analytics Events', () => {
  it('should fire mobile_banner_view on mount', () => {
    const trackEvent = vi.fn()
    render(<DesktopBanner />)
    expect(trackEvent).toHaveBeenCalledWith({
      category: 'Mobile Banner',
      action: 'View',
      // ... properties
    })
  })
})
```

### Integration Tests

- Verify events appear in GA4 real-time dashboard
- Check event properties are correct
- Validate mobile device detection

### Manual Testing

- Use GA4 DebugView for real-time validation
- Test on physical iOS/Android devices
- Verify opt-out functionality works

---

## Implementation Priority

### Phase 1 (Immediate) - HIGH IMPACT

1. `mobile_cta_click` - Conversion tracking
2. `mobile_calendly_booking_complete` - Goal completion
3. `mobile_demo_view` - Funnel entry
4. `mobile_nav_click` - Navigation behavior

### Phase 2 (Next Sprint) - MEDIUM IMPACT

5. `mobile_carousel_swipe` - Engagement
6. `mobile_banner_email_click` - Upsell tracking
7. `mobile_pricing_view` - Interest signals
8. `mobile_module_click` - Feature discovery

### Phase 3 (Future) - LOW IMPACT

9. `mobile_accordion_expand` - Content depth
10. `mobile_personalization_change` - Segmentation
11. `mobile_ai_assistant_open` - AI adoption
12. All remaining events

---

## Success Criteria

✅ **Task Complete When**:

1. All Phase 1 events implemented
2. Events firing correctly in GA4 DebugView
3. GDPR compliance verified
4. Unit tests passing
5. Documentation updated
6. Analytics dashboard configured

---

## Notes

- Use existing `trackEvent()` function from `src/utils/analytics.ts`
- All events auto-send to GA4, gtag, and legacy GA
- Mobile device detection via `useIsMobile()` hook
- Consider Hotjar/FullStory for session recording (GDPR compliant)
