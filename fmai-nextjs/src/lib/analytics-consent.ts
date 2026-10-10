/**
 * GA4 with basic Consent Mode v2: gtag.js is not loaded until the visitor grants
 * analytics consent, so nothing reaches Google before that — not even the cookieless
 * pings advanced mode sends (Tw 11.7a; AP rule: no tracking before consent).
 *
 * Every other gtag call on the site guards on `typeof window.gtag === 'function'`,
 * so those events drop silently until consent is given. Marketing consent drives
 * nothing: there are no ad pixels, so the ad signals stay denied.
 */

const GA_ID = 'G-08FEWKC77B'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function applyAnalyticsConsent(granted: boolean): void {
  // Google's documented kill switch: stops hits from an already loaded tag, so a
  // revocation also silences the rest of the current page view.
  ;(window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = !granted

  if (!granted) {
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
    clearGaCookies()
    return
  }
  if (window.gtag) {
    window.gtag('consent', 'update', { analytics_storage: 'granted' })
    return
  }

  const dataLayer = (window.dataLayer = window.dataLayer || [])
  window.gtag = function gtag() {
    // gtag.js only processes Arguments objects, not arrays.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments)
  }
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })
  window.gtag('consent', 'update', { analytics_storage: 'granted' })
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
}

// gtag sets _ga and _ga_<id> on the widest domain it can (.future-marketing.ai), so
// expire them host-only and on every parent domain; the browser ignores the misses.
function clearGaCookies(): void {
  const parts = window.location.hostname.split('.')
  for (const pair of document.cookie.split('; ')) {
    const name = pair.split('=')[0]
    if (name !== '_ga' && !name.startsWith('_ga_')) continue
    document.cookie = `${name}=; Max-Age=0; path=/`
    for (let i = 0; i < parts.length; i++) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${parts.slice(i).join('.')}`
    }
  }
}
