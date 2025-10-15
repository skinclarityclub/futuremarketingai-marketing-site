/**
 * Chat Header
 *
 * Top bar of the chat panel with title, progress, and controls
 */

import { X, MapPin, Sparkles, Settings, Trophy, ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '../../stores/chatStore'
import { useJourneyStore } from '../../stores/journeyStore'
import { usePersonalizationStore } from '../../stores/personalizationStore'
import { useFloatingElement } from '../../contexts/FloatingElementContext'
import { glassHeaderFooter } from './styles/glassmorphism'
import { detectPage } from '../../utils/pageContext'

interface ChatHeaderProps {
  onOpenSettings?: () => void
  onOpenAchievements?: () => void
  onToggleProgress?: () => void
  showProgress?: boolean
}

export default function ChatHeader({
  onOpenSettings,
  onOpenAchievements,
  onToggleProgress,
  showProgress = false,
}: ChatHeaderProps = {}) {
  const { t } = useTranslation('ai-assistant')
  const { closeChat: closeChatStore } = useChatStore()
  const { closeChat: closeChatCoordinator } = useFloatingElement()
  const { milestones, getVisitedPagesArray, hasUsedCalculator, hasScheduledDemo, currentPage } =
    useJourneyStore()
  const { userJourney } = usePersonalizationStore()

  const handleClose = () => {
    closeChatStore()
    closeChatCoordinator()
  }

  const achievedCount = milestones.filter((m) => m.achieved).length

  // 🆕 Calculate module progress (9 modules + ROI + Demo = 11 checkpoints)
  const visitedPages = getVisitedPagesArray()

  // All 9 platform modules
  const moduleIds = [
    'research-planning',
    'manager-workflow',
    'content-pipeline',
    'telegram-approval',
    'publishing-layer',
    'analytics-monitoring',
    'ad-builder',
    'campaign-orchestrator',
    'multi-account',
  ]

  // Count viewed modules
  const viewedModulesCount = moduleIds.filter(
    (moduleId) =>
      visitedPages.some((page) => page.includes(moduleId)) ||
      userJourney.viewedModules.includes(moduleId)
  ).length

  // Total checkpoints: 9 modules + ROI + Demo
  const totalCheckpoints = 11
  const completedCheckpoints =
    viewedModulesCount + (hasUsedCalculator ? 1 : 0) + (hasScheduledDemo ? 1 : 0)
  const pageProgress = Math.round((completedCheckpoints / totalCheckpoints) * 100)

  // Progress message based on modules
  const progressMessage =
    viewedModulesCount === 9
      ? '🎉 Alle modules verkend!'
      : `${viewedModulesCount}/9 modules ontdekt`

  // 🎨 Visual feedback for page changes
  const [showPageIndicator, setShowPageIndicator] = useState(false)
  const [pulse, setPulse] = useState(false)
  const currentPageName = detectPage(currentPage)

  // Track if there's new progress (for notification dot)
  const [hasNewProgress, setHasNewProgress] = useState(false)
  const previousProgress = React.useRef(completedCheckpoints)

  // Trigger visual feedback when page changes
  useEffect(() => {
    if (viewedModulesCount > 0) {
      setShowPageIndicator(true)
      setPulse(true)

      const timer = setTimeout(() => {
        setShowPageIndicator(false)
        setPulse(false)
      }, 2000)

      return () => clearTimeout(timer)
    }

    return undefined
  }, [currentPage, viewedModulesCount])

  // Detect new progress
  useEffect(() => {
    if (completedCheckpoints > previousProgress.current) {
      setHasNewProgress(true)
      previousProgress.current = completedCheckpoints

      // Clear after 5 seconds
      const timer = setTimeout(() => {
        setHasNewProgress(false)
      }, 5000)

      return () => clearTimeout(timer)
    }

    return undefined
  }, [completedCheckpoints])

  // Clear new progress indicator when progress is shown
  useEffect(() => {
    if (showProgress && hasNewProgress) {
      setHasNewProgress(false)
    }
  }, [showProgress, hasNewProgress])

  return (
    <div className={`${glassHeaderFooter} px-4 py-3 flex items-center justify-between shrink-0`}>
      {/* Title & Progress */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          {/* Gradient Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-xl">✨</span>
            </div>
            {/* Online Status Indicator */}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"
              title={t('online')}
            />
          </div>

          {/* Name & Subtitle */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {t('name')}
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                AI Assistant
              </span>
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 -mt-0.5">{t('tagline')}</p>
          </div>
        </div>

        {/* 🆕 Page Visit Progress - Always visible, context-aware */}
        <div className="mt-1.5 flex items-center gap-2 relative">
          <MapPin
            size={12}
            className={`text-purple-600 shrink-0 transition-all duration-300 ${pulse ? 'scale-125 animate-bounce' : 'scale-100'}`}
          />
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255, 255, 255, 0.2)' }}
          >
            <div
              className={`h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-700 ease-out ${
                pulse ? 'shadow-lg shadow-purple-500/50' : ''
              }`}
              style={{ width: `${pageProgress}%` }}
              role="progressbar"
              aria-valuenow={pageProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Demo voortgang: ${completedCheckpoints} van ${totalCheckpoints} checkpoints voltooid`}
            />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
            {completedCheckpoints}/{totalCheckpoints}
          </span>

          {/* 🎨 Context change indicator */}
          {showPageIndicator && currentPageName !== 'unknown' && (
            <div className="absolute -right-2 -top-1 bg-purple-600 text-white px-1.5 py-0.5 rounded-full text-xs flex items-center gap-1 animate-pulse shadow-lg">
              <Sparkles size={10} />
              <span className="capitalize">{currentPageName}</span>
            </div>
          )}
        </div>

        {/* Progress message tooltip */}
        {pageProgress > 0 && (
          <p
            className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 italic truncate"
            title={progressMessage}
          >
            {progressMessage}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 ml-2">
        {/* Settings Button */}
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg hover:transition-colors group"
            aria-label={t('common:accessibility.personalization_settings')}
            title={t('common:navigation.settings')}
          >
            <Settings
              size={16}
              className="text-gray-600 dark:text-gray-400 group-hover:text-purple-500 transition-colors"
            />
          </button>
        )}

        {/* Achievement Badge Button */}
        {achievedCount > 0 && onOpenAchievements && (
          <button
            onClick={onOpenAchievements}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:transition-colors group"
            aria-label={`${achievedCount} achievements behaald - Klik om te bekijken`}
            title={t('common:accessibility.view_achievements')}
          >
            <Trophy
              size={16}
              className="text-yellow-500 group-hover:scale-110 transition-transform"
            />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {achievedCount}
            </span>
          </button>
        )}

        {/* Progress Toggle Button - Eye-catching */}
        {onToggleProgress && (
          <button
            onClick={onToggleProgress}
            className={`
              relative
              flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg 
              transition-all duration-300
              ${
                showProgress
                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30'
                  : 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 animate-pulse'
              }
              border border-purple-500/30
              group
            `}
            aria-label={showProgress ? 'Verberg voortgang' : 'Bekijk je voortgang'}
            title={showProgress ? 'Verberg voortgang' : '🎯 Bekijk je voortgang!'}
          >
            {/* New Progress Notification Dot */}
            {hasNewProgress && !showProgress && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
              </span>
            )}

            <MapPin
              size={14}
              className="text-purple-500 group-hover:scale-110 transition-transform"
            />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              {completedCheckpoints}/{totalCheckpoints}
            </span>
            {showProgress ? (
              <ChevronUp size={14} className="text-purple-500" />
            ) : (
              <ChevronDown size={14} className="text-purple-500 group-hover:animate-bounce" />
            )}
          </button>
        )}

        {/* Close */}
        <button
          onClick={handleClose}
          className="p-2 hover:rounded-lg transition-colors"
          aria-label={t('common:actions.close_chat')}
        >
          <X size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  )
}
