/**
 * Chat Input
 *
 * Input field for user messages with send button
 */

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '../../stores/chatStore'
import { useJourneyStore } from '../../stores/journeyStore'
import { usePersonalizationStore } from '../../stores/personalizationStore'
import { glassHeaderFooter, glassInput } from './styles/glassmorphism'
import { generateResponse, type ConversationContext } from '../../utils/conversationEngine'

export default function ChatInput() {
  const { t } = useTranslation('ai-assistant')
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const {
    messages,
    addUserMessage,
    setTyping,
    addSystemMessage,
    addQuickRepliesMessage,
    addNavigationMessage,
    addCalendlyBookingMessage,
  } = useChatStore()
  const { completedSteps, timeOnSite } = useJourneyStore()
  const { selectedIndustry, icpScore, userJourney } = usePersonalizationStore()

  // Auto-focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) {
      return
    }

    const userInput = input.trim()

    // Add user message
    addUserMessage(userInput)
    setInput('')

    // Show typing indicator with initial activity
    setTyping(true, 'thinking')

    // Build conversation context
    const context: ConversationContext = {
      industryId: selectedIndustry?.id || null,
      icpScore: (icpScore && icpScore.overall) || 0,
      modulesExplored: completedSteps?.length || 0,
      timeOnSite: timeOnSite || 0,
      calculatorCompleted: false,
      messagesCount: messages?.length || 0,
      lastViewedModules: userJourney?.viewedModules || [],
    }

    try {
      // Check if this looks like a question - if so, show "searching"
      const isQuestion =
        userInput.match(/^(wie|wat|waar|wanneer|waarom|hoe|kan|is)\s/i) || userInput.endsWith('?')
      if (isQuestion) {
        setTyping(true, 'searching')
      }

      // Generate intelligent response (now async with LLM)
      const response = await generateResponse(userInput, context, messages)

      // If we're using LLM (for complex queries), show "generating"
      if (response && response.content.length > 200) {
        setTyping(true, 'generating')
      }

      // Check if response is valid
      if (!response || !response.content) {
        throw new Error('Invalid response from generateResponse')
      }

      // Calculate realistic typing delay (optimized for speed)
      const baseDelay = 200 // Reduced from 800ms
      const characterDelay = response.content.length * 2 // Reduced from 20ms to 2ms per char
      const randomVariation = 50 + Math.random() * 100 // Reduced from 200-500ms to 50-150ms
      const delay = Math.min(baseDelay + characterDelay + randomVariation, 500) // Max 500ms instead of 3000ms

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
      }, delay)
    } catch (error) {
      // Error handling: always stop typing and provide fallback
      console.error('Response generation error:', error)
      setTimeout(() => {
        setTyping(false)
        addSystemMessage('Interessant! Kan je me daar wat meer over vertellen?', [
          'Wat kan dit platform?',
          'Bereken ROI',
          'Plan demo',
        ])
      }, 1000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (but not Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${glassHeaderFooter} p-4 border-t shrink-0`}>
      <div className="flex gap-2 items-end">
        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('inputPlaceholder')}
            rows={1}
            className={`
              ${glassInput}
              w-full px-4 py-3 pr-12
              rounded-xl resize-none
              text-sm text-white
              placeholder:text-gray-400
              focus:outline-none
              scrollbar-hide overflow-y-auto
            `}
            aria-label={t('inputPlaceholder')}
            maxLength={500}
          />

          {/* Character count (when approaching limit) */}
          {input.length > 400 && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {input.length}/500
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim()}
          className={`
            shrink-0 w-10 h-10
            bg-gradient-to-br from-purple-600 to-blue-600
            hover:from-purple-500 hover:to-blue-500
            disabled:from-gray-400 disabled:to-gray-500
            disabled:cursor-not-allowed
            text-white rounded-xl
            flex items-center justify-center
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-purple-400/50
          `}
          aria-label={t('send')}
        >
          <Send size={18} />
        </button>
      </div>

      {/* Helper text */}
      <p className="mt-2 text-xs text-gray-400">
        {t('pressEnter', { key: 'Enter' })}
      </p>
    </form>
  )
}
