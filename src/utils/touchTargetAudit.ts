/**
 * Touch Target Audit Tool
 * 
 * Validates that interactive elements meet minimum touch target size requirements:
 * - iOS minimum: 44x44px (Apple HIG)
 * - WCAG AAA: 48x48px (recommended)
 * - Comfortable: 56x56px (optimal)
 */

export interface TouchTargetRequirements {
  minWidth: number;
  minHeight: number;
  recommendedWidth: number;
  recommendedHeight: number;
}

export const TOUCH_TARGET_STANDARDS = {
  // Apple Human Interface Guidelines
  ios: {
    minWidth: 44,
    minHeight: 44,
    recommendedWidth: 44,
    recommendedHeight: 44,
  },
  // WCAG AAA (Success Criterion 2.5.5)
  wcag: {
    minWidth: 48,
    minHeight: 48,
    recommendedWidth: 48,
    recommendedHeight: 48,
  },
  // Optimal for comfort
  comfortable: {
    minWidth: 56,
    minHeight: 56,
    recommendedWidth: 56,
    recommendedHeight: 56,
  },
} as const;

export interface TouchTargetAuditResult {
  element: string;
  passed: boolean;
  width: number;
  height: number;
  issues: string[];
  recommendations: string[];
}

/**
 * Audit an element for touch target compliance
 */
export function auditTouchTarget(
  element: HTMLElement,
  standard: keyof typeof TOUCH_TARGET_STANDARDS = 'wcag'
): TouchTargetAuditResult {
  const rect = element.getBoundingClientRect();
  const requirements = TOUCH_TARGET_STANDARDS[standard];
  
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check width
  if (rect.width < requirements.minWidth) {
    issues.push(
      `Width ${rect.width}px is below minimum ${requirements.minWidth}px`
    );
  }
  
  // Check height
  if (rect.height < requirements.minHeight) {
    issues.push(
      `Height ${rect.height}px is below minimum ${requirements.minHeight}px`
    );
  }
  
  // Recommendations
  if (rect.width < requirements.recommendedWidth && rect.width >= requirements.minWidth) {
    recommendations.push(
      `Consider increasing width to ${requirements.recommendedWidth}px for better usability`
    );
  }
  
  if (rect.height < requirements.recommendedHeight && rect.height >= requirements.minHeight) {
    recommendations.push(
      `Consider increasing height to ${requirements.recommendedHeight}px for better usability`
    );
  }
  
  // Check spacing around element
  const computedStyle = window.getComputedStyle(element);
  const paddingTop = parseInt(computedStyle.paddingTop, 10);
  const paddingBottom = parseInt(computedStyle.paddingBottom, 10);
  const paddingLeft = parseInt(computedStyle.paddingLeft, 10);
  const paddingRight = parseInt(computedStyle.paddingRight, 10);
  
  if (paddingTop + paddingBottom < 8) {
    recommendations.push('Consider adding more vertical padding (min 8px total)');
  }
  
  if (paddingLeft + paddingRight < 8) {
    recommendations.push('Consider adding more horizontal padding (min 8px total)');
  }
  
  return {
    element: element.tagName.toLowerCase() + (element.id ? `#${element.id}` : ''),
    passed: issues.length === 0,
    width: rect.width,
    height: rect.height,
    issues,
    recommendations,
  };
}

/**
 * Audit all interactive elements on the page
 */
export function auditPageTouchTargets(
  standard: keyof typeof TOUCH_TARGET_STANDARDS = 'wcag'
): TouchTargetAuditResult[] {
  const interactiveSelectors = [
    'button',
    'a',
    'input[type="button"]',
    'input[type="submit"]',
    'input[type="reset"]',
    'input[type="checkbox"]',
    'input[type="radio"]',
    '[role="button"]',
    '[role="link"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[onclick]',
  ];
  
  const elements = document.querySelectorAll(interactiveSelectors.join(', '));
  const results: TouchTargetAuditResult[] = [];
  
  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      // Skip hidden elements
      if (element.offsetParent === null) return;
      
      const result = auditTouchTarget(element, standard);
      results.push(result);
    }
  });
  
  return results;
}

/**
 * Generate a report summary
 */
export function generateAuditReport(results: TouchTargetAuditResult[]): {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  issues: TouchTargetAuditResult[];
} {
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  const passRate = total > 0 ? (passed / total) * 100 : 0;
  const issues = results.filter(r => !r.passed);
  
  return {
    total,
    passed,
    failed,
    passRate,
    issues,
  };
}

/**
 * Console log a formatted audit report
 */
export function logAuditReport(
  results: TouchTargetAuditResult[],
  standard: keyof typeof TOUCH_TARGET_STANDARDS = 'wcag'
): void {
  const report = generateAuditReport(results);
  const requirements = TOUCH_TARGET_STANDARDS[standard];
  
  console.group('📱 Touch Target Audit Report');
  console.log(`Standard: ${standard.toUpperCase()}`);
  console.log(`Minimum Size: ${requirements.minWidth}x${requirements.minHeight}px`);
  console.log(`Total Elements: ${report.total}`);
  console.log(`✅ Passed: ${report.passed} (${report.passRate.toFixed(1)}%)`);
  console.log(`❌ Failed: ${report.failed}`);
  
  if (report.issues.length > 0) {
    console.group('❌ Failed Elements');
    report.issues.forEach(issue => {
      console.group(issue.element);
      console.log(`Size: ${issue.width}x${issue.height}px`);
      issue.issues.forEach(i => console.error(`• ${i}`));
      issue.recommendations.forEach(r => console.warn(`• ${r}`));
      console.groupEnd();
    });
    console.groupEnd();
  }
  
  const withRecommendations = results.filter(r => r.passed && r.recommendations.length > 0);
  if (withRecommendations.length > 0) {
    console.group('⚠️ Passed with Recommendations');
    withRecommendations.forEach(item => {
      console.group(item.element);
      console.log(`Size: ${item.width}x${item.height}px`);
      item.recommendations.forEach(r => console.warn(`• ${r}`));
      console.groupEnd();
    });
    console.groupEnd();
  }
  
  console.groupEnd();
}

/**
 * Hook to run audit on component mount (development only)
 */
export function useTouchTargetAudit(
  enabled: boolean = process.env.NODE_ENV === 'development',
  standard: keyof typeof TOUCH_TARGET_STANDARDS = 'wcag'
): void {
  if (typeof window === 'undefined') return;
  
  if (enabled) {
    // Run audit after component renders
    setTimeout(() => {
      const results = auditPageTouchTargets(standard);
      logAuditReport(results, standard);
    }, 1000);
  }
}

/**
 * Get CSS classes for touch target sizes
 */
export function getTouchTargetClasses(
  size: 'sm' | 'md' | 'lg' = 'md'
): string {
  const classes = {
    sm: 'min-w-[44px] min-h-[44px]', // iOS minimum
    md: 'min-w-[48px] min-h-[48px]', // WCAG AAA
    lg: 'min-w-[56px] min-h-[56px]', // Comfortable
  };
  
  return classes[size];
}

/**
 * Validate if element meets touch target requirements in code
 */
export function validateTouchTarget(
  width: number,
  height: number,
  standard: keyof typeof TOUCH_TARGET_STANDARDS = 'wcag'
): { valid: boolean; message?: string } {
  const requirements = TOUCH_TARGET_STANDARDS[standard];
  
  if (width < requirements.minWidth || height < requirements.minHeight) {
    return {
      valid: false,
      message: `Touch target ${width}x${height}px is below minimum ${requirements.minWidth}x${requirements.minHeight}px`,
    };
  }
  
  return { valid: true };
}

