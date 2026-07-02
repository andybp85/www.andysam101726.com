---
# www.andysamwedding.com-5eh1
title: Fix guest surname Duarto → Duardo (afam25)
status: in-progress
type: bug
created_at: 2026-07-02T16:52:32Z
updated_at: 2026-07-02T16:52:32Z
---

Donna & Rocco's last name was misspelled Duarto in RSVP_list.csv; guests couldn't find themselves on the RSVP lookup.

- [x] Fix both rows in new_design/RSVP_list.csv
- [x] Regenerate new_design/guests.gs via tools/gen-guests.mjs (93 groups)
- [ ] Paste updated GUESTS into Apps Script Code.gs + deploy new version (manual, Google editor)
- [ ] Verify live GUESTS returns Duardo
