import { test, expect } from '@playwright/test'

// Two groups share "Harber" (→ picker); "Stanish" is unique (→ straight to the
// party form). The same success payload answers GUESTS (guests) and the PUT
// submit (status). Stubbed — no network.
const GUESTS = {
    '1': [{ first: 'Andy', last: 'Harber', slot: false }],
    '2': [{ first: 'Pat', last: 'Harber', slot: false }],
    '3': [{ first: 'Sam', last: 'Stanish', slot: false }],
    '4': [{ first: '<img src=x onerror=alert(1)>', last: 'Mallory', slot: false }],
    '5': [{ first: 'Gina', last: 'Lettera', slot: false }, { first: '', last: '', slot: true }],
}
const RESPONSES = {
    '2': [{ attending: false, first: 'Pat', isGuest: false, last: 'Harber' }],
    '5': [
        { attending: true, first: 'Gina', isGuest: false, last: 'Lettera' },
        { attending: true, first: 'Jeff', isGuest: true, last: 'Coursey' },
    ],
}
const reply = { guests: GUESTS, responses: RESPONSES, status: 'success' }

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

test('markup in an API guest name renders as text, not HTML', async ({ page }) => {
    await page.goto('/rsvp/')
    await page.fill('#last', 'Mallory')
    await page.click('#name-form button[type="submit"]')

    await expect(page.locator('#members .member-name'))
        .toHaveText('<img src=x onerror=alert(1)> Mallory')
    await expect(page.locator('#members img')).toHaveCount(0)
})

test('a party that already RSVP\'d sees the banner and their saved answers', async ({ page }) => {
    await page.goto('/rsvp/')
    await page.fill('#last', 'Harber')
    await page.click('#name-form button[type="submit"]')
    await page.locator('#step-pick .party-pick').nth(1).click()   // Pat, group '2'

    await expect(page.locator('#already-rsvpd')).toBeVisible()
    await expect(page.locator('input[name="att-0"][value="no"]')).toBeChecked()
})

test('a party without a prior RSVP gets the default form and no banner', async ({ page }) => {
    await page.goto('/rsvp/')
    await page.fill('#last', 'Stanish')
    await page.click('#name-form button[type="submit"]')

    await expect(page.locator('#already-rsvpd')).toBeHidden()
    await expect(page.locator('input[name="att-0"][value="yes"]')).toBeChecked()
})

test('a saved +1 guest prefills the name field', async ({ page }) => {
    await page.goto('/rsvp/')
    await page.fill('#last', 'Lettera')
    await page.click('#name-form button[type="submit"]')

    await expect(page.locator('#already-rsvpd')).toBeVisible()
    await expect(page.locator('input[name="att-0"][value="yes"]')).toBeChecked()
    await expect(page.locator('.guest-name')).toHaveValue('Jeff Coursey')
    await expect(page.locator('.guest-decline')).not.toBeChecked()
})

test('a resubmit writes the new answers through to the session cache', async ({ page }) => {
    await page.goto('/rsvp/')
    await page.fill('#last', 'Stanish')
    await page.click('#name-form button[type="submit"]')
    await page.check('input[name="att-0"][value="no"]', { force: true })
    await page.click('#party-form button[type="submit"]')
    await expect(page.locator('#step-thanks')).toBeVisible()

    const cached = await page.evaluate(() =>
        JSON.parse(sessionStorage.getItem('guestData')).responses['3'])
    expect(cached).toEqual([{ attending: false, first: 'Sam', isGuest: false, last: 'Stanish' }])
})
