/**
 * Hero Section Component
 * Left-aligned editorial layout with OrbitVisual decoration.
 * 2x2 numbered service card grid with gradient border hover.
 *
 * Living System rebuild: no Framer Motion background layers,
 * global GradientMesh handles background via LandingPage.
 */

import React, { lazy, Suspense, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { Zap, Loader2 } from 'lucide-react'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { useDemoRedirect } from '../../hooks/useDemoRedirect'
import { SimplifiedHeroMobile } from './SimplifiedHeroMobile'
import { MobileDemoHome } from '../mobile/MobileDemoHome'
import { CTAButton, OrbitVisual } from '../common'

const VisionTimeline = lazy(() =>
  import('../common/VisionTimeline').then((m) => ({ default: m.VisionTimeline }))
)

/** Service card data — order: 01 Automations, 02 Chatbots, 03 Voice Agents, 04 Marketing Machine */
const SERVICE_CARDS = [
  {
    number: '01',
    nameKey: 'landing.hero_landing.services.automations.name',
    pitchKey: 'landing.hero_landing.services.automations.pitch',
    href: '/automations',
  },
  {
    number: '02',
    nameKey: 'landing.hero_landing.services.chat.name',
    pitchKey: 'landing.hero_landing.services.chat.pitch',
    href: '/chatbots',
  },
  {
    number: '03',
    nameKey: 'landing.hero_landing.services.voice.name',
    pitchKey: 'landing.hero_landing.services.voice.pitch',
    href: '/voice-agents',
  },
  {
    number: '04',
    nameKey: 'landing.hero_landing.services.marketing.name',
    pitchKey: 'landing.hero_landing.services.marketing.pitch',
    href: '/marketing-machine',
  },
]

export const Hero: React.FC = () => {
  const isMobile = useIsMobile()
  const location = useLocation()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const controls = useAnimation()
  const { t } = useTranslation('common')
  useDemoRedirect()

  React.useEffect(() => {
    if (isInView) {
      void controls.start('visible')
    }
  }, [isInView, controls])

  // Desktop-first: Render mobile variants for mobile devices
  if (isMobile) {
    if (location.pathname === '/demo-home' || location.pathname === '/demo') {
      return <MobileDemoHome />
    }
    return <SimplifiedHeroMobile />
  }

  return (
    <section ref={ref} className="relative bg-bg-deep">
      {/* Hero area — left-aligned content with orbit visual */}
      <div className="relative min-h-screen flex items-center px-12 pt-[140px] pb-20">
        {/* Left-aligned Hero Content */}
        <div className="relative z-10 max-w-[720px]">
          {/* Eyebrow — accent line + text */}
          <div
            className="inline-flex items-center gap-2.5 text-[13px] font-medium text-accent-system tracking-wide mb-8 before:content-[''] before:block before:w-6 before:h-px before:bg-accent-system"
            style={{ animation: 'fadeIn 0.8s ease-out' }}
          >
            {t('landing.hero_landing.badge')}
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
          >
            <span className="block text-text-primary">
              {t('landing.hero_landing.main_headline')}
            </span>
            <span className="relative inline-block bg-gradient-flow bg-clip-text text-transparent after:content-[''] after:absolute after:bottom-[2px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-accent-human after:to-transparent after:rounded-sm">
              {t('landing.hero_landing.sub_headline')}
            </span>
          </h1>

          {/* Description */}
          <p
            className="text-lg lg:text-xl text-text-secondary max-w-xl mb-6 leading-relaxed"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
          >
            {t('landing.hero_landing.description')}
          </p>

          {/* Trust Anchor */}
          <p
            className="text-sm text-text-muted mb-10"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.5s both' }}
          >
            {t('landing.hero_landing.trust_anchor')}
          </p>

          {/* CTA Buttons — left-aligned */}
          <div
            className="flex flex-wrap gap-4"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
          >
            <CTAButton size="lg" href="#services" arrow>
              <Zap className="mr-2 h-5 w-5" />
              {t('landing.hero_landing.cta.primary')}
            </CTAButton>

            <CTAButton variant="secondary" size="lg" calendly arrow>
              {t('landing.hero_landing.cta.secondary')}
            </CTAButton>
          </div>
        </div>

        {/* Orbit Visual — right side, desktop only */}
        <OrbitVisual />
      </div>

      {/* Service Cards Grid — 2x2 numbered layout */}
      <motion.div
        id="services"
        className="relative z-10 px-12 pb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            {t('landing.hero_landing.services.title')}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t('landing.hero_landing.services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {SERVICE_CARDS.map((service) => (
            <Link
              key={service.href}
              to={service.href}
              className="relative card-gradient-border rounded-card bg-white/[0.02] border border-border-primary p-11 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] cursor-pointer block group"
            >
              {/* Service number */}
              <span className="font-display text-xs font-semibold text-text-muted tracking-[2px] mb-5 block">
                {service.number}
              </span>

              {/* Title */}
              <h3 className="font-display text-2xl font-bold text-text-primary tracking-tight mb-3.5">
                {t(service.nameKey)}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-secondary leading-relaxed max-w-[380px]">
                {t(service.pitchKey)}
              </p>

              {/* Arrow circle — bottom-right */}
              <div className="absolute bottom-9 right-9 w-10 h-10 rounded-full border border-border-primary flex items-center justify-center transition-all duration-300 group-hover:bg-accent-human group-hover:border-accent-human">
                <svg
                  className="w-4 h-4 text-text-muted transition-all duration-300 group-hover:text-bg-deep group-hover:translate-x-0.5"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 12L12 4M12 4H6M12 4V10" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Light CTA after service cards */}
        <div className="text-center mt-12">
          <p className="text-text-secondary mb-6">{t('landing.hero_landing.final_cta.subtitle')}</p>
          <CTAButton size="lg" calendly arrow>
            {t('landing.hero_landing.final_cta.button')}
          </CTAButton>
        </div>
      </motion.div>

      {/* Vision Timeline — Future roadmap section */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-accent-system animate-spin" />
          </div>
        }
      >
        <VisionTimeline />
      </Suspense>
    </section>
  )
}
