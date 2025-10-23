/**
 * LandingFooter Component - 2025 Minimalist Footer
 *
 * Based on Linear, Vercel, Stripe patterns
 * Key principles:
 * - Extreme simplification
 * - Single row layout
 * - No redundancy
 * - Trust signals integrated
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles, Github, Linkedin, Twitter } from 'lucide-react'

export const LandingFooter: React.FC = () => {
  const { t } = useTranslation('common')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section: Logo + Navigation + Status */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <Sparkles className="w-5 h-5 text-blue-400 transition-transform group-hover:rotate-12" />
              <span className="font-bold text-base text-white">
                {t('landing.footer.brand_name')}
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs">{t('landing.footer.tagline')}</p>
          </div>

          {/* Navigation Grid - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
            {/* Product */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                {t('landing.footer.sections.product')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t('landing.footer.nav.features')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t('landing.footer.nav.pricing')}
                  </Link>
                </li>
                <li>
                  <a
                    href="/demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t('landing.footer.nav.demo')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                {t('landing.footer.sections.company')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t('landing.footer.nav.about')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t('landing.footer.nav.how_it_works')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                {t('landing.footer.sections.resources')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/calculator"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t('landing.footer.nav.roi_calculator')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/explorer"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t('landing.footer.nav.showcase')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                {t('landing.footer.sections.legal')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t('landing.footer.nav.privacy')}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t('landing.footer.nav.terms')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright, Status, Social */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Copyright + Status */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-xs text-slate-500">
                {t('landing.footer.copyright', { year: currentYear })}
              </p>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-xs text-purple-200">{t('landing.footer.status_badge')}</span>
              </div>
            </div>

            {/* Right: Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/futuremarketingai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label={t('landing.footer.social_aria.github')}
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/futuremarketingai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label={t('landing.footer.social_aria.linkedin')}
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/FutureMarketAI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label={t('landing.footer.social_aria.twitter')}
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
