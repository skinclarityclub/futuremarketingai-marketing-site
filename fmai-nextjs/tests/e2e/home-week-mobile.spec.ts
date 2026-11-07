import { test, expect } from '@playwright/test'

/**
 * "Een week met Clyde" on a phone (Daley 2026-11-08): the seven days stand under each other, each text right above
 * its scene, so scrolling shows the whole week. Before, one day showed behind a picker of seven buttons.
 * Red before: on that picker layout only one scene is visible, so the visibility and order checks fail.
 */

test.skip(({ isMobile }) => !isMobile, 'phone layout of the week')

test('the whole week shows by scrolling, day by day', async ({ page }) => {
  await page.goto('/nl')
  const sec = page.locator('#een-week-met-clyde')
  await sec.scrollIntoViewIfNeeded()

  const texts = sec.locator('#desc p')
  const scenes = sec.locator('.st')
  // setup: seven days in the markup, else the checks below compare nothing
  await expect(texts).toHaveCount(7)
  await expect(scenes).toHaveCount(7)
  await expect(sec.locator('#rail')).toBeHidden()

  const vw = page.viewportSize()!.width
  let lastBottom = 0
  for (let i = 0; i < 7; i++) {
    const text = texts.nth(i)
    const scene = scenes.nth(i)
    await text.scrollIntoViewIfNeeded()
    await expect(text).toBeVisible()
    await scene.scrollIntoViewIfNeeded()
    await expect(scene).toBeVisible()
    // the day label comes from the rail copy, e.g. "Ma · Dagstart"
    expect(await text.getAttribute('data-day')).toMatch(/^\S+ · \S+/)

    const sb = (await scene.boundingBox())!
    const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY
    const tTop = await text.evaluate(docTop)
    const sTop = await scene.evaluate(docTop)
    // order: this text below the previous scene, this scene below this text
    expect(tTop).toBeGreaterThanOrEqual(lastBottom)
    expect(sTop).toBeGreaterThan(tTop)
    // the scene fits the phone: no wider than the viewport, and not shrunk to a stamp
    expect(sb.width).toBeLessThanOrEqual(vw)
    expect(sb.width).toBeGreaterThan(vw * 0.75)
    lastBottom = sTop + sb.height
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1)
})
