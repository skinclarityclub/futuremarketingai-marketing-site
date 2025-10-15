/**
 * Funnel Visualization Component
 *
 * Animated funnel chart showing conversion stages with
 * drop-off rates and clickable segments.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface FunnelStage {
  name: string
  value: number
  color: string
  dropoff?: number
}

interface FunnelVisualizationProps {
  stages: FunnelStage[]
  animated?: boolean
  clickable?: boolean
  onStageClick?: (stage: FunnelStage) => void
}

export const FunnelVisualization: React.FC<FunnelVisualizationProps> = ({
  stages,
  animated = true,
  clickable = true,
  onStageClick,
}) => {
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  const maxValue = stages[0]?.value || 1
  const totalDropoff = stages.reduce((sum, stage) => sum + (stage.dropoff || 0), 0)

  const handleStageClick = (stage: FunnelStage) => {
    if (!clickable) {
      return
    }
    setSelectedStage(selectedStage === stage.name ? null : stage.name)
    onStageClick?.(stage)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Conversion Funnel</h3>
        <p className="text-sm text-white/60">
          Total drop-off:{' '}
          <span className="text-warning font-semibold">{totalDropoff.toFixed(1)}%</span>
        </p>
      </div>

      {/* Funnel Container */}
      <motion.div
        className="p-8 rounded-2xl backdrop-blur-xl border border-white/10"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const widthPercentage = (stage.value / maxValue) * 100
            const isSelected = selectedStage === stage.name
            const prevStageValue = index > 0 ? stages[index - 1].value : stage.value
            const conversionRate = ((stage.value / prevStageValue) * 100).toFixed(1)

            return (
              <div key={stage.name} className="space-y-2">
                {/* Stage Bar */}
                <motion.div
                  className={`
                    relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer
                    ${isSelected ? 'ring-2 ring-offset-2 ring-offset-bg-card' : ''}
                    ${clickable ? 'hover:scale-[1.02]' : ''}
                  `}
                  style={{
                    width: `${Math.max(widthPercentage, 50)}%`,
                    maxWidth: '100%',
                    marginLeft: `${(100 - Math.max(widthPercentage, 50)) / 2}%`,
                    backgroundColor: `${stage.color}20`,
                    borderColor: stage.color,
                    borderWidth: '2px',
                    borderStyle: 'solid',
                  }}
                  initial={animated ? { opacity: 0, y: 20 } : {}}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  onClick={() => handleStageClick(stage)}
                  whileHover={clickable ? { y: -4 } : {}}
                >
                  {/* Animated Fill */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right, ${stage.color}30, ${stage.color}10)`,
                    }}
                    initial={animated ? { opacity: 0 } : {}}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
                  />

                  {/* Content */}
                  <div className="relative px-6 py-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white">{stage.name}</h4>
                      {index > 0 && (
                        <p className="text-sm text-white/70">
                          Conversion: <span className="font-semibold">{conversionRate}%</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: stage.color }}>
                        {stage.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-white/60">
                        {((stage.value / maxValue) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Drop-off Indicator (between stages) */}
                {stage.dropoff !== undefined && stage.dropoff > 0 && (
                  <motion.div
                    className="flex items-center justify-center gap-2"
                    initial={animated ? { opacity: 0, y: -10 } : {}}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                  >
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-warning/50 to-transparent" />
                    <div className="px-3 py-1 rounded-full bg-warning/20 border border-warning/50">
                      <span className="text-xs font-bold text-warning">
                        ↓ {stage.dropoff}% drop-off
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-warning/50 via-transparent to-transparent" />
                  </motion.div>
                )}

                {/* Expanded Details (when selected) */}
                {isSelected && (
                  <motion.div
                    className="mx-auto p-4 rounded-xl border border-white/10"
                    style={{
                      width: `${Math.max(widthPercentage, 50)}%`,
                      marginLeft: `${(100 - Math.max(widthPercentage, 50)) / 2}%`,
                    }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60 mb-1">Stage Value</p>
                        <p className="text-white font-bold">{stage.value.toLocaleString()}</p>
                      </div>
                      {index > 0 && (
                        <>
                          <div>
                            <p className="text-white/60 mb-1">Conversion Rate</p>
                            <p className="text-success font-bold">{conversionRate}%</p>
                          </div>
                          <div>
                            <p className="text-white/60 mb-1">Lost</p>
                            <p className="text-warning font-bold">
                              {(prevStageValue - stage.value).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-white/60 mb-1">Drop-off Rate</p>
                            <p className="text-warning font-bold">{stage.dropoff}%</p>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <motion.div
          className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4"
          initial={animated ? { opacity: 0, y: 20 } : {}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stages.length * 0.1 + 0.5 }}
        >
          <div className="text-center">
            <p className="text-xs text-white/60 mb-1">Total Entered</p>
            <p className="text-xl font-bold text-white">{maxValue.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/60 mb-1">Final Conversions</p>
            <p className="text-xl font-bold text-success">
              {stages[stages.length - 1]?.value.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-white/60 mb-1">Overall Rate</p>
            <p className="text-xl font-bold text-accent-primary">
              {((stages[stages.length - 1]?.value / maxValue) * 100).toFixed(1)}%
            </p>
          </div>
        </motion.div>

        {/* Click hint */}
        {clickable && !selectedStage && (
          <p className="mt-4 text-center text-xs text-white/40">
            💡 Click on any stage to see detailed metrics
          </p>
        )}
      </motion.div>
    </div>
  )
}

export default FunnelVisualization
