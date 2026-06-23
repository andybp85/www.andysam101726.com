---
# www.andysamwedding.com-vtrm
title: 'Mobile drawer frame: pull exact 3D spec from design SVG'
status: completed
type: task
priority: normal
created_at: 2026-06-23T12:14:52Z
updated_at: 2026-06-23T12:14:52Z
parent: www.andysamwedding.com-wbpd
---

Extracted the drawer frame's exact spec from full_page_updated_with_knob_mobile.svg and replicated it in CSS.

## Source values pulled from the SVG
- Brass: path345 fill = linear-gradient-2, which is identical to --brass-frame (#f9dcaa..#745426); its userSpace direction is bottom-left->top-right (~45deg, bright toward bottom).
- Stroke: cls-78 stroke #4e371b, 2.12px on the ring (both inner + outer edges).
- 3D shadow: filter drop-shadow-2 = feOffset dx=7 dy=7, feGaussianBlur std=7, feFlood #231f20 @ .75 -> depth down-right (right + bottom only).
- Cream: cls-112 #ffdc8d; outer corner radius 58.3/372.29 ~ 15.7% -> 1.2rem.

## Summary of Changes (styles/nav.css #station-menu)
- Brass restored to the brass-token stops at 45deg (matching the SVG gradient direction).
- border-radius 0.9rem -> 1.2rem (design proportion).
- box-shadow: 0 0 0 1px #4e371b (outer stroke) + 3px 3px 8px rgba(35,31,32,.75) (the drop-shadow-2 depth, right+bottom).
- ::after: inset 0 0 0 1px #4e371b (inner stroke) + inset 3px 3px 8px rgba(35,31,32,.6) (the same shadow's inner half -> recess on the lit top/left).
- Dropped the prior muted-gold + flat side-wall approach.

Replicated in CSS rather than a 9-slice SVG image so it scales cleanly on the content-driven drawer height. Verified via side-by-side against the SVG-rendered drawer (full + bottom-right corner).
