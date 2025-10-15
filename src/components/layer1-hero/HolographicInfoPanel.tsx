import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'

/**
 * HolographicInfoPanel - Premium glassmorphic info panel with scan line effects
 *
 * Features:
 * - Glassmorphic background with backdrop-filter blur
 * - Animated holographic scan lines
 * - GSAP-driven smooth transitions
 * - Per-node dynamic content
 * - Color-coded accents matching node
 * - Accessibility with ARIA live regions
 * - Mobile modal fallback
 * - Reduced motion support
 */

// Map SystemDiagram module IDs to Explorer feature IDs
const MODULE_TO_EXPLORER_MAP: Record<string, string> = {
  research: 'research-planning',
  core: 'manager-workflow',
  content: 'content-pipeline',
  publishing: 'publishing-layer',
  analytics: 'analytics-monitoring',
  command: 'command-center',
  automation: 'content-pipeline', // Automation is part of content pipeline
}

export interface NodeData {
  id: string
  label: string
  description: string
  color: string
  stats?: {
    label: string
    value: string | number
    trend?: 'up' | 'down' | 'neutral'
  }[]
  features?: string[]
  status?: 'active' | 'idle' | 'processing'
  painPoint?: string // Optional pain point this module solves
  monthlySavings?: number // Optional monthly savings in euros
}

export interface HolographicInfoPanelProps {
  nodeData: NodeData | null
  position: { x: number; y: number } // Position in percentage (0-100)
  isVisible: boolean
  onClose?: () => void
  onNavigate?: (direction: 'prev' | 'next') => void
  canNavigatePrev?: boolean
  canNavigateNext?: boolean
  currentIndex?: number
  totalModules?: number
  className?: string
}

const HolographicInfoPanelComponent: React.FC<HolographicInfoPanelProps> = ({
  nodeData,
  isVisible,
  onClose,
  onNavigate,
  canNavigatePrev = false,
  canNavigateNext = false,
  currentIndex,
  totalModules,
  className = '',
}) => {
  const { t } = useTranslation(['common'])
  const panelRef = useRef<HTMLDivElement>(null)
  const scanLineRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)

  // GSAP animation for panel entry ONLY (not on every render)
  useEffect(() => {
    if (!panelRef.current || !isVisible || !nodeData) {
      return
    }

    // Reset animation flag when node changes
    hasAnimatedRef.current = false

    // Entry animation - only once per node
    if (!hasAnimatedRef.current) {
      gsap.fromTo(
        panelRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: -20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
        }
      )

      hasAnimatedRef.current = true
    }

    return () => {
      hasAnimatedRef.current = false
    }
  }, [isVisible, nodeData?.id])

  // Scan line animation
  useEffect(() => {
    if (!scanLineRef.current || !isVisible) {
      return
    }

    const tl = gsap.timeline({ repeat: -1 })
    tl.to(scanLineRef.current, {
      y: '100%',
      duration: 2,
      ease: 'none',
    }).to(scanLineRef.current, {
      y: '-100%',
      duration: 0,
    })

    return () => {
      tl.kill()
    }
  }, [isVisible])

  // Keyboard support: ESC to close, Arrow keys for navigation
  useEffect(() => {
    if (!isVisible) {
      return
    }

    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      } else if (e.key === 'ArrowLeft' && onNavigate && canNavigatePrev) {
        e.preventDefault()
        onNavigate('prev')
      } else if (e.key === 'ArrowRight' && onNavigate && canNavigateNext) {
        e.preventDefault()
        onNavigate('next')
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [isVisible, onClose, onNavigate, canNavigatePrev, canNavigateNext])

  // Don't render if not visible or no data
  if (!isVisible || !nodeData) {
    return null
  }

  // Center panel in viewport (ignore position prop)
  // Using fixed positioning for true centering

  return (
    <>
      {isVisible && nodeData && (
        <>
          {/* ARIA Live Region for Accessibility */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {`${nodeData.label} panel opened. ${nodeData.description}`}
          </div>

          {/* Holographic Info Panel - Centered & Responsive */}
          <div
            ref={panelRef}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto max-h-[90vh] w-[85vw] max-w-md ${className}`}
            style={{
              zIndex: 100,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glassmorphic Container */}
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(15, 23, 42, 0.95) 0%, 
                  rgba(30, 41, 59, 0.9) 100%)`,
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: `1px solid ${nodeData.color}40`,
                boxShadow: `
                  0 8px 32px rgba(0, 0, 0, 0.4),
                  0 0 0 1px ${nodeData.color}20,
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
              }}
            >
              {/* Animated Scan Line Overlay */}
              <div
                ref={scanLineRef}
                className="absolute left-0 right-0 h-1 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, 
                    transparent, 
                    ${nodeData.color}60, 
                    transparent)`,
                  filter: 'blur(1px)',
                  opacity: 0.4,
                  transform: 'translateY(-100%)',
                }}
              />

              {/* Top Accent Bar */}
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, 
                    transparent, 
                    ${nodeData.color}, 
                    transparent)`,
                }}
              />

              {/* Content Container - Scrollable */}
              <div
                className="p-5 space-y-4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: `${nodeData.color}40 transparent`,
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold truncate" style={{ color: nodeData.color }}>
                        {nodeData.label}
                      </h3>
                      {/* Module Counter */}
                      {currentIndex !== undefined && totalModules !== undefined && (
                        <span className="text-xs text-white/60 font-mono flex-shrink-0">
                          {currentIndex + 1}/{totalModules}
                        </span>
                      )}
                      {/* Pain Point Badge */}
                      {nodeData.painPoint && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 border border-orange-400/30 backdrop-blur-sm">
                          <svg
                            className="w-3 h-3 text-orange-400 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-[10px] font-semibold text-orange-300 uppercase tracking-wide">
                            Oplost: {nodeData.painPoint}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed line-clamp-3">
                      {nodeData.description}
                    </p>
                  </div>

                  {/* Navigation & Close Buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Previous Module Button */}
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('prev')}
                        disabled={!canNavigatePrev}
                        className={`p-1.5 rounded-lg transition-colors ${
                          canNavigatePrev
                            ? 'hover:text-white/80 hover:text-white'
                            : 'text-white/40 cursor-not-allowed'
                        }`}
                        aria-label={t('common:accessibility.previous_module')}
                        title={t('common:navigation.previous')}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                    )}

                    {/* Next Module Button */}
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('next')}
                        disabled={!canNavigateNext}
                        className={`p-1.5 rounded-lg transition-colors ${
                          canNavigateNext
                            ? 'hover:text-white/80 hover:text-white'
                            : 'text-white/40 cursor-not-allowed'
                        }`}
                        aria-label={t('common:accessibility.next_module')}
                        title={t('common:navigation.next')}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}

                    {/* Close Button */}
                    {onClose && (
                      <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:transition-colors"
                        aria-label={t('common:actions.close_panel')}
                        title={t('common:actions.close')}
                      >
                        <svg
                          className="w-4 h-4 text-white/80 hover:text-white transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                {nodeData.status && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: nodeData.color,
                        boxShadow: `0 0 8px ${nodeData.color}`,
                      }}
                    />
                    <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                      {nodeData.status}
                    </span>
                  </div>
                )}

                {/* Stats Grid */}
                {nodeData.stats && nodeData.stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {nodeData.stats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-black/20 rounded-lg p-2.5 border border-white/5"
                      >
                        <div className="text-xs text-white/70 mb-1 truncate">{stat.label}</div>
                        <div className="flex items-end gap-1.5">
                          <div
                            className="text-lg font-bold truncate"
                            style={{ color: nodeData.color }}
                          >
                            {stat.value}
                          </div>
                          {stat.trend && (
                            <div
                              className={`text-xs flex-shrink-0 ${
                                stat.trend === 'up'
                                  ? 'text-green-400'
                                  : stat.trend === 'down'
                                    ? 'text-red-400'
                                    : 'text-white/80'
                              }`}
                            >
                              {stat.trend === 'up' && '↑'}
                              {stat.trend === 'down' && '↓'}
                              {stat.trend === 'neutral' && '→'}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Features List */}
                {nodeData.features && nodeData.features.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                      Key Features
                    </div>
                    <div className="space-y-1">
                      {nodeData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm text-white/90 leading-relaxed"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: nodeData.color }}
                          />
                          <span className="break-words">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Monthly Savings Pill */}
                {nodeData.monthlySavings && (
                  <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-success/20 via-success/15 to-success/20 border border-success/30 backdrop-blur-sm">
                    <svg
                      className="w-4 h-4 text-success flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-white/70 font-medium">Saves you</span>
                      <span className="text-lg font-bold text-success font-mono">
                        €{nodeData.monthlySavings.toLocaleString()}/maand
                      </span>
                    </div>
                  </div>
                )}

                {/* Explore Module Button */}
                {MODULE_TO_EXPLORER_MAP[nodeData.id] && (
                  <Link
                    to={`/explorer#${MODULE_TO_EXPLORER_MAP[nodeData.id]}`}
                    className="group relative block w-full mt-4 p-3 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(135deg, ${nodeData.color}15, ${nodeData.color}05)`,
                      border: `1px solid ${nodeData.color}40`,
                    }}
                  >
                    {/* Animated gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${nodeData.color}20, transparent)`,
                      }}
                    />

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          style={{ color: nodeData.color }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="font-semibold text-sm" style={{ color: nodeData.color }}>
                          Verken Module
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        style={{ color: nodeData.color }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                )}

                {/* Bottom Glow Accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, 
                      transparent, 
                      ${nodeData.color}40, 
                      transparent)`,
                  }}
                />
              </div>

              {/* Corner Accent (decorative) */}
              <div
                className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top right, 
                    ${nodeData.color}15, 
                    transparent 70%)`,
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}

// Memoize component to prevent re-renders when parent state changes
export const HolographicInfoPanel = React.memo(
  HolographicInfoPanelComponent,
  (prevProps, nextProps) => {
    // Only re-render if these specific props change
    return (
      prevProps.isVisible === nextProps.isVisible &&
      prevProps.nodeData?.id === nextProps.nodeData?.id &&
      prevProps.position.x === nextProps.position.x &&
      prevProps.position.y === nextProps.position.y &&
      prevProps.canNavigatePrev === nextProps.canNavigatePrev &&
      prevProps.canNavigateNext === nextProps.canNavigateNext &&
      prevProps.currentIndex === nextProps.currentIndex &&
      prevProps.totalModules === nextProps.totalModules
    )
  }
)

export default HolographicInfoPanel
