'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { LogoSynapse } from '@/components/brand/logos/LogoSynapse'

interface HeaderClientProps {
  locale: string
}

// Golf 8b (2026-11-07, prototype R/golf8-nav.tpl.html): one menu "Clyde" with the six pages about
// working with him, five plain links, Log in and one amber button. The AI-scan button, the Founding
// item and the skills mega-menu left the header; the scan sits on the home and in the footer.
// Copy lives in messages/{locale}.json under header.nav and header.clydeMenu.
const CLYDE_ITEMS = [
  { key: 'week', href: '/#een-week-met-clyde' },
  { key: 'working', href: '/skills/clyde' },
  { key: 'makes', href: '/skills' },
  { key: 'clientPortal', href: '/client-portal' },
  { key: 'memory', href: '/memory' },
  { key: 'trust', href: '/trust' },
] as const

// The week section is on the Dutch home only; elsewhere the item opens the ordinary week on /how-it-works.
const WEEK_HREF_ELSEWHERE = '/how-it-works#hiw-daarna'

const CLYDE_PATHS = ['/skills', '/client-portal', '/memory', '/trust']

const NAV_LINKS = [
  { key: 'howItWorks', href: '/how-it-works' },
  { key: 'caseStudies', href: '/case-studies' },
  { key: 'pricing', href: '/pricing' },
  { key: 'kennisbank', href: '/kennisbank' },
  { key: 'about', href: '/about' },
] as const

const LOGIN_HREF = 'https://app.future-marketing.ai/login'
const HOVER_OPEN_DELAY_MS = 120
const HOVER_CLOSE_DELAY_MS = 180

export function HeaderClient({ locale }: HeaderClientProps) {
  const pathname = usePathname()
  // two locales since 2026-10-02 (routing.ts), so the switch is one link to the other one
  const otherLocale = locale === 'nl' ? 'en' : 'nl'
  const t = useTranslations('nav')
  const tHeader = useTranslations('header')

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [clydeOpen, setClydeOpen] = useState(false)

  const clydeWrapRef = useRef<HTMLDivElement | null>(null)
  const clydeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const clydeItemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const hoverOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isActive = (paths: readonly string[]) =>
    !!pathname && paths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  const clydeHref = (item: (typeof CLYDE_ITEMS)[number]) =>
    item.key === 'week' && locale !== 'nl' ? WEEK_HREF_ELSEWHERE : item.href
  const clydeActive = isActive(CLYDE_PATHS)

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close both menus on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate sync: external pathname change must close the open mobile menu
    setMobileOpen(false)
    setClydeOpen(false)
  }, [pathname])

  // Close on Escape, only attached while a menu is open
  useEffect(() => {
    if (!clydeOpen && !mobileOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setClydeOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [clydeOpen, mobileOpen])

  // Click outside closes the Clyde menu
  useEffect(() => {
    if (!clydeOpen) return
    const handleOutside = (e: MouseEvent) => {
      if (clydeWrapRef.current && !clydeWrapRef.current.contains(e.target as Node)) {
        setClydeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [clydeOpen])

  // Clear pending hover timers on unmount
  useEffect(() => {
    return () => {
      if (hoverOpenTimerRef.current) clearTimeout(hoverOpenTimerRef.current)
      if (hoverCloseTimerRef.current) clearTimeout(hoverCloseTimerRef.current)
    }
  }, [])

  const handleHoverOpen = () => {
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current)
      hoverCloseTimerRef.current = null
    }
    if (clydeOpen) return
    hoverOpenTimerRef.current = setTimeout(() => setClydeOpen(true), HOVER_OPEN_DELAY_MS)
  }

  const handleHoverClose = () => {
    if (hoverOpenTimerRef.current) {
      clearTimeout(hoverOpenTimerRef.current)
      hoverOpenTimerRef.current = null
    }
    hoverCloseTimerRef.current = setTimeout(() => setClydeOpen(false), HOVER_CLOSE_DELAY_MS)
  }

  const focusItem = (index: number) => {
    const total = CLYDE_ITEMS.length
    clydeItemRefs.current[(index + total) % total]?.focus()
  }

  const linkClass = (active: boolean) =>
    `relative py-2 px-2.5 text-[15px] whitespace-nowrap transition-colors duration-300 group/nav ${
      active ? 'text-[#f4f7fb]' : 'text-[#c4ccd8] hover:text-[#f4f7fb]'
    }`
  const underline = (active: boolean) =>
    `pointer-events-none absolute left-0 right-0 -bottom-1 h-px origin-left bg-accent-system transition-transform duration-300 ${
      active ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'
    }`
  const ctaClass =
    // no display utility here: `hidden md:inline-flex` on the bar and `flex` in the menu decide it
    'items-center justify-center whitespace-nowrap rounded-xl bg-[#f5a623] font-semibold text-[#1b1305] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(245,166,35,0.3)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg-deep/95 backdrop-blur-xl border-b border-accent-system/30 shadow-[0_8px_32px_-12px_rgba(0,212,170,0.25)]'
          : 'bg-bg-deep/80 backdrop-blur-md border-b border-border-primary'
      }`}
    >
      <nav
        className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center gap-6 2xl:gap-9"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="FutureMarketingAI home"
        >
          <LogoSynapse size={30} />
          <span className="font-display font-bold text-xl tracking-tight whitespace-nowrap">
            <span className="logo-shimmer-text">FutureMarketing</span>
            <span className="logo-ai-glow">AI</span>
          </span>
        </Link>

        {/* Desktop navigation from xl: six items, Log in and the button need ~1130px */}
        <div className="hidden xl:flex items-center gap-1">
          {/* Not `relative`: the panel positions against the fixed header and spans its full width */}
          <div
            ref={clydeWrapRef}
            onMouseEnter={handleHoverOpen}
            onMouseLeave={handleHoverClose}
            onBlur={(e) => {
              if (!clydeWrapRef.current?.contains(e.relatedTarget as Node | null)) setClydeOpen(false)
            }}
          >
            <button
              ref={clydeTriggerRef}
              type="button"
              className={`flex items-center gap-1.5 ${linkClass(clydeActive || clydeOpen)}`}
              aria-expanded={clydeOpen}
              aria-controls="clyde-menu"
              onClick={() => setClydeOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setClydeOpen(true)
                  requestAnimationFrame(() => focusItem(0))
                }
              }}
            >
              <span className="relative">
                {tHeader('nav.clyde')}
                <span className={underline(clydeActive || clydeOpen)} aria-hidden />
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${clydeOpen ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>

            {/* SSR-rendered so crawlers see the six links; `hidden` while closed means no layout */}
            <motion.div
              id="clyde-menu"
              initial={false}
              animate={clydeOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              className={`absolute left-0 right-0 top-full border-b border-white/[0.08] bg-[#0e121b] ${
                clydeOpen ? 'block' : 'hidden'
              }`}
              onKeyDown={(e) => {
                const current = clydeItemRefs.current.findIndex((el) => el === document.activeElement)
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  focusItem(current + 1)
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  focusItem(current - 1)
                } else if (e.key === 'Home') {
                  e.preventDefault()
                  focusItem(0)
                } else if (e.key === 'End') {
                  e.preventDefault()
                  focusItem(CLYDE_ITEMS.length - 1)
                } else if (e.key === 'Escape') {
                  e.preventDefault()
                  setClydeOpen(false)
                  clydeTriggerRef.current?.focus()
                }
              }}
            >
              <div className="max-w-[1440px] mx-auto px-10 pt-6 pb-7 grid grid-cols-[minmax(0,0.8fr)_repeat(2,minmax(0,1fr))] gap-x-7 gap-y-2">
                <div className="row-span-3 pr-3 border-r border-white/[0.06]">
                  <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.08em] text-[#5eead4]">
                    {tHeader('nav.clyde')}
                  </p>
                  <p className="mt-2.5 text-sm leading-[1.55] text-[#a3adbd]">
                    {tHeader('clydeMenu.intro')}
                  </p>
                </div>
                {CLYDE_ITEMS.map((item, index) => (
                  <Link
                    key={item.key}
                    href={clydeHref(item)}
                    ref={(el) => {
                      clydeItemRefs.current[index] = el
                    }}
                    onClick={() => setClydeOpen(false)}
                    className="block rounded-[10px] px-3 py-2.5 transition-colors hover:bg-white/[0.04] focus-visible:outline-2 focus-visible:outline-accent-system"
                  >
                    <span className="block text-[15px] font-semibold text-[#f4f7fb]">
                      {tHeader(`clydeMenu.items.${item.key}.title`)}
                    </span>
                    <span className="mt-[3px] block text-[13.5px] leading-[1.45] text-[#a3adbd]">
                      {tHeader(`clydeMenu.items.${item.key}.description`)}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {NAV_LINKS.map((item) => {
            const active = isActive([item.href])
            return (
              <Link key={item.key} href={item.href} className={linkClass(active)}>
                <span className="relative">
                  {tHeader(`nav.${item.key}`)}
                  <span className={underline(active)} aria-hidden />
                </span>
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-4 2xl:gap-5">
          {/* Daley 2026-11-08: the language switch lives in the bar; as a floating button it covered page content.
              The accessible name keeps the visible code in it (label in name). */}
          <Link
            href={pathname}
            locale={otherLocale}
            hrefLang={otherLocale}
            lang={otherLocale}
            aria-label={otherLocale === 'en' ? 'English (EN)' : 'Nederlands (NL)'}
            onClick={() =>
              window.gtag?.('event', 'language_switch', { from_language: locale, to_language: otherLocale })
            }
            className="inline-flex h-11 items-center px-1 text-[14px] font-semibold tracking-[0.06em] text-[#c4ccd8] hover:text-[#f4f7fb] transition-colors"
          >
            {otherLocale.toUpperCase()}
          </Link>
          <a
            href={LOGIN_HREF}
            className="hidden xl:inline text-[15px] whitespace-nowrap text-[#c4ccd8] hover:text-[#f4f7fb] transition-colors"
          >
            {t('login')}
          </a>
          <Link href="/apply" className={`hidden md:inline-flex h-[42px] px-[18px] text-[14.5px] ${ctaClass}`}>
            {t('apply')}
          </Link>
          <button
            className="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-[#f4f7fb] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)] hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden /> : <Menu className="w-5 h-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Mobile menu: the same order, Clyde's six pages always shown under his name */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="xl:hidden bg-bg-deep/98 backdrop-blur-md border-t border-border-primary overflow-hidden"
          >
            {/* Daley 2026-11-08: the button must be in view the moment the menu opens, on the smallest phone too.
                The links scroll; Log in and the button stay pinned at the foot of the panel, side by side. */}
            <div className="flex max-h-[calc(100dvh-4rem)] flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="max-w-xl mx-auto flex flex-col px-4 pt-2 pb-3">
                  <p className="px-1 py-3.5 border-b border-white/[0.06] text-base font-semibold text-[#f4f7fb]">
                    {tHeader('nav.clyde')}
                  </p>
                  {CLYDE_ITEMS.map((item, index) => (
                    <Link
                      key={item.key}
                      href={clydeHref(item)}
                      onClick={() => setMobileOpen(false)}
                      className={`py-2.5 pl-4 pr-1 text-[15px] text-[#c4ccd8] hover:text-[#f4f7fb] ${
                        index === CLYDE_ITEMS.length - 1 ? 'pb-3.5 border-b border-white/[0.06]' : ''
                      }`}
                    >
                      {tHeader(`clydeMenu.items.${item.key}.title`)}
                    </Link>
                  ))}
                  {NAV_LINKS.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActive([item.href]) ? 'page' : undefined}
                      className="px-1 py-3.5 border-b border-white/[0.06] text-base font-semibold text-[#f4f7fb]"
                    >
                      {tHeader(`nav.${item.key}`)}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="shrink-0 border-t border-white/[0.08]">
                <div className="max-w-xl mx-auto flex gap-2.5 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
                  <a
                    href={LOGIN_HREF}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl px-5 text-[15px] whitespace-nowrap text-[#c4ccd8] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]"
                  >
                    {t('login')}
                  </a>
                  <Link
                    href="/apply"
                    onClick={() => setMobileOpen(false)}
                    className={`flex h-12 min-w-0 flex-1 px-4 text-[15px] ${ctaClass}`}
                  >
                    {t('apply')}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
