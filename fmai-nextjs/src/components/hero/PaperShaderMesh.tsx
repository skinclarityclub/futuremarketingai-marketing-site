'use client'

import dynamic from 'next/dynamic'
import { useReducedMotion } from 'motion/react'
import { GradientMesh } from './GradientMesh'

// Paper Shaders is WebGL — load only on the client, never during SSR/SSG.
// Static fallback during the hydration delay is the existing GradientMesh
// which keeps page paint stable even before the shader takes over.
const MeshGradient = dynamic(
  () => import('@paper-design/shaders-react').then((mod) => mod.MeshGradient),
  { ssr: false, loading: () => <GradientMesh /> }
)

/**
 * Animated WebGL mesh-gradient hero background. Replaces the CSS-blob
 * GradientMesh on the home page. Falls back to the static blob version
 * when prefers-reduced-motion is set, when WebGL is unavailable, or
 * during the dynamic-import gap.
 */
export function PaperShaderMesh() {
  const reduced = useReducedMotion()

  if (reduced) {
    return <GradientMesh />
  }

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ contain: 'layout style paint' }}
    >
      <MeshGradient
        colors={['#0a0d14', '#00d4aa', '#f5a623', '#111520']}
        speed={0.4}
        distortion={0.7}
        swirl={0.2}
        style={{ width: '100%', height: '100%', opacity: 0.55 }}
      />
    </div>
  )
}
