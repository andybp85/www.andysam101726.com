---
# www.andysamwedding.com-1zvy
title: 'Mobile nav: overlay drawer instead of pushing page content'
status: completed
type: feature
created_at: 2026-06-24T01:26:47Z
updated_at: 2026-06-24T01:26:47Z
parent: www.andysamwedding.com-wbpd
---

Switch the mobile menu from a push-drawer (slides the whole page right) to an overlay: page content stays put and the drawer floats over it.

- [x] Stop shifting main on menu-open
- [x] Lift #radio z-index on mobile so the drawer (trapped by #radio view-transition-name stacking context) floats over content
- [x] Update push-drawer comments to overlay
- [x] Verify on all pages via screenshot

## Summary of Changes

`styles/nav.css` only (mobile `@media (max-width: 700px)` rules; desktop untouched):

- Removed the `main` page-shift block — `main` no longer translates right on
  `body.menu-open`, so page content stays put.
- Added `z-index: 5` to `#radio` on mobile. `#radio` has
  `view-transition-name: site-radio` (root.css), which makes it a stacking
  context and trapped the absolutely-positioned drawer's z-index beneath page
  content (e.g. the home hero's `.details`). Raising `#radio` lifts the whole
  nav — including the drawer it anchors — above content. Page content uses no
  z-index anywhere, so a small value clears it. Permanent (not gated on
  `menu-open`) so it also covers the close-out transition; the knob sits
  clear of content when closed, so it's harmless.
- Retitled the section comment from "push-drawer page-shift" to "overlay drawer."

Verified open-state on /home/, /rsvp/, /faq/ at 600px: drawer paints over the
content (probe `elementFromPoint` at drawer center returns `A.station`),
`main` transform is `none`. Drawer slide-in animation and off-screen clipping
(`overflow-x: hidden`) unchanged.
