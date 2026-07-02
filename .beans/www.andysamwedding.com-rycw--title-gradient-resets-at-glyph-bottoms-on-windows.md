---
# www.andysamwedding.com-rycw
title: Title gradient resets at glyph bottoms on Windows
status: completed
type: bug
priority: normal
created_at: 2026-07-02T19:31:30Z
updated_at: 2026-07-02T19:34:35Z
---

Repeating 1.3em gradient tile on h1 is aligned to the padding box, but Windows (usWin metrics) sets the baseline ~0.12em lower than macOS (hhea), so descenders cross the tile boundary and paint the next tile's bright start.

- [x] Reproduce locally with hhea-patched font
- [x] Fix: per-line-fragment gradient (background-clip:text + box-decoration-break:clone on the title inline)
- [x] Verify patched-font repro is clean + macOS rendering unchanged
- [x] Tests pass

## Summary of Changes

Root cause proven with font metrics: hhea (mac) 750/-250 vs usWin 976/237 shifts the Windows baseline ~0.12em lower in the fixed 1.3em line box, pushing descenders across the background tile seam. Reproduced on macOS chromium by patching a font copy so hhea = usWin and screenshotting the gate (temporary __repro.spec.js, deleted after).

Fix: gradient moved from the h1 (tiled 0 0 / 100% 1.3em) to the title inline — h1 :is(a, span) with background-clip:text + box-decoration-break:clone, padding 0.3em 0 0.05em to keep swashes/descenders inside the painted area on both metric sets. Gate h1 text wrapped in a span; gated pages already had the home link. Degrades gracefully (no clone = old continuous-gradient look, no fringe).

Verified: win-metric screenshots clean on desktop + wrapped mobile; mac unchanged; 14 unit + 10 browser tests green. Awaiting confirmation on a real Windows machine.
