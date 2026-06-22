---
# www.andysamwedding.com-24gp
title: Use CSS shorthand where longhand groups exist
status: completed
type: task
priority: normal
created_at: 2026-06-22T10:53:08Z
updated_at: 2026-06-22T10:56:27Z
parent: www.andysamwedding.com-wbpd
---

Consolidate split sub-properties (background, gap) into shorthand; verify pixel-identical.

## Summary of Changes

Consolidated split sub-properties into shorthands (behavior-safe; longhands that are single-purpose or distinct-per-side were left alone).

- **`root.css` body** — `background-image`/`-size`/`-position`/`-attachment` (4) → one `background:` (per-layer `center / cover fixed`). The mobile `@media` still overrides `background-image` only, keeping size/pos/attachment from the base.
- **`root.css` h1** — folded `background-size: 100% 1.3em` into the gradient `background:` (`... 0 0 / 100% 1.3em`).
- **`root.css` submit button** — `background-color`/`-repeat`/`-image` (3) → one `background: transparent url(...) no-repeat`.
- **`nav.css` #radio** — `column-gap: 1rem` → `gap: 1rem` (single-row grid, so `row-gap` is inert).
- **`card.css`** — the border edit (`border-width` two-value → uniform `border: clamp(...) solid transparent`); `border-image` still follows `border`, so the deco frame is unaffected.

**Left as longhand (correct tool, no shorthand gain):** single-side `margin-*`/`padding-*`/`border-bottom` underlines, the nav active-triangle `border-top/bottom/left` (distinct per side), `overflow-x`, and single-purpose `flex-direction`/`font-*`/`background-color`.

**Verification:** before/after headless diffs AE=0 on gate, faq, schedule (desktop + mobile) — covering the body wood background (incl. the mobile media override), the title gradient, the submit button, and the nav gap. Home is photo-decode noise (before/after 2342 < same-file self-diff 2576).
