---
# www.andysamwedding.com-bl07
title: 'Nav: fix arrow black bg, bigger MENU, doubled gap, deeper dial depth'
status: completed
type: task
priority: normal
created_at: 2026-06-23T12:49:41Z
updated_at: 2026-06-23T12:49:41Z
parent: www.andysamwedding.com-wbpd
---

## Summary of Changes (styles/nav.css, mobile #station-menu / .knob-label)
- Red active arrow: added 'background: none' — the pseudo was inheriting the desktop tick's background-color: var(--dial-ink) (#231f20), which filled the triangle's box and showed through the transparent borders as a black background. Now just the red arrow, behind the text.
- Dial 3D depth (right+bottom): box-shadow deepened — 0 0 0 1px #4e371b, 2px 2px 0 0 #3a2a16 (crisp solid side-face), 5px 7px 14px rgba(16,11,7,.7) (deep soft shadow); inner recess inset 3px 4px 9px. Design confirms depth is drop-shadow-based (updated_vertical_menu.svg: 17 filters, no extruded geometry).
- MENU knob label: font-size clamp(0.95rem,0.6rem+1.9vw,1.4rem) -> clamp(1.7rem,1.1rem+2.6vw,2.3rem) to fill most of the knob face.
- Knob->drawer gap doubled: #station-menu margin-top 0.7rem -> 1.4rem.
Verified via Playwright element screenshots.
