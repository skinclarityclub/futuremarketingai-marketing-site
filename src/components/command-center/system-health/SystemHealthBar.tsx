/**
 * System Health Bar Component
 *
 * Displays real-time system status indicators across the top of the Command Center.
 * Shows API status, AI models, publishing queue, and processing activity.
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { SystemHealth } from '../../../types/dashboard'

interface SystemHealthBarProps {
  systemHealth: SystemHealth
}

interface StatusIndicatorProps {
  label: string
  status: 'operational' | 'degraded' | 'down' | 'active' | 'idle'
  pulse?: boolean
  tooltip?: string
  details?: string[]
  count?: string
  icon?: string
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  label,
  status,
  pulse = false,
  tooltip,
  details,
  count,
  icon,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Status color mapping
  const getStatusColor = () => {
    switch (status) {
      case 'operational':
      case 'active':
        return 'text-success'
      case 'degraded':
      case 'idle':
        return 'text-warning'
      case 'down':
        return 'text-danger'
      default:
        return 'text-white/50'
    }
  }

  const getDotColor = () => {
    switch (status) {
      case 'operational':
      case 'active':
        return 'bg-success'
      case 'degraded':
      case 'idle':
        return 'bg-warning'
      case 'down':
        return 'bg-danger'
      default:
        return '' // Use inline style instead
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:transition-all duration-300 cursor-pointer">
        {/* Status Dot with Pulse Animation */}
        <div className="relative">
          <div className={`w-2.5 h-2.5 rounded-full ${getDotColor()}`} />
          {pulse && status === 'operational' && (
            <motion.div
              className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-success"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>

        {/* Icon (optional) */}
        {icon && <span className="text-lg">{icon}</span>}

        {/* Label */}
        <span className={`text-sm font-medium ${getStatusColor()}`}>{label}</span>

        {/* Count Badge (optional) */}
        {count && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-accent-primary/20 text-accent-primary text-xs font-semibold">
            {count}
          </span>
        )}
      </div>

      {/* Tooltip on Hover */}
      <AnimatePresence>
        {isHovered && (tooltip || details) && (
          <motion.div
            className="absolute left-0 top-full mt-2 min-w-[200px]"
            style={{ zIndex: 100 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl"
              style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            >
              {tooltip && <p className="text-sm text-white/90 font-medium mb-2">{tooltip}</p>}
              {details && details.length > 0 && (
                <ul className="space-y-1">
                  {details.map((detail, index) => (
                    <li key={index} className="text-xs text-white/70 flex items-start gap-2">
                      <span className="text-accent-primary mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
              {/* Arrow pointing up */}
              <div
                className="absolute left-4 top-0 -translate-y-1/2 rotate-45 w-2 h-2 border-l border-t border-white/10"
                style={{ background: 'rgba(0, 0, 0, 0.5)' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const SystemHealthBar: React.FC<SystemHealthBarProps> = ({ systemHealth }) => {
  const { t } = useTranslation('dashboard')

  return (
    <motion.div
      className="mb-8 p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl relative z-50"
      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
          {t('system_health.title')}
        </h3>
        <span className="text-xs text-white/50">
          {t('system_health.last_updated')}{' '}
          {new Date(systemHealth.api.lastCheck).toLocaleTimeString()}
        </span>
      </div>

      {/* Status Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* API Status */}
        <StatusIndicator
          label="API"
          status={systemHealth.api.status}
          pulse={systemHealth.api.status === 'operational'}
          icon="🔗"
          tooltip="All API endpoints responding normally"
          details={[
            `Response time: ${systemHealth.api.responseTime}ms`,
            'Last check: Just now',
            'All endpoints operational',
          ]}
        />

        {/* AI Models Status */}
        <StatusIndicator
          label="AI Models"
          status="active"
          pulse={true}
          icon="🧠"
          count={`${systemHealth.aiModels.active}/${systemHealth.aiModels.total}`}
          tooltip={`${systemHealth.aiModels.active} AI models active`}
          details={systemHealth.aiModels.models.map(
            (model) => `${model.name}: ${model.status === 'active' ? '✓' : '○'} ${model.purpose}`
          )}
        />

        {/* Publishing Queue */}
        <StatusIndicator
          label="Publishing"
          status="active"
          icon="📤"
          count={systemHealth.publishingQueue.pending.toString()}
          tooltip={`${systemHealth.publishingQueue.pending} posts pending`}
          details={[
            `Pending: ${systemHealth.publishingQueue.pending}`,
            `Scheduled: ${systemHealth.publishingQueue.scheduled}`,
            `Completed: ${systemHealth.publishingQueue.completed}`,
          ]}
        />

        {/* Processing Activity */}
        <StatusIndicator
          label="Processing"
          status="active"
          pulse={systemHealth.processing.activeJobs > 0}
          icon="⚡"
          count={systemHealth.processing.activeJobs.toString()}
          tooltip={`${systemHealth.processing.activeJobs} active jobs`}
          details={[
            `Active jobs: ${systemHealth.processing.activeJobs}`,
            `Queued jobs: ${systemHealth.processing.queuedJobs}`,
            'Processing normally',
          ]}
        />
      </div>
    </motion.div>
  )
}

export default SystemHealthBar
