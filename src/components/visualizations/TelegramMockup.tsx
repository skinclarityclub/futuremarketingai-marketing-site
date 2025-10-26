import React from 'react'
import { motion } from 'framer-motion'

/**
 * TelegramMockup - Telegram-style chat UI for content approval
 *
 * Shows a mockup of the Telegram approval system with:
 * - Telegram-branded chat interface
 * - Content preview (caption + hashtags)
 * - Approve/Reject buttons
 * - Learning feedback indicator
 */

export interface TelegramMockupProps {
  contentType?: 'post' | 'reel' | 'story'
  sampleContent?: {
    caption: string
    hashtags: string[]
    platform: string
  }
  onApprove?: () => void
  onReject?: () => void
}

export const TelegramMockup: React.FC<TelegramMockupProps> = ({
  contentType = 'post',
  sampleContent = {
    caption:
      'Ontdek onze nieuwe collectie! 🌟 Premium kwaliteit voor de beste prijs. Link in bio voor meer info.',
    hashtags: ['fashion', 'trending', 'style', 'newcollection'],
    platform: 'Instagram',
  },
  onApprove,
  onReject,
}) => {
  const [approved, setApproved] = React.useState<boolean | null>(null)
  const [showLearning, setShowLearning] = React.useState(false)

  const handleApprove = () => {
    setApproved(true)
    setShowLearning(true)
    setTimeout(() => setShowLearning(false), 3000)
    onApprove?.()
  }

  const handleReject = () => {
    setApproved(false)
    setShowLearning(true)
    setTimeout(() => setShowLearning(false), 3000)
    onReject?.()
  }

  return (
    <div className="telegram-mockup max-w-md mx-auto">
      {/* Telegram Header */}
      <motion.div
        className="bg-[#0088cc] text-white p-4 rounded-t-2xl flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl">
          🤖
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg">Marketing AI Bot</div>
          <div className="text-xs text-white/80">Content Approval System</div>
        </div>
        <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
      </motion.div>

      {/* Chat Message Container */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-4 min-h-[300px] rounded-b-2xl">
        {/* Bot Message */}
        <motion.div
          className="bg-gray-800 rounded-2xl rounded-tl-none p-4 shadow-lg mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Meta Info */}
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
            <span className="font-semibold">{sampleContent.platform}</span>
            <span>•</span>
            <span className="capitalize">{contentType}</span>
            <span>•</span>
            <span className="text-accent-primary">Ready for Review</span>
          </div>

          {/* Content Preview */}
          <div className="mb-4">
            <div className="text-gray-200 mb-3 leading-relaxed">
              {sampleContent.caption}
            </div>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2">
              {sampleContent.hashtags.map((tag, index) => (
                <motion.span
                  key={tag}
                  className="text-sm text-accent-primary font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="w-full h-32 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center text-gray-400">
              <svg
                className="w-12 h-12 mx-auto mb-2 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">Product Image Preview</span>
            </div>
          </div>

          {/* Action Buttons */}
          {approved === null ? (
            <div className="flex gap-3">
              <motion.button
                onClick={handleReject}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">❌</span>
                <span>Reject</span>
              </motion.button>

              <motion.button
                onClick={handleApprove}
                className="flex-1 py-3 px-4 rounded-xl bg-success hover:bg-success/90 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-success/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">✅</span>
                <span>Approve</span>
              </motion.button>
            </div>
          ) : (
            <motion.div
              className={`py-3 px-4 rounded-xl text-center font-semibold ${
                approved
                  ? 'bg-success/20 text-success border border-success/30'
                  : 'bg-red-500/20 text-red-500 border border-red-500/30'
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {approved ? '✅ Content Approved!' : '❌ Content Rejected'}
            </motion.div>
          )}
        </motion.div>

        {/* AI Learning Indicator */}
        {showLearning && (
          <motion.div
            className="bg-accent-primary/10 border border-accent-primary/30 rounded-xl p-3 flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
              <motion.div
                className="w-4 h-4 rounded-full bg-accent-primary"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-accent-primary">AI Learning...</div>
              <div className="text-xs text-gray-400">
                Processing your feedback to improve future content
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Footer */}
        <motion.div
          className="mt-4 text-center text-xs text-gray-400 space-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div>⚡ Avg. Review Time: 2.3 minutes</div>
          <div>📈 AI Accuracy Improved: +89% over 30 days</div>
        </motion.div>
      </div>
    </div>
  )
}

export default TelegramMockup
