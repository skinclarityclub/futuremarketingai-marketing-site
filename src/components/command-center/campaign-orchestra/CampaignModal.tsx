/**
 * Campaign Detail Modal Component
 *
 * Full-screen modal displaying comprehensive campaign information,
 * metrics, and management options.
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaDollarSign, FaUsers, FaBullseye, FaChartLine, FaArrowUp } from 'react-icons/fa'
import type { CampaignData } from './CampaignCard'

interface CampaignModalProps {
  campaign: CampaignData | null
  isOpen: boolean
  onClose: () => void
}

export const CampaignModal: React.FC<CampaignModalProps> = ({ campaign, isOpen, onClose }) => {
  if (!campaign) {
    return null
  }

  const platformIcons: Record<string, string> = {
    Instagram: '📷',
    Facebook: '👥',
    TikTok: '🎵',
    LinkedIn: '💼',
    Twitter: '🐦',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-bg-card rounded-3xl border-2 border-white/20 shadow-2xl pointer-events-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 p-8 bg-bg-card/95 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-3">{campaign.name}</h2>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-success/20 text-success border border-success/50">
                        {campaign.status.toUpperCase()}
                      </span>
                      {campaign.aiOptimizations.enabled && (
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-accent-primary/20 text-accent-primary border border-accent-primary/50">
                          AI OPTIMIZED
                        </span>
                      )}
                      <div className="flex gap-2">
                        {campaign.platforms.map((platform, index) => (
                          <span key={index} className="text-2xl" title={platform}>
                            {platformIcons[platform] || '📱'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-3 rounded-xl hover:bg-white/10 text-white transition-all duration-200"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Progress Section */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4">Campaign Progress</h3>
                  <div className="p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-semibold">Overall Completion</span>
                      <span className="text-2xl font-bold text-accent-primary">
                        {campaign.progress}%
                      </span>
                    </div>
                    <div className="h-4 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${campaign.progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </section>

                {/* Metrics Grid */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* ROI */}
                    <MetricCard
                      icon={<FaDollarSign />}
                      label="ROI"
                      value={`+${campaign.metrics.roi}%`}
                      color="success"
                      trend={<FaArrowUp />}
                    />

                    {/* Reach */}
                    <MetricCard
                      icon={<FaUsers />}
                      label="Total Reach"
                      value={
                        campaign.metrics.reach >= 1000
                          ? `${(campaign.metrics.reach / 1000).toFixed(1)}K`
                          : campaign.metrics.reach.toString()
                      }
                      color="primary"
                    />

                    {/* Engagement */}
                    <MetricCard
                      icon={<FaBullseye />}
                      label="Engagement Rate"
                      value={`${campaign.metrics.engagement}%`}
                      color="secondary"
                    />

                    {/* Conversions */}
                    <MetricCard
                      icon={<FaChartLine />}
                      label="Conversions"
                      value={campaign.metrics.conversions.toString()}
                      color="success"
                    />
                  </div>
                </section>

                {/* Content Output Section */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Content Output & Team Velocity
                  </h3>
                  <div className="p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-white/60 mb-1">Target Output</p>
                        <p className="text-3xl font-bold text-white">
                          {Math.floor(campaign.metrics.conversions / 5)} pieces
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/60 mb-1">Published</p>
                        <p className="text-3xl font-bold text-accent-primary">
                          {Math.floor(campaign.metrics.conversions / 10)} pieces
                        </p>
                      </div>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-success to-warning"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(Math.floor(campaign.metrics.conversions / 10) / Math.floor(campaign.metrics.conversions / 5)) * 100}%`,
                        }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-white/60">
                        {(
                          (Math.floor(campaign.metrics.conversions / 10) /
                            Math.floor(campaign.metrics.conversions / 5)) *
                          100
                        ).toFixed(1)}
                        % complete
                      </span>
                      <span className="text-white/60">
                        {Math.floor(campaign.metrics.conversions / 5) -
                          Math.floor(campaign.metrics.conversions / 10)}{' '}
                        remaining
                      </span>
                    </div>
                  </div>
                </section>

                {/* Schedule Section */}
                <section>
                  <h3 className="text-xl font-bold text-white mb-4">Campaign Schedule</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl border border-white/10">
                      <p className="text-sm text-white/60 mb-2">Start Date</p>
                      <p className="text-xl font-bold text-white">{campaign.schedule.start}</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-white/10">
                      <p className="text-sm text-white/60 mb-2">End Date</p>
                      <p className="text-xl font-bold text-white">{campaign.schedule.end}</p>
                    </div>
                  </div>
                </section>

                {/* AI Optimizations */}
                {campaign.aiOptimizations.enabled && (
                  <section>
                    <h3 className="text-xl font-bold text-white mb-4">AI Optimizations</h3>
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/30">
                      <div className="space-y-3">
                        {campaign.aiOptimizations.improvements.map((improvement, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="mt-1 w-2 h-2 rounded-full bg-accent-primary" />
                            <p className="text-white/90">{improvement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* Actions */}
                <section>
                  <div className="flex gap-4">
                    <button className="flex-1 py-4 rounded-xl bg-accent-primary hover:bg-accent-primary/80 text-white font-bold text-lg transition-all duration-200">
                      Edit Campaign
                    </button>
                    <button className="flex-1 py-4 rounded-xl hover:bg-white/10 text-white font-bold text-lg transition-all duration-200 border-2 border-white/20">
                      View Full Analytics
                    </button>
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  color: 'primary' | 'secondary' | 'success'
  trend?: React.ReactNode
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, color, trend }) => {
  const colorClasses = {
    primary: 'text-accent-primary',
    secondary: 'text-accent-secondary',
    success: 'text-success',
  }

  return (
    <div className="p-6 rounded-2xl border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <div className={`text-xl ${colorClasses[color]}`}>{icon}</div>
        <p className="text-sm text-white/60">{label}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
        {trend && <div className={`text-lg ${colorClasses[color]}`}>{trend}</div>}
      </div>
    </div>
  )
}

export default CampaignModal
