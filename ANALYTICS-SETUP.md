# Analytics Setup Guide

This guide explains how to set up Google Analytics 4 (GA4) and Hotjar tracking for FutureMarketingAI.

## Google Analytics 4 Setup

### 1. Create a GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon in bottom left)
3. In the **Property** column, click **Create Property**
4. Enter property details:
   - Property name: `FutureMarketingAI`
   - Time zone: Your timezone
   - Currency: Your currency
5. Click **Next** and complete the business information
6. Click **Create** and accept the terms

### 2. Get Your Measurement ID

1. In your new property, go to **Admin** → **Data Streams**
2. Click **Add stream** → **Web**
3. Enter your website URL and stream name
4. Click **Create stream**
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 3. Configure Environment Variables

1. Copy `env.example` to `.env.local`:

   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and add your Measurement ID:

   ```env
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_ENABLE_ANALYTICS=true
   ```

3. For production (Vercel), add these to your environment variables:
   - Go to your Vercel project settings
   - Navigate to **Environment Variables**
   - Add:
     - `VITE_GA4_MEASUREMENT_ID`: Your GA4 Measurement ID
     - `VITE_ENABLE_ANALYTICS`: `true`

### 4. Verify Tracking

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. In the console, you should see:

   ```
   ✅ GA4 initialized in test mode (no data will be sent)
   ```

4. Navigate between pages and check console logs for tracking events

5. In production, verify in GA4:
   - Go to **Reports** → **Realtime**
   - Visit your site and check if events appear
   - Wait 24-48 hours for full reports

## Tracked Events

The following events are automatically tracked:

### Page Views

- Tracked on every route change
- Includes page path and title

### Critical Events

- `page_load` - When a page finishes loading
- `hero_view` - When user views the hero section
- `module_open` - When user opens a module/section
- `calculator_interact` - Calculator interactions
- `cta_click` - CTA button clicks
- `calendly_event` - Calendly interactions
- `navigation` - Navigation between pages
- `outbound_click` - External link clicks
- `error` - JavaScript errors
- `engagement_time` - Time spent on sections

### Calculator Events

- Input changes
- Calculation completion
- Results displayed

### CTA Events

- Button name
- Destination
- Context

## Custom Event Tracking

You can track custom events using the analytics utilities:

```typescript
import { trackEvent, trackCTAClick, trackCalculator } from '@/utils/analytics'

// Generic event
trackEvent({
  category: 'User Interaction',
  action: 'Button Click',
  label: 'Download Report',
  value: 1,
})

// CTA click
trackCTAClick('Schedule Demo', 'Calendly')

// Calculator event
trackCalculator('Result Calculated', 'ROI', 456)
```

## GA4-Specific Tracking

For advanced GA4 features, use the GA4 module directly:

```typescript
import { trackGA4Event, trackPageLoad, trackHeroView, trackModuleOpen } from '@/utils/ga4'

// Custom GA4 event
trackGA4Event('custom_event', {
  custom_param: 'value',
  numeric_value: 123,
})

// Specific tracking functions
trackPageLoad('Dashboard')
trackHeroView()
trackModuleOpen('ROI Calculator')
```

## Privacy & GDPR Compliance

Our GA4 implementation includes privacy features:

- ✅ **IP Anonymization**: Enabled by default
- ✅ **Secure Cookies**: `SameSite=None;Secure`
- ✅ **Test Mode in Development**: No data sent in dev mode
- ✅ **Opt-out Ready**: Can be disabled via environment variable

### Cookie Consent (Optional)

To add cookie consent, you can integrate with a consent management platform:

```typescript
// Example with cookie consent
if (userHasConsented) {
  initGA4()
}
```

## Hotjar Setup

### 1. Create a Hotjar Account

1. Go to [Hotjar](https://www.hotjar.com/)
2. Sign up for a free account (up to 35 daily sessions free)
3. Click **New Site** or **Add new site**
4. Enter your website URL (e.g., `https://futuremarketingai.vercel.app`)
5. Complete the site setup wizard
6. Navigate to **Tracking Code** in settings
7. Copy your **Site ID** (numeric value, e.g., `1234567`)

### 2. Configure Environment Variables

Add to `.env.local`:

```env
VITE_HOTJAR_ID=1234567
VITE_HOTJAR_SV=6
VITE_ENABLE_ANALYTICS=true
```

For production (Vercel):

- Go to your Vercel project settings
- Navigate to **Environment Variables**
- Add:
  - `VITE_HOTJAR_ID`: Your Hotjar Site ID
  - `VITE_HOTJAR_SV`: `6` (script version)
  - `VITE_ENABLE_ANALYTICS`: `true`

### 3. Verify Installation

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. In the console, you should see:

   ```
   ✅ Hotjar initialized (Site ID: 1234567)
   ```

4. In production:
   - Visit your site
   - Go to Hotjar dashboard → **Recordings**
   - Wait a few minutes and check if new sessions appear
   - Check **Heatmaps** for initial data collection

### 4. Hotjar Features

**Session Recordings:**

- Automatic recording of user sessions
- See mouse movements, clicks, and scrolling
- Filter by GA4 events, tags, or user attributes
- Privacy controls for sensitive data

**Heatmaps:**

- Click heatmaps - where users click
- Move heatmaps - mouse movement patterns
- Scroll heatmaps - how far users scroll
- Per-page analysis

**Funnels:**

- Track conversion paths
- Identify drop-off points
- Optimize user journeys

**Feedback:**

- On-site surveys
- Feedback widgets
- User polls

### 5. Hotjar Events

Our implementation tracks specific events that can be used to filter recordings:

```typescript
import { hotjarEvent, HotjarEvents } from '@/utils/analytics'

// Trigger events
hotjarEvent(HotjarEvents.CALCULATOR_START)
hotjarEvent(HotjarEvents.CTA_CLICK)
hotjarEvent(HotjarEvents.CALENDLY_OPEN)
```

**Available Events:**

- `page_load` - Page loads
- `hero_view` - Hero section viewed
- `module_open` - Module/section opened
- `cta_click` - CTA button clicked
- `calculator_start` - Calculator started
- `calculator_complete` - Calculation completed
- `calendly_open` - Calendly opened
- `form_submit` - Form submitted
- `scroll_25/50/75/100` - Scroll depth milestones
- `time_30s/60s` - Time on page milestones

### 6. Tag Recordings

Tag recordings with custom attributes for better filtering:

```typescript
import { hotjarTagRecording } from '@/utils/analytics'

// Tag with user type
hotjarTagRecording({
  user_type: 'premium',
  plan: 'enterprise',
  roi_calculated: true,
})
```

### 7. Identify Users

Link Hotjar sessions to specific users:

```typescript
import { hotjarIdentify } from '@/utils/analytics'

// After user logs in
hotjarIdentify('user_123', {
  plan: 'pro',
  signup_date: '2025-01-01',
})
```

### 8. Privacy & GDPR Compliance

**Built-in Privacy Features:**

- ✅ Suppress text and input fields (configurable)
- ✅ Disable recording on specific pages
- ✅ Cookie consent integration ready
- ✅ Data retention controls
- ✅ GDPR compliant by default

**Hotjar Dashboard Settings:**

1. Go to **Settings** → **Privacy**
2. Enable **Suppress text and input field recording**
3. Add sensitive pages to blocklist
4. Configure data retention period (max 365 days)

### 9. Integration with GA4

Link Hotjar with GA4 for unified analysis (covered in Task 27.4):

```typescript
import { getHotjarUserId } from '@/utils/analytics'

// Get Hotjar user ID for GA4
const hjUserId = getHotjarUserId()
if (hjUserId) {
  // Send to GA4 as custom dimension
  trackGA4Event('session_start', {
    hotjar_user_id: hjUserId,
  })
}
```

## Testing in Development

### Console Logs

In development mode, all tracking events are logged to the console:

```
📊 [Test Mode] Event: cta_click { cta_name: 'Schedule Demo', destination: 'Calendly' }
📄 [Test Mode] Page View: { path: '/calculator', title: 'ROI Calculator' }
```

### Test Mode

- No data is sent to GA4 in development
- All events are logged to console
- React GA4 runs in test mode

### Production Testing

1. Deploy to Vercel
2. Visit your site
3. Open GA4 → **Realtime** reports
4. Perform actions and verify events appear
5. Check event parameters are correct

## Troubleshooting

### Events Not Appearing in GA4

1. **Check Measurement ID**: Verify it's correct in `.env.local`
2. **Check Analytics Enabled**: Ensure `VITE_ENABLE_ANALYTICS=true`
3. **Wait for Data**: Realtime reports show immediately, full reports take 24-48h
4. **Check Console**: Look for initialization messages or errors
5. **Verify Build**: Ensure environment variables are set in Vercel

### Console Errors

```
⚠️ GA4 Measurement ID not found
```

**Solution**: Add `VITE_GA4_MEASUREMENT_ID` to `.env.local`

```
❌ Failed to initialize GA4
```

**Solution**: Check measurement ID format (`G-XXXXXXXXXX`)

### Ad Blockers

Some users may have ad blockers that prevent GA4:

- This is expected and normal
- Analytics will work for most users
- Consider alternative analytics for full coverage

## Best Practices

1. **Test First**: Always test in development before deploying
2. **Monitor Events**: Regularly check GA4 to ensure events are firing
3. **Clean Data**: Use descriptive event names and parameters
4. **Privacy First**: Respect user privacy and comply with regulations
5. **Document Events**: Keep this file updated with new events

## Event Tracking Implementation

### Automatic Tracking

All pages now include automatic tracking for:

**Page Analytics (via `usePageAnalytics` hook):**

- ✅ Page load events
- ✅ Scroll depth (25%, 50%, 75%, 100%)
- ✅ Engagement time (30s, 60s milestones)

**Implemented on:**

- Hero page
- Explorer page
- Dashboard page
- Calculator page

### Component-Specific Tracking

**Hero Page:**

- Hero view (when animation completes)
- System diagram view (intersection observer)
- "Explore System" CTA click

**Explorer Page:**

- Module opens ("Learn More" button clicks)
- Feature exploration ("Explore →" clicks)
- Navigation CTA clicks

**Calculator Page:**

- Input changes (team size, salary, campaigns)
- Calculation completion
- ROI values and savings recorded
- Hotjar recording tags with ROI data
- Calendly CTA clicks

**Dashboard Page:**

- Page load and engagement
- Scroll and interaction tracking

### Custom Analytics Hooks

**`usePageAnalytics(pageName)`**

- All-in-one page tracking
- Automatically tracks load, scroll, and engagement

**`useScrollDepthTracking()`**

- Tracks 25%, 50%, 75%, 100% scroll milestones
- Throttled for performance

**`useEngagementTimeTracking(pageName)`**

- Tracks time on page (30s, 60s)
- Logs total time on unmount

**`useViewTracking(sectionName)`**

- Intersection observer-based
- Tracks when sections come into view

### Event Testing

To test events in development:

1. Open browser console
2. Navigate through the app
3. Look for console logs:
   ```
   📊 Page Load: Hero
   📊 Scroll Depth: 25%
   📊 Engagement Time: 30s on Calculator
   📊 Section View: hero
   📊 [Hotjar] Event: calculator_complete
   ```

## GA4 ↔ Hotjar Integration

### Overview

FutureMarketingAI integrates Google Analytics 4 and Hotjar for unified cross-platform analysis. This integration enables:

- **Hotjar User ID in GA4**: Filter GA4 events by Hotjar sessions
- **GA4 Events in Hotjar**: Filter Hotjar recordings by GA4 events
- **Bidirectional Tracking**: Events sent to both platforms automatically
- **Session Correlation**: Link GA4 user behavior with Hotjar recordings

### How It Works

The integration runs automatically when both GA4 and Hotjar are initialized:

1. **Initialization** (in `App.tsx`):

   ```typescript
   useEffect(() => {
     initGA4()
     initHotjar()
     initAnalyticsIntegration() // ← Syncs platforms
   }, [])
   ```

2. **Hotjar User ID → GA4**:
   - Retrieves Hotjar's unique user identifier
   - Sets it as a custom dimension in GA4
   - Automatically included in all GA4 events

3. **Event Synchronization**:
   - All GA4 events are mirrored to Hotjar
   - Enables filtering recordings by event type
   - Correlate user behavior across platforms

### Setup: GA4 Custom Dimensions

To enable Hotjar User ID tracking in your GA4 dashboard:

1. **Go to GA4 Admin**:
   - Navigate to **Admin** → **Custom Definitions** → **Custom Dimensions**
   - Click **Create custom dimension**

2. **Configure the dimension**:

   ```
   Dimension name: Hotjar User ID
   Scope: User
   User property: hotjar_user_id
   Description: Hotjar session identifier for cross-platform analysis
   ```

3. **Save** and wait 24-48 hours for data to populate

### Benefits

**In GA4:**

- Filter events by Hotjar User ID
- Create segments based on Hotjar sessions
- Cross-reference GA4 metrics with specific recordings
- Analyze user paths before watching recordings

**In Hotjar:**

- Filter recordings by GA4 events (e.g., `calculator_complete`)
- Watch sessions that converted vs. bounced
- Identify friction points in high-value user journeys
- Tag recordings with GA4 event data

### Usage Examples

**Find Hotjar recordings for high-ROI calculations:**

1. In GA4, filter for `calculator_complete` events with `value > 400%`
2. Copy the `hotjar_user_id` custom dimension value
3. In Hotjar, filter recordings by that user ID
4. Watch the session to see what drove the high ROI

**Analyze drop-offs at specific events:**

1. In GA4, identify where users drop off (e.g., before `calendly_open`)
2. In Hotjar, filter recordings by users who triggered `cta_click` but not `calendly_open`
3. Watch recordings to identify UX issues

**Verify tracking accuracy:**

```typescript
import { getSyncedHotjarUserId, isIntegrationReady } from '@/utils/analytics'

// Check integration status
if (isIntegrationReady()) {
  const hjUserId = getSyncedHotjarUserId()
  console.log('Hotjar User ID:', hjUserId)
}
```

### Cross-Platform Event Tracking

Use `trackCrossPlatformEvent()` for guaranteed dual-platform tracking:

```typescript
import { trackCrossPlatformEvent } from '@/utils/analytics'

// Tracks in both GA4 and Hotjar
trackCrossPlatformEvent('custom_action', {
  category: 'User Engagement',
  value: 100,
})
```

This ensures the event appears in:

- GA4 Events dashboard (with Hotjar User ID)
- Hotjar recordings filter (for finding relevant sessions)

### Integration Console Logs

In development mode, the integration provides detailed logging:

```
✅ GA4 initialized in test mode
✅ Hotjar initialized (Site ID: 1234567)
🔗 Initializing GA4 ↔ Hotjar integration...
🔗 Hotjar User ID synced to GA4: hj_1234567
✅ GA4 ↔ Hotjar integration complete
```

### Troubleshooting

**Integration not working?**

1. Check console for initialization messages
2. Verify both `VITE_GA4_MEASUREMENT_ID` and `VITE_HOTJAR_ID` are set
3. Ensure `VITE_ENABLE_ANALYTICS=true`
4. Check that both platforms initialized successfully

**Hotjar User ID not in GA4?**

1. Wait 24-48 hours after setting up the custom dimension
2. Verify the custom dimension is configured correctly
3. Check that events include `hotjar_user_id` in console logs
4. Ensure you're viewing recent data (last 30 minutes in Realtime)

**Can't filter Hotjar recordings by GA4 events?**

1. Verify events are being sent to Hotjar (check console logs)
2. Wait a few minutes for Hotjar to process events
3. Use exact event names (e.g., `calculator_complete`, not `Calculator Complete`)
4. Check Hotjar dashboard → Recordings → Filters → Events

### Technical Implementation

The integration is implemented in `src/utils/analytics-integration.ts` and includes:

- **Automatic syncing**: Polls for Hotjar initialization, then syncs user ID
- **Custom dimensions**: Enriches all GA4 events with Hotjar data
- **Retry logic**: Attempts sync up to 10 times if Hotjar loads slowly
- **Type safety**: Full TypeScript support with proper types
- **Performance**: No impact on page load or user experience

### Data Flow Diagram

```
User Action
    ↓
Component Event Handler
    ↓
├─→ GA4 Event (with hotjar_user_id)
│   └─→ Custom Dimension: hotjar_user_id
│
└─→ Hotjar Event (for filtering)
    └─→ Recording tagged with event
```

### API Reference

```typescript
// Initialize integration (automatic in App.tsx)
initAnalyticsIntegration(): void

// Sync Hotjar User ID to GA4 manually
syncHotjarUserIdToGA4(): void

// Track event in both platforms
trackCrossPlatformEvent(eventName: string, params?: object): void

// Check integration status
isIntegrationReady(): boolean

// Get synced Hotjar User ID
getSyncedHotjarUserId(): string | null

// Custom dimension configuration
GA4_CUSTOM_DIMENSION_SETUP: {
  name: 'Hotjar User ID',
  scope: 'User',
  userProperty: 'hotjar_user_id',
  description: '...'
}
```

## Next Steps

After event tracking setup is complete:

- [x] Add Hotjar tracking (Task 27.2)
- [x] Configure event tracking (Task 27.3)
- [x] Integrate GA4 with Hotjar (Task 27.4)
- [ ] Validate all tracking (Task 27.5)

## Validation & Testing

For comprehensive validation procedures, see **[ANALYTICS-VALIDATION.md](./ANALYTICS-VALIDATION.md)**.

Quick validation in development:

```javascript
// In browser console
validateAnalytics()
```

## Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [react-ga4 Documentation](https://github.com/codler/react-ga4)
- [Hotjar Documentation](https://help.hotjar.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Analytics Validation Guide](./ANALYTICS-VALIDATION.md) - Comprehensive testing procedures
