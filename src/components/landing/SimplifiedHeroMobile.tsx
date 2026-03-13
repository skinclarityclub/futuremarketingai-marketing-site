/**
 * SimplifiedHeroMobile - Mobile-specific Hero component
 *
 * Living System Full Rebuild: DM Sans body, Space Grotesk headings,
 * warm gradient CTAs, blob background, no grid/particle layers.
 *
 * DESKTOP-FIRST COMPLIANT
 * - This is a NEW mobile component, completely separate from desktop Hero
 * - Used via conditional rendering: {isMobile ? <SimplifiedHeroMobile /> : <Hero />}
 * - Desktop Hero remains 100% unchanged and unaffected
 *
 * CONTENT PARITY COMPLIANT
 * - Uses EXACT same translation keys as desktop Hero (landing.hero_landing.*)
 * - NEVER creates new content - only adapts layout/presentation
 * - Same data, different UI
 */

import { useTranslation } from 'react-i18next'
import { ArrowRight, Zap } from 'lucide-react'
import { CTAButton } from '../common'
import { useNavigate } from 'react-router-dom'

interface SimplifiedHeroMobileProps {
  className?: string
}

export function SimplifiedHeroMobile({ className = '' }: SimplifiedHeroMobileProps) {
  const { t } = useTranslation('common')
  const navigate = useNavigate()

  return (
    <section
      className={`relative min-h-screen flex flex-col justify-center px-6 py-16 overflow-hidden ${className}`}
      aria-label="Hero section"
    >
      {/* Simplified blob background for mobile — single warm blob, lightweight */}
      <div
        className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-[0.08] blur-[100px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(245, 166, 35, 0.8) 0%, rgba(232, 148, 26, 0.4) 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2.5 mb-6"
          style={{ animation: 'fadeIn 0.6s ease-out both' }}
        >
          <div className="relative">
            <div
              className="w-2.5 h-2.5 rounded-full bg-accent-system animate-pulse"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-accent-system blur-sm opacity-75"
              aria-hidden="true"
            />
          </div>
          <span className="font-mono text-xs tracking-wider uppercase text-accent-system">
            {t('landing.hero_landing.badge')}
          </span>
        </div>

        {/* Headline */}
        <div style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
          <h1 className="text-3xl font-display font-bold text-text-primary mb-3 leading-tight">
            <span className="block">{t('landing.hero_landing.main_headline')}</span>
            <span className="block bg-gradient-flow bg-clip-text text-transparent">
              {t('landing.hero_landing.sub_headline')}
            </span>
          </h1>
        </div>

        {/* Description */}
        <p
          className="text-base text-text-secondary leading-relaxed mb-8 max-w-md mx-auto"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          {t('landing.hero_landing.description')}
        </p>

        {/* CTA Buttons — stacked vertically */}
        <div
          className="flex flex-col gap-3 mb-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
        >
          {/* Primary CTA */}
          <CTAButton
            size="lg"
            onClick={() => navigate('/demo-intro')}
            className="w-full justify-center h-14"
          >
            <Zap className="mr-2 h-5 w-5" />
            {t('landing.hero_landing.cta.primary')}
          </CTAButton>

          {/* Secondary CTA */}
          <CTAButton
            variant="secondary"
            size="lg"
            onClick={() => (window.location.href = '/pricing')}
            className="w-full justify-center h-14"
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            {t('landing.hero_landing.cta.secondary')}
          </CTAButton>
        </div>
      </div>
    </section>
  )
}

SimplifiedHeroMobile.displayName = 'SimplifiedHeroMobile'
