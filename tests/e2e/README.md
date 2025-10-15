# End-to-End (E2E) Tests - FutureMarketingAI

This directory contains E2E tests for critical user flows using **Playwright**.

## 🎯 Test Coverage

### 1. Navigation Tests (`navigation.spec.ts`)

- ✅ Homepage loading
- ✅ Navigation between all main pages
- ✅ Floating navigation functionality
- ✅ Scroll position management
- ✅ 404 handling
- ✅ **Keyboard navigation with skip links**

### 2. Calculator Tests (`calculator.spec.ts`)

- ✅ Calculator loading with defaults
- ✅ ROI calculation on input changes
- ✅ Results breakdown display
- ✅ PDF export functionality
- ✅ Value persistence across navigation
- ✅ Mobile responsiveness

### 3. Personalization Tests (`personalization.spec.ts`)

- ✅ Industry selector modal opening
- ✅ Industry selection
- ✅ Modal close with Escape key
- ✅ Modal close with close button
- ✅ Focus trapping in modals
- ✅ Personalized content display

### 4. Accessibility Tests (`accessibility.spec.ts`)

- ✅ Skip link visibility on focus
- ✅ Skip link navigation
- ✅ Proper ARIA attributes
- ✅ Visible focus indicators
- ✅ Keyboard-only navigation
- ✅ Heading structure
- ✅ Loading state announcements
- ✅ Color contrast (visual check)
- ✅ Accessible modals
- ✅ Full keyboard interaction support

## 🚀 Running Tests

### Local Development

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with UI mode (visual test runner)
npm run test:e2e:ui

# Run with browser visible (headed mode)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug

# View last test report
npm run test:e2e:report
```

### Run Specific Tests

```bash
# Run only navigation tests
npx playwright test navigation

# Run only calculator tests
npx playwright test calculator

# Run only accessibility tests
npx playwright test accessibility

# Run specific test by name
npx playwright test -g "should load homepage"
```

### Run on Specific Browsers

```bash
# Run on Chromium only
npx playwright test --project=chromium

# Run on Firefox
npx playwright test --project=firefox

# Run on Mobile Chrome
npx playwright test --project="Mobile Chrome"
```

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run test:e2e:report
```

The report includes:

- ✅ Pass/fail status for each test
- ⏱️ Execution times
- 📸 Screenshots on failure
- 🎥 Video recordings on failure
- 📝 Detailed error messages

## 🔧 Configuration

Tests are configured in `playwright.config.ts`:

- **Base URL:** `http://localhost:5173`
- **Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries:** 2 on CI, 0 locally
- **Timeout:** 30s per test
- **Screenshots:** On failure only
- **Videos:** On failure only
- **Traces:** On first retry

## 🤖 CI/CD Integration

E2E tests run automatically on:

- ✅ Pull requests to `main`
- ✅ Pushes to `main`

Workflow: `.github/workflows/e2e-tests.yml`

CI runs tests with:

- Chromium browser only (fastest)
- 1 worker (sequential execution for stability)
- 2 retries for flaky tests
- Test artifacts uploaded on failure

## 📝 Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code (navigate, login, etc.)
    await page.goto('/')
  })

  test('should do something', async ({ page }) => {
    // Arrange
    const button = page.locator('button')

    // Act
    await button.click()

    // Assert
    await expect(page).toHaveURL('/new-page')
  })
})
```

### Best Practices

1. **Use Data-Testid When Needed**

   ```typescript
   <button data-testid="submit-button">Submit</button>

   await page.locator('[data-testid="submit-button"]').click()
   ```

2. **Wait for Network Idle**

   ```typescript
   await page.waitForLoadState('networkidle')
   ```

3. **Use Accessible Selectors**

   ```typescript
   // ✅ Good: Use role and accessible name
   await page.locator('button:has-text("Submit")').click()
   await page.getByRole('button', { name: 'Submit' }).click()

   // ❌ Bad: Use brittle CSS selectors
   await page.locator('.btn-primary.submit').click()
   ```

4. **Test User Behavior, Not Implementation**

   ```typescript
   // ✅ Good: Test what user sees
   await expect(page.locator('text=Success!')).toBeVisible()

   // ❌ Bad: Test internal state
   await expect(page.locator('[data-state="success"]')).toExist()
   ```

5. **Handle Flakiness**

   ```typescript
   // Use built-in retries and waits
   await expect(element).toBeVisible({ timeout: 10000 })

   // Wait for specific condition
   await page.waitForFunction(() => window.dataLoaded === true)
   ```

## 🐛 Debugging Failed Tests

### 1. View Test Report

```bash
npm run test:e2e:report
```

### 2. Run in Debug Mode

```bash
npm run test:e2e:debug
```

This opens Playwright Inspector where you can:

- Step through each action
- Inspect DOM at each step
- View console logs
- See network requests

### 3. Run in Headed Mode

```bash
npm run test:e2e:headed
```

See the browser as tests run.

### 4. View Screenshots/Videos

After a failed test:

- Screenshots: `test-results/<test-name>/screenshot.png`
- Videos: `test-results/<test-name>/video.webm`
- Traces: `test-results/<test-name>/trace.zip`

View trace:

```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Writing Tests Guide](https://playwright.dev/docs/writing-tests)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Guide](https://playwright.dev/docs/ci)

## ✅ Test Checklist

Before committing new tests:

- [ ] Test passes locally (headless)
- [ ] Test passes in 3 browsers (chromium, firefox, webkit)
- [ ] Test passes on mobile viewports
- [ ] Test is stable (no flakiness)
- [ ] Test uses accessible selectors
- [ ] Test has clear naming (`should [action] when [condition]`)
- [ ] Test has proper assertions
- [ ] Test follows AAA pattern (Arrange, Act, Assert)
- [ ] Test is documented if complex

## 🎯 Success Metrics

**Current Status:**

- ✅ **28 E2E tests** covering critical user flows
- ✅ **4 test suites** (Navigation, Calculator, Personalization, Accessibility)
- ✅ **5 browsers** tested (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
- ✅ **CI/CD integration** with GitHub Actions
- ✅ **Accessibility compliance** verified with E2E tests

**Coverage Goals:**

- ✅ All critical user flows tested
- ✅ Mobile responsiveness verified
- ✅ Accessibility compliance confirmed
- ✅ Error handling tested
- ✅ Modal interactions verified

---

**Need Help?** Check the [Playwright docs](https://playwright.dev/) or contact the team.
