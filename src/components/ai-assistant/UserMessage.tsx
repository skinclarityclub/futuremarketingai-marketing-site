/**
 * User Message Component
 *
 * Displays messages sent by the user with Markdown support
 */

import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { messageFadeIn } from './styles/animations'

interface UserMessageProps {
  content: string
}

export default function UserMessage({ content }: UserMessageProps) {
  return (
    <motion.div
      variants={messageFadeIn}
      initial="hidden"
      animate="visible"
      className="flex justify-end"
    >
      {/* Message Content with Markdown Support */}
      <div className="max-w-[85%] px-4 py-3 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl rounded-br-md">
        <div
          className="text-sm leading-relaxed prose prose-sm max-w-none prose-invert
          prose-p:my-1 prose-p:leading-relaxed
          prose-strong:font-bold prose-strong:text-white
          prose-em:italic
          prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
          prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4
          prose-li:my-0.5"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  )
}
