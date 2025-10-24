/**
 * SimplifiedHeroMobile - Mobile-specific Hero component
 *
 * Desktop-first compliant: This is a NEW mobile component, separate from desktop Hero.
 * Used via conditional rendering: {isMobile ? <SimplifiedHeroMobile /> : <Hero />}
 *
 * Requirements:
 * - Concise headline (max 10 words)
 * - Value proposition
 * - Single full-width CTA (56px height - WCAG AAA)
 * - Dismissible "Best on Desktop" badge
 * - No complex animations
 */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, X } from 'lucide-react'

interface SimplifiedHeroMobileProps {
  className?: string
}

export function SimplifiedHeroMobile({ className = '' }: SimplifiedHeroMobileProps) {
  const { t } = useTranslation()
  const [showDesktopBadge, setShowDesktopBadge] = useState(true)

  // Load badge dismissal state from sessionStorage
  useEffect(() => {
    const dismissed = sessionStorage.getItem('desktop-badge-dismissed')
    if (dismissed === 'true') {
      setShowDesktopBadge(false)
    }
  }, [])

  // Handle badge dismissal
  const handleDismissBadge = () => {
    setShowDesktopBadge(false)
    sessionStorage.setItem('desktop-badge-dismissed', 'true')
  }

  // Enforce 10-word limit on headline
  const headline = t('mobile.hero.headline', 'Transform Marketing with AI Intelligence')
  const words = headline.split(' ')
  // Validate 10-word limit (development only)
  if (words.length > 10 && process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn(`SimplifiedHeroMobile: Headline exceeds 10 words (${words.length} words)`)
  }

  return (
    <section
      className={`relative min-h-[60vh] flex flex-col justify-center px-6 py-12 ${className}`}
      aria-label="Hero section"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary -z-10" />

      {/* Best on Desktop Badge (dismissible) */}
      {showDesktopBadge && (
        <div className="mb-6 flex items-center justify-between bg-blue-500/10 border border-blue-400/20 rounded-lg px-4 py-3">
          <span className="text-sm text-blue-200">
            {t('mobile.hero.desktopBadge', '✨ Best experience on desktop')}
          </span>
          <button
            onClick={handleDismissBadge}
            className="p-1 hover:bg-blue-400/20 rounded transition-colors touch-manipulation"
            aria-label="Dismiss desktop notification"
            type="button"
          >
            <X className="w-4 h-4 text-blue-200" />
          </button>
        </div>
      )}

      {/* Headline */}
      <h1 className="text-4xl font-bold text-text-primary mb-4 leading-tight">{headline}</h1>

      {/* Value Proposition */}
      <p className="text-lg text-text-secondary mb-6 leading-relaxed">
        {t(
          'mobile.hero.valueProp',
          'Discover AI-powered marketing automation that drives real results.'
        )}
      </p>

      {/* Trust Indicators */}
      <div className="flex items-center gap-4 mb-8 text-sm text-text-muted">
        <div className="flex items-center gap-1">
          <span className="text-green-400">✓</span>
          <span>{t('mobile.hero.trust1', 'No credit card')}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-green-400">✓</span>
          <span>{t('mobile.hero.trust2', 'Free trial')}</span>
        </div>
      </div>

      {/* Single CTA Button - Full width, 56px height (WCAG AAA) */}
      <button
        className="
          w-full h-14 
          bg-gradient-to-r from-accent-primary to-accent-secondary
          hover:from-accent-primary/90 hover:to-accent-secondary/90
          text-white font-semibold rounded-lg
          flex items-center justify-center gap-2
          transition-all duration-200
          shadow-lg hover:shadow-xl
          touch-manipulation
          min-h-touch
        "
        aria-label={t('mobile.hero.cta', 'Explore AI Marketing')}
        type="button"
      >
        <span>{t('mobile.hero.cta', 'Explore AI Marketing')}</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Status Indicator (subtle) */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
        <div
          className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
          aria-label="Active status"
        />
        <span>{t('mobile.hero.status', 'Live demo available')}</span>
      </div>
    </section>
  )
}

SimplifiedHeroMobile.displayName = 'SimplifiedHeroMobile'
