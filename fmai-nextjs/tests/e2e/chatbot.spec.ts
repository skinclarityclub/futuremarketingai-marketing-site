import { test, expect } from '@playwright/test'

/**
 * E2E Tests: ChatWidget — Next.js site
 *
 * ChatWidget is loaded via a placeholder (FloatingChatTrigger) which lazy-
 * imports ChatWidgetIsland → ChatWidget on first interaction. The placeholder
 * uses aria-label="Open chat met Clyde"; the hydrated widget uses
 * aria-label="Open chat" / "Close chat". Use prefix-matching selectors.
 */

async function waitForChatButton(page: import('@playwright/test').Page) {
  const btn = page.locator('button[aria-label^="Open chat"]').first()
  await expect(btn).toBeVisible({ timeout: 20000 })
  return btn
}

async function openChat(page: import('@playwright/test').Page) {
  const btn = await waitForChatButton(page)
  await btn.click({ force: true })
  // Use data-attribute to disambiguate from cookie-consent dialog which also
  // carries role="dialog" but with aria-label "We use cookies".
  const panel = page.locator('[data-chatwidget-panel]')
  await expect(panel).toBeVisible()
  return panel
}

// The cookie-consent banner (fixed bottom-0, z-9999) overlays the Clyde FAB
// (z-40, lg:bottom-24) and intercepts the open click. Pre-seed consent so the
// banner never renders and the FAB is reachable.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem(
        'cookieConsent',
        JSON.stringify({ functional: true, analytics: true, marketing: true })
      )
    } catch {
      /* storage disabled */
    }
  })
})

test.describe('Floating ChatWidget', () => {
  test('should show floating chat button on homepage', async ({ page }) => {
    await page.goto('/en')
    await waitForChatButton(page)
  })

  test('should show floating chat button on skill pages', async ({ page }) => {
    const pages = ['/en/skills/clyde', '/en/pricing', '/en/about']

    for (const path of pages) {
      await page.goto(path)
      await waitForChatButton(page)
    }
  })

  test('should open chat panel when clicking the floating button', async ({ page }) => {
    await page.goto('/en')
    const panel = await openChat(page)

    // While open the launcher renders nothing; the one close control sits in the panel header.
    await expect(panel.getByRole('button', { name: /^(Sluit|Close) chat$/ })).toBeVisible()
    await expect(page.locator('[data-clyde-launcher]')).toHaveCount(0)
  })

  test('should close chat panel with Escape key', async ({ page }) => {
    await page.goto('/en')
    const panel = await openChat(page)

    // Desktop is non-modal: Escape only closes once focus is inside the panel (the composer gets it after 300 ms).
    await expect(panel.locator('textarea')).toBeFocused()
    await page.keyboard.press('Escape')

    await expect(panel).not.toBeVisible()
  })

  test('should close chat panel with the close button in its header', async ({ page }) => {
    await page.goto('/en')
    const panel = await openChat(page)

    await panel.getByRole('button', { name: /^(Sluit|Close) chat$/ }).click()

    await expect(panel).not.toBeVisible()
    await expect(page.locator('[data-clyde-launcher]')).toBeVisible()
  })

  test('chat dialog should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/en')
    const panel = await openChat(page)

    // Modal only below lg (PHONE_QUERY in ChatWidget.tsx), where the panel fills the screen and the page is inert.
    const isPhone = (page.viewportSize()?.width ?? 1280) <= 1023
    if (isPhone) await expect(panel).toHaveAttribute('aria-modal', 'true')
    else await expect(panel).not.toHaveAttribute('aria-modal', /.*/)
    await expect(panel).toHaveAttribute('role', 'dialog')

    const ariaLabel = await panel.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel).toContain('Chat met')
  })

  test('should have message input inside chat panel', async ({ page }) => {
    await page.goto('/en')
    await openChat(page)

    const chatPanel = page.locator('[data-chatwidget-panel]')
    await expect(chatPanel).toBeVisible()

    const textarea = chatPanel.locator('textarea')
    await expect(textarea).toBeVisible()
    // Placeholder comes from i18n; just verify it has one.
    const placeholder = await textarea.getAttribute('placeholder')
    expect(placeholder).toBeTruthy()
  })
})

test.describe('ChatWidget on different page types', () => {
  const pages = [
    { path: '/en', name: 'homepage' },
    { path: '/en/skills/clyde', name: 'Clyde skill page' },
    { path: '/en/pricing', name: 'pricing' },
    { path: '/en/about', name: 'about' },
    { path: '/en/contact', name: 'contact' },
  ]

  for (const { path, name } of pages) {
    test(`should render on ${name} page`, async ({ page }) => {
      await page.goto(path)
      await waitForChatButton(page)
    })
  }
})

test.describe('ChatWidget persistence across navigation', () => {
  test('should persist chat widget across route navigation', async ({ page }) => {
    await page.goto('/en')
    await waitForChatButton(page)

    // :visible, because on a phone the header link sits in the closed menu; the footer link is the visible one there.
    // ^="/en/pricing", because #waarom also links to the external planable.io/pricing (opens in a new tab).
    await page.locator('a[href^="/en/pricing"]:visible').first().click()
    await expect(page).toHaveURL(/\/en\/pricing/)

    await waitForChatButton(page)
  })
})
