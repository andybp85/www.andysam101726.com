---
# www.andysamwedding.com-i6am
title: 'RSVP: make submit synchronous'
status: completed
type: feature
created_at: 2026-06-25T12:52:05Z
updated_at: 2026-06-25T12:52:05Z
parent: www.andysamwedding.com-wbpd
---

Confirm only after the write succeeds, instead of optimistically confirming and rolling back on error.

## Summary of Changes
- rsvp/index.js: await the PUT and show the thanks step only on success; disable the submit button while in flight to prevent double-submits. Commit 352943b.

- [x] Await PUT before showing thanks step
- [x] Disable button while in flight
