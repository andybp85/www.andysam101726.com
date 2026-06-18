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

Symptom while undeployed: submitting a last name at the gate still redirects to /savethedate (the retired page). The deployed Web App serves old code; source Code.gs:45 already returns redirect:'/home/'. Confirmed code committed on api `main` (e911d6c + bugfixes), tree clean, clasp 3.2.0 authed.

## GOTCHA: deployment-ID mismatch (verify BEFORE pushing)
The /exec URL the frontend calls (index.js:4) is deployment `AKfycbzlDfJdr-lTdTmOuNGXMYS-53jjXf1QCW_dD_I6ZmLYRSO_Y7UCgzcGertCfHIT5nbx`.
But `clasp deployments` for the configured script (.clasp.json scriptId `1W7yEL...`) lists only ONE deployment: `AKfycbwy67AB2_PtbnsrUXi4LsNZ95a_lN6eGKeDT_mB6ag @HEAD` — a DIFFERENT id.
clasp does not see the deployment production actually hits. Either (a) .clasp.json points at a different script project than the one serving prod (likely), or (b) the live deployment was made in the UI. Pushing blindly may update the wrong project and leave the live site unchanged.

- [ ] In the Apps Script editor for the LIVE project (open the /exec URL's project, or Deploy -> Manage deployments), copy the script ID from Project Settings and compare to .clasp.json scriptId `1W7yEL...`
- [ ] If MISMATCH: fix .clasp.json scriptId (or repoint frontend) so clasp targets the live project, before pushing
- [ ] cd ~/Projects/andysamwedding-api && clasp push
- [ ] In Manage deployments, EDIT THE EXISTING deployment -> New version -> Deploy. Do NOT run a bare `clasp deploy` (mints a new /exec URL the frontend doesn't use). Editing in place keeps the /exec URL stable.
- [ ] Smoke-test with the gate password (see plan Task 5 Step 5 for exact curl commands): POST login -> token + redirect:/home/; GUESTS -> 93 groups; PUT -> success + row in sheet
