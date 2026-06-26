import { defineConfig, devices } from '@playwright/test'

// Browser (e2e) tests for the DOM-driven flows. Dev-only: Playwright is a GLOBAL
// install (not a project dependency), so there is no node_modules here and this
// file is never deployed (outside deploy.sh's SITE list). Run with:
//   npm run test:browser      (or: playwright test)
//
// Playwright serves the repo over its own HTTP server on a dedicated port — it
// never touches a manually-run dev server on another port.
export default defineConfig({
    testDir: './tests/browser',
    fullyParallel: true,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:8201',
        trace: 'on-first-retry',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
        command: 'python3 -m http.server 8201',
        url: 'http://127.0.0.1:8201',
        reuseExistingServer: true,
        stdout: 'ignore',
        stderr: 'ignore',
        timeout: 30_000,
    },
})
