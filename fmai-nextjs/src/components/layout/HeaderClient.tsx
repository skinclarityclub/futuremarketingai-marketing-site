'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  Bot,
  Share2,
  Megaphone,
  BarChart3,
  Mail,
  MessageSquare,
  MessageCircle,
  BookOpen,
  Clapperboard,
  Phone,
  Search,
  Globe,
  ArrowRight,
  Sparkles,
  Tag,
  Crown,
  Gauge,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { LogoSynapse } from '@/components/brand/logos/LogoSynapse'
import { getSkillBySlug } from '@/lib/skills-data'
import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL } from '@/lib/constants'

interface HeaderClientProps {
  locale: string
}

// Structural metadata only — copy lives in messages/{locale}.json under header.skills.*
const SKILL_CATEGORIES = [
  {
    key: 'create',
    items: [
      { key: 'socialMedia', icon: Share2, href: '/skills/social-media' as const },
      { key: 'blogFactory', icon: BookOpen, href: '/skills/blog-factory' as const },
      { key: 'adCreator', icon: Megaphone, href: '/skills/ad-manager' as const },
      { key: 'reelBuilder', icon: Clapperboard, href: '/skills/reel-builder' as const },
    ],
  },
  {
    key: 'engage',
    items: [
      { key: 'leadQualifier', icon: MessageSquare, href: '/skills/lead-qualifier' as const },
      { key: 'emailManagement', icon: Mail, href: '/skills/email-management' as const },
      { key: 'manychat', icon: MessageCircle, href: '/skills/manychat' as const },
      // Voice Agent staat coming_soon → onderaan zodat live skills eerst komen
      { key: 'voiceAgent', icon: Phone, href: '/skills/voice-agent' as const },
    ],
  },
  {
    key: 'grow',
    items: [
      { key: 'reporting', icon: BarChart3, href: '/skills/reporting' as const },
      { key: 'seoGeo', icon: Globe, href: '/skills/seo-geo' as const },
      { key: 'research', icon: Search, href: '/skills/research' as const },
      { key: 'clyde', icon: Bot, href: '/skills/clyde' as const },
    ],
  },
] as const

// Type-widening cast: SKILL_CATEGORIES is `as const` which gives each category
// a tuple type that flatMap cannot unify into a single union. We only need a
// flat ordered list for keyboard index lookup, so widen to the inner item union.
type SkillItem = (typeof SKILL_CATEGORIES)[number]['items'][number]
type SkillItemWithCategory = SkillItem & { categoryKey: (typeof SKILL_CATEGORIES)[number]['key'] }

const FLAT_SKILLS: readonly SkillItemWithCategory[] = SKILL_CATEGORIES.flatMap((c) =>
  c.items.map((item) => ({ ...item, categoryKey: c.key }) as SkillItemWithCategory)
)

// Structural metadata only — copy lives in messages/{locale}.json under header.nav.*
// `kind` discriminates the three render paths: 'mega' = skills mega-menu,
// 'dropdown' = small 2-item dropdown (pricing), 'link' = plain top-level link.
// IA reduced to 5 top-level items (2026-06-03): How it works + About demoted to
// footer-only (they already live there); Founding folded under the Pricing
// dropdown. Keeps Memory + Cases prominent per product decision.
const NAV_ITEMS = [
  { key: 'skills', kind: 'mega', href: '/#skills', matchPaths: ['/skills'] },
  { key: 'memory', kind: 'link', href: '/memory', matchPaths: ['/memory'] },
  {
    key: 'caseStudies',
    kind: 'link',
    href: '/case-studies/skinclarity-club',
    matchPaths: ['/case-studies'],
  },
  {
    key: 'kennisbank',
    kind: 'link',
    href: '/kennisbank',
    matchPaths: ['/kennisbank'],
  },
  {
    key: 'pricing',
    kind: 'dropdown',
    matchPaths: ['/pricing', '/founding-member'],
    children: [
      { key: 'pricing', href: '/pricing', icon: Tag },
      { key: 'foundingMember', href: '/founding-member', icon: Crown, accent: true },
    ],
  },
] as const

type NavDropdownItem = Extract<(typeof NAV_ITEMS)[number], { kind: 'dropdown' }>

const HOVER_OPEN_DELAY_MS = 120
const HOVER_CLOSE_DELAY_MS = 180

export function HeaderClient({ locale: _locale }: HeaderClientProps) {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const tHeader = useTranslations('header')

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [mobileSkillsOpen, setMobileSkillsOpen] = useState(false)
  const [hoveredSkillKey, setHoveredSkillKey] = useState<string | null>(null)

  const skillsTriggerRef = useRef<HTMLButtonElement | null>(null)
  const skillsMenuRef = useRef<HTMLDivElement | null>(null)
  const skillsItemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const hoverOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isActiveRoute = useMemo(() => {
    return (matchPaths: readonly string[]) => {
      if (!pathname) return false
      return matchPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    }
  }, [pathname])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate sync: external pathname change must close the open mobile menu
    setMobileOpen(false)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate sync: external pathname change must collapse skills submenu
    setMobileSkillsOpen(false)
  }, [pathname])

  // Close dropdowns on Escape -- only attached while a menu is actually open
  useEffect(() => {
    if (!skillsOpen && !mobileOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSkillsOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [skillsOpen, mobileOpen])

  // Click-outside close for desktop mega-menu
  useEffect(() => {
    if (!skillsOpen) return
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        skillsMenuRef.current &&
        !skillsMenuRef.current.contains(target) &&
        skillsTriggerRef.current &&
        !skillsTriggerRef.current.contains(target)
      ) {
        setSkillsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [skillsOpen])

  // Clear pending hover timers on unmount
  useEffect(() => {
    return () => {
      if (hoverOpenTimerRef.current) clearTimeout(hoverOpenTimerRef.current)
      if (hoverCloseTimerRef.current) clearTimeout(hoverCloseTimerRef.current)
    }
  }, [])

  const handleSkillsHoverOpen = () => {
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current)
      hoverCloseTimerRef.current = null
    }
    if (skillsOpen) return
    hoverOpenTimerRef.current = setTimeout(() => {
      setSkillsOpen(true)
    }, HOVER_OPEN_DELAY_MS)
  }

  const handleSkillsHoverClose = () => {
    if (hoverOpenTimerRef.current) {
      clearTimeout(hoverOpenTimerRef.current)
      hoverOpenTimerRef.current = null
    }
    hoverCloseTimerRef.current = setTimeout(() => {
      setSkillsOpen(false)
      setHoveredSkillKey(null)
    }, HOVER_CLOSE_DELAY_MS)
  }

  // Right-pane preview: hovered skill (if any), else Clyde default
  const previewSkill = useMemo(() => {
    if (hoveredSkillKey) {
      const match = FLAT_SKILLS.find((s) => s.key === hoveredSkillKey)
      if (match) return match
    }
    return FLAT_SKILLS.find((s) => s.key === 'clyde') ?? null
  }, [hoveredSkillKey])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg-deep/95 backdrop-blur-xl border-b border-accent-system/30 shadow-[0_8px_32px_-12px_rgba(0,212,170,0.25)]'
          : 'bg-bg-deep/80 backdrop-blur-md border-b border-border-primary'
      }`}
    >
      <nav
        className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-8"
        aria-label="Main navigation"
      >
        {/* Logo — edge-flush left (grid col 1) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group justify-self-start"
          aria-label="FutureMarketingAI home"
        >
          <LogoSynapse size={30} />

          <span className="font-display font-bold text-xl tracking-tight whitespace-nowrap">
            <span className="logo-shimmer-text">FutureMarketing</span>
            <span className="logo-ai-glow">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation — centered (grid col 2) */}
        <div className="hidden md:flex items-center gap-1 justify-self-center">
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(item.matchPaths)

            if (item.kind === 'dropdown') {
              return <NavDropdown key={item.key} item={item} active={active} />
            }

            return (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={item.kind === 'mega' ? handleSkillsHoverOpen : undefined}
                onMouseLeave={item.kind === 'mega' ? handleSkillsHoverClose : undefined}
              >
                {item.kind === 'mega' ? (
                  <div>
                    <button
                      ref={skillsTriggerRef}
                      type="button"
                      className={`relative flex items-center gap-1 text-sm font-medium transition-colors duration-300 py-2 px-3 rounded-lg ${
                        active || skillsOpen
                          ? 'text-text-primary'
                          : 'text-text-secondary hover:text-text-primary'
                      } group/nav`}
                      aria-expanded={skillsOpen}
                      aria-controls="skills-menu"
                      aria-haspopup="menu"
                      onClick={() => setSkillsOpen((v) => !v)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault()
                          setSkillsOpen(true)
                          requestAnimationFrame(() => skillsItemRefs.current[0]?.focus())
                        }
                        if (e.key === 'Escape') {
                          setSkillsOpen(false)
                        }
                      }}
                    >
                      <span className="relative">
                        {tHeader(`nav.${item.key}`)}
                        <span
                          className={`pointer-events-none absolute left-0 right-0 -bottom-1 h-px origin-left bg-accent-system transition-transform duration-300 ${
                            active || skillsOpen
                              ? 'scale-x-100'
                              : 'scale-x-0 group-hover/nav:scale-x-100'
                          }`}
                          aria-hidden
                        />
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          skillsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Mega-menu: 2-column (60/40) panel. SSR-rendered for crawler
                        discovery of all 12 skill hrefs (audit MF-08 + 16-04 F8).
                        Visibility CSS-toggled via `hidden` so closed = no layout. */}
                    <motion.div
                      id="skills-menu"
                      ref={skillsMenuRef}
                      initial={false}
                      animate={
                        skillsOpen
                          ? { opacity: 1, y: 0, scale: 1, x: '-50%' }
                          : { opacity: 0, y: -8, scale: 0.97, x: '-50%' }
                      }
                      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                      className={`fixed left-1/2 top-[72px] bg-bg-deep/98 backdrop-blur-xl border border-border-primary rounded-2xl shadow-2xl shadow-accent-system/10 z-50 overflow-hidden ${
                        skillsOpen ? 'block' : 'hidden'
                      }`}
                      style={{ width: 'min(1240px, calc(100vw - 48px))' }}
                      role="menu"
                      aria-label={tHeader('nav.skills')}
                      aria-hidden={!skillsOpen}
                      onKeyDown={(e) => {
                        const total = FLAT_SKILLS.length + 1 // +1 for footer CTA at end
                        const current = skillsItemRefs.current.findIndex(
                          (el) => el === document.activeElement
                        )
                        if (e.key === 'ArrowDown') {
                          e.preventDefault()
                          const next = (current + 1 + total) % total
                          skillsItemRefs.current[next]?.focus()
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault()
                          const prev = (current - 1 + total) % total
                          skillsItemRefs.current[prev]?.focus()
                        } else if (e.key === 'Home') {
                          e.preventDefault()
                          skillsItemRefs.current[0]?.focus()
                        } else if (e.key === 'End') {
                          e.preventDefault()
                          skillsItemRefs.current[total - 1]?.focus()
                        } else if (e.key === 'Escape') {
                          e.preventDefault()
                          setSkillsOpen(false)
                          skillsTriggerRef.current?.focus()
                        } else if (e.key === 'Tab') {
                          const atEnd = !e.shiftKey && current === total - 1
                          const atStart = e.shiftKey && current === 0
                          if (atEnd || atStart) {
                            setSkillsOpen(false)
                          }
                        }
                      }}
                    >
                      <div className="grid grid-cols-5">
                        {/* Left pane (60%): 3 columns of categorized skills */}
                        <div className="col-span-3 grid grid-cols-3 divide-x divide-border-primary">
                          {SKILL_CATEGORIES.map((category) => (
                            <div key={category.key} className="p-4">
                              <div className="px-3 mb-3">
                                <h3 className="font-mono uppercase tracking-[0.18em] text-[10px] text-accent-system">
                                  {tHeader(`skills.${category.key}.label`)}
                                </h3>
                              </div>
                              <div className="space-y-0.5">
                                {category.items.map((skill) => {
                                  const flatIndex = FLAT_SKILLS.findIndex(
                                    (s) => s.key === skill.key
                                  )
                                  const isHovered = hoveredSkillKey === skill.key
                                  const isComingSoon =
                                    getSkillBySlug(skill.href.replace('/skills/', ''))?.status ===
                                    'coming_soon'
                                  return (
                                    <Link
                                      key={skill.href}
                                      href={skill.href}
                                      ref={(el) => {
                                        skillsItemRefs.current[flatIndex] = el
                                      }}
                                      role="menuitem"
                                      tabIndex={skillsOpen ? 0 : -1}
                                      onClick={() => setSkillsOpen(false)}
                                      onMouseEnter={() => setHoveredSkillKey(skill.key)}
                                      onFocus={() => setHoveredSkillKey(skill.key)}
                                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 group/item cursor-pointer ${
                                        isHovered ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
                                      }`}
                                    >
                                      <div
                                        className={`p-1.5 rounded-md transition-all duration-200 ${
                                          isHovered
                                            ? 'bg-accent-system/15'
                                            : 'bg-white/5 group-hover/item:bg-accent-system/15'
                                        }`}
                                      >
                                        <skill.icon
                                          className={`w-3.5 h-3.5 transition-colors duration-200 ${
                                            isHovered
                                              ? 'text-accent-system'
                                              : 'text-text-muted group-hover/item:text-accent-system'
                                          }`}
                                          aria-hidden="true"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0 flex items-center gap-2">
                                        <span className="font-medium text-[13px] text-text-primary truncate">
                                          {tHeader(
                                            `skills.${category.key}.items.${skill.key}.title`
                                          )}
                                        </span>
                                        {isComingSoon && (
                                          <span className="text-[9px] font-semibold uppercase text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/30 rounded px-1 py-0.5 shrink-0">
                                            {tHeader('skills.comingSoon')}
                                          </span>
                                        )}
                                      </div>
                                    </Link>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Right pane (40%): contextual preview + featured callout */}
                        <div
                          className="col-span-2 border-l border-border-primary bg-gradient-to-br from-bg-elevated/60 to-bg-deep p-5 flex flex-col gap-4 min-h-[280px]"
                          aria-live="polite"
                        >
                          {previewSkill ? (
                            <PreviewPane
                              skill={previewSkill}
                              title={tHeader(
                                `skills.${previewSkill.categoryKey}.items.${previewSkill.key}.title`
                              )}
                              description={tHeader(
                                `skills.${previewSkill.categoryKey}.items.${previewSkill.key}.description`
                              )}
                              viewLabel={tHeader('megaMenu.previewCta')}
                              isComingSoon={
                                getSkillBySlug(previewSkill.href.replace('/skills/', ''))
                                  ?.status === 'coming_soon'
                              }
                              comingSoonLabel={tHeader('skills.comingSoon')}
                            />
                          ) : null}

                          <div className="mt-auto rounded-xl border border-accent-system/20 bg-accent-system/[0.06] p-3">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-accent-system" aria-hidden />
                              <span className="font-mono uppercase tracking-[0.16em] text-[10px] text-accent-system">
                                {tHeader('megaMenu.tagline')}
                              </span>
                            </div>
                            <Link
                              href="/#skills"
                              ref={(el) => {
                                skillsItemRefs.current[FLAT_SKILLS.length] = el
                              }}
                              role="menuitem"
                              tabIndex={skillsOpen ? 0 : -1}
                              onClick={() => setSkillsOpen(false)}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-primary hover:text-accent-system transition-colors group/all"
                            >
                              {tHeader('megaMenu.viewAll')}
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/all:translate-x-0.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`relative text-sm font-medium transition-colors duration-300 py-2 px-3 rounded-lg group/nav ${
                      active
                        ? 'text-text-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <span className="relative">
                      {tHeader(`nav.${item.key}`)}
                      <span
                        className={`pointer-events-none absolute left-0 right-0 -bottom-1 h-px origin-left bg-accent-system transition-transform duration-300 ${
                          active ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'
                        }`}
                        aria-hidden
                      />
                    </span>
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* Right side: Login + CTA + Mobile Menu — edge-flush right (grid col 3) */}
        <div className="flex items-center gap-3 justify-self-end">
          {/* Login: quiet icon-only button. Existing customers know to look for
              it; keeping it tertiary lets the two CTAs carry the visual weight. */}
          <a
            href="https://app.future-marketing.ai/login"
            className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-[var(--radius-btn)] text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent hover:border-white/10 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
            aria-label={t('login')}
            title={t('login')}
          >
            <LogIn className="w-4 h-4" aria-hidden />
          </a>

          {/* Secondary CTA: AI-Scan (lead-gen tool). Subordinate to the primary
              orange CTA: teal outline, and hidden below lg so md stays uncluttered. */}
          <Link
            href="/assessment"
            className="hidden lg:inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-[var(--radius-btn)] border border-accent-system/30 text-accent-system transition-all hover:bg-accent-system/10 hover:border-accent-system/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
          >
            <Gauge className="w-4 h-4 shrink-0" aria-hidden />
            {t('assessment')}
          </Link>

          <Link
            href="/apply"
            className="hidden md:inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-[var(--radius-btn)] bg-gradient-to-br from-[#F5A623] to-[#E8941A] text-bg-deep transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(245,166,35,0.3)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
          >
            {t('apply')}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-text-primary" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-bg-deep/98 backdrop-blur-md border-t border-border-primary overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="space-y-4">
                {NAV_ITEMS.map((item) => {
                  const active = isActiveRoute(item.matchPaths)
                  return (
                    <div key={item.key}>
                      {item.kind === 'mega' ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => setMobileSkillsOpen(!mobileSkillsOpen)}
                            aria-expanded={mobileSkillsOpen}
                            aria-controls="mobile-skills-menu"
                            className={`flex items-center justify-between w-full font-semibold py-3 px-4 rounded-lg transition-all ${
                              active
                                ? 'text-text-primary bg-accent-system/5 border-l-2 border-accent-system'
                                : 'text-text-primary hover:bg-white/5'
                            }`}
                          >
                            {tHeader(`nav.${item.key}`)}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                mobileSkillsOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {mobileSkillsOpen && (
                              <motion.div
                                id="mobile-skills-menu"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="pl-2 space-y-4 overflow-hidden pt-2"
                              >
                                {SKILL_CATEGORIES.map((category) => (
                                  <div key={category.key}>
                                    <div className="px-3 mb-2">
                                      <span className="font-mono uppercase tracking-[0.18em] text-[10px] text-accent-system">
                                        {tHeader(`skills.${category.key}.label`)}
                                      </span>
                                    </div>
                                    <div className="space-y-1">
                                      {category.items.map((skill) => (
                                        <Link
                                          key={skill.href}
                                          href={skill.href}
                                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary border border-white/5 hover:border-white/15 transition-all cursor-pointer"
                                          onClick={() => setMobileOpen(false)}
                                        >
                                          <div className="p-1.5 rounded-md bg-white/5">
                                            <skill.icon className="w-4 h-4 text-accent-system" />
                                          </div>
                                          <div className="font-medium text-sm">
                                            {tHeader(
                                              `skills.${category.key}.items.${skill.key}.title`
                                            )}
                                          </div>
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : item.kind === 'dropdown' ? (
                        <div className="space-y-1">
                          {item.children.map((child) => {
                            const childActive = isActiveRoute([child.href])
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`block font-semibold py-3 px-4 rounded-lg transition-all ${
                                  childActive
                                    ? 'text-text-primary bg-accent-system/5 border-l-2 border-accent-system'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                }`}
                                onClick={() => setMobileOpen(false)}
                              >
                                {tHeader(`nav.${child.key}`)}
                              </Link>
                            )
                          })}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block font-semibold py-3 px-4 rounded-lg transition-all ${
                            active
                              ? 'text-text-primary bg-accent-system/5 border-l-2 border-accent-system'
                              : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {tHeader(`nav.${item.key}`)}
                        </Link>
                      )}
                    </div>
                  )
                })}

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <Link
                    href="/apply"
                    className="flex items-center justify-center gap-2 p-4 rounded-lg font-semibold bg-gradient-to-br from-[#F5A623] to-[#E8941A] text-bg-deep transition-all hover:shadow-[0_8px_24px_rgba(245,166,35,0.3)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t('apply')}
                    <ArrowRight className="w-5 h-5 shrink-0" aria-hidden />
                  </Link>
                  <Link
                    href="/assessment"
                    className="flex items-center justify-center gap-2 p-4 rounded-lg font-semibold border border-accent-system/30 text-accent-system hover:bg-accent-system/10 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Gauge className="w-5 h-5 shrink-0" aria-hidden />
                    {t('assessment')}
                  </Link>
                  <a
                    href="https://app.future-marketing.ai/login"
                    className="flex items-center justify-center gap-3 p-4 bg-white/10 text-text-primary rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    {t('login')}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// Lightweight 2-item dropdown (pricing) — sits next to the skills mega-menu.
// Self-contained: own open state + hover-intent, mirrors the skills trigger
// styling (teal underline, rotating chevron) for visual consistency.
function NavDropdown({ item, active }: { item: NavDropdownItem; active: boolean }) {
  const tHeader = useTranslations('header')
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleHoverOpen = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    if (open) return
    openTimerRef.current = setTimeout(() => setOpen(true), HOVER_OPEN_DELAY_MS)
  }

  const handleHoverClose = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
    closeTimerRef.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS)
  }

  // Clear pending hover timers on unmount
  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  // Click-outside close
  useEffect(() => {
    if (!open) return
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  return (
    <div className="relative" onMouseEnter={handleHoverOpen} onMouseLeave={handleHoverClose}>
      <button
        ref={triggerRef}
        type="button"
        className={`relative flex items-center gap-1 text-sm font-medium transition-colors duration-300 py-2 px-3 rounded-lg group/nav ${
          active || open ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
            requestAnimationFrame(() => itemRefs.current[0]?.focus())
          }
          if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
      >
        <span className="relative">
          {tHeader(`nav.${item.key}`)}
          <span
            className={`pointer-events-none absolute left-0 right-0 -bottom-1 h-px origin-left bg-accent-system transition-transform duration-300 ${
              active || open ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'
            }`}
            aria-hidden
          />
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <motion.div
        ref={menuRef}
        initial={false}
        animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        className={`absolute right-0 top-[calc(100%+12px)] w-[280px] bg-bg-deep/98 backdrop-blur-xl border border-border-primary rounded-2xl shadow-2xl shadow-accent-system/10 z-50 overflow-hidden p-2 ${
          open ? 'block' : 'hidden'
        }`}
        role="menu"
        aria-label={tHeader(`nav.${item.key}`)}
        aria-hidden={!open}
        onKeyDown={(e) => {
          const total = item.children.length
          const current = itemRefs.current.findIndex((el) => el === document.activeElement)
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            itemRefs.current[(current + 1 + total) % total]?.focus()
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            itemRefs.current[(current - 1 + total) % total]?.focus()
          } else if (e.key === 'Escape') {
            e.preventDefault()
            setOpen(false)
            triggerRef.current?.focus()
          } else if (e.key === 'Tab') {
            const atEnd = !e.shiftKey && current === total - 1
            const atStart = e.shiftKey && current === 0
            if (atEnd || atStart) setOpen(false)
          }
        }}
      >
        {item.children.map((child, index) => {
          const Icon: LucideIcon = child.icon
          const accent = 'accent' in child && child.accent
          return (
            <Link
              key={child.href}
              href={child.href}
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/[0.06] group/item"
            >
              <div
                className={`p-1.5 rounded-md transition-colors duration-200 ${
                  accent
                    ? 'bg-[#F5A623]/15'
                    : 'bg-white/5 group-hover/item:bg-accent-system/15'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors duration-200 ${
                    accent ? 'text-[#F5A623]' : 'text-text-muted group-hover/item:text-accent-system'
                  }`}
                  aria-hidden
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-text-primary">
                    {tHeader(`nav.${child.key}`)}
                  </span>
                  {accent && (
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/30 rounded px-1 py-0.5">
                      {tHeader('priceMenu.spots', {
                        taken: FOUNDING_SPOTS_TAKEN,
                        total: FOUNDING_SPOTS_TOTAL,
                      })}
                    </span>
                  )}
                </div>
                <span className="block text-xs text-text-secondary mt-0.5">
                  {tHeader(`priceMenu.${child.key}.subtitle`)}
                </span>
              </div>
            </Link>
          )
        })}
      </motion.div>
    </div>
  )
}

interface PreviewPaneProps {
  skill: SkillItemWithCategory
  title: string
  description: string
  viewLabel: string
  isComingSoon: boolean
  comingSoonLabel: string
}

function PreviewPane({
  skill,
  title,
  description,
  viewLabel,
  isComingSoon,
  comingSoonLabel,
}: PreviewPaneProps) {
  const Icon = skill.icon
  return (
    <motion.div
      key={skill.key}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-accent-system/20 to-accent-system/5 border border-accent-system/30">
          <Icon className="w-5 h-5 text-accent-system" aria-hidden />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-base text-text-primary">{title}</span>
          {isComingSoon && (
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/30 rounded px-1 py-0.5">
              {comingSoonLabel}
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
      <Link
        href={skill.href}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-system hover:text-accent-system/80 transition-colors group/preview self-start"
      >
        {viewLabel}
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/preview:translate-x-0.5" />
      </Link>
    </motion.div>
  )
}
