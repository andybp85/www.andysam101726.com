---
# www.andysamwedding.com-7iku
title: Add Playwright browser tests for DOM flows
status: completed
type: feature
created_at: 2026-06-26T10:56:57Z
updated_at: 2026-06-26T10:56:57Z
parent: www.andysamwedding.com-wbpd
---

End-to-end browser tests for the DOM-driven flows, reusing the GLOBAL Playwright install (no project dependency).

## Summary of Changes
- playwright.config.js (dev-only, not in deploy SITE list): testDir tests/browser, own webServer (python3 http.server on :8201, reuseExistingServer, stdout/stderr ignored) so it never touches a manual dev server.
- tests/browser/gate.spec.js: successful login stores token + redirects /home/; rejected login shows #error-msg and stays on gate. Apps Script stubbed via page.route('**/exec').
- tests/browser/rsvp.spec.js: shared last name -> party picker (2) -> party form; unique last name -> straight to party form; submit -> #step-thanks. GUESTS/PUT stubbed.
- tests/browser/nav.spec.js: renders 5 stations w/ hrefs + active; KNOB DRAG to a dial angle navigates (computes pointer offset from radio-math angleFromStation); mobile knob toggles menu (body.menu-open + aria-expanded).
- package.json: scripts pretest:browser ('npm link @playwright/test' -> symlinks global into gitignored node_modules so ESM import resolves) + test:browser ('playwright test'). No deps added.
- .gitignore: node_modules/, test-results/, playwright-report/. README: Testing section covers browser tests + global prereq.
- 7 browser tests pass (+14 node:test unit). Run: npm test ; npm run test:browser.
