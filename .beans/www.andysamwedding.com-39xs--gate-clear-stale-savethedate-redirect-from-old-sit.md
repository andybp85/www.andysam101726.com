---
# www.andysamwedding.com-39xs
title: 'Gate: clear stale savethedate redirect from old site'
status: completed
type: bug
created_at: 2026-06-25T23:28:44Z
updated_at: 2026-06-25T23:28:44Z
parent: www.andysamwedding.com-wbpd
---

Visitors who logged into the old site still have a token + redirect in localStorage pointing at a savethedate page, so the gate bounces them to a dead page on load.

## Summary of Changes
- index.html: before auto-redirecting, check the stored `redirect`; if it includes "savethedate", `localStorage.clear()` and keep the visitor on the gate to log in fresh. Otherwise bounce as before.

- [x] Guard auto-redirect against stale savethedate target
- [x] Clear localStorage and stay on gate when stale
