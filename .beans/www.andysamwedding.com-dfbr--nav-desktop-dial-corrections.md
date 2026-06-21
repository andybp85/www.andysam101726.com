---
# www.andysamwedding.com-dfbr
title: 'Nav desktop: dial corrections'
status: completed
type: feature
priority: high
created_at: 2026-06-21T16:31:05Z
updated_at: 2026-06-21T16:49:32Z
parent: www.andysamwedding.com-eo73
---

Match full_page_updated_with_knob_desktop.svg.
- [x] Red indicator thinner and BEHIND black text/lines
- [x] Dial centered on page, knob to its left
- [x] Stations text larger + correct vertical spacing
- [x] Station ticks smaller + correct vertical spacing
- [x] Thinner border
- [x] Inner+outer border drop shadows and text drop shadow
- [x] Scales correctly from full width until it disappears

## Summary of Changes
styles/nav.css desktop dial:
- #radio → CSS grid `1fr auto 1fr`; #site-nav width:100%; knob justify-self:start (far left), dial centered on page.
- #dial border clamp(8-14px)→clamp(5-9px); added inner drop shadow + outer drop shadow alongside the rim.
- .station font → clamp(1.45rem,0.1rem+3vw,2.7rem): bigger on wide screens, scales down toward 700px so the row never crowds. Stronger text drop shadow.
- ticks (.station::before) smaller: w clamp(3-5px), h clamp(9-16px).
- #needle thinner (w clamp(2-4px)) and moved BEHIND: z-order now needle(0) < center line(1) < stations/ticks(2).
- mobile #radio set display:flex; knob justify-self/margin reset.
Verified 760/1100/1280px against full_page_updated_with_knob_desktop.svg.
