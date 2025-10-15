import React from 'react'

export const StrategyHubSimple: React.FC = () => {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Strategy Hub</h2>
        <p className="text-slate-400">Multi-Account Strategy Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 /50 rounded-lg border border-indigo-500/30">
          <h3 className="text-lg font-semibold text-white mb-2">Test Accounts</h3>
          <p className="text-slate-300 text-sm">Experiment with content formats</p>
          <p className="text-2xl font-bold text-indigo-400 mt-4">4 accounts</p>
        </div>

        <div className="p-6 /50 rounded-lg border border-violet-500/30">
          <h3 className="text-lg font-semibold text-white mb-2">Sub Accounts</h3>
          <p className="text-slate-300 text-sm">Scale winning content</p>
          <p className="text-2xl font-bold text-violet-400 mt-4">2 accounts</p>
        </div>

        <div className="p-6 /50 rounded-lg border border-amber-500/30">
          <h3 className="text-lg font-semibold text-white mb-2">Main Account</h3>
          <p className="text-slate-300 text-sm">Premium content hub</p>
          <p className="text-2xl font-bold text-amber-400 mt-4">1 account</p>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/30 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Content Strategy Pipeline</h3>
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Test Accounts</span>
          <span>→</span>
          <span>Winners</span>
          <span>→</span>
          <span>Sub Accounts</span>
          <span>→</span>
          <span>Main Account</span>
          <span>→</span>
          <span>Paid Ads</span>
        </div>
      </div>

      <div className="text-center py-8">
        <p className="text-slate-400 mb-2">Full Strategy Hub coming soon...</p>
        <p className="text-sm text-slate-500">
          Account hierarchy, comparison tables, and detail views
        </p>
      </div>
    </div>
  )
}
