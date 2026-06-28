---
# www.andysamwedding.com-x1xa
title: Fix dial needle jumping on page load
status: completed
type: task
priority: normal
created_at: 2026-06-28T22:20:18Z
updated_at: 2026-06-28T23:22:06Z
---

Needle was animating from left on every page load/font-swap/resize. Now snaps instantly to active station (like real dial) and only eases during user tuning.

## Summary of Changes
- radio-nav.js: positionNeedle(i, animate=false) now gates the left transition like rotateKnob — transition:none for load/fonts.ready/resize placement (instant, on-station), '' (CSS ease) only while tuning. Threaded animate=true through setNeedle and the two drag handlers.
- styles/nav.css: comment explaining the JS-gated transition.
- tests/browser/nav.spec.js: regression test — on /schedule/ the needle starts on the SCHEDULE tick with transition-duration 0s and never slides.
Verified: playwright 8/8 pass.
