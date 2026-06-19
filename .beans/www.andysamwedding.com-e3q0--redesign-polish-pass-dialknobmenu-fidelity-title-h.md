---
# www.andysamwedding.com-e3q0
title: 'Redesign polish pass: dial/knob/menu fidelity + title + home/rsvp'
status: completed
type: task
priority: normal
created_at: 2026-06-19T12:22:24Z
updated_at: 2026-06-19T12:50:32Z
---

Live-review refinements to match SVG mockups exactly: bigger title (clamp from main), desktop dial fidelity (colors/sizes/borders/shadows/gradient/thicker lines+needle), knob notch+fixed-glare+centered rotation, home deco-card + photo overlay removal, RSVP wider input + art-deco buttons, mobile vertical-menu match + left-slide animation + level MENU word + bigger title.

## Summary of Changes

Live-review polish pass (commits d50827c..67f0346):

- **Title** (d50827c): enlarged clamp (max 7rem; mobile up to 5rem), added line-height/padding so lucian_schoenschrift swashes aren't clipped by background-clip:text; mobile line-break before 'Wedding' via .title-break across all 6 pages.
- **Home** (3cf2290): switched <main> to .deco-card (dropped black box); removed the on-photo RSVP overlay — names/date/place/RSVP now sit below the image.
- **RSVP** (72412ac): widened #last input to min(90%,24rem); placeholder 'Your Last Name Here'; art-deco framed submit/continue buttons (double rule top+bottom, hover letter-spacing) in card.css.
- **Desktop dial** (e63a7e4): matched mockup — cream (#ffdc8d) face, beveled brass-gradient frame (--brass-frame), thick ink center line + ticks (#231f20), larger Nickerbocker labels, thick red indicator line (#be1e2d), drop shadows.
- **Knob** (e63a7e4): rebuilt as layered CSS — rotating knurled brass body + brown arrow (.knob-spin), FIXED glare overlay (#knob::after), centered axis. Fixes glare-stays-put + smooth top + brown indicator.
- **Mobile** (e97ea76): left push-drawer — content slides right (clipped, no page widening), eased; vertical menu matched to updated_vertical_menu.svg (cream/brass frame, ink line+ticks, centered labels, red triangle active indicator); level MENU label (CSS knob, no baked SVG text).
- **Cleanup** (67f0346): removed now-dead knob.svg/needle.svg/menu-arrow.svg.

Verified: 10/10 page×viewport walk + gate, 0 console errors, correct active station; knob glare fixed while body rotates; mobile drawer opens/closes via knob with no horizontal page expansion.
