/**
 * Pipeline Stage Component
 *
 * Represents a single stage in the content production pipeline.
 */

import React from 'react'
import { motion } from 'framer-motion'

export interface PipelineStageData {
  id: string
  name: string
  icon: string
  count: number
  status: 'idle' | 'active' | 'processing' | 'complete'
  items: {
    id: string
    title: string
    platform: string
    timeInStage: string
  }[]
  color: string
  description: string
}

interface PipelineStageProps {
  stage: PipelineStageData
  index: number
  isLast?: boolean
  onClick?: () => void
}

export const PipelineStage: React.FC<PipelineStageProps> = ({ stage, index, isLast, onClick }) => {
  const getStatusColor = () => {
    switch (stage.status) {
      case 'processing':
        return stage.color
      case 'active':
        return '#00D4FF'
      case 'complete':
        return '#00FF88'
      default:
        return '#FFFFFF50'
    }
  }

  const getStatusText = () => {
    switch (stage.status) {
      case 'processing':
        return 'Processing'
      case 'active':
        return 'Active'
      case 'complete':
        return 'Complete'
      default:
        return 'Idle'
    }
  }

  return (
    <div className="relative flex items-center">
      {/* Stage Card */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <div
          className="relative w-64 p-6 rounded-2xl backdrop-blur-xl border border-white/10 hover:hover:border-white/20 transition-all duration-300 cursor-pointer group"
          onClick={onClick}
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            boxShadow: `0 4px 20px ${stage.color}15`,
            borderColor: stage.status === 'processing' ? stage.color : undefined,
          }}
        >
          {/* Status Pulse */}
          {stage.status === 'processing' && (
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
              style={{ backgroundColor: stage.color }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{stage.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-white">{stage.name}</h3>
                <p className="text-xs" style={{ color: getStatusColor() }}>
                  {getStatusText()}
                </p>
              </div>
            </div>

            {/* Count Badge */}
            {stage.count > 0 && (
              <motion.div
                className="px-3 py-1 rounded-full text-sm font-bold"
                style={{
                  backgroundColor: `${stage.color}30`,
                  color: stage.color,
                }}
                animate={{
                  scale: stage.status === 'processing' ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: stage.status === 'processing' ? Infinity : 0,
                }}
              >
                {stage.count}
              </motion.div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-white/60 mb-3">{stage.description}</p>

          {/* Progress Bar (if processing) */}
          {stage.status === 'processing' && (
            <div className="w-full h-1 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: stage.color }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>
          )}

          {/* Click Hint */}
          {stage.count > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10 text-center">
              <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">
                Click for details →
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Connector Arrow */}
      {!isLast && (
        <motion.div
          className="relative w-16 h-1 mx-2"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          {/* Arrow line */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent" />

          {/* Animated dot moving along the arrow */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-primary"
            animate={{
              x: [0, 64, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Arrow head */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0"
            style={{
              borderLeft: '6px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid transparent',
              borderBottom: '4px solid transparent',
            }}
          />
        </motion.div>
      )}
    </div>
  )
}

export default PipelineStage
