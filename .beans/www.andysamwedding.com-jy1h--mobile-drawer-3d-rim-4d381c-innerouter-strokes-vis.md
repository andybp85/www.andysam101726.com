---
# www.andysamwedding.com-jy1h
title: 'Mobile drawer 3D rim: #4d381c inner+outer strokes, visible side'
status: completed
type: task
priority: normal
created_at: 2026-06-23T11:53:34Z
updated_at: 2026-06-23T11:53:34Z
parent: www.andysamwedding.com-wbpd
---

Match new_design/prompts/mobile-dial-3D-border.png.

## Summary of Changes
styles/nav.css #station-menu:
- Inner stroke recolored #34302d -> #4d381c (::after inset 1.5px ring), recess deepened (inset 0 5px 11px .5 + inset 0 0 8px .4) to match the design's pronounced top-edge cream shadow.
- box-shadow now layers: outer stroke (0 0 0 2px #4d381c), a brown 3D side wall (0 0 0 7px #6b4e29) giving the plaque visible depth, then a drop shadow (8px 11px 20px) lifting it off the wood.
Scoped to the mobile drawer only; desktop dial unchanged. Verified via headless 600px screenshot + side-by-side corner compare with the design.

## Note
Design renders the brass as a rounded convex molding (no separate flat side band); this uses strokes + a beveled brown side wall. Pending user call on whether to push toward the rounded-molding look.
