import { test, expect } from '@playwright/test'

// The Apps Script backend is stubbed via route interception — nothing leaves the
// machine. A single success payload satisfies both the login POST (token,
// redirect) and the guest prefetch (guests).
const ok = { guests: {}, redirect: '/home/', status: 'success', token: 'test-token' }
const json = body => route => route.fulfill({ body: JSON.stringify(body), contentType: 'application/json' })

test('successful login stores the token and redirects home', async ({ page }) => {
    await page.route('**/exec', json(ok))
    await page.goto('/')
    await page.fill('#password', 'Harber')
    await page.click('button[name="submit-button"]')
    await page.waitForURL('**/home/**')
    expect(await page.evaluate(() => localStorage.getItem('token'))).toBe('test-token')
})

test('rejected login shows the error message and stays on the gate', async ({ page }) => {
    await page.route('**/exec', json({ message: 'We could not find that name.', status: 'error' }))
    await page.goto('/')
    await page.fill('#password', 'Nope')
    await page.click('button[name="submit-button"]')
    await expect(page.locator('#error-msg')).toHaveText('We could not find that name.')
    expect(new URL(page.url()).pathname).toBe('/')
})
