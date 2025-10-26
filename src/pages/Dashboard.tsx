import React, { useMemo, useState, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import {
  GlassCard,
  TabNavigation,
  ProgressIndicator,
  PricingAvailabilityBanner,
} from '../components'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { usePageAnalytics, usePersonalization, useCalendlyBooking, useIsMobile } from '../hooks'
import { generateAllMockData } from '../data/mock'
import type { DashboardData } from '../types/dashboard'
import { SystemHealthBar } from '../components/command-center/system-health'
import { HeroMetricsRowWorking } from '../components/command-center/hero-metrics/HeroMetricsRowWorking'
import { ContentPipelineFlow } from '../components/command-center/content-pipeline'
import { CampaignManagement } from '../components/command-center/campaign-management'
import { AnalyticsHub } from '../components/command-center/analytics-hub'
import { AIAssistantsShowcase } from '../components/command-center/ai-assistants'
import { PublishingScheduler } from '../components/command-center/publishing-scheduler'
import { MobileBottomNav, UserProfileFloat } from '../components/command-center/layout'
import { convertCampaignsForOrchestra } from '../data/mock'
import { StrategyHub } from '../components/command-center/strategy-hub'
import { usePersonalizationStore } from '../stores'
import { CalendlyFunnelSession } from '../utils/calendlyFunnelTracking'
import { DesktopOnlyNotice } from '../components/mobile'

// Lazy load CalendlyModal
const CalendlyModal = lazy(() =>
  import('../components/common/CalendlyModal').then((module) => ({ default: module.CalendlyModal }))
)

/**
 * Dashboard - Interactive analytics and control center
 *
 * Third layer featuring real-time metrics, campaign management,
 * and system controls.
 */
export const Dashboard: React.FC = () => {
  // i18n translation hook
  const { t } = useTranslation(['dashboard', 'common'])

  // Track page analytics
  usePageAnalytics('Dashboard')

  // Mobile detection
  const isMobile = useIsMobile()

  // Mobile variant - show desktop-only notice (temporary)
  if (isMobile) {
    return <DesktopOnlyNotice pageName="dashboard" />
  }

  // Personalization
  const { industryName, messaging } = usePersonalization()
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
        source: `dashboard_${source.toLowerCase().replace(/\s+/g, '_')}`,
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

  // Active tab state for mobile nav
  const [activeTab, setActiveTab] = useState('overview')

  // Generate mock data once on mount
  const mockData = useMemo<DashboardData>(() => generateAllMockData(), [])

  // Transform weekly performance data for Recharts
  const weeklyPerformanceData = useMemo(() => {
    return mockData.weeklyPerformance.labels.map((label, index) => ({
      day: label,
      roi: mockData.weeklyPerformance.datasets[0].data[index],
      reach: mockData.weeklyPerformance.datasets[1].data[index],
      engagement: mockData.weeklyPerformance.datasets[2].data[index],
    }))
  }, [mockData])

  // Get active campaigns for display
  const activeCampaigns = useMemo(() => {
    return mockData.campaigns
      .filter((c) => c.status === 'active' || c.status === 'paused')
      .slice(0, 4)
      .map((c) => ({
        id: c.id,
        name: c.name,
        status:
          c.status === 'active'
            ? t('dashboard:overview.campaign_status.active')
            : t('dashboard:overview.campaign_status.paused'),
        progress: c.progress,
        roi: `+${c.metrics.roi}%`,
      }))
  }, [mockData, t])

  // Logische tab flow: Overview → Analytics → Strategy → Campaign → Content → Schedule → AI → Ads
  const tabs = [
    {
      id: 'overview',
      label: t('dashboard:tabs.overview'),
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-text-primary mb-6">
            {industryName !== 'General'
              ? t('dashboard:overview.title_with_industry', { industry: industryName })
              : t('dashboard:overview.title')}
          </h2>
          {industryName !== 'General' && (
            <p className="text-text-secondary text-sm mb-4">{messaging.valueProposition}</p>
          )}

          {/* System Health Bar - Real-time Status Indicators */}
          <SystemHealthBar systemHealth={mockData.systemHealth} />

          {/* Hero Metrics Row - 4 Key Performance Indicators */}
          <HeroMetricsRowWorking
            metrics={mockData.heroMetrics}
            enableLiveUpdates={true}
            updateInterval={5000}
          />

          {/* Weekly Performance Graph */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-6">
              {t('dashboard:overview.sections.weekly_performance')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#94A3B8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                  }}
                  labelStyle={{ color: '#E2E8F0' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="roi"
                  stroke="#00D4FF"
                  strokeWidth={2}
                  dot={{ fill: '#00D4FF', r: 4 }}
                  name={t('dashboard:overview.chart_legends.roi')}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#00FF88"
                  strokeWidth={2}
                  dot={{ fill: '#00FF88', r: 4 }}
                  name={t('dashboard:overview.chart_legends.engagement')}
                />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Active Campaigns Table */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {t('dashboard:overview.sections.active_campaigns')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">
                      {t('dashboard:overview.table.campaign')}
                    </th>
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">
                      {t('dashboard:overview.table.status')}
                    </th>
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">
                      {t('dashboard:overview.table.progress')}
                    </th>
                    <th className="text-left py-3 px-4 text-white/90 font-semibold">
                      {t('dashboard:overview.table.roi')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeCampaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-b border-white/10 hover: transition-colors"
                    >
                      <td className="py-3 px-4 text-text-primary">{campaign.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            campaign.status === 'Active'
                              ? 'bg-success/20 text-success'
                              : 'text-white/70 border border-white/20'
                          }`}
                          style={
                            campaign.status !== 'Active'
                              ? { background: 'rgba(0, 0, 0, 0.3)' }
                              : undefined
                          }
                        >
                          {campaign.status === 'Active'
                            ? t('dashboard:overview.campaign_status.active')
                            : campaign.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex-1 h-2 rounded-full overflow-hidden"
                            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                          >
                            <div
                              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
                              style={{ width: `${campaign.progress}%` }}
                            />
                          </div>
                          <span className="text-white/90 text-sm">{campaign.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-success font-semibold">{campaign.roi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* System Performance */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {t('dashboard:overview.sections.system_performance')}
            </h3>
            <div className="space-y-4">
              <ProgressIndicator
                value={87}
                color="primary"
                showLabel
                label={t('dashboard:overview.performance_labels.ai_processing')}
              />
              <ProgressIndicator
                value={92}
                color="success"
                showLabel
                label={t('dashboard:overview.performance_labels.content_generation')}
              />
              <ProgressIndicator
                value={78}
                color="secondary"
                showLabel
                label={t('dashboard:overview.performance_labels.campaign_optimization')}
              />
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {t('dashboard:overview.sections.recent_activity')}
              </h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>
                    {t('dashboard:overview.activity.campaign_deployed', { name: 'Spring Launch' })}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary">⚡</span>
                  <span>
                    {t('dashboard:overview.activity.ai_optimization', { percentage: 23 })}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span>{t('dashboard:overview.activity.content_generated', { count: 50 })}</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {t('dashboard:overview.sections.system_health')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/90">{t('dashboard:overview.health.api_status')}</span>
                  <span
                    className={`font-semibold ${
                      mockData.systemHealth.api.status === 'operational'
                        ? 'text-success'
                        : 'text-warning'
                    }`}
                  >
                    ●{' '}
                    {mockData.systemHealth.api.status === 'operational'
                      ? t('dashboard:overview.health.operational')
                      : t('dashboard:overview.health.degraded')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">{t('dashboard:overview.health.ai_models')}</span>
                  <span className="text-success font-semibold">
                    ●{' '}
                    {t('dashboard:overview.health.active_count', {
                      active: mockData.systemHealth.aiModels.active,
                      total: mockData.systemHealth.aiModels.total,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">
                    {t('dashboard:overview.health.publishing_queue')}
                  </span>
                  <span className="text-accent-primary font-semibold">
                    {t('dashboard:overview.health.pending_count', {
                      count: mockData.systemHealth.publishingQueue.pending,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">
                    {t('dashboard:overview.health.active_jobs')}
                  </span>
                  <span className="text-accent-secondary font-semibold">
                    {t('dashboard:overview.health.processing_count', {
                      count: mockData.systemHealth.processing.activeJobs,
                    })}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      ),
    },
    {
      id: 'analytics-hub',
      label: t('dashboard:tabs.analytics_hub'),
      content: <AnalyticsHub />,
    },
    {
      id: 'strategy',
      label: t('dashboard:tabs.strategy'),
      content: <StrategyHub />,
    },
    {
      id: 'campaign-management',
      label: t('dashboard:tabs.campaign_management'),
      content: <CampaignManagement campaigns={convertCampaignsForOrchestra(mockData.campaigns)} />,
    },
    {
      id: 'content-pipeline',
      label: t('dashboard:tabs.content_pipeline'),
      content: (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-text-primary mb-6">
            {t('dashboard:content_pipeline.title')}
          </h2>
          <ContentPipelineFlow />
        </div>
      ),
    },
    {
      id: 'publishing-scheduler',
      label: t('dashboard:tabs.publishing_scheduler'),
      content: <PublishingScheduler />,
    },
    {
      id: 'ai-assistants',
      label: t('dashboard:tabs.ai_assistants'),
      content: <AIAssistantsShowcase />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-dark via-bg-surface to-bg-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">{t('dashboard:page.title')}</h1>
          <p className="text-xl text-white/90">{t('dashboard:page.subtitle')}</p>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
          className="mt-12"
        />

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

        {/* User Profile Float */}
        <UserProfileFloat />

        {/* Pricing Availability Banner - Persistent on Dashboard */}
        <PricingAvailabilityBanner
          totalCustomers={3}
          variant="floating"
          position="top-right"
          onCTAClick={() => openCalendlyWithTracking('Dashboard Pricing Banner')}
        />
      </div>

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
    </div>
  )
}

export default Dashboard
