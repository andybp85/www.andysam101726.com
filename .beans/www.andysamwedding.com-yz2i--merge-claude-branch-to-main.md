---
# www.andysamwedding.com-yz2i
title: Integrate claude work into main (hand cherry-pick files)
status: todo
type: task
priority: normal
created_at: 2026-06-18T10:59:59Z
updated_at: 2026-06-21T17:27:58Z
parent: www.andysamwedding.com-wbpd
blocked_by:
    - www.andysamwedding.com-9vd1
    - www.andysamwedding.com-lsz4
---

Main is what is actually served, so integration is done by hand: cherry-pick the changed files from the `claude` branch over to `main` (not a git merge or PR).

## Approach
- Get the file manifest: `git diff --stat main...HEAD` (merge-base fb90ec8). ~76 files.
- Copy changed/new source + assets from `claude` → `main`.
- Apply the deletions too: `savethedate/` and `thankyou/` are removed on `claude`.
- Keep `postmodern_jukebox/` in place (legacy, do not remove).
- After copying, browser-verify on `main` before it goes live.

## Checklist
- [ ] Review `git diff --stat main...HEAD` and decide which files to bring over
- [ ] Copy source files (html/css/js) to main
- [ ] Copy new binary assets (images/, fonts/)
- [ ] Mirror deletions (savethedate/, thankyou/)
- [ ] Browser-verify on main
- [ ] Confirm live site
