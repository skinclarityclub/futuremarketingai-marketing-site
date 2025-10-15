// Layer 1: Hero - System Diagram Components
export { SystemDiagram } from './SystemDiagram'
export { CoreSphere3D } from './CoreSphere3D'
export { SatelliteNode } from './SatelliteNode'
export { ConnectionBeam } from './ConnectionBeam'
export { HolographicInfoPanel } from './HolographicInfoPanel'
export { EnhancedParticleSystem } from './EnhancedParticleSystem'
export { OrbitalParticles } from './OrbitalParticles'

// Particle System Infrastructure
export { ParticlePool } from './ParticlePool'
export { ParticleRenderer } from './ParticleRenderer'
export { ParticleBehaviorFactory, PARTICLE_COLORS } from './ParticleTypes'
export { ParticleSystem } from './ParticleSystem'
export { ParticleSystemDemo } from './ParticleSystemDemo'
export * from './particleUtils'
export * from './useParticleSystem'
export { useParticleWorker } from './useParticleWorker'

// Types
export type { Particle, PoolConfig } from './ParticlePool'
export type { ParticleBehavior } from './ParticleTypes'
export type { ParticleSystemRef } from './useParticleSystem'
export type { BeamNode, ConnectionBeamProps } from './ConnectionBeam'
export type { NodeData, HolographicInfoPanelProps } from './HolographicInfoPanel'
