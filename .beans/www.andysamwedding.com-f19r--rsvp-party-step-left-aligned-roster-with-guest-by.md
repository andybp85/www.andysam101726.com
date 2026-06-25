---
# www.andysamwedding.com-f19r
title: 'RSVP party step: left-aligned roster with guest-by-name +1 slots'
status: completed
type: feature
created_at: 2026-06-25T12:52:12Z
updated_at: 2026-06-25T12:52:12Z
parent: www.andysamwedding.com-wbpd
---

Lay the party step out as a left-aligned roster: names flush-left with the attending/not-attending boxes indented beneath, stacking into an aligned column on narrow screens. Open +1 slots are a name field plus a "not attending" box — fill the name (attending) or tick the box (declined); one is required, and the two are mutually exclusive.

## Summary of Changes
- rsvp/index.js: render named members vs. open +1 slots; guest attendance inferred from the name field; name/decline kept mutually exclusive. Commit 75b4ce6.
- rsvp/styles.css: left-aligned roster, indented attend boxes, narrow-screen column alignment.

- [x] Left-aligned roster layout (desktop + mobile)
- [x] Guest +1 name-or-decline, mutually exclusive, one required
