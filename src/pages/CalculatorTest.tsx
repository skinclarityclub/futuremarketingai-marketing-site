import React from 'react'

/**
 * CalculatorTest - Test which import is causing the Calculator to fail
 *
 * Uncomment imports one by one to find the problematic component
 */

// Test 1: Basic React imports
export const CalculatorTest: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-card p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-4">Calculator Test Page</h1>
        <p className="text-white/70 mb-6">This page tests the Calculator imports step by step.</p>

        <div className="space-y-4 text-white/80">
          <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/50">
            ✅ Basic React import works
          </div>

          {/* Uncomment each section below one by one to test: */}

          {/* Test 2: Components */}
          {/* <TestCommonComponents /> */}

          {/* Test 3: Calculator components */}
          {/* <TestCalculatorComponents /> */}

          {/* Test 4: Utils */}
          {/* <TestUtils /> */}
        </div>
      </div>
    </div>
  )
}

// Test sections - uncomment to test
/*
import {
  GlassCard,
  Button,
  LoadingFallback,
} from '../components'

const TestCommonComponents = () => (
  <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/50">
    ✅ Common components import works
    <GlassCard className="mt-2 p-2">
      <Button>Test Button</Button>
    </GlassCard>
  </div>
)
*/

/*
import {
  CalculatorWizard,
  LivePreviewPanel,
  WastedAdSpendCard
} from '../components/calculator'

const TestCalculatorComponents = () => (
  <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/50">
    ✅ Calculator components import works
  </div>
)
*/

/*
import { calculateROIMetrics } from '../utils/calculations'

const TestUtils = () => {
  const metrics = calculateROIMetrics({
    teamSize: 5,
    avgSalary: 50000,
    campaignsPerMonth: 10
  })
  
  return (
    <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/50">
      ✅ Utils import works - ROI: {metrics.totalROI.toFixed(0)}%
    </div>
  )
}
*/

export default CalculatorTest
