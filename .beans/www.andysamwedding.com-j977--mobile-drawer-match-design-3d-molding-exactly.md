---
# www.andysamwedding.com-j977
title: 'Mobile drawer: match design 3D molding exactly'
status: completed
type: task
priority: normal
created_at: 2026-06-23T12:02:40Z
updated_at: 2026-06-23T12:02:40Z
parent: www.andysamwedding.com-wbpd
---

Reworked the mobile drawer rim to match new_design/prompts/mobile-dial-3D-border.png exactly, per pixel-sampled layer colors.

## Summary of Changes
styles/nav.css #station-menu:
- Brass muted to the sampled mid-gold (#795a33..#a07d4e) with a horizontal 'to right' gradient giving the long vertical sides a convex bevel (bright inner edge -> darker outer), so the molding reads rounded/raised.
- Dropped the (incorrect) flat brown side wall; outer rim now matches the design's stack: crisp #4d381c outer stroke -> near-black contact shadow (0 0 6px 2px) -> soft ambient lift (9px 12px 22px).
- Inner stroke stays #4d381c; cream recess deepened (inset 0 6px 13px .55) to match the design's pronounced top-edge shadow.
Verified via pixel-sampled cross-sections and side-by-side corner compares at 500/600/700px.
