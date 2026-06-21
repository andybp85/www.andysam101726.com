---
# www.andysamwedding.com-zx00
title: 'Nav mobile: vertical dial + MENU button'
status: completed
type: feature
priority: high
created_at: 2026-06-21T16:31:05Z
updated_at: 2026-06-21T17:00:32Z
parent: www.andysamwedding.com-eo73
---

Match full_page_updated_with_knob_mobile.svg.
- [x] Dial much narrower; line breaks for text; bigger arrow, no black bg
- [x] Mobile dial matches mobile mockup
- [x] MENU text bigger, drop the arrow on the button

## Summary of Changes
Kept the tap-to-open drawer (per user choice), restyled to match full_page_updated_with_knob_mobile.svg:
- --menu-w: min(74vw,19rem) → min(56vw,11rem) — narrow vertical dial (and page-shift distance).
- Dropped .knob-arrow on mobile; .knob-label MENU enlarged to clamp(1rem,4.4vw,1.5rem).
- Active red arrow enlarged (border 0.7rem/1.05rem).
Verified closed knob + open drawer at 500px.
