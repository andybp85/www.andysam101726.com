---
# www.andysamwedding.com-noys
title: 'Styling cleanup: drop bg fallback, wider non-card main, typography, darkreader-lock, dead code'
status: completed
type: task
priority: normal
created_at: 2026-06-22T01:45:41Z
updated_at: 2026-06-22T01:45:49Z
parent: www.andysamwedding.com-wbpd
---

Polish pass committed in d5db772.

## Summary of Changes

Single polish-pass commit `d5db772` (9 files):

1. **Drop `@supports` background fallback** — `styles/root.css` / `styles/card.css`: target modern browsers only, removed the legacy fallback paths.
2. **Wider `<main>` on non-card pages** — `schedule/`, `travel/` styles widened the content column.
3. **Typography updates** — `faq/styles.css`, `rsvp/styles.css`, `schedule/styles.css`, `travel/styles.css`.
4. **`<meta name="darkreader-lock"/>` on rsvp** — `rsvp/index.html` (now matches the other pages).
5. **Removed commented-out / dead code.**

Net: +11 / −21 lines.
