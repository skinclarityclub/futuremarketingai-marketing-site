/**
 * Chat Panel
 *
 * Main chat interface with glassmorphic design.
 * Responsive: Desktop (floating panel) vs Mobile (bottom sheet)
 */

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useChatStore } from '../../stores/chatStore'
import { useJourneyStore } from '../../stores/journeyStore'
import { usePersonalizationStore } from '../../stores/personalizationStore'
import { useFloatingElement } from '../../contexts/FloatingElementContext'
import { glassPanel } from './styles/glassmorphism'
import { panelSlideIn, bottomSheetSlideUp, reducedMotionVariants } from './styles/animations'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import ProactiveSuggestions from './ProactiveSuggestions'
import EnhancedProgressIndicator from './EnhancedProgressIndicator'
import CelebrationToast from './CelebrationToast'
import PersonalizationSettingsPanel from './PersonalizationSettingsPanel'
import AchievementBadgeDisplay from './AchievementBadgeDisplay'
import { useAchievementTracking } from '../../hooks/useAchievementTracking'
import type { NavigationActionData } from './NavigationAction'

interface ChatPanelProps {
  onOpenInfoPanel?: (action: NavigationActionData) => void
}

export default function ChatPanel({ onOpenInfoPanel }: ChatPanelProps) {
  const { isOpen, closeChat: closeChatStore } = useChatStore()
  const { closeChat: closeChatCoordinator, activeElement } = useFloatingElement()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const prefersReducedMotion = useReducedMotion()

  // 🎮 Achievement tracking
  const { newlyUnlocked: newAchievements, clearNewlyUnlocked } = useAchievementTracking()

  // 🎨 UI State
  const [showSettings, setShowSettings] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showProgress, setShowProgress] = useState(false) // Progress collapsed by default

  // Only show if chat is the active element
  const shouldShow = isOpen && activeElement === 'chat'

  // Prevent body scroll on mobile when chat is open
  useEffect(() => {
    if (isMobile && shouldShow) {
      // Save original overflow
      const originalOverflow = document.body.style.overflow
      const originalPosition = document.body.style.position

      // Lock scroll
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'relative'

      // Restore on unmount
      return () => {
        document.body.style.overflow = originalOverflow
        document.body.style.position = originalPosition
      }
    }

    return undefined
  }, [isMobile, shouldShow])

  // Don't render if closed or another element is active
  if (!shouldShow) {
    return null
  }

  // Select animation variant based on device and motion preferences
  const getAnimationVariant = () => {
    if (prefersReducedMotion) {
      return reducedMotionVariants.panelSlideIn
    }
    return isMobile ? bottomSheetSlideUp : panelSlideIn
  }

  // Handle backdrop click (mobile only)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeChatStore()
      closeChatCoordinator()
    }
  }

  return (
    <>
      {/* Backdrop (Mobile only) */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          aria-hidden="true"
        />
      )}

      {/* Chat Panel */}
      <motion.div
        variants={getAnimationVariant()}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`
          fixed
          ${
            isMobile
              ? 'bottom-0 left-0 right-0 rounded-t-3xl max-h-[70vh] z-[9999]'
              : 'right-6 top-[10vh] w-[600px] h-[80vh] rounded-2xl shadow-2xl z-50'
          }
          ${glassPanel}
          overflow-hidden
          flex flex-col
        `}
        role="dialog"
        aria-label="AI Journey Assistant Chat"
        aria-modal="true"
      >
        {/* Header */}
        <ChatHeader
          onOpenSettings={() => setShowSettings(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onToggleProgress={() => setShowProgress(!showProgress)}
          showProgress={showProgress}
        />

        {/* 🎯 Enhanced Progress Indicator (Collapsible & Scrollable) */}
        {showProgress && (
          <div className="px-4 py-3 border-b border-white/10 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-white/5">
            <EnhancedProgressIndicator />
          </div>
        )}

        {/* Message List (Scrollable) */}
        <div className="flex-1 min-h-0">
          <MessageList onOpenInfoPanel={onOpenInfoPanel} />
        </div>

        {/* Proactive Suggestions */}
        <ProactiveSuggestions
          onQuestionClick={async (question) => {
            // Send question as user message and generate response
            const {
              addUserMessage,
              setTyping,
              addSystemMessage,
              addNavigationMessage,
              addQuickRepliesMessage,
              addCalendlyBookingMessage,
              messages: currentMessages,
            } = useChatStore.getState()

            const { completedSteps, timeOnSite } = useJourneyStore.getState()
            const { selectedIndustry, icpScore, userJourney } = usePersonalizationStore.getState()

            // Add user message
            addUserMessage(question)

            // Show typing indicator
            setTyping(true)

            // Build conversation context
            const context = {
              industryId: selectedIndustry?.id || null,
              icpScore: (icpScore && icpScore.overall) || 0,
              modulesExplored: completedSteps?.length || 0,
              timeOnSite: timeOnSite || 0,
              calculatorCompleted: false,
              messagesCount: currentMessages?.length || 0,
              lastViewedModules: userJourney?.viewedModules || [],
            }

            try {
              // Import generateResponse dynamically to avoid circular dependency
              const { generateResponse } = await import('../../utils/conversationEngine')
              const response = await generateResponse(question, context, currentMessages)

              setTimeout(() => {
                setTyping(false)

                // Add response based on type
                if (response.type === 'navigation' && response.navigationData) {
                  addNavigationMessage(response.content, response.navigationData)
                } else if (response.type === 'calendly-booking' && response.calendlyData) {
                  addCalendlyBookingMessage(response.content, response.calendlyData)
                } else if (response.type === 'quick-replies' && response.replies) {
                  addQuickRepliesMessage(response.content, response.replies)
                } else if (response.suggestedActions) {
                  addSystemMessage(response.content, response.suggestedActions)
                } else {
                  addSystemMessage(response.content)
                }
              }, 500)
            } catch (error) {
              console.error('Proactive question response error:', error)
              setTimeout(() => {
                setTyping(false)
                addSystemMessage('Sorry, er ging iets mis. Probeer het opnieuw!', [
                  'Wat kan dit platform?',
                  'Bereken ROI',
                ])
              }, 1000)
            }
          }}
        />

        {/* Input Area */}
        <ChatInput />

        {/* Mobile Swipe Handle */}
        {isMobile && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full"
            style={{ background: 'rgba(255, 255, 255, 0.3)' }}
            aria-hidden="true"
          />
        )}
      </motion.div>

      {/* 🎉 Celebration Toasts for new achievements */}
      <AnimatePresence>
        {newAchievements.map((achievement) => (
          <CelebrationToast
            key={achievement.id}
            milestone={achievement}
            onDismiss={clearNewlyUnlocked}
          />
        ))}
      </AnimatePresence>

      {/* ⚙️ Personalization Settings Panel */}
      <PersonalizationSettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* 🏆 Achievement Badge Display Panel */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
            onClick={() => setShowAchievements(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                ${glassPanel}
                max-w-4xl w-full max-h-[80vh] overflow-y-auto
                rounded-2xl p-6
              `}
            >
              <AchievementBadgeDisplay />
              <button
                onClick={() => setShowAchievements(false)}
                className="mt-4 w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Sluiten
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
