---
# www.andysamwedding.com-o9n7
title: Stronger brass-frame bevel contrast (more 3D)
status: completed
type: task
priority: normal
created_at: 2026-06-23T11:28:54Z
updated_at: 2026-06-23T11:28:54Z
parent: www.andysamwedding.com-wbpd
---

Increase light/dark contrast of the shared --brass-frame gradient so the dial/drawer frame reads more 3D and pops more against the cream face, per the design.

## Summary of Changes
styles/root.css: --brass-frame gradient stops brightened at the highlights (#f9dcaa->#ffe9b8, #deba86->#f0cd8d) and deepened at the shadows (#6a4a23->#4f3814, #745426->#5b3f17), with mids nudged for a stronger bevel. Shared token, so both the desktop dial and the mobile drawer gain the same deeper 3D bevel; verified via headless screenshots.
