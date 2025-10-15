/**
 * Campaign Card Component
 *
 * Interactive card displaying campaign information with status,
 * progress, metrics, platforms, and quick actions.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaPause,
  FaPlay,
  FaChartLine,
  FaArrowUp,
  FaDollarSign,
  FaUsers,
  FaBullseye,
} from 'react-icons/fa'

export interface CampaignMetrics {
  roi: number
  reach: number
  engagement: number
  conversions: number
  budget: number
  spent: number
}

export interface CampaignData {
  id: string
  name: string
  status: 'active' | 'paused' | 'draft' | 'completed'
  progress: number
  metrics: CampaignMetrics
  platforms: string[]
  schedule: {
    start: string
    end: string
  }
  aiOptimizations: {
    enabled: boolean
    improvements: string[]
  }
}

interface CampaignCardProps {
  campaign: CampaignData
  isSelected?: boolean
  onSelect?: (id: string) => void
  onClick?: (id: string) => void
  onQuickAction?: (id: string, action: string) => void
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  isSelected = false,
  onSelect,
  onClick,
  onQuickAction,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const statusColors = {
    active: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/50' },
    paused: { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/50' },
    draft: { bg: '', text: 'text-white/70', border: 'border-white/30' },
    completed: {
      bg: 'bg-accent-primary/20',
      text: 'text-accent-primary',
      border: 'border-accent-primary/50',
    },
  }

  const platformIcons: Record<string, string> = {
    Instagram: '📷',
    Facebook: '👥',
    TikTok: '🎵',
    LinkedIn: '💼',
    Twitter: '🐦',
  }

  const colors = statusColors[campaign.status]

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on buttons or checkbox
    if ((e.target as HTMLElement).closest('button, input[type="checkbox"]')) {
      return
    }
    onClick?.(campaign.id)
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.(campaign.id)
  }

  return (
    <motion.div
      className={`
        relative p-6 rounded-2xl backdrop-blur" style={{ background: 'rgba(0, 0, 0, 0.3)' }}-xl
        border-2 transition-all duration-300 cursor-pointer
        hover:hover:scale-[1.02]
        ${isSelected ? 'border-accent-primary shadow-lg shadow-accent-primary/20' : 'border-white/10'}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-4 left-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            onClick={handleCheckboxClick}
            className="w-5 h-5 rounded border-2 border-white/30 checked:bg-accent-primary checked:border-accent-primary cursor-pointer"
          />
        </div>
      )}

      {/* AI Optimization Badge */}
      {campaign.aiOptimizations.enabled && (
        <motion.div
          className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent-primary/20 border border-accent-primary/50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs font-bold text-accent-primary">AI Optimized</span>
        </motion.div>
      )}

      {/* Campaign Header */}
      <div className={`mb-4 ${onSelect ? 'pl-8' : ''}`}>
        <h3 className="text-lg font-bold text-white mb-2">{campaign.name}</h3>

        {/* Status & Platforms */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {campaign.status.toUpperCase()}
          </span>

          {/* Platform Icons */}
          <div className="flex gap-1">
            {campaign.platforms.slice(0, 3).map((platform, index) => (
              <span key={index} className="text-lg" title={platform}>
                {platformIcons[platform] || '📱'}
              </span>
            ))}
            {campaign.platforms.length > 3 && (
              <span className="text-xs text-white/50 ml-1">+{campaign.platforms.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/70">Campaign Progress</span>
          <span className="text-sm font-bold text-white">{campaign.progress}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${campaign.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* ROI */}
        <div className="p-3 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <FaDollarSign className="text-success text-sm" />
            <span className="text-xs text-white/60">ROI</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-success">+{campaign.metrics.roi}%</span>
            <FaArrowUp className="text-success text-xs" />
          </div>
        </div>

        {/* Reach */}
        <div className="p-3 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <FaUsers className="text-accent-primary text-sm" />
            <span className="text-xs text-white/60">Reach</span>
          </div>
          <span className="text-lg font-bold text-white">
            {campaign.metrics.reach >= 1000
              ? `${(campaign.metrics.reach / 1000).toFixed(1)}K`
              : campaign.metrics.reach}
          </span>
        </div>

        {/* Engagement */}
        <div className="p-3 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <FaBullseye className="text-accent-secondary text-sm" />
            <span className="text-xs text-white/60">Engagement</span>
          </div>
          <span className="text-lg font-bold text-white">{campaign.metrics.engagement}%</span>
        </div>

        {/* Content Output */}
        <div className="p-3 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <FaChartLine className="text-warning text-sm" />
            <span className="text-xs text-white/60">Content</span>
          </div>
          <div className="text-sm">
            <span className="font-bold text-white">
              {Math.floor(campaign.metrics.conversions / 10)}
            </span>
            <span className="text-white/50"> pieces</span>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="mb-4 p-3 rounded-xl border border-white/10">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-white/50">Start:</span>
            <span className="text-white ml-2">{campaign.schedule.start}</span>
          </div>
          <div>
            <span className="text-white/50">End:</span>
            <span className="text-white ml-2">{campaign.schedule.end}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions (visible on hover) */}
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
      >
        {campaign.status === 'active' ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onQuickAction?.(campaign.id, 'pause')
            }}
            className="flex-1 py-2 px-4 rounded-xl bg-warning/20 hover:bg-warning/30 text-warning border border-warning/50 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaPause className="text-xs" />
            Pause
          </button>
        ) : campaign.status === 'paused' ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onQuickAction?.(campaign.id, 'resume')
            }}
            className="flex-1 py-2 px-4 rounded-xl bg-success/20 hover:bg-success/30 text-success border border-success/50 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaPlay className="text-xs" />
            Resume
          </button>
        ) : null}

        <button
          onClick={(e) => {
            e.stopPropagation()
            onQuickAction?.(campaign.id, 'analytics')
          }}
          className="flex-1 py-2 px-4 rounded-xl bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary border border-accent-primary/50 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
        >
          <FaChartLine className="text-xs" />
          Analytics
        </button>
      </motion.div>

      {/* Click hint */}
      {!isHovered && (
        <div className="mt-3 text-center">
          <span className="text-xs text-white/40">Click for details</span>
        </div>
      )}
    </motion.div>
  )
}

export default CampaignCard
