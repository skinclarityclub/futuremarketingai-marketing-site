/**
 * SimplifiedHeroMobile - Mobile-specific Hero component
 *
 * Living System conversion: teal/amber palette, bg-bg-deep, no glassmorphism.
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
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { CTAButton } from '../common'
import { useNavigate } from 'react-router-dom'

interface SimplifiedHeroMobileProps {
  className?: string
}

// Reduced particle count for mobile (desktop has 50, we use 15)
const MOBILE_PARTICLES = [
  { x: 14.58, y: 14.98, size: 4.58, delay: 0 },
  { x: 74.99, y: 2.8, size: 3.1, delay: 0.5 },
  { x: 69.14, y: 61.05, size: 3.58, delay: 1 },
  { x: 82.4, y: 55.2, size: 4.29, delay: 1.5 },
  { x: 42.54, y: 31.28, size: 3.25, delay: 2 },
  { x: 92.36, y: 20.77, size: 2.63, delay: 2.5 },
  { x: 26.33, y: 95.51, size: 2.22, delay: 3 },
  { x: 3.61, y: 80.42, size: 2.99, delay: 3.5 },
  { x: 71.54, y: 26.13, size: 3.24, delay: 4 },
  { x: 98.26, y: 57.87, size: 4.3, delay: 4.5 },
  { x: 47.18, y: 92.42, size: 4.7, delay: 5 },
  { x: 88.96, y: 32.46, size: 4.07, delay: 5.5 },
  { x: 52.43, y: 48.46, size: 2.69, delay: 6 },
  { x: 68.11, y: 13.78, size: 3.66, delay: 6.5 },
  { x: 34.82, y: 90.63, size: 3.68, delay: 7 },
]

export function SimplifiedHeroMobile({ className = '' }: SimplifiedHeroMobileProps) {
  const { t } = useTranslation('common')
  const navigate = useNavigate()

  return (
    <section
      className={`relative min-h-screen flex flex-col justify-center px-6 py-12 overflow-hidden bg-bg-deep ${className}`}
      aria-label="Hero section"
    >
      {/* Living System grid pattern (optimized for mobile) */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 212, 170, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 212, 170, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Teal radial glow */}
      <div className="absolute inset-0 opacity-25">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 170, 0.3) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(245, 166, 35, 0.2) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Animated particles (reduced count, GPU-accelerated) */}
      <div className="absolute inset-0 overflow-hidden">
        {MOBILE_PARTICLES.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-accent-system/30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1.2, 0],
              y: [0, -30, -60],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Main Headline - SAME content as desktop */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl sm:text-5xl font-black mb-3 leading-tight">
            <span className="block text-text-primary drop-shadow-lg">
              {t('landing.hero_landing.main_headline')}
            </span>
            <span className="block bg-gradient-flow bg-clip-text text-transparent drop-shadow-lg">
              {t('landing.hero_landing.sub_headline')}
            </span>
          </h1>
        </motion.div>

        {/* Description - SAME as desktop */}
        <motion.p
          className="text-base sm:text-lg text-text-secondary text-center mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {t('landing.hero_landing.description')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          className="flex items-center justify-center gap-2.5 text-sm text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
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
          <span className="font-medium">Live interactieve demo beschikbaar</span>
        </motion.div>
      </div>
    </section>
  )
}

SimplifiedHeroMobile.displayName = 'SimplifiedHeroMobile'
