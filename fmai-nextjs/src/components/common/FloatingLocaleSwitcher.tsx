'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'motion/react'

const LOCALE_FLAGS: Record<string, string> = {
  en: '\u{1F1EC}\u{1F1E7}',
  nl: '\u{1F1F3}\u{1F1F1}',
  es: '\u{1F1EA}\u{1F1F8}',
}

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  nl: 'Nederlands',
  es: 'Espa\u00f1ol',
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function FloatingLocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Escape to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLocaleChange = (newLocale: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'language_switch', {
        from_language: locale,
        to_language: newLocale,
      })
    }
    router.replace(pathname, { locale: newLocale })
    setOpen(false)
  }

  return (
    <div ref={ref} className="fixed left-4 top-20 z-40">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-bg-elevated/90 backdrop-blur-sm border border-border-primary hover:border-accent-system/30 transition-all shadow-lg"
        aria-label="Change language"
      >
        <span className="text-lg">{LOCALE_FLAGS[locale] || ''}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-2 bg-bg-elevated/98 backdrop-blur-xl border border-border-primary rounded-lg shadow-2xl py-1 min-w-[140px]"
          >
            {routing.locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full px-3 py-2 text-left text-sm font-medium transition-colors flex items-center gap-2 ${
                  locale === loc
                    ? 'text-accent-system bg-accent-system/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <span className="text-base">{LOCALE_FLAGS[loc] || ''}</span>
                <span>{LOCALE_NAMES[loc] || loc}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
