---
# www.andysamwedding.com-jxpu
title: 'Audit fixes: XSS escape, gate dead code, knob pointercancel + keyboard, favicon size'
status: completed
type: task
priority: normal
created_at: 2026-07-02T19:01:03Z
updated_at: 2026-07-02T19:03:48Z
---

From the site audit (findings 3-7):
- [x] 3: escape guest names in rsvp memberRow innerHTML
- [x] 4: remove vestigial error-msg block; stop localStorage.clear() wiping unrelated keys
- [x] 5: handle pointercancel/lostpointercapture in knob drag
- [x] 6: keyboard tuning for the desktop knob
- [x] 7: shrink 128KB favicon.svg
- [x] tests pass (unit + browser)

## Summary of Changes

- rsvp/index.js: esc() helper; guest names escaped before innerHTML (+ browser regression test with a hostile name).
- index.html: vestigial error-msg localStorage block deleted; savethedate cleanup now removes only token/redirect instead of clear().
- radio-nav.js: pointercancel/lostpointercapture disarm the drag and re-settle the knob; arrow-key tuning + Enter/Space navigation on desktop (+ browser test).
- favicon.svg (128KB raster-in-SVG) deleted; <link> dropped from all six pages — PNG/ICO icons remain.
- 14 unit + 10 browser tests green.
