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
      ariaAcceptLabel={t('cookie_consent.accept')}
      ariaDeclineLabel={t('cookie_consent.decline')}
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
      cookieName="futuremarketingai-cookie-consent"
      expires={365}
      overlay={false}
      style={{
        background: 'var(--color-bg-deep)',
        borderTop: '1px solid var(--color-border-accent)',
        color: 'var(--color-text-primary)',
        padding: '20px',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        zIndex: 9999,
      }}
      buttonStyle={{
        background: 'var(--color-accent-system)',
        color: 'var(--color-bg-deep)',
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
        color: 'var(--color-text-secondary)',
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
        color: 'var(--color-text-primary)',
      }}
    >
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-base" style={{ color: 'var(--color-text-primary)' }}>
          {t('cookie_consent.title')}
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {t('cookie_consent.description')}
        </p>
      </div>
    </CookieConsent>
  )
}

export default CookieConsentBanner
