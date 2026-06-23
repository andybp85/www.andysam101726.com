---
# www.andysamwedding.com-p2va
title: 'Nav: flat arrow behind text, smaller mobile font, desktop 3D rim'
status: completed
type: task
priority: normal
created_at: 2026-06-23T12:30:58Z
updated_at: 2026-06-23T12:30:58Z
parent: www.andysamwedding.com-wbpd
---

Mobile tweaks + bring the desktop dial in line with the mobile 3D frame.

## Summary of Changes (styles/nav.css)
Mobile drawer:
- Active red triangle: removed the drop-shadow (no dark halo) and set z-index:-1 so it sits behind the station text (above the cream), matching the design's flat indicator (cls-150, fill #be1e2d, no filter).
- Station font down a hair: clamp(1.5rem,1rem+2.2vw,2rem) -> clamp(1.4rem,0.95rem+1.9vw,1.9rem) (~26% inner width) so SCHEDULE clears the sides.
Desktop dial (#dial): replaced the old flat rim/box-shadow with the same treatment as the drawer — inset 0 0 0 1.5px #4e371b + inset 3px 3px 8px (recess on lit top-left), 0 0 0 1.5px #4e371b (outer stroke) + 4px 5px 13px (3D depth on right+bottom).
Verified via headless screenshots (mobile drawer + desktop dial).
