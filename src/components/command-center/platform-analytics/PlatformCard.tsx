/**
 * Platform Card Component
 *
 * Displays a summary card for a social media platform with key metrics and status.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Platform } from '../../../types/dashboard'

interface PlatformCardProps {
  platform: Platform
  index: number
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, index }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Status color mapping
  const getStatusColor = () => {
    switch (platform.status) {
      case 'connected':
        return 'text-success'
      case 'syncing':
        return 'text-accent-primary'
      case 'warning':
        return 'text-warning'
      case 'error':
        return 'text-danger'
      default:
        return 'text-white/50'
    }
  }

  const getStatusDot = () => {
    switch (platform.status) {
      case 'connected':
        return 'bg-success'
      case 'syncing':
        return 'bg-accent-primary'
      case 'warning':
        return 'bg-warning'
      case 'error':
        return 'bg-danger'
      default:
        return '' // Use inline style instead
    }
  }

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ zIndex: isExpanded ? 50 : 'auto' }}
    >
      <div
        className="p-6 rounded-2xl backdrop-blur-xl border border-white/10 hover:hover:border-white/20 transition-all duration-300 cursor-pointer shadow-xl"
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          boxShadow: `0 4px 20px ${platform.color}15`,
        }}
      >
        {/* Header with Platform Name and Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl flex items-center" style={{ color: platform.color }}>
              {platform.icon}
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">{platform.name}</h3>
              <p className="text-xs text-white/50">{platform.accountCount} accounts</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className={`w-2.5 h-2.5 rounded-full ${getStatusDot()}`} />
              {platform.status === 'syncing' && (
                <motion.div
                  className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-accent-primary"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </div>
            <span className={`text-xs font-medium ${getStatusColor()}`}>{platform.status}</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-xl">
            <p className="text-xs text-white/60 mb-1">Total Reach</p>
            <p className="text-xl font-bold" style={{ color: platform.color }}>
              {(platform.totalReach / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="p-3 rounded-xl">
            <p className="text-xs text-white/60 mb-1">Engagement</p>
            <p className="text-xl font-bold" style={{ color: platform.color }}>
              {(platform.totalEngagement / 1000).toFixed(1)}K
            </p>
          </div>
        </div>

        {/* ROI Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">ROI</span>
            <span
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{
                backgroundColor: `${platform.color}20`,
                color: platform.color,
              }}
            >
              +{platform.roi}%
            </span>
          </div>
          <span className="text-xs text-white/50">{platform.lastSync}</span>
        </div>

        {/* Expand Indicator */}
        <motion.div
          className="mt-4 pt-4 border-t border-white/10 text-center"
          animate={{ opacity: isExpanded ? 0 : 1 }}
        >
          <span className="text-xs text-white/50">Click for details</span>
        </motion.div>

        {/* Expanded Account List */}
        {isExpanded && (
          <motion.div
            className="mt-4 pt-4 border-t border-white/10 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="text-sm font-semibold text-white/90 mb-3">Accounts:</h4>
            {platform.accounts.slice(0, 3).map((account) => (
              <div key={account.id} className="p-2 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${account.avatar})`,
                      backgroundColor: platform.color + '40',
                    }}
                  />
                  <div>
                    <p className="text-xs font-medium text-white">{account.handle}</p>
                    <p className="text-xs text-white/50">{account.strategy}</p>
                  </div>
                </div>
                <span className="text-xs text-white/70">
                  {(account.followers / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
            {platform.accounts.length > 3 && (
              <p className="text-xs text-white/50 text-center pt-2">
                +{platform.accounts.length - 3} more accounts
              </p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default PlatformCard
