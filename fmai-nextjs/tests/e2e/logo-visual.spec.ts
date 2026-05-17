import { test, expect } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'test-results/logo-visual'
mkdirSync(OUT, { recursive: true })

/* eslint-disable @typescript-eslint/no-explicit-any */

test.describe('Synapse logo — in-context visual review', () => {
  test('Desktop homepage header (1440 wide)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/nl', { waitUntil: 'networkidle' })

    const header = page.locator('header').first()
    await expect(header).toBeVisible()

    // Header only (top ~80px)
    await page.screenshot({
      path: join(OUT, '01-header-desktop.png'),
      clip: { x: 0, y: 0, width: 1440, height: 80 },
    })

    // Header + a bit of hero below
    await page.screenshot({
      path: join(OUT, '02-header-with-hero.png'),
      clip: { x: 0, y: 0, width: 1440, height: 400 },
    })

    // Logo area zoom (left 360px)
    await page.screenshot({
      path: join(OUT, '03-logo-zoom.png'),
      clip: { x: 0, y: 0, width: 360, height: 80 },
    })
  })

  test('Mobile homepage header (375 wide)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/nl', { waitUntil: 'networkidle' })
    await page.screenshot({
      path: join(OUT, '04-header-mobile.png'),
      clip: { x: 0, y: 0, width: 375, height: 80 },
    })
  })

  test('Scrolled header (sticky state)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/nl', { waitUntil: 'networkidle' })
    await page.evaluate(() => window.scrollTo(0, 800))
    await page.waitForTimeout(500) // let scroll-state animation settle
    await page.screenshot({
      path: join(OUT, '05-header-scrolled.png'),
      clip: { x: 0, y: 0, width: 1440, height: 80 },
    })
  })

  test('Logo lab page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/nl/logo-lab', { waitUntil: 'networkidle' })
    await page.screenshot({
      path: join(OUT, '06-logo-lab-top.png'),
      fullPage: false,
    })
    await page.screenshot({
      path: join(OUT, '07-logo-lab-full.png'),
      fullPage: true,
    })
  })

  test('Favicon SVG response', async ({ request }) => {
    const res = await request.get('http://localhost:3005/icon.svg')
    expect(res.status()).toBe(200)
    const body = await res.text()
    // Sanity check: contains Synapse fingerprints
    expect(body).toContain('#00d4aa')
    expect(body).toContain('#f5a623')
    expect(body).toContain('<circle')
    expect(body).not.toContain('radialGradient') // confirm we removed the orb
  })

  test('OG image renders without error', async ({ page }) => {
    const res = await page.goto('http://localhost:3005/nl/opengraph-image', {
      waitUntil: 'load',
    })
    expect(res?.status()).toBe(200)
    expect(res?.headers()['content-type']).toContain('image')
  })
})
