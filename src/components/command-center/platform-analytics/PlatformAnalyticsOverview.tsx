/**
 * Platform Analytics Overview Component
 *
 * Displays an overview grid of all connected social media platforms
 * with key metrics and account information.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { PlatformCard } from './PlatformCard'
import type { Platform } from '../../../types/dashboard'

interface PlatformAnalyticsOverviewProps {
  platforms: Platform[]
}

export const PlatformAnalyticsOverview: React.FC<PlatformAnalyticsOverviewProps> = ({
  platforms,
}) => {
  // Calculate aggregate stats
  const totalAccounts = platforms.reduce((sum, p) => sum + p.accountCount, 0)
  const totalReach = platforms.reduce((sum, p) => sum + p.totalReach, 0)
  const avgROI = Math.floor(platforms.reduce((sum, p) => sum + p.roi, 0) / platforms.length)
  const connectedPlatforms = platforms.filter((p) => p.status === 'connected').length

  return (
    <div className="space-y-6">
      {/* Header with Summary Stats */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="p-4 rounded-xl backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/60 mb-1">Connected Platforms</p>
          <p className="text-2xl font-bold text-accent-primary">
            {connectedPlatforms}/{platforms.length}
          </p>
        </div>
        <div
          className="p-4 rounded-xl backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/60 mb-1">Total Accounts</p>
          <p className="text-2xl font-bold text-accent-secondary">{totalAccounts}</p>
        </div>
        <div
          className="p-4 rounded-xl backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/60 mb-1">Combined Reach</p>
          <p className="text-2xl font-bold text-success">{(totalReach / 1000000).toFixed(1)}M</p>
        </div>
        <div
          className="p-4 rounded-xl backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/60 mb-1">Average ROI</p>
          <p className="text-2xl font-bold text-white">+{avgROI}%</p>
        </div>
      </motion.div>

      {/* Platform Cards Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white/90 mb-4">Platform Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <PlatformCard key={platform.id} platform={platform} index={index} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="p-6 rounded-xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">
              All platforms synced successfully
            </h4>
            <p className="text-sm text-white/70">
              Last sync completed {platforms[0]?.lastSync || 'recently'}
            </p>
          </div>
          <button className="px-6 py-3 rounded-xl hover:bg-white/10 text-white font-semibold transition-all duration-300 border border-white/20">
            Sync Now
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default PlatformAnalyticsOverview
