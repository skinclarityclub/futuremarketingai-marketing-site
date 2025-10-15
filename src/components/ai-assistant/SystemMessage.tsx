/**
 * System Message Component
 *
 * Displays messages from the AI assistant with Markdown support
 * and optional feedback reactions (helpful/not helpful)
 */

import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { messageFadeIn } from './styles/animations'
import { glassCard } from './styles/glassmorphism'
import { useChatStore } from '../../stores/chatStore'
import { trackGA4Event } from '../../utils/ga4'

interface SystemMessageProps {
  messageId: string
  content: string
  reaction?: 'helpful' | 'not-helpful' | null
}

function SystemMessage({ messageId, content, reaction: initialReaction }: SystemMessageProps) {
  const { t } = useTranslation(['common'])
  const [reaction, setReaction] = useState<'helpful' | 'not-helpful' | null>(
    initialReaction || null
  )
  const { setMessageReaction } = useChatStore()

  const handleReaction = (type: 'helpful' | 'not-helpful') => {
    // Toggle: if same reaction, remove it
    const newReaction = reaction === type ? null : type

    setReaction(newReaction)
    setMessageReaction(messageId, newReaction)

    // Track reaction in analytics
    trackGA4Event('message_reaction', {
      event_category: 'chat',
      event_label: newReaction || 'removed',
      message_id: messageId,
      message_preview: content.slice(0, 100),
      reaction_type: newReaction,
    })

    console.log(`📊 Message reaction: ${newReaction || 'removed'} for message ${messageId}`)
  }
  return (
    <motion.div
      variants={messageFadeIn}
      initial="hidden"
      animate="visible"
      className="flex gap-3 items-start"
    >
      {/* Avatar */}
      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
        AI
      </div>

      {/* Message Content with Markdown Support */}
      <div className={`${glassCard} px-4 py-3 max-w-[85%]`}>
        <div
          className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed prose prose-sm max-w-none
            prose-p:my-1 prose-p:leading-relaxed
            prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-em:italic
            prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
            prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4
            prose-li:my-0.5
            prose-headings:font-bold prose-headings:mt-3 prose-headings:mb-1
            prose-h1:text-lg prose-h2:text-base prose-h3:text-sm"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
        </div>

        {/* Reaction Buttons */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleReaction('helpful')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              transition-all duration-200
              ${
                reaction === 'helpful'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'text-gray-400 hover:hover:text-gray-300 border border-white/10'
              }
            `}
            aria-label={t('common:accessibility.helpful')}
            aria-pressed={reaction === 'helpful'}
          >
            <ThumbsUp size={14} />
            <span>
              {t('common:calendly.helpful')}
              {reaction === 'helpful' && <span className="ml-1">✓</span>}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleReaction('not-helpful')}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              transition-all duration-200
              ${
                reaction === 'not-helpful'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'text-gray-400 hover:hover:text-gray-300 border border-white/10'
              }
            `}
            aria-label={t('common:accessibility.not_helpful')}
            aria-pressed={reaction === 'not-helpful'}
          >
            <ThumbsDown size={14} />
            <span>
              {t('common:calendly.not_helpful')}
              {reaction === 'not-helpful' && <span className="ml-1">✓</span>}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Memoize to prevent unnecessary re-renders when other messages update
export default memo(SystemMessage)
