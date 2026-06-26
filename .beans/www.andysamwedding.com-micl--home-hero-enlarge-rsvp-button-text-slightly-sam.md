---
# www.andysamwedding.com-micl
title: 'Home hero: enlarge RSVP button text slightly (Sam)'
status: completed
type: task
priority: normal
created_at: 2026-06-26T02:45:58Z
updated_at: 2026-06-26T03:16:11Z
parent: www.andysamwedding.com-wbpd
---

Sam: make the 'RSVP' font inside the button on the home-page hero pic slightly bigger. Bump .rsvp-btn.big font-size (desktop cqw + clamp fallback, and the mobile clamp).

## Summary of Changes
home/styles.css .rsvp-btn.big: enlarged the RSVP text while keeping the button at its original box size (Sam wanted bigger text; settled on the midpoint after iterating bigger/looser).
- font-size: 4.7cqw (clamp(2rem,4.6vw,2.9rem) fallback); mobile clamp(1.5rem,6.4vw,2.1rem).
- line-height: 1.05; padding 0.17em 1em 0.09em — asymmetric top/bottom optically centers the all-caps RSVP (caps have no descenders, so they sit high in the line box).
- Verified with Playwright: desktop box height 65.8px == original ~66px; caps center within 0.3px of button center at both breakpoints; no clipping, fits the hero panel on desktop + mobile.
