import { useEffect, useRef } from 'react'
import type { TranscriptMessage } from '../../hooks/useElevenLabsCall'
import { cn } from '../../lib/utils'

interface CallTranscriptProps {
  messages: TranscriptMessage[]
  className?: string
}

export function CallTranscript({ messages, className }: CallTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  if (messages.length === 0) {
    return null
  }

  return (
    <div
      ref={scrollRef}
      className={cn('flex-1 overflow-y-auto space-y-2 px-3 py-2 scrollbar-hide', className)}
      role="log"
      aria-live="polite"
      aria-label="Call transcript"
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            'max-w-[85%] px-3 py-1.5 rounded-lg text-xs leading-relaxed',
            msg.role === 'user'
              ? 'ml-auto bg-accent-system/15 text-text-primary'
              : 'mr-auto bg-bg-elevated text-text-secondary'
          )}
        >
          {msg.text}
        </div>
      ))}
    </div>
  )
}
