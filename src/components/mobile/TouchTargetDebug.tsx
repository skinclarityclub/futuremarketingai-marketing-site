/**
 * Touch Target Debug Overlay
 * 
 * Visual debugging tool to validate touch target sizes.
 * Only shows in development mode.
 */

import React, { useEffect, useState } from 'react';
import {
  auditPageTouchTargets,
  generateAuditReport,
  TOUCH_TARGET_STANDARDS,
  type TouchTargetAuditResult,
} from '@/utils/touchTargetAudit';

interface TouchTargetDebugProps {
  enabled?: boolean;
  standard?: keyof typeof TOUCH_TARGET_STANDARDS;
}

export const TouchTargetDebug: React.FC<TouchTargetDebugProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  standard = 'wcag',
}) => {
  const [results, setResults] = useState<TouchTargetAuditResult[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const runAudit = () => {
      const auditResults = auditPageTouchTargets(standard);
      setResults(auditResults);
    };

    // Run initial audit
    runAudit();

    // Re-run on resize or DOM changes
    const observer = new MutationObserver(runAudit);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('resize', runAudit);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', runAudit);
    };
  }, [enabled, standard]);

  if (!enabled) return null;

  const report = generateAuditReport(results);
  const requirements = TOUCH_TARGET_STANDARDS[standard];

  return (
    <>
      {/* Control Panel */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        <button
          onClick={() => setShowOverlay(!showOverlay)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          {showOverlay ? '🙈 Hide' : '👁️ Show'} Touch Targets
        </button>
        <button
          onClick={() => setShowReport(!showReport)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          📊 Report
        </button>
      </div>

      {/* Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 pointer-events-none z-[9998]">
          <style>{`
            .touch-target-highlight {
              position: absolute;
              border: 2px solid;
              pointer-events: none;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              color: white;
              text-shadow: 0 0 4px rgba(0,0,0,0.8);
            }
            .touch-target-pass {
              border-color: rgba(34, 197, 94, 0.8);
              background: rgba(34, 197, 94, 0.1);
            }
            .touch-target-fail {
              border-color: rgba(239, 68, 68, 0.8);
              background: rgba(239, 68, 68, 0.2);
            }
            .touch-target-warn {
              border-color: rgba(251, 191, 36, 0.8);
              background: rgba(251, 191, 36, 0.1);
            }
          `}</style>
          {results.map((result, index) => {
            const element = document.querySelectorAll(
              'button, a, input[type="button"], input[type="submit"], [role="button"]'
            )[index];
            
            if (!element) return null;
            
            const rect = element.getBoundingClientRect();
            const className = result.passed
              ? result.recommendations.length > 0
                ? 'touch-target-warn'
                : 'touch-target-pass'
              : 'touch-target-fail';

            return (
              <div
                key={index}
                className={`touch-target-highlight ${className}`}
                style={{
                  top: rect.top + window.scrollY,
                  left: rect.left + window.scrollX,
                  width: rect.width,
                  height: rect.height,
                }}
              >
                {Math.round(rect.width)}×{Math.round(rect.height)}
              </div>
            );
          })}
        </div>
      )}

      {/* Report Panel */}
      {showReport && (
        <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4">
          <div className="bg-bg-dark border border-border-primary rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  Touch Target Audit Report
                </h2>
                <p className="text-text-secondary text-sm">
                  Standard: <span className="font-semibold text-accent-primary">{standard.toUpperCase()}</span> ({requirements.minWidth}×{requirements.minHeight}px minimum)
                </p>
              </div>
              <button
                onClick={() => setShowReport(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-bg-surface rounded-lg p-4">
                <div className="text-3xl font-bold text-text-primary mb-1">
                  {report.total}
                </div>
                <div className="text-sm text-text-secondary">Total Elements</div>
              </div>
              <div className="bg-bg-surface rounded-lg p-4">
                <div className="text-3xl font-bold text-success mb-1">
                  {report.passed}
                </div>
                <div className="text-sm text-text-secondary">Passed</div>
              </div>
              <div className="bg-bg-surface rounded-lg p-4">
                <div className="text-3xl font-bold text-error mb-1">
                  {report.failed}
                </div>
                <div className="text-sm text-text-secondary">Failed</div>
              </div>
            </div>

            {/* Pass Rate */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Pass Rate</span>
                <span className="text-text-primary font-semibold">
                  {report.passRate.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-success to-green-400 transition-all"
                  style={{ width: `${report.passRate}%` }}
                />
              </div>
            </div>

            {/* Failed Elements */}
            {report.issues.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-error mb-3">
                  ❌ Failed Elements ({report.issues.length})
                </h3>
                <div className="space-y-3">
                  {report.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="bg-error/10 border border-error/30 rounded-lg p-3"
                    >
                      <div className="font-mono text-sm text-error mb-2">
                        {issue.element}
                      </div>
                      <div className="text-sm text-text-secondary mb-2">
                        Size: {Math.round(issue.width)}×{Math.round(issue.height)}px
                      </div>
                      {issue.issues.map((i, idx) => (
                        <div key={idx} className="text-sm text-error">
                          • {i}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {results.filter(r => r.passed && r.recommendations.length > 0).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-warning mb-3">
                  ⚠️ Recommendations
                </h3>
                <div className="space-y-3">
                  {results
                    .filter(r => r.passed && r.recommendations.length > 0)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="bg-warning/10 border border-warning/30 rounded-lg p-3"
                      >
                        <div className="font-mono text-sm text-warning mb-2">
                          {item.element}
                        </div>
                        <div className="text-sm text-text-secondary mb-2">
                          Size: {Math.round(item.width)}×{Math.round(item.height)}px
                        </div>
                        {item.recommendations.map((r, idx) => (
                          <div key={idx} className="text-sm text-warning">
                            • {r}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TouchTargetDebug;

