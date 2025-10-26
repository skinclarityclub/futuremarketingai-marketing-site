/**
 * Proactive Suggestions Component
 *
 * Displays context-aware question suggestions to encourage engagement
 * Appears after key moments in the journey (2 min idle, 3 modules viewed, etc.)
 */

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useChatStore } from '../../stores/chatStore'
import { useJourneyStore } from '../../stores/journeyStore'
import { usePersonalizationStore } from '../../stores/personalizationStore'
import { getProactiveSuggestions } from '../../utils/questionMatcher'

interface ProactiveSuggestionsProps {
  onQuestionClick: (question: string) => void
}

function ProactiveSuggestions({ onQuestionClick }: ProactiveSuggestionsProps) {
  const { messages } = useChatStore()
  const { modulesViewedCount, currentPage } = useJourneyStore()
  const { selectedIndustry, icpScore } = usePersonalizationStore()

  // Get proactive suggestions based on context
  const suggestions = getProactiveSuggestions({
    currentPage,
    modulesViewed: modulesViewedCount,
    industry: selectedIndustry?.id,
    icpScore: icpScore?.total, // Extract total score from ICPScoreBreakdown
  })

  // Only show if chat has some history but not too many messages
  if (messages.length < 2 || messages.length > 10) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 py-3 bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border-t border-blue-900/30"
    >
      <div className="flex items-start gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs font-medium text-blue-100">
          Misschien interessant:
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onQuestionClick(suggestion)}
            className="
              px-3 py-1.5 rounded-lg text-xs
              bg-gray-800
              text-blue-300
              border border-blue-800
              hover:bg-blue-900/30
              transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            "
            type="button"
            aria-label={`Ask: ${suggestion}`}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// Memoize to prevent unnecessary re-renders on every message change
export default memo(ProactiveSuggestions)
