import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CookieConsent from 'react-cookie-consent'
import { initGA4 } from '../../utils/ga4'
import { initHotjar } from '../../utils/hotjar'
import { initAnalyticsIntegration } from '../../utils/analytics-integration'

/**
 * CookieConsentBanner - GDPR/CCPA compliant cookie consent
 *
 * Displays cookie consent banner on first visit and conditionally
 * initializes analytics (GA4, Hotjar) only after user accepts.
 *
 * Legal Requirements:
 * - GDPR (EU): €20M fines for non-compliance
 * - CCPA (California): $7,500 per violation
 * - Must get consent BEFORE placing cookies
 *
 * Note: react-cookie-consent injects inline styles that override Tailwind.
 * All styling uses the library's style/buttonStyle/declineButtonStyle props.
 *
 * @returns Cookie consent banner component
 */
export function CookieConsentBanner() {
  const { t } = useTranslation('common')
  const [consentGiven, setConsentGiven] = useState(false)

  // Check if consent was previously given
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (consent === 'true') {
      setConsentGiven(true)
      // Initialize analytics if consent was previously given
      initializeAnalytics()
    }
  }, [])

  /**
   * Initialize all analytics platforms after consent
   */
  const initializeAnalytics = () => {
    try {
      void initGA4()
      void initHotjar()
      initAnalyticsIntegration()

      // Initialize Web Vitals in production
      if (import.meta.env.PROD) {
        import('../../utils/webVitals').then(({ initWebVitals }) => {
          initWebVitals()
        })
      }

      console.log('Analytics initialized after cookie consent')
    } catch (error) {
      console.error('Failed to initialize analytics:', error)
    }
  }

  /**
   * Handle user accepting cookies
   */
  const handleAccept = () => {
    setConsentGiven(true)
    localStorage.setItem('cookieConsent', 'true')
    initializeAnalytics()
  }

  /**
   * Handle user declining cookies
   */
  const handleDecline = () => {
    setConsentGiven(false)
    localStorage.setItem('cookieConsent', 'false')
    console.log('Analytics disabled - user declined cookies')
  }

  // Don't show banner if consent already given
  if (consentGiven) {
    return null
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText={t('cookie_consent.accept')}
      declineButtonText={t('cookie_consent.decline')}
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      cookieName="futuremarketingai-cookie-consent"
      expires={365} // 1 year
      overlay={false}
      containerClasses="cookie-consent-container"
      buttonClasses="cookie-consent-accept"
      declineButtonClasses="cookie-consent-decline"
      contentClasses="cookie-consent-content"
      style={{
        background: '#111520', // bg-bg-surface
        borderTop: '1px solid rgba(0, 212, 170, 0.2)', // accent-system teal border
        color: '#E8ECF4', // text-text-primary
        padding: '20px',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        zIndex: 9999,
      }}
      buttonStyle={{
        background: '#00D4AA', // accent-system teal
        color: '#0A0D14', // bg-bg-deep (dark text on teal)
        fontSize: '14px',
        fontWeight: '600',
        padding: '12px 24px',
        borderRadius: '0.125rem', // rounded-sm
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#9BA3B5', // text-text-secondary
        fontSize: '14px',
        fontWeight: '500',
        padding: '12px 24px',
        borderRadius: '0.125rem', // rounded-sm
        border: '1px solid rgba(90, 99, 120, 0.3)', // border-border-primary
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      contentStyle={{
        flex: '1 1 auto',
        margin: '0',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#E8ECF4', // text-text-primary
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-base" style={{ color: '#E8ECF4' }}>
          {t('cookie_consent.title')}
        </p>
        <p className="text-sm" style={{ color: '#9BA3B5' }}>
          {t('cookie_consent.description')}{' '}
          <a
            href="https://futuremarketingai.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#00D4AA' }}
            className="underline transition-colors hover:opacity-80"
          >
            {t('cookie_consent.privacy_policy')}
          </a>
        </p>
      </div>
    </CookieConsent>
  )
}

export default CookieConsentBanner
