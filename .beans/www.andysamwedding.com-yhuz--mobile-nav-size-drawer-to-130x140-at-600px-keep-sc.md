---
# www.andysamwedding.com-yhuz
title: 'Mobile nav: size drawer to ~130x140 at 600px, keep scaling'
status: completed
type: task
priority: normal
created_at: 2026-06-22T11:35:55Z
updated_at: 2026-06-22T11:45:24Z
parent: www.andysamwedding.com-wbpd
---

Tune --menu-w and drawer vertical metrics so the open vertical dial is ~130px wide x 140px tall at a 600px viewport, scaling smoothly via clamp.

## Summary of Changes

Resized the open mobile vertical-dial drawer to the design target: **~130px wide × 440px tall at a 600px viewport** (the initial "140" was a typo; corrected to 440 mid-task).

All changes are inside `@media (max-width: 700px)` in `styles/nav.css`, so desktop is untouched.

- **Width** — `--menu-w: clamp(8rem, 5.6rem + 6.75vw, 9.8rem)` (was `... 5.6rem + 6vw, 9.6rem`): now ~130px at 600px (was pinned at the 128px floor). Also drives the page-shift distance.
- **Height** — introduced `--st-gap: clamp(1.8rem, 1.375rem + 3vw, 2.8rem)` (~40px at 600px) and used it for both the inter-station `gap` and the top/bottom `padding`, taking the content-driven height from ~287px to ~440px with the airy spacing from the mockup.
- **Ticks** — the inter-station tick offset is now `top: calc(var(--st-gap) / -2)` so it stays centered in the (now larger) gap as it scales, instead of the old fixed `-0.45rem`.

Everything scales off `--st-gap`/`--menu-w` (clamp+vw), so the dial grows/shrinks as one piece.

**Verification (headless, 600px):** drawer measures **130 × 441**. Scaling smooth — 128×414 @500px, 137×467 @700px, gap 37→40→43px. Visual crop matches the mockup (ticks centered, words evenly spaced). Desktop nav before/after AE = self-diff (2342px = font/needle render noise) → unchanged.
