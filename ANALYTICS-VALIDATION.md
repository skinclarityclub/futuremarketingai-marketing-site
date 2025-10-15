# Analytics Validation Guide

This document provides comprehensive procedures for validating Google Analytics 4 and Hotjar tracking integrity.

## Table of Contents

1. [Quick Validation](#quick-validation)
2. [Development Testing](#development-testing)
3. [Production Validation](#production-validation)
4. [Event Testing Checklist](#event-testing-checklist)
5. [Integration Validation](#integration-validation)
6. [Troubleshooting](#troubleshooting)

---

## Quick Validation

### Automatic Validation (Development)

The app automatically runs validation checks in development mode. After starting the dev server:

1. Open browser console
2. Wait 2 seconds for initialization
3. Look for the **Analytics Validation Report**:

```
📊 Analytics Validation Report
  Timestamp: 2025-09-30T...
  Environment: development

  🔍 Platform Status
    GA4: ✅ Ready
      - Measurement ID: G-XXXXXXXXXX
    Hotjar: ✅ Ready
      - Site ID: 1234567
      - User ID: hj_1234567
    Integration: ✅ Active
      - User ID Synced: Yes
      - Hotjar User ID: hj_1234567

  🧪 Validation Tests
    ✅ Test 1: All environment variables configured
    ✅ Test 2: Analytics enabled
    ✅ Test 3: GA4 initialized successfully
    ✅ Test 4: Hotjar initialized successfully
    ✅ Test 5: GA4 ↔ Hotjar integration active

  📈 Summary
    Total Tests: 5
    Passed: 5 ✅
    Failed: 0 ❌

  🎉 All validation tests passed!
```

### Manual Validation (Console Command)

You can manually run validation at any time in development:

```javascript
// In browser console
validateAnalytics()
```

This function is automatically available in development mode.

---

## Development Testing

### Setup

1. **Configure Environment:**

   ```bash
   # Copy example file
   cp env.example .env.local

   # Edit .env.local and add:
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_HOTJAR_ID=1234567
   VITE_HOTJAR_SV=6
   VITE_ENABLE_ANALYTICS=true
   ```

2. **Start Development Server:**

   ```bash
   npm run dev
   ```

3. **Open Console:**
   - Press F12 or right-click → Inspect
   - Go to Console tab

### What to Check

**Initialization Messages:**

```
✅ GA4 initialized in test mode (no data will be sent)
✅ Hotjar initialized (Site ID: 1234567)
🔗 Initializing GA4 ↔ Hotjar integration...
🔗 Hotjar User ID synced to GA4: hj_1234567
✅ GA4 ↔ Hotjar integration complete
```

**Validation Report:**

- All 5 tests should pass
- GA4 and Hotjar should show as "Ready"
- Integration should show as "Active"

**No Errors:**

- Console should have no red error messages
- All scripts should load successfully

---

## Production Validation

### Pre-Deployment Checklist

- [ ] Environment variables set in Vercel/hosting platform
- [ ] `VITE_GA4_MEASUREMENT_ID` configured
- [ ] `VITE_HOTJAR_ID` configured
- [ ] `VITE_ENABLE_ANALYTICS` set to `"true"`
- [ ] Build passes without errors: `npm run build`
- [ ] Local production build tested: `npm run preview`

### Post-Deployment Validation

#### 1. GA4 Real-time Verification

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Navigate to **Reports** → **Realtime**
4. Visit your deployed site
5. Verify:
   - [ ] Active users count increases
   - [ ] Page views appear in real-time
   - [ ] Events appear in event list
   - [ ] User location shows correctly

#### 2. Hotjar Verification

1. Go to [Hotjar Dashboard](https://insights.hotjar.com/)
2. Select your site
3. Navigate to **Recordings**
4. Visit your deployed site and interact
5. Wait 2-3 minutes
6. Refresh Recordings page
7. Verify:
   - [ ] New recording appears
   - [ ] Recording plays back correctly
   - [ ] Mouse movements visible
   - [ ] Clicks recorded

#### 3. Heatmap Verification

1. In Hotjar, navigate to **Heatmaps**
2. Wait 24 hours for data to accumulate
3. Verify:
   - [ ] Click heatmap shows interactions
   - [ ] Move heatmap shows mouse paths
   - [ ] Scroll heatmap shows depth
   - [ ] Desktop and mobile views available

#### 4. Integration Verification

1. In GA4, go to **Reports** → **Realtime** → **Event count by Event name**
2. Find an event (e.g., `calculator_complete`)
3. Click on it to see event details
4. Verify:
   - [ ] `hotjar_user_id` parameter present
   - [ ] Value looks like `hj_1234567`

5. In Hotjar, go to **Recordings**
6. Use filter: **Events** → Select an event (e.g., `calculator_complete`)
7. Verify:
   - [ ] Recordings filtered by event
   - [ ] Only relevant recordings shown

---

## Event Testing Checklist

### Page Load Events

**Hero Page (`/`):**

- [ ] `page_load` event fires
- [ ] `hero_view` event fires after animation
- [ ] `system_diagram_view` event fires when diagram visible
- [ ] Scroll depth events (25%, 50%, 75%, 100%)
- [ ] Engagement time events (30s, 60s)

**Explorer Page (`/explorer`):**

- [ ] `page_load` event fires
- [ ] `module_open` event fires when clicking "Learn More"
- [ ] Scroll depth events
- [ ] Engagement time events

**Calculator Page (`/calculator`):**

- [ ] `page_load` event fires
- [ ] `calculator_interact` events fire on input changes
- [ ] `calculator_complete` event fires on calculation
- [ ] Hotjar recording tagged with ROI values
- [ ] Scroll depth events
- [ ] Engagement time events

**Dashboard Page (`/dashboard`):**

- [ ] `page_load` event fires
- [ ] Scroll depth events
- [ ] Engagement time events

### User Interaction Events

**CTA Clicks:**

- [ ] "Explore System" button (Hero)
- [ ] "Learn More" button (Explorer)
- [ ] "Back to Home" button (Explorer)
- [ ] "Calculate ROI" button (Explorer)
- [ ] "Schedule Demo" button (Calculator)

**Navigation:**

- [ ] Route changes tracked in both platforms
- [ ] Page titles correct in GA4
- [ ] Hotjar state changes on SPA navigation

### Calculator-Specific Events

- [ ] Team size change triggers event
- [ ] Average salary change triggers event
- [ ] Campaigns per month change triggers event
- [ ] Calculation completion includes ROI value
- [ ] Hotjar tags include:
  - `roi_percentage`
  - `monthly_savings`
  - `team_size`
  - `high_roi` (if > 300%)

---

## Integration Validation

### GA4 Custom Dimension Setup

1. **Navigate to GA4 Admin:**
   - Go to **Admin** → **Custom Definitions** → **Custom Dimensions**

2. **Verify Custom Dimension Exists:**
   - Dimension name: "Hotjar User ID"
   - Scope: User
   - User property: `hotjar_user_id`

3. **Test Custom Dimension:**
   - Go to **Reports** → **Realtime**
   - Click on an event
   - Verify `hotjar_user_id` parameter appears

### Cross-Platform Correlation Test

**Test Flow:**

1. **In your browser:**
   - Visit site
   - Perform specific actions (e.g., complete calculator)
   - Note the actions you took

2. **In GA4:**
   - Go to **Realtime** → **Events**
   - Find `calculator_complete` event
   - Click on event → View event parameters
   - Copy the `hotjar_user_id` value (e.g., `hj_1234567`)

3. **In Hotjar:**
   - Go to **Recordings**
   - Filter by event: `calculator_complete`
   - Or search for user ID (if available)
   - Find the recording
   - Verify it matches your session

4. **Cross-Reference:**
   - [ ] GA4 event time matches Hotjar recording time
   - [ ] User ID matches between platforms
   - [ ] Actions visible in both platforms
   - [ ] Event parameters align with recording behavior

---

## Troubleshooting

### Common Issues

#### ❌ "GA4 Measurement ID not configured"

**Solution:**

```bash
# Add to .env.local (development)
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Or set in Vercel (production)
# Settings → Environment Variables → Add VITE_GA4_MEASUREMENT_ID
```

#### ❌ "Hotjar Site ID not configured"

**Solution:**

```bash
# Add to .env.local (development)
VITE_HOTJAR_ID=1234567

# Or set in Vercel (production)
```

#### ❌ "Analytics disabled"

**Solution:**

```bash
# Ensure this is set to "true" (string, not boolean)
VITE_ENABLE_ANALYTICS=true
```

#### ❌ "GA4 ↔ Hotjar integration not active"

**Possible Causes:**

1. Hotjar not fully initialized (wait 2-3 seconds)
2. Ad blocker blocking Hotjar script
3. Hotjar Site ID incorrect

**Solution:**

1. Check console for Hotjar initialization message
2. Disable ad blocker temporarily
3. Verify Hotjar Site ID in dashboard
4. Run `validateAnalytics()` in console

#### ❌ Events not appearing in GA4

**Checklist:**

- [ ] Wait 24-48 hours for non-realtime reports
- [ ] Check **Realtime** reports for immediate data
- [ ] Verify measurement ID is correct
- [ ] Check console for errors
- [ ] Ensure analytics enabled in environment

#### ❌ Hotjar recordings not showing

**Checklist:**

- [ ] Wait 2-3 minutes after session
- [ ] Refresh Recordings page
- [ ] Check Hotjar site status (not paused)
- [ ] Verify Site ID matches environment variable
- [ ] Check free plan limits (35 daily sessions)

#### ❌ Hotjar User ID not in GA4 events

**Checklist:**

- [ ] Wait 24-48 hours after custom dimension setup
- [ ] Verify custom dimension created correctly
- [ ] Check dimension scope is "User"
- [ ] Verify property name is `hotjar_user_id`
- [ ] Check integration initialized successfully

---

## Manual Testing Script

### Full User Flow Test

1. **Hero Page:**

   ```
   1. Land on homepage (/)
   2. Wait for hero animation (2s)
   3. Scroll to 50%
   4. Wait 30 seconds
   5. Click "Explore System"
   ```

2. **Explorer Page:**

   ```
   1. Click "Learn More" on a module
   2. Scroll through content
   3. Click "Calculate ROI"
   ```

3. **Calculator Page:**

   ```
   1. Change team size to 10
   2. Change salary to €50,000
   3. Change campaigns to 20
   4. View calculation results
   5. Click "Schedule Demo"
   ```

4. **Verify in GA4:**

   ```
   - Check Realtime → Events
   - Verify all events appeared:
     ✓ page_load (3x)
     ✓ hero_view (1x)
     ✓ scroll_50 (1x)
     ✓ time_30s (1x)
     ✓ cta_click (3x)
     ✓ module_open (1x)
     ✓ calculator_interact (3x)
     ✓ calculator_complete (1x)
     ✓ calendly_open (1x)
   ```

5. **Verify in Hotjar:**
   ```
   - Go to Recordings
   - Find your session (last 5 minutes)
   - Verify:
     ✓ Recording shows full flow
     ✓ All clicks visible
     ✓ Calculator interaction recorded
     ✓ Can filter by events
   ```

---

## Validation Metrics

### Success Criteria

**Development:**

- ✅ All 5 validation tests pass
- ✅ No console errors
- ✅ Events logged with correct parameters
- ✅ Integration syncs user ID

**Production:**

- ✅ GA4 Realtime shows active users
- ✅ Events appear in GA4 within 1 minute
- ✅ Hotjar recordings appear within 3 minutes
- ✅ `hotjar_user_id` in all GA4 events
- ✅ Hotjar recordings filterable by GA4 events
- ✅ Heatmaps show data (after 24 hours)

### Performance Benchmarks

- ⚡ Page load impact: < 100ms
- ⚡ Event tracking latency: < 50ms
- ⚡ No blocking operations
- ⚡ Lighthouse score maintained > 90

---

## Continuous Monitoring

### Daily Checks

- [ ] GA4 Realtime shows active users
- [ ] No spike in error events
- [ ] Conversion events tracking correctly

### Weekly Checks

- [ ] Review top events in GA4
- [ ] Watch 3-5 Hotjar recordings
- [ ] Check heatmaps for UX insights
- [ ] Verify integration still syncing

### Monthly Checks

- [ ] Audit tracking implementation
- [ ] Update event taxonomy if needed
- [ ] Review and update custom dimensions
- [ ] Check for new GA4/Hotjar features

---

## Support & Resources

### Documentation

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Hotjar Help Center](https://help.hotjar.com/)
- [Analytics Setup Guide](./ANALYTICS-SETUP.md)

### Internal Files

- Validation utility: `src/utils/analytics-validator.ts`
- GA4 module: `src/utils/ga4.ts`
- Hotjar module: `src/utils/hotjar.ts`
- Integration module: `src/utils/analytics-integration.ts`

### Quick Commands

```bash
# Development
npm run dev              # Start with validation
validateAnalytics()      # Run validation in console

# Production
npm run build            # Build and check for errors
npm run preview          # Test production build locally
```

---

## Appendix: Event Reference

### All Tracked Events

| Event Name            | Fired On                  | Parameters                | Platforms    |
| --------------------- | ------------------------- | ------------------------- | ------------ |
| `page_load`           | Every page load           | `page_name`, `timestamp`  | GA4 + Hotjar |
| `hero_view`           | Hero animation complete   | `section`                 | GA4 + Hotjar |
| `system_diagram_view` | Diagram in viewport       | none                      | GA4 + Hotjar |
| `module_open`         | Module "Learn More" click | `module_name`             | GA4 + Hotjar |
| `calculator_interact` | Calculator input change   | `action`, `value`         | GA4 + Hotjar |
| `calculator_complete` | Calculation done          | `action`, `value`         | GA4 + Hotjar |
| `cta_click`           | CTA button click          | `cta_name`, `destination` | GA4 + Hotjar |
| `calendly_open`       | Calendly modal open       | `action`                  | GA4 + Hotjar |
| `scroll_25/50/75/100` | Scroll milestones         | `depth`                   | GA4 + Hotjar |
| `time_30s/60s`        | Engagement time           | `section`, `time_seconds` | GA4 + Hotjar |

All events automatically include `hotjar_user_id` in GA4.

---

**Last Updated:** 2025-09-30  
**Version:** 1.0.0
