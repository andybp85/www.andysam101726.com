---
# www.andysamwedding.com-3bsp
title: 'Style pass: 4-space indent + minimal JS punctuation'
status: completed
type: task
priority: normal
created_at: 2026-06-22T02:23:54Z
updated_at: 2026-06-22T02:29:17Z
parent: www.andysamwedding.com-wbpd
---

Normalize indentation to 4 spaces project-wide; strip unnecessary semicolons/parens/braces from JS. Then assess functional-paradigm rewrites.

## Summary of Changes

**Indentation → 4 spaces:**
- `index.html` was 2-space throughout; reindented to 4 (body-level elements stay at column 0, matching the other pages).
- `home/index.html`: the `<picture>` children were 10-space; bumped to 12.
- Rest of the project was already 4-space (3/7/9/11-space lines are comment-text / multi-line value alignment, left as-is).

**Minimal JS punctuation** (codebase already had no statement semicolons and unparenthesized single-param arrows):
- `radio-nav.js`: the `if/else` assigning `deg` → a `const` ternary (dropped two brace pairs).
- `radio-math.js`: removed two purely-redundant arithmetic grouping parens (`(SWEEP * i)`, `(clamped / SWEEP)`).
- Kept parens that group a meaningful sub-quantity or are required (`(last || "").trim()`, station-center calc, `first || "Guest"` ternary alt).

**Verification:** `radio-math` outputs proven identical to the originals across the input range (node); gate + nav pages load with no JS/console errors and the knob renders; gate/home/faq render-diffs AE=0 (home's 2552px is photo-decode noise — same-file self-diff is the same 2576px).
