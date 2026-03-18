'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-[#A855F7]">!</p>
      <h1 className="mt-4 text-3xl font-semibold text-white">Something went wrong</h1>
      <p className="mt-2 text-lg text-gray-400">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-block rounded-lg bg-[#00D4FF] px-6 py-3 text-sm font-medium text-[#050814] transition-colors hover:bg-[#00D4FF]/80"
      >
        Try again
      </button>
    </main>
  )
}
