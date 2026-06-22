---
# www.andysamwedding.com-x3jm
title: 'DRY: shared api.js, color tokens, merge duplicate CSS blocks'
status: completed
type: task
priority: normal
created_at: 2026-06-22T02:11:46Z
updated_at: 2026-06-22T02:19:17Z
parent: www.andysamwedding.com-wbpd
---

Extract api.js (endpoint + postForm); use --ink/--dial-ink tokens; merge identical rsvp radio/checkbox + underline-input CSS. Verify screenshots.

## Summary of Changes

Three DRY passes (HTML head/guard left as-is — no build step to share it).

**Shared `api.js` (new ES module):** the Apps Script endpoint URL (was duplicated verbatim in `index.js` + `rsvp/index.js`) and a `postForm(fields)` helper (accepts a ready `FormData` or a plain object it appends; POSTs and returns parsed JSON). Replaced 4 hand-rolled `FormData`+`fetch` blocks. `index.html` now loads `index.js` as `type="module"` so it can import (`site.js` is independent, so load order is unaffected).

**Color tokens:** added `--dial-ink: #231f20` (used 7× in nav.css); `#2a1a14` → `var(--ink)` across nav/card/rsvp + the `html` background (20 literals → token).

**Merged duplicate CSS:** the byte-identical custom radio/checkbox boxes (`.member input[type=radio]` + `.guest-flag input[type=checkbox]`, incl. `:checked::after` and `:focus-visible`) into one selector group; the shared bare-underline look of `.guest-name` + `.party-pick` into one rule.

Updated `CLAUDE.md` architecture note for `api.js`.

**Verification:** headless-Chrome diffs, all ImageMagick AE=0 — gate, home, schedule, travel, faq (desktop + mobile) and a synthetic RSVP member/picker page (radios, checkbox, guest-name, party-pick). `postForm` unit-checked with a stubbed `fetch` (correct URL/method/entries for both object and FormData input). Gate + rsvp modules load with no syntax/import/console errors.
