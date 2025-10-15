# Visual Regression Testing Setup

Guide for implementing visual regression tests for chart components.

## Overview

Visual regression testing ensures that chart components maintain their appearance across updates. This prevents unintended visual changes from being deployed.

## Recommended Tools

### 1. Playwright with Visual Comparison

**Pros:**

- Built-in screenshot comparison
- Cross-browser testing
- Fast and reliable
- TypeScript support

**Setup:**

```bash
npm install -D @playwright/test
npx playwright install
```

**Example Test:**

```typescript
// tests/charts.visual.spec.ts
import { test, expect } from '@playwright/test'

test.describe('ComparisonCharts Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculator')
    await page.waitForSelector('[data-testid="comparison-charts"]')
  })

  test('bar chart appearance', async ({ page }) => {
    await page.click('[data-chart-type="bar"]')
    await page.waitForTimeout(500) // Animation settle

    await expect(page.locator('[data-testid="comparison-charts"]')).toHaveScreenshot(
      'bar-chart.png',
      {
        maxDiffPixels: 100,
      }
    )
  })

  test('radar chart appearance', async ({ page }) => {
    await page.click('[data-chart-type="radar"]')
    await page.waitForTimeout(500)

    await expect(page.locator('[data-testid="comparison-charts"]')).toHaveScreenshot(
      'radar-chart.png',
      {
        maxDiffPixels: 100,
      }
    )
  })

  test('projection chart appearance', async ({ page }) => {
    await page.click('[data-chart-type="projection"]')
    await page.waitForTimeout(500)

    await expect(page.locator('[data-testid="comparison-charts"]')).toHaveScreenshot(
      'projection-chart.png',
      {
        maxDiffPixels: 100,
      }
    )
  })

  test('mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)

    await expect(page.locator('[data-testid="comparison-charts"]')).toHaveScreenshot(
      'mobile-chart.png',
      {
        maxDiffPixels: 100,
      }
    )
  })
})
```

**Run Tests:**

```bash
# Generate baseline screenshots
npx playwright test --update-snapshots

# Run visual regression tests
npx playwright test

# View report
npx playwright show-report
```

---

### 2. Chromatic (Storybook Integration)

**Pros:**

- Cloud-based
- UI review workflow
- Component isolation
- Team collaboration

**Setup:**

```bash
npm install -D @storybook/react @chromatic-com/storybook
npx storybook init
```

**Example Story:**

```typescript
// src/components/calculator/ComparisonCharts.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComparisonCharts } from './ComparisonCharts'

const meta: Meta<typeof ComparisonCharts> = {
  title: 'Calculator/ComparisonCharts',
  component: ComparisonCharts,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ComparisonCharts>

export const BarChart: Story = {
  args: {
    metrics: {
      totalROI: 250,
      currentROAS: 3.5,
      laborCostSavings: 5000,
      revenueIncrease: 10000,
      netBenefit: 15000,
    },
    inputs: {
      teamSize: 5,
      avgSalary: 60000,
      campaignsPerMonth: 20,
    },
    systemCost: 1200,
  },
}

export const RadarChart: Story = {
  args: BarChart.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radarButton = canvas.getByText('🎯 Capabilities')
    await userEvent.click(radarButton)
  },
}

export const Mobile: Story = {
  args: BarChart.args,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}
```

**Run Chromatic:**

```bash
npm run build-storybook
npx chromatic --project-token=<your-token>
```

---

### 3. Percy (Cross-browser)

**Pros:**

- Cross-browser screenshots
- DOM snapshots (no flakiness)
- Responsive testing
- CI/CD integration

**Setup:**

```bash
npm install -D @percy/cli @percy/playwright
```

**Example:**

```typescript
import { test } from '@playwright/test'
import percySnapshot from '@percy/playwright'

test('chart visual regression', async ({ page }) => {
  await page.goto('/calculator')
  await page.waitForSelector('[data-testid="comparison-charts"]')

  // Take Percy snapshot
  await percySnapshot(page, 'ComparisonCharts - Desktop')

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 })
  await percySnapshot(page, 'ComparisonCharts - Mobile')
})
```

---

## Implementation Strategy

### Phase 1: Basic Setup (Recommended Start)

1. **Add Playwright:**

   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

2. **Add test script to package.json:**

   ```json
   {
     "scripts": {
       "test:visual": "playwright test",
       "test:visual:update": "playwright test --update-snapshots"
     }
   }
   ```

3. **Create initial tests:**
   - Bar chart
   - Radar chart
   - Projection chart
   - Mobile view

### Phase 2: CI/CD Integration

Add to GitHub Actions workflow:

```yaml
# .github/workflows/visual-regression.yml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:visual

      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: visual-diff
          path: test-results/
```

### Phase 3: Advanced Features

- Set up Chromatic for UI review workflow
- Add Percy for cross-browser testing
- Implement automated baseline updates
- Add visual tests to pre-commit hooks

---

## Best Practices

### 1. Stable Test Environment

```typescript
test.beforeEach(async ({ page }) => {
  // Disable animations for consistent screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  })

  // Set consistent viewport
  await page.setViewportSize({ width: 1280, height: 720 })

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready)
})
```

### 2. Handle Dynamic Content

```typescript
// Mock dynamic timestamps
await page.addInitScript(() => {
  Date.now = () => 1697298000000 // Fixed timestamp
})

// Wait for data loading
await page.waitForFunction(() => {
  const chart = document.querySelector('[data-testid="chart"]')
  return chart && chart.getAttribute('data-loaded') === 'true'
})
```

### 3. Ignore Flaky Areas

```typescript
await expect(page).toHaveScreenshot('chart.png', {
  // Ignore specific regions (e.g., timestamps)
  mask: [page.locator('.timestamp')],

  // Tolerance for minor differences
  maxDiffPixels: 100,
  maxDiffPixelRatio: 0.01,
})
```

### 4. Organize Screenshots

```
tests/
  screenshots/
    baseline/
      chart-bar-desktop.png
      chart-radar-mobile.png
    actual/
    diff/
```

### 5. Review Process

1. **Initial Baseline**: Create baseline screenshots
2. **Code Changes**: Make component updates
3. **Run Tests**: Generate comparison screenshots
4. **Review Diffs**: Manually review visual changes
5. **Approve/Reject**: Update baseline or fix issues
6. **Commit**: Commit approved baseline changes

---

## Chart-Specific Considerations

### Dynamic Data

```typescript
// Use fixed test data
const mockMetrics = {
  totalROI: 250,
  currentROAS: 3.5,
  // ... fixed values
}

// Mock API responses
await page.route('**/api/metrics', (route) => {
  route.fulfill({ json: mockMetrics })
})
```

### Animations

```typescript
// Wait for animations to complete
await page.click('[data-chart-type="radar"]')
await page.waitForTimeout(500) // Animation duration
await page.waitForFunction(() => {
  const chart = document.querySelector('.recharts-surface')
  return window.getComputedStyle(chart).opacity === '1'
})
```

### Responsive Testing

```typescript
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 720 },
]

for (const viewport of viewports) {
  test(`chart on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await expect(page).toHaveScreenshot(`chart-${viewport.name}.png`)
  })
}
```

---

## Maintenance

### Updating Baselines

```bash
# Update all baselines
npm run test:visual:update

# Update specific test
npx playwright test charts.visual.spec.ts --update-snapshots

# Update only failed tests
npm run test:visual -- --update-snapshots-on-failure
```

### Handling False Positives

1. **Increase tolerance:**

   ```typescript
   maxDiffPixels: 200 // Allow more pixel differences
   ```

2. **Mask dynamic areas:**

   ```typescript
   mask: [page.locator('.dynamic-content')]
   ```

3. **Disable animations:**
   ```typescript
   prefers-reduced-motion: reduce
   ```

---

## Debugging Failed Tests

```bash
# Run with UI mode
npx playwright test --ui

# Run with debug mode
npx playwright test --debug

# View test report
npx playwright show-report

# Open specific screenshot
open test-results/charts-bar-chart/actual.png
open test-results/charts-bar-chart/diff.png
```

---

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run visual regression tests
  run: npm run test:visual

- name: Upload diff artifacts
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: visual-regression-diffs
    path: test-results/**/diff.png
```

### Pre-commit Hook

```json
// .husky/pre-commit
npm run test:visual
```

---

## Resources

- [Playwright Visual Comparison](https://playwright.dev/docs/test-snapshots)
- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [Percy Documentation](https://docs.percy.io/)
- [Visual Testing Best Practices](https://www.browserstack.com/guide/visual-regression-testing)

---

_Last Updated: October 14, 2025_
