import { test, expect } from '@playwright/test'

// Two groups share "Harber" (→ picker); "Stanish" is unique (→ straight to the
// party form). The same success payload answers GUESTS (guests) and the PUT
// submit (status). Stubbed — no network.
const GUESTS = {
    '1': [{ first: 'Andy', last: 'Harber', slot: false }],
    '2': [{ first: 'Pat', last: 'Harber', slot: false }],
    '3': [{ first: 'Sam', last: 'Stanish', slot: false }],
}
const reply = { guests: GUESTS, status: 'success' }

test.beforeEach(async ({ context, page }) => {
    // The page's inline guard redirects to / without a token; set one first.
    await context.addInitScript(() => localStorage.setItem('token', 'test-token'))
    await page.route('**/exec', route =>
        route.fulfill({ body: JSON.stringify(reply), contentType: 'application/json' }))
})

test('a shared last name shows the party picker, then the party form', async ({ page }) => {
    await page.goto('/rsvp/')
    await page.fill('#last', 'Harber')
    await page.click('#name-form button[type="submit"]')

    const picks = page.locator('#step-pick .party-pick')
    await expect(picks).toHaveCount(2)
    await picks.first().click()

    await expect(page.locator('#step-party')).toBeVisible()
    await expect(page.locator('#members .member')).toHaveCount(1)
})

test('a unique last name skips the picker; submitting shows the thank-you step', async ({ page }) => {
    await page.goto('/rsvp/')
    await page.fill('#last', 'Stanish')
    await page.click('#name-form button[type="submit"]')

    await expect(page.locator('#step-party')).toBeVisible()
    await expect(page.locator('#members .member')).toHaveCount(1)   // Sam, attending by default

    await page.click('#party-form button[type="submit"]')
    await expect(page.locator('#step-thanks')).toBeVisible()
    await expect(page.locator('#step-party')).toBeHidden()
})
