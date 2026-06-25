---
# www.andysamwedding.com-eags
title: 'RSVP: spin submit button while save is in flight'
status: completed
type: feature
created_at: 2026-06-25T12:50:44Z
updated_at: 2026-06-25T12:50:44Z
parent: www.andysamwedding.com-wbpd
---

Reuse the gate's .submitting 3D-rotate animation on the party-form submit button during the synchronous PUT, so the user gets feedback while waiting for the response.

## Summary of Changes
- rsvp/index.js: add/remove `.submitting` class on the submit button around the `await` PUT (mirrors the gate in index.js). Commit fbf65bf.

- [x] Add `.submitting` on submit, remove in `finally`
- [x] Verify syntax (node --check)
