'use client'

import { useTranslations } from 'next-intl'

/**
 * CookieReopenButton — footer link that re-opens the consent banner.
 *
 * Dispatches the `fmai:cookie-reopen` window event. ClientIslands and
 * CookieConsentBanner both listen for it: the banner remounts (or shows
 * again if already mounted) and pre-expands the granular toggles so the
 * user lands directly on the customise view, not the simple summary.
 *
 * Lives in its own client component so the parent Footer can stay a
 * server component (loads the bulk of the footer from getTranslations
 * without shipping a client bundle for static nav links).
 */
export function CookieReopenButton() {
  const t = useTranslations('common.cookie_consent')

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('fmai:cookie-reopen'))}
      className="text-xs text-text-muted hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
    >
      {t('reopenLink')}
    </button>
  )
}
