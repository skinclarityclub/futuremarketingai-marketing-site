# Testing Patterns

**Analysis Date:** 2026-03-21

## Test Framework

**Runner:**

- Playwright `^1.58.2`
- Config: `fmai-nextjs/playwright.config.ts`

**Assertion Library:**

- Playwright built-in `expect` with web-first assertions

**Run Commands:**

```bash
npm run test:e2e           # Run all tests
npm run test:e2e:ui        # Interactive UI mode
npm run test:e2e:headed    # Headed browser mode
npm run test:e2e:debug     # Debug mode with inspector
npm run test:e2e:report    # View HTML report
```

**No Unit Test Framework:**

- No Jest, Vitest, or other unit test runner is configured
- All testing is E2E via Playwright
- No `*.test.ts` or `*.spec.ts` files in `src/`

## Test File Organization

**Location:**

- All tests in `fmai-nextjs/tests/e2e/` (separate from source)
- No co-located tests in `src/`

**Naming:**

- `{feature}.spec.ts` pattern using kebab-case

**Structure:**

```
fmai-nextjs/tests/e2e/
  accessibility.spec.ts    # ARIA, headings, keyboard nav, focus, alt text
  chatbot.spec.ts          # ChatWidget open/close, persistence, a11y
  demo-full-flow.spec.ts   # Guided demo scenarios with real AI (needs API key)
  guided-demo.spec.ts      # Demo UI: panel basics, scenario selection, orchestrator
  homepage.spec.ts         # Homepage sections, interactions, CTA links
  i18n.spec.ts             # Locale routing, switcher, content per locale
  navigation.spec.ts       # Route navigation, service pages, marketing pages, 404
  performance.spec.ts      # Console errors, network failures, load time, assets
  seo.spec.ts              # Meta tags, JSON-LD, robots.txt, canonicals, hreflang
```

## Playwright Configuration

**Browser Projects:**

- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)

**Web Server:**

- Auto-starts `npm run dev -- --port 3000` with 180s timeout
- Reuses existing server if running
- Health check URL: `http://localhost:3000/en`

**Execution:**

- Fully parallel test execution
- CI mode: 1 worker, 2 retries, `html` + `github` reporters
- Local mode: auto workers, 0 retries, `html` + `list` reporters
- Traces captured on first retry
- Screenshots on failure only
- Video retained on failure only

## Test Structure

**Suite Organization:**

```typescript
import { test, expect } from '@playwright/test'

/**
 * E2E Tests: [Feature Name] -- Next.js site
 *
 * [Description of what this suite validates]
 */

test.describe('Feature Group', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
  })

  test('should [expected behavior]', async ({ page }) => {
    // Arrange: locate elements
    const element = page.locator('selector')

    // Assert
    await expect(element).toBeVisible()
  })
})
```

**Patterns:**

- Each file has a JSDoc block comment describing purpose and context
- `test.describe` groups related tests by feature area
- `test.beforeEach` used for common navigation setup
- Assertions use Playwright's auto-waiting `expect(locator).toBeVisible()`
- Data-driven tests use `for...of` loops over arrays of test cases:
  ```typescript
  const servicePages = [
    { path: '/en/chatbots', name: 'Chatbots' },
    { path: '/en/automations', name: 'Automations' },
  ]
  for (const { path, name } of servicePages) {
    test(`should load ${name} page`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('h1').first()).toBeVisible()
    })
  }
  ```

**AI-Dependent Tests:**

- `fmai-nextjs/tests/e2e/demo-full-flow.spec.ts` requires `ANTHROPIC_API_KEY`
- Configured with `test.describe.configure({ retries: 1 })` for AI non-determinism
- Uses generous timeouts: `AI_RESPONSE_TIMEOUT = 60_000`, `STEP_TIMEOUT = 90_000`

## Helper Functions

**Common Helpers (defined per file, not shared):**

```typescript
// Wait for lazy-loaded chat button
async function waitForChatButton(page: Page) {
  const btn = page.locator('button[aria-label="Open chat"]')
  await expect(btn).toBeVisible({ timeout: 20000 })
  return btn
}

// Open chat panel
async function openChat(page: Page) {
  const btn = await waitForChatButton(page)
  await btn.click({ force: true })
  const panel = page.locator('[role="dialog"]')
  await expect(panel).toBeVisible()
  return panel
}

// Dismiss cookie consent
async function dismissCookieConsent(page: Page) {
  await page.waitForTimeout(1_000)
  await page.evaluate(() => {
    document
      .querySelectorAll('.cookie-consent-container, .CookieConsent')
      .forEach((el) => el.remove())
  })
}
```

**Note:** Helper functions are duplicated across test files (`chatbot.spec.ts`, `guided-demo.spec.ts`, `demo-full-flow.spec.ts` all define `waitForChatButton` and `openChat`). There is no shared fixtures/helpers file.

## Locator Strategy

**Priority order used in tests:**

1. ARIA attributes: `button[aria-label="Open chat"]`, `nav[aria-label="Main navigation"]`
2. Semantic roles: `[role="dialog"]`, `[role="menu"]`, `[role="menuitem"]`
3. Data attributes: `[data-chatwidget-panel]`, `[data-testid="cookie-consent"]`
4. Section IDs: `#services`, `section[aria-labelledby="hero"]`
5. CSS selectors as fallback: `.grid > div`, `.grid a`
6. Text content: `page.getByText('Choose a scenario')`, `button:has-text("Services")`

**Best practice for new tests:**

- Prefer `aria-label`, `aria-labelledby`, and `role` attributes
- Use `data-testid` when no semantic attribute exists
- Avoid fragile CSS class selectors

## Mocking

**Framework:** None

**Approach:**

- All E2E tests run against the real Next.js dev server
- No mocking of API routes, components, or external services
- AI-dependent tests (`demo-full-flow.spec.ts`) use the real Anthropic API
- Cookie consent dismissed by DOM manipulation (`page.evaluate`)

**What is NOT mocked:**

- API routes (`/api/chatbot`, `/api/contact`)
- External AI service (Anthropic Claude)
- Translation/i18n system
- Browser APIs

## Fixtures and Factories

**Test Data:**

- No shared fixtures directory
- Test data defined inline as const arrays:
  ```typescript
  const servicePages = [
    { path: '/en/chatbots', name: 'Chatbots' },
    { path: '/en/automations', name: 'Automations' },
    { path: '/en/voice-agents', name: 'Voice Agents' },
    { path: '/en/marketing-machine', name: 'Marketing Machine' },
  ]
  ```

**Location:**

- All test data inline within spec files
- No `fixtures/`, `factories/`, or `__mocks__/` directories

## Coverage

**Requirements:** None enforced

**View Coverage:** Not applicable (Playwright E2E does not generate code coverage)

**Coverage gaps:** No unit tests exist. All validation logic in `fmai-nextjs/src/lib/chatbot/security.ts`, `fmai-nextjs/src/lib/chatbot/rate-limiter.ts`, `fmai-nextjs/src/lib/chatbot/complexity-detector.ts`, and `fmai-nextjs/src/lib/chatbot/topic-router.ts` is only tested indirectly through E2E.

## Test Types

**Unit Tests:**

- Not present. No unit test framework configured.

**Integration Tests:**

- Not present as a separate category.

**E2E Tests (all testing):**

- 9 spec files covering: homepage, navigation, SEO, i18n, accessibility, chatbot, guided demo, performance, full demo flow
- Run against real dev server on port 3000
- Cross-browser: Chromium, Firefox, WebKit

## Common Patterns

**Page Load and Wait:**

```typescript
await page.goto('/en')
await page.waitForLoadState('networkidle')
```

**Visibility Assertion:**

```typescript
const element = page.locator('section[aria-labelledby="hero"]')
await expect(element).toBeVisible()
```

**Count Assertion:**

```typescript
const cards = section.locator('.grid > div')
await expect(cards).toHaveCount(4)
```

**URL Assertion:**

```typescript
await expect(page).toHaveURL(/\/en\/pricing/)
```

**Attribute Assertion:**

```typescript
await expect(page.locator('html')).toHaveAttribute('lang', 'en')
await expect(metaDescription).toHaveAttribute('content', /.+/)
```

**Console Error Monitoring:**

```typescript
const consoleErrors: string[] = []
page.on('console', (msg) => {
  if (msg.type() === 'error') {
    consoleErrors.push(msg.text())
  }
})
// ... navigate and act ...
const criticalErrors = consoleErrors.filter(
  (e) => !e.includes('hydration') && !e.includes('favicon')
)
expect(criticalErrors).toHaveLength(0)
```

**JSON-LD Extraction:**

```typescript
const jsonLd = await page.evaluate(() => {
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
  return scripts.map((s) => JSON.parse(s.textContent || '{}'))
})
const orgSchema = jsonLd.find((s) => s['@type'] === 'Organization')
expect(orgSchema).toBeTruthy()
```

**Graceful Failure Handling:**

```typescript
// 404 pages: accept either 200 or 404
if (response) {
  expect([200, 404]).toContain(response.status())
}
await expect(page.locator('body')).toBeVisible()
```

## Adding New Tests

**New E2E test file:**

1. Create `fmai-nextjs/tests/e2e/{feature}.spec.ts`
2. Import `{ test, expect }` from `@playwright/test`
3. Add JSDoc block comment describing the suite
4. Group with `test.describe`
5. Navigate to `/en` (or appropriate locale path) in `beforeEach` or per-test
6. Use ARIA/role locators over CSS selectors
7. All routes are locale-prefixed: `/en/pricing`, `/nl/about`, etc.

**When to add unit tests:**

- If/when a unit test framework (Vitest recommended) is added, prioritize:
  - `fmai-nextjs/src/lib/chatbot/security.ts` (input validation, PII detection)
  - `fmai-nextjs/src/lib/chatbot/rate-limiter.ts` (rate limiting logic)
  - `fmai-nextjs/src/lib/chatbot/topic-router.ts` (keyword matching)
  - `fmai-nextjs/src/lib/chatbot/complexity-detector.ts` (model selection)
  - `fmai-nextjs/src/lib/utils.ts` (`cn()` utility)
  - Zod schemas in API routes

---

_Testing analysis: 2026-03-21_
