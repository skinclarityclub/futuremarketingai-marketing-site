'use client'

import { Fragment, useEffect, useRef, useCallback, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import type { UIMessage } from 'ai'
import ReactMarkdown from 'react-markdown'
import {
  Sparkles,
  Play,
  Calculator,
  Calendar,
  Pencil,
  RotateCw,
  Copy,
  Check,
  MessageCircle,
  AlertCircle,
} from 'lucide-react'
import { ToolResultRenderer, TOOL_CARD_MAP, needsInput } from './tool-results'
import { useChatbotStore } from '@/stores/chatbotStore'
import { useChatChrome } from './useChatChrome'
import type { ChatFailure } from '@/lib/chatbot/chat-error'
import { offersApplication } from '@/lib/chatbot/fit'
import { TOUR_LABEL } from './widget-copy'
import { LogoSynapse } from '@/components/brand/logos/LogoSynapse'

interface ChatMessagesProps {
  messages: UIMessage[]
  status: string
  welcomeMessage?: string
  flagship?: boolean
  onStartDemo?: () => void
  /** Prompts shown as cards in the empty-state. */
  suggestedPrompts?: string[]
  /** Triggered when user clicks an empty-state prompt-card. */
  onPromptSelect?: (prompt: string) => void
  /** Re-runs the last user message to get a different AI response. */
  onRegenerate?: () => void
  /** Restores the text of a user message into the input + trims the
   *  conversation back to that point. */
  onEditMessage?: (messageId: string, text: string) => void
  /** Prompts shown inline below the first assistant message (auto-greet state). */
  inlinePrompts?: string[]
  /** Triggered when user clicks an inline prompt chip. */
  onInlinePromptSelect?: (prompt: string) => void
  /** A failed turn, shown under the question it belongs to. */
  failure?: ChatFailure | null
  /** Resends the failed turn (offered for `failed` only; a 429 needs waiting, not retrying). */
  onRetry?: () => void
}

function extractText(msg: UIMessage): string {
  return (
    msg.parts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((p: any) => p.type === 'text')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((p: any) => p.text)
      .join('\n')
  )
}

function parseChipsFromText(text: string): string[] {
  const match = text.match(/\n*CHIPS:\s*(.+)$/m)
  if (!match) return []
  return match[1]
    .split('|')
    .map((c) => c.trim())
    .filter(Boolean)
}

/** Strip the machine-readable `CHIPS:` line (and anything after it) so copied
 *  text matches what the user actually sees in the bubble. */
function stripChipsLine(text: string): string {
  return text.replace(/\n*CHIPS:[\s\S]*$/, '').trimEnd()
}

/** Hard guarantee against em-dashes in Clyde's user-facing text. The persona
 *  prompt discourages them, but haiku still emits them in lists; this render-
 *  layer normalization replaces every em-dash (and its surrounding spaces) with
 *  a comma so the bubble — and copied text — never shows one. */
function normalizeDashes(text: string): string {
  return text.replace(/\s*—\s*/g, ', ')
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
          p: ({ children, ...props }) => {
            const text = Array.isArray(children) ? children.join('') : String(children ?? '')
            if (text.startsWith('CHIPS:')) return null
            return <p {...props}>{children}</p>
          },
        }}
      >
        {normalizeDashes(text)}
      </ReactMarkdown>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div data-typing className="flex justify-start" style={{ animation: 'fadeIn 0.3s ease-in' }}>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-border-primary bg-bg-elevated/80 px-4 py-3 backdrop-blur-md">
        <span
          className="h-1.5 w-1.5 rounded-full bg-accent-system"
          style={{ animation: 'chatDotBounce 0.9s ease-in-out infinite 0s' }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-accent-system"
          style={{ animation: 'chatDotBounce 0.9s ease-in-out infinite 0.18s' }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-accent-system"
          style={{ animation: 'chatDotBounce 0.9s ease-in-out infinite 0.36s' }}
        />
      </div>
    </div>
  )
}

const userBubbleClass =
  'max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-md bg-accent-human/[0.14] border border-accent-human/20 text-text-primary text-sm'
const assistantBubbleClass =
  'max-w-[88%] px-4 py-3 rounded-2xl rounded-tl-md bg-bg-elevated/70 border border-white/[0.06] text-text-primary text-sm'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getToolName(part: any): string | null {
  if ('toolName' in part) return part.toolName
  if (typeof part.type === 'string' && part.type.startsWith('tool-')) return part.type.slice(5)
  return null
}

// Consecutive text parts share one bubble; each tool result is its own block, in message order.
type PartGroup =
  | { kind: 'text'; texts: string[] }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { kind: 'tool'; part: any }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function groupParts(parts: any[]): PartGroup[] {
  const groups: PartGroup[] = []
  // One application card per reply: book_call and a fit offer can fire in the same step.
  let applicationShown = false
  for (const part of parts) {
    if (part.type === 'text') {
      const last = groups[groups.length - 1]
      if (last?.kind === 'text') last.texts.push(part.text)
      else groups.push({ kind: 'text', texts: [part.text] })
      continue
    }
    const toolName = getToolName(part)
    if (!toolName || !('state' in part)) continue
    // Only a finished card holds the slot: a failed book_call must not strip the real offer (Codex R1).
    if (part.state === 'output-available' && (toolName === 'book_call' || offersApplication(part.output))) {
      if (applicationShown) {
        if (toolName === 'book_call') continue
        groups.push({ kind: 'tool', part: { ...part, toolName, output: { ...part.output, offerApplication: false } } })
        continue
      }
      applicationShown = true
    }
    groups.push({ kind: 'tool', part: { ...part, toolName } })
  }
  return groups
}

/**
 * Pick an icon for a prompt based on a keyword match. Falls back to
 * Sparkles. Keeps the card surface visually scannable without forcing
 * the consumer to define icons in the prompt list.
 */
function iconForPrompt(prompt: string) {
  const p = prompt.toLowerCase()
  if (p.includes('demo') || p.includes('laat zien') || p.includes('toon')) return Play
  if (p.includes('roi') || p.includes('reken') || p.includes('bereken')) return Calculator
  if (p.includes('gesprek') || p.includes('plan') || p.includes('boek') || p.includes('book'))
    return Calendar
  return Sparkles
}

interface WelcomeStateProps {
  welcomeMessage: string
  prompts: string[]
  onSelect: (prompt: string) => void
  onStartDemo?: () => void
}

function WelcomeState({ welcomeMessage, prompts, onSelect, onStartDemo }: WelcomeStateProps) {
  const locale = useLocale()
  const tourLabel = TOUR_LABEL[locale] ?? TOUR_LABEL.nl
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-6 text-center">
      <span
        className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-system/30 bg-bg-elevated"
        style={{
          animation: 'clyde-welcome-rise 0.5s cubic-bezier(0.32, 0.72, 0, 1) both',
          boxShadow: '0 0 40px -8px rgba(0, 212, 170, 0.25)',
        }}
      >
        <LogoSynapse size={36} ariaLabel="" />
      </span>
      <div
        className="space-y-2"
        style={{
          animation: 'clyde-welcome-rise 0.5s cubic-bezier(0.32, 0.72, 0, 1) 80ms both',
        }}
      >
        <p className="text-base font-medium leading-snug text-text-primary">{welcomeMessage}</p>
        {onStartDemo && (
          <button
            type="button"
            onClick={onStartDemo}
            className="text-sm text-accent-system underline-offset-4 transition-colors hover:underline"
          >
            {tourLabel}
          </button>
        )}
      </div>
      {prompts.length > 0 && (
        <div className="grid w-full grid-cols-2 gap-2">
          {prompts.slice(0, 4).map((prompt, i) => {
            const Icon = iconForPrompt(prompt)
            return (
              <button
                key={prompt}
                type="button"
                onClick={() => onSelect(prompt)}
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-white/[0.06] bg-bg-elevated/60 px-3 py-3 text-left text-xs font-medium text-text-secondary transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-system/40 hover:bg-bg-elevated hover:text-text-primary hover:shadow-[0_8px_24px_-12px_rgba(0,212,170,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]"
                style={{
                  animation: `clyde-welcome-rise 0.5s cubic-bezier(0.32, 0.72, 0, 1) ${160 + i * 60}ms both`,
                }}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-accent-system/70 transition-colors duration-200 group-hover:text-accent-system" />
                <span className="leading-snug">{prompt}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FollowUpChips({ chips, onSelect }: { chips: string[]; onSelect: (chip: string) => void }) {
  const { askFurther } = useChatChrome()
  return (
    <div className="mt-2 ml-1 space-y-1.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-text-faint">
        {askFurther}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip, i) => (
          <button
            key={chip}
            type="button"
            onClick={() => onSelect(chip)}
            style={{ animation: `fadeIn 0.25s ease-out ${i * 70}ms both` }}
            className="rounded-full border border-accent-system/30 bg-bg-elevated/60 px-3 py-1 text-xs text-accent-system transition-colors hover:border-accent-system/60 hover:bg-accent-system/10"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const { copy, copied: copiedLabel, copyAria } = useChatChrome()
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }, [text])
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copyAria}
      className="mt-1 ml-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-text-faint opacity-0 transition-opacity duration-150 [@media(hover:none)]:opacity-100 hover:text-text-primary focus-visible:opacity-100 group-hover/msg:opacity-100"
    >
      {copied ? <Check className="h-3 w-3 text-accent-system" /> : <Copy className="h-3 w-3" />}
      {copied ? copiedLabel : copy}
    </button>
  )
}

export function ChatMessages({
  messages,
  status,
  welcomeMessage,
  flagship,
  onStartDemo,
  suggestedPrompts,
  onPromptSelect,
  onRegenerate,
  onEditMessage,
  inlinePrompts,
  onInlinePromptSelect,
  failure,
  onRetry,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const shouldAutoScroll = useRef(true)
  const sendChatMessage = useChatbotStore((s) => s.sendChatMessage)
  const chrome = useChatChrome()
  const locale = useLocale()

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    shouldAutoScroll.current = distanceFromBottom < 80
  }, [])

  useEffect(() => {
    if (shouldAutoScroll.current) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, status])

  // eslint-disable-next-line react-hooks/preserve-manual-memoization -- compiler can't unify the per-part as-any cast inside the loop; manual memoization stays correct because messages/flagship deps are sufficient
  const lastCardTool = useMemo(() => {
    if (!flagship) return null
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i]
      if (msg.role !== 'assistant') continue
      // Prefer a conversion card (pricing/case/booking/...) over the memory card
      // when both fire in one turn, so capturing a fact never steals the follow-up
      // chips from a higher-intent card. Memory only counts when it is the sole
      // card tool of the turn.
      let memoryCandidate: { toolName: string; data: unknown } | null = null
      for (let j = msg.parts.length - 1; j >= 0; j--) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const part = msg.parts[j] as any
        const tn = getToolName(part)
        if (!tn || part.state !== 'output-available') continue
        // A fit offer is the application card, so it gets book_call's chips.
        if (offersApplication(part.output)) return { toolName: 'book_call', data: part.output }
        if (!TOOL_CARD_MAP[tn] || needsInput(part.output)) continue
        if (tn === 'remember_context') {
          if (!memoryCandidate) memoryCandidate = { toolName: tn, data: part.output }
          continue
        }
        return { toolName: tn, data: part.output }
      }
      return memoryCandidate
    }
    return null
  }, [flagship, messages])

  const lastFollowUpChips = useMemo(() => {
    if (!flagship) return null
    if (status === 'submitted' || status === 'streaming') return null
    // Tool-based chips take priority
    const toolChips = lastCardTool && chrome.followups(lastCardTool.toolName)
    if (toolChips) return toolChips
    // Text-based chips fallback: parse CHIPS: line from last assistant message
    const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant')
    if (!lastAssistant) return null
    const chips = parseChipsFromText(extractText(lastAssistant))
    return chips.length > 0 ? chips : null
  }, [flagship, lastCardTool, status, messages, chrome])

  const handleFollowUp = useCallback(
    (chip: string) => {
      sendChatMessage(chip)
    },
    [sendChatMessage]
  )

  const isEmpty = messages.length === 0

  if (isEmpty && welcomeMessage) {
    return (
      <WelcomeState
        welcomeMessage={welcomeMessage}
        prompts={suggestedPrompts ?? []}
        onSelect={onPromptSelect ?? (() => {})}
        onStartDemo={onStartDemo}
      />
    )
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
    >
      {(() => {
        const lastAssistantIdx = (() => {
          for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'assistant') return i
          }
          return -1
        })()
        const isStreaming = status === 'submitted' || status === 'streaming'
        const lastUserIdx = messages.findLastIndex((m) => m.role === 'user')

        return messages.map((message, idx) => {
          const isUser = message.role === 'user'
          // Client-injected greeting and follow-ups are not model output: nothing to copy or regenerate.
          const isClientInjected = message.id.startsWith('clyde-')
          const isLastAssistant = idx === lastAssistantIdx
          const messageText = extractText(message)
          return (
            <Fragment key={message.id}>
              <div
                className={`group/msg flex ${isUser ? 'justify-end' : 'flex-col items-start'}`}
                style={{ animation: 'fadeIn 0.3s ease-in' }}
              >
                {groupParts(message.parts).map((g, gi) =>
                  g.kind === 'text' ? (
                    <div
                      key={gi}
                      className={isUser ? userBubbleClass : assistantBubbleClass}
                      data-assistant-bubble={isUser ? undefined : ''}
                    >
                      {g.texts.map((t, ti) => (
                        <MarkdownContent key={ti} text={t} />
                      ))}
                    </div>
                  ) : (
                    // Tool results sit outside the text bubble, full width of the column (board 2).
                    <div key={gi} className="w-full">
                      <ToolResultRenderer part={g.part} />
                    </div>
                  )
                )}
                {!isUser && isLastAssistant && lastFollowUpChips && (
                  <FollowUpChips chips={lastFollowUpChips} onSelect={handleFollowUp} />
                )}
                {!isUser &&
                  idx === 0 &&
                  messages.length === 1 &&
                  !isStreaming &&
                  inlinePrompts &&
                  inlinePrompts.length > 0 && (
                    <div className="mt-3 flex w-full flex-col gap-1.5">
                      {inlinePrompts.slice(0, 4).map((prompt, pi) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => onInlinePromptSelect?.(prompt)}
                          style={{ animation: `fadeIn 0.25s ease-out ${200 + pi * 70}ms both` }}
                          className="group/ip flex w-full items-center gap-2 rounded-xl border border-white/[0.06] bg-bg-elevated/60 min-h-10 px-3 py-2 text-left text-sm font-medium text-text-secondary transition-all hover:border-accent-system/30 hover:bg-bg-elevated hover:text-text-primary"
                        >
                          <MessageCircle className="h-3 w-3 shrink-0 text-accent-system/60 transition-colors group-hover/ip:text-accent-system" />
                          {prompt}
                        </button>
                      ))}
                      {onStartDemo && (
                        <button
                          type="button"
                          onClick={onStartDemo}
                          className="self-start px-1 text-xs text-accent-system underline-offset-4 hover:underline"
                        >
                          {TOUR_LABEL[locale] ?? TOUR_LABEL.nl}
                        </button>
                      )}
                    </div>
                  )}
                {!isUser && messageText.length > 0 && !isClientInjected && (
                  <CopyButton text={normalizeDashes(stripChipsLine(messageText))} />
                )}
                {isUser && onEditMessage && messageText.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onEditMessage(message.id, messageText)}
                    aria-label={chrome.editAria}
                    className="mt-1 mr-1 inline-flex items-center gap-1 self-end rounded-md px-1.5 py-0.5 text-[11px] text-text-faint opacity-0 transition-opacity duration-150 [@media(hover:none)]:opacity-100 hover:text-text-primary focus-visible:opacity-100 group-hover/msg:opacity-100"
                  >
                    <Pencil className="h-3 w-3" />
                    {chrome.edit}
                  </button>
                )}
                {!isUser &&
                  isLastAssistant &&
                  onRegenerate &&
                  !isStreaming &&
                  !isClientInjected &&
                  !failure && (
                    <button
                      type="button"
                      onClick={onRegenerate}
                      aria-label={chrome.regenerateAria}
                      className="mt-1 ml-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-text-faint opacity-0 transition-opacity duration-150 [@media(hover:none)]:opacity-100 hover:text-accent-system focus-visible:opacity-100 group-hover/msg:opacity-100"
                    >
                      <RotateCw className="h-3 w-3" />
                      {chrome.regenerate}
                    </button>
                  )}
              </div>
              {isUser && idx === lastUserIdx && failure && !isStreaming && (
                <p
                  role="status"
                  className="-mt-2 mr-1 flex items-center justify-end gap-1.5 text-xs text-error"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {failure.kind === 'rate-limit' ? (
                    chrome.rateLimited(failure.minutes)
                  ) : failure.kind === 'rejected' ? (
                    failure.reason === 'personal' ? (
                      chrome.rejectedPersonal
                    ) : (
                      chrome.rejectedTooLong
                    )
                  ) : (
                    <>
                      <span>{chrome.noAnswer}</span>
                      {onRetry && (
                        <>
                          <span aria-hidden="true">·</span>
                          <button
                            type="button"
                            onClick={onRetry}
                            // 40px hit area via padding, pulled back with negative margin so the line looks the same
                            className="-my-3 -mx-2 px-2 py-3 font-medium text-accent-system hover:underline"
                          >
                            {chrome.retry}
                          </button>
                        </>
                      )}
                    </>
                  )}
                </p>
              )}
            </Fragment>
          )
        })
      })()}
      {status === 'submitted' && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages
