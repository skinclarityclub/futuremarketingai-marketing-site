import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  GlassCard,
  Button,
  ProgressIndicator,
  InputSlider,
  LoadingFallback,
  ShareExportButtons,
  ProgressiveProfilingPrompt,
  shouldShowProfilePrompt,
  SlotProgressIndicator,
  PricingRevealModal,
} from '../components'
// Direct import to avoid circular dependency
import { StrategicCTA } from '../components/common/StrategicCTA'
import {
  CalculatorWizard,
  CompanySizeSelector,
  PrimaryGoalSelector,
  ChannelsSelector,
  companySizeToTeamSize,
  LivePreviewPanel,
  CompetitivePositionCard,
  ScenarioExplorer,
  WastedAdSpendCard,
  ComparisonTable,
  ComparisonCharts,
} from '../components/calculator'
import type { CompanySize, PrimaryGoal } from '../components/calculator'
import { calculateICPScore, type ICPInputData, type ChannelsCount } from '../utils/icpScoring'

// Lazy load heavy visualization components
const AnimatedMetric = lazy(() =>
  import('../components/common/AnimatedMetric').then((module) => ({
    default: module.AnimatedMetric,
  }))
)
const BreakEvenTimeline = lazy(() =>
  import('../components/common/BreakEvenTimeline').then((module) => ({
    default: module.BreakEvenTimeline,
  }))
)
const CalendlyModal = lazy(() =>
  import('../components/common/CalendlyModal').then((module) => ({
    default: module.CalendlyModal,
  }))
)

import {
  calculateROIMetrics,
  formatPercentage,
  formatNumber,
  type ROIMetrics,
  DEFAULT_CONSTANTS,
} from '../utils/calculations'
import {
  trackCTAClick,
  trackCalendly,
  trackCalculator,
  hotjarEvent,
  HotjarEvents,
  hotjarTagRecording,
} from '../utils/analytics'
import { trackVariantFormCompletion } from '../utils/headlineVariants'
import {
  usePageAnalytics,
  useShareCalculator,
  useCalendlyBooking,
  usePersonalization,
} from '../hooks'
import { usePersonalizationStore } from '../stores'
import { CalendlyFunnelSession } from '../utils/calendlyFunnelTracking'

// LocalStorage keys
const STORAGE_KEYS = {
  TEAM_SIZE: 'roi_calc_team_size',
  CHANNELS: 'roi_calc_channels',
  MARKETING_SPEND: 'roi_calc_marketing_spend',
  AVG_SALARY: 'roi_calc_avg_salary',
  CAMPAIGNS_PER_MONTH: 'roi_calc_campaigns_per_month',
}

/**
 * Calculator - ROI and impact calculation tool
 *
 * Final layer where users can calculate potential ROI
 * and visualize the impact of the system.
 *
 * Features:
 * - Input validation with ranges
 * - LocalStorage persistence
 * - Real-time ROI calculation
 * - Visual impact breakdown
 */
export const Calculator: React.FC = () => {
  // i18n translation hook
  const { t } = useTranslation(['calculator', 'common'])

  // Track page analytics
  usePageAnalytics('Calculator')

  // Personalization
  const { benchmarks, messaging, industryName, getPersonalizedCTA, userIntent, updateICPScore } =
    usePersonalization()
  const { setCalculatorInputs } = usePersonalizationStore()

  // URL sharing hook
  const { loadFromURL } = useShareCalculator()

  // Calendly booking (will setup funnel tracking after icpScore is calculated)
  const calendly = useCalendlyBooking()
  const funnelSessionRef = React.useRef<CalendlyFunnelSession | null>(null)

  // Progressive profiling
  const [showProfilingPrompt, setShowProfilingPrompt] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)

  // NEW: Wizard state (persona-based inputs)
  const [companySize, setCompanySize] = useState<CompanySize | undefined>(undefined)
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal | undefined>(undefined)

  // Step 4: Ad Efficiency (ROAS)
  const [monthlyAdBudget, setMonthlyAdBudget] = useState<number>(0)
  const [testingLevel, setTestingLevel] = useState<number>(0) // 0-100: none → basic → AI-powered

  // Show profiling prompt after user interacts with calculator
  useEffect(() => {
    // Check if we should show the prompt
    if (!shouldShowProfilePrompt('companySize')) {
      return
    }

    // Show after 10 seconds of viewing results
    const timer = setTimeout(() => {
      setShowProfilingPrompt(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  // Show pricing modal after ROI calculation (5 seconds delay)
  // TEMPORARILY DISABLED for wizard testing
  useEffect(() => {
    // const timer = setTimeout(() => {
    //   setShowPricingModal(true)
    // }, 5000)
    // return () => clearTimeout(timer)
  }, [])

  // Load values from URL, LocalStorage, or use defaults
  const getInitialValue = (key: string, defaultValue: number): number => {
    // Priority 1: URL params (for sharing)
    const urlParams = loadFromURL()
    if (urlParams) {
      if (key === 'teamSize') {
        return urlParams.teamSize
      }
      if (key === 'avgSalary') {
        return urlParams.avgSalary
      }
      if (key === 'campaignsPerMonth') {
        return urlParams.campaignsPerMonth
      }
    }

    // Priority 2: LocalStorage (for persistence)
    const stored = localStorage.getItem(
      STORAGE_KEYS[key.toUpperCase() as keyof typeof STORAGE_KEYS]
    )
    if (stored) {
      return Number(stored)
    }

    // Priority 3: Defaults
    return defaultValue
  }

  // Proxy indicator inputs
  // Team size is derived from companySize (if set) or direct value
  const [teamSize, setTeamSize] = useState(() =>
    getInitialValue('teamSize', benchmarks.avgTeamSize)
  )

  // Sync teamSize with companySize selection
  useEffect(() => {
    if (companySize) {
      const mappedTeamSize = companySizeToTeamSize(companySize)
      setTeamSize(mappedTeamSize)
    }
  }, [companySize])
  const [channels, setChannels] = useState<ChannelsCount>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CHANNELS)
    return (stored as ChannelsCount) || '3-5'
  })
  const [marketingSpend, setMarketingSpend] = useState(() => getInitialValue('marketingSpend', 0))

  // Legacy calculation inputs (kept for ROI calculation)
  const [avgSalary, setAvgSalary] = useState(() =>
    getInitialValue('avgSalary', benchmarks.avgSalary)
  )
  const [campaignsPerMonth, setCampaignsPerMonth] = useState(() =>
    getInitialValue('campaignsPerMonth', benchmarks.avgCampaignsPerMonth)
  )

  // Calculate ICP score based on proxy indicators
  const icpData: ICPInputData = useMemo(
    () => ({
      teamSize: teamSize <= 5 ? '1-5' : teamSize <= 15 ? '5-15' : teamSize <= 50 ? '15-50' : '50+',
      channels,
      painPoints: marketingSpend > 10000 ? ['agency-cost', 'manual-work'] : ['manual-work'],
      industry: industryName.toLowerCase() as 'ecommerce' | 'saas' | 'agency',
    }),
    [teamSize, channels, marketingSpend, industryName]
  )

  const icpScore = useMemo(() => calculateICPScore(icpData), [icpData])
  // icpPersonalization available if needed in future
  // const icpPersonalization = useMemo(() => getPersonalizationConfig(icpScore.totalScore), [icpScore])

  // Calendly funnel tracking functions (defined after icpScore calculation)
  const openCalendlyWithTracking = React.useCallback(
    (source: string, prefill?: any) => {
      const icpTier =
        icpScore.totalScore >= 80
          ? 'enterprise'
          : icpScore.totalScore >= 60
            ? 'strategic'
            : icpScore.totalScore >= 40
              ? 'standard'
              : 'discovery'

      funnelSessionRef.current = new CalendlyFunnelSession({
        source: `calculator_${source.toLowerCase().replace(/\s+/g, '_')}`,
        eventType: calendly.eventType.id,
        icpScore: icpScore.totalScore || 0,
        icpTier,
      })

      funnelSessionRef.current.trackStep('booking_prompt_shown')
      funnelSessionRef.current.trackStep('booking_cta_clicked')

      calendly.open(source, prefill)
    },
    [calendly, icpScore]
  )

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

  // Persist to LocalStorage whenever values change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAM_SIZE, String(teamSize))
    trackCalculator('Team Size Changed', String(teamSize))
    trackCalculator('ICP Score', String(icpScore.totalScore))
  }, [teamSize, icpScore.totalScore])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHANNELS, channels)
    trackCalculator('Channels Changed', channels)
  }, [channels])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MARKETING_SPEND, String(marketingSpend))
    trackCalculator('Marketing Spend Changed', String(marketingSpend))
  }, [marketingSpend])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AVG_SALARY, String(avgSalary))
    trackCalculator('Avg Salary Changed', String(avgSalary))
  }, [avgSalary])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS_PER_MONTH, String(campaignsPerMonth))
    trackCalculator('Campaigns/Month Changed', String(campaignsPerMonth))
  }, [campaignsPerMonth])

  // Update personalization store with calculator inputs and ICP score
  useEffect(() => {
    setCalculatorInputs({
      teamSize,
      avgSalary,
      campaignsPerMonth,
      channels,
      marketingSpend,
    })
    updateICPScore()
  }, [
    teamSize,
    avgSalary,
    campaignsPerMonth,
    channels,
    marketingSpend,
    setCalculatorInputs,
    updateICPScore,
  ])

  // Calculate ROI metrics with real-time updates
  // useMemo ensures recalculation only when inputs change
  const metrics: ROIMetrics = useMemo(() => {
    const calculatedMetrics = calculateROIMetrics({
      teamSize,
      avgSalary,
      campaignsPerMonth,
    })

    // Track calculation completion
    trackCalculator('Calculation Complete', String(calculatedMetrics.totalROI))
    hotjarEvent(HotjarEvents.CALCULATOR_COMPLETE)

    // Track A/B test form completion (calculator completion counts as conversion)
    trackVariantFormCompletion('calculator_completion')

    // Tag Hotjar recording with calculated ROI value
    hotjarTagRecording({
      roi_percentage: Math.round(calculatedMetrics.totalROI),
      monthly_savings: Math.round(calculatedMetrics.laborCostSavings),
      team_size: teamSize,
      high_roi: calculatedMetrics.totalROI > 300,
    })

    return calculatedMetrics
  }, [teamSize, avgSalary, campaignsPerMonth])

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">
            ROI Calculator{' '}
            {industryName !== 'General' && (
              <span className="text-accent-primary">• {industryName}</span>
            )}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">{messaging.calculatorIntro}</p>
          {industryName !== 'General' && (
            <p className="text-sm text-white/80 mt-2">{benchmarks.description}</p>
          )}
        </div>

        {/* Current Cost Pain Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-4 sm:p-6 md:p-8 mb-6 md:mb-8 border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-red-500/10">
            <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-red-400 mb-3">
                  {t('calculator:pain_section.title')}
                </h2>
                <div className="space-y-3 text-white/90">
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: t('calculator:pain_section.points.hours'),
                      }}
                    />
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: t('calculator:pain_section.points.costs'),
                      }}
                    />
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: t('calculator:pain_section.points.posts'),
                      }}
                    />
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: t('calculator:pain_section.points.strategy'),
                      }}
                    />
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: t('calculator:pain_section.points.advertising'),
                      }}
                    />
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: t('calculator:pain_section.points.offshelf'),
                      }}
                    />
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-red-400/20">
              <p
                className="text-center text-lg text-white/90"
                dangerouslySetInnerHTML={{ __html: t('calculator:pain_section.cta') }}
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Calculator Layout: Wizard + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Wizard - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <CalculatorWizard
              inputs={{
                companySize,
                teamSize,
                channels,
                marketingSpend,
                campaignsPerMonth,
                avgSalary,
                primaryGoal,
                monthlyAdBudget,
                testingLevel,
              }}
              onInputChange={(key, value) => {
                // Handle input changes based on key
                switch (key) {
                  case 'companySize':
                    setCompanySize(value as CompanySize)
                    break
                  case 'teamSize':
                    setTeamSize(value as number)
                    break
                  case 'channels':
                    setChannels(value as ChannelsCount)
                    break
                  case 'marketingSpend':
                    setMarketingSpend(value as number)
                    break
                  case 'campaignsPerMonth':
                    setCampaignsPerMonth(value as number)
                    break
                  case 'avgSalary':
                    setAvgSalary(value as number)
                    break
                  case 'primaryGoal':
                    setPrimaryGoal(value as PrimaryGoal)
                    break
                  case 'monthlyAdBudget':
                    setMonthlyAdBudget(value as number)
                    break
                  case 'testingLevel':
                    setTestingLevel(value as number)
                    break
                }
              }}
              onComplete={() => {
                // Scroll to results section when wizard is complete
                const resultsSection = document.getElementById('roi-results')
                if (resultsSection) {
                  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              renderStep={(step, inputs, onChange) => {
                switch (step) {
                  case 1: // Step 1: Quick Profile
                    return (
                      <div className="space-y-6">
                        <CompanySizeSelector
                          value={inputs.companySize}
                          onChange={(size) => onChange('companySize', size)}
                        />

                        <ChannelsSelector
                          value={inputs.channels}
                          onChange={(ch) => onChange('channels', ch)}
                        />

                        <PrimaryGoalSelector
                          value={inputs.primaryGoal}
                          onChange={(goal) => onChange('primaryGoal', goal)}
                        />
                      </div>
                    )

                  case 2: // Step 2: Current Reality
                    return (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="text-2xl">👥</span>
                            <div className="flex-1">
                              <InputSlider
                                label="Internal Team Costs (Monthly)"
                                value={inputs.marketingSpend}
                                min={0}
                                max={50000}
                                step={1000}
                                isCurrency
                                onChange={(value) => onChange('marketingSpend', value)}
                                description="Salaries, tools, software - your internal marketing team expenses"
                              />
                            </div>
                          </div>
                        </div>

                        {inputs.marketingSpend > 10000 && (
                          <div className="p-3 rounded-lg bg-accent-success/10 border border-accent-success/30">
                            <div className="flex items-start gap-2">
                              <span className="text-accent-success">💡</span>
                              <p className="text-xs text-white/90">
                                <strong>{t('calculator:inputs.high_spend_alert.title')}</strong>{' '}
                                {t('calculator:inputs.high_spend_alert.description')}
                              </p>
                            </div>
                          </div>
                        )}

                        <InputSlider
                          label={t('calculator:inputs.campaigns.label')}
                          value={inputs.campaignsPerMonth}
                          min={1}
                          max={200}
                          step={5}
                          unit={t('calculator:inputs.campaigns.unit')}
                          onChange={(value) => onChange('campaignsPerMonth', value)}
                          description={t('calculator:inputs.campaigns.description')}
                        />
                      </div>
                    )

                  case 3: // Step 3: Your Goals (Advanced)
                    return (
                      <div className="space-y-6">
                        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-sm text-white/80">
                            ✨ Almost done! These advanced settings help us calculate more accurate
                            ROI for your specific situation.
                          </p>
                        </div>

                        <InputSlider
                          label={t('calculator:inputs.avg_salary.label')}
                          value={inputs.avgSalary}
                          min={30000}
                          max={200000}
                          step={5000}
                          isCurrency
                          onChange={(value) => onChange('avgSalary', value)}
                          description={t('calculator:inputs.avg_salary.description')}
                        />

                        {/* Optional: Add goal-specific fields here based on primaryGoal */}
                        {inputs.primaryGoal && (
                          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20">
                            <p className="text-sm text-white/90">
                              💡 Based on your goal to{' '}
                              <strong>
                                {inputs.primaryGoal === 'leads' && 'increase leads'}
                                {inputs.primaryGoal === 'time' && 'save time'}
                                {inputs.primaryGoal === 'scale' && 'scale output'}
                                {inputs.primaryGoal === 'costs' && 'reduce costs'}
                              </strong>
                              , we'll show you tailored ROI metrics!
                            </p>
                          </div>
                        )}
                      </div>
                    )

                  case 4: // Step 4: Ad Efficiency (ROAS)
                    return (
                      <div className="space-y-6">
                        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">💎</span>
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-1">
                                Test First, Then Scale
                              </h4>
                              <p className="text-xs text-white/70">
                                Most businesses waste 30-50% of ad spend by launching without
                                testing. AI-powered testing can improve your ROAS by 4-7x!
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="text-2xl">💰</span>
                            <div className="flex-1">
                              <InputSlider
                                label="Paid Ad Spend (Monthly, Optional)"
                                value={inputs.monthlyAdBudget || 0}
                                min={0}
                                max={50000}
                                step={1000}
                                isCurrency
                                onChange={(value) => onChange('monthlyAdBudget', value)}
                                description="Facebook, Google, LinkedIn Ads - this is SEPARATE from team costs"
                              />
                            </div>
                          </div>
                          {inputs.monthlyAdBudget === 0 && (
                            <div className="ml-9 text-xs text-white/60 italic">
                              💡 Tip: If you don't run paid ads, leave this at €0
                            </div>
                          )}
                        </div>

                        {inputs.monthlyAdBudget && inputs.monthlyAdBudget > 0 && (
                          <>
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-white">
                                Current Testing Level
                              </label>
                              <p className="text-xs text-white/70 mb-3">
                                How much testing do you do before scaling ads?
                              </p>

                              {/* Visual Testing Level Cards */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                  { level: 0, label: 'No Testing', icon: '❌', desc: '0%' },
                                  { level: 25, label: 'Basic Testing', icon: '🔬', desc: '25%' },
                                  { level: 50, label: 'Advanced', icon: '🎯', desc: '50%' },
                                  { level: 75, label: 'AI-Assisted', icon: '🤖', desc: '75%' },
                                  { level: 100, label: 'AI-Powered', icon: '🚀', desc: '100%' },
                                ].map(({ level, label, icon, desc }) => (
                                  <button
                                    key={level}
                                    type="button"
                                    onClick={() => onChange('testingLevel', level)}
                                    className={`p-3 rounded-xl border-2 transition-all min-h-[88px] flex flex-col items-center justify-center gap-1 ${
                                      (inputs.testingLevel || 0) === level
                                        ? 'border-accent-primary bg-accent-primary/20 shadow-lg shadow-accent-primary/20'
                                        : 'border-white/20 bg-white/5 hover:border-accent-primary/50 hover:bg-white/10'
                                    }`}
                                    aria-pressed={(inputs.testingLevel || 0) === level}
                                  >
                                    <span className="text-2xl">{icon}</span>
                                    <span className="text-xs font-semibold text-white text-center">
                                      {label}
                                    </span>
                                    <span className="text-xs text-accent-primary font-bold">
                                      {desc}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* ROAS Preview */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-accent-success/10 to-accent-primary/10 border border-accent-success/20">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-white">
                                  Potential ROAS Improvement
                                </span>
                                <span className="text-lg font-bold text-accent-success">
                                  {inputs.testingLevel === 0 && '→ 3-5x'}
                                  {inputs.testingLevel === 25 && '→ 2-3x'}
                                  {inputs.testingLevel === 50 && '→ 1.5-2x'}
                                  {inputs.testingLevel === 75 && '→ 1.2-1.5x'}
                                  {inputs.testingLevel === 100 && '✅ Optimized'}
                                </span>
                              </div>
                              <p className="text-xs text-white/70">
                                {inputs.testingLevel === 0 &&
                                  'You could save €' +
                                    Math.round(inputs.monthlyAdBudget * 0.4).toLocaleString() +
                                    '/month in wasted ad spend'}
                                {inputs.testingLevel === 25 &&
                                  'You could save €' +
                                    Math.round(inputs.monthlyAdBudget * 0.25).toLocaleString() +
                                    '/month more'}
                                {inputs.testingLevel === 50 &&
                                  'You could save €' +
                                    Math.round(inputs.monthlyAdBudget * 0.15).toLocaleString() +
                                    '/month more'}
                                {inputs.testingLevel === 75 &&
                                  'Almost there! Save €' +
                                    Math.round(inputs.monthlyAdBudget * 0.08).toLocaleString() +
                                    '/month more'}
                                {inputs.testingLevel === 100 &&
                                  'Your ads are running at peak efficiency! 🎉'}
                              </p>
                            </div>
                          </>
                        )}

                        {(!inputs.monthlyAdBudget || inputs.monthlyAdBudget === 0) && (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm text-white/70">
                              💡 <strong>No ad spend?</strong> That's okay! We'll still calculate
                              your overall ROI. If you plan to run ads in the future, come back and
                              fill this in!
                            </p>
                          </div>
                        )}
                      </div>
                    )

                  default:
                    return null
                }
              }}
            />
          </div>

          {/* Live Preview Panel - Takes 1 column on desktop, below on mobile */}
          <div className="lg:col-span-1">
            <LivePreviewPanel
              inputs={{
                teamSize,
                campaignsPerMonth,
                avgSalary,
                monthlyAdBudget,
                testingLevel,
              }}
              show={teamSize > 0 && campaignsPerMonth > 0}
            />
          </div>
        </div>

        {/* Hero ROI Display */}
        <Suspense fallback={<LoadingFallback message={t('calculator:results.loading')} />}>
          <GlassCard id="roi-results" className="p-8 mb-8 text-center scroll-mt-24">
            <h2 className="text-lg font-semibold text-white/90 mb-4">
              {t('calculator:results.roi_title')}
            </h2>
            <AnimatedMetric
              label=""
              value={metrics.totalROI}
              format="percentage"
              color="success"
              size="lg"
            />
            <p className="text-sm text-white/80 mt-4">
              {marketingSpend > 0
                ? t('calculator:results.team_description_with_spend', {
                    teamSize,
                    channels,
                    spend: marketingSpend.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0,
                    }),
                  })
                : t('calculator:results.team_description', { teamSize, channels })}
            </p>

            {/* Custom-Built ROI Enhancement Message */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-accent-gold/10 to-accent-primary/10 border border-accent-gold/30">
              <p className="text-sm text-white/90">
                <span className="text-accent-gold font-bold">
                  {t('calculator:results.custom_built_advantage.badge')}
                </span>{' '}
                {t('calculator:results.custom_built_advantage.description')}
              </p>
            </div>
          </GlassCard>

          {/* Key Metrics with Before/After Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <GlassCard className="p-6">
              <AnimatedMetric
                label={t('calculator:results.metric_labels.time_saved')}
                value={metrics.timeSaved}
                beforeValue={0}
                format="number"
                suffix="hours/month"
                color="success"
                showComparison
                size="md"
              />
            </GlassCard>

            <GlassCard className="p-6">
              <AnimatedMetric
                label={t('calculator:results.metric_labels.labor_cost_savings')}
                value={metrics.laborCostSavings}
                beforeValue={0}
                format="currency"
                color="primary"
                showComparison
                size="md"
              />
            </GlassCard>

            <GlassCard className="p-6">
              <AnimatedMetric
                label={t('calculator:results.metric_labels.content_output')}
                value={metrics.contentOutput}
                beforeValue={campaignsPerMonth}
                format="number"
                suffix="campaigns/month"
                color="secondary"
                showComparison
                size="md"
              />
            </GlassCard>

            <GlassCard className="p-6">
              <AnimatedMetric
                label={t('calculator:results.metric_labels.revenue_increase')}
                value={metrics.revenueIncrease}
                beforeValue={0}
                format="currency"
                color="success"
                showComparison
                size="md"
              />
            </GlassCard>
          </div>

          {/* New Comparison Table with Visual Bars */}
          <div className="mb-8" data-pdf-table>
            <ComparisonTable
              metrics={metrics}
              inputs={{
                teamSize,
                avgSalary,
                campaignsPerMonth,
              }}
              systemCost={DEFAULT_CONSTANTS.systemCost}
            />
          </div>

          {/* Interactive Comparison Charts */}
          <div className="mb-8" data-pdf-charts>
            <ComparisonCharts
              metrics={metrics}
              inputs={{
                teamSize,
                avgSalary,
                campaignsPerMonth,
              }}
              systemCost={DEFAULT_CONSTANTS.systemCost}
            />
          </div>

          {/* Share & Export Buttons */}
          <GlassCard className="p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
            <div className="text-center mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold gradient-text mb-2">
                {t('calculator:share.title')}
              </h3>
              <p className="text-white/90">{t('calculator:share.subtitle')}</p>
            </div>
            <ShareExportButtons
              metrics={metrics}
              inputs={{
                teamSize,
                avgSalary,
                campaignsPerMonth,
              }}
            />
          </GlassCard>

          {/* Advisory Help Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <GlassCard
              className="p-6 bg-gradient-to-r from-accent-secondary/10 to-accent-primary/10 border-2 border-accent-secondary/30 hover:border-accent-secondary/60 hover-lift transition-all cursor-pointer"
              onClick={() => {
                window.location.href = '/explorer#ai-advisory'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent-secondary/20 flex items-center justify-center text-4xl flex-shrink-0">
                  🤝
                </div>
                <div className="flex-1">
                  <div className="text-xl font-bold text-white mb-1">Not Sure How to Start?</div>
                  <div className="text-sm text-white/90">
                    As your personal AI expert, I'll help with strategy, implementation, and
                    optimization. No technical knowledge needed! →
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className="w-8 h-8 text-accent-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Strategic CTA - After Results (Personalized) */}
          <div className="mb-8">
            <StrategicCTA
              variant="hero"
              title={`${teamSize <= 5 ? 'Lean Team' : teamSize <= 15 ? 'Growing Team' : 'Scaling Team'} of ${teamSize}${industryName !== 'General' ? ` • ${industryName}` : ''} • ${formatPercentage(metrics.totalROI)} ROI`}
              description={`Your team could save ${(metrics.netBenefit * 12).toLocaleString(
                'en-US',
                {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                }
              )} per year while scaling output. ${messaging.calculatorIntro}`}
              primaryText={getPersonalizedCTA('calculator')}
              onPrimaryClick={() =>
                openCalendlyWithTracking('Calculator Results', {
                  customAnswers: {
                    a1: `Industry: ${industryName}`,
                    a2: `Team size: ${teamSize} people managing ${channels} channels`,
                    a3: `ICP Score: ${icpScore.totalScore}/100`,
                  },
                })
              }
              secondaryText="Download PDF"
              onSecondaryClick={() => {
                // Trigger PDF export from ShareExportButtons
                const exportBtn = document.querySelector('[data-export-pdf]')
                exportBtn?.click()
              }}
              showUrgency={userIntent === 'low'} // Only show urgency for low-intent users
              urgencyText={
                icpScore.totalScore >= 70
                  ? '⏰ Perfect fit • Priority onboarding'
                  : '⏰ Free roadmap ($1,500 value)'
              }
              trustIndicators={[
                `✓ ${teamSize <= 5 ? 'Lean' : teamSize <= 15 ? 'Growing' : 'Scaling'} team specialist`,
                `✓ ${industryName} expertise`,
                '✓ Custom roadmap',
              ]}
              context="Calculator Results"
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard className="p-6">
              <AnimatedMetric
                label="Return on Ad Spend"
                value={metrics.roas}
                format="ratio"
                color="primary"
                size="md"
              />
            </GlassCard>

            <GlassCard className="p-6">
              <AnimatedMetric
                label="Monthly Net Benefit"
                value={metrics.netBenefit}
                format="currency"
                color={metrics.netBenefit > 0 ? 'success' : 'warning'}
                size="md"
              />
            </GlassCard>

            <GlassCard className="p-6">
              <AnimatedMetric
                label="Productivity Multiplier"
                value={metrics.productivityMultiplier}
                format="ratio"
                color="secondary"
                size="md"
              />
            </GlassCard>
          </div>

          {/* Break-Even Timeline */}
          <GlassCard className="p-8 mb-8">
            <BreakEvenTimeline
              months={metrics.breakEven}
              monthlyBenefit={metrics.laborCostSavings + metrics.revenueIncrease}
              systemCost={DEFAULT_CONSTANTS.systemCost}
            />
          </GlassCard>

          {/* Competitive Benchmarking */}
          <CompetitivePositionCard
            userMetrics={{
              roi: metrics.totalROI,
              timeSaved: metrics.timeSaved,
              costSavings: metrics.laborCostSavings + metrics.revenueIncrease,
              currentROAS: metrics.currentROAS,
            }}
            benchmarks={{
              avgROI: benchmarks.typicalROI,
              topROI: benchmarks.topPerformerROI,
              avgTimeSaved: benchmarks.avgTimeSaved,
              topTimeSaved: benchmarks.topTimeSaved,
              avgCostSavings: benchmarks.avgCostSavings,
              topCostSavings: benchmarks.topCostSavings,
              avgROAS: benchmarks.avgROAS,
              topROAS: benchmarks.topROAS,
            }}
            className="mb-8"
          />

          {/* Interactive Scenario Explorer */}
          <ScenarioExplorer
            baselineInputs={{
              teamSize,
              campaignsPerMonth,
              avgSalary,
              monthlyAdBudget,
              testingLevel,
            }}
            baselineMetrics={{
              totalROI: metrics.totalROI,
              timeSaved: metrics.timeSaved,
              laborCostSavings: metrics.laborCostSavings,
              revenueIncrease: metrics.revenueIncrease,
              currentROAS: metrics.currentROAS,
              wastedAdSpend: metrics.wastedAdSpend,
            }}
            className="mb-8"
          />

          {/* Wasted Ad Spend Card (ROAS Feature) */}
          {monthlyAdBudget > 0 && metrics.wastedAdSpend && (
            <WastedAdSpendCard
              monthlyAdBudget={monthlyAdBudget}
              testingLevel={testingLevel}
              wastedAdSpend={metrics.wastedAdSpend}
              adSpendSavings={metrics.adSpendSavings || 0}
              adRevenueIncrease={metrics.adRevenueIncrease || 0}
              currentROAS={metrics.currentROAS || 2}
              potentialROAS={metrics.potentialROAS || 12}
              className="mb-8"
            />
          )}
        </Suspense>

        {/* ROI Visualization */}
        <GlassCard className="p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-4 md:mb-6">
            Impact Breakdown
          </h3>
          <div className="space-y-4">
            <ProgressIndicator
              value={Math.min((metrics.timeSaved / 500) * 100, 100)}
              color="success"
              showLabel
              label={`Time Efficiency: ${formatNumber(metrics.timeSaved)}h saved/month`}
            />
            <ProgressIndicator
              value={Math.min((metrics.contentOutput / 100) * 100, 100)}
              color="primary"
              showLabel
              label={`Campaign Output: ${formatNumber(metrics.contentOutput)} campaigns/month`}
            />
            <ProgressIndicator
              value={Math.min((metrics.totalROI / 1000) * 100, 100)}
              color="secondary"
              showLabel
              label={`ROI Potential: ${formatPercentage(metrics.totalROI)}`}
            />
            <ProgressIndicator
              value={Math.min((metrics.roas / 10) * 100, 100)}
              color="primary"
              showLabel
              label={`Return on Ad Spend: ${metrics.roas.toFixed(1)}:1`}
            />
          </div>
        </GlassCard>

        {/* Pricing Slot Availability - Exclusive Early Access */}
        <GlassCard className="p-6 md:p-8 mb-6 md:mb-8 border-2 border-accent-primary/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="text-5xl">🏆</span>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent">
                  Exclusive Early Adopter Pricing
                </h3>
              </div>
              <p className="text-xl text-white/90">
                Lock in Founding Member rates before they increase
              </p>
            </div>

            {/* Slot Progress Indicators - All Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Founding 5 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                <SlotProgressIndicator
                  tier="founding"
                  totalCustomers={3}
                  variant="full"
                  showBadge
                  showPercentage
                  size="md"
                  glow
                  pulseWhenLow
                />
              </motion.div>

              {/* Pioneer 10 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <SlotProgressIndicator
                  tier="pioneer"
                  totalCustomers={3}
                  variant="full"
                  showBadge
                  showPercentage
                  size="md"
                />
              </motion.div>

              {/* Innovator 10 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <SlotProgressIndicator
                  tier="innovator"
                  totalCustomers={3}
                  variant="full"
                  showBadge
                  showPercentage
                  size="md"
                />
              </motion.div>
            </div>

            {/* Value Proposition */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-background-secondary/80 to-background-secondary/40 backdrop-blur-xl border border-accent-primary/30">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">💰</div>
                <div>
                  <p className="text-lg font-bold text-white mb-2">
                    Your ROI:{' '}
                    <span className="text-accent-success">
                      {formatPercentage(metrics.totalROI)}
                    </span>{' '}
                    • Payback: <span className="text-accent-success">10 days</span>
                  </p>
                  <p className="text-sm text-white/90">
                    With Founding Member pricing, this system pays for itself in less than 2 weeks
                    based on your calculations.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </GlassCard>

        {/* CTA Section */}
        <GlassCard className="p-4 sm:p-6 md:p-8 mb-6 md:mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">
              {t('calculator:final_cta.title')}
            </h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              {t('calculator:final_cta.description', {
                roi: formatPercentage(metrics.totalROI),
                hours: formatNumber(metrics.timeSaved),
              })}
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button
                variant="primary"
                size="lg"
                glow
                onClick={() => {
                  trackCTAClick('Schedule Strategic Consultation', 'Calendly')
                  trackCalendly('Modal Opened', 'Strategic Consultation')
                  // Placeholder Calendly URL - replace with actual URL
                  window.open('https://calendly.com', '_blank')
                }}
                className="text-lg px-8 py-4 min-w-[280px]"
              >
                📅 Book Call
              </Button>

              <Link to="/dashboard">
                <Button
                  variant="secondary"
                  size="lg"
                  className="min-w-[200px]"
                  onClick={() => trackCTAClick('Explore Features', 'Dashboard')}
                >
                  Explore Platform
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <span className="text-accent-success">✓</span>
                <span>Free 30-min consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent-success">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-accent-success">✓</span>
                <span>Custom ROI analysis</span>
              </div>
            </div>
          </motion.div>
        </GlassCard>
      </div>

      {/* Calendly Modal - Lazy loaded for performance */}
      {calendly.isOpen && (
        <Suspense
          fallback={
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <div
                className="bg-white rounded-lg p-6 shadow-xl"
                style={{ background: 'rgba(0, 0, 0, 0.4)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  <p className="text-gray-900 dark:text-gray-100">
                    {t('calculator:loading.scheduling')}
                  </p>
                </div>
                {/* Screen reader only text for context */}
                <span className="sr-only">{t('common:loading.calendly')}</span>
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
          question="companySize"
          onComplete={() => setShowProfilingPrompt(false)}
          onDismiss={() => setShowProfilingPrompt(false)}
        />
      )}

      {/* Pricing Reveal Modal - Triggered after ROI calculation */}
      <PricingRevealModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        calculatedMonthlyROI={metrics.netBenefit}
        calculatedROIPercentage={metrics.totalROI}
        totalCustomers={3}
        onCTAClick={() => {
          openCalendlyWithTracking('Pricing Modal CTA')
          trackCTAClick('Claim Tier Spot', 'Pricing Modal')
        }}
        showSocialProof
      />
    </div>
  )
}

export default Calculator
