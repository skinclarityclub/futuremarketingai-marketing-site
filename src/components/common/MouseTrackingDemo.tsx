import { useMousePosition } from '../../hooks'

/**
 * Demo component to visualize mouse tracking with lerp smoothing
 * Shows both raw and smoothed mouse positions for comparison
 */
export function MouseTrackingDemo() {
  const mousePos = useMousePosition({ smoothing: 0.1 })

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-black/80 p-4 font-mono text-xs text-white backdrop-blur-sm">
      <h3 className="mb-2 font-semibold">Mouse Tracking Debug</h3>

      <div className="space-y-1">
        <div>
          <span className="text-white/70">Raw Position:</span>
          <div className="ml-2">
            X: {mousePos.x.toFixed(0)}px, Y: {mousePos.y.toFixed(0)}px
          </div>
        </div>

        <div>
          <span className="text-white/70">Normalized (0-1):</span>
          <div className="ml-2">
            X: {mousePos.normalizedX.toFixed(3)}, Y: {mousePos.normalizedY.toFixed(3)}
          </div>
        </div>

        <div>
          <span className="text-green-400">Smoothed (lerp):</span>
          <div className="ml-2">
            X: {mousePos.smoothX.toFixed(3)}, Y: {mousePos.smoothY.toFixed(3)}
          </div>
        </div>
      </div>

      {/* Visual representation */}
      <div className="mt-3 h-32 w-32 rounded border border-white/20">
        {/* Raw position dot */}
        <div
          className="absolute h-2 w-2 rounded-full bg-red-500"
          style={{
            left: `${mousePos.normalizedX * 128}px`,
            top: `${mousePos.normalizedY * 128}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Smoothed position dot */}
        <div
          className="absolute h-3 w-3 rounded-full bg-green-500"
          style={{
            left: `${mousePos.smoothX * 128}px`,
            top: `${mousePos.smoothY * 128}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="mt-2 space-y-1 text-[10px] text-white/60">
        <div>🔴 Raw position</div>
        <div>🟢 Smoothed position</div>
      </div>
    </div>
  )
}

/**
 * Parallax demo component showing how to use mouse position for parallax effects
 */
export function ParallaxDemo() {
  const { smoothX, smoothY } = useMousePosition({ smoothing: 0.15 })

  // Calculate parallax offsets (centered at 0.5)
  const offsetX = (smoothX - 0.5) * 100
  const offsetY = (smoothY - 0.5) * 100

  return (
    <div className="fixed left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2">
      {/* Background layer (slow movement) */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl"
        style={{
          transform: `translate(${offsetX * 0.3}px, ${offsetY * 0.3}px)`,
        }}
      />

      {/* Middle layer (medium movement) */}
      <div
        className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-pink-500/30 blur-lg"
        style={{
          transform: `translate(${offsetX * 0.6}px, ${offsetY * 0.6}px)`,
        }}
      />

      {/* Foreground layer (fast movement) */}
      <div
        className="absolute inset-16 rounded-full bg-gradient-to-br from-green-500/40 to-yellow-500/40 blur-md"
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px)`,
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center text-sm text-white">
        <span className="rounded bg-black/50 px-3 py-1">Parallax Demo</span>
      </div>
    </div>
  )
}
