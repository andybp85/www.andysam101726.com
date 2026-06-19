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
- [ ] PUT -> success + row in the NEW RSVP sheet (write path; not yet run — would leave a test row to delete)
