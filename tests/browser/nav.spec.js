import { test, expect } from '@playwright/test'
import { angleFromStation } from '../../radio-math.js'

test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => localStorage.setItem('token', 'test-token'))
})

test('renders every station with the right href and marks the current one active', async ({ page }) => {
    await page.goto('/home/')
    const stations = page.locator('#stations .station')
    await expect(stations).toHaveText(['HOME', 'RSVP', 'SCHEDULE', 'TRAVEL', 'FAQ'])
    await expect(page.locator('#stations .station[href="/home/"]')).toHaveClass(/active/)
})

test('dragging the knob to a station tunes there and navigates', async ({ page }) => {
    await page.goto('/home/')
    const knob = page.locator('#knob')
    await knob.scrollIntoViewIfNeeded()
    const box = await knob.boundingBox()
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2

    // Target SCHEDULE (index 2). The knob reads the pointer angle clockwise from
    // straight up, so place the pointer at that station's dial angle:
    //   px = cx + R·sinθ,  py = cy − R·cosθ
    const deg = angleFromStation(2, 5)            // 135°
    const rad = (deg * Math.PI) / 180
    const R = 80
    const px = cx + R * Math.sin(rad)
    const py = cy - R * Math.cos(rad)

    await page.mouse.move(cx, cy)
    await page.mouse.down()
    await page.mouse.move(px, py, { steps: 8 })
    await page.mouse.up()

    await page.waitForURL('**/schedule/**')
    expect(new URL(page.url()).pathname).toBe('/schedule/')
})

test('on mobile the knob toggles the station menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/home/')
    const knob = page.locator('#knob')
    await expect(knob).toHaveAttribute('aria-expanded', 'false')

    await knob.click()
    await expect(page.locator('body')).toHaveClass(/menu-open/)
    await expect(knob).toHaveAttribute('aria-expanded', 'true')
})
