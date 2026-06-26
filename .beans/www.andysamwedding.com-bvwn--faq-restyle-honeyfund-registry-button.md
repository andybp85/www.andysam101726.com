---
# www.andysamwedding.com-bvwn
title: 'FAQ: restyle Honeyfund registry button'
status: completed
type: task
created_at: 2026-06-26T10:09:38Z
updated_at: 2026-06-26T10:09:38Z
parent: www.andysamwedding.com-wbpd
---

Honeyfund link was a blue logo on a brass bg with a fixed 26px radius that scaled poorly. Rebuilt as the real Honeyfund button.

## Summary of Changes
- faq/index.html: button anchor gets class honeyfund-btn; removed the id off the img; alt -> 'Contribute on Honeyfund'.
- faq/styles.css: replaced #honeyfund-button with .honeyfund-btn — blue wordmark on a white pill, 1px subtle border, soft shadow, border-radius 0.7em, padding 0.55em 1.2em, logo height 1.7em, font-size clamp(1rem,0.6rem+1.4vw,1.5rem). em-based so the corner radius scales proportionally (the old fixed 26px did not). display:flex + width:fit-content so it sits on its own line (no inline wrap at narrow widths); hover lift; brass focus-visible ring.
- Verified at 1100/390/330px via Playwright.
