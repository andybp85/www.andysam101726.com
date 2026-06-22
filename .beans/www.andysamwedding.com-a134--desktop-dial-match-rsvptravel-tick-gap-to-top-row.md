---
# www.andysamwedding.com-a134
title: 'Desktop dial: match RSVP/TRAVEL tick gap to top row'
status: completed
type: task
priority: normal
created_at: 2026-06-22T12:02:45Z
updated_at: 2026-06-22T12:12:06Z
parent: www.andysamwedding.com-wbpd
---

Nudge bottom-row (RSVP/TRAVEL) station text down so its gap to the tick above matches the top row's text-to-tick gap.

## Summary of Changes

The desktop dials bottom-row stations (RSVP, TRAVEL) sat tight under their ticks because all-caps text has no descenders, so `align-items: flex-end` parks the caps right against the line. Nudged the bottom-row text down `0.12em` so the gap to the tick above matches the top rows gap, and counter-translated the tick by the same amount so it stays centred on the line.

- `styles/nav.css` `#stations .station:nth-child(even)`: `transform: translateY(0.12em)` on the text; `&::before` tick gets `translate(-50%, -50%) translateY(-0.12em)`.
- **Scoped to `#stations`** (desktop) so it never reaches the mobile drawer — `.station:nth-child(even)` alone would also match the drawers 2nd/4th stations, and a transform (unlike the inert `align-items`) would shift them.
- `0.12em` scales with the station font, so the nudge holds at every width.

**Verification:** before/after crops show RSVP/TRAVEL now balanced with the top row, ticks still on the line, nothing clipped. Mobile drawer station spacing measured uniform (75,75,76,75px) → no leak. (Note: automated pixel measurement was unreliable here — the center line, the new drop shadow, and glyph strokes all confounded it — so this was tuned and confirmed visually.)
