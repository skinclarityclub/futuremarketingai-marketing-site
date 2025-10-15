/**
 * Hero Section Component
 * Converted from Next.js to React Router
 * Source: future-marketing-ai-hero.tsx
 */

import React, { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Sparkles, TrendingUp, Play, Zap, Brain, Bot, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'

// Lazy load heavy components for performance
const VisionTimeline = lazy(() =>
  import('../common/VisionTimeline').then((module) => ({
    default: module.VisionTimeline,
  }))
)

const FeatureShowcase = lazy(() =>
  import('./FeatureShowcase').then((module) => ({
    default: module.FeatureShowcase,
  }))
)

// Fixed positions to prevent hydration mismatch
const NEURAL_NODES = [
  { x: 93.38, y: 40.68 },
  { x: 70.07, y: 50.82 },
  { x: 31.68, y: 28.83 },
  { x: 71.44, y: 2.63 },
  { x: 4.61, y: 23.71 },
  { x: 84.47, y: 7.66 },
  { x: 29.16, y: 47.8 },
  { x: 98.19, y: 87.97 },
  { x: 11.9, y: 58.98 },
  { x: 70.58, y: 18.82 },
  { x: 56.53, y: 18.15 },
  { x: 30.93, y: 92.44 },
]

const PARTICLE_POSITIONS = [
  { x: 14.58, y: 14.98, size: 4.58 },
  { x: 74.99, y: 2.8, size: 1.1 },
  { x: 69.14, y: 61.05, size: 3.58 },
  { x: 82.4, y: 55.2, size: 4.29 },
  { x: 71.34, y: 39.42, size: 2.77 },
  { x: 42.54, y: 31.28, size: 3.25 },
  { x: 17.99, y: 97.19, size: 1.42 },
  { x: 81.78, y: 42.08, size: 3.19 },
  { x: 26.33, y: 95.51, size: 2.22 },
  { x: 92.36, y: 20.77, size: 2.63 },
  { x: 41.39, y: 56.8, size: 2.63 },
  { x: 3.61, y: 80.42, size: 2.99 },
  { x: 16.44, y: 16.6, size: 2.02 },
  { x: 26.78, y: 54.11, size: 2.86 },
  { x: 46.53, y: 21.19, size: 4.18 },
  { x: 71.54, y: 26.13, size: 1.24 },
  { x: 53.57, y: 77.37, size: 1.98 },
  { x: 98.26, y: 57.87, size: 4.3 },
  { x: 13.28, y: 15.85, size: 2.34 },
  { x: 47.18, y: 92.42, size: 4.7 },
  { x: 42.55, y: 76.8, size: 4.17 },
  { x: 71.07, y: 46.02, size: 4.9 },
  { x: 47.68, y: 29.54, size: 2.96 },
  { x: 11.98, y: 65.11, size: 1.38 },
  { x: 78.58, y: 86.42, size: 3.5 },
  { x: 27.63, y: 66.8, size: 2.09 },
  { x: 54.48, y: 95.44, size: 3.1 },
  { x: 45.3, y: 1.29, size: 3.1 },
  { x: 25.43, y: 84.01, size: 2.59 },
  { x: 27.48, y: 79.76, size: 2.98 },
  { x: 72.94, y: 91.25, size: 2.99 },
  { x: 65.45, y: 71.01, size: 4.24 },
  { x: 88.96, y: 32.46, size: 4.07 },
  { x: 94.87, y: 85.7, size: 1.91 },
  { x: 5.41, y: 69.62, size: 2.88 },
  { x: 77.01, y: 58.6, size: 4.96 },
  { x: 52.43, y: 48.46, size: 2.69 },
  { x: 42.03, y: 11.38, size: 1.82 },
  { x: 31.86, y: 23.15, size: 2.42 },
  { x: 52.28, y: 48.67, size: 2.74 },
  { x: 87.78, y: 49.1, size: 2.98 },
  { x: 37.83, y: 3.56, size: 1.9 },
  { x: 18.74, y: 15.96, size: 4.81 },
  { x: 1.68, y: 62.39, size: 4.5 },
  { x: 34.82, y: 90.63, size: 3.68 },
  { x: 45.61, y: 48.21, size: 1.71 },
  { x: 51.32, y: 39.9, size: 1.52 },
  { x: 68.11, y: 13.78, size: 3.66 },
  { x: 79.43, y: 86.62, size: 1.93 },
  { x: 51.24, y: 42.35, size: 2.76 },
]

// Neural Network Component
const NeuralNetwork: React.FC = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0 opacity-30" /> // Placeholder
  }

  return (
    <div className="absolute inset-0 opacity-30">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
          </radialGradient>
        </defs>

        {/* Render connections */}
        {NEURAL_NODES.map((node, i) =>
          NEURAL_NODES.slice(i + 1).map((targetNode, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${targetNode.x}%`}
              y2={`${targetNode.y}%`}
              stroke="url(#gradient)"
              strokeWidth="1"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 0.3, pathLength: 1 }}
              transition={{
                duration: 2,
                delay: i * 0.1 + j * 0.05,
                ease: 'easeInOut',
              }}
            />
          ))
        )}

        {/* Render nodes */}
        {NEURAL_NODES.map((node, i) => (
          <motion.circle
            key={i}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="3"
            fill="url(#nodeGradient)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.8,
              delay: i * 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// Holographic Grid Component
const HolographicGrid: React.FC = () => (
  <div className="absolute inset-0 opacity-20">
    <div
      className="w-full h-full"
      style={{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
    />
  </div>
)

// Floating Particles Component
const FloatingParticles: React.FC = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0" /> // Placeholder
  }

  return (
    <div className="absolute inset-0">
      {PARTICLE_POSITIONS.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute bg-blue-400/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}

// Gradient Orbs Component
const GradientOrbs: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [360, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
    <motion.div
      className="absolute top-3/4 left-3/4 w-48 h-48 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
      }}
      animate={{
        scale: [1, 1.3, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  </div>
)

export const Hero: React.FC = () => {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const controls = useAnimation()
  // t and showQualificationForm removed - not used in this static version

  useEffect(() => {
    if (isInView) {
      void controls.start('visible')
    }
  }, [isInView, controls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
        ease: 'easeOut',
      },
    },
  }

  // Hardcoded translations for now (can be moved to i18n later)
  const heroText = {
    badge: 'Next-Gen AI Marketing',
    mainHeadline: 'Turn content into growth.',
    subHeadline: 'On autopilot.',
    description:
      'Revolutionary AI-powered marketing automation that transforms premium businesses into market leaders. Experience enterprise-grade intelligent marketing designed for ambitious growth.',
    cta: {
      primary: 'Try Interactive Demo',
      secondary: 'Join Waitlist',
    },
  }

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
    >
      {/* Background Effects */}
      <HolographicGrid />
      <NeuralNetwork />
      <FloatingParticles />
      <GradientOrbs />

      {/* Main Hero Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 py-20"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Badge */}
        <motion.div className="flex justify-center mb-8" variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium">{heroText.badge}</span>
            <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div className="text-center mb-6 md:mb-8" variants={itemVariants}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-black mb-4">
            <motion.span
              className="block bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {heroText.mainHeadline}
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {heroText.subHeadline}
            </motion.span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 text-center max-w-4xl mx-auto mb-8 md:mb-12 leading-relaxed px-4"
          variants={itemVariants}
        >
          {heroText.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-16 md:mb-20 px-4"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={() => window.open('/demo', '_blank')}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-2xl transition-all duration-300 w-full sm:w-auto"
            >
              <Zap className="mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:rotate-12 transition-transform" />
              {heroText.cta.primary}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              onClick={() => (window.location.href = '/pricing')}
              className="group bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 w-full sm:w-auto"
            >
              <Play className="mr-2 h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
              {heroText.cta.secondary}
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-10 text-blue-400"
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
            <Bot className="h-8 w-8" />
          </motion.div>

          <motion.div
            className="absolute top-1/3 right-16 text-purple-400"
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
            <Brain className="h-10 w-10" />
          </motion.div>

          <motion.div
            className="absolute bottom-1/4 left-1/4 text-cyan-400"
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
            <TrendingUp className="h-6 w-6" />
          </motion.div>

          <motion.div
            className="absolute bottom-1/3 right-1/4 text-green-400"
            animate={{
              y: [10, -10, 10],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Zap className="h-7 w-7" />
          </motion.div>
        </div>
      </motion.div>

      {/* Placeholder sections - Components temporarily disabled for debugging */}
      {/* 1. WHY NOW? - VisionTimeline showing urgency of Pioneer Window */}
      <motion.section
        className="relative z-10 max-w-7xl mx-auto px-6 py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
          }
        >
          <VisionTimeline />
        </Suspense>
      </motion.section>

      {/* 2. HOW? - Feature Showcase showing key capabilities */}
      <motion.section
        className="relative z-10 max-w-7xl mx-auto px-6 py-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm mb-4">
            <span className="text-sm font-semibold text-blue-300">The Solution</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How We Make It Happen</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            8 autonomous modules working 24/7 to accelerate your growth
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
          }
        >
          <FeatureShowcase />
        </Suspense>
      </motion.section>

      {/* Final CTA Section */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 pb-20 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Claim Your Pioneer Advantage?
        </h3>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join the first 10 teams building an unfair 2-3 year lead before mainstream adoption
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Button
            size="lg"
            onClick={() => (window.location.href = '/pricing')}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-2xl"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Join Waitlist - 2 Slots Left
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
