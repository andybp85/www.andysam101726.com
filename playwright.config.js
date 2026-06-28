import { defineConfig, devices } from '@playwright/test'

// Browser (e2e) tests for the DOM-driven flows. Dev-only: Playwright is a GLOBAL
// install (not a project dependency), so there is no node_modules here and this
// file is never deployed (outside deploy.sh's SITE list). Run with:
//   npm run test:browser      (or: playwright test)
//
// Playwright serves the repo over its own HTTP server on a dedicated port — it
// never touches a manually-run dev server on another port.
export default defineConfig({
    fullyParallel: true,
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    reporter: 'list',
    testDir: './tests/browser',
    use: {
        baseURL: 'http://127.0.0.1:8201',
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'python3 -m http.server 8201',
        reuseExistingServer: true,
        stderr: 'ignore',
        stdout: 'ignore',
        timeout: 30_000,
        url: 'http://127.0.0.1:8201',
    },
})
