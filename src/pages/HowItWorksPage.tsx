/**
 * How It Works Page - Deep dive into platform mechanics
 *
 * SEO-optimized page for "how does AI marketing work" keywords.
 * Includes FAQ, process overview, and terminology.
 */

import React from 'react'
import { ArrowRight, Brain, Settings, Zap, Send, BarChart3, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { StructuredDataPresets } from '../components/seo/StructuredData'
import { FAQSection } from '../components/seo/FAQSection'
import { TermDefinitions } from '../components/seo/TermDefinitions'

/**
 * Simplified process visualization
 */
const PROCESS_STEPS = [
  {
    icon: Brain,
    step: '1. AI Research',
    title: 'Platform Analyzes Your Market 24/7',
    description:
      'Our AI Research module monitors trends, competitors, and opportunities continuously. It identifies what content to create, when to publish, and which channels to prioritize.',
  },
  {
    icon: Zap,
    step: '2. Content Creation',
    title: 'AI Generates Premium Content at Scale',
    description:
      'Content Pipelines produce 15x more content than traditional methods. Every piece is optimized for your brand voice, target audience, and platform requirements.',
  },
  {
    icon: Settings,
    step: '3. Workflow Orchestration',
    title: 'Manager Coordinates Everything',
    description:
      'The Manager Orchestrator acts as your AI marketing coordinator, ensuring all modules work together seamlessly. No manual coordination needed.',
  },
  {
    icon: Send,
    step: '4. Smart Publishing',
    title: 'Optimal Distribution Across Channels',
    description:
      'Smart Publishing determines the best time, platform, and messaging for each piece of content. Achieves 35% better engagement through intelligent timing.',
  },
  {
    icon: BarChart3,
    step: '5. Continuous Learning',
    title: 'Analytics Learn and Improve',
    description:
      'Self-Learning Analytics track performance and identify winning patterns. The platform becomes 23% more effective each month by learning from every campaign.',
  },
  {
    icon: Target,
    step: '6. Ad Optimization',
    title: 'Best Content Becomes Ads',
    description:
      'Top-performing organic content is automatically converted to paid ads with optimized targeting and budget allocation. Delivers 3.2x better ROAS.',
  },
] as const

export const HowItWorksPage: React.FC = () => {
  return (
    <>
      {/* Simple Header */}
      <SimpleHeader />

      {/* SEO Meta Tags */}
      <SEOHead
        title="How It Works - Autonomous AI Marketing Explained | Future Marketing AI"
        description="Learn how Future Marketing AI's 6 autonomous modules work together to automate your entire marketing workflow. From AI research to self-learning optimization—completely hands-free."
        keywords={[
          'how AI marketing works',
          'marketing automation explained',
          'AI marketing process',
          'autonomous marketing system',
        ]}
        canonical="https://futuremarketingai.com/how-it-works"
      />

      {/* Structured Data - FAQPage */}
      <StructuredDataPresets.faqPage />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              How Does Future Marketing AI Work?
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              A fully autonomous system with 6 AI modules working 24/7 to research, create, publish,
              and optimize your marketing—completely hands-free.
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              The Autonomous Marketing Loop
            </h2>
            <div className="space-y-8">
              {PROCESS_STEPS.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col md:flex-row gap-6 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="text-sm font-semibold text-blue-300 mb-2">{step.step}</div>
                      <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-blue-100 leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Loop Indicator */}
            <div className="mt-8 text-center p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
              <p className="text-blue-100">
                <strong className="text-white">🔄 Continuous Loop:</strong> This process runs 24/7,
                with each iteration making the system smarter. By month 3, your marketing is 23%
                more effective. By month 12, it's transformational.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <FAQSection />

        {/* Marketing Terms */}
        <TermDefinitions showAdvanced />

        {/* Final CTA */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Experience It Yourself
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                The best way to understand how it works is to try it. Our interactive demo shows the
                complete system in action.
              </p>
              <a
                href="/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Launch Interactive Demo
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default HowItWorksPage
