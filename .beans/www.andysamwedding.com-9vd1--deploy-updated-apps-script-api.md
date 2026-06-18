---
# www.andysamwedding.com-9vd1
title: Deploy updated Apps Script API
status: todo
type: task
priority: high
created_at: 2026-06-18T10:59:23Z
updated_at: 2026-06-18T10:59:23Z
parent: www.andysamwedding.com-wbpd
---

Backend code is written/committed in andysamwedding-api but NOT yet deployed. The site's RSVP/guest-lookup won't work until this is done.

- [ ] cd ~/Projects/andysamwedding-api && clasp push
- [ ] In the Apps Script editor, redeploy a NEW VERSION of the existing Web App (the /exec URL stays the same)
- [ ] Smoke-test with the gate password (see plan Task 5 Step 5 for exact curl commands): POST login -> token + redirect:/home/; GUESTS -> 93 groups; PUT -> success + row in sheet
