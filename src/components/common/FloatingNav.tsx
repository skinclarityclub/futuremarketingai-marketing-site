import React, { useState, lazy, Suspense } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useCalendlyBooking } from '../../hooks'
import { trackCTAClick } from '../../utils/analytics'
import { usePersonalizationStore } from '../../stores'
import { CalendlyFunnelSession } from '../../utils/calendlyFunnelTracking'

// Lazy load CalendlyModal
const CalendlyModal = lazy(() =>
  import('./CalendlyModal').then((module) => ({ default: module.CalendlyModal }))
)

/**
 * FloatingNav - Premium floating navigation sidebar
 *
 * Features:
 * - Quick access to all main sections
 * - Active state indicators
 * - CTA button for appointments
 * - Glass morphism design
 * - Responsive (sidebar on desktop, bottom nav on mobile)
 */

interface NavItem {
  id: string
  label: string
  path: string
  icon: React.ReactNode
  description: string
}

export const FloatingNav: React.FC = () => {
  const { t } = useTranslation(['navigation', 'common'])
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const calendly = useCalendlyBooking()
  const { icpScore } = usePersonalizationStore()
  const funnelSessionRef = React.useRef<CalendlyFunnelSession | null>(null)

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: t('navigation:main.home'),
      path: '/demo',
      description: t('navigation:descriptions.home'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: 'explorer',
      label: t('navigation:main.explorer'),
      path: '/explorer',
      description: t('navigation:descriptions.explorer'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
          />
        </svg>
      ),
    },
    {
      id: 'dashboard',
      label: t('navigation:main.dashboard'),
      path: '/dashboard',
      description: t('navigation:descriptions.dashboard'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: 'calculator',
      label: t('navigation:main.calculator'),
      path: '/calculator',
      description: t('navigation:descriptions.calculator'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 'ad-builder',
      label: t('navigation:main.ad_builder'),
      path: '/ad-builder',
      description: t('navigation:descriptions.ad_builder'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleCTAClick = () => {
    const icpTier = icpScore?.overall
      ? icpScore.overall >= 80
        ? 'enterprise'
        : icpScore.overall >= 60
          ? 'strategic'
          : icpScore.overall >= 40
            ? 'standard'
            : 'discovery'
      : 'unknown'

    funnelSessionRef.current = new CalendlyFunnelSession({
      source: 'floating_nav_cta',
      eventType: calendly.eventType.id,
      icpScore: icpScore?.overall || 0,
      icpTier,
    })

    funnelSessionRef.current.trackStep('booking_prompt_shown')
    funnelSessionRef.current.trackStep('booking_cta_clicked')

    calendly.open('Floating Nav CTA')
    trackCTAClick(t('common:cta.book_appointment'), 'Floating Nav')
  }

  const handleCalendlyClose = React.useCallback(() => {
    if (funnelSessionRef.current) {
      funnelSessionRef.current.abandon('user_closed_modal')
      funnelSessionRef.current = null
    }
    calendly.close()
  }, [calendly])

  // Listen for Calendly events
  React.useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled' && funnelSessionRef.current) {
        funnelSessionRef.current.complete()
        funnelSessionRef.current = null
      }
    }

    if (calendly.isOpen) {
      window.addEventListener('message', handleCalendlyEvent)
      return () => window.removeEventListener('message', handleCalendlyEvent)
    }

    return undefined
  }, [calendly.isOpen])

  return (
    <>
      {/* Desktop Sidebar - Left Side */}
      <motion.div
        className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-3"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Navigation Items + CTA in one container */}
        <div
          className="flex flex-col gap-2 p-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl"
          style={{ background: 'rgba(0, 0, 0, 0.4)' }}
        >
          {navItems.map((item) => {
            const active = isActive(item.path)

            return (
              <Link
                key={item.id}
                to={item.path}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <motion.div
                  className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                    active
                      ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/30 border-accent-primary'
                      : 'text-white/70 hover:text-white hover:border-accent-primary/30 border-white/10'
                  }`}
                  style={!active ? { background: 'rgba(0, 0, 0, 0.3)' } : undefined}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                </motion.div>

                {/* Tooltip on Hover */}
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <motion.div
                      className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl border border-white/10 shadow-xl whitespace-nowrap"
                      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-sm font-semibold text-white">{item.label}</div>
                      <div className="text-xs text-white/60">{item.description}</div>
                      {/* Arrow */}
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 w-2 h-2 border-l border-t border-white/10"
                        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}

          {/* Divider */}
          <div className="h-px my-1" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />

          {/* CTA Button - Integrated in nav container */}
          <motion.button
            onClick={handleCTAClick}
            onMouseEnter={() => setHoveredItem('book')}
            onMouseLeave={() => setHoveredItem(null)}
            className="relative w-14 h-14 rounded-xl border border-accent-primary/40 text-white/90 hover:border-accent-primary transition-all flex items-center justify-center cta-pulse"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            whileHover={{
              scale: 1.08,
              background:
                'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(167, 139, 250, 0.15))',
              transition: { duration: 0.15 },
            }}
            whileTap={{
              scale: 0.96,
              transition: { duration: 0.1 },
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            {/* Tooltip for Book button */}
            <AnimatePresence>
              {hoveredItem === 'book' && (
                <motion.div
                  className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl border border-white/10 shadow-xl whitespace-nowrap"
                  style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-sm font-semibold text-white">
                    {t('common:cta.book_appointment')}
                  </div>
                  <div className="text-xs text-white/60">{t('common:cta.schedule_demo')}</div>
                  {/* Arrow */}
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-45 w-2 h-2 border-l border-t border-white/10"
                    style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Bottom Nav */}
      <motion.div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div
          className="mb-4 flex items-center gap-2 p-2 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl"
          style={{ background: 'rgba(0, 0, 0, 0.4)' }}
        >
          {/* Nav Items */}
          {navItems.map((item) => {
            const active = isActive(item.path)

            return (
              <Link key={item.id} to={item.path} className="flex-1">
                <motion.div
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
                    active
                      ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/30'
                      : 'bg-transparent text-white/70'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-6 h-6">{item.icon}</div>
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </motion.div>
              </Link>
            )
          })}

          {/* CTA Button on Mobile - Subtle version */}
          <motion.button
            onClick={handleCTAClick}
            className="flex-1 flex flex-col items-center gap-1 py-2 px-3 rounded-xl border border-accent-primary/40 text-white/90 cta-pulse"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.96, transition: { duration: 0.1 } }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[10px] font-semibold">{t('common:cta.book')}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Calendly Modal - Lazy loaded for performance */}
      {calendly.isOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
              <div
                className="bg-white rounded-lg p-6 shadow-xl"
                style={{ background: 'rgba(0, 0, 0, 0.4)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-900 dark:text-gray-100">
                    {t('common:loading.scheduling')}
                  </p>
                </div>
              </div>
            </div>
          }
        >
          <CalendlyModal
            isOpen={calendly.isOpen}
            onClose={handleCalendlyClose}
            url={calendly.calendlyUrl}
            prefill={calendly.prefillData}
          />
        </Suspense>
      )}
    </>
  )
}

export default FloatingNav
