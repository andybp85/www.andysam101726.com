---
# www.andysamwedding.com-4zsy
title: Align JS to new objects.md/js.md rules
status: completed
type: task
priority: normal
created_at: 2026-06-28T21:30:49Z
updated_at: 2026-06-28T21:34:39Z
---

objects.md + js.md just added. Alphabetize object literals, convert NAV tuples to objects, undefined over null.

## Summary of Changes
Audited site against newly-added ~/.claude/rules (objects.md, js.md, general.md, css.md) + CLAUDE.md.

Fixed (objects.md alphabetization + objects-over-arrays):
- api.js, index.js, rsvp/index.js: alphabetized fetch options + API payload objects
- radio-nav.js: converted NAV [label,href] tuples to {href,label} objects (removed positional [0]/[1] access); alphabetized addEventListener options
- rsvp/index.js: undefined over null for matchedGroup sentinel (js.md)
- tests/*, playwright.config.js: alphabetized mock/option object literals

Verified already-compliant (no change needed):
- CSS: per-block property + :root custom-prop alphabetization & native nesting already done by prior cleanup beans (card.css/root.css/nav.css spot-checked)
- .gitignore/.claudeignore enforce required entries; README present
- Line length: no TRUE >140-column lines in our code (nav.css 'hits' were box-drawing byte miscounts; only vendored modern-normalize.css + an unbreakable href URL exceed, both exempt)

Verification: node --test 14/14 pass; playwright 7/7 pass.
