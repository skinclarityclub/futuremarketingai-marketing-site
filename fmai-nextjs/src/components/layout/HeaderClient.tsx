'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  Mic,
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

const SKILL_CATEGORIES = [
  {
    label: 'Create & Publish',
    description: 'Content production at scale',
    items: [
      {
        icon: Share2,
        title: 'Social Media',
        description: 'Captions, scheduling, carousels & stories',
        href: '/skills/social-media' as const,
      },
      {
        icon: BookOpen,
        title: 'Blog Factory',
        description: 'Longform SEO articles 1500-3000 words',
        href: '/skills/blog-factory' as const,
      },
      {
        icon: Megaphone,
        title: 'Ad Creator',
        description: 'Static & video ads for Meta',
        href: '/skills/ad-creator' as const,
      },
      {
        icon: Clapperboard,
        title: 'Reel Builder',
        description: 'Vertical videos with captions & music',
        href: '/skills/reel-builder' as const,
        comingSoon: true,
      },
    ],
  },
  {
    label: 'Engage & Convert',
    description: 'Lead capture and client interaction',
    items: [
      {
        icon: Phone,
        title: 'Voice Agent',
        description: 'Inbound + outbound AI phone calls',
        href: '/skills/voice-agent' as const,
      },
      {
        icon: MessageSquare,
        title: 'Lead Qualifier',
        description: 'Website chatbot + lead scoring',
        href: '/skills/lead-qualifier' as const,
      },
      {
        icon: Mail,
        title: 'Email Management',
        description: 'Gmail classify + daily digest',
        href: '/skills/email-management' as const,
        comingSoon: true,
      },
      {
        icon: MessageCircle,
        title: 'ManyChat DM',
        description: 'Instagram DM triggers + AI replies',
        href: '/skills/manychat' as const,
        comingSoon: true,
      },
    ],
  },
  {
    label: 'Grow & Optimize',
    description: 'Analytics, research and orchestration',
    items: [
      {
        icon: BarChart3,
        title: 'Reporting',
        description: 'Dashboards, digests, anomaly alerts',
        href: '/skills/reporting' as const,
      },
      {
        icon: Globe,
        title: 'SEO / GEO Analyst',
        description: 'SEO audits + AI citation monitoring',
        href: '/skills/seo-geo' as const,
      },
      {
        icon: Search,
        title: 'Research',
        description: 'Market research + trend monitoring',
        href: '/skills/research' as const,
      },
      {
        icon: Bot,
        title: 'Clyde AI Employee',
        description: 'The central orchestrator of all skills',
        href: '/skills/clyde' as const,
      },
    ],
  },
] as const

const NAV_ITEMS = [
  { label: 'Skills', href: '/#skills' as const, hasDropdown: true },
  { label: 'Memory', href: '/memory' as const },
  { label: 'Case Studies', href: '/case-studies/skinclarity-club' as const },
  { label: 'Pricing', href: '/pricing' as const },
  { label: 'About', href: '/about' as const },
]

export function HeaderClient({ locale }: HeaderClientProps) {
  const pathname = usePathname()
  const t = useTranslations('nav')

  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [mobileSkillsOpen, setMobileSkillsOpen] = useState(false)

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

  // Close dropdowns on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSkillsOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close services dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => {
      setSkillsOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

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
        {/* Logo */}
        <Link href="/" className="flex items-center group" aria-label="FutureMarketingAI home">
          <span className="font-display font-bold text-xl tracking-tight">
            <span className="text-white">Future</span>
            <span className="bg-gradient-to-r from-[#F5A623] to-[#0ABAB5] bg-clip-text text-transparent">
              Marketing
            </span>
            <span className="text-white">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative">
              {item.hasDropdown ? (
                <div
                  onMouseEnter={() => setSkillsOpen(true)}
                  onMouseLeave={() => setSkillsOpen(false)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-white/5"
                    aria-expanded={skillsOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        skillsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {skillsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-full -left-4 mt-1 bg-bg-deep/98 backdrop-blur-md border border-border-primary rounded-xl shadow-2xl shadow-accent-system/10 z-50 overflow-hidden"
                        style={{ width: '880px' }}
                        role="menu"
                      >
                        {/* Three-column category layout */}
                        <div className="grid grid-cols-3 gap-0 divide-x divide-border-primary">
                          {SKILL_CATEGORIES.map((category) => (
                            <div key={category.label} className="p-4">
                              <div className="px-3 mb-3">
                                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-accent-system">
                                  {category.label}
                                </h3>
                                <p className="text-[10px] text-text-muted mt-0.5">
                                  {category.description}
                                </p>
                              </div>
                              <div className="space-y-0.5">
                                {category.items.map((skill) => (
                                  <Link
                                    key={skill.href}
                                    href={skill.href}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group/item hover:bg-white/5 cursor-pointer"
                                    role="menuitem"
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
                                          {skill.title}
                                        </span>
                                        {'comingSoon' in skill && skill.comingSoon && (
                                          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/30 rounded px-1 py-0.5">
                                            Soon
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-text-muted group-hover/item:text-text-secondary transition-colors duration-200 leading-snug">
                                        {skill.description}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Featured CTA banner */}
                        <div className="border-t border-border-primary bg-white/[0.02]">
                          <Link
                            href="/apply"
                            onClick={() => setSkillsOpen(false)}
                            className="flex items-center justify-between w-full px-6 py-3.5 group/cta cursor-pointer hover:bg-white/5 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 rounded-md bg-gradient-to-br from-[#F5A623]/20 to-[#0ABAB5]/20">
                                <Sparkles className="w-4 h-4 text-[#F5A623]" aria-hidden="true" />
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-text-primary">
                                  Apply
                                </span>
                                <span className="text-[11px] text-text-muted ml-2">
                                  Book a partnership call
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
                  {item.label}
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
                  <div key={item.label}>
                    {item.hasDropdown ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => setMobileSkillsOpen(!mobileSkillsOpen)}
                          className="flex items-center justify-between w-full text-text-primary font-semibold py-3 px-4 rounded-lg hover:bg-white/5 transition-all"
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              mobileSkillsOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileSkillsOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-2 space-y-4 overflow-hidden pt-2"
                            >
                              {SKILL_CATEGORIES.map((category) => (
                                <div key={category.label}>
                                  <div className="px-3 mb-2">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-system">
                                      {category.label}
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
                                        <div className="font-medium text-sm">{skill.title}</div>
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
                        {item.label}
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
