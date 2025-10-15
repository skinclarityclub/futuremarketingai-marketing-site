/**
 * i18n-aware Page Context Utilities
 * Provides multilingual contextual greetings and quick replies
 */

import i18n from '../i18n/config'
import type { PageRoute } from './pageContext'

/**
 * Get contextual greeting based on current page (i18n-aware)
 */
export function getContextualGreeting(
  page: PageRoute,
  isFirstVisit: boolean,
  visitedPages: PageRoute[]
): string {
  const t = i18n.getFixedT(i18n.language, 'ai-assistant')

  if (isFirstVisit || page === 'home') {
    return t('welcomeMessages.home')
  }

  if (page === 'explorer') {
    return t('welcomeMessages.explorer')
  }

  if (page === 'calculator') {
    return t('welcomeMessages.calculator')
  }

  if (page === 'dashboard') {
    return t('welcomeMessages.dashboard')
  }

  // Default: returning visitor message
  const visited = visitedPages.length
  const percent = Math.round((visited / 3) * 100)
  return t('welcomeMessages.default', { visited, percent })
}

/**
 * Get page-specific quick replies (i18n-aware)
 */
export function getPageSpecificReplies(page: PageRoute): Array<{ label: string; value: string }> {
  const t = i18n.getFixedT(i18n.language, 'ai-assistant')

  const repliesMap: Record<PageRoute, Array<{ label: string; value: string }>> = {
    home: [
      { label: t('quickReplies.home.platform'), value: 'start_tour' },
      { label: t('quickReplies.home.roi'), value: 'calculator' },
      { label: t('quickReplies.home.demo'), value: 'plan demo' },
    ],
    explorer: [
      { label: t('quickReplies.explorer.modules'), value: 'show_modules' },
      { label: t('quickReplies.explorer.roi'), value: 'roi_impact' },
      { label: t('quickReplies.explorer.cases'), value: 'use_cases' },
    ],
    calculator: [
      { label: t('quickReplies.calculator.understand'), value: 'explain_metrics' },
      { label: t('quickReplies.calculator.roi'), value: 'interpret_roi' },
      { label: t('quickReplies.calculator.save'), value: 'save_results' },
    ],
    dashboard: [
      { label: t('quickReplies.dashboard.metrics'), value: 'key_metrics' },
      { label: t('quickReplies.dashboard.insights'), value: 'get_insights' },
      { label: t('quickReplies.dashboard.export'), value: 'export_data' },
    ],
    unknown: [
      { label: t('quickReplies.home.platform'), value: 'start_tour' },
      { label: t('quickReplies.home.roi'), value: 'calculator' },
      { label: t('quickReplies.home.demo'), value: 'plan demo' },
    ],
  }

  return repliesMap[page] || repliesMap.home
}

/**
 * Get progress message (i18n-aware)
 */
export function getProgressMessage(visited: number, total: number = 3): string {
  const t = i18n.getFixedT(i18n.language, 'ai-assistant')
  const percent = Math.round((visited / total) * 100)
  return t('progress', { current: visited, total, percent })
}
