/**
 * useDemoRedirect - Hook to intercept demo navigation on mobile
 * Shows DesktopOnlyNotice modal instead of navigating to demo pages
 */

import { useState, useCallback } from 'react'
import { useIsMobile } from './useMediaQuery'

interface UseDemoRedirectReturn {
  /** Show modal state */
  showDesktopNotice: boolean
  /** Open demo (checks if mobile and shows notice, or navigates to demo) */
  openDemo: (pageName?: 'explorer' | 'calculator' | 'dashboard' | 'demo') => void
  /** Close the desktop notice modal */
  closeDesktopNotice: () => void
  /** Page name for the notice */
  noticePage: string
}

/**
 * Hook to handle demo navigation with mobile redirect
 *
 * Usage:
 * ```tsx
 * const { showDesktopNotice, openDemo, closeDesktopNotice, noticePage } = useDemoRedirect()
 *
 * // In your button:
 * <Button onClick={() => openDemo('explorer')}>Try Demo</Button>
 *
 * // In your render:
 * {showDesktopNotice && (
 *   <DesktopOnlyNoticeModal
 *     pageName={noticePage}
 *     onClose={closeDesktopNotice}
 *   />
 * )}
 * ```
 */
export function useDemoRedirect(): UseDemoRedirectReturn {
  const isMobile = useIsMobile()
  const [showDesktopNotice, setShowDesktopNotice] = useState(false)
  const [noticePage, setNoticePage] = useState('demo')

  const openDemo = useCallback(
    (pageName: 'explorer' | 'calculator' | 'dashboard' | 'demo' = 'demo') => {
      // Track CTA click
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'demo_cta_click', {
          event_category: 'navigation',
          event_label: `mobile_${pageName}`,
          value: 1,
        })
      }

      if (isMobile) {
        // Mobile: Show desktop notice modal
        setNoticePage(pageName)
        setShowDesktopNotice(true)
      } else {
        // Desktop: Open in new window (simple - browser handles it)
        const routes: Record<string, string> = {
          explorer: '/explorer',
          calculator: '/calculator',
          dashboard: '/dashboard',
          demo: '/demo',
        }

        // Simple window.open - browser will open new tab/window based on user settings
        window.open(routes[pageName], '_blank')
      }
    },
    [isMobile]
  )

  const closeDesktopNotice = useCallback(() => {
    setShowDesktopNotice(false)
  }, [])

  return {
    showDesktopNotice,
    openDemo,
    closeDesktopNotice,
    noticePage,
  }
}
