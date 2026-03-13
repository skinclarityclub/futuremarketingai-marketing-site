import React from 'react'

/**
 * OrbitVisual — Premium hero decoration.
 *
 * 5 concentric orbit rings (solid + dashed), glowing orbital dots with
 * pulse animation, gradient arc trails, a breathing multi-layer core,
 * and ambient floating particles. Pure CSS/SVG — zero JS animation,
 * zero runtime dependencies. Hidden below lg breakpoint.
 */

/* ── Ring definitions ── */
const RINGS = [
  { r: 210, width: 1, opacity: 0.06, dur: '55s', dash: false, reverse: false },
  { r: 170, width: 1, opacity: 0.08, dur: '40s', dash: true, reverse: true },
  { r: 130, width: 1, opacity: 0.1, dur: '30s', dash: false, reverse: false },
  { r: 88, width: 1, opacity: 0.06, dur: '22s', dash: true, reverse: true },
  { r: 50, width: 1, opacity: 0.12, dur: '16s', dash: false, reverse: false },
]

/* ── Orbital dots (the glowing spheres that ride the rings) ── */
const DOTS = [
  { ring: 0, angle: 0, color: '#F5A623', size: 8, glowSize: 20, glowColor: 'rgba(245,166,35,0.5)' },
  {
    ring: 0,
    angle: 180,
    color: '#0ABAB5',
    size: 5,
    glowSize: 14,
    glowColor: 'rgba(10,186,181,0.3)',
  },
  {
    ring: 1,
    angle: 90,
    color: '#0ABAB5',
    size: 7,
    glowSize: 18,
    glowColor: 'rgba(10,186,181,0.45)',
  },
  {
    ring: 2,
    angle: 45,
    color: '#F5A623',
    size: 9,
    glowSize: 22,
    glowColor: 'rgba(245,166,35,0.5)',
  },
  {
    ring: 2,
    angle: 200,
    color: '#F0EDE8',
    size: 4,
    glowSize: 12,
    glowColor: 'rgba(240,237,232,0.3)',
  },
  {
    ring: 3,
    angle: 270,
    color: '#0ABAB5',
    size: 5,
    glowSize: 14,
    glowColor: 'rgba(10,186,181,0.35)',
  },
  {
    ring: 4,
    angle: 120,
    color: '#F5A623',
    size: 6,
    glowSize: 16,
    glowColor: 'rgba(245,166,35,0.4)',
  },
]

/* ── Gradient arc trails ── */
const ARCS = [
  {
    r: 210,
    dur: '55s',
    color1: '#F5A623',
    color2: 'transparent',
    arcLen: 90,
    startAngle: 30,
    reverse: false,
  },
  {
    r: 130,
    dur: '30s',
    color1: '#0ABAB5',
    color2: 'transparent',
    arcLen: 70,
    startAngle: 150,
    reverse: true,
  },
  {
    r: 88,
    dur: '22s',
    color1: '#F5A623',
    color2: '#0ABAB5',
    arcLen: 50,
    startAngle: 270,
    reverse: false,
  },
]

/* ── Ambient particles ── */
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: Math.cos((i / 12) * Math.PI * 2) * (120 + Math.random() * 100),
  y: Math.sin((i / 12) * Math.PI * 2) * (120 + Math.random() * 100),
  dx: (Math.random() - 0.5) * 60,
  dy: (Math.random() - 0.5) * 60,
  size: 1.5 + Math.random() * 2,
  dur: 4 + Math.random() * 6,
  delay: Math.random() * 8,
  color: i % 3 === 0 ? '#F5A623' : i % 3 === 1 ? '#0ABAB5' : '#F0EDE8',
}))

const CX = 240 // center x of the 480×480 viewBox
const CY = 240

export const OrbitVisual: React.FC = () => (
  <div
    className="absolute right-[4%] top-1/2 -translate-y-1/2 w-[480px] h-[480px] hidden lg:block"
    aria-hidden="true"
    data-orbit
  >
    {/* ── Core glow layers ── */}
    <div
      className="absolute top-1/2 left-1/2 w-[180px] h-[180px] rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(245,166,35,0.15) 0%, rgba(10,186,181,0.08) 40%, transparent 70%)',
        animation: 'orbit-core-breathe 6s ease-in-out infinite',
      }}
    />
    <div
      className="absolute top-1/2 left-1/2 w-[100px] h-[100px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(245,166,35,0.25) 0%, transparent 70%)',
        animation: 'orbit-core-breathe 4s ease-in-out infinite 1s',
      }}
    />

    {/* ── SVG layer: rings, arcs, dots, particles ── */}
    <svg viewBox="0 0 480 480" className="absolute inset-0 w-full h-full">
      <defs>
        {/* Gradient arcs */}
        {ARCS.map((arc, i) => (
          <linearGradient key={`ag${i}`} id={`arc-grad-${i}`}>
            <stop offset="0%" stopColor={arc.color1} stopOpacity="0.5" />
            <stop offset="100%" stopColor={arc.color2} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {/* ── Orbit rings ── */}
      {RINGS.map((ring, i) => (
        <circle
          key={`ring-${i}`}
          cx={CX}
          cy={CY}
          r={ring.r}
          fill="none"
          stroke="rgba(255,255,255,1)"
          strokeWidth={ring.width}
          strokeOpacity={ring.opacity}
          strokeDasharray={ring.dash ? '6 12' : 'none'}
          style={{
            animation: `spin ${ring.dur} linear infinite${ring.reverse ? ' reverse' : ''}`,
            transformOrigin: `${CX}px ${CY}px`,
          }}
        />
      ))}

      {/* ── Gradient arc trails ── */}
      {ARCS.map((arc, i) => {
        const circumference = 2 * Math.PI * arc.r
        const arcLength = (arc.arcLen / 360) * circumference
        const gapLength = circumference - arcLength
        return (
          <circle
            key={`arc-${i}`}
            cx={CX}
            cy={CY}
            r={arc.r}
            fill="none"
            stroke={`url(#arc-grad-${i})`}
            strokeWidth={2.5}
            strokeDasharray={`${arcLength} ${gapLength}`}
            strokeLinecap="round"
            style={{
              animation: `spin ${arc.dur} linear infinite${arc.reverse ? ' reverse' : ''}`,
              transformOrigin: `${CX}px ${CY}px`,
            }}
          />
        )
      })}

      {/* ── Orbital dots (glowing spheres) ── */}
      {DOTS.map((dot, i) => {
        const ring = RINGS[dot.ring]
        const rad = (dot.angle * Math.PI) / 180
        const dotX = CX + ring.r * Math.cos(rad)
        const dotY = CY + ring.r * Math.sin(rad)
        return (
          <g
            key={`dot-${i}`}
            style={{
              animation: `spin ${ring.dur} linear infinite${ring.reverse ? ' reverse' : ''}`,
              transformOrigin: `${CX}px ${CY}px`,
            }}
          >
            {/* Outer glow */}
            <circle
              cx={dotX}
              cy={dotY}
              r={dot.glowSize}
              fill={dot.glowColor}
              style={{ animation: `orbit-pulse 3s ease-in-out infinite ${i * 0.4}s` }}
            />
            {/* Inner dot */}
            <circle cx={dotX} cy={dotY} r={dot.size / 2} fill={dot.color} />
          </g>
        )
      })}

      {/* ── Ambient particles ── */}
      {PARTICLES.map((p, i) => (
        <circle
          key={`particle-${i}`}
          cx={CX + p.x}
          cy={CY + p.y}
          r={p.size}
          fill={p.color}
          opacity={0}
          style={
            {
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              animation: `orbit-particle-float ${p.dur}s ease-in-out infinite ${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* ── Center: layered logo mark ── */}
      <g>
        {/* Outer ring around logo */}
        <circle
          cx={CX}
          cy={CY}
          r={28}
          fill="none"
          stroke="url(#center-ring-grad)"
          strokeWidth={1}
          opacity={0.4}
        />
        <defs>
          <linearGradient id="center-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5A623" />
            <stop offset="100%" stopColor="#0ABAB5" />
          </linearGradient>
          <linearGradient id="center-text-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5A623" />
            <stop offset="100%" stopColor="#0ABAB5" />
          </linearGradient>
        </defs>
        {/* Logo text */}
        <text
          x={CX}
          y={CY}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight={700}
          fontSize={20}
          letterSpacing={-1}
          fill="url(#center-text-grad)"
        >
          FMai
        </text>
      </g>
    </svg>
  </div>
)

export default OrbitVisual
