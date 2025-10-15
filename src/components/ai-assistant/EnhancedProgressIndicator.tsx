/**
 * Enhanced Progress Indicator
 *
 * Shows all 9 platform modules as individual checkpoints, followed by ROI and Demo booking.
 * Awards achievement when all modules are viewed.
 *
 * Based on 2025 best practices from Pendo and product-led growth platforms.
 */

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useJourneyStore } from '../../stores/journeyStore'
import { usePersonalizationStore } from '../../stores/personalizationStore'
import { useMemo } from 'react'

interface Milestone {
  id: string
  icon: string
  label: string
  completed: boolean
  isSpecial?: boolean // For ROI and Demo milestones
  route: string // Navigation path
}

// All platform modules with routes (using hash-based routing)
const PLATFORM_MODULES = [
  { id: 'research-planning', icon: '🧠', label: 'Research', route: '/explorer#research-planning' },
  { id: 'manager-workflow', icon: '💼', label: 'Manager', route: '/explorer#manager-workflow' },
  { id: 'content-pipeline', icon: '📝', label: 'Content', route: '/explorer#content-pipeline' },
  { id: 'telegram-approval', icon: '📱', label: 'Telegram', route: '/explorer#telegram-approval' },
  { id: 'publishing-layer', icon: '🚀', label: 'Publishing', route: '/explorer#publishing-layer' },
  {
    id: 'analytics-monitoring',
    icon: '📊',
    label: 'Analytics',
    route: '/explorer#analytics-monitoring',
  },
  { id: 'ad-builder', icon: '🎨', label: 'Ad Builder', route: '/explorer#ad-builder' },
  {
    id: 'campaign-orchestrator',
    icon: '🎛️',
    label: 'Campaign',
    route: '/explorer#campaign-orchestrator',
  },
  { id: 'multi-account', icon: '👥', label: 'Multi-Account', route: '/explorer#multi-account' },
]

export default function EnhancedProgressIndicator() {
  const { hasUsedCalculator, hasScheduledDemo, getVisitedPagesArray } = useJourneyStore()

  const { userJourney } = usePersonalizationStore()

  // Get viewed modules from visited pages
  const viewedModules = useMemo(() => {
    const visitedPages = getVisitedPagesArray()
    const viewed = new Set<string>()

    // Check which modules have been viewed
    PLATFORM_MODULES.forEach((module) => {
      const isViewed = visitedPages.some(
        (page) => page.includes(module.id) || userJourney.viewedModules.includes(module.id)
      )
      if (isViewed) {
        viewed.add(module.id)
      }
    })

    return viewed
  }, [getVisitedPagesArray, userJourney.viewedModules])

  // Calculate discrete milestones - All modules + ROI + Demo
  const discreteMilestones = useMemo<Milestone[]>(() => {
    const moduleMilestones = PLATFORM_MODULES.map((module) => ({
      id: module.id,
      icon: module.icon,
      label: module.label,
      route: module.route,
      completed: viewedModules.has(module.id),
      isSpecial: false,
    }))

    // Add special milestones
    return [
      ...moduleMilestones,
      {
        id: 'calculator',
        icon: '💰',
        label: 'ROI Check',
        route: '/calculator',
        completed: hasUsedCalculator,
        isSpecial: true,
      },
      {
        id: 'demo_booked',
        icon: '📅',
        label: 'Demo Booked',
        route: '/calculator', // Calculator page has booking CTA
        completed: hasScheduledDemo,
        isSpecial: true,
      },
    ]
  }, [viewedModules, hasUsedCalculator, hasScheduledDemo])

  // Count completed milestones
  const completedCount = discreteMilestones.filter((m) => m.completed).length
  const totalCount = discreteMilestones.length

  // Count completed modules (excluding special milestones)
  const completedModules = viewedModules.size
  const totalModules = PLATFORM_MODULES.length
  const allModulesCompleted = completedModules === totalModules

  // Get progress message with module count
  const progressMessage = useMemo(() => {
    if (allModulesCompleted && !hasUsedCalculator) {
      return '🎉 Alle modules verkend! Tijd om je ROI te berekenen.'
    }
    if (allModulesCompleted && hasUsedCalculator && !hasScheduledDemo) {
      return '🚀 Geweldig! Laatste stap: plan een demo om te starten.'
    }
    if (completedCount === totalCount) {
      return '👑 Journey compleet! Je bent klaar om te starten.'
    }
    if (completedModules >= 5) {
      return `⚡ Nog ${totalModules - completedModules} modules te gaan!`
    }
    if (completedModules >= 3) {
      return '🔥 Over halfway! Blijf ontdekken.'
    }
    if (completedModules >= 1) {
      return '🚀 Goede start! Ontdek meer modules.'
    }
    return '✨ Begin je journey door modules te verkennen.'
  }, [
    completedModules,
    totalModules,
    allModulesCompleted,
    hasUsedCalculator,
    hasScheduledDemo,
    completedCount,
    totalCount,
  ])

  // Calculate progress percentage
  const progressPercentage = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="space-y-3">
      {/* Header with module count */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-white">{completedModules}</span>
            <span className="text-sm text-white/60">van {totalModules} modules</span>
          </div>
          {allModulesCompleted && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-yellow-400">🏆</span>
              <span className="text-yellow-400 font-semibold">All Modules Unlocked!</span>
            </div>
          )}
        </div>

        {/* Overall progress */}
        <div className="text-right">
          <div className="text-xl font-bold text-white">
            {completedCount}/{totalCount}
          </div>
          <div className="text-xs text-white/50">checkpoints</div>
        </div>
      </div>

      {/* Progress Message */}
      <div className="text-xs text-white/70 leading-relaxed">{progressMessage}</div>

      {/* Visual Progress Bar */}
      <div className="relative h-2 rounded-full overflow-hidden">
        <motion.div
          className={`
            absolute inset-y-0 left-0 rounded-full
            ${
              allModulesCompleted
                ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500'
                : 'bg-gradient-to-r from-purple-500 to-blue-500'
            }
          `}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Module Badges - 3 rows */}
      <div className="space-y-2 pt-2">
        {/* Row 1: First 3 modules */}
        <div className="grid grid-cols-3 gap-2">
          {discreteMilestones.slice(0, 3).map((milestone, index) => (
            <ModuleBadge key={milestone.id} milestone={milestone} index={index} />
          ))}
        </div>

        {/* Row 2: Next 3 modules */}
        <div className="grid grid-cols-3 gap-2">
          {discreteMilestones.slice(3, 6).map((milestone, index) => (
            <ModuleBadge key={milestone.id} milestone={milestone} index={index + 3} />
          ))}
        </div>

        {/* Row 3: Last 3 modules */}
        <div className="grid grid-cols-3 gap-2">
          {discreteMilestones.slice(6, 9).map((milestone, index) => (
            <ModuleBadge key={milestone.id} milestone={milestone} index={index + 6} />
          ))}
        </div>

        {/* Row 4: Special milestones (ROI + Demo) - centered */}
        <div className="grid grid-cols-2 gap-3 max-w-[66%] mx-auto pt-2">
          {discreteMilestones.slice(9, 11).map((milestone, index) => (
            <SpecialMilestoneBadge
              key={milestone.id}
              milestone={milestone}
              index={index + 9}
              allModulesCompleted={allModulesCompleted}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Module Badge Component
 */
function ModuleBadge({ milestone, index }: { milestone: Milestone; index: number }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(milestone.route)
  }

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative
        flex flex-col items-center gap-1 p-2 rounded-lg
        transition-all duration-300
        cursor-pointer
        ${
          milestone.completed
            ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 hover:from-purple-500/30 hover:to-blue-500/30'
            : 'border border-white/10 opacity-50 hover:opacity-70'
        }
      `}
      title={`Ga naar ${milestone.label}`}
      aria-label={`Navigeer naar ${milestone.label} module`}
    >
      {/* Icon */}
      <motion.div
        className="text-xl"
        animate={{
          scale: milestone.completed ? [1, 1.15, 1] : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        {milestone.icon}
      </motion.div>

      {/* Label */}
      <div
        className={`
          text-[9px] text-center leading-tight font-medium
          ${milestone.completed ? 'text-white/90' : 'text-white/40'}
        `}
      >
        {milestone.label}
      </div>

      {/* Checkmark for completed */}
      {milestone.completed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
        >
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}

/**
 * Special Milestone Badge (ROI & Demo)
 */
function SpecialMilestoneBadge({
  milestone,
  index,
  allModulesCompleted,
}: {
  milestone: Milestone
  index: number
  allModulesCompleted: boolean
}) {
  const navigate = useNavigate()
  const isUnlocked = allModulesCompleted || milestone.completed

  const handleClick = () => {
    navigate(milestone.route)
  }

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
      whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
      className={`
        relative
        flex flex-col items-center gap-1.5 p-3 rounded-xl
        transition-all duration-300
        ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${
          milestone.completed
            ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 shadow-lg shadow-yellow-500/20 hover:from-yellow-500/30 hover:to-orange-500/30'
            : isUnlocked
              ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20 animate-pulse hover:from-purple-500/20 hover:to-blue-500/20'
              : 'border border-white/10 opacity-40'
        }
      `}
      disabled={!isUnlocked}
      title={isUnlocked ? `Ga naar ${milestone.label}` : `Voltooi alle modules om te unlocken`}
      aria-label={`Navigeer naar ${milestone.label}`}
    >
      {/* Icon */}
      <motion.div
        className="text-2xl"
        animate={{
          scale: milestone.completed ? [1, 1.2, 1] : isUnlocked ? [1, 1.1, 1] : 1,
          rotate: milestone.completed ? [0, -5, 5, -5, 0] : 0,
        }}
        transition={{
          duration: milestone.completed ? 0.6 : 0.8,
          repeat: !milestone.completed && isUnlocked ? Infinity : 0,
          repeatDelay: 2,
        }}
      >
        {milestone.icon}
      </motion.div>

      {/* Label */}
      <div
        className={`
          text-[10px] text-center leading-tight font-semibold
          ${milestone.completed ? 'text-yellow-300' : isUnlocked ? 'text-white/90' : 'text-white/40'}
        `}
      >
        {milestone.label}
      </div>

      {/* Checkmark or unlock indicator */}
      {milestone.completed ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      ) : (
        isUnlocked && <div className="absolute -top-1 -right-1 text-xs">✨</div>
      )}
    </motion.button>
  )
}
