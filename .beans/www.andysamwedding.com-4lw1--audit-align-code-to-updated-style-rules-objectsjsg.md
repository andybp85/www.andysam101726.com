---
# www.andysamwedding.com-4lw1
title: Audit & align code to updated style rules (objects/js/general)
status: scrapped
type: task
priority: normal
created_at: 2026-06-28T21:29:16Z
updated_at: 2026-06-28T21:48:42Z
---

User updated ~/.claude/rules (objects.md, js.md, general.md). Audit site, fix violations.

## Findings / todos
- [ ] objects.md: alphabetize object-literal properties across JS (source + tests)
- [ ] objects.md: NAV inner [label,href] tuples -> {href,label} objects (kill positional [0]/[1] access)
- [ ] js.md: prefer undefined over null (matchedGroup sentinel)
- [ ] 140-col: trim 3 decorative comment dividers in styles/nav.css
- [ ] Verify: node --test passes
- [ ] Config files (.gitignore/.claudeignore/README) — checked, already compliant
- [ ] travel/index.html long line is an unbreakable href URL — left as-is

## Reasons for Scrapping
Duplicate of www.andysamwedding.com-4zsy (created moments earlier in the same session; the create output was swallowed so a second bean was opened). All work tracked and completed under 4zsy.
