---
# www.andysamwedding.com-825q
title: Build 5-page invite site + party RSVP flow
status: completed
type: feature
created_at: 2026-06-18T10:59:23Z
updated_at: 2026-06-18T10:59:23Z
parent: www.andysamwedding.com-wbpd
---

Implemented per the plan via subagent-driven development (12 tasks, each task-reviewed; final whole-branch review on opus).

## Summary of Changes
- Fonts (Lucian Schoenschrift / Nickerbocker / Contralto) -> woff2 + @font-face.
- Wood-grain SVGs -> optimized WebP (desktop 121KB, mobile 39KB).
- Shared styles/root.css tokens, brass styles/nav.css, site.js (nav render + token guard).
- Gate restyled; prefetches token-gated guest list into sessionStorage on login.
- 5 pages: home/, rsvp/ (two-step party flow), schedule/, travel/, faq/.
- tools/gen-guests.mjs: RSVP_list.csv -> guests.gs (93 groups).
- API (andysamwedding-api): GUESTS verb (token-gated), party rsvp() with optimistic write + no token rotation, /home/ redirect; fixed 2 pre-existing Code.gs bugs (missing /*, doGet typo).
- savethedate/ retired; README updated.

Frontend commits 3b201d4..f9bdb01 (branch claude). API commits 08f501f..cc2d9d4 (branch main).
