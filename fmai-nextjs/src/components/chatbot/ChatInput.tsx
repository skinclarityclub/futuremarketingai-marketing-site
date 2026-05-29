'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { ArrowUp, Square } from 'lucide-react'
import { useChatChrome } from './useChatChrome'

interface ChatInputProps {
  onSend: (text: string) => void
  onStop?: () => void
  disabled?: boolean
  isLoading?: boolean
  placeholder?: string
  /** Optional initial text (used by edit-message flow). */
  initialText?: string
}

/**
 * ChatInput -- SOTA chat input following 2026 premium-AI patterns:
 *
 *   - Auto-resizing textarea (max 140px before scroll)
 *   - Enter to send, Shift+Enter for newline, Cmd/Ctrl+Enter also sends
 *   - aria-disabled (not `disabled` attribute) so screen-readers still
 *     announce the button and explain why it's inactive
 *   - Send-button is a solid teal CTA when canSend (recognisable
 *     affordance, not a faint icon-only ghost)
 *   - Loading state: send-icon swaps to a spinner; input stays focusable
 *     for editing but submission is blocked
 *   - No always-on border on the textarea -- subtle teal ring on focus
 *     only, so the input stays calm at rest
 *   - Dutch ARIA labels (site is NL-first)
 */
export function ChatInput({
  onSend,
  onStop,
  disabled = false,
  isLoading = false,
  placeholder = 'Typ een bericht...',
  initialText,
}: ChatInputProps) {
  const [input, setInput] = useState(initialText ?? '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { inputSend, inputNewline } = useChatChrome()

  // External edit-flow can push a value into the input. Replace the
  // current text (we don't merge -- the consumer owns the intent) and
  // focus the textarea so the user can keep typing.
  useEffect(() => {
    if (initialText === undefined) return
    setInput(initialText)
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(initialText.length, initialText.length)
    })
  }, [initialText])

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [])

  useEffect(() => {
    autoResize()
  }, [input, autoResize])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value),
    []
  )

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || disabled || isLoading) return
    onSend(trimmed)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [input, disabled, isLoading, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter (without shift) sends; Shift+Enter inserts newline
      // Cmd/Ctrl+Enter also sends (matches ChatGPT/Claude conventions)
      const submitCombo =
        (e.key === 'Enter' && !e.shiftKey) ||
        (e.key === 'Enter' && (e.metaKey || e.ctrlKey))
      if (submitCombo) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const canSend = input.trim().length > 0 && !disabled && !isLoading
  const isInactive = !canSend

  return (
    <div className="border-t border-border-primary bg-bg-surface/95 px-4 py-3">
      <div className="group/input relative flex items-end gap-2 rounded-2xl border border-transparent bg-bg-elevated/60 px-2 py-1 transition-all duration-200 focus-within:border-accent-system/40 focus-within:bg-bg-elevated/85 focus-within:shadow-[0_0_0_3px_rgba(0,212,170,0.08)]">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Typ een bericht voor Clyde"
          className="w-full resize-none bg-transparent px-3 py-2 text-sm leading-relaxed text-text-primary outline-none placeholder:text-text-quiet disabled:cursor-not-allowed disabled:opacity-50"
        />
        {isLoading && onStop ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generatie"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-bg-elevated text-text-primary shadow-sm transition-all duration-200 hover:bg-error/15 hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSend}
            aria-disabled={isInactive}
            aria-label={isLoading ? 'Clyde antwoordt...' : 'Verstuur bericht'}
            tabIndex={isInactive ? -1 : 0}
            className={
              isInactive
                ? 'flex h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-xl bg-bg-elevated text-text-faint transition-all duration-200'
                : 'flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-accent-system text-bg-deep shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-[var(--shadow-glow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system'
            }
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between px-2 text-[10px] text-text-faint">
        <span>
          <kbd className="rounded bg-bg-elevated px-1 py-0.5 font-mono">Enter</kbd> {inputSend} ·{' '}
          <kbd className="rounded bg-bg-elevated px-1 py-0.5 font-mono">Shift+Enter</kbd> {inputNewline}
        </span>
      </div>
    </div>
  )
}

export default ChatInput
