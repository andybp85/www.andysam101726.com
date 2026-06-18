---
# www.andysamwedding.com-uo01
title: Strip alpha channel from wood-desktop.webp
status: completed
type: task
priority: low
created_at: 2026-06-18T10:59:59Z
updated_at: 2026-06-18T10:59:59Z
parent: www.andysamwedding.com-wbpd
---

wood-desktop.webp (~120KB) carries an unneeded alpha channel; it sits on a solid --ink background. Re-encode without alpha to drop to ~25KB. Within budget already, pure optimization.

## Summary of Changes
Both wood backgrounds were regenerated from the edited source SVGs in new_design/ (rsvg-convert -b '#2a1a14' flatten -> cwebp -q80). Output now has no alpha channel (identify reports alpha=Undefined) for both wood-desktop.webp (1920x1318, 118KB) and wood-mobile.webp (1400x1920, 93KB). Alpha-strip goal met as a side effect of the regen.
