---
# www.andysamwedding.com-i2d3
title: 'Nav: smooth knob rotation (optional)'
status: completed
type: task
priority: low
created_at: 2026-06-21T16:31:05Z
updated_at: 2026-06-21T17:02:18Z
parent: www.andysamwedding.com-eo73
---

Knob currently jumps between orientations. Make it rotate smoothly if there's a clean way; OK to skip.
- [x] Investigate smooth rotation in radio-nav.js/radio-math.js
- [x] Implement OR document why skipped

## Summary of Changes
radio-nav.js: during drag the knob now follows the pointer continuously (rotateKnob(deg,false) with the live, clamped pointer angle) instead of snapping to discrete station angles each move — that snapping was the 'jump between orientations'. The needle still snaps to the nearest station (CSS-eased). On release the knob eases onto the exact station angle (transition 0.22s) before navigating; no spin-on-load. Verified no console errors and correct initial orientation.
