---
# www.andysamwedding.com-nq7u
title: 'RSVP: prompt for last name on ambiguous lookup'
status: completed
type: feature
priority: low
created_at: 2026-06-18T10:59:59Z
updated_at: 2026-06-19T04:05:36Z
parent: www.andysamwedding.com-wbpd
---

findGroup matches on first name alone when the last-name field is blank (kept optional for the two empty-last guests, Christian & Mary Pat). First names collide across groups (Chris x6, Mike x6, Emily x4), so a blank last name can silently match the wrong party. Follow-up: when last is blank AND the first name matches >1 group, prompt 'please add a last name' instead of picking the first match.



## Summary of Changes
Done in Task 9 (commit 8c2e29e), redesign plan. rsvp/party.js (pure partiesByLastName/labelForParty, node-tested); RSVP step 1 is last-name-only; a picker lists parties by member first names when several share a last name. Reviewed PASS; verified via Playwright (picker renders, single-match advances).
