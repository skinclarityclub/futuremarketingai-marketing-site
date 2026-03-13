import { useEffect, useRef, useCallback } from 'react'
import type { UIMessage } from 'ai'
import ReactMarkdown from 'react-markdown'
import { ToolResultRenderer } from './tool-results'

interface ChatMessagesProps {
  messages: UIMessage[]
  status: string
  welcomeMessage?: string
}

// ---------------------------------------------------------------------------
// MarkdownContent — renders text parts with basic markdown
// ---------------------------------------------------------------------------
function MarkdownContent({ text }: { text: string }) {
  return (
    <div className="text-sm leading-relaxed [&_a]:text-accent-system [&_a]:hover:underline [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4">
      <ReactMarkdown
        components={{
          a: ({ children, href, ...props }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TypingIndicator — three animated dots
// ---------------------------------------------------------------------------
function TypingIndicator() {
  return (
    <div className="flex justify-start" style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-border-primary bg-bg-elevated/80 px-4 py-3 backdrop-blur-md">
        <span
          className="h-2 w-2 rounded-full bg-accent-system/70"
          style={{ animation: 'chatDotBounce 0.6s ease-in-out infinite 0s' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-accent-system/70"
          style={{ animation: 'chatDotBounce 0.6s ease-in-out infinite 0.15s' }}
        />
        <span
          className="h-2 w-2 rounded-full bg-accent-system/70"
          style={{ animation: 'chatDotBounce 0.6s ease-in-out infinite 0.3s' }}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Bubble class constants
// ---------------------------------------------------------------------------
const userBubbleClass =
  'max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-md bg-gradient-to-br from-accent-human/90 to-accent-human/70 text-white text-sm'

const assistantBubbleClass =
  'max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-md bg-bg-elevated/80 backdrop-blur-md border border-border-primary text-text-primary text-sm'

// ---------------------------------------------------------------------------
// ChatMessages
// ---------------------------------------------------------------------------
export function ChatMessages({ messages, status, welcomeMessage }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const shouldAutoScroll = useRef(true)

  // Track whether user has scrolled up
  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) {
      return
    }
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    shouldAutoScroll.current = distanceFromBottom < 80
  }, [])

  // Auto-scroll on new messages
  useEffect(() => {
    if (shouldAutoScroll.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length, status])

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
    >
      {/* Welcome message when no messages yet */}
      {messages.length === 0 && welcomeMessage && (
        <div className="flex justify-start" style={{ animation: 'fadeIn 0.3s ease-in' }}>
          <div className={assistantBubbleClass}>
            <MarkdownContent text={welcomeMessage} />
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
          style={{ animation: 'fadeIn 0.3s ease-in' }}
        >
          <div className={message.role === 'user' ? userBubbleClass : assistantBubbleClass}>
            {message.parts.map((part, i) => {
              if (part.type === 'text') {
                return <MarkdownContent key={i} text={part.text} />
              }
              if ('toolName' in part) {
                return <ToolResultRenderer key={i} part={part} />
              }
              return null
            })}
          </div>
        </div>
      ))}

      {/* Typing indicator when waiting for first token */}
      {status === 'submitted' && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages
