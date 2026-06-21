---
# www.andysamwedding.com-dwe2
title: 'Shell: fix title line-break color on mobile'
status: completed
type: task
priority: high
created_at: 2026-06-21T16:31:05Z
updated_at: 2026-06-21T16:33:01Z
parent: www.andysamwedding.com-eo73
---

Title gradient now spans full title height, so wrapped "Wedding" line gets wrong color (prompts/title-line-break.png). Keep current large size.
- [ ] Make gradient span per-line or use solid title color
- [ ] Fallback: solid color from full_page_updated_with_knob_desktop.svg if no clean gradient fix
- [ ] Verify desktop (one line) and mobile (two lines) both read correctly

## Summary of Changes
Added `background-size: 100% 1.3em` to the h1 in styles/root.css so the clipped-text gradient tiles per line-height. Wrapped mobile title now gives both lines the same top→bottom gold sheen; desktop single-line unchanged. Kept title size. Noted: large title can overflow horizontally <~390px — to be handled in gate responsive task (tayy).
