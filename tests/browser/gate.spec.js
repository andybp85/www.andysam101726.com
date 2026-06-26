import { test, expect } from '@playwright/test'

// The Apps Script backend is stubbed via route interception — nothing leaves the
// machine. A single success payload satisfies both the login POST (token,
// redirect) and the guest prefetch (guests).
const ok = { status: 'success', token: 'test-token', redirect: '/home/', guests: {} }
const json = body => route => route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) })

test('successful login stores the token and redirects home', async ({ page }) => {
    await page.route('**/exec', json(ok))
    await page.goto('/')
    await page.fill('#password', 'Harber')
    await page.click('button[name="submit-button"]')
    await page.waitForURL('**/home/**')
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBe('test-token')
})

test('rejected login shows the error message and stays on the gate', async ({ page }) => {
    await page.route('**/exec', json({ status: 'error', message: 'We could not find that name.' }))
    await page.goto('/')
    await page.fill('#password', 'Nope')
    await page.click('button[name="submit-button"]')
    await expect(page.locator('#error-msg')).toHaveText('We could not find that name.')
    expect(new URL(page.url()).pathname).toBe('/')
})
