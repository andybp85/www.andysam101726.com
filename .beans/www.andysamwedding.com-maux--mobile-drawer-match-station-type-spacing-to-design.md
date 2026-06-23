---
# www.andysamwedding.com-maux
title: 'Mobile drawer: match station type + spacing to design'
status: completed
type: task
priority: normal
created_at: 2026-06-23T12:24:39Z
updated_at: 2026-06-23T12:24:39Z
parent: www.andysamwedding.com-wbpd
---

Retuned the mobile drawer's station layout to the design SVG's measured proportions.

## Measured from the SVG (cream inner width 372.29, height 1421.65)
- All five words one size ~103px = 27.8% of inner width (SCHEDULE nearly fills it).
- Baselines ~2.9x the font apart (even, airy); small top/bottom padding (~0.65em).
- Ticks ~10.5% width, ~2.4% height; vertical line ~1.9% width; active red triangle ~27% width.

## Summary of Changes (styles/nav.css #station-menu)
- .station font-size 1.5rem -> clamp(1.5rem, 1rem + 2.2vw, 2rem) (~29px@600 = 27.8% inner), + line-height 1, white-space:nowrap, letter-spacing 0.04->0.03em.
- --st-gap widened to clamp(2.6rem,1.375rem+5.5vw,4.3rem) for the 2.9x baseline rhythm; container padding split off to clamp(0.9rem,0.675rem+1.2vw,1.5rem) (small ends).
- Ticks slimmed (w clamp(8,1.8vw,13)px, h clamp(2,0.5vw,3.5)px); vertical line slimmed (clamp(2,0.4vw,3)px) and inset reduced (0.5->0.35rem).
- Active triangle widened (border-left 0.95rem -> 1.7rem) to the design's ~27% width.
Verified via side-by-side vs the SVG-rendered drawer at 500/600/700px (SCHEDULE fits, even spacing).
