import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bot, Brain, TrendingUp } from 'lucide-react'
import { useIsMobile } from '../../hooks'
import { DesktopOnlyNoticeModal } from '../mobile'

interface DemoIntroProps {
  /** Target page after intro (explorer, calculator, dashboard, demo) */
  targetPage?: 'explorer' | 'calculator' | 'dashboard' | 'demo'
}

export function DemoIntro({ targetPage = 'demo' }: DemoIntroProps) {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const { t } = useTranslation('common')
  const [showHeroAnimation, setShowHeroAnimation] = useState(true)
  const [showDesktopNotice, setShowDesktopNotice] = useState(false)

  useEffect(() => {
    // Hero animatie voor 2.5 seconden
    const timer = setTimeout(() => {
      setShowHeroAnimation(false)
      
      if (isMobile) {
        // Mobile: Toon desktop notice
        setShowDesktopNotice(true)
      } else {
        // Desktop: Direct naar demo
        const routes: Record<string, string> = {
          explorer: '/explorer',
          calculator: '/calculator',
          dashboard: '/dashboard',
          demo: '/demo',
        }
        navigate(routes[targetPage])
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [isMobile, navigate, targetPage])

  const handleCloseNotice = () => {
    setShowDesktopNotice(false)
    // Ga terug naar homepage
    navigate('/')
  }

  // Animation variants (same as desktop Hero)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <>
      {/* Hero Animation - EXACT SAME AS DESKTOP */}
      {showHeroAnimation && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/90 to-slate-900"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
        >
          {/* Animated gradient background (same as desktop) */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_65%)] animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.15)_0%,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(6,182,212,0.15)_0%,transparent_50%)]" />
          </div>

          {/* Particle field (same as desktop) */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main content (same structure as desktop) */}
          <motion.div
            className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
            variants={containerVariants}
          >
            {/* Badge (exact same as desktop) */}
            <motion.div className="flex justify-center mb-6 md:mb-8" variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-sm font-medium">{t('landing.hero_landing.badge')}</span>
                <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
              </div>
            </motion.div>

            {/* Main Headline (exact same as desktop) */}
            <motion.div className="text-center mb-6 md:mb-8" variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4">
                <motion.span
                  className="block bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {t('landing.hero_landing.main_headline')}
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {t('landing.hero_landing.sub_headline')}
                </motion.span>
              </h1>
            </motion.div>

            {/* Description (exact same as desktop) */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-blue-100 text-center max-w-3xl mx-auto mb-8 leading-relaxed"
              variants={itemVariants}
            >
              {t('landing.hero_landing.description')}
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              className="flex justify-center items-center gap-2 mt-12"
              variants={itemVariants}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-blue-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-purple-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-cyan-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </motion.div>

            {/* Floating Icons (same as desktop) */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute top-1/4 left-10 text-blue-400 opacity-60"
                animate={{
                  y: [-20, 20, -20],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Bot className="h-6 w-6 md:h-8 md:w-8" />
              </motion.div>

              <motion.div
                className="absolute top-1/3 right-10 text-purple-400 opacity-60"
                animate={{
                  y: [20, -20, 20],
                  rotate: [360, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Brain className="h-8 w-8 md:h-10 md:w-10" />
              </motion.div>

              <motion.div
                className="absolute bottom-1/4 left-1/4 text-cyan-400 opacity-60"
                animate={{
                  y: [-15, 15, -15],
                  x: [-10, 10, -10],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Desktop Notice Modal (alleen op mobile) */}
      {isMobile && showDesktopNotice && (
        <DesktopOnlyNoticeModal
          isOpen={showDesktopNotice}
          onClose={handleCloseNotice}
          pageName={targetPage}
        />
      )}
    </>
  )
}

DemoIntro.displayName = 'DemoIntro'

