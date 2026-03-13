import React from 'react'

/**
 * GradientMesh — Global animated gradient mesh background.
 * Uses 3 CSS-only blobs with blur(100px) and CSS keyframe animations.
 * Replaces the 4 Framer Motion background layers (NeuralNetwork, HolographicGrid, FloatingParticles, GradientOrbs).
 * Rendered once in App.tsx — position: fixed covers all pages.
 */
export const GradientMesh: React.FC = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="blob blob-warm" />
    <div className="blob blob-cool" />
    <div className="blob blob-mixed" />
  </div>
)

export default GradientMesh
