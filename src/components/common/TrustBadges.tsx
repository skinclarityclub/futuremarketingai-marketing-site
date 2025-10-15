import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// ============================================================================
// Types
// ============================================================================

export interface TrustBadgeConfig {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled: boolean
}

interface TrustBadgesProps {
  badges: TrustBadgeConfig[]
  title?: string
  subtitle?: string
  className?: string
}

// ============================================================================
// SVG Badge Icons
// ============================================================================

const GDPRIcon = () => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <rect width="120" height="120" rx="12" fill="url(#gdpr-gradient)" />
    <defs>
      <linearGradient
        id="gdpr-gradient"
        x1="0"
        y1="0"
        x2="120"
        y2="120"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00D4FF" stopOpacity="0.2" />
        <stop offset="1" stopColor="#8A2BE2" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <path
      d="M60 30C43.431 30 30 43.431 30 60C30 76.569 43.431 90 60 90C76.569 90 90 76.569 90 60C90 43.431 76.569 30 60 30ZM60 83C47.317 83 37 72.683 37 60C37 47.317 47.317 37 60 37C72.683 37 83 47.317 83 60C83 72.683 72.683 83 60 83Z"
      fill="currentColor"
      className="text-accent-primary"
    />
    <path
      d="M55 68L45 58L48 55L55 62L72 45L75 48L55 68Z"
      fill="currentColor"
      className="text-success"
    />
    <text x="60" y="105" textAnchor="middle" className="text-xs font-bold fill-white">
      GDPR
    </text>
  </svg>
)

const ISO27001Icon = () => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <rect width="120" height="120" rx="12" fill="url(#iso-gradient)" />
    <defs>
      <linearGradient
        id="iso-gradient"
        x1="0"
        y1="0"
        x2="120"
        y2="120"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FF88" stopOpacity="0.2" />
        <stop offset="1" stopColor="#00D4FF" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <path
      d="M60 30L35 45V65L60 80L85 65V45L60 30ZM60 37L78 48.5V61.5L60 73L42 61.5V48.5L60 37Z"
      fill="currentColor"
      className="text-success"
    />
    <circle cx="60" cy="55" r="8" fill="currentColor" className="text-accent-primary" />
    <text x="60" y="102" textAnchor="middle" className="text-[10px] font-bold fill-white">
      ISO
    </text>
    <text x="60" y="112" textAnchor="middle" className="text-[8px] font-semibold fill-white/70">
      27001
    </text>
  </svg>
)

const SOC2Icon = () => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <rect width="120" height="120" rx="12" fill="url(#soc2-gradient)" />
    <defs>
      <linearGradient
        id="soc2-gradient"
        x1="0"
        y1="0"
        x2="120"
        y2="120"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8A2BE2" stopOpacity="0.2" />
        <stop offset="1" stopColor="#00FF88" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <path
      d="M60 30C60 30 40 35 40 50V65C40 77 60 85 60 85C60 85 80 77 80 65V50C80 35 60 30 60 30Z"
      fill="currentColor"
      className="text-accent-secondary"
    />
    <path
      d="M54 62L50 58L52 56L54 58L66 46L68 48L54 62Z"
      fill="currentColor"
      className="text-white"
    />
    <text x="60" y="105" textAnchor="middle" className="text-xs font-bold fill-white">
      SOC 2
    </text>
  </svg>
)

const SSLIcon = () => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <rect width="120" height="120" rx="12" fill="url(#ssl-gradient)" />
    <defs>
      <linearGradient
        id="ssl-gradient"
        x1="0"
        y1="0"
        x2="120"
        y2="120"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00D4FF" stopOpacity="0.2" />
        <stop offset="1" stopColor="#00FF88" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <rect
      x="45"
      y="50"
      width="30"
      height="25"
      rx="3"
      fill="currentColor"
      className="text-accent-primary"
    />
    <path
      d="M50 50V45C50 39.477 54.477 35 60 35C65.523 35 70 39.477 70 45V50"
      stroke="currentColor"
      strokeWidth="4"
      className="text-success"
    />
    <circle cx="60" cy="62" r="3" fill="currentColor" className="text-white" />
    <text x="60" y="100" textAnchor="middle" className="text-[10px] font-bold fill-white">
      256-bit
    </text>
    <text x="60" y="110" textAnchor="middle" className="text-[9px] font-semibold fill-white/70">
      SSL
    </text>
  </svg>
)

// ============================================================================
// Component
// ============================================================================

export function TrustBadges({ badges, title, subtitle, className = '' }: TrustBadgesProps) {
  const { t } = useTranslation(['common'])

  // Use translations as defaults if props not provided
  const finalTitle = title || t('common:trust_badges.title')
  const finalSubtitle = subtitle || t('common:trust_badges.subtitle')

  // Filter enabled badges
  const enabledBadges = badges.filter((badge) => badge.enabled)

  if (enabledBadges.length === 0) {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">{finalTitle}</h3>
        <p className="text-white/90">{finalSubtitle}</p>
      </motion.div>

      {/* Badges Grid */}
      <motion.div
        className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {enabledBadges.map((badge) => (
          <motion.div
            key={badge.id}
            variants={itemVariants}
            className="group relative"
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Badge Container */}
            <div className="relative w-24 h-24 md:w-28 md:h-28">
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Badge Icon */}
              <div className="relative w-full h-full">{badge.icon}</div>

              {/* Verified Checkmark */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-success flex items-center justify-center ring-2 ring-background-primary">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-48 p-3 rounded-lg bg-background-secondary/95 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
              <p className="text-xs font-semibold text-text-primary mb-1">{badge.name}</p>
              <p className="text-xs text-white/80">{badge.description}</p>
              {/* Tooltip Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rotate-45 bg-background-secondary border-l border-t border-white/10" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// ============================================================================
// Pre-configured Badge Icons Export
// ============================================================================

export const TRUST_BADGE_ICONS = {
  GDPR: <GDPRIcon />,
  ISO27001: <ISO27001Icon />,
  SOC2: <SOC2Icon />,
  SSL: <SSLIcon />,
}
