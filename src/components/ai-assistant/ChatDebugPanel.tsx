/**
 * Chat Debug Panel
 * Shows current context state for debugging
 */

import { useLocation } from 'react-router-dom'
import { useJourneyStore } from '../../stores/journeyStore'
import { detectPage } from '../../utils/pageContext'

export default function ChatDebugPanel() {
  const location = useLocation()
  const { visitedPages, currentPage } = useJourneyStore()

  const detectedPage = detectPage(location?.pathname || '/')

  // Safe conversion: handle both old Set and new Array
  const visitedArray: string[] = Array.isArray(visitedPages)
    ? visitedPages
    : Array.from(visitedPages || [])

  const progress = getProgressMessage(visitedArray)

  const handleClearState = () => {
    if (
      confirm('Clear all localStorage? This will reset chat, journey, and personalization state.')
    ) {
      localStorage.clear()
      window.location.reload()
    }
  }

  if (import.meta.env.PROD) {
    return null
  } // Only show in dev

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-green-400">🐛 Chat Context Debug</div>
        <button
          onClick={handleClearState}
          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors font-sans"
          title="Clear localStorage and reload"
        >
          Clear
        </button>
      </div>

      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Current Path:</span>
          <span className="ml-2 text-yellow-300">{location?.pathname || 'undefined'}</span>
        </div>

        <div>
          <span className="text-gray-400">Detected Page:</span>
          <span className="ml-2 text-blue-300">{detectedPage}</span>
        </div>

        <div>
          <span className="text-gray-400">Store currentPage:</span>
          <span className="ml-2 text-purple-300">{currentPage}</span>
        </div>

        <div>
          <span className="text-gray-400">Visited Pages:</span>
          <span className="ml-2 text-cyan-300">
            {visitedArray.length > 0 ? visitedArray.join(', ') : 'none'}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Visited Array Length:</span>
          <span className="ml-2 text-orange-300">{visitedArray.length}</span>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-700">
          <span className="text-gray-400">Progress:</span>
          <div className="ml-2 text-green-300">{progress}</div>
        </div>
      </div>
    </div>
  )
}
