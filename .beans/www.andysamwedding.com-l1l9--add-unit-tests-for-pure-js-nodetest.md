---
# www.andysamwedding.com-l1l9
title: Add unit tests for pure JS (node:test)
status: completed
type: feature
priority: normal
created_at: 2026-06-26T10:39:55Z
updated_at: 2026-06-26T10:42:32Z
parent: www.andysamwedding.com-wbpd
---

Add zero-dependency unit tests using Node's built-in test runner (node:test + node:assert) for the pure modules: rsvp/party.js, radio-math.js, and api.js (ensureOk + postForm with a fetch stub). Add a minimal package.json (type:module + test script) so Node treats the .js sources as ESM — no npm deps, dev-only (not in deploy SITE list). DOM glue stays for Playwright. Update README.

## Summary of Changes
- package.json (new, dev-only, zero deps): { private, type: module, scripts.test: "node --test 'tests/**/*.test.js'" }. Marks the .js sources as ESM for Node so node:test can import them. Not in deploy.sh SITE list -> never served.
- tests/party.test.js: partiesByLastName (case-insensitive/trim, one party per group as {id,members}, ignores slot members, matches non-first members, [] on no-match/empty/nullish) + labelForParty (joins by ' & ', drops slots).
- tests/radio-math.test.js: angleFromStation, stationFromAngle (rounding + clamp), inverse round-trip, angleFromPointer (up/right/down/left = 0/90/180/270).
- tests/api.test.js: ensureOk (pass-through / throws message) + postForm (object->FormData, POSTs to API; ready FormData used as-is) with a stubbed global fetch.
- .gitignore: add node_modules/. README: new ## Testing section + Layout entries.
- 14 tests, all passing via 'npm test'. DOM glue (index.js, rsvp/index.js, radio-nav.js) intentionally left for Playwright.
