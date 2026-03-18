'use client'

import { useEffect, useRef, useCallback, useMemo } from 'react'
import type { UIMessage } from 'ai'
import ReactMarkdown from 'react-markdown'
import { ExternalLink } from 'lucide-react'
import { ToolResultRenderer, shouldUseSidePanel } from './tool-results'
import { useChatbotStore } from '@/stores/chatbotStore'

interface ChatMessagesProps {
  messages: UIMessage[]
  status: string
  welcomeMessage?: string
  flagship?: boolean
  onStartDemo?: () => void
}

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

const userBubbleClass =
  'max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-md bg-gradient-to-br from-accent-human/90 to-accent-human/70 text-white text-sm'
const assistantBubbleClass =
  'max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-md bg-bg-elevated/80 backdrop-blur-md border border-border-primary text-text-primary text-sm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getToolName(part: any): string | null {
  if ('toolName' in part) return part.toolName
  if (typeof part.type === 'string' && part.type.startsWith('tool-')) return part.type.slice(5)
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

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    shouldAutoScroll.current = distanceFromBottom < 80
  }, [])

  useEffect(() => {
    if (shouldAutoScroll.current) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, status])

  const lastSidePanelTool = useMemo(() => {
    if (!flagship) return null
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i]
      if (msg.role !== 'assistant') continue
      for (let j = msg.parts.length - 1; j >= 0; j--) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const part = msg.parts[j] as any
        const tn = getToolName(part)
        if (tn && part.state === 'output-available' && shouldUseSidePanel(tn))
          return { toolName: tn, data: part.output }
      }
      break
    }
    return null
  }, [flagship, messages])

  useEffect(() => {
    if (lastSidePanelTool) openSidePanel(lastSidePanelTool.toolName, lastSidePanelTool.data)
  }, [lastSidePanelTool, openSidePanel])

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
    >
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
      {messages.map((message) => (
        <div
          key={message.id}
          className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
          style={{ animation: 'fadeIn 0.3s ease-in' }}
        >
          <div className={message.role === 'user' ? userBubbleClass : assistantBubbleClass}>
            {message.parts.map((part, i) => {
              if (part.type === 'text') return <MarkdownContent key={i} text={part.text} />
              const toolName = getToolName(part)
              if (toolName && 'state' in part) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const toolPart = part as any
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
      ))}
      {status === 'submitted' && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages
