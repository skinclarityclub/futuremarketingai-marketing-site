'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import CookieConsent from 'react-cookie-consent'

/**
 * CookieConsentBanner -- GDPR-compliant cookie consent banner.
 *
 * Renders a bottom-fixed banner with accept/decline buttons.
 * Guarded with mounted state to prevent SSR hydration mismatch.
 * Analytics initialization deferred to Phase 6.
 */
export function CookieConsentBanner() {
  const t = useTranslations('common')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleAccept = () => {
    // Analytics initialization deferred to Phase 6
  }

  const handleDecline = () => {
    // Analytics opt-out deferred to Phase 6
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
      expires={365}
      overlay={false}
      style={{
        background: '#050814',
        borderTop: '1px solid rgba(0, 212, 255, 0.2)',
        color: '#E8ECF4',
        padding: '20px',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        zIndex: 9999,
      }}
      buttonStyle={{
        background: '#00D4FF',
        color: '#050814',
        fontSize: '14px',
        fontWeight: '600',
        padding: '12px 24px',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#9BA3B5',
        fontSize: '14px',
        fontWeight: '500',
        padding: '12px 24px',
        borderRadius: '0.375rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      contentStyle={{
        flex: '1 1 auto',
        margin: '0',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#E8ECF4',
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-base" style={{ color: '#E8ECF4' }}>
          {t('cookie_consent.title')}
        </p>
        <p className="text-sm" style={{ color: '#9BA3B5' }}>
          {t('cookie_consent.description')}
        </p>
      </div>
    </CookieConsent>
  )
}

export default CookieConsentBanner
