---
# www.andysamwedding.com-etju
title: 'Functional refactor: ensureOk, pure view helpers, $ shorthand'
status: completed
type: task
priority: normal
created_at: 2026-06-22T09:44:42Z
updated_at: 2026-06-22T09:51:02Z
parent: www.andysamwedding.com-wbpd
---

Apply the 3 recommended FP refactors to the RSVP/login JS; verify flow unchanged.

## Summary of Changes

Applied the three recommended functional refactors to the login/RSVP JS.

**1. `ensureOk` (api.js):** `export const ensureOk = r => { if (r.status !== "success") throw new Error(r.message); return r }`. The login chain (`index.js`) and the rsvp PUT chain now read as pipelines — `postForm(...).then(ensureOk).then(...)` / `.then(ensureOk).catch(...)` — dropping the inline status-check arrow blocks. `getGuests` keeps its own friendlier message.

**2. Pure view helpers (rsvp/index.js):** `guestCell(i)`, `nameCell(m)`, `memberRow(m, i)` build the markup string; `renderParty` is now `$("members").innerHTML = group.members.map(memberRow).join("")`. Added `parseGuest(name)` → `{first, last}` (blank → "Guest"), which also collapsed the redundant `isGuest && !name ? "Guest" : ...` branch; the response map uses a guard clause + spread (`{...parseGuest(name), attending, isGuest}`).

**3. `$` shorthand (rsvp/index.js):** `const $ = id => document.getElementById(id)`, replacing ~12 `document.getElementById(...)` calls.

**Recommended against / skipped:** functionalizing `radio-nav.js` drag state (inherently effectful event handling — would hurt readability).

**Verification:**
- `parseGuest` proven identical to the old first/last logic across input cases (node); `ensureOk` passes success through and throws `r.message` (node).
- Full RSVP flow driven headless with a stubbed backend (fake guest list → submit name → render party): renders 2 member fieldsets + guest input + 4 radios, step-party shown, no errors. The rendered `#members` markup is **byte-identical (normalized)** to the pre-refactor output — only source-template indentation differs (collapses in render; 0.1% AA delta).
- Gate + rsvp modules load with no import/syntax/console errors; `api.js` exports `API, ensureOk, postForm`.
