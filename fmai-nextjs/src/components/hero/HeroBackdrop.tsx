/**
 * HeroBackdrop — Statische subtle backdrop voor de homepage hero.
 *
 * Replaces PaperShaderMesh (W5.2 reverted 2026-05-25 — user vond animated
 * WebGL mesh te aanwezig). Pure CSS: één radial-gradient van deep teal
 * naar bg-deep + subtiel grid-pattern overlay. Geen animatie, geen WebGL,
 * geen dynamic-import. Server-renderable.
 */
export function HeroBackdrop() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ contain: 'layout style paint' }}
    >
      {/* Base radial — deep teal anchor top-right (achter de Spline robot) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 30%, rgba(0, 212, 170, 0.10) 0%, rgba(0, 212, 170, 0.03) 35%, transparent 70%)',
        }}
      />

      {/* Secondary radial — subtle amber accent bottom-left for warmth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 15% 85%, rgba(245, 166, 35, 0.06) 0%, transparent 60%)',
        }}
      />

      {/* Subtle grid overlay — 64px squares, very faint, masked at edges */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 170, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 170, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 80%)',
        }}
      />

      {/* Bottom vignette — fades the grid into bg-deep so scroll feels seamless */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(10, 13, 20, 0.6) 60%, rgba(10, 13, 20, 1) 100%)',
        }}
      />
    </div>
  )
}
