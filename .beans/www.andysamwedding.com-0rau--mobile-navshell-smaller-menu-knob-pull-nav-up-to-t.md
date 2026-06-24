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
  out of flow — `position: absolute; top: 2.6rem; left: 0` against
  `body { position: relative }` (added). The empty knob band is gone, so page
  content rises ~145px right under the title. The drawer (anchored at
  `top:100%` of `#radio`) moves up with the knob.
- **Bigger title** (`styles/root.css`): mobile `--h1-font-size` →
  `clamp(2.2rem, -0.3rem + 12.5vw, 5rem)`. To keep it clear of the gutter knob,
  nav pages span the title full-width and pad its left by the knob footprint
  (`styles/nav.css` `body:has(#site-nav) h1`: `align-self: stretch;
  padding-left: calc(var(--menu-w) * 0.8 + 1.4rem)`). `:has` scopes this off the
  bare auth gate (no `#site-nav`), where the title stays centred.
- Verified title→knob clearance positive across 320–700px (21px at 320 → 87px
  at 700), gate title centred, drawer opens at the new higher position, desktop
  unchanged. Also refreshed a stale "push-drawer" comment in `radio-nav.js`.
