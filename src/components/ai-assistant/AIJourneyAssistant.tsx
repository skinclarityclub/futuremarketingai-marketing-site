/**
 * AI Journey Assistant
 *
 * Main container component that orchestrates the entire assistant experience.
 * Lazy loaded to minimize impact on initial page load.
 */

import { useEffect, useRef, Suspense, lazy, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import FloatingActionButton from './FloatingActionButton'
import { useChatStore } from '../../stores/chatStore'
import { useJourneyStore } from '../../stores/journeyStore'
import { usePersonalizationStore } from '../../stores/personalizationStore'
import { useFloatingElement } from '../../contexts/FloatingElementContext'
import { getJourneyConfig } from '../../config/assistantJourneys'
import { useJourneyNudges, useProactiveChat } from '../../hooks/useJourneyNudges'
import { detectPage } from '../../utils/pageContext'
import { getContextualGreeting, getPageSpecificReplies } from '../../utils/pageContextI18n'
import InfoPanel from './InfoPanel'
import NudgeToast from './NudgeToast'
import type { NavigationActionData } from './NavigationAction'

// Lazy load ChatPanel for better performance
const ChatPanel = lazy(() => import('./ChatPanel'))

export default function AIJourneyAssistant() {
  const location = useLocation()
  const { isOpen, addQuickRepliesMessage, messages } = useChatStore()
  const { activeElement } = useFloatingElement()
  const { isJourneyStarted, startJourney, initializeSteps, visitPage, getVisitedPagesArray } =
    useJourneyStore()
  const { selectedIndustry } = usePersonalizationStore()
  const hasInitialized = useRef(false)
  const lastPathname = useRef(location?.pathname || '/')
  const welcomeMessageSent = useRef(false)
  const contextualMessagesSent = useRef<Set<string>>(new Set()) // Track which pages got contextual messages

  // InfoPanel state - SEPARATE from chat
  const [infoPanelOpen, setInfoPanelOpen] = useState(false)
  const [activeNavAction, setActiveNavAction] = useState<NavigationActionData | null>(null)

  // Enable journey nudges and proactive chat
  useJourneyNudges()
  useProactiveChat()

  // 🆕 Track page visits (always track, even on first load)
  useEffect(() => {
    const currentPath = location?.pathname || '/'
    const previousPath = lastPathname.current

    if (currentPath !== previousPath) {
      visitPage(currentPath)
      lastPathname.current = currentPath
    }
  }, [location?.pathname, visitPage])

  // 🎯 Send contextual messages when page changes (only if chat is open)
  useEffect(() => {
    const currentPath = location?.pathname || '/'
    const currentHash = location?.hash || ''

    // IMPORTANT: Skip contextual messages if:
    // - There's a hash (module modal is open, module follow-up will handle it)
    // - This prevents conflicts between contextual messages and module-specific guidance
    const hasModuleHash = currentHash.length > 0

    // Only proceed if:
    // 1. Chat is open
    // 2. Journey has started
    // 3. We have a welcome message (messages.length > 0)
    // 4. We haven't already sent a contextual message for this page in this session
    // 5. Current page is NOT the home page (home gets welcome message, not contextual)
    // 6. NO hash present (no module modal open)
    if (
      isOpen &&
      hasInitialized.current &&
      messages.length > 0 &&
      currentPath !== '/' &&
      !hasModuleHash &&
      !contextualMessagesSent.current.has(currentPath)
    ) {
      const currentPage = detectPage(currentPath)
      const visitedArray = getVisitedPagesArray().map(detectPage)

      try {
        // Get page-specific greeting (not first visit since we're navigating with chat open)
        const greeting = getContextualGreeting(currentPage, false, visitedArray)
        const replies = getPageSpecificReplies(currentPage)

        // Add contextual message ONCE per page per chat session
        addQuickRepliesMessage(greeting, replies)

        // Mark this page as having received a contextual message
        contextualMessagesSent.current.add(currentPath)
      } catch (error) {
        // Silently handle error - not critical for user experience
      }
    }
  }, [location?.pathname, location?.hash, isOpen, messages.length]) // Include hash in dependencies

  // 🎉 Send welcome message when chat opens
  useEffect(() => {
    // Always send welcome message when chat opens if no messages exist
    if (isOpen && messages.length === 0 && !welcomeMessageSent.current) {
      try {
        const currentPath = location?.pathname || '/'
        const currentPage = detectPage(currentPath)
        const visitedArray = getVisitedPagesArray().map(detectPage)
        const isFirstVisit = visitedArray.length === 0

        // Get contextual greeting based on current page
        const greeting = getContextualGreeting(currentPage, isFirstVisit, visitedArray)
        const replies = getPageSpecificReplies(currentPage)

        addQuickRepliesMessage(greeting, replies)
        welcomeMessageSent.current = true
      } catch (error) {
        // Silently handle error - not critical for user experience
      }
    }

    // Reset when chat closes
    if (!isOpen) {
      welcomeMessageSent.current = false
      contextualMessagesSent.current.clear() // Also clear contextual message tracking
    }
  }, [isOpen, messages.length]) // Minimal dependencies

  // Initialize journey when component mounts (only once, even in Strict Mode)
  useEffect(() => {
    if (!hasInitialized.current && !isJourneyStarted) {
      hasInitialized.current = true

      // Get journey config based on selected industry
      const journeyConfig = getJourneyConfig(selectedIndustry?.id || null)

      // Initialize journey steps
      initializeSteps(journeyConfig.steps)

      // Start journey
      startJourney(selectedIndustry?.id, undefined)

      // Note: Welcome message is handled by the separate useEffect that reacts to isOpen
      // This ensures contextual greeting based on current page when chat first opens
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Track time on site
  useEffect(() => {
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
      useJourneyStore.getState().updateTimeOnSite(elapsedSeconds)
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Floating Action Button (Always visible) */}
      <FloatingActionButton />

      {/* Chat Panel (Conditionally rendered) */}
      <AnimatePresence mode="wait">
        {isOpen && activeElement === 'chat' && (
          <Suspense fallback={null}>
            <ChatPanel
              onOpenInfoPanel={(action) => {
                setActiveNavAction(action)
                setInfoPanelOpen(true)
              }}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Info Panel - SEPARATE floating panel next to chat */}
      <AnimatePresence mode="wait">
        {infoPanelOpen && activeNavAction && (
          <InfoPanel
            isOpen={infoPanelOpen}
            action={activeNavAction}
            onClose={() => setInfoPanelOpen(false)}
            standalone={true}
          />
        )}
      </AnimatePresence>

      {/* Nudge Toast */}
      <NudgeToast />
    </>
  )
}
