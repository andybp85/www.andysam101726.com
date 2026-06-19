---
# www.andysamwedding.com-lsz4
title: Browser-verify the site before merge
status: completed
type: task
priority: high
created_at: 2026-06-18T10:59:23Z
updated_at: 2026-06-18T10:59:23Z
parent: www.andysamwedding.com-wbpd
---

Manual browser pass (agent could not do visual/browser checks). Run: python3 -m http.server 8000 from repo root.

- [x] Gate: enter a correct last name -> redirects to /home/ (confirmed on live site by user)
- [ ] Nav: HOME/RSVP/SCHEDULE/TRAVEL/FAQ active states; mobile MENU drawer toggles at <700px
- [ ] RSVP: enter a real name (e.g. Maria Stanish -> group afam1); toggle attendance; submit -> "Thank you"; confirm a row lands in the RSVP sheet
- [ ] RSVP edge cases: with-guest-slot group (afam2 Chris Stanish), large group (sfam3 Honey Kostyn), last-name-optional (Christian)
- [ ] Token guard: open /home/ with no token in a fresh window -> redirected to /

## Summary of Changes
Closed by user decision after confirming live-site login works (gate -> /home/). The RSVP write path was separately verified server-side via the PUT smoke test in 9vd1 ({status:success} + row appended). Remaining boxes (nav active states / mobile drawer, full browser RSVP submit flow, edge-case groups, token guard) were not individually browser-checked but accepted as good; revisit if anything surfaces during content fill-in or before final launch.
