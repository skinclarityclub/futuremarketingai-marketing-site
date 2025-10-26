/**
 * SimplifiedHeroMobile - Mobile-specific Hero component
 *
 * ✅ DESKTOP-FIRST COMPLIANT
 * - This is a NEW mobile component, completely separate from desktop Hero
 * - Used via conditional rendering: {isMobile ? <SimplifiedHeroMobile /> : <Hero />}
 * - Desktop Hero remains 100% unchanged and unaffected
 *
 * ✅ CONTENT PARITY COMPLIANT
 * - Uses EXACT same translation keys as desktop Hero (landing.hero_landing.*)
 * - NEVER creates new content - only adapts layout/presentation
 * - Same data, different UI
 *
 * ENHANCED VERSION:
 * - Premium visual quality (closer to desktop)
 * - Mobile-optimized animations (GPU-accelerated)
 * - Reduced particle count for performance
 * - 60fps smooth animations
 */

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { Button } from '../ui/button'
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
      className={`relative min-h-screen flex flex-col justify-center px-6 py-12 overflow-hidden ${className}`}
      aria-label="Hero section"
    >
      {/* Premium gradient background (same as desktop) */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />

      {/* Grid pattern (optimized for mobile) */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Radial glow (desktop-quality, mobile-optimized) */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      {/* Animated particles (reduced count, GPU-accelerated) */}
      <div className="absolute inset-0 overflow-hidden">
        {MOBILE_PARTICLES.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-blue-400/40 to-purple-400/40 backdrop-blur-sm"
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
            <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg">
              {t('landing.hero_landing.main_headline')}
            </span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              {t('landing.hero_landing.sub_headline')}
            </span>
          </h1>
        </motion.div>

        {/* Description - SAME as desktop */}
        <motion.p
          className="text-base sm:text-lg text-blue-100/90 text-center mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {t('landing.hero_landing.description')}
        </motion.p>

        {/* CTA Buttons - Enhanced with glow effects */}
        <motion.div
          className="flex flex-col gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Primary CTA - Premium glow effect */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300" />

            {/* Button */}
            <Button
              size="lg"
              onClick={() => navigate('/demo-intro')}
              className="
                relative w-full h-14
                bg-gradient-to-r from-blue-500 to-purple-600
                hover:from-blue-600 hover:to-purple-700
                text-white border-0
                text-base font-semibold rounded-xl
                shadow-2xl shadow-blue-500/50
                transition-all duration-300
                tap-target
                touch-manipulation
              "
            >
              <Zap className="mr-2 h-5 w-5" />
              {t('landing.hero_landing.cta.primary')}
            </Button>
          </div>

          {/* Secondary CTA - Glass morphism */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => (window.location.href = '/pricing')}
            className="
              w-full h-14 
              bg-white/10 backdrop-blur-md
              border border-white/20
              text-white 
              hover:bg-white/20 hover:border-white/30
              text-base font-semibold rounded-xl 
              shadow-lg shadow-black/20
              transition-all duration-300
              tap-target
              touch-manipulation
            "
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            {t('landing.hero_landing.cta.secondary')}
          </Button>
        </motion.div>

        {/* Status Indicator - Premium styling */}
        <motion.div
          className="flex items-center justify-center gap-2.5 text-sm text-blue-200/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 blur-sm opacity-75" aria-hidden="true" />
          </div>
          <span className="font-medium">Live interactieve demo beschikbaar</span>
        </motion.div>
      </div>
    </section>
  )
}

SimplifiedHeroMobile.displayName = 'SimplifiedHeroMobile'
