import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SiOpenai, SiAnthropic, SiGoogle, SiPerplexity } from 'react-icons/si'

// ============================================================================
// Types
// ============================================================================

export interface TechStackItem {
  id: string
  name: string
  logo: React.ReactNode
  alt: string
}

interface TechStackBarProps {
  className?: string
  label?: string
  items?: TechStackItem[]
}

// ============================================================================
// AI Technology Logo Components (Official logos via Simple Icons)
// ============================================================================

const OpenAILogo = () => <SiOpenai className="w-full h-full" style={{ color: '#10a37f' }} />
const AnthropicLogo = () => <SiAnthropic className="w-full h-full" style={{ color: '#CC9B7A' }} />
const GoogleLogo = () => <SiGoogle className="w-full h-full" style={{ color: '#4285f4' }} />
const PerplexityLogo = () => <SiPerplexity className="w-full h-full" style={{ color: '#20c5d3' }} />

// ============================================================================
// Default Tech Stack Items
// ============================================================================

export const DEFAULT_TECH_STACK: TechStackItem[] = [
  {
    id: 'openai',
    name: 'OpenAI GPT-4',
    logo: <OpenAILogo />,
    alt: 'OpenAI GPT-4',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    logo: <AnthropicLogo />,
    alt: 'Anthropic Claude',
  },
  {
    id: 'google',
    name: 'Google Gemini',
    logo: <GoogleLogo />,
    alt: 'Google Gemini',
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    logo: <PerplexityLogo />,
    alt: 'Perplexity AI',
  },
]

// ============================================================================
// Component
// ============================================================================

/**
 * TechStackBar - Display AI technology partners
 *
 * Shows logos of the AI technologies powering the platform
 * to borrow credibility from established brands.
 */
export const TechStackBar: React.FC<TechStackBarProps> = ({
  className = '',
  label,
  items = DEFAULT_TECH_STACK,
}) => {
  const { t } = useTranslation('hero')

  const displayLabel = label || t('tech_stack.label', 'Powered by Industry-Leading AI:')

  return (
    <motion.div
      className={`w-full max-w-4xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Label */}
      <p className="text-center text-sm text-white/60 font-medium mb-6">{displayLabel}</p>

      {/* Logo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:border-accent-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/10"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -4 }}
          >
            {/* Logo */}
            <div className="w-16 h-16 flex items-center justify-center">{item.logo}</div>

            {/* Name */}
            <p className="text-xs text-white/70 font-medium text-center">{item.name}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default TechStackBar
