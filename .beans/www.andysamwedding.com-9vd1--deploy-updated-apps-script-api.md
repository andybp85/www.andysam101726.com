---
# www.andysamwedding.com-9vd1
title: Deploy updated Apps Script API
status: completed
type: task
priority: high
created_at: 2026-06-18T10:59:23Z
updated_at: 2026-06-18T10:59:23Z
parent: www.andysamwedding.com-wbpd
---

RESOLVED differently than planned: rather than redeploy the old project, a NEW standalone Apps Script Web App + NEW RSVP sheet were stood up (same Google account). The old deployment-ID mismatch is now moot. Frontend repointed to the new /exec.

New endpoint (index.js:4, rsvp/index.js:1):
`https://script.google.com/macros/s/AKfycbwfXZMR_HIAoBzBZaS6bpmgB-pNZRkrjxRn6Bq09__brkhYBJNZUaGrMnPYkYDDoqdiqQ/exec`

## GOTCHA: do NOT smoke-test Apps Script POST with `curl -L`
Apps Script POST returns a 302 to script.googleusercontent.com/macros/echo?user_content_key=...; curl's auto-follow (-L) invalidates the key -> Google's generic "Sorry, unable to open the file at this time" page (HTTP 200/405), which looks like a deploy failure but is NOT. The server execution shows `Completed` in the Apps Script Executions log. Browser `fetch` handles the redirect fine.
Test with a TWO-STEP curl instead: POST without -L, grab the `Location:` echo URL, then GET it separately:
```
LOC=$(curl -s -o /dev/null -X POST "$URL" --data-urlencode 'VERB=POST' --data-urlencode 'password=Harber' -D - | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r')
curl -s -A 'Mozilla/5.0' "$LOC"
```

Verified 2026-06-18:
- [x] POST login (password=Harber) -> {status:success, token, redirect:/home/}
- [x] GUESTS -> success, 93 groups (reads the new sheet)
- [x] PUT -> {status:success}; row appended to new RSVP sheet + email to andysam101726@gmail.com. NOTE: also sends an email on every RSVP (Code.gs:84 MailApp.sendEmail).

## Summary of Changes
New standalone Apps Script Web App + RSVP sheet (same Google account) replaced the old deployment; the planned redeploy-of-old-project path was abandoned, so the old deployment-ID mismatch is moot. Frontend index.js:4 and rsvp/index.js:1 repointed to the new /exec (commit b4b860d). All three verbs smoke-tested green via the two-step curl method (login, GUESTS=93, PUT write). Left a SMOKE-TEST / TEST / DELETE-ME row in the new RSVP sheet + one test email to delete.
