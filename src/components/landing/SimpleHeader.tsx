/**
 * SimpleHeader Component - 2025 Modern SaaS Header
 * Based on Linear, Vercel, Stripe design patterns
 *
 * Key 2025 Trends:
 * - Extreme minimalism with breathing space
 * - Floating/lifted design with depth
 * - Primary CTA dominance
 * - Subtle micro-interactions
 * - Enhanced blur & transparency
 */

import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles, ArrowRight, LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, type Language } from '../../i18n/config'
import { useDemoRedirect } from '../../hooks'
import { DesktopOnlyNoticeModal } from '../mobile/DesktopOnlyNoticeModal'
// Import flag SVG components
import GB from 'country-flag-icons/react/3x2/GB'
import NL from 'country-flag-icons/react/3x2/NL'
import ES from 'country-flag-icons/react/3x2/ES'

// Map language codes to flag components
const FLAG_COMPONENTS = {
  en: GB,
  nl: NL,
  es: ES,
} as const

export const SimpleHeader: React.FC = () => {
  const { t, i18n } = useTranslation('common')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Use demo redirect hook for mobile modal
  const { showDesktopNotice, openDemo, closeDesktopNotice, noticePage } = useDemoRedirect()

  const currentLanguage = (i18n.language?.split('-')[0] || 'en') as Language
  const currentLangData = LANGUAGES[currentLanguage] || LANGUAGES.en
  const FlagComponent = FLAG_COMPONENTS[currentLanguage] || GB

  const changeLanguage = (lang: Language) => {
    void i18n.changeLanguage(lang)
    setIsLangOpen(false)

    // Track language change
    if (window.gtag) {
      window.gtag('event', 'language_change', {
        previous_language: currentLanguage,
        new_language: lang,
        source: 'mobile_header',
      })
    }
  }

  // Handle transition to demo - now uses useDemoRedirect
  const handleDemoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    openDemo('demo')
  }

  // Handle scroll for sticky header effect + auto-hide
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Update scrolled state (for styling)
      setIsScrolled(currentScrollY > 20)

      // Don't hide if mobile menu is open
      if (isMobileMenuOpen) {
        setIsVisible(true)
        setLastScrollY(currentScrollY)
        return
      }

      // Hide on scroll down, show on scroll up (2025 UX pattern)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true)
      }

      // Always show at top
      if (currentScrollY < 10) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsLangOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
    }

    if (isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLangOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // 2025 Minimalism: Only essential navigation (2-3 items max)
  const navLinks = [
    { label: t('landing.header.nav.features'), href: '/features' },
    { label: t('landing.header.nav.pricing'), href: '/pricing' },
  ]

  const isActiveLink = (href: string) => {
    return location.pathname === href
  }

  return (
    <>
      {/* 2025 Floating Header with Depth + Auto-Hide */}
      <motion.header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Floating Container with Enhanced Glass Effect */}
          <div
            className={`relative transition-all duration-700 ${
              isScrolled
                ? 'bg-slate-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40'
                : 'bg-slate-950/60 backdrop-blur-xl border border-white/5 shadow-lg shadow-black/20'
            } rounded-2xl`}
          >
            {/* Ambient Glow */}
            <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16">
              {/* Logo - Clean 2025 Style */}
              <Link
                to="/"
                className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl"
                aria-label={t('landing.header.logo_aria')}
              >
                {/* Icon with glow */}
                <div className="relative">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
                  <div className="absolute inset-0 bg-blue-400/40 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Text Logo - Simplified */}
                <div className="font-bold text-base sm:text-lg tracking-tight">
                  <span className="text-white/90 group-hover:text-white transition-colors">
                    {t('landing.header.brand.future')}
                  </span>
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {t('landing.header.brand.marketing')}
                  </span>
                  <span className="text-cyan-400 ml-0.5">{t('landing.header.brand.ai')}</span>
                </div>
              </Link>

              {/* Mobile: Language Switcher + Hamburger Menu */}
              <div className="lg:hidden flex items-center gap-2">
                {/* Language Switcher - Compact Flag Button */}
                <div className="relative" ref={langDropdownRef}>
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="w-9 h-9 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors p-1.5"
                    aria-label={t('common:language_switcher.change_language')}
                    aria-expanded={isLangOpen}
                    type="button"
                  >
                    <div className="w-full h-full rounded overflow-hidden">
                      <FlagComponent
                        title={currentLangData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>

                  {/* Language Dropdown */}
                  <AnimatePresence>
                    {isLangOpen && (
                      <>
                        {/* Backdrop */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-40"
                          onClick={() => setIsLangOpen(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 min-w-[140px] z-50"
                        >
                          {Object.entries(LANGUAGES).map(([code, data]) => {
                            const FlagIcon = FLAG_COMPONENTS[code as Language]
                            return (
                              <button
                                key={code}
                                onClick={() => changeLanguage(code as Language)}
                                className={`
                                  w-full px-3 py-2 text-left flex items-center gap-3 transition-colors
                                  hover:bg-white/5
                                  ${currentLanguage === code ? 'bg-blue-500/10' : ''}
                                `}
                                type="button"
                              >
                                <div className="w-6 h-4 rounded overflow-hidden shadow-sm flex-shrink-0">
                                  <FlagIcon
                                    title={data.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span
                                  className={`text-sm font-medium ${
                                    currentLanguage === code ? 'text-blue-400' : 'text-white/80'
                                  }`}
                                >
                                  {data.name}
                                </span>
                                {currentLanguage === code && (
                                  <svg
                                    className="w-4 h-4 ml-auto text-blue-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </button>
                            )
                          })}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hamburger Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg text-white hover:bg-white/5 transition-colors"
                  aria-label={
                    isMobileMenuOpen
                      ? t('landing.header.mobile_menu_close')
                      : t('landing.header.mobile_menu_open')
                  }
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>

              {/* Center: Minimal Navigation */}
              <nav
                className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"
                aria-label={t('landing.header.nav_aria')}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isActiveLink(link.href)
                        ? 'text-white bg-white/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    aria-current={isActiveLink(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Right: CTA Hierarchy (2025 Pattern) */}
              <div className="hidden lg:flex items-center gap-2">
                {/* Secondary CTA - Subtle */}
                <Link to="/login">
                  <button className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                    <LogIn className="w-4 h-4 inline mr-1.5" />
                    {t('landing.header.login')}
                  </button>
                </Link>

                {/* Primary CTA - Dominant 2025 Style */}
                <motion.button
                  onClick={handleDemoClick}
                  className="relative px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl overflow-hidden group shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  {/* Content */}
                  <span className="relative flex items-center gap-1.5">
                    {t('landing.header.try_demo')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - 2025 Clean Style */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-x-0 top-0 z-40 pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Container */}
            <div className="relative max-w-lg mx-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <nav
                className="flex flex-col p-4 space-y-1"
                aria-label={t('landing.header.mobile_nav_aria')}
              >
                {/* Navigation Links */}
                <Link
                  to="/"
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActiveLink('/')
                      ? 'text-white bg-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('landing.header.nav.home')}
                </Link>

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActiveLink(link.href)
                        ? 'text-white bg-white/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Divider */}
                <div className="h-px bg-white/10 my-2" />

                {/* Mobile CTAs */}
                <button
                  onClick={(e) => {
                    handleDemoClick(e)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                >
                  {t('landing.header.try_demo')}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link to="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2.5 bg-white/5 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    {t('landing.header.login')}
                  </button>
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Notice Modal - Mobile Only */}
      {showDesktopNotice && (
        <DesktopOnlyNoticeModal
          pageName={noticePage}
          onClose={closeDesktopNotice}
          isOpen={showDesktopNotice}
        />
      )}
    </>
  )
}
