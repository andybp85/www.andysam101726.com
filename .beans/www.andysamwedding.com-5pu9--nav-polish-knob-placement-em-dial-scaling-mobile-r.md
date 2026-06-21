---
# www.andysamwedding.com-5pu9
title: 'Nav polish: knob placement, em dial scaling, mobile rework, dead-zone stop'
status: completed
type: task
created_at: 2026-06-21T23:28:58Z
updated_at: 2026-06-21T23:28:58Z
parent: www.andysamwedding.com-wbpd
---

Post-design-review polish on the radio-dial nav, refining it against the desktop + mobile knob mockups and two screen recordings. Desktop and mobile handled separately so desktop stayed untouched while the mobile vertical dial was reworked.

## Summary of Changes
Desktop dial:
- Knob hugs the page-centred dial (justify-self:end) instead of being pinned to the page edge.
- Whole vertical geometry driven off the station font (em): row height 2.4em, stations stretch with text in the top/bottom half, ticks anchored to the centre line (top:50%). Ticks/text now scale consistently at every width.
- Knob drag hard-stops the 90deg dead zone: holds at whichever end (HOME/FAQ) it is nearest instead of jumping across.

Mobile vertical dial:
- Drawer anchored just below the knob (absolute, top:100% of #radio) instead of fixed/vertically-centred, which collided with the top-anchored knob at common heights.
- Gentle clamps (font/width/knob) for smooth scaling; dial narrowed snug to SCHEDULE.
- Knob given a small gap from the page edge.
- Words sit in gaps in the centre line (cream word-bands mask it); ticks moved into the gaps; active red arrow made wider + shorter, clean on the cream.

Shared:
- touch-action:none on the knob so dragging/tapping it never scrolls the page (Firefox/touch).

## Commits (radio-nav.js, styles/nav.css)
- d233f63 knob sits next to the dial (desktop)
- c28e8f0 em-based dial geometry (desktop)
- bcee055 touch-action:none on the knob
- 399c736 mobile vertical dial rework + smooth scaling
- 5cec920 mobile knob gap from the edge
- 7fa8d53 knob dead-zone hard stop

All verified via headless screenshots against the mockups (desktop 760-1400px, mobile 500-700px); drag + touch behaviours confirmed by the user.
