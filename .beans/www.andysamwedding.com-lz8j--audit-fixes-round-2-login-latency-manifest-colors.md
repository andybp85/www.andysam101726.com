---
# www.andysamwedding.com-lz8j
title: 'Audit fixes round 2: login latency, manifest colors, nav DRY + reduced motion'
status: completed
type: task
priority: normal
created_at: 2026-07-02T19:20:03Z
updated_at: 2026-07-02T19:21:24Z
---

Remaining accepted audit findings:
- [x] 8: drop await on guest prefetch at login; warm cache on rsvp page load instead
- [x] 9: site.webmanifest colors match theme-color #2a1a14
- [x] 10d: initMobileKnob uses isPhone()
- [x] 10e: knob/needle transitions respect prefers-reduced-motion
- [x] tests pass

## Summary of Changes

- index.js: login redirects immediately; prefetch removed (a fire-and-forget fetch would be aborted by the navigation anyway).
- rsvp/index.js: getGuests memoized (guestsPromise) and warmed on page load; failed warm-up resets so submit retries.
- site.webmanifest: theme/background #000000 -> #2a1a14 to match the pages theme-color.
- radio-nav.js: rotateKnob honors prefers-reduced-motion; initMobileKnob reuses isPhone().
- styles/nav.css: needle slide transition gated on no-preference.
- 14 unit + 10 browser tests green.
