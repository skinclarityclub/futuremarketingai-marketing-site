/**
 * PlaceholderPage Component - Reusable "Coming Soon" page
 *
 * Used for pages that are planned but not yet built
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { Construction, ArrowRight, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'

interface PlaceholderPageProps {
  title: string
  description: string
  seoTitle: string
  seoDescription: string
  icon?: React.ReactNode
  launchEstimate?: string
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  seoTitle,
  seoDescription,
  icon,
  launchEstimate = 'Q1 2026',
}) => {
  return (
    <>
      {/* Simple Header */}
      <SimpleHeader />

      {/* SEO Meta Tags */}
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={['Future Marketing AI', 'coming soon', 'marketing automation']}
        canonical={`https://futuremarketingai.com${window.location.pathname}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-6 py-20">
        <motion.div
          className="max-w-2xl w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full">
              {icon || <Construction className="w-16 h-16 text-blue-400" />}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{title}</h1>

          {/* Description */}
          <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto">{description}</p>

          {/* Launch Estimate */}
          {launchEstimate && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-100 mb-8">
              <Calendar className="w-4 h-4" />
              Launching {launchEstimate}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
              href="/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Try Interactive Demo
              <ArrowRight className="w-5 h-5" />
            </a>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/15 transition-all"
            >
              Get Notified When Ready
            </Link>
          </div>

          {/* Back to Home */}
          <div className="mt-12">
            <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default PlaceholderPage
