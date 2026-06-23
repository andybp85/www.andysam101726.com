---
# www.andysamwedding.com-w3zd
title: 'Mobile nav drawer: ~10px frame + 3D inner shadow'
status: completed
type: task
priority: normal
created_at: 2026-06-23T11:21:40Z
updated_at: 2026-06-23T11:24:31Z
parent: www.andysamwedding.com-wbpd
---

Mobile station-menu border should be ~10px at 600px and scale. Replace the broken hard black inner rim (inset 0 0 0 2px) with a continuous soft inner drop shadow so the cream face reads as recessed/3D, matching new_design/prompts/mobile-nav-design.png.

- [x] Border ~10px at 600px, gentle clamp scaling
- [x] Remove broken black inner line (inset 2px rim covered by station bands)
- [x] Add continuous inner drop shadow (3D recessed face) via overlay pseudo
- [x] Verify on mobile screenshot vs design

## Summary of Changes

styles/nav.css, #station-menu (mobile drawer only):
- Frame width now `--frame-w: clamp(8px, 4px + 1vw, 12px)` (~10px at 600px, gentle scale); border uses the token.
- Dropped the hard `inset 0 0 0 2px #4e371b` rim from box-shadow — full-width cream station bands painted over it at each word row, breaking it into segments (the 'broken black line'). box-shadow is now just the outer drop shadow.
- Added a `&::after` overlay (inset:0, radius = 0.9rem − frame-w, z-index 3 above the station bands) carrying a continuous soft inner shadow (`inset 0 0 6px` + `inset 0 3px 8px`) so the cream face reads as recessed below the brass frame (3D), unbroken by the word bands.

Verified via headless screenshots at 500/600/700px: continuous recess, clean corners, frame scales. User dev server untouched (own server on 8155, killed by PID).
