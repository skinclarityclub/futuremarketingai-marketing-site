/**
 * About Page - Company information and founding story
 *
 * Transparent early-stage positioning with founding teams and vision.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Rocket, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { StructuredDataPresets } from '../components/seo/StructuredData'
import { SocialProof } from '../components/landing/SocialProof'
import { FAQSection } from '../components/seo/FAQSection'
import { TermDefinitions } from '../components/seo/TermDefinitions'

/**
 * Company Vision & Mission
 */
const VISION = {
  tagline: 'Building the autonomous marketing system of the future',
  mission:
    'To democratize enterprise-grade AI marketing automation for ambitious businesses. We believe every company should have access to the same intelligent marketing capabilities as Fortune 500 companies—without the Fortune 500 budget.',
  why: 'We built this platform for ourselves first. As operators running our own marketing, we were frustrated by fragmented tools, manual workflows, and the inability to scale without hiring. So we built the system we wished existed.',
} as const

/**
 * Timeline milestones
 */
const TIMELINE = [
  {
    year: '2020-2024',
    title: 'AI-Assisted Marketing Era',
    description:
      'ChatGPT and similar tools help marketers work faster, but still require significant manual oversight and coordination.',
    status: 'past',
  },
  {
    year: '2025',
    title: 'Autonomous Marketing Era',
    description:
      'Complete AI systems that handle the entire workflow autonomously. This is where we are—and where early adopters gain a 3-5 year competitive advantage.',
    status: 'current',
    highlight: true,
  },
  {
    year: '2027+',
    title: 'Standard Practice',
    description:
      'Autonomous marketing becomes the norm. By then, early movers have built an insurmountable lead through compounding AI learning effects.',
    status: 'future',
  },
] as const

export const AboutPage: React.FC = () => {
  return (
    <>
      {/* Simple Header */}
      <SimpleHeader />

      {/* SEO Meta Tags */}
      <SEOHead
        title="About Us - Building Autonomous Marketing | Future Marketing AI"
        description="We're building the autonomous marketing platform of the future with 3 founding teams. Launching Q1 2026. Powered by GPT-4, Claude, Gemini, and Perplexity."
        keywords={[
          'Future Marketing AI',
          'autonomous marketing platform',
          'AI marketing company',
          'marketing automation startup',
        ]}
        canonical="https://futuremarketingai.com/about"
      />

      {/* Structured Data - Organization */}
      <StructuredDataPresets.organization />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <Rocket className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-100">Launching Q1 2026</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About Future Marketing AI
            </h1>
            <p className="text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-8">
              {VISION.tagline}
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-400" />
                Our Mission
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed mb-6">{VISION.mission}</p>
              <h3 className="text-2xl font-bold text-white mb-4">Why We Built This</h3>
              <p className="text-lg text-blue-100 leading-relaxed">{VISION.why}</p>
            </div>
          </div>
        </section>

        {/* Timeline - Vision Section */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              The Evolution of Marketing Automation
            </h2>
            <div className="space-y-8">
              {TIMELINE.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative border-l-4 pl-8 py-6 ${
                    milestone.highlight ? 'border-blue-500 bg-blue-500/10' : 'border-white/20'
                  } rounded-r-xl`}
                >
                  <div className="absolute -left-3 top-8 w-6 h-6 bg-blue-500 rounded-full border-4 border-slate-950" />
                  <div className="text-sm font-semibold text-blue-300 mb-2">{milestone.year}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {milestone.title}
                    {milestone.highlight && (
                      <span className="ml-3 text-lg text-blue-400">← YOU ARE HERE 🔥</span>
                    )}
                  </h3>
                  <p className="text-blue-100 leading-relaxed">{milestone.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Key Message */}
            <div className="mt-12 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl text-center">
              <p className="text-xl font-semibold text-white mb-2">
                Early adopters gain a 3-5 year competitive advantage
              </p>
              <p className="text-blue-100">
                Just like early Salesforce adopters in 2004 or early AI tool users in 2020—being
                first compounds over time.
              </p>
            </div>
          </div>
        </section>

        {/* Founding Teams - Social Proof */}
        <SocialProof />

        {/* FAQ Section */}
        <FAQSection />

        {/* Marketing Terms */}
        <TermDefinitions showAdvanced />

        {/* Final CTA */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join the Founding Teams
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                We're building this in partnership with 3 forward-thinking businesses. 7 founding
                slots remain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Try Interactive Demo
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                >
                  Book Founder Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default AboutPage
