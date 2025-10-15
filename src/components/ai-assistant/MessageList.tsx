/**
 * Message List
 *
 * Displays conversation history with rich message support and auto-scroll
 */

import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '../../stores/chatStore'
import { useJourneyStore } from '../../stores/journeyStore'
import { usePersonalizationStore } from '../../stores/personalizationStore'
import SystemMessage from './SystemMessage'
import UserMessage from './UserMessage'
import TypingIndicator from './TypingIndicator'
import RichCard from './messages/RichCard'
import Carousel from './messages/Carousel'
import QuickReplies from './messages/QuickReplies'
import AchievementCard from './messages/AchievementCard'
import NavigationAction from './NavigationAction'
import CalendlyBooking from './messages/CalendlyBooking'
import type { ChatMessage } from '../../types/chat'
import type { NavigationActionData } from './NavigationAction'
import {
  isTextMessage,
  isCardMessage,
  isCarouselMessage,
  isQuickRepliesMessage,
  isAchievementMessage,
  isNavigationMessage,
  isDemoInviteMessage,
} from '../../types/chat'
import { generateResponse, type ConversationContext } from '../../utils/conversationEngine'

interface MessageListProps {
  onOpenInfoPanel?: (action: NavigationActionData) => void
}

export default function MessageList({ onOpenInfoPanel }: MessageListProps) {
  const { t } = useTranslation(['common'])
  const {
    messages,
    isTyping,
    addUserMessage,
    addSystemMessage,
    addQuickRepliesMessage,
    addNavigationMessage,
    setTyping,
  } = useChatStore()
  const { completedSteps, timeOnSite } = useJourneyStore()
  const { selectedIndustry, icpScore } = usePersonalizationStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleOpenInfoPanel = (action: NavigationActionData) => {
    if (onOpenInfoPanel) {
      onOpenInfoPanel(action)
    }
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Announce new messages to screen readers
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.sender === 'system' && isTextMessage(lastMessage)) {
        // Create a live region announcement
        const announcement = document.createElement('div')
        announcement.setAttribute('role', 'status')
        announcement.setAttribute('aria-live', 'polite')
        announcement.className = 'sr-only'
        announcement.textContent = `Nieuw bericht: ${lastMessage.content}`
        document.body.appendChild(announcement)

        setTimeout(() => {
          document.body.removeChild(announcement)
        }, 1000)
      }
    }
  }, [messages])

  // Build conversation context
  const buildContext = (): ConversationContext => ({
    industryId: selectedIndustry?.id || null,
    icpScore: (icpScore && icpScore.overall) || 0,
    modulesExplored: completedSteps?.length || 0,
    timeOnSite: timeOnSite || 0,
    calculatorCompleted: false,
    messagesCount: messages?.length || 0,
  })

  // Calculate realistic typing delay based on message length
  const calculateTypingDelay = (messageLength: number): number => {
    // Base delay: 800ms
    // + 20ms per character (simulates reading/thinking)
    // + random variation (200-500ms)
    const baseDelay = 800
    const characterDelay = messageLength * 20
    const randomVariation = 200 + Math.random() * 300

    // Cap at 3000ms to avoid feeling slow
    return Math.min(baseDelay + characterDelay + randomVariation, 3000)
  }

  // Handle action clicks from rich messages
  const handleAction = async (
    actionOrReply: string | { label: string; value: string; icon?: string }
  ) => {
    // Extract label and value
    const displayText = typeof actionOrReply === 'string' ? actionOrReply : actionOrReply.label

    const intentValue = typeof actionOrReply === 'string' ? actionOrReply : actionOrReply.value

    // Add user message with the label (what they see/clicked)
    addUserMessage(displayText)

    // Show typing indicator
    setTyping(true)

    try {
      // Build context for response generation
      const context = buildContext()

      // Generate intelligent response using the intent value
      const response = await generateResponse(intentValue, context, messages)

      // Check if response is valid
      if (!response || !response.content) {
        throw new Error('Invalid response from generateResponse')
      }

      // Calculate realistic delay
      const delay = calculateTypingDelay(response.content.length)

      // Simulate AI response after delay
      setTimeout(() => {
        setTyping(false)

        // Add response based on type
        if (response.type === 'navigation' && response.navigationData) {
          addNavigationMessage(response.content, response.navigationData)
        } else if (response.type === 'quick-replies' && response.replies) {
          addQuickRepliesMessage(response.content, response.replies)
        } else if (response.suggestedActions) {
          addSystemMessage(response.content, response.suggestedActions)
        } else {
          addSystemMessage(response.content)
        }
      }, delay)
    } catch (error) {
      // Error handling: always stop typing
      console.error('Response generation error:', error)
      setTimeout(() => {
        setTyping(false)
        addSystemMessage('Interessant! Wat wil je nog meer weten?', [
          'Verken verder',
          'Stel een vraag',
          'Plan demo',
        ])
      }, 1000)
    }
  }

  // Render individual message based on type
  const renderMessage = (message: ChatMessage) => {
    // User messages
    if (message.sender === 'user' && isTextMessage(message)) {
      return <UserMessage key={message.id} content={message.content} />
    }

    // Text messages (system)
    if (isTextMessage(message)) {
      return (
        <div key={message.id} className="space-y-2">
          <SystemMessage
            messageId={message.id}
            content={message.content}
            reaction={message.reaction}
          />
          {message.suggestedActions && message.suggestedActions.length > 0 && (
            <QuickReplies
              replies={message.suggestedActions.map((action) => ({
                label: action,
                value: action,
                icon: action.includes('Calculator')
                  ? 'calculator'
                  : action.includes('demo')
                    ? 'calendar'
                    : action.includes('platform')
                      ? 'sparkles'
                      : undefined,
              }))}
              onSelect={handleAction}
            />
          )}
        </div>
      )
    }

    // Rich card messages
    if (isCardMessage(message)) {
      return (
        <div key={message.id} className="space-y-3">
          <SystemMessage
            messageId={message.id}
            content={message.content}
            reaction={message.reaction}
          />
          <RichCard card={message.card} onAction={handleAction} />
        </div>
      )
    }

    // Carousel messages
    if (isCarouselMessage(message)) {
      return (
        <div key={message.id} className="space-y-3">
          <SystemMessage
            messageId={message.id}
            content={message.content}
            reaction={message.reaction}
          />
          <Carousel cards={message.cards} onAction={handleAction} />
        </div>
      )
    }

    // Quick replies messages
    if (isQuickRepliesMessage(message)) {
      return (
        <div key={message.id} className="space-y-2">
          <SystemMessage
            messageId={message.id}
            content={message.content}
            reaction={message.reaction}
          />
          {/* Now using fancy version - data flow is confirmed working */}
          <QuickReplies replies={message.replies} onSelect={handleAction} />
        </div>
      )
    }

    // Achievement messages
    if (isAchievementMessage(message)) {
      return (
        <AchievementCard
          key={message.id}
          title={message.title}
          description={message.description}
          icon={message.icon}
          points={message.points}
        />
      )
    }

    // Navigation messages
    if (isNavigationMessage(message)) {
      return (
        <div key={message.id} className="space-y-2">
          {message.content && (
            <SystemMessage
              messageId={message.id}
              content={message.content}
              reaction={message.reaction}
            />
          )}
          <NavigationAction
            action={message.navigationData}
            onOpenInfo={() => handleOpenInfoPanel(message.navigationData)}
          />
        </div>
      )
    }

    // Calendly booking (demo-invite) messages
    if (isDemoInviteMessage(message)) {
      return (
        <CalendlyBooking
          key={message.id}
          content={message.content}
          prefillData={message.prefillData}
          ctaText={message.ctaText}
          secondaryCtaText={message.secondaryCtaText}
        />
      )
    }

    return null
  }

  return (
    <div
      ref={containerRef}
      className="h-full p-4 space-y-4 overflow-y-auto"
      role="log"
      aria-label={t('common:accessibility.messages_list')}
    >
      <AnimatePresence initial={false}>{messages.map(renderMessage)}</AnimatePresence>

      {/* Typing Indicator */}
      {isTyping && <TypingIndicator />}

      {/* Empty State */}
      {messages.length === 0 && !isTyping && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">👋</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            ✨ Welkom bij FutureMarketingAI!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ik ben ARIA, jouw persoonlijke demo gids. Waar kan ik je mee helpen?
          </p>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  )
}
