import React, { useState, useEffect, lazy, Suspense } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  GlassCard,
  Button,
  LoadingFallback,
  MetricCounter,
  ProgressiveProfilingPrompt,
  shouldShowProfilePrompt,
  PricingAvailabilityBanner,
  ValueStackingSection,
  MarkdownText,
  ComparisonSection,
} from '../components'
// Direct import to avoid circular dependency
import { StrategicCTA } from '../components/common/StrategicCTA'
import { TechnicalShowcase, FounderExpertise } from '../components/credibility'
import type { HeatMapData } from '../components'
import { usePageAnalytics, useCalendlyBooking, usePersonalization, useIsMobile } from '../hooks'
import { useModuleFollowUp } from '../hooks/useModuleFollowUp'
import { trackModuleOpen, trackCTAClick } from '../utils/analytics'
import { usePersonalizationStore } from '../stores'
import { CalendlyFunnelSession } from '../utils/calendlyFunnelTracking'
import { DesktopOnlyNotice } from '../components/mobile'
// import { MobileExplorer } from '../components/mobile' // Not used yet

// Lazy load heavy components
const Modal = lazy(() =>
  import('../components/common/Modal').then((module) => ({ default: module.Modal }))
)
const HeatMap = lazy(() =>
  import('../components/visualizations/HeatMap').then((module) => ({ default: module.HeatMap }))
)
const TelegramMockup = lazy(() =>
  import('../components/visualizations/TelegramMockup').then((module) => ({
    default: module.TelegramMockup,
  }))
)
const AdBuilderDemo = lazy(() =>
  import('../components/visualizations/AdBuilderDemo').then((module) => ({
    default: module.AdBuilderDemo,
  }))
)
const CalendlyModal = lazy(() =>
  import('../components/common/CalendlyModal').then((module) => ({ default: module.CalendlyModal }))
)

/**
 * Explorer - Interactive system exploration layer
 *
 * Second layer where users can explore system capabilities,
 * view features, and navigate to deeper sections.
 */

// Hash aliases for backwards compatibility and alternative names (defined outside component for performance)
const HASH_ALIASES: Record<string, string> = {
  'telegram-control': 'telegram-approval',
  telegram: 'telegram-approval',
  analytics: 'analytics-monitoring',
  ads: 'ad-builder',
  publishing: 'publishing-layer',
  research: 'research-planning',
  manager: 'manager-workflow',
  content: 'content-pipeline',
}

export const Explorer: React.FC = () => {
  // i18n translation hook
  const { t } = useTranslation(['explorer', 'common'])

  // Track page analytics
  usePageAnalytics('Explorer')

  // Mobile detection
  const isMobile = useIsMobile()

  // Personalization
  const { industryName, getPersonalizedCTA, messaging, userIntent } = usePersonalization()
  const { icpScore } = usePersonalizationStore()

  // Calendly booking with funnel tracking
  const calendly = useCalendlyBooking()
  const funnelSessionRef = React.useRef<CalendlyFunnelSession | null>(null)

  // Wrapper function for calendly.open with funnel tracking
  const openCalendlyWithTracking = React.useCallback(
    (source: string, prefill?: any) => {
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
        source: `explorer_${source.toLowerCase().replace(/\s+/g, '_')}`,
        eventType: calendly.eventType.id,
        icpScore: icpScore?.overall || 0,
        icpTier,
      })

      funnelSessionRef.current.trackStep('booking_prompt_shown')
      funnelSessionRef.current.trackStep('booking_cta_clicked')

      calendly.open(source, prefill)
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

    // No cleanup needed if modal is not open
    return undefined
  }, [calendly.isOpen])

  const location = useLocation()
  const navigate = useNavigate()
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  // Progressive profiling
  const [showProfilingPrompt, setShowProfilingPrompt] = useState(false)
  const [moduleViewCount, setModuleViewCount] = useState(0)

  // Track module views and show profiling prompt after 2 views
  useEffect(() => {
    if (selectedFeature) {
      const newCount = moduleViewCount + 1
      setModuleViewCount(newCount)

      // Show prompt after 2 module views
      if (newCount === 2 && shouldShowProfilePrompt('painPoints')) {
        setTimeout(() => {
          setShowProfilingPrompt(true)
        }, 3000) // 3 seconds after 2nd module view
      }
    }
  }, [selectedFeature])

  // Calendly integration
  // (Floating Guide integration removed - will be reimplemented in AI Journey Assistant - Task 29)

  // 🤖 Proactive chat follow-up when modules are closed
  useModuleFollowUp()

  // Open modal from URL hash (e.g., #research-planning or #telegram-control)
  useEffect(() => {
    const hash = location.hash.replace('#', '')

    if (hash) {
      // Check if hash is an alias, use mapped ID if it exists
      const featureId = HASH_ALIASES[hash] || hash
      setSelectedFeature(featureId)

      // Track module view for chatbot navigation
      try {
        const store = usePersonalizationStore.getState()
        store.trackModuleView(featureId)
      } catch (error) {
        console.error('❌ Module tracking from hash failed:', error)
      }

      // Scroll to top when opening from hash
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Hash removed → close modal
      setSelectedFeature(null)
    }
  }, [location.hash])

  // Handle modal close - remove hash from URL
  const handleModalClose = () => {
    setSelectedFeature(null)
    // 🔑 Use React Router navigate to properly trigger hash change detection
    // This ensures useModuleFollowUp hook detects the close event
    if (location.hash) {
      navigate(location.pathname, { replace: true })
    }
  }

  // Generate sample heat map data for Analytics module
  const generateHeatMapData = (): HeatMapData[] => {
    const metrics = ['Traffic', 'Conversion', 'Revenue', 'Engagement']
    const periods = ['Q1', 'Q2', 'Q3', 'Q4']
    const data: HeatMapData[] = []

    metrics.forEach((metric) => {
      periods.forEach((period) => {
        data.push({
          row: metric,
          col: period,
          value: Math.random() * 40 + 60, // 60-100% accuracy
        })
      })
    })

    return data
  }

  const heatMapData = generateHeatMapData()

  // Load features from translations dynamically
  const features = React.useMemo(
    () => [
      {
        id: 'research-planning',
        title: t('explorer:features.research_planning.title'),
        subtitle: t('explorer:features.research_planning.subtitle'),
        description: t('explorer:features.research_planning.description'),
        icon: t('explorer:features.research_planning.icon'),
        roiMetric: t('explorer:features.research_planning.roi_metric'),
        roiLabel: t('explorer:features.research_planning.roi_label'),
        link: '/dashboard',
        painPoint: t('explorer:features.research_planning.pain_point'),
        modalContent: {
          painAgitation: {
            problem: t('explorer:features.research_planning.modal.pain_agitation.problem'),
            solution: t('explorer:features.research_planning.modal.pain_agitation.solution'),
            result: t('explorer:features.research_planning.modal.pain_agitation.result'),
          },
          overview: t('explorer:features.research_planning.modal.overview'),
          capabilities: t('explorer:features.research_planning.modal.capabilities', {
            returnObjects: true,
          }) as string[],
          processSteps: t('explorer:features.research_planning.modal.process_steps', {
            returnObjects: true,
          }) as Array<{ step: number; title: string; description: string }>,
          metrics: t('explorer:features.research_planning.modal.metrics', {
            returnObjects: true,
          }) as Array<{ value: number; label: string; suffix: string; decimals: number }>,
        },
      },
      {
        id: 'manager-workflow',
        title: t('explorer:features.manager_workflow.title'),
        subtitle: t('explorer:features.manager_workflow.subtitle'),
        description: t('explorer:features.manager_workflow.description'),
        icon: t('explorer:features.manager_workflow.icon'),
        roiMetric: t('explorer:features.manager_workflow.roi_metric'),
        roiLabel: t('explorer:features.manager_workflow.roi_label'),
        link: '/dashboard',
        painPoint: t('explorer:features.manager_workflow.pain_point'),
        modalContent: {
          painAgitation: {
            problem: t('explorer:features.manager_workflow.modal.pain_agitation.problem'),
            solution: t('explorer:features.manager_workflow.modal.pain_agitation.solution'),
            result: t('explorer:features.manager_workflow.modal.pain_agitation.result'),
          },
          overview: t('explorer:features.manager_workflow.modal.overview'),
          capabilities: t('explorer:features.manager_workflow.modal.capabilities', {
            returnObjects: true,
          }) as string[],
          processSteps: t('explorer:features.manager_workflow.modal.process_steps', {
            returnObjects: true,
          }) as Array<{ step: number; title: string; description: string }>,
          metrics: t('explorer:features.manager_workflow.modal.metrics', {
            returnObjects: true,
          }) as Array<{ value: number; label: string; suffix: string; decimals: number }>,
        },
      },
      {
        id: 'content-pipeline',
        title: t('explorer:features.content_pipeline.title'),
        subtitle: t('explorer:features.content_pipeline.subtitle'),
        description: t('explorer:features.content_pipeline.description'),
        icon: t('explorer:features.content_pipeline.icon'),
        roiMetric: t('explorer:features.content_pipeline.roi_metric'),
        roiLabel: t('explorer:features.content_pipeline.roi_label'),
        link: '/dashboard',
        painPoint: t('explorer:features.content_pipeline.pain_point'),
        modalContent: {
          painAgitation: {
            problem: t('explorer:features.content_pipeline.modal.pain_agitation.problem'),
            solution: t('explorer:features.content_pipeline.modal.pain_agitation.solution'),
            result: t('explorer:features.content_pipeline.modal.pain_agitation.result'),
          },
          overview: t('explorer:features.content_pipeline.modal.overview'),
          capabilities: t('explorer:features.content_pipeline.modal.capabilities', {
            returnObjects: true,
          }) as string[],
          processSteps: t('explorer:features.content_pipeline.modal.process_steps', {
            returnObjects: true,
          }) as Array<{ step: number; title: string; description: string }>,
          metrics: t('explorer:features.content_pipeline.modal.metrics', {
            returnObjects: true,
          }) as Array<{ value: number; label: string; suffix: string; decimals: number }>,
        },
      },
      {
        id: 'telegram-approval',
        title: t('explorer:features.telegram_control.title'),
        subtitle: t('explorer:features.telegram_control.subtitle'),
        description: t('explorer:features.telegram_control.description'),
        icon: t('explorer:features.telegram_control.icon'),
        roiMetric: t('explorer:features.telegram_control.roi_metric'),
        roiLabel: t('explorer:features.telegram_control.roi_label'),
        link: '/dashboard',
        painPoint: t('explorer:features.telegram_control.pain_point'),
        modalContent: {
          painAgitation: {
            problem: t('explorer:features.telegram_control.modal.pain_agitation.problem'),
            solution: t('explorer:features.telegram_control.modal.pain_agitation.solution'),
            result: t('explorer:features.telegram_control.modal.pain_agitation.result'),
          },
          overview: t('explorer:features.telegram_control.modal.overview'),
          capabilities: t('explorer:features.telegram_control.modal.capabilities', {
            returnObjects: true,
          }) as string[],
          processSteps: t('explorer:features.telegram_control.modal.process_steps', {
            returnObjects: true,
          }) as Array<{ step: number; title: string; description: string }>,
          metrics: t('explorer:features.telegram_control.modal.metrics', {
            returnObjects: true,
          }) as Array<{ value: number; label: string; suffix: string; decimals: number }>,
        },
      },
      {
        id: 'publishing-layer',
        title: t('explorer:features.publishing_layer.title'),
        subtitle: t('explorer:features.publishing_layer.subtitle'),
        description: t('explorer:features.publishing_layer.description'),
        icon: t('explorer:features.publishing_layer.icon'),
        roiMetric: t('explorer:features.publishing_layer.roi_metric'),
        roiLabel: t('explorer:features.publishing_layer.roi_label'),
        link: '/dashboard',
        painPoint: t('explorer:features.publishing_layer.pain_point'),
        modalContent: {
          painAgitation: {
            problem: t('explorer:features.publishing_layer.modal.pain_agitation.problem'),
            solution: t('explorer:features.publishing_layer.modal.pain_agitation.solution'),
            result: t('explorer:features.publishing_layer.modal.pain_agitation.result'),
          },
          overview: t('explorer:features.publishing_layer.modal.overview'),
          capabilities: t('explorer:features.publishing_layer.modal.capabilities', {
            returnObjects: true,
          }) as string[],
          processSteps: t('explorer:features.publishing_layer.modal.process_steps', {
            returnObjects: true,
          }) as Array<{ step: number; title: string; description: string }>,
          metrics: t('explorer:features.publishing_layer.modal.metrics', {
            returnObjects: true,
          }) as Array<{ value: number; label: string; suffix: string; decimals: number }>,
        },
      },
      {
        id: 'analytics-monitoring',
        title: t('explorer:features.analytics_lab.title'),
        subtitle: t('explorer:features.analytics_lab.subtitle'),
        description: t('explorer:features.analytics_lab.description'),
        icon: t('explorer:features.analytics_lab.icon'),
        roiMetric: t('explorer:features.analytics_lab.roi_metric'),
        roiLabel: t('explorer:features.analytics_lab.roi_label'),
        link: '/dashboard',
        painPoint: t('explorer:features.analytics_lab.pain_point'),
        modalContent: {
          painAgitation: {
            problem: t('explorer:features.analytics_lab.modal.pain_agitation.problem'),
            solution: t('explorer:features.analytics_lab.modal.pain_agitation.solution'),
            result: t('explorer:features.analytics_lab.modal.pain_agitation.result'),
          },
          overview: t('explorer:features.analytics_lab.modal.overview'),
          capabilities: t('explorer:features.analytics_lab.modal.capabilities', {
            returnObjects: true,
          }) as string[],
          processSteps: t('explorer:features.analytics_lab.modal.process_steps', {
            returnObjects: true,
          }) as Array<{ step: number; title: string; description: string }>,
          metrics: t('explorer:features.analytics_lab.modal.metrics', {
            returnObjects: true,
          }) as Array<{ value: number; label: string; suffix: string; decimals: number }>,
        },
      },
      {
        id: 'ad-builder',
        title: t('explorer:features.ad_builder.title'),
        subtitle: t('explorer:features.ad_builder.subtitle'),
        description: t('explorer:features.ad_builder.description'),
        icon: t('explorer:features.ad_builder.icon'),
        roiMetric: t('explorer:features.ad_builder.roi_metric'),
        roiLabel: t('explorer:features.ad_builder.roi_label'),
        link: '/dashboard',
        painPoint: t('explorer:features.ad_builder.pain_point'),
        modalContent: {
          painAgitation: {
            problem: t('explorer:features.ad_builder.modal.pain_agitation.problem'),
            solution: t('explorer:features.ad_builder.modal.pain_agitation.solution'),
            result: t('explorer:features.ad_builder.modal.pain_agitation.result'),
          },
          overview: t('explorer:features.ad_builder.modal.overview'),
          capabilities: t('explorer:features.ad_builder.modal.capabilities', {
            returnObjects: true,
          }) as string[],
          processSteps: t('explorer:features.ad_builder.modal.process_steps', {
            returnObjects: true,
          }) as Array<{ step: number; title: string; description: string }>,
          metrics: t('explorer:features.ad_builder.modal.metrics', {
            returnObjects: true,
          }) as Array<{ value: number; label: string; suffix: string; decimals: number }>,
        },
      },
      {
        id: 'command-center',
        title: t('explorer:features.command_center.title'),
        subtitle: t('explorer:features.command_center.subtitle'),
        description: t('explorer:features.command_center.description'),
        icon: t('explorer:features.command_center.icon'),
        roiMetric: t('explorer:features.command_center.roi_metric'),
        roiLabel: t('explorer:features.command_center.roi_label'),
        link: '/dashboard',
        painPoint: t('explorer:features.command_center.pain_point'),
        modalContent: {
          painAgitation: {
            problem: t('explorer:features.command_center.modal.pain_agitation.problem'),
            solution: t('explorer:features.command_center.modal.pain_agitation.solution'),
            result: t('explorer:features.command_center.modal.pain_agitation.result'),
          },
          overview: t('explorer:features.command_center.modal.overview'),
          capabilities: t('explorer:features.command_center.modal.capabilities', {
            returnObjects: true,
          }) as string[],
          processSteps: t('explorer:features.command_center.modal.process_steps', {
            returnObjects: true,
          }) as Array<{ step: number; title: string; description: string }>,
          metrics: t('explorer:features.command_center.modal.metrics', {
            returnObjects: true,
          }) as Array<{ value: number; label: string; suffix: string; decimals: number }>,
        },
      },
      {
        id: 'ai-advisory',
        title: t('explorer:features.ai_advisory.title'),
        subtitle: t('explorer:features.ai_advisory.subtitle'),
        description: t('explorer:features.ai_advisory.description'),
        icon: t('explorer:features.ai_advisory.icon'),
        roiMetric: t('explorer:features.ai_advisory.roi_metric'),
        roiLabel: t('explorer:features.ai_advisory.roi_label'),
        link: '/dashboard',
        painPoint: t('explorer:features.ai_advisory.pain_point'),
        modalContent: {
          painAgitation: {
            problem: t('explorer:features.ai_advisory.modal.pain_agitation.problem'),
            solution: t('explorer:features.ai_advisory.modal.pain_agitation.solution'),
            result: t('explorer:features.ai_advisory.modal.pain_agitation.result'),
          },
          overview: t('explorer:features.ai_advisory.modal.overview'),
          capabilities: t('explorer:features.ai_advisory.modal.capabilities', {
            returnObjects: true,
          }) as string[],
          processSteps: t('explorer:features.ai_advisory.modal.process_steps', {
            returnObjects: true,
          }) as Array<{ step: number; title: string; description: string }>,
          metrics: t('explorer:features.ai_advisory.modal.metrics', {
            returnObjects: true,
          }) as Array<{ value: number; label: string; suffix: string; decimals: number }>,
        },
      },
    ],
    [t]
  )

  // All features are always shown
  // (Industry-based filtering will be reimplemented in AI Journey Assistant - Task 29)

  // Mobile variant - show desktop-only notice (temporary)
  if (isMobile) {
    return <DesktopOnlyNotice pageName="explorer" />
  }

  // Desktop variant - full interactive experience
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t('explorer:page.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            {t('explorer:page.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GlassCard className="p-8 hover-lift group h-full flex flex-col" hover glow>
                {/* Icon with Framer Motion animations */}
                <motion.div
                  className="text-6xl mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.1 + 0.2,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {feature.icon}
                </motion.div>

                {/* Pain Point Badge */}
                {feature.painPoint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-warning/20 border border-accent-warning/40 text-accent-warning text-xs font-semibold"
                  >
                    <span>⚡</span>
                    <span>Solves: {feature.painPoint}</span>
                  </motion.div>
                )}

                {/* Subtitle */}
                <div className="text-sm font-semibold text-accent-secondary mb-4 uppercase tracking-wide">
                  {feature.subtitle}
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold gradient-text mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <MarkdownText className="text-white/90 mb-6 flex-grow" variant="compact">
                  {feature.description}
                </MarkdownText>

                {/* ROI Metric - Blended Gradient */}
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-accent-primary/10 via-accent-secondary/8 to-success/12 backdrop-blur-xl relative overflow-hidden group/metric">
                  {/* Soft glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-accent-secondary/5 to-success/5 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-500 blur-xl" />
                  <div className="relative flex items-baseline gap-2">
                    <div className="text-3xl md:text-4xl font-bold font-mono bg-gradient-to-r from-success via-accent-primary to-accent-secondary bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]">
                      {feature.roiMetric}
                    </div>
                    <div className="text-xs text-accent-primary/80 uppercase tracking-wider font-semibold">
                      {feature.roiLabel}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedFeature(feature.id)
                      trackModuleOpen(feature.title)

                      // Track module view for chatbot navigation
                      try {
                        const store = usePersonalizationStore.getState()
                        store.trackModuleView(feature.id)
                      } catch (error) {
                        console.error('❌ Module tracking failed:', error)
                      }
                    }}
                  >
                    {t('common:actions.learn_more')}
                  </Button>
                  <Link to={feature.link} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => trackCTAClick(`Explore ${feature.title}`, feature.link)}
                    >
                      {t('common:actions.view')}
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Custom-Built USP Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <GlassCard className="p-8 md:p-12 text-center border-2 border-accent-gold/30">
            <div className="inline-block px-4 py-2 mb-6 rounded-full bg-accent-gold/10 border border-accent-gold/30">
              <span className="text-sm font-semibold text-accent-gold uppercase tracking-wider">
                🔧 Custom-Built Advantage
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Not a Template. Built FOR Your Business.
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Every module you see is customized to YOUR industry, workflows, and specific business
              needs.
              <br />
              <strong className="text-accent-gold">
                No compromises. No "close enough" solutions.
              </strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div
                className="p-6 rounded-xl backdrop-blur-sm border border-accent-gold/20 hover:border-accent-gold/40 transition-all shadow-lg hover:shadow-accent-gold/20"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <div className="text-3xl mb-2">🔍</div>
                <h3 className="font-bold text-text-primary mb-2">
                  {t('explorer:custom_built.card_workflow.title')}
                </h3>
                <p className="text-sm text-white/80">
                  {t('explorer:custom_built.card_workflow.description')}
                </p>
              </div>
              <div
                className="p-6 rounded-xl backdrop-blur-sm border border-accent-gold/20 hover:border-accent-gold/40 transition-all shadow-lg hover:shadow-accent-gold/20"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-bold text-text-primary mb-2">
                  {t('explorer:custom_built.card_industry.title')}
                </h3>
                <p className="text-sm text-white/80">
                  {t('explorer:custom_built.card_industry.description')}
                </p>
              </div>
              <div
                className="p-6 rounded-xl backdrop-blur-sm border border-accent-gold/20 hover:border-accent-gold/40 transition-all shadow-lg hover:shadow-accent-gold/20"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-bold text-text-primary mb-2">
                  {t('explorer:custom_built.card_limits.title')}
                </h3>
                <p className="text-sm text-white/80">
                  {t('explorer:custom_built.card_limits.description')}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Comparison Section - Template vs Custom-Built */}
        <div className="mb-16">
          <ComparisonSection />
        </div>

        {/* Value Stacking Section - Show Complete Platform Value */}
        <div className="mb-16">
          <ValueStackingSection
            compareTier="founding"
            variant="summary"
            showSavings
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Technical Showcase - Build Credibility Through Tech */}
        <div className="mb-16">
          <TechnicalShowcase />
        </div>

        {/* Founder Expertise - Team Authority */}
        <div className="mb-16">
          <FounderExpertise />
        </div>

        {/* Strategic CTA - After Features (Personalized) */}
        <div className="mb-12">
          <StrategicCTA
            variant="inline"
            title={t('explorer:page.cta.title')}
            description={`These features work together to ${messaging.valueProposition.toLowerCase()}. Discover in a free strategic consultation how we implement this for ${industryName !== 'General' ? `your ${industryName.toLowerCase()} business` : 'your business'}.`}
            primaryText={t('explorer:page.cta.primary')}
            onPrimaryClick={() =>
              openCalendlyWithTracking('Explorer Features', {
                customAnswers: {
                  a1: `Industry: ${industryName}`,
                  a2: 'Visited: Explorer (Features)',
                },
              })
            }
            secondaryText={t('explorer:cta.calculate_roi_button')}
            onSecondaryClick={() => (window.location.href = '/calculator')}
            showUrgency={userIntent === 'low'} // Only show urgency for low-intent users
            urgencyText={t('explorer:cta.urgency_text')}
            context="Explorer Features"
            trustIndicators={[
              t('explorer:cta.trust_indicators.call'),
              t('explorer:cta.trust_indicators.roi_analysis'),
              t('explorer:cta.trust_indicators.roadmap'),
            ]}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button variant="ghost" onClick={() => trackCTAClick('Back to Home', '/')}>
              {t('explorer:navigation.back_home')}
            </Button>
          </Link>
          <Link to="/calculator">
            <Button
              variant="primary"
              glow
              onClick={() => trackCTAClick('Calculate ROI', '/calculator')}
            >
              {t('explorer:navigation.calculate_roi')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Detail Modal */}
      <Suspense fallback={<LoadingFallback message={t('explorer:loading.modal')} />}>
        <Modal
          isOpen={selectedFeature !== null}
          onClose={handleModalClose}
          title={features.find((f) => f.id === selectedFeature)?.title}
          size="xl"
        >
          {selectedFeature &&
            (() => {
              const feature = features.find((f) => f.id === selectedFeature)
              if (!feature) {
                return null
              }

              return (
                <div className="space-y-6">
                  {/* Icon, Subtitle and ROI */}
                  <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                    <motion.div
                      className="text-7xl"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <div className="flex-1">
                      {/* Pain Point Badge */}
                      {feature.painPoint && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="mb-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-warning/20 border border-accent-warning/40 text-accent-warning text-sm font-bold"
                        >
                          <span className="text-lg">⚡</span>
                          <span>
                            {t('explorer:modal_sections.solves_label')} {feature.painPoint}
                          </span>
                        </motion.div>
                      )}
                      <div className="text-sm font-semibold text-accent-secondary mb-2 uppercase tracking-wide">
                        {feature.subtitle}
                      </div>
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-accent-primary/10 via-accent-secondary/8 to-success/12 backdrop-blur-xl inline-block relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-accent-secondary/5 to-success/5 blur-xl" />
                        <div className="relative flex items-baseline gap-3">
                          <div className="text-3xl md:text-4xl font-bold font-mono bg-gradient-to-r from-success via-accent-primary to-accent-secondary bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]">
                            {feature.roiMetric}
                          </div>
                          <div className="text-sm text-accent-primary/80 uppercase tracking-wider font-semibold">
                            {feature.roiLabel}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pain Agitation Section */}
                  {feature.modalContent.painAgitation && (
                    <div className="space-y-4">
                      {/* The Problem */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/15 via-orange-500/10 to-red-500/15 border border-red-400/30 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {t('explorer:modal.sections.problem')}
                        </h3>
                        <MarkdownText className="text-gray-200" variant="compact">
                          {feature.modalContent.painAgitation.problem}
                        </MarkdownText>
                      </div>

                      {/* The Solution */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-accent-primary/15 via-accent-secondary/10 to-accent-primary/15 border border-accent-primary/30 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-accent-primary mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {t('explorer:modal.sections.solution')}
                        </h3>
                        <MarkdownText className="text-gray-200" variant="compact">
                          {feature.modalContent.painAgitation.solution}
                        </MarkdownText>
                      </div>

                      {/* The Result */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-success/15 via-success/10 to-success/15 border border-success/30 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-success mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {t('explorer:modal.sections.result')}
                        </h3>
                        <MarkdownText className="text-gray-200" variant="compact">
                          {feature.modalContent.painAgitation.result}
                        </MarkdownText>
                      </div>
                    </div>
                  )}

                  {/* Overview */}
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {t('explorer:modal.sections.technical_overview')}
                    </h3>
                    <MarkdownText className="text-white/90" variant="compact">
                      {feature.modalContent.overview}
                    </MarkdownText>
                  </div>

                  {/* Visualization - Telegram Approval Mockup */}
                  {feature.id === 'telegram-approval' && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-accent-primary/8 via-accent-secondary/5 to-success/8 backdrop-blur-xl">
                      <h3 className="text-lg font-semibold gradient-text mb-4">
                        {t('explorer:modal_sections.live_approval_interface')}
                      </h3>
                      <p className="text-sm text-white/80 mb-4">
                        {t('explorer:modal_sections.approval_experience')}
                      </p>
                      <Suspense
                        fallback={
                          <LoadingFallback message={t('explorer:loading.telegram_mockup')} />
                        }
                      >
                        <TelegramMockup
                          contentType="post"
                          sampleContent={{
                            caption: t('explorer:demo.sample_caption'),
                            hashtags: ['fashion', 'trending', 'style', 'newcollection'],
                            platform: 'Instagram',
                          }}
                        />
                      </Suspense>
                    </div>
                  )}

                  {/* Visualization - Analytics Heat Map */}
                  {feature.id === 'analytics-monitoring' && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-accent-primary/8 via-accent-secondary/5 to-success/8 backdrop-blur-xl">
                      <h3 className="text-lg font-semibold gradient-text mb-4">
                        {t('explorer:modal_sections.forecast_accuracy')}
                      </h3>
                      <p className="text-sm text-white/80 mb-4">
                        {t('explorer:modal_sections.forecast_description')}
                      </p>
                      <Suspense
                        fallback={<LoadingFallback message={t('explorer:loading.heatmap')} />}
                      >
                        <HeatMap
                          data={heatMapData}
                          width={650}
                          height={300}
                          colorScheme="cyan"
                          onCellClick={(data) => {
                            console.log('Clicked cell:', data)
                          }}
                        />
                      </Suspense>
                    </div>
                  )}

                  {/* Visualization - Ad Builder Demo */}
                  {feature.id === 'ad-builder' && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-accent-primary/8 via-accent-secondary/5 to-success/8 backdrop-blur-xl">
                      <h3 className="text-lg font-semibold gradient-text mb-4">
                        {t('explorer:modal_sections.product_photo_ads')}
                      </h3>
                      <p className="text-sm text-white/80 mb-4">
                        {t('explorer:demo.ad_builder_intro')}
                      </p>
                      <Suspense
                        fallback={<LoadingFallback message={t('explorer:loading.ad_builder')} />}
                      >
                        <AdBuilderDemo />
                      </Suspense>
                    </div>
                  )}

                  {/* Process Steps */}
                  {feature.modalContent.processSteps && (
                    <section className="p-6 rounded-2xl bg-gradient-to-br from-accent-secondary/8 via-accent-primary/5 to-accent-secondary/8 backdrop-blur-xl">
                      <h3 className="text-lg font-semibold gradient-text mb-4">
                        {t('explorer:modal_sections.implementation_process')}
                      </h3>
                      <ol className="space-y-4">
                        {feature.modalContent.processSteps.map((step, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 + 0.2 }}
                            className="flex gap-4"
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary flex items-center justify-center font-bold text-sm">
                              {step.step}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-text-primary mb-1">{step.title}</h4>
                              <MarkdownText className="text-sm text-white/80" variant="compact">
                                {step.description}
                              </MarkdownText>
                            </div>
                          </motion.li>
                        ))}
                      </ol>
                    </section>
                  )}

                  {/* Performance Metrics */}
                  {feature.modalContent.metrics && (
                    <section className="p-6 rounded-2xl bg-gradient-to-br from-success/8 via-accent-primary/5 to-accent-secondary/8 backdrop-blur-xl">
                      <h3 className="text-lg font-semibold gradient-text-success mb-6 text-center">
                        {t('explorer:modal_sections.performance_metrics')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {feature.modalContent.metrics.map((metric, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.15 + 0.3, type: 'spring' }}
                          >
                            <MetricCounter
                              value={metric.value}
                              label={metric.label}
                              suffix={metric.suffix}
                              decimals={metric.decimals}
                              variant="success"
                              delay={idx * 0.2}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Capabilities */}
                  <section>
                    <h3 className="text-lg font-semibold text-text-primary mb-3">
                      {t('explorer:modal_sections.key_capabilities')}
                    </h3>
                    <ul className="space-y-2">
                      {feature.modalContent.capabilities.map((capability, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-3 text-white/90"
                        >
                          <span className="text-success text-lg mt-0.5">✓</span>
                          <span>{capability}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </section>

                  {/* Advisory Help Badge - Only show for non-advisory modules */}
                  {feature.id !== 'ai-advisory' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-accent-secondary/10 to-accent-primary/10 border border-accent-secondary/30 cursor-pointer hover:border-accent-secondary/60 hover-lift transition-all"
                      onClick={() => {
                        setSelectedFeature('ai-advisory')
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent-secondary/20 flex items-center justify-center text-2xl">
                          🤝
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-white">
                            {t('explorer:modal_sections.need_help.title')}
                          </div>
                          <div className="text-xs text-white/80">
                            {t('explorer:modal_sections.need_help.description')}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Strategic CTA - Module Detail */}
                  <div className="pt-4">
                    <StrategicCTA
                      variant="module"
                      title={t('explorer:modal_sections.demo_title', { feature: feature.title })}
                      primaryText={getPersonalizedCTA('module')}
                      onPrimaryClick={() => {
                        handleModalClose()
                        openCalendlyWithTracking(`Explorer Module: ${feature.title}`, {
                          customAnswers: {
                            a1: `Industry: ${industryName}`,
                            a2: `Interested in: ${feature.title}`,
                          },
                        })
                      }}
                      secondaryText={t('explorer:modal_sections.close_button')}
                      onSecondaryClick={handleModalClose}
                      context={`Explorer Modal - ${feature.id}`}
                      moduleId={feature.id}
                      trustIndicators={['✓ 30-min call', `✓ ${feature.title} demo`]}
                    />
                  </div>
                </div>
              )
            })()}
        </Modal>
      </Suspense>

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
                  <p className="text-gray-100">
                    {t('explorer:loading.scheduling')}
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

      {/* Progressive Profiling Prompt */}
      {showProfilingPrompt && (
        <ProgressiveProfilingPrompt
          question="painPoints"
          onComplete={() => setShowProfilingPrompt(false)}
          onDismiss={() => setShowProfilingPrompt(false)}
        />
      )}

      {/* Pricing Availability Banner - Persistent across Explorer */}
      <PricingAvailabilityBanner
        totalCustomers={3}
        variant="floating"
        position="top-right"
        onCTAClick={() => openCalendlyWithTracking('Explorer Pricing Banner')}
      />
    </div>
  )
}

export default Explorer
