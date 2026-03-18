'use client'

import { useState, useRef, useCallback } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) {
      return
    }
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)
      autoResize()
    },
    [autoResize]
  )

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || disabled) {
      return
    }
    onSend(trimmed)
    setInput('')
    // Reset textarea height after clearing
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [input, disabled, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const canSend = input.trim().length > 0 && !disabled

  return (
    <div className="border-t border-border-primary bg-bg-surface/95 px-4 py-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Type a message"
          className="w-full resize-none rounded-xl border border-border-primary bg-bg-elevated/50 px-4 py-2.5 text-sm text-text-primary transition-colors placeholder:text-text-secondary/50 focus:border-accent-system/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          style={{ maxHeight: '120px' }}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-accent-system transition-colors hover:text-accent-system/80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default ChatInput
