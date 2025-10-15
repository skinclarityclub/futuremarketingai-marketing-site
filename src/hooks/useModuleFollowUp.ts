/**
 * Module Follow-Up Hook
 *
 * Provides proactive chat support when users finish exploring modules.
 * Sends contextual follow-up messages and next-step suggestions.
 *
 * Best Practices:
 * - Proper cleanup of timers (no memory leaks)
 * - Uses location state instead of window.location for reactivity
 * - Memoized data to prevent re-renders
 * - Type-safe throughout
 * - No production console.logs
 */

import { useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useChatStore } from '../stores/chatStore'

interface QuickReply {
  label: string
  value: string
  icon?: string
}

interface ModuleFollowUp {
  message: string
  replies: QuickReply[]
}

/**
 * Module follow-up configuration
 * Separated for maintainability and easy updates
 */
const MODULE_FOLLOWUPS: Record<string, ModuleFollowUp> = {
  'research-planning': {
    message:
      '🧠 **Research & Planning bekeken!** Hier begin je met diepgaand marktonderzoek.\n\nHeb je vragen over hoe Perplexity AI werkt, of zullen we doorgaan naar de volgende stap?',
    replies: [
      { label: '▶️ Volgende: Manager Workflow', value: 'next_module_manager', icon: 'sparkles' },
      { label: '❓ Hoe werkt Perplexity AI?', value: 'explain_perplexity', icon: 'help' },
      { label: '🗺️ Bekijk alle modules', value: 'show_all_modules', icon: 'explorer' },
    ],
  },
  'manager-workflow': {
    message:
      '💼 **Manager Workflow bekeken!** Het centrale brein dat alles coördineert.\n\nSnap je hoe de verschillende modules samenwerken? Of gaan we verder naar Content Pipeline?',
    replies: [
      { label: '▶️ Volgende: Content Pipeline', value: 'next_module_content', icon: 'sparkles' },
      { label: '❓ Hoe werkt de coördinatie?', value: 'explain_coordination', icon: 'help' },
      { label: '🔙 Terug naar overzicht', value: 'show_all_modules', icon: 'explorer' },
    ],
  },
  'content-pipeline': {
    message:
      '📝 **Content Pipeline bekeken!** Snellere, SEO-geoptimaliseerde content productie.\n\nVragen over de contentgeneratie, of door naar de volgende module?',
    replies: [
      { label: '▶️ Volgende: Telegram Control', value: 'next_module_telegram', icon: 'sparkles' },
      { label: '❓ Welke content kan ik genereren?', value: 'explain_content_types', icon: 'help' },
      { label: '🗺️ Toon alle modules', value: 'show_all_modules', icon: 'explorer' },
    ],
  },
  'telegram-control': {
    message:
      '📱 **Telegram Control bekeken!** Goedkeuringen op je mobiel, altijd en overal.\n\nDuidelijk hoe mobile approval werkt? Zullen we verder gaan?',
    replies: [
      { label: '▶️ Volgende: Publishing Layer', value: 'next_module_publishing', icon: 'sparkles' },
      { label: '❓ Waarom Telegram gebruiken?', value: 'explain_telegram', icon: 'help' },
      { label: '💰 Bereken mijn ROI', value: 'calculator', icon: 'calculator' },
    ],
  },
  'publishing-layer': {
    message:
      '🚀 **Publishing Layer bekeken!** Multi-channel distributie in één klik.\n\nVragen over de publishing mogelijkheden? Of door naar Analytics?',
    replies: [
      { label: '▶️ Volgende: Analytics Lab', value: 'next_module_analytics', icon: 'sparkles' },
      { label: '❓ Welke kanalen zijn ondersteund?', value: 'explain_channels', icon: 'help' },
      { label: '💰 Bereken mijn ROI', value: 'calculator', icon: 'calculator' },
    ],
  },
  'analytics-lab': {
    message:
      '📊 **Analytics Lab bekeken!** Real-time performance tracking en AI insights.\n\nVragen over de analytics? Of wil je Ad Builder zien?',
    replies: [
      { label: '▶️ Volgende: Ad Builder Studio', value: 'next_module_adbuilder', icon: 'sparkles' },
      { label: '❓ Welke metrics worden getrackt?', value: 'explain_metrics', icon: 'help' },
      { label: '💰 Bereken mijn ROI', value: 'calculator', icon: 'calculator' },
    ],
  },
  'ad-builder': {
    message:
      '🎨 **Ad Builder Studio bekeken!** AI-gegenereerde advertenties in seconden.\n\n🎉 Je hebt alle 7 modules gezien! Wat wil je nu doen?',
    replies: [
      { label: '💰 Bereken mijn ROI', value: 'calculator', icon: 'calculator' },
      { label: '📅 Plan een demo', value: 'demo', icon: 'calendar' },
      { label: '❓ Ik heb nog vragen', value: 'ask_question', icon: 'help' },
    ],
  },
}

/**
 * Default fallback for unknown modules
 */
const DEFAULT_FOLLOWUP: ModuleFollowUp = {
  message: '👍 Module bekeken! Heb je vragen, of gaan we verder?',
  replies: [
    { label: 'Volgende module', value: 'show_all_modules', icon: 'sparkles' },
    { label: 'Bereken ROI', value: 'calculator', icon: 'calculator' },
    { label: 'Stel een vraag', value: 'ask_question', icon: 'help' },
  ],
}

/**
 * Get contextual follow-up for a module
 */
function getModuleFollowUp(moduleId: string): ModuleFollowUp {
  return MODULE_FOLLOWUPS[moduleId] || DEFAULT_FOLLOWUP
}

/**
 * Hook to provide proactive follow-up when modules are closed
 *
 * Features:
 * - Detects when a module modal is closed
 * - Sends contextual follow-up message
 * - Opens chat automatically if closed
 * - Prevents duplicate messages (one per module per session)
 * - Proper cleanup to prevent memory leaks
 */
export function useModuleFollowUp() {
  const location = useLocation()
  const { addQuickRepliesMessage, isOpen, openChat } = useChatStore()

  // Track last open module
  const lastModuleRef = useRef<string | null>(null)

  // Track which modules already received follow-ups
  const followUpSentRef = useRef<Set<string>>(new Set())

  // Store timeout IDs for cleanup
  const timeoutIdsRef = useRef<number[]>([])

  /**
   * Send follow-up message with proper timing
   */
  const sendFollowUp = useCallback(
    (moduleId: string) => {
      const followUp = getModuleFollowUp(moduleId)

      // If chat is closed, open it first
      if (!isOpen) {
        openChat()

        // Wait for chat open animation to complete
        const timeoutId = window.setTimeout(() => {
          addQuickRepliesMessage(followUp.message, followUp.replies)
        }, 300)

        timeoutIdsRef.current.push(timeoutId)
      } else {
        // Chat already open, send immediately
        addQuickRepliesMessage(followUp.message, followUp.replies)
      }

      // Mark as sent
      followUpSentRef.current.add(moduleId)

      // Development logging only
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Proactive follow-up sent for:', moduleId)
      }
    },
    [isOpen, openChat, addQuickRepliesMessage]
  )

  /**
   * Detect module close and trigger follow-up
   */
  useEffect(() => {
    // Get current hash (represents open module)
    const currentHash = location.hash.replace('#', '')

    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log('📍 Hash changed:', {
        previousModule: lastModuleRef.current,
        currentHash: currentHash || '(empty)',
        pathname: location.pathname,
      })
    }

    // Detect module close: we HAD a module, now we don't
    const moduleWasClosed = lastModuleRef.current && !currentHash

    if (moduleWasClosed) {
      const closedModule = lastModuleRef.current!

      // Only send follow-up once per module per session
      const alreadySent = followUpSentRef.current.has(closedModule)

      if (process.env.NODE_ENV === 'development') {
        console.log('🎯 Module closed detected:', {
          module: closedModule,
          alreadySent,
          willSendFollowUp: !alreadySent,
        })
      }

      if (!alreadySent) {
        // Small delay so modal close animation completes
        const timeoutId = window.setTimeout(() => {
          sendFollowUp(closedModule)
        }, 500)

        timeoutIdsRef.current.push(timeoutId)
      }
    }

    // Update last module reference
    lastModuleRef.current = currentHash || null
  }, [location.hash, sendFollowUp])

  /**
   * Reset sent messages when chat closes
   */
  useEffect(() => {
    if (!isOpen) {
      followUpSentRef.current.clear()
    }
  }, [isOpen])

  /**
   * Cleanup: Clear all pending timeouts on unmount
   */
  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id))
      timeoutIdsRef.current = []
    }
  }, [])
}
