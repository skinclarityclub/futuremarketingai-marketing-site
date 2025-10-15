/**
 * ParticleSystemDemo - Example implementation showing all features
 * Use this as reference for integrating the particle system
 */

import React, { useRef } from 'react'
import { ParticleSystem } from './ParticleSystem'
import { useParticleBurst, useRandomBursts } from './useParticleSystem'
import type { ParticleSystemRef } from './useParticleSystem'

export const ParticleSystemDemo: React.FC = () => {
  const particleSystemRef = useRef<ParticleSystemRef | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Hook: Trigger burst on click
  const handleClick = useParticleBurst(particleSystemRef, 30)

  // Hook: Random ambient bursts every 3 seconds
  useRandomBursts(particleSystemRef, containerRef, {
    interval: 3000,
    count: 15,
    enabled: true,
  })

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
      onClick={handleClick}
    >
      {/* Particle System with performance monitor */}
      <ParticleSystem
        className="absolute inset-0"
        spawnRate={3} // 3 particles per second per type
        enablePerformanceMonitor={true} // Show FPS/CPU/Worker stats
        enableWorker={true} // Enable Web Worker offloading
        workerCpuThreshold={20} // Activate worker at 20% CPU
      />

      {/* Demo content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white space-y-4">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Advanced Particle System
          </h1>
          <p className="text-xl text-white/90">Click anywhere to trigger burst effects</p>
          <div className="flex gap-4 justify-center mt-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
              <div className="text-cyan-400 text-sm">Ambient</div>
              <div className="text-2xl">🌀</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
              <div className="text-pink-400 text-sm">Data Stream</div>
              <div className="text-2xl">⚡</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
              <div className="text-purple-400 text-sm">Orbital</div>
              <div className="text-2xl">🔮</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
              <div className="text-yellow-400 text-sm">Burst</div>
              <div className="text-2xl">💥</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticleSystemDemo
