/**
 * Sentry Test Button Component
 *
 * Development tool for testing Sentry error tracking.
 * Only visible in development mode.
 */

import React, { useState } from 'react'
import { captureException, captureMessage, addBreadcrumb } from '../../config/sentry'

const SentryTestButton: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('')
  const isDevelopment = import.meta.env.MODE === 'development'

  // Don't render in production
  if (!isDevelopment) {
    return null
  }

  const handleTestError = () => {
    try {
      addBreadcrumb({
        message: 'User clicked Sentry test button',
        category: 'test',
        level: 'info',
      })

      throw new Error('Sentry Test Error - ' + new Date().toISOString())
    } catch (error) {
      captureException(error as Error, {
        test: true,
        trigger: 'manual',
        timestamp: Date.now(),
      })
      setTestResult('✅ Test error sent to Sentry! Check your Sentry dashboard.')
      setTimeout(() => setTestResult(''), 5000)
    }
  }

  const handleTestMessage = () => {
    addBreadcrumb({
      message: 'User sent test message to Sentry',
      category: 'test',
      level: 'info',
    })

    captureMessage('Sentry Test Message - ' + new Date().toISOString(), 'info', {
      test: true,
      trigger: 'manual',
      timestamp: Date.now(),
    })
    setTestResult('✅ Test message sent to Sentry! Check your Sentry dashboard.')
    setTimeout(() => setTestResult(''), 5000)
  }

  const handleTestWarning = () => {
    captureMessage('Sentry Test Warning - ' + new Date().toISOString(), 'warning', {
      test: true,
      severity: 'warning',
      timestamp: Date.now(),
    })
    setTestResult('⚠️ Test warning sent to Sentry! Check your Sentry dashboard.')
    setTimeout(() => setTestResult(''), 5000)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50  text-white p-4 rounded-lg shadow-xl border border-gray-700">
      <div className="text-sm font-bold mb-2">🔧 Sentry Testing (Dev Only)</div>

      <div className="flex flex-col gap-2 mb-2">
        <button
          onClick={handleTestError}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
          title="Test error tracking"
        >
          Test Error
        </button>

        <button
          onClick={handleTestMessage}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
          title="Test message tracking"
        >
          Test Message
        </button>

        <button
          onClick={handleTestWarning}
          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs transition-colors"
          title="Test warning tracking"
        >
          Test Warning
        </button>
      </div>

      {testResult && <div className="text-xs mt-2 p-2  rounded">{testResult}</div>}
    </div>
  )
}

export default SentryTestButton
