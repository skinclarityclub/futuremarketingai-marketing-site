import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaArrowUp as TrendingUp,
  FaArrowDown as TrendingDown,
  FaCheckCircle as CheckCircle2,
  FaLightbulb as Lightbulb,
  FaBolt as Zap,
  FaTimes as X,
} from 'react-icons/fa'
import type { Strategy } from './mockStrategyData'

interface StrategyDetailViewProps {
  strategy: Strategy | null
  onClose: () => void
}

export const StrategyDetailView: React.FC<StrategyDetailViewProps> = ({ strategy, onClose }) => {
  if (!strategy) {
    return null
  }

  const KPICard = ({
    label,
    value,
    trend,
    prefix = '',
    suffix = '',
    good = true,
  }: {
    label: string
    value: number
    trend: number
    prefix?: string
    suffix?: string
    good?: boolean
  }) => {
    const trendPositive = good ? trend > 0 : trend < 0
    const trendColor = trendPositive ? 'text-emerald-400' : 'text-red-400'
    const TrendIcon = trendPositive ? TrendingUp : TrendingDown

    return (
      <motion.div
        className="backdrop-blur-md rounded-xl p-4 border border-white/10"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <p className="text-white/60 text-sm mb-2">{label}</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-white">
              {prefix}
              {value.toLocaleString()}
              {suffix}
            </p>
            <div className={`flex items-center gap-1 mt-1 ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              <span className="text-xs font-medium">{Math.abs(trend)}% vs last month</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const ImpactBadge = ({ impact }: { impact: 'high' | 'medium' | 'low' }) => {
    const colors = {
      high: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      low: 'text-white/70 border-white/20',
    }

    return (
      <span
        className={`px-2 py-1 rounded-md text-xs font-medium border ${colors[impact]}`}
        style={impact === 'low' ? { background: 'rgba(0, 0, 0, 0.3)' } : undefined}
      >
        {impact} impact
      </span>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-6xl max-h-[90vh] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="relative p-6 border-b border-white/10"
            style={{
              background: `linear-gradient(135deg, ${strategy.color}20 0%, transparent 100%)`,
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: strategy.color }} />
              <h2 className="text-2xl font-bold text-white">{strategy.name}</h2>
            </div>
            <p className="text-white/60">{strategy.description}</p>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
            {/* KPIs */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent-primary" />
                Key Performance Indicators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  label="Total Conversions"
                  value={strategy.totalConversions}
                  trend={strategy.trend.conversions}
                />
                <KPICard
                  label="Avg Conversion Rate"
                  value={strategy.avgConversionRate}
                  suffix="%"
                  trend={strategy.trend.conversions}
                />
                <KPICard
                  label="Avg Cost Per Lead"
                  value={strategy.avgCPL}
                  prefix="€"
                  trend={-8}
                  good={false}
                />
                <KPICard
                  label="Avg ROI"
                  value={strategy.avgROI}
                  suffix="%"
                  trend={strategy.trend.roi}
                />
              </div>
            </div>

            {/* Best Practices */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Best Practices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategy.bestPractices.map((practice, index) => (
                  <motion.div
                    key={practice.id}
                    className="backdrop-blur-md rounded-xl p-4 border border-white/10"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium pr-2">{practice.title}</h4>
                      <ImpactBadge impact={practice.impact} />
                    </div>
                    <p className="text-white/60 text-sm">{practice.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                AI Strategy Recommendations
              </h3>
              <div className="space-y-4">
                {strategy.recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    className="bg-gradient-to-r from-accent-primary/10 to-transparent backdrop-blur-md rounded-xl p-5 border border-accent-primary/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg mb-1">{rec.title}</h4>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-1.5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-accent-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${rec.confidence}%` }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                              />
                            </div>
                            <span className="text-xs text-white/60">
                              {rec.confidence}% confidence
                            </span>
                          </div>
                          <ImpactBadge impact={rec.impact} />
                        </div>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">{rec.reasoning}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Strategy Stats Summary */}
            <div
              className="backdrop-blur-md rounded-xl p-6 border border-white/10"
              style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">Strategy Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Accounts Using</p>
                  <p className="text-2xl font-bold text-white">{strategy.accountCount}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Avg Reach</p>
                  <p className="text-2xl font-bold text-white">
                    {(strategy.avgReach / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Avg Engagement</p>
                  <p className="text-2xl font-bold text-white">{strategy.avgEngagementRate}%</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Top Performer</p>
                  <p className="text-sm font-medium text-white/80 truncate">
                    {strategy.topPerformer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
