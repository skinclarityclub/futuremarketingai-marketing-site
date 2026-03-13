import React from 'react'

/**
 * OrbitVisual — Decorative spinning orbit rings for hero section.
 * 3 concentric rings with colored dots, FM center text.
 * Pure CSS animation (spin keyframe), no Framer Motion.
 * Hidden on screens < 1024px (lg breakpoint).
 */
export const OrbitVisual: React.FC = () => (
  <div
    className="absolute right-[8%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] hidden lg:block"
    aria-hidden="true"
  >
    {[
      { inset: '0', duration: '40s', color: '#F5A623', shadow: 'rgba(245,166,35,0.4)' },
      {
        inset: '40px',
        duration: '30s',
        color: '#0ABAB5',
        shadow: 'rgba(10,186,181,0.4)',
        reverse: true,
      },
      { inset: '80px', duration: '20s', color: '#F0EDE8', shadow: 'rgba(240,237,232,0.3)' },
    ].map((ring, i) => (
      <div
        key={i}
        className="absolute border border-white/[0.04] rounded-full"
        style={{
          inset: ring.inset,
          animation: `spin ${ring.duration} linear infinite${ring.reverse ? ' reverse' : ''}`,
        }}
      >
        <div
          className="absolute w-2 h-2 rounded-full -top-1 left-1/2"
          style={{
            background: ring.color,
            boxShadow: `0 0 16px ${ring.shadow}`,
          }}
        />
      </div>
    ))}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold text-[28px] tracking-tight">
      <span className="bg-gradient-to-r from-accent-human to-accent-system bg-clip-text text-transparent">
        FM
      </span>
    </div>
  </div>
)

export default OrbitVisual
