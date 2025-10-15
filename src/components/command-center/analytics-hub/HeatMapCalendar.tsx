/**
 * HeatMap Calendar Component
 *
 * Visualizes engagement by posting time with AI recommendations
 * for optimal posting times.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface HeatMapData {
  day: string
  hour: number
  engagement: number
}

interface AIRecommendation {
  day: string
  hour: number
  reason: string
}

interface HeatMapCalendarProps {
  data: HeatMapData[]
  aiRecommendations?: AIRecommendation[]
  interactive?: boolean
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const hours = Array.from({ length: 24 }, (_, i) => i)

export const HeatMapCalendar: React.FC<HeatMapCalendarProps> = ({
  data,
  aiRecommendations = [],
  interactive = true,
}) => {
  const [selectedCell, setSelectedCell] = useState<{ day: string; hour: number } | null>(null)
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number } | null>(null)

  // Get engagement value for a specific day/hour
  const getEngagement = (day: string, hour: number) => {
    const cell = data.find((d) => d.day === day && d.hour === hour)
    return cell?.engagement || 0
  }

  // Check if cell has AI recommendation
  const hasRecommendation = (day: string, hour: number) => {
    return aiRecommendations.some((r) => r.day === day && r.hour === hour)
  }

  // Get recommendation for cell
  const getRecommendation = (day: string, hour: number) => {
    return aiRecommendations.find((r) => r.day === day && r.hour === hour)
  }

  // Get color based on engagement
  const getColor = (engagement: number) => {
    if (engagement === 0) {
      return 'rgba(255, 255, 255, 0.05)'
    }
    if (engagement < 20) {
      return 'rgba(99, 102, 241, 0.2)'
    }
    if (engagement < 40) {
      return 'rgba(99, 102, 241, 0.4)'
    }
    if (engagement < 60) {
      return 'rgba(99, 102, 241, 0.6)'
    }
    if (engagement < 80) {
      return 'rgba(99, 102, 241, 0.8)'
    }
    return 'rgba(99, 102, 241, 1)'
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Optimal Posting Times</h3>
        <p className="text-sm text-white/60">
          Engagement heatmap with{' '}
          <span className="text-accent-primary font-semibold">{aiRecommendations.length}</span> AI
          recommendations
        </p>
      </div>

      {/* HeatMap */}
      <motion.div
        className="p-6 rounded-2xl backdrop-blur-xl border border-white/10 overflow-x-auto"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-block min-w-full">
          {/* Hours Header */}
          <div className="flex mb-2">
            <div className="w-12" /> {/* Space for day labels */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="w-8 text-center text-xs text-white/60 font-mono"
                title={`${hour}:00`}
              >
                {hour % 3 === 0 ? hour : ''}
              </div>
            ))}
          </div>

          {/* HeatMap Grid */}
          {days.map((day, dayIndex) => (
            <div key={day} className="flex mb-1">
              {/* Day Label */}
              <div className="w-12 flex items-center text-xs text-white/90 font-semibold">
                {day}
              </div>

              {/* Hour Cells */}
              {hours.map((hour, hourIndex) => {
                const engagement = getEngagement(day, hour)
                const hasRec = hasRecommendation(day, hour)
                const isSelected = selectedCell?.day === day && selectedCell?.hour === hour
                const isHovered = hoveredCell?.day === day && hoveredCell?.hour === hour

                return (
                  <motion.div
                    key={`${day}-${hour}`}
                    className={`
                      w-8 h-8 rounded cursor-pointer transition-all duration-200
                      ${hasRec ? 'ring-2 ring-accent-primary ring-offset-1 ring-offset-bg-card' : ''}
                      ${isSelected ? 'scale-125 z-10' : ''}
                      ${isHovered ? 'scale-110' : ''}
                    `}
                    style={{
                      backgroundColor: getColor(engagement),
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (dayIndex * hours.length + hourIndex) * 0.001 }}
                    onClick={() => {
                      if (!interactive) {
                        return
                      }
                      setSelectedCell(isSelected ? null : { day, hour })
                    }}
                    onMouseEnter={() => setHoveredCell({ day, hour })}
                    onMouseLeave={() => setHoveredCell(null)}
                    whileHover={{ scale: 1.2 }}
                    title={`${day} ${hour}:00 - ${engagement}% engagement${hasRec ? ' (AI Recommended)' : ''}`}
                  >
                    {/* AI Star Indicator */}
                    {hasRec && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs">⭐</span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">Low</span>
            {[0, 20, 40, 60, 80, 100].map((value) => (
              <div
                key={value}
                className="w-8 h-6 rounded"
                style={{ backgroundColor: getColor(value) }}
              />
            ))}
            <span className="text-xs text-white/60">High</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded ring-2 ring-accent-primary" />
            <span className="text-white/60">AI Recommended</span>
          </div>
        </div>

        {/* Selected Cell Details */}
        {selectedCell && (
          <motion.div
            className="mt-6 p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-white mb-2">
                  {selectedCell.day} at {selectedCell.hour}:00
                </h4>
                <p className="text-sm text-white/80 mb-2">
                  Engagement:{' '}
                  <span className="font-bold text-accent-primary">
                    {getEngagement(selectedCell.day, selectedCell.hour)}%
                  </span>
                </p>
                {getRecommendation(selectedCell.day, selectedCell.hour) && (
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-accent-primary">💡</span>
                    <p className="text-white/90">
                      {getRecommendation(selectedCell.day, selectedCell.hour)?.reason}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedCell(null)}
                className="px-3 py-1 rounded-lg hover:bg-white/10 text-white text-xs transition-all duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {/* AI Recommendations List */}
        {aiRecommendations.length > 0 && !selectedCell && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-bold text-white mb-3">Top AI Recommendations</h4>
            {aiRecommendations.slice(0, 3).map((rec, index) => (
              <motion.div
                key={`${rec.day}-${rec.hour}`}
                className="p-3 rounded-lg border border-white/10 hover:transition-all duration-200 cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCell({ day: rec.day, hour: rec.hour })}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">⭐</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {rec.day} at {rec.hour}:00
                    </p>
                    <p className="text-xs text-white/60">{rec.reason}</p>
                  </div>
                  <span className="text-xs text-accent-primary font-bold">
                    {getEngagement(rec.day, rec.hour)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default HeatMapCalendar
