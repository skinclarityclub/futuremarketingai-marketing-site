import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaLightbulb, FaChartLine, FaClock, FaStar } from 'react-icons/fa'
import type { OptimalTimeSlot, PlatformType } from '../../../types/scheduler'
import { PlatformIcon } from './PlatformIcon'
import { GlassCard } from '../../common'

interface OptimalTimingPanelProps {
  optimalSlots: OptimalTimeSlot[]
  onSelectSlot?: (slot: OptimalTimeSlot) => void
}

export const OptimalTimingPanel: React.FC<OptimalTimingPanelProps> = ({
  optimalSlots,
  onSelectSlot,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'all'>('all')

  const filteredSlots =
    selectedPlatform === 'all'
      ? optimalSlots.slice(0, 10)
      : optimalSlots.filter((slot) => slot.platform === selectedPlatform).slice(0, 8)

  const platforms: PlatformType[] = [
    'instagram',
    'facebook',
    'linkedin',
    'twitter',
    'tiktok',
    'youtube',
  ]

  const getScoreColor = (score: number) => {
    if (score >= 90) {
      return 'text-emerald-400'
    }
    if (score >= 75) {
      return 'text-green-400'
    }
    if (score >= 60) {
      return 'text-yellow-400'
    }
    return 'text-orange-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) {
      return 'bg-emerald-500/20'
    }
    if (score >= 75) {
      return 'bg-green-500/20'
    }
    if (score >= 60) {
      return 'bg-yellow-500/20'
    }
    return 'bg-orange-500/20'
  }

  return (
    <GlassCard className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
            <FaLightbulb className="text-yellow-400" />
            AI Optimal Timing
          </h3>
          <p className="text-white/60">
            Best times to post based on audience activity and historical performance
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-medium"
        >
          Auto-Schedule
        </motion.button>
      </div>

      {/* Platform Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedPlatform('all')}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedPlatform === 'all'
              ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
              : 'text-white/70 hover:'
          }`}
        >
          All Platforms
        </motion.button>
        {platforms.map((platform) => (
          <motion.button
            key={platform}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPlatform(platform)}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              selectedPlatform === platform
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                : 'text-white/70 hover:'
            }`}
          >
            <PlatformIcon platform={platform} size={16} />
            <span className="capitalize">{platform}</span>
          </motion.button>
        ))}
      </div>

      {/* Optimal Time Slots */}
      <div className="space-y-3">
        {filteredSlots.map((slot, index) => (
          <motion.div
            key={`${slot.platform}-${slot.dayOfWeek}-${slot.timeRange}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, x: 4 }}
            onClick={() => onSelectSlot?.(slot)}
            className="p-4 hover:rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Platform Icon */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <PlatformIcon platform={slot.platform} size={24} />
                </div>

                {/* Time Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold capitalize">{slot.platform}</h4>
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center gap-1">
                        <FaStar className="w-2.5 h-2.5" />
                        Top Pick
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      <span>
                        {slot.dayOfWeek}, {slot.timeRange}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaChartLine className="w-3 h-3" />
                      <span>Audience: {slot.audienceActivity}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="flex flex-col items-end gap-2">
                <div className={`px-3 py-1 rounded-lg ${getScoreBg(slot.recommendationScore)}`}>
                  <span className={`text-lg font-bold ${getScoreColor(slot.recommendationScore)}`}>
                    {slot.recommendationScore}
                  </span>
                </div>
                <span className="text-xs text-white/40">AI Score</span>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-white/50">
                <span>Historical Performance</span>
                <span>{slot.historicalPerformance}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${slot.historicalPerformance}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.6 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-3 rounded-lg border border-white/10">
          <div className="text-2xl font-bold text-indigo-400">{filteredSlots.length}</div>
          <div className="text-sm text-white/60">Optimal Slots</div>
        </div>
        <div className="p-3 rounded-lg border border-white/10">
          <div className="text-2xl font-bold text-emerald-400">
            {Math.round(
              filteredSlots.reduce((sum, slot) => sum + slot.recommendationScore, 0) /
                filteredSlots.length
            )}
          </div>
          <div className="text-sm text-white/60">Avg AI Score</div>
        </div>
        <div className="p-3 rounded-lg border border-white/10">
          <div className="text-2xl font-bold text-violet-400">
            {Math.round(
              filteredSlots.reduce((sum, slot) => sum + slot.audienceActivity, 0) /
                filteredSlots.length
            )}
            %
          </div>
          <div className="text-sm text-white/60">Avg Activity</div>
        </div>
      </div>
    </GlassCard>
  )
}
