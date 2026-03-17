import { useEffect, useRef, useCallback, useMemo } from 'react'
import type { UIMessage } from 'ai'
import ReactMarkdown from 'react-markdown'
import { ExternalLink } from 'lucide-react'
import { ToolResultRenderer, shouldUseSidePanel } from './tool-results'
import { useChatbotStore } from '../../stores/chatbotStore'

interface ChatMessagesProps {
  messages: UIMessage[]
  status: string
  welcomeMessage?: string
  flagship?: boolean
  onStartDemo?: () => void
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
// SidePanelTrigger — pure render component, shows "View details" button to open side panel
// No side effects on mount — the centralized useEffect in ChatMessages handles auto-open
// ---------------------------------------------------------------------------
function SidePanelTrigger({ toolName, data }: { toolName: string; data: unknown }) {
  const openSidePanelTrigger = useChatbotStore((s) => s.openSidePanel)

  return (
    <button
      type="button"
      onClick={() => openSidePanelTrigger(toolName, data)}
      className="my-1 inline-flex items-center gap-1.5 text-xs text-accent-system hover:underline cursor-pointer"
    >
      <ExternalLink className="h-3 w-3" />
      View details
    </button>
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
// ---------------------------------------------------------------------------
// Helper: extract the toolName from a message part (handles both static and dynamic tools)
// ---------------------------------------------------------------------------
function getToolName(part: any): string | null {
  if ('toolName' in part) {
    return part.toolName
  }
  if (typeof part.type === 'string' && part.type.startsWith('tool-')) {
    return part.type.slice(5)
  }
  return null
}

export function ChatMessages({
  messages,
  status,
  welcomeMessage,
  flagship,
  onStartDemo,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const shouldAutoScroll = useRef(true)
  const openSidePanel = useChatbotStore((s) => s.openSidePanel)

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

  // Centralized side panel auto-open: find the LAST tool result from the LAST
  // assistant message that qualifies for the side panel. This single effect
  // replaces all the individual SidePanelTrigger useEffects, eliminating the
  // race condition where previous messages' triggers would re-fire.
  const lastSidePanelTool = useMemo(() => {
    if (!flagship) {
      return null
    }
    // Walk backwards to find the last assistant message
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i]
      if (msg.role !== 'assistant') {
        continue
      }
      // Walk backwards through parts to find the last qualifying tool
      for (let j = msg.parts.length - 1; j >= 0; j--) {
        const part = msg.parts[j] as any
        const tn = getToolName(part)
        if (tn && part.state === 'output-available' && shouldUseSidePanel(tn)) {
          return { toolName: tn, data: part.output }
        }
      }
      // Only check the last assistant message
      break
    }
    return null
  }, [flagship, messages])

  useEffect(() => {
    if (lastSidePanelTool) {
      openSidePanel(lastSidePanelTool.toolName, lastSidePanelTool.data)
    }
  }, [lastSidePanelTool, openSidePanel])

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
            {onStartDemo && (
              <button
                type="button"
                onClick={onStartDemo}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-accent-system/30 bg-accent-system/10 px-3 py-1.5 text-xs font-medium text-accent-system transition-colors hover:bg-accent-system/20 cursor-pointer"
              >
                Take a guided tour
              </button>
            )}
          </div>
        </div>
      )}

      {messages.map((message) => {
        return (
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
                // AI SDK v6: dynamic tools have type 'dynamic-tool' with toolName/state
                // Static tools have type 'tool-<name>' with state but no toolName
                const toolName = getToolName(part)
                if (toolName && 'state' in part) {
                  const toolPart = part as any
                  // In flagship mode, route rich tool results to side panel
                  if (
                    flagship &&
                    toolPart.state === 'output-available' &&
                    shouldUseSidePanel(toolName)
                  ) {
                    return (
                      <SidePanelTrigger
                        key={`${message.id}-${i}`}
                        toolName={toolName}
                        data={toolPart.output}
                      />
                    )
                  }
                  return <ToolResultRenderer key={i} part={{ ...toolPart, toolName }} />
                }
                return null
              })}
            </div>
          </div>
        )
      })}

      {/* Typing indicator when waiting for first token */}
      {status === 'submitted' && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages
