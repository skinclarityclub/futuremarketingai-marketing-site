import { test, expect } from '@playwright/test'

/**
 * E2E Tests: Phase 19 — ChatWidget Concierge + ARIA Cleanup
 *
 * Tests:
 * 1. Floating chatbot visibility on all pages
 * 2. Route-based persona switching (concierge vs demo-guide)
 * 3. Chat panel open/close/escape behavior
 * 4. ARIA legacy code fully removed
 * 5. Chat dialog accessibility
 */

// Helper: wait for page + chat button ready
async function waitForChatButton(page: import('@playwright/test').Page) {
  const btn = page.locator('button[aria-label="Open chat"]')
  await expect(btn).toBeVisible({ timeout: 15000 })
  return btn
}

// Helper: open chat panel (force-click to bypass breathe animation)
async function openChat(page: import('@playwright/test').Page) {
  const btn = await waitForChatButton(page)
  await btn.click({ force: true })
  const panel = page.locator('[role="dialog"]')
  await expect(panel).toBeVisible()
  return panel
}

test.describe('Floating ChatWidget', () => {
  test('should show floating chat button on homepage', async ({ page }) => {
    await page.goto('/')
    await waitForChatButton(page)
  })

  test('should show floating chat button on marketing pages', async ({ page }) => {
    const marketingPages = ['/features', '/pricing', '/about', '/chatbots']

    for (const path of marketingPages) {
      await page.goto(path)
      await waitForChatButton(page)
    }
  })

  test('should show floating chat button on demo pages', async ({ page }) => {
    const demoPages = ['/explorer', '/calculator', '/dashboard']

    for (const path of demoPages) {
      await page.goto(path)
      await waitForChatButton(page)
    }
  })

  test('should open chat panel when clicking the floating button', async ({ page }) => {
    await page.goto('/')
    const panel = await openChat(page)

    // FAB label should change to "Close chat" (first one is the FAB, second is the header close)
    const closeFab = page.locator('button[aria-label="Close chat"]').first()
    await expect(closeFab).toBeVisible()
    await expect(panel).toBeVisible()
  })

  test('should close chat panel with Escape key', async ({ page }) => {
    await page.goto('/')
    const panel = await openChat(page)

    // Press Escape
    await page.keyboard.press('Escape')

    // Panel should be gone
    await expect(panel).not.toBeVisible()
  })

  test('should close chat panel when clicking floating button again', async ({ page }) => {
    await page.goto('/')
    await openChat(page)

    // Click the FAB close button (first match — FAB, not header close)
    const closeFab = page.locator('button[aria-label="Close chat"]').first()
    await closeFab.click({ force: true })

    // Panel should be gone
    const panel = page.locator('[role="dialog"]')
    await expect(panel).not.toBeVisible()
  })

  test('chat dialog should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/')
    const panel = await openChat(page)

    // Should have aria-modal
    await expect(panel).toHaveAttribute('aria-modal', 'true')

    // Should have aria-label
    const ariaLabel = await panel.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel).toContain('Chat with')
  })

  test('should have message input inside chat panel', async ({ page }) => {
    await page.goto('/')
    await openChat(page)

    const chatPanel = page.locator('[data-chatwidget-panel]')
    await expect(chatPanel).toBeVisible()

    // Should have a textarea for input
    const textarea = chatPanel.locator('textarea')
    await expect(textarea).toBeVisible()
    await expect(textarea).toHaveAttribute('placeholder', 'Type a message...')
  })
})

test.describe('Route-Based Persona Switching', () => {
  test('should use concierge persona on marketing pages', async ({ page }) => {
    await page.goto('/')
    const panel = await openChat(page)

    // The concierge persona should be active
    const ariaLabel = await panel.getAttribute('aria-label')
    expect(ariaLabel).toContain('Chat with')
  })

  test('should persist chat widget across route navigation', async ({ page }) => {
    await page.goto('/')
    await waitForChatButton(page)

    // Navigate to a demo page
    await page.goto('/explorer')
    await waitForChatButton(page)
  })

  test('should have concierge on /chatbots (service page, not demo)', async ({ page }) => {
    await page.goto('/chatbots')
    const panel = await openChat(page)

    // Panel should be open
    await expect(panel).toBeVisible()
  })
})

test.describe('ARIA Legacy Code Removal', () => {
  test('should not have old AI assistant components in DOM', async ({ page }) => {
    await page.goto('/')
    await waitForChatButton(page)

    // Old ARIA components should not exist
    const oldAssistant = page.locator('[data-aria-assistant], [data-journey-assistant]')
    await expect(oldAssistant).toHaveCount(0)

    // Old nudge toast should not exist
    const oldNudge = page.locator('[data-nudge-toast]')
    await expect(oldNudge).toHaveCount(0)
  })

  test('should not have FloatingElementProvider wrapper artifacts', async ({ page }) => {
    await page.goto('/')
    await waitForChatButton(page)

    const floatingContext = page.locator('[data-floating-element]')
    await expect(floatingContext).toHaveCount(0)
  })

  test('should clean up old localStorage on load', async ({ page }) => {
    // Seed old ARIA localStorage key
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('fmai-chat-state', '{"old":"data"}')
    })

    // Reload — App.tsx should clean it up
    await page.reload()
    await waitForChatButton(page)

    const oldState = await page.evaluate(() => localStorage.getItem('fmai-chat-state'))
    expect(oldState).toBeNull()
  })

  test('homepage should load without console errors from removed ARIA code', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto('/')
    await waitForChatButton(page)

    // Filter for ARIA-related errors
    const ariaErrors = consoleErrors.filter(
      (e) =>
        e.toLowerCase().includes('aria') ||
        e.toLowerCase().includes('journey') ||
        e.toLowerCase().includes('nudge') ||
        e.toLowerCase().includes('floating-element') ||
        e.toLowerCase().includes('openai')
    )
    expect(ariaErrors).toHaveLength(0)
  })

  test('should not reference openai in any loaded scripts', async ({ page }) => {
    const openaiScripts: string[] = []

    // Intercept JS responses
    page.on('response', async (response) => {
      const url = response.url()
      if (url.endsWith('.js') || url.endsWith('.mjs')) {
        try {
          const body = await response.text()
          if (body.includes('openai') || body.includes('OpenAI')) {
            openaiScripts.push(url)
          }
        } catch {
          // Ignore network errors
        }
      }
    })

    await page.goto('/')
    await waitForChatButton(page)

    expect(openaiScripts).toHaveLength(0)
  })
})

test.describe('ChatWidget on different page types', () => {
  test('should render on /features (marketing)', async ({ page }) => {
    await page.goto('/features')
    await waitForChatButton(page)
  })

  test('should render on /explorer (demo)', async ({ page }) => {
    await page.goto('/explorer')
    await waitForChatButton(page)
  })

  test('should render on /calculator (demo)', async ({ page }) => {
    await page.goto('/calculator')
    await waitForChatButton(page)
  })

  test('should render on /dashboard (demo)', async ({ page }) => {
    await page.goto('/dashboard')
    await waitForChatButton(page)
  })
})
