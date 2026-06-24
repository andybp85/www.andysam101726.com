---
# www.andysamwedding.com-0rau
title: 'Mobile nav/shell: smaller MENU knob, pull nav up to title, bigger title'
status: completed
type: feature
created_at: 2026-06-24T02:04:43Z
updated_at: 2026-06-24T02:04:43Z
parent: www.andysamwedding.com-wbpd
---

Mobile (<=700px) shell tightening:
- [x] Shrink MENU knob to 80% of current width
- [x] Pull the knob up next to the title to remove the large blank gap; dial moves up with it
- [x] Scale the site title up as large as the layout allows
- [x] Verify on mobile across pages

## Summary of Changes

All mobile-only (`@media (max-width: 700px)`); desktop untouched.

- **Knob 80%** (`styles/nav.css` `#knob`): `--knob-size: calc(var(--menu-w) * 0.8)`
  (was `var(--menu-w)`). Left edge still aligns with the drawer below it.
- **Knob pulled into the title gutter** (`styles/nav.css` `#radio`): nav taken
  out of flow — `position: absolute; left: 0` against `body { position: relative }`
  (added). The empty knob band is gone, so page content rises ~145px right under
  the title. The drawer (anchored at `top:100%` of `#radio`) moves up with it.
- **Knob vertically centred on the title's middle** (`#radio top`): computed from
  the shared title size — `max(0.4rem, calc(1.5vh + 1.39 * var(--title-fs) -
  var(--menu-w) * 0.4))`. Exact at >=390px; the `max()` floor keeps it on-screen
  on very narrow widths where the (smaller) title is shorter than the knob.
- **Bigger title, shifted slightly right of centre** (whole two-line range,
  `<=700px`). A purely screen-centred title would have to be small to clear the
  corner knob, so instead the title spans full width and is left-padded by half
  the knob (`body:has(#site-nav) h1`: `align-self: stretch;
  padding-left: calc(var(--menu-w) * 0.5)`), nudging it ~20–26px right. Its size
  is shared as `--title-fs` (`styles/nav.css`) so the knob can centre on it:
  `clamp(1.8rem, -1.75rem + 17.8vw, 5rem)` (caps at 80px ~607px+), holding
  ~8–14px knob clearance across the range. The bare auth gate (no knob) keeps a
  fully-centred `clamp(2.2rem, -0.3rem + 12.5vw, 5rem)`; `:has(#site-nav)`
  switches between them. `root.css` h1 just reads `--h1-font-size: var(--title-fs)`.
- Verified across 320–700px: title→knob clearance ~8–57px, knob vertically
  centred (delta 0px at 360+; +7 at 320 via the floor), shift a slight ~20–26px,
  gate title big + centred, drawer opens at the new higher position, desktop
  unchanged. Refreshed a stale "push-drawer" comment in `radio-nav.js`.
