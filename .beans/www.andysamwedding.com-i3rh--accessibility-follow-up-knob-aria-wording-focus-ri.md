---
# www.andysamwedding.com-i3rh
title: 'Accessibility follow-up: knob aria wording + focus rings'
status: completed
type: task
priority: normal
created_at: 2026-06-19T14:07:05Z
updated_at: 2026-06-19T14:10:48Z
parent: www.andysamwedding.com-wbpd
---

Minor a11y findings from the redesign review:
- [ ] Mobile knob aria: it says aria-label='Tuning knob' but on mobile it's a menu toggle; reflect the dual role (aria-expanded already toggles)
- [ ] Audit :focus-visible focus rings across all interactive elements (knob, dial stations, drawer stations, deco-card submit buttons, in-card links, gate input)
- [ ] Verify keyboard reachability + visible focus on each, desktop + mobile

## Summary of Changes

- Knob aria: label now 'Navigation — tune the dial, or open the menu' + aria-controls='station-menu'; aria-expanded already toggled (verified false→true on open).
- Closed mobile drawer was display:flex (only translated off-screen) so its links were keyboard/SR reachable — added visibility:hidden (deferred behind the slide) so the closed drawer leaves the tab order + a11y tree. Verified: drawer link focusable closed=false, open=true.
- Real :focus-visible rings added: #knob (brass), .station dial+drawer (brass-dark), deco-card submit buttons (removed prior outline:none), in-card links, inputs.
- Verified desktop tab order (knob → 5 stations → RSVP), focus rings render, 0 console errors across 10 page×viewport combos.
