---
# www.andysamwedding.com-7s6m
title: 'Home desktop: hero overlay'
status: completed
type: feature
priority: high
created_at: 2026-06-21T16:31:05Z
updated_at: 2026-06-21T17:11:33Z
parent: www.andysamwedding.com-eo73
---

Bigger hero with text + RSVP button overlaid (prompts/home-picture-with-text-overlay.png).
- [x] Enlarge hero, overlay date/location/RSVP button
- [x] Make text stand out (thicker + better drop shadow)
- [x] Text scales with picture down to mobile breakpoint

## Summary of Changes
home/styles.css: widened main to min(94vw,66rem) w/o the 10vw padding for a big framed hero. .details overlaid right, vertically centred; date clamp(1.8-3.4rem) bold + text-stroke + layered shadow; place bold + shadow; RSVP button enlarged with shadow. vw-based clamps scale with the picture. Verified at 1300px.
