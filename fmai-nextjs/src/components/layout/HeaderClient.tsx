'use client'

import { useState, useEffect, useRef } from 'react'
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
} from 'lucide-react'

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
      {
        key: 'adCreator',
        icon: Megaphone,
        href: '/skills/ad-creator' as const,
        comingSoon: true,
      },
      {
        key: 'reelBuilder',
        icon: Clapperboard,
        href: '/skills/reel-builder' as const,
        comingSoon: true,
      },
    ],
  },
  {
    key: 'engage',
    items: [
      {
        key: 'voiceAgent',
        icon: Phone,
        href: '/skills/voice-agent' as const,
        comingSoon: true,
      },
      { key: 'leadQualifier', icon: MessageSquare, href: '/skills/lead-qualifier' as const },
      { key: 'emailManagement', icon: Mail, href: '/skills/email-management' as const },
      { key: 'manychat', icon: MessageCircle, href: '/skills/manychat' as const },
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
const FLAT_SKILLS: readonly SkillItem[] = SKILL_CATEGORIES.flatMap(
  (c) => c.items as readonly SkillItem[]
)

// Structural metadata only — copy lives in messages/{locale}.json under header.nav.*
const NAV_ITEMS = [
  { key: 'skills', href: '/#skills' as const, hasDropdown: true },
  { key: 'memory', href: '/memory' as const, hasDropdown: false },
  { key: 'caseStudies', href: '/case-studies/skinclarity-club' as const, hasDropdown: false },
  { key: 'pricing', href: '/pricing' as const, hasDropdown: false },
  { key: 'about', href: '/about' as const, hasDropdown: false },
] as const

export function HeaderClient({ locale: _locale }: HeaderClientProps) {
  const pathname = usePathname()
  // Existing namespace for login/apply CTAs (top-level `nav.*`)
  const t = useTranslations('nav')
  // New namespace for header mega-menu (skills + nav links + apply CTA banner)
  const tHeader = useTranslations('header')

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [mobileSkillsOpen, setMobileSkillsOpen] = useState(false)

  const skillsTriggerRef = useRef<HTMLButtonElement | null>(null)
  const skillsMenuRef = useRef<HTMLDivElement | null>(null)
  const skillsItemRefs = useRef<Array<HTMLAnchorElement | null>>([])

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
    setMobileOpen(false)
    setMobileSkillsOpen(false)
  }, [pathname])

  // Close dropdowns on Escape -- only attached while a menu is actually open
  // (was previously unconditional, paying always-hot keydown listener cost on
  // every route). See 13-01-PLAN.md Task 8.
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

  // Close services dropdown when clicking outside (ref-scoped -- does not
  // fight onClick). Gated on skillsOpen so no listener is attached the
  // 99% of user-time the dropdown is closed.
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg-deep/95 backdrop-blur-md border-b border-accent-system/20 shadow-2xl shadow-accent-system/5'
          : 'bg-bg-deep/80 backdrop-blur-md border-b border-border-primary'
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo — wordmark flanked by brain-circuit (left) and pulsing trace (right).
            Pure SVG decorations + CSS keyframes; same brand language as the
            full /brand strip on the homepage. */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="FutureMarketingAI home"
        >
          {/* Brain-circuit mini (left) */}
          <svg
            width="26"
            height="26"
            viewBox="0 0 28 28"
            aria-hidden="true"
            className="shrink-0 text-accent-system logo-header-brain"
          >
            <defs>
              <filter id="hdr-brain-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.8" />
              </filter>
            </defs>
            <g
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#hdr-brain-glow)"
            >
              {/* Two brain halves */}
              <path d="M 14 4 Q 6 4 4 11 Q 1 16 5 20 Q 7 25 14 23 L 14 4 Z" />
              <path d="M 14 4 Q 22 4 24 11 Q 27 16 23 20 Q 21 25 14 23 L 14 4 Z" />
              {/* Gyri folds (energy flows through these) */}
              <path d="M 5 11 Q 8 9 11 11" stroke="#5eead4" className="logo-svg-brain-flow" />
              <path d="M 17 11 Q 20 9 23 11" stroke="#5eead4" className="logo-svg-brain-flow-2" />
              <path d="M 5 17 Q 8 15 11 17" stroke="#5eead4" className="logo-svg-brain-flow-3" />
              <path d="M 17 17 Q 20 15 23 17" stroke="#5eead4" className="logo-svg-brain-flow" />
              {/* Central fissure */}
              <line x1="14" y1="4" x2="14" y2="23" strokeOpacity="0.55" />
            </g>
            {/* Synapse dot at top */}
            <circle cx="14" cy="4" r="1.4" fill="#5eead4" className="logo-svg-spark" />
            <circle cx="14" cy="14" r="1.2" fill="#5eead4" className="logo-svg-spark logo-svg-spark-2" />
          </svg>

          {/* Wordmark */}
          <span className="font-display font-bold text-xl tracking-tight whitespace-nowrap">
            <span className="logo-shimmer-text">FutureMarketing</span>
            <span className="logo-ai-glow">AI</span>
          </span>

          {/* Circuit accent (right) — small trace ending in a pulsing/sparking node */}
          <svg
            width="34"
            height="22"
            viewBox="0 0 34 22"
            aria-hidden="true"
            className="shrink-0 hidden sm:block"
          >
            <defs>
              <filter id="hdr-trace-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
            </defs>
            <g stroke="#00d4aa" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.55">
              <path d="M 0 11 H 14 L 18 5 H 30" />
              <path d="M 0 11 H 14 L 18 17 H 30" />
            </g>
            {/* Energy pulse traveling along upper trace */}
            <path
              d="M 0 11 H 14 L 18 5 H 30"
              stroke="#5eead4"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              filter="url(#hdr-trace-glow)"
              className="logo-header-circuit"
            />
            {/* Sparking end-nodes */}
            <circle cx="30" cy="5" r="2.2" fill="#00d4aa" className="logo-svg-spark" filter="url(#hdr-trace-glow)" />
            <circle cx="30" cy="17" r="2.2" fill="#00d4aa" className="logo-svg-spark logo-svg-spark-3" filter="url(#hdr-trace-glow)" />
            <circle cx="18" cy="11" r="1.4" fill="#5eead4" className="logo-svg-spark logo-svg-spark-2" />
          </svg>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.key} className="relative">
              {item.hasDropdown ? (
                <div>
                  <button
                    ref={skillsTriggerRef}
                    type="button"
                    className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
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
                    {tHeader(`nav.${item.key}`)}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        skillsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {skillsOpen && (
                      <motion.div
                        id="skills-menu"
                        ref={skillsMenuRef}
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-full -left-4 mt-1 bg-bg-deep/98 backdrop-blur-md border border-border-primary rounded-xl shadow-2xl shadow-accent-system/10 z-50 overflow-hidden"
                        style={{ width: '880px' }}
                        role="menu"
                        aria-label={tHeader('nav.skills')}
                        onKeyDown={(e) => {
                          const total = FLAT_SKILLS.length + 1 // +1 for Apply CTA at end
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
                        {/* Three-column category layout */}
                        <div className="grid grid-cols-3 gap-0 divide-x divide-border-primary">
                          {SKILL_CATEGORIES.map((category) => (
                            <div key={category.key} className="p-4">
                              <div className="px-3 mb-3">
                                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-accent-system">
                                  {tHeader(`skills.${category.key}.label`)}
                                </h3>
                                <p className="text-[10px] text-text-muted mt-0.5">
                                  {tHeader(`skills.${category.key}.description`)}
                                </p>
                              </div>
                              <div className="space-y-0.5">
                                {category.items.map((skill) => {
                                  const flatIndex = FLAT_SKILLS.indexOf(skill)
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
                                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group/item hover:bg-white/5 cursor-pointer"
                                    >
                                      <div className="p-1.5 rounded-md bg-white/5 group-hover/item:bg-accent-system/15 transition-all duration-200">
                                        <skill.icon
                                          className="w-4 h-4 text-text-muted group-hover/item:text-accent-system transition-colors duration-200"
                                          aria-hidden="true"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-sm text-text-primary group-hover/item:text-white transition-colors duration-200">
                                            {tHeader(
                                              `skills.${category.key}.items.${skill.key}.title`
                                            )}
                                          </span>
                                          {'comingSoon' in skill && skill.comingSoon && (
                                            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/30 rounded px-1 py-0.5">
                                              {tHeader('skills.comingSoon')}
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[11px] text-text-muted group-hover/item:text-text-secondary transition-colors duration-200 leading-snug">
                                          {tHeader(
                                            `skills.${category.key}.items.${skill.key}.description`
                                          )}
                                        </div>
                                      </div>
                                    </Link>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Featured CTA banner */}
                        <div className="border-t border-border-primary bg-white/[0.02]">
                          <Link
                            href="/apply"
                            ref={(el) => {
                              skillsItemRefs.current[FLAT_SKILLS.length] = el
                            }}
                            role="menuitem"
                            tabIndex={skillsOpen ? 0 : -1}
                            onClick={() => setSkillsOpen(false)}
                            className="flex items-center justify-between w-full px-6 py-3.5 group/cta cursor-pointer hover:bg-white/5 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded-md bg-gradient-to-br from-[#F5A623]/20 to-[#0ABAB5]/20">
                                <Sparkles className="w-4 h-4 text-[#F5A623]" aria-hidden="true" />
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-text-primary">
                                  {tHeader('cta.applyTitle')}
                                </span>
                                <span className="text-[11px] text-text-muted ml-2">
                                  {tHeader('cta.applySubtitle')}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-text-muted group-hover/cta:text-accent-system group-hover/cta:translate-x-0.5 transition-all duration-200" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
                >
                  {tHeader(`nav.${item.key}`)}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right side: Login + Locale Switcher + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Login text link */}
          <a
            href="https://app.future-marketing.ai/login"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <LogIn className="w-4 h-4" />
            {t('login')}
          </a>

          {/* Primary CTA */}
          <Link
            href="/apply"
            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#F5A623] to-[#0ABAB5] text-bg-deep font-semibold text-sm px-4 py-2 rounded-[var(--radius-btn)] hover:opacity-90 transition-all"
          >
            {t('apply')}
          </Link>

          {/* Mobile Menu Button */}
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
                {/* Mobile Nav Links */}
                {NAV_ITEMS.map((item) => (
                  <div key={item.key}>
                    {item.hasDropdown ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => setMobileSkillsOpen(!mobileSkillsOpen)}
                          aria-expanded={mobileSkillsOpen}
                          aria-controls="mobile-skills-menu"
                          className="flex items-center justify-between w-full text-text-primary font-semibold py-3 px-4 rounded-lg hover:bg-white/5 transition-all"
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
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-system">
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
                    ) : (
                      <Link
                        href={item.href}
                        className="block text-text-secondary hover:text-text-primary font-semibold py-3 px-4 rounded-lg hover:bg-white/5 transition-all"
                        onClick={() => setMobileOpen(false)}
                      >
                        {tHeader(`nav.${item.key}`)}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile Login */}
                <div className="space-y-3 pt-4 border-t border-white/10">
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
