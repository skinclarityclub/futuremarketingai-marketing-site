/**
 * GradientMesh — Global animated gradient mesh background.
 * Uses 3 CSS-only blobs with blur(100px) and CSS keyframe animations.
 * Position: fixed covers all pages.
 */
export function GradientMesh() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="blob blob-warm" />
      <div className="blob blob-cool" />
      <div className="blob blob-mixed" />
    </div>
  )
}
