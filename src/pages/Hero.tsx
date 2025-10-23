import React, { lazy, Suspense, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  GlassCard,
  Button,
  LoadingFallback,
  MetricCounter,
  AggregateMetrics,
  type AggregateMetric,
  TrustBadges,
  TRUST_BADGE_ICONS,
  type TrustBadgeConfig,
  TechStackBar,
  VisionTimeline,
  PremiumBadge,
  PricingAvailabilityBanner,
  ValueStackingSection,
  IndustrySelector,
  PersonalizationControlBar,
  CustomBuildProcess,
  type Industry,
} from '../components'
// Direct import to avoid circular dependency
import { StrategicCTA } from '../components/common/StrategicCTA'
// Kinetic Typography Transition
import { KineticTypographyTransition } from '../components/transitions/KineticTypographyTransition'
// Credibility components moved to strategic placements:
// - TechnicalShowcase: Explorer (mid-funnel technical proof)
// - FounderExpertise: Explorer (mid-funnel team credibility)
// - EarlyAdopterBadge: Calculator (bottom-funnel urgency)
// - RiskReduction: Calculator (bottom-funnel objection removal)
import {
  usePageAnalytics,
  useViewTracking,
  useCalendlyBooking,
  useExitIntent,
  usePersonalization,
} from '../hooks'
import { trackHeroView, trackCTAClick } from '../utils/analytics'
import { getHeadlineVariant, trackVariantCTAClick } from '../utils/headlineVariants'
import { usePersonalizationStore } from '../stores'
import { CalendlyFunnelSession } from '../utils/calendlyFunnelTracking'

// Lazy load heavy components
const SystemDiagram = lazy(() =>
  import('../components/layer1-hero/SystemDiagram').then((module) => ({
    default: module.SystemDiagram,
  }))
)

const CalendlyModal = lazy(() =>
  import('../components/common/CalendlyModal').then((module) => ({
    default: module.CalendlyModal,
  }))
)

/**
 * Hero - Landing page with system overview
 *
 * First layer of the FutureMarketingAI experience.
 * Presents the value proposition and guides users to explore the system.
 */

// Case Studies will be loaded from translations dynamically inside component

// Trust Badges will be loaded from translations dynamically inside component

// Aggregate Metrics will be loaded from translations dynamically inside component

export const Hero: React.FC = () => {
  // Check if we're on /demo (with animation) or /demo-home (without animation)
  const location = window.location
  const shouldPlayAnimation = location.pathname === '/demo'

  // Neural Warp animation state
  const [showWarp, setShowWarp] = useState(shouldPlayAnimation)
  const [warpComplete, setWarpComplete] = useState(!shouldPlayAnimation)

  // i18n translation hook
  const { t } = useTranslation(['hero', 'common'])

  // Track page analytics (page load, scroll depth, engagement time)
  usePageAnalytics('Hero')

  // Personalization store
  const {
    selectedIndustry,
    hasSeenIndustrySelector,
    setIndustry,
    setHasSeenIndustrySelector,
    trackPageVisit,
  } = usePersonalizationStore()

  // Personalization content
  const { getPersonalizedCTA, userIntent } = usePersonalization()

  // A/B Testing: Get headline variant
  const headlineVariant = React.useMemo(() => getHeadlineVariant(), [])
  const headlineText = React.useMemo(() => {
    return t(`hero:headline_variants.${headlineVariant}`)
  }, [t, headlineVariant])
  const headlineSubtitle = React.useMemo(() => {
    return t(`hero:headline_subtitles.${headlineVariant}`)
  }, [t, headlineVariant])

  // Track page visit
  React.useEffect(() => {
    trackPageVisit('hero')
  }, [trackPageVisit])

  // Activate fullscreen + landscape on mount
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

    // Request fullscreen
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => console.warn('Fullscreen failed:', err))
    } else if ((elem as any).webkitRequestFullscreen) {
      ;(elem as any).webkitRequestFullscreen()
    }

    // Lock to landscape on mobile
    if (isMobile && screen.orientation && 'lock' in screen.orientation) {
      ;(screen.orientation as any)
        .lock('landscape-primary')
        .catch((err: Error) => console.warn('Orientation lock failed:', err))
    }
  }, [])

  // Handle Neural Warp completion
  const handleWarpComplete = () => {
    console.log('✅ Warp complete! Setting warpComplete to true')
    setShowWarp(false)
    setWarpComplete(true)
  }

  // Case studies REMOVED - Replaced with transparent early-stage positioning
  // See: EarlyAdopterBadge, TechnicalShowcase, FounderExpertise, RiskReduction components

  // Load trust badges from translations
  const trustBadges: TrustBadgeConfig[] = React.useMemo(
    () => [
      {
        id: 'gdpr',
        name: t('hero:trust_badges.gdpr.name'),
        description: t('hero:trust_badges.gdpr.description'),
        icon: TRUST_BADGE_ICONS.GDPR,
        enabled: true,
      },
      {
        id: 'iso27001',
        name: t('hero:trust_badges.iso27001.name'),
        description: t('hero:trust_badges.iso27001.description'),
        icon: TRUST_BADGE_ICONS.ISO27001,
        enabled: true,
      },
      {
        id: 'soc2',
        name: t('hero:trust_badges.soc2.name'),
        description: t('hero:trust_badges.soc2.description'),
        icon: TRUST_BADGE_ICONS.SOC2,
        enabled: true,
      },
      {
        id: 'ssl',
        name: t('hero:trust_badges.ssl.name'),
        description: t('hero:trust_badges.ssl.description'),
        icon: TRUST_BADGE_ICONS.SSL,
        enabled: true,
      },
    ],
    [t]
  )

  // Load aggregate metrics from translations
  const aggregateMetrics: AggregateMetric[] = React.useMemo(
    () => [
      {
        id: '1',
        value: 2.5,
        suffix: t('hero:aggregate_metrics.time_recovered.suffix'),
        prefix: t('hero:aggregate_metrics.time_recovered.prefix'),
        label: t('hero:aggregate_metrics.time_recovered.label'),
        painLabel: t('hero:aggregate_metrics.time_recovered.pain_label'),
        variant: 'success',
        icon: t('hero:aggregate_metrics.time_recovered.icon'),
      },
      {
        id: '2',
        value: 50,
        suffix: t('hero:aggregate_metrics.posts_created.suffix'),
        label: t('hero:aggregate_metrics.posts_created.label'),
        painLabel: t('hero:aggregate_metrics.posts_created.pain_label'),
        variant: 'primary',
        icon: t('hero:aggregate_metrics.posts_created.icon'),
      },
      {
        id: '3',
        value: 20,
        suffix: t('hero:aggregate_metrics.companies_automated.suffix'),
        label: t('hero:aggregate_metrics.companies_automated.label'),
        painLabel: t('hero:aggregate_metrics.companies_automated.pain_label'),
        variant: 'secondary',
        icon: t('hero:aggregate_metrics.companies_automated.icon'),
      },
    ],
    [t]
  )

  // Calendly booking with funnel tracking
  const calendly = useCalendlyBooking()
  const funnelSessionRef = React.useRef<CalendlyFunnelSession | null>(null)
  const { icpScore } = usePersonalizationStore()

  // Wrapper function for calendly.open with funnel tracking
  const openCalendlyWithTracking = React.useCallback(
    (source: string) => {
      // Start new funnel session
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
        source: `hero_${source.toLowerCase().replace(/\s+/g, '_')}`,
        eventType: calendly.eventType.id,
        icpScore: icpScore?.overall || 0,
        icpTier,
      })

      funnelSessionRef.current.trackStep('booking_prompt_shown')
      funnelSessionRef.current.trackStep('booking_cta_clicked')

      calendly.open(source)
    },
    [calendly, icpScore]
  )

  // Handle calendly close with funnel tracking
  const handleCalendlyClose = React.useCallback(() => {
    if (funnelSessionRef.current) {
      funnelSessionRef.current.abandon('user_closed_modal')
      funnelSessionRef.current = null
    }
    calendly.close()
  }, [calendly])

  // Listen for Calendly events to track funnel completion
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

    // No cleanup needed if modal is not open
    return undefined
  }, [calendly.isOpen])

  // Industry selector modal state
  const [showIndustrySelector, setShowIndustrySelector] = React.useState(false)

  // Show industry selector AFTER intro animation completes
  // 1. First visit: Show 1s after animation
  // 2. Returning visit without industry: Show 3s after animation
  React.useEffect(() => {
    console.log('🔍 Industry selector check:', {
      warpComplete,
      hasSeenIndustrySelector,
      selectedIndustry,
    })

    // Wait for warp animation to complete first
    if (!warpComplete) {
      console.log('⏸️ Waiting for warp to complete...')
      return undefined
    }

    console.log('✅ Warp is complete, checking selector conditions...')

    // Don't show if already seen and industry selected
    if (hasSeenIndustrySelector && selectedIndustry) {
      console.log('❌ Already seen selector and industry selected, skipping')
      return undefined
    }

    // First visit: show after 1s (post-animation)
    if (!hasSeenIndustrySelector) {
      console.log('⏱️ First visit - will show selector in 1s')
      const timer = setTimeout(() => {
        console.log('🎯 Showing industry selector (first visit)')
        setShowIndustrySelector(true)
      }, 1000)

      return () => clearTimeout(timer)
    }

    // Returning visit without industry selection: show after 3s (post-animation)
    if (!selectedIndustry) {
      console.log('⏱️ Returning visit - will show selector in 3s')
      const timer = setTimeout(() => {
        console.log('🎯 Showing industry selector (returning visit)')
        setShowIndustrySelector(true)
      }, 3000)

      return () => clearTimeout(timer)
    }

    return undefined // Explicit return for all code paths
  }, [warpComplete, hasSeenIndustrySelector, selectedIndustry])

  // Demo helper: Reset personalization on Ctrl+Shift+R
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault()
        localStorage.clear()
        window.location.reload()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleIndustrySelect = (industry: Industry) => {
    setIndustry(industry)
    setHasSeenIndustrySelector(true)
  }

  const handleIndustryClose = () => {
    setShowIndustrySelector(false)
    setHasSeenIndustrySelector(true)
  }

  // Exit intent modal
  const [showExitIntent, setShowExitIntent] = React.useState(false)
  useExitIntent({
    onExitIntent: () => setShowExitIntent(true),
    enabled: true,
  })

  // Floating CTA visibility (show after 30s OR 50% scroll - Best practices for non-intrusive conversion)
  const [showFloatingCTA, setShowFloatingCTA] = React.useState(false)

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    // Show after 30 seconds
    timeoutId = setTimeout(() => {
      setShowFloatingCTA(true)
    }, 30000) // 30 seconds

    // OR show when scrolled 50% of page height
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercentage > 50) {
        setShowFloatingCTA(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Track when hero section comes into view
  const heroRef = useViewTracking('hero', { threshold: 0.3 })

  // Track when system diagram comes into view
  const diagramRef = useViewTracking('system_diagram', { threshold: 0.5 })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark flex items-center justify-center p-4">
      {/* Hero Content - Fade in after animation completes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: warpComplete ? 1 : 0 }}
        transition={{
          duration: 1,
          ease: [0.25, 0.1, 0.25, 1], // Butter-smooth fade
          delay: 0.2,
        }}
        className="w-full"
      >
        <motion.div
          ref={heroRef}
          className="text-center space-y-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => {
            // Track when hero animation completes
            trackHeroView()
          }}
        >
          {/* Trust Signals - Above Headline */}
          <motion.div className="flex flex-wrap justify-center gap-4 mb-6" variants={itemVariants}>
            <span
              className="px-4 py-2 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 border border-white/20 hover:border-accent-primary/40 transition-all"
              style={{ background: 'rgba(0, 0, 0, 0.4)' }}
            >
              {t('hero:trust_signals.team_size')}
            </span>
            <span
              className="px-4 py-2 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 border border-white/20 hover:border-accent-primary/40 transition-all"
              style={{ background: 'rgba(0, 0, 0, 0.4)' }}
            >
              {t('hero:trust_signals.custom_built_usp')}
            </span>
            <span
              className="px-4 py-2 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 border border-white/20 hover:border-accent-primary/40 transition-all"
              style={{ background: 'rgba(0, 0, 0, 0.4)' }}
            >
              {t('hero:trust_signals.ai_powered')}
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-text"
            variants={itemVariants}
          >
            {headlineText}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            {headlineSubtitle}
          </motion.p>

          {/* System Architecture Diagram */}
          <motion.div
            ref={diagramRef}
            className="w-full max-w-4xl mx-auto mt-12 mb-8"
            variants={itemVariants}
          >
            <GlassCard className="p-8 overflow-hidden">
              <Suspense fallback={<LoadingFallback message={t('hero:loading.diagram')} />}>
                <SystemDiagram />
              </Suspense>
            </GlassCard>
          </motion.div>

          {/* Tech Stack Bar - Show AI partners BELOW Sphere */}
          <motion.div className="mt-12" variants={itemVariants}>
            <TechStackBar />
          </motion.div>

          {/* Vision Timeline - Strategic positioning: Show WHY NOW after showing WHO powers it */}
          <motion.div className="mt-20" variants={itemVariants}>
            <VisionTimeline />
          </motion.div>

          {/* Custom Build Process - Show HOW we deliver custom solutions */}
          <motion.div className="mt-20" variants={itemVariants}>
            <CustomBuildProcess />
          </motion.div>

          {/* Stats Context */}
          <motion.p
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mt-20"
            variants={itemVariants}
          >
            {t('hero:stats_context')}
          </motion.p>

          {/* Stats Grid - Horizontal */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
            variants={itemVariants}
          >
            <GlassCard className="p-8 hover-lift">
              <MetricCounter
                value={360}
                label={t('hero:stats.hours_saved.label')}
                suffix={t('hero:stats.hours_saved.suffix')}
                variant="success"
                duration={2.5}
                delay={0.2}
              />
              <p className="text-xs text-white/70 mt-2">{t('hero:stats.hours_saved.detail')}</p>
            </GlassCard>

            <GlassCard className="p-8 hover-lift">
              <MetricCounter
                value={160}
                label={t('hero:stats.content_output.label')}
                suffix={t('hero:stats.content_output.suffix')}
                variant="primary"
                duration={2.5}
                delay={0.4}
              />
              <p className="text-xs text-white/70 mt-2">{t('hero:stats.content_output.detail')}</p>
            </GlassCard>

            <GlassCard className="p-8 hover-lift">
              <MetricCounter
                value={247}
                label={t('hero:stats.engagement.label')}
                suffix={t('hero:stats.engagement.suffix')}
                variant="secondary"
                duration={2.5}
                delay={0.6}
              />
              <p className="text-xs text-white/70 mt-2">{t('hero:stats.engagement.detail')}</p>
            </GlassCard>
          </motion.div>

          {/* CTA - Large & Prominent */}
          <motion.div className="mt-8" variants={itemVariants}>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="flex justify-center"
            >
              <Link to="/explorer" className="w-full max-w-md">
                <Button
                  variant="primary"
                  size="lg"
                  glow
                  onClick={() => {
                    trackCTAClick('Discover Solutions', '/explorer')
                    trackVariantCTAClick('explore_platform')
                  }}
                  className="w-full text-xl py-6 font-semibold"
                >
                  {t('hero:cta.explore_platform')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Aggregate Metrics Section */}
          <motion.div variants={itemVariants} className="mt-32">
            <AggregateMetrics metrics={aggregateMetrics} />
          </motion.div>

          {/* Premium Services Badge - Inline */}
          <motion.div variants={itemVariants} className="mt-32">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 text-center">
              {t('hero:premium.title')}
            </h2>
            <p className="text-lg text-white/90 mb-8 text-center max-w-2xl mx-auto">
              {t('hero:premium.description')}
            </p>
            <PremiumBadge variant="inline" />
          </motion.div>

          {/* Value Stacking Section - Complete Platform Value (Info only, no CTA) */}
          <motion.div variants={itemVariants} className="mt-32">
            <ValueStackingSection compareTier="founding" variant="compact" showSavings />
          </motion.div>

          {/* Trust Badges Section */}
          <motion.div variants={itemVariants} className="mt-32">
            <TrustBadges badges={trustBadges} />
          </motion.div>

          {/* Early Adopter CTA - After Social Proof */}
          <motion.div variants={itemVariants} className="mt-16 pb-16">
            <StrategicCTA
              variant="inline"
              title={t('hero:early_adopter.title')}
              description={t('hero:early_adopter.description')}
              primaryText={t('hero:early_adopter.primary_cta')}
              onPrimaryClick={() => {
                trackVariantCTAClick('early_adopter_apply')
                openCalendlyWithTracking('Early Adopter Application')
              }}
              secondaryText={t('hero:early_adopter.secondary_cta')}
              onSecondaryClick={() => {
                trackVariantCTAClick('calculator_link')
                window.location.href = '/calculator'
              }}
              showUrgency={false}
              trustIndicators={[
                t('hero:early_adopter.trust_indicators.founder_access'),
                t('hero:early_adopter.trust_indicators.co_create'),
                t('hero:early_adopter.trust_indicators.no_cc'),
              ]}
              context="Hero Early Adopter"
            />
          </motion.div>
        </motion.div>

        {/* Pricing Availability Banner - Early Adopter Pricing (Info only, no CTA) */}
        <PricingAvailabilityBanner
          totalCustomers={3} // Demo: 3 customers have claimed spots
          variant="floating"
          position="top-right"
        />

        {/* Floating CTA - Shows after scroll */}
        {showFloatingCTA && (
          <StrategicCTA
            variant="floating"
            title={t('hero:floating_cta.title')}
            primaryText={getPersonalizedCTA('hero')}
            onPrimaryClick={() => {
              trackVariantCTAClick('calendly_floating')
              openCalendlyWithTracking('Hero Floating CTA')
            }}
            showUrgency={userIntent !== 'high'} // Don't show urgency for high-intent users
            urgencyText={t('hero:floating_cta.urgency')}
            trustIndicators={[
              t('hero:floating_cta.trust_indicators.quick_call'),
              t('hero:floating_cta.trust_indicators.no_commitment'),
            ]}
            context="Hero Floating"
          />
        )}

        {/* Exit-Intent Modal */}
        {showExitIntent && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <StrategicCTA
              variant="exit-intent"
              title={t('hero:exit_intent.title')}
              description={t('hero:exit_intent.description')}
              primaryText={t('hero:exit_intent.primary_cta')}
              onPrimaryClick={() => {
                trackVariantCTAClick('calendly_exit_intent')
                setShowExitIntent(false)
                openCalendlyWithTracking('Exit Intent')
              }}
              secondaryText={t('hero:exit_intent.secondary_cta')}
              onSecondaryClick={() => setShowExitIntent(false)}
              showUrgency
              urgencyText={t('hero:exit_intent.urgency')}
              trustIndicators={[
                t('hero:exit_intent.trust_indicators.quick_call'),
                t('hero:exit_intent.trust_indicators.roi_analysis'),
                t('hero:exit_intent.trust_indicators.no_commitment'),
              ]}
              context="Hero Exit Intent"
            />
          </div>
        )}

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
                      {t('hero:loading.scheduling')}
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

        {/* Industry Selector Modal */}
        <IndustrySelector
          isOpen={showIndustrySelector}
          onClose={handleIndustryClose}
          onSelect={handleIndustrySelect}
          selectedIndustry={selectedIndustry}
          skippable={true}
        />
      </motion.div>

      {/* Personalization Control Bar - Industry selector + Settings */}
      <PersonalizationControlBar />

      {/* Kinetic Typography Transition - Auto-play on page load */}
      <KineticTypographyTransition
        isActive={showWarp}
        onComplete={handleWarpComplete}
        duration={5500}
      />
    </div>
  )
}

export default Hero
