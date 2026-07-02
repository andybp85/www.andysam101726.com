---
# www.andysamwedding.com-5eh1
title: Fix guest surname Duarto → Duardo (afam25)
status: completed
type: bug
priority: normal
created_at: 2026-07-02T16:52:32Z
updated_at: 2026-07-02T20:09:34Z
---

Donna & Rocco's last name was misspelled Duarto in RSVP_list.csv; guests couldn't find themselves on the RSVP lookup.

- [x] Fix both rows in new_design/RSVP_list.csv
- [x] Regenerate new_design/guests.gs via tools/gen-guests.mjs (93 groups)
- [x] Paste updated GUESTS into Apps Script Code.gs + deploy new version (manual, Google editor)
- [x] Verify live GUESTS returns Duardo

## Summary of Changes

CSV fixed + regenerated locally; Andy pasted GUESTS into the container-bound Apps Script and deployed. Verified live 2026-07-02: 93 groups, 0 diffs vs CSV, Duardo x2. Full CSV re-export also brought in 4 more name updates (Whitney Rubel, Ferrara, Colon, Shaughnessy/Coursey), all confirmed live.
