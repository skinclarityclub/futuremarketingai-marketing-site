'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { Brain, X } from 'lucide-react'
import { useChatbotStore } from '@/stores/chatbotStore'
import { MEMORY_FIELD_ORDER } from '@/lib/chatbot/memory'
import { hasMemoryConsent, saveMemory } from '@/lib/chatbot/memory-persistence'
import { FIELD_LABELS, loc } from './tool-results/MemoryCard'
import { useChatChrome } from './useChatChrome'

/**
 * The footer chip plus the sheet it toggles. The sheet is absolutely positioned
 * against the composer wrapper (ChatInput is `relative`), so it floats above the
 * composer inside the chat column and never leaves it.
 */
export function MemoryChip({ onForgotten }: { onForgotten?: () => void }) {
  const chrome = useChatChrome()
  const labels = FIELD_LABELS[loc(useLocale())]
  const profile = useChatbotStore((s) => s.memoryProfile)
  const resetMemory = useChatbotStore((s) => s.resetMemory)
  const [open, setOpen] = useState(false)
  const chipRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLElement>(null)

  const rows = MEMORY_FIELD_ORDER.filter((k) => {
    const v = profile[k]
    return v !== undefined && v !== null && String(v).trim() !== ''
  })

  const close = () => {
    setOpen(false)
    chipRef.current?.focus()
  }

  // Window capture runs before the widget's document-level Escape handler, which would
  // otherwise close the whole chat instead of just this sheet.
  useEffect(() => {
    if (!open) return
    sheetRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      close()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open])

  if (rows.length === 0) return null

  return (
    <>
      {/* 40px hit area, visually a small pill. */}
      <button
        ref={chipRef}
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="-my-2 inline-flex min-h-10 shrink-0 cursor-pointer items-center focus-visible:outline-none group/chip"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-system/40 px-2.5 py-1 text-[11px] font-medium text-accent-system transition-colors group-hover/chip:bg-accent-system/10 group-focus-visible/chip:outline-2 group-focus-visible/chip:outline-offset-2 group-focus-visible/chip:outline-accent-system">
          <Brain className="h-3 w-3" aria-hidden />
          {chrome.memoryChip(rows.length)}
        </span>
      </button>
      {open && (
        <section
          ref={sheetRef}
          tabIndex={-1}
          aria-label={chrome.memoryTitle}
          className="absolute inset-x-2 bottom-full z-10 mb-2 rounded-2xl border border-accent-system/30 bg-bg-elevated p-4 shadow-lg outline-none"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-text-primary">{chrome.memoryTitle}</h2>
            <button
              type="button"
              onClick={close}
              aria-label={chrome.closeMemory}
              className="-m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-text-secondary transition-colors hover:text-text-primary"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <dl className="mt-2 text-sm">
            {rows.map((key) => (
              <div
                key={key}
                className="flex items-baseline justify-between gap-4 border-b border-border-primary py-2"
              >
                <dt className="text-text-secondary">{labels[key]}</dt>
                <dd className="min-w-0 break-words text-right font-medium text-text-primary">
                  {chrome.memoryValue(key, profile[key])}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-[11px] leading-relaxed text-text-faint">
              {hasMemoryConsent() ? chrome.memoryNote : chrome.memoryNoteSession}
            </p>
            <button
              type="button"
              onClick={() => {
                resetMemory()
                saveMemory({})
                // The chip unmounts with the profile: drop the open state with it, or the
                // Escape listener lingers and the next capture reopens the sheet.
                setOpen(false)
                onForgotten?.()
              }}
              className="-my-2 min-h-10 shrink-0 cursor-pointer px-1 text-xs font-medium text-accent-system hover:underline"
            >
              {chrome.forgetAll}
            </button>
          </div>
        </section>
      )}
    </>
  )
}

export default MemoryChip
