# Monitoring & Error Tracking

This document describes the monitoring and error tracking setup for FutureMarketingAI using Sentry.

## Overview

We use [Sentry](https://sentry.io) for real-time error tracking, performance monitoring, and session replay across all environments.

## Configuration

### Environment Setup

Sentry is configured with environment-specific DSNs (Data Source Names) to separate error tracking by environment:

- **Production**: `futuremarketingai.com` domain
- **Staging**: Vercel preview deployments (\*.vercel.app)
- **Development**: localhost

### Environment Variables

Configure the following environment variables in your `.env.local` file for local development:

```bash
# Sentry DSNs (get these from https://sentry.io/settings/projects/)
VITE_SENTRY_DSN_PRODUCTION=https://your-production-dsn@sentry.io/project-id
VITE_SENTRY_DSN_STAGING=https://your-staging-dsn@sentry.io/project-id
VITE_SENTRY_DSN_DEVELOPMENT=https://your-dev-dsn@sentry.io/project-id

# Optional: Enable debug mode in development
VITE_SENTRY_DEBUG=true

# Application version for release tracking
VITE_APP_VERSION=1.0.0
```

### Vercel Configuration

For production and staging deployments on Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add the following variables:
   - `VITE_SENTRY_DSN_PRODUCTION` (Production environment only)
   - `VITE_SENTRY_DSN_STAGING` (Preview environment)
   - `VITE_APP_VERSION` (All environments)

## Features

### 1. Error Tracking

All unhandled errors and exceptions are automatically captured and sent to Sentry with:

- Full stack traces
- Browser and OS information
- User context (if authenticated)
- Custom breadcrumbs for debugging

### 2. Performance Monitoring

Sentry tracks:

- Page load performance
- Component render times
- API call durations
- Navigation performance

Sample rates:

- **Production**: 10% of transactions (to control costs)
- **Staging**: 100% of transactions
- **Development**: 100% of transactions (if DSN configured)

### 3. Session Replay

Records user sessions when errors occur:

- **Production**: 10% of normal sessions, 100% of error sessions
- **Staging**: 50% of normal sessions, 100% of error sessions
- Privacy: Text masking and media blocking can be configured

### 4. Error Filtering

Automatically filters out non-critical errors:

- Browser extension errors
- Ad blocker errors
- ResizeObserver errors
- Network errors from third-party scripts
- Chunk loading errors (often from ad blockers)

## Usage

### Basic Usage

Sentry is automatically initialized in `src/main.tsx`. No additional setup is needed for basic error tracking.

### Manual Error Capture

```typescript
import { captureException, captureMessage } from './config/sentry'

// Capture an exception
try {
  // Your code
} catch (error) {
  captureException(error, {
    feature: 'calculator',
    action: 'calculate',
  })
}

// Capture a message
captureMessage('User completed onboarding', 'info', {
  userId: '123',
  plan: 'premium',
})
```

### User Context

```typescript
import { setUserContext, clearUserContext } from './config/sentry'

// Set user context (e.g., after login)
setUserContext({
  id: '123',
  email: 'user@example.com',
  username: 'john_doe',
  subscription: 'premium',
})

// Clear user context (e.g., on logout)
clearUserContext()
```

### Breadcrumbs

Add custom breadcrumbs for better debugging:

```typescript
import { addBreadcrumb } from './config/sentry'

addBreadcrumb({
  message: 'User clicked calculate button',
  category: 'user-action',
  level: 'info',
  data: {
    budget: 5000,
    industry: 'Technology',
  },
})
```

### Performance Monitoring

```typescript
import { startTransaction } from './config/sentry'

const transaction = startTransaction('data-fetch', 'http.request', 'Fetch user dashboard data')

try {
  const data = await fetchDashboardData()
  transaction.setStatus('ok')
} catch (error) {
  transaction.setStatus('internal_error')
  throw error
} finally {
  transaction.finish()
}
```

## Testing

### Test Sentry Integration

To verify Sentry is working correctly:

1. **Development Testing**:

   ```typescript
   // Add this button temporarily in your component
   <button onClick={() => {
     throw new Error('Sentry Test Error');
   }}>
     Test Sentry
   </button>
   ```

2. **Check Sentry Dashboard**:
   - Go to https://sentry.io
   - Navigate to your project
   - Check the Issues tab for the test error

3. **Verify Environment**:
   - Ensure the error is tagged with the correct environment
   - Check that user context, breadcrumbs, and stack traces are captured

### Staging/Production Testing

For staging and production, use the test error button (only visible to admins):

```typescript
// In your admin panel or debug menu
import { captureException } from './config/sentry'

const testSentry = () => {
  try {
    throw new Error('Sentry Production Test - ' + new Date().toISOString())
  } catch (error) {
    captureException(error, {
      test: true,
      environment: import.meta.env.MODE,
    })
  }
}
```

## Best Practices

### 1. Context is Key

Always add relevant context when capturing errors:

```typescript
captureException(error, {
  feature: 'payment',
  userId: user.id,
  action: 'checkout',
  amount: total,
})
```

### 2. Use Breadcrumbs

Add breadcrumbs for critical user actions:

```typescript
addBreadcrumb({
  message: 'User initiated checkout',
  category: 'checkout',
  data: { items: cart.items.length },
})
```

### 3. Set User Context Early

Set user context as soon as authentication completes:

```typescript
useEffect(() => {
  if (user) {
    setUserContext({
      id: user.id,
      email: user.email,
      plan: user.subscription.plan,
    })
  }
}, [user])
```

### 4. Clean Up on Logout

Always clear user context on logout:

```typescript
const handleLogout = () => {
  clearUserContext()
  // ... rest of logout logic
}
```

### 5. Monitor Performance

Track critical user flows:

```typescript
const transaction = startTransaction('calculator', 'user-flow')
// ... user completes calculator
transaction.finish()
```

## Troubleshooting

### Errors Not Appearing in Sentry

1. **Check DSN Configuration**:
   - Verify the DSN is correctly set in environment variables
   - Ensure the DSN matches your Sentry project

2. **Check Environment Detection**:
   - Console should show: `[Sentry] Initialized for <environment> environment`
   - If not, check `getEnvironment()` logic in `src/config/sentry.ts`

3. **Check Error Filtering**:
   - Your error might be filtered out by `beforeSend` or `ignoreErrors`
   - Temporarily disable filtering to test

4. **Check Network**:
   - Open browser DevTools → Network tab
   - Look for requests to `sentry.io`
   - Check for any blocked requests (ad blockers might interfere)

### High Error Volume

If you're seeing too many errors:

1. **Adjust Sample Rates**:

   ```typescript
   tracesSampleRate: 0.1, // Reduce from 1.0 to 0.1 (10%)
   ```

2. **Add More Filters**:

   ```typescript
   ignoreErrors: [
     'Your specific error pattern',
     /regex pattern/,
   ],
   ```

3. **Improve Error Handling**:
   - Catch and handle expected errors gracefully
   - Only send unexpected errors to Sentry

### Session Replay Not Working

1. **Check Sample Rates**:
   - Session replay requires explicit sampling
   - Errors always have 100% replay sample rate

2. **Check Privacy Settings**:
   - Ensure `maskAllText` and `blockAllMedia` are configured correctly
   - Some content might be blocked by privacy settings

3. **Browser Compatibility**:
   - Session replay requires modern browsers
   - Check browser support at https://docs.sentry.io/platforms/javascript/session-replay/

## Security Considerations

### 1. Sensitive Data

Never log sensitive information:

- Passwords
- Credit card numbers
- Personal identification numbers
- API keys or tokens

### 2. PII (Personally Identifiable Information)

Be cautious with user data:

- Email addresses: ✅ Safe (useful for debugging)
- Full names: ⚠️ Consider if necessary
- Phone numbers: ❌ Avoid
- Addresses: ❌ Avoid

### 3. DSN Security

- DSNs are public but rate-limited by Sentry
- Never expose admin/auth tokens in client code
- Use separate DSNs per environment
- Rotate DSNs if compromised

### 4. Data Scrubbing

Sentry automatically scrubs common sensitive patterns:

- Credit card numbers
- Social security numbers
- Passwords in fields named `password`, `passwd`, etc.

Configure additional scrubbing in Sentry Dashboard → Settings → Security & Privacy

## Cost Management

### Sample Rate Strategy

- **Production**: Low sample rate (10%) to control costs
- **Staging**: High sample rate (100%) for thorough testing
- **Development**: High sample rate (100%) for debugging

### Quota Alerts

Set up quota alerts in Sentry Dashboard:

1. Go to Settings → Quotas & Rate Limits
2. Set alert thresholds (e.g., 80% of quota)
3. Configure notification channels

### Error Grouping

Sentry automatically groups similar errors. Configure grouping:

1. Go to Project Settings → Issue Grouping
2. Adjust grouping algorithms
3. Merge duplicate issues manually if needed

## Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Sentry React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/performance/)
- [Session Replay](https://docs.sentry.io/platforms/javascript/session-replay/)
- [Best Practices](https://docs.sentry.io/product/best-practices/)

## Support

For issues or questions:

1. Check [Sentry Status Page](https://status.sentry.io/)
2. Search [Sentry Forum](https://forum.sentry.io/)
3. Contact Sentry Support (if on paid plan)
4. Internal: Contact DevOps team

---

**Last Updated**: January 2025  
**Maintained By**: DevOps Team  
**Sentry Version**: @sentry/react ^7.x
