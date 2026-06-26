---
# www.andysamwedding.com-jdwy
title: 'RSVP: bulletproof square radio/checkbox (older iOS Safari shows circles)'
status: completed
type: bug
priority: normal
created_at: 2026-06-26T00:04:30Z
updated_at: 2026-06-26T00:07:35Z
parent: www.andysamwedding.com-wbpd
---

The attending/not-attending toggles use `appearance: none` to draw a custom square box. Older iOS Safari ignores `appearance: none` on radio/checkbox controls, so it falls back to native circles (reported by Sam on iPhone). Guests will be on a wide range of devices, so the boxes must render identically regardless of `appearance` support.

## Plan
- rsvp/index.js: wrap each toggle label's text in a `<span>` so the box can be drawn on a sibling element.
- rsvp/styles.css: visually hide the native input (kept inside the label for taps/keyboard), draw the square box on `label > span::before`, fill it on `:checked` via a content-box background, move the focus ring to the box.

- [x] Wrap label text in spans (index.js)
- [x] Rework toggle CSS to not depend on appearance:none (styles.css)
- [x] Verify syntax + visual check

## Summary of Changes
- rsvp/index.js: `attendChoice`/`guestField` now wrap each toggle label's text in a `<span>` (e.g. `<label><input type="radio" ...><span>attending</span></label>`).
- rsvp/styles.css:
  - Native radio/checkbox is visually hidden (`position:absolute; width/height:1px; opacity:0; pointer-events:none`) but stays inside the label, so taps and the keyboard still toggle it. Label made `position:relative` to anchor it.
  - The deco box is drawn on `.member label > span::before` (2px ink border, `background-clip:content-box` + `0.15em` padding so the fill sits inside a gap). `.member :checked + span::before` fills it with `--ink`; unchecked is transparent.
  - Focus ring moved to `.member input:focus-visible + span::before`.
- No longer depends on `appearance:none` being honored, so it renders as a square on older iOS Safari too.
- Verified with Playwright (390px @3x): checked boxes fill (rgb(42,26,20)), unchecked transparent, input opacity 0, and tapping a label toggles the hidden input (false→true).
