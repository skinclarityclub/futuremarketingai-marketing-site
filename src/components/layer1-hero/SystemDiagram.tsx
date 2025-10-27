import React, { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  useSmoothedMousePosition,
  useScrollPosition,
  useIntersectionObserver,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersReducedMotion,
} from '../../hooks'

// Legacy compatibility
const useBreakpoints = () => ({
  isMobile: useIsMobile(),
  isTablet: useIsTablet(),
  isDesktop: useIsDesktop(),
})
const useReducedMotion = usePrefersReducedMotion

// Lazy load the 3D component for better performance
const CoreSphere3D = lazy(() =>
  import('./CoreSphere3D').then((module) => ({ default: module.CoreSphere3D }))
)
const ParticleSystem = lazy(() =>
  import('./ParticleSystem').then((module) => ({ default: module.ParticleSystem }))
)
import { SatelliteNode } from './SatelliteNode'
import { ConnectionBeam, type BeamNode } from './ConnectionBeam'
import { HolographicInfoPanel, type NodeData } from './HolographicInfoPanel'

/**
 * SystemDiagram 3.0 - Premium animated visualization of AI system architecture
 *
 * Features:
 * - 3D rotating AI Core sphere with custom shaders (NEW!)
 * - SVG-based module layout with connecting lines
 * - Pulsating AI core animation
 * - Animated data flow lines (stroke-dashoffset)
 * - Moving data particles along paths
 * - Mouse parallax interaction (NEW!)
 * - Fully responsive design
 */

interface Module extends NodeData {
  x: number
  y: number
  glow: string
  icon: React.ReactNode
}

interface Connection {
  from: string
  to: string
  path: string
}

export const SystemDiagram: React.FC = () => {
  const { t } = useTranslation(['common'])
  const containerRef = useRef<HTMLDivElement | null>(null)

  // State for hover and click interactions
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  // Ref to track selected module for stable callbacks
  const selectedModuleRef = useRef<string | null>(null)

  // Keep ref in sync with state
  useEffect(() => {
    selectedModuleRef.current = selectedModule
  }, [selectedModule])

  // Use centralized mouse tracking hook for smooth parallax
  const { smoothX, smoothY } = useSmoothedMousePosition(0.08)

  // Track scroll position for scroll-based animations
  const scroll = useScrollPosition({ throttle: 16, trackVelocity: true })

  // Observe when diagram is visible to pause/resume animations
  const [diagramRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.3, // Trigger when 30% visible
    rootMargin: '100px', // Start animating slightly before entering viewport
  })

  // Detect idle state for autonomous animations (reserved for future features)
  // const idleTime = useIdleTime(100) // Update every 100ms
  // const isIdle = idleTime > 2000 // Idle after 2 seconds

  // Responsive breakpoints
  const { isMobile, isTablet } = useBreakpoints()

  // Accessibility: Respect user's motion preferences
  const prefersReducedMotion = useReducedMotion()

  // Calculate responsive parallax offsets (reduce on mobile/reduced motion)
  const parallaxMultiplier = prefersReducedMotion ? 0 : isMobile ? 0.3 : isTablet ? 0.6 : 1
  const parallaxOffsets = {
    // Background layer - slowest parallax (20% intensity)
    background: {
      x: (smoothX - 0.5) * 20 * parallaxMultiplier,
      y: (smoothY - 0.5) * 20 * parallaxMultiplier,
    },
    // Core sphere - medium parallax (40% intensity)
    core: {
      x: (smoothX - 0.5) * 40 * parallaxMultiplier,
      y: (smoothY - 0.5) * 40 * parallaxMultiplier,
    },
    // SVG/Nodes layer - fastest parallax (60% intensity)
    nodes: {
      x: (smoothX - 0.5) * 60 * parallaxMultiplier,
      y: (smoothY - 0.5) * 60 * parallaxMultiplier,
    },
  }

  // Calculate scroll-based rotation (disable for reduced motion)
  const scrollRotationMultiplier = prefersReducedMotion ? 0 : 1
  const scrollRotation = scroll.scrollY * 0.001 * scrollRotationMultiplier
  const scrollVelocityFactor = prefersReducedMotion
    ? 0
    : Math.min(Math.abs(scroll.velocity) / 1000, 2)

  // Idle state animations (disable for reduced motion)
  // Note: These are reserved for future idle animation features
  // const idleAnimationPhase = (isIdle && !prefersReducedMotion) ? (idleTime / 5000) % 1 : 0
  // const idleIntensity = (isIdle && !prefersReducedMotion) ? Math.min(idleTime / 2000, 1) : 0

  // Calculate particle spawn rate based on device (performance optimization)
  const particleSpawnRate = prefersReducedMotion
    ? 1 // Minimal particles for reduced motion
    : isMobile
      ? 3 // Low count on mobile
      : isTablet
        ? 5 // Medium count on tablet
        : 8 // Full count on desktop

  // Stable callback for closing panel (prevents re-renders)
  const handleClosePanel = useCallback(() => {
    setSelectedModule(null)
  }, [])

  // Stable hover handler - COMPLETELY IGNORES hover when panel is open
  const handleModuleHover = useCallback((id: string | null) => {
    // CRITICAL: Check if panel is open using ref (stable reference)
    if (selectedModuleRef.current !== null) {
      // Panel is open - DO NOTHING, prevent ANY state update
      return
    }
    // Panel is closed - safe to update hover
    setHoveredModule(id)
  }, [])

  // Stable click handler
  const handleModuleClick = useCallback((id: string) => {
    setSelectedModule((current) => (current === id ? null : id))
    setHoveredModule(null)
  }, [])

  // Navigation between modules
  const handlePanelNavigate = useCallback((direction: 'prev' | 'next') => {
    setSelectedModule((currentId) => {
      if (!currentId) {
        return null
      }

      // Find current module index
      const currentIndex = modules.findIndex((m) => m.id === currentId)
      if (currentIndex === -1) {
        return currentId
      }

      // Calculate next index
      let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1

      // Wrap around
      if (nextIndex >= modules.length) {
        nextIndex = 0
      }
      if (nextIndex < 0) {
        nextIndex = modules.length - 1
      }

      return modules[nextIndex].id
    })
    setHoveredModule(null)
  }, [])

  // Stable beam hover handler
  const handleBeamHover = useCallback((beamId: string | null) => {
    // CRITICAL: Check if panel is open using ref
    if (selectedModuleRef.current !== null) {
      // Panel is open - DO NOTHING
      return
    }

    if (beamId) {
      const parts = beamId.split('-')
      setHoveredModule(parts[1])
    } else {
      setHoveredModule(null)
    }
  }, [])

  // Stable beam click handler
  const handleBeamClick = useCallback((beamId: string) => {
    const parts = beamId.split('-')
    const moduleId = parts[1]
    setSelectedModule((current) => (current === moduleId ? null : moduleId))
    setHoveredModule(null)
  }, [])

  // Define AI system modules - Complete Marketing Workflow Cycle
  // CENTER: Manager Workflow (Het Hart) + 6 SATELLITES in circular flow
  // EXPORTED: Module node positions for Neural Warp Transition
  const modules: Module[] = [
    {
      id: 'core',
      label: 'Manager Core',
      description: 'Central workflow orchestration, A/B testing, and Telegram command hub',
      x: 50,
      y: 50,
      color: '#00D4FF',
      glow: '0 0 30px rgba(0, 212, 255, 0.6)',
      status: 'active',
      painPoint: 'Manual Workflow Chaos',
      monthlySavings: 2800,
      stats: [
        { label: 'Workflows', value: '247', trend: 'up' },
        { label: 'A/B Tests', value: '89', trend: 'up' },
        { label: 'Commands', value: '1.2K', trend: 'up' },
        { label: 'Success', value: '97.8%', trend: 'up' },
      ],
      features: [
        'Weekly agenda distribution',
        'A/B testing coordination',
        'Telegram bot integration',
        'Quality control workflow',
        'Multi-account orchestration',
      ],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
        </svg>
      ),
    },
    // 1. RESEARCH HUB (Het Brein) - Top position (12 o'clock)
    {
      id: 'research',
      label: 'Research Hub',
      description: 'Deep multi-agent research: trends, hashtags, and weekly theme planning',
      x: 50,
      y: 12,
      color: '#9333EA',
      glow: '0 0 20px rgba(147, 51, 234, 0.5)',
      status: 'processing',
      painPoint: 'Geen Tijd voor Strategie',
      monthlySavings: 3200,
      stats: [
        { label: 'AI Agents', value: '4', trend: 'neutral' },
        { label: 'Trends Found', value: '842', trend: 'up' },
        { label: 'Hashtags', value: '3.2K', trend: 'up' },
        { label: 'Themes/Week', value: '1', trend: 'neutral' },
      ],
      features: [
        '4 parallel AI research agents',
        'Trend forecasting & analysis',
        'Hashtag discovery & tracking',
        'Weekly theme generation',
        'Brand/product integration',
        'Multi-language research',
      ],
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
      ),
    },
    // 2. CONTENT FACTORY - Right-top position (2 o'clock)
    {
      id: 'content',
      label: 'Content Factory',
      description: 'Multi-platform content generation: Instagram, TikTok, YouTube, LinkedIn, Blogs',
      x: 84,
      y: 23,
      color: '#EC4899',
      glow: '0 0 20px rgba(236, 72, 153, 0.5)',
      status: 'active',
      painPoint: 'Kan Niet Schalen',
      monthlySavings: 4500,
      stats: [
        { label: 'Platforms', value: '7', trend: 'neutral' },
        { label: 'Posts/Maand', value: '160', trend: 'up' },
        { label: 'Formats', value: '12+', trend: 'neutral' },
        { label: 'Quality', value: '94%', trend: 'up' },
      ],
      features: [
        'Instagram: Posts, Carousels, Reels, Stories',
        'Facebook, TikTok, YouTube, LinkedIn',
        'Website & Webshop blogs',
        'Multi-language content',
        'Self-learning AI optimization',
        'Telegram approval system',
      ],
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    // 3. PUBLISHING ENGINE - Right-bottom position (4 o'clock)
    {
      id: 'publishing',
      label: 'Publishing Engine',
      description: 'Auto-scheduling and intelligent posting at optimal times per platform',
      x: 84,
      y: 77,
      color: '#10B981',
      glow: '0 0 20px rgba(16, 185, 129, 0.5)',
      status: 'active',
      painPoint: 'Inconsistent Posting',
      monthlySavings: 1800,
      stats: [
        { label: 'Scheduled', value: '160', trend: 'up' },
        { label: 'Posts/Maand', value: '160', trend: 'neutral' },
        { label: 'On-Time', value: '99.8%', trend: 'neutral' },
        { label: 'Platforms', value: '7', trend: 'neutral' },
      ],
      features: [
        'Platform-specific optimal timing',
        'Auto-scheduling calendar',
        'Multi-platform distribution',
        'Queue management',
        'Timezone optimization',
      ],
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    // 4. ANALYTICS MONITOR - Bottom position (6 o'clock)
    {
      id: 'analytics',
      label: 'Analytics Monitor',
      description: 'Performance tracking, winner detection, and multi-account ROI optimization',
      x: 50,
      y: 88,
      color: '#06B6D4',
      glow: '0 0 20px rgba(6, 182, 212, 0.5)',
      status: 'active',
      painPoint: 'Blind Flying',
      monthlySavings: 2400,
      stats: [
        { label: 'Daily Scans', value: '7', trend: 'neutral' },
        { label: 'Winners', value: '47', trend: 'up' },
        { label: 'ROI Boost', value: '+285%', trend: 'up' },
        { label: 'Accounts', value: '12', trend: 'neutral' },
      ],
      features: [
        'Daily performance analysis',
        'Winner content detection',
        'Sub-account → Main promotion',
        'Strategy comparison testing',
        'ROI optimization before ads',
        'Engagement pattern learning',
      ],
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    // 5. COMMAND CENTER - Left-bottom position (8 o'clock)
    {
      id: 'command',
      label: 'Command Center',
      description: 'Client dashboard: campaigns, ads, analytics, and content calendar overview',
      x: 16,
      y: 77,
      color: '#F59E0B',
      glow: '0 0 20px rgba(245, 158, 11, 0.5)',
      status: 'idle',
      painPoint: 'Geen Centraal Overzicht',
      monthlySavings: 1600,
      stats: [
        { label: 'Campaigns', value: '24', trend: 'up' },
        { label: 'Active Ads', value: '8', trend: 'neutral' },
        { label: 'Calendar', value: '100%', trend: 'neutral' },
        { label: 'Reports', value: '48', trend: 'up' },
      ],
      features: [
        'Campaign launcher',
        'Product photo → Ad creator',
        'Real-time platform insights',
        'Content calendar view',
        'Weekly research reports',
        'Engagement & growth metrics',
      ],
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
    },
    // 6. AUTOMATION ENGINE - Left-top position (10 o'clock)
    {
      id: 'automation',
      label: 'Automation Engine',
      description: 'Self-learning system with Telegram approval and quality control',
      x: 16,
      y: 23,
      color: '#8B5CF6',
      glow: '0 0 20px rgba(139, 92, 246, 0.5)',
      status: 'active',
      painPoint: 'Geen Automation Expertise',
      monthlySavings: 3500,
      stats: [
        { label: 'Approvals', value: '892', trend: 'up' },
        { label: 'Auto-Learn', value: '98%', trend: 'up' },
        { label: 'Quality', value: '96.2%', trend: 'up' },
        { label: 'Workflows', value: '47', trend: 'neutral' },
      ],
      features: [
        'Telegram approval system',
        'Self-learning from feedback',
        'Quality score tracking',
        'Content rejection analysis',
        'Continuous improvement',
        'Smart workflow automation',
      ],
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ]

  // Define connections between Manager Core and all 6 satellites (hexagon pattern)
  const connections: Connection[] = [
    { from: 'core', to: 'research', path: 'M 50 50 L 50 12' }, // Top
    { from: 'core', to: 'content', path: 'M 50 50 L 84 23' }, // Right-top
    { from: 'core', to: 'publishing', path: 'M 50 50 L 84 77' }, // Right-bottom
    { from: 'core', to: 'analytics', path: 'M 50 50 L 50 88' }, // Bottom
    { from: 'core', to: 'command', path: 'M 50 50 L 16 77' }, // Left-bottom
    { from: 'core', to: 'automation', path: 'M 50 50 L 16 23' }, // Left-top
  ]

  // Note: Mouse tracking is now handled by useSmoothedMousePosition hook
  // Parallax effects are calculated above and applied via CSS transforms

  // Merge refs for container (both containerRef and diagramRef)
  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node
      if (diagramRef) {
        // @ts-ignore - ref callback typing
        diagramRef.current = node
      }
    },
    [diagramRef]
  )

  return (
    <div
      ref={mergedRef}
      className="relative w-full h-full min-h-[600px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50"
      role="application"
      aria-label={t('common:accessibility.interactive_diagram')}
      tabIndex={0}
    >
      {/* Particle System Background Layer - Elegant cosmic starfield with subtle parallax */}
      <Suspense fallback={null}>
        <motion.div
          className="absolute inset-0"
          style={{
            transform: `translate(${parallaxOffsets.background.x}px, ${parallaxOffsets.background.y}px)`,
          }}
          transition={{
            type: 'spring',
            stiffness: prefersReducedMotion ? 200 : 50,
            damping: prefersReducedMotion ? 40 : 20,
          }}
        >
          <ParticleSystem
            className="absolute inset-0"
            spawnRate={particleSpawnRate}
            enablePerformanceMonitor={false}
          />
        </motion.div>
      </Suspense>

      {/* 3D Core Sphere Layer with medium parallax and scroll-based rotation */}
      <Suspense fallback={<div className="absolute inset-0" style={{ zIndex: 10 }} />}>
        <motion.div
          className="absolute inset-0"
          style={{
            zIndex: 10,
            transform: `translate(${parallaxOffsets.core.x}px, ${parallaxOffsets.core.y}px)`,
          }}
          transition={{
            type: 'spring',
            stiffness: prefersReducedMotion ? 200 : 80,
            damping: prefersReducedMotion ? 40 : 25,
          }}
        >
          <CoreSphere3D
            mouseX={smoothX}
            mouseY={smoothY}
            scrollRotation={scrollRotation}
            scrollVelocity={scrollVelocityFactor}
            isVisible={isVisible && !prefersReducedMotion}
          />
        </motion.div>
      </Suspense>

      {/* SVG Layer - Modules and Lines with fastest parallax */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
        aria-hidden="false"
        style={{
          zIndex: 20,
          transform: `translate(${parallaxOffsets.nodes.x}px, ${parallaxOffsets.nodes.y}px)`,
        }}
        transition={{
          type: 'spring',
          stiffness: prefersReducedMotion ? 200 : 100,
          damping: prefersReducedMotion ? 40 : 30,
        }}
      >
        <title>AI System Architecture</title>
        <desc>
          Interactive diagram showing the AI Core connected to four modules: Content Generation,
          Analytics, Automation, and Insights. Animated lines and particles represent active data
          flow between components.
        </desc>
        {/* Premium Bezier Connection Beams with Side Sparks */}
        <g className="connections">
          {connections.map((connection) => {
            const fromModule = modules.find((m) => m.id === connection.from)
            const toModule = modules.find((m) => m.id === connection.to)

            if (!fromModule || !toModule) {
              return null
            }

            // Create beam nodes
            const fromNode: BeamNode = {
              x: fromModule.x,
              y: fromModule.y,
              color: fromModule.color,
            }

            const toNode: BeamNode = {
              x: toModule.x,
              y: toModule.y,
              color: toModule.color,
            }

            // Highlight if either connected module is selected
            const intensity =
              selectedModule === connection.from || selectedModule === connection.to ? 1 : 0.7

            return (
              <ConnectionBeam
                key={`beam-${connection.from}-${connection.to}`}
                id={`${connection.from}-${connection.to}`}
                from={fromNode}
                to={toNode}
                intensity={intensity}
                isInteractive={!selectedModule}
                onHover={handleBeamHover}
                onClick={handleBeamClick}
              />
            )
          })}
        </g>

        {/* Modules - Using SatelliteNode components */}
        {modules.map((module) => (
          <SatelliteNode
            key={module.id}
            id={module.id}
            label={module.label}
            description={module.description}
            icon={module.icon}
            x={module.x}
            y={module.y}
            color={module.color}
            isHovered={!selectedModule && hoveredModule === module.id}
            isSelected={selectedModule === module.id}
            onHover={handleModuleHover}
            onClick={handleModuleClick}
          />
        ))}

        {/* SVG Filters for Components */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </motion.svg>

      {/* Holographic Info Panel for Selected Module */}
      {selectedModule &&
        (() => {
          const module = modules.find((m) => m.id === selectedModule)
          if (!module) {
            return null
          }

          // Calculate navigation availability
          const currentIndex = modules.findIndex((m) => m.id === selectedModule)
          const canNavigatePrev = currentIndex > 0 || modules.length > 1 // Wrap around
          const canNavigateNext = currentIndex < modules.length - 1 || modules.length > 1 // Wrap around

          return (
            <>
              {/* Click outside to close overlay */}
              <div
                className="fixed inset-0"
                style={{ zIndex: 99 }}
                onClick={handleClosePanel}
                aria-hidden="true"
              />

              <HolographicInfoPanel
                nodeData={module}
                position={{ x: module.x, y: module.y }}
                isVisible={true}
                onClose={handleClosePanel}
                onNavigate={handlePanelNavigate}
                canNavigatePrev={canNavigatePrev}
                canNavigateNext={canNavigateNext}
                currentIndex={currentIndex}
                totalModules={modules.length}
              />
            </>
          )
        })()}
    </div>
  )
}

export default SystemDiagram
