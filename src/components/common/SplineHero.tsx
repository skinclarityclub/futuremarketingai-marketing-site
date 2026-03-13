import React, { lazy, Suspense } from 'react'
import { OrbitVisual } from './OrbitVisual'

/**
 * SplineHero — Lazy-loaded Spline 3D scene with OrbitVisual fallback.
 *
 * Hidden below lg breakpoint — parent controls visibility.
 * Renders OrbitVisual while the Spline runtime loads, providing
 * an instant decorative placeholder.
 */

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineHeroProps {
  sceneUrl: string
  className?: string
}

export const SplineHero: React.FC<SplineHeroProps> = ({ sceneUrl, className }) => (
  <div className={className} aria-hidden="true">
    <Suspense fallback={<OrbitVisual />}>
      <Spline scene={sceneUrl} style={{ width: '100%', height: '100%' }} />
    </Suspense>
  </div>
)

export default SplineHero
