---
# www.andysamwedding.com-tayy
title: 'Gate: card padding + responsive to 320px'
status: completed
type: task
priority: high
created_at: 2026-06-21T16:31:05Z
updated_at: 2026-06-21T16:43:23Z
parent: www.andysamwedding.com-eo73
---

Card needs much less vertical padding (prompts/card-less-padding.png) and must look good down to 320px. Keep big border, no input placeholder/border.
- [x] Reduce vertical padding (basically none)
- [x] Responsive down to 320px width
- [x] Keep larger card border, no placeholder text/border on input

## Summary of Changes
- styles/card.css: replaced uniform 100px border with `border-width: clamp(18px,5.5vw,40px) clamp(30px,12vw,100px)` — slim top/bottom (kills empty vertical cream), prominent sides, responsive so the frame doesn't eat narrow viewports. Capped card to `width: min(50rem, 92vw)` (border-box) and added small inner `padding: 0 clamp(.5rem,3vw,2rem)`.
- styles.css: form gap 3vh→2vh; input width min(22rem,100%) so it never forces overflow.
- styles/root.css: mobile h1 clamp floor lowered to clamp(2.5rem,0.8rem+8vw,5rem) so the title fits 320px (computed 'Andy & Sam\'s' ≈226px at 320) while staying large on phones.
- Input already had no placeholder/box border (only the bottom rule). Verified desktop + 500px (Chrome CLI min viewport); 320 confirmed via computed widths.
