---
# www.andysamwedding.com-vc7t
title: 'Mobile drawer: dark inner stroke, knob=drawer width, -5px width'
status: completed
type: task
priority: normal
created_at: 2026-06-23T11:35:02Z
updated_at: 2026-06-23T11:35:02Z
parent: www.andysamwedding.com-wbpd
---

Follow-up to match new_design/.../full_page_updated_with_knob_mobile.svg.

## Summary of Changes
styles/nav.css:
- #station-menu::after: added a crisp dark-gray inner stroke (inset 0 0 0 1.5px #34302d) at the cream/frame seam, atop the soft recess shadows — reads more 3D, continuous (above the station bands).
- --menu-w dropped ~5px: clamp(8rem,5.6rem+6.75vw,9.8rem) -> clamp(7.69rem,5.29rem+6.75vw,9.49rem) (~125px at 600px).
- Mobile #knob: --knob-size: var(--menu-w) and margin-left 0.4rem (was clamp + 0.9rem), so the MENU knob diameter always equals the drawer width with left edges aligned.

Verified via headless screenshots at 500/600px against the design.
