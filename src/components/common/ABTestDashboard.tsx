import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from './GlassCard'
import {
  getVariantAnalyticsSummary,
  resetVariantAnalytics,
  type HeadlineVariant,
  type VariantAnalyticsSummary,
  type VariantMetrics,
} from '../../utils/headlineVariants'

// ============================================================================
// Types
// ============================================================================

interface ABTestDashboardProps {
  className?: string
}

// ============================================================================
// Component
// ============================================================================

/**
 * A/B Test Dashboard Component
 *
 * Displays real-time analytics for headline variant A/B testing.
 * Shows metrics for each variant: Team Size, Pain Point, and Situation focus.
 *
 * Metrics tracked:
 * - Assignments (how many users saw this variant)
 * - CTA Clicks (engagement rate)
 * - Form Completions (conversion rate)
 * - Conversion Rate percentage
 *
 * Based on: src/utils/headlineVariants.ts
 */
export function ABTestDashboard({ className = '' }: ABTestDashboardProps) {
  const [summary, setSummary] = useState<VariantAnalyticsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load analytics data
  useEffect(() => {
    const loadData = () => {
      try {
        const data = getVariantAnalyticsSummary()
        setSummary(data)
      } catch (error) {
        console.error('Failed to load A/B test analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Refresh every 5 seconds
    const interval = setInterval(loadData, 5000)

    return () => clearInterval(interval)
  }, [])

  // Handle reset
  const handleReset = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all A/B test analytics? This cannot be undone.'
      )
    ) {
      resetVariantAnalytics()
      setSummary(getVariantAnalyticsSummary())
    }
  }

  // Calculate totals
  const getTotals = () => {
    if (!summary) {
      return { assignments: 0, ctaClicks: 0, formCompletions: 0 }
    }

    const variants: HeadlineVariant[] = [
      'team_size',
      'pain_point',
      'situation',
      'future_focused',
      'innovation_focused',
      'risk_reward',
    ]

    return {
      assignments: variants.reduce((sum, v) => sum + summary[v].assignments, 0),
      ctaClicks: variants.reduce((sum, v) => sum + summary[v].ctaClicks, 0),
      formCompletions: variants.reduce((sum, v) => sum + summary[v].formCompletions, 0),
    }
  }

  // Get best performing variant
  const getBestVariant = (): HeadlineVariant | null => {
    if (!summary) {
      return null
    }

    const variants = Object.entries(summary) as [HeadlineVariant, VariantMetrics][]
    const withData = variants.filter(([_, metrics]) => metrics.assignments > 0)

    if (withData.length === 0) {
      return null
    }

    const sorted = withData.sort((a, b) => b[1].conversionRate - a[1].conversionRate)
    return sorted[0][0]
  }

  const totals = getTotals()
  const bestVariant = getBestVariant()

  // Variant display config
  const variantConfig: Record<
    HeadlineVariant,
    { name: string; description: string; color: string; icon: string }
  > = {
    team_size: {
      name: 'Variant A: Team Size',
      description: '10x Marketing Output, Same Team Size',
      color: 'from-cyan-400 to-blue-500',
      icon: '👥',
    },
    pain_point: {
      name: 'Variant B: Pain Point',
      description: 'Stop Paying €10K/Month for Agencies',
      color: 'from-purple-400 to-purple-600',
      icon: '💰',
    },
    situation: {
      name: 'Variant C: Situation',
      description: 'Team of 3, Output of 30',
      color: 'from-emerald-400 to-green-500',
      icon: '🚀',
    },
    future_focused: {
      name: 'Variant D: Future-Focused',
      description: "Build Tomorrow's Marketing Machine Today",
      color: 'from-indigo-400 to-purple-500',
      icon: '🔮',
    },
    innovation_focused: {
      name: 'Variant E: Innovation-Focused',
      description: 'Early-Stage Innovation for Forward-Thinking Teams',
      color: 'from-pink-400 to-rose-500',
      icon: '💡',
    },
    risk_reward: {
      name: 'Variant F: Risk/Reward Balance',
      description: 'Smart Investment, Measurable Results',
      color: 'from-amber-400 to-orange-500',
      icon: '⚖️',
    },
  }

  if (isLoading) {
    return (
      <GlassCard className={`p-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary" />
        </div>
      </GlassCard>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">A/B Test Dashboard</h2>
          <p className="text-white/80">Real-time analytics for headline variant testing</p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg hover:border border-white/10 text-white/80 hover:text-white transition-all text-sm"
        >
          Reset Analytics
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6">
          <div className="text-sm text-white/60 mb-1">Total Assignments</div>
          <div className="text-3xl font-bold text-white">{totals.assignments}</div>
          <div className="text-xs text-white/50 mt-1">Users who saw a variant</div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="text-sm text-white/60 mb-1">Total CTA Clicks</div>
          <div className="text-3xl font-bold text-accent-primary">{totals.ctaClicks}</div>
          <div className="text-xs text-white/50 mt-1">
            {totals.assignments > 0
              ? `${((totals.ctaClicks / totals.assignments) * 100).toFixed(1)}% click rate`
              : 'No data yet'}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="text-sm text-white/60 mb-1">Total Conversions</div>
          <div className="text-3xl font-bold text-success">{totals.formCompletions}</div>
          <div className="text-xs text-white/50 mt-1">
            {totals.assignments > 0
              ? `${((totals.formCompletions / totals.assignments) * 100).toFixed(1)}% conversion rate`
              : 'No data yet'}
          </div>
        </GlassCard>
      </div>

      {/* Winner Badge */}
      {bestVariant && totals.assignments >= 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <GlassCard className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🏆</span>
              <div className="text-left">
                <div className="text-sm text-amber-400 font-semibold">Current Leader</div>
                <div className="text-xl font-bold text-white">
                  {variantConfig[bestVariant].name}
                </div>
                <div className="text-sm text-white/80">
                  {summary![bestVariant].conversionRate.toFixed(1)}% conversion rate
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Variant Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(
          Object.entries(variantConfig) as [
            HeadlineVariant,
            (typeof variantConfig)[keyof typeof variantConfig],
          ][]
        ).map(([variant, config]) => {
          const metrics = summary![variant]
          const hasData = metrics.assignments > 0

          return (
            <motion.div
              key={variant}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard
                className={`p-6 ${bestVariant === variant ? 'ring-2 ring-amber-400' : ''}`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">{config.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{config.name}</h3>
                    <p className="text-xs text-white/60 line-clamp-1">{config.description}</p>
                  </div>
                  {bestVariant === variant && <div className="text-2xl">👑</div>}
                </div>

                {/* Metrics */}
                <div className="space-y-3">
                  {/* Assignments */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Assignments</span>
                    <span className="text-lg font-bold text-white">{metrics.assignments}</span>
                  </div>

                  {/* CTA Clicks */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/70">CTA Clicks</span>
                      <span className="text-lg font-bold text-accent-primary">
                        {metrics.ctaClicks}
                      </span>
                    </div>
                    {hasData && (
                      <div className="w-full rounded-full h-2">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${config.color}`}
                          style={{
                            width: `${(metrics.ctaClicks / metrics.assignments) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Form Completions */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white/70">Conversions</span>
                      <span className="text-lg font-bold text-success">
                        {metrics.formCompletions}
                      </span>
                    </div>
                    {hasData && (
                      <div className="w-full rounded-full h-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500"
                          style={{
                            width: `${(metrics.formCompletions / metrics.assignments) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Conversion Rate */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white/90">Conversion Rate</span>
                      <span
                        className={`text-2xl font-bold ${hasData ? 'text-success' : 'text-white/30'}`}
                      >
                        {hasData ? `${metrics.conversionRate.toFixed(1)}%` : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* No data message */}
                {!hasData && (
                  <div className="mt-4 p-3 rounded-lg text-center">
                    <p className="text-xs text-white/60">
                      No data yet. Share the demo to collect data!
                    </p>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Statistical Significance Note */}
      {totals.assignments > 0 && totals.assignments < 100 && (
        <GlassCard className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">Statistical Significance</h4>
              <p className="text-sm text-white/80">
                You need at least <strong>100 assignments per variant</strong> (~300 total) for
                statistically significant results. Current progress:{' '}
                <strong>{totals.assignments}/300</strong>
              </p>
              <div className="mt-2 w-full rounded-full h-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                  style={{ width: `${Math.min((totals.assignments / 300) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Instructions */}
      <GlassCard className="p-6">
        <h4 className="font-semibold text-white mb-3">🧪 How This Works</h4>
        <div className="space-y-2 text-sm text-white/80">
          <p>
            <strong>1. Automatic Assignment:</strong> Each visitor is randomly assigned to one of
            three headline variants (33.33% each).
          </p>
          <p>
            <strong>2. Persistent Tracking:</strong> The variant is stored in localStorage so users
            see the same headline across sessions.
          </p>
          <p>
            <strong>3. Event Tracking:</strong> We track CTA clicks and form completions for each
            variant to measure effectiveness.
          </p>
          <p>
            <strong>4. Winner Selection:</strong> After collecting sufficient data (~300+
            assignments), the variant with the highest conversion rate wins! 🏆
          </p>
        </div>
      </GlassCard>
    </div>
  )
}

export default ABTestDashboard
