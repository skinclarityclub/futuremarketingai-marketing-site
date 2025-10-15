/**
 * Neural Animations Component
 * Source: neural-animations.tsx
 */

import React from 'react'
import { motion } from 'framer-motion'

interface NeuralAnimationsProps {
  className?: string
  variant?: 'default' | 'hero' | 'background'
}

export const NeuralAnimations: React.FC<NeuralAnimationsProps> = ({
  className = '',
  variant = 'default',
}) => {
  // Generate random neural network nodes
  const nodes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))

  // Generate connections between nearby nodes
  const connections = nodes
    .flatMap((node, i) =>
      nodes.slice(i + 1).map((target, j) => ({
        id: `${i}-${j}`,
        from: node,
        to: target,
        distance: Math.sqrt(Math.pow(node.x - target.x, 2) + Math.pow(node.y - target.y, 2)),
      }))
    )
    .filter((conn) => conn.distance < 30) // Only show nearby connections

  const opacity = variant === 'background' ? 0.15 : variant === 'hero' ? 0.3 : 0.25
  const strokeWidth = variant === 'hero' ? 2 : 1

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg className="w-full h-full" style={{ opacity }}>
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
          </radialGradient>
        </defs>

        {/* Connections */}
        {connections.map((conn) => (
          <motion.line
            key={conn.id}
            x1={`${conn.from.x}%`}
            y1={`${conn.from.y}%`}
            x2={`${conn.to.x}%`}
            y2={`${conn.to.y}%`}
            stroke="url(#neuralGradient)"
            strokeWidth={strokeWidth}
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 0.4, pathLength: 1 }}
            transition={{
              duration: 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={variant === 'hero' ? '4' : '3'}
            fill="url(#nodeGradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1,
              delay: node.id * 0.05,
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 3,
            }}
          />
        ))}
      </svg>
    </div>
  )
}
